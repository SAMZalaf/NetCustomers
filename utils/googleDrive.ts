import { Customer, CustomerField } from '../types/customer';
import * as Storage from './storage';
import { Platform } from 'react-native';

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export const MIME_TYPE_JSON = 'application/json';
export const DB_FILENAME = 'internet-customers-db.json';

export const getGoogleDriveAccessToken = async (): Promise<string | null> => {
  try {
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY
      ? 'repl ' + process.env.REPL_IDENTITY
      : process.env.WEB_REPL_RENEWAL
        ? 'depl ' + process.env.WEB_REPL_RENEWAL
        : null;

    if (!xReplitToken || !hostname) {
      console.log('Google Drive auth not available in this environment');
      return null;
    }

    const response = await fetch(
      'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-drive',
      {
        headers: {
          'Accept': 'application/json',
          'X_REPLIT_TOKEN': xReplitToken,
        },
      }
    );

    const data = await response.json();
    const connectionSettings = data.items?.[0];

    if (!connectionSettings) {
      console.log('Google Drive not connected');
      return null;
    }

    const accessToken =
      connectionSettings.settings?.access_token ||
      connectionSettings.settings?.oauth?.credentials?.access_token;

    return accessToken || null;
  } catch (error) {
    console.error('Error getting Google Drive access token:', error);
    return null;
  }
};

export const findFileByName = async (
  accessToken: string,
  fileName: string
): Promise<GoogleDriveFile | null> => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and trashed=false&spaces=drive&fields=files(id,name,mimeType,modifiedTime)&pageSize=1`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();
    return data.files?.[0] || null;
  } catch (error) {
    console.error('Error finding file:', error);
    return null;
  }
};

export const uploadToGoogleDrive = async (
  customers: Customer[],
  fields: CustomerField[]
): Promise<boolean> => {
  try {
    const accessToken = await getGoogleDriveAccessToken();
    if (!accessToken) {
      console.log('Cannot sync: Google Drive not connected');
      return false;
    }

    const fileData = {
      customers,
      fields,
      lastUpdated: new Date().toISOString(),
    };

    const fileContent = JSON.stringify(fileData, null, 2);

    let fileId: string | null = null;
    const existingFile = await findFileByName(accessToken, DB_FILENAME);
    fileId = existingFile?.id || null;

    if (fileId) {
      const updateResponse = await fetch(
        `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: fileContent,
        }
      );

      if (!updateResponse.ok) {
        console.error('Update failed:', updateResponse.status);
        return false;
      }
    } else {
      const metadata = {
        name: DB_FILENAME,
        mimeType: MIME_TYPE_JSON,
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', new Blob([fileContent], { type: 'application/json' }));

      const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      if (!uploadResponse.ok) {
        console.error('Upload failed:', uploadResponse.status);
        return false;
      }
    }

    const settings = await Storage.getSyncSettings();
    await Storage.saveSyncSettings({
      ...settings,
      lastSyncTime: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error('Error syncing to Google Drive:', error);
    return false;
  }
};

export const downloadFromGoogleDrive = async (): Promise<{
  customers: Customer[];
  fields: CustomerField[];
} | null> => {
  try {
    const accessToken = await getGoogleDriveAccessToken();
    if (!accessToken) {
      console.log('Cannot load: Google Drive not connected');
      return null;
    }

    const file = await findFileByName(accessToken, DB_FILENAME);
    if (!file) {
      console.log('No database file found on Google Drive');
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Download failed:', response.status);
      return null;
    }

    const data = await response.json();
    return {
      customers: data.customers || [],
      fields: data.fields || [],
    };
  } catch (error) {
    console.error('Error downloading from Google Drive:', error);
    return null;
  }
};

export const syncToGoogleDrive = uploadToGoogleDrive;
export const loadFromGoogleDrive = downloadFromGoogleDrive;
