// utils/apiClient.ts
import { APIRequestContext, request } from '@playwright/test';

export class APIClient {
  static baseURL = `${process.env.APP_URL}/`.replace(/\/+$/, "/"); // ✅ central place for base URL

  private baseUrl: string;
  private adminToken: string | null = null;
  private context: APIRequestContext | null = null;

  constructor(baseUrl: string = APIClient.baseURL) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  }

  async init() {
    if (!this.context) {
      this.context = await request.newContext({
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      });
    }
  }

  private authHeader() {
    if (!this.adminToken) {
      throw new Error("adminToken is not set. Please login first or call setadminToken().");
    }
    return {
      Authorization: `Bearer ${this.adminToken}`,
      Accept: "application/json",
      'Content-Type': 'application/json',
    };
  }

  async adminLogin(email: string, password: string) {
    await this.init();
    const response = await this.context!.post(`${this.baseUrl}/api/v1/admin/login`, {
      data: { email, password, device_name: 'android' }, // ✅ Use json instead of data
    });

    if (response.status() !== 200) {
      throw new Error(`Login failed: ${response.status()} - ${await response.text()}`);
    }

    const body = await response.json();
    this.adminToken = body.token || body.data?.token;
    if (!this.adminToken) throw new Error('No token found in login response');
  }

  getadminToken() {
    return this.adminToken;
  }

  setadminToken(adminToken: string) {
    this.adminToken = adminToken;
  }

  async get(endpoint: string) {
    await this.init();
    return this.context!.get(`${this.baseUrl}${endpoint}`, {
      headers: this.authHeader(),
    });
  }

  async post(endpoint: string, body: any) {
    await this.init();
    return this.context!.post(`${this.baseUrl}${endpoint}`, {
      data: body, // ✅ changed to json
      headers: this.authHeader(),
    });
  }

  async put(endpoint: string, payload: any) {
    await this.init();
    return this.context!.put(`${this.baseUrl}${endpoint}`, {
      data: payload, // ✅ changed to json
      headers: this.authHeader(),
    });
  }

  async delete(endpoint: string) {
    await this.init();
    return this.context!.delete(`${this.baseUrl}${endpoint}`, {
      headers: this.authHeader(),
    });
  }

  async dispose() {
    await this.context?.dispose();
  }
}
