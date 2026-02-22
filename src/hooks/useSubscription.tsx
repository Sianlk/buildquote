import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export type SubscriptionTier = "free" | "pro" | "business" | "enterprise";

interface SubscriptionState {
  tier: SubscriptionTier;
  loading: boolean;
  isSubscribed: boolean;
  /** Number of PDF downloads used this month (free tier limit = 2) */
  downloadsUsed: number;
  canDownload: boolean;
  canAccessMarketplaceJobs: boolean;
  canPostMarketplaceJobs: boolean;
  canUseBrandedExports: boolean;
  incrementDownload: () => void;
}

const FREE_DOWNLOAD_LIMIT = 2;

export function useSubscription(): SubscriptionState {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [loading, setLoading] = useState(true);
  const [downloadsUsed, setDownloadsUsed] = useState(0);

  useEffect(() => {
    if (!user) {
      setTier("free");
      setLoading(false);
      return;
    }

    const fetchTier = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("user_id", user.id)
        .single();

      setTier((data?.subscription_tier as SubscriptionTier) ?? "free");
      setLoading(false);
    };

    fetchTier();

    // Load download count from localStorage (resets monthly)
    const monthKey = `dl_count_${user.id}_${new Date().toISOString().slice(0, 7)}`;
    const stored = localStorage.getItem(monthKey);
    setDownloadsUsed(stored ? parseInt(stored, 10) : 0);
  }, [user]);

  const isSubscribed = tier !== "free";

  const canDownload = isSubscribed || downloadsUsed < FREE_DOWNLOAD_LIMIT;
  const canAccessMarketplaceJobs = true; // everyone can browse
  const canPostMarketplaceJobs = isSubscribed;
  const canUseBrandedExports = isSubscribed;

  const incrementDownload = () => {
    if (!user) return;
    const monthKey = `dl_count_${user.id}_${new Date().toISOString().slice(0, 7)}`;
    const newCount = downloadsUsed + 1;
    setDownloadsUsed(newCount);
    localStorage.setItem(monthKey, String(newCount));
  };

  return {
    tier,
    loading,
    isSubscribed,
    downloadsUsed,
    canDownload,
    canAccessMarketplaceJobs,
    canPostMarketplaceJobs,
    canUseBrandedExports,
    incrementDownload,
  };
}
