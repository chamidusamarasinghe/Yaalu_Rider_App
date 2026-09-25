import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />

        {/* Auth Group */}
        <Stack.Screen name="(auth)/onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/email-login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/verify-otp" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/personal-details" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/bank-details" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/vehicle-details" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/vehicle-document" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/driving-license" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register/step1" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register/step2" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register/step3" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register/step4" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register/step5" options={{ headerShown: false }} />

        {/* Profile Group */}
        <Stack.Screen name="(profile)/profile" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)/help-support" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)/settings" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)/wallet" options={{ headerShown: false }} />
        <Stack.Screen name="(profile)/notifications" options={{ headerShown: false }} />

        {/* Delivery Group */}
        <Stack.Screen name="(delivery)/orders" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/order-details" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/new-requests" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/incoming-request" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/request-accepted" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/hire-details" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/navigate-pickup" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/delivery/navigation" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/delivery/step1" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/delivery/step2" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/delivery/step3" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/delivery/step4" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/delivery/proof" options={{ headerShown: false }} />
        <Stack.Screen name="(delivery)/delivery/completed" options={{ headerShown: false }} />

        {/* Bidding Group */}
        <Stack.Screen name="(bidding)/bid-request" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/place-bid" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/bid-submitted" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/bid-won" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/bid-lost" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/bid-history" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/bid-ending-soon" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/live-bidding" options={{ headerShown: false }} />
        <Stack.Screen name="(bidding)/live-bids" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
