import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function LiveBiddingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#F8FAFC]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      {/* Header */}
      <View style={tw`px-4 py-3 flex-row items-center justify-between bg-white shadow-sm z-10`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-2 -ml-2 mr-2`}>
            <Ionicons name="arrow-back" size={24} color="#0B1044" />
          </TouchableOpacity>
          <View>
            <Text style={tw`text-lg font-extrabold text-slate-900`}>Live Bidding</Text>
            <Text style={tw`text-[11px] text-slate-500`}>Multiple drivers are bidding for this hire.</Text>
          </View>
        </View>
        <TouchableOpacity style={tw`p-2`}>
          <Feather name="bell" size={20} color="#0B1044" />
          <View style={tw`absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white`} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={tw`p-4 pb-12`} showsVerticalScrollIndicator={false}>
        {/* Main Bidding Card */}
        <View style={tw`bg-white rounded-3xl p-5 mb-4 border border-amber-200 shadow-md`}>
          <View style={tw`flex-row justify-between items-center mb-6`}>
            {/* Timer Circle */}
            <View style={tw`w-16 h-16 rounded-full border-4 border-amber-400 items-center justify-center`}>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>08:00</Text>
              <Text style={tw`text-[8px] text-slate-500 font-bold uppercase`}>Remaining</Text>
            </View>

            <View style={tw`flex-1 ml-4`}>
              <View style={tw`flex-row justify-between mb-2`}>
                <View>
                  <View style={tw`flex-row items-center mb-0.5`}>
                    <Feather name="dollar-sign" size={10} color="#64748B" />
                    <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Starting</Text>
                  </View>
                  <Text style={tw`text-xs font-extrabold text-slate-900`}>Rs. 1,000</Text>
                </View>
                <View style={tw`items-end`}>
                  <View style={tw`flex-row items-center mb-0.5`}>
                    <Ionicons name="swap-vertical" size={10} color="#10B981" />
                    <Text style={tw`text-[9px] text-emerald-600 uppercase font-bold`}>Bid Range</Text>
                  </View>
                  <Text style={tw`text-xs font-extrabold text-slate-900`}>Rs. 900 - 1,200</Text>
                </View>
              </View>
              
              {/* Progress Bar placeholder */}
              <View style={tw`h-1.5 bg-slate-100 rounded-full w-full flex-row overflow-hidden`}>
                <View style={tw`h-full w-[10%] bg-blue-500`} />
                <View style={tw`h-full w-[30%] bg-emerald-500`} />
                <View style={tw`h-full w-[20%] bg-amber-400`} />
              </View>
            </View>
          </View>

          <View style={tw`bg-emerald-50 rounded-2xl p-4 flex-row justify-between items-center border border-emerald-100 mb-4`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-10 h-10 bg-emerald-100 rounded-full items-center justify-center mr-3`}>
                <FontAwesome5 name="trophy" size={18} color="#059669" />
              </View>
              <View>
                <Text style={tw`text-[10px] text-emerald-700 uppercase font-bold mb-0.5`}>Current Lowest Bid</Text>
                <Text style={tw`text-2xl font-extrabold text-emerald-700`}>Rs. 980</Text>
              </View>
            </View>
            <View style={tw`bg-white border border-emerald-200 rounded-xl px-2 py-1.5 items-center`}>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>4 Drivers</Text>
              <Text style={tw`text-[9px] text-emerald-600 font-bold uppercase`}>Bidding</Text>
            </View>
          </View>

          <View style={tw`flex-row gap-3`}>
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={() => router.push('/place-bid' as any)}
              style={tw`flex-1 bg-[#FFC72C] py-4 rounded-xl flex-row items-center justify-center shadow-md`}>
              <MaterialCommunityIcons name="gavel" size={18} color="#0B1044" style={tw`mr-2`} />
              <Text style={tw`font-extrabold text-base text-[#0B1044]`}>Place Bid</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/live-bids' as any)}
              style={tw`flex-1 bg-white border-2 border-[#FFC72C] py-4 rounded-xl flex-row items-center justify-center`}>
              <Feather name="list" size={16} color="#0B1044" style={tw`mr-2`} />
              <Text style={tw`font-extrabold text-base text-slate-900`}>Live Bids</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hire Details Card */}
        <View style={tw`bg-white rounded-3xl p-5 mb-4 border border-slate-200 shadow-sm`}>
          <View style={tw`flex-row items-center mb-4`}>
            <FontAwesome5 name="car-side" size={14} color="#64748B" style={tw`mr-2`} />
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Hire Details</Text>
          </View>

          <View style={tw`w-full h-32 bg-slate-200 rounded-2xl mb-4`} />

          <View style={tw`mb-5`}>
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3`}>
                <View style={tw`w-2 h-2 rounded-full bg-emerald-500`} />
              </View>
              <View style={tw`flex-1 border-b border-slate-100 pb-2`}>
                <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Pickup Location</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900 mt-0.5`}>Colombo City Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </View>

            <View style={tw`flex-row items-center`}>
              <View style={tw`w-8 h-8 rounded-full bg-red-50 items-center justify-center mr-3`}>
                <View style={tw`w-2 h-2 rounded-full bg-red-500`} />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Destination</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900 mt-0.5`}>Negombo</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </View>
          </View>

          <View style={tw`h-[1px] bg-slate-100 mb-4`} />

          <View style={tw`flex-row justify-between`}>
            <View>
              <View style={tw`flex-row items-center mb-1`}>
                <Feather name="map" size={10} color="#64748B" style={tw`mr-1`} />
                <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Distance</Text>
              </View>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>32 km</Text>
            </View>
            <View>
              <View style={tw`flex-row items-center mb-1`}>
                <Feather name="clock" size={10} color="#64748B" style={tw`mr-1`} />
                <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Est. Time</Text>
              </View>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>45 mins</Text>
            </View>
            <View>
              <View style={tw`flex-row items-center mb-1`}>
                <Feather name="users" size={10} color="#64748B" style={tw`mr-1`} />
                <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Pax</Text>
              </View>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>2</Text>
            </View>
            <View>
              <View style={tw`flex-row items-center mb-1`}>
                <FontAwesome5 name="car-side" size={10} color="#64748B" style={tw`mr-1`} />
                <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Vehicle</Text>
              </View>
              <Text style={tw`text-xs font-extrabold text-slate-900`}>Car (Sedan)</Text>
            </View>
          </View>
        </View>

        <View style={tw`bg-amber-50 rounded-2xl p-3 flex-row items-center border border-amber-100`}>
          <Feather name="info" size={16} color="#D97706" style={tw`mr-3`} />
          <Text style={tw`flex-1 text-[11px] text-amber-900 font-medium`}>
            Lowest valid bid at the end of the timer wins the hire.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
