const https = require('https');
const http = require('http');
const configUtil = require('./utils/config');
const logger = require('./utils/logger');

const API_BASE = 'https://ants-pied.vercel.app';

function request(method, url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === 'https:';
    const lib = isHttps ? https : http;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (options.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }
    
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: parsedUrl.pathname + parsedUrl.search,
      method,
      headers,
      timeout: options.timeout || 10000,
    };
    
    const req = lib.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let body;
        try {
          body = JSON.parse(data);
        } catch (_) {
          body = data;
        }
        
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: body,
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`Request to ${url} timed out`));
    });
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

function get(path, options = {}) {
  const baseUrl = options.baseUrl || API_BASE;
  const url = `${baseUrl}${path}`;
  return request('GET', url, options);
}

function post(path, body, options = {}) {
  const baseUrl = options.baseUrl || API_BASE;
  const url = `${baseUrl}${path}`;
  return request('POST', url, { body, ...options });
}

function del(path, options = {}) {
  const baseUrl = options.baseUrl || API_BASE;
  const url = `${baseUrl}${path}`;
  return request('DELETE', url, options);
}

function checkStatus() {
  const start = Date.now();
  return get('/api/status').then(res => ({
    ...res,
    ms: Date.now() - start,
  }));
}

module.exports = {
  get,
  post,
  delete: del,
  request,
  checkStatus,
  API_BASE,
};
