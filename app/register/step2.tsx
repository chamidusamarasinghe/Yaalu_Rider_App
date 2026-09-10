import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function RegisterStep2Screen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  const handleNextStep = () => {
    router.push('/register/step3');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Top Gold Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={26} color="#0B1044" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-16`}>
          {/* Step Progress Header */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-sm font-extrabold text-blue-700`}>Step 2 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>Contact & Address</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-2/5 bg-[#030626] rounded-full`} />
            </View>
          </View>

          {/* Your Information Card */}
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-6 gap-4`}>
            <View style={tw`flex-row items-center gap-3 border-b border-slate-100 pb-3`}>
              <View style={tw`w-9 h-9 rounded-xl bg-blue-50 items-center justify-center`}>
                <Ionicons name="card-outline" size={20} color="#2563EB" />
              </View>
              <Text style={tw`text-lg font-black text-slate-900`}>Your Information</Text>
            </View>

            {/* Email Address (Optional) */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Email Address (Optional)</Text>
              <View style={tw`flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 gap-2.5`}>
                <Ionicons name="mail-outline" size={18} color="#64748B" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholder="e.g. rider@yalu.com"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Home Address */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Home Address</Text>
              <View style={tw`flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 gap-2.5`}>
                <Ionicons name="home-outline" size={18} color="#64748B" />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street Name, Building No."
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* City / Region */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>City / Region</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert('Select City', 'Choose your city:', [
                    { text: 'Colombo', onPress: () => setCity('Colombo') },
                    { text: 'Kandy', onPress: () => setCity('Kandy') },
                    { text: 'Galle', onPress: () => setCity('Galle') },
                  ])
                }
                style={tw`flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3`}>
                <View style={tw`flex-row items-center gap-2.5`}>
                  <Ionicons name="business-outline" size={18} color="#64748B" />
                  <Text style={tw`text-sm font-semibold ${city ? 'text-slate-900' : 'text-slate-400'}`}>
                    {city || 'Select your city'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons Row */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            style={tw`w-full bg-[#030626] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-3`}>
            <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 3</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={tw`w-full bg-white border border-blue-600 rounded-2xl py-3.5 items-center justify-center mb-8`}>
            <Text style={tw`text-blue-600 font-extrabold text-sm`}>Back to Personal Details</Text>
          </TouchableOpacity>

          {/* Decorative Truck Graphic Icon */}
          <View style={tw`items-end pr-2 opacity-25`}>
            <Ionicons name="bus-outline" size={70} color="#94A3B8" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

