import React, { useState, useEffect } from 'react';
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
import riderApi, { saveToken, saveRider, clearRegistrationDraft, getRegistrationDraft } from '@/services/api';

export default function RegisterStep5BankingScreen() {
  const router = useRouter();
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password Validation Criteria
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const isMatching = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const isPasswordValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    isMatching;

  useEffect(() => {
    (async () => {
      const draft = await getRegistrationDraft();
      if (draft) {
        if (draft.bankName) setBankName(draft.bankName);
        if (draft.accountHolder || draft.fullName) {
          setAccountHolder(draft.accountHolder || draft.fullName);
        }
        if (draft.accountNumber) setAccountNumber(draft.accountNumber);
        if (draft.branchCode) setBranchCode(draft.branchCode);
      }
    })();
  }, []);

  const handleCompleteRegistration = async () => {
    setError(null);

    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (!hasMinLength) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!hasUppercase) {
      setError('Password must contain at least one capital letter (A-Z).');
      return;
    }
    if (!hasLowercase) {
      setError('Password must contain at least one simple letter (a-z).');
      return;
    }
    if (!hasNumber) {
      setError('Password must contain at least one number (0-9).');
      return;
    }
    if (!hasSpecial) {
      setError('Password must contain at least one special symbol (!@#$%^&*...).');
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your password.');
      return;
    }
    if (!isMatching) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const draft = (await getRegistrationDraft()) || {};

      const payload = {
        ...draft,
        bankName: bankName.trim() || 'Commercial Bank',
        accountHolder: accountHolder.trim() || draft.fullName || 'Rider Partner',
        accountNumber: accountNumber.trim() || '8000123456',
        branchCode: branchCode.trim() || '001',
        password: password.trim(),
        confirmPassword: confirmPassword.trim(),
      };

      const res = await riderApi.registerStep5(payload);

      if (res?.accessToken || res?.token) {
        const token = res.accessToken || res.token;
        const rider = res.rider;
        await saveToken(token);
        await saveRider(rider);
        await clearRegistrationDraft();
        router.replace('/dashboard');
      } else {
        throw new Error('Registration failed, please try again.');
      }
    } catch (err: any) {
      console.warn('Registration completion note:', err?.message);
      setError(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
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
              <Text style={tw`text-sm font-extrabold text-[#0B1044]`}>Step 5 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>Banking & Security</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-full bg-[#0B1044] rounded-full`} />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={tw`bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2`}>
              <Ionicons name="alert-circle" size={18} color="#E11D48" />
              <Text style={tw`flex-1 text-xs font-bold text-rose-700`}>{error}</Text>
            </View>
          )}

          <Text style={tw`text-xs font-semibold text-slate-600 mb-5 leading-4.5`}>
            Enter your bank payout information and create a secure password to complete your account setup.
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
              <Text style={tw`text-xs font-bold text-slate-600 mb-1`}>Bank Name</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3 shadow-xs gap-2.5`}>
                <Ionicons name="business-outline" size={18} color="#64748B" />
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="e.g. Commercial Bank / BOC / Sampath"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Account Holder Name */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1`}>Account Holder Name</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3 shadow-xs gap-2.5`}>
                <Ionicons name="person-outline" size={18} color="#64748B" />
                <TextInput
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                  placeholder="e.g. H. P. Harsha Perera"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Account Number */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1`}>Account Number</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3 shadow-xs gap-2.5`}>
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
              <Text style={tw`text-xs font-bold text-slate-600 mb-1`}>Branch Code / Branch Name</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3 shadow-xs gap-2.5`}>
                <Ionicons name="location-outline" size={18} color="#64748B" />
                <TextInput
                  value={branchCode}
                  onChangeText={setBranchCode}
                  placeholder="e.g. 054 (Colombo Fort)"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>
          </View>

          {/* Account Password */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-2 mt-2`}>
            ACCOUNT PASSWORD
          </Text>
          <View style={tw`gap-3.5 mb-4`}>
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1`}>Create Password</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3 shadow-xs gap-2.5`}>
                <Ionicons name="lock-closed-outline" size={18} color="#64748B" />
                <TextInput
                  value={password}
                  onChangeText={(t) => { setPassword(t); if (error) setError(null); }}
                  placeholder="Enter secure password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1`}>Confirm Password</Text>
              <View style={tw`flex-row items-center bg-[#FFFFFF] border border-slate-300 rounded-2xl px-3.5 py-3 shadow-xs gap-2.5`}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#64748B" />
                <TextInput
                  value={confirmPassword}
                  onChangeText={(t) => { setConfirmPassword(t); if (error) setError(null); }}
                  placeholder="Re-enter password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Password Validation Requirements Checklist */}
          <View style={tw`bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-xs`}>
            <Text style={tw`text-xs font-black text-slate-700 mb-2.5`}>Password must contain:</Text>
            
            <View style={tw`gap-2`}>
              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons
                  name={hasMinLength ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasMinLength ? '#10B981' : '#94A3B8'}
                />
                <Text style={[tw`text-xs`, hasMinLength ? tw`text-emerald-700 font-bold` : tw`text-slate-500`]}>
                  Minimum 8 characters length
                </Text>
              </View>

              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons
                  name={hasUppercase ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasUppercase ? '#10B981' : '#94A3B8'}
                />
                <Text style={[tw`text-xs`, hasUppercase ? tw`text-emerald-700 font-bold` : tw`text-slate-500`]}>
                  At least one capital letter (A-Z)
                </Text>
              </View>

              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons
                  name={hasLowercase ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasLowercase ? '#10B981' : '#94A3B8'}
                />
                <Text style={[tw`text-xs`, hasLowercase ? tw`text-emerald-700 font-bold` : tw`text-slate-500`]}>
                  At least one simple letter (a-z)
                </Text>
              </View>

              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons
                  name={hasNumber ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasNumber ? '#10B981' : '#94A3B8'}
                />
                <Text style={[tw`text-xs`, hasNumber ? tw`text-emerald-700 font-bold` : tw`text-slate-500`]}>
                  At least one number (0-9)
                </Text>
              </View>

              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons
                  name={hasSpecial ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={hasSpecial ? '#10B981' : '#94A3B8'}
                />
                <Text style={[tw`text-xs`, hasSpecial ? tw`text-emerald-700 font-bold` : tw`text-slate-500`]}>
                  At least one special symbol (!@#$%^&*...)
                </Text>
              </View>

              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons
                  name={isMatching ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={isMatching ? '#10B981' : '#94A3B8'}
                />
                <Text style={[tw`text-xs`, isMatching ? tw`text-emerald-700 font-bold` : tw`text-slate-500`]}>
                  Passwords match
                </Text>
              </View>
            </View>
          </View>

          {/* Complete Registration Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCompleteRegistration}
            disabled={loading || !isPasswordValid}
            style={[
              tw`w-full rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-4`,
              { backgroundColor: loading || !isPasswordValid ? '#94A3B8' : '#0B1044' },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-extrabold text-base`}>Complete Registration</Text>
                <Ionicons name="checkmark-circle" size={20} color={isPasswordValid ? '#FFC72C' : '#CBD5E1'} />
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
