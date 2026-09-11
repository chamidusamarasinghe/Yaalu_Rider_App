import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { getSavedRider } from '@/services/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [rider, setRider] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getSavedRider();
      if (saved) {
        setRider(saved);
        if (saved.status) setIsOnline(saved.status === 'AVAILABLE');
      }

      try {
        const res = await riderApi.getProfile();
        if (res?.rider) {
          setRider(res.rider);
          if (res.rider.status) setIsOnline(res.rider.status === 'AVAILABLE');
        }
      } catch (e) {
        // fallback to saved
      }
    })();
  }, []);

  const toggleStatus = async () => {
    const next = !isOnline;
    setIsOnline(next);
    try {
      await riderApi.setStatus(next ? 'AVAILABLE' : 'OFFLINE');
    } catch (e) {
      // ignore
    }
  };

  const fullName = rider?.fullName || `${rider?.firstName || ''} ${rider?.lastName || ''}`.trim() || 'Harsha Perera';
  const riderId = rider?.id ? `#YL-${rider.id.slice(0, 6).toUpperCase()}` : '#YL-8921';
  const rating = rider?.rating ? Number(rider.rating).toFixed(1) : '5.0';
  const completedCount = rider?.deliveriesCompleted ?? 0;

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={tw`w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200`}>
            <Image
              source={{ uri: rider?.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleStatus}
            style={tw`flex-row items-center bg-[#0B1044] px-3.5 py-1.5 rounded-full border border-blue-900 shadow-md gap-2`}>
            <View style={tw`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-400'}`} />
            <Text style={tw`text-xs font-black text-white uppercase tracking-wider`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#FFC72C" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/notifications' as any)}
            style={tw`w-10 h-10 rounded-full bg-white/20 items-center justify-center relative`}>
            <Ionicons name="notifications-outline" size={20} color="#0B1044" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24 items-center`}>
          {/* Avatar Profile Section */}
          <View style={tw`items-center mb-6 mt-2 relative`}>
            <View style={tw`w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200`}>
              <Image
                source={{ uri: rider?.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300' }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>

            {/* Edit Avatar Badge */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('Update Photo', 'Choose new profile photo from gallery.')}
              style={tw`absolute bottom-0 right-0 bg-[#0B1044] p-2 rounded-full border-2 border-white shadow-md`}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Rider Name & Rating */}
          <Text style={tw`text-2xl font-black text-slate-900`}>{fullName}</Text>
          <Text style={tw`text-xs font-bold text-slate-400 mt-0.5`}>Rider ID: {riderId}</Text>
          <View style={tw`flex-row items-center gap-1.5 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full mt-2`}>
            <Ionicons name="star" size={14} color="#D97706" />
            <Text style={tw`text-xs font-black text-amber-900`}>{rating} Rating (Active Partner)</Text>
          </View>

          {/* Stats Grid */}
          <View style={tw`flex-row gap-3 w-full my-6`}>
            <View style={tw`flex-1 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex-row items-center gap-3`}>
              <View style={tw`w-10 h-10 rounded-xl bg-amber-500 items-center justify-center shadow-xs`}>
                <Ionicons name="cash" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={tw`text-[11px] font-bold text-slate-500`}>Today's Earnings</Text>
                <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>LKR 4,250</Text>
              </View>
            </View>

            <View style={tw`flex-1 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex-row items-center gap-3`}>
              <View style={tw`w-10 h-10 rounded-xl bg-[#0B1044] items-center justify-center shadow-xs`}>
                <Ionicons name="checkmark-circle" size={20} color="#FFC72C" />
              </View>
              <View>
                <Text style={tw`text-[11px] font-bold text-slate-500`}>Completed Orders</Text>
                <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>{completedCount}</Text>
              </View>
            </View>
          </View>

          {/* Menu Items List */}
          <View style={tw`w-full gap-3 mb-6`}>
            {/* 1. Personal Information */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/personal-details' as any)}
              style={tw`w-full bg-white rounded-2xl p-4 flex-row items-center justify-between border border-slate-200 shadow-xs`}>
              <View style={tw`flex-row items-center gap-3.5`}>
                <View style={tw`w-9 h-9 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="person" size={18} color="#FFFFFF" />
                </View>
                <Text style={tw`text-sm font-extrabold text-slate-800`}>Personal Information</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#0F172A" />
            </TouchableOpacity>

            {/* 2. Vehicle Details */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/vehicle-details' as any)}
              style={tw`w-full bg-white rounded-2xl p-4 flex-row items-center justify-between border border-slate-200 shadow-xs`}>
              <View style={tw`flex-row items-center gap-3.5`}>
                <View style={tw`w-9 h-9 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="car-sport" size={18} color="#FFFFFF" />
                </View>
                <Text style={tw`text-sm font-extrabold text-slate-800`}>Vehicle Details</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#0F172A" />
            </TouchableOpacity>

            {/* 3. Bank Account Details */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/bank-details' as any)}
              style={tw`w-full bg-white rounded-2xl p-4 flex-row items-center justify-between border border-slate-200 shadow-xs`}>
              <View style={tw`flex-row items-center gap-3.5`}>
                <View style={tw`w-9 h-9 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="business" size={18} color="#FFFFFF" />
                </View>
                <Text style={tw`text-sm font-extrabold text-slate-800`}>Bank Account Details</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#0F172A" />
            </TouchableOpacity>

            {/* 4. Help & Support */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/help-support' as any)}
              style={tw`w-full bg-white rounded-2xl p-4 flex-row items-center justify-between border border-slate-200 shadow-xs`}>
              <View style={tw`flex-row items-center gap-3.5`}>
                <View style={tw`w-9 h-9 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="document-text" size={18} color="#FFFFFF" />
                </View>
                <Text style={tw`text-sm font-extrabold text-slate-800`}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#0F172A" />
            </TouchableOpacity>

            {/* 5. Settings */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/settings' as any)}
              style={tw`w-full bg-white rounded-2xl p-4 flex-row items-center justify-between border border-slate-200 shadow-xs`}>
              <View style={tw`flex-row items-center gap-3.5`}>
                <View style={tw`w-9 h-9 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="settings" size={18} color="#FFFFFF" />
                </View>
                <Text style={tw`text-sm font-extrabold text-slate-800`}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2`}>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`items-center`}>
            <Ionicons name="home-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/orders' as any)} style={tw`items-center`}>
            <Ionicons name="cart-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/wallet' as any)} style={tw`items-center`}>
            <Ionicons name="wallet-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={tw`items-center`}>
            <Ionicons name="notifications-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Notification</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/profile' as any)} style={tw`items-center`}>
            <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
              <Ionicons name="person" size={18} color="#0B1044" />
              <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Profile</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
