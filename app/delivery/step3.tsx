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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function DeliveryStep3Screen() {
  const router = useRouter();

  const handleNextProgress = () => {
    router.push('/delivery/step4');
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
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Delivery status</Text>

        <View style={tw`w-9 h-9 rounded-full border border-white overflow-hidden bg-slate-200`}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-10`}>
        <Text style={tw`text-xl font-black text-slate-900 mb-3`}>Order #YA-4587</Text>

        {/* Customer Info Box */}
        <View style={tw`w-full bg-white rounded-2xl p-3.5 flex-row items-center justify-between border border-slate-200 mb-5 shadow-xs`}>
          <View style={tw`flex-row items-center gap-3`}>
            <View style={tw`w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-white shadow-xs`}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={tw`text-base font-extrabold text-slate-900`}>Sarah Jenkins</Text>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.8} style={tw`w-11 h-11 rounded-full bg-blue-600 items-center justify-center shadow-md`}>
            <Ionicons name="call" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Pickup & Drop-off Route Details */}
        <View style={tw`mb-6 pl-2`}>
          <View style={tw`flex-row items-start gap-3`}>
            <View style={tw`w-3.5 h-3.5 rounded-full bg-blue-600 mt-1`} />
            <View>
              <Text style={tw`text-[10px] font-bold text-blue-600 uppercase tracking-wider`}>PICKUP</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>Blueberry Bakery</Text>
              <Text style={tw`text-xs text-slate-500`}>Downtown</Text>
            </View>
          </View>

          <View style={tw`w-0.5 h-6 bg-slate-200 ml-1.5 my-1`} />

          <View style={tw`flex-row items-start gap-3`}>
            <View style={tw`w-3.5 h-3.5 rounded-full bg-red-500 mt-1`} />
            <View>
              <Text style={tw`text-[10px] font-bold text-red-500 uppercase tracking-wider`}>DROP-OFF</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>42nd Maple Street</Text>
              <Text style={tw`text-xs text-slate-500`}>Apt 4B</Text>
            </View>
          </View>
        </View>

        <View style={tw`h-px w-full bg-slate-100 my-2`} />

        {/* Delivery Progress Checklist */}
        <Text style={tw`text-base font-extrabold text-slate-900 mb-4`}>Delivery Progress</Text>
        <View style={tw`gap-4 mb-6`}>
          {/* Step: Accepted */}
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={tw`text-sm font-bold text-slate-900`}>Accepted</Text>
            </View>
            <Text style={tw`text-xs font-semibold text-slate-400`}>10:15 AM</Text>
          </View>

          {/* Step: Arrived at Pickup */}
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={tw`text-sm font-bold text-slate-900`}>Arrived at Pickup</Text>
            </View>
            <Text style={tw`text-xs font-semibold text-slate-400`}>10:28 AM</Text>
          </View>

          {/* Step: Picked Up */}
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
              <Text style={tw`text-sm font-bold text-slate-900`}>Picked Up</Text>
            </View>
            <Text style={tw`text-xs font-semibold text-slate-400`}>10:32 AM</Text>
          </View>

          {/* Step: On the Way (Active) */}
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-6 h-6 rounded-full border-2 border-purple-600 bg-white items-center justify-center`}>
                <View style={tw`w-2 h-2 rounded-full bg-purple-600`} />
              </View>
              <Text style={tw`text-sm font-extrabold text-purple-700`}>On the Way</Text>
            </View>
            <Text style={tw`text-xs font-extrabold text-purple-700`}>10:33 AM</Text>
          </View>

          {/* Step: Delivered */}
          <View style={tw`flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-6 h-6 rounded-full border-2 border-slate-300 bg-white`} />
              <Text style={tw`text-sm font-semibold text-slate-300`}>Delivered</Text>
            </View>
            <Text style={tw`text-xs font-medium text-slate-300`}>--:-- AM</Text>
          </View>
        </View>

        {/* Sync Status Box */}
        <View style={tw`bg-blue-50/70 rounded-2xl p-3.5 flex-row items-center justify-center gap-2 mb-6 border border-blue-100`}>
          <Ionicons name="refresh-outline" size={18} color="#2563EB" />
          <View style={tw`items-center`}>
            <Text style={tw`text-xs font-bold text-blue-700`}>Synced with customer and shop</Text>
            <Text style={tw`text-[9px] text-slate-400 mt-0.5`}>Last updated: 10:33 AM</Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleNextProgress}
          style={tw`bg-[#070A2A] rounded-2xl py-4 items-center shadow-md mb-3`}>
          <Text style={tw`text-white font-extrabold text-base`}>I'm On the Way</Text>
        </TouchableOpacity>

        {/* Secondary Report Issue Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => alert('Issue Reported')}
          style={tw`bg-white border-2 border-slate-200 rounded-2xl py-3.5 items-center`}>
          <Text style={tw`text-slate-600 font-extrabold text-sm`}>Report Issue</Text>
        </TouchableOpacity>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

