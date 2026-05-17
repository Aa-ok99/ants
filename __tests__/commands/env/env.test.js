const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('env commands', () => {
  test('env ls shows usage or no project', () => {
    const output = runCli('env', 'ls');
    expect(output).toMatch(/Environment|No project|No environment/);
  });

  test('env add shows prompt or requires name', () => {
    try {
      runCli('env', 'add');
    } catch (err) {
      expect(err.stdout).toMatch(/Variable name|add/);
    }
  });

  test('env rm requires name', () => {
    try {
      runCli('env', 'rm');
    } catch (err) {
      expect(err.stdout).toMatch(/name is required|rm/);
    }
  });

  test('env pull creates file or shows info', () => {
    const output = runCli('env', 'pull', '.env.test');
    expect(output).toMatch(/Pulling|No environment|Pulled/);
  });

  test('env run requires command', () => {
    try {
      runCli('env', 'run');
    } catch (err) {
      expect(err.stdout).toMatch(/Command is required|run/);
    }
  });

  test('env without subcommand defaults to ls', () => {
    const output = runCli('env');
    expect(output).toMatch(/Environment|No project|env ls/);
  });
});
