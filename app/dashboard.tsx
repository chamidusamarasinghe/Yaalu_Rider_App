import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function RiderDashboardScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#FAFAFA]`}>
        {/* Top Header Bar */}
        <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
          {/* Profile Avatar */}
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={tw`w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200`}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Online / Offline Toggle Pill */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsOnline(!isOnline)}
            style={tw`flex-row items-center bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-700 shadow-md gap-2`}>
            <View style={tw`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <Text style={tw`text-xs font-black text-white uppercase tracking-wider`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#94A3B8" />
          </TouchableOpacity>

          {/* Quick Notification Bell */}
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={tw`w-10 h-10 rounded-full bg-white/20 items-center justify-center relative`}>
            <Ionicons name="notifications-outline" size={20} color="#0B1044" />
            <View style={tw`w-2.5 h-2.5 rounded-full bg-red-500 absolute top-2 right-2 border border-white`} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
          {/* Earnings Card */}
          <View style={tw`bg-[#0B1044] rounded-3xl p-5 shadow-xl mb-4 relative overflow-hidden`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-xs font-bold text-slate-300 uppercase tracking-widest`}>Today's Earnings</Text>
              <View style={tw`bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 rounded-full`}>
                <Text style={tw`text-[10px] font-black text-emerald-300`}>+18.4% vs yesterday</Text>
              </View>
            </View>

            <Text style={tw`text-3xl font-black text-white`}>LKR 4,250.00</Text>
            <Text style={tw`text-xs text-slate-400 mt-1`}>14 Completed Deliveries • 6.2 hrs online</Text>

            {/* Quick Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/wallet')}
              style={tw`bg-amber-400 rounded-xl py-2.5 px-4 self-start mt-4 flex-row items-center gap-1.5 shadow-md`}>
              <Text style={tw`text-xs font-black text-[#0B1044]`}>View Wallet & Payouts</Text>
              <Ionicons name="arrow-forward" size={14} color="#0B1044" />
            </TouchableOpacity>
          </View>

          {/* New Orders Floating Alert Banner */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/new-requests')}
            style={tw`bg-amber-400 border border-amber-300 rounded-2xl p-4 flex-row items-center justify-between shadow-md mb-5`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-10 h-10 rounded-xl bg-[#0B1044] items-center justify-center`}>
                <Ionicons name="flash" size={20} color="#FFC72C" />
              </View>
              <View>
                <Text style={tw`text-sm font-black text-[#0B1044]`}>3 New Requests Nearby!</Text>
                <Text style={tw`text-xs font-semibold text-slate-800`}>Highest fare: LKR 650 • 2.4 km</Text>
              </View>
            </View>
            <View style={tw`bg-[#0B1044] px-3 py-1.5 rounded-lg`}>
              <Text style={tw`text-xs font-extrabold text-amber-400`}>View</Text>
            </View>
          </TouchableOpacity>

          {/* Quick Metrics Grid */}
          <Text style={tw`text-sm font-black text-slate-900 mb-3 uppercase tracking-wider`}>Performance Metrics</Text>
          <View style={tw`flex-row gap-3 mb-5`}>
            <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs`}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#16A34A" />
              <Text style={tw`text-xs font-semibold text-slate-400 mt-2`}>Acceptance</Text>
              <Text style={tw`text-lg font-black text-slate-900 mt-0.5`}>98.5%</Text>
            </View>

            <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs`}>
              <Ionicons name="star-outline" size={22} color="#EAB308" />
              <Text style={tw`text-xs font-semibold text-slate-400 mt-2`}>Rating</Text>
              <Text style={tw`text-lg font-black text-slate-900 mt-0.5`}>4.9 ★</Text>
            </View>

            <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs`}>
              <Ionicons name="time-outline" size={22} color="#2563EB" />
              <Text style={tw`text-xs font-semibold text-slate-400 mt-2`}>Avg Time</Text>
              <Text style={tw`text-lg font-black text-slate-900 mt-0.5`}>22 min</Text>
            </View>
          </View>

          {/* Active / Recent Trips */}
          <Text style={tw`text-sm font-black text-slate-900 mb-3 uppercase tracking-wider`}>Recent Activity</Text>
          <View style={tw`bg-white rounded-2xl p-4 border border-slate-200 shadow-xs gap-3`}>
            <View style={tw`flex-row justify-between items-center border-b border-slate-100 pb-3`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-9 h-9 rounded-xl bg-blue-50 items-center justify-center`}>
                  <Ionicons name="fast-food-outline" size={18} color="#2563EB" />
                </View>
                <View>
                  <Text style={tw`text-xs font-bold text-slate-900`}>Burger King • Bambalapitiya</Text>
                  <Text style={tw`text-[10px] text-slate-400`}>Delivered to Kollupitiya • 12:40 PM</Text>
                </View>
              </View>
              <Text style={tw`text-xs font-black text-emerald-600`}>+LKR 380</Text>
            </View>

            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-9 h-9 rounded-xl bg-amber-50 items-center justify-center`}>
                  <Ionicons name="bag-handle-outline" size={18} color="#D97706" />
                </View>
                <View>
                  <Text style={tw`text-xs font-bold text-slate-900`}>Keells Super • Nugegoda</Text>
                  <Text style={tw`text-[10px] text-slate-400`}>Delivered to Nawala • 11:15 AM</Text>
                </View>
              </View>
              <Text style={tw`text-xs font-black text-emerald-600`}>+LKR 520</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2`}>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`items-center`}>
            <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
              <Ionicons name="home" size={18} color="#0B1044" />
              <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Home</Text>
            </View>
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
            <Ionicons name="person-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
