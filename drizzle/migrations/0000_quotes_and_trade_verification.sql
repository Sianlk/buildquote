CREATE TABLE public.quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  quote_number text NOT NULL,
  customer_name text NOT NULL DEFAULT '',
  customer_address text DEFAULT '',
  customer_email text DEFAULT '',
  customer_phone text DEFAULT '',
  project_description text DEFAULT '',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  vat_rate numeric NOT NULL DEFAULT 20,
  vat_amount numeric NOT NULL DEFAULT 0,
  cis_rate numeric NOT NULL DEFAULT 0,
  cis_amount numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  valid_until date,
  invoice_number text,
  invoiced_at timestamptz,
  due_date date,
  paid_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quotes TO authenticated;
GRANT ALL ON public.quotes TO service_role;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own quotes select" ON public.quotes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own quotes insert" ON public.quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own quotes update" ON public.quotes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own quotes delete" ON public.quotes FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.trade_profiles
  ADD COLUMN IF NOT EXISTS vat_number text,
  ADD COLUMN IF NOT EXISTS company_number text,
  ADD COLUMN IF NOT EXISTS public_liability_cover numeric,
  ADD COLUMN IF NOT EXISTS verification_status text NOT NULL DEFAULT 'unverified';

CREATE TABLE public.trade_verification_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  trade_profile_id uuid NOT NULL REFERENCES public.trade_profiles(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  reference_number text,
  expires_on date,
  file_path text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewer_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trade_verification_documents TO authenticated;
GRANT ALL ON public.trade_verification_documents TO service_role;
ALTER TABLE public.trade_verification_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner or admin view docs" ON public.trade_verification_documents FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owner add docs" ON public.trade_verification_documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Owner delete pending docs" ON public.trade_verification_documents FOR DELETE TO authenticated USING (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Admin review docs" ON public.trade_verification_documents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.protect_trade_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.is_verified := false; NEW.verification_date := NULL; NEW.verification_status := 'unverified';
    ELSE
      NEW.is_verified := OLD.is_verified; NEW.verification_date := OLD.verification_date;
      IF NEW.verification_status <> 'pending' OR OLD.verification_status = 'approved' THEN
        NEW.verification_status := OLD.verification_status;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER protect_trade_verification BEFORE INSERT OR UPDATE ON public.trade_profiles FOR EACH ROW EXECUTE FUNCTION public.protect_trade_verification();

CREATE POLICY "Admins view all trade profiles" ON public.trade_profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update trade profiles" ON public.trade_profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Trade docs owner upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'trade-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "Trade docs owner or admin read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'trade-documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "Trade docs owner delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'trade-documents' AND (storage.foldername(name))[1] = auth.uid()::text);