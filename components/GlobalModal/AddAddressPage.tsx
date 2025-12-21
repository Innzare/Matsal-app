import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Button
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useIsFocused } from '@react-navigation/native';
import Map from '@/components/Maps/AddressMap';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetView,
  useBottomSheetTimingConfigs
} from '@gorhom/bottom-sheet';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  LinearTransition,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { BottomSheetPositionWatcher } from '../BottomSheetPositionWatcher';
import * as Location from 'expo-location';
import { GeoFigureType, Search, SearchType, Suggest, SuggestType } from 'react-native-yamap-plus';
import Input from '../TextInput';
import { Select } from '../Select';
import { LinearGradient } from 'expo-linear-gradient';
import { useAddressesStore } from '@/store/useAddressesStore';

const AnimatedMap = Animated.createAnimatedComponent(Map);
const SCREEN_HEIGHT = Dimensions.get('window').height;

const DADATA_TOKEN = 'b88d03dbba4d517745536d30790f8fc8d577f1d5';
const TOKEN = 'pk.eyJ1IjoiaW5uemFyZSIsImEiOiJjbWlodWxmbm4wbGYyM2RxeDc0YWNhMGdyIn0.YiiorEKUFjehcx0YyhiTDQ';

const YANDEX_GEOCODER_API_KEY = 'c970e06a-f991-40b4-8586-670daf047261';
// const bbox = '45.6025,43.3437~45.7754,43.2302';
const bbox = '45.6160,43.2540,45.8760,43.4200';
const proximity = '45.7000,43.3166';

const initialCenterCoords = { lat: 43.318, lon: 45.689 };

export default function AddAddress() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal } = useGlobalModalStore();
  const { addresses, addAddress, setAddressForEdit, addressForEdit, editAddress } = useAddressesStore();
  const isFocused = useIsFocused();

  const mapRef = useRef<any>(null);
  const sheetRef = useRef<any>(null);

  const snapPoints = useMemo(() => ['30%', '63%'], []);
  const animationConfigs = useBottomSheetTimingConfigs({
    duration: 250,
    easing: Easing.linear
  });

  const searchAddressInputRef = useRef<TextInput>(null);

  const [centerCoords, setCenterCoords] = useState<{ lat: number; lon: number }>(initialCenterCoords);
  const [address, setAddress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapInitializing, setIsMapInitializing] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  // const bottomSheetRef = useRef<BottomSheet>(null);
  // const snapPoints = useMemo(() => ['20%', '50%', '80%'], []);

  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (addressForEdit) {
      setAddress(addressForEdit);
      setIsAddressSelected(true);
      mapRef.current.setCenter(addressForEdit.point, 18, 0, 0, 0.4);

      setTimeout(() => {
        sheetRef.current.snapToIndex(1);
      }, 200);
    }
  }, []);

  const onClosePagePress = () => {
    if (addressForEdit) {
      setAddressForEdit(null);
    }

    closeGlobalModal();
    sheetRef.current.close(); // вызвано здесь и именно после closeGlobalModal чтобы избежать задержки анимации
  };

  const debounce = (func: any, delay: any) => {
    let timer: any;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // const searchAddress = async (query: string) => {
  //   if (!query) return;
  //   const res = await fetch(
  //     `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?bbox=${bbox}&proximity=${proximity}&types=address&access_token=${TOKEN}&language=ru`

  //     // `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_TOKEN}&format=json&geocode=${encodeURIComponent(query)}`
  //   );
  //   const data = await res.json();

  //   return data;
  // };

  const searchAddress = async (query: string = '') => {
    if (query.trim().length < 3) return [];

    setIsLoading(true);

    try {
      const suggestionsWithCoards = await Suggest.suggestWithCoords(`Грозный ${query}`, {
        suggestTypes: [SuggestType.GEO],
        boundingBox: {
          southWest: { lat: 43.178339, lon: 45.432412 },
          northEast: { lat: 43.406213, lon: 45.815463 }
        }
      });

      const onlyGrozny = suggestionsWithCoards.filter((s) => s.subtitle?.toLocaleLowerCase()?.includes('грозный'));

      // const res = suggestionsWithCoards.map((item: any) => {
      //   return Search.resolveURI(item.uri);
      // });

      // [[45.432412, 43.178339], [45.815463, 43.406213]]

      // const res = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json',
      //     Authorization: `Token ${DADATA_TOKEN}`
      //   },
      //   body: JSON.stringify({
      //     query,
      //     count: 5,
      //     from_bound: { value: 'city' },
      //     to_bound: { value: 'house' },
      //     locations: [
      //       { city: 'Грозный' } // 🔥 Ограничение по городу
      //     ]
      //   })
      // });

      // const GROZNY_BBOX = '45.6580,43.2530~45.8150,43.3450';

      // const url = `https://geocode-maps.yandex.ru/1.x/?apikey=${YANDEX_GEOCODER_API_KEY}&format=json&geocode=${encodeURIComponent(
      //   `${query}`
      // )}`;

      // const res = await fetch(url)

      // const json = await res.json();

      console.log('suggestionsWithCoards', suggestionsWithCoards);
      // console.log('res', res);

      return onlyGrozny || [];

      // return [];
      // return json.suggestions;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce(searchAddress, 500);

  const onSearch = useCallback(
    debounce(async (text: string) => {
      const res: any = await searchAddress(text);

      console.log('res', res);
      setResults(res);
    }, 400),
    []
  );

  const onChange = (text: string) => {
    setValue(text);

    if (text.trim() === '') {
      setResults([]);
      return;
    }

    onSearch(text);
  };

  const ADDRESS_FIELD = {
    DISTRICT: 'district',
    CITY: 'city',
    STREET: 'street',
    STREET_WITH_HOUSE: 'streetWithHouse',
    HOUSE: 'house',
    ENTRANCE: 'entrance',
    FLOOR: 'floor',
    FLAT: 'flat',
    COMMENT: 'comment'
  };

  const onChangeAddressField = (text: string, field: string) => {
    setAddress((prev: any) => ({
      ...prev,
      [field]: text
    }));
    // switch (field) {
    //   case ADDRESS_FIELD.HOUSE:
    //     break;

    //   case ADDRESS_FIELD.ENTRANCE:
    //     break;

    //   case ADDRESS_FIELD.FLOOR:
    //     break;

    //   case ADDRESS_FIELD.FLAT:
    //     break;

    //   case ADDRESS_FIELD.COMMENT:
    //     break;

    //   default:
    //     break;
    // }
  };

  const getAddressByCoords = async (lat: number, lon: number) => {
    const url = `https://geocode-maps.yandex.ru/1.x/?format=json&lang=ru_RU&geocode=${lon},${lat}&apikey=${YANDEX_GEOCODER_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    const feature = data.response.GeoObjectCollection.featureMember[0]?.GeoObject;

    if (!feature) return null;

    return {
      full: feature.metaDataProperty.GeocoderMetaData.text,
      country: feature.metaDataProperty.GeocoderMetaData.Address.Components.find((c: any) => c.kind === 'country')
        ?.name,
      city: feature.metaDataProperty.GeocoderMetaData.Address.Components.find((c: any) => c.kind === 'locality')?.name,
      street: feature.metaDataProperty.GeocoderMetaData.Address.Components.find((c: any) => c.kind === 'street')?.name,
      house: feature.metaDataProperty.GeocoderMetaData.Address.Components.find((c: any) => c.kind === 'house')?.name
    };
  };

  const getAddressParts = (address: any) => {
    let entrance = '';
    let floor = '';
    let flat = '';
    let comment = '';
    let street = '';
    let streetWithHouse = '';
    let house = '';
    let district = '';
    let city = '';

    const addressParts = [...address?.Components].sort((a: any, b: any) => a.kind - b.kind) || [];

    console.log('addressParts', addressParts);

    const map = {
      1: 'country',
      2: 'region',
      3: 'province',
      4: 'area',
      5: 'locality', // город
      6: 'district',
      7: 'street',
      8: 'house'
    };

    addressParts.forEach((item: any) => {
      const { name, kind } = item;

      switch (kind) {
        case 4:
          district = name;
          break;

        case 5:
          city = city.trim() === '' ? name : `${city}, ${name}`;
          break;

        case 6:
          district = district.trim() === '' ? name : `${district}, ${name}`;
          break;

        case 7:
          street = name;
          break;

        case 8:
          const housePart = name.split(', ')[1];

          streetWithHouse = name;
          house = housePart;

          break;

        default:
          break;
      }
    });

    return {
      entrance,
      floor,
      flat,
      comment,
      district,
      city,
      street,
      streetWithHouse,
      house,
      point: address?.point
    };
  };

  const onCenterChange = async ({ lat, lon }: { lat: number; lon: number }) => {
    setIsAddressSelected(false);
    setCenterCoords({ lat, lon });
    setAddressByCurrentMarkerLocation({ lat, lon });

    sheetRef.current.snapToIndex(0);
  };

  const setAddressByCurrentMarkerLocation = async ({ lat, lon }: { lat: number; lon: number }) => {
    setIsLoading(true);

    try {
      const address = await Search.searchPoint({ lat, lon }, 16, {
        disableSpellingCorrection: true,
        geometry: true
      });

      console.log('address', address);

      setAddress(getAddressParts(address));
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAddressFromCoords = async ({ lat, lon }: { lat: number; lon: number }) => {
    // const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?access_token=${TOKEN}&language=ru`;

    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru-RU`;
    // const query = { lat, lon };

    try {
      // const res = await fetch(url, {
      //   method: 'POST',
      //   mode: 'cors',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Accept: 'application/json',
      //     Authorization: 'Token ' + DADATA_TOKEN
      //   },
      //   body: JSON.stringify({
      //     ...query,
      //     count: 1
      //   })
      // });

      const res = await fetch(url);

      const data = await res.json();
      console.log('nominatim: ', data);
      return data ?? 'Адрес не найден';
    } catch (e: any) {
      return 'Ошибка получения адреса:' + e;
    }
  };

  const getAddressNameFormatted = (item: any) => {
    // const subtitle = !item?.subtitle ? '' : item?.title ? `${item?.subtitle}, ` : `${item?.subtitle}`;
    // const title = item?.title ? `${item?.title}` : '';

    const { district = '', city = '', street = '', streetWithHouse = '', house = '' } = item;
    const streetFormatted = streetWithHouse ? streetWithHouse : street;

    const stringFormatted = [city, streetFormatted].filter((item) => item.length > 0).join(', ');

    // const districtText = ``;
    // const cityText = ``;
    // const streetText = ``;
    // const streetWithHouseText = ``;

    return { main: stringFormatted, additional: district };
  };

  const isHouseInAddressExist = (address: any) => {
    if (address?.Components) {
      const components = address?.Components || [];
      const streetWithHouseInAddress = components.find((item: any) => item.kind === 8)?.name || '';
      const housePart = streetWithHouseInAddress.split(', ')[1];

      return !!housePart;
    }

    const housePart = address.title.split(', ')[1];

    return !!housePart;
  };

  const onSearchResultsItemPress = async (item: any) => {
    if (!isHouseInAddressExist(item)) {
      setValue(`${item.title}, `);
      setResults([]);
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const result = await Search.resolveURI(item.uri);
      // const itemWithPoint = {
      //   ...item,
      //   point: result.point
      // };

      const address = await Search.searchPoint({ lat: result.point.lat, lon: result.point.lon }, 16, {
        disableSpellingCorrection: true,
        geometry: true
      });

      console.log('item', item);
      console.log('result', result);
      console.log('address', address);

      const lat = Number(result.point.lat);
      const lon = Number(result.point.lon);

      mapRef.current.setCenter({ lat, lon }, 17, 0, 0, 0.4);

      setResults([]);
      setAddress(getAddressParts(address));
      sheetRef.current.snapToIndex(0);
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  async function getUserLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest
    });

    console.log({
      lat: location.coords.latitude,
      lon: location.coords.longitude
    });
    return {
      lat: location.coords.latitude,
      lon: location.coords.longitude
    };
  }

  const setMapToGrozny = () => {
    mapRef.current.setCenter(initialCenterCoords, 14, 0, 0, 0.4);

    onCenterChange(initialCenterCoords);
  };

  const goToMyLocation = async () => {
    Keyboard.dismiss();
    const coords: any = await getUserLocation();
    mapRef.current.setCenter({ lat: coords.lat, lon: coords.lon }, 16, 0, 0, 0.4);

    await onCenterChange({ lat: coords.lat, lon: coords.lon });
  };

  const sheetPos = useSharedValue(0);

  const handleSheetPosition = (pos: number) => {
    sheetPos.value = pos;
  };

  const animatedMapStyle = useAnimatedStyle(() => {
    return {
      // paddingBottom: interpolate(
      //   sheetPos.value,
      //   [SCREEN_HEIGHT, 0], // 300 — высота снаппоинта (пример)
      //   [insets.bottom + 30, 700],
      //   Extrapolation.CLAMP
      // ),

      transform: [
        {
          translateY: interpolate(
            sheetPos.value,
            [SCREEN_HEIGHT, 0], // 300 — высота снаппоинта (пример)
            [0, -280],
            Extrapolation.CLAMP
          )
        }
      ]
    };
  });

  const isAddressNotAvailable = () => {
    const city = address?.city || '';
    const isNotGrozny = !city.toLowerCase().includes('грозный');

    return isNotGrozny;
  };

  const onMoveToAddressDetailsPress = () => {
    setIsAddressSelected(true);
    sheetRef.current.snapToIndex(1);
    mapRef.current.setCenter({ lat: address.point.lat, lon: address.point.lon }, 18, 0, 0, 0.4);
  };

  const onChangeAddressPress = () => {
    setAddress(null);
    setIsAddressSelected(false);
  };

  const onWriteAddressManuallyPress = () => {
    setAddress(null);
    setValue('');
    sheetRef.current.snapToIndex(1);

    setTimeout(() => {
      searchAddressInputRef.current?.focus();
    }, 250);
  };

  const onSaveAddressPress = () => {
    if (addressForEdit) {
      editAddress(address.id, address);
      setAddressForEdit(null);
    } else {
      addAddress(address);
    }

    closeGlobalModal();
    sheetRef.current.close();
  };

  const renderBottomSheetContent = () => {
    switch (true) {
      case address !== null && !isAddressSelected:
        return (
          <View className="p-6 pt-2 gap-10" style={{ paddingBottom: insets.bottom }}>
            {isLoading ? (
              <View className="flex-1 mt-[100px]">
                <ActivityIndicator size="large" color="#EA004B" />
              </View>
            ) : (
              <>
                <BottomSheetScrollView>
                  <View className="gap-8">
                    <View className="flex-row items-center gap-6">
                      <View className="flex-1">
                        <Text className="font-bold text-lg leading-6 mb-1">
                          {getAddressNameFormatted(address).main}
                        </Text>
                        <Text className="text-stone-600 text-sm leading-4">
                          {getAddressNameFormatted(address).additional}
                        </Text>
                      </View>
                    </View>

                    {isAddressNotAvailable() && (
                      <View className="flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <Icon name="info-circle" set="ant" size={24} color="orange" />

                        <View className="gap-2 flex-1 items-start">
                          <Text className="font-semibold">К сожалению, в этой локации сервис пока не работает :(</Text>
                          <Text className="text-sm text-stone-600 leading-4">
                            На данный момент сервис работает только по городу{' '}
                            <Text className="font-semibold">Грозный</Text>
                          </Text>

                          <TouchableOpacity
                            onPress={setMapToGrozny}
                            activeOpacity={0.7}
                            className="flex-row items-center gap-2 border-b border-stone-400 mt-2"
                          >
                            <Text className="">Переместить карту в Грозный</Text>
                            <Icon set="feather" name="arrow-up-right" size={21} color="#EA004B" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </BottomSheetScrollView>

                {!isAddressNotAvailable() && (
                  <>
                    {address.house ? (
                      <View>
                        <Text className="text-xl font-bold text-stone-700 text-center mb-6">Верный адрес?</Text>

                        <View className="gap-2">
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={onMoveToAddressDetailsPress}
                            className="bg-stone-200 p-3 rounded-full items-center justify-center flex-row gap-3"
                            style={{ backgroundColor: '#EA004B' }}
                          >
                            <Text className="text-white font-semibold">Да, перейти к деталям</Text>
                            <Icon set="fontAwesome" name="list-ul" size={18} color="white" />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={onWriteAddressManuallyPress}
                            className="p-3 rounded-full items-center justify-center flex-row gap-3"
                            style={{ borderColor: '#EA004B' }}
                          >
                            <Text className="font-semibold">Нет, ввести адрес вручную</Text>
                            <Icon name="edit-3" set="feather" size={20} color="#000" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <Icon name="info-circle" set="ant" size={24} color="orange" />

                        <View className="flex-1 items-start">
                          <Text className="font-semibold">
                            Для корректного адреса необходимо указать улицу и номер дома
                          </Text>

                          <TouchableOpacity
                            onPress={onWriteAddressManuallyPress}
                            className="py-1 items-center flex-row gap-3 border-b mt-3"
                          >
                            <Text className="text-black">Ввести адрес вручную</Text>
                            <Icon name="edit-3" set="feather" size={18} color="#EA004B" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </>
                )}
              </>
            )}
          </View>
        );

      case address === null && !isAddressSelected:
        return (
          <View className="flex-1" pointerEvents={isMapInitializing ? 'none' : undefined}>
            <View className="gap-4 px-6">
              <Select />

              <Input
                ref={searchAddressInputRef}
                label="Улица и дом"
                placeholder="Введите название улицы и номер дома"
                value={value}
                clearable
                bottomSheetInput
                loading={isLoading}
                onChangeText={onChange}
                // onFocus={() => {
                //   sheetRef.current?.snapToIndex(1);
                // }}
              />
            </View>

            <BottomSheetScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="always"
              // refreshing={false}
              // onRefresh={() => {}}
            >
              <View className="p-6 gap-8" style={{ paddingBottom: insets.bottom + 30 }}>
                <View>
                  {results.map((item: any, index, arr) => {
                    return (
                      <View key={index}>
                        <TouchableOpacity
                          key={index}
                          activeOpacity={0.7}
                          onPress={() => onSearchResultsItemPress(item)}
                          className="gap-3 rounded-lg flex-row items-center"
                        >
                          <Icon set="feather" name="map-pin" size={18} color="red" />

                          <View className="flex-1">
                            <Text className="font-semibold">{item.title}</Text>
                            <Text className="text-sm text-stone-600">{item.subtitle}</Text>
                          </View>
                        </TouchableOpacity>

                        {arr.length - 1 !== index && <View className="bg-stone-200 h-[1px] w-full my-3" />}
                      </View>
                    );
                  })}
                </View>
              </View>
            </BottomSheetScrollView>
          </View>
        );

      case address !== null && isAddressSelected:
        return (
          <View className="flex-1">
            <View className="px-6 py-4">
              <Text className="font-bold text-lg leading-6 mb-1">{getAddressNameFormatted(address).main}</Text>
              <Text className="text-stone-600 text-sm leading-4">{getAddressNameFormatted(address).additional}</Text>
            </View>

            <View className="flex-row justify-between gap-2 flex-wrap px-6">
              <Input
                className="w-[30%]"
                type="numeric"
                label="Подъезд"
                value={address.entrance}
                clearable
                bottomSheetInput
                loading={isLoading}
                onChangeText={(text) => onChangeAddressField(text, ADDRESS_FIELD.ENTRANCE)}
              />

              <Input
                className="w-[30%]"
                type="numeric"
                label="Этаж"
                value={address.floor}
                clearable
                bottomSheetInput
                loading={isLoading}
                onChangeText={(text) => onChangeAddressField(text, ADDRESS_FIELD.FLOOR)}
              />

              <Input
                className="w-[30%]"
                type="numeric"
                label="Квартира"
                value={address.flat}
                clearable
                bottomSheetInput
                loading={isLoading}
                onChangeText={(text) => onChangeAddressField(text, ADDRESS_FIELD.FLAT)}
              />

              <Input
                className="w-[100%] mt-6"
                label="Комментарий"
                value={address.comment}
                clearable
                bottomSheetInput
                loading={isLoading}
                onChangeText={(text) => onChangeAddressField(text, ADDRESS_FIELD.COMMENT)}
              />
            </View>

            <View className="gap-3 px-6 mt-10">
              <TouchableOpacity
                onPress={onSaveAddressPress}
                activeOpacity={0.7}
                style={{ backgroundColor: '#EA004B' }}
                className="w-[100%] p-4 bg-stone-200 rounded-xl"
              >
                <Text className="text-center text-white font-semibold">Сохранить адрес</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onChangeAddressPress}
                activeOpacity={0.7}
                className="w-[100%] p-4 bg-stone-200 rounded-xl"
              >
                <Text className="text-center font-semibold">Изменить адрес</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return <View></View>;
    }
  };

  return (
    // <TouchableWithoutFeedback className="bg-slate-100 flex-1 relative" onPress={Keyboard.dismiss} accessible={false}>    </TouchableWithoutFeedback>
    <View
      className="flex-1 relative overflow-hidden"
      style={{
        paddingBottom: insets.bottom + 130
      }}
    >
      {isFocused ? <StatusBar barStyle="light-content" /> : null}

      <LinearGradient
        colors={['rgba(0, 0, 0, 0.65)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          height: '10%',
          zIndex: 10
        }}
      />

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onClosePagePress}
        className="w-[40px] h-[40px] pt-0.5 justify-center items-center absolute right-5 z-10 bg-stone-100 rounded-full border border-stone-300"
        style={{
          top: insets.top + 10
        }}
      >
        <Icon set="ant" name="close" size={18} color="#000" />
      </TouchableOpacity>

      {/* <Animated.View style={[animatedMapStyle]} pointerEvents="none">
      </Animated.View> */}
      <Map
        ref={mapRef}
        centerChanged={onCenterChange}
        animatedStyle={animatedMapStyle}
        sheetPos={sheetPos}
        mapInitializing={setIsMapInitializing}
      ></Map>

      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        animationConfigs={animationConfigs}
        enableOverDrag={false}
        enableDynamicSizing={false}
        enablePanDownToClose={false}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        enableBlurKeyboardOnGesture
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 }, // тень сверху
          shadowOpacity: 0.6,
          shadowRadius: 8
        }}
        // handleComponent={null}
      >
        <BottomSheetPositionWatcher onChange={handleSheetPosition} />

        {renderBottomSheetContent()}
      </BottomSheet>
    </View>
  );
}
