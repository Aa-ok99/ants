const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const logger = require('../../utils/logger');

const portArg = process.argv.find(a => a.startsWith('--port='));
const port = portArg ? parseInt(portArg.split('=')[1]) : 3000;

function run() {
  console.log(`🔧 Starting local dev server on port ${port}...\n`);
  
  const devScript = detectDevScript();
  
  if (!devScript) {
    startStaticServer();
    return;
  }
  
  console.log(`📦 Running: ${devScript}\n`);
  logger.info(`Starting dev server: ${devScript}`);
  
  const child = spawn(devScript, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: port.toString() },
  });
  
  child.on('close', code => {
    if (code !== 0) {
      console.error(`\n❌ Dev server exited with code ${code}`);
      process.exit(code);
    }
  });
  
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping dev server...');
    child.kill('SIGINT');
    process.exit(0);
  });
}

function detectDevScript() {
  const cwd = process.cwd();
  
  const pkgPath = path.join(cwd, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.scripts?.dev) return 'npm run dev';
    if (pkg.scripts?.start) return 'npm start';
  }
  
  const configPath = path.join(cwd, 'ants.config.json');
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (config.scripts?.dev) return config.scripts.dev;
  }
  
  return null;
}

function startStaticServer() {
  console.log('ℹ️  No dev script found — starting static file server\n');
  
  const server = http.createServer((req, res) => {
    const filePath = path.join(process.cwd(), req.url === '/' ? 'index.html' : req.url);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const types = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
      };
      res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  server.listen(port, () => {
    console.log(`🌐 Server running at http://localhost:${port}`);
    console.log('🛑 Press Ctrl+C to stop\n');
  });
}

run();
