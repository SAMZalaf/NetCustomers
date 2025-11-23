export interface CustomerField {
  id: string;
  key: string;
  labelAr: string;
  labelEn: string;
  type: 'text' | 'password' | 'ip' | 'number';
  required: boolean;
  order: number;
}

export interface Customer {
  id: string;
  serialNumber: string;
  location: string;
  name: string;
  pointName: string;
  networkName: string;
  networkPassword: string;
  username: string;
  userPassword: string;
  ipAddress: string;
  gatewayIp: string;
  packageSpeed: string;
  packageSize: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: string;
}

export const DEFAULT_FIELDS: CustomerField[] = [
  { id: '1', key: 'serialNumber', labelAr: 'رقم تسلسلي', labelEn: 'Serial Number', type: 'text', required: true, order: 1 },
  { id: '2', key: 'location', labelAr: 'الموقع', labelEn: 'Location', type: 'text', required: true, order: 2 },
  { id: '3', key: 'name', labelAr: 'الاسم', labelEn: 'Name', type: 'text', required: true, order: 3 },
  { id: '4', key: 'pointName', labelAr: 'اسم النقطة', labelEn: 'Point Name', type: 'text', required: false, order: 4 },
  { id: '5', key: 'networkName', labelAr: 'اسم الشبكة', labelEn: 'Network Name', type: 'text', required: false, order: 5 },
  { id: '6', key: 'networkPassword', labelAr: 'كلمة مرور الشبكة', labelEn: 'Network Password', type: 'password', required: false, order: 6 },
  { id: '7', key: 'username', labelAr: 'اسم المستخدم', labelEn: 'Username', type: 'text', required: false, order: 7 },
  { id: '8', key: 'userPassword', labelAr: 'كلمة المرور', labelEn: 'Password', type: 'password', required: false, order: 8 },
  { id: '9', key: 'ipAddress', labelAr: 'عنوان IP', labelEn: 'IP Address', type: 'ip', required: false, order: 9 },
  { id: '10', key: 'gatewayIp', labelAr: 'IP Gateway', labelEn: 'IP Gateway', type: 'ip', required: false, order: 10 },
  { id: '11', key: 'packageSpeed', labelAr: 'سرعة الباقة', labelEn: 'Package Speed', type: 'text', required: false, order: 11 },
  { id: '12', key: 'packageSize', labelAr: 'حجم الباقة', labelEn: 'Package Size', type: 'text', required: false, order: 12 },
];
