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
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function LiveNavigationScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-white`}>

      {/* Top Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Navigation</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-20`}>
        {/* Top Pickup to Drop-off Route Banner */}
        <View style={tw`bg-white px-5 py-3 shadow-xs border-b border-slate-100 flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center gap-2 flex-1 mr-2`}>
            <View style={tw`w-2.5 h-2.5 rounded-full bg-emerald-500`} />
            <View style={tw`flex-1`}>
              <Text style={tw`text-[9px] font-bold text-slate-400 uppercase`}>PICKUP</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`} numberOfLines={1}>Blueberry Bakery</Text>
              <Text style={tw`text-[10px] text-slate-500`} numberOfLines={1}>Downtown</Text>
            </View>
          </View>

          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />

          <View style={tw`flex-row items-center gap-2 flex-1 ml-2`}>
            <View style={tw`w-2.5 h-2.5 rounded-full bg-red-500`} />
            <View style={tw`flex-1`}>
              <Text style={tw`text-[9px] font-bold text-slate-400 uppercase`}>DROP-OFF</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`} numberOfLines={1}>42nd Maple Street</Text>
              <Text style={tw`text-[10px] text-slate-500`} numberOfLines={1}>Apt 4B</Text>
            </View>
          </View>
        </View>

        {/* Live Map Area */}
        <View style={tw`w-full h-80 bg-slate-100 relative overflow-hidden border-b border-slate-200`}>
          {/* Map Route Image */}
          <Image
            source={require('@/assets/images/live-navigation.png')}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />

          {/* Turn-by-Turn Instruction Box (Top Left) */}
          <View style={tw`absolute top-4 left-4 bg-white rounded-2xl p-3.5 shadow-lg border border-slate-200 w-52`}>
            <Text style={tw`text-[10px] font-bold text-blue-600`}>Next Turn In</Text>
            <View style={tw`flex-row items-center justify-between mt-0.5`}>
              <Text style={tw`text-2xl font-black text-slate-900`}>250 m</Text>
              <View style={tw`w-8 h-8 rounded-full bg-indigo-900 items-center justify-center`}>
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
              </View>
            </View>
            <Text style={tw`text-[10px] text-slate-500 mt-1`}>Turn right onto Maple Street</Text>
          </View>

          {/* Floating Controls (Top Right) */}
          <View style={tw`absolute top-4 right-4 gap-2`}>
            <TouchableOpacity style={tw`w-10 h-10 bg-white rounded-xl items-center justify-center shadow-md border border-slate-200`}>
              <Ionicons name="volume-mute-outline" size={20} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`w-10 h-10 bg-white rounded-xl items-center justify-center shadow-md border border-slate-200`}>
              <Ionicons name="car-outline" size={20} color="#475569" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`w-10 h-10 bg-white rounded-xl items-center justify-center shadow-md border border-slate-200`}>
              <Ionicons name="navigate-outline" size={20} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Speedometer Badge (Bottom Left) */}
          <View style={tw`absolute bottom-4 left-4 bg-white rounded-2xl px-3 py-2 shadow-md border border-slate-200 items-center`}>
            <Text style={tw`text-base font-black text-blue-700`}>38</Text>
            <Text style={tw`text-[8px] font-bold text-slate-400`}>km/h</Text>
          </View>
        </View>

        {/* Bottom Route Details & Trip Progress */}
        <View style={tw`p-5 gap-3`}>
          {/* Distance, Est. Time, Est. Arrival */}
          <View style={tw`bg-white rounded-2xl p-4 border border-slate-200 flex-row justify-between items-center shadow-xs`}>
            <View style={tw`flex-row items-center gap-2.5`}>
              <View style={tw`w-9 h-9 rounded-full bg-emerald-50 items-center justify-center`}>
                <Ionicons name="swap-horizontal" size={18} color="#059669" />
              </View>
              <View>
                <Text style={tw`text-[9px] font-bold text-slate-400`}>Distance</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>4.2 km</Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-2.5`}>
              <View style={tw`w-9 h-9 rounded-full bg-blue-50 items-center justify-center`}>
                <Ionicons name="time-outline" size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={tw`text-[9px] font-bold text-slate-400`}>Estimated Time</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>12 min</Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-2.5`}>
              <View style={tw`w-9 h-9 rounded-full bg-purple-50 items-center justify-center`}>
                <Ionicons name="time" size={18} color="#7C3AED" />
              </View>
              <View>
                <Text style={tw`text-[9px] font-bold text-slate-400`}>Estimated Arrival</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>9:53 AM</Text>
              </View>
            </View>
          </View>

          {/* Turn Banner */}
          <View style={tw`bg-white rounded-2xl p-4 border border-slate-200 shadow-xs`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-10 h-10 rounded-xl bg-[#070A2A] items-center justify-center`}>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>Turn right onto Maple Street</Text>
                <View style={tw`h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden`}>
                  <View style={tw`h-full w-1/3 bg-blue-600 rounded-full`} />
                </View>
                <View style={tw`flex-row justify-between mt-1`}>
                  <Text style={tw`text-[9px] text-slate-400`}>1.6 km</Text>
                  <Text style={tw`text-[9px] text-slate-400`}>4.2 km</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Trip Progress Box */}
          <View style={tw`bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3 flex-1 mr-2`}>
              <View style={tw`w-9 h-9 rounded-full bg-emerald-100 items-center justify-center`}>
                <Ionicons name="navigate-circle-outline" size={22} color="#059669" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-extrabold text-emerald-900`}>Trip in Progress</Text>
                <Text style={tw`text-[10px] text-emerald-700`}>Order #YA-4587 • Stay safe!</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/delivery/step1')}
              style={tw`bg-white border border-emerald-300 px-4 py-2 rounded-xl shadow-xs`}>
              <Text style={tw`text-xs font-extrabold text-emerald-800`}>Status</Text>
            </TouchableOpacity>
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

        <TouchableOpacity onPress={() => router.push('/new-requests')} style={tw`items-center`}>
          <Ionicons name="cart-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`items-center`}>
          <Ionicons name="wallet-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`items-center`}>
          <Ionicons name="notifications-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`items-center`}>
          <Ionicons name="person-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Profile</Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

