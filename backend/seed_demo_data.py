"""
Cria/atualiza contas de demonstração e categorias (UTF-8).
Chamado pelo setup.ps1; pode correr à mão após migrar:
  cd backend && .\\venv\\Scripts\\Activate.ps1 && python seed_demo_data.py
"""
import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from apps.tickets.models import Category  # noqa: E402
from apps.users.models import User  # noqa: E402

# Mesmas senhas que Login.tsx e COMO-RODAR (evitar inline no PowerShell).
ADMIN_PW = ";uyi:^I139\u00a35"
AGENT_PW = "bA.3m-231FN\\"

if not User.objects.filter(email="admin@desk.ai").exists():
    User.objects.create_superuser(
        email="admin@desk.ai",
        username="admin",
        password=ADMIN_PW,
        name="Administrador",
        role="admin",
    )
    print("Admin criado: admin@desk.ai / " + ADMIN_PW)
else:
    a = User.objects.get(email="admin@desk.ai")
    a.is_staff = True
    a.is_superuser = True
    a.role = "admin"
    a.is_active = True
    a.set_password(ADMIN_PW)
    a.save()
    print("Admin atualizado: admin@desk.ai / " + ADMIN_PW)

u, created = User.objects.update_or_create(
    email="agente@desk.ai",
    defaults={
        "username": "agente",
        "name": "Agente Teste",
        "role": "agent",
        "department": "Suporte",
        "is_staff": False,
        "is_superuser": False,
        "is_active": True,
    },
)
u.set_password(AGENT_PW)
u.save()
print(
    ("Agente criado" if created else "Agente atualizado")
    + ": agente@desk.ai / "
    + AGENT_PW
)

cats = [
    "Infraestrutura",
    "Software",
    "Hardware",
    "Acesso e Permissoes",
    "Financeiro",
    "RH",
]
for c in cats:
    Category.objects.get_or_create(name=c)
print(f"{len(cats)} categorias criadas")
