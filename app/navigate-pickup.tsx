import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import tw from 'twrnc';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MAP_H = SCREEN_H * 0.52;

/** A road strip drawn with absolute-positioned Views */
function Road({ style }: { style: object }) {
  return <View style={[tw`absolute bg-white opacity-80`, style]} />;
}

/** A city block */
function Block({ style }: { style: object }) {
  return <View style={[tw`absolute rounded-md bg-[#C8D8C8] opacity-70`, style]} />;
}

export default function NavigateToPickupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={tw`flex-1 bg-white`}>
      <RNStatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ─── Mock Map ─── */}
      <View style={[{ height: MAP_H }, tw`bg-[#DDE8DD] overflow-hidden`]}>

        {/* Ocean / sea left panel */}
        <View style={[tw`absolute bg-[#B8CFEA]`, { left: 0, top: 0, width: SCREEN_W * 0.28, height: MAP_H }]} />

        {/* Horizontal roads */}
        <Road style={{ left: 0, top: MAP_H * 0.28, width: SCREEN_W, height: 8, borderRadius: 2 }} />
        <Road style={{ left: 0, top: MAP_H * 0.52, width: SCREEN_W, height: 6, borderRadius: 2 }} />
        <Road style={{ left: 0, top: MAP_H * 0.72, width: SCREEN_W, height: 5, borderRadius: 2 }} />

        {/* Vertical roads */}
        <Road style={{ left: SCREEN_W * 0.38, top: 0, width: 8, height: MAP_H, borderRadius: 2 }} />
        <Road style={{ left: SCREEN_W * 0.58, top: 0, width: 6, height: MAP_H, borderRadius: 2 }} />
        <Road style={{ left: SCREEN_W * 0.72, top: 0, width: 5, height: MAP_H, borderRadius: 2 }} />

        {/* Diagonal coastal road */}
        <View
          style={[
            tw`absolute bg-white opacity-70`,
            {
              left: SCREEN_W * 0.25,
              top: 0,
              width: 7,
              height: MAP_H,
              borderRadius: 3,
              transform: [{ rotate: '4deg' }],
            },
          ]}
        />

        {/* City blocks */}
        <Block style={{ left: SCREEN_W * 0.42, top: MAP_H * 0.05, width: 50, height: 20 }} />
        <Block style={{ left: SCREEN_W * 0.62, top: MAP_H * 0.08, width: 60, height: 18 }} />
        <Block style={{ left: SCREEN_W * 0.62, top: MAP_H * 0.33, width: 55, height: 16 }} />
        <Block style={{ left: SCREEN_W * 0.42, top: MAP_H * 0.33, width: 12, height: 16 }} />
        <Block style={{ left: SCREEN_W * 0.42, top: MAP_H * 0.57, width: 12, height: 12 }} />
        <Block style={{ left: SCREEN_W * 0.62, top: MAP_H * 0.57, width: 55, height: 12 }} />
        <Block style={{ left: SCREEN_W * 0.75, top: MAP_H * 0.77, width: 40, height: 18 }} />
        <Block style={{ left: SCREEN_W * 0.42, top: MAP_H * 0.77, width: 12, height: 18 }} />

        {/* ─── Amber route line (series of rotated bars) ─── */}
        {/* Simulate a curved route from bottom-center up to pickup pin */}
        <View style={[styles.routeSeg, {
          left: SCREEN_W * 0.44, top: MAP_H * 0.62,
          height: MAP_H * 0.17, width: 7,
          transform: [{ rotate: '-5deg' }],
        }]} />
        <View style={[styles.routeSeg, {
          left: SCREEN_W * 0.43, top: MAP_H * 0.45,
          height: MAP_H * 0.18, width: 7,
          transform: [{ rotate: '-3deg' }],
        }]} />
        <View style={[styles.routeSeg, {
          left: SCREEN_W * 0.41, top: MAP_H * 0.27,
          height: MAP_H * 0.19, width: 7,
          transform: [{ rotate: '2deg' }],
        }]} />

        {/* ─── Car marker (bottom of route) ─── */}
        <View style={[tw`absolute items-center justify-center w-11 h-11 rounded-full bg-[#0B1044]`, {
          left: SCREEN_W * 0.44 - 22, top: MAP_H * 0.75,
          shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6,
          elevation: 8,
        }]}>
          <FontAwesome5 name="car-side" size={15} color="#FFC72C" />
        </View>
        {/* Pulse ring */}
        <View style={[tw`absolute rounded-full border-2 border-[#FFC72C] opacity-30`, {
          left: SCREEN_W * 0.44 - 30, top: MAP_H * 0.75 - 8,
          width: 58, height: 58,
        }]} />

        {/* ─── Pickup pin + callout ─── */}
        <View style={[tw`absolute items-center`, { left: SCREEN_W * 0.38, top: MAP_H * 0.1 }]}>
          <View style={tw`bg-[#FFC72C] px-3 py-1.5 rounded-xl shadow-lg mb-1`}>
            <Text style={tw`text-[11px] font-extrabold text-slate-900`}>Beginns (3.2 km)</Text>
          </View>
          <Ionicons name="location" size={28} color="#FFC72C" />
        </View>

        {/* Compass */}
        <View style={[tw`absolute right-4 bottom-4 w-10 h-10 rounded-full bg-white/95 items-center justify-center`, {
          shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3,
        }]}>
          <Feather name="compass" size={18} color="#475569" />
        </View>

        {/* ─── Top header overlay ─── */}
        <View style={[tw`absolute left-0 right-0 px-4 flex-row items-center`, { top: insets.top + 8 }]}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[tw`w-10 h-10 rounded-full bg-white items-center justify-center`, {
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 5, elevation: 4,
            }]}
          >
            <Ionicons name="arrow-back" size={20} color="#0B1044" />
          </TouchableOpacity>

          <View style={[tw`flex-1 mx-3 bg-white rounded-2xl px-4 py-2.5 flex-row items-center justify-center`, {
            shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
          }]}>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Navigate to Pickup</Text>
          </View>

          <TouchableOpacity
            style={[tw`w-10 h-10 rounded-full bg-white items-center justify-center`, {
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4, elevation: 3,
            }]}
          >
            <Feather name="maximize-2" size={16} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Bottom Sheet ─── */}
      <View style={tw`flex-1 bg-white px-5 pt-4 pb-6`}>
        {/* Handle */}
        <View style={tw`w-10 h-1 bg-slate-200 rounded-full self-center mb-4`} />

        {/* Winning bid + badge */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <Text style={tw`text-base font-extrabold text-slate-900`}>
            Winning Bid:{' '}
            <Text style={{ color: '#0B1044' }}>Rs. 960</Text>
          </Text>
          <View style={tw`bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200`}>
            <Text style={tw`text-[11px] font-extrabold text-emerald-700`}>Fixed Fare</Text>
          </View>
        </View>

        {/* Passenger + Pickup */}
        <View style={tw`gap-2.5 mb-5`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-7 h-7 rounded-full bg-slate-100 items-center justify-center mr-3`}>
              <Feather name="user" size={14} color="#64748B" />
            </View>
            <Text style={tw`text-sm text-slate-500`}>
              Passenger:{' '}
              <Text style={tw`font-bold text-slate-800`}>1 Passenger</Text>
            </Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-7 h-7 rounded-full bg-amber-100 items-center justify-center mr-3`}>
              <Ionicons name="location" size={14} color="#D97706" />
            </View>
            <Text style={tw`text-sm text-slate-500`}>
              Pickup:{' '}
              <Text style={tw`font-bold text-slate-800`}>Colombo City Center</Text>
            </Text>
          </View>
        </View>

        {/* Arrived CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[tw`bg-[#FFC72C] py-4 rounded-2xl flex-row items-center justify-center mb-3`, {
            shadowColor: '#FFC72C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
          }]}
        >
          <Text style={tw`text-base font-extrabold text-slate-900 mr-2`}>Arrived at Pickup</Text>
          <Ionicons name="arrow-forward" size={18} color="#0B1044" />
        </TouchableOpacity>

        {/* Contact */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={tw`py-3.5 rounded-2xl border-2 border-slate-200 flex-row items-center justify-center`}
        >
          <Feather name="phone" size={16} color="#475569" style={tw`mr-2`} />
          <Text style={tw`text-sm font-extrabold text-slate-700`}>Contact Passenger</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  routeSeg: {
    position: 'absolute',
    backgroundColor: '#FFC72C',
    borderRadius: 4,
  },
});
