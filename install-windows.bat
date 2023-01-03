@echo off
: Check for node and npm installation
WHERE node>nul || GOTO install_nodejs
WHERE npm>nul || GOTO install_npm

node autom/installer.js

GOTO end_succ

:install_nodejs
echo [ERROR] NODE.JS NOT FOUND. Please install it: https://nodejs.org/en/
GOTO end_err

:install_npm
echo [ERROR] NPM NOT FOUND. Please install it.
GOTO end_err

:end_err
PAUSE
GOTO end

:end_succ
TIMEOUT 15
GOTO end

:end