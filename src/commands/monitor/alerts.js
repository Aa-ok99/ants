const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

const allFlag = process.argv.includes('--all');
const projectFlag = process.argv.includes('--project=')
  ? process.argv.find(a => a.startsWith('--project=')).split('=')[1]
  : null;

async function run() {
  console.log('🚨 Recent Alerts\n');
  
  const token = auth.getToken();
  
  try {
    let path = '/api/alerts';
    if (allFlag) path += '?all=true';
    if (projectFlag) path += `${path.includes('?') ? '&' : '?'}project=${projectFlag}`;
    
    const res = await api.get(path, { token });
    
    if (res.status === 200 && res.data?.alerts) {
      console.log('TIME'.padEnd(25) + 'LEVEL'.padEnd(10) + 'MESSAGE');
      console.log('─'.repeat(80));
      
      for (const alert of res.data.alerts) {
        const time = alert.timestamp || new Date().toISOString();
        const level = alert.level || 'warning';
        const msg = alert.message || '';
        console.log(time.padEnd(25) + level.padEnd(10) + msg);
      }
      
      console.log(`\n📊 Total: ${res.data.alerts.length} alert(s)`);
    } else {
      console.log('ℹ️  No recent alerts');
    }
  } catch (err) {
    console.log('ℹ️  No recent alerts');
    console.log(`   (API: ${err.message})`);
  }
}

run();
