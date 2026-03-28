from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .ai_service import auto_categorize_ticket, suggest_ticket_response, summarize_ticket
from .models import Attachment, Category, Comment, Ticket
from .serializers import (
    AttachmentSerializer,
    CategorySerializer,
    CommentSerializer,
    TicketDetailSerializer,
    TicketListSerializer,
)


class IsAdminOrAgent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ('admin', 'agent')


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAdminOrAgent()]
        return [permissions.IsAuthenticated()]


class TicketViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ('retrieve', 'create', 'update', 'partial_update'):
            return TicketDetailSerializer
        return TicketListSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Ticket.objects.select_related(
            'category', 'created_by', 'assigned_to'
        ).prefetch_related('comments', 'attachments')

        if user.role == 'client':
            qs = qs.filter(created_by=user)
        elif user.role == 'agent':
            qs = qs.filter(assigned_to=user) | qs.filter(created_by=user)

        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)

        priority_filter = self.request.query_params.get('priority')
        if priority_filter:
            qs = qs.filter(priority=priority_filter)

        category_filter = self.request.query_params.get('category')
        if category_filter:
            qs = qs.filter(category_id=category_filter)

        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(
                description__icontains=search
            )

        assigned = self.request.query_params.get('assigned_to')
        if assigned:
            qs = qs.filter(assigned_to_id=assigned)

        return qs.distinct()

    def perform_create(self, serializer):
        ticket = serializer.save(created_by=self.request.user)
        suggestion = suggest_ticket_response(ticket)
        if suggestion:
            ticket.ai_suggestion = suggestion
            ticket.save(update_fields=['ai_suggestion'])

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        if request.user.role == 'client':
            allowed_fields = {'title', 'description', 'category_id', 'priority'}
            invalid = set(request.data.keys()) - allowed_fields
            if invalid:
                raise serializers.ValidationError(
                    {'detail': f'Campos não permitidos: {", ".join(invalid)}'}
                )

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrAgent])
    def ai_suggest(self, request, pk=None):
        ticket = self.get_object()
        suggestion = suggest_ticket_response(ticket)
        if suggestion:
            ticket.ai_suggestion = suggestion
            ticket.save(update_fields=['ai_suggestion'])
            return Response({'suggestion': suggestion})
        return Response(
            {'detail': 'IA não disponível no momento.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    @action(detail=True, methods=['get'], permission_classes=[IsAdminOrAgent])
    def summarize(self, request, pk=None):
        ticket = self.get_object()
        summary = summarize_ticket(ticket)
        if summary:
            return Response({'summary': summary})
        return Response(
            {'detail': 'IA não disponível no momento.'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    @action(detail=False, methods=['post'], permission_classes=[IsAdminOrAgent])
    def auto_categorize(self, request):
        title = request.data.get('title', '')
        description = request.data.get('description', '')
        categories = list(Category.objects.values('name', 'description'))
        suggestion = auto_categorize_ticket(title, description, categories)
        return Response({'category': suggestion})

    @action(detail=True, methods=['post'])
    def attach(self, request, pk=None):
        ticket = self.get_object()
        if request.user.role == 'client' and ticket.created_by != request.user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        file = request.FILES.get('file')
        if not file:
            return Response({'detail': 'Nenhum arquivo enviado.'}, status=400)

        attachment = Attachment.objects.create(
            ticket=ticket,
            file=file,
            filename=file.name,
            uploaded_by=request.user,
        )
        return Response(
            AttachmentSerializer(attachment).data,
            status=status.HTTP_201_CREATED,
        )


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        ticket_pk = self.kwargs.get('ticket_pk')
        user = self.request.user
        qs = Comment.objects.filter(ticket_id=ticket_pk).select_related('author')
        if user.role not in ('admin', 'agent'):
            qs = qs.filter(is_internal=False)
        return qs

    def perform_create(self, serializer):
        ticket_pk = self.kwargs.get('ticket_pk')
        ticket = Ticket.objects.get(pk=ticket_pk)

        if self.request.user.role == 'client' and ticket.created_by != self.request.user:
            raise serializers.ValidationError(
                {'detail': 'Você não tem permissão para comentar neste ticket.'}
            )

        comment = serializer.save(
            author=self.request.user,
            ticket=ticket,
        )

        if ticket.status == 'open' and self.request.user.role in ('admin', 'agent'):
            ticket.status = 'in_progress'
            ticket.save(update_fields=['status'])

        return comment
