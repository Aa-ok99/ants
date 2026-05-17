const auth = require('../../auth');

function run() {
  const current = auth.load();
  
  if (!current) {
    console.log('ℹ️  Not logged in');
    console.log('💡 Run `ants login` to authenticate');
    return;
  }
  
  console.log(`👤 ${current.email}`);
  console.log(`📅 Logged in: ${current.loginAt || 'unknown'}`);
  console.log(`🔑 Token: ${current.token?.substring(0, 12)}...`);
}

run();
