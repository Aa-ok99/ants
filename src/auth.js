const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const logger = require('./utils/logger');

const AUTH_DIR = path.join(os.homedir(), '.config', 'ants');
const AUTH_FILE = path.join(AUTH_DIR, 'auth.json');

function ensureDir() {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
}

function load() {
  if (!fs.existsSync(AUTH_FILE)) {
    return null;
  }
  
  try {
    const raw = fs.readFileSync(AUTH_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    logger.warn('Failed to load auth:', err.message);
    return null;
  }
}

function save(auth) {
  ensureDir();
  fs.writeFileSync(AUTH_FILE, JSON.stringify(auth, null, 2));
}

function clear() {
  if (fs.existsSync(AUTH_FILE)) {
    fs.unlinkSync(AUTH_FILE);
  }
}

function generateToken() {
  return `ants_${crypto.randomBytes(32).toString('hex')}`;
}

function getToken() {
  const envToken = process.env.ANTS_TOKEN;
  if (envToken) {
    return envToken;
  }
  
  const auth = load();
  return auth?.token || null;
}

function isLoggedIn() {
  return getToken() !== null;
}

function requireAuth() {
  const token = getToken();
  if (!token) {
    console.error('❌ Not logged in');
    console.log('💡 Run `ants login` to authenticate');
    process.exit(1);
  }
  return token;
}

module.exports = {
  load,
  save,
  clear,
  generateToken,
  getToken,
  isLoggedIn,
  requireAuth,
  AUTH_FILE,
};
