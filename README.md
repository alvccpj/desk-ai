# Desk AI – Sistema de Help Desk com Inteligência Artificial

**Projeto acadêmico** (UNINASSAU — Códigos de Alta Performance Web): help desk com front **React (Vite)** e API **Django REST**; autenticação **JWT**. Opcionalmente **Google Gemini** — detalhes na seção [Funcionalidades de IA](#funcionalidades-de-ia-google-gemini).

---

## Como o projeto funciona

1. **Frontend** — login, dashboard, tickets, comentários e telas conforme o **perfil** do usuário (tabela **Perfis de usuário** mais abaixo).
2. **Backend** — expõe `/api/...`; o navegador **não** acessa o arquivo do banco diretamente.

Para **rodar localmente**, credenciais de exemplo e **Django Admin** (dados no browser em desenvolvimento): **[COMO-RODAR.md](./COMO-RODAR.md)**.

---

## Hospedagem

| Parte      | Plataforma | Observação |
|------------|------------|------------|
| **Backend** | [**Render**](https://render.com) | Serviço web Python (Gunicorn), API Django exposta em URL pública. Banco **PostgreSQL** no Render via `DATABASE_URL`. |
| **Frontend** | [**Vercel**](https://vercel.com) | Build estático do Vite; variável **`VITE_API_URL`** deve apontar para a URL base da API no Render (sem depender de `localhost`). |

No Django, configure **`CORS_ALLOWED_ORIGINS`** e **`CSRF_TRUSTED_ORIGINS`** com o domínio do app no Vercel e o da API no Render, conforme `backend/.env.example`. O arquivo **`render.yaml`** na raiz descreve um blueprint exemplo (API + Postgres).

---

## Tecnologias

| Camada   | Stack |
|----------|-------|
| Backend  | Python 3.12+ (recomendado para Django 6), **Django 6.x**, **Django REST Framework 3.14+**, django-cors-headers 4.3+, Pillow 10.2+ |
| Auth     | JWT (**djangorestframework-simplejwt** 5.3+) |
| IA       | **Google Gemini** via `google-generativeai` (modelo configurável na API) |
| Frontend | **React 19**, **TypeScript ~5.9**, **Vite 8**, **Tailwind CSS 3.4**, **TanStack Query 5**, React Router 7, Axios, date-fns 4, Lucide React |
| Banco    | **SQLite** (desenvolvimento local); **PostgreSQL** no Render quando `DATABASE_URL` está definida |

---

## Perfis de usuário

| Perfil   | Permissões                                                  |
|----------|-------------------------------------------------------------|
| `admin`  | Acesso total, gerencia usuários e categorias                |
| `agent`  | Gerencia tickets, adiciona notas internas, usa a IA         |
| `client` | Cria e acompanha apenas os próprios tickets                 |

---

## Funcionalidades de IA (Google Gemini)

Exigem `GEMINI_API_KEY` no `.env` do backend; sem a chave, o resto do sistema funciona, só sem estes recursos:

| Funcionalidade           | Descrição                                               |
|--------------------------|---------------------------------------------------------|
| Sugestão de resposta     | Gera uma resposta profissional ao abrir um ticket       |
| Categorização automática | Sugere a categoria ideal com base no título e descrição |
| Resumo executivo         | Resume todo o histórico do ticket em até 5 linhas       |

---

## Arquitetura de pastas

```
desk-ai/
├── backend/
│   ├── apps/
│   │   ├── tickets/
│   │   │   ├── admin.py          # Registro no Django Admin
│   │   │   ├── ai_service.py     # Integração com Google Gemini
│   │   │   ├── models.py         # Ticket, Category, Comment, Attachment
│   │   │   ├── serializers.py    # Serialização para a API REST
│   │   │   └── views.py          # Endpoints da API
│   │   └── users/
│   │       ├── admin.py          # Registro no Django Admin
│   │       ├── models.py         # Model de usuário customizado
│   │       ├── serializers.py    # Serialização para a API REST
│   │       └── views.py          # Endpoints de autenticação e perfil
│   ├── core/
│   │   ├── settings.py           # Configurações do Django
│   │   └── urls.py               # Roteamento principal
│   ├── manage.py
│   ├── requirements.txt
│   └── .env                      # Variáveis de ambiente (não versionado)
│
└── frontend/
    └── src/
        ├── api/
        │   ├── auth.ts           # Chamadas de autenticação
        │   ├── client.ts         # Instância Axios configurada
        │   └── tickets.ts        # Chamadas de tickets
        ├── components/
        │   ├── Avatar.tsx
        │   ├── Layout.tsx
        │   ├── PriorityBadge.tsx
        │   ├── Sidebar.tsx
        │   ├── Spinner.tsx
        │   └── StatusBadge.tsx
        ├── contexts/
        │   └── AuthContext.tsx    # Contexto global de autenticação
        ├── pages/
        │   ├── AdminCategories.tsx
        │   ├── AdminUsers.tsx
        │   ├── CreateTicket.tsx
        │   ├── Dashboard.tsx
        │   ├── Login.tsx
        │   ├── Register.tsx
        │   ├── Settings.tsx
        │   ├── TicketDetail.tsx
        │   └── TicketList.tsx
        ├── App.tsx
        └── main.tsx
```

---

Obrigado por dar uma olhada no projeto. Se algo não ficar claro ou você quiser sugerir melhorias, fique à vontade para abrir uma issue ou contribuir.
