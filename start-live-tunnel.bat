@echo off
title ONLY FREELANCER - Live Cloudflare Tunnel
cd /d "%~dp0"

echo ========================================================
echo   ONLY FREELANCER // Live Cloudflare Tunnel Exposer
echo ========================================================
echo.
echo [*] Exposing http://localhost:5000 to the public web with HTTPS...
echo [*] A free secure trycloudflare.com link will appear below.
echo.

call npx.cmd -y cloudflared tunnel --url http://localhost:5000
pause
