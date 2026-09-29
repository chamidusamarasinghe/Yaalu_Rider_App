import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import tw from '@/lib/tw';
import InteractiveMap from '@/components/InteractiveMap';
import { checkAndGetRiderLocation } from '@/lib/location';
import BottomNav from '@/components/BottomNav';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const MAP_H = SCREEN_H * 0.52;

export default function NavigateToPickupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    orderId?: string;
    pickup?: string;
    dropoff?: string;
    pickupLat?: string;
    pickupLng?: string;
    dropoffLat?: string;
    dropoffLng?: string;
    riderLat?: string;
    riderLng?: string;
    fare?: string;
  }>();

  const parseCoord = (val: any, fallback: number) => {
    if (val === undefined || val === null || val === '' || val === 'undefined' || val === 'null') return fallback;
    const num = parseFloat(val);
    return isNaN(num) ? fallback : num;
  };

  const pickupLat = parseCoord(params.pickupLat, 6.9271);
  const pickupLng = parseCoord(params.pickupLng, 79.8612);
  const dropoffLat = parseCoord(params.dropoffLat, 6.8412);
  const dropoffLng = parseCoord(params.dropoffLng, 79.9654);

  const [riderCoords, setRiderCoords] = React.useState<{ latitude: number; longitude: number }>({
    latitude: parseCoord(params.riderLat, 6.8412),
    longitude: parseCoord(params.riderLng, 79.9654),
  });

  React.useEffect(() => {
    if (params.riderLat && params.riderLng) {
      setRiderCoords({
        latitude: parseCoord(params.riderLat, 6.8412),
        longitude: parseCoord(params.riderLng, 79.9654),
      });
      return;
    }
    checkAndGetRiderLocation().then((res) => {
      if (res.success && res.coords) {
        setRiderCoords(res.coords);
      }
    }).catch(() => {});
  }, [params.riderLat, params.riderLng]);
  
  const pickupTitle = params.pickup || 'Pickup Location';
  const dropoffTitle = params.dropoff || 'Drop-off Location';
  const fareDisplay = params.fare ? `Rs. ${params.fare}` : 'Rs. 960';

  return (
    <View style={tw`flex-1 bg-white`}>
      <RNStatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* ─── Live Interactive Map ─── */}
      <View style={[{ height: MAP_H }, tw`bg-[#DDE8DD] overflow-hidden relative`]}>
        <InteractiveMap
          height={MAP_H}
          center={{ latitude: (pickupLat + riderCoords.latitude) / 2, longitude: (pickupLng + riderCoords.longitude) / 2 }}
          zoom={12}
          markers={[
            { id: 'rider-location', latitude: riderCoords.latitude, longitude: riderCoords.longitude, title: 'Rider Location', type: 'driver' },
            { id: 'pickup-shop', latitude: pickupLat, longitude: pickupLng, title: pickupTitle, type: 'pickup' },
            { id: 'dropoff-loc', latitude: dropoffLat, longitude: dropoffLng, title: dropoffTitle, type: 'drop' },
          ]}
          showRoute={true}
        />

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
      <View style={tw`flex-1 bg-white px-5 pt-4 pb-20 relative`}>
        {/* Handle */}
        <View style={tw`w-10 h-1 bg-slate-200 rounded-full self-center mb-4`} />

        {/* Winning bid / Fare + badge */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <Text style={tw`text-base font-extrabold text-slate-900`}>
            Order Fare:{' '}
            <Text style={{ color: '#0B1044' }}>{fareDisplay}</Text>
          </Text>
          <View style={tw`bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200`}>
            <Text style={tw`text-[11px] font-extrabold text-emerald-700`}>Accepted Trip</Text>
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
            <Text style={tw`text-sm text-slate-500 flex-1`} numberOfLines={1}>
              Pickup:{' '}
              <Text style={tw`font-bold text-slate-800`}>{pickupTitle}</Text>
            </Text>
          </View>
        </View>

        {/* Arrived CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/delivery/status' as any)}
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
          onPress={() => Alert.alert('Contact Passenger', 'Calling customer at +94 77 123 4567...')}
          style={tw`py-3.5 rounded-2xl border-2 border-slate-200 flex-row items-center justify-center`}
        >
          <Feather name="phone" size={16} color="#475569" style={tw`mr-2`} />
          <Text style={tw`text-sm font-extrabold text-slate-700`}>Contact Passenger</Text>
        </TouchableOpacity>
      </View>

      <BottomNav />
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

