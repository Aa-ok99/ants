const https = require('https');
const pkg = require('../../../package.json');
const logger = require('../../utils/logger');

async function run() {
  console.log('🔄 Checking for updates...\n');
  console.log(`📦 Current version: ${pkg.version}`);
  
  try {
    const res = await fetchNpmVersion(pkg.name);
    
    if (res) {
      const latest = res.version;
      const current = pkg.version;
      
      if (latest !== current) {
        console.log(`🆕 Latest version: ${latest}`);
        console.log(`\n⬆️  Update available!`);
        console.log(`   Run: npm install -g ${pkg.name}`);
        logger.info(`Update available: ${current} → ${latest}`);
      } else {
        console.log(`\n✅ Already up to date`);
      }
    } else {
      console.log('\n⚠️  Could not check for updates');
    }
  } catch (err) {
    console.log(`\n⚠️  Update check failed: ${err.message}`);
  }
}

function fetchNpmVersion(name) {
  return new Promise((resolve) => {
    https.get(`https://registry.npmjs.org/${name}/latest`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (_) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

run();
