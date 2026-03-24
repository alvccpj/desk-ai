from django.conf import settings
from django.db import models


class Category(models.Model):
    name = models.CharField('Nome', max_length=100, unique=True)
    description = models.TextField('Descrição', blank=True)
    color = models.CharField('Cor (hex)', max_length=7, default='#6366f1')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['name']

    def __str__(self):
        return self.name


class Ticket(models.Model):
    STATUS_CHOICES = [
        ('open', 'Aberto'),
        ('in_progress', 'Em andamento'),
        ('waiting', 'Aguardando resposta'),
        ('resolved', 'Resolvido'),
        ('closed', 'Fechado'),
    ]
    PRIORITY_CHOICES = [
        ('low', 'Baixa'),
        ('medium', 'Média'),
        ('high', 'Alta'),
        ('critical', 'Crítica'),
    ]

    title = models.CharField('Título', max_length=200)
    description = models.TextField('Descrição')
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets',
        verbose_name='Categoria',
    )
    status = models.CharField(
        'Status', max_length=15, choices=STATUS_CHOICES, default='open'
    )
    priority = models.CharField(
        'Prioridade', max_length=10, choices=PRIORITY_CHOICES, default='medium'
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tickets',
        verbose_name='Criado por',
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets',
        verbose_name='Atribuído a',
    )
    ai_suggestion = models.TextField('Sugestão da IA', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Ticket'
        verbose_name_plural = 'Tickets'
        ordering = ['-created_at']

    def __str__(self):
        return f'#{self.pk} – {self.title}'


class Attachment(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='attachments',
        verbose_name='Ticket',
    )
    file = models.FileField('Arquivo', upload_to='attachments/')
    filename = models.CharField('Nome do arquivo', max_length=255)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name='Enviado por',
    )
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Anexo'
        verbose_name_plural = 'Anexos'

    def __str__(self):
        return self.filename


class Comment(models.Model):
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Ticket',
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='comments',
        verbose_name='Autor',
    )
    content = models.TextField('Conteúdo')
    is_internal = models.BooleanField(
        'Nota interna',
        default=False,
        help_text='Notas internas são visíveis apenas para agentes e admins.',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Comentário'
        verbose_name_plural = 'Comentários'
        ordering = ['created_at']

    def __str__(self):
        return f'Comentário de {self.author} em #{self.ticket_id}'
