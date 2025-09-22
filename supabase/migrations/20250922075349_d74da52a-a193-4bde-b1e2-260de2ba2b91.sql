-- Change default submission status to pending (require manual approval)
ALTER TABLE public.submissions 
ALTER COLUMN status SET DEFAULT 'pending'::text;