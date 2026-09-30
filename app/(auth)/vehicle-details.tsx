import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import tw from '@/lib/tw';
import riderApi, { getSavedRider, getRegistrationDraft, saveRegistrationDraft, formatRiderData } from '@/services/api';
import { uploadService } from '@/services/upload-service';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const [rider, setRider] = useState<any>(null);
  const [model, setModel] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [vehiclePhoto, setVehiclePhoto] = useState<string | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [isUploadingVehicle, setIsUploadingVehicle] = useState(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);

  const populateVehicleData = (data: any, savedFallback?: any) => {
    if (!data && !savedFallback) return;
    const d = data || savedFallback || {};
    setRider(d);
    if (d.vehicleModel) setModel(d.vehicleModel);
    if (d.vehicleNumber || d.plateNumber) setPlateNumber(d.vehicleNumber || d.plateNumber);
    if (d.vehicleType) setVehicleType(d.vehicleType);

    const vImg =
      d.vehiclePhoto ||
      d.vehiclePhotoUrl ||
      d.vehicleImage ||
      d.photoUrl ||
      d.photo ||
      d.vehiclePicture ||
      d.user?.vehiclePhoto ||
      d.user?.vehiclePhotoUrl ||
      d.rider?.vehiclePhoto ||
      savedFallback?.vehiclePhoto ||
      savedFallback?.vehiclePhotoUrl;

    if (vImg) setVehiclePhoto(vImg);

    const rDoc =
      d.registrationDoc ||
      d.registrationDocUrl ||
      d.vehicleRegistration ||
      d.registrationDocUri ||
      d.vehicleDoc ||
      d.docUrl ||
      d.registrationCertificate ||
      d.revenueLicense ||
      d.user?.registrationDoc ||
      d.user?.registrationDocUrl ||
      d.rider?.registrationDoc ||
      savedFallback?.registrationDoc ||
      savedFallback?.registrationDocUrl;

    if (rDoc) setRegistrationDoc(rDoc);
  };

  useEffect(() => {
    (async () => {
      const saved = await getSavedRider();
      const draft = await getRegistrationDraft();
      const merged = formatRiderData(draft, saved);
      if (merged) populateVehicleData(merged, saved);

      try {
        const res = await riderApi.getProfile();
        if (res) {
          const formatted = formatRiderData(res, merged || saved);
          populateVehicleData(formatted, res?.user || res?.rider);
        }
      } catch (e) {
        // fallback
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
    Alert.alert('Registration Document 📄', 'Select registration document image for Cloudinary upload (Max 5MB):', [
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

  const handleSaveChanges = async () => {
    try {
      setSaving(true);
      const payload: any = {
        vehicleModel: model.trim(),
        vehicleNumber: plateNumber.trim().toUpperCase(),
        plateNumber: plateNumber.trim().toUpperCase(),
        vehicleType: vehicleType || 'MOTORBIKE',
      };
      if (vehiclePhoto) {
        payload.vehiclePhoto = vehiclePhoto;
        payload.vehiclePhotoUrl = vehiclePhoto;
      }
      if (registrationDoc) {
        payload.registrationDoc = registrationDoc;
        payload.registrationDocUrl = registrationDoc;
      }

      await riderApi.updateProfile(payload);
      await saveRegistrationDraft(payload);
      Alert.alert('Success 🎉', 'Vehicle details and images updated successfully in database!');
    } catch (e: any) {
      Alert.alert('Error ⚠️', e.message || 'Failed to update vehicle details');
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
          <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 flex-row items-center gap-4 shadow-sm mb-5 relative`}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUploadVehiclePhoto}
              disabled={isUploadingVehicle}
              style={tw`w-28 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden items-center justify-center relative`}>
              {vehiclePhoto ? (
                <Image
                  source={{ uri: vehiclePhoto }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              ) : isUploadingVehicle ? (
                <ActivityIndicator size="small" color="#0B1044" />
              ) : (
                <View style={tw`items-center`}>
                  <Ionicons name="bicycle" size={32} color="#94A3B8" />
                  <Text style={tw`text-[9px] font-bold text-[#0B1044] mt-1`}>Add Photo</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={tw`flex-1 pr-2`}>
              <Text style={tw`text-base font-black text-slate-900`}>{model || 'Vehicle'}</Text>
              <Text style={tw`text-xs font-bold text-slate-400 mt-0.5`}>{vehicleType || 'Motorbike'}</Text>

              <Text style={tw`text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2`}>
                PLATE NUMBER
              </Text>
              <Text style={tw`text-sm font-black text-slate-900`}>{plateNumber || 'Not specified'}</Text>

              <View style={tw`bg-emerald-100 self-start px-2 py-0.5 rounded-md mt-2 flex-row items-center gap-1`}>
                <Ionicons name="checkmark-circle" size={12} color="#047857" />
                <Text style={tw`text-[10px] font-black text-emerald-800`}>Verified</Text>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={tw`gap-3.5 mb-5`}>
            {/* Vehicle Model */}
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm`}>
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
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm`}>
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
            <View style={tw`bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm`}>
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

          {/* VEHICLE PHOTO & REGISTRATION CERTIFICATE CARDS */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-3`}>
            VEHICLE DOCUMENTS & PHOTOS
          </Text>

          {/* Vehicle Photo Upload Tile */}
          <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-4`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons name="camera-outline" size={20} color="#0B1044" />
                <Text style={tw`text-sm font-black text-slate-900`}>Vehicle Photo</Text>
              </View>
              <TouchableOpacity onPress={handleUploadVehiclePhoto} style={tw`bg-amber-100 px-3 py-1 rounded-full`}>
                <Text style={tw`text-xs font-black text-[#0B1044]`}>
                  {vehiclePhoto ? 'Change Photo' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>

            {vehiclePhoto ? (
              <TouchableOpacity activeOpacity={0.85} onPress={handleUploadVehiclePhoto} style={tw`h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200`}>
                <Image source={{ uri: vehiclePhoto }} style={tw`w-full h-full`} resizeMode="cover" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleUploadVehiclePhoto}
                style={tw`h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 items-center justify-center`}>
                {isUploadingVehicle ? (
                  <ActivityIndicator size="small" color="#0B1044" />
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={28} color="#94A3B8" />
                    <Text style={tw`text-xs font-bold text-slate-500 mt-1`}>Upload Vehicle Photo (Cloudinary)</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Registration Certificate Document Tile */}
          <View style={tw`bg-white rounded-3xl p-4 border border-slate-200 shadow-sm mb-6`}>
            <View style={tw`flex-row items-center justify-between mb-3`}>
              <View style={tw`flex-row items-center gap-2.5`}>
                <Ionicons name="document-text-outline" size={20} color="#0B1044" />
                <Text style={tw`text-sm font-black text-slate-900`}>Registration Certificate</Text>
              </View>
              <TouchableOpacity onPress={handleUploadRegistrationDoc} style={tw`bg-amber-100 px-3 py-1 rounded-full`}>
                <Text style={tw`text-xs font-black text-[#0B1044]`}>
                  {registrationDoc ? 'Change Doc' : 'Upload'}
                </Text>
              </TouchableOpacity>
            </View>

            {registrationDoc ? (
              <TouchableOpacity activeOpacity={0.85} onPress={() => router.push('/vehicle-document' as any)} style={tw`h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200`}>
                <Image source={{ uri: registrationDoc }} style={tw`w-full h-full`} resizeMode="contain" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleUploadRegistrationDoc}
                style={tw`h-28 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 items-center justify-center`}>
                {isUploadingDoc ? (
                  <ActivityIndicator size="small" color="#0B1044" />
                ) : (
                  <>
                    <Ionicons name="document-attach-outline" size={28} color="#94A3B8" />
                    <Text style={tw`text-xs font-bold text-slate-500 mt-1`}>Upload Registration Document</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Save Action Button */}
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
