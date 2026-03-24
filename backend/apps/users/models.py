from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('agent', 'Agente'),
        ('client', 'Cliente'),
    ]

    email = models.EmailField(unique=True)
    name = models.CharField('Nome completo', max_length=150)
    role = models.CharField(
        'Perfil', max_length=10, choices=ROLE_CHOICES, default='client'
    )
    avatar = models.ImageField(
        'Avatar', upload_to='avatars/', null=True, blank=True
    )
    department = models.CharField('Departamento', max_length=100, blank=True)
    is_active = models.BooleanField('Ativo', default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['name']

    def __str__(self):
        return f'{self.name} <{self.email}>'

    def save(self, *args, **kwargs):
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)
