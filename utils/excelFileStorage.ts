import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { Customer, CustomerField, DEFAULT_FIELDS } from '../types/customer';

// Default database directory path
const APP_NAME = 'Net Customers';
const DB_FOLDER = 'databases_xl';

export const getDefaultDatabasePath = async (): Promise<string> => {
  try {
    const appDir = `${FileSystem.documentDirectory}${APP_NAME}`;
    const dbDir = `${appDir}/${DB_FOLDER}`;
    
    // Create directories if they don't exist
    const appDirInfo = await FileSystem.getInfoAsync(appDir);
    if (!appDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(appDir, { intermediates: true });
    }
    
    const dbDirInfo = await FileSystem.getInfoAsync(dbDir);
    if (!dbDirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dbDir, { intermediates: true });
    }
    
    return dbDir;
  } catch (error) {
    console.error('Error creating database directory:', error);
    // Fallback to document directory
    return FileSystem.documentDirectory || '';
  }
};

export const getDefaultDatabaseFileName = (): string => {
  const date = new Date().toISOString().split('T')[0];
  return `customers_${date}.xlsx`;
};

export const getDefaultDatabaseFilePath = async (): Promise<string> => {
  const dbDir = await getDefaultDatabasePath();
  const fileName = getDefaultDatabaseFileName();
  return `${dbDir}/${fileName}`;
};

export const pickExcelFile = async (): Promise<string | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    });

    if (result.canceled) {
      return null;
    }

    return result.assets[0].uri;
  } catch (error) {
    console.error('Error picking file:', error);
    return null;
  }
};

export const readCustomersFromExcel = async (fileUri: string): Promise<Customer[] | null> => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const workbook = XLSX.read(fileContent, { type: 'base64' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Parse and validate customer data
    const customers: Customer[] = data.map((row: any, index: number) => ({
      id: row.id || Date.now().toString() + index,
      subscriptionDate: row.subscriptionDate || new Date().toISOString().split('T')[0],
      createdAt: row.createdAt || new Date().toISOString(),
      updatedAt: row.updatedAt || new Date().toISOString(),
      serialNumber: row.serialNumber || '',
      location: row.location || '',
      name: row.name || '',
      pointName: row.pointName || '',
      networkName: row.networkName || '',
      networkPassword: row.networkPassword || '',
      username: row.username || '',
      userPassword: row.userPassword || '',
      ipAddress: row.ipAddress || '',
      gatewayIp: row.gatewayIp || '',
      packageSpeed: row.packageSpeed || '',
      packageSize: row.packageSize || '',
      favorite: row.favorite === true || row.favorite === 'true' || false,
    }));

    return customers;
  } catch (error) {
    console.error('Error reading from Excel:', error);
    return null;
  }
};

export const writeCustomersToExcel = async (
  fileUri: string,
  customers: Customer[],
  fields: CustomerField[]
): Promise<boolean> => {
  try {
    const sortedFields = [...fields].sort((a, b) => a.order - b.order);

    // Create worksheet data
    const wsData: any[] = [];

    // Add headers
    const headers = sortedFields.map(f => f.key);
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
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });

    // Write to file
    await FileSystem.writeAsStringAsync(fileUri, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return true;
  } catch (error) {
    console.error('Error writing to Excel:', error);
    return false;
  }
};

export const getFileNameFromUri = (uri: string): string => {
  return uri.split('/').pop() || 'customers.xlsx';
};

// Auto-sync from Excel file - reads and updates customers from live Excel file
export const syncCustomersFromLiveExcel = async (fileUri: string, merge: boolean = false): Promise<Customer[] | null> => {
  try {
    const customers = await readCustomersFromExcel(fileUri);
    return customers;
  } catch (error) {
    console.error('Error syncing from live Excel:', error);
    return null;
  }
};
