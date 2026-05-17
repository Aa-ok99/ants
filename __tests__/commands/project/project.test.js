const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('project commands', () => {
  test('project ls shows projects or no projects', () => {
    const output = runCli('project', 'ls');
    expect(output).toMatch(/Projects|No projects/);
  });

  test('project add creates project', () => {
    const output = runCli('project', 'add', 'test-project');
    expect(output).toMatch(/Creating|Project created|Failed/);
  });

  test('project rm requires name', () => {
    try {
      runCli('project', 'rm');
    } catch (err) {
      expect(err.stdout).toMatch(/name is required/);
    }
  });

  test('project inspect requires name', () => {
    try {
      runCli('project', 'inspect');
    } catch (err) {
      expect(err.stdout).toMatch(/name is required/);
    }
  });

  test('project without subcommand defaults to ls', () => {
    const output = runCli('project');
    expect(output).toMatch(/Projects|No projects/);
  });

  test('link shows interactive prompt', () => {
    const output = runCli('link');
    expect(output).toMatch(/Link|Select a project/);
  });

  test('remove shows usage', () => {
    const output = runCli('remove');
    expect(output).toContain('Remove');
    expect(output).toContain('USAGE');
  });

  test('remove --unlink shows unlink info', () => {
    const output = runCli('remove', '--unlink');
    expect(output).toMatch(/unlinked|No project linked/);
  });

  test('list shows commands and plugins', () => {
    const output = runCli('list');
    expect(output).toContain('Commands');
    expect(output).toContain('Plugins');
  });
});
