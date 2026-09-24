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

export default function RequestAcceptedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-slate-800`}>

      {/* Top Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <View style={tw`w-9 h-9 rounded-full border border-white overflow-hidden bg-slate-200`}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity onPress={() => router.push('/dashboard')}>
          <Ionicons name="close" size={24} color="#0B1044" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-8`}>
        {/* Main White Card Modal */}
        <View style={tw`bg-white rounded-3xl p-5 shadow-2xl items-center`}>
          {/* Green Confetti Checkmark Circle */}
          <View style={tw`relative my-4 items-center justify-center`}>
            <View style={tw`w-24 h-24 rounded-full bg-emerald-600 items-center justify-center shadow-lg border-4 border-emerald-100`}>
              <Ionicons name="checkmark" size={48} color="#FFFFFF" />
            </View>

            {/* Confetti Dots */}
            <View style={tw`absolute -top-2 left-1 w-3 h-3 rounded-full bg-emerald-400`} />
            <View style={tw`absolute top-3 -right-3 w-2.5 h-2.5 rounded-full bg-blue-500`} />
            <View style={tw`absolute bottom-1 -left-4 w-2 h-2 rounded-full bg-blue-400`} />
            <View style={tw`absolute -bottom-2 right-5 w-3 h-3 rounded-full bg-yellow-400`} />
          </View>

          <Text style={tw`text-2xl font-black text-emerald-600 text-center`}>Request Accepted!</Text>
          <Text style={tw`text-xs font-semibold text-slate-500 text-center mt-1 mb-4`}>
            Navigating to pickup location
          </Text>

          {/* Green Alert Box */}
          <View style={tw`w-full bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex-row items-center gap-3 mb-5`}>
            <Ionicons name="flag-outline" size={22} color="#059669" />
            <Text style={tw`flex-1 text-xs font-bold text-slate-700 leading-4`}>
              You have 15 minutes to arrive at the pickup location.
            </Text>
          </View>

          {/* Order ID */}
          <View style={tw`w-full flex-row justify-between items-center border-t border-b border-slate-100 py-3 mb-4`}>
            <Text style={tw`text-xs font-bold text-slate-400`}>Order ID</Text>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>#YA-4587</Text>
          </View>

          {/* Pickup & Drop-off Locations */}
          <View style={tw`w-full mb-5 gap-3`}>
            <View style={tw`flex-row items-start gap-2.5`}>
              <Ionicons name="location" size={20} color="#2563EB" style={tw`mt-0.5`} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-[10px] font-bold text-blue-600 uppercase`}>Pickup Location</Text>
                <Text style={tw`text-xs font-extrabold text-slate-900`}>241 Central Gourmet Hub, Victoria Island</Text>
              </View>
            </View>

            <View style={tw`flex-row items-start gap-2.5`}>
              <Ionicons name="location" size={20} color="#EF4444" style={tw`mt-0.5`} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-[10px] font-bold text-red-500 uppercase`}>Drop-off Location</Text>
                <Text style={tw`text-xs font-extrabold text-slate-900`}>Block 4, Lekki Phase 1, Gate B</Text>
              </View>
            </View>
          </View>

          {/* Customer Info Box */}
          <View style={tw`w-full bg-slate-50 rounded-2xl p-3.5 flex-row items-center justify-between border border-slate-200 mb-4`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-white shadow-xs`}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>Sarah Jenkins</Text>
                <Text style={tw`text-[10px] text-slate-500 font-medium`}>Customer ★ <Text style={tw`font-bold text-slate-800`}>4.8</Text></Text>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.8} style={tw`w-11 h-11 rounded-full bg-[#070A2A] items-center justify-center shadow-md`}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Safety First Box */}
          <View style={tw`w-full bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 flex-row items-start gap-3 mb-6`}>
            <Ionicons name="shield-checkmark" size={20} color="#2563EB" style={tw`mt-0.5`} />
            <View style={tw`flex-1`}>
              <Text style={tw`text-xs font-extrabold text-blue-900`}>Safety First</Text>
              <Text style={tw`text-[11px] text-slate-500 leading-4 mt-0.5`}>
                Do not share order details or OTP with anyone. Contact support if you need help.
              </Text>
            </View>
          </View>

          {/* Primary Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/delivery/navigation')}
            style={tw`w-full bg-[#070A2A] rounded-2xl py-4 flex-row items-center justify-between px-6 shadow-md mb-3`}>
            <View style={tw`flex-row items-center gap-2`}>
              <Feather name="navigation" size={18} color="#FFFFFF" />
              <Text style={tw`text-white font-extrabold text-base`}>Navigate to Pickup</Text>
            </View>
            <Text style={tw`text-xs font-bold text-slate-300`}>4.2 km</Text>
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/delivery/step1')}
            style={tw`w-full bg-white border-2 border-slate-200 rounded-2xl py-3.5 flex-row items-center justify-center gap-2`}>
            <Feather name="menu" size={18} color="#0B1044" />
            <Text style={tw`text-[#0B1044] font-extrabold text-sm`}>View Order Details</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Dark Notice Box */}
        <View style={tw`w-full bg-[#272B38] rounded-2xl p-3.5 flex-row items-center gap-3 mt-4`}>
          <Feather name="refresh-cw" size={18} color="#94A3B8" />
          <Text style={tw`flex-1 text-[11px] text-slate-300 font-medium leading-4`}>
            Respond in 12s or request auto-assigns to another driver
          </Text>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

