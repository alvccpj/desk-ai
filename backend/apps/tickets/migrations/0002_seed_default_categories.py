from django.db import migrations


DEFAULT_CATEGORIES = [
    (
        'Infraestrutura',
        'Rede, servidores, VPN e conectividade.',
        '#6366f1',
    ),
    (
        'Software',
        'Aplicações, instalação, licenças e bugs.',
        '#8b5cf6',
    ),
    (
        'Hardware',
        'Equipamentos físicos, periféricos e workstations.',
        '#ec4899',
    ),
    (
        'Acesso e Permissoes',
        'Contas, senhas, perfis e autorizações de sistemas.',
        '#f59e0b',
    ),
    (
        'Financeiro',
        'Faturas, reembolsos e orçamentos.',
        '#10b981',
    ),
    (
        'RH',
        'Colaboradores, benefícios e documentos trabalhistas.',
        '#3b82f6',
    ),
]


def seed_categories(apps, schema_editor):
    Category = apps.get_model('tickets', 'Category')
    for name, description, color in DEFAULT_CATEGORIES:
        Category.objects.get_or_create(
            name=name,
            defaults={'description': description, 'color': color},
        )


def unseed_categories(apps, schema_editor):
    Category = apps.get_model('tickets', 'Category')
    names = [row[0] for row in DEFAULT_CATEGORIES]
    Category.objects.filter(name__in=names).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('tickets', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_categories, unseed_categories),
    ]
