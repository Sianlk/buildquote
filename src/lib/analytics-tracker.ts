// Analytics & Audit Trail Engine
// Tracks key user actions and pricing/compliance audit events
// Stores locally and syncs to Supabase when authenticated

import { supabase } from "@/integrations/supabase/client";

export type TrackableEvent =
  | "project_created"
  | "quote_generated"
  | "quote_exported"
  | "compliance_run"
  | "invoice_created"
  | "app_installed"
  | "pricing_override"
  | "schedule_generated"
  | "bom_generated"
  | "marketplace_job_posted"
  | "marketplace_bid_submitted"
  | "trade_profile_created"
  | "material_order_created"
  | "receipt_uploaded"
  | "tax_return_created";

export interface AuditEntry {
  event: TrackableEvent;
  timestamp: string;
  metadata?: Record<string, any>;
  datasetVersion?: string;
  entityId?: string;
  entityType?: string;
}

// In-memory buffer for batch sync
let eventBuffer: AuditEntry[] = [];

export async function trackEvent(
  event: TrackableEvent,
  metadata?: Record<string, any>,
  entityId?: string,
  entityType?: string
) {
  const entry: AuditEntry = {
    event,
    timestamp: new Date().toISOString(),
    metadata,
    datasetVersion: "2026.02",
    entityId,
    entityType,
  };

  eventBuffer.push(entry);

  // Try to persist to audit_logs if authenticated
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: event,
        entity_id: entityId || null,
        entity_type: entityType || null,
        new_values: metadata ? metadata as any : null,
      });
    }
  } catch {
    // Silently fail - events are buffered locally
  }
}

export function getEventBuffer(): AuditEntry[] {
  return [...eventBuffer];
}

export function clearEventBuffer() {
  eventBuffer = [];
}

// Track meaningful user action count for PWA prompt
let meaningfulActions = 0;

export function trackMeaningfulAction() {
  meaningfulActions++;
  try {
    sessionStorage.setItem("bq-meaningful-actions", String(meaningfulActions));
  } catch {}
}

export function getMeaningfulActionCount(): number {
  try {
    return parseInt(sessionStorage.getItem("bq-meaningful-actions") || "0", 10);
  } catch {
    return meaningfulActions;
  }
}
