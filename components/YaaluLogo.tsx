import React from 'react';
import { View, Image, ImageStyle, StyleProp } from 'react-native';
import tw from 'twrnc';

interface YaaluLogoProps {
  size?: number;
  showWordmark?: boolean;
  style?: StyleProp<ImageStyle>;
  variant?: 'badge' | 'wordmark' | 'full';
}

export function YaaluLogo({
  size = 90,
  showWordmark = true,
  variant = 'full',
}: YaaluLogoProps) {
  if (variant === 'wordmark') {
    return (
      <Image
        source={require('@/assets/images/yaalu-wordmark.png')}
        style={[{ width: size * 1.8, height: size * 0.45 }]}
        resizeMode="contain"
      />
    );
  }

  if (variant === 'badge') {
    return (
      <View style={[tw`overflow-hidden shadow-lg`, { width: size, height: size, borderRadius: size * 0.22 }]}>
        <Image
          source={require('@/assets/images/yaalu-logo.png')}
          style={{ width: size, height: size, borderRadius: size * 0.22 }}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Full Variant: Badge Logo + YAALU Wordmark Image
  return (
    <View style={tw`items-center justify-center`}>
      <View style={[tw`overflow-hidden shadow-lg`, { width: size, height: size, borderRadius: size * 0.22 }]}>
        <Image
          source={require('@/assets/images/yaalu-logo.png')}
          style={{ width: size, height: size, borderRadius: size * 0.22 }}
          resizeMode="cover"
        />
      </View>

      {showWordmark && (
        <Image
          source={require('@/assets/images/yaalu-wordmark.png')}
          style={[tw`mt-2`, { width: size * 1.6, height: size * 0.4 }]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}
