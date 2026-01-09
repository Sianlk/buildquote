// Plumbing Module Data - Gas Safe Regulations, Pipe Sizing, Boiler Installation

export interface GasSafeRegulation {
  id: string;
  category: string;
  requirement: string;
  details: string;
  reference: string;
}

export interface PipeSizeData {
  flowRate: string; // L/min
  copperSize: string;
  plasticSize: string;
  application: string;
}

export interface BoilerChecklistItem {
  id: string;
  phase: string;
  task: string;
  requirement: string;
  gasRegRef: string;
  critical: boolean;
}

export interface WaterRegulation {
  id: string;
  regulation: string;
  requirement: string;
  wrasApproved: boolean;
}

// Gas Safe Regulations (Gas Safety Installation and Use Regulations 1998)
export const GAS_SAFE_REGULATIONS: GasSafeRegulation[] = [
  {
    id: "gs-1",
    category: "Registration",
    requirement: "Gas Safe Registration Required",
    details: "All gas work must be carried out by a Gas Safe registered engineer. Engineer must carry valid Gas Safe ID card.",
    reference: "GSIUR Reg 3"
  },
  {
    id: "gs-2",
    category: "Installation",
    requirement: "Compliance with Standards",
    details: "All gas installations must comply with BS 6891 (low pressure), BS 6400 (meters), and manufacturer's instructions.",
    reference: "GSIUR Reg 26"
  },
  {
    id: "gs-3",
    category: "Ventilation",
    requirement: "Adequate Ventilation",
    details: "All gas appliances require adequate ventilation. Open-flued appliances need permanent air vents. Room-sealed appliances have specific requirements.",
    reference: "BS 5440-2"
  },
  {
    id: "gs-4",
    category: "Flue Systems",
    requirement: "Flue Terminal Position",
    details: "Flue terminals must be positioned according to BS 5440-1. Minimum distances from openable windows, air bricks, and boundaries must be maintained.",
    reference: "BS 5440-1"
  },
  {
    id: "gs-5",
    category: "Testing",
    requirement: "Tightness Testing",
    details: "All new installations and modifications require tightness testing. Test at working pressure, check for pressure drop over minimum period.",
    reference: "IGEM/UP/1B"
  },
  {
    id: "gs-6",
    category: "Notification",
    requirement: "Building Control Notification",
    details: "Certain gas work requires Building Control notification. Self-certification through Gas Safe scheme satisfies Part J requirements.",
    reference: "Part J Building Regs"
  },
  {
    id: "gs-7",
    category: "Emergency",
    requirement: "Emergency Control Valve",
    details: "ECV must be readily accessible, within 2m of meter, and clearly identifiable. Customer must be shown location.",
    reference: "GSIUR Reg 18"
  },
  {
    id: "gs-8",
    category: "Unsafe Situations",
    requirement: "Immediately Dangerous (ID) Classification",
    details: "If an appliance is ID, it must be disconnected immediately and labeled 'DO NOT USE'. Gas supply may need to be capped.",
    reference: "GSIUR Reg 34"
  },
  {
    id: "gs-9",
    category: "Documentation",
    requirement: "Benchmark Commissioning",
    details: "All new boiler installations require completion of Benchmark checklist. Copy left with customer and registered online.",
    reference: "Building Regs L1"
  },
  {
    id: "gs-10",
    category: "Landlord Duties",
    requirement: "Annual Gas Safety Check",
    details: "Landlords must arrange annual gas safety checks by Gas Safe engineer. CP12 certificate must be provided to tenants within 28 days.",
    reference: "GSIUR Reg 36"
  }
];

// Pipe Sizing Table (Based on flow rates and applications)
export const PIPE_SIZING_TABLE: PipeSizeData[] = [
  { flowRate: "0-6", copperSize: "15mm", plasticSize: "15mm", application: "Single basin, WC cistern" },
  { flowRate: "6-12", copperSize: "15mm", plasticSize: "15mm", application: "Basin + WC, single shower" },
  { flowRate: "12-18", copperSize: "22mm", plasticSize: "22mm", application: "Bath fill, multiple outlets" },
  { flowRate: "18-30", copperSize: "22mm", plasticSize: "22mm", application: "Combination boiler feed" },
  { flowRate: "30-50", copperSize: "28mm", plasticSize: "28mm", application: "Main cold supply, unvented cylinder" },
  { flowRate: "50-75", copperSize: "35mm", plasticSize: "32mm", application: "Commercial applications" },
  { flowRate: "75-100", copperSize: "42mm", plasticSize: "40mm", application: "Large commercial, multiple risers" },
  { flowRate: "100+", copperSize: "54mm", plasticSize: "50mm", application: "Industrial, high-rise supply" }
];

// Gas Pipe Sizing Table
export const GAS_PIPE_SIZING: Array<{
  pipeLength: string;
  maxLoad: string;
  copperSize: string;
  cswaPipeSize: string;
}> = [
  { pipeLength: "0-3m", maxLoad: "Up to 14kW", copperSize: "15mm", cswaPipeSize: "20mm" },
  { pipeLength: "3-6m", maxLoad: "Up to 14kW", copperSize: "15mm", cswaPipeSize: "20mm" },
  { pipeLength: "6-9m", maxLoad: "Up to 14kW", copperSize: "22mm", cswaPipeSize: "25mm" },
  { pipeLength: "0-3m", maxLoad: "14-28kW", copperSize: "22mm", cswaPipeSize: "25mm" },
  { pipeLength: "3-6m", maxLoad: "14-28kW", copperSize: "22mm", cswaPipeSize: "25mm" },
  { pipeLength: "6-9m", maxLoad: "14-28kW", copperSize: "28mm", cswaPipeSize: "32mm" },
  { pipeLength: "0-3m", maxLoad: "28-60kW", copperSize: "28mm", cswaPipeSize: "32mm" },
  { pipeLength: "3-9m", maxLoad: "28-60kW", copperSize: "35mm", cswaPipeSize: "40mm" }
];

// Boiler Installation Checklist
export const BOILER_INSTALLATION_CHECKLIST: BoilerChecklistItem[] = [
  // Pre-Installation Phase
  {
    id: "bi-1",
    phase: "Pre-Installation",
    task: "Site Survey Complete",
    requirement: "Assess existing system, flue route, ventilation requirements, and gas supply adequacy",
    gasRegRef: "IGEM/UP/10",
    critical: true
  },
  {
    id: "bi-2",
    phase: "Pre-Installation",
    task: "Gas Supply Check",
    requirement: "Verify meter size adequate for load. Check operating pressure (21mbar natural gas)",
    gasRegRef: "BS 6891",
    critical: true
  },
  {
    id: "bi-3",
    phase: "Pre-Installation",
    task: "Flue Route Survey",
    requirement: "Confirm flue terminal position complies with BS 5440-1. Check for openable windows within 300mm",
    gasRegRef: "BS 5440-1",
    critical: true
  },
  {
    id: "bi-4",
    phase: "Pre-Installation",
    task: "System Flush/Powerflush",
    requirement: "Clean existing system before new boiler connection. Add inhibitor and filter",
    gasRegRef: "BS 7593",
    critical: true
  },
  // Installation Phase
  {
    id: "bi-5",
    phase: "Installation",
    task: "Pipework Installation",
    requirement: "Install gas pipework to BS 6891. Support at maximum 1.8m intervals. Sleeve through walls",
    gasRegRef: "BS 6891",
    critical: true
  },
  {
    id: "bi-6",
    phase: "Installation",
    task: "Flue Installation",
    requirement: "Install flue per manufacturer's instructions. Maximum length and bends per data plate",
    gasRegRef: "BS 5440-1",
    critical: true
  },
  {
    id: "bi-7",
    phase: "Installation",
    task: "Condensate Drainage",
    requirement: "Install condensate to internal stack where possible. External must be 32mm minimum with trace heating in exposed areas",
    gasRegRef: "BS 6798",
    critical: true
  },
  {
    id: "bi-8",
    phase: "Installation",
    task: "Controls Installation",
    requirement: "Install Boiler Plus compliant controls: room thermostat, TRVs, and time control minimum",
    gasRegRef: "Building Regs L1",
    critical: true
  },
  // Commissioning Phase
  {
    id: "bi-9",
    phase: "Commissioning",
    task: "Gas Tightness Test",
    requirement: "Test at 20mbar. No pressure drop over 2 minutes acceptable",
    gasRegRef: "IGEM/UP/1B",
    critical: true
  },
  {
    id: "bi-10",
    phase: "Commissioning",
    task: "Flue Flow Test",
    requirement: "Verify adequate flue flow. Check combustion analyzer readings: CO2, CO, efficiency",
    gasRegRef: "BS 7967",
    critical: true
  },
  {
    id: "bi-11",
    phase: "Commissioning",
    task: "Benchmark Completion",
    requirement: "Complete all sections of Benchmark checklist. Record gas rate, pressures, and flow readings",
    gasRegRef: "Building Regs",
    critical: true
  },
  {
    id: "bi-12",
    phase: "Commissioning",
    task: "Customer Handover",
    requirement: "Demonstrate controls to customer. Leave all documentation including gas safety certificate",
    gasRegRef: "GSIUR",
    critical: false
  }
];

// Water Regulations (WRAS)
export const WATER_REGULATIONS: WaterRegulation[] = [
  {
    id: "wr-1",
    regulation: "Backflow Prevention",
    requirement: "All outlets must have appropriate backflow prevention. Type AA, AB, or DC as required by risk assessment",
    wrasApproved: true
  },
  {
    id: "wr-2",
    regulation: "Cross Connection",
    requirement: "No cross-connection between mains water and other water sources without appropriate break tank and gap",
    wrasApproved: true
  },
  {
    id: "wr-3",
    regulation: "Hot Water Storage",
    requirement: "Hot water must be stored at minimum 60°C and distributed at minimum 50°C to prevent Legionella",
    wrasApproved: true
  },
  {
    id: "wr-4",
    regulation: "Unvented Cylinders",
    requirement: "G3 qualified installer required. Building Control notification mandatory",
    wrasApproved: true
  },
  {
    id: "wr-5",
    regulation: "Materials",
    requirement: "All materials in contact with potable water must be WRAS approved or equivalent",
    wrasApproved: true
  }
];

// Cylinder Sizing Guide
export const CYLINDER_SIZING_GUIDE: Array<{
  bedrooms: string;
  bathrooms: string;
  recommendedSize: string;
  recoveryTime: string;
}> = [
  { bedrooms: "1-2", bathrooms: "1", recommendedSize: "120-150L", recoveryTime: "20-25 mins" },
  { bedrooms: "2-3", bathrooms: "1-2", recommendedSize: "150-180L", recoveryTime: "25-30 mins" },
  { bedrooms: "3-4", bathrooms: "2", recommendedSize: "180-210L", recoveryTime: "30-35 mins" },
  { bedrooms: "4-5", bathrooms: "2-3", recommendedSize: "210-300L", recoveryTime: "35-45 mins" },
  { bedrooms: "5+", bathrooms: "3+", recommendedSize: "300L+", recoveryTime: "45+ mins" }
];

// Flow Rate Requirements
export const FLOW_RATE_REQUIREMENTS: Array<{
  outlet: string;
  minFlow: string;
  optimalFlow: string;
  minPressure: string;
}> = [
  { outlet: "Kitchen Tap", minFlow: "10 L/min", optimalFlow: "12-15 L/min", minPressure: "1.0 bar" },
  { outlet: "Basin Tap", minFlow: "6 L/min", optimalFlow: "8-10 L/min", minPressure: "0.5 bar" },
  { outlet: "Bath Fill", minFlow: "18 L/min", optimalFlow: "22-25 L/min", minPressure: "1.0 bar" },
  { outlet: "Electric Shower (8.5kW)", minFlow: "4 L/min", optimalFlow: "5-6 L/min", minPressure: "1.0 bar" },
  { outlet: "Mixer Shower", minFlow: "8 L/min", optimalFlow: "12-15 L/min", minPressure: "1.0 bar" },
  { outlet: "Power Shower", minFlow: "12 L/min", optimalFlow: "15-18 L/min", minPressure: "0.5 bar" },
  { outlet: "WC Cistern", minFlow: "6 L/min", optimalFlow: "8 L/min", minPressure: "0.3 bar" }
];

// Pipe sizing calculator
export function calculatePipeSize(flowRate: number): { copper: string; plastic: string } {
  if (flowRate <= 6) return { copper: "15mm", plastic: "15mm" };
  if (flowRate <= 18) return { copper: "22mm", plastic: "22mm" };
  if (flowRate <= 50) return { copper: "28mm", plastic: "28mm" };
  if (flowRate <= 75) return { copper: "35mm", plastic: "32mm" };
  if (flowRate <= 100) return { copper: "42mm", plastic: "40mm" };
  return { copper: "54mm", plastic: "50mm" };
}

// Gas pipe sizing calculator
export function calculateGasPipeSize(pipeLength: number, loadKw: number): { copper: string; cswa: string } {
  if (loadKw <= 14) {
    if (pipeLength <= 6) return { copper: "15mm", cswa: "20mm" };
    return { copper: "22mm", cswa: "25mm" };
  }
  if (loadKw <= 28) {
    if (pipeLength <= 6) return { copper: "22mm", cswa: "25mm" };
    return { copper: "28mm", cswa: "32mm" };
  }
  if (pipeLength <= 3) return { copper: "28mm", cswa: "32mm" };
  return { copper: "35mm", cswa: "40mm" };
}

// Cylinder size recommendation
export function recommendCylinderSize(bedrooms: number, bathrooms: number): string {
  const score = bedrooms + bathrooms;
  if (score <= 3) return "120-150L";
  if (score <= 5) return "150-180L";
  if (score <= 7) return "180-210L";
  if (score <= 9) return "210-300L";
  return "300L+";
}
