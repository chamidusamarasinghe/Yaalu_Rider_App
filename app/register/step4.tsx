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

export default function RegisterStep4Screen() {
  const router = useRouter();
  const [licenseNumber, setLicenseNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const draft = await getRegistrationDraft();
      if (draft) {
        if (draft.phone || draft.mobile) setPhone(draft.phone || draft.mobile);
        if (draft.licenseNumber) setLicenseNumber(draft.licenseNumber);
        if (draft.licenseExpiry || draft.expiryDate) {
          setExpiryDate(draft.licenseExpiry || draft.expiryDate);
        }
        if (draft.licenseFrontUrl) setFrontImage(draft.licenseFrontUrl);
        if (draft.licenseBackUrl) setBackImage(draft.licenseBackUrl);
      }
    })();
  }, []);

  const handlePickImage = async (side: 'front' | 'back') => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Required', 'Please allow camera roll access to upload your license photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        const localUri = result.assets[0].uri;
        if (side === 'front') {
          setFrontImage(localUri);
          setUploadingFront(true);
        } else {
          setBackImage(localUri);
          setUploadingBack(true);
        }

        try {
          const res = await uploadApi.uploadImage(localUri, 'riders');
          const uploadedUrl = res.imageUrl || localUri;
          if (side === 'front') {
            setFrontImage(uploadedUrl);
            await saveRegistrationDraft({ licenseFrontUrl: uploadedUrl });
          } else {
            setBackImage(uploadedUrl);
            await saveRegistrationDraft({ licenseBackUrl: uploadedUrl });
          }
        } catch (upErr) {
          console.warn('License image upload warning:', upErr);
          if (side === 'front') {
            await saveRegistrationDraft({ licenseFrontUrl: localUri });
          } else {
            await saveRegistrationDraft({ licenseBackUrl: localUri });
          }
        } finally {
          if (side === 'front') setUploadingFront(false);
          else setUploadingBack(false);
        }
      }
    } catch (err: any) {
      console.warn('Image picker error:', err);
      Alert.alert('Photo Picker', 'Could not open photo library. Please try again.');
      setUploadingFront(false);
      setUploadingBack(false);
    }
  };

  const handleNextStep = async () => {
    setError(null);
    if (!licenseNumber.trim()) {
      setError('Please enter your driving license number.');
      return;
    }

    const payload = {
      phone,
      mobile: phone,
      licenseNumber: licenseNumber.trim().toUpperCase(),
      licenseExpiry: expiryDate.trim() || '2030-01-01',
      licenseFrontUrl: frontImage || undefined,
      licenseBackUrl: backImage || undefined,
    };

    try {
      setLoading(true);
      await saveRegistrationDraft(payload);
      // Non-blocking background sync to backend
      riderApi.registerStep4(payload).catch((backendErr: any) => {
        console.log('Step 4 background sync info:', backendErr?.message || backendErr);
      });
      router.push('/register/step5');
    } catch (err: any) {
      setError(err.message || 'Failed to proceed to step 5.');
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
          <View style={tw`mb-5`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-sm font-extrabold text-[#0B1044]`}>Step 4 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>License & Verification</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-4/5 bg-[#0B1044] rounded-full`} />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={tw`bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2`}>
              <Ionicons name="alert-circle" size={18} color="#E11D48" />
              <Text style={tw`flex-1 text-xs font-bold text-rose-700`}>{error}</Text>
            </View>
          )}

          <Text style={tw`text-xs font-semibold text-slate-600 mb-5 leading-4.5`}>
            We verify driving licenses to ensure high safety standards across the Yaalu network.
          </Text>

          {/* Form Floating Label Inputs */}
          <View style={tw`gap-4 mb-6`}>
            {/* License Number Input */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5 shadow-xs`}>
              <Text style={tw`text-[11px] font-bold text-[#0B1044] mb-1`}>Driving License Number *</Text>
              <TextInput
                value={licenseNumber}
                onChangeText={(t) => { setLicenseNumber(t); if (error) setError(null); }}
                placeholder="e.g. B1234567"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>

            {/* Expiry Date Input */}
            <View style={tw`bg-white border border-slate-300 rounded-2xl px-4 py-3.5 shadow-xs`}>
              <Text style={tw`text-[11px] font-bold text-[#0B1044] mb-1`}>License Expiry Date (YYYY-MM-DD)</Text>
              <TextInput
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="e.g. 2028-12-31"
                placeholderTextColor="#94A3B8"
                style={tw`text-sm font-semibold text-slate-900 p-0`}
              />
            </View>
          </View>

          {/* LICENSE PHOTOS */}
          <Text style={tw`text-xs font-black text-slate-700 uppercase tracking-wider mb-3`}>
            DRIVING LICENSE PHOTOS (REQUIRED)
          </Text>
          <View style={tw`flex-row gap-3 mb-6`}>
            {/* Front Side */}
            <View style={tw`flex-1`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePickImage('front')}
                disabled={uploadingFront}
                style={tw`bg-white border ${frontImage ? 'border-emerald-500' : 'border-dashed border-indigo-300'} rounded-3xl p-3 items-center justify-center min-h-36 shadow-xs relative overflow-hidden`}>
                {uploadingFront ? (
                  <View style={tw`items-center py-6`}>
                    <ActivityIndicator color="#0B1044" size="small" />
                    <Text style={tw`text-[10px] text-blue-600 font-bold mt-2`}>Uploading to Cloud...</Text>
                  </View>
                ) : frontImage ? (
                  <>
                    <Image source={{ uri: frontImage }} style={tw`w-full h-28 rounded-2xl`} resizeMode="cover" />
                    <View style={tw`flex-row items-center gap-1 mt-2`}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={tw`text-[11px] font-bold text-emerald-700`}>Front Attached</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={tw`w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mb-1`}>
                      <Ionicons name="camera-outline" size={22} color="#0B1044" />
                    </View>
                    <Text style={tw`text-xs font-extrabold text-slate-800`}>Front Side</Text>
                    <Text style={tw`text-[10px] text-indigo-600 font-bold mt-0.5`}>+ Tap to Upload</Text>
                  </>
                )}
              </TouchableOpacity>
              {frontImage && !uploadingFront && (
                <TouchableOpacity onPress={() => handlePickImage('front')} style={tw`mt-1.5 items-center`}>
                  <Text style={tw`text-[11px] font-bold text-indigo-600`}>Change Front Photo</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Back Side */}
            <View style={tw`flex-1`}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handlePickImage('back')}
                disabled={uploadingBack}
                style={tw`bg-white border ${backImage ? 'border-emerald-500' : 'border-dashed border-indigo-300'} rounded-3xl p-3 items-center justify-center min-h-36 shadow-xs relative overflow-hidden`}>
                {uploadingBack ? (
                  <View style={tw`items-center py-6`}>
                    <ActivityIndicator color="#0B1044" size="small" />
                    <Text style={tw`text-[10px] text-blue-600 font-bold mt-2`}>Uploading to Cloud...</Text>
                  </View>
                ) : backImage ? (
                  <>
                    <Image source={{ uri: backImage }} style={tw`w-full h-28 rounded-2xl`} resizeMode="cover" />
                    <View style={tw`flex-row items-center gap-1 mt-2`}>
                      <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                      <Text style={tw`text-[11px] font-bold text-emerald-700`}>Back Attached</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={tw`w-10 h-10 rounded-full bg-indigo-50 items-center justify-center mb-1`}>
                      <Ionicons name="camera-outline" size={22} color="#0B1044" />
                    </View>
                    <Text style={tw`text-xs font-extrabold text-slate-800`}>Back Side</Text>
                    <Text style={tw`text-[10px] text-indigo-600 font-bold mt-0.5`}>+ Tap to Upload</Text>
                  </>
                )}
              </TouchableOpacity>
              {backImage && !uploadingBack && (
                <TouchableOpacity onPress={() => handlePickImage('back')} style={tw`mt-1.5 items-center`}>
                  <Text style={tw`text-[11px] font-bold text-indigo-600`}>Change Back Photo</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Primary Action Button */}
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
                <Text style={tw`text-white font-extrabold text-base`}>Continue to Final Step</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFC72C" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={tw`w-full bg-white border border-[#0B1044] rounded-2xl py-3.5 items-center justify-center mb-8`}>
            <Text style={tw`text-[#0B1044] font-extrabold text-sm`}>Back to Vehicle Info</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
