import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi from '@/services/api';

export default function NewRequestsScreen() {
  const router = useRouter();
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res: any = await riderApi.getAvailableOrders();
      if (Array.isArray(res)) {
        const mapped = res.map((r) => ({
          ...r,
          rideType: r.rideType || 'STANDARD',
        }));
        setAvailableOrders(mapped);
      } else {
        setAvailableOrders([]);
      }
    } catch (err: any) {
      console.warn('Failed to load available orders:', err?.message || err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleAcceptOrder = async (orderId: string, rideType?: string) => {
    try {
      setAcceptingId(orderId);
      
      const acceptedItem = availableOrders.find(o => o.id === orderId) || {};
      const fare = acceptedItem.fare ? Number(acceptedItem.fare) : 1000;
      const actualRideType = rideType || acceptedItem.rideType || 'STANDARD';
      
      if (actualRideType === 'BID' || actualRideType === 'BIDDING') {
        // For Bids, we just VIEW the details. We do not accept the order yet.
        router.push({
          pathname: '/hire-details',
          params: {
            startingPrice: fare.toString(),
            minBid: Math.floor(fare * 0.9).toString(),
            maxBid: Math.floor(fare * 1.2).toString(),
            secondsLeft: '120',
          }
        } as any);
      } else {
        // For Standard rides, we ACCEPT the order immediately
        await riderApi.acceptOrder(orderId);
        router.push('/navigate-pickup');
        fetchOrders();
      }
    } catch (e: any) {
      Alert.alert('Accept Error ⚠️', e?.message || 'Failed to accept order.');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
          <View style={tw`flex-row items-center gap-3`}>
            <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
              <Ionicons name="arrow-back" size={24} color="#0B1044" />
            </TouchableOpacity>
            <Text style={tw`text-xl font-extrabold text-[#0B1044]`}>New Requests</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`p-4 pb-20`}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFC72C" />}>
          
          <Text style={tw`text-xs font-black text-slate-500 uppercase tracking-widest mb-3`}>
            Available Delivery Trips ({availableOrders.length})
          </Text>

          {loading ? (
            <View style={tw`py-12 items-center justify-center`}>
              <ActivityIndicator size="large" color="#0B1044" />
              <Text style={tw`text-xs font-semibold text-slate-500 mt-2`}>Fetching live requests...</Text>
            </View>
          ) : availableOrders.length > 0 ? (
            availableOrders.map((item) => (
              <View
                key={item.id}
                style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4 gap-4`}>
                {/* Header Badge */}
                <View style={tw`flex-row justify-between items-center pb-3 border-b border-slate-100`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <View style={tw`w-8 h-8 rounded-xl bg-amber-100 items-center justify-center`}>
                      <Ionicons name="flash" size={16} color="#D97706" />
                    </View>
                    <Text style={tw`text-sm font-black text-[#0B1044]`}>{item.orderNumber}</Text>
                  </View>
                  <Text style={tw`text-lg font-black text-emerald-600`}>LKR {item.fare}</Text>
                </View>

                {/* Pickup / Dropoff */}
                <View style={tw`gap-3`}>
                  <View style={tw`flex-row items-center gap-3`}>
                    <View style={tw`w-3 h-3 rounded-full bg-emerald-500` } />
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-[10px] font-bold text-slate-400 uppercase`}>PICKUP</Text>
                      <Text style={tw`text-xs font-bold text-slate-900`}>{item.pickupAddress}</Text>
                    </View>
                  </View>

                  <View style={tw`flex-row items-center gap-3`}>
                    <View style={tw`w-3 h-3 rounded-full bg-red-500`} />
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-[10px] font-bold text-slate-400 uppercase`}>DROPOFF</Text>
                      <Text style={tw`text-xs font-bold text-slate-900`}>{item.dropoffAddress}</Text>
                    </View>
                  </View>
                </View>

                {/* Accept Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  disabled={acceptingId === item.id}
                  onPress={() => handleAcceptOrder(item.id, item.rideType)}
                  style={tw`bg-[#0B1044] rounded-2xl py-3.5 items-center justify-center flex-row gap-2 shadow-sm`}>
                  {acceptingId === item.id ? (
                    <ActivityIndicator size="small" color="#FFC72C" />
                  ) : (
                    <>
                      <Text style={tw`text-white font-extrabold text-sm`}>
                        {item.rideType?.includes('BID') ? 'View & Join Bid' : 'Accept Ride Now'}
                      </Text>
                      <Ionicons name={item.rideType?.includes('BID') ? 'hammer-outline' : 'checkmark-circle'} size={18} color="#FFC72C" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={tw`bg-white rounded-3xl p-8 border border-slate-200 items-center justify-center my-6`}>
              <View style={tw`w-16 h-16 rounded-full bg-amber-50 items-center justify-center mb-3`}>
                <Ionicons name="bicycle-outline" size={32} color="#D97706" />
              </View>
              <Text style={tw`text-base font-black text-slate-900 text-center`}>No Nearby Requests Right Now</Text>
              <Text style={tw`text-xs font-semibold text-slate-500 text-center mt-1 leading-4.5`}>
                Stay online and near high-demand areas. New customer delivery requests will show up here automatically!
              </Text>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
