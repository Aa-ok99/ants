#!/usr/bin/env node

const args = process.argv.slice(2);
const pkg = require('../package.json');
const logger = require('../src/utils/logger');
const pluginLoader = require('../src/utils/plugin-loader');

const verbose = args.includes('--verbose') || args.includes('-V');
const debug = args.includes('--debug');

if (verbose || debug) {
  logger.setLevel(debug ? 'debug' : 'info');
}

logger.debug('CLI starting', { version: pkg.version, args });

const plugins = pluginLoader.load();
logger.debug(`Loaded ${plugins.length} plugin(s)`);

const command = args[0];
const subcommand = args[1];

const commandMap = {
  init: 'init',
  status: 'status',
  config: 'config',
  run: 'run',
  list: 'list',
  login: 'auth/login',
  logout: 'auth/logout',
  whoami: 'auth/whoami',
  deploy: 'deploy/deploy',
  build: 'deploy/build',
  dev: 'deploy/dev',
  inspect: 'deploy/inspect',
  promote: 'deploy/promote',
  rollback: 'deploy/rollback',
  env: 'env/env',
  project: 'project/project',
  link: 'project/link',
  remove: 'project/remove',
  logs: 'monitor/logs',
  metrics: 'monitor/metrics',
  alerts: 'monitor/alerts',
  analytics: 'monitor/analytics',
  routes: 'config/routes',
  redirects: 'config/redirects',
  flags: 'config/flags',
  target: 'config/target',
  validate: 'config/validate',
  plugin: 'plugin/plugin',
  telemetry: 'system/telemetry',
  update: 'system/update',
  help: 'system/help',
  completion: 'system/completion',
};

function showHelp() {
  console.log(`
🐜 Ants CLI - Full-Stack Automation Platform v${pkg.version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AUTH:
  ants login              Login to your account
  ants logout             Logout from current account
  ants whoami             Display current user

PROJECT:
  ants init               Initialize new project (interactive wizard)
  ants link               Link local directory to a project
  ants list               List recent deployments
  ants project ls         List all projects
  ants project add        Create new project
  ants project rm         Remove a project
  ants remove             Remove deployment or project

DEPLOY:
  ants deploy             Deploy project (default: preview)
  ants deploy --prod      Deploy to production
  ants build              Build project locally
  ants dev                Start local dev server
  ants inspect [url]      Inspect deployment details
  ants promote [url]      Promote deployment to production
  ants rollback [url]     Rollback to previous deployment

ENVIRONMENT:
  ants env ls             List environment variables
  ants env add [name]     Add environment variable
  ants env rm [name]      Remove environment variable
  ants env pull [file]    Pull env vars to local file
  ants env run -- <cmd>   Run command with env vars loaded

MONITORING:
  ants status             Check API connection status
  ants logs [url]         View deployment logs
  ants metrics [name]     Query observability metrics
  ants alerts             View recent alerts
  ants analytics          View usage analytics

CONFIG:
  ants config             Show or manage configuration
  ants validate           Validate ants.config.json
  ants routes list        List routing rules
  ants routes add         Add routing rule
  ants redirects list     List redirects
  ants redirects add      Add redirect
  ants flags list         List feature flags
  ants target list        List environments/targets

SCRIPTS:
  ants run [script]       Run a script from config
  ants scripts            List available scripts

PLUGINS:
  ants plugin list        List installed plugins
  ants plugin add <name>  Install a plugin
  ants plugin rm <name>   Remove a plugin
  ants plugin discover    Discover available plugins

SYSTEM:
  ants telemetry          Manage telemetry settings
  ants update             Check for CLI updates
  ants help [command]     Show help for a command
  ants completion [shell] Generate shell completion (bash/zsh)
  ants --version          Show version
  ants --verbose          Enable verbose logging
  ants --debug            Enable debug logging
  ants --json             Output as JSON (for automation)

EXAMPLES:
  $ ants init
  $ ants deploy --prod
  $ ants env add API_KEY secret123
  $ ants env pull .env
  $ ants logs --follow
  $ ants plugin discover

📚 Documentation: https://github.com/aa-ok99/ants
🌐 API: https://ants-pied.vercel.app
`);
}

if (command === '--help' || command === '-h') {
  showHelp();
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

if (!command) {
  console.log(`
🐜 Ants CLI - Automation Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ready to automate! (v${pkg.version})
📦 Plugins: ${plugins.length} loaded

💡 Run 'ants help' to see all commands
🌐 API: https://ants-pied.vercel.app
`);
  process.exit(0);
}

const modulePath = commandMap[command];

if (modulePath) {
  try {
    require(`../src/commands/${modulePath}`);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      logger.error(`Command '${command}' not found`);
      console.error(`❌ Command '${command}' not implemented yet`);
      console.log('💡 Run `ants help` to see available commands');
    } else {
      logger.error(`Command '${command}' failed:`, err.message);
      if (debug) {
        console.error(err.stack);
      } else {
        console.error(`❌ Error: ${err.message}`);
      }
    }
    process.exit(1);
  }
} else {
  console.log(`❌ Unknown command: ${command}`);
  console.log('💡 Run `ants help` to see available commands');
  process.exit(1);
}
