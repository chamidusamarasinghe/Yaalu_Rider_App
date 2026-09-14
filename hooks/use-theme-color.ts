/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
<<<<<<< HEAD
  const theme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colorFromProps = props[theme === 'dark' ? 'dark' : 'light'];
=======
  const scheme = useColorScheme();
  const theme: 'light' | 'dark' = scheme === 'dark' ? 'dark' : 'light';
  const colorFromProps = props[theme];
>>>>>>> 85a2985458da56e75b8bfb3bdd27aeb712afa942

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme === 'dark' ? 'dark' : 'light'][colorName];
  }
}
