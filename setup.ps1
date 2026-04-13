# Script de setup do Desk AI
Write-Host "=== Desk AI - Setup ===" -ForegroundColor Cyan

# Backend
Write-Host "`n[1/5] Criando ambiente virtual Python..." -ForegroundColor Yellow
Set-Location backend
python -m venv venv
if ($LASTEXITCODE -ne 0) { Write-Host "ERRO: Python nao encontrado. Instale em https://python.org" -ForegroundColor Red; exit 1 }

Write-Host "[2/5] Ativando venv e instalando dependencias..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

Write-Host "[3/5] Rodando migracoes..." -ForegroundColor Yellow
python manage.py migrate

Write-Host "[4/5] Criando dados de exemplo..." -ForegroundColor Yellow
python seed_demo_data.py

Set-Location ..

# Frontend
Write-Host "[5/5] Instalando dependencias do frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

Write-Host "`n=== Setup concluido! ===" -ForegroundColor Green
Write-Host "Para iniciar:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend; .\venv\Scripts\Activate.ps1; python manage.py runserver" -ForegroundColor White
Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "`nAdmin: http://localhost:8000/admin  (admin@desk.ai / ver senha no COMO-RODAR.md ou Login)" -ForegroundColor Yellow
Write-Host "App:   http://localhost:5173" -ForegroundColor Yellow
