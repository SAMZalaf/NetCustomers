import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenScrollView } from '../components/ScreenScrollView';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../constants/theme';
import { useCustomers } from '../contexts/CustomerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CustomerField } from '../types/customer';

export default function FieldSettingsScreen() {
  const { theme: colors } = useTheme();
  const navigation = useNavigation();
  const { fields, updateFields } = useCustomers();
  const { t, isRTL, language } = useLanguage();
  const [editedFields, setEditedFields] = useState<CustomerField[]>([...fields]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFieldAr, setNewFieldAr] = useState('');
  const [newFieldEn, setNewFieldEn] = useState('');
  const [newFieldType, setNewFieldType] = useState<'text' | 'password' | 'ip' | 'number'>('text');

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFields = [...editedFields];
    const temp = newFields[index];
    newFields[index] = newFields[index - 1];
    newFields[index - 1] = temp;
    newFields.forEach((field, idx) => {
      field.order = idx + 1;
    });
    setEditedFields(newFields);
  };

  const moveDown = (index: number) => {
    if (index === editedFields.length - 1) return;
    const newFields = [...editedFields];
    const temp = newFields[index];
    newFields[index] = newFields[index + 1];
    newFields[index + 1] = temp;
    newFields.forEach((field, idx) => {
      field.order = idx + 1;
    });
    setEditedFields(newFields);
  };

  const deleteField = (index: number) => {
    const field = editedFields[index];
    if (field.required) {
      Alert.alert(t('error'), 'Cannot delete required field');
      return;
    }
    
    Alert.alert(t('delete'), `Delete ${language === 'ar' ? field.labelAr : field.labelEn}?`, [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: () => {
          const newFields = editedFields.filter((_, idx) => idx !== index);
          newFields.forEach((f, idx) => {
            f.order = idx + 1;
          });
          setEditedFields(newFields);
        },
      },
    ]);
  };

  const addField = () => {
    if (!newFieldAr.trim() || !newFieldEn.trim()) {
      Alert.alert(t('error'), 'Please enter field names in both languages');
      return;
    }

    const newField: CustomerField = {
      id: Date.now().toString(),
      key: `custom_${Date.now()}`,
      labelAr: newFieldAr,
      labelEn: newFieldEn,
      type: newFieldType,
      required: false,
      order: editedFields.length + 1,
    };

    setEditedFields([...editedFields, newField]);
    setNewFieldAr('');
    setNewFieldEn('');
    setNewFieldType('text');
    setShowAddDialog(false);
  };

  const saveChanges = async () => {
    await updateFields(editedFields);
    Alert.alert(t('success'), 'Field settings saved');
    navigation.goBack();
  };

  const renderField = (field: CustomerField, index: number) => (
    <View
      key={field.id}
      style={[styles.fieldCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View style={styles.fieldHeader}>
        <View style={styles.fieldInfo}>
          <ThemedText style={styles.fieldLabel}>
            {language === 'ar' ? field.labelAr : field.labelEn}
          </ThemedText>
          <ThemedText style={[styles.fieldMeta, { color: colors.onSurfaceVariant }]}>
            {t(field.type)} {field.required ? `• ${t('required')}` : ''}
          </ThemedText>
        </View>
        <View style={styles.fieldActions}>
          <Pressable
            onPress={() => moveUp(index)}
            disabled={index === 0}
            style={[styles.iconButton, index === 0 && { opacity: 0.3 }]}
          >
            <Feather name="chevron-up" size={20} color={colors.onSurfaceVariant} />
          </Pressable>
          <Pressable
            onPress={() => moveDown(index)}
            disabled={index === editedFields.length - 1}
            style={[styles.iconButton, index === editedFields.length - 1 && { opacity: 0.3 }]}
          >
            <Feather name="chevron-down" size={20} color={colors.onSurfaceVariant} />
          </Pressable>
          {!field.required && (
            <Pressable onPress={() => deleteField(index)} style={styles.iconButton}>
              <Feather name="trash-2" size={18} color={colors.error} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScreenScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={styles.description}>
          {isRTL
            ? 'قم بإعادة ترتيب الحقول أو حذف الحقول غير المطلوبة'
            : 'Reorder fields or delete non-required fields'}
        </ThemedText>

        {editedFields.map((field, index) => renderField(field, index))}

        {showAddDialog ? (
          <View
            style={[
              styles.addDialog,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <ThemedText style={styles.dialogTitle}>{t('addField')}</ThemedText>
            
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              placeholder={t('fieldName') + ' (العربية)'}
              placeholderTextColor={colors.onSurfaceVariant}
              value={newFieldAr}
              onChangeText={setNewFieldAr}
            />
            
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              placeholder={t('fieldName') + ' (English)'}
              placeholderTextColor={colors.onSurfaceVariant}
              value={newFieldEn}
              onChangeText={setNewFieldEn}
            />

            <View style={styles.typeSelector}>
              {(['text', 'password', 'number', 'ip'] as const).map(type => (
                <Pressable
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: newFieldType === type ? colors.primaryContainer : colors.background,
                      borderColor: newFieldType === type ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setNewFieldType(type)}
                >
                  <ThemedText
                    style={[
                      styles.typeLabel,
                      { color: newFieldType === type ? colors.primary : colors.text },
                    ]}
                  >
                    {t(type)}
                  </ThemedText>
                </Pressable>
              ))}
            </View>

            <View style={styles.dialogActions}>
              <Pressable
                style={[styles.dialogButton, { backgroundColor: colors.primary }]}
                onPress={addField}
              >
                <ThemedText style={{ color: colors.buttonText }}>{t('save')}</ThemedText>
              </Pressable>
              <Pressable
                style={[styles.dialogButton, { borderWidth: 1, borderColor: colors.border }]}
                onPress={() => {
                  setShowAddDialog(false);
                  setNewFieldAr('');
                  setNewFieldEn('');
                }}
              >
                <ThemedText>{t('cancel')}</ThemedText>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={[styles.addButton, { backgroundColor: colors.primaryContainer }]}
            onPress={() => setShowAddDialog(true)}
          >
            <Feather name="plus" size={20} color={colors.primary} />
            <ThemedText style={[styles.addButtonText, { color: colors.primary }]}>
              {t('addField')}
            </ThemedText>
          </Pressable>
        )}
      </ScreenScrollView>

      <View style={[styles.footer, { backgroundColor: colors.backgroundRoot, borderTopColor: colors.border }]}>
        <Pressable
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={saveChanges}
        >
          <ThemedText style={[styles.saveButtonText, { color: colors.buttonText }]}>
            {t('save')}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 160,
  },
  description: {
    fontSize: 14,
    marginBottom: Spacing.lg,
    opacity: 0.7,
  },
  fieldCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldInfo: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  fieldMeta: {
    fontSize: 12,
  },
  fieldActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addDialog: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.lg,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  typeButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  dialogActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  dialogButton: {
    flex: 1,
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl + Spacing.lg,
    borderTopWidth: 1,
  },
  saveButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
