import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
<<<<<<< HEAD
  Image,
=======
>>>>>>> 85a2985458da56e75b8bfb3bdd27aeb712afa942
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import tw from '@/lib/tw';
<<<<<<< HEAD
import { riderRegistrationService } from '@/services/rider-registration-service';
import { uploadService } from '@/services/upload-service';

export default function RegisterStep3Screen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [selectedVehicle, setSelectedVehicle] = useState<'Car' | 'Bike' | 'Tuk' | 'Van' | 'Lorry'>(
    (draft.vehicleType as any) || 'Car',
  );
  const [vehicleModel, setVehicleModel] = useState(draft.vehicleModel || '');
  const [plateNumber, setPlateNumber] = useState(draft.plateNumber || '');

  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(draft.vehiclePhoto || null);
  const [registrationDoc, setRegistrationDoc] = useState<string | null>(draft.registrationDoc || null);

  const [isUploadingVehicle, setIsUploadingVehicle] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  // Vehicle Photo Upload handler (Max 5MB)
  const handleUploadVehiclePhoto = () => {
    Alert.alert('Vehicle Photo 🚗', 'Select photo source for Cloudinary CDN upload (Max 5MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            quality: 0.4,
            base64: true,
          });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingVehicle(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/vehicles', 5 * 1024 * 1024);
              if (uploaded?.url) setVehiclePhoto(uploaded.url);
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
          const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.4,
            base64: true,
          });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingVehicle(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/vehicles', 5 * 1024 * 1024);
              if (uploaded?.url) setVehiclePhoto(uploaded.url);
            } finally {
              setIsUploadingVehicle(false);
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Registration Document Upload handler (Max 10MB)
  const handleUploadRegistrationDoc = () => {
    Alert.alert('Registration Document 📄', 'Select Revenue License / Log Book photo for Cloudinary (Max 10MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            quality: 0.4,
            base64: true,
          });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingDoc(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/documents', 10 * 1024 * 1024);
              if (uploaded?.url) setRegistrationDoc(uploaded.url);
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
          const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.4,
            base64: true,
          });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingDoc(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/documents', 10 * 1024 * 1024);
              if (uploaded?.url) setRegistrationDoc(uploaded.url);
            } finally {
              setIsUploadingDoc(false);
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleNextStep = () => {
    if (!vehicleModel.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your Vehicle Model.');
      return;
    }
    if (!plateNumber.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your Vehicle Plate Number.');
      return;
    }
    if (!vehiclePhoto) {
      Alert.alert('Validation Error ⚠️', 'Please upload your Vehicle Photo.');
      return;
    }
    if (!registrationDoc) {
      Alert.alert('Validation Error ⚠️', 'Please upload your Vehicle Registration Document (Revenue License).');
      return;
    }

    riderRegistrationService.setDraft({
      vehicleType: selectedVehicle,
      vehicleModel: vehicleModel.trim(),
      plateNumber: plateNumber.trim(),
      vehiclePhoto: vehiclePhoto,
      registrationDoc: registrationDoc,
    });

    router.push('/register/step4');
=======
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
>>>>>>> 85a2985458da56e75b8bfb3bdd27aeb712afa942
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
<<<<<<< HEAD
                { id: 'Bike', label: 'Bike', icon: 'bicycle-outline' },
                { id: 'Tuk', label: 'Tuk-Tuk', icon: 'bus-outline' },
=======
>>>>>>> 85a2985458da56e75b8bfb3bdd27aeb712afa942
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
<<<<<<< HEAD
            <View style={tw`bg-white border border-slate-300 rounded-2xl p-3.5`}>
              <Text style={tw`text-[11px] font-bold text-slate-500 mb-1`}>Vehicle Model *</Text>
              <TextInput
                value={vehicleModel}
                onChangeText={setVehicleModel}
                placeholder="e.g. Toyota Vitz 2018 / TVS King 2021"
                placeholderTextColor="#94A3B8"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>

            <View style={tw`bg-white border border-slate-300 rounded-2xl p-3.5`}>
              <Text style={tw`text-[11px] font-bold text-slate-500 mb-1`}>Vehicle Plate Number *</Text>
              <TextInput
                value={plateNumber}
                onChangeText={setPlateNumber}
                placeholder="e.g. WP CAB-1234 / CP AB-5678"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>
          </View>

          {/* Vehicle Photo Upload Box */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUploadVehiclePhoto}
            style={tw`border-2 border-dashed ${
              vehiclePhoto ? 'border-emerald-500 bg-emerald-50/40' : 'border-slate-300 bg-white'
            } rounded-3xl p-5 items-center justify-center mb-4 overflow-hidden relative`}>
            {vehiclePhoto ? (
              <View style={tw`items-center`}>
                <Image source={{ uri: vehiclePhoto }} style={tw`w-24 h-20 rounded-xl mb-2`} />
                <Text style={tw`text-xs font-black text-emerald-800`}>Vehicle Photo Uploaded ☁️</Text>
                <Text style={tw`text-[10px] font-semibold text-slate-500 mt-0.5`}>Tap to re-upload photo</Text>
              </View>
            ) : isUploadingVehicle ? (
              <ActivityIndicator size="large" color="#2563EB" />
            ) : (
              <>
                <View style={tw`w-10 h-10 rounded-full bg-[#030626] items-center justify-center shadow-xs`}>
                  <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
                </View>
                <Text style={tw`text-xs font-black text-slate-900 mt-2`}>Vehicle Photo *</Text>
                <Text style={tw`text-[10px] font-medium text-slate-500 mt-0.5 text-center`}>
                  Clear photo of front & side (Uploaded to Cloudinary CDN, Max 5MB)
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
            } rounded-3xl p-5 items-center justify-center mb-5 overflow-hidden relative`}>
            {registrationDoc ? (
              <View style={tw`items-center`}>
                <Ionicons name="checkmark-circle" size={32} color="#059669" />
                <Text style={tw`text-xs font-black text-emerald-800 mt-1`}>Registration Doc Uploaded ☁️</Text>
                <Text style={tw`text-[10px] font-semibold text-slate-500 mt-0.5`}>Tap to re-upload Revenue License</Text>
              </View>
            ) : isUploadingDoc ? (
              <ActivityIndicator size="large" color="#D97706" />
            ) : (
              <>
                <View style={tw`w-10 h-10 rounded-full bg-amber-400 items-center justify-center shadow-xs`}>
                  <Ionicons name="document-text-outline" size={20} color="#030626" />
                </View>
                <Text style={tw`text-xs font-black text-slate-900 mt-2`}>Vehicle Registration Document *</Text>
                <Text style={tw`text-[10px] font-medium text-slate-500 mt-0.5 text-center`}>
                  Upload clear photo of Revenue License / Log Book (Cloudinary, Max 10MB)
                </Text>
              </>
            )}
          </TouchableOpacity>

=======
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

>>>>>>> 85a2985458da56e75b8bfb3bdd27aeb712afa942
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
<<<<<<< HEAD
=======

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={tw`w-full bg-white border border-[#0B1044] rounded-2xl py-3.5 items-center justify-center mb-8`}>
            <Text style={tw`text-[#0B1044] font-extrabold text-sm`}>Back to Address Details</Text>
          </TouchableOpacity>
>>>>>>> 85a2985458da56e75b8bfb3bdd27aeb712afa942
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
