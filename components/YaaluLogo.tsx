import React from 'react';
import { View, Image, ImageStyle, StyleProp } from 'react-native';
import tw from '@/lib/tw';

interface YaaluLogoProps {
  size?: number;
  showWordmark?: boolean;
  style?: StyleProp<ImageStyle>;
  variant?: 'badge' | 'wordmark' | 'full';
}

export function YaaluLogo({
  size = 90,
  style,
}: YaaluLogoProps) {
  return (
    <View style={[tw`overflow-hidden rounded-2xl shadow-lg`, { width: size, height: size }, style]}>
      <Image
        source={require('../assets/images/yaalu-logo.png')}
        style={{ width: '100%', height: '100%' }}
        resizeMode="cover"
      />
    </View>
  );
}
