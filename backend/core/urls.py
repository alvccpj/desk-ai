from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.tickets.views import CategoryViewSet, TicketViewSet, CommentViewSet
from apps.users.views import RegisterView, MeView, UserListView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tickets', TicketViewSet, basename='ticket')

comment_list = CommentViewSet.as_view({'get': 'list', 'post': 'create'})
comment_detail = CommentViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy',
})

urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Users
    path('api/users/register/', RegisterView.as_view(), name='register'),
    path('api/users/me/', MeView.as_view(), name='me'),
    path('api/users/', UserListView.as_view(), name='user-list'),
    # Main API
    path('api/', include(router.urls)),
    # Nested comments
    path('api/tickets/<int:ticket_pk>/comments/', comment_list, name='comment-list'),
    path('api/tickets/<int:ticket_pk>/comments/<int:pk>/', comment_detail, name='comment-detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
