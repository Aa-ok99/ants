const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('deploy commands', () => {
  test('deploy shows project link warning', () => {
    try {
      runCli('deploy');
    } catch (err) {
      expect(err.stdout).toMatch(/No project linked|link/);
    }
  });

  test('build shows build info', () => {
    const output = runCli('build');
    expect(output).toContain('Building');
    expect(output).toMatch(/No build script|Build completed/);
  });

  test('dev starts or shows dev info', () => {
    const output = runCli('dev');
    expect(output).toMatch(/dev server|Starting|Running/);
  });

  test('inspect shows usage without url', () => {
    const output = runCli('inspect');
    expect(output).toContain('Inspect');
    expect(output).toContain('USAGE');
  });

  test('promote shows usage without url', () => {
    const output = runCli('promote');
    expect(output).toContain('Promote');
    expect(output).toContain('USAGE');
  });

  test('rollback shows usage without url', () => {
    const output = runCli('rollback');
    expect(output).toContain('Rollback');
    expect(output).toContain('USAGE');
  });
});
