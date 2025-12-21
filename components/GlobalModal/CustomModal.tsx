import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import Settings from './Settings';
import Addresses from './Addresses';
import Orders from './Orders';
import AddAddressPage from './AddAddressPage';

const { height: windowHeight } = Dimensions.get('window');

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CustomModal() {
  const { isGlobalModalOpen, closeGlobalModal, contentString, isMainContentScalable } = useGlobalModalStore();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(windowHeight);

  const backdropAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value
    };
  });

  const contentAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });

  useAnimatedReaction(
    () => isGlobalModalOpen,
    (isVisible) => {
      opacity.value = withTiming(isVisible ? 1 : 0, { duration: 350, easing: Easing.inOut(Easing.linear) });
      translateY.value = withTiming(isVisible ? 0 : windowHeight, {
        duration: 350,
        easing: Easing.inOut(Easing.linear)
      });
    }
  );

  const renderContent = () => {
    switch (contentString) {
      case GLOBAL_MODAL_CONTENT.SETTINGS:
        return <Settings />;

      case GLOBAL_MODAL_CONTENT.ADDRESSES:
        return <Addresses />;

      case GLOBAL_MODAL_CONTENT.ORDERS:
        return <Orders />;

      case GLOBAL_MODAL_CONTENT.ADD_ADDRESS:
        return <AddAddressPage />;

      default:
        return <Addresses />;
    }
  };

  return (
    <Animated.View
      style={{
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        paddingTop: isMainContentScalable ? 150 : 0
      }}
      pointerEvents={isGlobalModalOpen ? 'auto' : 'none'}
      layout={LinearTransition}
    >
      <AnimatedPressable
        onPress={closeGlobalModal}
        style={[StyleSheet.absoluteFillObject, backdropAnimatedStyles, { backgroundColor: 'rgba(0,0,0,0.5)' }]}
      />
      {/* {isMainContentScalable && (
      )} */}

      <Animated.View style={[{ flex: 1 }, contentAnimatedStyles]}>{renderContent()}</Animated.View>
    </Animated.View>
  );
}
