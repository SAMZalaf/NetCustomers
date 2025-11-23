import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useTheme } from '../hooks/useTheme';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useCustomers } from '../contexts/CustomerContext';
import * as Storage from '../utils/storage';
import * as GoogleDrive from '../utils/googleDrive';
import { exportToExcel } from '../utils/excel';

export default function SettingsScreen() {
  const { theme: colors } = useTheme();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { themeMode, setThemeMode } = useThemeContext();
  const { customers, clearAllCustomers, fields } = useCustomers();
  const [autoSync, setAutoSync] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadSyncSettings();
  }, []);

  const loadSyncSettings = async () => {
    const settings = await Storage.getSyncSettings();
    setAutoSync(settings.autoSync);
    setLastSync(settings.lastSyncTime);
  };

  const handleThemeChange = async (mode: 'light' | 'dark' | 'system') => {
    await setThemeMode(mode);
  };

  const handleLanguageChange = async (lang: 'ar' | 'en') => {
    await setLanguage(lang);
  };

  const handleAutoSyncToggle = async (value: boolean) => {
    setAutoSync(value);
    const settings = await Storage.getSyncSettings();
    await Storage.saveSyncSettings({ ...settings, autoSync: value });
  };

  const handleManualSync = async () => {
    setSyncing(true);
    const success = await GoogleDrive.syncToGoogleDrive(customers);
    setSyncing(false);
    
    if (success) {
      const settings = await Storage.getSyncSettings();
      setLastSync(settings.lastSyncTime);
      Alert.alert(t('success'), t('syncSuccess'));
    } else {
      Alert.alert(t('error'), t('syncError'));
    }
  };

  const handleExport = async () => {
    const success = await exportToExcel(customers, fields, language);
    if (success) {
      Alert.alert(t('success'), t('exportSuccess'));
    } else {
      Alert.alert(t('error'), t('exportError'));
    }
  };

  const handleClearData = () => {
    Alert.alert(t('clearAllData'), t('clearDataConfirm'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: async () => {
          await clearAllCustomers();
          Alert.alert(t('success'), t('allDataCleared'));
        },
      },
    ]);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t('notConnected');
    const date = new Date(dateString);
    return date.toLocaleString(language === 'ar' ? 'ar-SA' : 'en-US');
  };

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>
        {children}
      </View>
    </View>
  );

  const renderOption = (
    icon: string,
    label: string,
    onPress: () => void,
    rightElement?: React.ReactNode,
    destructive?: boolean
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        { borderBottomColor: colors.border },
        pressed && { backgroundColor: colors.backgroundSecondary },
      ]}
      onPress={onPress}
    >
      <View style={styles.optionLeft}>
        <Feather
          name={icon as any}
          size={20}
          color={destructive ? colors.error : colors.onSurfaceVariant}
        />
        <ThemedText style={[styles.optionLabel, destructive && { color: colors.error }]}>
          {label}
        </ThemedText>
      </View>
      {rightElement || <Feather name={isRTL ? 'chevron-left' : 'chevron-right'} size={20} color={colors.onSurfaceVariant} />}
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView contentContainerStyle={styles.scrollContent}>
        {renderSection(
          t('appearance'),
          <>
            <View style={styles.themeContainer}>
              {(['light', 'dark', 'system'] as const).map(mode => (
                <Pressable
                  key={mode}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor:
                        themeMode === mode ? colors.primaryContainer : colors.surface,
                      borderColor: themeMode === mode ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleThemeChange(mode)}
                >
                  <Feather
                    name={
                      mode === 'light' ? 'sun' : mode === 'dark' ? 'moon' : 'smartphone'
                    }
                    size={24}
                    color={themeMode === mode ? colors.primary : colors.onSurfaceVariant}
                  />
                  <ThemedText
                    style={[
                      styles.themeLabel,
                      { color: themeMode === mode ? colors.primary : colors.text },
                    ]}
                  >
                    {t(mode)}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.languageContainer}>
              {(['ar', 'en'] as const).map(lang => (
                <Pressable
                  key={lang}
                  style={[
                    styles.languageButton,
                    {
                      backgroundColor:
                        language === lang ? colors.primaryContainer : colors.surface,
                      borderColor: language === lang ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleLanguageChange(lang)}
                >
                  <ThemedText
                    style={[
                      styles.languageLabel,
                      { color: language === lang ? colors.primary : colors.text },
                    ]}
                  >
                    {t(lang === 'ar' ? 'arabic' : 'english')}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {renderSection(
          t('googleDrive'),
          <>
            <View style={styles.syncStatus}>
              <ThemedText style={[styles.syncLabel, { color: colors.onSurfaceVariant }]}>
                {t('lastSync')}
              </ThemedText>
              <ThemedText style={styles.syncTime}>{formatDate(lastSync)}</ThemedText>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {renderOption(
              'refresh-cw',
              syncing ? t('syncing') : t('sync'),
              handleManualSync,
              syncing ? (
                <View style={styles.syncingIndicator} />
              ) : undefined
            )}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={[styles.option, { borderBottomWidth: 0 }]}>
              <View style={styles.optionLeft}>
                <Feather name="repeat" size={20} color={colors.onSurfaceVariant} />
                <View>
                  <ThemedText style={styles.optionLabel}>{t('autoSync')}</ThemedText>
                  <ThemedText style={[styles.optionDesc, { color: colors.onSurfaceVariant }]}>
                    {t('autoSyncDesc')}
                  </ThemedText>
                </View>
              </View>
              <Switch
                value={autoSync}
                onValueChange={handleAutoSyncToggle}
                trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
                thumbColor={colors.background}
              />
            </View>
          </>
        )}

        {renderSection(
          t('dataManagement'),
          <>
            {renderOption('download', t('exportToExcel'), handleExport)}
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            {renderOption('trash-2', t('clearAllData'), handleClearData, undefined, true)}
          </>
        )}

        {renderSection(
          t('about'),
          <View style={styles.option}>
            <ThemedText style={styles.optionLabel}>{t('version')}</ThemedText>
            <ThemedText style={{ color: colors.onSurfaceVariant }}>1.0.0</ThemedText>
          </View>
        )}
      </ScreenScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    opacity: 0.7,
  },
  sectionContent: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderBottomWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
  },
  optionDesc: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
  },
  themeContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  themeButton: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  themeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  languageContainer: {
    flexDirection: 'row',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  languageButton: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  syncStatus: {
    padding: Spacing.lg,
  },
  syncLabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  syncTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  syncingIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    borderTopColor: Colors.light.primary,
  },
});
