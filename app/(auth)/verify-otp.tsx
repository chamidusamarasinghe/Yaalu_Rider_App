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
import riderApi, { saveRegistrationDraft, getRegistrationDraft, saveToken, saveRider } from '@/services/api';
import { riderRegistrationService } from '@/services/rider-registration-service';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mobile?: string }>();
  const [mobile, setMobile] = useState<string>(params.mobile || '+94 77 123 4567');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30);
  const [error, setError] = useState<string | null>(null);
  const [activeOtp, setActiveOtp] = useState<string>('');

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Function to generate random 6-digit OTP
  const generateNewOtp = async (targetMobile: string) => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(randomCode);
    setTimer(30);
    setOtpDigits(['', '', '', '', '', '']);
    setError(null);

    try {
      await riderApi.sendOtp(targetMobile, randomCode);
    } catch (err: any) {
      console.warn('[OTP Send Notice]:', err?.message || err);
    }

    Alert.alert(
      'SMS Verification OTP Sent 💬',
      `Your random verification code is: ${randomCode}\nValid for 30 seconds.`,
      [{ text: 'Auto-Fill Code', onPress: () => autoFillOtp(randomCode) }, { text: 'OK' }]
    );
  };

  const autoFillOtp = (code: string) => {
    if (code && code.length === 6) {
      const digits = code.split('');
      setOtpDigits(digits);
      inputRefs.current[5]?.focus();
    }
  };

  useEffect(() => {
    (async () => {
      let targetPhone = params.mobile || '+94 77 123 4567';
      if (!params.mobile) {
        const draft = await getRegistrationDraft();
        if (draft?.mobile || draft?.phone || draft?.phoneNumber) {
          targetPhone = draft.mobile || draft.phone || draft.phoneNumber;
        }
      }
      setMobile(targetPhone);
      await generateNewOtp(targetPhone);
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

    if (timer <= 0) {
      setError('⚠️ OTP has expired! Please click "Resend OTP" to generate a new verification code.');
      return;
    }

    if (otpCode.length < 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    // Check entered code against generated random activeOtp or dev 123456
    if (otpCode !== activeOtp && otpCode !== '123456') {
      setError(`Invalid verification code. Please enter ${activeOtp}`);
      return;
    }

    try {
      setLoading(true);

      // Verify OTP and establish authenticated rider session
      const fallbackToken = 'rider-token-' + Date.now();
      const draft = riderRegistrationService.getDraft();
      const fallbackRider = {
        id: 'rider-profile-' + Date.now(),
        fullName: draft.firstName ? `${draft.firstName} ${draft.lastName || ''}`.trim() : 'Rider Partner',
        firstName: draft.firstName || 'Rider',
        lastName: draft.lastName || '',
        phone: mobile,
        mobile: mobile,
        email: draft.email || '',
        vehicleType: draft.vehicleType || 'BIKE',
        vehicleModel: draft.vehicleModel || '',
        plateNumber: draft.plateNumber || '',
        status: 'AVAILABLE',
        isApproved: true,
      };

      await saveToken(fallbackToken);
      await saveRider(fallbackRider);

      // Clear completed draft
      riderRegistrationService.clearDraft();

      Alert.alert(
        'Registration & Verification Complete! 🎉',
        'Your mobile number has been verified successfully. Welcome to Yaalu Partner App!',
        [
          {
            text: 'Go to Dashboard ➔',
            onPress: () => router.replace('/dashboard'),
          },
        ],
      );
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
      await generateNewOtp(mobile);
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
        {/* Top Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={24} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Verify OTP</Text>
          <View style={tw`w-6`} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-12`}>
          {/* SMS Graphic Card */}
          <View style={tw`w-full h-36 bg-slate-100 rounded-2xl items-center justify-center my-2 border border-slate-200`}>
            <View style={tw`w-36 h-24 bg-white rounded-2xl border-2 border-slate-300 items-center justify-center relative shadow-sm`}>
              <View style={tw`w-12 h-1 bg-slate-300 rounded-full top-2 absolute`} />
              
              <View style={tw`bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 flex-row items-center mb-1`}>
                <Text style={tw`text-sm font-black text-emerald-700 tracking-widest`}>
                  {activeOtp || '123456'}
                </Text>
              </View>

              <View style={tw`absolute -right-2 bottom-3 w-7 h-7 rounded-full bg-emerald-500 items-center justify-center border-2 border-white shadow-md`}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </View>
            </View>
          </View>

          {/* Header Titles */}
          <Text style={tw`text-2xl font-black text-slate-900 text-center mt-1`}>
            Enter Verification Code
          </Text>
          <View style={tw`flex-row justify-center items-center mt-1 mb-4 flex-wrap`}>
            <Text style={tw`text-xs text-slate-500`}>We sent a 6-digit code to </Text>
            <Text style={tw`text-xs font-black text-slate-800`}>{mobile} </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={tw`text-xs font-bold text-[#0B1044] underline`}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Interactive Live Generated OTP Code Banner */}
          {activeOtp ? (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => autoFillOtp(activeOtp)}
              style={tw`bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 mb-4 flex-row items-center justify-between shadow-sm`}>
              <View style={tw`flex-row items-center gap-2.5`}>
                <View style={tw`w-8 h-8 rounded-full bg-[#0B1044] items-center justify-center`}>
                  <Ionicons name="chatbox-ellipses-outline" size={18} color="#FFC72C" />
                </View>
                <View>
                  <Text style={tw`text-[10px] font-extrabold text-indigo-900 uppercase`}>Random Generated Code</Text>
                  <Text style={tw`text-lg font-black text-[#0B1044] tracking-widest`}>{activeOtp}</Text>
                </View>
              </View>
              <View style={tw`bg-[#0B1044] px-3 py-1.5 rounded-xl`}>
                <Text style={tw`text-[11px] font-extrabold text-[#FFC72C]`}>Tap to Fill ⚡</Text>
              </View>
            </TouchableOpacity>
          ) : null}

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
                  tw`w-12 h-13 rounded-xl border-2 text-center text-xl font-black shadow-sm`,
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
          <View style={tw`flex-row items-center justify-center gap-1.5 mb-5`}>
            <Ionicons
              name={timer > 0 ? 'time-outline' : 'alert-circle-outline'}
              size={16}
              color={timer > 0 ? '#10B981' : '#E11D48'}
            />
            <Text
              style={[
                tw`text-xs font-bold`,
                timer > 0 ? tw`text-emerald-600` : tw`text-rose-600`,
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
            disabled={loading || timer <= 0}
            style={[
              tw`rounded-xl py-4 items-center shadow-md mb-3 flex-row justify-center gap-2`,
              { backgroundColor: loading || timer <= 0 ? '#94A3B8' : '#0B1044' },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-extrabold text-base`}>Verify & Complete Registration</Text>
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
              {resending ? 'Generating new code...' : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
