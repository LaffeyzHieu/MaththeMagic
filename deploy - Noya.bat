@echo off
setlocal

:: ===== Timestamp =====
for /f "delims=" %%i in ('powershell -NoProfile -Command "(Get-Date).ToString(\"HH'h'mm _ dd-MM-yyyy\")"') do set "datetime=%%i"


:: ===== Paths =====
set "source=C:\Users\ASUS\OneDrive\Documents\MathemagicASM\mathemagic\src\pages"
set "backup=C:\Users\ASUS\OneDrive\Documents\MathemagicASM\@BACKUP"

set "snapshot=%backup%\%datetime%\pages"

:: ===== Create backup folder =====
mkdir "%snapshot%"
:: ===== Backup pages =====
robocopy "%source%" "%snapshot%" /E /R:1 /W:1

echo.
echo ==============================
echo Backup completed
echo %backup%
echo ==============================
echo.

cd /d "C:\Users\ASUS\OneDrive\Documents\MathemagicASM\mathemagic"
call npm run build
 
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build that bai. Xem loi o tren.
    pause
    exit /b 1
)


echo [DEPLOY] Deploying to Firebase...
cd /d "C:\Users\ASUS\OneDrive\Documents\MathemagicASM"
call firebase deploy
 
if %ERRORLEVEL% equ 0 (
    echo [OK] Deploy xong. jvmelaffeyz.web.app
) else (
    echo [ERROR] Deploy that bai. Kiem tra firebase login chua.
)

echo Dang thoat...
timeout /t 3 >nul
exit