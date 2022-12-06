@echo off
: Check for node and npm installation
(WHERE node>nul && WHERE npm>nul) || GOTO please_run_installer

: Note that NPM will exit immediately if an error occurs.
npm run server
GOTO end

:please_run_installer
echo [ERROR] Please run install-windows.bat first!
GOTO end

:end
TIMEOUT 30