/**
 * Yaalu Rider App — API Service
 * Connects to the Yaalu backend at BASE_URL.
 * Token is stored in AsyncStorage as 'rider_token'.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Config ──────────────────────────────────────────────────────────────────
const BASE_URL = 'http://192.168.1.100:3000'; // ← Change to your backend IP

// ─── Token helpers ────────────────────────────────────────────────────────────
export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('rider_token');
}

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem('rider_token', token);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem('rider_token');
  await AsyncStorage.removeItem('rider_profile');
}

export async function saveRider(rider: any): Promise<void> {
  await AsyncStorage.setItem('rider_profile', JSON.stringify(rider));
}

export async function getSavedRider(): Promise<any | null> {
  const raw = await AsyncStorage.getItem('rider_profile');
  return raw ? JSON.parse(raw) : null;
}

// ─── Core fetch helper ────────────────────────────────────────────────────────
async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: object,
  useToken = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (useToken) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    const msg = json?.message || json?.error || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json as T;
}

// Helper: attach token as query param (for GET/PATCH calls that expect it)
async function withTokenParam(path: string): Promise<string> {
  const token = await getToken();
  const sep = path.includes('?') ? '&' : '?';
  return token ? `${path}${sep}token=${token}` : path;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────

export const riderApi = {
  // ── Login ──────────────────────────────────────────────────
  async login(mobile: string, password: string) {
    const res: any = await request('POST', '/riders/login', { mobile, password }, false);
    if (res.accessToken) {
      await saveToken(res.accessToken);
      await saveRider(res.rider);
    }
    return res;
  },

  // ── Send OTP ───────────────────────────────────────────────
  async sendOtp(mobile: string) {
    return request('POST', '/riders/send-otp', { mobile }, false);
  },

  // ── Verify OTP ─────────────────────────────────────────────
  async verifyOtp(mobile: string, otp: string) {
    return request('POST', '/riders/verify-otp', { mobile, otp }, false);
  },

  // ── Register ───────────────────────────────────────────────
  async register(data: {
    mobile: string;
    fullName: string;
    vehicleType: string;
    vehicleNumber: string;
    vehicleModel?: string;
    licenseNumber: string;
  }) {
    const res: any = await request('POST', '/riders/register', { ...data, role: 'RIDER' }, false);
    if (res.accessToken) {
      await saveToken(res.accessToken);
      await saveRider(res.rider);
    }
    return res;
  },

  // ── Create Password ────────────────────────────────────────
  async createPassword(data: {
    phoneNumber: string;
    password: string;
    confirmPassword: string;
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
    fullName: string;
  }) {
    const res: any = await request('POST', '/riders/create-password', data, false);
    if (res.accessToken) {
      await saveToken(res.accessToken);
      await saveRider(res.rider);
    }
    return res;
  },

  // ── Logout ─────────────────────────────────────────────────
  async logout() {
    await clearToken();
  },

  // ─── PROFILE ────────────────────────────────────────────────

  async getProfile() {
    const path = await withTokenParam('/riders/me');
    const res: any = await request('GET', path);
    if (res.rider) await saveRider(res.rider);
    return res;
  },

  async updateProfile(data: {
    fullName?: string;
    vehicleType?: string;
    vehicleNumber?: string;
    vehicleModel?: string;
    licenseNumber?: string;
  }) {
    const path = await withTokenParam('/riders/me');
    const res: any = await request('PATCH', path, data);
    if (res.rider) await saveRider(res.rider);
    return res;
  },

  // ── Online / Offline Status ────────────────────────────────
  async setStatus(status: 'AVAILABLE' | 'OFFLINE' | 'BUSY') {
    const path = await withTokenParam('/riders/me/status');
    return request('PATCH', path, { status });
  },

  // ── GPS Location ───────────────────────────────────────────
  async updateLocation(latitude: number, longitude: number) {
    const path = await withTokenParam('/riders/me/location');
    return request('PATCH', path, { latitude, longitude });
  },

  // ─── ORDERS ─────────────────────────────────────────────────

  async getMyOrders(status?: string) {
    const token = await getToken();
    const params = new URLSearchParams();
    if (token) params.append('token', token);
    if (status) params.append('status', status);
    return request('GET', `/riders/me/orders?${params.toString()}`);
  },

  async getAvailableOrders() {
    const path = await withTokenParam('/riders/orders/available');
    return request('GET', path);
  },

  async acceptOrder(orderId: string) {
    const path = await withTokenParam(`/riders/orders/${orderId}/accept`);
    return request('PATCH', path);
  },

  async updateOrderStatus(orderId: string, status: string) {
    const path = await withTokenParam(`/riders/orders/${orderId}/status`);
    return request('PATCH', path, { status });
  },

  // ─── EARNINGS ───────────────────────────────────────────────

  async getEarnings(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const token = await getToken();
    const params = new URLSearchParams();
    if (token) params.append('token', token);
    params.append('period', period);
    return request('GET', `/riders/me/earnings?${params.toString()}`);
  },

  // ─── BANK DETAILS ───────────────────────────────────────────

  async getBankDetails() {
    const path = await withTokenParam('/riders/me/bank');
    return request('GET', path);
  },

  async updateBankDetails(data: {
    bankName: string;
    accountName: string;
    accountNo: string;
    accountBranch: string;
  }) {
    const path = await withTokenParam('/riders/me/bank');
    return request('PATCH', path, data);
  },

  // ─── NOTIFICATIONS ──────────────────────────────────────────

  async getNotifications() {
    const path = await withTokenParam('/riders/me/notifications');
    return request('GET', path);
  },
};

export default riderApi;
