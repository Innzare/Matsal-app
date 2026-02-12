import { Icon } from '@/components/Icon';
import MenuItemContent from '@/components/GlobalBottomSheet/MenuItemContent';
import { Text } from '@/components/Text';
import { RESTAURANTS, RESTAURANTS2 } from '@/constants/resources';
import { useBottomSheetStore } from '@/store/useBottomSheetStore';
import { BottomSheetScrollView, useBottomSheet } from '@gorhom/bottom-sheet';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Platform, Pressable, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MenuSectionsList from '@/components/MenuSectionsList';
import { useCartStore } from '@/store/useCartStore';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { GLOBAL_MODAL_CONTENT } from '@/constants/interface';
import { useFavoritesStore } from '@/store/useFavoritesStore';

const SECTIONS = [
  {
    title: '📣 Рекомендации для Вас',
    type: 'recomendation',
    items: [
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      },
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      }
    ]
  },

  {
    title: '🔥 Популярное',
    type: 'popular',
    items: [
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      },
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      }
    ]
  },

  {
    title: '🍕 Пицца',
    type: null,
    items: [
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      }
    ]
  },
  {
    title: '🌯 Шаурма',
    type: null,
    items: [
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      }
    ]
  },
  {
    title: '🍣 Суши',
    type: null,
    items: [
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      }
    ]
  },
  {
    title: '☕️ Кофе',
    type: null,
    items: [
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      }
    ]
  },
  {
    title: '🥤 Напитки',
    type: null,
    items: [
      {
        name: 'Пицца',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1200',
        image:
          'https://img.freepik.com/free-photo/side-view-pizza-with-slices-bell-pepper-pizza-slices-flour-board-cookware_176474-3185.jpg?t=st=1762275168~exp=1762278768~hmac=b07c113874159d2d7573f0efff55e14c3519eec6fe0cc0e9d1c63a9f83955e30&w=740'
      },
      {
        name: 'Шаурма',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '800',
        image:
          'https://img.freepik.com/free-photo/side-view-doner-with-grilled-chicken-greens-lettuce-tomato-french-fries-table_141793-4881.jpg?t=st=1762275110~exp=1762278710~hmac=5bf8aaf9cda149ed1fb4cdd4d37c264b129caff40411fc642a152b5cae436b85&w=1480'
      },
      {
        name: 'Донер',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '440',
        image:
          'https://img.freepik.com/free-photo/side-view-shawarma-with-fried-potatoes-board-cookware_176474-3215.jpg?t=st=1762274733~exp=1762278333~hmac=cfd01560fe2e0c45747c1b6369de750f7ced7ce4d9170fb599fda0706a4aa307&w=1480'
      },
      {
        name: 'Суши',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '1770',
        image:
          'https://img.freepik.com/free-photo/close-up-plate-with-sushi_23-2148631177.jpg?t=st=1762275204~exp=1762278804~hmac=838e833ad5322daf1a79be321a84c51dd93a4ba308686bfaa537395961eb10fc&w=740'
      },
      {
        name: 'Кофе',
        description:
          'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quas rem, voluptas quod ab repellat, nemo reiciendis quibusdam, maiores commodi distinctio ut quia! Qui molestiae nostrum illum quia obcaecati alias nesciunt.',
        price: '350',
        image:
          'https://img.freepik.com/free-photo/latte-coffee_1122-2728.jpg?t=st=1762275228~exp=1762278828~hmac=abd5a66ec02775f8d1f0ca6446f064cda86f829ecfe3a7fb24e3d39fdff11c84&w=740'
      }
    ]
  }
];

const { width } = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(ExpoImage);

export default function Restaurant() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // const addressOpacity = useSharedValue(1);
  const isHeaderSearchInputVisible = useSharedValue(false);
  const isAutoScrolling = useRef(false);

  const { openGlobalBottomSheet, closeGlobalBottomSheet } = useBottomSheetStore();
  const { carts, setActiveRestaurant } = useCartStore();
  const { openGlobalModal } = useGlobalModalStore();
  const { favoriteRestaurants, toggleFavorite } = useFavoritesStore();
  const isFavorite = favoriteRestaurants.includes(Number(id));
  // const isScrolledUp = useSharedValue(true);

  const isAndroid = Platform.OS === 'android';

  const [refreshing, setRefreshing] = React.useState(false);
  const [deliveryType, setDeliveryType] = React.useState('delivery');

  const tabsRef = useRef<ScrollView>(null);
  const sectionOffsets: any = useRef([]);
  const tabOffsets = useRef<number[]>([]);
  const tabWidths = useRef<number[]>([]);
  const [activeTab, setActiveTab] = useState(1);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [itemsCount, setItemsCount] = useState(1);

  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   setIsLoading(true);

  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 400);
  // }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const scrollRef = useRef<FlatList<any>>(null);
  const scrollY = useSharedValue(0);

  const restarauntsList: any = [...RESTAURANTS, ...RESTAURANTS2];

  const onGoBackPress = () => {
    router.back();
  };

  const scrollHandler = (event: any) => {
    scrollY.value = event.nativeEvent.contentOffset.y;

    if (isAutoScrolling.current) return;

    if (scrollY.value > 400) {
      isHeaderSearchInputVisible.value = true;
    } else {
      isHeaderSearchInputVisible.value = false;
    }

    const y = event.nativeEvent.contentOffset.y + 120;
    const offsets = sectionOffsets.current;
    let current = 1;

    for (let i = 1; i < offsets.length; i++) {
      const start = offsets[i];
      const end = offsets[i + 1] ?? Number.POSITIVE_INFINITY;

      if (y >= start && y < end) {
        current = i;
      }
    }

    if (current !== activeTab) {
      setActiveTab(current);
      scrollTabsTo(current);
    }
  };

  const headerSearchInputStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isHeaderSearchInputVisible.value ? 1 : 0, { duration: 300 })
    };
  });

  const currentRestaurant = restarauntsList.find((item: any) => Number(item.id) === Number(id));

  const handlePressTab = (index: number) => {
    const y = sectionOffsets.current[index] ?? 1;
    isAutoScrolling.current = true;
    scrollRef.current?.scrollToOffset({ offset: y - 80, animated: true });
    // scrollRef.current?.scrollToIndex({
    //   index,
    //   animated: true
    // });
    scrollTabsTo(index);
    setActiveTab(index);
  };

  const onLayoutSection = (index: number) => (e: any) => {
    sectionOffsets.current[index] = e.nativeEvent.layout.y;
  };

  const onLayoutTab = (index: number) => (e: any) => {
    const { x, width } = e.nativeEvent.layout;
    tabOffsets.current[index] = x;
    tabWidths.current[index] = width;
  };

  const scrollTabsTo = (index: number) => {
    if (!tabsRef.current) return;
    const tabX = tabOffsets.current[index];
    const tabWidth = tabWidths.current[index];
    const scrollToX = tabX - (width / 2 - tabWidth / 2);
    tabsRef.current.scrollTo({ x: Math.max(scrollToX, 0), animated: true });
  };

  const { height: wHeight } = Dimensions.get('window');

  const HEADER_IMAGE_HEIGHT = wHeight / 4;

  const headerImageStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [-100, 0, 100],
      [HEADER_IMAGE_HEIGHT + 100, HEADER_IMAGE_HEIGHT, HEADER_IMAGE_HEIGHT - 120],
      Extrapolation.CLAMP
    );

    return {
      height
    };
  });

  const ImageOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0], {
      extrapolateLeft: Extrapolation.CLAMP,
      extrapolateRight: Extrapolation.CLAMP
    });

    return {
      opacity
    };
  });

  const onAboutRestaurantPress = () => {
    router.push(`/restaurants/about/${id}`);
  };

  const onReviewsPress = () => {
    router.push(`/restaurants/reviews/${id}`);
  };

  const onChangeDeliveryTypePress = () => {
    if (deliveryType === 'delivery') {
      setDeliveryType('pickup');
    } else {
      setDeliveryType('delivery');
    }
  };

  const onChangeItemsCountPress = (action: string) => {
    switch (action) {
      case 'add':
        setItemsCount((prev) => prev + 1);
        break;

      case 'reduce':
        setItemsCount((prev) => prev - 1);

        break;

      default:
        break;
    }
  };

  const onSectionsListPress = () => {
    const content = renderSetionsList();

    openGlobalBottomSheet({ content });
  };

  const renderSetionsList = () => {
    return <MenuSectionsList sections={SECTIONS} onTabPress={handlePressTab} />;
    // return (
    //   <BottomSheetScrollView>
    //     <View style={{ paddingBottom: insets.bottom }}>
    //       <View className="items-center py-4 pb-6 mb-2 border-b border-stone-200">
    //         <Text className="uppercase font-bold">Разделы в Меню</Text>
    //       </View>

    //       <View className="px-4 gap-3 mt-4">
    //         {['sticky', ...SECTIONS].map((item: any, index) => {
    //           if (item === 'sticky') return null;
    //           return (
    //             <Pressable
    //               key={index}
    //               className="p-3 bg-stone-100 rounded-lg flex-row items-center justify-between"
    //               onPress={() => {
    //                 handlePressTab(index);
    //                 closeGlobalBottomSheet();
    //               }}
    //             >
    //               <Text className="font-bold">{item.title}</Text>

    //               <Icon set="feather" name="arrow-right" color="#aaa" />
    //             </Pressable>
    //           );
    //         })}

    //         <TouchableOpacity
    //           onPress={closeGlobalBottomSheet}
    //           className="bg-stone-200 text-center rounded-lg mt-4 py-6 items-center border border-stone-400"
    //         >
    //           <Text className="uppercase font-bold">Закрыть</Text>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </BottomSheetScrollView>
    // );
  };

  const onMenuItemPress = (item: any) => {
    openGlobalBottomSheet({
      content: <MenuItemContent item={item} restaurantId={String(id)} restaurantName={currentRestaurant?.name || ''} />,
      snaps: ['85%'],
      isBackgroundScalable: true
    });
  };

  const renderMenuItems = (section: any) => {
    switch (section.type) {
      case 'recomendation': {
        return (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-1 flex-row gap-5 px-6">
              {section.items.map((item: any, i: number, arr: any) => {
                return (
                  <Pressable key={i} onPress={() => onMenuItemPress(item)}>
                    <View className="relative w-[110] h-[110px] rounded-xl mb-2 overflow-hidden">
                      <TouchableOpacity
                        activeOpacity={0.85}
                        className="absolute bottom-2 right-2 bg-white rounded-full p-1"
                        onPress={() => onMenuItemPress(item)}
                      >
                        <Icon set="feather" name="plus" size={21}></Icon>
                      </TouchableOpacity>

                      <ExpoImage
                        source={{ uri: item.image }}
                        style={{
                          zIndex: -10,
                          width: '100%',
                          height: '100%'
                        }}
                        transition={200}
                        cachePolicy="memory-disk"
                        contentFit="cover"
                      />
                    </View>

                    <View className="items-start px-1">
                      <Text className="font-bold mb-1">{item.name}</Text>
                      <Text className="font-bold text-sm" style={{ color: '#EA004B' }}>
                        {item.price} ₽
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        );
      }

      case 'popular': {
        return (
          <View className="px-6 flex-row flex-wrap gap-4">
            {section.items.map((item: any, i: number, arr: any) => {
              return (
                <Pressable key={i} className="w-[48%]" onPress={() => onMenuItemPress(item)}>
                  <View className="relative aspect-square rounded-xl overflow-hidden">
                    <TouchableOpacity
                      className="absolute bottom-2 right-2 bg-white rounded-full p-1"
                      onPress={() => onMenuItemPress(item)}
                    >
                      <Icon set="feather" name="plus" size={21}></Icon>
                    </TouchableOpacity>

                    <ExpoImage
                      source={{ uri: item.image }}
                      style={{
                        zIndex: -10,
                        width: '100%',
                        height: '100%'
                      }}
                      transition={200}
                      cachePolicy="memory-disk"
                      contentFit="cover"
                    />
                  </View>

                  <View className="items-start px-1 gap-0.5 mt-1">
                    <Text className="font-bold text-lg">{item.name}</Text>
                    <Text className="font-bold text-sm" style={{ color: '#EA004B' }}>
                      {item.price} ₽
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        );
      }

      default: {
        return section.items.map((item: any, i: number, arr: any) => {
          return (
            <Pressable key={i} className="px-6" onPress={() => onMenuItemPress(item)}>
              <View className="rounded-md flex-row gap-4 justify-between">
                <View className="flex-1 items-start">
                  <Text className="text-xl mb-2 font-bold text-stone-600">{item.name}</Text>

                  <Text numberOfLines={2} ellipsizeMode="tail" className="text-sm text-stone-500 leading-5 mb-4">
                    {item.description}
                  </Text>

                  <Text className="font-bold text-sm" style={{ color: '#EA004B' }}>
                    {item.price} ₽
                  </Text>
                </View>

                <View className="relative w-[100px] h-[100px]">
                  <TouchableOpacity
                    className="absolute bottom-2 right-2 bg-white rounded-full p-1"
                    onPress={() => onMenuItemPress(item)}
                  >
                    <Icon set="feather" name="plus" size={21}></Icon>
                  </TouchableOpacity>

                  <ExpoImage
                    source={{ uri: item.image }}
                    style={{
                      zIndex: -10,
                      width: '100%',
                      height: '100%',
                      borderRadius: 10
                    }}
                    transition={200}
                    cachePolicy="memory-disk"
                    contentFit="cover"
                  />
                </View>
              </View>

              {i < arr.length - 1 ? <View className="h-[1px] w-full bg-stone-200 my-8"></View> : null}
            </Pressable>
          );
        });
      }
    }
  };

  const renderResturantAndDeliveryInfo = () => {
    return (
      <View className="pt-[150px] items-center px-4 mt-2">
        <Text className="text-2xl text-center font-bold mb-1">{currentRestaurant?.name}</Text>
        <Text className="text-center">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. A reiciendis perferendis, recusandae molestiae id
          magni aliquam.
        </Text>

        <View className="flex-row gap-3 w-full mt-6">
          <Pressable
            onPress={onReviewsPress}
            className="flex-1 bg-white border border-stone-300 rounded-xl p-3 items-center justify-between"
          >
            <View className="flex-row items-center gap-2">
              <Icon set="ant" name="star" size={20} color="#f59e0b" />
              <Text className="text-xl font-bold">4.5</Text>
            </View>
            <Text className="text-stone-500 text-sm">100+ отзывов</Text>
          </Pressable>

          <Pressable
            onPress={onAboutRestaurantPress}
            className="flex-1 bg-white border border-stone-300 rounded-xl p-3 items-center justify-between"
          >
            <Icon set="feather" name="info" size={20} color="#EA004B" />
            <Text className="text-stone-500 text-sm">О ресторане</Text>
          </Pressable>

          <Pressable className="flex-1 bg-white border border-stone-300 rounded-xl p-3 items-center justify-between">
            <Icon set="feather" name="share-2" size={20} color="#EA004B" />
            <Text className="text-stone-500 text-sm">Поделиться</Text>
          </Pressable>
        </View>

        <View className="mt-3 p-4 py-6 border border-stone-300 rounded-xl w-full items-center flex-row gap-6">
          <Pressable
            onPress={onChangeDeliveryTypePress}
            className="p-0.5 border border-stone-300 rounded-full flex-row bg-stone-200"
          >
            <View
              className={`py-1 px-2.5 border ${deliveryType === 'delivery' ? ' border-stone-300' : 'border-transparent'}`}
              style={{ borderRadius: 100, backgroundColor: deliveryType === 'delivery' ? '#fff' : 'transparent' }}
            >
              <Icon set="material" name="delivery-dining" color={deliveryType === 'delivery' ? '#000' : '#aaa'} />
            </View>

            <View
              className={`py-1 px-2.5 border ${deliveryType === 'pickup' ? ' border-stone-300' : 'border-transparent'}`}
              style={{ borderRadius: 100, backgroundColor: deliveryType === 'pickup' ? '#fff' : 'transparent' }}
            >
              <Icon set="material" name="directions-walk" color={deliveryType === 'pickup' ? '#000' : '#aaa'} />
            </View>
          </Pressable>

          <View className="gap-2">
            {deliveryType === 'delivery' ? (
              <View>
                <Text className="font-bold text-xl">Доставка 35-40 мин.</Text>
                <Text className="text-stone-500">Мин. стоимость заказа - от 500р.</Text>
              </View>
            ) : (
              <View>
                <Text className="font-bold text-xl">Самовывоз</Text>
                <Text className="text-stone-500">Мин. стоимость заказа - Любая цена</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderSearchInput = () => {
    return (
      <View
        className="px-4 pt-4 mt-10 rounded-t-3xl bg-white"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 }, // тень сверху
          shadowOpacity: 0.1,
          shadowRadius: 6,
          borderWidth: isAndroid ? 1 : 0,
          borderColor: '#ccc',
          borderBottomWidth: 0
          // elevation: 4, // Android
        }}
      >
        <Text className="text-center mb-2 font-bold text-lg">Меню</Text>

        <View className="pl-3 bg-stone-100 border border-stone-200 w-full flex-row items-center gap-3 rounded-full">
          <Icon set="feather" name="search" />
          <TextInput
            placeholderTextColor="#666"
            placeholder={`Поиск в меню ${currentRestaurant?.name}`}
            className="flex-1 py-4 leading-[17px]"
          />
        </View>
      </View>
    );
  };

  const renderHorizontalMenuSections = () => {
    return (
      <View className="flex-row mt-4 items-stretch bg-white flex-grow-0 mb-8">
        <TouchableOpacity className="p-2 px-4 justify-center border-b border-stone-200" onPress={onSectionsListPress}>
          <Icon set="feather" name="list" size={23}></Icon>
        </TouchableOpacity>

        <View className="border-b border-stone-200 flex-1">
          <ScrollView
            ref={tabsRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            // contentContainerStyle={{ paddingHorizontal: 6 }}
          >
            <View className="flex-row">
              {['sticky', ...SECTIONS].map((s: any, i) => {
                if (s === 'sticky') return null;
                return (
                  <Pressable
                    key={i}
                    className={`p-4 pt-5 border-b-2 ${activeTab === i ? 'border-stone-950' : 'border-transparent'}`}
                    onLayout={onLayoutTab(i)}
                    onPress={() => handlePressTab(i)}
                  >
                    <Text className={`font-bold ${activeTab === i ? 'text-black' : 'text-stone-400'}`}>{s.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderMenu = (item: any) => {
    return (
      <View>
        <Text className="text-2xl font-bold mb-6 px-6">{item.title}</Text>

        <View className="">{renderMenuItems(item)}</View>

        <View className="h-[5px] w-full bg-stone-200 mt-10 mb-8"></View>
      </View>
    );
  };

  return (
    <View className="relative flex-1 bg-white">
      <Animated.View
        style={[headerImageStyle, { backgroundColor: '#d6d3d1' }]}
        className="w-full absolute top-0 left-0 z-30 min-h-[120px]"
      >
        {/* <AnimatedImage
          source={{ uri: currentRestaurant?.src }}
          style={[
            ImageOpacityStyle,
            {
              width: '100%',
              height: '100%'
            }
          ]}
          // style={[headerImageStyle]}
          resizeMode={'cover'}
        ></AnimatedImage> */}

        <AnimatedImage
          style={[
            {
              width: '100%',
              height: '100%'
            },
            ImageOpacityStyle
          ]}
          transition={200}
          cachePolicy="memory-disk"
          source={{ uri: currentRestaurant?.src }}
          contentFit="cover"
        />

        <View
          className="absolute top-0 left-0 w-full z-10 flex-row items-center justify-between px-4 mt-4 gap-4"
          style={[{ paddingTop: insets.top }]}
        >
          <TouchableOpacity
            onPress={onGoBackPress}
            className="bg-white rounded-full p-1 w-[40px] h-[40px] items-center justify-center"
          >
            <Icon set="feather" name="arrow-left" size={19} />
          </TouchableOpacity>

          <Animated.View
            className="pl-2 py-1 bg-white flex-1 flex-row items-center gap-3 rounded-full"
            style={[headerSearchInputStyle]}
          >
            <Icon set="feather" name="search" size={21} />
            <TextInput
              placeholderTextColor="#777777"
              placeholder={`Поиск в меню ${currentRestaurant?.name}`}
              className="flex-1 py-2 leading-[17px]"
            />
          </Animated.View>

          <TouchableOpacity
            onPress={() => toggleFavorite(Number(id))}
            className="bg-white rounded-full p-1 w-[40px] h-[40px] items-center justify-center pt-1.5"
          >
            <Icon
              set="ion"
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? 'red' : '#000'}
            />
          </TouchableOpacity>
        </View>

        <Animated.View
          className="absolute bottom-0 left-[50%] translate-y-[20%] -translate-x-[50%] w-[50px] h-[50px] bg-stone-300 rounded-lg justify-center items-center z-20"
          style={[ImageOpacityStyle]}
        >
          <Icon set="ion" name="fast-food" size={24} color="red" />
        </Animated.View>
      </Animated.View>

      <FlatList
        ref={scrollRef}
        data={['sticky', ...SECTIONS]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          if (index === 0) {
            return renderHorizontalMenuSections();
          }

          return renderMenu(item);
        }}
        ListHeaderComponent={() => {
          return (
            <>
              {renderResturantAndDeliveryInfo()}
              {renderSearchInput()}
            </>
          );
        }}
        CellRendererComponent={({ item, index, children, style, ...props }) => (
          <View
            {...props}
            style={style}
            onLayout={(event) => {
              const { y } = event.nativeEvent.layout;
              sectionOffsets.current[index] = y;
            }}
          >
            {children}
          </View>
        )}
        initialNumToRender={1}
        // maxToRenderPerBatch={5}
        // windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={() => {
          isAutoScrolling.current = false;
        }}
        stickyHeaderIndices={[1]}
        className="pt-[105px]"
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* Кнопка корзины */}
      {(() => {
        const cart = carts[String(id)];
        if (!cart || cart.items.length === 0) return null;
        const cartItemsCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        const cartTotal = cart.items.reduce((sum, i) => {
          const modTotal = i.modifiers.reduce((s, m) => s + m.price, 0);
          return sum + (i.price + modTotal) * i.quantity;
        }, 0);
        return (
          <Animated.View
            className="absolute left-0 bottom-0 right-0 px-5 pt-2 bg-white border-t border-stone-200 z-30"
            style={{ paddingBottom: insets.bottom + 10 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setActiveRestaurant(String(id));
                openGlobalModal(GLOBAL_MODAL_CONTENT.CART);
              }}
              className="flex-row items-center justify-between h-[56px] rounded-2xl px-5"
              style={{ backgroundColor: '#EA004B', borderCurve: 'continuous' }}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
                  <Text className="text-white font-bold text-sm">{cartItemsCount}</Text>
                </View>
                <Text className="text-white font-bold text-base">Открыть корзину</Text>
              </View>
              <Text className="text-white font-bold text-base">{cartTotal} ₽</Text>
            </TouchableOpacity>
          </Animated.View>
        );
      })()}

      {/* <ScrollView
        ref={scrollRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onMomentumScrollEnd={() => {
          isAutoScrolling.current = false;
        }}
        // pointerEvents={isAnimating ? 'none' : 'auto'}
        // bounces={false}
        // scrollIndicatorInsets={{ top: 260 }}
        // style={[scrollViewTranslateY]}
        className="pt-[105px]"
        stickyHeaderIndices={[2]}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#000"
            colors={['#000']}
            progressBackgroundColor="#000"
          />
        }
      >
        <View className="pt-[150px] items-center px-4 mt-2">
          <Text className="text-2xl text-center font-bold">{currentRestaurant?.name}</Text>

          <View className="flex-row justify-between items-center w-full">
            <Pressable
              onPress={onReviewsPress}
              className="flex-row items-center gap-2 border-b border-stone-300 w-fit pb-0.5"
            >
              <Icon set="ant" name="star" size={14} color="red" />

              <Text className="font-bold text-sm mt-0.5">4.5 - (100+ Отзывов)</Text>
            </Pressable>

            <TouchableOpacity
              onPress={onAboutRestaurantPress}
              className="bg-stone-100 p-2 px-3 pb-1.5 rounded-md flex-row items-center gap-2"
            >
              <Text className="text-sm">Подробнее</Text>

              <Icon set="ion" name="information-circle-outline" size={18} />
            </TouchableOpacity>
          </View>

          <View className="mt-6 p-4 py-6 border border-stone-300 rounded-xl w-full items-center flex-row gap-6">
            <Pressable
              onPress={onChangeDeliveryTypePress}
              className="p-0.5 border border-stone-300 rounded-full flex-row bg-stone-200"
            >
              <View
                className={`py-1 px-2.5 border border-transparent ${deliveryType === 'delivery' ? 'border border-stone-300' : ''}`}
                style={{ borderRadius: 100, backgroundColor: deliveryType === 'delivery' ? '#fff' : 'transparent' }}
              >
                <Icon set="material" name="delivery-dining" color={deliveryType === 'delivery' ? '#000' : '#aaa'} />
              </View>

              <View
                className={`py-1 px-2.5 border border-transparent ${deliveryType === 'pickup' ? 'border border-stone-300' : ''}`}
                style={{ borderRadius: 100, backgroundColor: deliveryType === 'pickup' ? '#fff' : 'transparent' }}
              >
                <Icon set="material" name="directions-walk" color={deliveryType === 'pickup' ? '#000' : '#aaa'} />
              </View>
            </Pressable>

            <View className="gap-2">
              {deliveryType === 'delivery' ? (
                <View>
                  <Text className="font-bold text-xl">Доставка 35-40 мин.</Text>
                  <Text className="text-stone-500">Мин. стоимость заказа - от 500р.</Text>
                </View>
              ) : (
                <View>
                  <Text className="font-bold text-xl">Самовывоз</Text>
                  <Text className="text-stone-500">Мин. стоимость заказа - Любая цена</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View
          className="px-5 pt-6 mt-10 rounded-t-3xl bg-white"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -8 }, // тень сверху
            shadowOpacity: 0.1,
            shadowRadius: 6,
            borderWidth: isAndroid ? 1 : 0,
            borderColor: '#ccc',
            borderBottomWidth: 0
            // elevation: 4, // Android
          }}
        >
          <View className="pl-2 bg-stone-100 border border-stone-200 w-full flex-row items-center gap-3 rounded-full">
            <Icon set="feather" name="search" />
            <TextInput
              placeholderTextColor="#777777"
              placeholder={`Поиск в меню ${currentRestaurant?.name}`}
              className="flex-1 py-2.5 leading-[17px]"
            />
          </View>
        </View>

        <View className="flex-row mt-4 items-center bg-white flex-grow-0">
          <TouchableOpacity
            className="p-2 px-4 h-[100%] justify-center border-b border-stone-200"
            onPress={onSectionsListPress}
          >
            <Icon set="feather" name="list" size={23}></Icon>
          </TouchableOpacity>

          <View className="border-b border-stone-200 flex-1">
            <ScrollView
              ref={tabsRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              // contentContainerStyle={{ paddingHorizontal: 6 }}
            >
              <View className="flex-row">
                {SECTIONS.map((s, i) => (
                  <Pressable
                    key={i}
                    className={`p-4 pt-5 ${activeTab === i ? 'border-b-2 border-stone-950' : ''}`}
                    onLayout={onLayoutTab(i)}
                    onPress={() => handlePressTab(i)}
                  >
                    <Text className={`font-bold ${activeTab === i ? 'text-black' : 'text-stone-400'}`}>{s.title}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        <View className="mt-8">
          {SECTIONS.map((section, index, sectionsArray) => (
            <View key={index} onLayout={onLayoutSection(index)}>
              <Text className="text-2xl font-bold mb-6 px-6">{section.title}</Text>

              <View className="">{renderItems(section)}</View>

              <View className="h-[5px] w-full bg-stone-200 mt-10 mb-8"></View>
            </View>
          ))}
        </View>
      </ScrollView> */}
    </View>
  );
}
