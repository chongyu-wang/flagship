@echo off
REM Change to the directory where this script is located
cd /d %~dp0

REM Run the Python script to get the local IP
python get_ip.py

REM Check for errors
IF %ERRORLEVEL% NEQ 0 (
    echo Error occurred while running get_local_ip.py
    exit /b %ERRORLEVEL%
)

REM Change to the parent directory
cd ..

REM Run the Flask app
flask run

REM Check for errors
IF %ERRORLEVEL% NEQ 0 (
    echo Error occurred while running app.py
    exit /b %ERRORLEVEL%
)

REM Success message
echo Successfully started flask
