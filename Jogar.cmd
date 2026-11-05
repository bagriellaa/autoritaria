@echo off
cd /d "%~dp0"
if exist "release\Autoritaria\Autoritaria.exe" (
  start "Autoritaria" "release\Autoritaria\Autoritaria.exe"
  exit /b 0
)
if not exist "node_modules\electron\dist\electron.exe" (
  echo As dependencias ainda nao estao instaladas. Execute npm install primeiro.
  pause
  exit /b 1
)
if not exist "dist\index.html" (
  call npm run build
  if errorlevel 1 (
    pause
    exit /b 1
  )
)
start "Autoritaria" "node_modules\electron\dist\electron.exe" "."
