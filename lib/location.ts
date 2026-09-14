import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export async function getCurrentRiderLocation(): Promise<LocationCoords | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      if (loc?.coords?.latitude && loc?.coords?.longitude) {
        return {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
      }
    }
  } catch (err) {
    console.warn('[Location] expo-location attempt warning:', err);
  }

  // Fallback to Browser Navigator Geolocation (for Web / WebViews)
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (pos?.coords?.latitude && pos?.coords?.longitude) {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          } else {
            resolve(null);
          }
        },
        (err) => {
          console.warn('[Location] Web Geolocation error:', err?.message || err);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  return null;
}
