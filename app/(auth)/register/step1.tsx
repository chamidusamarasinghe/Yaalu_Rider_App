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
import CountryCodePicker from '@/components/CountryCodePicker';
import {
  validatePhoneNumber,
  validateNicNumber,
  validateEmail,
  CountryCodeItem,
} from '@/constants/validation';

export default function RegisterStep1Screen() {
  const router = useRouter();
  const draft = riderRegistrationService.getDraft();

  const [firstName, setFirstName] = useState(draft.firstName || '');
  const [lastName, setLastName] = useState(draft.lastName || '');
  const [countryCode, setCountryCode] = useState<string>('+94');
  const [phone, setPhone] = useState(draft.phone || draft.phoneNumber || '');
  const [email, setEmail] = useState(draft.email || '');
  const [nic, setNic] = useState(draft.nicNumber || '');
  const [profilePicture, setProfilePicture] = useState<string | null>(draft.profilePicture || null);
  const [isUploading, setIsUploading] = useState(false);

  const isFirstNameValid = firstName.trim().length > 0;
  const isLastNameValid = lastName.trim().length > 0;
  const phoneVal = useMemo(() => validatePhoneNumber(countryCode, phone), [countryCode, phone]);
  const emailVal = useMemo(() => validateEmail(email), [email]);
  const nicVal = useMemo(() => validateNicNumber(nic), [nic]);

  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    phoneVal.isValid &&
    emailVal.isValid &&
    nicVal.isValid;

  const processAndUploadPhoto = async (localUri: string) => {
    setIsUploading(true);
    setProfilePicture(localUri);

    try {
      const res = await uploadService.uploadMedia(localUri, 'yaalu/riders/profiles', 5 * 1024 * 1024);
      if (res && res.url) {
        setProfilePicture(res.url);
        Alert.alert('Upload Success 📸', 'Profile photo uploaded to Cloudinary CDN successfully!');
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
          if (status !== 'granted') return Alert.alert('Permission Needed', 'Camera permission required.');
          const res = await ImagePicker.launchCameraAsync({
            mediaTypes: 'images',
            quality: 0.4,
            base64: true,
          });
          if (!res.canceled && res.assets && res.assets[0]) {
            const uri = res.assets[0].base64 ? `data:image/jpeg;base64,${res.assets[0].base64}` : res.assets[0].uri;
            await processAndUploadPhoto(uri);
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
            await processAndUploadPhoto(uri);
          }
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleNextStep = () => {
    if (!isFirstNameValid) return Alert.alert('Validation Error ⚠️', 'Please enter your First Name.');
    if (!isLastNameValid) return Alert.alert('Validation Error ⚠️', 'Please enter your Last Name.');
    if (!phoneVal.isValid) return Alert.alert('Validation Error ⚠️', phoneVal.errorMessage || 'Invalid Phone Number.');
    if (!emailVal.isValid) return Alert.alert('Validation Error ⚠️', emailVal.errorMessage || 'Invalid Email Address.');
    if (!nicVal.isValid) return Alert.alert('Validation Error ⚠️', nicVal.errorMessage || 'Invalid NIC Number.');

    const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;

    riderRegistrationService.setDraft({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: fullPhone,
      phoneNumber: fullPhone,
      email: email.trim(),
      nicNumber: nic.trim().toUpperCase(),
      profilePicture: profilePicture || undefined,
    });

    router.push('/register/step2');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-white`}>
        {/* Top Header Bar */}
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
            <Text style={tw`text-sm font-extrabold text-[#0B1044]`}>Step 1 of 5</Text>
            <Text style={tw`text-sm font-bold text-slate-600`}>Personal Details</Text>
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
              <Ionicons name="person-outline" size={20} color="#0B1044" />
              <Text style={tw`text-base font-extrabold text-[#0B1044]`}>Personal Information</Text>
            </View>

            {/* Profile Photo Upload */}
            <View style={tw`items-center my-2`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handlePickImage}
                disabled={isUploading}
                style={tw`w-24 h-24 rounded-full border-2 border-dashed border-indigo-400 bg-white items-center justify-center shadow-sm overflow-hidden relative`}>
                {profilePicture ? (
                  <Image source={{ uri: profilePicture }} style={tw`w-full h-full rounded-full`} resizeMode="cover" />
                ) : isUploading ? (
                  <ActivityIndicator size="small" color="#0B1044" />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={28} color="#0B1044" />
                    <Text style={tw`text-[9px] font-extrabold text-[#0B1044] mt-1 uppercase`}>PROFILE PHOTO</Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={tw`text-[10px] font-bold text-indigo-900 mt-1.5 text-center`} onPress={handlePickImage}>
                {isUploading
                  ? 'Uploading photo to Cloudinary...'
                  : profilePicture
                  ? 'Photo Uploaded 📸 (Tap to change)'
                  : 'Tap to upload profile photo (Cloudinary, Max 5MB)'}
              </Text>
            </View>

            {/* First Name & Last Name */}
            <View style={tw`flex-row gap-3 mt-3`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>First Name *</Text>
                <TextInput
                  style={tw`bg-white rounded-xl px-3.5 py-3 text-sm text-slate-900 border border-slate-200`}
                  placeholder="First Name"
                  placeholderTextColor="#94A3B8"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Last Name *</Text>
                <TextInput
                  style={tw`bg-white rounded-xl px-3.5 py-3 text-sm text-slate-900 border border-slate-200`}
                  placeholder="Last Name"
                  placeholderTextColor="#94A3B8"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            {/* Country Code & Phone Number Field */}
            <View style={tw`mt-3`}>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Phone Number * (Required)</Text>
              <View style={tw`flex-row items-center`}>
                <CountryCodePicker
                  selectedCode={countryCode}
                  onSelect={(item: CountryCodeItem) => setCountryCode(item.code)}
                />
                <TextInput
                  style={tw`flex-1 bg-white rounded-xl px-3.5 py-3 text-sm text-slate-900 border border-slate-200`}
                  placeholder="771234567"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
              {phone.length > 0 && !phoneVal.isValid && (
                <Text style={tw`text-[11px] font-medium text-red-600 mt-1`}>⚠️ {phoneVal.errorMessage}</Text>
              )}
            </View>

            {/* Mandatory Email Field */}
            <View style={tw`mt-3`}>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Email Address * (Required)</Text>
              <TextInput
                style={tw`bg-white rounded-xl px-3.5 py-3 text-sm text-slate-900 border border-slate-200`}
                placeholder="rider@yaalu.lk"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {email.length > 0 && !emailVal.isValid && (
                <Text style={tw`text-[11px] font-medium text-red-600 mt-1`}>⚠️ {emailVal.errorMessage}</Text>
              )}
            </View>

            {/* NIC Number Field */}
            <View style={tw`mt-3`}>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>
                NIC Number * (Old: 921823456V / New: 199218234567)
              </Text>
              <TextInput
                style={tw`bg-white rounded-xl px-3.5 py-3 text-sm text-slate-900 border border-slate-200`}
                placeholder="921823456V or 199218234567"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                value={nic}
                onChangeText={setNic}
              />
              {nic.length > 0 && !nicVal.isValid && (
                <Text style={tw`text-[11px] font-medium text-red-600 mt-1`}>⚠️ {nicVal.errorMessage}</Text>
              )}
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleNextStep}
            disabled={!isFormValid}
            style={tw`mt-6 py-4 rounded-xl items-center justify-center ${
              isFormValid ? 'bg-[#0B1044]' : 'bg-slate-300'
            }`}>
            <Text style={tw`text-base font-extrabold text-white`}>Next: Contact & Address ➔</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
