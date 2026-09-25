import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_LAST_VIEWED = '@yaalu_rider_last_viewed_notif_time';
const KEY_LAST_CLEARED = '@yaalu_rider_last_cleared_notif_time';

export async function getLastViewedNotifTime(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEY_LAST_VIEWED);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export async function markNotificationsAsViewed(): Promise<number> {
  const now = Date.now();
  try {
    await AsyncStorage.setItem(KEY_LAST_VIEWED, now.toString());
  } catch (e) {}
  return now;
}

export async function getLastClearedNotifTime(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEY_LAST_CLEARED);
    return val ? parseInt(val, 10) : 0;
  } catch (e) {
    return 0;
  }
}

export async function clearAllNotificationsStorage(): Promise<number> {
  const now = Date.now();
  try {
    await AsyncStorage.setItem(KEY_LAST_CLEARED, now.toString());
    await AsyncStorage.setItem(KEY_LAST_VIEWED, now.toString());
  } catch (e) {}
  return now;
}
