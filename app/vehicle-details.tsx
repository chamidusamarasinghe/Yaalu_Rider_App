import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';

export default function VehicleDetailsScreen() {
  const router = useRouter();

  const [model, setModel] = useState('Honda Grazia 125');
  const [year, setYear] = useState('2022');
  const [plateNumber, setPlateNumber] = useState('BCZ-4521');
  const [chassisNumber, setChassisNumber] = useState('ME4JF8123NK123456');
  const [engineNumber, setEngineNumber] = useState('JF81E-1234567');
  const [color, setColor] = useState('Black');

  const handleSaveChanges = () => {
    Alert.alert('Saved', 'Vehicle details updated successfully!');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>

      {/* Header Bar */}
      <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
          <Ionicons name="chevron-back" size={24} color="#0B1044" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Vehicle Details</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
        {/* Section Title */}
        <Text style={tw`text-xl font-black text-slate-900 mb-4`}>Vehicle Information</Text>

        {/* Vehicle Summary Hero Card */}
        <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center gap-4 shadow-xs mb-4 relative`}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=300' }}
            style={tw`w-28 h-24 rounded-2xl bg-slate-100`}
            resizeMode="cover"
          />

          <View style={tw`flex-1 pr-6`}>
            <Text style={tw`text-base font-black text-slate-900`}>{model}</Text>
            <Text style={tw`text-xs font-bold text-slate-400 mt-0.5`}>{year}</Text>

            <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2`}>
              PLATE NUMBER
            </Text>
            <Text style={tw`text-sm font-black text-slate-900`}>{plateNumber}</Text>

            <View style={tw`bg-emerald-100 self-start px-2 py-0.5 rounded-md mt-2 flex-row items-center gap-1`}>
              <Ionicons name="checkmark-circle" size={12} color="#047857" />
              <Text style={tw`text-[10px] font-black text-emerald-800`}>Verified</Text>
            </View>
          </View>

          {/* Edit Pencil Icon */}
          <TouchableOpacity
            onPress={() => Alert.alert('Edit Vehicle', 'Modify vehicle info below.')}
            style={tw`absolute top-4 right-4 p-1`}>
            <Ionicons name="pencil" size={18} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={tw`gap-3.5 mb-6`}>
          {/* Vehicle Model */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Vehicle Model</Text>
            <TextInput
              value={model}
              onChangeText={setModel}
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Vehicle Year */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Vehicle Year</Text>
            <TextInput
              value={year}
              onChangeText={setYear}
              keyboardType="number-pad"
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Plate Number */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Plate Number</Text>
            <TextInput
              value={plateNumber}
              onChangeText={setPlateNumber}
              autoCapitalize="characters"
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Chassis Number */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Chassis Number</Text>
            <TextInput
              value={chassisNumber}
              onChangeText={setChassisNumber}
              autoCapitalize="characters"
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Engine Number */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Engine Number</Text>
            <TextInput
              value={engineNumber}
              onChangeText={setEngineNumber}
              autoCapitalize="characters"
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>

          {/* Color */}
          <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
            <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Color</Text>
            <TextInput
              value={color}
              onChangeText={setColor}
              style={tw`text-base font-black text-slate-900 p-0`}
            />
          </View>
        </View>

        {/* Section Title: Vehicle Documents */}
        <Text style={tw`text-xl font-black text-slate-900 mb-3`}>Vehicle Documents</Text>

        {/* Document Row Card */}
        <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center justify-between shadow-xs mb-6`}>
          <View style={tw`flex-row items-center gap-3.5`}>
            <View style={tw`w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center`}>
              <Ionicons name="document-text" size={22} color="#4F46E5" />
            </View>
            <View>
              <Text style={tw`text-base font-black text-slate-900`}>Registration Certificate</Text>
              <Text style={tw`text-xs font-bold text-emerald-600 mt-0.5`}>Verified</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/vehicle-document' as any)}>
            <Text style={tw`text-sm font-black text-blue-600`}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSaveChanges}
          style={tw`w-full bg-[#030626] rounded-2xl py-4 items-center shadow-md`}>
          <Text style={tw`text-white font-extrabold text-base`}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={tw`absolute bottom-0 left-0 right-0 h-16 bg-[#FFC72C] flex-row items-center justify-around border-t border-amber-300 shadow-lg px-2`}>
        <TouchableOpacity onPress={() => router.push('/dashboard')} style={tw`items-center`}>
          <Ionicons name="home-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/orders' as any)} style={tw`items-center`}>
          <Ionicons name="cart-outline" size={20} color="#0B1044" />
          <Text style={tw`text-[10px] font-bold text-[#0B1044]`}>Orders</Text>
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
          <View style={tw`bg-white px-3 py-1 rounded-full flex-row items-center gap-1`}>
            <Ionicons name="person" size={18} color="#0B1044" />
            <Text style={tw`text-xs font-extrabold text-[#0B1044]`}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}

