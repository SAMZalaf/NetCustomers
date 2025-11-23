import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsScreen from '@/screens/SettingsScreen';
import FieldSettingsScreen from '@/screens/FieldSettingsScreen';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/contexts/LanguageContext';

export type SettingsStackParamList = {
  SettingsMain: undefined;
  FieldSettings: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsStackNavigator() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.backgroundRoot,
        },
        headerTintColor: theme.text,
      }}
    >
      <Stack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          title: t('settings'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FieldSettings"
        component={FieldSettingsScreen}
        options={{
          title: t('fieldSettings'),
        }}
      />
    </Stack.Navigator>
  );
}
