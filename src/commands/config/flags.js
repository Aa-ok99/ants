const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const logger = require('../../utils/logger');

const subcommand = process.argv[3] || 'list';
const CONFIG_KEY = 'flags';

function loadConfig() {
  const configPath = path.join(process.cwd(), 'ants.config.json');
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
}

function saveConfig(config) {
  const configPath = path.join(process.cwd(), 'ants.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
}

async function run() {
  switch (subcommand) {
    case 'list':
    case 'ls':
      listFlags();
      break;
    case 'create':
      await createFlag();
      break;
    case 'set':
      await setFlag();
      break;
    default:
      console.log('🚩 Feature Flags\n');
      console.log('USAGE:');
      console.log('  ants flags list            List feature flags');
      console.log('  ants flags create <slug>   Create a new flag');
      console.log('  ants flags set <flag>      Set flag value');
      process.exit(0);
  }
}

function listFlags() {
  const config = loadConfig();
  
  if (!config || !config[CONFIG_KEY] || Object.keys(config[CONFIG_KEY]).length === 0) {
    console.log('ℹ️  No feature flags configured');
    return;
  }
  
  console.log('🚩 Feature Flags\n');
  console.log('SLUG'.padEnd(25) + 'VALUE'.padEnd(10) + 'ENVIRONMENT');
  console.log('─'.repeat(55));
  
  for (const [slug, flag] of Object.entries(config[CONFIG_KEY])) {
    console.log(
      slug.padEnd(25) +
      String(flag.value).padEnd(10) +
      (flag.environment || 'all')
    );
  }
}

async function createFlag() {
  const slug = process.argv[4];
  
  let flagSlug = slug;
  if (!flagSlug) {
    const response = await prompts([
      { type: 'text', name: 'slug', message: 'Flag slug (e.g., dark-mode)' },
    ]);
    flagSlug = response.slug;
  }
  
  if (!flagSlug) {
    console.log('❌ Flag slug is required');
    process.exit(1);
  }
  
  const config = loadConfig() || {};
  if (!config[CONFIG_KEY]) config[CONFIG_KEY] = {};
  
  config[CONFIG_KEY][flagSlug] = {
    value: false,
    environment: 'all',
    createdAt: new Date().toISOString(),
  };
  
  saveConfig(config);
  console.log(`✅ Flag created: ${flagSlug}`);
  logger.info(`Flag created: ${flagSlug}`);
}

async function setFlag() {
  const flagName = process.argv[3];
  
  if (!flagName) {
    console.log('❌ Flag name is required');
    console.log('USAGE: ants flags set <flag>');
    process.exit(1);
  }
  
  const config = loadConfig();
  if (!config || !config[CONFIG_KEY] || !config[CONFIG_KEY][flagName]) {
    console.log(`❌ Flag not found: ${flagName}`);
    process.exit(1);
  }
  
  const response = await prompts({
    type: 'toggle',
    name: 'value',
    message: `Set ${flagName}`,
    initial: config[CONFIG_KEY][flagName].value,
    active: 'enabled',
    inactive: 'disabled',
  });
  
  config[CONFIG_KEY][flagName].value = response.value;
  saveConfig(config);
  
  console.log(`✅ ${flagName} = ${response.value ? 'enabled' : 'disabled'}`);
  logger.info(`Flag set: ${flagName} = ${response.value}`);
}

run();
