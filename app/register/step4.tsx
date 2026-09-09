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
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function RegisterStep4Screen() {
  const router = useRouter();
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleNextStep = () => {
    router.push('/register/step5');
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
          <View style={tw`mb-5`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-sm font-extrabold text-blue-700`}>Step 4 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>License & Verification</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-4/5 bg-[#030626] rounded-full`} />
            </View>
          </View>

          <Text style={tw`text-xs font-semibold text-slate-600 mb-5 leading-4.5`}>
            We need to verify your eligibility to drive and ensure community safety.
          </Text>

          {/* Form Floating Label Inputs */}
          <View style={tw`gap-4 mb-6`}>
            {/* License Number Input */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5 relative`}>
              <Text style={tw`text-[11px] font-bold text-blue-600 mb-1`}>Driving License Number</Text>
              <TextInput
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                placeholder="ABC-12345-XYZ"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>

            {/* Expiry Date Input */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5 relative`}>
              <Text style={tw`text-[11px] font-bold text-blue-600 mb-1`}>License Expiry Date</Text>
              <TextInput
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="mm/dd/yyyy"
                placeholderTextColor="#94A3B8"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>
          </View>

          {/* LICENSE PHOTOS */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-3`}>
            LICENSE PHOTOS
          </Text>
          <View style={tw`flex-row gap-3 mb-6`}>
            {/* Front Side */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('Front Photo', 'Select front photo from camera/gallery.')}
              style={tw`flex-1 bg-blue-50/50 border border-slate-200 rounded-3xl p-5 items-center justify-center py-7 shadow-xs`}>
              <Ionicons name="camera-outline" size={28} color="#2563EB" />
              <Text style={tw`text-xs font-extrabold text-slate-800 mt-2`}>Front Side</Text>
            </TouchableOpacity>

            {/* Back Side */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('Back Photo', 'Select back photo from camera/gallery.')}
              style={tw`flex-1 bg-blue-50/50 border border-slate-200 rounded-3xl p-5 items-center justify-center py-7 shadow-xs`}>
              <Ionicons name="camera-outline" size={28} color="#2563EB" />
              <Text style={tw`text-xs font-extrabold text-slate-800 mt-2`}>Back Side</Text>
            </TouchableOpacity>
          </View>

          {/* VERIFICATION DOCUMENTS */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-3`}>
            VERIFICATION DOCUMENTS
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Police Clearance', 'Upload PDF or photo.')}
            style={tw`bg-blue-50/50 border border-slate-200 rounded-3xl p-4 flex-row items-center justify-between shadow-xs mb-5`}>
            <View style={tw`flex-row items-center gap-3 flex-1`}>
              <View style={tw`w-12 h-12 rounded-full bg-emerald-600 items-center justify-center shadow-xs`}>
                <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-black text-slate-900`}>Police Clearance Certificate</Text>
                <Text style={tw`text-xs font-medium text-slate-500 mt-0.5`}>
                  Upload PDF or high-quality image
                </Text>
              </View>
            </View>
            <Feather name="upload" size={20} color="#475569" />
          </TouchableOpacity>

          {/* Info Warning Alert */}
          <View style={tw`bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex-row items-start gap-3 mb-6`}>
            <Ionicons name="information-circle" size={20} color="#F97316" style={tw`mt-0.5`} />
            <Text style={tw`flex-1 text-xs font-medium text-slate-700 leading-4.5`}>
              Ensure all text on your license is clearly visible and not obscured by glare. Police clearance must be issued within the last 6 months.
            </Text>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            style={tw`w-full bg-[#030626] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-4`}>
            <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 5</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert('Saved', 'Progress saved.')}>
            <Text style={tw`text-slate-500 font-bold text-xs text-center`}>Save and Finish Later</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
