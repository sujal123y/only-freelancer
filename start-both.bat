@echo off
title ONLY FREELANCER - Local + Live Tunnel
cd /d "%~dp0"

echo ========================================================
echo   ONLY FREELANCER // Local Server + Live Public Tunnel
echo ========================================================
echo.

if not exist "dist" (
    echo [*] Building frontend bundle...
    call npm.cmd run build
    echo.
)

echo [*] Launching both Local Server and Live HTTPS Tunnel concurrently...
echo [*] Local: http://localhost:5000
echo [*] Live:  Check the tunnel URL generated below
echo.

call npm.cmd run live
pause
