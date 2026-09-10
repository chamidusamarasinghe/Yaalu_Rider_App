import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import tw from 'twrnc';

const { width: SCREEN_W } = Dimensions.get('window');
const TRACK_PADDING = 20;
const TRACK_W = SCREEN_W - TRACK_PADDING * 2 - 40;

const MIN_BID = 900;
const MAX_BID = 1200;
const STARTING_PRICE = 1000;

function clamp(val: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, val));
}

export default function PlaceBidScreen() {
  const router = useRouter();
  const [bid, setBid] = useState(1050);

  const pctFromStart = (((bid - STARTING_PRICE) / STARTING_PRICE) * 100).toFixed(1);
  const isRecommended = bid >= STARTING_PRICE * 1.04 && bid <= STARTING_PRICE * 1.06;

  const increment = () => setBid((v) => clamp(v + 10, MIN_BID, MAX_BID));
  const decrement = () => setBid((v) => clamp(v - 10, MIN_BID, MAX_BID));

  // slider
  const sliderPct = (bid - MIN_BID) / (MAX_BID - MIN_BID); // 0-1
  const thumbX = useRef(sliderPct * TRACK_W);
  const startX = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (_, gs) => {
        startX.current = thumbX.current;
      },
      onPanResponderMove: (_, gs) => {
        const newX = clamp(startX.current + gs.dx, 0, TRACK_W);
        thumbX.current = newX;
        const raw = MIN_BID + (newX / TRACK_W) * (MAX_BID - MIN_BID);
        const snapped = Math.round(raw / 10) * 10;
        setBid(clamp(snapped, MIN_BID, MAX_BID));
      },
    })
  ).current;

  const ringColor = bid <= STARTING_PRICE ? '#10B981' : '#F59E0B';
  const badgeBg = bid <= STARTING_PRICE ? '#D1FAE5' : '#FEF3C7';
  const badgeText = bid <= STARTING_PRICE ? '#065F46' : '#92400E';

  return (
    <SafeAreaView style={tw`flex-1 bg-white`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={tw`px-5 pt-3 pb-2 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="close" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-base font-extrabold text-slate-900`}>Place Your Bid</Text>
        <TouchableOpacity style={tw`p-1`}>
          <Feather name="info" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={tw`px-5 pb-10`}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Starting Price */}
        <View style={tw`items-center mt-4 mb-2`}>
          <Text style={tw`text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1`}>
            Starting Price
          </Text>
          <Text style={tw`text-3xl font-extrabold text-slate-900`}>Rs. 1,000</Text>
          <View style={tw`bg-amber-100 px-3 py-1 rounded-full mt-2 flex-row items-center`}>
            <Ionicons name="flash" size={11} color="#D97706" style={tw`mr-1`} />
            <Text style={tw`text-[11px] font-extrabold text-amber-700`}>
              Bid Range: Rs. 900 – Rs. 1,200
            </Text>
          </View>
        </View>

        {/* Circular Bid Display */}
        <View style={tw`items-center mt-4 mb-6`}>
          <View style={[styles.circle, { borderColor: ringColor }]}>
            <Text style={tw`text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1`}>
              Current Bid
            </Text>
            <View style={tw`flex-row items-center mb-2`}>
              {/* Minus button */}
              <TouchableOpacity
                onPress={decrement}
                style={tw`w-9 h-9 rounded-full bg-slate-100 items-center justify-center mr-4`}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={22} color="#475569" />
              </TouchableOpacity>

              <Text style={[tw`font-extrabold`, { fontSize: 19, color: '#0B1044' }]}>
                Rs. {bid.toLocaleString()}
              </Text>

              {/* Plus button */}
              <TouchableOpacity
                onPress={increment}
                style={[tw`w-9 h-9 rounded-full items-center justify-center ml-4`, { backgroundColor: ringColor }]}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Badge */}
            <View style={[tw`px-3 py-1 rounded-full`, { backgroundColor: badgeBg }]}>
              <Text style={[tw`text-[11px] font-extrabold`, { color: badgeText }]}>
                {Number(pctFromStart) > 0 ? '+' : ''}
                {pctFromStart}%{' '}
                {isRecommended ? 'Recommended' : bid < STARTING_PRICE ? 'Below Start' : 'Above Start'}
              </Text>
            </View>
          </View>
        </View>

        {/* Custom Slider */}
        <View style={tw`px-5 mb-2`}>
          <View
            style={[styles.trackContainer]}
          >
            {/* Track background */}
            <View style={styles.track}>
              {/* Filled portion */}
              <View
                style={[
                  styles.trackFill,
                  {
                    width: `${sliderPct * 100}%`,
                    backgroundColor: ringColor,
                  },
                ]}
              />
              {/* Thumb */}
              <View
                style={[
                  styles.thumb,
                  {
                    left: sliderPct * TRACK_W - 12,
                    backgroundColor: ringColor,
                  },
                ]}
                {...panResponder.panHandlers}
              />
            </View>
          </View>

          {/* Labels */}
          <View style={tw`flex-row justify-between mt-3`}>
            <View style={tw`items-center`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Minimum</Text>
              <Text style={tw`text-xs font-extrabold text-slate-700`}>Rs. 900</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Starting Price</Text>
              <Text style={tw`text-xs font-extrabold text-slate-700`}>Rs. 1,000</Text>
            </View>
            <View style={tw`items-center`}>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Maximum</Text>
              <Text style={tw`text-xs font-extrabold text-slate-700`}>Rs. 1,200</Text>
            </View>
          </View>
        </View>

        {/* Info text */}
        <Text style={tw`text-[11px] text-slate-500 text-center leading-5 mt-3 px-4`}>
          You can bid up to{' '}
          <Text style={tw`font-bold text-slate-700`}>10% below</Text> or{' '}
          <Text style={tw`font-bold text-slate-700`}>20% above</Text> the starting price.
        </Text>

        <View style={tw`h-6`} />

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/bid-submitted' as any)}
          style={tw`bg-[#FFC72C] py-4 rounded-2xl flex-row items-center justify-center shadow-md`}
        >
          <Text style={tw`text-base font-extrabold text-slate-900 mr-2`}>Submit Bid</Text>
          <Ionicons name="arrow-forward" size={18} color="#0B1044" />
        </TouchableOpacity>

        <Text style={tw`text-[11px] text-slate-400 text-center mt-3`}>
          You can change your bid while bidding is active.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  trackContainer: {
    height: 36,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    position: 'relative',
    overflow: 'visible',
  },
  trackFill: {
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    top: -10,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});
