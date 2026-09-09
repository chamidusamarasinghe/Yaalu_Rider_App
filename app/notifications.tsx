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
import tw from 'twrnc';

interface NotificationItem {
  id: string;
  type: 'Requests' | 'Payments' | 'Alerts';
  title: string;
  description: string;
  time: string;
  dateGroup: 'Today' | 'Yesterday';
  unread: boolean;
  color: string;
  iconName: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState<'All' | 'Requests' | 'Payments' | 'Alerts'>('All');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'Requests',
      title: 'New High Fare Delivery Available!',
      description: 'Order #YA-9021 • LKR 650 • 2.4 km away from your location.',
      time: '10 mins ago',
      dateGroup: 'Today',
      unread: true,
      color: 'bg-blue-500',
      iconName: 'flash',
    },
    {
      id: '2',
      type: 'Payments',
      title: 'Weekly Payout Processed',
      description: 'LKR 28,450.00 transferred to Commercial Bank ending in 1234.',
      time: '2 hours ago',
      dateGroup: 'Today',
      unread: true,
      color: 'bg-emerald-500',
      iconName: 'cash',
    },
    {
      id: '3',
      type: 'Alerts',
      title: 'Peak Bonus Area Active! 🔥',
      description: 'Earn +LKR 100 extra per order in Colombo 03 region until 3:00 PM.',
      time: '4 hours ago',
      dateGroup: 'Today',
      unread: false,
      color: 'bg-purple-500',
      iconName: 'flame',
    },
    {
      id: '4',
      type: 'Requests',
      title: 'Delivery Completed Successfully',
      description: 'Order #YA-8812 marked as delivered. Customer rated 5 stars! ★',
      time: 'Yesterday 6:30 PM',
      dateGroup: 'Yesterday',
      unread: false,
      color: 'bg-blue-500',
      iconName: 'checkmark-circle',
    },
    {
      id: '5',
      type: 'Alerts',
      title: 'System Maintenance Notice',
      description: 'The Yaalu app will undergo routine maintenance tonight from 2 AM - 3 AM.',
      time: 'Yesterday 10:15 AM',
      dateGroup: 'Yesterday',
      unread: false,
      color: 'bg-amber-500',
      iconName: 'information-circle',
    },
  ]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filteredNotifications = notifications.filter(
    (n) => activeTab === 'All' || n.type === activeTab
  );

  const todayList = filteredNotifications.filter((n) => n.dateGroup === 'Today');
  const yesterdayList = filteredNotifications.filter((n) => n.dateGroup === 'Yesterday');

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
            onPress={markAllAsRead}
            style={tw`bg-white/20 px-3 py-1.5 rounded-full border border-white/30`}>
            <Text style={tw`text-[11px] font-extrabold text-[#0B1044]`}>Mark Read</Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
          <Text style={tw`text-2xl font-black text-slate-900 mb-3`}>Notifications</Text>

          {/* Tabs Filter Row */}
          <View style={tw`flex-row gap-2 mb-5`}>
            {(['All', 'Requests', 'Payments', 'Alerts'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={tw`px-4 py-2 rounded-full border ${
                  activeTab === tab
                    ? 'bg-[#0B1044] border-[#0B1044]'
                    : 'bg-white border-slate-200'
                }`}>
                <Text
                  style={tw`text-xs font-black ${
                    activeTab === tab ? 'text-white' : 'text-slate-700'
                  }`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Today Group */}
          {todayList.length > 0 && (
            <View style={tw`mb-6`}>
              <Text style={tw`text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-1`}>
                TODAY
              </Text>
              <View style={tw`gap-3`}>
                {todayList.map((item) => (
                  <View
                    key={item.id}
                    style={tw`bg-white rounded-3xl p-4 border ${
                      item.unread ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200'
                    } flex-row gap-3.5 shadow-xs`}>
                    <View
                      style={tw`w-11 h-11 rounded-2xl ${item.color} items-center justify-center shadow-sm`}>
                      <Ionicons name={item.iconName as any} size={22} color="#FFFFFF" />
                    </View>
                    <View style={tw`flex-1 pr-2`}>
                      <View style={tw`flex-row justify-between items-center mb-1`}>
                        <Text style={tw`text-sm font-black text-slate-900`}>{item.title}</Text>
                        {item.unread && <View style={tw`w-2 h-2 rounded-full bg-blue-600`} />}
                      </View>
                      <Text style={tw`text-xs text-slate-600 leading-4.5`}>{item.description}</Text>
                      <Text style={tw`text-[10px] font-bold text-slate-400 mt-2`}>{item.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Yesterday Group */}
          {yesterdayList.length > 0 && (
            <View style={tw`mb-4`}>
              <Text style={tw`text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3 px-1`}>
                YESTERDAY
              </Text>
              <View style={tw`gap-3`}>
                {yesterdayList.map((item) => (
                  <View
                    key={item.id}
                    style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row gap-3.5 shadow-xs`}>
                    <View
                      style={tw`w-11 h-11 rounded-2xl ${item.color} items-center justify-center shadow-sm`}>
                      <Ionicons name={item.iconName as any} size={22} color="#FFFFFF" />
                    </View>
                    <View style={tw`flex-1 pr-2`}>
                      <Text style={tw`text-sm font-black text-slate-900 mb-1`}>{item.title}</Text>
                      <Text style={tw`text-xs text-slate-600 leading-4.5`}>{item.description}</Text>
                      <Text style={tw`text-[10px] font-bold text-slate-400 mt-2`}>{item.time}</Text>
                    </View>
                  </View>
                ))}
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

          <TouchableOpacity onPress={() => router.push('/orders' as any)} style={tw`items-center`}>
            <Ionicons name="cart-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/wallet' as any)} style={tw`items-center`}>
            <Ionicons name="wallet-outline" size={20} color="#0B1044" />
            <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={tw`items-center`}>
            <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
              <Ionicons name="notifications" size={18} color="#0B1044" />
              <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Notification</Text>
            </View>
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
