import { test, expect } from 'playwright/test';
import { emit } from 'process';
import { APIClient } from '../utils/apiClient';

test('User/admin login', async ({ request }) => {
   const endpoint = 'api/v1/admin/login';
    const loginPayload = {
        "email": 'admin@example.com',
        "password": 'admin123',
        "device_name": 'android',
    };
  const response = await request.post(endpoint, {
    data: loginPayload
  });
  console.log('Response status:', response.status());
  console.log('Raw body:', await response.text());
  expect(response.status()).toBe(200); // Adjust based on your API's expected loginResponse
//   expect(response.body()).toHaveProperty('data.token'); // Adjust based on your API's expected loginResponse
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token'); // Adjust based on your API's expected loginResponse
    expect(responseBody.data.email).toEqual(loginPayload.email); // Adjust based on your API's expected loginResponse
});

test('User get', async ({ request }) => {

  await APIClient.get('api/v1/admin/login', {
    headers: })
  const response = await request.get('api/v1/admin/get');
  console.log('Response status:', response.status());
  console.log('Raw body:', await response.text());
});