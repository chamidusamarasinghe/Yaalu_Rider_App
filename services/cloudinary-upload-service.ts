import * as FileSystem from 'expo-file-system/legacy';


const getBaseApiUrl = (): string => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }
  return 'http://192.168.1.45:3001';
};

/**
 * Uploads a local image file to the backend Cloudinary endpoint,
 * and immediately purges the local temporary cache file from the device.
 */
export async function uploadAndPurgeLocalImage(localUri: string): Promise<string> {
  if (!localUri) return '';

  // Case 1: Already a remote HTTPS URL
  if (localUri.startsWith('http://') || localUri.startsWith('https://')) {
    return localUri;
  }

  const apiUrl = getBaseApiUrl();
  const uploadEndpoint = `${apiUrl}/uploads/image`;
  console.log(`[Upload] Uploading image to backend Cloudinary endpoint: ${uploadEndpoint}`);

  try {
    let cloudUrl = '';

    // Case 2: Direct Data URL / Base64 string from ImagePicker (starts with data:image/)
    if (localUri.startsWith('data:image/')) {
      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          image: localUri,
          folder: 'yaalu/riders',
        }),
      });

      if (!response.ok) {
        throw new Error(`Base64 image upload failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.url || localUri;
    }

    // Case 3: Local file URI (starts with file:// or content://)
    if (FileSystem.uploadAsync && FileSystem.FileSystemUploadType) {
      try {
        const uploadResult = await FileSystem.uploadAsync(uploadEndpoint, localUri, {
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'file',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (uploadResult.status >= 200 && uploadResult.status < 300) {
          const data = JSON.parse(uploadResult.body);
          cloudUrl = data.url;
        } else {
          console.warn(`[Upload Warning] uploadAsync status ${uploadResult.status}, trying base64 fallback...`);
        }
      } catch (uploadErr) {
        console.warn('[Upload Warning] uploadAsync failed, falling back to base64 upload:', uploadErr);
      }
    }

    // Fallback if uploadAsync was skipped or failed
    if (!cloudUrl) {
      const filename = localUri.split('/').pop() || 'upload.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const ext = match ? match[1].toLowerCase() : 'jpg';
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

      const base64Data = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          image: dataUrl,
          folder: 'yaalu/riders',
        }),
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      cloudUrl = data.url;
    }

    // 🧹 INSTANT LOCAL CACHE CLEANUP: Purge file from local device disk
    if (localUri.startsWith('file://')) {
      await FileSystem.deleteAsync(localUri, { idempotent: true }).catch((err) => {
        console.warn('[Cache Cleanup] Non-critical error deleting local temp file:', err);
      });
      console.log('[Cache Cleanup] Successfully purged local temp file from device disk:', localUri);
    }

    return cloudUrl;
  } catch (error) {
    console.error('[Upload Error] Failed to upload image:', error);
    throw error;
  }
}


