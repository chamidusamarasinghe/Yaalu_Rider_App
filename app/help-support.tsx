import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Help & Support</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
        {/* Top Quick Contact Action Cards */}
        <View style={tw`flex-row gap-3 mb-4`}>
          {/* Chat with Us */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Chat Support', 'Connecting to Yaalu live support...')}
            style={tw`flex-1 bg-white rounded-3xl p-4 border border-slate-200 shadow-xs items-center justify-center py-6`}>
            <View style={tw`w-12 h-12 rounded-2xl bg-blue-600 items-center justify-center mb-3 shadow-md shadow-blue-200`}>
              <Ionicons name="chatbubble-ellipses" size={22} color="#FFFFFF" />
            </View>
            <Text style={tw`text-sm font-black text-slate-900`}>Chat with Us</Text>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mt-0.5`}>Online now</Text>
          </TouchableOpacity>

          {/* Call Support */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Call Support', 'Calling 011-2345678...')}
            style={tw`flex-1 bg-white rounded-3xl p-4 border border-slate-200 shadow-xs items-center justify-center py-6`}>
            <View style={tw`w-12 h-12 rounded-2xl border-2 border-blue-600 items-center justify-center mb-3 bg-blue-50/50`}>
              <Ionicons name="call" size={20} color="#2563EB" />
            </View>
            <Text style={tw`text-sm font-black text-slate-900`}>Call Support</Text>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mt-0.5`}>24/7 Availability</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={tw`bg-[#F1F5F9]/80 border border-slate-200 rounded-2xl px-4 py-3 flex-row items-center gap-2.5 mb-5 shadow-xs`}>
          <Ionicons name="search" size={18} color="#64748B" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for help topics..."
            placeholderTextColor="#94A3B8"
            style={tw`flex-1 text-xs font-semibold text-slate-900 p-0`}
          />
        </View>

        {/* Category List Box */}
        <View style={tw`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-6`}>
          {/* Delivery Issues */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Delivery Issues', 'Browse delivery troubleshooting topics.')}
            style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="warning-outline" size={20} color="#475569" />
              <Text style={tw`text-sm font-extrabold text-slate-800`}>Delivery Issues</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Payment & Earnings */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Payment & Earnings', 'Help with payouts & weekly earnings.')}
            style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="cash-outline" size={20} color="#475569" />
              <Text style={tw`text-sm font-extrabold text-slate-800`}>Payment & Earnings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Account Settings */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Account Settings', 'Profile details & app preferences.')}
            style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="person-outline" size={20} color="#475569" />
              <Text style={tw`text-sm font-extrabold text-slate-800`}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Safety & Security */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Safety & Security', 'Rider safety guidelines and SOS policies.')}
            style={tw`p-4 flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="shield-outline" size={20} color="#475569" />
              <Text style={tw`text-sm font-extrabold text-slate-800`}>Safety & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Step-by-Step Guides */}
        <Text style={tw`text-base font-black text-slate-900 mb-3`}>Step-by-Step Guides</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={tw`-mx-1 px-1 mb-6`}>
          {/* Card 1 */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={tw`w-56 bg-white rounded-3xl border border-slate-200 overflow-hidden mr-3.5 shadow-xs`}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=400' }}
              style={tw`w-full h-28`}
              resizeMode="cover"
            />
            <View style={tw`p-3.5`}>
              <View style={tw`bg-amber-400 self-start px-2 py-0.5 rounded-md mb-1.5`}>
                <Text style={tw`text-[9px] font-black text-slate-900 tracking-wider`}>GUIDE</Text>
              </View>
              <Text style={tw`text-xs font-black text-slate-900`}>How to Complete a Delivery</Text>
              <Text style={tw`text-[10px] text-slate-500 mt-1 leading-3.5`}>
                Master the Yaalu delivery flow from pickup to drop-off.
              </Text>
            </View>
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={tw`w-56 bg-white rounded-3xl border border-slate-200 overflow-hidden mr-3.5 shadow-xs`}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400' }}
              style={tw`w-full h-28`}
              resizeMode="cover"
            />
            <View style={tw`p-3.5`}>
              <View style={tw`bg-amber-400 self-start px-2 py-0.5 rounded-md mb-1.5`}>
                <Text style={tw`text-[9px] font-black text-slate-900 tracking-wider`}>TUTORIAL</Text>
              </View>
              <Text style={tw`text-xs font-black text-slate-900`}>Understanding Earnings</Text>
              <Text style={tw`text-[10px] text-slate-500 mt-1 leading-3.5`}>
                Learn how payments and bonuses are processed.
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Visit Help Center Banner */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => Alert.alert('Help Center', 'Opening web documentation...')}
          style={tw`bg-[#030626] rounded-3xl p-5 flex-row items-center justify-between shadow-xl`}>
          <View style={tw`flex-1 pr-3`}>
            <Text style={tw`text-base font-black text-white`}>Visit Help Center</Text>
            <Text style={tw`text-xs text-slate-300 mt-1`}>
              Detailed documentation for all partner riders.
            </Text>
          </View>
          <View style={tw`w-12 h-12 rounded-2xl bg-white/10 border border-white/20 items-center justify-center`}>
            <Feather name="external-link" size={20} color="#FFFFFF" />
          </View>
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
