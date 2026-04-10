const { Command } = require('commander');
const packageJson = require('../package.json');
const { initCommand } = require('./commands/init');

const program = new Command();

program
  .name('ants')
  .description(packageJson.description)
  .version(packageJson.version);

program.addCommand(initCommand);

program.command('hello')
  .description('Say hello from Ants CLI')
  .action(() => {
    console.log('🐜 Hello! Ants CLI is ready to work.');
  });

module.exports = program;
