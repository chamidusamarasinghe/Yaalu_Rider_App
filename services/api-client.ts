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

  // 1. If explicit environment variable exists
  if (process.env.EXPO_PUBLIC_API_URL) {
    urls.push(process.env.EXPO_PUBLIC_API_URL + cleanEndpoint);
  }

  // 2. Android Emulator special localhost
  if (Platform.OS === 'android') {
    urls.push('http://10.0.2.2:3000' + cleanEndpoint);
  }

  // 3. Expo Host IP (Physical device over Wi-Fi)
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && !isVirtualAdapterIp(ip)) {
      urls.push(`http://${ip}:3000${cleanEndpoint}`);
    }
  }

  // 4. Localhost fallbacks
  urls.push(`http://localhost:3000${cleanEndpoint}`);
  urls.push(`http://127.0.0.1:3000${cleanEndpoint}`);

  return Array.from(new Set(urls));
};

class ApiClient {
  async request<T>(endpoint: string, options: RequestInit = {}, timeoutMs = 3000): Promise<T> {
    const candidateUrls = getCandidateUrls(endpoint);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    let lastError: any = null;

    for (const url of candidateUrls) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, {
          ...options,
          headers,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        return await response.json();
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
      }
    }

    throw lastError || new Error(`Unable to connect to backend endpoint ${endpoint}`);
  }

  async post<T>(endpoint: string, body: any, timeoutMs = 4000): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }, timeoutMs);
  }
}

export const apiClient = new ApiClient();
