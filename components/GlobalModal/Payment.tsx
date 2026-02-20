import { View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../Icon';
import { useGlobalModalStore } from '@/store/useGlobalModalStore';
import { useTheme } from '@/hooks/useTheme';

interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'sbp';
  label: string;
  details?: string;
  icon: { set: string; name: string; color: string };
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    label: 'Банковская карта',
    details: '•••• 4276',
    icon: { set: 'fontAwesome', name: 'credit-card', color: '#EA004B' }
  },
  {
    id: '2',
    type: 'sbp',
    label: 'СБП',
    details: 'Система быстрых платежей',
    icon: { set: 'materialCom', name: 'bank-transfer', color: '#5B2D8E' }
  },
  {
    id: '3',
    type: 'cash',
    label: 'Наличными',
    details: 'При получении',
    icon: { set: 'materialCom', name: 'cash', color: '#16a34a' }
  }
];

export default function Payment() {
  const insets = useSafeAreaInsets();
  const { closeGlobalModal } = useGlobalModalStore();
  const [selectedId, setSelectedId] = useState('1');
  const { colors, isDark } = useTheme();

  return (
    <View className="bg-stone-100 dark:bg-dark-bg flex-1">
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Хедер */}
      <View className="bg-white dark:bg-dark-surface border-b border-stone-200 dark:border-dark-border" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 pb-3">
          <Text className="text-xl font-bold dark:text-dark-text">Способ оплаты</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={closeGlobalModal}
            className="w-8 h-8 rounded-full justify-center items-center"
            style={{ backgroundColor: isDark ? colors.elevated : '#f5f5f4' }}
          >
            <Icon set="ant" name="close" size={16} color={isDark ? colors.text : '#000'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Активный способ */}
        <Text className="text-sm font-bold text-stone-400 dark:text-dark-muted px-4 mt-4 mb-2">Выбранный способ</Text>
        <View className="mx-4 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border">
          {PAYMENT_METHODS.map((method, index) => {
            const isSelected = method.id === selectedId;
            return (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.7}
                onPress={() => setSelectedId(method.id)}
                className={`flex-row items-center justify-between p-4 ${
                  index < PAYMENT_METHODS.length - 1 ? 'border-b border-stone-100 dark:border-dark-border' : ''
                }`}
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: isDark ? colors.elevated : '#f5f5f4' }}>
                    <Icon set={method.icon.set} name={method.icon.name} size={22} color={method.icon.color} />
                  </View>
                  <View>
                    <Text className="font-bold text-stone-700 dark:text-dark-text">{method.label}</Text>
                    {method.details && <Text className="text-stone-400 dark:text-dark-muted text-xs">{method.details}</Text>}
                  </View>
                </View>

                <View
                  className="w-6 h-6 rounded-full border-2 items-center justify-center"
                  style={{
                    borderColor: isSelected ? '#EA004B' : (isDark ? colors.border : '#d4d4d4')
                  }}
                >
                  {isSelected && <View className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#EA004B' }} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Добавить карту */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="mx-4 mt-3 bg-white dark:bg-dark-surface rounded-2xl overflow-hidden border border-stone-200 dark:border-dark-border flex-row items-center justify-center p-4 gap-2"
        >
          <Icon set="feather" name="plus" size={20} color="#EA004B" />
          <Text className="font-bold" style={{ color: '#EA004B' }}>
            Добавить карту
          </Text>
        </TouchableOpacity>

        {/* Информация */}
        <View className="mx-4 mt-6 flex-row items-start gap-3 px-2">
          <Icon set="feather" name="shield" size={16} color={isDark ? colors.textMuted : '#a8a29e'} />
          <Text className="text-stone-400 dark:text-dark-muted text-xs flex-1 leading-4">
            Данные вашей карты надёжно защищены. Мы не храним полные реквизиты карты на наших серверах.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
