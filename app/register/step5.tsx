import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function RegisterStep5BankingScreen() {
  const router = useRouter();
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchCode, setBranchCode] = useState('');

  const handleCompleteRegistration = () => {
    Alert.alert('Success!', 'Registration submitted successfully. Welcome to Yaalu Rider!', [
      { text: 'Go to Dashboard', onPress: () => router.push('/dashboard') },
    ]);
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

          {/* Credit Card Hero Security Banner */}
          <View style={tw`bg-[#0E2045] rounded-3xl p-5 shadow-xl mb-6 relative overflow-hidden border border-blue-900/40`}>
            {/* Card Chip & Expiry mockup */}
            <View style={tw`flex-row justify-between items-start mb-4`}>
              <View style={tw`w-10 h-8 rounded-lg bg-amber-400/80 border border-amber-300 items-center justify-center`}>
                <View style={tw`w-6 h-5 border border-amber-800/40 rounded`} />
              </View>
              <Text style={tw`text-[10px] font-black text-slate-400 uppercase tracking-widest`}>
                BREKIT EARE
              </Text>
            </View>

            <Text style={tw`text-lg font-black text-white tracking-widest my-2`}>
              1234  5775  8578  5030
            </Text>
            <Text style={tw`text-[10px] font-extrabold text-slate-400 mb-4`}>CAEANREATORE</Text>

            {/* SSL Badge Footer */}
            <View style={tw`flex-row items-center gap-2 pt-2 border-t border-blue-800/50`}>
              <Ionicons name="business" size={18} color="#FFFFFF" />
              <View>
                <Text style={tw`text-[9px] font-bold text-slate-400 uppercase tracking-wider`}>
                  SECURITY STATUS
                </Text>
                <Text style={tw`text-xs font-black text-white`}>Encrypted SSL Connection</Text>
              </View>
            </View>
          </View>

          {/* Bank Inputs */}
          <View style={tw`gap-4 mb-6`}>
            {/* Bank Name */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Bank Name</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5`}>
                <Ionicons name="business-outline" size={18} color="#64748B" />
                <TextInput
                  value={bankName}
                  onChangeText={setBankName}
                  placeholder="Enter bank name"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Account Holder Name */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Account Holder Name</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5`}>
                <Ionicons name="person-outline" size={18} color="#64748B" />
                <TextInput
                  value={accountHolder}
                  onChangeText={setAccountHolder}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Account Number */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Account Number</Text>
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
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Branch Code / Routing Number</Text>
              <View style={tw`flex-row items-center bg-white border border-slate-300 rounded-2xl px-3.5 py-3.5 gap-2.5`}>
                <Ionicons name="location-outline" size={18} color="#64748B" />
                <TextInput
                  value={branchCode}
                  onChangeText={setBranchCode}
                  placeholder="Enter branch code"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>
          </View>

          {/* Mint Green Verification Note */}
          <View style={tw`bg-emerald-100/70 border border-emerald-200 rounded-2xl p-4 flex-row items-start gap-3 mb-6`}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" style={tw`mt-0.5`} />
            <Text style={tw`flex-1 text-xs font-medium text-emerald-900 leading-4.5`}>
              Your details will be verified by our finance team. Incorrect information may delay your first payout.
            </Text>
          </View>

          {/* Complete Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleCompleteRegistration}
            style={tw`w-full bg-[#030626] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-4`}>
            <Text style={tw`text-white font-extrabold text-base`}>Complete Registration</Text>
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/dashboard')}>
            <Text style={tw`text-slate-500 font-bold text-xs text-center`}>Verify Details Later</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
