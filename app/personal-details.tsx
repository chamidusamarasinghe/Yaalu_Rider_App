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

  useEffect(() => {
    (async () => {
      const saved = await getSavedRider();
      if (saved) setRider(saved);

      try {
        const res = await riderApi.getProfile();
        if (res?.rider) setRider(res.rider);
      } catch (e) {
        // use saved fallback
      }
    })();
  }, []);

  const fullName = rider?.fullName || `${rider?.firstName || ''} ${rider?.lastName || ''}`.trim() || 'Harsha Perera';
  const phone = rider?.phone || rider?.mobile || '+94 77 123 4567';
  const email = rider?.email || 'rider@yaalu.com';
  const nic = rider?.nicNumber || '199412345678';
  const licenseNumber = rider?.licenseNumber || 'B9876543';
  const address = rider?.address ? `${rider.address}${rider.city ? `, ${rider.city}` : ''}` : 'Colombo, Sri Lanka';

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
