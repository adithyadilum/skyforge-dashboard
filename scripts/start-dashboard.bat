@echo off
echo Starting SkyForge Dashboard...
echo.
echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    npm install
) else (
    echo Dependencies already installed.
)

echo.
echo Starting development server...
npm run dev

pause
