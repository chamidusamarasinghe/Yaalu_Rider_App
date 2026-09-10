import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function BankDetailsScreen() {
  const router = useRouter();

  const [accountHolder, setAccountHolder] = useState('Harsha Perera');
  const [bankName, setBankName] = useState('Commercial Bank');
  const [accountNumber, setAccountNumber] = useState('1234 5678 9012');
  const [branchName, setBranchName] = useState('Colombo 05 Branch');
  const [swiftCode, setSwiftCode] = useState('CMBLLKLX');
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveOrEdit = () => {
    if (isEditing) {
      setIsEditing(false);
      Alert.alert('Success', 'Bank details submitted for verification!');
    } else {
      setIsEditing(true);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Bank Details</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
        {/* Section Title */}
        <Text style={tw`text-xl font-black text-slate-900 mb-4`}>Payout Bank Account</Text>

        {/* Verified Bank Account Summary Card */}
        <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center justify-between shadow-xs mb-6`}>
          <View style={tw`flex-row items-center gap-3.5`}>
            <View style={tw`w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center`}>
              <Ionicons name="business" size={22} color="#2563EB" />
            </View>
            <View>
              <Text style={tw`text-base font-black text-slate-900`}>Commercial Bank</Text>
              <Text style={tw`text-xs font-semibold text-slate-400 mt-0.5`}>
                **** **** **** 1234
              </Text>
            </View>
          </View>
          <Text style={tw`text-xs font-black text-emerald-600`}>Verified</Text>
        </View>

        {/* Input Fields */}
        <View style={tw`gap-4 mb-6`}>
          {/* Account Holder Name */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Account Holder Name</Text>
            <TextInput
              value={accountHolder}
              onChangeText={setAccountHolder}
              editable={isEditing}
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Bank Name */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Bank Name</Text>
            <TextInput
              value={bankName}
              onChangeText={setBankName}
              editable={isEditing}
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Account Number */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Account Number</Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              editable={isEditing}
              keyboardType="number-pad"
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Branch Name */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Branch Name</Text>
            <TextInput
              value={branchName}
              onChangeText={setBranchName}
              editable={isEditing}
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* SWIFT Code */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>SWIFT Code (Optional)</Text>
            <TextInput
              value={swiftCode}
              onChangeText={setSwiftCode}
              editable={isEditing}
              autoCapitalize="characters"
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSaveOrEdit}
          style={tw`w-full bg-[#030626] rounded-2xl py-4 items-center shadow-md`}>
          <Text style={tw`text-white font-extrabold text-base`}>
            {isEditing ? 'Save Bank Details' : 'Edit Bank Details'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2`}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`items-center`}>
          <Ionicons name="home-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/orders' as any)} style={tw`items-center`}>
          <Ionicons name="cart-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/wallet' as any)} style={tw`items-center`}>
          <Ionicons name="wallet-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={tw`items-center`}>
          <Ionicons name="notifications-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profile' as any)} style={tw`items-center`}>
          <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
            <Ionicons name="person" size={18} color="#0B1044" />
            <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

