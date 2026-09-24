import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { getSavedRider } from '@/services/api';

export default function WalletScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [earningsData, setEarningsData] = useState<any>(null);
  const [bankData, setBankData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWalletData = async () => {
    try {
      const [earningsRes, bankRes] = await Promise.allSettled([
        riderApi.getEarnings(period),
        riderApi.getBankDetails(),
      ]);

      if (earningsRes.status === 'fulfilled') setEarningsData(earningsRes.value);
      if (bankRes.status === 'fulfilled') setBankData(bankRes.value);
    } catch (e) {
      console.warn('Failed to load wallet data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [period]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const balanceText = earningsData?.totalEarnings
    ? `LKR ${Number(earningsData.totalEarnings).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`
    : 'LKR 0.00';

  const netEarningsText = earningsData?.netEarnings
    ? `LKR ${Number(earningsData.netEarnings).toLocaleString('en-LK', { minimumFractionDigits: 2 })}`
    : 'LKR 0.00';

  const tripsCount = earningsData?.totalDeliveries ?? 0;

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
          <Text style={tw`text-xl font-extrabold text-[#0B1044]`}>My Wallet & Payouts</Text>
          <TouchableOpacity
            onPress={() => router.push('/bank-details' as any)}
            style={tw`w-10 h-10 rounded-full bg-white/20 items-center justify-center`}>
            <Ionicons name="card-outline" size={20} color="#0B1044" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`p-4 pb-24`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFC72C" />}>
          
          {/* Period Selector Tabs */}
          <View style={tw`flex-row gap-2 mb-4 bg-white p-1.5 rounded-2xl border border-slate-200`}>
            {(['daily', 'weekly', 'monthly'] as const).map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setPeriod(t)}
                style={[
                  tw`flex-1 py-2 items-center rounded-xl`,
                  period === t ? tw`bg-[#0B1044]` : tw`bg-transparent`,
                ]}>
                <Text
                  style={tw`text-xs font-extrabold capitalize ${
                    period === t ? 'text-[#FFC72C]' : 'text-slate-600'
                  }`}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wallet Balance Hero Card */}
          <View style={tw`bg-[#0B1044] rounded-3xl p-5 shadow-xl mb-5 relative overflow-hidden`}>
            <Text style={tw`text-xs font-bold text-slate-300 uppercase tracking-widest mb-1`}>
              Total Net Rider Earnings ({period})
            </Text>
            <Text style={tw`text-3xl font-black text-white`}>{netEarningsText}</Text>
            <Text style={tw`text-xs text-amber-400 font-bold mt-1`}>
              Gross Fare: {balanceText} • {tripsCount} Completed Trips
            </Text>

            <View style={tw`flex-row gap-3 mt-5`}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/bank-details' as any)}
                style={tw`flex-1 bg-amber-400 py-3 rounded-xl items-center justify-center shadow-md`}>
                <Text style={tw`text-xs font-black text-[#0B1044]`}>Manage Bank Payouts</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bank Account Info Card */}
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>
            Connected Bank Payout Account
          </Text>
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-5 gap-2`}>
            <View style={tw`flex-row items-center justify-between pb-3 border-b border-slate-100`}>
              <View style={tw`flex-row items-center gap-2.5`}>
                <View style={tw`w-10 h-10 rounded-xl bg-blue-50 items-center justify-center`}>
                  <Ionicons name="business-outline" size={20} color="#2563EB" />
                </View>
                <View>
                  <Text style={tw`text-sm font-black text-slate-900`}>
                    {bankData?.bankName || bankData?.rider?.bankName || 'Bank Account'}
                  </Text>
                  <Text style={tw`text-xs text-slate-500 font-semibold`}>
                    {bankData?.accountHolder || bankData?.rider?.accountHolder || 'Account Holder'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => router.push('/bank-details' as any)}>
                <Text style={tw`text-xs font-black text-blue-600`}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={tw`flex-row justify-between items-center pt-1`}>
              <Text style={tw`text-xs font-bold text-slate-500`}>Account Number:</Text>
              <Text style={tw`text-xs font-black text-slate-900`}>
                {bankData?.accountNumber || bankData?.rider?.accountNumber || 'Not set'}
              </Text>
            </View>
          </View>

          {/* Recent Payout History */}
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>
            Recent Payout History
          </Text>
          <View style={tw`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden`}>
            {earningsData?.recentPayouts && earningsData.recentPayouts.length > 0 ? (
              earningsData.recentPayouts.map((p: any, idx: number) => (
                <View key={idx} style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
                  <View style={tw`flex-row items-center gap-3`}>
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                    <View>
                      <Text style={tw`text-xs font-black text-slate-900`}>{p.amount}</Text>
                      <Text style={tw`text-[10px] text-slate-400`}>{p.date}</Text>
                    </View>
                  </View>
                  <View style={tw`bg-emerald-100 px-2.5 py-1 rounded-full`}>
                    <Text style={tw`text-[10px] font-black text-emerald-800`}>{p.status}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={tw`p-6 items-center`}>
                <Text style={tw`text-xs text-slate-500 font-semibold`}>No payout history recorded yet</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
