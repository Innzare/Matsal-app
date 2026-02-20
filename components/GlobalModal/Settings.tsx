import { View, TouchableOpacity, StatusBar, ScrollView, Switch } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useTheme } from '@/hooks/useTheme';
import { useThemeStore, type ThemeMode } from '@/store/useThemeStore';
import { useColorScheme } from 'nativewind';

const THEME_OPTIONS: { mode: ThemeMode; label: string; icon: string }[] = [
  { mode: 'system', label: 'Системная', icon: 'smartphone' },
  { mode: 'light', label: 'Светлая', icon: 'sun' },
  { mode: 'dark', label: 'Тёмная', icon: 'moon' }
];

export default function Settings() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal } = useGlobalModalStore();
  const { colors, isDark, colorScheme } = useTheme();
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
    <View key={colorScheme} className="flex-1" style={{ backgroundColor: colors.bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Хедер */}
      <View
        className="border-b"
        style={{
          paddingTop: insets.top,
          backgroundColor: colors.surface,
          borderBottomColor: colors.border
        }}
      >
        <View className="flex-row items-center justify-between px-4 pb-3">
          <Text className="text-xl font-bold">Настройки</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeGlobalModal}
            className="w-8 h-8 rounded-full justify-center items-center"
            style={{ backgroundColor: colors.elevated }}
          >
            <Icon set="ant" name="close" size={16} color={colors.iconDefault} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Оформление */}
        <Text className="text-sm font-bold px-4 mt-4 mb-2" style={{ color: colors.textMuted }}>
          Оформление
        </Text>
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
        >
          <View className="p-4">
            <View className="flex-row items-center gap-3 mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="moon" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold" style={{ color: colors.text }}>
                  Тема приложения
                </Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>
                  Выберите оформление интерфейса
                </Text>
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
                    className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center gap-2"
                    style={{
                      borderWidth: 1,
                      borderColor: isActive ? '#EA004B' : colors.border,
                      backgroundColor: isActive ? 'rgba(234, 0, 75, 0.1)' : colors.elevated
                    }}
                  >
                    <Icon set="feather" name={option.icon} size={15} color={isActive ? '#EA004B' : colors.iconMuted} />
                    <Text className="text-xs font-bold" style={{ color: isActive ? '#EA004B' : colors.textMuted }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Уведомления */}
        <Text className="text-sm font-bold px-4 mt-4 mb-2" style={{ color: colors.textMuted }}>
          Уведомления
        </Text>
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
        >
          <View
            className="flex-row items-center justify-between p-4"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="ion" name="notifications-outline" size={22} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold" style={{ color: colors.text }}>
                  Push-уведомления
                </Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>
                  Статусы заказов и акции
                </Text>
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
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="volume-2" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold" style={{ color: colors.text }}>
                  Звуки
                </Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>
                  Звук при получении уведомлений
                </Text>
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
        <Text className="text-sm font-bold px-4 mt-4 mb-2" style={{ color: colors.textMuted }}>
          Приложение
        </Text>
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
        >
          <View
            className="flex-row items-center justify-between p-4"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className="flex-row items-center gap-3 flex-1">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="map-pin" size={20} color={colors.accent} />
              </View>
              <View className="flex-1">
                <Text className="font-bold" style={{ color: colors.text }}>
                  Геолокация
                </Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>
                  Для поиска ресторанов рядом
                </Text>
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
            className="flex-row items-center justify-between p-4"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="globe" size={20} color={colors.accent} />
              </View>
              <View>
                <Text className="font-bold" style={{ color: colors.text }}>
                  Язык
                </Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>
                  Русский
                </Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.pinkBg }}
              >
                <Icon set="feather" name="trash-2" size={20} color={colors.accent} />
              </View>
              <View>
                <Text className="font-bold" style={{ color: colors.text }}>
                  Очистить кэш
                </Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>
                  Освободить место на устройстве
                </Text>
              </View>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>
        </View>

        {/* О приложении */}
        <Text className="text-sm font-bold px-4 mt-4 mb-2" style={{ color: colors.textMuted }}>
          О приложении
        </Text>
        <View
          className="mx-4 rounded-2xl overflow-hidden"
          style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.elevated }}
              >
                <Icon set="feather" name="shield" size={20} color={colors.iconSecondary} />
              </View>
              <Text className="font-bold" style={{ color: colors.text }}>
                Политика конфиденциальности
              </Text>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-between p-4"
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.elevated }}
              >
                <Icon set="feather" name="file-text" size={20} color={colors.iconSecondary} />
              </View>
              <Text className="font-bold" style={{ color: colors.text }}>
                Условия использования
              </Text>
            </View>
            <Icon set="material" name="keyboard-arrow-right" size={23} color={colors.iconMuted} />
          </TouchableOpacity>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.elevated }}
              >
                <Icon set="feather" name="info" size={20} color={colors.iconSecondary} />
              </View>
              <Text className="font-bold" style={{ color: colors.text }}>
                Версия
              </Text>
            </View>
            <Text className="text-sm" style={{ color: colors.textMuted }}>
              1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
