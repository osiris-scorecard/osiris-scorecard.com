@echo off
REM OSIRIS Update and Push
REM Run this after importing new scorecards

cd /d "%~dp0\.."

echo Checking for changes in accounts.json...

git diff --quiet data/accounts.json
if %errorlevel% == 0 (
  echo No changes detected in accounts.json
  exit /b 0
)

echo.
echo Changes detected!
git diff --stat data/accounts.json

echo.
echo Committing changes...
git add data/accounts.json
git commit -m "Update scorecards"

echo.
echo Pushing to GitHub...
git push

echo.
echo Done! Scorecards updated on GitHub
