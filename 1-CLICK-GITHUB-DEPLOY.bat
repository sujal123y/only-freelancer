@echo off
setlocal enabledelayedexpansion
title ONLY FREELANCER // 1-Click GitHub Repository & Live Deploy
color 0E

echo =========================================================================
echo       ONLY FREELANCER // 1-CLICK GITHUB REPO ^& LIVE LINK CREATOR
echo =========================================================================
echo.

set PATH=C:\Users\shado\AppData\Local\Programs\bin;C:\Users\shado\AppData\Local\Programs\MinGit\cmd;%PATH%

:: 1. Check if already logged in to GitHub
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [Step 1/3] Authorizing with GitHub...
    echo A browser window will open automatically.
    echo Please confirm authorization in your browser.
    echo.
    gh auth login --web -h github.com -p https
)

:: 2. Verify authorization
gh auth status
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Authentication not completed. Please try again.
    pause
    exit /b 1
)

echo.
echo =========================================================================
echo [Step 2/3] Creating public GitHub repository 'only-freelancer'...
echo =========================================================================
gh repo create only-freelancer --public --source=. --remote=origin --push

echo.
echo =========================================================================
echo [Step 3/3] Enabling GitHub Pages Automated Live Link...
echo =========================================================================
gh api --method POST /repos/{owner}/only-freelancer/pages -f build_type=workflow >nul 2>&1

echo.
echo =========================================================================
echo [SUCCESS] Your website is now on GitHub and deploying live!
echo.
echo View Repository: https://github.com
echo View GitHub Actions: Your site is building and going live automatically!
echo =========================================================================
echo.
pause

