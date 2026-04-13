#!/usr/bin/env node
const https = require('https');

https.get('https://ants-pied.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('📊 Ants API Status:');
    console.log(JSON.stringify(JSON.parse(data), null, 2));
  });
});
