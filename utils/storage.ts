import AsyncStorage from '@react-native-async-storage/async-storage';
import { Customer, CustomerField } from '../types/customer';

const CUSTOMERS_KEY = 'customers';
const FIELDS_KEY = 'customer_fields';
const SYNC_SETTINGS_KEY = 'sync_settings';

export interface SyncSettings {
  autoSync: boolean;
  lastSyncTime: string | null;
  googleDriveFileId: string | null;
}

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const data = await AsyncStorage.getItem(CUSTOMERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading customers:', error);
    return [];
  }
};

export const saveCustomers = async (customers: Customer[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (error) {
    console.error('Error saving customers:', error);
    throw error;
  }
};

export const clearCustomers = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CUSTOMERS_KEY);
  } catch (error) {
    console.error('Error clearing customers:', error);
    throw error;
  }
};

export const getFields = async (): Promise<CustomerField[]> => {
  try {
    const data = await AsyncStorage.getItem(FIELDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading fields:', error);
    return [];
  }
};

export const saveFields = async (fields: CustomerField[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FIELDS_KEY, JSON.stringify(fields));
  } catch (error) {
    console.error('Error saving fields:', error);
    throw error;
  }
};

export const getSyncSettings = async (): Promise<SyncSettings> => {
  try {
    const data = await AsyncStorage.getItem(SYNC_SETTINGS_KEY);
    return data ? JSON.parse(data) : { autoSync: false, lastSyncTime: null, googleDriveFileId: null };
  } catch (error) {
    console.error('Error loading sync settings:', error);
    return { autoSync: false, lastSyncTime: null, googleDriveFileId: null };
  }
};

export const saveSyncSettings = async (settings: SyncSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SYNC_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving sync settings:', error);
    throw error;
  }
};
