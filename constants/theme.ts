import { Platform } from 'react-native';

export const YaaluColors = {
  navy: '#0B1044',
  navyDark: '#060826',
  yellow: '#FFC72C',
  gold: '#FFC72C',
  goldDark: '#D9A100',
  goldLight: '#FFF4CE',
  bgLight: '#F3F5FC',
  cardBg: '#FFFFFF',
  textDark: '#0B1044',
  textBody: '#4B5563',
  textMuted: '#6B7280',
  textLight: '#FFFFFF',
  border: '#E5E7EB',
  accentBlue: '#1D267D',
  badgeBg: '#EEF2FF',
  green: '#10B981',
  red: '#EF4444',
};

const tintColorLight = YaaluColors.navy;
const tintColorDark = YaaluColors.gold;

export const Colors = {
  light: {
    text: YaaluColors.textDark,
    background: YaaluColors.cardBg,
    tint: tintColorLight,
    icon: YaaluColors.textMuted,
    tabIconDefault: YaaluColors.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
