import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function NewRequestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Direct');

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-16 px-4 flex-row items-center justify-between shadow-sm`}>
        <View style={tw`flex-row items-center gap-3`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="arrow-back" size={24} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-extrabold text-[#0B1044]`}>New Requests</Text>
        </View>

        <View style={tw`flex-row items-center gap-1.5`}>
          <Text style={tw`text-xs font-bold text-[#0B1044]`}>Online</Text>
          <View style={tw`w-11 h-6 rounded-full bg-emerald-500 p-0.5 justify-end`}>
            <View style={tw`w-5 h-5 rounded-full bg-white shadow-sm`} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
        {/* Sort & Filter Controls */}
        <View style={tw`flex-row justify-between gap-3 mb-4`}>
          <TouchableOpacity activeOpacity={0.8} style={tw`flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 flex-row items-center justify-between shadow-xs`}>
            <Text style={tw`text-xs font-semibold text-slate-700`}>Sort by <Text style={tw`font-extrabold text-slate-900`}>Nearest</Text></Text>
            <Ionicons name="chevron-down" size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={tw`bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex-row items-center gap-2 shadow-xs`}>
            <Feather name="sliders" size={16} color="#475569" />
            <Text style={tw`text-xs font-bold text-slate-800`}>Filters</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={tw`flex-row bg-slate-200 rounded-xl p-1 mb-4`}>
          <TouchableOpacity 
            onPress={() => setActiveTab('Direct')}
            style={tw`flex-1 py-2 rounded-lg items-center ${activeTab === 'Direct' ? 'bg-white shadow-sm' : ''}`}>
            <Text style={tw`text-xs font-bold ${activeTab === 'Direct' ? 'text-slate-900' : 'text-slate-500'}`}>Direct</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('Bid')}
            style={tw`flex-1 py-2 rounded-lg items-center ${activeTab === 'Bid' ? 'bg-white shadow-sm' : ''}`}>
            <Text style={tw`text-xs font-bold ${activeTab === 'Bid' ? 'text-slate-900' : 'text-slate-500'}`}>Bid</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Direct' ? (
          <>
            {/* CARD 1: High Pay */}
            <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-4`}>
              <View style={tw`flex-row justify-between items-center mb-3`}>
                <View style={tw`bg-emerald-100 px-3 py-1 rounded-full`}>
                  <Text style={tw`text-[10px] font-extrabold text-emerald-800`}>High Pay</Text>
                </View>
                <Text style={tw`text-[10px] font-bold text-slate-400`}>Order ID: #YA-4589</Text>
              </View>

              {/* Locations */}
              <View style={tw`mb-3`}>
                <View style={tw`flex-row items-start justify-between`}>
                  <View style={tw`flex-row items-start flex-1 mr-2`}>
                    <View style={tw`w-3 h-3 rounded-full border-2 border-blue-600 bg-white mt-1 mr-2`} />
                    <View style={tw`flex-1`}>
                      <Text style={tw`text-[10px] font-bold text-blue-600 uppercase tracking-wider`}>PICKUP</Text>
                      <Text style={tw`text-xs font-extrabold text-slate-900`}>241 Central Gourmet Hub,</Text>
                      <Text style={tw`text-[11px] text-slate-500`}>Victoria Island</Text>
                    </View>
                  </View>
                  <View style={tw`bg-blue-50 px-2 py-0.5 rounded-full`}>
                    <Text style={tw`text-[10px] font-bold text-blue-700`}>4.2 km</Text>
                  </View>
                </View>

                <View style={tw`w-0.5 h-4 bg-slate-300 ml-1.5 my-0.5`} />

                <View style={tw`flex-row items-start`}>
                  <View style={tw`w-3 h-3 rounded-full border-2 border-red-500 bg-white mt-1 mr-2`} />
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-[10px] font-bold text-red-500 uppercase tracking-wider`}>DROP-OFF</Text>
                    <Text style={tw`text-xs font-extrabold text-slate-900`}>Block 4, Lekki Phase 1, Gate B</Text>
                  </View>
                </View>
              </View>

              {/* Stats Bar */}
              <View style={tw`bg-slate-50 rounded-2xl p-3 flex-row justify-between items-center mb-3 border border-slate-100`}>
                <View style={tw`flex-row items-center gap-1.5`}>
                  <Feather name="map-pin" size={14} color="#64748B" />
                  <View>
                    <Text style={tw`text-[9px] text-slate-400`}>Distance</Text>
                    <Text style={tw`text-xs font-bold text-slate-900`}>4.2 km</Text>
                  </View>
                </View>

                <View style={tw`flex-row items-center gap-1.5`}>
                  <Feather name="clock" size={14} color="#64748B" />
                  <View>
                    <Text style={tw`text-[9px] text-slate-400`}>Est. Time</Text>
                    <Text style={tw`text-xs font-bold text-slate-900`}>18 min</Text>
                  </View>
                </View>

                <View style={tw`flex-row items-center gap-1.5`}>
                  <Feather name="credit-card" size={14} color="#059669" />
                  <View>
                    <Text style={tw`text-[9px] text-slate-400`}>Earnings</Text>
                    <Text style={tw`text-xs font-extrabold text-emerald-600`}>LKR 4,320.00</Text>
                  </View>
                </View>
              </View>

              {/* Accept Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => router.push('/incoming-request')}
                style={tw`bg-[#070A2A] rounded-2xl py-3.5 flex-row items-center justify-center gap-2 shadow-md`}>
                <Text style={tw`text-white font-extrabold text-sm`}>Accept Request</Text>
                <View style={tw`w-6 h-6 rounded-full bg-white/20 items-center justify-center`}>
                  <Text style={tw`text-white text-[11px] font-bold`}>15</Text>
                </View>
              </TouchableOpacity>
            </View>

        {/* CARD 2: Medium Pay */}
        <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-4`}>
          <View style={tw`flex-row justify-between items-center mb-3`}>
            <View style={tw`bg-blue-100 px-3 py-1 rounded-full`}>
              <Text style={tw`text-[10px] font-extrabold text-blue-800`}>Medium Pay</Text>
            </View>
            <Text style={tw`text-[10px] font-bold text-slate-400`}>Order ID: #YA-4590</Text>
          </View>

          {/* Locations */}
          <View style={tw`mb-3`}>
            <View style={tw`flex-row items-start justify-between`}>
              <View style={tw`flex-row items-start flex-1 mr-2`}>
                <View style={tw`w-3 h-3 rounded-full border-2 border-blue-600 bg-white mt-1 mr-2`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-[10px] font-bold text-blue-600 uppercase tracking-wider`}>PICKUP</Text>
                  <Text style={tw`text-xs font-extrabold text-slate-900`}>The Island Market,</Text>
                  <Text style={tw`text-[11px] text-slate-500`}>Victoria Island</Text>
                </View>
              </View>
              <View style={tw`bg-blue-50 px-2 py-0.5 rounded-full`}>
                <Text style={tw`text-[10px] font-bold text-blue-700`}>6.8 km</Text>
              </View>
            </View>

            <View style={tw`w-0.5 h-4 bg-slate-300 ml-1.5 my-0.5`} />

            <View style={tw`flex-row items-start`}>
              <View style={tw`w-3 h-3 rounded-full border-2 border-red-500 bg-white mt-1 mr-2`} />
              <View style={tw`flex-1`}>
                <Text style={tw`text-[10px] font-bold text-red-500 uppercase tracking-wider`}>DROP-OFF</Text>
                <Text style={tw`text-xs font-extrabold text-slate-900`}>Chevron Drive, Lekki Phase 2</Text>
              </View>
            </View>
          </View>

          {/* Stats Bar */}
          <View style={tw`bg-slate-50 rounded-2xl p-3 flex-row justify-between items-center mb-3 border border-slate-100`}>
            <View style={tw`flex-row items-center gap-1.5`}>
              <Feather name="map-pin" size={14} color="#64748B" />
              <View>
                <Text style={tw`text-[9px] text-slate-400`}>Distance</Text>
                <Text style={tw`text-xs font-bold text-slate-900`}>6.8 km</Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-1.5`}>
              <Feather name="clock" size={14} color="#64748B" />
              <View>
                <Text style={tw`text-[9px] text-slate-400`}>Est. Time</Text>
                <Text style={tw`text-xs font-bold text-slate-900`}>24 min</Text>
              </View>
            </View>

            <View style={tw`flex-row items-center gap-1.5`}>
              <Feather name="credit-card" size={14} color="#059669" />
              <View>
                <Text style={tw`text-[9px] text-slate-400`}>Earnings</Text>
                <Text style={tw`text-xs font-extrabold text-emerald-600`}>LKR 3,160.00</Text>
              </View>
            </View>
          </View>

          {/* Accept Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/incoming-request')}
            style={tw`bg-[#070A2A] rounded-2xl py-3.5 flex-row items-center justify-center gap-2 shadow-md`}>
            <Text style={tw`text-white font-extrabold text-sm`}>Accept Request</Text>
            <View style={tw`w-6 h-6 rounded-full bg-white/20 items-center justify-center`}>
              <Text style={tw`text-white text-[11px] font-bold`}>12</Text>
            </View>
          </TouchableOpacity>
        </View>

          </>
        ) : (
          <View style={tw`bg-white rounded-3xl p-4 border border-amber-200 shadow-sm mb-4`}>
            <View style={tw`flex-row justify-between items-center mb-3`}>
              <View style={tw`bg-amber-100 px-3 py-1 rounded-full flex-row items-center`}>
                <Ionicons name="flash" size={12} color="#D97706" style={tw`mr-1`} />
                <Text style={tw`text-[10px] font-extrabold text-amber-800`}>New Hire Request</Text>
              </View>
              <View style={tw`bg-red-50 px-2 py-1 rounded-md flex-row items-center`}>
                <Feather name="clock" size={12} color="#DC2626" style={tw`mr-1`} />
                <Text style={tw`text-[10px] font-bold text-red-600`}>7:59</Text>
              </View>
            </View>

            <View style={tw`mb-3`}>
              <Text style={tw`text-lg font-extrabold text-slate-900`}>Colombo City Center</Text>
              <Text style={tw`text-xs font-bold text-slate-400 my-1`}>TO</Text>
              <Text style={tw`text-lg font-extrabold text-slate-900`}>Negombo</Text>
            </View>

            <View style={tw`bg-slate-50 rounded-2xl p-3 flex-row justify-between items-center mb-4 border border-slate-100`}>
              <View>
                <Text style={tw`text-[9px] text-slate-400 uppercase font-bold`}>Starting Price</Text>
                <Text style={tw`text-sm font-extrabold text-amber-600`}>Rs. 1,000</Text>
              </View>
              <View style={tw`h-8 w-[1px] bg-slate-200`} />
              <View>
                <Text style={tw`text-[9px] text-slate-400 uppercase font-bold`}>Bid Range</Text>
                <Text style={tw`text-sm font-bold text-slate-900`}>Rs. 900 - 1,200</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push('/bid-request' as any)}
              style={tw`bg-[#FFC72C] rounded-2xl py-3.5 flex-row items-center justify-center shadow-md`}>
              <Text style={tw`text-slate-900 font-extrabold text-sm`}>View Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Box */}
        <View style={tw`bg-blue-50 rounded-2xl p-3.5 flex-row items-center border border-blue-100 mb-4`}>
          <Feather name="clock" size={16} color="#2563EB" style={tw`mr-3`} />
          <Text style={tw`flex-1 text-[11px] text-blue-900 font-medium`}>
            Requests will auto-decline if not accepted within the time limit.
          </Text>
        </View>

      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2`}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`items-center`}>
          <Ionicons name="home-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={tw`items-center`}>
          <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
            <Ionicons name="cart" size={18} color="#0B1044" />
            <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Orders</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/wallet' as any)} style={tw`items-center`}>
          <Ionicons name="wallet-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Wallet</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/notifications' as any)} style={tw`items-center`}>
          <Ionicons name="notifications-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/profile' as any)} style={tw`items-center`}>
          <Ionicons name="person-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Profile</Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

