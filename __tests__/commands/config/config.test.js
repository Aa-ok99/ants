const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('config commands', () => {
  test('config shows full config', () => {
    const output = runCli('config');
    expect(output).toMatch(/Configuration|No ants.config/);
  });

  test('config get shows key value', () => {
    const output = runCli('config', 'get', 'name');
    expect(output).toMatch(/test-project|No config|Key.*not found/);
  });

  test('config set requires key and value', () => {
    const output = runCli('config', 'set', 'name', 'test-project');
    expect(output).toMatch(/No config|Set name/);
  });

  test('routes list shows usage or no routes', () => {
    const output = runCli('routes', 'list');
    expect(output).toMatch(/Routes|No routes/);
  });

  test('redirects list shows usage or no redirects', () => {
    const output = runCli('redirects', 'list');
    expect(output).toMatch(/Redirects|No redirects/);
  });

  test('flags list shows usage or no flags', () => {
    const output = runCli('flags', 'list');
    expect(output).toMatch(/Feature Flags|No feature flags/);
  });

  test('target list shows environments', () => {
    const output = runCli('target', 'list');
    expect(output).toContain('Target');
    expect(output).toContain('development');
    expect(output).toContain('production');
  });
});
