@echo off
REM Store the current directory
set CURRENT_DIR=%cd%

REM Open a new terminal for the client script
echo Opening a new terminal for the client script...
start cmd /k "cd /d %CURRENT_DIR%\client\scripts && call run_client.bat"

REM Open a new terminal for the server script and activate the virtual environment
echo Opening a new terminal for the server script...
start cmd /k "cd /d %CURRENT_DIR%\venv\Scripts && call activate && cd /d %CURRENT_DIR%\server\scripts && call run_server.bat"

REM Success message
echo Successfully started both client and server scripts in new terminals


