const fs = require('fs');
const path = require('path');

const CONFIG_FILE = 'ants.config.json';
const API_BASE = 'https://ants-pied.vercel.app';

function findConfig(dir = process.cwd()) {
  const configPath = path.join(dir, CONFIG_FILE);
  if (fs.existsSync(configPath)) {
    return configPath;
  }
  
  const parent = path.dirname(dir);
  if (parent !== dir) {
    return findConfig(parent);
  }
  
  return null;
}

function load(dir) {
  const configPath = findConfig(dir);
  if (!configPath) {
    return null;
  }
  
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);
    config._path = configPath;
    return config;
  } catch (err) {
    throw new Error(`Failed to parse ${CONFIG_FILE}: ${err.message}`);
  }
}

function save(config, configPath) {
  const { _path, ...data } = config;
  const target = configPath || (config._path && config._path);
  if (!target) {
    throw new Error('No config file path specified');
  }
  fs.writeFileSync(target, JSON.stringify(data, null, 2) + '\n');
}

function create(projectDir, options = {}) {
  const configPath = path.join(projectDir, CONFIG_FILE);
  
  if (fs.existsSync(configPath)) {
    return { path: configPath, exists: true };
  }
  
  const config = {
    name: options.name || path.basename(projectDir),
    version: options.version || '1.0.0',
    created: new Date().toISOString(),
    ants: {
      api: API_BASE,
      status: 'ready'
    },
    scripts: {
      start: 'npx @aa-ok99/ants',
      test: 'echo "No tests specified"'
    },
    ...options.extra
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
  return { path: configPath, exists: false };
}

module.exports = { load, save, create, findConfig, CONFIG_FILE, API_BASE };
