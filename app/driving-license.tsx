import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import tw from '@/lib/tw';

import riderApi, { uploadApi } from '@/services/api';

export default function DrivingLicenseScreen() {
  const router = useRouter();

  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [backUri, setBackUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadFront = async () => {
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
        setFrontUri(localUri);
        try {
          const res = await uploadApi.uploadImage(localUri, 'riders');
          setFrontUri(res.imageUrl);
        } catch (e) {
          console.warn('Upload error:', e);
        }
      }
    } catch (err: any) {
      Alert.alert('Photo Picker', 'Could not open photo library.');
    }
  };

  const handleUploadBack = async () => {
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
        setBackUri(localUri);
        try {
          const res = await uploadApi.uploadImage(localUri, 'riders');
          setBackUri(res.imageUrl);
        } catch (e) {
          console.warn('Upload error:', e);
        }
      }
    } catch (err: any) {
      Alert.alert('Photo Picker', 'Could not open photo library.');
    }
  };

  const handleSubmitForReview = async () => {
    try {
      setLoading(true);
      await riderApi.updateProfile({
        licenseNumber: 'B9876543',
        licenseExpiry: '2028-12-31',
        licenseFrontUrl: frontUri || undefined,
        licenseBackUrl: backUri || undefined,
      });
      Alert.alert('Submitted!', 'Driving license details updated and saved to database.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to submit license details');
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
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Driving License</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
        {/* Section Title */}
        <Text style={tw`text-xl font-black text-slate-900 mb-3`}>Update Driving License</Text>

        {/* Front Side Section */}
        <Text style={tw`text-xs font-bold text-slate-700 mb-2`}>Front Side</Text>
        {frontUri && (
          <View style={tw`bg-white rounded-3xl p-3 border border-slate-200 shadow-xs mb-3 relative`}>
            <Image
              source={{ uri: frontUri }}
              style={tw`w-full h-40 rounded-2xl bg-slate-100`}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setFrontUri(null)}
              style={tw`absolute top-5 right-5 bg-slate-900/70 p-1.5 rounded-full`}>
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleUploadFront}
          style={tw`w-full border-2 border-indigo-300 border-dashed bg-indigo-50/30 rounded-3xl p-6 items-center justify-center mb-5`}>
          <View style={tw`w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mb-1.5`}>
            <Ionicons name="add" size={26} color="#4F46E5" />
          </View>
          <Text style={tw`text-sm font-black text-indigo-900`}>Upload New Image</Text>
          <Text style={tw`text-[11px] font-semibold text-slate-400 mt-0.5`}>
            JPG, PNG or PDF (Max 5MB)
          </Text>
        </TouchableOpacity>

        {/* Back Side Section */}
        <Text style={tw`text-xs font-bold text-slate-700 mb-2`}>Back Side</Text>
        {backUri && (
          <View style={tw`bg-white rounded-3xl p-3 border border-slate-200 shadow-xs mb-3 relative`}>
            <Image
              source={{ uri: backUri }}
              style={tw`w-full h-40 rounded-2xl bg-slate-100`}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setBackUri(null)}
              style={tw`absolute top-5 right-5 bg-slate-900/70 p-1.5 rounded-full`}>
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleUploadBack}
          style={tw`w-full border-2 border-indigo-300 border-dashed bg-indigo-50/30 rounded-3xl p-6 items-center justify-center mb-6`}>
          <View style={tw`w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mb-1.5`}>
            <Ionicons name="add" size={26} color="#4F46E5" />
          </View>
          <Text style={tw`text-sm font-black text-indigo-900`}>Upload New Image</Text>
          <Text style={tw`text-[11px] font-semibold text-slate-400 mt-0.5`}>
            JPG, PNG or PDF (Max 5MB)
          </Text>
        </TouchableOpacity>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmitForReview}
          style={tw`w-full bg-[#030626] rounded-2xl py-4 items-center shadow-md`}>
          <Text style={tw`text-white font-extrabold text-base`}>Submit for Review</Text>
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

