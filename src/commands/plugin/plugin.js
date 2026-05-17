const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const pluginLoader = require('../../utils/plugin-loader');
const logger = require('../../utils/logger');

const subcommand = process.argv[3] || 'list';
const pluginName = process.argv[4];

function run() {
  switch (subcommand) {
    case 'list':
    case 'ls':
      listPlugins();
      break;
    case 'add':
    case 'install':
      addPlugin();
      break;
    case 'rm':
    case 'remove':
      removePlugin();
      break;
    case 'discover':
      discoverPlugins();
      break;
    default:
      console.log('🔌 Plugin Management\n');
      console.log('USAGE:');
      console.log('  ants plugin list          List installed plugins');
      console.log('  ants plugin add <name>    Install a plugin');
      console.log('  ants plugin rm <name>     Remove a plugin');
      console.log('  ants plugin discover      Discover available plugins');
      process.exit(0);
  }
}

function listPlugins() {
  const plugins = pluginLoader.load();
  
  console.log('🔌 Installed Plugins\n');
  
  if (plugins.length === 0) {
    console.log('ℹ️  No plugins installed');
    console.log(`📁 Plugin directory: ${pluginLoader.PLUGINS_DIR}`);
    console.log('💡 Run `ants plugin discover` to find plugins');
    return;
  }
  
  console.log('NAME'.padEnd(25) + 'STATUS');
  console.log('─'.repeat(40));
  
  for (const p of plugins) {
    console.log(p.name.padEnd(25) + '✅ loaded');
  }
  
  console.log(`\n📊 Total: ${plugins.length} plugin(s)`);
}

function addPlugin() {
  if (!pluginName) {
    console.log('❌ Plugin name is required');
    console.log('USAGE: ants plugin add <name>');
    process.exit(1);
  }
  
  const pluginPath = path.join(pluginLoader.PLUGINS_DIR, `${pluginName}.js`);
  
  if (fs.existsSync(pluginPath)) {
    console.log(`⚠️  Plugin already exists: ${pluginName}`);
    return;
  }
  
  if (!fs.existsSync(pluginLoader.PLUGINS_DIR)) {
    fs.mkdirSync(pluginLoader.PLUGINS_DIR, { recursive: true });
  }
  
  const template = `// Plugin: ${pluginName}
module.exports = (context) => {
  console.log('🔌 ${pluginName} plugin executed!');
};
`;
  
  fs.writeFileSync(pluginPath, template);
  console.log(`✅ Plugin added: ${pluginName}`);
  console.log(`📁 ${pluginPath}`);
  logger.info(`Plugin added: ${pluginName}`);
}

function removePlugin() {
  if (!pluginName) {
    console.log('❌ Plugin name is required');
    console.log('USAGE: ants plugin rm <name>');
    process.exit(1);
  }
  
  const pluginPath = path.join(pluginLoader.PLUGINS_DIR, `${pluginName}.js`);
  
  if (!fs.existsSync(pluginPath)) {
    console.log(`❌ Plugin not found: ${pluginName}`);
    process.exit(1);
  }
  
  fs.unlinkSync(pluginPath);
  console.log(`✅ Plugin removed: ${pluginName}`);
  logger.info(`Plugin removed: ${pluginName}`);
}

function discoverPlugins() {
  console.log('🔍 Discover Plugins\n');
  
  const builtin = [
    { name: 'hello', desc: 'Simple hello world plugin' },
    { name: 'logger', desc: 'Enhanced logging plugin' },
    { name: 'notifier', desc: 'Send notifications on events' },
    { name: 'cache', desc: 'Caching layer for commands' },
  ];
  
  console.log('NAME'.padEnd(20) + 'DESCRIPTION');
  console.log('─'.repeat(50));
  
  for (const p of builtin) {
    const installed = fs.existsSync(
      path.join(pluginLoader.PLUGINS_DIR, `${p.name}.js`)
    );
    console.log(
      p.name.padEnd(20) + p.desc + (installed ? ' ✅' : '')
    );
  }
  
  console.log('\n💡 Run `ants plugin add <name>` to install');
}

run();
