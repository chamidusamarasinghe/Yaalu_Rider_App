import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isVirtualAdapterIp = (ip: string): boolean => {
  if (!ip || ip === 'localhost' || ip === '127.0.0.1') return true;
  if (ip.startsWith('192.168.48.')) return true;
  if (ip.startsWith('172.') && !ip.startsWith('172.20.')) return true;
  return false;
};

const getCandidateUrls = (endpoint: string): string[] => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
  const urls: string[] = [];

  // 1. Expo Host IP (Physical device over Wi-Fi - Most dynamic & reliable)
  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants as any).manifest?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost ??
    (Constants as any).experienceUrl;

  if (hostUri) {
    const clean = String(hostUri).replace(/^[a-zA-Z]+:\/\//, '');
    const ip = clean.split(':')[0].split('/')[0];
    if (ip && !isVirtualAdapterIp(ip)) {
      urls.push(`http://${ip}:3001${cleanEndpoint}`);
    }
  }

  // 2. Environment Variable EXPO_PUBLIC_API_URL
  if (process.env.EXPO_PUBLIC_API_URL) {
    urls.push(process.env.EXPO_PUBLIC_API_URL + cleanEndpoint);
  }

  // 3. Android Emulator special localhost (Only for emulator without hostUri)
  if (Platform.OS === 'android' && !hostUri) {
    urls.push('http://10.0.2.2:3001' + cleanEndpoint);
  }

  // 4. Localhost fallbacks (Web or local dev)
  if (Platform.OS === 'web') {
    urls.push(`http://localhost:3001${cleanEndpoint}`);
    urls.push(`http://127.0.0.1:3001${cleanEndpoint}`);
  }

  // Generic localhost fallbacks for all environments
  urls.push(`http://localhost:3001${cleanEndpoint}`);
  urls.push(`http://10.0.2.2:3001${cleanEndpoint}`);

  return Array.from(new Set(urls));
};

class ApiClient {
  async request<T>(endpoint: string, options: RequestInit = {}, timeoutMs = 45000): Promise<T> {
    const candidateUrls = getCandidateUrls(endpoint);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    let lastError: any = null;

    for (const url of candidateUrls) {
      try {
        console.log(`[ApiClient] Attempting fetch to: ${url}`);
        const fetchPromise = fetch(url, {
          ...options,
          headers,
        });

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error(`Connection timeout after ${timeoutMs / 1000}s`)), timeoutMs)
        );

        const response = await Promise.race([fetchPromise, timeoutPromise]);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          const serverError = new Error(errorData.message || `HTTP ${response.status}`);
          (serverError as any).isServerError = true;
          throw serverError;
        }

        return await response.json();
      } catch (error: any) {
        console.warn(`[ApiClient] Request to ${url} failed:`, error?.message || error);
        if (error?.isServerError) {
          throw error;
        }
        lastError = error;
      }
    }

    throw lastError || new Error(`Unable to connect to backend endpoint ${endpoint}`);
  }

  async post<T>(endpoint: string, body: any, timeoutMs = 45000): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }, timeoutMs);
  }
}

export const apiClient = new ApiClient();
