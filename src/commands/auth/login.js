const prompts = require('prompts');
const auth = require('../../auth');
const api = require('../../api');
const logger = require('../../utils/logger');

async function run() {
  console.log('🔐 Login to Ants Platform\n');
  
  const response = await prompts([
    {
      type: 'text',
      name: 'email',
      message: 'Email',
      validate: v => v.includes('@') ? true : 'Please enter a valid email',
    },
    {
      type: 'password',
      name: 'password',
      message: 'Password',
      validate: v => v.length >= 6 ? true : 'Password must be at least 6 characters',
    },
  ]);
  
  if (!response.email || !response.password) {
    console.log('❌ Login cancelled');
    process.exit(1);
  }
  
  console.log('\n⏳ Authenticating...');
  
  try {
    const res = await api.post('/api/auth/login', {
      email: response.email,
      password: response.password,
    });
    
    if (res.status === 200 && res.data.token) {
      auth.save({
        email: response.email,
        token: res.data.token,
        loginAt: new Date().toISOString(),
      });
      
      console.log(`✅ Logged in as ${response.email}`);
      logger.info(`User logged in: ${response.email}`);
    } else {
      console.error('❌ Authentication failed');
      if (res.data?.message) {
        console.error(`   ${res.data.message}`);
      }
      process.exit(1);
    }
  } catch (err) {
    console.error(`❌ Login failed: ${err.message}`);
    logger.error('Login failed:', err.message);
    process.exit(1);
  }
}

run();
