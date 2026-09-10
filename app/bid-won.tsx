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
import { Ionicons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from '@/lib/tw';

export default function BidWonScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <ScrollView
        contentContainerStyle={tw`px-5 pb-12`}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Title */}
        <View style={tw`items-center pt-10 mb-6`}>
          <Text style={tw`text-2xl font-extrabold text-slate-900`}>You Won the Hire</Text>
        </View>

        {/* Win Card */}
        <View style={tw`bg-[#FFFBEA] rounded-3xl p-6 items-center shadow-md border border-amber-200 mb-6`}>
          {/* Green circle tick */}
          <View style={tw`w-20 h-20 rounded-full bg-emerald-500 items-center justify-center mb-5 shadow-lg`}>
            <Ionicons name="checkmark" size={42} color="#fff" />
          </View>

          <Text style={tw`text-xs font-bold text-amber-600 uppercase tracking-widest mb-1`}>
            Winning Bid
          </Text>
          <Text style={tw`text-4xl font-extrabold text-slate-900 mb-1`}>Rs. 960</Text>
          <Text style={tw`text-xs font-semibold text-slate-400 mb-3`}>
            Starting Price: Rs. 1,000
          </Text>

          {/* Badge */}
          <View style={tw`bg-amber-400 px-4 py-1.5 rounded-full`}>
            <Text style={tw`text-[11px] font-extrabold text-slate-900`}>
              Your bid was the lowest valid bid.
            </Text>
          </View>
        </View>

        {/* Ride Details Card */}
        <View style={tw`bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-5`}>
          {/* Pickup */}
          <View style={tw`flex-row items-center py-3 border-b border-slate-100`}>
            <View style={tw`w-9 h-9 rounded-full bg-emerald-50 items-center justify-center mr-4`}>
              <Ionicons name="location" size={18} color="#10B981" />
            </View>
            <Text style={tw`text-sm font-semibold text-slate-700`}>Colombo Fort Railway Station</Text>
          </View>

          {/* Dropoff */}
          <View style={tw`flex-row items-center py-3 border-b border-slate-100`}>
            <View style={tw`w-9 h-9 rounded-full bg-red-50 items-center justify-center mr-4`}>
              <FontAwesome5 name="car-side" size={15} color="#EF4444" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-sm font-semibold text-slate-700`}>
                Bandaranaike International Airport (CMB)
              </Text>
            </View>
          </View>

          {/* Passengers */}
          <View style={tw`flex-row items-center py-3 border-b border-slate-100`}>
            <View style={tw`w-9 h-9 rounded-full bg-blue-50 items-center justify-center mr-4`}>
              <Feather name="users" size={16} color="#2563EB" />
            </View>
            <Text style={tw`text-sm font-semibold text-slate-700`}>4 Passengers</Text>
          </View>

          {/* Distance + Time row */}
          <View style={tw`flex-row items-center py-3`}>
            <View style={tw`flex-row items-center flex-1`}>
              <View style={tw`w-9 h-9 rounded-full bg-slate-50 items-center justify-center mr-4`}>
                <Feather name="map" size={16} color="#64748B" />
              </View>
              <Text style={tw`text-sm font-semibold text-slate-700`}>35 km</Text>
            </View>
            <View style={tw`flex-row items-center flex-1`}>
              <View style={tw`w-9 h-9 rounded-full bg-slate-50 items-center justify-center mr-4`}>
                <Feather name="clock" size={16} color="#64748B" />
              </View>
              <Text style={tw`text-sm font-semibold text-slate-700`}>45 mins</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {}}
          style={tw`bg-[#FFC72C] py-4 rounded-2xl flex-row items-center justify-center shadow-md mb-3`}
        >
          <Ionicons name="navigate" size={18} color="#0B1044" style={tw`mr-2`} />
          <Text style={tw`text-base font-extrabold text-slate-900`}>Start Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/hire-details' as any)}
          style={tw`py-4 rounded-2xl border-2 border-slate-200 items-center justify-center mb-5`}
        >
          <Text style={tw`text-sm font-extrabold text-slate-700`}>View Hire Details</Text>
        </TouchableOpacity>

        {/* Passenger waiting note */}
        <View style={tw`flex-row items-center justify-center`}>
          <View style={tw`w-2 h-2 rounded-full bg-emerald-500 mr-2`} />
          <Text style={tw`text-[11px] font-semibold text-slate-500`}>Passenger is waiting for you.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

