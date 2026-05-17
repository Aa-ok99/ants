const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const logger = require('../../utils/logger');

const subcommand = process.argv[3] || 'list';
const CONFIG_KEY = 'targets';

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
      listTargets();
      break;
    case 'add':
      await addTarget();
      break;
    case 'rm':
      removeTarget();
      break;
    default:
      console.log('🎯 Environment Targets\n');
      console.log('USAGE:');
      console.log('  ants target list      List environments');
      console.log('  ants target add       Add a new target');
      console.log('  ants target rm <name> Remove a target');
      console.log('');
      console.log('EXAMPLES:');
      console.log('  ants deploy --target=staging');
      console.log('  ants deploy --target=preview');
      process.exit(0);
  }
}

function listTargets() {
  const config = loadConfig();
  
  const defaults = [
    { name: 'development', url: 'http://localhost:3000', active: true },
    { name: 'preview', url: '—', active: false },
    { name: 'production', url: '—', active: false },
  ];
  
  const custom = config?.[CONFIG_KEY] || [];
  const all = [...defaults, ...custom];
  
  console.log('🎯 Environment Targets\n');
  console.log('NAME'.padEnd(20) + 'URL'.padEnd(35) + 'ACTIVE');
  console.log('─'.repeat(60));
  
  for (const t of all) {
    console.log(
      t.name.padEnd(20) +
      (t.url || '—').padEnd(35) +
      (t.active ? '✅' : '❌')
    );
  }
}

async function addTarget() {
  const response = await prompts([
    { type: 'text', name: 'name', message: 'Target name', initial: 'staging' },
    { type: 'text', name: 'url', message: 'Target URL', initial: 'https://staging.example.com' },
  ]);
  
  if (!response.name) {
    console.log('❌ Cancelled');
    process.exit(1);
  }
  
  const config = loadConfig() || {};
  if (!config[CONFIG_KEY]) config[CONFIG_KEY] = [];
  
  config[CONFIG_KEY].push({
    name: response.name,
    url: response.url,
    createdAt: new Date().toISOString(),
  });
  
  saveConfig(config);
  console.log(`✅ Target added: ${response.name} → ${response.url}`);
  logger.info(`Target added: ${response.name}`);
}

function removeTarget() {
  const name = process.argv[4];
  
  if (!name) {
    console.log('❌ Target name is required');
    console.log('USAGE: ants target rm <name>');
    process.exit(1);
  }
  
  const config = loadConfig();
  if (!config || !config[CONFIG_KEY]) {
    console.log(`❌ Target not found: ${name}`);
    process.exit(1);
  }
  
  const idx = config[CONFIG_KEY].findIndex(t => t.name === name);
  if (idx === -1) {
    console.log(`❌ Target not found: ${name}`);
    process.exit(1);
  }
  
  config[CONFIG_KEY].splice(idx, 1);
  saveConfig(config);
  console.log(`✅ Target removed: ${name}`);
  logger.info(`Target removed: ${name}`);
}

run();
