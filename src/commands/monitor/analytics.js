const fs = require('fs');
const path = require('path');
const api = require('../../api');
const auth = require('../../auth');
const output = require('../../utils/output');
const logger = require('../../utils/logger');

const LOG_FILE = path.join(process.cwd(), 'ants.log');

function run() {
  const subcommand = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : 'summary';
  
  switch (subcommand) {
    case 'summary':
      showSummary();
      break;
    case 'commands':
      showCommandStats();
      break;
    case 'errors':
      showErrorStats();
      break;
    default:
      console.log('📊 Usage Analytics\n');
      console.log('USAGE:');
      console.log('  ants analytics              Show usage summary');
      console.log('  ants analytics commands     Show command usage stats');
      console.log('  ants analytics errors       Show error stats');
      process.exit(0);
  }
}

function showSummary() {
  const result = {
    period: 'since first use',
    totalCommands: 0,
    totalErrors: 0,
    lastUsed: null,
    topCommands: [],
  };
  
  if (fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(l => l.trim());
    result.totalCommands = lines.length;
    result.totalErrors = lines.filter(l => l.includes('[ERROR]')).length;
    result.lastUsed = lines.length > 0 ? lines[lines.length - 1].substring(1, 24) : null;
    
    const cmdCounts = {};
    for (const line of lines) {
      const match = line.match(/\] (.+?):/);
      if (match) {
        const cmd = match[1].trim();
        cmdCounts[cmd] = (cmdCounts[cmd] || 0) + 1;
      }
    }
    
    result.topCommands = Object.entries(cmdCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cmd, count]) => ({ command: cmd, count }));
  }
  
  if (output.isJsonMode()) {
    output.outputJson(result);
    return;
  }
  
  console.log('📊 Usage Analytics\n');
  console.log(`📅 Period: ${result.period}`);
  console.log(`🔢 Total log entries: ${result.totalCommands}`);
  console.log(`🚨 Total errors: ${result.totalErrors}`);
  console.log(`⏱️  Last used: ${result.lastUsed || 'never'}\n`);
  
  if (result.topCommands.length > 0) {
    console.log('🏆 Top Commands:');
    output.outputTable(['COMMAND', 'COUNT'], result.topCommands.map(c => [c.command, String(c.count)]));
  } else {
    console.log('ℹ️  No usage data yet');
    console.log('💡 Run some commands and data will be collected in ants.log');
  }
}

function showCommandStats() {
  const result = { commands: [] };
  
  if (fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(l => l.trim());
    const cmdCounts = {};
    
    for (const line of lines) {
      const match = line.match(/\] (.+?):/);
      if (match) {
        const cmd = match[1].trim();
        cmdCounts[cmd] = (cmdCounts[cmd] || 0) + 1;
      }
    }
    
    result.commands = Object.entries(cmdCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cmd, count]) => ({ command: cmd, count }));
  }
  
  if (output.isJsonMode()) {
    output.outputJson(result);
    return;
  }
  
  console.log('📊 Command Usage Stats\n');
  
  if (result.commands.length === 0) {
    console.log('ℹ️  No command data yet');
    return;
  }
  
  output.outputTable(['COMMAND', 'COUNT'], result.commands.map(c => [c.command, String(c.count)]));
}

function showErrorStats() {
  const result = { errors: [], total: 0 };
  
  if (fs.existsSync(LOG_FILE)) {
    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(l => l.includes('[ERROR]'));
    result.total = lines.length;
    result.errors = lines.slice(-20).map(l => ({
      timestamp: l.substring(1, 24),
      message: l.substring(l.indexOf(']') + 2),
    }));
  }
  
  if (output.isJsonMode()) {
    output.outputJson(result);
    return;
  }
  
  console.log('🚨 Error Stats\n');
  console.log(`Total errors: ${result.total}\n`);
  
  if (result.errors.length === 0) {
    console.log('✅ No errors found');
    return;
  }
  
  console.log('Recent errors:');
  for (const err of result.errors) {
    console.log(`  [${err.timestamp}] ${err.message}`);
  }
}

run();
