import { chechnyaBounds, chrPolygon, placesGeoJSON } from '@/constants/map';
import MapboxGL, { FillExtrusionLayer, UserLocation } from '@rnmapbox/maps';
import React, { memo, useEffect, useRef, useState } from 'react';
import { Image, PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '../Icon';

import { Marker, Yamap } from 'react-native-yamap-plus';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const groznyCoords = [
  { lat: 43.3178, lon: 45.6986 },
  { lat: 43.3184, lon: 45.6952 },
  { lat: 43.3169, lon: 45.7011 },
  { lat: 43.3191, lon: 45.6998 },
  { lat: 43.3172, lon: 45.6969 },
  { lat: 43.3189, lon: 45.7023 },
  { lat: 43.3165, lon: 45.6977 },
  { lat: 43.3196, lon: 45.6948 },
  { lat: 43.3176, lon: 45.7004 },
  { lat: 43.3181, lon: 45.6971 }
];

const markers = [
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/cz9cw-listing.jpg?width=400&height=225',
    title: 'test',
    id: 1,
    lat: 43.318,
    lon: 45.689
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/lpbe-listing.jpg?width=400&height=225',
    title: 'test',
    id: 2,
    lat: 43.3178,
    lon: 45.6986
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/cv0ht-listing.jpg?width=400&height=225',
    title: 'test',
    id: 3,
    lat: 43.3169,
    lon: 45.7011
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/x3p9-listing.jpg?width=400&height=225',
    title: 'test',
    id: 4,
    lat: 43.3191,
    lon: 45.6998
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/cz9cw-listing.jpg?width=400&height=225',
    title: 'test',
    id: 5,
    lat: 43.3172,
    lon: 45.6969
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/lpbe-listing.jpg?width=400&height=225',
    title: 'test',
    id: 6,
    lat: 43.3189,
    lon: 45.7023
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/cz9cw-listing.jpg?width=400&height=225',
    title: 'test',
    id: 7,
    lat: 43.3165,
    lon: 45.6977
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/x3p9-listing.jpg?width=400&height=225',
    title: 'test',
    id: 8,
    lat: 43.3196,
    lon: 45.6948
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/cz9cw-listing.jpg?width=400&height=225',
    title: 'test',
    id: 9,
    lat: 43.3176,
    lon: 45.7004
  },
  {
    source: 'https://images.deliveryhero.io/image/fd-tr/LH/lpbe-listing.jpg?width=400&height=225',
    title: 'test',
    id: 10,
    lat: 43.3181,
    lon: 45.6971
  }
];

const Map = memo(({ isVisible, centerChanged, ...restProps }: any) => {
  const center = [45.6889, 43.312]; // [lng, lat]
  const cameraRef = useRef<any>(null);
  const [coords, setCoords] = useState<number[]>(center);
  const [address, setAddress] = useState<string>('');

  const [mapKey, setMapKey] = useState(0);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    // if (isVisible) return;

    // Запрос разрешения для Android
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      }
    };
    requestPermissions();
  }, []);

  const goToMyLocation = async () => {
    cameraRef.current?.setCamera({
      centerCoordinate: coords,
      zoomLevel: 14,
      animationMode: 'flyTo', // делает плавную анимацию, как flyTo
      animationDuration: 1500
    });
  };

  const onMarkerPress = (marker: any) => {
    console.log('activeMarker:', typeof marker.id);
    setActiveMarker(marker.id);
  };

  return (
    <View style={styles.page} {...restProps}>
      <View style={styles.container}>
        <Yamap
          nightMode
          rotateGesturesDisabled
          style={{ flex: 1 }}
          initialRegion={{
            lat: 43.318,
            lon: 45.689,
            zoom: 14
          }}
        >
          {markers.map((place) => {
            const isActive = activeMarker === place.id;

            return (
              <Marker
                key={place.id}
                scale={isActive ? 0.45 : 0.3}
                point={{ lat: place.lat, lon: place.lon }}
                onPress={() => onMarkerPress(place)}
                source={require('@/assets/images/marker.png')}
              >
                {/* {isActive ? (
                  <View
                    pointerEvents="none"
                    className="items-center bg-white rounded-full w-[50px] h-[30px] justify-center"
                    style={{
                      borderWidth: 2
                      // borderColor: activeMarker === place.id ? 'red' : 'transparent'
                    }}
                  >
                    <Text className="text-[20px] font-bold">{place.title}</Text>
                  </View>
                ) : (
                  <View
                    pointerEvents="none"
                    className="items-center bg-white rounded-full w-[50px] h-[30px] justify-center"
                    style={{
                      borderWidth: 0
                      // borderColor: activeMarker === place.id ? 'red' : 'transparent'
                    }}
                  >
                    <Text className="text-[20px] font-bold">{place.title}</Text>
                  </View>
                )} */}
              </Marker>
            );
          })}
        </Yamap>

        {/* <View style={styles.pinContainer} className="items-center relative">
          <Animated.View
            style={[
              markerAnimatedStyles,
              {
                // iOS
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 8,

                // Android
                elevation: 8,

                borderRadius: '50%'
              }
            ]}
            className="justify-center items-center w-[30px] h-[30px] bg-red-600 rounded-full z-10"
          >
            <View className="w-[15px] h-[15px] border-2 border-white rounded-full"></View>
          </Animated.View>

          <Animated.View
            style={[markerLineAnimatedStyles]}
            className="w-[2px] h-[20px] bg-red-600 -mt-4 mb-1"
          ></Animated.View>

          <Animated.View
            style={[markerShadowAnimatedStyles]}
            className="w-[25px] h-[7px] bg-stone-800 rounded-[50%] opacity-40"
          ></Animated.View>
        </View> */}

        {/* <MapboxGL.MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
          zoomEnabled={true}
          scrollEnabled={true}
          pitchEnabled={true}
        >
          <MapboxGL.Images
            images={{
              'marker-icon': require('@/assets/images/marker.png')
            }}
          />

          <MapboxGL.ShapeSource
            id="places"
            shape={placesGeoJSON}
            onPress={(e) => {
              const feature = e.features[0];
              console.log('Нажали на:', feature.properties.name);
            }}
          >
            <MapboxGL.SymbolLayer
              id="places-icons"
              style={{
                iconImage: 'marker-icon', // название иконки
                iconSize: 0.12,
                iconAllowOverlap: true,
                textField: ['get', 'name'],
                textOffset: [0, 1.5],
                textSize: 12
              }}
            />
          </MapboxGL.ShapeSource>

          <MapboxGL.ShapeSource id="chechnya-border" shape={chrPolygon}>
            <MapboxGL.LineLayer
              id="chechnya-line"
              style={{
                lineWidth: 3,
                lineColor: 'green'
              }}
              maxZoomLevel={10}
            />

            <MapboxGL.FillLayer
              id="chechnya-fill"
              style={{
                fillColor: 'rgba(255,0,0,0.1)',
                fillOutlineColor: 'green'
              }}
              maxZoomLevel={10}
            />
          </MapboxGL.ShapeSource>

          <UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            onUpdate={(location: any) => {
              setCoords([location.coords.longitude, location.coords.latitude]);
            }}
          />

          <MapboxGL.Camera
            defaultSettings={{
              centerCoordinate: center,
              zoomLevel: 12,
              pitch: 0,
              heading: 0
            }}
            ref={cameraRef}
            zoomLevel={12}
            centerCoordinate={center}
            maxBounds={chechnyaBounds}
            animationMode="flyTo"
          />

          <FillExtrusionLayer
            id="3d-buildings"
            sourceLayerID="building"
            sourceID="composite"
            minZoomLevel={15}
            maxZoomLevel={22}
            style={{
              fillExtrusionColor: '#d9d9ce',
              fillExtrusionHeight: ['interpolate', ['linear'], ['zoom'], 10, 0, 10.05, ['get', 'height']],
              fillExtrusionBase: ['get', 'min_height'],
              fillExtrusionOpacity: 1
            }}
          />
        </MapboxGL.MapView> */}
        <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}>
          <Icon name="locate" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

Map.displayName = 'Map';

export default Map;

const styles = StyleSheet.create({
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -22.5 }, { translateY: -45 }], // центр + смещение вверх
    zIndex: 200
  },
  pin: {
    width: 45,
    height: 45
  },

  page: {
    flex: 1
  },
  container: {
    position: 'relative',
    flex: 1
  },
  map: {
    flex: 1,
    height: 300
  },
  myLocationButton: {
    position: 'absolute',
    top: 150,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 25,
    padding: 8,
    elevation: 4,
    zIndex: 100
  }
});
