import { Platform, useWindowDimensions } from 'react-native';

// On a computer screen (web, wide window) the app uses a website layout:
// a top navigation bar and wider pages. Phones and narrow windows keep the app layout.
export const WIDE_FROM = 900;
export const PAGE_MAX = 1120;
export const READING_MAX = 760;

export function useWide() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= WIDE_FROM;
}
