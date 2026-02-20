import { useColorScheme } from 'nativewind';

const LIGHT = {
  bg: '#ffffff',
  surface: '#ffffff',
  surfaceAlt: '#f5f5f4',
  elevated: '#f3f3f3',
  border: '#e7e5e4',
  borderLight: '#f5f5f4',
  text: '#1c1917',
  textSecondary: '#78716c',
  textMuted: '#a8a29e',
  placeholder: '#777777',
  iconDefault: '#000000',
  iconMuted: '#777777',
  iconSecondary: '#57534e',
  accent: '#EA004B',
  pinkBg: '#fdf2f8',
  groceryBg: '#f0fdf4',
  foodBg: '#fdf2f8',
  itemCountBg: '#f5f5f4',
  switchTrackOff: '#d4d4d4',
  switchThumb: '#ffffff',
} as const;

const DARK = {
  bg: '#121220',
  surface: '#222233',
  surfaceAlt: '#252538',
  elevated: '#252538',
  border: '#2e2e42',
  borderLight: '#2e2e42',
  text: '#e4e4e7',
  textSecondary: '#a1a1aa',
  textMuted: '#71717a',
  placeholder: '#71717a',
  iconDefault: '#e4e4e7',
  iconMuted: '#71717a',
  iconSecondary: '#a1a1aa',
  accent: '#EA004B',
  pinkBg: '#2a1a28',
  groceryBg: '#1a2a24',
  foodBg: '#2a2a3d',
  itemCountBg: '#252538',
  switchTrackOff: '#3a3a50',
  switchThumb: '#e4e4e7',
} as const;

export function useTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? DARK : LIGHT;

  return { colors, isDark, colorScheme };
}

export type ThemeColors = typeof LIGHT;
