@echo off
setlocal enabledelayedexpansion
title ONLY FREELANCER // Push to GitHub & Live Link Setup
color 0E

echo =========================================================================
echo       ONLY FREELANCER // GITHUB REPOSITORY ^& LIVE HOSTING WIZARD
echo =========================================================================
echo.

set PATH=%LOCALAPPDATA%\Programs\MinGit\cmd;%PATH%

git --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Git could not be located.
    pause
    exit /b 1
)

echo [1/3] Checking Git Status...
git status -s

echo.
echo [2/3] Connect to your GitHub Repository
echo -------------------------------------------------------------------------
echo 1. Go to https://github.com/new and create a new repository.
echo 2. Name it (for example: only-freelancer).
echo 3. Do NOT initialize with README, .gitignore, or license (already created).
echo 4. Copy the repository URL (e.g. https://github.com/your-name/only-freelancer.git).
echo -------------------------------------------------------------------------
echo.

set /p REPO_URL="Enter your GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo [ERROR] No URL entered. Aborting.
    pause
    exit /b 1
)

echo.
echo [3/3] Setting remote and pushing to GitHub...
git remote remove origin >nul 2>&1
git remote add origin %REPO_URL%
git branch -M main
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo =========================================================================
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo =========================================================================
    echo.
    echo To activate your permanent FREE GitHub Live Link:
    echo 1. Open your repository on GitHub.
    echo 2. Click Settings -^> Pages.
    echo 3. Under "Build and deployment", set Source to: GitHub Actions.
    echo 4. Your site will automatically go live at:
    echo    https://^<your-username^>.github.io/^<repo-name^>/
    echo =========================================================================
) else (
    echo.
    echo [NOTICE] Push encountered an issue. Check your credentials or permissions.
)

echo.
pause

