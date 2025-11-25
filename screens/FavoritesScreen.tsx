import React, { useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { ScreenFlatList } from '../components/ScreenFlatList';
import { useTheme } from '../hooks/useTheme';
import { Spacing, BorderRadius } from '../constants/theme';
import { useCustomers } from '../contexts/CustomerContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Customer } from '../types/customer';
import CustomerDetailModal from '../components/CustomerDetailModal';

export default function FavoritesScreen() {
  const { theme: colors } = useTheme();
  const navigation = useNavigation();
  const { customers, deleteCustomer, toggleFavorite } = useCustomers();
  const { t, isRTL } = useLanguage();
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const favorites = useMemo(() => {
    return customers.filter(c => c.isFavorite);
  }, [customers]);

  const handleDelete = (customer: Customer) => {
    deleteCustomer(customer.id);
  };

  const renderCustomer = ({ item }: { item: Customer }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { opacity: 0.7 },
      ]}
      onLongPress={() => setSelectedCustomer(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.serialNumberContainer}>
          <Pressable
            onPress={() => toggleFavorite(item.id)}
            style={styles.favoriteButton}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="star"
              size={20}
              color="#FFD700"
            />
          </Pressable>
          <ThemedText style={styles.serialNumber}>#{item.serialNumber}</ThemedText>
        </View>
        <View style={styles.actions}>
          <Pressable
            onPress={() => setSelectedCustomer(item)}
            style={styles.actionButton}
            hitSlop={8}
          >
            <Feather name="info" size={18} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => (navigation as any).navigate('AddCustomer', { customer: item })}
            style={styles.actionButton}
            hitSlop={8}
          >
            <Feather name="edit-2" size={18} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => handleDelete(item)} style={styles.actionButton} hitSlop={8}>
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
      <Feather name="star" size={64} color={colors.onSurfaceVariant} />
      <ThemedText style={styles.emptyTitle}>{t('noCustomers')}</ThemedText>
      <ThemedText style={[styles.emptyDesc, { color: colors.onSurfaceVariant }]}>
        {t('noCustomersDesc')}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScreenFlatList
        data={favorites}
        renderItem={renderCustomer}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmptyComponent}
      />

      <CustomerDetailModal
        visible={selectedCustomer !== null}
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  serialNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  favoriteButton: {
    padding: Spacing.sm,
  },
  serialNumber: {
    fontWeight: '600',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.sm,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  cardInfo: {
    gap: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
  },
  listContent: {
    paddingVertical: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: Spacing.lg,
  },
  emptyDesc: {
    fontSize: 14,
    marginTop: Spacing.sm,
  },
});
