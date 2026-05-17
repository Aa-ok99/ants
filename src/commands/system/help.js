const pkg = require('../../../package.json');

const command = process.argv[3];

const helpTexts = {
  init: `
🚀 Initialize a new project

USAGE:
  ants init

Creates ants.config.json with an interactive wizard.
`,

  deploy: `
📦 Deploy your project

USAGE:
  ants deploy            Deploy to preview
  ants deploy --prod     Deploy to production
  ants deploy --target=staging  Deploy to custom target

OPTIONS:
  --prod       Deploy to production
  --target=X   Deploy to specific environment
`,

  env: `
⚙️  Manage environment variables

USAGE:
  ants env ls                  List variables
  ants env add <name> [value]  Add variable
  ants env rm <name>           Remove variable
  ants env pull [file]         Pull to .env file
  ants env run -- <command>    Run with env loaded
`,

  login: `
🔐 Login to your account

USAGE:
  ants login

Authenticates with email/password and stores token locally.
`,

  logs: `
📋 View deployment logs

USAGE:
  ants logs [deployment-url]     View recent logs
  ants logs [url] --follow       Stream logs
  ants logs [url] --lines=100    Show last 100 lines
`,

  project: `
📁 Manage projects

USAGE:
  ants project ls          List all projects
  ants project add [name]  Create new project
  ants project rm [name]   Remove a project
  ants project inspect     Show project details
`,

  plugin: `
🔌 Manage plugins

USAGE:
  ants plugin list          List installed plugins
  ants plugin add <name>    Install a plugin
  ants plugin rm <name>     Remove a plugin
  ants plugin discover      Discover available plugins
`,

  config: `
⚙️  Manage configuration

USAGE:
  ants config              Show full config
  ants config show         Show full config
  ants config get <key>    Get specific key
  ants config set <k> <v>  Set a value

EXAMPLES:
  ants config get name
  ants config set ants.api https://my-api.com
`,

  status: `
📊 Check API status

USAGE:
  ants status

Checks the API connection and shows response time.
`,
};

function run() {
  if (command && helpTexts[command]) {
    console.log(helpTexts[command]);
  } else if (command) {
    console.log(`ℹ️  No detailed help available for: ${command}`);
    console.log('💡 Run `ants help` to see all commands');
  } else {
    console.log(`
🐜 Ants CLI - Full-Stack Automation Platform v${pkg.version}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Run 'ants --help' to see all available commands.

For detailed help on a specific command:
  ants help <command>

EXAMPLES:
  ants help deploy
  ants help env
  ants help login
`);
  }
}

run();
