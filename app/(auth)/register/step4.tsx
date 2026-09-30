import React, { useState, useMemo } from 'react';
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
import { uploadService } from '@/services/upload-service';
import { formatExpiryDateInput, validateExpiryDate, normalizeExpiryDate } from '@/constants/validation';

export default function RegisterStep4Screen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [licenseNumber, setLicenseNumber] = useState(draft.licenseNumber || '');
  const [rawExpiryDate, setRawExpiryDate] = useState(draft.licenseExpiryDate || '');

  const [licenseFrontPhoto, setLicenseFrontPhoto] = useState<string | null>(draft.licenseFrontPhoto || null);
  const [licenseBackPhoto, setLicenseBackPhoto] = useState<string | null>(draft.licenseBackPhoto || null);
  const [policeClearanceDoc, setPoliceClearanceDoc] = useState<string | null>(draft.policeClearanceDoc || null);

  const [isUploadingFront, setIsUploadingFront] = useState(false);
  const [isUploadingBack, setIsUploadingBack] = useState(false);
  const [isUploadingPolice, setIsUploadingPolice] = useState(false);

  const formattedExpiryDate = useMemo(() => formatExpiryDateInput(rawExpiryDate), [rawExpiryDate]);
  const expiryValidation = useMemo(() => validateExpiryDate(formattedExpiryDate), [formattedExpiryDate]);

  const handleExpiryTextChange = (text: string) => {
    setRawExpiryDate(formatExpiryDateInput(text));
  };

  const handleExpiryBlur = () => {
    const normalized = normalizeExpiryDate(formattedExpiryDate);
    if (normalized !== formattedExpiryDate) {
      setRawExpiryDate(normalized);
    }
  };

  const handleUploadFront = () => {
    Alert.alert('License Front Photo 📷', 'Select License Front photo for Cloudinary CDN (Max 5MB):', [
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

  const handleUploadBack = () => {
    Alert.alert('License Back Photo 📷', 'Select License Back photo for Cloudinary CDN (Max 5MB):', [
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

  const handleUploadPoliceClearance = () => {
    Alert.alert('Police Clearance Certificate 📜', 'Upload Police Clearance photo / document for Cloudinary (Max 10MB):', [
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

  const isFormValid =
    licenseNumber.trim().length >= 4 &&
    expiryValidation.isValid &&
    licenseFrontPhoto !== null &&
    licenseBackPhoto !== null;

  const handleNextStep = () => {
    if (!licenseNumber.trim()) return Alert.alert('Validation Error ⚠️', 'Please enter your Driving License Number.');
    if (!expiryValidation.isValid) return Alert.alert('Validation Error ⚠️', expiryValidation.errorMessage || 'Invalid Expiry Date.');
    if (!licenseFrontPhoto) return Alert.alert('Validation Error ⚠️', 'Please upload your License Front Side photo.');
    if (!licenseBackPhoto) return Alert.alert('Validation Error ⚠️', 'Please upload your License Back Side photo.');

    const finalExpiry = expiryValidation.normalizedValue || formattedExpiryDate;

    riderRegistrationService.setDraft({
      licenseNumber: licenseNumber.trim().toUpperCase(),
      licenseExpiryDate: finalExpiry,
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
        {/* Top Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={26} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Partner Registration</Text>
          <View style={tw`w-6`} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`p-5 pb-44`}
          keyboardShouldPersistTaps="handled">
          {/* Step Progress Header */}
          <View style={tw`mb-5`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-sm font-extrabold text-[#0B1044]`}>Step 4 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>License & Verification</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-4/5 bg-[#0B1044] rounded-full`} />
            </View>
          </View>

          {/* Form Inputs */}
          <View style={tw`gap-4 mb-6`}>
            {/* License Number Input */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5 shadow-sm`}>
              <Text style={tw`text-[11px] font-bold text-[#0B1044] mb-1`}>Driving License Number *</Text>
              <TextInput
                value={licenseNumber}
                onChangeText={setLicenseNumber}
                placeholder="e.g. B1234567"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>

            {/* Expiry Date Input with Auto Hyphenation YYYY-MM-DD */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5 shadow-sm`}>
              <Text style={tw`text-[11px] font-bold text-[#0B1044] mb-1`}>License Expiry Date (YYYY-MM-DD) *</Text>
              <TextInput
                value={formattedExpiryDate}
                onChangeText={handleExpiryTextChange}
                onBlur={handleExpiryBlur}
                placeholder="2028-12-31"
                placeholderTextColor="#94A3B8"
                keyboardType="numeric"
                maxLength={10}
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
              <Text style={tw`text-[10px] text-slate-500 mt-1`}>💡 Hyphens (-) auto-insert after year and month.</Text>
              {formattedExpiryDate.length > 0 && !expiryValidation.isValid && (
                <Text style={tw`text-[11px] font-medium text-red-600 mt-1`}>⚠️ {expiryValidation.errorMessage}</Text>
              )}
            </View>
          </View>

          {/* LICENSE PHOTOS */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-3`}>
            DRIVING LICENSE PHOTOS * (Cloudinary CDN, Max 5MB)
          </Text>
          <View style={tw`flex-row gap-3 mb-6`}>
            {/* Front Side Tile with Fixed Height h-44 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUploadFront}
              disabled={isUploadingFront}
              style={tw`flex-1 h-44 border ${
                licenseFrontPhoto ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-dashed border-indigo-300'
              } rounded-3xl p-2 items-center justify-center shadow-sm relative overflow-hidden`}>
              {licenseFrontPhoto ? (
                <Image source={{ uri: licenseFrontPhoto }} style={tw`w-full h-full rounded-2xl`} resizeMode="cover" />
              ) : isUploadingFront ? (
                <ActivityIndicator size="small" color="#0B1044" />
              ) : (
                <View style={tw`items-center p-2`}>
                  <Ionicons name="cloud-upload-outline" size={28} color="#0B1044" />
                  <Text style={tw`text-xs font-bold text-slate-800 mt-1 text-center`}>License Front *</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Back Side Tile with Fixed Height h-44 */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleUploadBack}
              disabled={isUploadingBack}
              style={tw`flex-1 h-44 border ${
                licenseBackPhoto ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-dashed border-indigo-300'
              } rounded-3xl p-2 items-center justify-center shadow-sm relative overflow-hidden`}>
              {licenseBackPhoto ? (
                <Image source={{ uri: licenseBackPhoto }} style={tw`w-full h-full rounded-2xl`} resizeMode="cover" />
              ) : isUploadingBack ? (
                <ActivityIndicator size="small" color="#0B1044" />
              ) : (
                <View style={tw`items-center p-2`}>
                  <Ionicons name="cloud-upload-outline" size={28} color="#0B1044" />
                  <Text style={tw`text-xs font-bold text-slate-800 mt-1 text-center`}>License Back *</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Police Clearance Certificate */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-2`}>
            POLICE CLEARANCE CERTIFICATE (Optional)
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUploadPoliceClearance}
            disabled={isUploadingPolice}
            style={tw`border ${
              policeClearanceDoc ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-dashed border-slate-300'
            } rounded-2xl p-4 flex-row items-center justify-between mb-8 shadow-sm`}>
            <View style={tw`flex-row items-center gap-3`}>
              <Ionicons name="document-attach-outline" size={24} color="#0B1044" />
              <View>
                <Text style={tw`text-xs font-bold text-slate-900`}>Police Clearance Doc</Text>
                <Text style={tw`text-[10px] text-slate-500`}>
                  {policeClearanceDoc ? 'Document Uploaded to Cloudinary' : 'Upload certificate (Max 10MB)'}
                </Text>
              </View>
            </View>
            <Ionicons name={policeClearanceDoc ? 'checkmark-circle' : 'add-circle-outline'} size={24} color="#0B1044" />
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleNextStep}
            disabled={!isFormValid}
            style={tw`py-4 rounded-xl items-center justify-center ${isFormValid ? 'bg-[#0B1044]' : 'bg-slate-300'}`}>
            <Text style={tw`text-base font-extrabold text-white`}>Next: Banking & Payout Details ➔</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
