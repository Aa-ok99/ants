const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('CLI parsing', () => {
  test('--help shows help text', () => {
    const output = runCli('--help');
    
    expect(output).toContain('Ants CLI');
    expect(output).toContain('AUTH:');
    expect(output).toContain('PROJECT:');
    expect(output).toContain('DEPLOY:');
    expect(output).toContain('ENVIRONMENT:');
    expect(output).toContain('ants init');
    expect(output).toContain('ants deploy');
    expect(output).toContain('ants env');
    expect(output).toContain('ants login');
    expect(output).toContain('ants logs');
    expect(output).toContain('ants plugin');
  });
  
  test('-h shows help text', () => {
    const output = runCli('-h');
    expect(output).toContain('Ants CLI');
  });
  
  test('--version shows version', () => {
    const output = runCli('--version');
    const version = output.trim();
    
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
  
  test('-v shows version', () => {
    const output = runCli('-v');
    const version = output.trim();
    
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
  
  test('no args shows welcome message', () => {
    const output = runCli();
    
    expect(output).toContain('Ready to automate!');
    expect(output).toContain('ants help');
  });
  
  test('unknown command shows error', () => {
    try {
      runCli('foobar');
      fail('Should have exited with error');
    } catch (err) {
      expect(err.stdout).toContain('Unknown command');
      expect(err.stdout).toContain('ants help');
    }
  });
});
