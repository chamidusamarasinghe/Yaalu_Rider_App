import React, { useState, useMemo } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import { riderRegistrationService } from '@/services/rider-registration-service';
import BranchSearchModal from '../../components/BranchSearchModal';
import { SRI_LANKAN_BANKS, validateBankAccountNumber, BankInfo, BranchInfo } from '../../constants/banks';

export default function RegisterStep5BankingScreen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(
    SRI_LANKAN_BANKS.find((b) => b.id === draft.bankId || b.name === draft.bankName) || null
  );
  const [accountHolder, setAccountHolder] = useState(
    draft.accountHolder || (draft.firstName && draft.lastName ? `${draft.firstName} ${draft.lastName}` : '')
  );
  const [accountNumber, setAccountNumber] = useState(draft.accountNumber || '');
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(
    draft.branchInfo || null
  );
  const [password, setPassword] = useState(draft.password || '');
  const [confirmPassword, setConfirmPassword] = useState(draft.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [isBranchModalVisible, setIsBranchModalVisible] = useState(false);

  const accountValidation = useMemo(() => {
    if (!selectedBank) {
      return { isValid: false, errorMessage: 'Please select your bank first.' };
    }
    return validateBankAccountNumber(selectedBank.id, accountNumber);
  }, [selectedBank, accountNumber]);

  const isHolderValid = accountHolder.trim().length > 0;
  const isBranchValid = selectedBranch !== null || (draft.branchCode !== undefined && draft.branchCode.length > 0);
  const isPasswordValid = password.length >= 6 && password === confirmPassword;

  const isFormValid =
    selectedBank !== null &&
    isHolderValid &&
    accountValidation.isValid &&
    isPasswordValid;

  const handleSelectBank = (bank: BankInfo) => {
    setSelectedBank(bank);
    setIsBankModalVisible(false);
    if (accountNumber) {
      const res = validateBankAccountNumber(bank.id, accountNumber);
      if (!res.isValid) {
        Alert.alert('Bank Account Length Rule ⚠️', res.errorMessage);
      }
    }
  };

  const handleSelectBranch = (branch: BranchInfo) => {
    setSelectedBranch(branch);
  };

  const handleCompleteRegistration = async () => {
    if (!selectedBank) {
      Alert.alert('Validation Error ⚠️', 'Please select your Bank.');
      return;
    }
    if (!isHolderValid) {
      Alert.alert('Validation Error ⚠️', 'Please enter Account Holder Name.');
      return;
    }
    if (!accountValidation.isValid) {
      Alert.alert('Validation Error ⚠️', accountValidation.errorMessage || 'Invalid Account Number.');
      return;
    }
    if (!isPasswordValid) {
      if (password.length < 6) {
        Alert.alert('Validation Error ⚠️', 'Password must be at least 6 characters long.');
      } else {
        Alert.alert('Validation Error ⚠️', 'Passwords do not match.');
      }
      return;
    }

    setIsSubmitting(true);
    const branchCodeToSave = selectedBranch ? selectedBranch.code : (draft.branchCode || '001');

    riderRegistrationService.setDraft({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      accountHolder: accountHolder.trim(),
      accountNumber: accountNumber.trim(),
      branchCode: branchCodeToSave,
      password: password.trim(),
    });

    try {
      const res = await riderRegistrationService.submitRegistration(password.trim());
      setIsSubmitting(false);

      if (res && res.success) {
        Alert.alert(
          'Registration Submitted 🎉',
          'Your rider partner registration has been submitted successfully! Redirecting to verification...',
          [
            {
              text: 'OK',
              onPress: () => router.push('/verify-otp'),
            },
          ]
        );
      } else {
        Alert.alert('Registration Notice', res?.message || 'Proceeding to phone OTP verification.', [
          { text: 'Verify OTP', onPress: () => router.push('/verify-otp') },
        ]);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      Alert.alert('Registration Error', err?.message || 'Failed to submit rider registration.');
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
              <Text style={tw`text-sm font-bold text-slate-600`}>Banking & Payout Details</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-full bg-[#0B1044] rounded-full`} />
            </View>
          </View>

          {/* BANKING DETAILS CARD */}
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 mb-5 shadow-xs gap-4`}>
            <View style={tw`flex-row items-center gap-2 mb-1`}>
              <Ionicons name="wallet-outline" size={22} color="#0B1044" />
              <Text style={tw`text-base font-extrabold text-[#0B1044]`}>Payout Bank Account</Text>
            </View>

            {/* Bank Name Selector */}
            <View>
              <Text style={tw`text-[11px] font-bold text-slate-700 mb-1`}>Bank Name *</Text>
              <TouchableOpacity
                style={tw`bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between`}
                onPress={() => setIsBankModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={tw`text-sm font-semibold ${selectedBank ? 'text-slate-900' : 'text-slate-400'}`}>
                  {selectedBank ? selectedBank.name : 'Select Sri Lankan Bank...'}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
              {selectedBank && (
                <Text style={tw`text-[10px] font-medium text-indigo-900 mt-1`}>💡 {selectedBank.hintText}</Text>
              )}
            </View>

            {/* Account Holder Name */}
            <View>
              <Text style={tw`text-[11px] font-bold text-slate-700 mb-1`}>Account Holder Name *</Text>
              <TextInput
                value={accountHolder}
                onChangeText={setAccountHolder}
                placeholder="Name on Bank Account"
                placeholderTextColor="#94A3B8"
                style={tw`bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900`}
              />
            </View>

            {/* Account Number */}
            <View>
              <Text style={tw`text-[11px] font-bold text-slate-700 mb-1`}>Account Number *</Text>
              <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder={selectedBank ? `Enter ${selectedBank.shortName} Account No.` : 'Enter Account Number'}
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                style={tw`bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900`}
              />
              {accountNumber.length > 0 && !accountValidation.isValid && (
                <Text style={tw`text-[11px] font-medium text-red-600 mt-1`}>⚠️ {accountValidation.errorMessage}</Text>
              )}
            </View>

            {/* Branch Selector */}
            <View>
              <Text style={tw`text-[11px] font-bold text-slate-700 mb-1`}>Bank Branch *</Text>
              <TouchableOpacity
                style={tw`bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 flex-row items-center justify-between`}
                onPress={() => setIsBranchModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={tw`text-sm font-semibold ${selectedBranch ? 'text-slate-900' : 'text-slate-400'}`}>
                  {selectedBranch ? `${selectedBranch.name} (${selectedBranch.code})` : 'Search & Select Branch...'}
                </Text>
                <Ionicons name="search-outline" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ACCOUNT SECURITY CARD */}
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 mb-6 shadow-xs gap-4`}>
            <View style={tw`flex-row items-center gap-2 mb-1`}>
              <Ionicons name="lock-closed-outline" size={22} color="#0B1044" />
              <Text style={tw`text-base font-extrabold text-[#0B1044]`}>Create Password</Text>
            </View>

            {/* Password */}
            <View>
              <Text style={tw`text-[11px] font-bold text-slate-700 mb-1`}>Password * (Min 6 chars)</Text>
              <View style={tw`bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 flex-row items-center`}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Create new password"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={tw`text-[11px] font-bold text-slate-700 mb-1`}>Confirm Password *</Text>
              <View style={tw`bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 flex-row items-center`}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Re-enter password"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={tw`text-[11px] font-medium text-red-600 mt-1`}>⚠️ Passwords do not match</Text>
              )}
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleCompleteRegistration}
            disabled={!isFormValid || isSubmitting}
            style={tw`py-4 rounded-xl items-center justify-center ${
              isFormValid && !isSubmitting ? 'bg-[#0B1044]' : 'bg-slate-300'
            }`}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={tw`text-base font-extrabold text-white`}>Submit Registration & Verify OTP ➔</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Bank Selection Modal */}
        <Modal visible={isBankModalVisible} animationType="slide" onRequestClose={() => setIsBankModalVisible(false)}>
          <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`flex-row items-center justify-between px-4 py-3.5 border-b border-slate-100`}>
              <TouchableOpacity onPress={() => setIsBankModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
              <Text style={tw`text-base font-bold text-slate-900`}>Select Sri Lankan Bank</Text>
              <View style={{ width: 24 }} />
            </View>
            <FlatList
              data={SRI_LANKAN_BANKS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isSelected = selectedBank?.id === item.id;
                return (
                  <TouchableOpacity
                    style={tw`flex-row items-center px-5 py-3.5 border-b border-slate-50 ${
                      isSelected ? 'bg-indigo-50' : ''
                    }`}
                    onPress={() => handleSelectBank(item)}>
                    <View style={tw`w-9 h-9 rounded-full bg-indigo-100 items-center justify-center mr-3`}>
                      <Ionicons name="business" size={18} color="#0B1044" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-sm font-bold ${isSelected ? 'text-[#0B1044]' : 'text-slate-800'}`}>
                        {item.name}
                      </Text>
                      <Text style={tw`text-xs text-slate-500 mt-0.5`}>{item.hintText}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark-circle" size={22} color="#0B1044" />}
                  </TouchableOpacity>
                );
              }}
            />
          </SafeAreaView>
        </Modal>

        {/* Searchable Branch Modal */}
        <BranchSearchModal
          visible={isBranchModalVisible}
          onClose={() => setIsBranchModalVisible(false)}
          onSelectBranch={handleSelectBranch}
          selectedBranchCode={selectedBranch?.code}
        />
      </View>
    </SafeAreaView>
  );
}
