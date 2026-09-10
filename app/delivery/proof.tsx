import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function ProofOfDeliveryScreen() {
  const router = useRouter();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };

  const handleSimulateUpload = () => {
    setPhotoUri('https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=400');
  };

  const handleConfirmDelivery = () => {
    router.push('/delivery/completed' as any);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Proof of Delivery</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-10`}>
        {/* Main Content Card */}
        <View style={tw`bg-white rounded-3xl p-6 shadow-sm border border-slate-100 items-center`}>
          {/* Checkmark Circle with Confetti Accents */}
          <View style={tw`relative items-center justify-center my-3`}>
            {/* Colorful dots */}
            <View style={tw`absolute -top-3 -left-6 w-2.5 h-2.5 rounded-full bg-emerald-500`} />
            <View style={tw`absolute -top-4 right-1 w-2 h-2 rounded-full bg-blue-500`} />
            <View style={tw`absolute top-2 -right-8 w-2.5 h-2.5 rounded-full bg-amber-400`} />
            <View style={tw`absolute bottom-1 -right-6 w-2 h-2 rounded-full bg-purple-500`} />
            <View style={tw`absolute -bottom-3 left-0 w-2.5 h-2.5 rounded-full bg-pink-400`} />
            <View style={tw`absolute bottom-2 -left-8 w-2 h-2 rounded-full bg-amber-500`} />

            {/* Main Green Icon */}
            <View style={tw`w-20 h-20 rounded-full bg-emerald-500 items-center justify-center shadow-lg shadow-emerald-200`}>
              <Ionicons name="checkmark" size={44} color="#FFFFFF" />
            </View>
          </View>

          {/* Title and Subtitle */}
          <Text style={tw`text-2xl font-black text-emerald-600 mt-3 mb-1 text-center`}>Almost There!</Text>
          <Text style={tw`text-xs font-semibold text-slate-400 text-center mb-6`}>
            Please provide proof of delivery
          </Text>

          {/* Upload Delivery Photo Section */}
          <View style={tw`w-full mb-5`}>
            <Text style={tw`text-xs font-bold text-slate-800 mb-2`}>Upload Delivery Photo</Text>

            {photoUri ? (
              <View style={tw`relative rounded-2xl overflow-hidden h-40 border border-slate-200`}>
                <Image source={{ uri: photoUri }} style={tw`w-full h-full`} resizeMode="cover" />
                <TouchableOpacity
                  onPress={() => setPhotoUri(null)}
                  style={tw`absolute top-2 right-2 bg-slate-900/70 p-1.5 rounded-full`}>
                  <Ionicons name="close" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSimulateUpload}
                style={tw`w-full border-2 border-dashed border-slate-300 rounded-2xl p-6 items-center justify-center bg-slate-50/50`}>
                <View style={tw`w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-2`}>
                  <Ionicons name="camera-outline" size={26} color="#3B82F6" />
                </View>
                <Text style={tw`text-xs font-bold text-slate-700`}>Tap to take photo</Text>
                <Text style={tw`text-[10px] text-slate-400 mt-0.5`}>or choose from gallery</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* OR Divider */}
          <View style={tw`w-full flex-row items-center justify-center my-3 relative`}>
            <View style={tw`w-full h-px bg-slate-200`} />
            <View style={tw`absolute bg-white px-3`}>
              <Text style={tw`text-[11px] font-bold text-slate-400`}>OR</Text>
            </View>
          </View>

          {/* Customer OTP Section */}
          <View style={tw`w-full mt-2 mb-5`}>
            <Text style={tw`text-xs font-bold text-slate-800`}>Customer OTP (Optional)</Text>
            <Text style={tw`text-[11px] text-slate-400 mb-3`}>Ask customer for the 6-digit OTP</Text>

            {/* 6 Input Boxes */}
            <View style={tw`flex-row justify-between mb-4`}>
              {otp.map((digit, idx) => (
                <View key={idx} style={tw`w-[14%] aspect-square`}>
                  <TextInput
                    value={digit}
                    onChangeText={(t) => handleOtpChange(t, idx)}
                    keyboardType="number-pad"
                    maxLength={1}
                    style={tw`w-full h-full border border-slate-300 rounded-xl text-center text-lg font-bold text-slate-900 bg-white shadow-xs focus:border-blue-600 focus:bg-blue-50/20`}
                  />
                </View>
              ))}
            </View>

            {/* Info Box */}
            <View style={tw`bg-blue-50/80 rounded-2xl p-3 flex-row items-center gap-2.5 border border-blue-100`}>
              <Ionicons name="information-circle-outline" size={18} color="#2563EB" />
              <Text style={tw`text-[11px] font-bold text-blue-700 flex-1`}>
                OTP is optional if customer is not available
              </Text>
            </View>
          </View>

          {/* Primary Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleConfirmDelivery}
            style={tw`w-full bg-[#070A2A] rounded-2xl py-4 items-center shadow-md`}>
            <Text style={tw`text-white font-extrabold text-base`}>Confirm Delivery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
}

