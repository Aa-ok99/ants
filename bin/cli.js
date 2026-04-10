#!/usr/bin/env node
const program = require('../src/index');
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
program.parse(process.argv);
