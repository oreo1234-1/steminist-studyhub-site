
-- Allow admins to delete resources (for rejection)
CREATE POLICY "Admins can delete resources"
ON public.resources
FOR DELETE
USING (get_current_user_role() = 'admin'::app_role);

-- Allow admins to delete mentor applications (for rejection)
CREATE POLICY "Admins can delete mentors"
ON public.mentors
FOR DELETE
USING (get_current_user_role() = 'admin'::app_role);
