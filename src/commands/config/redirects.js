const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const logger = require('../../utils/logger');

const subcommand = process.argv[3] || 'list';
const CONFIG_KEY = 'redirects';

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
      listRedirects();
      break;
    case 'add':
      await addRedirect();
      break;
    case 'rm':
      removeRedirect();
      break;
    default:
      console.log('↩️  Redirect Management\n');
      console.log('USAGE:');
      console.log('  ants redirects list      List redirects');
      console.log('  ants redirects add       Add a redirect');
      console.log('  ants redirects rm <id>   Remove a redirect');
      process.exit(0);
  }
}

function listRedirects() {
  const config = loadConfig();
  
  if (!config || !config[CONFIG_KEY] || config[CONFIG_KEY].length === 0) {
    console.log('ℹ️  No redirects configured');
    return;
  }
  
  console.log('↩️  Redirects\n');
  console.log('ID'.padEnd(6) + 'FROM'.padEnd(20) + 'TO'.padEnd(30) + 'STATUS');
  console.log('─'.repeat(70));
  
  config[CONFIG_KEY].forEach((r, i) => {
    console.log(
      String(i).padEnd(6) +
      (r.from || '/old').padEnd(20) +
      (r.to || '/new').padEnd(30) +
      (r.status || 301)
    );
  });
}

async function addRedirect() {
  const response = await prompts([
    { type: 'text', name: 'from', message: 'From path', initial: '/old-path' },
    { type: 'text', name: 'to', message: 'To path', initial: '/new-path' },
    { type: 'select', name: 'status', message: 'Status code',
      choices: [
        { title: '301 Permanent', value: 301 },
        { title: '302 Temporary', value: 302 },
      ],
    },
  ]);
  
  if (!response.from) {
    console.log('❌ Cancelled');
    process.exit(1);
  }
  
  const config = loadConfig() || {};
  if (!config[CONFIG_KEY]) config[CONFIG_KEY] = [];
  
  config[CONFIG_KEY].push({
    from: response.from,
    to: response.to,
    status: response.status,
  });
  
  saveConfig(config);
  console.log(`✅ Redirect added: ${response.from} → ${response.to} (${response.status})`);
  logger.info(`Redirect added: ${response.from}`);
}

function removeRedirect() {
  const id = parseInt(process.argv[4]);
  
  if (isNaN(id)) {
    console.log('❌ Redirect ID is required');
    console.log('USAGE: ants redirects rm <id>');
    process.exit(1);
  }
  
  const config = loadConfig();
  if (!config || !config[CONFIG_KEY] || !config[CONFIG_KEY][id]) {
    console.log(`❌ Redirect ${id} not found`);
    process.exit(1);
  }
  
  const removed = config[CONFIG_KEY].splice(id, 1)[0];
  saveConfig(config);
  console.log(`✅ Redirect removed: ${removed.from} → ${removed.to}`);
  logger.info(`Redirect removed: ${removed.from}`);
}

run();
