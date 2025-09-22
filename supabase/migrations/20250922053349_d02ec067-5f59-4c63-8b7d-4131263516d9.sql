-- Add new columns for file uploads to submissions table
ALTER TABLE public.submissions 
ADD COLUMN file_url TEXT,
ADD COLUMN file_type TEXT,
ADD COLUMN file_size INTEGER,
ADD COLUMN duration INTEGER,
ADD COLUMN thumbnail_url TEXT;

-- Add comment to clarify the purpose of new columns
COMMENT ON COLUMN public.submissions.file_url IS 'Cloudinary URL for uploaded files (videos, audio, images)';
COMMENT ON COLUMN public.submissions.file_type IS 'MIME type of uploaded file (e.g., video/mp4, audio/mp3, image/jpeg)';
COMMENT ON COLUMN public.submissions.file_size IS 'File size in bytes';
COMMENT ON COLUMN public.submissions.duration IS 'Duration in seconds for audio/video files';
COMMENT ON COLUMN public.submissions.thumbnail_url IS 'Thumbnail URL for video files';