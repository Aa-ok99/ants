const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

const url = process.argv[3];
const follow = process.argv.includes('--follow') || process.argv.includes('-f');
const lines = process.argv.includes('--lines=') 
  ? parseInt(process.argv.find(a => a.startsWith('--lines=')).split('=')[1]) 
  : 50;

async function run() {
  if (!url) {
    console.log('📋 View deployment logs\n');
    console.log('USAGE:');
    console.log('  ants logs [deployment-url]     View recent logs');
    console.log('  ants logs [url] --follow       Stream logs in real-time');
    console.log('  ants logs [url] --lines=100    Show last 100 lines');
    process.exit(0);
  }
  
  console.log(`📋 Logs for: ${url}${follow ? ' (following)' : ''}\n`);
  console.log('─'.repeat(80));
  
  const token = auth.getToken();
  
  try {
    const res = await api.get(`/api/logs/${encodeURIComponent(url)}?lines=${lines}`, { token });
    
    if (res.status === 200 && res.data?.logs) {
      for (const log of res.data.logs) {
        const timestamp = log.timestamp || new Date().toISOString();
        const level = log.level || 'INFO';
        console.log(`[${timestamp}] [${level}] ${log.message}`);
      }
      
      if (follow) {
        console.log('\n📡 Streaming logs... (Ctrl+C to stop)');
        console.log('⚠️  Real-time streaming requires API support');
      }
    } else {
      console.log('ℹ️  No logs found for this deployment');
    }
  } catch (err) {
    console.log('ℹ️  No logs found');
    console.log(`   (API: ${err.message})`);
  }
}

run();
