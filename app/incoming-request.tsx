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
import tw from 'twrnc';

export default function IncomingRequestScreen() {
  const router = useRouter();

  const handleAccept = () => {
    router.push('/request-accepted');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-white`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Incoming Delivery Request</Text>

        <View style={tw`w-9 h-9 rounded-full border border-white overflow-hidden bg-slate-200`}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-6`}>
        {/* Map Preview Area */}
        <View style={tw`w-full h-56 bg-blue-50 relative overflow-hidden border-b border-slate-200`}>
          {/* Map Image Graphic */}
          <Image
            source={require('@/assets/images/navigate-pickup.png')}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />

          {/* Floating Pickup Location Card */}
          <View style={tw`absolute top-3 left-3 bg-white rounded-xl p-2.5 shadow-md border border-slate-200 w-56`}>
            <View style={tw`flex-row items-center gap-1.5`}>
              <View style={tw`w-2.5 h-2.5 rounded-full bg-blue-600`} />
              <Text style={tw`text-[10px] font-bold text-blue-600`}>Pickup</Text>
            </View>
            <Text style={tw`text-[11px] font-extrabold text-slate-900 mt-0.5`}>241 Central Gourmet Hub,</Text>
            <Text style={tw`text-[10px] text-slate-500`}>Victoria Island</Text>
          </View>

          {/* Expand Map Button */}
          <TouchableOpacity style={tw`absolute top-3 right-3 w-9 h-9 bg-white rounded-xl items-center justify-center shadow-md border border-slate-200`}>
            <Feather name="maximize-2" size={18} color="#1E293B" />
          </TouchableOpacity>
        </View>

        {/* Request Bottom Sheet Card */}
        <View style={tw`px-5 pt-4`}>
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-black text-slate-900`}>New Delivery Request</Text>
            <View style={tw`bg-slate-100 px-2.5 py-1 rounded-lg`}>
              <Text style={tw`text-xs font-bold text-slate-600`}>#YA-4587</Text>
            </View>
          </View>

          {/* Locations Card */}
          <View style={tw`mb-4`}>
            <View style={tw`flex-row items-start justify-between mb-2`}>
              <View style={tw`flex-row items-start flex-1 mr-2`}>
                <Ionicons name="location" size={20} color="#2563EB" style={tw`mr-2 mt-0.5`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-[10px] font-bold text-slate-400 uppercase`}>Pickup Location</Text>
                  <Text style={tw`text-sm font-extrabold text-slate-900`}>241 Central Gourmet Hub,</Text>
                  <Text style={tw`text-xs text-slate-500`}>Victoria Island</Text>
                </View>
              </View>
              <View style={tw`bg-blue-50 px-2.5 py-1 rounded-lg`}>
                <Text style={tw`text-xs font-bold text-blue-700`}>4.2 km</Text>
              </View>
            </View>

            <View style={tw`w-0.5 h-4 bg-slate-300 ml-2.5 my-0.5`} />

            <View style={tw`flex-row items-start`}>
              <Ionicons name="location" size={20} color="#EF4444" style={tw`mr-2 mt-0.5`} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-[10px] font-bold text-slate-400 uppercase`}>Drop-off Location</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>Block 4, Lekki Phase 1, Gate B</Text>
              </View>
            </View>
          </View>

          {/* Stat Row */}
          <View style={tw`flex-row gap-3 mb-4`}>
            <View style={tw`flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Distance</Text>
              <Text style={tw`text-base font-extrabold text-blue-700 mt-0.5`}>4.2 km</Text>
            </View>
            <View style={tw`flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Estimated Time</Text>
              <View style={tw`flex-row items-center gap-1 mt-0.5`}>
                <Ionicons name="time" size={16} color="#2563EB" />
                <Text style={tw`text-base font-extrabold text-blue-700`}>18 min</Text>
              </View>
            </View>
          </View>

          {/* Estimated Earnings Box */}
          <View style={tw`bg-emerald-50/60 rounded-2xl p-4 border border-emerald-200 mb-4 flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-10 h-10 rounded-xl bg-emerald-100 items-center justify-center`}>
                <Ionicons name="wallet-outline" size={20} color="#059669" />
              </View>
              <View>
                <Text style={tw`text-[10px] font-bold text-slate-500`}>Estimated Earnings</Text>
                <Text style={tw`text-xl font-black text-emerald-700`}>LKR 2,450.00</Text>
                <Text style={tw`text-[8px] text-slate-400`}>*Calculated based on distance, time and demand</Text>
              </View>
            </View>
          </View>

          {/* Accept Timer Box */}
          <View style={tw`bg-white rounded-2xl p-4 border border-slate-200 flex-row items-center justify-between mb-3 shadow-xs`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-10 h-10 rounded-full bg-amber-100 items-center justify-center`}>
                <Ionicons name="timer-outline" size={22} color="#D97706" />
              </View>
              <View>
                <Text style={tw`text-[10px] font-bold text-slate-500`}>Accept within</Text>
                <Text style={tw`text-xl font-black text-amber-500 tracking-wider`}>00 : 18</Text>
              </View>
            </View>

            <View style={tw`w-10 h-10 rounded-full border-4 border-amber-400 border-t-slate-200`} />
          </View>

          {/* Auto Decline Info */}
          <View style={tw`bg-slate-100 rounded-xl p-3 flex-row items-center gap-2 mb-5`}>
            <Ionicons name="information-circle-outline" size={16} color="#64748B" />
            <Text style={tw`text-[11px] text-slate-500 font-medium`}>
              Request will be auto-declined when timer ends.
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleAccept}
            style={tw`bg-[#070A2A] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-3`}>
            <Ionicons name="checkmark-circle" size={20} color="#38BDF8" />
            <Text style={tw`text-white font-extrabold text-base`}>Accept Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/dashboard')}
            style={tw`bg-white border-2 border-slate-200 rounded-2xl py-3.5 flex-row items-center justify-center gap-2`}>
            <Text style={tw`text-slate-700 font-extrabold text-sm`}>Decline</Text>
            <Ionicons name="close-circle-outline" size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}
