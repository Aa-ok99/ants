const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const initCommand = new Command('init')
  .description('Initialize a new ants project configuration')
  .option('-n, --name <name>', 'Project name', 'my-ants-project')
  .action((options) => {
    console.log(`🐜 Initializing project: ${options.name}...`);
    const configPath = path.join(process.cwd(), 'ants.config.json');
    if (fs.existsSync(configPath)) {
      console.warn('⚠️  ants.config.json already exists.');
      return;
    }
    const config = { name: options.name, version: "0.1.0", tasks: [] };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('✅ ants.config.json created successfully.');
  });

module.exports = { initCommand };
