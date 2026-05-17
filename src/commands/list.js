const configUtil = require('../utils/config');
const pluginLoader = require('../utils/plugin-loader');

const config = configUtil.load();
const plugins = pluginLoader.load();

console.log('📋 Available Commands & Plugins\n');

console.log('🔧 Built-in Commands:');
const cmds = [
  ['init', 'Initialize new project (interactive wizard)'],
  ['status', 'Check API connection status'],
  ['config', 'Show or manage configuration'],
  ['run <script>', 'Run a script from config'],
  ['list', 'Show this list'],
];
for (const [name, desc] of cmds) {
  console.log(`  ${name.padEnd(18)} ${desc}`);
}

console.log('\n📦 Plugins:');
if (plugins.length === 0) {
  console.log('  (none loaded)');
  console.log('  💡 Add .js files to ants.plugins/ directory');
} else {
  for (const p of plugins) {
    console.log(`  ${p.name}`);
  }
}

if (config && config.scripts) {
  console.log('\n🏃 Config Scripts:');
  for (const [name, cmd] of Object.entries(config.scripts)) {
    console.log(`  ${name.padEnd(18)} ${cmd}`);
  }
}

console.log('');
