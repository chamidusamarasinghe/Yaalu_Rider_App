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
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import tw from '@/lib/tw';
import riderApi, { saveRegistrationDraft, getRegistrationDraft, uploadApi } from '@/services/api';

export default function RegisterStep1Screen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [nic, setNic] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const draft = await getRegistrationDraft();
      if (draft) {
        if (draft.firstName) setFirstName(draft.firstName);
        if (draft.lastName) setLastName(draft.lastName);
        if (draft.phone || draft.mobile) setPhone(draft.phone || draft.mobile);
        if (draft.nicNumber || draft.nic) setNic(draft.nicNumber || draft.nic);
        if (draft.profilePhotoUrl) setPhotoUri(draft.profilePhotoUrl);
      }
    })();
  }, []);

  const handlePickPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow photo access to select your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const localUri = result.assets[0].uri;
        setPhotoUri(localUri);
        setUploadingPhoto(true);

        // Upload directly to Cloudinary in riders folder
        try {
          const res = await uploadApi.uploadImage(localUri, 'riders');
          const uploadedUrl = res.imageUrl || localUri;
          setPhotoUri(uploadedUrl);
          await saveRegistrationDraft({ profilePhotoUrl: uploadedUrl });
        } catch (uploadErr) {
          console.warn('Cloudinary upload warning:', uploadErr);
          await saveRegistrationDraft({ profilePhotoUrl: localUri });
        } finally {
          setUploadingPhoto(false);
        }
      }
    } catch (err: any) {
      console.warn('Profile photo picker error:', err);
      setUploadingPhoto(false);
    }
  };

  const handleNextStep = async () => {
    setError(null);
    if (!firstName.trim() || !lastName.trim()) {
      setError('Please enter your first and last name.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your mobile phone number.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName,
      phone: phone.trim(),
      mobile: phone.trim(),
      nicNumber: nic.trim(),
      profilePhotoUrl: photoUri || undefined,
    };

    try {
      setLoading(true);
      await saveRegistrationDraft(payload);
      // Non-blocking background sync to backend
      riderApi.registerStep1(payload).catch((backendErr: any) => {
        console.log('Step 1 background sync info:', backendErr?.message || backendErr);
      });
      router.push('/register/step2');
    } catch (err: any) {
      setError(err.message || 'Failed to proceed. Please try again.');
    } finally {
      setLoading(false);
    }
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
            Join thousands of riders earning on their own schedule. Please fill in your details to get started.
          </Text>

          {/* Error Banner */}
          {error && (
            <View style={tw`bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2`}>
              <Ionicons name="alert-circle" size={18} color="#E11D48" />
              <Text style={tw`flex-1 text-xs font-bold text-rose-700`}>{error}</Text>
            </View>
          )}

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
                onPress={handlePickPhoto}
                disabled={uploadingPhoto}
                style={tw`w-22 h-22 rounded-full border-2 ${photoUri ? 'border-emerald-500' : 'border-dashed border-indigo-400'} bg-white items-center justify-center shadow-xs overflow-hidden relative`}>
                {uploadingPhoto ? (
                  <ActivityIndicator color="#0B1044" size="small" />
                ) : photoUri ? (
                  <Image source={{ uri: photoUri }} style={tw`w-full h-full rounded-full`} resizeMode="cover" />
                ) : (
                  <>
                    <Ionicons name="camera-outline" size={26} color="#0B1044" />
                    <Text style={tw`text-[9px] font-black text-[#0B1044] mt-1 uppercase`}>PHOTO</Text>
                  </>
                )}
              </TouchableOpacity>
              <Text style={tw`text-[10px] ${uploadingPhoto ? 'text-blue-600 font-bold' : photoUri ? 'text-emerald-600 font-bold' : 'text-slate-400'} mt-1.5`}>
                {uploadingPhoto ? 'Uploading to Cloudinary...' : photoUri ? '✓ Photo uploaded to cloud (Tap to change)' : 'Clear photo for your rider profile'}
              </Text>
            </View>

            {/* First Name & Last Name Grid */}
            <View style={tw`flex-row gap-3 mt-4 mb-3`}>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>First Name *</Text>
                <TextInput
                  value={firstName}
                  onChangeText={(t) => { setFirstName(t); if (error) setError(null); }}
                  placeholder="e.g. Harsha"
                  placeholderTextColor="#94A3B8"
                  style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
                />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Last Name *</Text>
                <TextInput
                  value={lastName}
                  onChangeText={(t) => { setLastName(t); if (error) setError(null); }}
                  placeholder="e.g. Perera"
                  placeholderTextColor="#94A3B8"
                  style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
                />
              </View>
            </View>

            {/* Phone Number Input */}
            <View style={tw`mb-3`}>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>Phone Number *</Text>
              <TextInput
                value={phone}
                onChangeText={(t) => { setPhone(t); if (error) setError(null); }}
                keyboardType="phone-pad"
                placeholder="+94 77 123 4567"
                placeholderTextColor="#94A3B8"
                style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
              />
            </View>

            {/* NIC Number Input */}
            <View style={tw`mb-2`}>
              <Text style={tw`text-xs font-bold text-slate-700 mb-1`}>NIC / National ID</Text>
              <TextInput
                value={nic}
                onChangeText={setNic}
                placeholder="199512304567 or 951234567V"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`bg-white border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 shadow-xs`}
              />
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            disabled={loading}
            style={[
              tw`rounded-xl py-4 flex-row items-center justify-center gap-2 mt-6 shadow-md`,
              { backgroundColor: loading ? '#94A3B8' : '#0B1044' },
            ]}>
            {loading ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <>
                <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 2</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFC72C" />
              </>
            )}
          </TouchableOpacity>

          {/* Footer Terms Note */}
          <Text style={tw`text-[11px] text-slate-400 text-center mt-4 leading-4`}>
            By continuing, you agree to Yaalu's <Text style={tw`text-[#0B1044] font-bold underline`}>Terms of Service</Text> and <Text style={tw`text-[#0B1044] font-bold underline`}>Privacy Policy</Text>.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
