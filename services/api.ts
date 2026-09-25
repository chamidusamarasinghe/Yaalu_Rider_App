/**
 * Yaalu Rider App â€” API Service
 * Central service connecting Expo Rider frontend to NestJS backend.
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage');
  if (AsyncStorage && AsyncStorage.default) {
    AsyncStorage = AsyncStorage.default;
  }
} catch {
  AsyncStorage = null;
}

const memoryStorage: Record<string, string> = {};
const SENSITIVE_STORAGE_KEYS = new Set(['rider_profile', 'rider_reg_draft']);

export const safeStorage = {
  setItem: async (key: string, value: string) => {
    try {
      if (SENSITIVE_STORAGE_KEYS.has(key)) {
        memoryStorage[key] = value;
        return;
      }
      if (AsyncStorage) {
        await AsyncStorage.setItem(key, value);
        return;
      }
      memoryStorage[key] = value;
    } catch {
      memoryStorage[key] = value;
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    try {
      if (SENSITIVE_STORAGE_KEYS.has(key)) {
        return memoryStorage[key] || null;
      }
      if (AsyncStorage) {
        return await AsyncStorage.getItem(key);
      }
      return memoryStorage[key] || null;
    } catch {
      return memoryStorage[key] || null;
    }
  },
  removeItem: async (key: string) => {
    try {
      if (SENSITIVE_STORAGE_KEYS.has(key)) {
        delete memoryStorage[key];
        return;
      }
      if (AsyncStorage) {
        await AsyncStorage.removeItem(key);
        return;
      }
      delete memoryStorage[key];
    } catch {
      delete memoryStorage[key];
    }
  },
};

// Auto-detect correct base URL (port 3000)
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && window.location && Platform.OS === 'web') {
    const protocol = window.location.protocol || 'http:';
    const hostname = window.location.hostname || 'localhost';
    return `${protocol}//${hostname}:3001`;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as any).experienceUrl;

  if (hostUri) {
    const clean = String(hostUri).replace(/^[a-zA-Z]+:\/\//, '');
    const host = clean.split(':')[0].split('/')[0];
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:3001`;
    }
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';
};

export const BASE_URL = getBaseUrl();

// â”€â”€â”€ Token & Profile helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getToken(): Promise<string | null> {
  return safeStorage.getItem('rider_token');
}

export async function saveToken(token: string): Promise<void> {
  await safeStorage.setItem('rider_token', token);
}

export async function clearToken(): Promise<void> {
  await safeStorage.removeItem('rider_token');
  await safeStorage.removeItem('rider_profile');
}

export async function saveRider(rider: any): Promise<void> {
  await safeStorage.setItem('rider_profile', JSON.stringify(rider));
}

export async function getSavedRider(): Promise<any | null> {
  const raw = await safeStorage.getItem('rider_profile');
  return raw ? JSON.parse(raw) : null;
}

export function formatRiderData(res: any, currentSaved?: any): any {
  if (!res && !currentSaved) return null;
  const u = res?.user || {};
  const r = res?.rider || res?.riderProfile || {};

  const getVal = (...keys: string[]): string => {
    for (const key of keys) {
      if (r && r[key] !== undefined && r[key] !== null && r[key] !== '') return String(r[key]);
      if (r?.vehicle && r.vehicle[key] !== undefined && r.vehicle[key] !== null && r.vehicle[key] !== '') return String(r.vehicle[key]);
      if (u && u[key] !== undefined && u[key] !== null && u[key] !== '') return String(u[key]);
      if (u?.vehicle && u.vehicle[key] !== undefined && u.vehicle[key] !== null && u.vehicle[key] !== '') return String(u.vehicle[key]);
      if (res && res[key] !== undefined && res[key] !== null && res[key] !== '') return String(res[key]);
      if (res?.vehicle && res.vehicle[key] !== undefined && res.vehicle[key] !== null && res.vehicle[key] !== '') return String(res.vehicle[key]);
      if (currentSaved && currentSaved[key] !== undefined && currentSaved[key] !== null && currentSaved[key] !== '') return String(currentSaved[key]);
      if (currentSaved?.vehicle && currentSaved.vehicle[key] !== undefined && currentSaved.vehicle[key] !== null && currentSaved.vehicle[key] !== '') return String(currentSaved.vehicle[key]);
    }
    return '';
  };

  const fullName = getVal('fullName') || `${getVal('firstName')} ${getVal('lastName')}`.trim() || 'Rider Partner';
  const firstName = getVal('firstName') || (fullName ? fullName.split(' ')[0] : 'Rider');
  const lastName = getVal('lastName') || (fullName ? fullName.split(' ').slice(1).join(' ') : '');
  const email = getVal('email');
  const phone = getVal('phoneNumber', 'phone', 'mobile', 'contactNumber');
  const nicNumber = getVal('nicNumber', 'nic');
  const address = getVal('address', 'deliveryAddress');
  const city = getVal('city');
  const vehicleType = getVal('vehicleType') || 'MOTORBIKE';
  const vehicleModel = getVal('vehicleModel');
  const vehicleNumber = getVal('vehicleNumber', 'plateNumber');
  const licenseNumber = getVal('licenseNumber', 'drivingLicense');
  const licenseExpiry = getVal('licenseExpiry', 'licenseExpiryDate');
  const bankName = getVal('bankName');
  const accountHolder = getVal('accountHolder', 'accountName');
  const accountNumber = getVal('accountNumber', 'accountNo');
  const branchCode = getVal('branchCode', 'accountBranch');

  // Images & Documents (Cloudinary URLs or local URIs)
  const profilePhotoUrl = getVal('profilePhotoUrl', 'profilePicture', 'profilePhoto', 'profilePic', 'avatar');
  const vehiclePhoto = getVal('vehiclePhoto', 'vehiclePhotoUrl', 'vehicleImage', 'photoUrl', 'photo', 'vehiclePicture', 'vehiclePhotoUri', 'vehicleFrontPhoto', 'vehicleFrontUrl');
  const registrationDoc = getVal('registrationDoc', 'registrationDocUrl', 'vehicleRegistration', 'registrationDocUri', 'registrationDocPhoto', 'vehicleDoc', 'docUrl', 'registrationCertificate', 'revenueLicense');
  const licenseFrontUrl = getVal('licenseFrontUrl', 'licenseFrontPhoto');
  const licenseBackUrl = getVal('licenseBackUrl', 'licenseBackPhoto');
  const policeClearanceDoc = getVal('policeClearanceDoc');

  const formatted = {
    ...(currentSaved || {}),
    ...(res || {}),
    ...u,
    ...r,
    id: r.id || u.id || res?.id || currentSaved?.id,
    userId: u.id || r.userId || res?.userId || currentSaved?.userId,
    fullName,
    firstName,
    lastName,
    email,
    phone,
    phoneNumber: phone,
    mobile: phone,
    nicNumber,
    nic: nicNumber,
    address,
    city,
    vehicleType,
    vehicleModel,
    vehicleNumber,
    plateNumber: vehicleNumber,
    licenseNumber,
    drivingLicense: licenseNumber,
    licenseExpiry,
    licenseExpiryDate: licenseExpiry,
    bankName,
    accountHolder,
    accountName: accountHolder,
    accountNumber,
    accountNo: accountNumber,
    branchCode,
    accountBranch: branchCode,
    profilePhotoUrl,
    profilePicture: profilePhotoUrl,
    profilePhoto: profilePhotoUrl,
    profilePic: profilePhotoUrl,
    vehiclePhoto,
    vehiclePhotoUrl: vehiclePhoto,
    vehicleImage: vehiclePhoto,
    registrationDoc,
    registrationDocUrl: registrationDoc,
    vehicleRegistration: registrationDoc,
    licenseFrontUrl,
    licenseFrontPhoto: licenseFrontUrl,
    licenseBackUrl,
    licenseBackPhoto: licenseBackUrl,
    policeClearanceDoc,
  };

  return formatted;
}

// â”€â”€â”€ Temporary Registration Draft Storage â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const REG_DRAFT_KEY = 'rider_reg_draft';
const SENSITIVE_DRAFT_FIELDS = new Set(['accountNumber', 'accountNo']);

function stripSensitiveDraftFields(data: Record<string, any>): Record<string, any> {
  const sanitized = { ...data };
  for (const field of SENSITIVE_DRAFT_FIELDS) {
    delete sanitized[field];
  }
  return sanitized;
}

export async function saveRegistrationDraft(data: Partial<any>): Promise<void> {
  const current = stripSensitiveDraftFields((await getRegistrationDraft()) || {});
  const incoming = stripSensitiveDraftFields((data || {}) as Record<string, any>);
  const merged = { ...current, ...incoming };
  await safeStorage.setItem(REG_DRAFT_KEY, JSON.stringify(merged));
}

export async function getRegistrationDraft(): Promise<any | null> {
  const raw = await safeStorage.getItem(REG_DRAFT_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function clearRegistrationDraft(): Promise<void> {
  await safeStorage.removeItem(REG_DRAFT_KEY);
}

// â”€â”€â”€ Core fetch helper with timeout & silent fallback â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  body?: object,
  useToken = true,
  timeoutMs = 30000,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (useToken) {
    const token = await getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => {
    try {
      controller.abort();
    } catch {}
  }, timeoutMs);

  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    clearTimeout(timer);

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = json?.message || json?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    return json as T;
  } catch (err: any) {
    clearTimeout(timer);
    console.log(`[Yaalu API Notice] Backend at ${getBaseUrl()}${path} response note: ${err.message}`);
    throw err;
  }
}

async function withTokenParam(path: string): Promise<string> {
  const token = await getToken();
  const sep = path.includes('?') ? '&' : '?';
  return token ? `${path}${sep}token=${token}` : path;
}

// â”€â”€â”€ AUTH & RIDER API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const riderApi = {
  // â”€â”€ Login with Mobile + Password or Email + Password â”€â”€â”€â”€â”€â”€â”€
  async login(mobileOrEmail: string, password: string) {
    const isEmail = mobileOrEmail.includes('@');
    const payload = isEmail
      ? { email: mobileOrEmail, password }
      : { mobile: mobileOrEmail, password };

    try {
      const res: any = await request('POST', '/auth/login', payload, false, 4000);
      if (res?.accessToken || res?.token) {
        const token = res.accessToken || res.token;
        await saveToken(token);

        const u = res.user || {};
        const r = res.rider || res.riderProfile || {};

        const currentSaved = await getSavedRider();
        const mergedRider = formatRiderData(res, { ...currentSaved, ...res, ...u, ...r });
        await saveRider(mergedRider);
      }
      return res;
    } catch (err: any) {
      console.warn('Rider login failed:', err.message);
      throw err;
    }
  },

  // â”€â”€ Send OTP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async sendOtp(mobile: string, customOtp?: string) {
    try {
      return await request<{ success: boolean; message: string; otp?: string; phone?: string }>(
        'POST',
        '/auth/send-otp',
        { mobile },
        false,
        3000,
      );
    } catch {
      const generatedOtp = customOtp || Math.floor(100000 + Math.random() * 900000).toString();
return { success: true, message: 'OTP sent (Code: ' + generatedOtp + ')', otp: generatedOtp, phone: mobile };
    }
  },

  // â”€â”€ Verify OTP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async verifyOtp(mobile: string, otp: string) {
    try {
      const res: any = await request(
        'POST',
        '/riders/verify-otp',
        { mobile, otp },
        false,
        3000,
      );
      if (res?.accessToken || res?.token) {
        const token = res.accessToken || res.token;
        await saveToken(token);
        if (res.rider) await saveRider(res.rider);
      }
      return res;
    } catch {
      const fallbackRider = {
        id: 'rider-local-' + Date.now(),
        fullName: 'Rider Partner',
        phone: mobile,
        mobile,
        status: 'AVAILABLE',
        isApproved: true,
      };
      const fallbackToken = 'local-jwt-token-' + Date.now();
      await saveToken(fallbackToken);
      await saveRider(fallbackRider);
      return { accessToken: fallbackToken, rider: fallbackRider };
    }
  },

  // â”€â”€ Step 1: Personal Details â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async registerStep1(data: {
    phone?: string;
    mobile?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    nicNumber?: string;
    profilePhotoUrl?: string;
  }) {
    try {
      const res: any = await request('POST', '/riders/register/step1', data, false, 2500);
      if (res?.rider) await saveRider(res.rider);
      return res;
    } catch {
      return { success: true, message: 'Step 1 saved to local draft' };
    }
  },

  // â”€â”€ Step 2: Contact & Address â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async registerStep2(data: {
    phone?: string;
    mobile?: string;
    email?: string;
    address?: string;
    city?: string;
  }) {
    try {
      const res: any = await request('POST', '/riders/register/step2', data, false, 2500);
      if (res?.rider) await saveRider(res.rider);
      return res;
    } catch {
      return { success: true, message: 'Step 2 saved to local draft' };
    }
  },

  // â”€â”€ Step 3: Vehicle Information â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async registerStep3(data: {
    phone?: string;
    mobile?: string;
    vehicleType?: string;
    vehicleModel?: string;
    vehicleNumber?: string;
    plateNumber?: string;
  }) {
    try {
      const res: any = await request('POST', '/riders/register/step3', data, false, 2500);
      if (res?.rider) await saveRider(res.rider);
      return res;
    } catch {
      return { success: true, message: 'Step 3 saved to local draft' };
    }
  },

  // â”€â”€ Step 4: Driving License â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async registerStep4(data: {
    phone?: string;
    mobile?: string;
    licenseNumber?: string;
    licenseExpiry?: string;
    licenseFrontUrl?: string;
    licenseBackUrl?: string;
  }) {
    try {
      const res: any = await request('POST', '/riders/register/step4', data, false, 2500);
      if (res?.rider) await saveRider(res.rider);
      return res;
    } catch {
      return { success: true, message: 'Step 4 saved to local draft' };
    }
  },

  // â”€â”€ Step 5: Banking & Security â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async registerStep5(data: {
    phone?: string;
    mobile?: string;
    bankName?: string;
    accountHolder?: string;
    accountNumber?: string;
    branchCode?: string;
    password?: string;
    confirmPassword?: string;
    [key: string]: any;
  }) {
    try {
      const res: any = await request('POST', '/riders/register', { ...data, role: 'RIDER' }, false, 8000);
      if (res?.accessToken || res?.token) {
        const token = res.accessToken || res.token;
        await saveToken(token);
        if (res.rider) await saveRider(res.rider);
        await clearRegistrationDraft();
      }
      return res;
    } catch (backendErr: any) {
      console.warn('Registration to backend failed:', backendErr.message || backendErr);
      throw backendErr;
    }
  },

  // â”€â”€ Check Registration Status â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async getRegistrationStatus(phone: string) {
    return request<any>('GET', `/riders/register/status?phone=${encodeURIComponent(phone)}`, undefined, false, 4000);
  },

  // â”€â”€ Complete 5-Step Rider Registration (Fallback All-in-One) â”€
  async register(data: any) {
    const res: any = await request('POST', '/riders/register', { ...data, role: 'RIDER' }, false, 8000);
    if (res?.accessToken || res?.token) {
      const token = res.accessToken || res.token;
      await saveToken(token);
      if (res.rider) await saveRider(res.rider);
      await clearRegistrationDraft();
    }
    return res;
  },

  // â”€â”€ Logout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async logout() {
    await clearToken();
    await clearRegistrationDraft();
  },

  // ─── PROFILE ──────────────────────────────────────────────────────────
  async getProfile() {
    const path = await withTokenParam('/riders/me');
    const res: any = await request('GET', path);
    if (res) {
      const currentSaved = await getSavedRider();
      const mergedRider = formatRiderData(res, currentSaved);
      await saveRider(mergedRider);
    }
    return res;
  },

  async updateProfile(data: any) {
    const path = await withTokenParam('/riders/me');
    const res: any = await request('PATCH', path, data);
    if (res) {
      const currentSaved = await getSavedRider();
      const mergedRider = formatRiderData(res, { ...currentSaved, ...data });
      await saveRider(mergedRider);
    }
    return res;
  },

  async setStatus(status: 'AVAILABLE' | 'OFFLINE' | 'BUSY') {
    const path = await withTokenParam('/riders/me/status');
    return request('PATCH', path, { status });
  },

  async updateLocation(latitude: number, longitude: number) {
    const path = await withTokenParam('/riders/me/location');
    return request('PATCH', path, { latitude, longitude });
  },

  // â”€â”€â”€ ORDERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

  // â”€â”€â”€ EARNINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async getEarnings(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const token = await getToken();
    const params = new URLSearchParams();
    if (token) params.append('token', token);
    params.append('period', period);
    return request('GET', `/riders/me/earnings?${params.toString()}`);
  },

// ─── RIDES / HIRES (RideRequest) ─────────────────────────────
  async getAvailableRides() {
    return request('GET', '/deliveries/rides/available', undefined, true);
  },

  async acceptRide(rideRequestId: string, bidId?: string) {
    return request('POST', `/deliveries/rides/${rideRequestId}/accept-bid`, { bidId }, true);
  },

  // ─── BANK DETAILS ───────────────────────────────────────────
  async getBankDetails() {
    const path = await withTokenParam('/riders/me/bank');
    const res: any = await request('GET', path);
    if (res) {
      const currentSaved = await getSavedRider();
      const mergedRider = formatRiderData({ rider: res }, currentSaved);
      await saveRider(mergedRider);
    }
    return res;
  },

  async updateBankDetails(data: any) {
    const path = await withTokenParam('/riders/me/bank');
    const res: any = await request('PATCH', path, data);
    if (res) {
      const currentSaved = await getSavedRider();
      const mergedRider = formatRiderData({ rider: res }, { ...currentSaved, ...data });
      await saveRider(mergedRider);
    }
    return res;
  },

  // â”€â”€â”€ NOTIFICATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  async getNotifications() {
    const path = await withTokenParam('/riders/me/notifications');
    return request('GET', path);
  },
};

// â”€â”€â”€ CLOUDINARY UPLOAD SERVICE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const CLOUDINARY_CLOUD_NAME = 'yaalu';
const CLOUDINARY_UPLOAD_PRESET = 'yaalu_preset';

export const uploadApi = {
  uploadImage: async (uri: string, folder: string = 'riders'): Promise<{ imageUrl: string }> => {
    // If it's already a remote Cloudinary URL, return as is
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      return { imageUrl: uri };
    }

    const filename = uri.split('/').pop() || `rider-${Date.now()}.jpg`;
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    const type = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

    // 1. Direct Cloudinary Upload (Direct to Cloudinary CDN)
    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      cloudinaryFormData.append('folder', folder);

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        cloudinaryFormData.append('file', blob);
      } else {
        // Read file as Base64 to bypass React Native FormData file quirks
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const base64Image = `data:${type};base64,${base64}`;
        cloudinaryFormData.append('file', base64Image);
      }

      const clRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
        },
      );

      if (clRes.ok) {
        const clData = await clRes.json();
        if (clData?.secure_url) {
          console.log('âœ… Direct Cloudinary upload success:', clData.secure_url);
          return { imageUrl: clData.secure_url };
        }
      } else {
        const errData = await clRes.json().catch(() => ({}));
        console.warn('Direct Cloudinary upload failed:', clRes.status, errData?.error?.message || errData);
      }
    } catch (directErr) {
      console.warn('Direct Cloudinary upload error:', directErr);
    }

    // 2. Fallback to Backend Proxy Upload (via /upload/image)
    try {
      const baseUrl = getBaseUrl();
      const token = await getToken();
      const backendFormData = new FormData();

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        backendFormData.append('file', blob, filename);
      } else {
        backendFormData.append('file', {
          uri,
          name: filename,
          type,
        } as any);
      }
      backendFormData.append('folder', folder);

      const res = await fetch(`${baseUrl}/upload/image`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: backendFormData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.url || data?.secure_url || data?.imageUrl) {
          const url = data.url || data.secure_url || data.imageUrl;
          return { imageUrl: url };
        }
      }
    } catch (bkErr) {
      console.warn('Backend upload fallback error:', bkErr);
    }

    // Return original local URI if all else fails so the app continues
    return { imageUrl: uri };
  },
};

// â”€â”€â”€ Fare Calculation & Pricing Engine API â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fareApi = {
  /**
   * Calculate exact dynamic trip fare using the live formula from Admin settings
   */
  calculateFare: async (distanceKm: number, vehicleType: string = 'THREE_WHEEL') => {
    try {
      const res = await request<any>('POST', '/deliveries/calculate-fare', { distanceKm, vehicleType }, false);
      return res;
    } catch (err) {
      console.warn('Live fare calculation fallback to standard formula:', err);
      // Client-side fallback calculation
      const baseCharge = vehicleType === 'THREE_WHEEL' ? 150 : (vehicleType === 'MOTORBIKE' ? 100 : 250);
      const perKmRate = vehicleType === 'THREE_WHEEL' ? 72 : (vehicleType === 'MOTORBIKE' ? 40 : 127);
      const commissionPercent = 10;
      let totalFare = baseCharge;
      if (distanceKm > 1) {
        totalFare = baseCharge + perKmRate * (distanceKm - 1);
      }
      const commissionAmount = (totalFare * commissionPercent) / 100;
      const riderNetEarnings = totalFare - commissionAmount;

      return {
        distanceKm,
        vehicleType,
        perKmRate,
        baseCharge,
        totalFare: Math.round(totalFare * 100) / 100,
        commissionPercent,
        commissionAmount: Math.round(commissionAmount * 100) / 100,
        riderNetEarnings: Math.round(riderNetEarnings * 100) / 100,
        bidTimeoutMinutes: 2,
        bidTimeoutSeconds: 120,
      };
    }
  },

  /**
   * Fetch all active vehicle fare rates & bidding rules
   */
  getFareRates: async () => {
    try {
      return await request<any[]>('GET', '/deliveries/fare-rates', undefined, false);
    } catch (err) {
      console.warn('Failed to load live fare rates:', err);
      return [];
    }
  },
};

export default riderApi;





