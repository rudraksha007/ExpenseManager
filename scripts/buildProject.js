const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Directories for frontend and backend
const frontendDir = path.join(__dirname, '../frontend');
const backendDir = path.join(__dirname, '../backend');

// Build output directories
const buildDir = path.join(__dirname, '../build');
const buildFrontendDir = path.join(buildDir, 'dist');
const buildBackendDir = path.join(buildDir, 'backend');

// Step 1: Build frontend React app
console.log('Building React app...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// Step 2: Install production dependencies for the backend
console.log('Installing production dependencies for the backend...');
execSync('npm install --production', { cwd: backendDir, stdio: 'inherit' });

// Step 3: Prune unnecessary dependencies (devDependencies)
console.log('Pruning dev dependencies...');
execSync('npm prune --production', { cwd: backendDir, stdio: 'inherit' });

// Step 4: Create build directory if it doesn't exist
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir);
}

// Step 5: Create subdirectories for frontend and backend in the build directory
if (!fs.existsSync(buildFrontendDir)) {
  fs.mkdirSync(buildFrontendDir);
}

if (!fs.existsSync(buildBackendDir)) {
  fs.mkdirSync(buildBackendDir);
}

// Step 6: Move frontend build files to build folder
console.log('Moving frontend build files...');
fs.readdirSync(path.join(frontendDir, 'dist')).forEach(file => {
  const srcPath = path.join(frontendDir, 'dist', file);
  const destPath = path.join(buildFrontendDir, file);
  
  fs.renameSync(srcPath, destPath);
});

// Step 7: Move backend files to build folder
console.log('Moving backend files...');
fs.readdirSync(backendDir).forEach(file => {
  const srcPath = path.join(backendDir, file);
  const destPath = path.join(buildBackendDir, file);
  
  fs.renameSync(srcPath, destPath);
});

// Step 8: Create a start script to run the production server (for Linux/Windows)
const startScriptContent = `
#!/bin/bash
cd backend
npm install --production
npm start
`;

// Write the shell script for Linux/MacOS
fs.writeFileSync(path.join(buildDir, 'start-server.sh'), startScriptContent);

console.log('Build completed and moved to the build folder.');
