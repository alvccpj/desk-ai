# Desk AI – Sistema de Help Desk com Inteligência Artificial

Plataforma de gerenciamento de tickets de suporte com integração ao **Google Gemini AI** para sugestões automáticas de respostas, categorização inteligente e resumos executivos.

---

## Tecnologias

| Camada    | Stack                                              |
|-----------|----------------------------------------------------|
| Backend   | Python 3.11+, Django 4.2, Django REST Framework    |
| Auth      | JWT (SimpleJWT)                                    |
| IA        | Google Gemini 1.5 Flash                            |
| Frontend  | React 18, TypeScript, Vite, Tailwind CSS           |
| Banco     | SQLite (dev) / PostgreSQL (prod)                   |

---

## Pré-requisitos

- **Python 3.11+** – [python.org/downloads](https://www.python.org/downloads/)
- **Node.js 18+** – [nodejs.org](https://nodejs.org/)

---

## Como rodar

### 1. Backend

```powershell
cd backend

# Criar ambiente virtual
python -m venv venv
.\venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
copy .env.example .env
# Edite o .env e adicione sua GEMINI_API_KEY

# Criar as tabelas
python manage.py migrate

# Criar superusuário (admin)
python manage.py createsuperuser

# Rodar o servidor
python manage.py runserver
```

O backend estará em: **http://localhost:8000**
Admin Django: **http://localhost:8000/admin**

### 2. Frontend

```powershell
cd frontend
npm install
npm run dev
```

O frontend estará em: **http://localhost:5173**

---

## Variáveis de ambiente (backend/.env)

| Variável        | Descrição                                    |
|-----------------|----------------------------------------------|
| `SECRET_KEY`    | Chave secreta do Django                      |
| `DEBUG`         | `True` para desenvolvimento                  |
| `GEMINI_API_KEY`| Chave da API do Google Gemini (opcional)     |

Para obter uma chave do Gemini: [aistudio.google.com](https://aistudio.google.com/app/apikey)

---

## API Endpoints

### Autenticação
| Método | Endpoint                    | Descrição             |
|--------|-----------------------------|-----------------------|
| POST   | `/api/auth/token/`          | Login (JWT)           |
| POST   | `/api/auth/token/refresh/`  | Renovar token         |

### Usuários
| Método    | Endpoint                       | Descrição             |
|-----------|--------------------------------|-----------------------|
| POST      | `/api/users/register/`         | Cadastro              |
| GET/PATCH | `/api/users/me/`               | Perfil do usuário     |
| POST      | `/api/users/change-password/`  | Alterar senha         |
| GET       | `/api/users/`                  | Listar usuários       |

### Tickets
| Método | Endpoint                            | Descrição                     |
|--------|-------------------------------------|-------------------------------|
| GET    | `/api/tickets/`                     | Listar tickets                |
| POST   | `/api/tickets/`                     | Criar ticket                  |
| GET    | `/api/tickets/{id}/`                | Detalhar ticket               |
| PATCH  | `/api/tickets/{id}/`                | Atualizar ticket              |
| POST   | `/api/tickets/{id}/ai_suggest/`     | Gerar sugestão IA             |
| GET    | `/api/tickets/{id}/summarize/`      | Resumo executivo IA           |
| POST   | `/api/tickets/auto_categorize/`     | Categorização automática IA   |
| POST   | `/api/tickets/{id}/attach/`         | Anexar arquivo                |
| GET    | `/api/tickets/{id}/comments/`       | Listar comentários            |
| POST   | `/api/tickets/{id}/comments/`       | Adicionar comentário          |

### Categorias
| Método | Endpoint               | Descrição              |
|--------|------------------------|------------------------|
| GET    | `/api/categories/`     | Listar categorias      |
| POST   | `/api/categories/`     | Criar categoria        |
| PATCH  | `/api/categories/{id}/`| Editar categoria       |
| DELETE | `/api/categories/{id}/`| Remover categoria      |

---

## Perfis de usuário

| Perfil  | Permissões                                                          |
|---------|---------------------------------------------------------------------|
| `admin` | Acesso total, gerencia usuários e categorias                       |
| `agent` | Gerencia tickets, atribui status, cria notas internas, usa IA      |
| `client`| Cria e acompanha seus próprios tickets                             |

---

## Funcionalidades de IA (Gemini)

- **Sugestão de resposta**: ao criar um ticket ou manualmente, gera uma resposta profissional
- **Categorização automática**: sugere a melhor categoria com base no título e descrição
- **Resumo executivo**: resume todo o histórico do ticket em 5 linhas

> A IA é opcional. Sem `GEMINI_API_KEY`, o sistema funciona normalmente sem as funcionalidades de IA.
