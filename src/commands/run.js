const { execSync } = require('child_process');
const configUtil = require('../utils/config');
const logger = require('../utils/logger');

const scriptName = process.argv[3];

if (!scriptName) {
  const config = configUtil.load();
  
  console.log('🏃 Run a script from ants.config.json\n');
  
  if (!config || !config.scripts || Object.keys(config.scripts).length === 0) {
    console.log('⚠️  No scripts defined in config');
    console.log('💡 Add scripts to ants.config.json:');
    console.log('   { "scripts": { "start": "echo hello" } }');
    process.exit(1);
  }
  
  console.log('📋 Available scripts:');
  for (const [name, cmd] of Object.entries(config.scripts)) {
    console.log(`  ${name}: ${cmd}`);
  }
  console.log('\n💡 Run: ants run <script-name>');
  process.exit(0);
}

const config = configUtil.load();
if (!config || !config.scripts || !config.scripts[scriptName]) {
  console.error(`❌ Script '${scriptName}' not found in config`);
  
  if (config && config.scripts) {
    console.log('\n📋 Available scripts:');
    for (const [name, cmd] of Object.entries(config.scripts)) {
      console.log(`  ${name}: ${cmd}`);
    }
  }
  process.exit(1);
}

const cmd = config.scripts[scriptName];
console.log(`🏃 Running '${scriptName}': ${cmd}\n`);
logger.info(`Running script: ${scriptName} = ${cmd}`);

try {
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
} catch (err) {
  logger.error(`Script '${scriptName}' failed with exit code ${err.status}`);
  process.exit(err.status || 1);
}
