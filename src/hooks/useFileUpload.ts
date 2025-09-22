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

      // Fallback to direct fetch if invoke fails (handles large FormData reliably)
      if (uploadError || !data?.success) {
        const SUPABASE_URL = 'https://hcvbsbiqcphrendiwcdg.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjdmJzYmlxY3BocmVuZGl3Y2RnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzNTE1ODMsImV4cCI6MjA3MzkyNzU4M30.HzPc8u-b1griOqk4t38LAvGb43Hw9c9uVHrng9kPhls';
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/upload-media`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: formData,
        });
        const json = await resp.json().catch(() => null);
        if (!resp.ok || !json?.success) {
          throw new Error(json?.error || uploadError?.message || 'Upload failed');
        }
        setProgress(100);
        return json as UploadResult;
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