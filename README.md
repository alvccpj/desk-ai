# Desk AI – Sistema de Help Desk com Inteligência Artificial

Sistema de gerenciamento de tickets de suporte com integração ao **Google Gemini AI**.

Este repositório é um **projeto acadêmico** da disciplina **Códigos de Alta Performance Web** (UNINASSAU).

---

## Tecnologias

| Camada   | Stack |
|----------|-------|
| Backend  | Python 3.12+ (recomendado para Django 6), **Django 6.x**, **Django REST Framework 3.14+**, django-cors-headers 4.3+, Pillow 10.2+ |
| Auth     | JWT (**djangorestframework-simplejwt** 5.3+) |
| IA       | **Google Gemini** via `google-generativeai` (modelo configurável na API) |
| Frontend | **React 19**, **TypeScript ~5.9**, **Vite 8**, **Tailwind CSS 3.4**, **TanStack Query 5**, React Router 7, Axios, date-fns 4, Lucide React |
| Banco    | SQLite (desenvolvimento) |

---

## Perfis de usuário

| Perfil   | Permissões                                                  |
|----------|-------------------------------------------------------------|
| `admin`  | Acesso total, gerencia usuários e categorias                |
| `agent`  | Gerencia tickets, adiciona notas internas, usa a IA         |
| `client` | Cria e acompanha apenas os próprios tickets                 |

---

## Funcionalidades de IA (Google Gemini)

As funcionalidades de IA são **opcionais**. Sem a `GEMINI_API_KEY` o sistema funciona normalmente, apenas sem os recursos de IA.

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
