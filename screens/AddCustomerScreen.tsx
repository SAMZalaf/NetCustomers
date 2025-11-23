import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenKeyboardAwareScrollView } from '../components/ScreenKeyboardAwareScrollView';
import { useTheme } from '../hooks/useTheme';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useCustomers } from '../contexts/CustomerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Customer } from '../types/customer';

export default function AddCustomerScreen() {
  const { theme: colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { addCustomer, updateCustomer, fields } = useCustomers();
  const { t, isRTL } = useLanguage();
  
  const existingCustomer = (route.params as any)?.customer as Customer | undefined;
  const isEditing = !!existingCustomer;

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (existingCustomer) {
      setFormData(existingCustomer);
    } else {
      const nextSerial = (Date.now() % 100000).toString().padStart(5, '0');
      setFormData({ serialNumber: nextSerial });
    }
  }, [existingCustomer]);

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? t('editCustomer') : t('addCustomer'),
    });
  }, [isEditing, t, navigation]);

  const handleSave = async () => {
    const sortedFields = [...fields].sort((a, b) => a.order - b.order);
    
    for (const field of sortedFields) {
      if (field.required && !formData[field.key]?.trim()) {
        Alert.alert(t('error'), `${t(field.key)} ${t('required')}`);
        return;
      }
    }

    try {
      if (isEditing && existingCustomer) {
        await updateCustomer(existingCustomer.id, formData);
        Alert.alert(t('success'), t('customerUpdated'));
      } else {
        await addCustomer(formData as any);
        Alert.alert(t('success'), t('customerAdded'));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('error'), 'Failed to save customer');
    }
  };

  const renderField = (fieldKey: string, labelKey: string, type: string, required: boolean) => {
    const isPassword = type === 'password';
    const value = formData[fieldKey] || '';
    const showPassword = showPasswords[fieldKey] || false;

    return (
      <View key={fieldKey} style={styles.fieldContainer}>
        <ThemedText style={styles.label}>
          {t(labelKey)}
          {required && <ThemedText style={{ color: colors.error }}> *</ThemedText>}
        </ThemedText>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
              isPassword && !showPassword && styles.passwordInput,
            ]}
            value={value}
            onChangeText={(text: string) => setFormData({ ...formData, [fieldKey]: text })}
            secureTextEntry={isPassword && !showPassword}
            keyboardType={type === 'ip' ? 'numbers-and-punctuation' : 'default'}
            placeholder={t(labelKey)}
            placeholderTextColor={colors.onSurfaceVariant}
          />
          {isPassword && (
            <Pressable
              onPress={() =>
                setShowPasswords({ ...showPasswords, [fieldKey]: !showPassword })
              }
              style={styles.eyeButton}
            >
              <Feather
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.onSurfaceVariant}
              />
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  const sortedFields = [...fields].sort((a, b) => a.order - b.order);

  return (
    <ThemedView style={styles.container}>
      <ScreenKeyboardAwareScrollView contentContainerStyle={styles.scrollContent}>
        {sortedFields.map(field =>
          renderField(field.key, field.key, field.type, field.required)
        )}

        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
              {t('save')}
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.button, styles.cancelButton, { borderColor: colors.border }]}
            onPress={() => navigation.goBack()}
          >
            <ThemedText style={{ color: colors.text }}>{t('cancel')}</ThemedText>
          </Pressable>
        </View>
      </ScreenKeyboardAwareScrollView>
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
  fieldContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    height: Spacing.inputHeight,
    paddingHorizontal: Spacing.md,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  passwordInput: {
    fontFamily: 'monospace',
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  button: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
