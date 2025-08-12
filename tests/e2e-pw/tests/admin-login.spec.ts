import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/apiClient'; // adjust path as needed
import * as fs from 'fs';

let apiClient: APIClient;

test.beforeAll(async () => {
  apiClient = new APIClient(); // Uses APP_URL from .env
  await apiClient.init();
});

test('POST /api/v1/admin/login using form-data', async () => {
  const form = {
    email: 'admin@example.com',
    password: 'admin123',
    device_name: 'android',
  };

  const loginResponse = await apiClient.postForm(`${apiClient.getBaseUrl()}/api/v1/admin/login`, form);

  console.log('Response status:', loginResponse.status());
  console.log('Response body:', await loginResponse.text());

  expect(loginResponse.status()).toBe(200); // Adjust based on your API's expected loginResponse
  const loginResponseBody = await loginResponse.json();
  expect(loginResponseBody).toHaveProperty('token'); // Adjust based on your API's expected
  expect(loginResponseBody.data).toHaveProperty('name', 'Example'); // Adjust based on your API's expected loginResponse
  await fs.promises.writeFile('admin-login.json', JSON.stringify(loginResponseBody, null, 2));
});

test('DELETE API with admin logout', async () => {

  // await apiClient.postForm(`${apiClient.getBaseUrl()}/api/v1/admin/login`, form);

  const bearerHeader = await apiClient.bearerToken();
  const token = bearerHeader.replace('Bearer ', '');
  console.log('Bearer token for logout:', token);
  const response = await apiClient.delete(`${apiClient.getBaseUrl()}/api/v1/admin/logout`, 'bearer', token);
  console.log('Response status:', response.status());
  console.log('Response body:', await response.text());

  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.message && body.message.includes('Logged out successfully.')).toBeTruthy();
  console.log(body);

  // Second logout (expected to fail with 401)
  const secondResponse = await apiClient.delete(
    `${apiClient.getBaseUrl()}/api/v1/admin/logout`,
    'bearer',
    token
  );
  expect(secondResponse.status()).toBe(401);
  const body1 = await secondResponse.json();
  expect(body1.message.includes('Unauthenticated')).toBeTruthy();
  console.log('Second logout response status:', secondResponse.status());

});
