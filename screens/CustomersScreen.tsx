import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, Pressable, Alert, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenFlatList } from '../components/ScreenFlatList';
import { useTheme } from '../hooks/useTheme';
import { Colors, Spacing, BorderRadius } from '../constants/theme';
import { useCustomers } from '../contexts/CustomerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Customer } from '../types/customer';
import { exportToExcel } from '../utils/excel';

export default function CustomersScreen() {
  const { theme: colors } = useTheme();
  const navigation = useNavigation();
  const { customers, deleteCustomer, fields } = useCustomers();
  const { t, language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      c =>
        c.name?.toLowerCase().includes(query) ||
        c.serialNumber?.toLowerCase().includes(query) ||
        c.location?.toLowerCase().includes(query) ||
        c.ipAddress?.toLowerCase().includes(query)
    );
  }, [customers, searchQuery]);

  const handleExport = async () => {
    const success = await exportToExcel(customers, fields, language);
    if (success) {
      Alert.alert(t('success'), t('exportSuccess'));
    } else {
      Alert.alert(t('error'), t('exportError'));
    }
  };

  const handleDelete = (customer: Customer) => {
    Alert.alert(t('delete'), t('deleteConfirm'), [
      { text: t('no'), style: 'cancel' },
      {
        text: t('yes'),
        style: 'destructive',
        onPress: async () => {
          await deleteCustomer(customer.id);
          Alert.alert(t('success'), t('customerDeleted'));
        },
      },
    ]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.7 },
      ]}
      onPress={() => (navigation as any).navigate('AddCustomer', { customer: item })}
    >
      <View style={styles.cardHeader}>
        <ThemedText style={styles.serialNumber}>#{item.serialNumber}</ThemedText>
        <View style={styles.actions}>
          <Pressable
            onPress={() => (navigation as any).navigate('AddCustomer', { customer: item })}
            style={styles.actionButton}
          >
            <Feather name="edit-2" size={18} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} style={styles.actionButton}>
            <Feather name="trash-2" size={18} color={colors.error} />
          </Pressable>
        </View>
      </View>
      <ThemedText style={styles.customerName}>{item.name}</ThemedText>
      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={14} color={colors.onSurfaceVariant} />
          <ThemedText style={[styles.infoText, { color: colors.onSurfaceVariant }]}>
            {item.location}
          </ThemedText>
        </View>
        <View style={styles.infoRow}>
          <Feather name="wifi" size={14} color={colors.onSurfaceVariant} />
          <ThemedText style={[styles.infoText, { color: colors.onSurfaceVariant }]}>
            {item.ipAddress}
          </ThemedText>
        </View>
      </View>
    </Pressable>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="users" size={64} color={colors.onSurfaceVariant} />
      <ThemedText style={styles.emptyTitle}>{t('noCustomers')}</ThemedText>
      <ThemedText style={[styles.emptyDesc, { color: colors.onSurfaceVariant }]}>
        {t('noCustomersDesc')}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Feather name="search" size={20} color={colors.onSurfaceVariant} />
        <TextInput
          style={[
            styles.searchInput,
            { color: colors.text, textAlign: isRTL ? 'right' : 'left' },
          ]}
          placeholder={t('search')}
          placeholderTextColor={colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable onPress={handleExport} style={styles.exportButton}>
          <Feather name="download" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <ScreenFlatList
        data={filteredCustomers}
        renderItem={renderCustomer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 16,
  },
  exportButton: {
    padding: Spacing.sm,
  },
  listContent: {
    padding: Spacing.lg,
  },
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  serialNumber: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  cardInfo: {
    gap: Spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: Spacing.lg,
    marginBottom: Spacing.xs,
  },
  emptyDesc: {
    fontSize: 14,
  },
});
