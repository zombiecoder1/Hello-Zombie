@echo off
title ZombieCoder Agent - Real-time Monitoring
color 0A

echo.
echo ================================================================
echo                    ZombieCoder Agent
echo                "যেখানে কোড ও কথা বলে"
echo                                                              
echo  Owner: Sahon Srabon                                        
echo  Company: Developer Zone                                     
echo  Contact: +880 1323-626282                                   
echo  Website: https://zombiecoder.my.id/                         
echo ================================================================
echo.

echo [INFO] Starting ZombieCoder Services with Real-time Monitoring...
echo [INFO] Setting up optimized environment...

REM ========================================
REM 1. SET ENVIRONMENT VARIABLES
REM ========================================
echo [1/7] Setting Ollama optimization variables...
set OLLAMA_MAX_LOADED_MODELS=1
set OLLAMA_NUM_PARALLEL=1
set OLLAMA_AUTO_CLEAN_MEMORY=true
set OLLAMA_LAZY_LOAD=true
set OLLAMA_MEMORY_LIMIT=2GB
echo [OK] Environment variables set successfully

REM ========================================
REM 2. CHECK DEPENDENCIES
REM ========================================
echo [2/7] Checking system dependencies...
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Ollama not found! Please install Ollama first.
    pause
    exit /b 1
)
echo [OK] Ollama found

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.8+ first.
    pause
    exit /b 1
)
echo [OK] Python found

REM ========================================
REM 3. CREATE NECESSARY DIRECTORIES
REM ========================================
echo [3/7] Creating necessary directories...
if not exist "data" mkdir data
if not exist "data\memory" mkdir data\memory
if not exist "logs" mkdir logs
if not exist "config" mkdir config
if not exist "config\agents" mkdir config\agents
echo [OK] Directories created

REM ========================================
REM 4. START OLLAMA SERVER (Background)
REM ========================================
echo [4/7] Starting Ollama Server...
echo [INFO] Starting Ollama with optimization settings...
start /B ollama serve > logs/ollama.log 2>&1
echo [INFO] Waiting for Ollama to initialize...
timeout /t 8 /nobreak >nul

REM Check if Ollama is running
:check_ollama
curl -s http://localhost:11434/api/tags >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Ollama starting... please wait
    timeout /t 3 /nobreak >nul
    goto check_ollama
)
echo [OK] Ollama Server started successfully

REM ========================================
REM 5. START ZOMBIECODER MAIN SERVER (Background)
REM ========================================
echo [5/7] Starting ZombieCoder Main Server...
echo [INFO] Starting FastAPI server with meta memory injection...
start /B python main_server.py > logs/main_server.log 2>&1
echo [INFO] Waiting for main server to initialize...
timeout /t 5 /nobreak >nul

REM Check if main server is running
:check_main_server
curl -s http://localhost:12346/health >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Main server starting... please wait
    timeout /t 3 /nobreak >nul
    goto check_main_server
)
echo [OK] ZombieCoder Main Server started successfully

REM ========================================
REM 6. OPEN DASHBOARD
REM ========================================
echo [6/7] Opening ZombieCoder Dashboard...
echo [INFO] Launching web dashboard...
timeout /t 2 /nobreak >nul
start "" "index.html"
echo [OK] Dashboard opened in browser

REM ========================================
REM 7. REAL-TIME MONITORING SETUP
REM ========================================
echo [7/7] Setting up real-time monitoring...
echo [OK] Real-time monitoring ready

REM ========================================
REM SUCCESS MESSAGE
REM ========================================
echo.
echo ================================================================
echo                    ZombieCoder Ready!
echo ================================================================
echo.
echo [SUCCESS] All ZombieCoder services started successfully!
echo.
echo Service Status:
echo    - Ollama Server:      http://localhost:11434
echo    - Main Server:        http://localhost:12346  
echo    - Dashboard:          http://localhost:12346 (Auto-opened)
echo    - Agent Memory:       data/memory/hello_zombie_memory.sqlite
echo.
echo ZombieCoder Agent is ready to assist you!
echo Chat with your AI assistant in the dashboard
echo Real-time conversation logs will appear below
echo Press Ctrl+C to stop all services
echo.
echo ================================================================
echo              REAL-TIME CONVERSATION MONITOR
echo ================================================================
echo.

REM ========================================
REM REAL-TIME LOG MONITORING LOOP
REM ========================================
:monitor_loop
echo [%time%] ZombieCoder Agent Ready - Monitoring conversations...
echo [INFO] Waiting for chat activity... (Use dashboard to chat)
echo.

REM Simple monitoring loop
:log_monitor
timeout /t 5 /nobreak >nul

REM Check server health
curl -s http://localhost:12346/health >nul 2>nul
if %errorlevel% equ 0 (
    echo [%time%] Server Health: OK
) else (
    echo [%time%] Server Health: DOWN
)

REM Show recent log entries if available
if exist "logs\main_server.log" (
    echo [INFO] Recent activity from main server:
    powershell -Command "Get-Content logs\main_server.log -Tail 3"
    echo.
)

echo [INFO] Waiting for next activity... (Press Ctrl+C to stop)
echo.
goto log_monitor

REM ========================================
REM CLEANUP ON EXIT
REM ========================================
:cleanup
echo.
echo [INFO] Stopping ZombieCoder services...
taskkill /F /IM python.exe >nul 2>nul
taskkill /F /IM ollama.exe >nul 2>nul
echo [INFO] All services stopped. Goodbye!
pause
exit /b 0