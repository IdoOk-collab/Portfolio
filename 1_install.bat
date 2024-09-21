@echo off
setlocal

REM Install the dependencies
echo Installing dependencies...
npm install express axios dotenv cors

echo Starting the server...
start cmd /k "node server.js"


pause
