import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

interface OrderHistoryItem {
  id: string;
  orderNumber: string;
  timeRange: string;
  distanceTime: string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
  amount: string;
  dateGroup: 'Today – May 26, 2026' | 'Yesterday – May 25, 2026' | 'May 24, 2026';
}

export default function OrdersScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending' | 'Cancelled'>('All');

  const orders: OrderHistoryItem[] = [
    {
      id: '1',
      orderNumber: '#YL-8921',
      timeRange: '2:45 PM – 3:10 PM',
      distanceTime: '4.2 km • 25 min',
      status: 'COMPLETED',
      amount: '+$12.40',
      dateGroup: 'Today – May 26, 2026',
    },
    {
      id: '2',
      orderNumber: '#YL-8845',
      timeRange: '1:12 PM – 1:32 PM',
      distanceTime: '2.8 km • 20 min',
      status: 'COMPLETED',
      amount: '+$8.15',
      dateGroup: 'Today – May 26, 2026',
    },
    {
      id: '3',
      orderNumber: '#YL-8790',
      timeRange: '10:30 AM – 11:05 AM',
      distanceTime: '6.5 km • 35 min',
      status: 'COMPLETED',
      amount: '+$18.60',
      dateGroup: 'Today – May 26, 2026',
    },
    {
      id: '4',
      orderNumber: '#YL-8720',
      timeRange: '8:20 PM – 8:45 PM',
      distanceTime: '3.6 km • 25 min',
      status: 'COMPLETED',
      amount: '+$11.35',
      dateGroup: 'Yesterday – May 25, 2026',
    },
    {
      id: '5',
      orderNumber: '#YL-8642',
      timeRange: '6:15 PM – 6:40 PM',
      distanceTime: '2.5 km • 25 min',
      status: 'COMPLETED',
      amount: '+$9.20',
      dateGroup: 'Yesterday – May 25, 2026',
    },
    {
      id: '6',
      orderNumber: '#YL-8551',
      timeRange: '3:40 PM – 4:05 PM',
      distanceTime: '3.1 km • 25 min',
      status: 'PENDING',
      amount: '+$10.75',
      dateGroup: 'Yesterday – May 25, 2026',
    },
    {
      id: '7',
      orderNumber: '#YL-8411',
      timeRange: '1:20 PM – 1:35 PM',
      distanceTime: '1.2 km • 15 min',
      status: 'CANCELLED',
      amount: '$0.00',
      dateGroup: 'Yesterday – May 25, 2026',
    },
    {
      id: '8',
      orderNumber: '#YL-8026',
      timeRange: 'Trad, 3.00h',
      distanceTime: '4.0 km • 30 min',
      status: 'COMPLETED',
      amount: '+$15.00',
      dateGroup: 'May 24, 2026',
    },
  ];

  const filteredOrders = orders.filter((o) => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return o.status === 'COMPLETED';
    if (filter === 'Pending') return o.status === 'PENDING';
    if (filter === 'Cancelled') return o.status === 'CANCELLED';
    return true;
  });

  const todayOrders = filteredOrders.filter((o) => o.dateGroup === 'Today – May 26, 2026');
  const yesterdayOrders = filteredOrders.filter((o) => o.dateGroup === 'Yesterday – May 25, 2026');
  const pastOrders = filteredOrders.filter((o) => o.dateGroup === 'May 24, 2026');

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity
            onPress={() => router.push('/profile')}
            style={tw`w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-200`}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsOnline(!isOnline)}
            style={tw`flex-row items-center bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-700 shadow-md gap-2`}>
            <View style={tw`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <Text style={tw`text-xs font-black text-white uppercase tracking-wider`}>
              {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/new-requests' as any)}
            style={tw`w-10 h-10 rounded-full bg-white/20 items-center justify-center`}>
            <Ionicons name="list-outline" size={20} color="#0B1044" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
          <Text style={tw`text-2xl font-black text-slate-900 mb-3`}>My Orders</Text>

          {/* Filter Pills Tabs */}
          <View style={tw`flex-row justify-between gap-2 mb-6`}>
            <TouchableOpacity
              onPress={() => setFilter('All')}
              style={tw`flex-1 py-2.5 rounded-full items-center justify-center ${
                filter === 'All' ? 'bg-[#0B1044]' : 'bg-white border border-slate-200'
              }`}>
              <Text style={tw`text-xs font-bold ${filter === 'All' ? 'text-white' : 'text-slate-600'}`}>
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('Completed')}
              style={tw`flex-1 py-2.5 rounded-full items-center justify-center ${
                filter === 'Completed' ? 'bg-[#0B1044]' : 'bg-white border border-slate-200'
              }`}>
              <Text style={tw`text-xs font-bold ${filter === 'Completed' ? 'text-white' : 'text-slate-600'}`}>
                Completed
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('Pending')}
              style={tw`flex-1 py-2.5 rounded-full items-center justify-center ${
                filter === 'Pending' ? 'bg-[#0B1044]' : 'bg-white border border-slate-200'
              }`}>
              <Text style={tw`text-xs font-bold ${filter === 'Pending' ? 'text-white' : 'text-slate-600'}`}>
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilter('Cancelled')}
              style={tw`flex-1 py-2.5 rounded-full items-center justify-center ${
                filter === 'Cancelled' ? 'bg-[#0B1044]' : 'bg-white border border-slate-200'
              }`}>
              <Text style={tw`text-xs font-bold ${filter === 'Cancelled' ? 'text-white' : 'text-slate-600'}`}>
                Cancelled
              </Text>
            </TouchableOpacity>
          </View>

          {/* Section: Today */}
          {todayOrders.length > 0 && (
            <View style={tw`mb-5`}>
              <Text style={tw`text-xs font-extrabold text-slate-500 mb-3 px-1`}>
                Today – May 26, 2026
              </Text>
              <View style={tw`gap-3`}>
                {todayOrders.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => router.push('/order-details' as any)}
                    style={tw`bg-white rounded-3xl p-4 flex-row items-center justify-between border border-slate-200/80 shadow-xs`}>
                    <View style={tw`flex-row items-center gap-3.5 flex-1 pr-2`}>
                      <View style={tw`w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center`}>
                        <FontAwesome5 name="shipping-fast" size={18} color="#2563EB" />
                      </View>
                      <View>
                        <View style={tw`flex-row items-center gap-2 mb-0.5`}>
                          <Text style={tw`text-base font-black text-slate-900`}>
                            Order {item.orderNumber}
                          </Text>
                        </View>
                        <Text style={tw`text-xs font-semibold text-slate-400`}>{item.timeRange}</Text>
                        <Text style={tw`text-[11px] text-slate-400 mt-1`}>{item.distanceTime}</Text>
                      </View>
                    </View>

                    <View style={tw`items-end gap-2`}>
                      <View style={tw`bg-emerald-100 px-2.5 py-0.5 rounded-md`}>
                        <Text style={tw`text-[9px] font-black text-emerald-800 tracking-wider`}>
                          {item.status}
                        </Text>
                      </View>
                      <Text style={tw`text-base font-black text-emerald-600`}>{item.amount}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Section: Yesterday */}
          {yesterdayOrders.length > 0 && (
            <View style={tw`mb-5`}>
              <Text style={tw`text-xs font-extrabold text-slate-500 mb-3 px-1`}>
                Yesterday – May 25, 2026
              </Text>
              <View style={tw`gap-3`}>
                {yesterdayOrders.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    onPress={() => router.push('/order-details' as any)}
                    style={tw`bg-white rounded-3xl p-4 flex-row items-center justify-between border border-slate-200/80 shadow-xs`}>
                    <View style={tw`flex-row items-center gap-3.5 flex-1 pr-2`}>
                      <View
                        style={tw`w-12 h-12 rounded-2xl ${
                          item.status === 'PENDING'
                            ? 'bg-amber-50'
                            : item.status === 'CANCELLED'
                            ? 'bg-red-50'
                            : 'bg-blue-50'
                        } items-center justify-center`}>
                        {item.status === 'CANCELLED' ? (
                          <Ionicons name="close-circle-outline" size={22} color="#EF4444" />
                        ) : item.status === 'PENDING' ? (
                          <Ionicons name="time-outline" size={22} color="#D97706" />
                        ) : (
                          <FontAwesome5 name="shipping-fast" size={18} color="#2563EB" />
                        )}
                      </View>
                      <View>
                        <Text style={tw`text-base font-black text-slate-900`}>
                          Order {item.orderNumber}
                        </Text>
                        <Text style={tw`text-xs font-semibold text-slate-400`}>{item.timeRange}</Text>
                        <Text style={tw`text-[11px] text-slate-400 mt-1`}>{item.distanceTime}</Text>
                      </View>
                    </View>

                    <View style={tw`items-end gap-2`}>
                      <View
                        style={tw`px-2.5 py-0.5 rounded-md ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-100'
                            : item.status === 'PENDING'
                            ? 'bg-amber-100'
                            : 'bg-red-100'
                        }`}>
                        <Text
                          style={tw`text-[9px] font-black tracking-wider ${
                            item.status === 'COMPLETED'
                              ? 'text-emerald-800'
                              : item.status === 'PENDING'
                              ? 'text-amber-800'
                              : 'text-red-800'
                          }`}>
                          {item.status}
                        </Text>
                      </View>
                      <Text
                        style={tw`text-base font-black ${
                          item.status === 'CANCELLED'
                            ? 'text-slate-900'
                            : item.status === 'PENDING'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}>
                        {item.amount}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Section: May 24, 2026 */}
          {pastOrders.length > 0 && (
            <View style={tw`mb-5`}>
              <Text style={tw`text-xs font-extrabold text-slate-500 mb-3 px-1`}>May 24, 2026</Text>
              <View style={tw`bg-white rounded-3xl p-4 border border-slate-200/80 shadow-xs`}>
                <Text style={tw`text-base font-black text-[#0B1044]`}>#YL-8026</Text>
                <Text style={tw`text-xs text-slate-400 mt-1`}>Trad, 3.00h</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom Navigation Bar */}
        <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2`}>
          <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`items-center`}>
            <Ionicons name="home-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={tw`items-center`}>
            <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
              <Ionicons name="cart" size={18} color="#0B1044" />
              <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Orders</Text>
            </View>
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
            <Ionicons name="person-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

