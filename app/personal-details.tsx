import React from 'react';
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

export default function PersonalDetailsScreen() {
  const router = useRouter();

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
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={tw`text-lg font-black text-slate-900`}>Harsha Perera</Text>
              <Text style={tw`text-xs font-bold text-emerald-600 mt-0.5`}>Verified Rider ✓</Text>
            </View>
          </View>

          {/* Full Name */}
          <View>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Full Name</Text>
            <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
              <Text style={tw`text-sm font-bold text-slate-900`}>Harsha Perera</Text>
              <Feather name="user" size={16} color="#64748B" />
            </View>
          </View>

          {/* Phone Number */}
          <View>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Phone Number</Text>
            <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
              <Text style={tw`text-sm font-bold text-slate-900`}>+94 77 123 4567</Text>
              <Feather name="phone" size={16} color="#64748B" />
            </View>
          </View>

          {/* Email Address */}
          <View>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Email Address</Text>
            <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
              <Text style={tw`text-sm font-bold text-slate-900`}>harsha.perera@example.com</Text>
              <Feather name="mail" size={16} color="#64748B" />
            </View>
          </View>

          {/* NIC Number */}
          <View>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>NIC / National ID</Text>
            <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
              <Text style={tw`text-sm font-bold text-slate-900`}>199412345678</Text>
              <Feather name="credit-card" size={16} color="#64748B" />
            </View>
          </View>

          {/* Driving License Number */}
          <TouchableOpacity onPress={() => router.push('/driving-license' as any)}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Driving License No. (Tap to update)</Text>
            <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
              <Text style={tw`text-sm font-bold text-slate-900`}>B9876543</Text>
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
              <Text style={tw`text-sm font-bold text-slate-900`}>No. 45, Galle Road, Colombo 03</Text>
              <Feather name="map-pin" size={16} color="#64748B" />
            </View>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={tw`bg-[#070A2A] rounded-2xl py-4 items-center shadow-md`}>
          <Text style={tw`text-white font-extrabold text-base`}>Back to Profile</Text>
        </TouchableOpacity>
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

