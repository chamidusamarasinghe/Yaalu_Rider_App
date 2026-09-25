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

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Requests' | 'Alerts'>('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res: any = await riderApi.getNotifications();
      if (Array.isArray(res)) {
        setNotifications(res);
      } else {
        setNotifications([]);
      }
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const filteredNotifications = notifications.filter(
    (n) => activeTab === 'All' || n.type === activeTab
  );

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
            <Text style={tw`text-xl font-extrabold text-[#0B1044]`}>System Notifications</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={tw`flex-row gap-2 px-4 py-3 bg-white border-b border-slate-200`}>
          {(['All', 'Requests', 'Alerts'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                tw`px-4 py-1.5 rounded-full border shadow-sm`,
                activeTab === tab
                  ? tw`bg-[#0B1044] border-[#0B1044]`
                  : tw`bg-slate-100 border-slate-200`,
              ]}>
              <Text
                style={tw`text-xs font-bold ${
                  activeTab === tab ? 'text-[#FFC72C]' : 'text-slate-600'
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
              <Text style={tw`text-xs font-semibold text-slate-500 mt-2`}>Loading alerts...</Text>
            </View>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <View
                key={item.id}
                style={tw`bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-3.5 flex-row items-start gap-3.5`}>
                <View style={tw`w-10 h-10 rounded-2xl bg-amber-100 items-center justify-center mt-0.5`}>
                  <Ionicons name={(item.iconName || 'notifications-outline') as any} size={20} color="#0B1044" />
                </View>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row justify-between items-center mb-1`}>
                    <Text style={tw`text-sm font-black text-slate-900`}>{item.title}</Text>
                    <Text style={tw`text-[10px] font-semibold text-slate-400`}>{item.time}</Text>
                  </View>
                  <Text style={tw`text-xs text-slate-600 font-medium leading-4.5`}>{item.description}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={tw`bg-white rounded-3xl p-8 border border-slate-200 items-center justify-center my-6`}>
              <Ionicons name="notifications-off-outline" size={36} color="#CBD5E1" />
              <Text style={tw`text-base font-black text-slate-900 text-center mt-2`}>No Notifications</Text>
              <Text style={tw`text-xs font-semibold text-slate-500 text-center mt-1`}>
                You have no new alerts in this category.
              </Text>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
