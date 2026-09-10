import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import { YaaluLogo } from '@/components/YaaluLogo';
import riderApi from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSendOTP = async () => {
    const cleaned = mobileNumber.trim().replace(/\s+/g, '');
    if (cleaned.length < 9) {
      Alert.alert('Invalid Number', 'Please enter a valid mobile number.');
      return;
    }
    const fullNumber = '+94' + cleaned.replace(/^0/, '');
    try {
      setLoading(true);
      await riderApi.sendOtp(fullNumber);
      router.push({ pathname: '/verify-otp', params: { mobile: fullNumber } } as any);
    } catch (err: any) {
      console.warn('OTP send error:', err.message);
      router.push({ pathname: '/verify-otp', params: { mobile: fullNumber } } as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />
      <KeyboardAvoidingView
        style={tw`flex-1`}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

        {/* ── LOGO SECTION ──────────────────────────── */}
        <View style={tw`items-center justify-center pt-8 pb-7 px-6`}>
          {/* Glow ring around logo */}
          <View style={tw`w-22 h-22 rounded-full bg-[#0B1044]/10 items-center justify-center mb-2.5 shadow-sm`}>
            <View style={tw`w-18 h-18 rounded-full bg-white items-center justify-center shadow-xs`}>
              <YaaluLogo size={65} showWordmark={false} variant="badge" />
            </View>
          </View>
          <Image
            source={require('@/assets/images/yaalu-wordmark.png')}
            style={tw`w-36 h-9`}
            resizeMode="contain"
          />
          <Text style={tw`text-xs font-extrabold text-[#0B1044] mt-1 tracking-widest bg-[#0B1044]/10 px-3 py-1 rounded-full`}>
            RIDER APP
          </Text>
        </View>

        {/* ── CARD SECTION ──────────────────────────── */}
        <View style={tw`flex-1 bg-white rounded-t-[40px] px-6 pt-8 shadow-2xl`}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>

            <Text style={tw`text-2xl font-black text-[#0B1044]`}>Welcome Back 👋</Text>
            <Text style={tw`text-sm text-slate-500 mt-1 mb-7`}>
              Enter your mobile number to continue
            </Text>

            {/* ── MOBILE INPUT ─────────────────────── */}
            <Text style={tw`text-[11px] font-black text-slate-400 tracking-widest mb-2 uppercase`}>
              Mobile Number
            </Text>
            <View style={[
              tw`flex-row items-center rounded-2xl px-4 h-14 border-2`,
              focused
                ? tw`border-[#FFC72C] bg-amber-50`
                : tw`border-slate-200 bg-slate-50`,
            ]}>
              {/* Country code */}
              <View style={tw`flex-row items-center gap-1.5 pr-3`}>
                <Text style={{ fontSize: 18 }}>🇱🇰</Text>
                <Text style={tw`text-base font-bold text-[#0B1044]`}>+94</Text>
                <Ionicons name="chevron-down" size={13} color="#94A3B8" />
              </View>
              <View style={tw`w-px h-7 bg-slate-200 mr-3`} />
              <TextInput
                style={tw`flex-1 text-base font-semibold text-[#0B1044]`}
                placeholder="7X XXX XXXX"
                placeholderTextColor="#CBD5E1"
                keyboardType="phone-pad"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                maxLength={10}
              />
              {mobileNumber.length > 0 && (
                <TouchableOpacity onPress={() => setMobileNumber('')}>
                  <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                </TouchableOpacity>
              )}
            </View>

            {/* ── SECURITY NOTICE ──────────────────── */}
            <View style={tw`flex-row items-center bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 mt-4 mb-6 gap-3`}>
              <View style={tw`w-9 h-9 rounded-xl bg-indigo-100 items-center justify-center`}>
                <Ionicons name="shield-checkmark" size={18} color="#4F46E5" />
              </View>
              <Text style={tw`flex-1 text-xs text-indigo-800 font-medium leading-5`}>
                We'll send a 6-digit OTP to verify your identity securely.
              </Text>
            </View>

            {/* ── SEND OTP BUTTON ──────────────────── */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                tw`rounded-2xl h-14 items-center justify-center flex-row gap-2`,
                { backgroundColor: loading ? '#94A3B8' : '#0B1044' },
              ]}
              onPress={handleSendOTP}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFC72C" size="small" />
              ) : (
                <>
                  <Text style={tw`text-base font-black text-white`}>Send OTP</Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFC72C" />
                </>
              )}
            </TouchableOpacity>

            {/* ── DIVIDER ──────────────────────────── */}
            <View style={tw`flex-row items-center my-6`}>
              <View style={tw`flex-1 h-px bg-slate-200`} />
              <Text style={tw`text-xs font-bold text-slate-400 mx-4`}>OR</Text>
              <View style={tw`flex-1 h-px bg-slate-200`} />
            </View>

            {/* ── REGISTER LINK ─────────────────────── */}
            <View style={tw`flex-row justify-center items-center gap-1`}>
              <Text style={tw`text-sm text-slate-500`}>New to Yaalu?</Text>
              <TouchableOpacity onPress={() => router.push('/register/step1')}>
                <Text style={tw`text-sm font-black text-[#0B1044] underline`}>Register as a Rider</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
