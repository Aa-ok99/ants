const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const configUtil = require('../utils/config');
const logger = require('../utils/logger');

async function run() {
  console.log('🚀 Initializing new Ants project...\n');
  
  const projectDir = process.cwd();
  const existing = configUtil.findConfig(projectDir);
  
  if (existing) {
    console.log('⚠️  ants.config.json already exists!');
    console.log('💡 Run `rm ants.config.json` first if you want to reinitialize');
    process.exit(0);
  }
  
  const response = await prompts([
    {
      type: 'text',
      name: 'name',
      message: 'Project name',
      initial: path.basename(projectDir),
    },
    {
      type: 'text',
      name: 'version',
      message: 'Version',
      initial: '1.0.0',
    },
    {
      type: 'text',
      name: 'description',
      message: 'Description (optional)',
      initial: '',
    },
    {
      type: 'multiselect',
      name: 'scripts',
      message: 'Add starter scripts? (space to select)',
      choices: [
        { title: 'start', value: 'start', selected: true },
        { title: 'test', value: 'test', selected: true },
        { title: 'build', value: 'build', selected: false },
        { title: 'deploy', value: 'deploy', selected: false },
      ],
    },
  ]);
  
  if (!response.name) {
    console.log('❌ Project name is required');
    process.exit(1);
  }
  
  const scripts = {};
  if (response.scripts.includes('start')) scripts.start = 'npx @aa-ok99/ants';
  if (response.scripts.includes('test')) scripts.test = 'echo "No tests specified"';
  if (response.scripts.includes('build')) scripts.build = 'echo "Build not configured"';
  if (response.scripts.includes('deploy')) scripts.deploy = 'echo "Deploy not configured"';
  
  const extra = {};
  if (response.description) {
    extra.description = response.description;
  }
  
  try {
    const result = configUtil.create(projectDir, {
      name: response.name,
      version: response.version,
      extra: { scripts, ...extra }
    });
    
    logger.info(`Created ${configUtil.CONFIG_FILE}`);
    console.log(`\n✅ Created ${configUtil.CONFIG_FILE}`);
    console.log('\n📋 Next steps:');
    console.log('  1. Edit ants.config.json to customize');
    console.log('  2. Run `ants` to start');
    console.log('  3. Run `ants --help` for commands');
    console.log('\n🎉 Project initialized successfully!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
