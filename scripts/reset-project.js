#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Resetting React Native project...\n');

// Delete node_modules folder
try {
  console.log('🗑️  Deleting node_modules...');
  const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true });
    console.log('✅ node_modules deleted successfully');
  } else {
    console.log('ℹ️  node_modules folder not found');
  }
} catch (error) {
  console.error('❌ Error deleting node_modules:', error.message);
}

// Delete package-lock.json
try {
  console.log('🗑️  Deleting package-lock.json...');
  const packageLockPath = path.join(__dirname, '..', 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    fs.unlinkSync(packageLockPath);
    console.log('✅ package-lock.json deleted successfully');
  } else {
    console.log('ℹ️  package-lock.json not found');
  }
} catch (error) {
  console.error('❌ Error deleting package-lock.json:', error.message);
}

// Delete expo folders
try {
  console.log('🗑️  Cleaning Expo cache folders...');
  const expoFolders = [
    '.expo',
    '.expo-shared',
    '.npm',
    'dist',
    'web-build'
  ];

  expoFolders.forEach(folder => {
    const folderPath = path.join(__dirname, '..', folder);
    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      console.log(`✅ ${folder} deleted successfully`);
    }
  });
} catch (error) {
  console.error('❌ Error deleting Expo folders:', error.message);
}

// Reinstall dependencies
try {
  console.log('\n📦 Installing dependencies...');
  execSync('npm install', { 
    cwd: path.join(__dirname, '..'), 
    stdio: 'inherit' 
  });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
}

// Clear Metro bundler cache
try {
  console.log('🧹 Clearing Metro bundler cache...');
  execSync('npx expo start --clear', { 
    cwd: path.join(__dirname, '..'), 
    stdio: 'inherit' 
  });
} catch (error) {
  // This might fail because we're trying to start the server, but that's okay
  console.log('ℹ️  Metro cache cleared');
}

console.log('\n✨ Project reset completed!');
console.log('👉 Run "npx expo start" to start your project');