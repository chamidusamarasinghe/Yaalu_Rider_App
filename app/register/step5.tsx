import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import { riderRegistrationService } from '@/services/rider-registration-service';

export default function RegisterStep5BankingScreen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [bankName, setBankName] = useState(draft.bankName || '');
  const [accountHolder, setAccountHolder] = useState(
    draft.accountHolder || (draft.firstName && draft.lastName ? `${draft.firstName} ${draft.lastName}` : ''),
  );
  const [accountNumber, setAccountNumber] = useState(draft.accountNumber || '');
  const [branchCode, setBranchCode] = useState(draft.branchCode || '');
  const [password, setPassword] = useState(draft.password || '');
  const [confirmPassword, setConfirmPassword] = useState(draft.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCompleteRegistration = async () => {
    if (!bankName.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your Bank Name.');
      return;
    }
    if (!accountHolder.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter Account Holder Name.');
      return;
    }
    if (!accountNumber.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter Account Number.');
      return;
    }
    if (!password) {
      Alert.alert('Validation Error ⚠️', 'Please create an account security password.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Validation Error ⚠️', 'Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error ⚠️', 'Passwords do not match. Please verify your password.');
      return;
    }

    setIsSubmitting(true);
    riderRegistrationService.setDraft({
      bankName: bankName.trim(),
      accountHolder: accountHolder.trim(),
      accountNumber: accountNumber.trim(),
      branchCode: branchCode.trim(),
      password: password.trim(),
    });

    try {
      const res = await riderRegistrationService.submitRegistration(password.trim());
      setIsSubmitting(false);

      Alert.alert(
        'Registration Complete! 🎉',
        'Your Rider profile & Cloudinary documents have been saved successfully to the database. Welcome to Yaalu Rider!',
        [
          {
            text: 'Go to Rider Dashboard',
            onPress: () => router.replace('/dashboard' as any),
          },
        ],
      );
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert('Registration Failed ❌', err?.message || 'Failed to complete registration. Please try again.');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Top Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={26} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Partner Registration</Text>
          <View style={tw`w-6`} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-16`}>
          {/* Step Progress Header */}
          <View style={tw`mb-5`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-sm font-extrabold text-[#0B1044]`}>Step 5 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>Banking & Security</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-full bg-[#0B1044] rounded-full`} />
            </View>
          </View>

          <Text style={tw`text-xs font-semibold text-slate-600 mb-5 leading-4.5`}>
            Enter your bank payout information and account security password to complete your Rider Registration.
          </Text>

          {/* Credit Card Hero Security Banner */}
          <View style={tw`bg-[#0B1044] rounded-3xl p-5 shadow-xl mb-6 relative overflow-hidden border border-blue-900/40`}>
            <View style={tw`flex-row justify-between items-start mb-3`}>
              <View style={tw`w-10 h-7 rounded-lg bg-amber-400 items-center justify-center`}>
                <View style={tw`w-6 h-4 border border-amber-800/40 rounded`} />
              </View>
              <Text style={tw`text-[10px] font-black text-amber-300 uppercase tracking-widest`}>
                PAYOUT ACCOUNT
              </Text>
            </View>

            <Text style={tw`text-base font-black text-white tracking-widest my-1`}>
              {accountNumber ? accountNumber : '•••• •••• •••• ••••'}
            </Text>
            <Text style={tw`text-xs font-bold text-slate-300 mb-3`}>
              {accountHolder || 'ACCOUNT HOLDER NAME'}
            </Text>

            <View style={tw`flex-row items-center gap-2 pt-2 border-t border-blue-800/60`}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={tw`text-[10px] font-bold text-slate-300`}>Direct Bank Transfer Enabled</Text>
            </View>
          </View>

          {/* Bank Inputs */}
          <View style={tw`gap-3.5 mb-5`}>
            {/* Bank Name */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Bank Name *</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5 shadow-xs`}>
                <Ionicons name="business-outline" size={18} color="#64748B" />
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="e.g. Commercial Bank / Sampath Bank / BOC"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Account Holder Name */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Account Holder Name *</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5 shadow-xs`}>
                <Ionicons name="person-outline" size={18} color="#64748B" />
                <TextInput
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                  placeholder="Full name as printed on bank passbook"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Account Number */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Account Number *</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5 shadow-xs`}>
                <Ionicons name="keypad-outline" size={18} color="#64748B" />
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="number-pad"
                  placeholder="e.g. 8001234567"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Branch Code / Routing Number */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Branch Code / City</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5 shadow-xs`}>
                <Ionicons name="location-outline" size={18} color="#64748B" />
                <TextInput
                  value={branchCode}
                  onChangeText={setBranchCode}
                  placeholder="e.g. 054 (Fort Branch)"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Account Password */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Account Security Password *</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5 shadow-xs`}>
                <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter account password (min 6 chars)"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Account Password */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Confirm Security Password *</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5 shadow-xs`}>
                <Ionicons name="shield-outline" size={18} color="#64748B" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Re-enter password to confirm"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Security Note */}
          <View style={tw`bg-emerald-100/70 border border-emerald-200 rounded-2xl p-4 flex-row items-start gap-3 mb-6`}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" style={tw`mt-0.5`} />
            <Text style={tw`flex-1 text-xs font-medium text-emerald-900 leading-4.5`}>
              Your registration profile, custom password, and Cloudinary document links will be securely encrypted and stored in PostgreSQL.
            </Text>
          </View>

          {/* Complete Registration Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isSubmitting}
            onPress={handleCompleteRegistration}
            style={tw`w-full bg-[#0B1044] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-4`}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-extrabold text-base`}>Submit Registration</Text>
                <Ionicons name="checkmark-circle" size={20} color="#FFC72C" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => router.back()}>
            <Text style={tw`text-slate-500 font-bold text-xs text-center`}>Back to Previous Step</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
