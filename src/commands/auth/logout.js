const auth = require('../../auth');
const logger = require('../../utils/logger');

function run() {
  const current = auth.load();
  
  if (!current) {
    console.log('ℹ️  Not logged in');
    return;
  }
  
  auth.clear();
  logger.info('User logged out');
  console.log('✅ Logged out successfully');
}

run();
