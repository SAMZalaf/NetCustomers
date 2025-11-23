import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Spacing } from '@/constants/theme';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeaderTitle() {
  const { language } = useLanguage();
  const appName = language === 'ar' ? 'عملاء الإنترنت' : 'Internet Customers';
  
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <ThemedText style={styles.title}>{appName}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
});
