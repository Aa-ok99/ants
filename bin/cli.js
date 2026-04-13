#!/usr/bin/env node

const args = process.argv.slice(2);

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
✅ Version: 1.0.2
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
  const pkg = require('../package.json');
  console.log(`${pkg.version}`);
  process.exit(0);
}

// Default
console.log(`
🐜 Ants CLI - Automation Tool
━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Ready to automate!

💡 Run 'ants --help' to see available commands
🌐 API: https://ants-pied.vercel.app
`);

// เรียกใช้ main index.js (ถ้ามี)
try {
  require('../src/index');
} catch (e) {
  // ไม่มี index ก็ไม่เป็นไร
}
