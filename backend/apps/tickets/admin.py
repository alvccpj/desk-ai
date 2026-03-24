from django.contrib import admin

from .models import Attachment, Category, Comment, Ticket


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'color', 'created_at']
    search_fields = ['name']


class CommentInline(admin.TabularInline):
    model = Comment
    extra = 0
    readonly_fields = ['author', 'created_at']
    fields = ['author', 'content', 'is_internal', 'created_at']


class AttachmentInline(admin.TabularInline):
    model = Attachment
    extra = 0
    readonly_fields = ['uploaded_by', 'uploaded_at']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'title', 'category', 'status', 'priority',
        'created_by', 'assigned_to', 'created_at',
    ]
    list_filter = ['status', 'priority', 'category']
    search_fields = ['title', 'description']
    readonly_fields = ['created_by', 'created_at', 'updated_at']
    inlines = [CommentInline, AttachmentInline]
    list_select_related = ['category', 'created_by', 'assigned_to']

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'author', 'is_internal', 'created_at']
    list_filter = ['is_internal']
    search_fields = ['content', 'author__email']
    readonly_fields = ['author', 'ticket', 'created_at']
