import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  useBottomSheet,
  useBottomSheetInternal,
  useBottomSheetSpringConfigs,
  useBottomSheetTimingConfigs
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { Easing, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetPositionWatcher } from '@/components/BottomSheetPositionWatcher';

export function GlobalBottomSheet({ onChangePostion }: any) {
  const sheetRef = useRef<BottomSheet>(null);
  const {
    isGlobalBottomSheetOpen,
    isIndicatorVisible,
    content,
    closeGlobalBottomSheet,
    snaps = []
  } = useBottomSheetStore();

  // const snapPoints = useMemo(() => ['25%'], []);

  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.linear
  });

  const handleSheetPosition = (pos: number) => {
    onChangePostion(pos);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        onClose={closeGlobalBottomSheet}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [closeGlobalBottomSheet]
  );

  useEffect(() => {
    if (isGlobalBottomSheetOpen) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [isGlobalBottomSheetOpen, sheetRef]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snaps}
      enableOverDrag
      animationConfigs={animationConfigs}
      enableDynamicSizing={snaps.length === 0}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      // onChange={handleSheetChange}
      // handleIndicatorStyle={{ borderRadius: 20 }}
      onClose={closeGlobalBottomSheet}
      handleComponent={
        isIndicatorVisible
          ? () => (
              <View className="pt-4 pb-6 items-center">
                <View className="h-[4px] w-[40px] rounded-full bg-stone-700"></View>
              </View>
            )
          : null
      }
    >
      <BottomSheetPositionWatcher onChange={handleSheetPosition} />

      {content}
    </BottomSheet>
  );
}
