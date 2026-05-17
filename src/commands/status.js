const https = require('https');
const configUtil = require('../utils/config');
const logger = require('../utils/logger');

function checkApi(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const req = https.get(url, { timeout }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const ms = Date.now() - start;
        resolve({ status: res.statusCode, data: JSON.parse(data), ms });
      });
    });
    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });
  });
}

async function run() {
  const config = configUtil.load();
  const apiUrl = config?.ants?.api || configUtil.API_BASE;
  
  console.log('📊 Checking Ants API status...\n');
  console.log(`🌐 URL: ${apiUrl}`);
  
  try {
    const result = await checkApi(apiUrl);
    
    console.log(`\n✅ Status: ${result.status === 200 ? 'OK' : 'ERROR'} (${result.status})`);
    console.log(`⏱️  Response time: ${result.ms}ms`);
    console.log('\n📦 Response:');
    console.log(JSON.stringify(result.data, null, 2));
    
    if (config) {
      console.log('\n⚙️  Config:');
      console.log(`   File: ${config._path}`);
      console.log(`   Project: ${config.name || 'unnamed'}`);
      console.log(`   Version: ${config.version || 'unknown'}`);
    } else {
      console.log('\n⚠️  No ants.config.json found');
      console.log('💡 Run `ants init` to create one');
    }
  } catch (err) {
    console.error(`\n❌ API unreachable: ${err.message}`);
    logger.error('Status check failed:', err.message);
    process.exit(1);
  }
}

run();
