import 'dotenv/config';

export default {
  expo: {
    name: 'Matsal',
    slug: 'Matsal',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'matsal',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    assetBundlePatterns: ['**/*'],
    jsEngine: 'hermes',
    ios: {
      supportsTablet: true,
      infoPlist: {
        UIViewControllerBasedStatusBarAppearance: true,
        ITSAppUsesNonExemptEncryption: false
      },
      bundleIdentifier: 'com.innzare.Matsal'
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png'
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: 'com.innzare.Matsal',
      minSdkVersion: 26
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
      bundler: 'metro'
    },
    plugins: [
      'expo-router',
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMAPBOX_MAPS_DOWNLOAD_TOKEN:
            'pk.eyJ1IjoiaW5uemFyZSIsImEiOiJjbGVsZ3JoeTkwdmF1NDNrNWllcGJjZnZ4In0.hWnC4uPSl78gYHYnGvAurQ'
        }
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000'
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      YANDEX_MAP_KEY: process.env.EXPO_PUBLIC_YANDEX_MAP_KEY,
      router: {},
      eas: {
        projectId: '64f1cd2d-cbbc-4ff5-bdab-ee046fc3a1a7'
      }
    },
    runtimeVersion: {
      policy: 'appVersion'
    },
    updates: {
      url: 'https://u.expo.dev/64f1cd2d-cbbc-4ff5-bdab-ee046fc3a1a7'
    }
  }
};

// {
//   "expo": {
//     "name": "Matsal",
//     "slug": "Matsal",
//     "version": "1.0.0",
//     "orientation": "portrait",
//     "icon": "./assets/images/icon.png",
//     "scheme": "matsal",
//     "userInterfaceStyle": "automatic",
//     "newArchEnabled": true,
//     "assetBundlePatterns": ["**/*"],
//     "jsEngine": "hermes",
//     "ios": {
//       "supportsTablet": true,
//       "infoPlist": {
//         "UIViewControllerBasedStatusBarAppearance": true,
//         "ITSAppUsesNonExemptEncryption": false
//       },
//       "bundleIdentifier": "com.innzare.Matsal"
//     },
//     "android": {
//       "adaptiveIcon": {
//         "backgroundColor": "#E6F4FE",
//         "foregroundImage": "./assets/images/android-icon-foreground.png",
//         "backgroundImage": "./assets/images/android-icon-background.png",
//         "monochromeImage": "./assets/images/android-icon-monochrome.png"
//       },
//       "edgeToEdgeEnabled": true,
//       "predictiveBackGestureEnabled": false,
//       "package": "com.innzare.Matsal",
//       "minSdkVersion": 26
//     },
//     "web": {
//       "output": "static",
//       "favicon": "./assets/images/favicon.png",
//       "bundler": "metro"
//     },
//     "plugins": [
//       "expo-router",
//       [
//         "@rnmapbox/maps",
//         {
//           "RNMapboxMapsImpl": "mapbox",
//           "RNMAPBOX_MAPS_DOWNLOAD_TOKEN": "pk.eyJ1IjoiaW5uemFyZSIsImEiOiJjbGVsZ3JoeTkwdmF1NDNrNWllcGJjZnZ4In0.hWnC4uPSl78gYHYnGvAurQ"
//         }
//       ],
//       [
//         "expo-splash-screen",
//         {
//           "image": "./assets/images/splash-icon.png",
//           "imageWidth": 200,
//           "resizeMode": "contain",
//           "backgroundColor": "#ffffff",
//           "dark": {
//             "backgroundColor": "#000000"
//           }
//         }
//       ]
//     ],
//     "experiments": {
//       "typedRoutes": true,
//       "reactCompiler": true
//     },
//     "extra": {
//       "router": {},
//       "eas": {
//         "projectId": "64f1cd2d-cbbc-4ff5-bdab-ee046fc3a1a7"
//       }
//     },
//     "runtimeVersion": {
//       "policy": "appVersion"
//     },
//     "updates": {
//       "url": "https://u.expo.dev/64f1cd2d-cbbc-4ff5-bdab-ee046fc3a1a7"
//     }
//   }
// }
