const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('plugin commands', () => {
  test('plugin list shows plugins', () => {
    const output = runCli('plugin', 'list');
    expect(output).toMatch(/Plugins|No plugins/);
  });

  test('plugin add creates plugin file', () => {
    const uniqueName = `test-plugin-${Date.now()}`;
    const output = runCli('plugin', 'add', uniqueName);
    expect(output).toContain('Plugin added');
    expect(output).toContain(uniqueName);
  });

  test('plugin rm removes plugin file', () => {
    runCli('plugin', 'add', 'to-remove');
    const output = runCli('plugin', 'rm', 'to-remove');
    expect(output).toContain('Plugin removed');
    expect(output).toContain('to-remove');
  });

  test('plugin discover shows available plugins', () => {
    const output = runCli('plugin', 'discover');
    expect(output).toContain('Discover');
    expect(output).toContain('hello');
    expect(output).toContain('plugin add');
  });

  test('plugin without subcommand defaults to list', () => {
    const output = runCli('plugin');
    expect(output).toMatch(/Plugins|plugin list/);
  });
});
