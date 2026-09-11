import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
        <Stack.Screen name="register/step1" options={{ headerShown: false }} />
        <Stack.Screen name="register/step2" options={{ headerShown: false }} />
        <Stack.Screen name="register/step3" options={{ headerShown: false }} />
        <Stack.Screen name="register/step4" options={{ headerShown: false }} />
        <Stack.Screen name="register/step5" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="new-requests" options={{ headerShown: false }} />
        <Stack.Screen name="incoming-request" options={{ headerShown: false }} />
        <Stack.Screen name="request-accepted" options={{ headerShown: false }} />
        <Stack.Screen name="hire-details" options={{ headerShown: false }} />
        <Stack.Screen name="bid-request" options={{ headerShown: false }} />
        <Stack.Screen name="place-bid" options={{ headerShown: false }} />
        <Stack.Screen name="bid-submitted" options={{ headerShown: false }} />
        <Stack.Screen name="bid-won" options={{ headerShown: false }} />
        <Stack.Screen name="bid-lost" options={{ headerShown: false }} />
        <Stack.Screen name="bid-history" options={{ headerShown: false }} />
        <Stack.Screen name="bid-ending-soon" options={{ headerShown: false }} />
        <Stack.Screen name="live-bidding" options={{ headerShown: false }} />
        <Stack.Screen name="live-bids" options={{ headerShown: false }} />
        <Stack.Screen name="navigate-pickup" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/navigation" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/step1" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/step2" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/step3" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/step4" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/proof" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/completed" options={{ headerShown: false }} />
        <Stack.Screen name="order-details" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="wallet" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="personal-details" options={{ headerShown: false }} />
        <Stack.Screen name="orders" options={{ headerShown: false }} />
        <Stack.Screen name="help-support" options={{ headerShown: false }} />
        <Stack.Screen name="bank-details" options={{ headerShown: false }} />
        <Stack.Screen name="vehicle-details" options={{ headerShown: false }} />
        <Stack.Screen name="vehicle-document" options={{ headerShown: false }} />
        <Stack.Screen name="driving-license" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

