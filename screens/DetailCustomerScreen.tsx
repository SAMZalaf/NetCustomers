import React from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useTheme } from '../hooks/useTheme';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useCustomers } from '../contexts/CustomerContext';
import { Customer } from '../types/customer';
import QRCode from 'qrcode-react-native';
import * as Print from 'expo-print';

export default function DetailCustomerScreen() {
  const { theme: colors } = useTheme();
  const { t, language, isRTL } = useLanguage();
  const route = useRoute();
  const navigation = useNavigation();
  const { customers } = useCustomers();

  const customer = (route.params as any)?.customer as Customer | undefined;
  const customerData = customer || customers.find(c => c.id === (route.params as any)?.customerId);

  if (!customerData) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>{t('error')}</ThemedText>
      </ThemedView>
    );
  }

  const qrCodeData = JSON.stringify({
    id: customerData.id,
    name: customerData.name,
    location: customerData.location,
    ipAddress: customerData.ipAddress,
    serialNumber: customerData.serialNumber,
  });

  const handlePrint = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial; padding: 20px; direction: ${isRTL ? 'rtl' : 'ltr'}; }
              .card { border: 2px solid #333; padding: 20px; border-radius: 10px; }
              .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
              .row { display: flex; margin-bottom: 10px; }
              .label { font-weight: bold; width: 40%; }
              .value { width: 60%; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="title">${customerData.name}</div>
              <div class="row">
                <div class="label">${t('serialNumber')}:</div>
                <div class="value">${customerData.serialNumber}</div>
              </div>
              <div class="row">
                <div class="label">${t('location')}:</div>
                <div class="value">${customerData.location}</div>
              </div>
              <div class="row">
                <div class="label">${t('pointName')}:</div>
                <div class="value">${customerData.pointName}</div>
              </div>
              <div class="row">
                <div class="label">${t('ipAddress')}:</div>
                <div class="value">${customerData.ipAddress}</div>
              </div>
              <div class="row">
                <div class="label">${t('packageSpeed')}:</div>
                <div class="value">${customerData.packageSpeed}</div>
              </div>
              <div class="row">
                <div class="label">${t('packageSize')}:</div>
                <div class="value">${customerData.packageSize}</div>
              </div>
            </div>
          </body>
        </html>
      `;
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert(t('error'), 'Failed to print');
    }
  };

  const handleContact = (phoneNumber: string, action: 'call' | 'sms' | 'whatsapp') => {
    if (!phoneNumber) {
      Alert.alert(t('error'), 'رقم الهاتف مفقود / Phone number not provided');
      return;
    }

    switch (action) {
      case 'call':
        Linking.openURL(`tel:${phoneNumber}`);
        break;
      case 'sms':
        Linking.openURL(`sms:${phoneNumber}`);
        break;
      case 'whatsapp':
        Linking.openURL(`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`);
        break;
    }
  };

  const handleContactOptions = () => {
    Alert.alert(
      t('contact'),
      'اختر طريقة التواصل / Select contact method',
      [
        {
          text: customerData.phoneNumber ? 'اتصال / Call' : 'غير متوفر / Unavailable',
          onPress: () => handleContact(customerData.phoneNumber, 'call'),
          disabled: !customerData.phoneNumber,
        },
        {
          text: customerData.phoneNumber ? 'رسالة / SMS' : 'غير متوفر / Unavailable',
          onPress: () => handleContact(customerData.phoneNumber, 'sms'),
          disabled: !customerData.phoneNumber,
        },
        {
          text: customerData.phoneNumber ? 'واتس / WhatsApp' : 'غير متوفر / Unavailable',
          onPress: () => handleContact(customerData.phoneNumber, 'whatsapp'),
          disabled: !customerData.phoneNumber,
        },
        {
          text: t('cancel'),
          onPress: () => {},
          style: 'cancel',
        },
      ]
    );
  };

  const handleShare = async () => {
    try {
      const message = `${customerData.name} - ${customerData.location}\nIP: ${customerData.ipAddress}\nSerial: ${customerData.serialNumber}`;
      Alert.alert(t('success'), 'Customer details copied to clipboard');
    } catch (error) {
      Alert.alert(t('error'), 'Failed to share');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView>
        <View style={styles.header}>
          <ThemedText style={styles.title}>{customerData.name}</ThemedText>
          <View style={styles.headerActions}>
            <Pressable
              onPress={handleContactOptions}
              style={({ pressed }) => [
                styles.headerButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="phone" size={18} color="white" />
            </Pressable>
            <Pressable
              onPress={handlePrint}
              style={({ pressed }) => [
                styles.headerButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="printer" size={18} color="white" />
            </Pressable>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.headerButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="share-2" size={18} color="white" />
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.cardContent,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.qrSection}>
            <QRCode
              value={qrCodeData}
              size={150}
              bgColor={colors.background}
              fgColor={colors.text}
            />
            <ThemedText style={styles.qrLabel}>{t('scan')}</ThemedText>
          </View>

          <View style={styles.infoSection}>
            {[
              { label: t('serialNumber'), value: customerData.serialNumber },
              { label: t('location'), value: customerData.location },
              { label: t('name'), value: customerData.name },
              { label: t('pointName'), value: customerData.pointName },
              { label: t('networkName'), value: customerData.networkName },
              { label: t('ipAddress'), value: customerData.ipAddress },
              { label: t('gatewayIp'), value: customerData.gatewayIp },
              { label: t('packageSpeed'), value: customerData.packageSpeed },
              { label: t('packageSize'), value: customerData.packageSize },
            ].map((item, index) => (
              <View key={index} style={styles.infoRow}>
                <ThemedText style={[styles.label, { color: colors.onSurfaceVariant }]}>
                  {item.label}:
                </ThemedText>
                <ThemedText style={styles.value}>{item.value || '-'}</ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScreenScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  qrSection: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  qrLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  infoSection: {
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  value: {
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
});
