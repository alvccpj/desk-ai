# Todo dia — dois terminais

## Terminal 1 — API

```bash
cd backend
source venv/Scripts/activate
python manage.py runserver
```

## Terminal 2 — Vite

```bash
cd frontend
npm run dev
```

---

## Login de exemplo (após `setup.ps1`)

| Perfil   | E-mail           | Senha      |
|----------|------------------|------------|
| Admin    | admin@desk.ai    | admin123   |
| Agente   | agente@desk.ai   | agente123  |

---

## Ver os dados do banco na web (desenvolvimento)

O app não expõe o arquivo do banco direto no navegador; os dados aparecem pela **API** e pelas telas do React. Para inspecionar e editar tabelas com interface web no **local**, use o **Django Admin** com o backend rodando:

**http://localhost:8000/admin**

Entre com um usuário que tenha permissão de staff/superuser no Django (por exemplo o admin do `setup.ps1` ou um usuário criado com `python manage.py createsuperuser`). Lá você vê usuários, tickets, categorias, etc., conforme estiverem registrados no `admin.py` de cada app.
