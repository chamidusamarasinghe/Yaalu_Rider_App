import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import { riderRegistrationService } from '@/services/rider-registration-service';
import riderApi, { saveRegistrationDraft, getRegistrationDraft } from '@/services/api';
import { SRI_LANKA_MAIN_CITIES } from '@/constants/cities';

export default function RegisterStep2Screen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // City Picker Modal State
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const filteredCities = SRI_LANKA_MAIN_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearchQuery.toLowerCase()),
  );

  useEffect(() => {
    (async () => {
      const draft = await getRegistrationDraft();
      if (draft) {
        if (draft.phone || draft.mobile) setPhone(draft.phone || draft.mobile);
        if (draft.email) setEmail(draft.email);
        if (draft.address) setAddress(draft.address);
        if (draft.city) setCity(draft.city);
      }
    })();
  }, []);

  const handleNextStep = async () => {
    setError(null);
    if (!address.trim()) {
      setError('Please enter your home address.');
      return;
    }
    if (!city) {
      setError('Please select your operating city.');
      return;
    }

    const payload = {
      phone,
      mobile: phone,
      email: email.trim(),
      address: address.trim(),
      city: city.trim() || 'Colombo',
    };

    try {
      setLoading(true);
      riderRegistrationService.setDraft(payload);
      await saveRegistrationDraft(payload);
      // Non-blocking background sync to backend
      riderApi.registerStep2(payload).catch((backendErr: any) => {
        console.log('Step 2 background sync info:', backendErr?.message || backendErr);
      });
      router.push('/register/step3');
    } catch (err: any) {
      setError(err.message || 'Failed to proceed to step 3.');
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
          <View style={tw`mb-6`}>
            <View style={tw`flex-row justify-between items-center mb-2`}>
              <Text style={tw`text-sm font-extrabold text-[#0B1044]`}>Step 2 of 5</Text>
              <Text style={tw`text-sm font-bold text-slate-600`}>Contact & Address</Text>
            </View>
            <View style={tw`h-2 w-full bg-blue-100 rounded-full overflow-hidden`}>
              <View style={tw`h-full w-2/5 bg-[#0B1044] rounded-full`} />
            </View>
          </View>

          {/* Error Message */}
          {error && (
            <View style={tw`bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex-row items-center gap-2`}>
              <Ionicons name="alert-circle" size={18} color="#E11D48" />
              <Text style={tw`flex-1 text-xs font-bold text-rose-700`}>{error}</Text>
            </View>
          )}

          {/* Your Information Card */}
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-6 gap-4`}>
            <View style={tw`flex-row items-center gap-3 border-b border-slate-100 pb-3`}>
              <View style={tw`w-9 h-9 rounded-xl bg-blue-50 items-center justify-center`}>
                <Ionicons name="location-outline" size={20} color="#0B1044" />
              </View>
              <Text style={tw`text-lg font-black text-slate-900`}>Address Details</Text>
            </View>

            {/* Email Address */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Email Address (Optional)</Text>
              <View style={tw`flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 gap-2.5`}>
                <Ionicons name="mail-outline" size={18} color="#64748B" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="e.g. rider@example.com"
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Home Address */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Home Address *</Text>
              <View style={tw`flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 gap-2.5`}>
                <Ionicons name="home-outline" size={18} color="#64748B" />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street Name, House / Building No."
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* Sri Lanka Main City Dropdown Picker */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Operating City / Region *</Text>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setIsCityModalVisible(true)}
                style={tw`flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3.5`}>
                <View style={tw`flex-row items-center gap-2.5`}>
                  <Ionicons name="business-outline" size={18} color="#2563EB" />
                  <Text style={tw`text-sm font-semibold ${city ? 'text-slate-900' : 'text-slate-400'}`}>
                    {city || 'Select Sri Lanka Main City'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

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
                <Text style={tw`text-white font-extrabold text-base`}>Continue to Step 3</Text>
                <Ionicons name="arrow-forward" size={18} color="#FFC72C" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            style={tw`w-full bg-white border border-[#0B1044] rounded-2xl py-3.5 items-center justify-center mb-8`}>
            <Text style={tw`text-[#0B1044] font-extrabold text-sm`}>Back to Personal Details</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Sri Lanka Cities Dropdown Selection Modal */}
      <Modal
        visible={isCityModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCityModalVisible(false)}>
        <View style={tw`flex-1 bg-black/50 justify-end`}>
          <View style={tw`bg-white rounded-t-3xl h-4/5 p-5`}>
            {/* Modal Header */}
            <View style={tw`flex-row justify-between items-center pb-3 border-b border-slate-200 mb-3`}>
              <View style={tw`flex-row items-center gap-2`}>
                <Ionicons name="map-outline" size={22} color="#0B1044" />
                <Text style={tw`text-lg font-black text-[#0B1044]`}>Select Sri Lanka Main City</Text>
              </View>
              <TouchableOpacity onPress={() => setIsCityModalVisible(false)} style={tw`p-1`}>
                <Ionicons name="close-circle" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* City Search Bar */}
            <View style={tw`flex-row items-center bg-slate-100 rounded-2xl px-3 py-2.5 mb-3 gap-2 border border-slate-200`}>
              <Ionicons name="search" size={18} color="#64748B" />
              <TextInput
                value={citySearchQuery}
                onChangeText={setCitySearchQuery}
                placeholder="Search city (e.g. Colombo, Kandy, Galle, Gampaha)..."
                placeholderTextColor="#94A3B8"
                style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
              />
              {citySearchQuery ? (
                <TouchableOpacity onPress={() => setCitySearchQuery('')}>
                  <Ionicons name="close" size={18} color="#64748B" />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Cities List */}
            <FlatList
              data={filteredCities}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setCity(item);
                    setIsCityModalVisible(false);
                    setCitySearchQuery('');
                  }}
                  style={tw`py-3 px-3 border-b border-slate-100 flex-row items-center justify-between ${
                    city === item ? 'bg-blue-50 rounded-xl' : ''
                  }`}>
                  <Text
                    style={tw`text-sm font-bold ${
                      city === item ? 'text-blue-900 font-black' : 'text-slate-800'
                    }`}>
                    🇱🇰 {item}
                  </Text>
                  {city === item ? <Ionicons name="checkmark-circle" size={20} color="#2563EB" /> : null}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={tw`py-10 items-center`}>
                  <Ionicons name="alert-circle-outline" size={36} color="#94A3B8" />
                  <Text style={tw`text-sm font-semibold text-slate-500 mt-2`}>No cities matching search.</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
