import { supabase } from '@/integrations/supabase/client';

/**
 * Get a signed URL for accessing private files in storage buckets
 */
export const getSecureFileUrl = async (bucket: string, filePath: string): Promise<string | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      console.error('No valid session for file access');
      return null;
    }

    const response = await fetch('/api/secure-file-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ bucket, path: filePath }),
    });

    if (!response.ok) {
      console.error('Failed to get signed URL:', response.statusText);
      return null;
    }

    const { signedUrl } = await response.json();
    return signedUrl;
  } catch (error) {
    console.error('Error getting secure file URL:', error);
    return null;
  }
};

/**
 * Get a signed URL for study materials, checking approval status
 */
export const getStudyMaterialUrl = async (filePath: string): Promise<string | null> => {
  return getSecureFileUrl('study-materials', filePath);
};

/**
 * Get a signed URL for workshop recordings
 */
export const getWorkshopRecordingUrl = async (filePath: string): Promise<string | null> => {
  return getSecureFileUrl('workshop-recordings', filePath);
};