-- Fix audit log insert policy to be more secure
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

CREATE POLICY "Authenticated users can insert audit logs" ON public.audit_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);