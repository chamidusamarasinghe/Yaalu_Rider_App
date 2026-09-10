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
import tw from '@/lib/tw';

export default function VehicleDocumentScreen() {
  const router = useRouter();

  const [documentUri, setDocumentUri] = useState<string | null>(
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400'
  );

  const handleSimulateUpload = () => {
    setDocumentUri('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400');
    Alert.alert('File Selected', 'New vehicle registration image ready for upload.');
  };

  const handleSubmitForReview = () => {
    Alert.alert('Submitted!', 'Vehicle document sent for admin verification.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
        <Text style={tw`text-lg font-bold text-[#0B1044]`}>Vehicle Document</Text>
        <View style={tw`w-6`} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-4 pb-24`}>
        {/* Section Title */}
        <Text style={tw`text-xl font-black text-slate-900 mb-2`}>Vehicle registation</Text>
        <Text style={tw`text-xs font-bold text-slate-700 mb-3`}>Front Side</Text>

        {/* Uploaded Document Preview Card */}
        {documentUri && (
          <View style={tw`bg-white rounded-3xl p-3 border border-slate-200 shadow-xs mb-4 relative`}>
            <Image
              source={{ uri: documentUri }}
              style={tw`w-full h-44 rounded-2xl bg-slate-100`}
              resizeMode="cover"
            />

            {/* Remove X Button */}
            <TouchableOpacity
              onPress={() => setDocumentUri(null)}
              style={tw`absolute top-5 right-5 bg-slate-900/70 p-1.5 rounded-full`}>
              <Ionicons name="close" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Upload New Image Box */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={handleSimulateUpload}
          style={tw`w-full border-2 border-indigo-300 border-dashed bg-indigo-50/30 rounded-3xl p-8 items-center justify-center mb-6`}>
          <View style={tw`w-10 h-10 rounded-full bg-indigo-100 items-center justify-center mb-2`}>
            <Ionicons name="add" size={28} color="#4F46E5" />
          </View>
          <Text style={tw`text-sm font-black text-indigo-900`}>Upload New Image</Text>
          <Text style={tw`text-[11px] font-semibold text-slate-400 mt-1`}>
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

