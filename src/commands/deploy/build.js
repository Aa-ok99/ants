const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const logger = require('../../utils/logger');

function run() {
  console.log('🔨 Building project locally...\n');
  
  const cwd = process.cwd();
  
  const buildScript = detectBuildScript(cwd);
  
  if (!buildScript) {
    console.log('ℹ️  No build script detected');
    console.log('💡 Add a "build" script to package.json or ants.config.json');
    console.log('\n📁 Project structure:');
    listProjectFiles(cwd);
    return;
  }
  
  console.log(`📦 Running: ${buildScript}\n`);
  
  try {
    execSync(buildScript, { stdio: 'inherit', cwd });
    console.log('\n✅ Build completed successfully');
    logger.info('Build completed');
  } catch (err) {
    console.error(`\n❌ Build failed with exit code ${err.status}`);
    logger.error('Build failed');
    process.exit(err.status || 1);
  }
}

function detectBuildScript(cwd) {
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.scripts?.build) {
      return `npm run build`;
    }
  }
  
  const configPath = path.join(cwd, 'ants.config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.scripts?.build) {
      return config.scripts.build;
    }
  }
  
  return null;
}

function listProjectFiles(dir, indent = '  ') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries.slice(0, 10)) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    console.log(`${indent}${entry.isDirectory() ? '📁' : '📄'} ${entry.name}`);
  }
}

run();
