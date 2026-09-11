import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { saveRegistrationDraft, getRegistrationDraft } from '@/services/api';

export default function RegisterStep3Screen() {
  const router = useRouter();
  const [selectedVehicle, setSelectedVehicle] = useState<'Bike' | 'Tuk' | 'Car' | 'Van' | 'Lorry'>('Bike');
  const [vehicleModel, setVehicleModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const draft = await getRegistrationDraft();
      if (draft) {
        if (draft.phone || draft.mobile) setPhone(draft.phone || draft.mobile);
        if (draft.vehicleType) {
          const vt = draft.vehicleType.toUpperCase();
          if (vt.includes('BIKE') || vt.includes('SCOOTER')) setSelectedVehicle('Bike');
          else if (vt.includes('THREE') || vt.includes('TUK')) setSelectedVehicle('Tuk');
          else if (vt.includes('VAN')) setSelectedVehicle('Van');
          else if (vt.includes('LORRY')) setSelectedVehicle('Lorry');
          else setSelectedVehicle('Car');
        }
        if (draft.vehicleModel) setVehicleModel(draft.vehicleModel);
        if (draft.vehicleNumber || draft.plateNumber) {
          setPlateNumber(draft.vehicleNumber || draft.plateNumber);
        }
      }
    })();
  }, []);

  const handleNextStep = async () => {
    setError(null);
    if (!plateNumber.trim()) {
      setError('Please enter your vehicle plate number (e.g. WP CAB-1234).');
      return;
    }

    const typeMapping: Record<string, string> = {
      Bike: 'MOTORBIKE',
      Tuk: 'THREE_WHEEL',
      Car: 'CAR',
      Van: 'VAN',
      Lorry: 'LORRY',
    };

    const payload = {
      phone,
      mobile: phone,
      vehicleType: typeMapping[selectedVehicle] || 'MOTORBIKE',
      vehicleModel: vehicleModel.trim() || `${selectedVehicle} Standard`,
      vehicleNumber: plateNumber.trim().toUpperCase(),
      plateNumber: plateNumber.trim().toUpperCase(),
    };

    try {
      setLoading(true);
      await saveRegistrationDraft(payload);
      // Non-blocking background sync to backend
      riderApi.registerStep3(payload).catch((backendErr: any) => {
        console.log('Step 3 background sync info:', backendErr?.message || backendErr);
      });
      router.push('/register/step4');
    } catch (err: any) {
      setError(err.message || 'Failed to proceed to step 4.');
    } finally {
      setLoading(false);
    }
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
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Partner Registration</Text>
          <View style={tw`w-6`} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-16`}>
          {/* Step Progress Header */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-sm font-extrabold text-[#0B1044]`}>Step 3 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>Vehicle Information</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-3/5 bg-[#0B1044] rounded-full`} />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={tw`bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2`}>
              <Ionicons name="alert-circle" size={18} color="#E11D48" />
              <Text style={tw`flex-1 text-xs font-bold text-rose-700`}>{error}</Text>
            </View>
          )}

          {/* Select Vehicle Type */}
          <Text style={tw`text-xs font-bold text-slate-700 mb-3`}>Select Vehicle Type *</Text>
          <View style={tw`gap-2.5 mb-5`}>
            {/* Row 1 */}
            <View style={tw`flex-row gap-2.5`}>
              {[
                { id: 'Bike', label: 'Motorbike', icon: 'bicycle-outline' },
                { id: 'Tuk', label: 'Three Wheel', icon: 'bus-outline' },
                { id: 'Car', label: 'Car', icon: 'car-outline' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedVehicle(item.id as any)}
                  style={[
                    tw`flex-1 py-3 px-2 rounded-2xl border items-center justify-center`,
                    selectedVehicle === item.id
                      ? tw`bg-amber-50 border-[#0B1044] border-2`
                      : tw`bg-white border-slate-200`,
                  ]}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={selectedVehicle === item.id ? '#0B1044' : '#64748B'}
                  />
                  <Text
                    style={[
                      tw`text-[11px] font-extrabold mt-1.5`,
                      selectedVehicle === item.id ? tw`text-[#0B1044]` : tw`text-slate-800`,
                    ]}>
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
                  style={[
                    tw`flex-1 py-3 px-2 rounded-2xl border items-center justify-center`,
                    selectedVehicle === item.id
                      ? tw`bg-amber-50 border-[#0B1044] border-2`
                      : tw`bg-white border-slate-200`,
                  ]}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={selectedVehicle === item.id ? '#0B1044' : '#64748B'}
                  />
                  <Text
                    style={[
                      tw`text-[11px] font-extrabold mt-1.5`,
                      selectedVehicle === item.id ? tw`text-[#0B1044]` : tw`text-slate-800`,
                    ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vehicle Model & Plate Inputs */}
          <View style={tw`gap-3 mb-5`}>
            <View>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Vehicle Model</Text>
              <View style={tw`bg-white border border-slate-300 rounded-2xl p-3.5 shadow-xs`}>
                <TextInput
                  value={vehicleModel}
                  onChangeText={setVehicleModel}
                  placeholder="e.g. Honda Dio / Bajaj Pulsar / Suzuki Alto"
                  placeholderTextColor="#94A3B8"
                  style={tw`text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            <View>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Vehicle Plate Number *</Text>
              <View style={tw`bg-white border border-slate-300 rounded-2xl p-3.5 shadow-xs`}>
                <TextInput
                  value={plateNumber}
                  onChangeText={(t) => { setPlateNumber(t); if (error) setError(null); }}
                  placeholder="e.g. WP BDH-5678"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="characters"
                  style={tw`text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            disabled={loading}
            style={[
              tw`w-full rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-3`,
              { backgroundColor: loading ? '#94A3B8' : '#0B1044' },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 4</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFC72C" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={tw`w-full bg-white border border-[#0B1044] rounded-2xl py-3.5 items-center justify-center mb-8`}>
            <Text style={tw`text-[#0B1044] font-extrabold text-sm`}>Back to Address Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
