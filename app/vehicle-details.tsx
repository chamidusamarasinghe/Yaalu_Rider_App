import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { getSavedRider } from '@/services/api';

export default function VehicleDetailsScreen() {
  const router = useRouter();

  const [model, setModel] = useState('Honda Grazia 125');
  const [vehicleType, setVehicleType] = useState('MOTORBIKE');
  const [plateNumber, setPlateNumber] = useState('WP BCZ-4521');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getSavedRider();
      if (saved) {
        if (saved.vehicleModel) setModel(saved.vehicleModel);
        if (saved.vehicleNumber) setPlateNumber(saved.vehicleNumber);
        if (saved.vehicleType) setVehicleType(saved.vehicleType);
      }

      try {
        const res = await riderApi.getProfile();
        if (res?.rider) {
          if (res.rider.vehicleModel) setModel(res.rider.vehicleModel);
          if (res.rider.vehicleNumber) setPlateNumber(res.rider.vehicleNumber);
          if (res.rider.vehicleType) setVehicleType(res.rider.vehicleType);
        }
      } catch (e) {
        // fallback
      }
    })();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      await riderApi.updateProfile({
        vehicleModel: model.trim(),
        vehicleNumber: plateNumber.trim().toUpperCase(),
        vehicleType,
      });
      Alert.alert('Saved', 'Vehicle details updated successfully in database!');
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update vehicle details');
    } finally {
      setSaving(false);
    }
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
              <Text style={tw`text-xs font-bold text-slate-400 mt-0.5`}>{vehicleType}</Text>

              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2`}>
                PLATE NUMBER
              </Text>
              <Text style={tw`text-sm font-black text-slate-900`}>{plateNumber}</Text>

              <View style={tw`bg-emerald-100 self-start px-2 py-0.5 rounded-md mt-2 flex-row items-center gap-1`}>
                <Ionicons name="checkmark-circle" size={12} color="#047857" />
                <Text style={tw`text-[10px] font-black text-emerald-800`}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={tw`gap-3.5 mb-6`}>
            {/* Vehicle Model */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Vehicle Model</Text>
              <TextInput
                value={model}
                onChangeText={setModel}
                placeholder="e.g. Honda Dio 110"
                placeholderTextColor="#94A3B8"
                style={tw`text-base font-black text-slate-900 p-0`}
              />
            </View>

            {/* Vehicle Type */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Vehicle Type</Text>
              <TextInput
                value={vehicleType}
                onChangeText={setVehicleType}
                placeholder="MOTORBIKE, THREE_WHEEL, CAR, VAN"
                placeholderTextColor="#94A3B8"
                style={tw`text-base font-black text-slate-900 p-0`}
              />
            </View>

            {/* Vehicle Plate Number */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs`}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Vehicle Plate Number</Text>
              <TextInput
                value={plateNumber}
                onChangeText={setPlateNumber}
                placeholder="e.g. WP CAB-1234"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`text-base font-black text-slate-900 p-0`}
              />
            </View>
          </View>

          {/* Document Row Card */}
          <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center justify-between shadow-xs mb-6`}>
            <View style={tw`flex-row items-center gap-3.5`}>
              <View style={tw`w-12 h-12 rounded-2xl bg-indigo-50 items-center justify-center`}>
                <Ionicons name="document-text" size={22} color="#0B1044" />
              </View>
              <View>
                <Text style={tw`text-base font-black text-slate-900`}>Registration Certificate</Text>
                <Text style={tw`text-xs font-bold text-emerald-600 mt-0.5`}>Verified</Text>
              </View>
            </View>

            <TouchableOpacity onPress={() => router.push('/vehicle-document' as any)}>
              <Text style={tw`text-sm font-black text-[#0B1044]`}>View</Text>
            </TouchableOpacity>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSaveChanges}
            disabled={saving}
            style={[
              tw`w-full rounded-2xl py-4 items-center shadow-md`,
              { backgroundColor: saving ? '#94A3B8' : '#0B1044' },
            ]}>
            {saving ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <Text style={tw`text-white font-extrabold text-base`}>Save Changes</Text>
            )}
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
