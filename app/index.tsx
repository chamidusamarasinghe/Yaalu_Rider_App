import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  StatusBar as RNStatusBar,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { YaaluColors } from '@/constants/theme';
import { YaaluLogo } from '@/components/YaaluLogo';
import { LanguageCard } from '@/components/LanguageCard';

export default function LanguageSelectScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'sinhala' | 'tamil'>('english');

  const handleContinue = () => {
    router.push('/onboarding');
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#0B1044]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Hero Section with Official Delivery Hero Image */}
      <ImageBackground
        source={require('@/assets/images/delivery-hero.jpg')}
        style={[tw`w-full`, { height: '52%' }]}
        resizeMode="cover">
        <View style={tw`flex-1 bg-black/40 justify-center items-center px-5`}>
          <View style={tw`items-center justify-center`}>
            {/* Official Yaalu Logo Badge */}
            <View style={tw`mb-2`}>
              <YaaluLogo size={80} showWordmark={false} variant="badge" />
            </View>

            {/* Welcome Heading */}
            <Text style={tw`text-2xl font-semibold text-white shadow-md`}>Welcome to</Text>

            {/* Official Yellow YAALU Wordmark */}
            <Image
              source={require('@/assets/images/yaalu-wordmark.png')}
              style={tw`w-44 h-11 my-1`}
              resizeMode="contain"
            />

            <Text style={tw`text-base font-semibold text-white italic tracking-wide`}>- Deliver with Trust -</Text>
          </View>
        </View>
      </ImageBackground>

      {/* Bottom Sheet Language Selector Card */}
      <View style={tw`flex-1 bg-[#F3F5FC] rounded-t-[36px] -mt-8 pt-7 px-6 shadow-xl`}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-8`}>
          <Text style={tw`text-2xl font-extrabold text-[#0B1044] text-center`}>Select your language</Text>
          <Text style={tw`text-xs font-medium text-slate-500 text-center mt-1 mb-6`}>
            Choose your preferred language to continue
          </Text>

          {/* Language Options */}
          <View style={tw`mb-2.5`}>
            <LanguageCard
              label="English"
              selected={selectedLanguage === 'english'}
              onSelect={() => setSelectedLanguage('english')}
            />
            <LanguageCard
              label="Sinhala"
              selected={selectedLanguage === 'sinhala'}
              onSelect={() => setSelectedLanguage('sinhala')}
            />
            <LanguageCard
              label="Tamil"
              selected={selectedLanguage === 'tamil'}
              onSelect={() => setSelectedLanguage('tamil')}
            />
          </View>

          {/* Continue Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={tw`flex-row items-center justify-center bg-[#070A2A] rounded-2xl py-4.5 gap-2.5 shadow-md`}
            onPress={handleContinue}>
            <Text style={tw`text-lg font-extrabold text-[#FFC72C] tracking-wide`}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color={YaaluColors.gold} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
