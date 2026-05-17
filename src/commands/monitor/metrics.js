const api = require('../../api');
const auth = require('../../auth');
const logger = require('../../utils/logger');

const metricName = process.argv[3];

async function run() {
  if (!metricName) {
    console.log('📊 Observability Metrics\n');
    console.log('USAGE:');
    console.log('  ants metrics [name]  Query a specific metric');
    console.log('');
    console.log('AVAILABLE METRICS:');
    console.log('  ants.request.count    Total request count');
    console.log('  ants.request.duration Request duration');
    console.log('  ants.error.rate       Error rate');
    console.log('  ants.cpu.usage        CPU usage');
    console.log('  ants.memory.usage     Memory usage');
    process.exit(0);
  }
  
  console.log(`📊 Querying metric: ${metricName}\n`);
  
  const token = auth.getToken();
  
  try {
    const res = await api.get(`/api/metrics/${metricName}`, { token });
    
    if (res.status === 200 && res.data) {
      console.log('📈 Results:');
      console.log(JSON.stringify(res.data, null, 2));
    } else {
      console.log(`ℹ️  No data for metric: ${metricName}`);
    }
  } catch (err) {
    console.log(`ℹ️  No data for metric: ${metricName}`);
    console.log(`   (API: ${err.message})`);
  }
}

run();
