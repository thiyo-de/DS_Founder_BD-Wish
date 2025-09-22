import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  file_url: string;
  file_type: string;
  file_size: number;
  duration?: number;
  thumbnail_url?: string;
  public_id: string;
}

interface UseFileUploadReturn {
  uploading: boolean;
  progress: number;
  error: string | null;
  uploadFile: (file: File, fileType: 'video' | 'audio' | 'image') => Promise<UploadResult | null>;
  resetUpload: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(async (
    file: File, 
    fileType: 'video' | 'audio' | 'image'
  ): Promise<UploadResult | null> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileType', fileType);

      // Upload to Supabase edge function
      const { data, error: uploadError } = await supabase.functions.invoke('upload-media', {
        body: formData,
      });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setProgress(100);
      return data as UploadResult;

    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const resetUpload = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,
    resetUpload,
  };
};