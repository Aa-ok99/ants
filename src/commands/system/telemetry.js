const fs = require('fs');
const path = require('path');
const os = require('os');
const logger = require('../../utils/logger');

const subcommand = process.argv[3] || 'status';
const TELEMETRY_FILE = path.join(os.homedir(), '.config', 'ants', 'telemetry.json');

function run() {
  switch (subcommand) {
    case 'status':
      showStatus();
      break;
    case 'enable':
      toggle(true);
      break;
    case 'disable':
      toggle(false);
      break;
    default:
      console.log('📡 Telemetry Settings\n');
      console.log('USAGE:');
      console.log('  ants telemetry status   Show telemetry status');
      console.log('  ants telemetry enable   Enable telemetry');
      console.log('  ants telemetry disable  Disable telemetry');
      process.exit(0);
  }
}

function load() {
  if (!fs.existsSync(TELEMETRY_FILE)) {
    return { enabled: true };
  }
  return JSON.parse(fs.readFileSync(TELEMETRY_FILE, 'utf8'));
}

function save(data) {
  const dir = path.dirname(TELEMETRY_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(TELEMETRY_FILE, JSON.stringify(data, null, 2));
}

function showStatus() {
  const config = load();
  console.log(`📡 Telemetry: ${config.enabled ? '✅ enabled' : '❌ disabled'}`);
  console.log('');
  console.log('We collect anonymous usage data to improve Ants CLI.');
  console.log('No personal information or code is ever sent.');
}

function toggle(enabled) {
  const config = load();
  config.enabled = enabled;
  save(config);
  
  console.log(`📡 Telemetry ${enabled ? 'enabled' : 'disabled'}`);
  logger.info(`Telemetry ${enabled ? 'enabled' : 'disabled'}`);
}

run();
