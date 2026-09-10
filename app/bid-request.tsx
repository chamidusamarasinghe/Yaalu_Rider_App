import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import tw from '@/lib/tw';

export default function BidRequestScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />
      
      {/* Header */}
      <View style={tw`px-4 py-3 flex-row items-center justify-between bg-[#FFC72C] shadow-sm`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-2 -ml-2 mr-2 bg-white/40 rounded-full`}>
            <Ionicons name="arrow-back" size={20} color="#0B1044" />
          </TouchableOpacity>
          <View>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-2 h-2 rounded-full bg-[#0B1044] mr-2`} />
              <Text style={tw`text-lg font-black text-[#0B1044]`}>New Hire Request</Text>
            </View>
            <Text style={tw`text-[11px] text-[#0B1044]/70 font-semibold`}>A new ride is available. Accept to join the bid.</Text>
          </View>
        </View>
        <TouchableOpacity style={tw`p-2 bg-white/40 rounded-full`}>
          <Feather name="bell" size={18} color="#0B1044" />
          <View style={tw`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white`} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={tw`p-4 pb-24`} showsVerticalScrollIndicator={false}>
        {/* Main Card */}
        <View style={tw`bg-slate-50 rounded-3xl p-4 mb-4 border border-slate-100 shadow-sm`}>
          <View style={tw`bg-white rounded-full px-3 py-1.5 self-start flex-row items-center mb-4 shadow-sm border border-slate-100`}>
            <Ionicons name="flash" size={14} color="#D97706" style={tw`mr-1.5`} />
            <Text style={tw`text-xs font-bold text-amber-600`}>New Hire Request</Text>
          </View>

          <View style={tw`flex-row justify-between`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xl font-extrabold text-slate-900 mb-1`}>Colombo City Center</Text>
              <Text style={tw`text-xs font-bold text-slate-400 my-1`}>TO</Text>
              <Text style={tw`text-xl font-extrabold text-slate-900 mb-3`}>Negombo</Text>
              <Text style={tw`text-[11px] text-slate-500 leading-tight`}>
                Multiple drivers can accept this hire and compete through bidding.
              </Text>
            </View>
            <View style={tw`w-24 h-32 bg-slate-200 rounded-xl ml-4`} />
          </View>
        </View>

        {/* Locations */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm`}>
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3`}>
              <View style={tw`w-2 h-2 rounded-full bg-emerald-500`} />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Pickup Location</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>Colombo City Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </View>

          <View style={tw`w-0.5 h-6 bg-slate-200 absolute left-8 top-11`} />

          <View style={tw`flex-row items-center`}>
            <View style={tw`w-8 h-8 rounded-full bg-red-50 items-center justify-center mr-3`}>
              <View style={tw`w-2 h-2 rounded-full bg-red-500`} />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Destination</Text>
              <Text style={tw`text-sm font-extrabold text-slate-900`}>Negombo</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </View>
        </View>

        {/* Stats */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm flex-row justify-between items-center`}>
          <View style={tw`items-center flex-1 border-r border-slate-100`}>
            <Feather name="map" size={16} color="#64748B" style={tw`mb-1`} />
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Distance</Text>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>32 km</Text>
          </View>
          <View style={tw`items-center flex-1 border-r border-slate-100`}>
            <Feather name="clock" size={16} color="#64748B" style={tw`mb-1`} />
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Est. Time</Text>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>45 mins</Text>
          </View>
          <View style={tw`items-center flex-1`}>
            <Feather name="users" size={16} color="#64748B" style={tw`mb-1`} />
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Passengers</Text>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>2</Text>
          </View>
        </View>

        {/* Vehicle */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm flex-row items-center`}>
          <View style={tw`w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3`}>
            <FontAwesome5 name="car-side" size={16} color="#475569" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Vehicle Type</Text>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Car (Sedan)</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </View>

        {/* Bidding Info */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm flex-row justify-between items-center`}>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[10px] text-amber-600 uppercase font-bold mb-1`}>Starting Price</Text>
            <Text style={tw`text-base font-extrabold text-slate-900`}>Rs. 1,000</Text>
          </View>
          <View style={tw`w-[1px] h-10 bg-slate-100 mx-2`} />
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center mb-1`}>
              <Ionicons name="swap-vertical" size={12} color="#2563EB" style={tw`mr-1`} />
              <Text style={tw`text-[10px] text-blue-600 uppercase font-bold`}>Bid Range</Text>
            </View>
            <Text style={tw`text-xs font-extrabold text-slate-900`}>Rs. 900 - 1,200</Text>
            <Text style={tw`text-[8px] text-slate-400`}>(10% below to 20% above)</Text>
          </View>
          <View style={tw`w-[1px] h-10 bg-slate-100 mx-2`} />
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center mb-1`}>
              <Feather name="clock" size={10} color="#D97706" style={tw`mr-1`} />
              <Text style={tw`text-[10px] text-amber-600 uppercase font-bold`}>Duration</Text>
            </View>
            <Text style={tw`text-sm font-extrabold text-red-600`}>7:59</Text>
            <Text style={tw`text-[8px] text-slate-400`}>minutes remaining</Text>
          </View>
        </View>

        {/* Info text */}
        <View style={tw`bg-amber-50 rounded-2xl p-3.5 flex-row items-center border border-amber-100 mb-6`}>
          <Feather name="users" size={16} color="#D97706" style={tw`mr-3`} />
          <Text style={tw`flex-1 text-[11px] text-amber-900 font-medium`}>
            Multiple drivers can accept this hire and compete through bidding. The <Text style={tw`font-bold`}>lowest valid bid</Text> will win.
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100`}>
        <TouchableOpacity 
          onPress={() => router.push('/hire-details' as any)}
          style={tw`bg-[#FFC72C] py-3.5 rounded-xl flex-row items-center justify-center shadow-sm mb-3`}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#0B1044" style={tw`mr-2`} />
          <Text style={tw`font-extrabold text-[#0B1044]`}>Accept & Join Bid</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          style={tw`py-3.5 rounded-xl items-center justify-center border border-slate-200`}>
          <View style={tw`flex-row items-center`}>
            <Feather name="x" size={16} color="#DC2626" style={tw`mr-1.5`} />
            <Text style={tw`font-bold text-slate-700`}>Decline</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

