@echo off
echo ========================================
echo Employee Management System - Quick Start
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend-nodejs
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo.

echo Step 2: Starting Backend Server...
start "Backend Server" cmd /k "npm start"
echo Backend server starting on http://localhost:8080
echo.

timeout /t 5 /nobreak >nul

echo Step 3: Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo.

echo Step 4: Starting Frontend...
start "Frontend Server" cmd /k "npm start"
echo Frontend starting on http://localhost:3000
echo.

echo ========================================
echo Both servers are starting!
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
