const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(process.cwd(), 'ants.log');

let level = 'warn';
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

function setLevel(l) {
  level = l;
}

function log(lvl, ...args) {
  if (LEVELS[lvl] < LEVELS[level]) return;
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${lvl.toUpperCase()}]`;
  const msg = [prefix, ...args].join(' ');
  
  if (lvl === 'error') {
    console.error(msg);
  } else {
    console.log(msg);
  }
  
  try {
    fs.appendFileSync(LOG_FILE, msg + '\n');
  } catch (_) {}
}

module.exports = {
  debug: (...a) => log('debug', ...a),
  info: (...a) => log('info', ...a),
  warn: (...a) => log('warn', ...a),
  error: (...a) => log('error', ...a),
  setLevel,
  LOG_FILE,
};
