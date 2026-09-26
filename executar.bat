@echo off
chcp 65001 > nul
echo =======================================================
echo 🍔 BurguerSync Ourinhos - Servidor de Desenvolvimento
echo =======================================================
echo.
echo Iniciando servidor local na pasta /frontend...
echo.

cd frontend
start http://localhost:8000
python -m http.server 8000
