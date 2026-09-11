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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import riderApi, { saveRegistrationDraft, getRegistrationDraft } from '@/services/api';

export default function RegisterStep2Screen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const payload = {
      phone,
      mobile: phone,
      email: email.trim(),
      address: address.trim(),
      city: city.trim() || 'Colombo',
    };

    try {
      setLoading(true);
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
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-xs mb-6 gap-4`}>
            <View style={tw`flex-row items-center gap-3 border-b border-slate-100 pb-3`}>
              <View style={tw`w-9 h-9 rounded-xl bg-blue-50 items-center justify-center`}>
                <Ionicons name="location-outline" size={20} color="#0B1044" />
              </View>
              <Text style={tw`text-lg font-black text-slate-900`}>Address Details</Text>
            </View>

            {/* Email Address (Optional) */}
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
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>Home Address</Text>
              <View style={tw`flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3 gap-2.5`}>
                <Ionicons name="home-outline" size={18} color="#64748B" />
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Street Name, Building No."
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-semibold text-slate-900 p-0`}
                />
              </View>
            </View>

            {/* City / Region */}
            <View>
              <Text style={tw`text-xs font-bold text-slate-600 mb-1.5`}>City / Region</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  Alert.alert('Select City', 'Choose your operating city:', [
                    { text: 'Colombo', onPress: () => setCity('Colombo') },
                    { text: 'Gampaha', onPress: () => setCity('Gampaha') },
                    { text: 'Kandy', onPress: () => setCity('Kandy') },
                    { text: 'Galle', onPress: () => setCity('Galle') },
                    { text: 'Matara', onPress: () => setCity('Matara') },
                    { text: 'Negombo', onPress: () => setCity('Negombo') },
                  ])
                }
                style={tw`flex-row items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-3`}>
                <View style={tw`flex-row items-center gap-2.5`}>
                  <Ionicons name="business-outline" size={18} color="#64748B" />
                  <Text style={tw`text-sm font-semibold ${city ? 'text-slate-900' : 'text-slate-400'}`}>
                    {city || 'Select your city'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons Row */}
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
    </SafeAreaView>
  );
}
