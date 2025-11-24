import React, { createContext, useContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useCustomers } from './CustomerContext';
import * as GoogleDrive from '../utils/googleDrive';
import * as Storage from '../utils/storage';

interface SyncContextType {
  isSyncing: boolean;
  syncError: string | null;
  lastSyncTime: string | null;
  manualSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { customers, fields } = useCustomers();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && autoSyncEnabled) {
        manualSync();
      }
    });

    return () => unsubscribe();
  }, [autoSyncEnabled, customers, fields]);

  const loadSettings = async () => {
    const settings = await Storage.getSyncSettings();
    setAutoSyncEnabled(settings.autoSync);
    setLastSyncTime(settings.lastSyncTime);
  };

  const manualSync = async () => {
    try {
      setIsSyncing(true);
      setSyncError(null);

      const success = await GoogleDrive.syncToGoogleDrive(customers, fields);

      if (success) {
        const settings = await Storage.getSyncSettings();
        setLastSyncTime(settings.lastSyncTime);
      } else {
        setSyncError('Sync failed. Google Drive may not be connected.');
      }
    } catch (error) {
      setSyncError('An error occurred during sync');
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SyncContext.Provider
      value={{
        isSyncing,
        syncError,
        lastSyncTime,
        manualSync,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
};
