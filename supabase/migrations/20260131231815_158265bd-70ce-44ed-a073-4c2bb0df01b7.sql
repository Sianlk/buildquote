-- Trade Marketplace Module
-- Job posting, trade finder, verification, and reviews

-- Trade profiles for marketplace
CREATE TABLE public.trade_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  trade_type TEXT NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  hourly_rate NUMERIC,
  day_rate NUMERIC,
  experience_years INTEGER,
  qualifications TEXT[],
  service_areas TEXT[],
  insurance_valid_until DATE,
  gas_safe_number TEXT,
  niceic_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  profile_image_url TEXT,
  portfolio_images TEXT[],
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  average_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trade_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for trade profiles
CREATE POLICY "Anyone can view verified trade profiles"
ON public.trade_profiles FOR SELECT
USING (is_verified = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own trade profile"
ON public.trade_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trade profile"
ON public.trade_profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trade profile"
ON public.trade_profiles FOR DELETE
USING (auth.uid() = user_id);

-- Customer job postings
CREATE TABLE public.marketplace_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  trade_required TEXT NOT NULL,
  job_type TEXT NOT NULL,
  budget_min NUMERIC,
  budget_max NUMERIC,
  location TEXT NOT NULL,
  postcode TEXT,
  urgency TEXT DEFAULT 'normal',
  preferred_start_date DATE,
  images TEXT[],
  status TEXT DEFAULT 'open',
  selected_trade_id UUID REFERENCES public.trade_profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- Enable RLS
ALTER TABLE public.marketplace_jobs ENABLE ROW LEVEL SECURITY;

-- Policies for marketplace jobs
CREATE POLICY "Anyone can view open jobs"
ON public.marketplace_jobs FOR SELECT
USING (status = 'open' OR auth.uid() = customer_id);

CREATE POLICY "Users can create job postings"
ON public.marketplace_jobs FOR INSERT
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own job postings"
ON public.marketplace_jobs FOR UPDATE
USING (auth.uid() = customer_id);

CREATE POLICY "Users can delete own job postings"
ON public.marketplace_jobs FOR DELETE
USING (auth.uid() = customer_id);

-- Job quotes/applications from trades
CREATE TABLE public.job_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES public.marketplace_jobs(id) ON DELETE CASCADE,
  trade_profile_id UUID NOT NULL REFERENCES public.trade_profiles(id) ON DELETE CASCADE,
  quote_amount NUMERIC NOT NULL,
  message TEXT,
  estimated_duration TEXT,
  available_start_date DATE,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_quotes ENABLE ROW LEVEL SECURITY;

-- Policies for job quotes
CREATE POLICY "Job owners and quote creators can view quotes"
ON public.job_quotes FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.marketplace_jobs 
    WHERE id = job_quotes.job_id AND customer_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.trade_profiles 
    WHERE id = job_quotes.trade_profile_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Trades can create quotes"
ON public.job_quotes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.trade_profiles 
    WHERE id = job_quotes.trade_profile_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Trades can update own quotes"
ON public.job_quotes FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.trade_profiles 
    WHERE id = job_quotes.trade_profile_id AND user_id = auth.uid()
  )
);

-- Reviews and ratings
CREATE TABLE public.trade_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trade_profile_id UUID NOT NULL REFERENCES public.trade_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  job_id UUID REFERENCES public.marketplace_jobs(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  workmanship_rating INTEGER CHECK (workmanship_rating >= 1 AND workmanship_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  would_recommend BOOLEAN DEFAULT true,
  images TEXT[],
  trade_response TEXT,
  is_verified_job BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trade_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for reviews
CREATE POLICY "Anyone can view reviews"
ON public.trade_reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews"
ON public.trade_reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
ON public.trade_reviews FOR UPDATE
USING (auth.uid() = reviewer_id);

-- Function to update trade profile ratings
CREATE OR REPLACE FUNCTION update_trade_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.trade_profiles
  SET 
    average_rating = (
      SELECT COALESCE(AVG(rating), 0) 
      FROM public.trade_reviews 
      WHERE trade_profile_id = NEW.trade_profile_id
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.trade_reviews 
      WHERE trade_profile_id = NEW.trade_profile_id
    ),
    updated_at = now()
  WHERE id = NEW.trade_profile_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update ratings
CREATE TRIGGER update_trade_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.trade_reviews
FOR EACH ROW EXECUTE FUNCTION update_trade_rating();