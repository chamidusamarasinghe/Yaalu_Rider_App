import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Alert,
  Linking,
  Animated,
  Vibration,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { getSavedRider, formatRiderData } from '@/services/api';
import InteractiveMap from '@/components/InteractiveMap';
import { checkAndGetRiderLocation, LocationCoords } from '@/lib/location';
import { useHireNotification } from '@/hooks/useHireNotification';

const { width: W } = Dimensions.get('window');


/* â”€â”€â”€ BOTTOM NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function BottomNav({ active }: { active: string }) {
  const router = useRouter();
  const tabs = [
    { key: 'dashboard', icon: 'home', label: 'Home', route: '/dashboard' },
    { key: 'orders', icon: 'receipt-outline', label: 'Orders', route: '/orders' },
    { key: 'wallet', icon: 'wallet-outline', label: 'Wallet', route: '/wallet' },
    { key: 'notifications', icon: 'notifications-outline', label: 'Alerts', route: '/notifications' },
    { key: 'profile', icon: 'person-outline', label: 'Profile', route: '/profile' },
  ] as const;

  return (
    <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2`}>
      {tabs.map(t => {
        const isActive = t.key === active;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => router.push(t.route as any)}
            style={tw`items-center`}>
            {isActive ? (
              <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
                <Ionicons name="home" size={18} color="#0B1044" />
                <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>{t.label}</Text>
              </View>
            ) : (
              <View style={tw`items-center`}>
                <Ionicons name={t.icon as any} size={20} color="#0B1044" />
                <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>{t.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* â”€â”€â”€ METRIC CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function MetricCard({ icon, label, value, iconColor, bgColor }: any) {
  return (
    <View style={tw`bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex-1`}>
      <View style={[tw`w-10 h-10 rounded-xl items-center justify-center mb-2.5`, { backgroundColor: bgColor }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={tw`text-[11px] font-semibold text-slate-400 uppercase tracking-wide`}>{label}</Text>
      <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>{value}</Text>
    </View>
  );
}

/* â”€â”€â”€ MAIN SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
export default function RiderDashboardScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [rider, setRider] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [availableCount, setAvailableCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState<LocationCoords>({
    latitude: 6.9271,
    longitude: 79.8612,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // ─── Real-time Hire Notifications ──────────────────
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const {
    hasNewHireRequest,
    latestRequest,
    availableCount: liveAvailableCount,
    dismissNotification,
    refresh: refreshNotifications,
    socketConnected,
  } = useHireNotification(isOnline);

  // Pulse animation & vibrate when new request arrives
  useEffect(() => {
    if (hasNewHireRequest) {
      // Vibrate to alert rider
      Vibration.vibrate([0, 400, 200, 400]);

      // Slide in banner
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();

      // Pulse loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1.0, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      // Slide out
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [hasNewHireRequest]);

  const handleNotificationTap = () => {
    dismissNotification();
    router.push('/new-requests');
  };

  const fetchAndSetLocation = useCallback(async (updateBackend = true) => {
    setIsLocating(true);
    try {
      const result = await checkAndGetRiderLocation();
      if (result.success && result.coords) {
        setUserLocation(result.coords);
        setIsOnline(true);
        if (updateBackend) {
          Promise.all([
            riderApi.updateLocation(result.coords.latitude, result.coords.longitude),
            riderApi.setStatus('AVAILABLE'),
          ]).catch((err) => {
            console.warn('Backend location/status sync note:', err.message);
          });
        }
      } else {
        // Location is OFF or Permission Denied -> Rider MUST remain OFFLINE
        setIsOnline(false);
        if (updateBackend) {
          riderApi.setStatus('OFFLINE').catch(() => {});
        }
      }
    } catch (e) {
      console.warn('Location fetch error:', e);
      setIsOnline(false);
    } finally {
      setIsLocating(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      const cached = await getSavedRider();
      if (cached) {
        const formatted = formatRiderData({}, cached);
        setRider(formatted);
        if (formatted.currentLatitude && formatted.currentLongitude) {
          setUserLocation({
            latitude: formatted.currentLatitude,
            longitude: formatted.currentLongitude,
          });
        }
      }

      const [profileRes, earningsRes, ordersRes, historyRes] = await Promise.allSettled([
        riderApi.getProfile(),
        riderApi.getEarnings('daily'),
        riderApi.getAvailableOrders(),
        riderApi.getMyOrders(),
      ]);

      if (profileRes.status === 'fulfilled') {
        const p = profileRes.value as any;
        const currentSaved = await getSavedRider();
        const merged = formatRiderData(p, currentSaved);
        setRider(merged);
        if (merged.currentLatitude && merged.currentLongitude) {
          setUserLocation({
            latitude: merged.currentLatitude,
            longitude: merged.currentLongitude,
          });
        }
      }
      if (earningsRes.status === 'fulfilled') setEarnings(earningsRes.value);
      if (ordersRes.status === 'fulfilled') setAvailableCount(Array.isArray(ordersRes.value) ? ordersRes.value.length : 0);
      if (historyRes.status === 'fulfilled') setRecentOrders(Array.isArray(historyRes.value) ? historyRes.value.slice(0, 4) : []);
    } catch (e) {
      console.warn('Dashboard load error:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
    fetchAndSetLocation(true);
  }, [loadData, fetchAndSetLocation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadData(), fetchAndSetLocation(true)]);
    refreshNotifications();
    setRefreshing(false);
  };

  const toggleOnline = async () => {
    // If rider is currently ONLINE and taps toggle to go OFFLINE:
    if (isOnline) {
      setIsOnline(false);
      try {
        await riderApi.setStatus('OFFLINE');
      } catch (err) {
        console.warn('Status update error:', err);
      }
      return;
    }

    // If rider is currently OFFLINE and wants to go ONLINE:
    setIsLocating(true);
    const result = await checkAndGetRiderLocation();
    setIsLocating(false);

    if (!result.success || !result.coords) {
      setIsOnline(false); // Guarantee toggle stays OFFLINE

      if (result.reason === 'GPS_DISABLED') {
        Alert.alert(
          'Turn On Location Services ðŸ“',
          'Your phone location (GPS) is turned OFF. You MUST turn ON Location Services to switch to Online status and receive ride requests.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Try Again / Turn On',
              onPress: () => toggleOnline(),
            },
          ]
        );
      } else if (result.reason === 'PERMISSION_DENIED') {
        if (result.canAskAgain === false) {
          Alert.alert(
            'Location Permission Denied ðŸ”',
            'Location permission was previously denied. Please allow location access in phone App Settings to switch to Online status.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Open App Settings',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        } else {
          Alert.alert(
            'Location Permission Required ðŸ”',
            'Yaalu Rider requires foreground location permission to connect you with nearby delivery requests.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Grant Permission',
                onPress: () => toggleOnline(),
              },
            ]
          );
        }
      } else {
        Alert.alert(
          'Location Error âš ï¸',
          result.message || 'Unable to fetch current GPS coordinates. Please turn on location and try again.',
          [{ text: 'OK' }]
        );
      }
      return;
    }

    // ONLY IF LOCATION (GPS) IS TURNED ON & PERMISSION GRANTED:
    setUserLocation(result.coords);
    setIsOnline(true);

    try {
      await Promise.all([
        riderApi.setStatus('AVAILABLE'),
        riderApi.updateLocation(result.coords.latitude, result.coords.longitude),
      ]);
    } catch (err: any) {
      console.warn('Backend location/status update note:', err?.message || err);
    }
  };

  const earningsAmount = earnings
    ? earnings.totalEarnings.toLocaleString('en-LK', { minimumFractionDigits: 2 })
    : '0.00';

  // Use live count from socket/polling, fall back to REST count
  const displayAvailableCount = liveAvailableCount > 0 ? liveAvailableCount : availableCount;

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      {/* â”€â”€ HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={tw`bg-[#FFC72C] px-5 pt-3 pb-4 flex-row items-center justify-between`}>
        {/* Avatar + Greeting */}
        <TouchableOpacity onPress={() => router.push('/profile')} style={tw`flex-row items-center gap-3`}>
          <View style={tw`w-11 h-11 rounded-full border-2 border-[#0B1044] overflow-hidden bg-white shadow-sm`}>
            <Image
              source={{ uri: rider?.profilePhotoUrl || rider?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={tw`text-xs font-bold text-[#0B1044]/70`}>Hello ðŸ‘‹</Text>
            <Text style={tw`text-base font-black text-[#0B1044]`}>{rider?.firstName || (rider?.fullName ? rider.fullName.split(' ')[0] : '') || rider?.fullName || 'Rider Partner'}</Text>
          </View>
        </TouchableOpacity>

        {/* Right: toggle + bell */}
        <View style={tw`flex-row items-center gap-2`}>
          {/* Online Toggle */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={toggleOnline}
            style={[
              tw`flex-row items-center px-3.5 py-2 rounded-full gap-1.5 shadow-sm`,
              { backgroundColor: isOnline ? '#059669' : '#0B1044' },
            ]}>
            <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
            <Text style={tw`text-xs font-black text-white uppercase tracking-wider`}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </TouchableOpacity>

          {/* Notification Bell with live badge */}
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={tw`w-10 h-10 rounded-full bg-[#0B1044]/10 items-center justify-center`}>
            <Ionicons name="notifications-outline" size={20} color="#0B1044" />
            {displayAvailableCount > 0 && (
              <View style={tw`absolute top-0.5 right-0.5 min-w-4 h-4 rounded-full bg-red-500 items-center justify-center px-0.5`}>
                <Text style={tw`text-[9px] font-black text-white`}>
                  {displayAvailableCount > 9 ? '9+' : displayAvailableCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* â”€â”€ BODY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <View style={tw`flex-1 bg-[#F4F6FB] rounded-t-3xl overflow-hidden`}>

        {/* ── NEW HIRE REQUEST NOTIFICATION BANNER ── */}
        <Animated.View
          pointerEvents={hasNewHireRequest ? 'auto' : 'none'}
          style={[
            tw`absolute top-0 left-0 right-0 z-50 px-4 pt-3`,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleNotificationTap}
              style={[
                tw`bg-[#0B1044] rounded-2xl p-4 flex-row items-center justify-between shadow-lg border border-[#FFC72C]`,
                { elevation: 12 },
              ]}
            >
              {/* Left: icon + text */}
              <View style={tw`flex-row items-center gap-3 flex-1 mr-2`}>
                <View style={tw`w-11 h-11 rounded-xl bg-[#FFC72C] items-center justify-center`}>
                  <Ionicons name="car" size={22} color="#0B1044" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm font-black text-[#FFC72C]`}>
                    {latestRequest?.title || '🚗 New Hire Request!'}
                  </Text>
                  <Text style={tw`text-xs text-white/80 font-semibold mt-0.5`} numberOfLines={1}>
                    {latestRequest?.body || 'Requests right now — tap to view'}
                  </Text>
                  <Text style={tw`text-[10px] text-[#FFC72C]/60 font-bold mt-0.5`}>
                    Requests right now ⚡
                  </Text>
                </View>
              </View>

              {/* Right: action + dismiss */}
              <View style={tw`items-end gap-1.5`}>
                <View style={tw`bg-[#FFC72C] rounded-lg px-3 py-1.5`}>
                  <Text style={tw`text-[11px] font-black text-[#0B1044]`}>View →</Text>
                </View>
                <TouchableOpacity
                  onPress={dismissNotification}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={tw`text-[10px] text-white/50`}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>

        <ScrollView
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 110 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFC72C" />}
        >
          {/* â”€â”€ LOCATION REQUIRED BANNER (When Offline) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {!isOnline && (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={toggleOnline}
              style={tw`bg-[#FFC72C] rounded-2xl p-4 flex-row items-center justify-between mb-4 shadow-sm border border-amber-400`}>
              <View style={tw`flex-row items-center gap-3 flex-1 mr-2`}>
                <View style={tw`w-10 h-10 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="location-outline" size={20} color="#FFC72C" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-xs font-black text-[#0B1044]`}>
                    Location Required to Go Online ðŸ“
                  </Text>
                  <Text style={tw`text-[11px] font-semibold text-[#0B1044]/80 mt-0.5`}>
                    Turn on device GPS & grant permission to switch to Online
                  </Text>
                </View>
              </View>
              <View style={tw`bg-[#0B1044] rounded-xl px-3 py-2`}>
                <Text style={tw`text-xs font-black text-[#FFC72C]`}>Turn On â†’</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* â”€â”€ EARNINGS CARD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <View style={tw`bg-[#0B1044] rounded-3xl overflow-hidden mb-4`}>
            {/* Accent stripe */}
            <View style={tw`bg-[#FFC72C] h-1.5 w-full`} />
            <View style={tw`p-5`}>
              <View style={tw`flex-row justify-between items-center mb-1`}>
                <Text style={tw`text-xs font-bold text-slate-400 uppercase tracking-widest`}>Today's Earnings</Text>
                <View style={tw`bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-0.5`}>
                  <Text style={tw`text-[10px] font-black text-emerald-400`}>
                    {earnings ? `${earnings.totalDeliveries} Trips` : 'â€“'}
                  </Text>
                </View>
              </View>
              <Text style={tw`text-4xl font-black text-white mt-1`}>
                LKR <Text style={tw`text-[#FFC72C]`}>{earningsAmount}</Text>
              </Text>
              <Text style={tw`text-xs text-slate-500 mt-1`}>
                {rider ? `Logged in as ${rider.vehicleType ?? 'Rider'}` : 'Loading...'}
              </Text>
              <TouchableOpacity
                onPress={() => router.push('/wallet')}
                style={tw`bg-[#FFC72C] rounded-xl py-2.5 px-4 mt-4 self-start flex-row items-center gap-2`}
                activeOpacity={0.85}>
                <Ionicons name="wallet-outline" size={15} color="#0B1044" />
                <Text style={tw`text-xs font-black text-[#0B1044]`}>View Wallet & Payouts</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* â”€â”€ LIVE INTERACTIVE MAP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <View style={tw`mb-5`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest`}>
                Live Location & Area Map
              </Text>
              <View style={tw`flex-row items-center gap-2`}>
                <TouchableOpacity
                  onPress={() => fetchAndSetLocation(true)}
                  disabled={isLocating}
                  activeOpacity={0.8}
                  style={tw`flex-row items-center gap-1.5 bg-[#0B1044] px-3 py-1 rounded-full border border-[#FFC72C]`}>
                  {isLocating ? (
                    <ActivityIndicator size="small" color="#FFC72C" />
                  ) : (
                    <Ionicons name="navigate-circle" size={15} color="#FFC72C" />
                  )}
                  <Text style={tw`text-[11px] font-black text-white`}>
                    {isLocating ? 'Locating...' : 'My Location'}
                  </Text>
                </TouchableOpacity>

                <View style={tw`flex-row items-center gap-1 bg-emerald-100 px-2 py-1 rounded-full`}>
                  <View style={tw`w-2 h-2 rounded-full bg-emerald-600`} />
                  <Text style={tw`text-[10px] font-bold text-emerald-800`}>Active GPS</Text>
                </View>
              </View>
            </View>

            <View style={tw`relative rounded-2xl overflow-hidden shadow-sm`}>
              <InteractiveMap
                key={`map-${userLocation.latitude.toFixed(4)}-${userLocation.longitude.toFixed(4)}`}
                height={220}
                center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
                zoom={14}
                onTouchStart={() => setScrollEnabled(false)}
                onTouchEnd={() => setScrollEnabled(true)}
                markers={[
                  {
                    id: 'rider-home-pos',
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                    title: rider?.firstName || rider?.fullName || 'Wenura',
                    type: 'driver',
                  },
                  {
                    id: 'nearby-shop-1',
                    latitude: userLocation.latitude + 0.005,
                    longitude: userLocation.longitude + 0.004,
                    title: 'Yaalu Fresh Supermarket',
                    type: 'pickup',
                  },
                  {
                    id: 'nearby-shop-2',
                    latitude: userLocation.latitude - 0.006,
                    longitude: userLocation.longitude - 0.006,
                    title: 'Colombo Bake House',
                    type: 'pickup',
                  },
                ]}
              />

              {/* Floating My Location Button directly on Map */}
              <TouchableOpacity
                onPress={() => fetchAndSetLocation(true)}
                activeOpacity={0.85}
                disabled={isLocating}
                style={tw`absolute bottom-3 right-3 bg-[#0B1044] border-2 border-[#FFC72C] px-3.5 py-2 rounded-xl flex-row items-center gap-1.5 shadow-md`}>
                {isLocating ? (
                  <ActivityIndicator size="small" color="#FFC72C" />
                ) : (
                  <Ionicons name="locate" size={17} color="#FFC72C" />
                )}
                <Text style={tw`text-xs font-black text-[#FFC72C]`}>
                  {isLocating ? 'Locating...' : 'My Location'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

<<<<<<< HEAD
          {/* â”€â”€ NEW REQUESTS BANNER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          {availableCount > 0 && (
=======
          {/* ── NEW REQUESTS BANNER ──────────────── */}
          {displayAvailableCount > 0 && (
>>>>>>> origin/main
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push('/new-requests')}
              style={tw`bg-[#FFC72C] rounded-2xl p-4 flex-row items-center justify-between mb-4 shadow-sm`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-11 h-11 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="flash" size={22} color="#FFC72C" />
                </View>
                <View>
                  <Text style={tw`text-sm font-black text-[#0B1044]`}>
                    {displayAvailableCount} New Request{displayAvailableCount !== 1 ? 's' : ''} Available!
                  </Text>
                  <Text style={tw`text-xs font-medium text-[#0B1044]/70`}>
                    {socketConnected ? '🟢 Live' : '⏱ Polling'} · Tap to see nearby orders
                  </Text>
                </View>
              </View>
              <View style={tw`bg-[#0B1044] rounded-lg px-3 py-2`}>
                <Text style={tw`text-xs font-black text-[#FFC72C]`}>View â†’</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* No requests pill */}
          {displayAvailableCount === 0 && (
            <TouchableOpacity
              onPress={() => router.push('/new-requests')}
              style={tw`bg-white border border-slate-200 rounded-2xl p-3.5 flex-row items-center gap-3 mb-4`}>
              <View style={tw`w-9 h-9 rounded-xl bg-slate-100 items-center justify-center`}>
                <Ionicons name="time-outline" size={18} color="#94A3B8" />
              </View>
              <Text style={tw`text-sm font-semibold text-slate-500 flex-1`}>No nearby requests right now</Text>
              <Ionicons name="chevron-forward" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          )}

          {/* â”€â”€ QUICK METRICS GRID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>Performance</Text>
          <View style={tw`flex-row gap-3 mb-5`}>
            <MetricCard icon="checkmark-circle-outline" label="Acceptance" value="98.5%" iconColor="#059669" bgColor="#DCFCE7" />
            <MetricCard icon="star-outline" label="Rating" value="4.9 â˜…" iconColor="#D97706" bgColor="#FEF3C7" />
            <MetricCard icon="time-outline" label="Avg Time" value="22 min" iconColor="#2563EB" bgColor="#DBEAFE" />
          </View>

          {/* â”€â”€ QUICK ACTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>Quick Actions</Text>
          <View style={tw`flex-row gap-3 mb-5`}>
            {[
              { label: 'New Orders', icon: 'list-outline', route: '/new-requests', color: '#7C3AED', bg: '#EDE9FE' },
              { label: 'My Orders', icon: 'cart-outline', route: '/orders', color: '#0284C7', bg: '#E0F2FE' },
              { label: 'Earnings', icon: 'cash-outline', route: '/wallet', color: '#059669', bg: '#D1FAE5' },
              { label: 'Profile', icon: 'person-outline', route: '/profile', color: '#D97706', bg: '#FEF3C7' },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                onPress={() => router.push(action.route as any)}
                style={tw`flex-1 bg-white rounded-2xl p-3 items-center border border-slate-100 shadow-sm`}
                activeOpacity={0.8}>
                <View style={[tw`w-10 h-10 rounded-xl items-center justify-center mb-1.5`, { backgroundColor: action.bg }]}>
                  <Ionicons name={action.icon as any} size={20} color={action.color} />
                </View>
                <Text style={tw`text-[10px] font-black text-slate-700 text-center`}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* â”€â”€ RECENT ACTIVITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>Recent Activity</Text>
          <View style={tw`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6`}>
            {recentOrders.length > 0 ? (
              recentOrders.map((item: any, idx: number) => (
                <View
                  key={item.id || idx}
                  style={[
                    tw`flex-row items-center justify-between px-4 py-3.5`,
                    idx < recentOrders.length - 1 && tw`border-b border-slate-100`,
                  ]}>
                  <View style={tw`flex-row items-center gap-3 flex-1`}>
                    <View style={tw`w-10 h-10 rounded-xl bg-blue-100 items-center justify-center`}>
                      <Ionicons name="navigate-outline" size={18} color="#2563EB" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-xs font-bold text-slate-900`} numberOfLines={1}>
                        {item.pickupAddress} â†’ {item.dropoffAddress}
                      </Text>
                      <Text style={tw`text-[10px] text-slate-400 mt-0.5`}>
                        {item.orderNumber} â€¢ {item.dateGroup || 'Today'}
                      </Text>
                    </View>
                  </View>
                  <Text style={tw`text-sm font-black text-emerald-600 ml-2`}>{item.amount}</Text>
                </View>
              ))
            ) : (
              <View style={tw`p-6 items-center justify-center`}>
                <Ionicons name="receipt-outline" size={24} color="#94A3B8" />
                <Text style={tw`text-xs font-semibold text-slate-500 mt-1`}>No recent trips recorded yet</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* â”€â”€ BOTTOM NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <BottomNav active="dashboard" />
      </View>
    </SafeAreaView>
  );
}

