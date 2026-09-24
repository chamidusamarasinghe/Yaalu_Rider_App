import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import tw from '@/lib/tw';
import { riderRegistrationService } from '@/services/rider-registration-service';
import { saveRegistrationDraft, getRegistrationDraft } from '@/services/api';
import { uploadService } from '@/services/upload-service';

export default function RegisterStep3Screen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [selectedVehicle, setSelectedVehicle] = useState<'Bike' | 'Tuk' | 'Car' | 'Van' | 'Lorry'>(
    (draft.vehicleType as any) || 'Bike'
  );
  const [vehicleModel, setVehicleModel] = useState(draft.vehicleModel || '');
  const [plateNumber, setPlateNumber] = useState(draft.plateNumber || '');

  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(draft.vehiclePhoto || null);
  const [registrationDoc, setRegistrationDoc] = useState<string | null>(draft.registrationDoc || null);

  const [isUploadingVehicle, setIsUploadingVehicle] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const savedDraft = await getRegistrationDraft();
      if (savedDraft) {
        if (savedDraft.vehicleType) setSelectedVehicle(savedDraft.vehicleType);
        if (savedDraft.vehicleModel) setVehicleModel(savedDraft.vehicleModel);
        if (savedDraft.plateNumber) setPlateNumber(savedDraft.plateNumber);
        if (savedDraft.vehiclePhoto) setVehiclePhoto(savedDraft.vehiclePhoto);
        if (savedDraft.registrationDoc) setRegistrationDoc(savedDraft.registrationDoc);
      }
    })();
  }, []);

  const handleUploadVehiclePhoto = () => {
    Alert.alert('Vehicle Photo 📸', 'Select photo source for Cloudinary upload (Max 5MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.4, base64: true });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingVehicle(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/vehicles', 5 * 1024 * 1024);
              if (uploaded?.url) {
                setVehiclePhoto(uploaded.url);
                riderRegistrationService.setDraft({ vehiclePhoto: uploaded.url });
                await saveRegistrationDraft({ vehiclePhoto: uploaded.url });
              }
            } catch (err: any) {
              Alert.alert('Upload Error', err?.message || 'Failed to upload vehicle photo.');
            } finally {
              setIsUploadingVehicle(false);
            }
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Gallery permission required.');
          const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.4, base64: true });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingVehicle(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/vehicles', 5 * 1024 * 1024);
              if (uploaded?.url) {
                setVehiclePhoto(uploaded.url);
                riderRegistrationService.setDraft({ vehiclePhoto: uploaded.url });
                await saveRegistrationDraft({ vehiclePhoto: uploaded.url });
              }
            } catch (err: any) {
              Alert.alert('Upload Error', err?.message || 'Failed to upload vehicle photo.');
            } finally {
              setIsUploadingVehicle(false);
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleUploadRegistrationDoc = () => {
    Alert.alert('Registration Document 📄', 'Select registration document image (Max 5MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.4, base64: true });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingDoc(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/documents', 5 * 1024 * 1024);
              if (uploaded?.url) {
                setRegistrationDoc(uploaded.url);
                riderRegistrationService.setDraft({ registrationDoc: uploaded.url });
                await saveRegistrationDraft({ registrationDoc: uploaded.url });
              }
            } catch (err: any) {
              Alert.alert('Upload Error', err?.message || 'Failed to upload registration document.');
            } finally {
              setIsUploadingDoc(false);
            }
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Gallery permission required.');
          const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.4, base64: true });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingDoc(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/documents', 5 * 1024 * 1024);
              if (uploaded?.url) {
                setRegistrationDoc(uploaded.url);
                riderRegistrationService.setDraft({ registrationDoc: uploaded.url });
                await saveRegistrationDraft({ registrationDoc: uploaded.url });
              }
            } catch (err: any) {
              Alert.alert('Upload Error', err?.message || 'Failed to upload registration document.');
            } finally {
              setIsUploadingDoc(false);
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleNextStep = async () => {
    setError(null);
    if (!plateNumber.trim()) {
      setError('Please enter your vehicle plate number (e.g. WP CAB-1234).');
      return;
    }

    const vehicleData = {
      vehicleType: selectedVehicle,
      vehicleModel: vehicleModel.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      vehiclePhoto: vehiclePhoto || undefined,
      registrationDoc: registrationDoc || undefined,
    };

    try {
      setLoading(true);
      riderRegistrationService.setDraft(vehicleData);
      await saveRegistrationDraft(vehicleData);
      router.push('/register/step4');
    } catch (err: any) {
      setError(err?.message || 'Failed to save vehicle details.');
    } finally {
      setLoading(false);
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
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Rider Registration (3/5)</Text>
          <View style={tw`w-6`} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-24`}>
          {/* Progress Indicator */}
          <View style={tw`flex-row items-center justify-between mb-5`}>
            <Text style={tw`text-xs font-black text-slate-500`}>Step 3 of 5</Text>
            <View style={tw`flex-row gap-1`}>
              <View style={tw`w-6 h-1.5 rounded-full bg-[#0B1044]`} />
              <View style={tw`w-6 h-1.5 rounded-full bg-[#0B1044]`} />
              <View style={tw`w-6 h-1.5 rounded-full bg-[#0B1044]`} />
              <View style={tw`w-6 h-1.5 rounded-full bg-slate-200`} />
              <View style={tw`w-6 h-1.5 rounded-full bg-slate-200`} />
            </View>
          </View>

          {/* Section Title */}
          <Text style={tw`text-2xl font-black text-slate-900 mb-1`}>Vehicle Information</Text>
          <Text style={tw`text-xs font-semibold text-slate-500 mb-6`}>
            Select your delivery vehicle type and provide details.
          </Text>

          {error && (
            <View style={tw`bg-red-50 border border-red-200 rounded-2xl p-3.5 mb-5 flex-row items-center gap-2`}>
              <Ionicons name="alert-circle" size={18} color="#DC2626" />
              <Text style={tw`text-xs font-bold text-red-700 flex-1`}>{error}</Text>
            </View>
          )}

          {/* Vehicle Type Picker */}
          <Text style={tw`text-xs font-bold text-slate-700 mb-2`}>Vehicle Type *</Text>
          <View style={tw`gap-2.5 mb-5`}>
            {/* Row 1 */}
            <View style={tw`flex-row gap-2.5`}>
              {[
                { id: 'Bike', label: 'Motorbike', icon: 'bicycle-outline' },
                { id: 'Tuk', label: 'Three-Wheel', icon: 'car-sport-outline' },
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
                  placeholder="e.g. Honda Dio / TVS King / Suzuki Alto"
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

          {/* Vehicle Photo Upload Box */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUploadVehiclePhoto}
            style={tw`border-2 border-dashed ${
              vehiclePhoto ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-300 bg-white'
            } rounded-3xl p-4 items-center justify-center mb-4 overflow-hidden relative`}>
            {vehiclePhoto ? (
              <View style={tw`items-center`}>
                <Image source={{ uri: vehiclePhoto }} style={tw`w-24 h-20 rounded-xl mb-2`} resizeMode="cover" />
                <Text style={tw`text-xs font-black text-emerald-800`}>Vehicle Photo Uploaded ✓</Text>
                <Text style={tw`text-[10px] font-semibold text-slate-500 mt-0.5`}>Tap to re-upload photo</Text>
              </View>
            ) : isUploadingVehicle ? (
              <ActivityIndicator size="small" color="#0B1044" />
            ) : (
              <>
                <View style={tw`w-10 h-10 rounded-full bg-[#0B1044] items-center justify-center shadow-xs`}>
                  <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                </View>
                <Text style={tw`text-xs font-black text-slate-900 mt-2`}>Vehicle Photo</Text>
                <Text style={tw`text-[10px] font-medium text-slate-500 mt-0.5 text-center`}>
                  Tap to upload clear photo of front & side of your vehicle
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Registration Doc Upload Box */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUploadRegistrationDoc}
            style={tw`border-2 border-dashed ${
              registrationDoc ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-300 bg-white'
            } rounded-3xl p-4 items-center justify-center mb-5 overflow-hidden relative`}>
            {registrationDoc ? (
              <View style={tw`items-center`}>
                <Ionicons name="checkmark-circle" size={32} color="#059669" />
                <Text style={tw`text-xs font-black text-emerald-800 mt-1`}>Registration Doc Uploaded ✓</Text>
                <Text style={tw`text-[10px] font-semibold text-slate-500 mt-0.5`}>Tap to re-upload Revenue License</Text>
              </View>
            ) : isUploadingDoc ? (
              <ActivityIndicator size="small" color="#D97706" />
            ) : (
              <>
                <View style={tw`w-10 h-10 rounded-full bg-amber-400 items-center justify-center shadow-xs`}>
                  <Ionicons name="document-text-outline" size={20} color="#0B1044" />
                </View>
                <Text style={tw`text-xs font-black text-slate-900 mt-2`}>Vehicle Registration Document</Text>
                <Text style={tw`text-[10px] font-medium text-slate-500 mt-0.5 text-center`}>
                  Tap to upload Revenue License / Log Book photo
                </Text>
              </>
            )}
          </TouchableOpacity>

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
            style={tw`w-full bg-[#0B1044] rounded-2xl py-3.5 items-center justify-center mb-8`}>
            <Text style={tw`text-white font-extrabold text-sm`}>Back to Address Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
