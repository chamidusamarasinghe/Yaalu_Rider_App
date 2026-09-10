import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import tw from '@/lib/tw';

type TabType = 'All' | 'Won' | 'Lost';

const ALL_BIDS = [
  {
    id: '#1024',
    result: 'Lost' as const,
    winningBid: 960,
    yourBid: 980,
    date: 'Today',
  },
  {
    id: '#1023',
    result: 'Won' as const,
    winningBid: 1050,
    yourBid: 1050,
    date: 'Today',
  },
  {
    id: '#1022',
    result: 'Lost' as const,
    winningBid: 900,
    yourBid: 920,
    date: 'Yesterday',
  },
  {
    id: '#1021',
    result: 'Won' as const,
    winningBid: 1100,
    yourBid: 1100,
    date: 'Yesterday',
  },
  {
    id: '#1020',
    result: 'Lost' as const,
    winningBid: 850,
    yourBid: 870,
    date: '2 days ago',
  },
];

function ResultBadge({ result }: { result: 'Won' | 'Lost' }) {
  const isWon = result === 'Won';
  return (
    <View
      style={[
        tw`px-2.5 py-1 rounded-full`,
        isWon ? tw`bg-emerald-100` : tw`bg-red-100`,
      ]}
    >
      <Text
        style={[
          tw`text-[10px] font-extrabold`,
          isWon ? tw`text-emerald-700` : tw`text-red-600`,
        ]}
      >
        {result}
      </Text>
    </View>
  );
}

export default function BidHistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('All');

  const totalBids = ALL_BIDS.length;
  const wins = ALL_BIDS.filter((b) => b.result === 'Won').length;
  const winRate = Math.round((wins / totalBids) * 100);

  const filtered =
    activeTab === 'All'
      ? ALL_BIDS
      : ALL_BIDS.filter((b) => b.result === activeTab);

  const tabs: TabType[] = ['All', 'Won', 'Lost'];

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      {/* Header */}
      <View style={tw`bg-[#FFC72C] px-5 pt-4 pb-3 items-center shadow-xs`}>
        <Text style={tw`text-2xl font-black text-[#0B1044]`}>Bid History</Text>
      </View>

      {/* Stats Row */}
      <View style={tw`flex-row items-center justify-around px-5 pt-4 pb-5`}>
        {/* Total Bids */}
        <View style={tw`items-center`}>
          <Text style={tw`text-3xl font-extrabold text-slate-900`}>{totalBids}</Text>
          <Text style={tw`text-[11px] font-semibold text-slate-400 mt-0.5`}>Total Bids</Text>
        </View>

        <View style={tw`w-[1px] h-10 bg-slate-200`} />

        {/* Wins */}
        <View style={tw`items-center`}>
          <Text style={tw`text-3xl font-extrabold text-slate-900`}>{wins}</Text>
          <Text style={tw`text-[11px] font-semibold text-slate-400 mt-0.5`}>Wins</Text>
        </View>

        <View style={tw`w-[1px] h-10 bg-slate-200`} />

        {/* Win Rate */}
        <View style={tw`items-center`}>
          <Text style={tw`text-3xl font-extrabold text-emerald-500`}>{winRate}%</Text>
          <Text style={tw`text-[11px] font-semibold text-slate-400 mt-0.5`}>Win Rate</Text>
        </View>
      </View>

      {/* Tab Bar */}
      <View style={tw`mx-5 mb-4`}>
        <View style={tw`flex-row bg-slate-200 rounded-xl p-1`}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                tw`flex-1 py-2.5 rounded-lg items-center`,
                activeTab === tab ? tw`bg-[#FFC72C] shadow-sm` : {},
              ]}
            >
              <Text
                style={[
                  tw`text-xs font-bold`,
                  activeTab === tab ? tw`text-slate-900` : tw`text-slate-500`,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={tw`px-5 pb-10 gap-4`}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((bid) => {
          const isWon = bid.result === 'Won';
          return (
            <View
              key={bid.id}
              style={[
                tw`bg-white rounded-2xl p-5`,
                isWon
                  ? tw`border-2 border-emerald-400`
                  : tw`border border-slate-100`,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.06,
                  shadowRadius: 6,
                  elevation: 2,
                },
              ]}
            >
              {/* Row 1: Hire ID + badge */}
              <View style={tw`flex-row items-center justify-between mb-3`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-base font-extrabold text-slate-900 mr-2`}>
                    Hire {bid.id}
                  </Text>
                  {isWon && (
                    <Ionicons name="star" size={14} color="#FFC72C" />
                  )}
                </View>
                <ResultBadge result={bid.result} />
              </View>

              {/* Divider */}
              <View style={tw`h-[1px] bg-slate-100 mb-3`} />

              {/* Row 2: Winning bid */}
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-[11px] font-semibold text-slate-400`}>Winning Bid</Text>
                <Text
                  style={[
                    tw`text-sm font-extrabold`,
                    isWon ? tw`text-emerald-600` : tw`text-slate-700`,
                  ]}
                >
                  Rs. {bid.winningBid.toLocaleString()}
                </Text>
              </View>

              {/* Row 3: Your bid */}
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-[11px] font-semibold text-slate-400`}>Your Bid</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>
                  Rs. {bid.yourBid.toLocaleString()}
                </Text>
              </View>

              {/* Row 4: Date */}
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-[11px] font-semibold text-slate-400`}>Date</Text>
                <Text style={tw`text-[11px] font-semibold text-slate-500`}>{bid.date}</Text>
              </View>
            </View>
          );
        })}

        {filtered.length === 0 && (
          <View style={tw`items-center py-16`}>
            <Feather name="inbox" size={40} color="#CBD5E1" style={tw`mb-3`} />
            <Text style={tw`text-slate-400 font-semibold`}>No {activeTab.toLowerCase()} bids yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

