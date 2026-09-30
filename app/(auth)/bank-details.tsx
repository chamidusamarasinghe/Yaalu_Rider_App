import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { getSavedRider, formatRiderData } from '@/services/api';
import BranchSearchModal from '@/components/BranchSearchModal';
import { SRI_LANKAN_BANKS, SRI_LANKAN_BRANCHES, BankInfo, BranchInfo } from '@/constants/banks';

export default function BankDetailsScreen() {
  const router = useRouter();

  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Bank & Branch Selection Modals State
  const [selectedBank, setSelectedBank] = useState<BankInfo | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(null);
  const [isBankModalVisible, setIsBankModalVisible] = useState(false);
  const [isBranchModalVisible, setIsBranchModalVisible] = useState(false);

  const getBranchDisplayName = (val: string) => {
    if (!val) return 'Not specified';
    const found = SRI_LANKAN_BRANCHES.find(
      (b) => b.code === val || b.name.toLowerCase() === val.toLowerCase()
    );
    if (found) {
      if (val === found.code) {
        return `${found.name} (${found.code})`;
      }
      if (!val.includes(found.code)) {
        return `${found.name} (${found.code})`;
      }
      return val;
    }
    return val;
  };

  const populateBankFields = (formatted: any) => {
    if (!formatted) return;
    if (formatted.accountHolder || formatted.accountName) {
      setAccountHolder(formatted.accountHolder || formatted.accountName);
    }
    if (formatted.bankName) {
      setBankName(formatted.bankName);
      const foundBank = SRI_LANKAN_BANKS.find(
        (b) => b.name.toLowerCase() === formatted.bankName.toLowerCase() || b.id === formatted.bankId
      );
      if (foundBank) setSelectedBank(foundBank);
    }
    if (formatted.accountNumber || formatted.accountNo) {
      setAccountNumber(formatted.accountNumber || formatted.accountNo);
    }
    if (formatted.branchCode || formatted.accountBranch) {
      const bCode = formatted.branchCode || formatted.accountBranch;
      setBranchName(bCode);
      const foundBr = SRI_LANKAN_BRANCHES.find(
        (b) => b.code === bCode || b.name.toLowerCase() === bCode.toLowerCase()
      );
      if (foundBr) setSelectedBranch(foundBr);
    }
  };

  useEffect(() => {
    (async () => {
      const saved = await getSavedRider();
      if (saved) {
        const formatted = formatRiderData({}, saved);
        populateBankFields(formatted);
      }

      try {
        const res: any = await riderApi.getBankDetails();
        if (res) {
          const currentSaved = await getSavedRider();
          const formatted = formatRiderData({ rider: res }, currentSaved);
          populateBankFields(formatted);
        }
      } catch (e) {
        // fallback to saved
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectBank = (bank: BankInfo) => {
    setSelectedBank(bank);
    setBankName(bank.name);
    setIsBankModalVisible(false);
  };

  const handleSelectBranch = (branch: BranchInfo) => {
    setSelectedBranch(branch);
    setBranchName(`${branch.name} (${branch.code})`);
    setIsBranchModalVisible(false);
  };

  const handleSaveOrEdit = async () => {
    if (isEditing) {
      if (!bankName.trim()) {
        Alert.alert('Validation Error ⚠️', 'Please select your bank.');
        return;
      }
      if (!accountHolder.trim()) {
        Alert.alert('Validation Error ⚠️', 'Please enter account holder name.');
        return;
      }
      if (!accountNumber.trim()) {
        Alert.alert('Validation Error ⚠️', 'Please enter account number.');
        return;
      }
      try {
        setLoading(true);
        const branchCodeToSave = selectedBranch ? selectedBranch.code : branchName;
        await riderApi.updateBankDetails({
          bankName: bankName.trim(),
          accountName: accountHolder.trim(),
          accountNo: accountNumber.trim(),
          accountBranch: branchCodeToSave,
          branchCode: branchCodeToSave,
        });
        setIsEditing(false);
        Alert.alert('Success 🎉', 'Bank payout details updated successfully!');
      } catch (e: any) {
        Alert.alert('Error ⚠️', e.message || 'Failed to update bank details');
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
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-xl font-black text-slate-900`}>Payout Bank Account</Text>
            {isEditing && (
              <View style={tw`bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md`}>
                <Text style={tw`text-[10px] font-black text-amber-900`}>Editing Mode</Text>
              </View>
            )}
          </View>

          {/* Verified Bank Account Summary Card */}
          <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center justify-between shadow-sm mb-6`}>
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
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Account Holder Name *</Text>
              <TextInput
                value={accountHolder}
                onChangeText={setAccountHolder}
                editable={isEditing}
                placeholder="Enter Account Holder Name"
                placeholderTextColor="#94A3B8"
                style={tw`text-base font-black text-slate-900 p-0`}
              />
            </View>

            {/* Bank Name (Selectable Dropdown in Edit Mode) */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Bank Name *</Text>
              {isEditing ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setIsBankModalVisible(true)}
                  style={tw`flex-row items-center justify-between`}>
                  <Text style={tw`text-base font-black ${bankName ? 'text-slate-900' : 'text-slate-400'}`}>
                    {bankName || 'Select Sri Lankan Bank...'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#2563EB" />
                </TouchableOpacity>
              ) : (
                <Text style={tw`text-base font-black text-slate-900`}>{bankName || 'Not specified'}</Text>
              )}
            </View>

            {/* Account Number */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Account Number *</Text>
              <TextInput
                value={accountNumber}
                onChangeText={setAccountNumber}
                keyboardType="number-pad"
                editable={isEditing}
                placeholder="Enter Account Number"
                placeholderTextColor="#94A3B8"
                style={tw`text-base font-black text-slate-900 p-0`}
              />
            </View>

            {/* Branch Name & Code (Selectable via Search Modal in Edit Mode) */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Branch Name & Code *</Text>
              {isEditing ? (
                <TouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setIsBranchModalVisible(true)}
                  style={tw`flex-row items-center justify-between`}>
                  <Text style={tw`text-base font-black ${branchName ? 'text-slate-900' : 'text-slate-400'}`}>
                    {branchName ? getBranchDisplayName(branchName) : 'Search & Select Branch...'}
                  </Text>
                  <Ionicons name="search-outline" size={20} color="#2563EB" />
                </TouchableOpacity>
              ) : (
                <Text style={tw`text-base font-black text-slate-900`}>
                  {getBranchDisplayName(branchName)}
                </Text>
              )}
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
                {isEditing ? 'Save Bank Changes' : 'Edit Bank Details'}
              </Text>
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
                const isSelected = selectedBank?.id === item.id || bankName === item.name;
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
