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
import tw from '@/lib/tw';

const MY_POSITION = 2;

const BIDDERS = [
  { rank: 1, name: 'Driver', bid: 950, isMe: false },
  { rank: 2, name: 'You', bid: 980, isMe: true },
  { rank: 3, name: 'Driver', bid: 1020, isMe: false },
  { rank: 4, name: 'Driver', bid: 1100, isMe: false },
  { rank: 5, name: 'Driver', bid: 1150, isMe: false },
];

const LOWEST_BID = 950;

export default function LiveBidsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      {/* Header */}
      <View style={tw`bg-[#FFC72C] px-5 py-4 items-center`}>
        <Text style={tw`text-2xl font-black text-[#0B1044] mb-1`}>Live Bids</Text>
        <View style={tw`flex-row items-center bg-[#0B1044]/10 px-3 py-1 rounded-full`}>
          <Feather name="clock" size={12} color="#0B1044" style={tw`mr-1`} />
          <Text style={tw`text-xs font-bold text-[#0B1044]`}>05:12 Remaining</Text>
        </View>
      </View>

      <View style={tw`flex-1 bg-[#F8FAFC] rounded-t-3xl pt-5`}>
        <ScrollView
          contentContainerStyle={tw`px-4 pb-40`}
          showsVerticalScrollIndicator={false}
        >
        {/* Bidder rows */}
        <View style={tw`gap-3`}>
          {BIDDERS.map((bidder) => (
            <View
              key={bidder.rank}
              style={[
                tw`flex-row items-center px-4 py-4 rounded-2xl`,
                bidder.isMe
                  ? tw`bg-amber-50 border-2 border-[#FFC72C]`
                  : tw`bg-white border border-slate-100 shadow-sm`,
              ]}
            >
              {/* Rank number */}
              <Text
                style={[
                  tw`text-base font-extrabold w-7`,
                  bidder.isMe ? tw`text-amber-600` : tw`text-slate-400`,
                ]}
              >
                {bidder.rank}
              </Text>

              {/* Avatar */}
              <View
                style={[
                  tw`w-10 h-10 rounded-full items-center justify-center mr-3`,
                  bidder.isMe ? tw`bg-[#FFC72C]` : tw`bg-slate-100`,
                ]}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color={bidder.isMe ? '#0B1044' : '#94A3B8'}
                />
              </View>

              {/* Name + badge */}
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center`}>
                  <Text
                    style={[
                      tw`text-sm font-extrabold mr-2`,
                      bidder.isMe ? tw`text-slate-900` : tw`text-slate-700`,
                    ]}
                  >
                    {bidder.name}
                  </Text>
                  {bidder.isMe && (
                    <View style={tw`bg-amber-400 px-2 py-0.5 rounded-full`}>
                      <Text style={tw`text-[9px] font-extrabold text-slate-900 uppercase`}>
                        Rank {bidder.rank}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Bid amount */}
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-slate-300 mr-2`}>—</Text>
                <Text
                  style={[
                    tw`text-sm font-extrabold`,
                    bidder.rank === 1
                      ? tw`text-emerald-600`
                      : bidder.isMe
                      ? tw`text-slate-900`
                      : tw`text-slate-600`,
                  ]}
                >
                  Rs. {bidder.bid.toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Fixed Section */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 pt-4 pb-6 px-5`}>
        {/* Current lowest bid info */}
        <View style={tw`items-center mb-3`}>
          <Text style={tw`text-base font-extrabold text-slate-900`}>
            Current Lowest Bid: Rs. {LOWEST_BID.toLocaleString()}
          </Text>
          <Text style={tw`text-xs text-slate-500 mt-0.5`}>
            You're currently{' '}
            <Text style={tw`font-extrabold text-slate-800`}>2nd</Text>
          </Text>
        </View>

        {/* Row of action buttons */}
        <View style={tw`flex-row gap-3 mb-3`}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/place-bid' as any)}
            style={tw`flex-1 bg-[#FFC72C] py-3.5 rounded-2xl flex-row items-center justify-center shadow-md`}
          >
            <MaterialCommunityIcons name="pencil" size={16} color="#0B1044" style={tw`mr-1.5`} />
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Change My Bid</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/bid-ending-soon' as any)}
            style={tw`flex-1 bg-red-500 py-3.5 rounded-2xl flex-row items-center justify-center shadow-md`}
          >
            <Feather name="clock" size={15} color="#fff" style={tw`mr-1.5`} />
            <Text style={tw`text-sm font-extrabold text-white`}>Ending Soon</Text>
          </TouchableOpacity>
        </View>

        {/* Demo nav to result screens */}
        <View style={tw`flex-row gap-3`}>
          <TouchableOpacity
            onPress={() => router.push('/bid-won' as any)}
            style={tw`flex-1 py-2.5 rounded-xl border border-emerald-400 items-center`}
          >
            <Text style={tw`text-xs font-bold text-emerald-600`}>→ Won</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/bid-lost' as any)}
            style={tw`flex-1 py-2.5 rounded-xl border border-red-300 items-center`}
          >
            <Text style={tw`text-xs font-bold text-red-500`}>→ Lost</Text>
          </TouchableOpacity>
        </View>

        <Text style={tw`text-[11px] text-slate-400 text-center mt-2`}>
          Lowest valid bid wins when the timer reaches zero.
        </Text>
      </View>
      </View>
    </SafeAreaView>
  );
}


