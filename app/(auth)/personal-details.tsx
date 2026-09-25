import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
  TextInput,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import { getSavedRider, getRegistrationDraft, riderApi, formatRiderData } from '@/services/api';
import { SRI_LANKA_MAIN_CITIES } from '@/constants/cities';

export default function PersonalDetailsScreen() {
  const router = useRouter();
  const [rider, setRider] = useState<any>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nic, setNic] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  // City Picker Modal State
  const [isCityModalVisible, setIsCityModalVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');

  const filteredCities = SRI_LANKA_MAIN_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const populateFields = (data: any) => {
    if (!data) return;
    setRider(data);
    setFullName(data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Rider Partner');
    setPhone(data.phone || data.phoneNumber || data.mobile || '');
    setEmail(data.email || '');
    setNic(data.nicNumber || data.nic || '');
    setLicenseNumber(data.licenseNumber || data.drivingLicense || '');
    setAddress(data.address || '');
    setCity(data.city || '');
  };

  useEffect(() => {
    (async () => {
      const saved = await getSavedRider();
      const draft = await getRegistrationDraft();
      const merged = formatRiderData(draft, saved);
      if (merged) populateFields(merged);

      try {
        const res = await riderApi.getProfile();
        if (res) {
          const formatted = formatRiderData(res, merged);
          populateFields(formatted);
        }
      } catch (e) {
        // fallback to local saved
      }
    })();
  }, []);

  const handleSave = async () => {
    if (isEditing) {
      if (!address.trim()) {
        Alert.alert('Validation Error ⚠️', 'Please enter your home address.');
        return;
      }
      try {
        setSaving(true);
        const updatedPayload = {
          fullName: fullName.trim(),
          address: address.trim(),
          city: city.trim(),
          email: email.trim(),
        };
        await riderApi.updateProfile(updatedPayload);
        setIsEditing(false);
        Alert.alert('Success 🎉', 'Personal details updated successfully!');
      } catch (err: any) {
        Alert.alert('Error ⚠️', err?.message || 'Failed to update personal details.');
      } finally {
        setSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const profilePhoto = rider?.profilePhotoUrl || rider?.profilePicture || rider?.profilePhoto;

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-[#F8FAFC]`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={24} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Personal Details</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={tw`bg-[#0B1044] px-3 py-1.5 rounded-full flex-row items-center gap-1`}>
            {saving ? (
              <ActivityIndicator size="small" color="#FFC72C" />
            ) : (
              <Text style={tw`text-xs font-black text-white`}>{isEditing ? 'Save' : 'Edit'}</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-24`}>
          {/* Title */}
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-2xl font-black text-slate-900`}>Personal Information</Text>
            {isEditing && (
              <View style={tw`bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-md`}>
                <Text style={tw`text-[10px] font-black text-amber-900`}>Editing Mode</Text>
              </View>
            )}
          </View>

          {/* Profile Card Container */}
          <View style={tw`bg-white rounded-3xl p-5 border border-slate-200 shadow-sm mb-4 gap-4`}>
            {/* Rider Avatar Header */}
            <View style={tw`flex-row items-center gap-4 pb-4 border-b border-slate-100`}>
              <View style={tw`w-16 h-16 rounded-full border-2 border-amber-300 overflow-hidden bg-slate-200 items-center justify-center`}>
                {profilePhoto ? (
                  <Image
                    source={{ uri: profilePhoto }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="person" size={32} color="#64748B" />
                )}
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-black text-slate-900`}>{fullName || 'Rider Partner'}</Text>
                <Text style={tw`text-xs font-bold text-emerald-600 mt-0.5`}>
                  {rider?.isApproved ? 'Verified Rider ✓' : 'Registration Pending'}
                </Text>
              </View>
            </View>

            {/* Full Name */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Full Name</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  editable={isEditing}
                  style={tw`flex-1 text-sm font-bold text-slate-900 p-0`}
                  placeholder="Full Name"
                  placeholderTextColor="#94A3B8"
                />
                <Feather name="user" size={16} color="#64748B" />
              </View>
            </View>

            {/* Phone Number (Read-only for security) */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Phone Number</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{phone || 'Not specified'}</Text>
                <Feather name="phone" size={16} color="#64748B" />
              </View>
            </View>

            {/* Email Address */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Email Address</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  editable={isEditing}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={tw`flex-1 text-sm font-bold text-slate-900 p-0`}
                  placeholder="Email Address"
                  placeholderTextColor="#94A3B8"
                />
                <Feather name="mail" size={16} color="#64748B" />
              </View>
            </View>

            {/* NIC Number */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>NIC / National ID</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{nic || 'Not specified'}</Text>
                <Feather name="credit-card" size={16} color="#64748B" />
              </View>
            </View>

            {/* Driving License Number */}
            <TouchableOpacity onPress={() => router.push('/driving-license' as any)}>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Driving License No.</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <Text style={tw`text-sm font-bold text-slate-900`}>{licenseNumber || 'Not specified'}</Text>
                <View style={tw`flex-row items-center gap-1`}>
                  <Text style={tw`text-xs font-bold text-blue-600`}>Update</Text>
                  <Feather name="chevron-right" size={16} color="#2563EB" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Home Address */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Home Address *</Text>
              <View style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <TextInput
                  value={address}
                  onChangeText={setAddress}
                  editable={isEditing}
                  placeholder="Street Name, House / Building No."
                  placeholderTextColor="#94A3B8"
                  style={tw`flex-1 text-sm font-bold text-slate-900 p-0`}
                />
                <Feather name="home" size={16} color="#64748B" />
              </View>
            </View>

            {/* Operating City (Selectable via Dropdown Modal) */}
            <View>
              <Text style={tw`text-[11px] font-semibold text-slate-400 mb-1`}>Operating City / Region *</Text>
              <TouchableOpacity
                disabled={!isEditing}
                activeOpacity={0.75}
                onPress={() => setIsCityModalVisible(true)}
                style={tw`bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex-row items-center justify-between`}>
                <View style={tw`flex-row items-center gap-2`}>
                  <Ionicons name="location-outline" size={16} color="#2563EB" />
                  <Text style={tw`text-sm font-bold ${city ? 'text-slate-900' : 'text-slate-400'}`}>
                    {city || 'Select Operating City'}
                  </Text>
                </View>
                {isEditing ? (
                  <Feather name="chevron-down" size={16} color="#2563EB" />
                ) : (
                  <Feather name="map-pin" size={16} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Save / Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
            style={[
              tw`rounded-2xl py-4 items-center shadow-md`,
              { backgroundColor: saving ? '#94A3B8' : isEditing ? '#059669' : '#0B1044' },
            ]}>
            {saving ? (
              <ActivityIndicator color="#FFC72C" size="small" />
            ) : (
              <Text style={tw`text-white font-extrabold text-base`}>
                {isEditing ? 'Save Personal Details' : 'Edit Personal Details'}
              </Text>
            )}
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
