// Dynamic Pricing Engine - Jan 2026 UK Construction Rates
// Region-based labour rates, inflation indexing, trade-specific profiles

export const PRICING_VERSION = "2026.01";

// UK Regional Labour Rate Multipliers (BCIS Location Factors Jan 2026)
export const UK_REGIONS = {
  london_central: { name: "Central London", multiplier: 1.35, areaCode: "EC, WC, W1, SW1" },
  london_outer: { name: "Greater London", multiplier: 1.28, areaCode: "E, N, S, SE, SW, NW" },
  south_east: { name: "South East", multiplier: 1.12, areaCode: "RH, TN, ME, CT, BN, GU, PO, SO" },
  south_west: { name: "South West", multiplier: 1.02, areaCode: "BS, BA, EX, PL, TR, DT, TA" },
  east_anglia: { name: "East Anglia", multiplier: 1.00, areaCode: "CB, IP, NR, CO, CM" },
  east_midlands: { name: "East Midlands", multiplier: 0.96, areaCode: "NG, LE, DE, NN" },
  west_midlands: { name: "West Midlands", multiplier: 0.97, areaCode: "B, CV, WV, WS, DY, ST" },
  north_west: { name: "North West", multiplier: 0.94, areaCode: "M, L, WA, CH, PR, LA, CA" },
  yorkshire: { name: "Yorkshire & Humber", multiplier: 0.92, areaCode: "LS, BD, HU, S, DN, HG, YO" },
  north_east: { name: "North East", multiplier: 0.90, areaCode: "NE, DH, SR, TS, DL" },
  scotland_central: { name: "Central Scotland", multiplier: 0.95, areaCode: "G, EH, FK, ML" },
  scotland_other: { name: "Rest of Scotland", multiplier: 0.88, areaCode: "AB, DD, PA, IV, KW" },
  wales: { name: "Wales", multiplier: 0.93, areaCode: "CF, SA, LL, LD, SY, NP" },
  northern_ireland: { name: "Northern Ireland", multiplier: 0.88, areaCode: "BT" },
} as const;

export type UKRegion = keyof typeof UK_REGIONS;

// Inflation Indexing (CPI + Construction Inflation)
export const INFLATION_INDEX = {
  baseYear: 2024,
  currentYear: 2026,
  cpi: 0.035, // 3.5% annual CPI
  constructionInflation: 0.045, // 4.5% construction-specific
  combinedAnnualRate: 0.04, // 4% blended rate
  cumulativeMultiplier: 1.0816, // (1.04)^2 for 2024-2026
};

// Base Trade Labour Rates (Per Hour - Jan 2026 Indexed)
export const BASE_LABOUR_RATES = {
  // Core trades
  groundworker: { rate: 28.50, dayRate: 228, description: "Groundworks & excavation" },
  bricklayer: { rate: 34.00, dayRate: 272, description: "Bricklayer (facing work)" },
  labourer: { rate: 16.50, dayRate: 132, description: "General labourer" },
  hodCarrier: { rate: 18.00, dayRate: 144, description: "Hod carrier / labourer mate" },
  
  // Carpentry
  carpenter1stFix: { rate: 32.00, dayRate: 256, description: "1st fix carpenter" },
  carpenter2ndFix: { rate: 34.00, dayRate: 272, description: "2nd fix carpenter" },
  joiner: { rate: 33.00, dayRate: 264, description: "Bench joiner" },
  
  // Roofing
  rooferTiles: { rate: 31.00, dayRate: 248, description: "Roof tiler" },
  rooferFlat: { rate: 32.00, dayRate: 256, description: "Flat roofer (EPDM/GRP)" },
  leadworker: { rate: 38.00, dayRate: 304, description: "Lead worker" },
  
  // M&E trades
  electrician: { rate: 42.00, dayRate: 336, description: "Electrician (JIB)" },
  electricianMate: { rate: 24.00, dayRate: 192, description: "Electrician's mate" },
  plumber: { rate: 46.00, dayRate: 368, description: "Plumber / Gas safe" },
  heatingEngineer: { rate: 48.00, dayRate: 384, description: "Heating engineer (G3)" },
  hvacEngineer: { rate: 52.00, dayRate: 416, description: "HVAC installer" },
  
  // Finishing trades
  plasterer: { rate: 28.00, dayRate: 224, description: "Plasterer (skim)" },
  plastererRender: { rate: 30.00, dayRate: 240, description: "Renderer (external)" },
  decorator: { rate: 25.00, dayRate: 200, description: "Painter & decorator" },
  tiler: { rate: 31.00, dayRate: 248, description: "Wall & floor tiler" },
  floorer: { rate: 29.00, dayRate: 232, description: "Floor layer" },
  
  // Specialist trades
  steelFixer: { rate: 36.00, dayRate: 288, description: "Steel fixer" },
  scaffolder: { rate: 30.00, dayRate: 240, description: "Scaffolder (CISRS)" },
  glazier: { rate: 34.00, dayRate: 272, description: "Window fitter / glazier" },
  drainageEngineer: { rate: 30.00, dayRate: 240, description: "Drainage engineer" },
  kitchenFitter: { rate: 32.00, dayRate: 256, description: "Kitchen fitter" },
  bathroomFitter: { rate: 34.00, dayRate: 272, description: "Bathroom fitter" },
  
  // Renewables specialists
  solarInstaller: { rate: 38.00, dayRate: 304, description: "Solar PV installer (MCS)" },
  heatPumpEngineer: { rate: 55.00, dayRate: 440, description: "Heat pump engineer (MCS)" },
  evChargerInstaller: { rate: 42.00, dayRate: 336, description: "EV charger installer" },
} as const;

export type TradeType = keyof typeof BASE_LABOUR_RATES;

// Pricing Profiles (Tiered by project type)
export const PRICING_PROFILES = {
  residential: {
    name: "Residential",
    description: "Private homeowner projects",
    marginDefault: 0.20,
    markupRange: { min: 0.15, max: 0.30 },
    overheadRate: 0.12,
    contingency: 0.10,
  },
  commercial: {
    name: "Commercial",
    description: "Commercial & office projects",
    marginDefault: 0.18,
    markupRange: { min: 0.12, max: 0.25 },
    overheadRate: 0.15,
    contingency: 0.08,
  },
  developer: {
    name: "Developer",
    description: "Volume developer pricing",
    marginDefault: 0.12,
    markupRange: { min: 0.08, max: 0.18 },
    overheadRate: 0.10,
    contingency: 0.05,
  },
  socialHousing: {
    name: "Social Housing",
    description: "Housing association & council",
    marginDefault: 0.10,
    markupRange: { min: 0.08, max: 0.15 },
    overheadRate: 0.10,
    contingency: 0.05,
  },
  retrofit: {
    name: "Retrofit / EPC Upgrade",
    description: "Energy efficiency improvements",
    marginDefault: 0.15,
    markupRange: { min: 0.10, max: 0.22 },
    overheadRate: 0.10,
    contingency: 0.08,
  },
} as const;

export type PricingProfile = keyof typeof PRICING_PROFILES;

// User override settings
export interface PricingOverrides {
  labourRateMultiplier?: number;
  materialMarkup?: number;
  profitMargin?: number;
  overheadAbsorption?: number;
  vatRegistered?: boolean;
  cisDeduction?: boolean;
}

// Calculate regional labour rate
export function getRegionalLabourRate(
  trade: TradeType,
  region: UKRegion,
  pricingType: "trade" | "retail" = "retail"
): number {
  const baseRate = BASE_LABOUR_RATES[trade].rate;
  const regionMultiplier = UK_REGIONS[region].multiplier;
  const tradePremium = pricingType === "retail" ? 1.18 : 1.0;
  
  return Math.round(baseRate * regionMultiplier * tradePremium * 100) / 100;
}

// Calculate project cost with all factors
export function calculateProjectCost(params: {
  baseCost: number;
  region: UKRegion;
  profile: PricingProfile;
  overrides?: PricingOverrides;
}): {
  baseCost: number;
  regionalAdjustment: number;
  overheads: number;
  profit: number;
  contingency: number;
  subtotal: number;
  vat: number;
  total: number;
} {
  const { baseCost, region, profile, overrides = {} } = params;
  const profileConfig = PRICING_PROFILES[profile];
  const regionMultiplier = UK_REGIONS[region].multiplier;

  // Apply regional adjustment
  const regionalAdjustment = baseCost * (regionMultiplier - 1);
  const adjustedBase = baseCost + regionalAdjustment;

  // Overheads
  const overheadRate = overrides.overheadAbsorption ?? profileConfig.overheadRate;
  const overheads = adjustedBase * overheadRate;

  // Profit margin
  const marginRate = overrides.profitMargin ?? profileConfig.marginDefault;
  const profit = (adjustedBase + overheads) * marginRate;

  // Contingency
  const contingency = adjustedBase * profileConfig.contingency;

  // Subtotal (ex VAT)
  const subtotal = adjustedBase + overheads + profit + contingency;

  // VAT (if applicable)
  const vatRate = overrides.vatRegistered !== false ? 0.20 : 0;
  const vat = subtotal * vatRate;

  return {
    baseCost,
    regionalAdjustment: Math.round(regionalAdjustment),
    overheads: Math.round(overheads),
    profit: Math.round(profit),
    contingency: Math.round(contingency),
    subtotal: Math.round(subtotal),
    vat: Math.round(vat),
    total: Math.round(subtotal + vat),
  };
}

// Get postcode region
export function getRegionFromPostcode(postcode: string): UKRegion {
  const prefix = postcode.toUpperCase().replace(/\s/g, "").slice(0, 2);
  
  // Central London
  if (["EC", "WC"].includes(prefix) || prefix.startsWith("W1") || prefix.startsWith("SW1")) {
    return "london_central";
  }
  
  // Greater London
  const londonPrefixes = ["E", "N", "S", "SE", "SW", "NW", "W"];
  if (londonPrefixes.some(p => prefix.startsWith(p) && prefix.length <= 3)) {
    return "london_outer";
  }
  
  // South East
  const sePrefixes = ["RH", "TN", "ME", "CT", "BN", "GU", "PO", "SO", "HP", "SL", "OX", "MK"];
  if (sePrefixes.some(p => prefix.startsWith(p))) return "south_east";
  
  // South West
  const swPrefixes = ["BS", "BA", "EX", "PL", "TR", "DT", "TA", "GL", "SP", "BH"];
  if (swPrefixes.some(p => prefix.startsWith(p))) return "south_west";
  
  // East Anglia
  const eaPrefixes = ["CB", "IP", "NR", "CO", "CM", "PE", "LU", "SG"];
  if (eaPrefixes.some(p => prefix.startsWith(p))) return "east_anglia";
  
  // East Midlands
  const emPrefixes = ["NG", "LE", "DE", "NN", "LN"];
  if (emPrefixes.some(p => prefix.startsWith(p))) return "east_midlands";
  
  // West Midlands
  const wmPrefixes = ["B", "CV", "WV", "WS", "DY", "ST", "WR", "HR"];
  if (wmPrefixes.some(p => prefix === p || prefix.startsWith(p))) return "west_midlands";
  
  // North West
  const nwPrefixes = ["M", "L", "WA", "CH", "PR", "LA", "CA", "CW", "SK", "OL", "BL", "WN"];
  if (nwPrefixes.some(p => prefix === p || prefix.startsWith(p))) return "north_west";
  
  // Yorkshire
  const yPrefixes = ["LS", "BD", "HU", "S", "DN", "HG", "YO", "WF", "HX", "HD"];
  if (yPrefixes.some(p => prefix === p || prefix.startsWith(p))) return "yorkshire";
  
  // North East
  const nePrefixes = ["NE", "DH", "SR", "TS", "DL"];
  if (nePrefixes.some(p => prefix.startsWith(p))) return "north_east";
  
  // Scotland
  const scotlandCentral = ["G", "EH", "FK", "ML", "KA", "PA"];
  if (scotlandCentral.some(p => prefix === p || prefix.startsWith(p))) return "scotland_central";
  
  const scotlandOther = ["AB", "DD", "IV", "KW", "PH", "KY"];
  if (scotlandOther.some(p => prefix.startsWith(p))) return "scotland_other";
  
  // Wales
  const walesPrefixes = ["CF", "SA", "LL", "LD", "SY", "NP"];
  if (walesPrefixes.some(p => prefix.startsWith(p))) return "wales";
  
  // Northern Ireland
  if (prefix.startsWith("BT")) return "northern_ireland";
  
  // Default to East Anglia (UK average)
  return "east_anglia";
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
