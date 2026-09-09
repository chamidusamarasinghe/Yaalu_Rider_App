import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);

  const handleVerify = () => {
    // Proceed to partner registration step 1
    router.push('/register/step1');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-white`}>

      {/* Top Gold Header */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Verify OTP</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-8`}>
        {/* Mock Phone SMS Graphic Card */}
        <View style={tw`w-full h-44 bg-slate-100 rounded-2xl items-center justify-center my-3 border border-slate-200`}>
          <View style={tw`w-40 h-32 bg-white rounded-2xl border-2 border-slate-300 items-center justify-center relative shadow-sm`}>
            {/* Top camera notch bar */}
            <View style={tw`w-14 h-1 bg-slate-300 rounded-full top-2 absolute`} />
            
            {/* SMS Badge */}
            <View style={tw`bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex-row items-center mb-1`}>
              <Text style={tw`text-sm font-extrabold text-emerald-700 tracking-widest`}>123456</Text>
            </View>

            {/* Success Checkmark Circle */}
            <View style={tw`absolute -right-3 bottom-6 w-9 h-9 rounded-full bg-emerald-500 items-center justify-center border-2 border-white shadow-md`}>
              <Ionicons name="checkmark" size={20} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Header Titles */}
        <Text style={tw`text-2xl font-extrabold text-slate-900 text-center mt-2`}>
          Enter Verification Code
        </Text>
        <View style={tw`flex-row justify-center items-center mt-1.5 mb-6`}>
          <Text style={tw`text-xs text-slate-500`}>We've sent a 6-digit OTP to </Text>
          <Text style={tw`text-xs font-bold text-slate-800`}>+94 77 123 4567 </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={tw`text-xs font-bold text-indigo-700 underline`}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* 6 OTP Input Boxes */}
        <View style={tw`flex-row justify-between mb-4 px-2`}>
          {otp.map((digit, idx) => (
            <View
              key={idx}
              style={tw`w-11.5 h-12 rounded-xl border-2 border-slate-200 bg-white items-center justify-center shadow-xs`}>
              <Text style={tw`text-lg font-black text-slate-900`}>{digit}</Text>
            </View>
          ))}
        </View>

        {/* Expiry Timer Indicator */}
        <View style={tw`flex-row items-center justify-center gap-1.5 mb-8`}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={tw`text-xs font-bold text-emerald-600`}>OTP will expire in 00:45</Text>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleVerify}
          style={tw`bg-[#070A2A] rounded-xl py-4 items-center shadow-md mb-3`}>
          <Text style={tw`text-white font-extrabold text-base`}>Verify & Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => alert('OTP Resent!')}
          style={tw`bg-white border-2 border-indigo-900 rounded-xl py-3.5 items-center mb-6`}>
          <Text style={tw`text-indigo-900 font-bold text-sm`}>Resend OTP</Text>
        </TouchableOpacity>

        {/* Help Notice Box */}
        <View style={tw`bg-slate-100 rounded-2xl p-4 flex-row items-start border border-slate-200`}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#4F46E5" style={tw`mr-3 mt-0.5`} />
          <View style={tw`flex-1`}>
            <Text style={tw`text-xs font-bold text-slate-800`}>Didn't receive the code?</Text>
            <Text style={tw`text-[11px] text-slate-500 mt-0.5 leading-4`}>
              Check your SMS folder or wait for the timer to reset to request a new code.
            </Text>
          </View>
        </View>

      </ScrollView>
      </View>
    </SafeAreaView>
  );
}
