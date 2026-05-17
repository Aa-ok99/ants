const pkg = require('../package.json');

const startTime = Date.now();

function jsonResponse(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function handleRoot(req, res) {
  jsonResponse(res, 200, {
    name: 'Ants API',
    version: pkg.version,
    status: 'working',
    time: new Date().toISOString(),
    uptime: Date.now() - startTime,
  });
}

function handleStatus(req, res) {
  jsonResponse(res, 200, {
    status: 'healthy',
    version: pkg.version,
    timestamp: new Date().toISOString(),
    uptime: Date.now() - startTime,
    endpoints: ['/api', '/api/status', '/api/health', '/api/version'],
  });
}

function handleHealth(req, res) {
  const mem = process.memoryUsage();
  jsonResponse(res, 200, {
    healthy: true,
    version: pkg.version,
    uptime: Date.now() - startTime,
    memory: {
      rss: `${(mem.rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    },
    node: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString(),
  });
}

function handleVersion(req, res) {
  jsonResponse(res, 200, {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    node: process.version,
  });
}

function handleNotFound(req, res) {
  jsonResponse(res, 404, {
    error: 'Not Found',
    message: `Endpoint ${req.url} not found`,
    endpoints: ['/api', '/api/status', '/api/health', '/api/version'],
  });
}

module.exports = (req, res) => {
  const url = req.url.split('?')[0];
  
  if (url === '/' || url === '/api') {
    handleRoot(req, res);
  } else if (url === '/api/status') {
    handleStatus(req, res);
  } else if (url === '/api/health') {
    handleHealth(req, res);
  } else if (url === '/api/version') {
    handleVersion(req, res);
  } else {
    handleNotFound(req, res);
  }
};
