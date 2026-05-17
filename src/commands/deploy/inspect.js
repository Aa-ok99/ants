const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

const url = process.argv[2];

async function run() {
  if (!url) {
    console.log('🔍 Inspect a deployment\n');
    console.log('USAGE:');
    console.log('  ants inspect [deployment-url]');
    console.log('  ants inspect [deployment-id]');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  ants inspect https://my-project.vercel.app');
    console.log('  ants inspect dpl_abc123');
    process.exit(0);
  }
  
  console.log(`🔍 Inspecting deployment: ${url}\n`);
  
  const token = auth.getToken();
  
  try {
    const res = await api.get(`/api/deploy/${encodeURIComponent(url)}`, { token });
    
    if (res.status === 200 && res.data) {
      const d = res.data;
      console.log('📋 Deployment Details:');
      console.log(`   URL: ${d.url || url}`);
      console.log(`   Status: ${d.status || 'unknown'}`);
      console.log(`   Created: ${d.createdAt || 'unknown'}`);
      console.log(`   Environment: ${d.production ? 'production' : 'preview'}`);
      
      if (d.builds) {
        console.log(`\n📦 Builds:`);
        for (const b of d.builds) {
          console.log(`   - ${b.name}: ${b.status}`);
        }
      }
      
      logger.info(`Inspected deployment: ${url}`);
    } else {
      console.error(`❌ Deployment not found: ${url}`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Failed to inspect: ${err.message}`);
    logger.error('Inspect failed:', err.message);
    process.exit(1);
  }
}

run();
