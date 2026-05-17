const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const logger = require('../../utils/logger');

const subcommand = process.argv[3] || 'list';

const CONFIG_KEY = 'routes';

function loadConfig() {
  const configPath = path.join(process.cwd(), 'ants.config.json');
  if (!fs.existsSync(configPath)) {
    return null;
  }
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
      listRoutes();
      break;
    case 'add':
      await addRoute();
      break;
    case 'rm':
    case 'remove':
      removeRoute();
      break;
    default:
      console.log('🔀 Route Management\n');
      console.log('USAGE:');
      console.log('  ants routes list      List routing rules');
      console.log('  ants routes add       Add a routing rule');
      console.log('  ants routes rm <id>   Remove a route');
      process.exit(0);
  }
}

function listRoutes() {
  const config = loadConfig();
  
  if (!config || !config[CONFIG_KEY] || config[CONFIG_KEY].length === 0) {
    console.log('ℹ️  No routes configured');
    return;
  }
  
  console.log('🔀 Routes\n');
  console.log('ID'.padEnd(6) + 'SOURCE'.padEnd(20) + 'DESTINATION'.padEnd(30) + 'STATUS');
  console.log('─'.repeat(70));
  
  config[CONFIG_KEY].forEach((route, i) => {
    console.log(
      String(i).padEnd(6) +
      (route.source || '/*').padEnd(20) +
      (route.dest || '/').padEnd(30) +
      (route.status || '200')
    );
  });
}

async function addRoute() {
  const response = await prompts([
    { type: 'text', name: 'source', message: 'Source path', initial: '/api/*' },
    { type: 'text', name: 'dest', message: 'Destination', initial: 'https://backend.internal/:path*' },
    { type: 'select', name: 'status', message: 'HTTP status',
      choices: [
        { title: '200 OK', value: 200 },
        { title: '301 Redirect', value: 301 },
        { title: '302 Temporary', value: 302 },
      ],
    },
  ]);
  
  if (!response.source) {
    console.log('❌ Cancelled');
    process.exit(1);
  }
  
  const config = loadConfig() || {};
  if (!config[CONFIG_KEY]) config[CONFIG_KEY] = [];
  
  config[CONFIG_KEY].push({
    source: response.source,
    dest: response.dest,
    status: response.status,
  });
  
  saveConfig(config);
  console.log(`✅ Route added: ${response.source} → ${response.dest}`);
  logger.info(`Route added: ${response.source}`);
}

function removeRoute() {
  const id = parseInt(process.argv[4]);
  
  if (isNaN(id)) {
    console.log('❌ Route ID is required');
    console.log('USAGE: ants routes rm <id>');
    process.exit(1);
  }
  
  const config = loadConfig();
  if (!config || !config[CONFIG_KEY] || !config[CONFIG_KEY][id]) {
    console.log(`❌ Route ${id} not found`);
    process.exit(1);
  }
  
  const removed = config[CONFIG_KEY].splice(id, 1)[0];
  saveConfig(config);
  console.log(`✅ Route removed: ${removed.source} → ${removed.dest}`);
  logger.info(`Route removed: ${removed.source}`);
}

run();
