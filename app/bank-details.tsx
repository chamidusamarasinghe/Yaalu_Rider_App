import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { getSavedRider } from '@/services/api';

export default function BankDetailsScreen() {
  const router = useRouter();

  const [accountHolder, setAccountHolder] = useState('Harsha Perera');
  const [bankName, setBankName] = useState('Commercial Bank');
  const [accountNumber, setAccountNumber] = useState('8000123456');
  const [branchName, setBranchName] = useState('Colombo 05 Branch');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getSavedRider();
      if (saved) {
        if (saved.accountHolder || saved.fullName) setAccountHolder(saved.accountHolder || saved.fullName);
        if (saved.bankName) setBankName(saved.bankName);
        if (saved.accountNumber) setAccountNumber(saved.accountNumber);
        if (saved.branchCode) setBranchName(saved.branchCode);
      }

      try {
        const res: any = await riderApi.getBankDetails();
        if (res?.rider) {
          if (res.rider.accountHolder) setAccountHolder(res.rider.accountHolder);
          if (res.rider.bankName) setBankName(res.rider.bankName);
          if (res.rider.accountNumber) setAccountNumber(res.rider.accountNumber);
          if (res.rider.branchCode) setBranchName(res.rider.branchCode);
        }
      } catch (e) {
        // fallback to saved
      }
    })();
  }, []);

  const handleSaveOrEdit = async () => {
    if (isEditing) {
      try {
        setLoading(true);
        await riderApi.updateBankDetails({
          bankName: bankName.trim(),
          accountHolder: accountHolder.trim(),
          accountNumber: accountNumber.trim(),
          branchCode: branchName.trim(),
        });
        setIsEditing(false);
        Alert.alert('Success', 'Bank payout details updated successfully in database!');
      } catch (e: any) {
        Alert.alert('Error', e.message || 'Failed to update bank details');
      } finally {
        setLoading(false);
      }
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
                <Ionicons name="business" size={22} color="#0B1044" />
              </View>
              <View>
                <Text style={tw`text-base font-black text-slate-900`}>{bankName || 'Direct Payout'}</Text>
                <Text style={tw`text-xs font-semibold text-slate-400 mt-0.5`}>
                  {accountNumber ? `•••• ${accountNumber.slice(-4)}` : '•••• 1234'}
                </Text>
              </View>
            </View>
            <Text style={tw`text-xs font-black text-emerald-600`}>Active Payout</Text>
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
                keyboardType="number-pad"
                editable={isEditing}
                style={tw`text-base font-black text-slate-900 p-0`}
              />
            </View>

            {/* Branch / Code */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Branch Name / Code</Text>
              <TextInput
                value={branchName}
                onChangeText={setBranchName}
                editable={isEditing}
                style={tw`text-base font-black text-slate-900 p-0`}
              />
            </View>
          </View>

          {/* Notice Card */}
          <View style={tw`bg-amber-50/60 border border-amber-200/60 rounded-2xl p-4 flex-row items-start gap-3 mb-6`}>
            <Ionicons name="information-circle" size={20} color="#0B1044" style={tw`mt-0.5`} />
            <Text style={tw`flex-1 text-xs text-[#0B1044] font-medium leading-4.5`}>
              Earnings from completed deliveries will be automatically transferred to this bank account weekly.
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSaveOrEdit}
            disabled={loading}
            style={[
              tw`w-full rounded-2xl py-4 items-center shadow-md`,
              { backgroundColor: loading ? '#94A3B8' : isEditing ? '#059669' : '#0B1044' },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <Text style={tw`text-white font-extrabold text-base`}>
                {isEditing ? 'Save Changes to Database' : 'Edit Bank Details'}
              </Text>
            )}
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
