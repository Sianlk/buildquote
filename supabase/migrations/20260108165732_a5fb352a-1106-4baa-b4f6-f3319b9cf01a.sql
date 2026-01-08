
-- Create trade jobs table for tracking individual trade work
CREATE TABLE public.trade_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trade TEXT NOT NULL,
  job_type TEXT NOT NULL,
  job_description TEXT,
  customer_name TEXT,
  customer_address TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  materials JSONB DEFAULT '[]'::jsonb,
  labour_hours NUMERIC DEFAULT 0,
  labour_rate NUMERIC DEFAULT 0,
  materials_cost NUMERIC DEFAULT 0,
  total_cost NUMERIC DEFAULT 0,
  customer_price NUMERIC DEFAULT 0,
  profit_margin NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'quoted',
  job_date DATE,
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trade receipts table for digital receipt records
CREATE TABLE public.trade_receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  job_id UUID REFERENCES public.trade_jobs(id) ON DELETE SET NULL,
  receipt_type TEXT NOT NULL DEFAULT 'expense',
  category TEXT NOT NULL,
  supplier TEXT,
  description TEXT NOT NULL,
  net_amount NUMERIC NOT NULL,
  vat_amount NUMERIC DEFAULT 0,
  gross_amount NUMERIC NOT NULL,
  receipt_date DATE NOT NULL,
  payment_method TEXT,
  receipt_image_url TEXT,
  is_claimable BOOLEAN DEFAULT true,
  tax_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tax records table for tax return tracking
CREATE TABLE public.tax_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tax_year TEXT NOT NULL,
  total_income NUMERIC DEFAULT 0,
  total_expenses NUMERIC DEFAULT 0,
  total_vat_collected NUMERIC DEFAULT 0,
  total_vat_paid NUMERIC DEFAULT 0,
  vat_liability NUMERIC DEFAULT 0,
  profit NUMERIC DEFAULT 0,
  tax_due_estimate NUMERIC DEFAULT 0,
  national_insurance NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.trade_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trade_jobs
CREATE POLICY "Users can view their own trade jobs" ON public.trade_jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own trade jobs" ON public.trade_jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own trade jobs" ON public.trade_jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own trade jobs" ON public.trade_jobs FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for trade_receipts
CREATE POLICY "Users can view their own receipts" ON public.trade_receipts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own receipts" ON public.trade_receipts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own receipts" ON public.trade_receipts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own receipts" ON public.trade_receipts FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for tax_records
CREATE POLICY "Users can view their own tax records" ON public.tax_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own tax records" ON public.tax_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own tax records" ON public.tax_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own tax records" ON public.tax_records FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_trade_jobs_updated_at BEFORE UPDATE ON public.trade_jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tax_records_updated_at BEFORE UPDATE ON public.tax_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
