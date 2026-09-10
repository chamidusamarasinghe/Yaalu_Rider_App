import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { getSavedRider } from '@/services/api';

const { width: W } = Dimensions.get('window');

/* ─── BOTTOM NAV ─────────────────────────────────────────────── */
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
    <View style={[tw`absolute bottom-0 left-0 right-0 bg-[#0B1044] flex-row items-center justify-around border-t-2 border-[#FFC72C]`, { paddingBottom: 8, paddingTop: 10 }]}>
      {tabs.map(t => {
        const isActive = t.key === active;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => router.push(t.route as any)}
            style={tw`items-center flex-1`}>
            {isActive ? (
              <View style={tw`bg-[#FFC72C] rounded-xl px-3 py-1.5 items-center`}>
                <Ionicons name={t.icon as any} size={20} color="#0B1044" />
                <Text style={tw`text-[9px] font-black text-[#0B1044] mt-0.5`}>{t.label}</Text>
              </View>
            ) : (
              <View style={tw`items-center`}>
                <Ionicons name={t.icon as any} size={20} color="#94A3B8" />
                <Text style={tw`text-[9px] font-semibold text-slate-400 mt-0.5`}>{t.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ─── METRIC CARD ─────────────────────────────────────────────── */
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

/* ─── MAIN SCREEN ─────────────────────────────────────────────── */
export default function RiderDashboardScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);
  const [rider, setRider] = useState<any>(null);
  const [earnings, setEarnings] = useState<any>(null);
  const [availableCount, setAvailableCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const cached = await getSavedRider();
      if (cached) setRider(cached);

      const [profileRes, earningsRes, ordersRes] = await Promise.allSettled([
        riderApi.getProfile(),
        riderApi.getEarnings('daily'),
        riderApi.getAvailableOrders(),
      ]);

      if (profileRes.status === 'fulfilled') {
        const p = profileRes.value as any;
        setRider(p.rider);
        setIsOnline(p.rider?.status === 'AVAILABLE');
      }
      if (earningsRes.status === 'fulfilled') setEarnings(earningsRes.value);
      if (ordersRes.status === 'fulfilled') setAvailableCount((ordersRes.value as any[]).length);
    } catch (e) {
      console.warn('Dashboard load error:', e);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleOnline = async () => {
    const newStatus = isOnline ? 'OFFLINE' : 'AVAILABLE';
    setIsOnline(!isOnline);
    try { await riderApi.setStatus(newStatus); }
    catch { setIsOnline(isOnline); }
  };

  const earningsAmount = earnings
    ? earnings.totalEarnings.toLocaleString('en-LK', { minimumFractionDigits: 2 })
    : '0.00';

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      {/* ── HEADER ─────────────────────────────── */}
      <View style={tw`bg-[#FFC72C] px-5 pt-3 pb-4 flex-row items-center justify-between`}>
        {/* Avatar + Greeting */}
        <TouchableOpacity onPress={() => router.push('/profile')} style={tw`flex-row items-center gap-3`}>
          <View style={tw`w-11 h-11 rounded-full border-2 border-[#0B1044] overflow-hidden bg-white shadow-xs`}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </View>
          <View>
            <Text style={tw`text-xs font-bold text-[#0B1044]/70`}>Hello 👋</Text>
            <Text style={tw`text-base font-black text-[#0B1044]`}>{rider?.firstName ?? 'Rider'}</Text>
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

          {/* Notification Bell */}
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={tw`w-10 h-10 rounded-full bg-[#0B1044]/10 items-center justify-center`}>
            <Ionicons name="notifications-outline" size={20} color="#0B1044" />
            <View style={tw`w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5`} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── BODY ─────────────────────────────────── */}
      <View style={tw`flex-1 bg-[#F4F6FB] rounded-t-3xl overflow-hidden`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 110 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFC72C" />}>

          {/* ── EARNINGS CARD ──────────────────── */}
          <View style={tw`bg-[#0B1044] rounded-3xl overflow-hidden mb-4`}>
            {/* Accent stripe */}
            <View style={tw`bg-[#FFC72C] h-1.5 w-full`} />
            <View style={tw`p-5`}>
              <View style={tw`flex-row justify-between items-center mb-1`}>
                <Text style={tw`text-xs font-bold text-slate-400 uppercase tracking-widest`}>Today's Earnings</Text>
                <View style={tw`bg-emerald-500/20 border border-emerald-500/30 rounded-full px-2.5 py-0.5`}>
                  <Text style={tw`text-[10px] font-black text-emerald-400`}>
                    {earnings ? `${earnings.totalDeliveries} Trips` : '–'}
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

          {/* ── NEW REQUESTS BANNER ──────────────── */}
          {availableCount > 0 && (
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
                    {availableCount} New Request{availableCount !== 1 ? 's' : ''} Available!
                  </Text>
                  <Text style={tw`text-xs font-medium text-[#0B1044]/70`}>Tap to see nearby orders</Text>
                </View>
              </View>
              <View style={tw`bg-[#0B1044] rounded-lg px-3 py-2`}>
                <Text style={tw`text-xs font-black text-[#FFC72C]`}>View →</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* No requests pill */}
          {availableCount === 0 && (
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

          {/* ── QUICK METRICS GRID ───────────────── */}
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>Performance</Text>
          <View style={tw`flex-row gap-3 mb-5`}>
            <MetricCard icon="checkmark-circle-outline" label="Acceptance" value="98.5%" iconColor="#059669" bgColor="#DCFCE7" />
            <MetricCard icon="star-outline" label="Rating" value="4.9 ★" iconColor="#D97706" bgColor="#FEF3C7" />
            <MetricCard icon="time-outline" label="Avg Time" value="22 min" iconColor="#2563EB" bgColor="#DBEAFE" />
          </View>

          {/* ── QUICK ACTIONS ────────────────────── */}
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

          {/* ── RECENT ACTIVITY ─────────────────── */}
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>Recent Activity</Text>
          <View style={tw`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden`}>
            {[
              { shop: 'Burger King • Bambalapitiya', dest: 'Kollupitiya', time: '12:40 PM', amt: '+LKR 380', icon: 'fast-food-outline', color: '#2563EB', bg: '#DBEAFE' },
              { shop: 'Keells Super • Nugegoda', dest: 'Nawala', time: '11:15 AM', amt: '+LKR 520', icon: 'bag-handle-outline', color: '#D97706', bg: '#FEF3C7' },
            ].map((item, idx, arr) => (
              <View
                key={idx}
                style={[
                  tw`flex-row items-center justify-between px-4 py-3.5`,
                  idx < arr.length - 1 && tw`border-b border-slate-100`,
                ]}>
                <View style={tw`flex-row items-center gap-3 flex-1`}>
                  <View style={[tw`w-10 h-10 rounded-xl items-center justify-center`, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-xs font-bold text-slate-900`} numberOfLines={1}>{item.shop}</Text>
                    <Text style={tw`text-[10px] text-slate-400 mt-0.5`}>→ {item.dest} • {item.time}</Text>
                  </View>
                </View>
                <Text style={tw`text-sm font-black text-emerald-600 ml-2`}>{item.amt}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* ── BOTTOM NAV ──────────────────────── */}
        <BottomNav active="dashboard" />
      </View>
    </SafeAreaView>
  );
}
