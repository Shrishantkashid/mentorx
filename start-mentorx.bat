@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

echo ===================================================
echo   MentorX - Starting Fullstack Development Environment
echo ===================================================

:: Verify directories
if not exist "backend\" (
    echo [ERROR] Backend directory not found in %PROJECT_ROOT%
    pause
    exit /b 1
)

:: Start Backend
echo [*] Starting Backend (Port 5000)...
start "MentorX Backend" cmd /k "cd /d %PROJECT_ROOT%\backend && npm run dev"

:: Wait a moment for backend to initialize
timeout /t 3 /nobreak > nul

:: Start Frontend
echo [*] Starting Frontend (Development Client)...
echo [*] Ensure you have built the native client (npm run android/ios) before starting.
start "MentorX Mobile" cmd /k "cd /d %PROJECT_ROOT% && npx expo start --dev-client"

echo ===================================================
echo   Backend and Frontend are starting in separate windows.
echo   Happy coding!
echo ===================================================
pause
