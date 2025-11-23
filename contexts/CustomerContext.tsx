import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, CustomerField, DEFAULT_FIELDS } from '../types/customer';
import * as Storage from '../utils/storage';

interface CustomerContextType {
  customers: Customer[];
  fields: CustomerField[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  clearAllCustomers: () => Promise<void>;
  updateFields: (fields: CustomerField[]) => Promise<void>;
  refreshCustomers: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [fields, setFields] = useState<CustomerField[]>(DEFAULT_FIELDS);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedCustomers = await Storage.getCustomers();
    const loadedFields = await Storage.getFields();
    setCustomers(loadedCustomers);
    if (loadedFields.length > 0) {
      setFields(loadedFields);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCustomer: Customer = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      serialNumber: customerData.serialNumber || '',
      location: customerData.location || '',
      name: customerData.name || '',
      pointName: customerData.pointName || '',
      networkName: customerData.networkName || '',
      networkPassword: customerData.networkPassword || '',
      username: customerData.username || '',
      userPassword: customerData.userPassword || '',
      ipAddress: customerData.ipAddress || '',
      gatewayIp: customerData.gatewayIp || '',
      packageSpeed: customerData.packageSpeed || '',
      packageSize: customerData.packageSize || '',
      ...customerData,
    };
    const updatedCustomers = [...customers, newCustomer];
    await Storage.saveCustomers(updatedCustomers);
    setCustomers(updatedCustomers);
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    const updatedCustomers = customers.map(c =>
      c.id === id ? { ...c, ...customerData, updatedAt: new Date().toISOString() } : c
    );
    await Storage.saveCustomers(updatedCustomers);
    setCustomers(updatedCustomers);
  };

  const deleteCustomer = async (id: string) => {
    const updatedCustomers = customers.filter(c => c.id !== id);
    await Storage.saveCustomers(updatedCustomers);
    setCustomers(updatedCustomers);
  };

  const clearAllCustomers = async () => {
    await Storage.clearCustomers();
    setCustomers([]);
  };

  const updateFields = async (newFields: CustomerField[]) => {
    await Storage.saveFields(newFields);
    setFields(newFields);
  };

  const refreshCustomers = async () => {
    const loadedCustomers = await Storage.getCustomers();
    setCustomers(loadedCustomers);
  };

  return (
    <CustomerContext.Provider
      value={{
        customers,
        fields,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        clearAllCustomers,
        updateFields,
        refreshCustomers,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within CustomerProvider');
  }
  return context;
};
