// import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
// import React from 'react';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Icon } from '@/components/Icon';
// import { useGlobalModalStore } from '@/store/useGlobalModalStore';
// import { useIsFocused } from '@react-navigation/native';
// import { Tabs } from 'react-native-collapsible-tab-view';
// import { TopTabs } from '@/components/top-tabs';
// import Login from './Login';
// import Register from './Register';
// import { Image } from 'expo-image';

// export default function Auth() {
//   const insets = useSafeAreaInsets();
//   const { closeGlobalModal } = useGlobalModalStore();
//   const isFocused = useIsFocused();

//   return (
//     <View className="bg-white flex-1">
//       {isFocused ? <StatusBar barStyle="dark-content" /> : null}

//       <View
//         className="relative bg-white flex-row items-center justify-center gap-2 px-6 pb-2"
//         style={{ paddingTop: insets.top + 50, backgroundColor: '#fff' }}
//       >
//         {/* <Text className="text-xl font-bold"></Text> */}

//         <Image
//           style={{ height: 80, width: 130, marginBottom: 10 }}
//           transition={200}
//           cachePolicy="memory-disk"
//           contentFit="cover"
//           source={require('@/assets/images/matsal-logo.png')}
//         />

//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={closeGlobalModal}
//           className="absolute left-5 w-[30px] h-[30px] justify-center items-center"
//           style={{
//             top: insets.top + 10
//           }}
//         >
//           <Icon set="ant" name="close" size={21} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <Tabs.Container
//         headerContainerStyle={{ shadowColor: 'transparent', flex: 1 }}
//         // renderTabBar={(props) => <CustomTabs {...props} />}
//         renderTabBar={(props) => <TopTabs {...props} />}
//         initialTabName="Вход"
//       >
//         <Tabs.Tab name="Вход" label="Вход">
//           <Tabs.ScrollView>
//             <View className="flex-1">
//               <Login />
//             </View>
//           </Tabs.ScrollView>
//         </Tabs.Tab>

//         <Tabs.Tab name="Регистрация" label="Регистрация">
//           <Tabs.ScrollView>
//             <View className="flex-1">
//               <Register />
//             </View>
//           </Tabs.ScrollView>
//         </Tabs.Tab>
//       </Tabs.Container>
//     </View>
//   );
// }

import { View, StatusBar, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import { Tabs } from 'react-native-collapsible-tab-view';
import { TopTabs } from '@/components/top-tabs';

import Login from './Login';
import Register from './Register';

export default function Auth() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal } = useGlobalModalStore();
  const { resetAuthFlow, isAuthenticated } = useAuthStore();
  const isFocused = useIsFocused();

  // Закрыть модалку после успешной авторизации
  useEffect(() => {
    if (isAuthenticated) {
      closeGlobalModal();
      resetAuthFlow();
    }
  }, [isAuthenticated, closeGlobalModal, resetAuthFlow]);

  return (
    <View className="bg-white flex-1">
      {isFocused ? <StatusBar barStyle="dark-content" /> : null}

      {/* Header */}
      <View
        className="relative bg-white flex-row items-center justify-center gap-2 px-6 pb-2"
        style={{ paddingTop: insets.top + 50, backgroundColor: '#fff' }}
      >
        <Image
          style={{ height: 80, width: 130, marginBottom: 10 }}
          transition={200}
          cachePolicy="memory-disk"
          contentFit="cover"
          source={require('@/assets/images/matsal-logo.svg')}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            resetAuthFlow();
            closeGlobalModal();
          }}
          className="absolute left-5 w-[30px] h-[30px] justify-center items-center"
          style={{ top: insets.top + 10 }}
        >
          <Icon set="ant" name="close" size={21} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <Tabs.Container
        headerContainerStyle={{ shadowColor: 'transparent', flex: 1 }}
        renderTabBar={(props) => <TopTabs {...props} />}
        initialTabName="Вход"
      >
        <Tabs.Tab name="Вход" label="Вход">
          <Tabs.ScrollView>
            <Login />
          </Tabs.ScrollView>
        </Tabs.Tab>

        <Tabs.Tab name="Регистрация" label="Регистрация">
          <Tabs.ScrollView>
            <Register />
          </Tabs.ScrollView>
        </Tabs.Tab>
      </Tabs.Container>
    </View>
  );
}
