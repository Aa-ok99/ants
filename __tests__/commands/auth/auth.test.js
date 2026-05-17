const fs = require('fs');
const path = require('path');
const os = require('os');

const AUTH_DIR = path.join(os.homedir(), '.config', 'ants');
const AUTH_FILE = path.join(AUTH_DIR, 'auth.json');

function clearAuth() {
  if (fs.existsSync(AUTH_FILE)) {
    fs.unlinkSync(AUTH_FILE);
  }
}

function mockAuth(data) {
  if (!fs.existsSync(AUTH_DIR)) {
    fs.mkdirSync(AUTH_DIR, { recursive: true });
  }
  fs.writeFileSync(AUTH_FILE, JSON.stringify(data));
}

describe('auth module', () => {
  beforeEach(() => clearAuth());
  afterAll(() => clearAuth());

  test('load returns null when no auth file', () => {
    const auth = require('../../../src/auth');
    expect(auth.load()).toBeNull();
  });

  test('save and load auth', () => {
    const auth = require('../../../src/auth');
    const data = { email: 'test@example.com', token: 'ants_abc123', loginAt: '2026-01-01' };
    
    auth.save(data);
    const loaded = auth.load();
    
    expect(loaded.email).toBe('test@example.com');
    expect(loaded.token).toBe('ants_abc123');
  });

  test('clear removes auth file', () => {
    const auth = require('../../../src/auth');
    auth.save({ email: 'test@example.com', token: 'ants_abc' });
    expect(fs.existsSync(AUTH_FILE)).toBe(true);
    
    auth.clear();
    expect(fs.existsSync(AUTH_FILE)).toBe(false);
  });

  test('generateToken creates valid token', () => {
    const auth = require('../../../src/auth');
    const token = auth.generateToken();
    
    expect(token.startsWith('ants_')).toBe(true);
    expect(token.length).toBeGreaterThan(10);
  });

  test('getToken reads from env first', () => {
    const auth = require('../../../src/auth');
    process.env.ANTS_TOKEN = 'env_token_123';
    
    expect(auth.getToken()).toBe('env_token_123');
    
    delete process.env.ANTS_TOKEN;
  });

  test('isLoggedIn returns correct state', () => {
    const auth = require('../../../src/auth');
    
    expect(auth.isLoggedIn()).toBe(false);
    
    auth.save({ email: 'test@example.com', token: 'ants_abc' });
    expect(auth.isLoggedIn()).toBe(true);
    
    auth.clear();
  });
});
