-- Create the submissions table for birthday wishes
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('video', 'photo', 'post', 'voice', 'text')),
  name TEXT NOT NULL,
  message TEXT,
  url TEXT,
  provider TEXT CHECK (provider IN ('youtube', 'vimeo', 'instagram', 'facebook', 'drive', 'soundcloud', 'direct', 'vocaroo', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  org TEXT,
  city TEXT,
  contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Policy for public users to insert their own submissions
CREATE POLICY "Users can create submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (true);

-- Policy for public to view only approved submissions
CREATE POLICY "Public can view approved submissions" 
ON public.submissions 
FOR SELECT 
USING (status = 'approved');

-- Policy for admin users to view all submissions (we'll implement admin auth later)
CREATE POLICY "Admin can view all submissions" 
ON public.submissions 
FOR SELECT 
USING (true);

-- Policy for admin users to update submissions (approve/reject)
CREATE POLICY "Admin can update submissions" 
ON public.submissions 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance on status queries
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_created_at ON public.submissions(created_at DESC);