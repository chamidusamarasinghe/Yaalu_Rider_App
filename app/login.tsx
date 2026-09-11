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
import riderApi, { saveRegistrationDraft } from '@/services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const getCleanMobile = () => {
    const cleaned = mobileNumber.trim().replace(/\s+/g, '');
    if (cleaned.startsWith('+94')) return cleaned;
    if (cleaned.startsWith('94')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return `+94${cleaned.slice(1)}`;
    return `+94${cleaned}`;
  };

  const handleSendOTP = async () => {
    setError(null);
    const cleaned = mobileNumber.trim().replace(/\s+/g, '');
    if (cleaned.length < 9) {
      setError('Please enter a valid Sri Lankan mobile number (e.g. 77 123 4567)');
      return;
    }
    const fullNumber = getCleanMobile();

    try {
      setLoading(true);
      await riderApi.sendOtp(fullNumber);
      await saveRegistrationDraft({ mobile: fullNumber, phone: fullNumber });
      router.push({ pathname: '/verify-otp', params: { mobile: fullNumber } } as any);
    } catch (err: any) {
      console.warn('OTP request error:', err.message);
      // If network fails in demo mode, still allow entering OTP screen
      await saveRegistrationDraft({ mobile: fullNumber, phone: fullNumber });
      router.push({ pathname: '/verify-otp', params: { mobile: fullNumber } } as any);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setError(null);
    const identifier = mobileNumber.trim();
    if (!identifier) {
      setError('Please enter your mobile number or email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    const fullNumber = identifier.includes('@') ? identifier : getCleanMobile();

    try {
      setLoading(true);
      const res = await riderApi.login(fullNumber, password);
      if (res?.rider || res?.accessToken) {
        Alert.alert('Welcome Back!', `Logged in as ${res.rider?.fullName || 'Rider Partner'}`, [
          { text: 'Continue', onPress: () => router.replace('/dashboard') },
        ]);
      } else {
        router.replace('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
        <View style={tw`items-center justify-center pt-6 pb-5 px-6`}>
          <View style={tw`w-20 h-20 rounded-full bg-[#0B1044]/10 items-center justify-center mb-2 shadow-sm`}>
            <View style={tw`w-16 h-16 rounded-full bg-white items-center justify-center shadow-xs`}>
              <YaaluLogo size={58} showWordmark={false} variant="badge" />
            </View>
          </View>
          <Image
            source={require('@/assets/images/yaalu-wordmark.png')}
            style={tw`w-32 h-8`}
            resizeMode="contain"
          />
          <Text style={tw`text-[11px] font-extrabold text-[#0B1044] mt-1 tracking-widest bg-[#0B1044]/10 px-3 py-0.5 rounded-full`}>
            RIDER PARTNER APP
          </Text>
        </View>

        {/* ── CARD SECTION ──────────────────────────── */}
        <View style={tw`flex-1 bg-white rounded-t-[36px] px-6 pt-6 shadow-2xl`}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>

            <Text style={tw`text-2xl font-black text-[#0B1044]`}>Welcome Back 👋</Text>
            <Text style={tw`text-xs text-slate-500 mt-1 mb-5`}>
              {authMode === 'otp'
                ? 'Enter your mobile number to receive a verification OTP'
                : 'Sign in with your registered mobile or email and password'}
            </Text>

            {/* ── AUTH MODE SWITCHER TAB ───────────────── */}
            <View style={tw`flex-row bg-slate-100 p-1 rounded-2xl mb-5`}>
              <TouchableOpacity
                onPress={() => {
                  setAuthMode('otp');
                  setError(null);
                }}
                style={[
                  tw`flex-1 py-2.5 rounded-xl items-center justify-center flex-row gap-1.5`,
                  authMode === 'otp' ? tw`bg-white shadow-xs` : {},
                ]}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={16}
                  color={authMode === 'otp' ? '#0B1044' : '#64748B'}
                />
                <Text
                  style={[
                    tw`text-xs font-black`,
                    authMode === 'otp' ? tw`text-[#0B1044]` : tw`text-slate-500`,
                  ]}>
                  OTP Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setAuthMode('password');
                  setError(null);
                }}
                style={[
                  tw`flex-1 py-2.5 rounded-xl items-center justify-center flex-row gap-1.5`,
                  authMode === 'password' ? tw`bg-white shadow-xs` : {},
                ]}>
                <Ionicons
                  name="key-outline"
                  size={16}
                  color={authMode === 'password' ? '#0B1044' : '#64748B'}
                />
                <Text
                  style={[
                    tw`text-xs font-black`,
                    authMode === 'password' ? tw`text-[#0B1044]` : tw`text-slate-500`,
                  ]}>
                  Password
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── ERROR BANNER ─────────────────────────── */}
            {error && (
              <View style={tw`bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2`}>
                <Ionicons name="alert-circle" size={18} color="#E11D48" />
                <Text style={tw`flex-1 text-xs font-bold text-rose-700`}>{error}</Text>
              </View>
            )}

            {/* ── MOBILE INPUT ─────────────────────── */}
            <Text style={tw`text-[11px] font-black text-slate-400 tracking-widest mb-1.5 uppercase`}>
              {authMode === 'otp' ? 'Mobile Number' : 'Mobile Number or Email'}
            </Text>
            <View
              style={[
                tw`flex-row items-center rounded-2xl px-4 h-13.5 border-2 mb-4`,
                focusedInput === 'mobile'
                  ? tw`border-[#FFC72C] bg-amber-50/40`
                  : tw`border-slate-200 bg-slate-50`,
              ]}>
              {!mobileNumber.includes('@') && (
                <View style={tw`flex-row items-center gap-1.5 pr-2.5`}>
                  <Text style={{ fontSize: 16 }}>🇱🇰</Text>
                  <Text style={tw`text-sm font-bold text-[#0B1044]`}>+94</Text>
                  <Ionicons name="chevron-down" size={12} color="#94A3B8" />
                </View>
              )}
              <View style={tw`w-px h-6 bg-slate-200 mr-2.5`} />
              <TextInput
                style={tw`flex-1 text-sm font-bold text-[#0B1044]`}
                placeholder={authMode === 'otp' ? '7X XXX XXXX' : '7X XXX XXXX or email@domain.com'}
                placeholderTextColor="#CBD5E1"
                keyboardType={authMode === 'otp' ? 'phone-pad' : 'default'}
                autoCapitalize="none"
                value={mobileNumber}
                onChangeText={(t) => {
                  setMobileNumber(t);
                  if (error) setError(null);
                }}
                onFocus={() => setFocusedInput('mobile')}
                onBlur={() => setFocusedInput(null)}
              />
              {mobileNumber.length > 0 && (
                <TouchableOpacity onPress={() => setMobileNumber('')}>
                  <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              )}
            </View>

            {/* ── PASSWORD INPUT (IF PASSWORD MODE) ────── */}
            {authMode === 'password' && (
              <View style={tw`mb-4`}>
                <Text style={tw`text-[11px] font-black text-slate-400 tracking-widest mb-1.5 uppercase`}>
                  Password
                </Text>
                <View
                  style={[
                    tw`flex-row items-center rounded-2xl px-4 h-13.5 border-2`,
                    focusedInput === 'password'
                      ? tw`border-[#FFC72C] bg-amber-50/40`
                      : tw`border-slate-200 bg-slate-50`,
                  ]}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={tw`mr-2`} />
                  <TextInput
                    style={tw`flex-1 text-sm font-bold text-[#0B1044]`}
                    placeholder="Enter your password"
                    placeholderTextColor="#CBD5E1"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(t) => {
                      setPassword(t);
                      if (error) setError(null);
                    }}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={tw`p-1`}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ── SECURITY NOTICE ──────────────────── */}
            {authMode === 'otp' && (
              <View style={tw`flex-row items-center bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3 mb-5 gap-2.5`}>
                <View style={tw`w-8 h-8 rounded-xl bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="shield-checkmark" size={16} color="#FFC72C" />
                </View>
                <Text style={tw`flex-1 text-xs text-[#0B1044] font-medium leading-4.5`}>
                  We'll send a 6-digit OTP to verify your phone number and load your profile.
                </Text>
              </View>
            )}

            {/* ── SUBMIT BUTTON ────────────────────── */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                tw`rounded-2xl h-14 items-center justify-center flex-row gap-2 shadow-md`,
                { backgroundColor: loading ? '#94A3B8' : '#0B1044' },
              ]}
              onPress={authMode === 'otp' ? handleSendOTP : handlePasswordLogin}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFC72C" size="small" />
              ) : (
                <>
                  <Text style={tw`text-base font-black text-white`}>
                    {authMode === 'otp' ? 'Send OTP Code' : 'Sign In as Rider'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#FFC72C" />
                </>
              )}
            </TouchableOpacity>

            {/* ── DIVIDER ──────────────────────────── */}
            <View style={tw`flex-row items-center my-5`}>
              <View style={tw`flex-1 h-px bg-slate-200`} />
              <Text style={tw`text-xs font-bold text-slate-400 mx-4`}>OR</Text>
              <View style={tw`flex-1 h-px bg-slate-200`} />
            </View>

            {/* ── REGISTER LINK ─────────────────────── */}
            <View style={tw`flex-row justify-center items-center gap-1.5`}>
              <Text style={tw`text-xs text-slate-500`}>New rider partner?</Text>
              <TouchableOpacity
                onPress={() => {
                  const cleaned = mobileNumber ? getCleanMobile() : '';
                  if (cleaned) saveRegistrationDraft({ phone: cleaned, mobile: cleaned });
                  router.push('/register/step1');
                }}>
                <Text style={tw`text-xs font-black text-[#0B1044] underline`}>Register Now</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
