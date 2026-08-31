// Analytics Service — BuildQuote
import { Platform } from 'react-native';

type EventProperties = Record<string, string | number | boolean | null>;

const queue: Array<{name:string; props:EventProperties; ts:number}> = [];
let timer: ReturnType<typeof setTimeout> | null = null;

export type GrowthStage = 'acquisition' | 'activation' | 'revenue' | 'retention' | 'referral' | 'expansion';

export function track(name: string, props?: EventProperties): void {
  queue.push({
    name,
    props: {
      ...props,
      platform: Platform.OS,
      app: 'BuildQuote',
      domain: 'construction',
      event_schema_version: 2,
      ts: Date.now(),
    },
    ts: Date.now(),
  });
  if (queue.length >= 30) flush();
  else if (!timer) timer = setTimeout(flush, 5000);
}

async function flush(): Promise<void> {
  if (timer) { clearTimeout(timer); timer = null; }
  if (!queue.length) return;
  const batch = queue.splice(0);
  try {
    await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/analytics/batch`, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ events: batch }),
    });
  } catch {
    // Analytics must never block a production workflow. The backend can add
    // durable/retry transport without changing callers.
  }
}

function growth(stage: GrowthStage, action: string, props?: EventProperties): void {
  track(`growth_${stage}`, { action, ...props });
}

export const Analytics = {
  screen: (name: string, p?: EventProperties) => track('screen_view', { screen_name: name, ...p }),
  appOpened: (authenticated: boolean) => growth('retention', 'app_opened', { authenticated }),
  acquired: (source: string, campaign?: string, referralCode?: string) => growth('acquisition', 'visit_attributed', {
    source,
    campaign: campaign ?? '',
    referral_code: referralCode ?? '',
  }),
  activated: (milestone: 'first_project' | 'first_quote' | 'first_share' | 'first_ai_estimate') => growth('activation', milestone),
  checkoutStarted: (plan: string, interval: 'month' | 'year') => growth('revenue', 'checkout_started', { plan, interval }),
  subscriptionChanged: (fromPlan: string, toPlan: string, change: 'upgrade' | 'downgrade' | 'reactivate' | 'cancel') =>
    growth(change === 'upgrade' ? 'expansion' : 'revenue', 'subscription_changed', { from_plan: fromPlan, to_plan: toPlan, change }),
  usageLimitReached: (feature: string, plan: string) => growth('expansion', 'usage_limit_reached', { feature, plan }),
  seatInvited: (plan: string) => growth('expansion', 'seat_invited', { plan }),
  sharedOutput: (kind: 'quote' | 'project' | 'report', channel?: string) => growth('referral', 'output_shared', { kind, channel: channel ?? '' }),
  referralConverted: (referralCode: string) => growth('referral', 'referral_converted', { referral_code: referralCode }),
  projectOutcomeCaptured: (accepted: boolean, hasVarianceData: boolean) => track('proprietary_signal_captured', {
    signal: 'project_outcome', accepted, has_variance_data: hasVarianceData,
  }),
  aiQuery: (q: string, domain: string, ms?: number) => track('ai_query', { query: q.slice(0,100), domain, ms: ms??0 }),
  aiResponse: (ok: boolean, model: string, tokens?: number) => track('ai_response', { ok, model, tokens: tokens??0 }),
  agentTask: (type: string, ok: boolean, ms?: number) => track('agent_task', { type, ok, ms: ms??0 }),
  login: (method: string) => track('login', { method }),
  logout: () => track('logout'),
  featureUsed: (f: string, p?: EventProperties) => track('feature_used', { feature: f, ...p }),
  error: (code: string, msg: string, screen?: string) => track('app_error', { code, msg: msg.slice(0,200), screen: screen??'' }),
};

export default Analytics;
