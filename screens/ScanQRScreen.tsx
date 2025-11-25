import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useTheme } from '../hooks/useTheme';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useCustomers } from '../contexts/CustomerContext';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function ScanQRScreen() {
  const { theme: colors } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation();
  const { customers } = useCustomers();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const processQRData = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      const customer = customers.find(c => c.id === qrData.id);
      if (customer) {
        navigation.navigate('DetailCustomer' as never, { customer } as never);
      } else {
        Alert.alert(t('error'), 'Customer not found');
        setTimeout(() => setScanned(false), 1000);
      }
    } catch (error) {
      Alert.alert(t('error'), 'Invalid QR code');
      setTimeout(() => setScanned(false), 1000);
    }
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    processQRData(data);
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        // For web, we'll show a simple alert since QR detection from image file
        // requires special handling
        Alert.alert(t('error'), 'Image selected. QR code scanning from images requires advanced setup.');
      }
    } catch (error) {
      Alert.alert(t('error'), 'Failed to pick image');
    }
  };

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.center}>
          <Feather name="loader" size={48} color={colors.onSurface} />
          <ThemedText style={styles.message}>{t('loading')}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.center}>
          <Feather name="camera-off" size={48} color={colors.onSurface} />
          <ThemedText style={styles.message}>Camera permission required</ThemedText>
          <Pressable
            onPress={requestPermission}
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ThemedText style={styles.buttonText}>Grant Permission</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        style={styles.camera}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.topRight, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomLeft, { borderColor: colors.primary }]} />
            <View style={[styles.corner, styles.bottomRight, { borderColor: colors.primary }]} />
          </View>
          <ThemedText style={styles.hint}>{t('scanQR')}</ThemedText>
        </View>
      </CameraView>

      <View style={styles.topActions}>
        <Pressable
          onPress={handlePickImage}
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.secondary || colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="image" size={20} color="white" />
          <ThemedText style={styles.actionButtonText}>{t('gallery')}</ThemedText>
        </Pressable>
      </View>

      {scanned && (
        <Pressable
          onPress={() => setScanned(false)}
          style={({ pressed }) => [
            styles.retryButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ThemedText style={styles.retryText}>{t('scanAgain')}</ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 3,
  },
  topLeft: {
    top: -5,
    left: -5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -5,
    right: -5,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -5,
    left: -5,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -5,
    right: -5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  hint: {
    marginTop: Spacing.xl * 2,
    fontSize: 16,
    opacity: 0.8,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  message: {
    fontSize: 16,
    marginTop: Spacing.lg,
  },
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  retryButton: {
    position: 'absolute',
    bottom: Spacing.xl,
    alignSelf: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  topActions: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.xl,
    flexDirection: 'row',
    gap: Spacing.md,
    zIndex: 100,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});
