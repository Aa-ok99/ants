const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

const url = process.argv[3] || process.argv[2];

async function run() {
  if (!url || url === 'promote') {
    console.log('📈 Promote a deployment to production\n');
    console.log('USAGE:');
    console.log('  ants promote [deployment-url]');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  ants promote https://my-project-abc123.vercel.app');
    process.exit(0);
  }
  
  console.log(`📈 Promoting to production: ${url}\n`);
  
  const token = auth.requireAuth();
  
  try {
    const res = await api.post(`/api/deploy/${encodeURIComponent(url)}/promote`, {}, { token });
    
    if (res.status === 200) {
      console.log('✅ Deployment promoted to production!');
      console.log(`🌐 URL: ${url}`);
      logger.info(`Promoted deployment: ${url}`);
    } else {
      console.error(`❌ Promotion failed: ${res.status}`);
      if (res.data?.message) {
        console.error(`   ${res.data.message}`);
      }
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Promotion failed: ${err.message}`);
    logger.error('Promotion failed:', err.message);
    process.exit(1);
  }
}

run();
