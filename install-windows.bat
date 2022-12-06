@echo off
: Check for node and npm installation
WHERE node>nul || GOTO install_nodejs
WHERE npm>nul || GOTO install_npm

node autom/installer.js

GOTO end

:install_nodejs
echo [ERROR] NODE.JS NOT FOUND. Please install it: https://nodejs.org/en/
GOTO end

:install_npm
echo [ERROR] NPM NOT FOUND. Please install it.
GOTO end

:end
TIMEOUT 15