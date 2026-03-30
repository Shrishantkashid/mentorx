const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';

async function testAuth() {
  const testUser = {
    email: `test_${Date.now()}@saividya.ac.in`,
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    userType: 'learner'
  };

  console.log('--- TESTING REGISTER ---');
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });
  const regData = await regRes.json();
  console.log('Register Response:', JSON.stringify(regData, null, 2));

  if (!regData.success) {
    console.error('Registration failed!');
    return;
  }

  const token = regData.token;

  console.log('\n--- TESTING LOGIN ---');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  });
  const loginData = await loginRes.json();
  console.log('Login Response:', JSON.stringify(loginData, null, 2));

  console.log('\n--- TESTING GET ME ---');
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const meData = await meRes.json();
  console.log('Me Response:', JSON.stringify(meData, null, 2));
}

testAuth().catch(console.error);
