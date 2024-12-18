const fs = require('fs');
const path = require('path');

// Create the shell script for Linux/macOS
const shellScriptContent = `#!/bin/bash
# Navigate to the build directory and start the Express server
cd "$(dirname "$0")/backend
node app.js
`;

fs.writeFileSync(path.join(__dirname, 'build', 'start-server.sh'), shellScriptContent);
fs.chmodSync(path.join(__dirname, 'build', 'start-server.sh'), '755'); // Make it executable

// Create the batch script for Windows
const batchScriptContent = `@echo off
:: Navigate to the build directory and start the Express server
cd /d "%~dp0backend"
node app.js
`;

fs.writeFileSync(path.join(__dirname, 'build', 'start-server.bat'), batchScriptContent);

console.log('Startup scripts created successfully!');