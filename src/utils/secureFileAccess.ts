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

    const { data, error } = await supabase.functions.invoke('secure-file-access', {
      body: { bucket, path: filePath },
    });

    if (error) {
      console.error('Failed to get signed URL:', error);
      return null;
    }

    return data.signedUrl;
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