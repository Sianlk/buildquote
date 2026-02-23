-- Fix: Restrict trade reviews to authenticated users only
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.trade_reviews;

CREATE POLICY "Authenticated users can view reviews"
ON public.trade_reviews FOR SELECT
USING (auth.role() = 'authenticated');
