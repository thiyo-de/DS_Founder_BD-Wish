import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  duration?: number;
  width?: number;
  height?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string; // 'video', 'audio', 'image'
    
    if (!file) {
      throw new Error('No file provided');
    }

    // File validation
    const maxSizes = {
      video: 50 * 1024 * 1024, // 50MB
      audio: 10 * 1024 * 1024, // 10MB
      image: 5 * 1024 * 1024,  // 5MB
    };

    if (file.size > maxSizes[fileType as keyof typeof maxSizes]) {
      throw new Error(`File too large. Max size for ${fileType}: ${maxSizes[fileType as keyof typeof maxSizes] / (1024 * 1024)}MB`);
    }

    // Get Cloudinary credentials
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error('Cloudinary credentials missing');
    }

    // Set resource type based on file type
    const resourceType = fileType === 'image' ? 'image' : fileType === 'video' ? 'video' : 'video'; // audio uploads as video in Cloudinary
    
    // Upload to Cloudinary
    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    // Create upload data with authentication
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `tribute_${timestamp}_${crypto.randomUUID()}`;
    
    // Create signature for authentication
    const paramsToSign = `public_id=${publicId}&timestamp=${timestamp}`;
    const signature = await createSignature(paramsToSign, apiSecret);
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('public_id', publicId);
    uploadData.append('timestamp', timestamp.toString());
    uploadData.append('api_key', apiKey);
    uploadData.append('signature', signature);

    const cloudinaryResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: uploadData,
    });

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error('Upload failed');
    }

    const result: CloudinaryUploadResult = await cloudinaryResponse.json();
    
    // Generate thumbnail for videos
    let thumbnailUrl = '';
    if (fileType === 'video') {
      thumbnailUrl = result.secure_url.replace('/upload/', '/upload/c_fill,h_200,w_300,f_jpg/');
    }

    return new Response(JSON.stringify({
      success: true,
      file_url: result.secure_url,
      file_type: file.type,
      file_size: result.bytes,
      duration: result.duration || null,
      thumbnail_url: thumbnailUrl,
      public_id: result.public_id,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Cloudinary signature creation
async function createSignature(paramsToSign: string, apiSecret: string): Promise<string> {
  const stringToSign = `${paramsToSign}${apiSecret}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}