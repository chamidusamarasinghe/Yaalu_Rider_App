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
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import tw from '@/lib/tw';
import { riderRegistrationService } from '@/services/rider-registration-service';
import { uploadService } from '@/services/upload-service';

export default function RegisterStep1Screen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [firstName, setFirstName] = useState(draft.firstName || '');
  const [lastName, setLastName] = useState(draft.lastName || '');
  const [phone, setPhone] = useState(draft.phone || draft.phoneNumber || '');
  const [nic, setNic] = useState(draft.nicNumber || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(draft.profilePicture || null);
  const [isUploading, setIsUploading] = useState(false);

  const processAndUploadPhoto = async (localUri: string) => {
    setIsUploading(true);
    setProfilePicture(localUri);

    try {
      // Security Check: Max 5MB limit for photo upload
      const res = await uploadService.uploadMedia(localUri, 'yaalu/riders/profiles', 5 * 1024 * 1024);
      if (res && res.url) {
        setProfilePicture(res.url);
        Alert.alert('Upload Success ☁️', 'Profile photo uploaded to Cloudinary CDN successfully!');
      }
    } catch (err: any) {
      console.warn('[Cloudinary Profile Upload Error]:', err?.message || err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePickImage = () => {
    Alert.alert('Profile Photo 📷', 'Select photo source for Cloudinary upload (Max 5MB):', [
      {
        text: 'Take Photo (Camera)',
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Camera access is required to take a photo.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4,
            base64: true,
          });
          if (!result.canceled && result.assets && result.assets[0]) {
            const uriOrBase64 = result.assets[0].base64
              ? `data:image/jpeg;base64,${result.assets[0].base64}`
              : result.assets[0].uri;
            await processAndUploadPhoto(uriOrBase64);
          }
        },
      },
      {
        text: 'Choose from Gallery',
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Required', 'Photo library access is required to select a photo.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.4,
            base64: true,
          });
          if (!result.canceled && result.assets && result.assets[0]) {
            const uriOrBase64 = result.assets[0].base64
              ? `data:image/jpeg;base64,${result.assets[0].base64}`
              : result.assets[0].uri;
            await processAndUploadPhoto(uriOrBase64);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleNextStep = () => {
    if (!firstName.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your First Name.');
      return;
    }
    if (!lastName.trim()) {
      Alert.alert('Validation Error ⚠️', 'Please enter your Last Name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 9) {
      Alert.alert('Validation Error ⚠️', 'Please enter a valid Phone Number.');
      return;
    }
    if (!nic.trim() || nic.trim().length < 9) {
      Alert.alert('Validation Error ⚠️', 'Please enter a valid NIC Number.');
      return;
    }

    // Save step 1 draft state
    riderRegistrationService.setDraft({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      phoneNumber: phone.trim(),
      nicNumber: nic.trim(),
      profilePicture: profilePicture || undefined,
    });

    router.push('/register/step2');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-white`}>
        {/* Top Gold Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={24} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Partner Registration</Text>
          <View style={tw`w-6`} />
        </View>

        {/* Step Progress Bar Header */}
        <View style={tw`px-6 pt-4 pb-2`}>
          <View style={tw`flex-row justify-between items-center mb-1.5`}>
            <Text style={tw`text-sm font-extrabold text-indigo-900`}>Step 1 of 5</Text>
            <Text style={tw`text-sm font-medium text-slate-600`}>Personal Details</Text>
          </View>
          <View style={tw`h-2 w-full bg-slate-100 rounded-full overflow-hidden`}>
            <View style={tw`h-full w-1/5 bg-[#0B1044] rounded-full`} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-6 pb-10`}>
          <Text style={tw`text-2xl font-black text-slate-900`}>Partner with Yaalu</Text>
          <Text style={tw`text-xs text-slate-500 mt-1 mb-5 leading-4`}>
            Join thousands of riders earning on their own schedule. Fill in your details to get started.
          </Text>

          {/* Personal Information Card */}
          <View style={tw`bg-[#F0F4FE] rounded-2xl p-5 border border-indigo-100 shadow-sm`}>
            <View style={tw`flex-row items-center gap-2 mb-4`}>
              <Ionicons name="person-outline" size={20} color="#1D267D" />
              <Text style={tw`text-base font-extrabold text-[#0B1044]`}>Personal Information</Text>
            </View>

            {/* Profile Photo Upload Badge */}
            <View style={tw`items-center my-2`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePickImage}
                style={tw`w-24 h-24 rounded-full border-2 border-dashed border-indigo-400 bg-white items-center justify-center shadow-xs overflow-hidden relative`}>
                {profilePicture ? (
                  <Image source={{ uri: profilePicture }} style={tw`w-full h-full rounded-full`} />
                ) : isUploading ? (
                  <ActivityIndicator size="small" color="#2563EB" />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={28} color="#2563EB" />
                    <Text style={tw`text-[9px] font-extrabold text-indigo-900 mt-1 uppercase`}>PROFILE PHOTO</Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={tw`text-[10px] font-bold text-indigo-900 mt-1.5 text-center`} onPress={handlePickImage}>
                {isUploading
                  ? 'Uploading photo to Cloudinary...'
                  : profilePicture
                  ? 'Photo Uploaded ☁️ (Tap to change)'
                  : 'Tap to upload profile photo (Cloudinary, Max 5MB)'}
              </Text>
            </View>

            {/* First Name & Last Name Grid */}
            <View style={tw`flex-row gap-3 mt-4 mb-3`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>First Name *</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="John"
                  style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Last Name *</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Doe"
                  style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Phone Number *</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+94 77 123 4567"
                style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
              />
            </View>

            {/* NIC Number Input */}
            <View style={tw`mb-2`}>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>NIC Number *</Text>
              <TextInput
                value={nic}
                onChangeText={setNic}
                placeholder="199512304567V"
                autoCapitalize="characters"
                style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            style={tw`bg-[#070A2A] rounded-xl py-4 flex-row items-center justify-center gap-2 mt-6 shadow-md`}>
            <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 2</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Footer Terms Note */}
          <Text style={tw`text-[11px] text-slate-400 text-center mt-4 leading-4`}>
            By continuing, you agree to Yaalu's <Text style={tw`text-indigo-700 underline`}>Terms of Service</Text> and <Text style={tw`text-indigo-700 underline`}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
