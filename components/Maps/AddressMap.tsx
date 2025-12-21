import { chechnyaBounds, chrPolygon, placesGeoJSON } from '@/constants/map';
import MapboxGL, { FillExtrusionLayer, UserLocation } from '@rnmapbox/maps';
import React, { memo, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Icon } from '../Icon';
import Animated, {
  Extrapolation,
  interpolate,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated';
import { Yamap } from 'react-native-yamap-plus';
import * as Location from 'expo-location';
import AnimatedMarker from '../AnimatedMarker';
import { LinearGradient } from 'expo-linear-gradient';
import { useAddressesStore } from '@/store/useAddressesStore';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Map = memo(({ ref, centerChanged, mapPress, animatedStyle, sheetPos, mapInitializing, ...restProps }: any) => {
  const [isMapMovingToCurrentLocation, setIsMapMovingToCurrentLocation] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<null | { lat: number; lon: number }>(null);

  const { addressForEdit } = useAddressesStore();

  const initialCenterCoords = { lat: 43.318, lon: 45.689 };
  const isMapMoving = useSharedValue(true);

  useEffect(() => {
    // Запрос разрешения для Android
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    isMapMoving.value = false; // Чтобы избавиться от лага анимации при первом передвижении

    // centerChanged({ lat: initialCenterCoords.lat, lon: initialCenterCoords.lon });

    if (!addressForEdit) {
      goToMyLocation(true);
    }
  }, []);

  async function getUserLocation(isInitializing: boolean) {
    setisLoading(isInitializing);

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest
    });

    setisLoading(false);

    setCurrentCoords({
      lat: location.coords.latitude,
      lon: location.coords.longitude
    });

    return {
      lat: location.coords.latitude,
      lon: location.coords.longitude
    };
  }

  const goToMyLocation = async (isInitializing: boolean = false) => {
    if (isInitializing) {
      mapInitializing(true);
    }

    setIsMapMovingToCurrentLocation(true);

    if (isInitializing) {
      const coords: any = await getUserLocation(isInitializing);
      ref.current.setCenter({ lat: coords.lat, lon: coords.lon }, 16, 0, 0, 0.4); // второй параметр — zoom
      find({ lat: coords.lat, lon: coords.lon });
      mapInitializing(false);
    } else if (currentCoords) {
      ref.current.setCenter({ lat: currentCoords.lat, lon: currentCoords.lon }, 16, 0, 0, 0.4); // второй параметр — zoom
      find({ lat: currentCoords.lat, lon: currentCoords.lon });
    }
  };

  const find = async ({ lat, lon }: { lat: number; lon: number }) => {
    centerChanged({ lat, lon });
  };

  const animatedMapStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            sheetPos.value,
            [SCREEN_HEIGHT - 200, 0], // 300 — высота снаппоинта (пример)
            [0, -550],
            Extrapolation.CLAMP
          )
        }
      ]
    };
  });

  return (
    <Animated.View className="flex-1 relative" {...restProps} style={[animatedStyle]}>
      {isLoading && (
        <View
          className="absolute left-0 top-0 h-[100%] w-full items-center justify-center z-[999999999999999999]"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <View className="gap-4">
            <ActivityIndicator size="small" color="#EA004B" style={{ transform: [{ scale: 1.5 }] }} />
            <Text className="text-white font-semibold text-lg">Настраиваем карту</Text>
          </View>
        </View>
      )}

      <View className="flex-1 relative">
        <AnimatedMarker isMapMoving={isMapMoving} />

        <Yamap
          ref={ref}
          removeClippedSubviews={false}
          style={{ flex: 1 }}
          rotateGesturesDisabled
          showUserPosition
          nightMode
          initialRegion={{
            lat: initialCenterCoords.lat,
            lon: initialCenterCoords.lon,
            zoom: 14
          }}
          onCameraPositionChange={(e: any) => {
            if (!isMapMoving.value) {
              isMapMoving.value = true;
            }
          }}
          onCameraPositionChangeEnd={(e) => {
            if (e.nativeEvent.reason === 'GESTURES' || (isMapMovingToCurrentLocation && !isLoading)) {
              find({ lat: e.nativeEvent.point.lat, lon: e.nativeEvent.point.lon });
              setIsMapMovingToCurrentLocation(false);
            }

            isMapMoving.value = false;
          }}
        >
          {/* <Marker point={{ lat: 43.318, lon: 45.689 }} /> */}
        </Yamap>

        <Animated.View style={[styles.myLocationButtonWrapper, animatedMapStyle]}>
          <TouchableOpacity style={styles.myLocationButton} onPress={() => goToMyLocation()}>
            <Icon set="fontAwesome" name="location-arrow" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
});

Map.displayName = 'Map';

export default Map;

const styles = StyleSheet.create({
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -40 }], // центр + смещение вверх
    zIndex: 200
  },

  myLocationButtonWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 20
  },

  myLocationButton: {
    // position: 'absolute',
    // bottom: 150,
    // right: 20,
    backgroundColor: '#EA004B',
    borderRadius: 100,
    padding: 12,
    elevation: 4,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
