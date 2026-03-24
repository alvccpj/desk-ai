# Desk AI – Sistema de Help Desk com Inteligência Artificial

Sistema de gerenciamento de tickets de suporte com integração ao **Google Gemini AI**.

---

## Tecnologias

| Camada   | Stack                                           |
|----------|-------------------------------------------------|
| Backend  | Python 3.11+, Django 4.2, Django REST Framework |
| Auth     | JWT (SimpleJWT)                                 |
| IA       | Google Gemini 1.5 Flash                         |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS        |
| Banco    | SQLite (desenvolvimento)                        |

---

## Pré-requisitos

Antes de começar, instale:

- **Python 3.11+** → https://python.org/downloads  
  ⚠️ Durante a instalação, marque a opção **"Add Python to PATH"**
- **Node.js 18+** → https://nodejs.org

---

## Como rodar (primeira vez)

Você vai precisar de **dois terminais abertos ao mesmo tempo**: um para o backend e outro para o frontend.

---

### Terminal 1 — Backend

#### PowerShell

```powershell
# Entrar na pasta do backend
cd "c:\Users\Alvinho\Desktop\UNINASSAU\2026.1\CÓDIGOS DE ALTA PERFOMANCE WEB\desk-ai\backend"

# Criar o ambiente virtual
python -m venv venv

# Ativar o ambiente virtual
.\venv\Scripts\Activate.ps1

# Instalar as dependências
pip install -r requirements.txt

# Criar os arquivos de migração
python manage.py makemigrations users
python manage.py makemigrations tickets

# Criar as tabelas no banco de dados
python manage.py migrate

# Criar o usuário administrador
python manage.py createsuperuser

# Iniciar o servidor
python manage.py runserver
```

#### Git Bash

```bash
# Entrar na pasta do backend
cd "c:/Users/Alvinho/Desktop/UNINASSAU/2026.1/CÓDIGOS DE ALTA PERFOMANCE WEB/desk-ai/backend"

# Criar o ambiente virtual
python -m venv venv

# Ativar o ambiente virtual
source venv/Scripts/activate

# Instalar as dependências
pip install -r requirements.txt

# Criar os arquivos de migração
python manage.py makemigrations users
python manage.py makemigrations tickets

# Criar as tabelas no banco de dados
python manage.py migrate

# Criar o usuário administrador
python manage.py createsuperuser

# Iniciar o servidor
python manage.py runserver
```

O backend estará rodando em: **http://localhost:8000**

---

### Terminal 2 — Frontend

#### PowerShell ou Git Bash (mesmo comando)

```bash
# Entrar na pasta do frontend
cd "c:/Users/Alvinho/Desktop/UNINASSAU/2026.1/CÓDIGOS DE ALTA PERFOMANCE WEB/desk-ai/frontend"

# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

---

## Acessando o sistema

Abra o navegador e acesse:

| O que acessar        | Endereço                       |
|----------------------|--------------------------------|
| Interface principal  | http://localhost:5173          |
| Painel admin Django  | http://localhost:8000/admin    |

> As duas partes precisam estar rodando ao mesmo tempo.

---

## Como rodar (depois da primeira vez)

Na segunda vez em diante, não precisa mais criar o venv, instalar dependências nem rodar migrações. Só ativar e subir os servidores.

#### PowerShell

```powershell
# Terminal 1 — Backend
cd "...desk-ai\backend"
.\venv\Scripts\Activate.ps1
python manage.py runserver

# Terminal 2 — Frontend
cd "...desk-ai\frontend"
npm run dev
```

#### Git Bash

```bash
# Terminal 1 — Backend
cd ".../desk-ai/backend"
source venv/Scripts/activate
python manage.py runserver

# Terminal 2 — Frontend
cd ".../desk-ai/frontend"
npm run dev
```

---

## Variáveis de ambiente

### Backend (`backend/.env`)

```env
SECRET_KEY=django-insecure-dev-key-mude-isso-em-producao
DEBUG=True
GEMINI_API_KEY=           # opcional — obtenha em aistudio.google.com/app/apikey
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:8000
```

---

## Ordem correta dos comandos (resumo)

> ⚠️ Errar a ordem causa problemas no banco de dados.

```
1. makemigrations users
2. makemigrations tickets
3. migrate
4. createsuperuser
5. runserver
```

Se o banco travar ou apresentar erro de migração inconsistente, apague o arquivo `db.sqlite3` e repita a sequência do passo 1.

#### PowerShell
```powershell
Remove-Item db.sqlite3
```

#### Git Bash
```bash
rm db.sqlite3
```

---

## Perfis de usuário

| Perfil   | Permissões                                                    |
|----------|---------------------------------------------------------------|
| `admin`  | Acesso total, gerencia usuários e categorias                  |
| `agent`  | Gerencia tickets, adiciona notas internas, usa a IA           |
| `client` | Cria e acompanha apenas os próprios tickets                   |

---

## Funcionalidades de IA (Google Gemini)

As funcionalidades de IA são **opcionais**. Sem a `GEMINI_API_KEY` o sistema funciona normalmente, apenas sem os recursos de IA.

| Funcionalidade           | Descrição                                              |
|--------------------------|--------------------------------------------------------|
| Sugestão de resposta     | Gera uma resposta profissional ao abrir um ticket      |
| Categorização automática | Sugere a categoria ideal com base no título e descrição|
| Resumo executivo         | Resume todo o histórico do ticket em até 5 linhas      |
