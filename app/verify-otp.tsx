import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { saveRegistrationDraft, getRegistrationDraft } from '@/services/api';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mobile?: string }>();
  const [mobile, setMobile] = useState<string>(params.mobile || '+94 77 123 4567');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(45);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    (async () => {
      if (params.mobile) {
        setMobile(params.mobile);
      } else {
        const draft = await getRegistrationDraft();
        if (draft?.mobile || draft?.phone) {
          setMobile(draft.mobile || draft.phone);
        }
      }
    })();
  }, [params.mobile]);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (value: string, index: number) => {
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    setError(null);

    // Auto move to next box if filled
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError(null);
    const otpCode = otpDigits.join('').trim();
    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    try {
      setLoading(true);
      const res = await riderApi.verifyOtp(mobile, otpCode);

      if (res?.isNewUser) {
        // New rider partner -> save phone draft and proceed to multi-step registration
        await saveRegistrationDraft({ phone: mobile, mobile });
        Alert.alert(
          'Phone Verified! 🎉',
          'Please complete your registration details to start riding.',
          [{ text: 'Continue Registration', onPress: () => router.push('/register/step1') }],
        );
      } else {
        // Existing rider logged in
        Alert.alert('Welcome Back!', `Logged in successfully as ${res.rider?.fullName || 'Rider Partner'}`, [
          { text: 'Go to Dashboard', onPress: () => router.replace('/dashboard') },
        ]);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setResending(true);
      setError(null);
      await riderApi.sendOtp(mobile);
      setTimer(45);
      Alert.alert('OTP Sent', `A new verification code was sent to ${mobile}`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
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
          {/* Phone SMS Graphic Card */}
          <View style={tw`w-full h-40 bg-slate-100 rounded-2xl items-center justify-center my-3 border border-slate-200`}>
            <View style={tw`w-38 h-28 bg-white rounded-2xl border-2 border-slate-300 items-center justify-center relative shadow-sm`}>
              <View style={tw`w-12 h-1 bg-slate-300 rounded-full top-2 absolute`} />
              
              <View style={tw`bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex-row items-center mb-1`}>
                <Text style={tw`text-sm font-black text-emerald-700 tracking-widest`}>123456</Text>
              </View>

              <View style={tw`absolute -right-2.5 bottom-4 w-8 h-8 rounded-full bg-emerald-500 items-center justify-center border-2 border-white shadow-md`}>
                <Ionicons name="checkmark" size={18} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Header Titles */}
          <Text style={tw`text-2xl font-black text-slate-900 text-center mt-1`}>
            Enter Verification Code
          </Text>
          <View style={tw`flex-row justify-center items-center mt-1 mb-5 flex-wrap`}>
            <Text style={tw`text-xs text-slate-500`}>We sent a 6-digit code to </Text>
            <Text style={tw`text-xs font-black text-slate-800`}>{mobile} </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={tw`text-xs font-bold text-[#0B1044] underline`}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && (
            <View style={tw`bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2`}>
              <Ionicons name="alert-circle" size={18} color="#E11D48" />
              <Text style={tw`flex-1 text-xs font-bold text-rose-700`}>{error}</Text>
            </View>
          )}

          {/* 6 OTP Input Boxes */}
          <View style={tw`flex-row justify-between mb-4 px-1`}>
            {otpDigits.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => { inputRefs.current[idx] = ref; }}
                style={[
                  tw`w-12 h-13 rounded-xl border-2 text-center text-xl font-black shadow-xs`,
                  digit
                    ? tw`border-[#0B1044] bg-indigo-50/50 text-[#0B1044]`
                    : tw`border-slate-200 bg-white text-slate-900`,
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(val) => handleDigitChange(val, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Expiry Timer Indicator */}
          <View style={tw`flex-row items-center justify-center gap-1.5 mb-6`}>
            <Ionicons
              name={timer > 0 ? 'time-outline' : 'alert-circle-outline'}
              size={16}
              color={timer > 0 ? '#10B981' : '#F59E0B'}
            />
            <Text
              style={[
                tw`text-xs font-bold`,
                timer > 0 ? tw`text-emerald-600` : tw`text-amber-600`,
              ]}>
              {timer > 0
                ? `OTP expires in 00:${timer < 10 ? `0${timer}` : timer}`
                : 'OTP expired. Please request a new code.'}
            </Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleVerify}
            disabled={loading}
            style={[
              tw`rounded-xl py-4 items-center shadow-md mb-3 flex-row justify-center gap-2`,
              { backgroundColor: loading ? '#94A3B8' : '#0B1044' },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-extrabold text-base`}>Verify & Continue</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFC72C" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleResend}
            disabled={timer > 0 || resending}
            style={[
              tw`rounded-xl py-3.5 items-center mb-6 border-2`,
              timer > 0 || resending
                ? tw`bg-slate-50 border-slate-200 opacity-60`
                : tw`bg-white border-[#0B1044]`,
            ]}>
            <Text style={tw`text-[#0B1044] font-bold text-sm`}>
              {resending ? 'Sending...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>

          {/* Help Notice Box */}
          <View style={tw`bg-amber-50/60 rounded-2xl p-4 flex-row items-start border border-amber-200/60`}>
            <Ionicons name="information-circle" size={20} color="#0B1044" style={tw`mr-2.5 mt-0.5`} />
            <View style={tw`flex-1`}>
              <Text style={tw`text-xs font-bold text-[#0B1044]`}>Demo / Dev Mode</Text>
              <Text style={tw`text-[11px] text-slate-600 mt-0.5 leading-4`}>
                You can enter default test code <Text style={tw`font-bold text-[#0B1044]`}>123456</Text> to verify instantly.
              </Text>
            </View>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
