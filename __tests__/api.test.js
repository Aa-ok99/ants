const api = require('../src/index');

function createMockReq(url) {
  return { url, method: 'GET' };
}

function createMockRes() {
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    writeHead: jest.fn((status, headers) => {
      res.statusCode = status;
      res.headers = headers;
    }),
    end: jest.fn((body) => {
      res.body = JSON.parse(body);
    }),
  };
  return res;
}

describe('Vercel API', () => {
  test('root returns basic info', () => {
    const req = createMockReq('/');
    const res = createMockRes();
    
    api(req, res);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Ants API');
    expect(res.body.status).toBe('working');
    expect(res.body.time).toBeDefined();
  });
  
  test('/api returns same as root', () => {
    const req = createMockReq('/api');
    const res = createMockRes();
    
    api(req, res);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Ants API');
  });
  
  test('/api/status returns health info', () => {
    const req = createMockReq('/api/status');
    const res = createMockRes();
    
    api(req, res);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.version).toBeDefined();
    expect(res.body.endpoints).toContain('/api/health');
  });
  
  test('/api/health returns detailed health', () => {
    const req = createMockReq('/api/health');
    const res = createMockRes();
    
    api(req, res);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.healthy).toBe(true);
    expect(res.body.memory).toBeDefined();
    expect(res.body.memory.rss).toBeDefined();
    expect(res.body.node).toBe(process.version);
    expect(res.body.platform).toBe(process.platform);
  });
  
  test('/api/version returns package info', () => {
    const req = createMockReq('/api/version');
    const res = createMockRes();
    
    api(req, res);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('@aa-ok99/ants');
    expect(res.body.version).toBeDefined();
    expect(res.body.description).toBeDefined();
  });
  
  test('unknown endpoint returns 404', () => {
    const req = createMockReq('/api/unknown');
    const res = createMockRes();
    
    api(req, res);
    
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Not Found');
    expect(res.body.endpoints).toBeDefined();
  });
});
