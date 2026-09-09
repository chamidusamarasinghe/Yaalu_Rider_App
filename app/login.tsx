import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { YaaluLogo } from '@/components/YaaluLogo';

export default function LoginScreen() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSendOTP = () => {
    router.push('/verify-otp');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Top Gold Header with Official Yaalu Logo & Tagline */}
      <View style={[tw`bg-[#FFC72C] relative items-center justify-center overflow-hidden`, { height: '36%' }]}>
        {/* Subtle decorative circles */}
        <View style={tw`absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/15`} />
        <View style={tw`absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/12`} />

        <View style={tw`items-center justify-center`}>
          <YaaluLogo size={90} showWordmark={false} variant="badge" />
          
          <Image
            source={require('@/assets/images/yaalu-wordmark.png')}
            style={tw`w-40 h-10 mt-2`}
            resizeMode="contain"
          />

          <Text style={tw`text-sm font-bold text-[#0B1044] mt-0.5`}>Deliver with Trust</Text>
        </View>
      </View>

      {/* Bottom Sheet Card */}
      <View style={tw`flex-1 bg-white rounded-t-[36px] -mt-5 pt-7 px-6 shadow-xl`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-8`}>
          
          <Text style={tw`text-2xl font-extrabold text-slate-900 text-center`}>Welcome Back!</Text>
          <Text style={tw`text-sm text-slate-500 text-center mt-1 mb-6`}>Login to continue delivering smiles</Text>

          {/* MOBILE NUMBER INPUT */}
          <Text style={tw`text-[11px] font-extrabold text-slate-500 tracking-wider mb-2`}>MOBILE NUMBER</Text>
          <View style={tw`flex-row items-center border-2 border-slate-200 rounded-xl bg-slate-50 px-3 h-13.5`}>
            {/* Country Selector */}
            <View style={tw`flex-row items-center gap-1.5 pr-2`}>
              <View style={tw`w-6 h-5 items-center justify-center`}>
                <Text style={{ fontSize: 14 }}>🇱🇰</Text>
              </View>
              <Text style={tw`text-base font-bold text-slate-900`}>+94</Text>
              <Ionicons name="chevron-down" size={14} color="#64748B" />
            </View>

            <View style={tw`w-px h-6 bg-slate-300 mx-2`} />

            <TextInput
              style={tw`flex-1 text-base text-slate-900 font-medium`}
              placeholder="Enter your mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
          </View>

          {/* Security Notice Box */}
          <View style={tw`flex-row items-center bg-[#EEF2FF] rounded-xl p-3 mt-3.5 mb-5`}>
            <View style={tw`w-8 h-8 rounded-lg bg-indigo-100 items-center justify-center mr-2.5`}>
              <Ionicons name="shield-checkmark" size={18} color="#4F46E5" />
            </View>
            <Text style={tw`flex-1 text-xs text-indigo-900 leading-4 font-medium`}>
              We'll send you a 6-digit OTP to verify your account and ensure your secure access.
            </Text>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={tw`flex-row items-center justify-center bg-[#070A2A] rounded-xl py-4 gap-2 shadow-md`}
            onPress={handleSendOTP}>
            <Text style={tw`text-base font-bold text-white`}>Send OTP</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={tw`flex-row items-center my-5.5`}>
            <View style={tw`flex-1 h-px bg-slate-200`} />
            <Text style={tw`text-xs font-bold text-slate-400 mx-3`}>OR</Text>
            <View style={tw`flex-1 h-px bg-slate-200`} />
          </View>

          {/* Google Sign-In Button */}
          <TouchableOpacity activeOpacity={0.8} style={tw`flex-row items-center justify-center bg-slate-50 border-2 border-slate-200 rounded-xl py-3.5`}>
            <FontAwesome name="google" size={18} color="#EA4335" style={tw`mr-2.5`} />
            <Text style={tw`text-sm font-bold text-slate-700`}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Register Footer Link */}
          <View style={tw`flex-row justify-center mt-6`}>
            <Text style={tw`text-sm text-slate-500`}>New to Yaalu? </Text>
            <TouchableOpacity onPress={() => router.push('/register/step1')}>
              <Text style={tw`text-sm font-extrabold text-[#1D267D]`}>Register Now</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
