import React, { useState } from 'react';
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
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import tw from '@/lib/tw';
import { riderRegistrationService } from '@/services/rider-registration-service';
import { uploadService } from '@/services/upload-service';

export default function RegisterStep4Screen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [licenseNumber, setLicenseNumber] = useState(draft.licenseNumber || '');
  const [expiryDate, setExpiryDate] = useState(draft.licenseExpiryDate || '');

  const [licenseFrontPhoto, setLicenseFrontPhoto] = useState<string | null>(draft.licenseFrontPhoto || null);
  const [licenseBackPhoto, setLicenseBackPhoto] = useState<string | null>(draft.licenseBackPhoto || null);
  const [policeClearanceDoc, setPoliceClearanceDoc] = useState<string | null>(draft.policeClearanceDoc || null);

  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);
  const [isUploadingPolice, setIsUploadingPolice] = useState(false);

  // License Front Photo Upload (Max 5MB)
  const handleUploadFront = () => {
    Alert.alert('License Front Photo 🪪', 'Select License Front photo for Cloudinary CDN (Max 5MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.4, base64: true });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingFront(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/licenses', 5 * 1024 * 1024);
              if (uploaded?.url) setLicenseFrontPhoto(uploaded.url);
            } finally {
              setIsUploadingFront(false);
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
            setIsUploadingFront(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/licenses', 5 * 1024 * 1024);
              if (uploaded?.url) setLicenseFrontPhoto(uploaded.url);
            } finally {
              setIsUploadingFront(false);
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // License Back Photo Upload (Max 5MB)
  const handleUploadBack = () => {
    Alert.alert('License Back Photo 🪪', 'Select License Back photo for Cloudinary CDN (Max 5MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.4, base64: true });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingBack(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/licenses', 5 * 1024 * 1024);
              if (uploaded?.url) setLicenseBackPhoto(uploaded.url);
            } finally {
              setIsUploadingBack(false);
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
            setIsUploadingBack(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/licenses', 5 * 1024 * 1024);
              if (uploaded?.url) setLicenseBackPhoto(uploaded.url);
            } finally {
              setIsUploadingBack(false);
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Police Clearance Document Upload (Max 10MB)
  const handleUploadPoliceClearance = () => {
    Alert.alert('Police Clearance Certificate 🛡️', 'Upload Police Clearance photo / document for Cloudinary (Max 10MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.4, base64: true });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            setIsUploadingPolice(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/clearances', 10 * 1024 * 1024);
              if (uploaded?.url) setPoliceClearanceDoc(uploaded.url);
            } finally {
              setIsUploadingPolice(false);
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
            setIsUploadingPolice(true);
            try {
              const uploaded = await uploadService.uploadMedia(uri, 'yaalu/riders/clearances', 10 * 1024 * 1024);
              if (uploaded?.url) setPoliceClearanceDoc(uploaded.url);
            } finally {
              setIsUploadingPolice(false);
            }
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleNextStep = () => {
    if (!licenseNumber.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your Driving License Number.');
      return;
    }
    if (!expiryDate.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your License Expiry Date.');
      return;
    }
    if (!licenseFrontPhoto) {
      Alert.alert('Validation Error ⚠️', 'Please upload your License Front Side photo.');
      return;
    }
    if (!licenseBackPhoto) {
      Alert.alert('Validation Error ⚠️', 'Please upload your License Back Side photo.');
      return;
    }

    riderRegistrationService.setDraft({
      licenseNumber: licenseNumber.trim(),
      licenseExpiryDate: expiryDate.trim(),
      licenseFrontPhoto: licenseFrontPhoto,
      licenseBackPhoto: licenseBackPhoto,
      policeClearanceDoc: policeClearanceDoc || undefined,
    });

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
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Partner Registration</Text>
          <View style={tw`w-6`} />
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

          {/* Form Inputs */}
          <View style={tw`gap-4 mb-6`}>
            {/* License Number Input */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5`}>
              <Text style={tw`text-[11px] font-bold text-blue-600 mb-1`}>Driving License Number *</Text>
              <TextInput
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                placeholder="e.g. B1234567"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>

            {/* Expiry Date Input */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5`}>
              <Text style={tw`text-[11px] font-bold text-blue-600 mb-1`}>License Expiry Date *</Text>
              <TextInput
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="YYYY-MM-DD (e.g. 2028-12-31)"
                placeholderTextColor="#94A3B8"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>
          </View>

          {/* LICENSE PHOTOS */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-3`}>
            LICENSE PHOTOS * (Cloudinary CDN, Max 5MB)
          </Text>
          <View style={tw`flex-row gap-3 mb-6`}>
            {/* Front Side */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUploadFront}
              style={tw`flex-1 border ${
                licenseFrontPhoto ? 'bg-emerald-50 border-emerald-500' : 'bg-blue-50/50 border-slate-200'
              } rounded-3xl p-4 items-center justify-center py-6 shadow-xs`}>
              {licenseFrontPhoto ? (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#059669" />
                  <Text style={tw`text-xs font-black text-emerald-800 mt-1`}>Front Uploaded ☁️</Text>
                </>
              ) : isUploadingFront ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={26} color="#2563EB" />
                  <Text style={tw`text-xs font-extrabold text-slate-800 mt-2`}>Front Side *</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Back Side */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUploadBack}
              style={tw`flex-1 border ${
                licenseBackPhoto ? 'bg-emerald-50 border-emerald-500' : 'bg-blue-50/50 border-slate-200'
              } rounded-3xl p-4 items-center justify-center py-6 shadow-xs`}>
              {licenseBackPhoto ? (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="#059669" />
                  <Text style={tw`text-xs font-black text-emerald-800 mt-1`}>Back Uploaded ☁️</Text>
                </>
              ) : isUploadingBack ? (
                <ActivityIndicator size="small" color="#2563EB" />
              ) : (
                <>
                  <Ionicons name="camera-outline" size={26} color="#2563EB" />
                  <Text style={tw`text-xs font-extrabold text-slate-800 mt-2`}>Back Side *</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* VERIFICATION DOCUMENTS */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-3`}>
            VERIFICATION DOCUMENTS (Cloudinary CDN, Max 10MB)
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUploadPoliceClearance}
            style={tw`border ${
              policeClearanceDoc ? 'bg-emerald-50 border-emerald-500' : 'bg-blue-50/50 border-slate-200'
            } rounded-3xl p-4 flex-row items-center justify-between shadow-xs mb-5`}>
            <View style={tw`flex-row items-center gap-3 flex-1`}>
              <View style={tw`w-12 h-12 rounded-full bg-emerald-600 items-center justify-center shadow-xs`}>
                <Ionicons name="shield-checkmark" size={24} color="#FFFFFF" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-black text-slate-900`}>Police Clearance Certificate</Text>
                <Text style={tw`text-xs font-medium text-slate-500 mt-0.5`}>
                  {policeClearanceDoc ? 'Certificate Uploaded to Cloudinary ☁️' : 'Upload photo or document (Optional)'}
                </Text>
              </View>
            </View>
            {isUploadingPolice ? (
              <ActivityIndicator size="small" color="#059669" />
            ) : (
              <Feather name={policeClearanceDoc ? 'check' : 'upload'} size={20} color={policeClearanceDoc ? '#059669' : '#475569'} />
            )}
          </TouchableOpacity>

          {/* Primary Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            style={tw`w-full bg-[#030626] rounded-2xl py-4 flex-row items-center justify-center gap-2 shadow-md mb-4`}>
            <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 5</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
