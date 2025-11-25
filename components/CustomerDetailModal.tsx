import React from 'react';
import { View, StyleSheet, Pressable, Modal, ScrollView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import QRCode from 'react-native-qrcode-svg';
import { ThemedText } from './ThemedText';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { Customer } from '../types/customer';

interface CustomerDetailModalProps {
  visible: boolean;
  customer: Customer | null;
  onClose: () => void;
}

export default function CustomerDetailModal({ visible, customer, onClose }: CustomerDetailModalProps) {
  const { theme: colors } = useTheme();
  const { t, language, isRTL } = useLanguage();

  if (!visible || !customer) return null;

  const qrCodeData = JSON.stringify({
    id: customer.id,
    name: customer.name,
    serialNumber: customer.serialNumber,
    location: customer.location,
    ipAddress: customer.ipAddress,
  });

  const subscriptionDateFormatted = new Date(customer.subscriptionDate).toLocaleDateString(
    language === 'ar' ? 'ar-SA' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  const allFields = [
    { label: t('subscriptionDate'), value: subscriptionDateFormatted },
    { label: t('serialNumber'), value: customer.serialNumber },
    { label: t('location'), value: customer.location },
    { label: t('name'), value: customer.name },
    { label: t('phoneNumber'), value: customer.phoneNumber, fullWidth: false },
    { label: t('pointName'), value: customer.pointName },
    { label: t('networkName'), value: customer.networkName },
    { label: t('networkPassword'), value: customer.networkPassword },
    { label: t('username'), value: customer.username },
    { label: t('userPassword'), value: customer.userPassword },
    { label: t('ipAddress'), value: customer.ipAddress },
    { label: t('gatewayIp'), value: customer.gatewayIp },
    { label: t('packageSpeed'), value: customer.packageSpeed },
    { label: t('packageSize'), value: customer.packageSize },
    { label: t('notes'), value: customer.notes, fullWidth: true },
  ];

  const generateHTML = () => {
    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background: white; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #333; padding-bottom: 15px; }
            .title { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
            .subtitle { font-size: 14px; color: #666; }
            .container { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { break-inside: avoid; }
            .label { font-weight: bold; font-size: 12px; color: #333; margin-bottom: 5px; }
            .value { font-size: 13px; padding: 8px; background: #f5f5f5; border-radius: 4px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${customer.name}</div>
            <div class="subtitle">${t('serialNumber')}: ${customer.serialNumber}</div>
          </div>
          <div class="container">
            ${allFields.map(field => `
              <div class="field">
                <div class="label">${field.label}:</div>
                <div class="value">${field.value || '-'}</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  };

  const handleSaveAsPDF = async () => {
    try {
      const html = generateHTML();
      await Print.printAsync({ html, useMarkupFormatter: true });
    } catch (error) {
      Alert.alert(t('error'), t('exportError'));
    }
  };

  const handleSaveAsHTML = async () => {
    try {
      const html = generateHTML();
      const fileName = `${customer.name.replace(/\s+/g, '_')}_${Date.now()}.html`;
      const dest = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(dest, html);
      await Sharing.shareAsync(dest);
    } catch (error) {
      Alert.alert(t('error'), 'Failed to save as HTML');
    }
  };

  const handleExportOptions = async () => {
    console.log('Export options clicked');
    try {
      const choice = await new Promise<string | null>((resolve) => {
        Alert.alert(
          'Save As',
          'اختر صيغة الحفظ / Select format',
          [
            {
              text: 'PDF (Print)',
              onPress: () => resolve('pdf'),
            },
            {
              text: 'HTML (Image)',
              onPress: () => resolve('html'),
            },
            {
              text: t('cancel'),
              onPress: () => resolve(null),
              style: 'cancel',
            },
          ]
        );
      });

      if (choice === 'pdf') {
        await handleSaveAsPDF();
      } else if (choice === 'html') {
        await handleSaveAsHTML();
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(t('error'), 'Failed to export');
    }
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <ThemedText style={styles.modalTitle}>{customer.name}</ThemedText>
          <View style={styles.headerActions}>
            <Pressable onPress={onClose} style={styles.closeButton} hitSlop={8}>
              <Feather name="x" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Details Card */}
          <View style={[styles.cardContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {/* Grid Layout - 2 columns */}
            <View style={styles.gridContainer}>
              {allFields.map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.fieldCard,
                    item.fullWidth && styles.fullWidthField
                  ]}
                >
                  <ThemedText style={[styles.fieldLabel, { color: colors.onSurfaceVariant }]}>
                    {item.label}
                  </ThemedText>
                  <View style={[styles.fieldValue, { backgroundColor: colors.background }]}>
                    <ThemedText 
                      style={styles.fieldValueText} 
                      numberOfLines={item.fullWidth ? 4 : 2}
                    >
                      {item.value || '-'}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>

            {/* QR Code Section */}
            <View style={styles.qrCodeContainer}>
              <QRCode
                value={qrCodeData}
                size={120}
                backgroundColor={colors.background}
                color={colors.text}
                logoSize={25}
                quietZone={8}
              />
              <ThemedText style={[styles.qrLabel, { color: colors.onSurfaceVariant }]}>
                {t('scan')}
              </ThemedText>
            </View>
          </View>

          {/* Footer Buttons */}
          <View style={styles.actionButtons}>
            <Pressable
              onPress={handleExportOptions}
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
            >
              <Feather name="download" size={20} color="white" />
              <ThemedText style={styles.actionButtonText}>{language === 'ar' ? 'حفظ باسم' : 'Save As'}</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerActionButton: {
    padding: Spacing.sm,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  cardContent: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  qrCodeContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: Spacing.lg,
  },
  qrLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    justifyContent: 'space-between',
  },
  fieldCard: {
    width: '48%',
    gap: Spacing.sm,
  },
  fullWidthField: {
    width: '100%',
  },
  fieldLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
  fieldValue: {
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  fieldValueText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtons: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
