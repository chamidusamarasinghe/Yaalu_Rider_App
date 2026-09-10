import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function BidLostScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FAFAFA]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />

      <ScrollView
        contentContainerStyle={tw`px-5 pb-10`}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Warning Icon + Title */}
        <View style={tw`items-center pt-12 mb-8`}>
          <View style={tw`flex-row items-center mb-5`}>
            <Text style={{ fontSize: 32, marginRight: 6 }}>⚠️</Text>
            <Text style={{ fontSize: 32 }}>⚠️</Text>
          </View>
          <Text style={tw`text-2xl font-extrabold text-slate-900 text-center leading-8`}>
            Hire Awarded to{'\n'}Another Driver
          </Text>
        </View>

        {/* Info Cards */}
        <View style={tw`gap-4 mb-8`}>
          {/* Winning Bid */}
          <View style={tw`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <Text style={tw`text-xs font-bold text-slate-400 mb-2`}>Winning Bid:</Text>
            <Text style={tw`text-3xl font-extrabold text-slate-900`}>Rs. 940</Text>
          </View>

          {/* Your Bid */}
          <View style={tw`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <Text style={tw`text-xs font-bold text-slate-400 mb-2`}>Your Bid:</Text>
            <Text style={tw`text-3xl font-extrabold text-slate-900`}>Rs. 980</Text>
          </View>

          {/* Explanation */}
          <View style={tw`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex-row items-start`}>
            <View style={tw`w-9 h-9 rounded-full bg-amber-50 border border-amber-200 items-center justify-center mr-4 mt-0.5`}>
              <Feather name="settings" size={16} color="#D97706" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm text-slate-600 leading-5`}>
                Another driver placed a{' '}
                <Text style={tw`font-extrabold text-slate-900`}>lower</Text> valid bid.
              </Text>
              <View style={tw`flex-row items-center mt-2`}>
                <View style={tw`w-5 h-5 rounded-full bg-amber-400 items-center justify-center`}>
                  <Ionicons name="diamond" size={11} color="#0B1044" />
                </View>
              </View>
            </View>
          </View>

          {/* Starting Price */}
          <View style={tw`bg-white rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <Text style={tw`text-xs font-bold text-slate-400 mb-2`}>Starting Price:</Text>
            <Text style={tw`text-3xl font-extrabold text-slate-900`}>Rs. 1,000</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/new-requests' as any)}
          style={tw`bg-[#FFC72C] py-4 rounded-2xl flex-row items-center justify-center shadow-md mb-3`}
        >
          <Feather name="search" size={18} color="#0B1044" style={tw`mr-2`} />
          <Text style={tw`text-base font-extrabold text-slate-900`}>Find New Hires</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/bid-history' as any)}
          style={tw`py-4 rounded-2xl border-2 border-slate-200 flex-row items-center justify-center`}
        >
          <Feather name="clock" size={16} color="#475569" style={tw`mr-2`} />
          <Text style={tw`text-sm font-extrabold text-slate-700`}>View Bid History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
