// Renewables Module - Solar, Heat Pumps, EPC Pathways (Jan 2026)
// EPC compliance logic and green finance integration

export const RENEWABLES_VERSION = "2026.01";

// EPC Bands and SAP Ratings
export const EPC_BANDS = {
  A: { min: 92, max: 100, color: "#00A651" },
  B: { min: 81, max: 91, color: "#4CB848" },
  C: { min: 69, max: 80, color: "#8DC63F" },
  D: { min: 55, max: 68, color: "#FFC20E" },
  E: { min: 39, max: 54, color: "#F7931D" },
  F: { min: 21, max: 38, color: "#ED1C24" },
  G: { min: 1, max: 20, color: "#BE1E2D" },
} as const;

export type EPCBand = keyof typeof EPC_BANDS;

// Renewable Technology Types
export interface RenewableTechnology {
  id: string;
  name: string;
  category: "generation" | "heating" | "storage" | "efficiency";
  description: string;
  typicalCost: { min: number; max: number };
  installDays: number;
  sapImpact: { min: number; max: number }; // SAP points improvement
  annualSaving: { min: number; max: number }; // £/year
  carbonSaving: number; // kgCO2/year
  paybackYears: { min: number; max: number };
  mcsRequired: boolean;
  buildingRegs: string[];
  grants: string[];
}

export const RENEWABLE_TECHNOLOGIES: Record<string, RenewableTechnology> = {
  // Solar PV Systems
  solar_pv_3kw: {
    id: "solar_pv_3kw",
    name: "Solar PV System (3kWp)",
    category: "generation",
    description: "10-12 panels, suitable for 2-3 bed property. South-facing roof ideal.",
    typicalCost: { min: 5500, max: 7000 },
    installDays: 2,
    sapImpact: { min: 8, max: 12 },
    annualSaving: { min: 400, max: 550 },
    carbonSaving: 1200,
    paybackYears: { min: 8, max: 12 },
    mcsRequired: true,
    buildingRegs: ["Part L", "Part P"],
    grants: ["ECO4", "SEG"],
  },
  solar_pv_4kw: {
    id: "solar_pv_4kw",
    name: "Solar PV System (4kWp)",
    category: "generation",
    description: "14-16 panels, suitable for 3-4 bed property. Most popular size.",
    typicalCost: { min: 6500, max: 8500 },
    installDays: 2,
    sapImpact: { min: 10, max: 15 },
    annualSaving: { min: 550, max: 750 },
    carbonSaving: 1600,
    paybackYears: { min: 7, max: 11 },
    mcsRequired: true,
    buildingRegs: ["Part L", "Part P"],
    grants: ["ECO4", "SEG"],
  },
  solar_pv_6kw: {
    id: "solar_pv_6kw",
    name: "Solar PV System (6kWp)",
    category: "generation",
    description: "20-24 panels, suitable for 4-5 bed property or with EV charging.",
    typicalCost: { min: 9000, max: 12000 },
    installDays: 3,
    sapImpact: { min: 12, max: 18 },
    annualSaving: { min: 750, max: 1000 },
    carbonSaving: 2400,
    paybackYears: { min: 7, max: 10 },
    mcsRequired: true,
    buildingRegs: ["Part L", "Part P"],
    grants: ["ECO4", "SEG"],
  },

  // Battery Storage
  battery_5kwh: {
    id: "battery_5kwh",
    name: "Battery Storage (5kWh)",
    category: "storage",
    description: "Store excess solar for evening use. Approx 4-5 hours backup.",
    typicalCost: { min: 3500, max: 5000 },
    installDays: 1,
    sapImpact: { min: 2, max: 4 },
    annualSaving: { min: 150, max: 250 },
    carbonSaving: 200,
    paybackYears: { min: 10, max: 15 },
    mcsRequired: false,
    buildingRegs: ["Part P"],
    grants: [],
  },
  battery_10kwh: {
    id: "battery_10kwh",
    name: "Battery Storage (10kWh)",
    category: "storage",
    description: "Larger storage for whole-home backup. Powers essentials overnight.",
    typicalCost: { min: 6000, max: 8500 },
    installDays: 1,
    sapImpact: { min: 3, max: 6 },
    annualSaving: { min: 300, max: 450 },
    carbonSaving: 350,
    paybackYears: { min: 10, max: 14 },
    mcsRequired: false,
    buildingRegs: ["Part P"],
    grants: [],
  },

  // Heat Pumps
  ashp_8kw: {
    id: "ashp_8kw",
    name: "Air Source Heat Pump (8kW)",
    category: "heating",
    description: "Replaces gas boiler. Suitable for well-insulated 2-3 bed property.",
    typicalCost: { min: 9000, max: 13000 },
    installDays: 4,
    sapImpact: { min: 12, max: 20 },
    annualSaving: { min: 300, max: 600 },
    carbonSaving: 2500,
    paybackYears: { min: 8, max: 14 },
    mcsRequired: true,
    buildingRegs: ["Part L", "Part P", "Part G"],
    grants: ["BUS"],
  },
  ashp_12kw: {
    id: "ashp_12kw",
    name: "Air Source Heat Pump (12kW)",
    category: "heating",
    description: "Higher output for larger properties. 3-4 bed with moderate insulation.",
    typicalCost: { min: 12000, max: 16000 },
    installDays: 5,
    sapImpact: { min: 15, max: 25 },
    annualSaving: { min: 400, max: 750 },
    carbonSaving: 3200,
    paybackYears: { min: 8, max: 14 },
    mcsRequired: true,
    buildingRegs: ["Part L", "Part P", "Part G"],
    grants: ["BUS"],
  },
  gshp_10kw: {
    id: "gshp_10kw",
    name: "Ground Source Heat Pump (10kW)",
    category: "heating",
    description: "Higher efficiency than ASHP. Requires ground works for boreholes/trenches.",
    typicalCost: { min: 20000, max: 32000 },
    installDays: 10,
    sapImpact: { min: 18, max: 28 },
    annualSaving: { min: 500, max: 900 },
    carbonSaving: 3800,
    paybackYears: { min: 12, max: 18 },
    mcsRequired: true,
    buildingRegs: ["Part L", "Part P", "Part G"],
    grants: ["BUS"],
  },

  // EV Charging
  ev_charger_7kw: {
    id: "ev_charger_7kw",
    name: "EV Charger (7kW)",
    category: "efficiency",
    description: "Standard home charger. Full charge in 6-8 hours. Part S requirement.",
    typicalCost: { min: 800, max: 1200 },
    installDays: 0.5,
    sapImpact: { min: 0, max: 0 },
    annualSaving: { min: 400, max: 600 }, // vs petrol
    carbonSaving: 1800,
    paybackYears: { min: 2, max: 3 },
    mcsRequired: false,
    buildingRegs: ["Part S", "Part P"],
    grants: ["OZEV"],
  },
  ev_charger_22kw: {
    id: "ev_charger_22kw",
    name: "EV Charger (22kW)",
    category: "efficiency",
    description: "Fast charger. Full charge in 2-3 hours. Requires 3-phase supply.",
    typicalCost: { min: 1500, max: 2500 },
    installDays: 1,
    sapImpact: { min: 0, max: 0 },
    annualSaving: { min: 400, max: 600 },
    carbonSaving: 1800,
    paybackYears: { min: 3, max: 5 },
    mcsRequired: false,
    buildingRegs: ["Part S", "Part P"],
    grants: ["OZEV"],
  },

  // Ventilation
  mvhr: {
    id: "mvhr",
    name: "MVHR System",
    category: "efficiency",
    description: "Mechanical ventilation with heat recovery. 90%+ heat recovery.",
    typicalCost: { min: 4000, max: 7000 },
    installDays: 3,
    sapImpact: { min: 5, max: 10 },
    annualSaving: { min: 200, max: 400 },
    carbonSaving: 600,
    paybackYears: { min: 10, max: 15 },
    mcsRequired: false,
    buildingRegs: ["Part F", "Part L"],
    grants: ["ECO4"],
  },

  // Insulation Upgrades
  wall_insulation_cavity: {
    id: "wall_insulation_cavity",
    name: "Cavity Wall Insulation",
    category: "efficiency",
    description: "Fill cavity walls with mineral wool. Most cost-effective upgrade.",
    typicalCost: { min: 800, max: 1500 },
    installDays: 0.5,
    sapImpact: { min: 8, max: 15 },
    annualSaving: { min: 150, max: 300 },
    carbonSaving: 700,
    paybackYears: { min: 3, max: 6 },
    mcsRequired: false,
    buildingRegs: ["Part L"],
    grants: ["ECO4", "GBIS"],
  },
  wall_insulation_external: {
    id: "wall_insulation_external",
    name: "External Wall Insulation",
    category: "efficiency",
    description: "100mm PIR + render system. For solid walls. Major improvement.",
    typicalCost: { min: 12000, max: 25000 },
    installDays: 14,
    sapImpact: { min: 15, max: 25 },
    annualSaving: { min: 400, max: 700 },
    carbonSaving: 1800,
    paybackYears: { min: 15, max: 25 },
    mcsRequired: false,
    buildingRegs: ["Part L"],
    grants: ["ECO4", "GBIS", "HUG"],
  },
  loft_insulation: {
    id: "loft_insulation",
    name: "Loft Insulation (300mm)",
    category: "efficiency",
    description: "Top up to 300mm mineral wool. Required for EPC C.",
    typicalCost: { min: 400, max: 800 },
    installDays: 0.5,
    sapImpact: { min: 5, max: 12 },
    annualSaving: { min: 150, max: 250 },
    carbonSaving: 500,
    paybackYears: { min: 2, max: 4 },
    mcsRequired: false,
    buildingRegs: ["Part L"],
    grants: ["ECO4", "GBIS"],
  },
  floor_insulation: {
    id: "floor_insulation",
    name: "Floor Insulation",
    category: "efficiency",
    description: "100mm PIR under suspended timber floor or screed.",
    typicalCost: { min: 2500, max: 5000 },
    installDays: 3,
    sapImpact: { min: 4, max: 8 },
    annualSaving: { min: 100, max: 200 },
    carbonSaving: 400,
    paybackYears: { min: 12, max: 20 },
    mcsRequired: false,
    buildingRegs: ["Part L"],
    grants: ["ECO4"],
  },
  glazing_upgrade: {
    id: "glazing_upgrade",
    name: "Double to Triple Glazing",
    category: "efficiency",
    description: "Upgrade windows to triple glazing. U-value 0.8 W/m²K.",
    typicalCost: { min: 6000, max: 15000 },
    installDays: 3,
    sapImpact: { min: 3, max: 8 },
    annualSaving: { min: 100, max: 200 },
    carbonSaving: 300,
    paybackYears: { min: 20, max: 40 },
    mcsRequired: false,
    buildingRegs: ["Part L"],
    grants: [],
  },
};

// Available Grants (Jan 2026)
export const GRANTS = {
  BUS: {
    name: "Boiler Upgrade Scheme",
    amount: 7500,
    description: "Grant towards heat pump installation. Replaces fossil fuel boiler.",
    eligibility: ["Owner-occupier", "Landlord", "Valid EPC", "MCS installer"],
    expires: "2028-03-31",
  },
  ECO4: {
    name: "ECO4",
    amount: "Variable",
    description: "Fully funded insulation & heating for low-income households.",
    eligibility: ["EPC D or below", "Eligible benefits", "Private tenure"],
    expires: "2026-03-31",
  },
  GBIS: {
    name: "Great British Insulation Scheme",
    amount: "Variable",
    description: "Subsidised insulation for middle-income households.",
    eligibility: ["EPC D or below", "Council tax band A-D", "Private tenure"],
    expires: "2026-03-31",
  },
  HUG: {
    name: "Home Upgrade Grant",
    amount: 10000,
    description: "Off-gas grid property upgrades including insulation and heat pumps.",
    eligibility: ["Off gas grid", "EPC D or below", "Low income"],
    expires: "2025-03-31",
  },
  OZEV: {
    name: "OZEV Grant",
    amount: 350,
    description: "EV charger grant for landlords and tenants.",
    eligibility: ["Landlord or tenant", "Off-street parking", "No existing charger"],
    expires: "2025-03-31",
  },
  SEG: {
    name: "Smart Export Guarantee",
    amount: "4-15p/kWh",
    description: "Payment for excess solar electricity exported to grid.",
    eligibility: ["MCS certified system", "Smart meter required"],
    expires: "Ongoing",
  },
};

// Calculate EPC improvement pathway
export interface EPCImprovementPlan {
  currentBand: EPCBand;
  currentSAP: number;
  targetBand: EPCBand;
  targetSAP: number;
  upgrades: {
    technology: RenewableTechnology;
    cost: number;
    sapGain: number;
    savings: number;
    grants: number;
    priority: number;
  }[];
  totalCost: number;
  totalGrants: number;
  netCost: number;
  annualSavings: number;
  paybackYears: number;
  carbonSaved: number;
}

export function calculateEPCPathway(
  currentSAP: number,
  targetBand: EPCBand = "C",
  propertyType: "detached" | "semi" | "terraced" | "flat" = "semi"
): EPCImprovementPlan {
  const targetSAP = EPC_BANDS[targetBand].min;
  const gap = targetSAP - currentSAP;

  if (gap <= 0) {
    // Already meets target
    return {
      currentBand: getBandFromSAP(currentSAP),
      currentSAP,
      targetBand,
      targetSAP,
      upgrades: [],
      totalCost: 0,
      totalGrants: 0,
      netCost: 0,
      annualSavings: 0,
      paybackYears: 0,
      carbonSaved: 0,
    };
  }

  // Prioritised upgrade recommendations
  const recommendations: EPCImprovementPlan["upgrades"] = [];
  let runningGap = gap;
  let priority = 1;

  // Priority 1: Quick wins (insulation)
  if (currentSAP < 60) {
    const loft = RENEWABLE_TECHNOLOGIES.loft_insulation;
    if (runningGap > 0) {
      const grant = 0; // GBIS if eligible
      recommendations.push({
        technology: loft,
        cost: (loft.typicalCost.min + loft.typicalCost.max) / 2,
        sapGain: (loft.sapImpact.min + loft.sapImpact.max) / 2,
        savings: (loft.annualSaving.min + loft.annualSaving.max) / 2,
        grants: grant,
        priority: priority++,
      });
      runningGap -= (loft.sapImpact.min + loft.sapImpact.max) / 2;
    }

    const cavity = RENEWABLE_TECHNOLOGIES.wall_insulation_cavity;
    if (runningGap > 0 && propertyType !== "flat") {
      recommendations.push({
        technology: cavity,
        cost: (cavity.typicalCost.min + cavity.typicalCost.max) / 2,
        sapGain: (cavity.sapImpact.min + cavity.sapImpact.max) / 2,
        savings: (cavity.annualSaving.min + cavity.annualSaving.max) / 2,
        grants: 0,
        priority: priority++,
      });
      runningGap -= (cavity.sapImpact.min + cavity.sapImpact.max) / 2;
    }
  }

  // Priority 2: Heating system
  if (runningGap > 5) {
    const ashp = RENEWABLE_TECHNOLOGIES.ashp_8kw;
    recommendations.push({
      technology: ashp,
      cost: (ashp.typicalCost.min + ashp.typicalCost.max) / 2,
      sapGain: (ashp.sapImpact.min + ashp.sapImpact.max) / 2,
      savings: (ashp.annualSaving.min + ashp.annualSaving.max) / 2,
      grants: GRANTS.BUS.amount as number,
      priority: priority++,
    });
    runningGap -= (ashp.sapImpact.min + ashp.sapImpact.max) / 2;
  }

  // Priority 3: Solar PV
  if (runningGap > 0 && propertyType !== "flat") {
    const solar = RENEWABLE_TECHNOLOGIES.solar_pv_4kw;
    recommendations.push({
      technology: solar,
      cost: (solar.typicalCost.min + solar.typicalCost.max) / 2,
      sapGain: (solar.sapImpact.min + solar.sapImpact.max) / 2,
      savings: (solar.annualSaving.min + solar.annualSaving.max) / 2,
      grants: 0,
      priority: priority++,
    });
  }

  // Calculate totals
  const totalCost = recommendations.reduce((sum, r) => sum + r.cost, 0);
  const totalGrants = recommendations.reduce((sum, r) => sum + r.grants, 0);
  const netCost = totalCost - totalGrants;
  const annualSavings = recommendations.reduce((sum, r) => sum + r.savings, 0);
  const carbonSaved = recommendations.reduce((sum, r) => sum + r.technology.carbonSaving, 0);

  const finalSAP = Math.min(100, currentSAP + recommendations.reduce((sum, r) => sum + r.sapGain, 0));

  return {
    currentBand: getBandFromSAP(currentSAP),
    currentSAP,
    targetBand,
    targetSAP,
    upgrades: recommendations,
    totalCost: Math.round(totalCost),
    totalGrants: Math.round(totalGrants),
    netCost: Math.round(netCost),
    annualSavings: Math.round(annualSavings),
    paybackYears: Math.round((netCost / annualSavings) * 10) / 10,
    carbonSaved: Math.round(carbonSaved),
  };
}

function getBandFromSAP(sap: number): EPCBand {
  for (const [band, range] of Object.entries(EPC_BANDS)) {
    if (sap >= range.min && sap <= range.max) {
      return band as EPCBand;
    }
  }
  return "G";
}
