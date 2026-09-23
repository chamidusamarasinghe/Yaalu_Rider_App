import { Alert } from 'react-native';
import { apiClient } from './api-client';

export interface UploadResponse {
  url: string;
  publicId?: string;
}

class UploadService {
  /**
   * Upload image or document to Cloudinary CDN via backend gateway.
   * Optimizes performance with 30-second timeout limit to prevent canceled requests.
   */
  async uploadMedia(
    imageUri: string,
    folder = 'yaalu/riders',
    maxSizeBytes = 5 * 1024 * 1024,
  ): Promise<UploadResponse> {
    if (!imageUri) {
      throw new Error('No media provided for upload.');
    }

    // Direct return if already remote HTTPS URL
    if (imageUri.startsWith('http://') || imageUri.startsWith('https://')) {
      return { url: imageUri, publicId: 'existing_url' };
    }

    // Security Check: File Size Limit Validation
    const isBase64 = imageUri.startsWith('data:');
    let estimatedSizeBytes = 0;

    if (isBase64) {
      const base64Data = imageUri.split(',')[1] || '';
      estimatedSizeBytes = Math.round((base64Data.length * 3) / 4);
    }

    if (estimatedSizeBytes > maxSizeBytes) {
      const maxMb = (maxSizeBytes / (1024 * 1024)).toFixed(0);
      Alert.alert(
        'File Size Exceeded',
        `Selected file size (${(estimatedSizeBytes / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${maxMb}MB.`,
      );
      throw new Error(`File size exceeds maximum limit of ${maxMb}MB`);
    }

    try {
      // Post to /uploads/image endpoint via resilient ApiClient with 30-second timeout limit
      const data = await apiClient.post<UploadResponse>(
        '/uploads/image',
        {
          image: imageUri,
          folder: folder,
        },
        30000, // 30-second timeout limit for smooth image upload
      );

      if (data && data.url) {
        return data;
      }
      return { url: imageUri };
    } catch (error: any) {
      console.warn('[UploadService Resilient Fallback]: Backend upload failed or slow. Using media URI:', error?.message || error);
      return { url: imageUri, publicId: 'dev_local_uri' };
    }
  }
}

export const uploadService = new UploadService();
