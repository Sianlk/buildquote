CREATE TABLE public.job_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.marketplace_jobs(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL DEFAULT auth.uid(),
  recipient_id uuid NOT NULL,
  body text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX job_messages_job_idx ON public.job_messages(job_id, created_at);
GRANT SELECT, INSERT, UPDATE ON public.job_messages TO authenticated;
GRANT ALL ON public.job_messages TO service_role;
ALTER TABLE public.job_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants read messages" ON public.job_messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Send messages about a job" ON public.job_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = sender_id AND sender_id <> recipient_id AND EXISTS (
    SELECT 1 FROM public.marketplace_jobs j WHERE j.id = job_id AND (j.customer_id = auth.uid() OR j.customer_id = recipient_id)));
CREATE POLICY "Recipient marks read" ON public.job_messages FOR UPDATE TO authenticated USING (auth.uid() = recipient_id);

CREATE POLICY "Job owners update quote status" ON public.job_quotes FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.marketplace_jobs j WHERE j.id = job_quotes.job_id AND j.customer_id = auth.uid()));

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS estimator_rates jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.protect_profile_billing()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    NEW.subscription_tier := OLD.subscription_tier;
    NEW.credits_remaining := OLD.credits_remaining;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER protect_profile_billing BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.protect_profile_billing();