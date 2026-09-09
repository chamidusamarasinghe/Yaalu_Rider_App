import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function DeliveryCompletedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Delivery Completed</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-10`}>
        {/* Main Content Card */}
        <View style={tw`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 items-center`}>
          {/* Confetti + Green Checkmark Circle */}
          <View style={tw`relative items-center justify-center my-4`}>
            {/* Colorful dots */}
            <View style={tw`absolute -top-4 -left-8 w-2.5 h-2.5 rounded-full bg-emerald-500`} />
            <View style={tw`absolute -top-5 right-2 w-2 h-2 rounded-full bg-amber-400`} />
            <View style={tw`absolute top-1 -right-10 w-2.5 h-2.5 rounded-full bg-purple-500`} />
            <View style={tw`absolute bottom-2 -right-8 w-2 h-2 rounded-full bg-blue-500`} />
            <View style={tw`absolute -bottom-3 left-2 w-2.5 h-2.5 rounded-full bg-red-400`} />
            <View style={tw`absolute bottom-3 -left-10 w-2 h-2 rounded-full bg-blue-600`} />

            {/* Main Green Icon */}
            <View style={tw`w-24 h-24 rounded-full bg-emerald-500 items-center justify-center shadow-xl shadow-emerald-200`}>
              <Ionicons name="checkmark" size={56} color="#FFFFFF" />
            </View>
          </View>

          {/* Title & Subtitle */}
          <Text style={tw`text-2xl font-black text-emerald-600 mt-2 mb-1 text-center`}>Delivery Completed!</Text>
          <Text style={tw`text-xs font-semibold text-slate-400 text-center mb-6 px-4`}>
            You have successfully delivered the order.
          </Text>

          {/* Order Summary Details Box */}
          <View style={tw`w-full bg-slate-50/80 rounded-2xl p-4 gap-3.5 border border-slate-100 mb-6`}>
            {/* Order ID */}
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-8 h-8 rounded-xl bg-blue-50 items-center justify-center`}>
                  <Feather name="shopping-bag" size={16} color="#2563EB" />
                </View>
                <Text style={tw`text-xs font-semibold text-slate-500`}>Order ID</Text>
              </View>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>#YA-4587</Text>
            </View>

            {/* Customer */}
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-8 h-8 rounded-xl bg-blue-50 items-center justify-center`}>
                  <Feather name="user" size={16} color="#2563EB" />
                </View>
                <Text style={tw`text-xs font-semibold text-slate-500`}>Customer</Text>
              </View>
              <View style={tw`flex-row items-center gap-2`}>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>Sarah Jenkins</Text>
                <TouchableOpacity style={tw`w-7 h-7 rounded-full bg-blue-100 items-center justify-center`}>
                  <Ionicons name="call" size={14} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Distance */}
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-8 h-8 rounded-xl bg-blue-50 items-center justify-center`}>
                  <Feather name="map-pin" size={16} color="#2563EB" />
                </View>
                <Text style={tw`text-xs font-semibold text-slate-500`}>Distance</Text>
              </View>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>3.2 km</Text>
            </View>

            {/* Time Taken */}
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-8 h-8 rounded-xl bg-blue-50 items-center justify-center`}>
                  <Feather name="clock" size={16} color="#2563EB" />
                </View>
                <Text style={tw`text-xs font-semibold text-slate-500`}>Time Taken</Text>
              </View>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>18 min</Text>
            </View>

            {/* Earnings */}
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-8 h-8 rounded-xl bg-blue-50 items-center justify-center`}>
                  <Feather name="dollar-sign" size={16} color="#2563EB" />
                </View>
                <Text style={tw`text-xs font-semibold text-slate-500`}>Earnings</Text>
              </View>
              <Text style={tw`text-sm font-black text-slate-900`}>LKR 450.00</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/dashboard')}
            style={tw`w-full bg-[#070A2A] rounded-2xl py-4 items-center shadow-md mb-3`}>
            <Text style={tw`text-white font-extrabold text-base`}>Back to Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/new-requests')}
            style={tw`w-full bg-white border border-slate-200 rounded-2xl py-3.5 items-center`}>
            <Text style={tw`text-slate-800 font-extrabold text-base`}>Next Delivery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}
