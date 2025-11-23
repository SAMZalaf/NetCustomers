import React, { createContext, useContext, useState, useEffect } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  ar: {
    customers: 'العملاء',
    addCustomer: 'إضافة عميل',
    settings: 'الإعدادات',
    search: 'بحث...',
    noCustomers: 'لا يوجد عملاء',
    noCustomersDesc: 'ابدأ بإضافة عميل جديد',
    serialNumber: 'رقم تسلسلي',
    location: 'الموقع',
    name: 'الاسم',
    pointName: 'اسم النقطة',
    networkName: 'اسم الشبكة',
    networkPassword: 'كلمة مرور الشبكة',
    username: 'اسم المستخدم',
    userPassword: 'كلمة المرور',
    ipAddress: 'عنوان IP',
    gatewayIp: 'IP Gateway',
    packageSpeed: 'سرعة الباقة',
    packageSize: 'حجم الباقة',
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    deleteConfirm: 'هل أنت متأكد من حذف هذا العميل؟',
    yes: 'نعم',
    no: 'لا',
    appearance: 'المظهر',
    theme: 'السمة',
    light: 'فاتح',
    dark: 'داكن',
    system: 'النظام',
    language: 'اللغة',
    arabic: 'العربية',
    english: 'English',
    googleDrive: 'Google Drive',
    notConnected: 'غير متصل',
    signIn: 'تسجيل الدخول',
    signOut: 'تسجيل الخروج',
    switchAccount: 'تبديل الحساب',
    sync: 'مزامنة',
    syncing: 'جاري المزامنة...',
    synced: 'تمت المزامنة',
    lastSync: 'آخر مزامنة',
    autoSync: 'مزامنة تلقائية',
    autoSyncDesc: 'مزامنة البيانات تلقائياً عند الاتصال بالإنترنت',
    dataManagement: 'إدارة البيانات',
    exportToExcel: 'تصدير إلى Excel',
    manageFields: 'إدارة الحقول',
    clearAllData: 'حذف جميع البيانات',
    clearDataConfirm: 'هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.',
    about: 'حول',
    version: 'الإصدار',
    offline: 'غير متصل',
    error: 'خطأ',
    success: 'نجح',
    exportSuccess: 'تم تصدير البيانات بنجاح',
    exportError: 'فشل تصدير البيانات',
    syncSuccess: 'تمت المزامنة بنجاح',
    syncError: 'فشلت المزامنة',
    required: 'مطلوب',
    invalidIp: 'عنوان IP غير صحيح',
    editCustomer: 'تعديل العميل',
    customerAdded: 'تمت إضافة العميل',
    customerUpdated: 'تم تحديث العميل',
    customerDeleted: 'تم حذف العميل',
    fieldSettings: 'إعدادات الحقول',
    addField: 'إضافة حقل',
    fieldName: 'اسم الحقل',
    fieldType: 'نوع الحقل',
    text: 'نص',
    password: 'كلمة مرور',
    number: 'رقم',
    ip: 'عنوان IP',
    requiredField: 'حقل مطلوب',
    moveUp: 'تحريك لأعلى',
    moveDown: 'تحريك لأسفل',
    allDataCleared: 'تم حذف جميع البيانات',
  },
  en: {
    customers: 'Customers',
    addCustomer: 'Add Customer',
    settings: 'Settings',
    search: 'Search...',
    noCustomers: 'No Customers',
    noCustomersDesc: 'Start by adding a new customer',
    serialNumber: 'Serial Number',
    location: 'Location',
    name: 'Name',
    pointName: 'Point Name',
    networkName: 'Network Name',
    networkPassword: 'Network Password',
    username: 'Username',
    userPassword: 'Password',
    ipAddress: 'IP Address',
    gatewayIp: 'IP Gateway',
    packageSpeed: 'Package Speed',
    packageSize: 'Package Size',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    deleteConfirm: 'Are you sure you want to delete this customer?',
    yes: 'Yes',
    no: 'No',
    appearance: 'Appearance',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    language: 'Language',
    arabic: 'العربية',
    english: 'English',
    googleDrive: 'Google Drive',
    notConnected: 'Not Connected',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    switchAccount: 'Switch Account',
    sync: 'Sync',
    syncing: 'Syncing...',
    synced: 'Synced',
    lastSync: 'Last Sync',
    autoSync: 'Auto Sync',
    autoSyncDesc: 'Automatically sync data when connected to internet',
    dataManagement: 'Data Management',
    exportToExcel: 'Export to Excel',
    manageFields: 'Manage Fields',
    clearAllData: 'Clear All Data',
    clearDataConfirm: 'Are you sure you want to delete all data? This action cannot be undone.',
    about: 'About',
    version: 'Version',
    offline: 'Offline',
    error: 'Error',
    success: 'Success',
    exportSuccess: 'Data exported successfully',
    exportError: 'Failed to export data',
    syncSuccess: 'Synced successfully',
    syncError: 'Sync failed',
    required: 'Required',
    invalidIp: 'Invalid IP address',
    editCustomer: 'Edit Customer',
    customerAdded: 'Customer added',
    customerUpdated: 'Customer updated',
    customerDeleted: 'Customer deleted',
    fieldSettings: 'Field Settings',
    addField: 'Add Field',
    fieldName: 'Field Name',
    fieldType: 'Field Type',
    text: 'Text',
    password: 'Password',
    number: 'Number',
    ip: 'IP Address',
    requiredField: 'Required Field',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    allDataCleared: 'All data cleared',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang === 'ar' || savedLang === 'en') {
        setLanguageState(savedLang);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ar] || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
