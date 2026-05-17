const fs = require('fs');
const path = require('path');
const logger = require('./logger');

const PLUGINS_DIR = path.join(process.cwd(), 'ants.plugins');

function load() {
  const plugins = [];
  
  if (!fs.existsSync(PLUGINS_DIR)) {
    return plugins;
  }
  
  const entries = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.js'));
  
  for (const file of entries) {
    try {
      const mod = require(path.join(PLUGINS_DIR, file));
      const name = path.basename(file, '.js');
      if (typeof mod === 'function') {
        plugins.push({ name, handler: mod });
        logger.debug(`Plugin loaded: ${name}`);
      } else if (mod && typeof mod === 'object') {
        plugins.push({ name, handler: mod.execute || (() => {}) });
        logger.debug(`Plugin loaded: ${name}`);
      }
    } catch (err) {
      logger.warn(`Failed to load plugin ${file}:`, err.message);
    }
  }
  
  return plugins;
}

function executeAll(plugins, context) {
  for (const plugin of plugins) {
    try {
      plugin.handler(context);
    } catch (err) {
      logger.warn(`Plugin ${plugin.name} failed:`, err.message);
    }
  }
}

module.exports = { load, executeAll, PLUGINS_DIR };
