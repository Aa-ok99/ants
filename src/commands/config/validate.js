const fs = require('fs');
const path = require('path');
const configUtil = require('../../utils/config');
const output = require('../../utils/output');
const logger = require('../../utils/logger');

const VALID_KEYS = ['name', 'version', 'description', 'created', 'ants', 'scripts', 'env', 'routes', 'redirects', 'flags', 'targets', 'plugins', 'domains'];

function run() {
  const configPath = configUtil.findConfig();
  
  if (!configPath) {
    const result = { valid: false, errors: ['No ants.config.json found'], suggestions: ['Run `ants init` to create one'] };
    if (output.isJsonMode()) {
      output.outputJson(result);
    } else {
      console.log('❌ No ants.config.json found');
      console.log('💡 Run `ants init` to create one');
    }
    process.exit(1);
  }
  
  let config;
  const errors = [];
  const warnings = [];
  
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    config = JSON.parse(raw);
  } catch (err) {
    if (output.isJsonMode()) {
      output.outputJson({ valid: false, errors: [`Invalid JSON: ${err.message}`] });
    } else {
      console.log(`❌ Invalid JSON: ${err.message}`);
    }
    process.exit(1);
  }
  
  // Check required fields
  if (!config.name) {
    warnings.push('Missing "name" field');
  }
  
  if (!config.version) {
    warnings.push('Missing "version" field');
  }
  
  // Check for unknown keys
  for (const key of Object.keys(config)) {
    if (!VALID_KEYS.includes(key) && !key.startsWith('_')) {
      warnings.push(`Unknown key: "${key}"`);
    }
  }
  
  // Validate ants section
  if (config.ants) {
    if (typeof config.ants !== 'object') {
      errors.push('"ants" must be an object');
    } else if (config.ants.api && !config.ants.api.startsWith('http')) {
      errors.push('"ants.api" must be a valid URL');
    }
  }
  
  // Validate scripts
  if (config.scripts) {
    if (typeof config.scripts !== 'object') {
      errors.push('"scripts" must be an object');
    } else {
      for (const [name, cmd] of Object.entries(config.scripts)) {
        if (typeof cmd !== 'string') {
          errors.push(`Script "${name}" must be a string`);
        }
      }
    }
  }
  
  // Validate routes
  if (config.routes) {
    if (!Array.isArray(config.routes)) {
      errors.push('"routes" must be an array');
    } else {
      config.routes.forEach((r, i) => {
        if (!r.source && !r.src) warnings.push(`Route[${i}] missing "source"`);
        if (!r.dest) warnings.push(`Route[${i}] missing "dest"`);
      });
    }
  }
  
  // Validate redirects
  if (config.redirects) {
    if (!Array.isArray(config.redirects)) {
      errors.push('"redirects" must be an array');
    } else {
      config.redirects.forEach((r, i) => {
        if (!r.from) warnings.push(`Redirect[${i}] missing "from"`);
        if (!r.to) warnings.push(`Redirect[${i}] missing "to"`);
      });
    }
  }
  
  // Validate env
  if (config.env && typeof config.env !== 'object') {
    errors.push('"env" must be an object');
  }
  
  const valid = errors.length === 0;
  
  const result = {
    valid,
    file: configPath,
    errors,
    warnings,
    fields: Object.keys(config).filter(k => !k.startsWith('_')),
  };
  
  if (output.isJsonMode()) {
    output.outputJson(result);
  } else {
    if (valid && warnings.length === 0) {
      console.log('✅ Configuration is valid');
    } else if (valid) {
      console.log('✅ Configuration is valid (with warnings)\n');
    } else {
      console.log('❌ Configuration has errors\n');
    }
    
    console.log(`📄 File: ${configPath}`);
    console.log(`📊 Fields: ${result.fields.join(', ')}\n`);
    
    if (errors.length > 0) {
      console.log('🚨 Errors:');
      for (const e of errors) {
        console.log(`   ❌ ${e}`);
      }
      console.log('');
    }
    
    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      for (const w of warnings) {
        console.log(`   ⚠️  ${w}`);
      }
      console.log('');
    }
  }
  
  logger.info(`Config validated: ${valid ? 'valid' : 'invalid'}`);
  if (!valid) process.exit(1);
}

run();
