#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();

program
  .name('ants')
  .description('🐜 Ants CLI v0.1.0')
  .version('0.1.0');

// 👇 ตรงนี้คุณจะวางโค้ดจาก index.js.bak ต่อได้เลย
program.command('hello')
  .description('ทดสอบระบบ')
  .action(() => console.log('👋 Ants พร้อมใช้งาน!'));

program.parse(process.argv);
