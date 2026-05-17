const fs = require('fs');
const path = require('path');
const os = require('os');
const configUtil = require('../src/utils/config');

describe('config utility', () => {
  let tmpDir;
  
  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ants-test-'));
  });
  
  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });
  
  test('create writes config file', () => {
    const result = configUtil.create(tmpDir, { name: 'test-project' });
    
    expect(result.exists).toBe(false);
    expect(fs.existsSync(result.path)).toBe(true);
    
    const content = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    expect(content.name).toBe('test-project');
    expect(content.ants.api).toBe('https://ants-pied.vercel.app');
  });
  
  test('create does not overwrite existing', () => {
    configUtil.create(tmpDir, { name: 'first' });
    const result = configUtil.create(tmpDir, { name: 'second' });
    
    expect(result.exists).toBe(true);
    
    const content = JSON.parse(fs.readFileSync(result.path, 'utf8'));
    expect(content.name).toBe('first');
  });
  
  test('load reads config file', () => {
    configUtil.create(tmpDir, { name: 'load-test', version: '2.0.0' });
    
    const config = configUtil.load(tmpDir);
    
    expect(config).not.toBeNull();
    expect(config.name).toBe('load-test');
    expect(config.version).toBe('2.0.0');
    expect(config._path).toBeDefined();
  });
  
  test('load returns null when no config', () => {
    const config = configUtil.load(tmpDir);
    expect(config).toBeNull();
  });
  
  test('save updates config file', () => {
    configUtil.create(tmpDir, { name: 'save-test' });
    const config = configUtil.load(tmpDir);
    
    config.name = 'updated-name';
    configUtil.save(config);
    
    const reloaded = configUtil.load(tmpDir);
    expect(reloaded.name).toBe('updated-name');
  });
});
