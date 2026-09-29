import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from '@/lib/tw';

interface BottomNavProps {
  active?: 'dashboard' | 'orders' | 'wallet' | 'notifications' | 'profile' | string;
}

export default function BottomNav({ active = 'dashboard' }: BottomNavProps) {
  const router = useRouter();
  
  const tabs = [
    { key: 'dashboard', icon: 'home-outline', activeIcon: 'home', label: 'Home', route: '/dashboard' },
    { key: 'orders', icon: 'receipt-outline', activeIcon: 'receipt', label: 'Orders', route: '/orders' },
    { key: 'wallet', icon: 'wallet-outline', activeIcon: 'wallet', label: 'Wallet', route: '/wallet' },
    { key: 'notifications', icon: 'notifications-outline', activeIcon: 'notifications', label: 'Alerts', route: '/notifications' },
    { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile', route: '/profile' },
  ] as const;

  return (
    <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2 z-50`}>
      {tabs.map((t) => {
        const isActive = t.key === active;
        const iconName = isActive ? t.activeIcon : t.icon;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => router.push(t.route as any)}
            activeOpacity={0.8}
            style={tw`items-center`}>
            {isActive ? (
              <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
                <Ionicons name={iconName as any} size={18} color="#0B1044" />
                <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>{t.label}</Text>
              </View>
            ) : (
              <View style={tw`items-center`}>
                <Ionicons name={iconName as any} size={20} color="#0B1044" />
                <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>{t.label}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
