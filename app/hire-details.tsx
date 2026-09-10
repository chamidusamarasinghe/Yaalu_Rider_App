import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import tw from 'twrnc';

export default function HireDetailsScreen() {
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
            <Text style={tw`text-lg font-extrabold text-slate-900`}>Hire Details</Text>
            <Text style={tw`text-[11px] text-slate-500`}>Join the bid and get this ride</Text>
          </View>
        </View>
        <TouchableOpacity style={tw`p-2 bg-slate-50 rounded-full border border-slate-200`}>
          <Feather name="headphones" size={18} color="#0B1044" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={tw`p-4 pb-28`} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={tw`bg-amber-50 border border-amber-200 rounded-3xl p-4 flex-row items-center justify-between mb-4 shadow-sm`}>
          <View style={tw`flex-row items-center flex-1`}>
            <View style={tw`w-10 h-10 bg-amber-100 rounded-full items-center justify-center mr-3`}>
              <FontAwesome5 name="handshake" size={16} color="#D97706" />
            </View>
            <View style={tw`flex-1 pr-2`}>
              <Text style={tw`text-sm font-extrabold text-amber-900 mb-0.5`}>New Hire Accepted</Text>
              <Text style={tw`text-[10px] text-amber-700 leading-tight`}>
                You've accepted this hire. Now join the bidding competition to get the ride.
              </Text>
            </View>
          </View>
          <View style={tw`bg-white border border-amber-200 rounded-xl px-2 py-1.5 items-center justify-center`}>
            <Text style={tw`text-xs font-extrabold text-slate-900`}>8:00</Text>
            <Text style={tw`text-[8px] text-amber-600 font-bold uppercase`}>Bidding Duration</Text>
          </View>
        </View>

        {/* Map & Location Card */}
        <View style={tw`bg-white rounded-3xl p-4 mb-4 border border-slate-200 shadow-sm`}>
          <View style={tw`flex-row mb-4`}>
            <View style={tw`flex-1 justify-center`}>
              <View style={tw`flex-row items-start mb-4`}>
                <View style={tw`w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3`}>
                  <View style={tw`w-2 h-2 rounded-full bg-emerald-500`} />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Pickup Location</Text>
                  <Text style={tw`text-sm font-extrabold text-slate-900`}>Colombo City Center</Text>
                  <Text style={tw`text-[10px] text-slate-500 mt-0.5`}>Lotus Road, Colombo 01</Text>
                </View>
              </View>

              <View style={tw`flex-row items-start`}>
                <View style={tw`w-8 h-8 rounded-full bg-red-50 items-center justify-center mr-3`}>
                  <View style={tw`w-2 h-2 rounded-full bg-red-500`} />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Destination</Text>
                  <Text style={tw`text-sm font-extrabold text-slate-900`}>Negombo</Text>
                  <Text style={tw`text-[10px] text-slate-500 mt-0.5`}>Negombo Main Road, Negombo</Text>
                </View>
              </View>
            </View>
            <View style={tw`w-24 h-28 bg-slate-200 rounded-xl`} />
          </View>

          <View style={tw`h-[1px] bg-slate-100 my-4`} />

          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-row items-center flex-1`}>
              <Feather name="map" size={16} color="#64748B" style={tw`mr-2`} />
              <View>
                <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Distance</Text>
                <Text style={tw`text-xs font-extrabold text-slate-900`}>32 km</Text>
              </View>
            </View>
            <View style={tw`flex-row items-center flex-1`}>
              <Feather name="clock" size={16} color="#64748B" style={tw`mr-2`} />
              <View>
                <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Est. Travel Time</Text>
                <Text style={tw`text-xs font-extrabold text-slate-900`}>45 mins</Text>
              </View>
            </View>
            <View style={tw`flex-row items-center flex-1`}>
              <Feather name="users" size={16} color="#64748B" style={tw`mr-2`} />
              <View>
                <Text style={tw`text-[9px] text-slate-500 uppercase font-bold`}>Passengers</Text>
                <Text style={tw`text-xs font-extrabold text-slate-900`}>2</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle */}
        <View style={tw`bg-white rounded-2xl p-4 mb-4 border border-slate-200 shadow-sm flex-row items-center`}>
          <View style={tw`w-10 h-10 rounded-xl bg-slate-50 items-center justify-center mr-3`}>
            <FontAwesome5 name="car-side" size={16} color="#475569" />
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold`}>Vehicle Type</Text>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Car (Sedan)</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
        </View>

        {/* Price Blocks */}
        <View style={tw`flex-row gap-3 mb-4`}>
          <View style={tw`flex-1 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm items-center justify-center`}>
            <View style={tw`w-6 h-6 rounded-full bg-emerald-50 items-center justify-center mb-2`}>
              <Feather name="dollar-sign" size={12} color="#059669" />
            </View>
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold mb-0.5`}>Starting Price</Text>
            <Text style={tw`text-sm font-extrabold text-slate-900`}>Rs. 1,000</Text>
          </View>
          
          <View style={tw`flex-1 bg-white border border-blue-200 rounded-2xl p-3 shadow-sm items-center justify-center`}>
            <View style={tw`w-6 h-6 rounded-full bg-blue-50 items-center justify-center mb-2`}>
              <Ionicons name="arrow-down-circle" size={14} color="#2563EB" />
            </View>
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold mb-0.5`}>Minimum Bid</Text>
            <Text style={tw`text-sm font-extrabold text-blue-700`}>Rs. 900</Text>
            <Text style={tw`text-[8px] text-slate-400 text-center mt-1`}>(10% below starting price)</Text>
          </View>
          
          <View style={tw`flex-1 bg-white border border-purple-200 rounded-2xl p-3 shadow-sm items-center justify-center`}>
            <View style={tw`w-6 h-6 rounded-full bg-purple-50 items-center justify-center mb-2`}>
              <Ionicons name="arrow-up-circle" size={14} color="#9333EA" />
            </View>
            <Text style={tw`text-[10px] text-slate-500 uppercase font-bold mb-0.5`}>Maximum Bid</Text>
            <Text style={tw`text-sm font-extrabold text-purple-700`}>Rs. 1,200</Text>
            <Text style={tw`text-[8px] text-slate-400 text-center mt-1`}>(20% above starting price)</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={tw`bg-blue-50 rounded-2xl p-3 flex-row items-center border border-blue-100 mb-3`}>
          <Feather name="users" size={16} color="#2563EB" style={tw`mr-3`} />
          <Text style={tw`flex-1 text-[11px] text-blue-900 font-medium`}>
            Multiple drivers can bid for this hire. The lowest valid bid at the end of the bidding period wins.
          </Text>
        </View>

        <View style={tw`bg-amber-50 rounded-2xl p-3 flex-row items-start border border-amber-100 mb-6`}>
          <View style={tw`w-5 h-5 rounded-full bg-amber-200 items-center justify-center mr-3 mt-0.5`}>
            <Text style={tw`text-amber-800 font-bold text-xs`}>i</Text>
          </View>
          <View style={tw`flex-1`}>
            <Text style={tw`text-[11px] font-bold text-amber-900 mb-0.5`}>Important</Text>
            <Text style={tw`text-[10px] text-amber-800`}>
              You can bid up to 10% below the starting price and up to 20% above the starting price.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={tw`absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-md`}>
        <TouchableOpacity 
          onPress={() => router.push('/live-bidding' as any)}
          style={tw`bg-[#FFC72C] py-3.5 rounded-xl flex-row items-center justify-center shadow-sm mb-3`}>
          <Ionicons name="musical-notes" size={16} color="#0B1044" style={tw`mr-2`} />
          <Text style={tw`font-extrabold text-[#0B1044]`}>Join Bid</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.back()}
          style={tw`py-3.5 rounded-xl items-center justify-center border border-slate-200`}>
          <Text style={tw`font-bold text-slate-700`}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
