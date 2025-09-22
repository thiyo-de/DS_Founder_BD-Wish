-- Fix the check constraint issue by dropping the old constraint and creating a proper one
ALTER TABLE submissions DROP CONSTRAINT IF EXISTS submissions_type_check;

-- Add the correct check constraint for the type field
ALTER TABLE submissions ADD CONSTRAINT submissions_type_check 
CHECK (type IN ('video', 'audio', 'image', 'text'));

-- Set default status to approved for immediate visibility (as requested)
ALTER TABLE submissions ALTER COLUMN status SET DEFAULT 'approved';