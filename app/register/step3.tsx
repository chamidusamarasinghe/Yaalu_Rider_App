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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

export default function RegisterStep3Screen() {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<'Car' | 'Bike' | 'Tuk' | 'Van' | 'Lorry'>('Car');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  const handleNextStep = () => {
    router.push('/register/step4');
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
              <Text style={tw`text-sm font-extrabold text-blue-700`}>Step 3 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>Vehicle Information</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-3/5 bg-[#030626] rounded-full`} />
            </View>
          </View>

          {/* Select Vehicle Type */}
          <Text style={tw`text-xs font-bold text-slate-700 mb-3`}>Select Vehicle Type</Text>
          <View style={tw`gap-2.5 mb-5`}>
            {/* Row 1 */}
            <View style={tw`flex-row gap-2.5`}>
              {[
                { id: 'Car', label: 'Car', icon: 'car-outline' },
                { id: 'Bike', label: 'Bike', icon: 'bicycle-outline' },
                { id: 'Tuk', label: 'Tuk', icon: 'bus-outline' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedVehicle(item.id as any)}
                  style={tw`flex-1 py-3 px-2 rounded-2xl border items-center justify-center ${
                    selectedVehicle === item.id
                      ? 'bg-blue-50 border-blue-600 border-2'
                      : 'bg-white border-slate-200'
                  }`}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={selectedVehicle === item.id ? '#2563EB' : '#0F172A'}
                  />
                  <Text
                    style={tw`text-[11px] font-extrabold mt-1.5 ${
                      selectedVehicle === item.id ? 'text-blue-900' : 'text-slate-800'
                    }`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Row 2 */}
            <View style={tw`flex-row gap-2.5 w-2/3`}>
              {[
                { id: 'Van', label: 'Van', icon: 'car-sport-outline' },
                { id: 'Lorry', label: 'Lorry', icon: 'trail-sign-outline' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedVehicle(item.id as any)}
                  style={tw`flex-1 py-3 px-2 rounded-2xl border items-center justify-center ${
                    selectedVehicle === item.id
                      ? 'bg-blue-50 border-blue-600 border-2'
                      : 'bg-white border-slate-200'
                  }`}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={selectedVehicle === item.id ? '#2563EB' : '#0F172A'}
                  />
                  <Text
                    style={tw`text-[11px] font-extrabold mt-1.5 ${
                      selectedVehicle === item.id ? 'text-blue-900' : 'text-slate-800'
                    }`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vehicle Model & Plate Inputs */}
          <View style={tw`gap-3 mb-5`}>
            <View style={tw`bg-slate-50 border border-slate-300 rounded-2xl p-3.5`}>
              <TextInput
                value={vehicleModel}
                onChangeText={setVehicleModel}
                placeholder="Vehicle Model (e.g. Toyota Vitz 2018)"
                placeholderTextColor="#94A3B8"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>

            <View style={tw`bg-slate-50 border border-slate-300 rounded-2xl p-3.5`}>
              <TextInput
                value={plateNumber}
                onChangeText={setPlateNumber}
                placeholder="Vehicle Plate Number (e.g. WP CAB-1234)"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>
          </View>

          {/* Vehicle Photo Upload Box */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Upload Photo', 'Choose vehicle photo from gallery.')}
            style={tw`border-2 border-dashed border-slate-300 bg-white rounded-3xl p-5 items-center justify-center mb-4`}>
            <View style={tw`w-10 h-10 rounded-full bg-[#030626] items-center justify-center shadow-xs`}>
              <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
            </View>
            <Text style={tw`text-xs font-black text-slate-900 mt-2`}>Vehicle Photo</Text>
            <Text style={tw`text-[10px] font-medium text-slate-400 mt-0.5 text-center`}>
              Clear photo showing the front and side of the vehicle
            </Text>
          </TouchableOpacity>

          {/* Registration Doc Upload Box */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Upload Document', 'Choose Revenue License / Log Book photo.')}
            style={tw`border-2 border-dashed border-slate-300 bg-white rounded-3xl p-5 items-center justify-center mb-5`}>
            <View style={tw`w-10 h-10 rounded-full bg-amber-400 items-center justify-center shadow-xs`}>
              <Ionicons name="document-text-outline" size={20} color="#030626" />
            </View>
            <Text style={tw`text-xs font-black text-slate-900 mt-2`}>Registration Doc</Text>
            <Text style={tw`text-[10px] font-medium text-slate-400 mt-0.5 text-center`}>
              Upload clear photo of the Revenue License or Log Book
            </Text>
          </TouchableOpacity>

          {/* Info Banner */}
          <View style={tw`bg-emerald-50 border border-emerald-200/60 rounded-2xl p-3.5 flex-row items-center gap-3 mb-6`}>
            <Ionicons name="information-circle-outline" size={22} color="#059669" />
            <Text style={tw`flex-1 text-[11px] font-medium text-emerald-900 leading-4`}>
              Ensure your vehicle meets the Yalu safety standards. All documents will be verified within 24 hours.
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            style={tw`w-full bg-[#030626] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-4`}>
            <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 4</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert('Saved', 'Progress saved.')}>
            <Text style={tw`text-slate-500 font-bold text-xs text-center`}>Save and complete later</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
