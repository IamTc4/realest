const assert = require('assert');
const http = require('http');

// Simple integration test script
// Requires server to be running on port 3001

async function testApi() {
  console.log('Running API tests...');

  // 1. Login Admin
  const loginData = JSON.stringify({ email: "admin@developerbee.com", password: "password123" });
  const loginRes = await request('POST', '/api/auth/login', loginData);
  const loginBody = JSON.parse(loginRes.body);
  assert.ok(loginBody.token, 'Admin should get a token');
  assert.strictEqual(loginBody.user.role, 'ADMIN', 'Role should be ADMIN');
  console.log('✓ Admin Login passed');

  const adminToken = loginBody.token;

  // 2. Login Client (OTP)
  const otpData = JSON.stringify({ phone: "1234567890", otp: "1234" });
  const otpRes = await request('POST', '/api/auth/otp-login', otpData);
  const otpBody = JSON.parse(otpRes.body);
  assert.ok(otpBody.token, 'Client should get a token');
  assert.strictEqual(otpBody.user.role, 'CLIENT', 'Role should be CLIENT');
  console.log('✓ Client OTP Login passed');

  // 3. Get Properties
  const propRes = await request('GET', '/api/properties');
  const propBody = JSON.parse(propRes.body);
  assert.ok(Array.isArray(propBody), 'Properties should be an array');
  assert.ok(propBody.length > 0, 'Should return properties');
  console.log('✓ Get Properties passed');

  // 4. Get Dashboard Stats (Admin)
  const statsRes = await request('GET', '/api/dashboard/stats', null, { 'Authorization': `Bearer ${adminToken}` });
  const statsBody = JSON.parse(statsRes.body);
  assert.ok(statsBody.totalLeads !== undefined, 'Stats should have totalLeads');
  console.log('✓ Dashboard Stats passed');

  console.log('All tests passed!');
}

function request(method, path, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data ? Buffer.byteLength(data) : 0,
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });

    req.on('error', reject);

    if (data) req.write(data);
    req.end();
  });
}

testApi().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
