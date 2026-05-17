const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

const url = process.argv[2];

async function run() {
  if (!url) {
    console.log('⏪ Rollback to a previous deployment\n');
    console.log('USAGE:');
    console.log('  ants rollback [deployment-url]');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  ants rollback https://my-project-xyz789.vercel.app');
    process.exit(0);
  }
  
  console.log(`⏪ Rolling back to: ${url}\n`);
  
  const token = auth.requireAuth();
  
  try {
    const res = await api.post(`/api/deploy/${encodeURIComponent(url)}/rollback`, {}, { token });
    
    if (res.status === 200) {
      console.log('✅ Rollback completed!');
      console.log(`🌐 URL: ${url}`);
      logger.info(`Rolled back to: ${url}`);
    } else {
      console.error(`❌ Rollback failed: ${res.status}`);
      if (res.data?.message) {
        console.error(`   ${res.data.message}`);
      }
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Rollback failed: ${err.message}`);
    logger.error('Rollback failed:', err.message);
    process.exit(1);
  }
}

run();
