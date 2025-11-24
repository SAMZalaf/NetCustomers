import * as Sharing from 'expo-sharing';
import { Customer, CustomerField } from '../types/customer';
import { Platform } from 'react-native';
import * as XLSX from 'xlsx';

export const exportToExcel = async (
  customers: Customer[],
  fields: CustomerField[],
  language: 'ar' | 'en'
): Promise<boolean> => {
  try {
    const sortedFields = [...fields].sort((a, b) => a.order - b.order);
    
    // Create worksheet data
    const wsData: any[] = [];
    
    // Add headers
    const headers = sortedFields.map(f => language === 'ar' ? f.labelAr : f.labelEn);
    wsData.push(headers);
    
    // Add customer rows
    customers.forEach(customer => {
      const row = sortedFields.map(field => customer[field.key] || '');
      wsData.push(row);
    });
    
    // Create workbook and worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customers');
    
    // Generate file
    const fileName = `customers_${new Date().toISOString().split('T')[0]}.xlsx`;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
    
    if (Platform.OS === 'web') {
      // Web export
      const link = document.createElement('a');
      link.href = `data:application/octet-stream;base64,${wbout}`;
      link.download = fileName;
      link.click();
      return true;
    }
    
    // Mobile export
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      const fileUri = `data:application/octet-stream;base64,${wbout}`;
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Customers',
        filename: fileName,
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};
