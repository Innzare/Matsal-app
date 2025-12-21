import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Animated, { useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Icon } from './Icon';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface IProps {
  ref?: any;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  type?: string;
  clearable?: boolean;
  loading?: boolean;
  bottomSheetInput?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function Input(props: IProps) {
  const {
    ref,
    value = '',
    onChangeText,
    placeholder = 'Введите название города',
    label = 'Город',
    type = 'default',
    clearable = false,
    loading = false,
    bottomSheetInput = false,
    className,
    ...restProps
  } = props;

  const InputComponent = bottomSheetInput ? BottomSheetTextInput : TextInput;

  const [isFieldFocused, setIsFieldFocused] = useState(false);
  const isFieldFocusedAnimated = useSharedValue(false);
  const isPlaceHolderVisibleAnimated = useSharedValue(false);

  useAnimatedReaction(
    () => {
      return {
        isFocused: isFieldFocusedAnimated.value,
        hasValue: value.length > 0
      };
    },
    ({ isFocused, hasValue }) => {
      isPlaceHolderVisibleAnimated.value = isFocused && !hasValue;
      // if (isFocused) {
      // }
    }
  );

  const animatedPlaceholderStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isPlaceHolderVisibleAnimated.value ? 0.4 : 0, {
        duration: 100
      })
    };
  });

  const animatedBorderColorStyles = useAnimatedStyle(() => {
    return {
      borderWidth: 1,
      borderColor: withTiming(isFieldFocusedAnimated.value ? '#000' : '#c9c9c9', {
        duration: 200
      })
    };
  });

  const animatedLabelStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isFieldFocusedAnimated.value || value.length !== 0 ? '-200%' : '-50%', {
            duration: 200
          })
        },
        {
          translateX: withTiming(isFieldFocusedAnimated.value || value.length !== 0 ? -15 : 0, {
            duration: 200
          })
        },
        {
          scale: withTiming(isFieldFocusedAnimated.value || value.length !== 0 ? 0.9 : 1, {
            duration: 200
          })
        }
      ]
    };
  });

  return (
    <View className={className}>
      <Text pointerEvents="none" className="text-stone-600 text-sm -mb-1">
        {label}
      </Text>

      <Animated.View
        // style={[animatedBorderColorStyles]}
        // className="flex-row items-center justify-between pr-4 relative bg-slate-50 rounded-lg"
        className="flex-row items-center justify-between border-b border-stone-400"
        style={{ height: 40 }}
        {...restProps}
      >
        <InputComponent
          ref={ref}
          className="flex-1 text-xl leading-[21px] font-bold h-[100%]"
          keyboardType={type}
          selectionColor="red"
          value={value}
          onChangeText={onChangeText}
          onFocus={() => {
            isFieldFocusedAnimated.value = true;
            setIsFieldFocused(true);
          }}
          onBlur={() => {
            isFieldFocusedAnimated.value = false;
            setIsFieldFocused(false);
          }}
          // placeholder={placeholder}
          // placeholderTextColor={'#999'}
        />

        <View className="flex-row items-center h-[100%]">
          {loading && <ActivityIndicator />}

          {clearable && value?.length > 0 && (
            <TouchableOpacity
              // className="absolute right-3 top-[50%] p-1 transform translate-y-[-50%]"
              className="h-[100%] justify-center pl-3"
              activeOpacity={0.7}
              onPress={() => {
                onChangeText('');
              }}
            >
              <Icon set="ant" name="close-circle" size={18} color="#555" />
            </TouchableOpacity>
          )}
        </View>

        {/* {placeholder.length !== 0 && (
        <Animated.Text
          pointerEvents="none"
          className="absolute left-3 top-[50%] pl-1 transform translate-y-[-50%]"
          style={[animatedPlaceholderStyles]}
        >
          {placeholder}
        </Animated.Text>
      )} */}

        {/* <Animated.Text
          pointerEvents="none"
          className="text-lg"
          style={[animatedLabelStyles, { position: 'absolute', left: 15, top: '50%', color: '#555' }]}
        >
          {label}
        </Animated.Text> */}
      </Animated.View>
    </View>
  );
}
