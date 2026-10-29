@echo off
title ONLY FREELANCER - Local Server
cd /d "%~dp0"

echo ========================================================
echo   ONLY FREELANCER // Local Production Server
echo ========================================================
echo.

if not exist "dist" (
    echo [*] Compiled frontend not found. Building with Vite...
    call npm.cmd run build
    echo.
)

echo [*] Starting ONLY FREELANCER on http://localhost:5000 ...
echo [*] Press Ctrl+C at any time to stop the server.
echo.

node server/index.js
pause
