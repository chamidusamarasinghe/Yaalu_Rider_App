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
import { Ionicons, Feather } from '@expo/vector-icons';
import tw from 'twrnc';

const MY_BID = 1050;
const MY_POSITION = 2;

export default function BidSubmittedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8FAFC]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        contentContainerStyle={tw`px-5 pb-10`}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Title */}
        <View style={tw`items-center pt-8 pb-4`}>
          <Text style={tw`text-xl font-extrabold text-slate-900`}>Bid Submitted</Text>
        </View>

        {/* Success Card */}
        <View style={tw`bg-white rounded-3xl p-6 items-center shadow-md border border-slate-100 mb-5`}>
          {/* Green check */}
          <View style={tw`w-16 h-16 rounded-full bg-emerald-500 items-center justify-center mb-4 shadow-lg`}>
            <Ionicons name="checkmark" size={34} color="#fff" />
          </View>

          <Text style={tw`text-3xl font-extrabold text-slate-900 mb-1`}>
            Rs. {MY_BID.toLocaleString()}
          </Text>
          <Text style={tw`text-xs font-semibold text-slate-400 mb-5`}>Your Current Bid</Text>

          <View style={tw`h-[1px] bg-slate-100 w-full mb-4`} />

          <View style={tw`flex-row justify-between w-full`}>
            <View>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Starting Price:</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>Rs. 1,000</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Allowed Range:</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>Rs. 900 – Rs. 1,200</Text>
            </View>
          </View>
        </View>

        {/* Timer + Drivers Card */}
        <View style={tw`bg-white rounded-3xl p-5 flex-row justify-between items-center shadow-sm border border-slate-100 mb-5`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-10 h-10 rounded-full bg-slate-50 border border-slate-200 items-center justify-center mr-3`}>
              <Feather name="clock" size={18} color="#64748B" />
            </View>
            <View>
              <Text style={tw`text-2xl font-extrabold text-slate-900`}>05:42</Text>
              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase`}>Remaining</Text>
            </View>
          </View>

          <View style={tw`items-center`}>
            {/* Driver avatars */}
            <View style={tw`flex-row mb-1`}>
              {[...Array(4)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    tw`w-6 h-6 rounded-full border-2 border-white items-center justify-center`,
                    { backgroundColor: ['#FFC72C', '#10B981', '#6366F1', '#F43F5E'][i], marginLeft: i === 0 ? 0 : -6 },
                  ]}
                >
                  <Ionicons name="person" size={12} color="#fff" />
                </View>
              ))}
            </View>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>4 Drivers</Text>
            <Text style={tw`text-[10px] font-semibold text-slate-400`}>Currently Bidding</Text>
          </View>
        </View>

        {/* Position Podium Card */}
        <View style={tw`bg-[#0B1044] rounded-3xl p-5 mb-5 overflow-hidden`}>
          <Text style={tw`text-slate-400 text-xs font-bold uppercase mb-1`}>Your Position:</Text>
          <Text style={tw`text-4xl font-extrabold text-white mb-5`}>2nd</Text>

          {/* Podium Visual */}
          <View style={tw`flex-row items-end justify-center`}>
            {/* 2nd place */}
            <View style={tw`items-center mr-2`}>
              <View style={tw`w-11 h-11 rounded-full bg-[#FFC72C] border-4 border-[#FFC72C] items-center justify-center mb-2 shadow-lg`}>
                <Ionicons name="person" size={20} color="#0B1044" />
              </View>
              <View style={tw`w-16 h-14 bg-[#FFC72C]/20 rounded-t-xl items-center justify-center border-2 border-[#FFC72C]`}>
                <Text style={tw`text-[#FFC72C] font-extrabold text-xl`}>2</Text>
              </View>
            </View>

            {/* 1st place - tallest */}
            <View style={tw`items-center mx-2`}>
              <View style={tw`w-11 h-11 rounded-full bg-slate-500 border-2 border-slate-400 items-center justify-center mb-2`}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={tw`w-16 h-20 bg-slate-600 rounded-t-xl items-center justify-center`}>
                <Text style={tw`text-white font-extrabold text-xl`}>1</Text>
              </View>
            </View>

            {/* 3rd place */}
            <View style={tw`items-center ml-2`}>
              <View style={tw`w-11 h-11 rounded-full bg-orange-400 border-2 border-orange-300 items-center justify-center mb-2`}>
                <Ionicons name="person" size={20} color="#fff" />
              </View>
              <View style={tw`w-16 h-10 bg-orange-500/20 rounded-t-xl items-center justify-center border border-orange-400`}>
                <Text style={tw`text-orange-400 font-extrabold text-xl`}>3</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={tw`flex-row gap-3 mb-4`}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/place-bid' as any)}
            style={tw`flex-1 py-4 rounded-2xl border-2 border-slate-900 items-center justify-center`}
          >
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Change Bid</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/hire-details' as any)}
            style={tw`flex-1 py-4 rounded-2xl border-2 border-slate-900 items-center justify-center`}
          >
            <Text style={tw`text-sm font-extrabold text-slate-900`}>View Hire Details</Text>
          </TouchableOpacity>
        </View>

        <Text style={tw`text-[11px] text-slate-400 text-center leading-5 px-4`}>
          Your bid remains active until the bidding timer ends or you change it.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
