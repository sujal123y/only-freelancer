@echo off
setlocal
title ONLY FREELANCER // Auto GitHub Creator
set PATH=C:\Users\shado\AppData\Local\Programs\bin;C:\Users\shado\AppData\Local\Programs\MinGit\cmd;%PATH%

echo Creating public GitHub repository 'only-freelancer' and pushing all code...
gh repo create only-freelancer --public --source=. --remote=origin --push

echo.
echo Enabling GitHub Pages...
gh api --method POST /repos/{owner}/only-freelancer/pages -f build_type=workflow

echo.
echo Complete!
pause

