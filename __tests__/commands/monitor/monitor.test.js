const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('monitor commands', () => {
  test('logs shows usage without url', () => {
    const output = runCli('logs');
    expect(output).toContain('logs');
    expect(output).toContain('USAGE');
    expect(output).toContain('--follow');
  });

  test('metrics shows available metrics', () => {
    const output = runCli('metrics');
    expect(output).toContain('Metrics');
    expect(output).toContain('ants.request.count');
  });

  test('alerts shows alerts or no alerts', () => {
    const output = runCli('alerts');
    expect(output).toMatch(/Alerts|No recent alerts/);
  });
});
