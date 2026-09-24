import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import tw from '@/lib/tw';

export default function BidSubmittedScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const myBid = params.bid ? Number(params.bid) : 980;
  const startingPrice = params.startingPrice ? Number(params.startingPrice) : 1000;
  const minBid = params.minBid ? Number(params.minBid) : 900;
  const maxBid = params.maxBid ? Number(params.maxBid) : 1200;

  const [secondsLeft, setSecondsLeft] = useState(
    params.secondsLeft ? Number(params.secondsLeft) : 105
  );

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');

  const handleChangeBid = () => {
    router.push({
      pathname: '/place-bid',
      params: {
        startingPrice: startingPrice.toString(),
        minBid: minBid.toString(),
        maxBid: maxBid.toString(),
        secondsLeft: secondsLeft.toString(),
      },
    } as any);
  };

  const handleHireDetails = () => {
    router.push({
      pathname: '/hire-details',
      params: {
        startingPrice: startingPrice.toString(),
        minBid: minBid.toString(),
        maxBid: maxBid.toString(),
        secondsLeft: secondsLeft.toString(),
      },
    } as any);
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      {/* Top Header */}
      <View style={tw`px-4 py-3 flex-row items-center justify-between bg-[#FFC72C] shadow-sm`}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`p-2 bg-white/40 rounded-full`}>
          <Ionicons name="home-outline" size={20} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-black text-[#0B1044]`}>Bid Submitted</Text>
        <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={tw`p-2 bg-white/40 rounded-full`}>
          <Feather name="bell" size={18} color="#0B1044" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={tw`px-5 pb-10 pt-3`}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Success Card */}
        <View style={tw`bg-white rounded-3xl p-6 items-center shadow-md border border-slate-100 mb-4`}>
          {/* Green check */}
          <View style={tw`w-16 h-16 rounded-full bg-emerald-500 items-center justify-center mb-3 shadow-lg`}>
            <Ionicons name="checkmark" size={34} color="#fff" />
          </View>

          <Text style={tw`text-3xl font-extrabold text-slate-900 mb-1`}>
            Rs. {myBid.toLocaleString()}
          </Text>
          <Text style={tw`text-xs font-semibold text-slate-400 mb-4`}>Your Current Bid</Text>

          <View style={tw`h-[1px] bg-slate-100 w-full mb-3`} />

          <View style={tw`flex-row justify-between w-full`}>
            <View>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Starting Price:</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>Rs. {startingPrice.toLocaleString()}</Text>
            </View>
            <View style={tw`items-end`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Allowed Range:</Text>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>
                Rs. {minBid.toLocaleString()} – Rs. {maxBid.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Live Running Timer + Drivers Card */}
        <View style={tw`bg-white rounded-3xl p-5 flex-row justify-between items-center shadow-sm border border-slate-100 mb-4`}>
          <View style={tw`flex-row items-center`}>
            <View style={[
              tw`w-12 h-12 rounded-2xl items-center justify-center mr-3`,
              secondsLeft < 30 ? tw`bg-red-50 border border-red-200` : tw`bg-amber-50 border border-amber-200`,
            ]}>
              <Feather name="clock" size={20} color={secondsLeft < 30 ? '#DC2626' : '#D97706'} />
            </View>
            <View>
              <Text style={[tw`text-2xl font-black`, secondsLeft < 30 ? tw`text-red-600` : tw`text-slate-900`]}>
                {mm}:{ss}
              </Text>
              <Text style={[tw`text-[10px] font-bold uppercase`, secondsLeft < 30 ? tw`text-red-500` : tw`text-slate-400`]}>
                {secondsLeft > 0 ? 'Remaining Time' : 'Bidding Ended'}
              </Text>
            </View>
          </View>

          <View style={tw`items-center`}>
            {/* Driver avatars */}
            <View style={tw`flex-row mb-1`}>
              {['#FFC72C', '#10B981', '#6366F1', '#F43F5E'].map((c, i) => (
                <View
                  key={i}
                  style={[
                    tw`w-6 h-6 rounded-full border-2 border-white items-center justify-center`,
                    { backgroundColor: c, marginLeft: i === 0 ? 0 : -6 },
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
        <View style={tw`bg-[#0B1044] rounded-3xl p-5 mb-4 overflow-hidden`}>
          <View style={tw`flex-row justify-between items-center mb-1`}>
            <Text style={tw`text-slate-400 text-xs font-bold uppercase`}>Your Position</Text>
            <View style={tw`bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 rounded-full`}>
              <Text style={tw`text-[10px] font-black text-emerald-300`}>COMPETITIVE BID</Text>
            </View>
          </View>
          <Text style={tw`text-3xl font-extrabold text-white mb-4`}>2nd Place</Text>

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
        <View style={tw`flex-row gap-3 mb-3`}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleChangeBid}
            style={tw`flex-1 py-3.5 rounded-2xl bg-white border-2 border-slate-900 items-center justify-center shadow-sm`}
          >
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Change Bid</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleHireDetails}
            style={tw`flex-1 py-3.5 rounded-2xl border-2 border-slate-900 items-center justify-center bg-slate-900 shadow-sm`}
          >
            <Text style={tw`text-sm font-extrabold text-white`}>Hire Details</Text>
          </TouchableOpacity>
        </View>

        {/* Simulation / Navigation Options */}
        <View style={tw`flex-row gap-2 mb-3`}>
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/bid-ending-soon', params: { secondsLeft: '20', bid: myBid.toString() } } as any)}
            style={tw`flex-1 py-2.5 rounded-xl bg-red-50 border border-red-200 items-center`}
          >
            <Text style={tw`text-xs font-black text-red-600`}>Ending Soon (20s)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/bid-won' as any)}
            style={tw`flex-1 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 items-center`}
          >
            <Text style={tw`text-xs font-black text-emerald-700`}>Simulate Won 🎉</Text>
          </TouchableOpacity>
        </View>

        <Text style={tw`text-[11px] text-slate-400 text-center leading-5 px-4`}>
          Your bid remains live until the countdown ends. The lowest valid bid wins the ride.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

