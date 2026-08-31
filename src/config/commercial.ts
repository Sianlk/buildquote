export type BuildQuotePlanId = 'free' | 'pro' | 'business' | 'enterprise';

export type CommercialFeature =
  | 'quotes'
  | 'projects'
  | 'ai_estimator'
  | 'cost_benchmarks'
  | 'team_seats'
  | 'client_share_links'
  | 'automations'
  | 'analytics'
  | 'api'
  | 'webhooks'
  | 'white_label'
  | 'priority_support';

export interface PlanDefinition {
  id: BuildQuotePlanId;
  name: string;
  audience: string;
  monthlyPriceGBP: number | null;
  annualPriceGBP: number | null;
  includedSeats: number;
  limits: {
    activeProjects: number | null;
    quotesPerMonth: number | null;
    aiActionsPerMonth: number | null;
  };
  features: readonly CommercialFeature[];
  expansion: readonly ('seat' | 'usage' | 'api' | 'white_label')[];
}

/**
 * Single source of truth for BuildQuote monetisation and entitlements.
 * Prices are product configuration, not payment-provider state. Stripe/product IDs
 * must be supplied by the backend/env and must never be trusted from the client.
 */
export const BUILDQUOTE_PLANS: Record<BuildQuotePlanId, PlanDefinition> = {
  free: {
    id: 'free',
    name: 'Free',
    audience: 'Sole traders evaluating BuildQuote',
    monthlyPriceGBP: 0,
    annualPriceGBP: 0,
    includedSeats: 1,
    limits: { activeProjects: 1, quotesPerMonth: 3, aiActionsPerMonth: 10 },
    features: ['quotes', 'projects', 'client_share_links'],
    expansion: [],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    audience: 'Active trades and contractors',
    monthlyPriceGBP: 39,
    annualPriceGBP: 390,
    includedSeats: 1,
    limits: { activeProjects: 25, quotesPerMonth: 100, aiActionsPerMonth: 500 },
    features: [
      'quotes', 'projects', 'ai_estimator', 'cost_benchmarks',
      'client_share_links', 'automations', 'analytics',
    ],
    expansion: ['usage'],
  },
  business: {
    id: 'business',
    name: 'Business',
    audience: 'Construction teams and growing firms',
    monthlyPriceGBP: 129,
    annualPriceGBP: 1290,
    includedSeats: 5,
    limits: { activeProjects: null, quotesPerMonth: null, aiActionsPerMonth: 3000 },
    features: [
      'quotes', 'projects', 'ai_estimator', 'cost_benchmarks', 'team_seats',
      'client_share_links', 'automations', 'analytics', 'api', 'webhooks',
      'priority_support',
    ],
    expansion: ['seat', 'usage', 'api'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    audience: 'Multi-team contractors, networks and partners',
    monthlyPriceGBP: null,
    annualPriceGBP: null,
    includedSeats: 20,
    limits: { activeProjects: null, quotesPerMonth: null, aiActionsPerMonth: null },
    features: [
      'quotes', 'projects', 'ai_estimator', 'cost_benchmarks', 'team_seats',
      'client_share_links', 'automations', 'analytics', 'api', 'webhooks',
      'white_label', 'priority_support',
    ],
    expansion: ['seat', 'usage', 'api', 'white_label'],
  },
};

export interface EntitlementContext {
  planId: BuildQuotePlanId;
  seatsUsed?: number;
  activeProjects?: number;
  quotesThisMonth?: number;
  aiActionsThisMonth?: number;
}

export function hasFeature(planId: BuildQuotePlanId, feature: CommercialFeature): boolean {
  return BUILDQUOTE_PLANS[planId].features.includes(feature);
}

export function entitlementStatus(
  context: EntitlementContext,
  feature: CommercialFeature,
): { allowed: boolean; reason?: 'feature_not_in_plan' | 'usage_limit_reached' | 'seat_limit_reached' } {
  const plan = BUILDQUOTE_PLANS[context.planId];
  if (!plan.features.includes(feature)) return { allowed: false, reason: 'feature_not_in_plan' };
  if (feature === 'team_seats' && context.seatsUsed != null && context.seatsUsed >= plan.includedSeats) {
    return { allowed: false, reason: 'seat_limit_reached' };
  }
  if (feature === 'quotes' && plan.limits.quotesPerMonth != null && (context.quotesThisMonth ?? 0) >= plan.limits.quotesPerMonth) {
    return { allowed: false, reason: 'usage_limit_reached' };
  }
  if (feature === 'ai_estimator' && plan.limits.aiActionsPerMonth != null && (context.aiActionsThisMonth ?? 0) >= plan.limits.aiActionsPerMonth) {
    return { allowed: false, reason: 'usage_limit_reached' };
  }
  if (feature === 'projects' && plan.limits.activeProjects != null && (context.activeProjects ?? 0) >= plan.limits.activeProjects) {
    return { allowed: false, reason: 'usage_limit_reached' };
  }
  return { allowed: true };
}

/** Privacy-safe aggregate input contract; raw personal/customer content is excluded. */
export interface BenchmarkSignal {
  tradeCategory: string;
  regionCode?: string;
  projectType?: string;
  quotedValueBand?: string;
  accepted?: boolean;
  completionVarianceBand?: string;
  durationBand?: string;
  capturedAt: string;
  schemaVersion: 1;
}

export const COMMERCIAL_ARCHITECTURE = {
  revenueFloorTargetMRRGBP: 100_000,
  wealthEquation: 'Value × Reach × Repeatability × Ownership',
  growthLoops: [
    'shareable quote → client/contractor discovery → signup',
    'more completed jobs → stronger anonymised benchmarks → better estimates → retention',
    'team invitations → seat expansion → embedded workflow',
    'API/partner usage → distribution → recurring usage revenue',
  ] as const,
  proprietarySignals: [
    'quote conversion bands',
    'regional cost benchmarks',
    'job duration variance bands',
    'project outcome feedback',
    'feature-to-retention cohorts',
  ] as const,
} as const;
