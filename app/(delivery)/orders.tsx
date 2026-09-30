import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi from '@/services/api';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending' | 'Cancelled'>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMyOrders = async () => {
    try {
      const res: any = await riderApi.getMyOrders();
      if (Array.isArray(res)) {
        setOrders(res);
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.warn('Failed to load rider orders:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMyOrders();
  };

  const filteredOrders = orders.filter((o) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return o.status === 'COMPLETED';
    if (filter === 'Pending') return o.status === 'PENDING' || o.status === 'IN_TRIP' || o.status === 'ACCEPTED';
    if (filter === 'Cancelled') return o.status === 'CANCELLED';
    return true;
  });

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
          <Text style={tw`text-xl font-extrabold text-[#0B1044]`}>My Orders & Trips</Text>
          <TouchableOpacity onPress={fetchMyOrders} style={tw`p-1`}>
            <Ionicons name="refresh" size={20} color="#0B1044" />
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={tw`flex-row gap-2 px-4 py-3 bg-white border-b border-slate-200`}>
          {(['All', 'Completed', 'Pending', 'Cancelled'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[
                tw`px-3.5 py-1.5 rounded-full border shadow-sm`,
                filter === tab
                  ? tw`bg-[#0B1044] border-[#0B1044]`
                  : tw`bg-slate-100 border-slate-200`,
              ]}>
              <Text
                style={tw`text-xs font-bold ${
                  filter === tab ? 'text-[#FFC72C]' : 'text-slate-600'
                }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`p-4 pb-24`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFC72C" />}>
          
          {loading ? (
            <View style={tw`py-12 items-center justify-center`}>
              <ActivityIndicator size="large" color="#0B1044" />
              <Text style={tw`text-xs font-semibold text-slate-500 mt-2`}>Loading order history...</Text>
            </View>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((item) => (
              <View
                key={item.id}
                style={tw`bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-3.5 gap-3`}>
                <View style={tw`flex-row justify-between items-center pb-2.5 border-b border-slate-100`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Text style={tw`text-sm font-black text-[#0B1044]`}>{item.orderNumber}</Text>
                    <View
                      style={[
                        tw`px-2 py-0.5 rounded-full`,
                        item.status === 'COMPLETED'
                          ? tw`bg-emerald-100`
                          : item.status === 'CANCELLED'
                          ? tw`bg-red-100`
                          : tw`bg-amber-100`,
                      ]}>
                      <Text
                        style={[
                          tw`text-[10px] font-black`,
                          item.status === 'COMPLETED'
                            ? tw`text-emerald-700`
                            : item.status === 'CANCELLED'
                            ? tw`text-red-700`
                            : tw`text-amber-700`,
                        ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={tw`text-sm font-black text-emerald-600`}>{item.amount}</Text>
                </View>

                {/* Locations */}
                <View style={tw`gap-1.5`}>
                  <Text style={tw`text-xs font-bold text-slate-900`}>
                    📍 {item.pickupAddress} → {item.dropoffAddress}
                  </Text>
                  <Text style={tw`text-[11px] font-semibold text-slate-400`}>
                    Date: {item.dateGroup || 'Recent'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View style={tw`bg-white rounded-3xl p-8 border border-slate-200 items-center justify-center my-6`}>
              <Ionicons name="receipt-outline" size={36} color="#CBD5E1" />
              <Text style={tw`text-base font-black text-slate-900 text-center mt-2`}>No Orders Found</Text>
              <Text style={tw`text-xs font-semibold text-slate-500 text-center mt-1`}>
                No trip records matching the "{filter}" filter.
              </Text>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
