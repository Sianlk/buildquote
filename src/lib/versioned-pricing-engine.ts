// Versioned Pricing Engine - Immutable dataset snapshots for UK construction pricing
// Region auto-detection, rate formula, override system, audit trail

import { UK_REGIONS, UKRegion, getRegionFromPostcode, PRICING_PROFILES, PricingProfile } from "./dynamic-pricing-engine";

export const PRICING_DATASET_VERSION = "2026.02";

export interface PricingDataset {
  id: string;
  region: UKRegion;
  effectiveFrom: string;
  versionLabel: string;
  onsConstructionIndex: number;
  labourIndex: number;
  materialIndex: number;
  energyIndex: number;
  sourceNote: string;
}

export interface PricingItem {
  id: string;
  tradeCategory: string;
  description: string;
  unit: string;
  baseRate: number;
  coverageRate: number; // units per day
  wasteFactor: number;
  productivityRate: number;
  defaultSuppliers: string[];
  bulkDiscountThreshold: number;
  leadTimeDays: number;
}

export interface WorkspaceRateOverride {
  pricingItemId: string;
  customBaseRate?: number;
  overheadPercent: number;
  profitPercent: number;
  burdenPercent: number;
  travelCost: number;
  minimumCharge: number;
  source: "system" | "override" | "manual";
}

// Current UK regional datasets (Feb 2026)
export const REGIONAL_DATASETS: PricingDataset[] = Object.entries(UK_REGIONS).map(([key, val]) => ({
  id: `ds-${key}-2026.02`,
  region: key as UKRegion,
  effectiveFrom: "2026-02-01",
  versionLabel: PRICING_DATASET_VERSION,
  onsConstructionIndex: 1.045, // ONS Construction Output Price Index Q4 2025
  labourIndex: 1.038,
  materialIndex: 1.052,
  energyIndex: 1.062,
  sourceNote: `BCIS Location Factor ${val.name} - Jan 2026`
}));

// Rate formula implementation
export function calculateFinalRate(params: {
  baseRate: number;
  region: UKRegion;
  burdenPercent?: number;
  difficultyMultiplier?: number;
  overheadPercent?: number;
  profitPercent?: number;
  override?: WorkspaceRateOverride;
}): { rate: number; source: string; datasetVersion: string } {
  const {
    baseRate,
    region,
    burdenPercent = 0.12,
    difficultyMultiplier = 1.0,
    overheadPercent = 0.12,
    profitPercent = 0.15,
    override,
  } = params;

  const regionMultiplier = UK_REGIONS[region].multiplier;
  const onsIndex = 1.045; // Current ONS Construction Index

  const effectiveBase = override?.customBaseRate ?? baseRate;
  const effectiveBurden = override?.burdenPercent ?? burdenPercent;
  const effectiveOverhead = override?.overheadPercent ?? overheadPercent;
  const effectiveProfit = override?.profitPercent ?? profitPercent;

  const withBurden = effectiveBase * (1 + effectiveBurden);
  const regional = withBurden * regionMultiplier * onsIndex * difficultyMultiplier;
  const withOverhead = regional * (1 + effectiveOverhead);
  const final = withOverhead * (1 + effectiveProfit);

  const travelAdj = override?.travelCost ?? 0;
  const rate = Math.max(final + travelAdj, override?.minimumCharge ?? 0);

  return {
    rate: Math.round(rate * 100) / 100,
    source: override?.customBaseRate ? "override" : "system",
    datasetVersion: PRICING_DATASET_VERSION,
  };
}

// Snapshot quote pricing at creation time
export interface QuotePricingSnapshot {
  datasetVersion: string;
  region: UKRegion;
  regionMultiplier: number;
  onsIndex: number;
  createdAt: string;
  overrides: WorkspaceRateOverride[];
  profile: PricingProfile;
}

export function createQuotePricingSnapshot(
  region: UKRegion,
  profile: PricingProfile,
  overrides: WorkspaceRateOverride[] = []
): QuotePricingSnapshot {
  return {
    datasetVersion: PRICING_DATASET_VERSION,
    region,
    regionMultiplier: UK_REGIONS[region].multiplier,
    onsIndex: 1.045,
    createdAt: new Date().toISOString(),
    overrides,
    profile,
  };
}

// Auto-detect region from postcode
export function autoDetectRegion(postcode: string): { region: UKRegion; name: string; multiplier: number } {
  const region = getRegionFromPostcode(postcode);
  const info = UK_REGIONS[region];
  return { region, name: info.name, multiplier: info.multiplier };
}
