import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  StyleSheet,
  PanResponder,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';
import tw from '@/lib/tw';

const { width: SCREEN_W } = Dimensions.get('window');
const TRACK_W = SCREEN_W - 80;
const MIN_BID = 900;
const MAX_BID = 1200;
const TOTAL_SECONDS = 60; // Start at 1 min for better demo

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

/** Returns colour theme based on time remaining */
function getTheme(secs: number) {
  if (secs <= 10) return { ring: '#EF4444', glow: '#FCA5A5', bg: '#FFF5F5', text: '#DC2626', label: 'Critical!' };
  if (secs <= 20) return { ring: '#F97316', glow: '#FDBA74', bg: '#FFF7F0', text: '#EA580C', label: 'Hurry up!' };
  if (secs <= 40) return { ring: '#EAB308', glow: '#FDE68A', bg: '#FFFBEB', text: '#CA8A04', label: 'Ending soon' };
  return { ring: '#FFC72C', glow: '#FEF08A', bg: '#FFFDF5', text: '#D97706', label: 'Seconds left' };
}

/** Animated arc ring — 12 segments around a circle */
function ArcRing({ pct, color, size = 180 }: { pct: number; color: string; size?: number }) {
  const segments = 36;
  const filledCount = Math.round(pct * segments);
  const r = size / 2;

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / segments) * 360 - 90; // start from top
        const rad = (angle * Math.PI) / 180;
        const cx = r + (r - 8) * Math.cos(rad) - 3;
        const cy = r + (r - 8) * Math.sin(rad) - 3;
        const filled = i < filledCount;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: filled ? color : '#E2E8F0',
              opacity: filled ? 1 : 0.4,
            }}
          />
        );
      })}
    </View>
  );
}

export default function BidEndingSoonScreen() {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [bid, setBid] = useState(980);
  const [lowestBid, setLowestBid] = useState(960);
  const [driverCount, setDriverCount] = useState(4);
  const [position, setPosition] = useState(2);

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const digitScaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const lowestBidAnim = useRef(new Animated.Value(1)).current;

  const theme = getTheme(secondsLeft);
  const pct = secondsLeft / TOTAL_SECONDS;
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const isUrgent = secondsLeft <= 20;
  const isCritical = secondsLeft <= 10;

  // ─── Countdown ───
  useEffect(() => {
    if (secondsLeft <= 0) {
      // Time up → navigate to result
      router.replace('/bid-won' as any);
      return;
    }
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  // ─── Digit flip animation every second ───
  useEffect(() => {
    Animated.sequence([
      Animated.timing(digitScaleAnim, { toValue: 1.12, duration: 80, useNativeDriver: true }),
      Animated.timing(digitScaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [secondsLeft]);

  // ─── Pulse ring ───
  useEffect(() => {
    const speed = isCritical ? 300 : isUrgent ? 500 : 900;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: speed, useNativeDriver: true, easing: Easing.ease }),
        Animated.timing(pulseAnim, { toValue: 1, duration: speed, useNativeDriver: true, easing: Easing.ease }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isCritical, isUrgent]);

  // ─── Glow breathing ───
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.2, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ─── Shake at critical ───
  useEffect(() => {
    if (secondsLeft > 0 && secondsLeft % 5 === 0 && secondsLeft <= 20) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [secondsLeft]);

  // ─── Simulate dynamic bid competition ───
  useEffect(() => {
    const bidInterval = setInterval(() => {
      // Randomly another driver lowers their bid occasionally
      if (Math.random() < 0.25) {
        setLowestBid((prev) => {
          const newBid = Math.max(MIN_BID, prev - Math.round(Math.random() * 20));
          // Animate the lowest bid change
          Animated.sequence([
            Animated.timing(lowestBidAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
            Animated.timing(lowestBidAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
          ]).start();
          return newBid;
        });
        setPosition((prev) => Math.min(driverCount, prev + (Math.random() < 0.4 ? 1 : 0)));
      }
    }, 3000);
    return () => clearInterval(bidInterval);
  }, [driverCount]);

  // ─── Slider pan responder ───
  const sliderPct = (bid - MIN_BID) / (MAX_BID - MIN_BID);
  const thumbX = useRef(sliderPct * TRACK_W);
  const startX = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { startX.current = thumbX.current; },
      onPanResponderMove: (_, gs) => {
        const newX = clamp(startX.current + gs.dx, 0, TRACK_W);
        thumbX.current = newX;
        const raw = MIN_BID + (newX / TRACK_W) * (MAX_BID - MIN_BID);
        setBid(clamp(Math.round(raw / 10) * 10, MIN_BID, MAX_BID));
      },
    })
  ).current;

  const positionLabel = position === 1 ? '1st 🥇' : position === 2 ? '2nd 🥈' : position === 3 ? '3rd 🥉' : `${position}th`;
  const isWinning = position === 1;

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.bg }]} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor={theme.bg} />

      {/* ─── Header ─── */}
      <Animated.View style={[tw`items-center pt-4 pb-2`, { transform: [{ translateX: shakeAnim }] }]}>
        <Text style={tw`text-xl font-extrabold text-slate-900`}>Bid Ending Soon</Text>
        <View style={tw`flex-row items-center mt-1.5 gap-1.5`}>
          {/* Live dot */}
          <Animated.View style={[tw`w-2 h-2 rounded-full`, { backgroundColor: theme.ring, opacity: glowAnim }]} />
          <MaterialIcons name="bolt" size={13} color={theme.text} />
          <Text style={[tw`text-[11px] font-bold uppercase tracking-widest`, { color: theme.text }]}>
            Live Bidding
          </Text>
        </View>
      </Animated.View>

      {/* ─── Timer Ring ─── */}
      <View style={tw`items-center mt-5 mb-4`}>
        {/* Glow shadow behind ring */}
        <Animated.View
          style={[
            styles.glowRing,
            { borderColor: theme.glow, opacity: glowAnim, shadowColor: theme.ring },
          ]}
        />

        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          {/* Arc dot ring */}
          <View style={tw`absolute`}>
            <ArcRing pct={pct} color={theme.ring} size={196} />
          </View>

          {/* Inner circle */}
          <View style={[styles.innerCircle, { borderColor: theme.ring }]}>
            <View style={tw`flex-row items-center mb-0.5`}>
              <Feather name="clock" size={11} color={theme.text} style={tw`mr-1`} />
              <Text style={[tw`text-[10px] uppercase font-bold tracking-wider`, { color: theme.text }]}>
                Time Remaining
              </Text>
            </View>

            {/* Animated digit */}
            <Animated.Text
              style={[
                styles.timerText,
                { color: theme.text, transform: [{ scale: digitScaleAnim }] },
              ]}
            >
              {mm}:{ss}
            </Animated.Text>

            <View style={tw`flex-row items-center mt-1 gap-1`}>
              {isCritical
                ? <MaterialIcons name="warning" size={13} color="#EF4444" />
                : isUrgent
                ? <MaterialCommunityIcons name="fire" size={13} color={theme.text} />
                : <Ionicons name="time-outline" size={12} color={theme.text} />}
              <Text style={[tw`text-[11px] font-bold`, { color: theme.text }]}>
                {theme.label}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* ─── Bid Status Card ─── */}
      <View style={[tw`mx-5 bg-white rounded-3xl p-5 mb-5`, {
        borderWidth: 1.5, borderColor: theme.ring,
        shadowColor: theme.ring, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
      }]}>
        {/* Lowest bid row (dynamic) */}
        <View style={tw`flex-row items-center justify-between mb-3`}>
          <View style={tw`flex-row items-center gap-2`}>
            <View style={tw`w-8 h-8 rounded-full bg-emerald-100 items-center justify-center`}>
              <FontAwesome5 name="trophy" size={14} color="#10B981" />
            </View>
            <View>
              <Text style={tw`text-[10px] font-bold text-slate-400`}>Current Lowest</Text>
              <Animated.Text style={[tw`text-base font-extrabold text-emerald-600`, { transform: [{ scale: lowestBidAnim }] }]}>
                Rs. {lowestBid.toLocaleString()}
              </Animated.Text>
            </View>
          </View>

          <View style={tw`items-end`}>
            <Text style={tw`text-[10px] font-bold text-slate-400`}>Your Bid</Text>
            <Text style={tw`text-base font-extrabold text-slate-900`}>Rs. {bid.toLocaleString()}</Text>
          </View>
        </View>

        <View style={tw`h-[1px] bg-slate-100 mb-3`} />

        {/* Stats row */}
        <View style={tw`flex-row justify-between items-center`}>
          {/* Position badge */}
          <View style={[
            tw`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full`,
            { backgroundColor: isWinning ? '#D1FAE5' : '#FEF3C7' }
          ]}>
            <Ionicons
              name={isWinning ? 'checkmark-circle' : 'person'}
              size={14}
              color={isWinning ? '#059669' : '#D97706'}
            />
            <Text style={[tw`text-xs font-extrabold`, { color: isWinning ? '#059669' : '#D97706' }]}>
              {isWinning ? 'You\'re Winning!' : `You're ${positionLabel}`}
            </Text>
          </View>

          {/* Driver count */}
          <View style={tw`flex-row items-center gap-1`}>
            <Feather name="users" size={14} color="#64748B" />
            <Text style={tw`text-xs font-bold text-slate-500`}>{driverCount} drivers</Text>
          </View>
        </View>
      </View>

      {/* ─── Lower My Bid Button ─── */}
      <View style={tw`mx-5 mb-4`}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/place-bid' as any)}
          style={[
            tw`py-4 rounded-2xl flex-row items-center justify-center gap-2`,
            { backgroundColor: theme.ring, shadowColor: theme.ring, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 7 },
          ]}
        >
          <MaterialCommunityIcons name="gavel" size={20} color="#0B1044" />
          <Text style={tw`text-base font-extrabold text-slate-900`}>Lower My Bid</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Mini Slider ─── */}
      <View style={tw`mx-10 mb-2`}>
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <Text style={tw`text-[10px] font-bold text-slate-400`}>Rs. 900</Text>
          <Text style={[tw`text-[10px] font-bold`, { color: theme.text }]}>Rs. {bid.toLocaleString()}</Text>
          <Text style={tw`text-[10px] font-bold text-slate-400`}>Rs. 1,200</Text>
        </View>

        <View style={tw`h-2 bg-slate-200 rounded-full relative overflow-visible`}>
          <View style={[tw`h-2 rounded-full`, { width: `${sliderPct * 100}%`, backgroundColor: theme.ring }]} />
          <View
            style={[styles.miniThumb, { left: sliderPct * TRACK_W - 12, backgroundColor: theme.ring, borderColor: '#fff' }]}
            {...panResponder.panHandlers}
          />
        </View>
      </View>

      <Text style={tw`text-[11px] text-slate-400 text-center px-8 mt-2`}>
        Your bid must remain within the allowed range.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  glowRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 8,
    top: -12,
  },
  innerCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  timerText: {
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 46,
  },
  miniThumb: {
    position: 'absolute',
    top: -10,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});

