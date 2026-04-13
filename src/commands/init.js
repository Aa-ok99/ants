#!/usr/bin/env node

console.log('🚀 Initializing new Ants project...');

const fs = require('fs');
const path = require('path');

try {
  const projectDir = process.cwd();
  
  // ตรวจสอบว่า有没有 ants.config.json แล้ว
  const configPath = path.join(projectDir, 'ants.config.json');
  
  if (fs.existsSync(configPath)) {
    console.log('⚠️  ants.config.json already exists!');
    console.log('💡 Run `rm ants.config.json` first if you want to reinitialize');
    process.exit(0);
  }
  
  // สร้าง config
  const config = {
    name: path.basename(projectDir),
    version: '1.0.0',
    created: new Date().toISOString(),
    ants: {
      api: 'https://ants-pied.vercel.app',
      status: 'ready'
    },
    scripts: {
      start: 'npx @aa-ok99/ants',
      test: 'echo "No tests specified"'
    }
  };
  
  fs.writeFileSync('ants.config.json', JSON.stringify(config, null, 2));
  console.log('✅ Created ants.config.json');
  console.log('\n📋 Next steps:');
  console.log('  1. Edit ants.config.json to customize');
  console.log('  2. Run `npx @aa-ok99/ants` to start');
  console.log('\n🎉 Project initialized successfully!');
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
