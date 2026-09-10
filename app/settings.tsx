import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function SettingsScreen() {
  const router = useRouter();

  // App Language State
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Sinhala' | 'Tamil'>('English');

  // Notifications State
  const [deliveryRequests, setDeliveryRequests] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of Yaalu Rider?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => router.push('/login'),
      },
    ]);
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
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Settings</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
        {/* Profile Quick Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/profile' as any)}
          style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center justify-between shadow-xs mb-6`}>
          <View style={tw`flex-row items-center gap-3.5`}>
            <View style={tw`w-12 h-12 rounded-2xl overflow-hidden bg-slate-200 border border-slate-100`}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
            <View>
              <Text style={tw`text-lg font-black text-slate-900`}>Harsha!</Text>
              <Text style={tw`text-xs font-extrabold text-blue-600 mt-0.5`}>View Profile</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        {/* SECTION 1: APP LANGUAGE */}
        <Text style={tw`text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 px-1`}>
          APP LANGUAGE
        </Text>
        <View style={tw`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-6`}>
          {/* English */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedLanguage('English')}
            style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="globe-outline" size={22} color="#2563EB" />
              <Text style={tw`text-base font-bold text-slate-900`}>English</Text>
            </View>
            <View
              style={tw`w-6 h-6 rounded-full border-2 border-blue-600 items-center justify-center ${
                selectedLanguage === 'English' ? 'bg-blue-600' : 'bg-white'
              }`}>
              {selectedLanguage === 'English' && (
                <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
              )}
            </View>
          </TouchableOpacity>

          {/* Sinhala */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedLanguage('Sinhala')}
            style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="globe-outline" size={22} color="#2563EB" />
              <Text style={tw`text-base font-bold text-slate-900`}>Sinhala</Text>
            </View>
            <View
              style={tw`w-6 h-6 rounded-full border-2 ${
                selectedLanguage === 'Sinhala' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
              } items-center justify-center`}>
              {selectedLanguage === 'Sinhala' && (
                <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
              )}
            </View>
          </TouchableOpacity>

          {/* Tamil */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedLanguage('Tamil')}
            style={tw`p-4 flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="globe-outline" size={22} color="#2563EB" />
              <Text style={tw`text-base font-bold text-slate-900`}>Tamil</Text>
            </View>
            <View
              style={tw`w-6 h-6 rounded-full border-2 ${
                selectedLanguage === 'Tamil' ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'
              } items-center justify-center`}>
              {selectedLanguage === 'Tamil' && (
                <View style={tw`w-2.5 h-2.5 rounded-full bg-white`} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* SECTION 2: NOTIFICATIONS */}
        <Text style={tw`text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 px-1`}>
          NOTIFICATIONS
        </Text>
        <View style={tw`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-6`}>
          {/* Delivery Requests */}
          <View style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-1 pr-3`}>
              <Text style={tw`text-base font-extrabold text-slate-900`}>Delivery Requests</Text>
              <Text style={tw`text-xs text-slate-400 mt-0.5`}>Instant alerts for new orders</Text>
            </View>
            <Switch
              value={deliveryRequests}
              onValueChange={setDeliveryRequests}
              trackColor={{ false: '#CBD5E1', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Payment Alerts */}
          <View style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-1 pr-3`}>
              <Text style={tw`text-base font-extrabold text-slate-900`}>Payment Alerts</Text>
              <Text style={tw`text-xs text-slate-400 mt-0.5`}>Updates on earnings & withdrawals</Text>
            </View>
            <Switch
              value={paymentAlerts}
              onValueChange={setPaymentAlerts}
              trackColor={{ false: '#CBD5E1', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* System Updates */}
          <View style={tw`p-4 flex-row items-center justify-between`}>
            <View style={tw`flex-1 pr-3`}>
              <Text style={tw`text-base font-extrabold text-slate-900`}>System Updates</Text>
              <Text style={tw`text-xs text-slate-400 mt-0.5`}>App improvements and announcements</Text>
            </View>
            <Switch
              value={systemUpdates}
              onValueChange={setSystemUpdates}
              trackColor={{ false: '#CBD5E1', true: '#3B82F6' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* SECTION 3: ACCOUNT */}
        <Text style={tw`text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 px-1`}>
          ACCOUNT
        </Text>
        <View style={tw`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs mb-6`}>
          {/* Change Password */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Change Password', 'Enter your current password to reset.')}
            style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="lock-closed-outline" size={20} color="#475569" />
              <Text style={tw`text-base font-bold text-slate-900`}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => Alert.alert('Privacy Policy', 'Opening Yaalu Rider terms and privacy statement...')}
            style={tw`p-4 flex-row items-center justify-between border-b border-slate-100`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#475569" />
              <Text style={tw`text-base font-bold text-slate-900`}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleLogout}
            style={tw`p-4 flex-row items-center justify-between`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <Ionicons name="log-out-outline" size={20} color="#DC2626" />
              <Text style={tw`text-base font-extrabold text-red-600`}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
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

