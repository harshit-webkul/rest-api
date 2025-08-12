// tests/adminApi.spec.ts
import { test, expect } from '@playwright/test';
import { APIClient } from '../utils/apiClient';

test.describe('Admin API Tests', () => {
  let apiClient: APIClient;

  test.beforeAll(async () => {
    apiClient = new APIClient(APIClient.baseURL);
    await apiClient.adminLogin('admin@example.com', 'admin123');// Need to change if the update API is called
  });

  test('Admin accessToken', async () => {
    // Login is already done in beforeAll, but we can validate token
    expect(apiClient.getadminToken()).not.toBeNull();
    console.log('Saved Token:', apiClient.getadminToken());
  });

  // test('Admin login API', async () => {
  //   const endpoint = '/api/v1/admin/login';

  //   const loginPayload = {
  //     email: 'admin@example.com',
  //     password: 'admin123',
  //     device_name: 'android',
  // };

  // const response = await apiClient.post(endpoint, loginPayload); // ✅ no extra { data: ... }

  // expect(response.status()).toBe(200);

  // const body = await response.json();
  // console.log('Admin details:', body);

  // expect(body).toHaveProperty('data');
  // expect(body.message).toEqual("Logged in successfully.");
  // const token = body.data?.token || body.token; // depends on Bagisto response
  // expect(token).toBeTruthy();

  // apiClient.setadminToken(token);
  // });

  test('Get logged in admin users details', async () => {
    const endpoint = '/api/v1/admin/get';
    const response = await apiClient.get(endpoint);
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Admin details:', body);

  });

  test('Update admin user profile', async () => {
    // Step 1: Fetch current profile
    const userFetchEndpoint = '/api/v1/admin/get';
    const getResponse = await apiClient.get(userFetchEndpoint);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();
    console.log('Current Admin details:', getBody);

    const currentEmail = getBody.data?.email; // ✅ access name inside data
    expect(currentEmail).toBeTruthy();

    // Step 2: Prepare payload
    const profilePayload = {
      name: 'Harshit',
      email: 'example@example.com', // When call the udpate user api, so you need to update the email
      password: 'admin123',
      password_confirmation: 'admin123',
      current_password: 'admin123',
    };

    // Step 3: Update profile
    const endpoint = '/api/v1/admin/update';
    const updateResponse = await apiClient.put(endpoint, profilePayload);
    expect(updateResponse.status()).toBe(200);

    const updatedBody = await updateResponse.json();
    console.log('Updated Admin details:', updatedBody);

    // Step 4: Verify change
    expect(updatedBody.data?.email).not.toEqual(currentEmail);
  });

  test('Admin users forgot password', async () => {
    const userFetchEndpoint = '/api/v1/admin/get';
    const getResponse = await apiClient.get(userFetchEndpoint);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();
    console.log('Current Admin details:', getBody);

    const currentEmail = getBody.data?.email; // ✅ access name inside data
    console.log(currentEmail);
    
    const payload = {  
      email: currentEmail,
    };

    const endpoint = '/api/v1/admin/forgot-password';
    const response = await apiClient.post(endpoint, payload);
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Admin details:', body);

    expect(body.message).toEqual("We have emailed your password reset link.");
  });

  test('Admin users logout', async () => {
    const userFetchEndpoint = '/api/v1/admin/get';
    const getResponse = await apiClient.get(userFetchEndpoint);
    expect(getResponse.status()).toBe(200);

    const getBody = await getResponse.json();
    console.log('Current Admin details:', getBody);

    const currentEmail = getBody.data?.email; // ✅ access name inside data
    console.log(currentEmail);

    const endpoint = '/api/v1/admin/logout';
    const response = await apiClient.delete(endpoint);
    expect(response.status()).toBe(200);

    const body = await response.json();
    console.log('Admin details:', body);

    expect(body.message).toEqual("Logged out successfully.");
  });
});
