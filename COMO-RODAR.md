# Todo dia — dois terminais

## Primeira vez (Git Bash)

**Antes:** instala o **Python** a partir de [python.org](https://www.python.org) e confirma no terminal com `python --version`. O `python` tem de estar no PATH; sem isso não dá para criar o `venv` nem instalar dependências. Para o segundo terminal (Vite), precisas também de **Node.js** com `npm` instalado.

O `source venv/Scripts/activate` só funciona depois de existir a pasta `backend/venv`. Na primeira vez, a partir da raiz do repositório:

```bash
cd backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
python manage.py migrate
python seed_demo_data.py
cd ../frontend
npm install
cd ..
```

| Comando | O que faz |
|--------|------------|
| `cd backend` | Entra na pasta do projeto Django (API). |
| `python -m venv venv` | Cria o ambiente virtual Python na pasta `backend/venv` (isolamento de dependências). |
| `source venv/Scripts/activate` | Ativa esse ambiente no Git Bash; depois, `python` e `pip` usam o venv, não o Python do sistema. |
| `pip install -r requirements.txt` | Instala as bibliotecas listadas (Django, DRF, etc.) dentro do venv. |
| `python manage.py migrate` | Cria ou atualiza as tabelas no ficheiro da base de dados (SQLite em desenvolvimento) de acordo com os modelos Django. |
| `python seed_demo_data.py` | Insere dados iniciais de demonstração (utilizadores de teste, categorias, etc.). |
| `cd ../frontend` | Sai do `backend` e entra na pasta do React (frontend). |
| `npm install` | Descarrega e instala as dependências do Node definidas no `package.json` (Vite, React, etc.). |
| `cd ..` | Volta à raiz do repositório (local habitual para abrir ficheiros ou abrir outro terminal). |

Depois podes seguir a secção “Todo dia” abaixo.

---

## Terminal 1 — API

```bash
cd backend
source venv/Scripts/activate
python manage.py runserver
```

| Comando | O que faz |
|--------|------------|
| `cd backend` | Entra na pasta da API. |
| `source venv/Scripts/activate` | Ativa o venv (necessário em cada terminal novo antes de correr o Django com as dependências certas). |
| `python manage.py runserver` | Sobe o servidor de desenvolvimento do Django, em geral em `http://127.0.0.1:8000`. |

## Terminal 2 — Vite

```bash
cd frontend
npm run dev
```

| Comando | O que faz |
|--------|------------|
| `cd frontend` | Entra na pasta do React. |
| `npm run dev` | Inicia o Vite em modo desenvolvimento (recompila ao editar; URL típica `http://127.0.0.1:5173` ou a que o terminal mostrar). |

---

## Login de exemplo (após `seed_demo_data.py`)

| Perfil   | E-mail           | Senha              |
|----------|------------------|--------------------|
| Admin    | admin@desk.ai    | `;uyi:^I139£5`     |
| Agente   | agente@desk.ai   | `bA.3m-231FN\`     |

Se precisares de repor estas contas e senhas no banco, corre de novo o **`python seed_demo_data.py`** (com o `venv` ativado) ou o **`setup.ps1`** na raiz do projeto.

---

## Ver os dados do banco na web (desenvolvimento)

O app não expõe o arquivo do banco direto no navegador; os dados aparecem pela **API** e pelas telas do React. Para inspecionar e editar tabelas com interface web no **local**, use o **Django Admin** com o backend rodando:

**http://localhost:8000/admin**

Entre com um usuário que tenha permissão de staff/superuser no Django (por exemplo o `admin@desk.ai` do seed ou um usuário criado com `python manage.py createsuperuser`). Lá você vê usuários, tickets, categorias, etc., conforme estiverem registrados no `admin.py` de cada app.
