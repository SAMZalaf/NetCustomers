import * as Sharing from 'expo-sharing';
import { Customer, CustomerField } from '../types/customer';
import { Platform } from 'react-native';

export const exportToExcel = async (
  customers: Customer[],
  fields: CustomerField[],
  language: 'ar' | 'en'
): Promise<boolean> => {
  try {
    const sortedFields = [...fields].sort((a, b) => a.order - b.order);
    
    let csv = '';
    const headers = sortedFields.map(f => language === 'ar' ? f.labelAr : f.labelEn);
    csv += headers.join(',') + '\n';
    
    customers.forEach(customer => {
      const row = sortedFields.map(field => {
        const value = customer[field.key] || '';
        return `"${value.replace(/"/g, '""')}"`;
      });
      csv += row.join(',') + '\n';
    });
    
    if (Platform.OS === 'web') {
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      return true;
    }
    
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      const fileName = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      const blob = new Blob([csv], { type: 'text/csv' });
      await Sharing.shareAsync(blob as any, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Customers',
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
