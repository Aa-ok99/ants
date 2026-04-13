#!/usr/bin/env node

const args = process.argv.slice(2);
const pkg = require('../package.json');
// จัดการ status
if (args[0] === 'status') {
  require('../src/commands/status');
  process.exit(0);
}
// จัดการ init command
if (args[0] === 'init') {
  require('../src/commands/init');
  process.exit(0);
}

// จัดการ --help
if (args[0] === '--help' || args[0] === '-h') {
  console.log(`
🐜 Ants CLI - Automation Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Version: ${pkg.version}
✅ API: https://ants-pied.vercel.app

COMMANDS:
  ants init          Initialize new project
  ants --help        Show this help
  ants --version     Show version
  ants [command]     Run custom command

EXAMPLES:
  $ npx @aa-ok99/ants init
  $ npx @aa-ok99/ants --version

📚 Documentation: https://github.com/Aa-ok99/ants
`);
  process.exit(0);
}

// จัดการ --version
if (args[0] === '--version' || args[0] === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

// Default
console.log(`
🐜 Ants CLI - Automation Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ready to automate! (v${pkg.version})

💡 Run 'ants --help' to see available commands
🌐 API: https://ants-pied.vercel.app
`);
