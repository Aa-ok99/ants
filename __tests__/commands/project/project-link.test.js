const fs = require('fs');
const path = require('path');
const os = require('os');

const LINK_FILE = '.ants';

function getTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ants-link-test-'));
}

describe('project-link module', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = getTmpDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('saveLink creates .ants file', () => {
    const projectLink = require('../../../src/project-link');
    
    const result = projectLink.saveLink('proj_123', 'my-project', tmpDir);
    
    expect(result.projectId).toBe('proj_123');
    expect(result.projectName).toBe('my-project');
    expect(fs.existsSync(path.join(tmpDir, LINK_FILE))).toBe(true);
  });

  test('loadLink reads .ants file', () => {
    const projectLink = require('../../../src/project-link');
    
    projectLink.saveLink('proj_456', 'test-app', tmpDir);
    const loaded = projectLink.loadLink(tmpDir);
    
    expect(loaded.projectId).toBe('proj_456');
    expect(loaded.projectName).toBe('test-app');
    expect(loaded.linkedAt).toBeDefined();
  });

  test('removeLink deletes .ants file', () => {
    const projectLink = require('../../../src/project-link');
    
    projectLink.saveLink('proj_789', 'app', tmpDir);
    expect(fs.existsSync(path.join(tmpDir, LINK_FILE))).toBe(true);
    
    const removed = projectLink.removeLink(tmpDir);
    expect(removed).toBe(true);
    expect(fs.existsSync(path.join(tmpDir, LINK_FILE))).toBe(false);
  });

  test('isLinked returns correct state', () => {
    const projectLink = require('../../../src/project-link');
    
    expect(projectLink.isLinked(tmpDir)).toBe(false);
    
    projectLink.saveLink('proj_1', 'app', tmpDir);
    expect(projectLink.isLinked(tmpDir)).toBe(true);
  });

  test('loadLink searches parent directories', () => {
    const projectLink = require('../../../src/project-link');
    
    projectLink.saveLink('proj_root', 'root-app', tmpDir);
    
    const childDir = path.join(tmpDir, 'child', 'grandchild');
    fs.mkdirSync(childDir, { recursive: true });
    
    const loaded = projectLink.loadLink(childDir);
    expect(loaded.projectId).toBe('proj_root');
  });

  test('loadLink returns null when no link exists', () => {
    const projectLink = require('../../../src/project-link');
    
    expect(projectLink.loadLink(tmpDir)).toBeNull();
  });
});
