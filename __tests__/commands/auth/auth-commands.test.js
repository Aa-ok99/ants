const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('auth commands', () => {
  test('login shows interactive prompt', () => {
    const output = runCli('login');
    expect(output).toContain('Login');
    expect(output).toContain('Email');
  });

  test('logout shows status', () => {
    const output = runCli('logout');
    expect(output).toMatch(/Logged out|Not logged in/);
  });

  test('whoami shows user info or not logged in', () => {
    const output = runCli('whoami');
    expect(output).toMatch(/Not logged in|@/);
  });
});
