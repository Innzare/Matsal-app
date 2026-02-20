import { View, TouchableOpacity, StatusBar, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/Icon';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore, type ThemeMode } from '@/store/useThemeStore';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'system', label: 'Системная', icon: 'smartphone' },
  { mode: 'light', label: 'Светлая', icon: 'sun' },
  { mode: 'dark', label: 'Тёмная', icon: 'moon' }
];

export default function Settings() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { themeMode, setThemeMode } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
    if (mode === 'system') {
      setColorScheme('system');
    } else {
      setColorScheme(mode);
    }
  };

  return (
    <View className="bg-stone-100 dark:bg-dark-bg flex-1">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Хедер */}
      <View
        className="bg-white dark:bg-dark-surface border-b border-stone-200 dark:border-dark-border"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 pb-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            className="w-8 h-8 rounded-full bg-stone-100 dark:bg-dark-elevated justify-center items-center"
          >
            <Icon set="feather" name="arrow-left" size={20} color={colors.iconDefault} />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Настройки</Text>
          <View className="w-8" />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Оформление */}
        <Text className="text-sm font-bold text-stone-400 dark:text-dark-subtle px-4 mt-4 mb-2">Оформление</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
          <View className="p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.border }}
              >
                <Icon set="feather" name="moon" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">Тема приложения</Text>
                <Text className="text-stone-400 dark:text-dark-subtle text-xs">Выберите оформление интерфейса</Text>
              </View>
            </View>

            <View className="flex-row gap-2">
              {THEME_OPTIONS.map((option) => {
                const isActive = themeMode === option.mode;
                return (
                  <TouchableOpacity
                    key={option.mode}
                    activeOpacity={0.7}
                    onPress={() => handleThemeChange(option.mode)}
                    className={`flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2 border ${
                      isActive
                        ? 'border-[#EA004B] bg-[#EA004B]/10'
                        : 'border-stone-200 dark:border-dark-border bg-stone-50 dark:bg-dark-elevated'
                    }`}
                  >
                    <Icon set="feather" name={option.icon} size={15} color={isActive ? '#EA004B' : colors.iconMuted} />
                    <Text
                      className={`text-xs font-bold ${
                        isActive ? 'text-[#EA004B]' : 'text-stone-500 dark:text-dark-muted'
                      }`}
                      style={isActive ? { color: '#EA004B' } : undefined}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Уведомления */}
        <Text className="text-sm font-bold text-stone-400 dark:text-dark-subtle px-4 mt-4 mb-2">Уведомления</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
          <View className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border">
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.border }}
              >
                <Icon set="ion" name="notifications-outline" size={22} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">Push-уведомления</Text>
                <Text className="text-stone-400 dark:text-dark-subtle text-xs">Статусы заказов и акции</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.switchTrackOff, true: '#EA004B' }}
              thumbColor={colors.switchThumb}
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.border }}
              >
                <Icon set="feather" name="volume-2" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">Звуки</Text>
                <Text className="text-stone-400 dark:text-dark-subtle text-xs">Звук при получении уведомлений</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: colors.switchTrackOff, true: '#EA004B' }}
              thumbColor={colors.switchThumb}
            />
          </View>
        </View>

        {/* Приложение */}
        <Text className="text-sm font-bold text-stone-400 dark:text-dark-subtle px-4 mt-4 mb-2">Приложение</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
          <View className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border">
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.border }}
              >
                <Icon set="feather" name="map-pin" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold text-stone-700 dark:text-dark-text">Геолокация</Text>
                <Text className="text-stone-400 dark:text-dark-subtle text-xs">Для поиска ресторанов рядом</Text>
              </View>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.switchTrackOff, true: '#EA004B' }}
              thumbColor={colors.switchThumb}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.border }}
              >
                <Icon set="feather" name="globe" size={20} color={colors.accent} />
              </View>
              <View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">Язык</Text>
                <Text className="text-stone-400 dark:text-dark-subtle text-xs">Русский</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.border }}
              >
                <Icon set="feather" name="trash-2" size={20} color={colors.accent} />
              </View>
              <View>
                <Text className="font-bold text-stone-700 dark:text-dark-text">Очистить кэш</Text>
                <Text className="text-stone-400 dark:text-dark-subtle text-xs">Освободить место на устройстве</Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>
        </View>

        {/* О приложении */}
        <Text className="text-sm font-bold text-stone-400 dark:text-dark-subtle px-4 mt-4 mb-2">О приложении</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
                <Icon set="feather" name="shield" size={20} color={colors.iconSecondary} />
              </View>
              <Text className="font-bold text-stone-700 dark:text-dark-text">Политика конфиденциальности</Text>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4 border-b border-stone-100 dark:border-dark-border"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
                <Icon set="feather" name="file-text" size={20} color={colors.iconSecondary} />
              </View>
              <Text className="font-bold text-stone-700 dark:text-dark-text">Условия использования</Text>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-stone-100 dark:bg-dark-elevated items-center justify-center">
                <Icon set="feather" name="info" size={20} color={colors.iconSecondary} />
              </View>
              <Text className="font-bold text-stone-700 dark:text-dark-text">Версия</Text>
            </View>
            <Text className="text-stone-400 dark:text-dark-subtle text-sm">1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
