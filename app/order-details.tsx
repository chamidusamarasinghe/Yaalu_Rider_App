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

export default function OrderDetailsScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`w-10 h-10 rounded-full bg-white/40 items-center justify-center`}>
          <Ionicons name="arrow-back" size={20} color="#0B1044" />
        </TouchableOpacity>

        {/* YAALU Wordmark */}
        <Image
          source={require('@/assets/images/yaalu-wordmark.png')}
          style={tw`w-32 h-8`}
          resizeMode="contain"
        />

        {/* Online Toggle */}
        <View style={tw`flex-row items-center gap-1.5`}>
          <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Online</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsOnline(!isOnline)}
            style={tw`w-11 h-6 rounded-full ${isOnline ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'} p-0.5`}>
            <View style={tw`w-5 h-5 rounded-full bg-white shadow-sm`} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-10 gap-4`}>
        {/* Header Order Card */}
        <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs`}>
          <View style={tw`flex-row justify-between items-start`}>
            <View>
              <Text style={tw`text-lg font-black text-slate-900`}>Order #YL-8921</Text>
              <Text style={tw`text-xs font-medium text-slate-400 mt-1`}>
                May 26, 2026 • 2:45 PM
              </Text>
            </View>
            <View style={tw`bg-emerald-100/90 px-3 py-1 rounded-md`}>
              <Text style={tw`text-[10px] font-black text-emerald-700 tracking-wider`}>COMPLETED</Text>
            </View>
          </View>
        </View>

        {/* Map Preview Graphic */}
        <View style={tw`bg-slate-200 rounded-3xl h-44 border border-slate-200 overflow-hidden relative justify-center`}>
          {/* Simulated Map Streets */}
          <View style={tw`absolute inset-0 bg-[#E5E7EB] opacity-60`} />
          <View style={tw`absolute top-10 left-0 right-0 h-8 bg-white/70 transform -rotate-6`} />
          <View style={tw`absolute top-0 bottom-0 left-24 w-8 bg-white/70 transform rotate-12`} />
          <View style={tw`absolute top-0 bottom-0 right-20 w-8 bg-white/70 transform -rotate-12`} />

          {/* Route Blue Line */}
          <View style={tw`absolute top-14 left-24 right-20 h-1 bg-blue-600 rounded-full`} />

          {/* Pickup Marker */}
          <View style={tw`absolute top-12 left-20 items-center`}>
            <View style={tw`w-7 h-7 rounded-full bg-white items-center justify-center shadow-md`}>
              <View style={tw`w-3 h-3 rounded-full bg-red-500`} />
            </View>
            <View style={tw`bg-white px-1.5 py-0.5 rounded shadow-xs mt-1`}>
              <Text style={tw`text-[9px] font-bold text-slate-800`}>Market</Text>
            </View>
          </View>

          {/* Drop-off Marker */}
          <View style={tw`absolute top-8 right-16 items-center`}>
            <View style={tw`w-7 h-7 rounded-full bg-red-500 items-center justify-center shadow-md`}>
              <Ionicons name="location" size={16} color="#FFFFFF" />
            </View>
          </View>

          {/* Vehicle Pins */}
          <View style={tw`absolute top-3 left-32 bg-white rounded-full p-1 shadow-md`}>
            <FontAwesome5 name="taxi" size={14} color="#EAB308" />
          </View>
          <View style={tw`absolute bottom-4 right-12 bg-white rounded-full p-1 shadow-md`}>
            <FontAwesome5 name="taxi" size={14} color="#EAB308" />
          </View>
        </View>

        {/* Pickup & Drop-off Card */}
        <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs`}>
          {/* Pickup */}
          <View style={tw`flex-row items-start justify-between`}>
            <View style={tw`flex-row items-start gap-3 flex-1`}>
              <View style={tw`w-3.5 h-3.5 rounded-full bg-blue-600 mt-1`} />
              <View>
                <Text style={tw`text-xs font-semibold text-slate-400`}>Pickup</Text>
                <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>Blueberry Bakery</Text>
              </View>
            </View>
            <Text style={tw`text-xs font-bold text-slate-500`}>2:45 PM</Text>
          </View>

          {/* Connecting Line */}
          <View style={tw`w-0.5 h-6 bg-slate-200 ml-1.5 my-1`} />

          {/* Drop-off */}
          <View style={tw`flex-row items-start justify-between`}>
            <View style={tw`flex-row items-start gap-3 flex-1`}>
              <View style={tw`w-3.5 h-3.5 rounded-full bg-red-500 mt-1`} />
              <View>
                <Text style={tw`text-xs font-semibold text-slate-400`}>Drop-off</Text>
                <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>42nd Maple Street</Text>
              </View>
            </View>
            <Text style={tw`text-xs font-bold text-slate-500`}>3:10 PM</Text>
          </View>
        </View>

        {/* Trip Metrics Grid (3 Columns) */}
        <View style={tw`bg-white rounded-3xl p-4 flex-row justify-between border border-slate-200 shadow-xs`}>
          {/* Distance */}
          <View style={tw`flex-1 items-center border-r border-slate-100 pr-2`}>
            <View style={tw`w-10 h-10 rounded-full bg-emerald-50 items-center justify-center mb-2`}>
              <Ionicons name="flash-outline" size={20} color="#10B981" />
            </View>
            <Text style={tw`text-[11px] font-semibold text-slate-400`}>Distance</Text>
            <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>4.2 km</Text>
          </View>

          {/* Time Taken */}
          <View style={tw`flex-1 items-center border-r border-slate-100 px-2`}>
            <View style={tw`w-10 h-10 rounded-full bg-purple-50 items-center justify-center mb-2`}>
              <Ionicons name="time-outline" size={20} color="#8B5CF6" />
            </View>
            <Text style={tw`text-[11px] font-semibold text-slate-400`}>Time Taken</Text>
            <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>25 min</Text>
          </View>

          {/* Avg Speed */}
          <View style={tw`flex-1 items-center pl-2`}>
            <View style={tw`w-10 h-10 rounded-full bg-blue-50 items-center justify-center mb-2`}>
              <Ionicons name="speedometer-outline" size={20} color="#2563EB" />
            </View>
            <Text style={tw`text-[11px] font-semibold text-slate-400`}>Avg. Speed</Text>
            <Text style={tw`text-base font-black text-slate-900 mt-0.5`}>10.1 km/h</Text>
          </View>
        </View>

        {/* Earnings Breakdown */}
        <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs`}>
          <Text style={tw`text-base font-black text-slate-900 mb-4`}>Earnings Breakdown</Text>

          <View style={tw`gap-3`}>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-sm font-semibold text-slate-500`}>Base Fee</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>$8.00</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-sm font-semibold text-slate-500`}>Distance Fee (4.2 km)</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>$4.20</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-sm font-semibold text-slate-500`}>Time Fee (25 min)</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>$2.50</Text>
            </View>
            <View style={tw`flex-row justify-between`}>
              <Text style={tw`text-sm font-semibold text-slate-500`}>Additional Fee</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>$1.70</Text>
            </View>

            {/* Dashed Divider Line */}
            <View style={tw`w-full h-px border-b border-dashed border-slate-200 my-2`} />

            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-base font-black text-slate-900`}>Total Earnings</Text>
              <Text style={tw`text-xl font-black text-emerald-600`}>$12.40</Text>
            </View>
          </View>
        </View>

        {/* Payout Status */}
        <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs`}>
          <Text style={tw`text-base font-black text-slate-900 mb-4`}>Payout Status</Text>

          <View style={tw`flex-row items-center gap-3 mb-4`}>
            <View style={tw`w-8 h-8 rounded-full bg-emerald-500 items-center justify-center`}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
            <View>
              <Text style={tw`text-base font-extrabold text-slate-900`}>Paid</Text>
              <Text style={tw`text-xs text-slate-400 mt-0.5`}>May 26, 2026 • 4:15 PM</Text>
            </View>
          </View>

          <View style={tw`flex-row justify-between items-center pt-2`}>
            <Text style={tw`text-xs font-semibold text-slate-400`}>Paid to</Text>
            <Text style={tw`text-sm font-black text-slate-900`}>Wallet Balance</Text>
          </View>
        </View>

        {/* Back Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={tw`bg-[#070A2A] rounded-2xl py-4 items-center shadow-md mt-2`}>
          <Text style={tw`text-white font-extrabold text-base`}>Back</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

