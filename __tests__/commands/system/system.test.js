const { execSync } = require('child_process');
const path = require('path');

const CLI = path.join(__dirname, '..', '..', '..', 'bin', 'cli.js');

function runCli(...args) {
  return execSync(`node ${CLI} ${args.join(' ')}`, {
    encoding: 'utf8',
    env: { ...process.env, HOME: process.env.HOME },
  });
}

describe('system commands', () => {
  test('telemetry status shows current state', () => {
    const output = runCli('telemetry');
    expect(output).toMatch(/Telemetry.*enabled|Telemetry.*disabled/);
  });

  test('telemetry enable works', () => {
    const output = runCli('telemetry', 'enable');
    expect(output).toContain('Telemetry enabled');
  });

  test('telemetry disable works', () => {
    const output = runCli('telemetry', 'disable');
    expect(output).toContain('Telemetry disabled');
  });

  test('update checks for new version', () => {
    const output = runCli('update');
    expect(output).toContain('Checking');
    expect(output).toContain('Current version');
  });

  test('help shows all commands', () => {
    const output = runCli('help');
    expect(output).toContain('Ants CLI');
    expect(output).toContain('help <command>');
  });

  test('help deploy shows deploy help', () => {
    const output = runCli('help', 'deploy');
    expect(output).toContain('Deploy');
    expect(output).toContain('--prod');
  });

  test('help env shows env help', () => {
    const output = runCli('help', 'env');
    expect(output).toMatch(/environment|env ls/i);
  });

  test('help login shows login help', () => {
    const output = runCli('help', 'login');
    expect(output).toContain('Login');
  });

  test('help project shows project help', () => {
    const output = runCli('help', 'project');
    expect(output).toContain('Manage projects');
  });

  test('help plugin shows plugin help', () => {
    const output = runCli('help', 'plugin');
    expect(output).toContain('Manage plugins');
  });

  test('help config shows config help', () => {
    const output = runCli('help', 'config');
    expect(output).toContain('Manage configuration');
  });

  test('help status shows status help', () => {
    const output = runCli('help', 'status');
    expect(output).toContain('status');
  });

  test('help logs shows logs help', () => {
    const output = runCli('help', 'logs');
    expect(output).toContain('logs');
  });
});
