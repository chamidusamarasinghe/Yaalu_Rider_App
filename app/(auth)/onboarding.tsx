import React, { useState, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from '@/lib/tw';
import { YaaluColors } from '@/constants/theme';
import {
  LocationGraphic,
  NotificationsGraphic,
  DashboardGraphic,
  GoOnlineGraphic,
  AcceptOrderGraphic,
  NavigatePickupGraphic,
  DeliverCompleteGraphic,
} from '@/components/OnboardingGraphics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Total pages: Page 1 (Steps 1-3), Page 2 (Step 4), Page 3 (Step 5), Page 4 (Step 6), Page 5 (Step 7), Page 6 (Success - You're All Set!)
  const totalPages = 6;

  const handleSkip = () => {
    router.push('/login');
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({ x: nextPage * SCREEN_WIDTH, animated: true });
      setCurrentPage(nextPage);
    } else {
      router.push('/login');
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      scrollViewRef.current?.scrollTo({ x: prevPage * SCREEN_WIDTH, animated: true });
      setCurrentPage(prevPage);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / SCREEN_WIDTH);
    if (page !== currentPage && page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const isSuccessPage = currentPage === totalPages - 1;

  return (
    <SafeAreaView style={tw`flex-1 bg-[#FFC72C]`} edges={['top', 'bottom']}>
      {/* Top Header Navigation - Hidden on Success Page */}
      {!isSuccessPage && (
        <View style={tw`h-12 flex-row items-center px-5 justify-between bg-[#FFC72C]`}>
          <View />
          <TouchableOpacity onPress={handleSkip} style={tw`py-1.5 px-3 bg-white/40 rounded-full`}>
            <Text style={tw`text-sm font-black text-[#0B1044]`}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Horizontal ScrollView for Onboarding Pages */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={tw`flex-1`}>
        
        {/* PAGE 1: Steps 1, 2, 3 */}
        <View style={[tw`flex-1 px-6`, { width: SCREEN_WIDTH }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-6`}>
            <Text style={tw`text-2xl font-extrabold text-[#0B1044] text-center mt-2`}>
              Get Ready in Simple Steps
            </Text>
            <Text style={tw`text-xs text-slate-500 text-center mt-1.5 mb-5 leading-4`}>
              Follow these instructions to start earning with Yaalu.
            </Text>

            {/* STEP 1 */}
            <View style={tw`items-center mb-7`}>
              <View style={tw`w-9.5 h-9.5 rounded-full bg-[#0B1044] items-center justify-center mb-2`}>
                <Text style={tw`text-white text-lg font-extrabold`}>1</Text>
              </View>
              <Text style={tw`text-xl font-extrabold text-[#0B1044] mb-1`}>Enable Your Location</Text>
              <LocationGraphic />
              <Text style={tw`text-xs text-slate-500 text-center leading-4 px-3 mt-1`}>
                Allow GPS access so Yaalu can find nearby delivery requests and guide your route.
              </Text>
            </View>

            {/* STEP 2 */}
            <View style={tw`items-center mb-7`}>
              <View style={tw`w-9.5 h-9.5 rounded-full bg-[#0B1044] items-center justify-center mb-2`}>
                <Text style={tw`text-white text-lg font-extrabold`}>2</Text>
              </View>
              <Text style={tw`text-xl font-extrabold text-[#0B1044] mb-1`}>Stay Updated</Text>
              <NotificationsGraphic />
              <Text style={tw`text-xs text-slate-500 text-center leading-4 px-3 mt-1`}>
                Turn on notifications to receive new delivery requests, cancellations, and payment alerts.
              </Text>
            </View>

            {/* STEP 3 */}
            <View style={tw`items-center mb-7`}>
              <View style={tw`w-9.5 h-9.5 rounded-full bg-[#0B1044] items-center justify-center mb-2`}>
                <Text style={tw`text-white text-lg font-extrabold`}>3</Text>
              </View>
              <Text style={tw`text-xl font-extrabold text-[#0B1044] mb-1`}>Understand Your Dashboard</Text>
              <DashboardGraphic />
              <Text style={tw`text-xs text-slate-500 text-center leading-4 px-3 mt-1`}>
                View your online status, today's earnings, active requests, and performance all in one place.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* PAGE 2: Step 4 (Go Online) */}
        <View style={[tw`flex-1 px-6`, { width: SCREEN_WIDTH }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`items-center pb-6`}>
            <View style={tw`w-9.5 h-9.5 rounded-full bg-[#0B1044] items-center justify-center mt-2.5 mb-2`}>
              <Text style={tw`text-white text-lg font-extrabold`}>4</Text>
            </View>

            <Text style={tw`text-2xl font-extrabold text-[#0B1044] mt-2 text-center`}>Go Online</Text>
            <Text style={tw`text-sm text-slate-500 text-center mt-1.5 mb-4 leading-5 px-4`}>
              Turn on your availability to start receiving delivery requests.
            </Text>

            <GoOnlineGraphic />

            {/* Tip Card */}
            <View style={tw`flex-row items-center bg-[#F0F4FE] rounded-2xl p-4 mt-4 w-full`}>
              <Ionicons name="bulb-outline" size={22} color={YaaluColors.navy} style={tw`mr-2.5`} />
              <Text style={tw`flex-1 text-xs font-semibold text-[#0B1044] leading-4`}>
                Stay online in busy areas to get more delivery requests.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* PAGE 3: Step 5 (Accept an Order) */}
        <View style={[tw`flex-1 px-6`, { width: SCREEN_WIDTH }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`items-center pb-6`}>
            <View style={tw`w-9.5 h-9.5 rounded-full bg-[#0B1044] items-center justify-center mt-2.5 mb-2`}>
              <Text style={tw`text-white text-lg font-extrabold`}>5</Text>
            </View>

            <Text style={tw`text-2xl font-extrabold text-[#0B1044] mt-2 text-center`}>Accept an Order</Text>
            <Text style={tw`text-sm text-slate-500 text-center mt-1.5 mb-4 leading-5 px-4`}>
              You'll receive order details. Review and accept the request.
            </Text>

            <AcceptOrderGraphic />

            {/* Tip Card */}
            <View style={tw`flex-row items-center bg-[#F0F4FE] rounded-2xl p-4 mt-4 w-full`}>
              <Ionicons name="bulb-outline" size={22} color={YaaluColors.navy} style={tw`mr-2.5`} />
              <Text style={tw`flex-1 text-xs font-semibold text-[#0B1044] leading-4`}>
                Check distance and earnings before accepting.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* PAGE 4: Step 6 (Navigate to Pickup) */}
        <View style={[tw`flex-1 px-6`, { width: SCREEN_WIDTH }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`items-center pb-6`}>
            <View style={tw`w-9.5 h-9.5 rounded-full bg-[#0B1044] items-center justify-center mt-2.5 mb-2`}>
              <Text style={tw`text-white text-lg font-extrabold`}>6</Text>
            </View>

            <Text style={tw`text-2xl font-extrabold text-[#0B1044] mt-2 text-center`}>Navigate to Pickup</Text>
            <Text style={tw`text-sm text-slate-500 text-center mt-1.5 mb-4 leading-5 px-4`}>
              Follow the best route to the shop and pick up the order.
            </Text>

            <NavigatePickupGraphic />

            {/* Tip Card */}
            <View style={tw`flex-row items-center bg-[#F0F4FE] rounded-2xl p-4 mt-4 w-full`}>
              <Ionicons name="bulb-outline" size={22} color={YaaluColors.navy} style={tw`mr-2.5`} />
              <Text style={tw`flex-1 text-xs font-semibold text-[#0B1044] leading-4`}>
                Use the in-app navigation for accurate directions.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* PAGE 5: Step 7 (Deliver & Complete) */}
        <View style={[tw`flex-1 px-6`, { width: SCREEN_WIDTH }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`items-center pb-6`}>
            <View style={tw`w-9.5 h-9.5 rounded-full bg-[#0B1044] items-center justify-center mt-2.5 mb-2`}>
              <Text style={tw`text-white text-lg font-extrabold`}>7</Text>
            </View>

            <Text style={tw`text-2xl font-extrabold text-[#0B1044] mt-2 text-center`}>Deliver & Complete</Text>
            <Text style={tw`text-sm text-slate-500 text-center mt-1.5 mb-4 leading-5 px-4`}>
              Reach the customer, hand over the order and mark as delivered.
            </Text>

            <DeliverCompleteGraphic />

            {/* Tip Card */}
            <View style={tw`flex-row items-center bg-[#F0F4FE] rounded-2xl p-4 mt-4 w-full`}>
              <Ionicons name="bulb-outline" size={22} color={YaaluColors.navy} style={tw`mr-2.5`} />
              <Text style={tw`flex-1 text-xs font-semibold text-[#0B1044] leading-4`}>
                Update the status at every step for a smooth delivery experience.
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* PAGE 6: SUCCESS PAGE ("You're All Set!") */}
        <View style={[tw`flex-1 px-6 justify-between py-6`, { width: SCREEN_WIDTH }]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`items-center`}>
            {/* Green Confetti Checkmark Circle */}
            <View style={tw`relative my-6 items-center justify-center`}>
              <View style={tw`w-28 h-28 rounded-full bg-emerald-500 items-center justify-center shadow-lg border-4 border-emerald-100`}>
                <Ionicons name="checkmark" size={56} color="#FFFFFF" />
              </View>
              {/* Confetti Dots */}
              <View style={tw`absolute -top-2 left-2 w-3 h-3 rounded-full bg-yellow-400`} />
              <View style={tw`absolute top-4 -right-3 w-2.5 h-2.5 rounded-full bg-blue-500`} />
              <View style={tw`absolute bottom-2 -left-4 w-2 h-2 rounded-full bg-pink-400`} />
              <View style={tw`absolute -bottom-2 right-4 w-3 h-3 rounded-full bg-emerald-300`} />
            </View>

            <Text style={tw`text-2xl font-black text-[#0B1044] text-center`}>You're All Set!</Text>
            <Text style={tw`text-xs text-slate-500 text-center mt-2 mb-6 px-6 leading-5`}>
              You now know the basics. Go online and start delivering with Yaalu.
            </Text>

            {/* Feature Info Cards */}
            <View style={tw`w-full gap-3.5 mb-6`}>
              <View style={tw`flex-row items-center bg-[#F0F4FE] rounded-2xl p-4`}>
                <View style={tw`w-10 h-10 rounded-xl bg-blue-100 items-center justify-center mr-3.5`}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#1D267D" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm font-bold text-[#0B1044]`}>Earn more</Text>
                  <Text style={tw`text-xs text-slate-500 mt-0.5`}>More deliveries, more earnings.</Text>
                </View>
              </View>

              <View style={tw`flex-row items-center bg-[#F0F4FE] rounded-2xl p-4`}>
                <View style={tw`w-10 h-10 rounded-xl bg-amber-100 items-center justify-center mr-3.5`}>
                  <Ionicons name="star-outline" size={20} color="#D97706" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm font-bold text-[#0B1044]`}>Deliver safely</Text>
                  <Text style={tw`text-xs text-slate-500 mt-0.5`}>Follow safety guidelines at all times.</Text>
                </View>
              </View>

              <View style={tw`flex-row items-center bg-[#F0F4FE] rounded-2xl p-4`}>
                <View style={tw`w-10 h-10 rounded-xl bg-indigo-100 items-center justify-center mr-3.5`}>
                  <Ionicons name="call-outline" size={20} color="#4338CA" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm font-bold text-[#0B1044]`}>We're here to help</Text>
                  <Text style={tw`text-xs text-slate-500 mt-0.5`}>Contact support anytime you need.</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Success Page "Get Started" CTA Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
            style={tw`w-full bg-[#070A2A] rounded-2xl py-4.5 items-center shadow-lg my-2`}>
            <Text style={tw`text-white text-base font-extrabold`}>Get Started</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Bottom Pagination Controls - Hidden on Success Page */}
      {!isSuccessPage && (
        <View style={tw`h-16 flex-row items-center justify-between px-6 border-t border-slate-100`}>
          <TouchableOpacity
            onPress={handlePrev}
            disabled={currentPage === 0}
            style={tw`w-11 h-11 rounded-full border-2 ${
              currentPage === 0 ? 'border-slate-100' : 'border-slate-200'
            } items-center justify-center`}>
            <Ionicons name="chevron-back" size={20} color={currentPage === 0 ? '#CBD5E1' : '#0F172A'} />
          </TouchableOpacity>

          {/* 5 Indicator Dots */}
          <View style={tw`flex-row items-center gap-2`}>
            {[0, 1, 2, 3, 4].map((idx) => (
              <View
                key={idx}
                style={tw`rounded-full ${
                  currentPage === idx
                    ? 'w-3 h-3 bg-[#0B1044]'
                    : 'w-2 h-2 bg-slate-200'
                }`}
              />
            ))}
          </View>

          <TouchableOpacity onPress={handleNext} style={tw`w-11 h-11 rounded-full border-2 border-slate-200 items-center justify-center`}>
            <Ionicons name="chevron-forward" size={20} color="#0F172A" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

