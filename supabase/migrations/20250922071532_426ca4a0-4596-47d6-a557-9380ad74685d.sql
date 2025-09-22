-- Add delete policy for admin users
CREATE POLICY "Admin can delete submissions" ON public.submissions
FOR DELETE USING (true);