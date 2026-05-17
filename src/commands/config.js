const configUtil = require('../utils/config');
const logger = require('../utils/logger');

const action = process.argv[3];

function show() {
  const config = configUtil.load();
  if (!config) {
    console.log('⚠️  No ants.config.json found');
    console.log('💡 Run `ants init` to create one');
    return;
  }
  
  console.log('⚙️  Configuration:');
  console.log(`📄 File: ${config._path}`);
  console.log('');
  
  const { _path, ...data } = config;
  console.log(JSON.stringify(data, null, 2));
}

function showKey(key) {
  const config = configUtil.load();
  if (!config) {
    console.log('⚠️  No config found');
    return;
  }
  
  const parts = key.split('.');
  let val = config;
  for (const p of parts) {
    if (val[p] === undefined) {
      console.log(`⚠️  Key '${key}' not found`);
      return;
    }
    val = val[p];
  }
  
  if (typeof val === 'object') {
    console.log(JSON.stringify(val, null, 2));
  } else {
    console.log(val);
  }
}

function setKey(key, value) {
  const config = configUtil.load();
  if (!config) {
    console.log('⚠️  No config found');
    console.log('💡 Run `ants init` to create one');
    return;
  }
  
  const parts = key.split('.');
  let obj = config;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!obj[parts[i]]) obj[parts[i]] = {};
    obj = obj[parts[i]];
  }
  
  const lastKey = parts[parts.length - 1];
  try {
    obj[lastKey] = JSON.parse(value);
  } catch (_) {
    obj[lastKey] = value;
  }
  
  configUtil.save(config);
  logger.info(`Set ${key} = ${value}`);
  console.log(`✅ Set ${key} = ${value}`);
}

if (!action || action === 'show') {
  show();
} else if (action === 'get' && process.argv[4]) {
  showKey(process.argv[4]);
} else if (action === 'set' && process.argv[4] && process.argv[5]) {
  setKey(process.argv[4], process.argv[5]);
} else {
  console.log(`
⚙️  Config Management

USAGE:
  ants config              Show full config
  ants config show         Show full config
  ants config get <key>    Get a specific key (dot notation)
  ants config set <k> <v>  Set a key value

EXAMPLES:
  ants config get name
  ants config get ants.api
  ants config set name my-project
  ants config set ants.api https://my-api.com
`);
}
