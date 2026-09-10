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
import tw from '@/lib/tw';

export default function WalletScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [period, setPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');

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
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </TouchableOpacity>

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

          <TouchableOpacity
            onPress={() => router.push('/bank-details' as any)}
            style={tw`w-10 h-10 rounded-full bg-white/20 items-center justify-center`}>
            <Ionicons name="card-outline" size={20} color="#0B1044" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
          <Text style={tw`text-2xl font-black text-slate-900 mb-3`}>My Wallet</Text>

          {/* Wallet Balance Hero Card */}
          <View style={tw`bg-[#0B1044] rounded-3xl p-5 shadow-xl mb-5 relative overflow-hidden`}>
            <Text style={tw`text-xs font-bold text-slate-300 uppercase tracking-widest mb-1`}>Available Balance</Text>
            <Text style={tw`text-3xl font-black text-white`}>LKR 28,450.00</Text>
            <Text style={tw`text-xs text-slate-400 mt-1`}>Next payout scheduled for Monday 8:00 AM</Text>

            <View style={tw`flex-row gap-3 mt-5`}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/bank-details' as any)}
                style={tw`flex-1 bg-amber-400 py-3 rounded-xl items-center justify-center shadow-md`}>
                <Text style={tw`text-xs font-black text-[#0B1044]`}>Cash Out Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/bank-details' as any)}
                style={tw`flex-1 bg-white/10 border border-white/20 py-3 rounded-xl items-center justify-center`}>
                <Text style={tw`text-xs font-extrabold text-white`}>Bank Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Summary Grid Cards */}
          <View style={tw`flex-row gap-3 mb-5`}>
            <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs`}>
              <Text style={tw`text-[11px] font-bold text-slate-400 uppercase`}>Gross Earnings</Text>
              <Text style={tw`text-base font-black text-slate-900 mt-1`}>LKR 32,700</Text>
              <Text style={tw`text-[10px] font-bold text-emerald-600 mt-1`}>+12.5% this week</Text>
            </View>

            <View style={tw`flex-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-xs`}>
              <Text style={tw`text-[11px] font-bold text-slate-400 uppercase`}>Total Penalties</Text>
              <Text style={tw`text-base font-black text-rose-600 mt-1`}>-LKR 1,250</Text>
              <Text style={tw`text-[10px] font-bold text-slate-400 mt-1`}>2 System Alerts</Text>
            </View>
          </View>

          {/* Recent Payout & Earnings Activity */}
          <Text style={tw`text-sm font-black text-slate-900 mb-3 uppercase tracking-wider`}>Recent Transactions</Text>
          <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 shadow-xs gap-3.5 mb-4`}>
            <View style={tw`flex-row justify-between items-center border-b border-slate-100 pb-3`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-10 h-10 rounded-2xl bg-emerald-50 items-center justify-center`}>
                  <Ionicons name="arrow-down" size={20} color="#16A34A" />
                </View>
                <View>
                  <Text style={tw`text-sm font-black text-slate-900`}>Weekly Payout Transfer</Text>
                  <Text style={tw`text-[11px] text-slate-400`}>Commercial Bank **** 1234 • Today</Text>
                </View>
              </View>
              <Text style={tw`text-sm font-black text-emerald-600`}>+LKR 28,450</Text>
            </View>

            <View style={tw`flex-row justify-between items-center border-b border-slate-100 pb-3`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-10 h-10 rounded-2xl bg-blue-50 items-center justify-center`}>
                  <Ionicons name="bicycle" size={20} color="#2563EB" />
                </View>
                <View>
                  <Text style={tw`text-sm font-black text-slate-900`}>Trip Earnings (14 Orders)</Text>
                  <Text style={tw`text-[11px] text-slate-400`}>Daily Delivery Fares • Yesterday</Text>
                </View>
              </View>
              <Text style={tw`text-sm font-black text-slate-900`}>+LKR 4,250</Text>
            </View>

            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-10 h-10 rounded-2xl bg-rose-50 items-center justify-center`}>
                  <Ionicons name="warning" size={20} color="#E11D48" />
                </View>
                <View>
                  <Text style={tw`text-sm font-black text-slate-900`}>Cancellation Penalty</Text>
                  <Text style={tw`text-[11px] text-slate-400`}>Order #YA-4412 • 2 days ago</Text>
                </View>
              </View>
              <Text style={tw`text-sm font-black text-rose-600`}>-LKR 500</Text>
            </View>
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
            <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
              <Ionicons name="wallet" size={18} color="#0B1044" />
              <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Wallet</Text>
            </View>
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

