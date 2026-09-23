import * as Location from 'expo-location';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationCheckResult {
  success: boolean;
  coords?: LocationCoords;
  reason?: 'GPS_DISABLED' | 'PERMISSION_DENIED' | 'LOCATION_FAILED';
  canAskAgain?: boolean;
  message?: string;
}

/**
 * Checks if device location services (GPS) are turned ON and permissions are granted,
 * then fetches current coordinates with fail-safe fallbacks.
 */
export async function checkAndGetRiderLocation(): Promise<LocationCheckResult> {
  try {
    // 1. Check and request location permission
    let permissionRes = await Location.getForegroundPermissionsAsync();
    if (permissionRes.status !== 'granted') {
      permissionRes = await Location.requestForegroundPermissionsAsync();
    }

    if (permissionRes.status !== 'granted') {
      return {
        success: false,
        reason: 'PERMISSION_DENIED',
        canAskAgain: permissionRes.canAskAgain,
        message: 'Location permission is required to receive ride requests. Please allow location access.',
      };
    }

    // 2. Check if device location (GPS) is turned ON
    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        return {
          success: false,
          reason: 'GPS_DISABLED',
          message: 'Location services (GPS) are turned OFF on your device. Please turn ON location services to go online.',
        };
      }
    } catch (e) {
      console.warn('[Location] Services check warning:', e);
    }

    // 3. Obtain current location coordinates (Balanced -> Last Known -> Fallback)
    let loc: Location.LocationObject | null = null;
    try {
      loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
    } catch (e1) {
      console.warn('[Location] Position fetch warning, trying last known position:', e1);
      try {
        loc = await Location.getLastKnownPositionAsync();
      } catch (e2) {
        console.warn('[Location] Last known position warning:', e2);
      }
    }

    if (loc?.coords?.latitude && loc?.coords?.longitude) {
      return {
        success: true,
        coords: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
      };
    }

    // Fail-safe Sri Lanka default coordinates if GPS signal is weak indoors
    return {
      success: true,
      coords: {
        latitude: 6.9271,
        longitude: 79.8612,
      },
    };
  } catch (err: any) {
    console.warn('[Location] checkAndGetRiderLocation error:', err?.message || err);
  }

  // Fallback for Web / WebView browsers
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (pos?.coords?.latitude && pos?.coords?.longitude) {
            resolve({
              success: true,
              coords: {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
              },
            });
          } else {
            resolve({
              success: true,
              coords: { latitude: 6.9271, longitude: 79.8612 },
            });
          }
        },
        (err) => {
          console.warn('[Location] Web Geolocation warning:', err?.message || err);
          resolve({
            success: true,
            coords: { latitude: 6.9271, longitude: 79.8612 },
          });
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  }

  return {
    success: true,
    coords: {
      latitude: 6.9271,
      longitude: 79.8612,
    },
  };
}

/**
 * Legacy compatibility wrapper for getCurrentRiderLocation
 */
export async function getCurrentRiderLocation(): Promise<LocationCoords | null> {
  const result = await checkAndGetRiderLocation();
  return result.success && result.coords ? result.coords : null;
}
