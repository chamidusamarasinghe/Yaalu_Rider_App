import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import { getSavedRider, riderApi } from '@/services/api';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const [rider, setRider] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      // 1. Load from local saved profile
      const saved = await getSavedRider();
      if (saved) setRider(saved);

      // 2. Fetch fresh from backend
      // getProfile() returns { id, email, fullName, role, rider: { vehicleType, licenseNumber, ... } }
      try {
        const res = await riderApi.getProfile();
        if (res) {
          // Merge top-level user fields + nested rider profile
          const merged = {
            ...(res.rider || {}),         // nested riderProfile fields
            id: res.id || res.rider?.id,
            email: res.email,
            fullName: res.fullName || res.rider?.fullName,
            role: res.role,
          };
          setUserData(res);
          setRider((prev: any) => ({ ...prev, ...merged }));
        }
      } catch (e) {
        // use saved fallback
      }
    })();
  }, []);

  const fullName = rider?.fullName || `${rider?.firstName || ''} ${rider?.lastName || ''}`.trim() || '';
  // Phone: riders who registered via OTP have phone stored as email
  const phone = rider?.phone || rider?.mobile ||
    (userData?.email && !userData.email.includes('@') ? userData.email : '') ||
    (rider?.email && !rider.email.includes('@') ? rider.email : '') || '';
  const email = rider?.email?.includes('@') ? rider.email : (userData?.email?.includes('@') ? userData.email : '');
  const nic = rider?.nicNumber || rider?.nic || '';
  const licenseNumber = rider?.licenseNumber || '';
  const address = rider?.address ? `${rider.address}${rider.city ? `, ${rider.city}` : ''}` : (rider?.city || '');

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={24} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Personal Details</Text>
          <View style={tw`w-6`} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-24`}>
          {/* Title */}
          <Text style={tw`text-2xl font-black text-slate-900 mb-6`}>Personal Information</Text>

          {/* Profile Card Container */}
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-4 gap-4`}>
            {/* Rider Avatar Header */}
            <View style={tw`flex-row items-center gap-4 pb-4 border-b border-slate-100`}>
              <View style={tw`w-16 h-16 rounded-full border-2 border-amber-300 overflow-hidden bg-slate-200`}>
                <Image
                  source={{ uri: rider?.profilePhotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text style={tw`text-lg font-black text-slate-900`}>{fullName}</Text>
                <Text style={tw`text-xs font-bold text-emerald-600 mt-0.5`}>
                  {rider?.isApproved ? 'Verified Rider ✓' : 'Registration Pending'}
                </Text>
              </View>
            </View>

            {/* Full Name */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Full Name</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{fullName}</Text>
                <Feather name="user" size={16} color="#64748B" />
              </View>
            </View>

            {/* Phone Number */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Phone Number</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{phone}</Text>
                <Feather name="phone" size={16} color="#64748B" />
              </View>
            </View>

            {/* Email Address */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Email Address</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{email}</Text>
                <Feather name="mail" size={16} color="#64748B" />
              </View>
            </View>

            {/* NIC Number */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>NIC / National ID</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{nic}</Text>
                <Feather name="credit-card" size={16} color="#64748B" />
              </View>
            </View>

            {/* Driving License Number */}
            <TouchableOpacity onPress={() => router.push('/driving-license' as any)}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Driving License No.</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{licenseNumber}</Text>
                <View style={tw`flex-row items-center gap-1`}>
                  <Text style={tw`text-xs font-bold text-blue-600`}>Update</Text>
                  <Feather name="chevron-right" size={16} color="#2563EB" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Home Address */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Home Address</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{address}</Text>
                <Feather name="map-pin" size={16} color="#64748B" />
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            style={tw`bg-[#0B1044] rounded-2xl py-4 items-center shadow-md`}>
            <Text style={tw`text-white font-extrabold text-base`}>Back to Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
