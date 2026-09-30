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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import BottomNav from '@/components/BottomNav';

const STEPS = [
  { id: 'arrived', label: 'Arrived at Pickup', time: '10:28 AM', cta: "I've Arrived at Pickup" },
  { id: 'picked', label: 'Picked Up', time: '10:32 AM', cta: 'Order Picked Up' },
  { id: 'ontheway', label: 'On the Way', time: '10:33 AM', cta: "I'm On the Way" },
  { id: 'delivered', label: 'Delivered', time: '10:40 AM', cta: 'Mark as Delivered' },
] as const;

export default function SingleDeliveryStatusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ step?: string }>();

  // Determine initial step from search params or default to 0
  const getInitialStep = () => {
    if (params.step === 'step2' || params.step === 'picked') return 1;
    if (params.step === 'step3' || params.step === 'ontheway') return 2;
    if (params.step === 'step4' || params.step === 'delivered') return 3;
    return 0;
  };

  const [activeStepIndex, setActiveStepIndex] = useState<number>(getInitialStep());

  const currentStepInfo = STEPS[activeStepIndex];

  const handleNextStep = () => {
    if (activeStepIndex < STEPS.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      // Step 3 (Delivered) -> Proceed to Proof of Delivery / Finish Ride
      router.push('/delivery/proof' as any);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      <RNStatusBar barStyle="dark-content" backgroundColor="#FFC72C" />

      <View style={tw`flex-1 bg-white relative`}>
        {/* Header Bar */}
        <View style={tw`bg-[#FFC72C] h-14 px-4 flex-row items-center justify-between shadow-sm`}>
          <TouchableOpacity onPress={() => router.back()} style={tw`p-1`}>
            <Ionicons name="chevron-back" size={24} color="#0B1044" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-[#0B1044]`}>Delivery Status</Text>

          <View style={tw`w-9 h-9 rounded-full border border-white overflow-hidden bg-slate-200`}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200' }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`p-5 pb-24`}>
          <Text style={tw`text-xl font-black text-slate-900 mb-3`}>Order #YA-4587</Text>

          {/* Customer Info Box */}
          <View style={tw`w-full bg-white rounded-2xl p-3.5 flex-row items-center justify-between border border-slate-200 mb-5 shadow-sm`}>
            <View style={tw`flex-row items-center gap-3`}>
              <View style={tw`w-12 h-12 rounded-full overflow-hidden bg-slate-200 border border-white shadow-sm`}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200' }}
                  style={tw`w-full h-full`}
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text style={tw`text-base font-extrabold text-slate-900`}>Sarah Jenkins</Text>
                <Text style={tw`text-xs text-slate-500 font-medium`}>Customer</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('Contact Customer', 'Calling Sarah Jenkins at +94 77 123 4567...')}
              style={tw`w-11 h-11 rounded-full bg-blue-600 items-center justify-center shadow-md`}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Pickup & Drop-off Route Details */}
          <View style={tw`mb-6 pl-2`}>
            <View style={tw`flex-row items-start gap-3`}>
              <View style={tw`w-3.5 h-3.5 rounded-full bg-blue-600 mt-1`} />
              <View>
                <Text style={tw`text-[10px] font-bold text-blue-600 uppercase tracking-wider`}>PICKUP</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>Blueberry Bakery</Text>
                <Text style={tw`text-xs text-slate-500`}>Downtown</Text>
              </View>
            </View>

            <View style={tw`w-0.5 h-6 bg-slate-200 ml-1.5 my-1`} />

            <View style={tw`flex-row items-start gap-3`}>
              <View style={tw`w-3.5 h-3.5 rounded-full bg-red-500 mt-1`} />
              <View>
                <Text style={tw`text-[10px] font-bold text-red-500 uppercase tracking-wider`}>DROP-OFF</Text>
                <Text style={tw`text-sm font-extrabold text-slate-900`}>42nd Maple Street</Text>
                <Text style={tw`text-xs text-slate-500`}>Apt 4B</Text>
              </View>
            </View>
          </View>

          <View style={tw`h-px w-full bg-slate-100 my-2`} />

          {/* Delivery Progress Checklist - INTERACTIVE CLICKABLE STEPS */}
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-base font-extrabold text-slate-900`}>Delivery Progress</Text>
            <Text style={tw`text-[11px] font-bold text-blue-600`}>Tap step to switch status</Text>
          </View>

          <View style={tw`gap-3 mb-6`}>
            {/* Step 0: Accepted (Always Completed) */}
            <View style={tw`flex-row items-center justify-between p-2 rounded-xl bg-slate-50`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
                <Text style={tw`text-sm font-bold text-slate-900`}>Accepted</Text>
              </View>
              <Text style={tw`text-xs font-semibold text-slate-400`}>10:15 AM</Text>
            </View>

            {/* Dynamic Interactive Steps */}
            {STEPS.map((step, idx) => {
              const isCompleted = idx < activeStepIndex;
              const isActive = idx === activeStepIndex;

              return (
                <TouchableOpacity
                  key={step.id}
                  activeOpacity={0.7}
                  onPress={() => setActiveStepIndex(idx)}
                  style={[
                    tw`flex-row items-center justify-between p-3 rounded-2xl border transition-all`,
                    isActive
                      ? tw`bg-blue-50/80 border-blue-600 shadow-sm`
                      : isCompleted
                      ? tw`bg-slate-50 border-slate-200`
                      : tw`bg-white border-slate-100`,
                  ]}>
                  <View style={tw`flex-row items-center gap-3`}>
                    {isCompleted ? (
                      <View style={tw`w-6 h-6 rounded-full bg-emerald-500 items-center justify-center`}>
                        <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    ) : isActive ? (
                      <View style={tw`w-6 h-6 rounded-full border-2 border-blue-600 bg-white items-center justify-center`}>
                        <View style={tw`w-2.5 h-2.5 rounded-full bg-blue-600`} />
                      </View>
                    ) : (
                      <View style={tw`w-6 h-6 rounded-full border-2 border-slate-300 bg-white`} />
                    )}
                    <Text
                      style={[
                        tw`text-sm`,
                        isActive
                          ? tw`font-black text-blue-700`
                          : isCompleted
                          ? tw`font-bold text-slate-900`
                          : tw`font-semibold text-slate-400`,
                      ]}>
                      {step.label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      tw`text-xs`,
                      isActive
                        ? tw`font-bold text-blue-600`
                        : isCompleted
                        ? tw`font-semibold text-slate-400`
                        : tw`font-medium text-slate-300`,
                    ]}>
                    {step.time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sync Status Box */}
          <View style={tw`bg-blue-50/70 rounded-2xl p-3.5 flex-row items-center justify-center gap-2 mb-6 border border-blue-100`}>
            <Ionicons name="refresh-outline" size={18} color="#2563EB" />
            <View style={tw`items-center`}>
              <Text style={tw`text-xs font-bold text-blue-700`}>Synced with customer and shop</Text>
              <Text style={tw`text-[9px] text-slate-400 mt-0.5`}>
                Current Status: {currentStepInfo.label}
              </Text>
            </View>
          </View>

          {/* Primary Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleNextStep}
            style={tw`bg-[#070A2A] rounded-2xl py-4 items-center shadow-md mb-3`}>
            <Text style={tw`text-white font-extrabold text-base`}>{currentStepInfo.cta}</Text>
          </TouchableOpacity>

          {/* Secondary Report Issue Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Report Issue', 'Issue reported to support team.')}
            style={tw`bg-white border-2 border-slate-200 rounded-2xl py-3.5 items-center`}>
            <Text style={tw`text-slate-600 font-extrabold text-sm`}>Report Issue</Text>
          </TouchableOpacity>
        </ScrollView>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
