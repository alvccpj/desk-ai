from rest_framework import serializers

from apps.users.models import User
from apps.users.serializers import UserSerializer

from .models import Attachment, Category, Comment, Ticket


class CategorySerializer(serializers.ModelSerializer):
    ticket_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'color', 'ticket_count', 'created_at']

    def get_ticket_count(self, obj):
        return obj.tickets.count()


class AttachmentSerializer(serializers.ModelSerializer):
    uploaded_by = UserSerializer(read_only=True)

    class Meta:
        model = Attachment
        fields = ['id', 'file', 'filename', 'uploaded_by', 'uploaded_at']


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'author', 'content', 'is_internal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'author', 'ticket', 'created_at', 'updated_at']

    def validate(self, attrs):
        request = self.context.get('request')
        if attrs.get('is_internal') and request:
            if request.user.role not in ('admin', 'agent'):
                raise serializers.ValidationError(
                    {'is_internal': 'Apenas agentes e admins podem criar notas internas.'}
                )
        return attrs


class TicketListSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'category', 'category_id',
            'status', 'priority', 'created_by', 'assigned_to',
            'comment_count', 'created_at', 'updated_at',
        ]

    def get_comment_count(self, obj):
        return obj.comments.count()


class TicketDetailSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source='assigned_to',
        queryset=User.objects.filter(role__in=['admin', 'agent']),
        write_only=True,
        required=False,
        allow_null=True,
    )
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True
    )
    comments = serializers.SerializerMethodField()
    attachments = AttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'category', 'category_id',
            'status', 'priority', 'created_by', 'assigned_to', 'assigned_to_id',
            'ai_suggestion', 'attachments', 'comments', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'ai_suggestion', 'created_at', 'updated_at']

    def get_comments(self, obj):
        request = self.context.get('request')
        qs = obj.comments.all()
        if request and request.user.role not in ('admin', 'agent'):
            qs = qs.filter(is_internal=False)
        return CommentSerializer(qs, many=True, context=self.context).data

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
