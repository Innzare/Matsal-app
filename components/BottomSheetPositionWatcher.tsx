// SheetPositionWatcher.tsx
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { useAnimatedReaction } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export const BottomSheetPositionWatcher = ({ onChange }: any) => {
  const { animatedPosition } = useBottomSheet();
  const { isBackgroundScalable } = useBottomSheetStore();

  useAnimatedReaction(
    () => animatedPosition.value,
    (pos) => {
      isBackgroundScalable && scheduleOnRN(onChange, pos);
    }
  );

  return null;
};
