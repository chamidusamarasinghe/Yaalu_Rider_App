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

    setIsSubmitting(true);
    riderRegistrationService.setDraft({
      bankName: bankName.trim(),
      accountHolder: accountHolder.trim(),
      accountNumber: accountNumber.trim(),
      branchCode: branchCode.trim(),
    });

    try {
      const res = await riderRegistrationService.submitRegistration();
      setIsSubmitting(false);

      Alert.alert(
        'Registration Complete! 🎉',
        'Your Rider profile & Cloudinary documents have been saved successfully to the database. Welcome to Yaalu Rider!',
        [
          {
            text: 'Go to Dashboard',
            onPress: () => router.push('/dashboard'),
          },
        ],
      );
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert('Registration Error ⚠️', err?.message || 'Failed to submit registration. Please try again.');
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Top Gold Header Bar */}
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
              <Text style={tw`text-sm font-extrabold text-blue-700`}>Step 5 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>Banking Details</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-full bg-[#030626] rounded-full`} />
            </View>
          </View>

          <Text style={tw`text-xs font-semibold text-slate-600 mb-5 leading-4.5`}>
            We need your bank account information to ensure you receive your weekly earnings promptly and securely.
          </Text>

          {/* Bank Inputs */}
          <View style={tw`gap-4 mb-6`}>
            {/* Bank Name */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Bank Name *</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5`}>
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
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5`}>
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
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5`}>
                <Ionicons name="keypad-outline" size={18} color="#64748B" />
                <TextInput
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  keyboardType="number-pad"
                  placeholder="0000 0000 0000"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Branch Code / Routing Number */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Branch Code / City</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5`}>
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
          </View>

          {/* Security Note */}
          <View style={tw`bg-emerald-100/70 border border-emerald-200 rounded-2xl p-4 flex-row items-start gap-3 mb-6`}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" style={tw`mt-0.5`} />
            <Text style={tw`flex-1 text-xs font-medium text-emerald-900 leading-4.5`}>
              Your registration profile and Cloudinary URLs will be verified. Submitting accurate data ensures instant account activation.
            </Text>
          </View>

          {/* Complete Registration Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={isSubmitting}
            onPress={handleCompleteRegistration}
            style={tw`w-full bg-[#030626] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-4`}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={tw`text-white font-extrabold text-base`}>Submit Registration</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/dashboard')}>
            <Text style={tw`text-slate-500 font-bold text-xs text-center`}>Verify Details Later</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
