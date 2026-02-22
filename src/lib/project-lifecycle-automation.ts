// Project Lifecycle Automation Engine
// On project creation: auto-generate quote, compliance, schedule, labour, cashflow, BoM
// Populates existing modules without UI changes

import { createQuotePricingSnapshot, autoDetectRegion, calculateFinalRate, PRICING_DATASET_VERSION } from "./versioned-pricing-engine";
import { runComplianceChecks, ProjectComplianceData, COMPLIANCE_DATASET_VERSION } from "./versioned-compliance-engine";
import { BASE_LABOUR_RATES, TradeType, formatCurrency } from "./dynamic-pricing-engine";
import { trackEvent } from "./analytics-tracker";

export interface ProjectLifecycleOutput {
  quote: AutoQuote;
  compliance: any;
  schedule: ScheduleTask[];
  labourEstimate: LabourEstimate[];
  cashflow: CashflowMilestone[];
  bomSummary: BOMSummaryLine[];
  pricingSnapshot: any;
}

export interface AutoQuote {
  lineItems: QuoteLineItem[];
  subtotal: number;
  vat: number;
  total: number;
  datasetVersion: string;
  regionName: string;
}

export interface QuoteLineItem {
  description: string;
  trade: string;
  quantity: number;
  unit: string;
  unitRate: number;
  total: number;
  category: string;
}

export interface ScheduleTask {
  taskName: string;
  trade: string;
  durationDays: number;
  labourHours: number;
  startDay: number;
  endDay: number;
  dependencies: string[];
  materialsRequired: string[];
  skillLevel: string;
}

export interface LabourEstimate {
  trade: string;
  hours: number;
  dayRate: number;
  totalCost: number;
  skillLevel: string;
  workers: number;
}

export interface CashflowMilestone {
  phase: string;
  percentComplete: number;
  amount: number;
  retentionHeld: number;
  netPayable: number;
  dueWeek: number;
}

export interface BOMSummaryLine {
  category: string;
  itemCount: number;
  totalCost: number;
  leadTimeDays: number;
}

// Master function: generate all lifecycle outputs from project data
export function generateProjectLifecycle(params: {
  projectType: string;
  floorArea: number;
  wallArea: number;
  height: number;
  postcode: string;
  buildQuality: string;
  electricalPoints: number;
  plumbingPoints: number;
  heatingRadiators: number;
  rooms: { type: string; sqm: number }[];
  glazingArea?: number;
  windowCount?: number;
  doorCount?: number;
}): ProjectLifecycleOutput {
  const region = autoDetectRegion(params.postcode);
  const pricingSnapshot = createQuotePricingSnapshot(region.region, "residential");

  // Generate auto-quote
  const quote = generateAutoQuote(params, region);

  // Run compliance
  const complianceData: ProjectComplianceData = {
    projectType: params.projectType,
    floorArea: params.floorArea,
    height: params.height,
    wallType: "cavity",
    roofType: "pitched",
    foundationType: "strip",
    glazingArea: params.glazingArea || 0,
    totalWallArea: params.wallArea,
    electricalPoints: params.electricalPoints,
    plumbingPoints: params.plumbingPoints,
    heatingRadiators: params.heatingRadiators,
    rooms: params.rooms,
    postcode: params.postcode,
  };
  const compliance = runComplianceChecks(complianceData);

  // Generate schedule
  const schedule = generateAutoSchedule(params);

  // Labour estimate
  const labourEstimate = generateLabourEstimate(schedule, region.region);

  // Cashflow milestones
  const cashflow = generateCashflowProjection(quote.total, schedule);

  // BoM summary
  const bomSummary = generateBOMSummary(params);

  trackEvent("project_created", {
    projectType: params.projectType,
    region: region.name,
    estimatedCost: quote.total,
    datasetVersion: PRICING_DATASET_VERSION,
  });

  return { quote, compliance, schedule, labourEstimate, cashflow, bomSummary, pricingSnapshot };
}

function generateAutoQuote(params: any, region: { region: any; name: string; multiplier: number }): AutoQuote {
  const items: QuoteLineItem[] = [];
  const qualityMultiplier = { basic: 0.85, standard: 1.0, premium: 1.3, luxury: 1.6 }[params.buildQuality as string] || 1.0;

  // Substructure
  const foundationCost = params.floorArea * 185 * qualityMultiplier * region.multiplier;
  items.push({ description: "Foundations & substructure", trade: "Groundworker", quantity: params.floorArea, unit: "m²", unitRate: Math.round(185 * qualityMultiplier * region.multiplier), total: Math.round(foundationCost), category: "Substructure" });

  // Superstructure
  const wallCost = params.wallArea * 165 * qualityMultiplier * region.multiplier;
  items.push({ description: "External walls (cavity blockwork)", trade: "Bricklayer", quantity: params.wallArea, unit: "m²", unitRate: Math.round(165 * qualityMultiplier * region.multiplier), total: Math.round(wallCost), category: "Superstructure" });

  // Roof
  const roofArea = params.floorArea * 1.3;
  const roofCost = roofArea * 95 * qualityMultiplier * region.multiplier;
  items.push({ description: "Roof structure & covering", trade: "Roofer", quantity: Math.round(roofArea), unit: "m²", unitRate: Math.round(95 * qualityMultiplier * region.multiplier), total: Math.round(roofCost), category: "Roof" });

  // Windows & doors
  const windowCount = params.windowCount || Math.max(2, Math.floor(params.floorArea / 10));
  const doorCount = params.doorCount || Math.max(1, Math.floor(params.rooms?.length || 2));
  items.push({ description: `Windows (${windowCount}× double glazed uPVC)`, trade: "Glazier", quantity: windowCount, unit: "nr", unitRate: Math.round(650 * qualityMultiplier * region.multiplier), total: Math.round(windowCount * 650 * qualityMultiplier * region.multiplier), category: "Windows & Doors" });
  items.push({ description: `Internal doors (${doorCount}× fire rated)`, trade: "Carpenter", quantity: doorCount, unit: "nr", unitRate: Math.round(280 * qualityMultiplier * region.multiplier), total: Math.round(doorCount * 280 * qualityMultiplier * region.multiplier), category: "Windows & Doors" });

  // M&E
  if (params.electricalPoints > 0) {
    items.push({ description: `Electrical installation (${params.electricalPoints} points)`, trade: "Electrician", quantity: params.electricalPoints, unit: "nr", unitRate: Math.round(85 * region.multiplier), total: Math.round(params.electricalPoints * 85 * region.multiplier), category: "Electrical" });
  }
  if (params.plumbingPoints > 0) {
    items.push({ description: `Plumbing installation (${params.plumbingPoints} points)`, trade: "Plumber", quantity: params.plumbingPoints, unit: "nr", unitRate: Math.round(210 * region.multiplier), total: Math.round(params.plumbingPoints * 210 * region.multiplier), category: "Plumbing" });
  }
  if (params.heatingRadiators > 0) {
    items.push({ description: `Heating system (${params.heatingRadiators} radiators)`, trade: "Heating Engineer", quantity: params.heatingRadiators, unit: "nr", unitRate: Math.round(320 * region.multiplier), total: Math.round(params.heatingRadiators * 320 * region.multiplier), category: "Heating" });
  }

  // Finishes
  const finishCost = params.floorArea * 120 * qualityMultiplier * region.multiplier;
  items.push({ description: "Internal finishes (plaster, paint, skirting)", trade: "Plasterer / Decorator", quantity: params.floorArea, unit: "m²", unitRate: Math.round(120 * qualityMultiplier * region.multiplier), total: Math.round(finishCost), category: "Finishes" });

  // Floor finishes
  const floorCost = params.floorArea * 55 * qualityMultiplier * region.multiplier;
  items.push({ description: "Floor finishes", trade: "Floor Layer", quantity: params.floorArea, unit: "m²", unitRate: Math.round(55 * qualityMultiplier * region.multiplier), total: Math.round(floorCost), category: "Finishes" });

  const subtotal = items.reduce((s, i) => s + i.total, 0);
  const vat = Math.round(subtotal * 0.20);

  return {
    lineItems: items,
    subtotal,
    vat,
    total: subtotal + vat,
    datasetVersion: PRICING_DATASET_VERSION,
    regionName: region.name,
  };
}

function generateAutoSchedule(params: any): ScheduleTask[] {
  const areaFactor = Math.max(0.5, params.floorArea / 30);
  const tasks: ScheduleTask[] = [
    { taskName: "Site setup & enable", trade: "Labourer", durationDays: Math.ceil(2 * areaFactor), labourHours: Math.ceil(16 * areaFactor), startDay: 1, endDay: 0, dependencies: [], materialsRequired: ["Hoarding", "Skip hire", "Welfare unit"], skillLevel: "unskilled" },
    { taskName: "Excavation & foundations", trade: "Groundworker", durationDays: Math.ceil(5 * areaFactor), labourHours: Math.ceil(40 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Site setup & enable"], materialsRequired: ["Concrete", "Rebar", "DPM", "Sand", "Gravel"], skillLevel: "skilled" },
    { taskName: "Oversite & floor slab", trade: "Groundworker", durationDays: Math.ceil(3 * areaFactor), labourHours: Math.ceil(24 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Excavation & foundations"], materialsRequired: ["Concrete", "DPM", "Insulation boards", "Mesh"], skillLevel: "skilled" },
    { taskName: "Brickwork to DPC", trade: "Bricklayer", durationDays: Math.ceil(4 * areaFactor), labourHours: Math.ceil(32 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Oversite & floor slab"], materialsRequired: ["Bricks", "Blocks", "Mortar", "DPC", "Wall ties"], skillLevel: "skilled" },
    { taskName: "Superstructure walls", trade: "Bricklayer", durationDays: Math.ceil(8 * areaFactor), labourHours: Math.ceil(64 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Brickwork to DPC"], materialsRequired: ["Bricks", "Blocks", "Mortar", "Lintels", "Cavity insulation", "Wall ties"], skillLevel: "skilled" },
    { taskName: "Roof structure", trade: "Carpenter", durationDays: Math.ceil(4 * areaFactor), labourHours: Math.ceil(32 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Superstructure walls"], materialsRequired: ["Roof trusses", "Ridge board", "Battens", "Felt", "Fascia"], skillLevel: "skilled" },
    { taskName: "Roof covering", trade: "Roofer", durationDays: Math.ceil(3 * areaFactor), labourHours: Math.ceil(24 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Roof structure"], materialsRequired: ["Tiles/slates", "Ridge tiles", "Lead flashing", "Dry verge kit"], skillLevel: "skilled" },
    { taskName: "Windows & external doors", trade: "Glazier", durationDays: Math.ceil(2 * areaFactor), labourHours: Math.ceil(16 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Superstructure walls"], materialsRequired: ["Windows", "External doors", "Sealant", "Fixings", "DPC cavity tray"], skillLevel: "skilled" },
    { taskName: "1st fix electrical", trade: "Electrician", durationDays: Math.ceil(3 * areaFactor), labourHours: Math.ceil(24 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Roof covering"], materialsRequired: ["Cable (T&E)", "Back boxes", "Consumer unit", "Trunking", "Cable clips"], skillLevel: "qualified" },
    { taskName: "1st fix plumbing", trade: "Plumber", durationDays: Math.ceil(3 * areaFactor), labourHours: Math.ceil(24 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Roof covering"], materialsRequired: ["Copper pipe", "Push-fit fittings", "Waste pipe", "Solvent weld", "PTFE"], skillLevel: "qualified" },
    { taskName: "1st fix carpentry", trade: "Carpenter", durationDays: Math.ceil(3 * areaFactor), labourHours: Math.ceil(24 * areaFactor), startDay: 0, endDay: 0, dependencies: ["1st fix electrical", "1st fix plumbing"], materialsRequired: ["Studwork timber", "Noggins", "Screws", "Nails"], skillLevel: "skilled" },
    { taskName: "Plastering", trade: "Plasterer", durationDays: Math.ceil(5 * areaFactor), labourHours: Math.ceil(40 * areaFactor), startDay: 0, endDay: 0, dependencies: ["1st fix carpentry"], materialsRequired: ["Plasterboard", "Multi-finish", "Bonding", "Scrim tape", "Beads", "PVA"], skillLevel: "skilled" },
    { taskName: "2nd fix electrical", trade: "Electrician", durationDays: Math.ceil(2 * areaFactor), labourHours: Math.ceil(16 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Plastering"], materialsRequired: ["Sockets", "Switches", "Downlights", "Smoke detectors", "Faceplates"], skillLevel: "qualified" },
    { taskName: "2nd fix plumbing & heating", trade: "Plumber", durationDays: Math.ceil(3 * areaFactor), labourHours: Math.ceil(24 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Plastering"], materialsRequired: ["Radiators", "TRVs", "Sanitaryware", "Taps", "Waste traps", "Silicone"], skillLevel: "qualified" },
    { taskName: "2nd fix carpentry (doors, skirting)", trade: "Carpenter", durationDays: Math.ceil(3 * areaFactor), labourHours: Math.ceil(24 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Plastering"], materialsRequired: ["Internal doors", "Skirting", "Architrave", "Handles", "Hinges", "Screws"], skillLevel: "skilled" },
    { taskName: "Floor finishes", trade: "Floor Layer", durationDays: Math.ceil(2 * areaFactor), labourHours: Math.ceil(16 * areaFactor), startDay: 0, endDay: 0, dependencies: ["2nd fix carpentry (doors, skirting)"], materialsRequired: ["Flooring", "Underlay", "Adhesive", "Beading", "Threshold bars"], skillLevel: "skilled" },
    { taskName: "Decoration", trade: "Decorator", durationDays: Math.ceil(4 * areaFactor), labourHours: Math.ceil(32 * areaFactor), startDay: 0, endDay: 0, dependencies: ["Floor finishes", "2nd fix electrical"], materialsRequired: ["Primer", "Emulsion", "Gloss", "Filler", "Caulk", "Dust sheets", "Masking tape"], skillLevel: "skilled" },
    { taskName: "Snagging & handover", trade: "Labourer", durationDays: Math.ceil(2), labourHours: Math.ceil(16), startDay: 0, endDay: 0, dependencies: ["Decoration"], materialsRequired: ["Touch-up paint", "Sealant"], skillLevel: "unskilled" },
  ];

  // Calculate start/end days based on dependencies
  let currentDay = 1;
  for (const task of tasks) {
    if (task.dependencies.length === 0) {
      task.startDay = currentDay;
    } else {
      const depEndDays = task.dependencies.map(dep => {
        const depTask = tasks.find(t => t.taskName === dep);
        return depTask ? depTask.endDay : 0;
      });
      task.startDay = Math.max(...depEndDays) + 1;
    }
    task.endDay = task.startDay + task.durationDays - 1;
    currentDay = Math.max(currentDay, task.endDay + 1);
  }

  return tasks;
}

function generateLabourEstimate(schedule: ScheduleTask[], region: any): LabourEstimate[] {
  const byTrade = new Map<string, { hours: number; tasks: number }>();

  for (const task of schedule) {
    const existing = byTrade.get(task.trade) || { hours: 0, tasks: 0 };
    existing.hours += task.labourHours;
    existing.tasks++;
    byTrade.set(task.trade, existing);
  }

  return Array.from(byTrade.entries()).map(([trade, data]) => {
    const tradeKey = trade.toLowerCase().replace(/\s/g, "") as TradeType;
    const rateInfo = BASE_LABOUR_RATES[tradeKey] || { dayRate: 280 };
    const dayRate = rateInfo.dayRate;
    return {
      trade,
      hours: data.hours,
      dayRate,
      totalCost: Math.round((data.hours / 8) * dayRate),
      skillLevel: "skilled",
      workers: Math.max(1, Math.ceil(data.hours / 40)),
    };
  });
}

function generateCashflowProjection(totalExVat: number, schedule: ScheduleTask[]): CashflowMilestone[] {
  const totalDays = Math.max(...schedule.map(t => t.endDay));
  const retentionRate = 0.05;

  const milestones: CashflowMilestone[] = [
    { phase: "Substructure Complete", percentComplete: 20, amount: 0, retentionHeld: 0, netPayable: 0, dueWeek: Math.ceil(totalDays * 0.2 / 5) },
    { phase: "Weathertight Shell", percentComplete: 45, amount: 0, retentionHeld: 0, netPayable: 0, dueWeek: Math.ceil(totalDays * 0.45 / 5) },
    { phase: "1st Fix Complete", percentComplete: 65, amount: 0, retentionHeld: 0, netPayable: 0, dueWeek: Math.ceil(totalDays * 0.65 / 5) },
    { phase: "2nd Fix Complete", percentComplete: 85, amount: 0, retentionHeld: 0, netPayable: 0, dueWeek: Math.ceil(totalDays * 0.85 / 5) },
    { phase: "Practical Completion", percentComplete: 95, amount: 0, retentionHeld: 0, netPayable: 0, dueWeek: Math.ceil(totalDays * 0.95 / 5) },
    { phase: "Retention Release (12 months)", percentComplete: 100, amount: 0, retentionHeld: 0, netPayable: 0, dueWeek: Math.ceil(totalDays / 5) + 52 },
  ];

  let previousPercent = 0;
  let totalRetention = 0;

  for (const ms of milestones) {
    const phasePercent = ms.percentComplete - previousPercent;
    ms.amount = Math.round(totalExVat * (phasePercent / 100));
    if (ms.phase !== "Retention Release (12 months)") {
      ms.retentionHeld = Math.round(ms.amount * retentionRate);
      totalRetention += ms.retentionHeld;
      ms.netPayable = ms.amount - ms.retentionHeld;
    } else {
      ms.amount = totalRetention;
      ms.retentionHeld = 0;
      ms.netPayable = totalRetention;
    }
    previousPercent = ms.percentComplete;
  }

  return milestones;
}

function generateBOMSummary(params: any): BOMSummaryLine[] {
  return [
    { category: "Substructure", itemCount: 8, totalCost: Math.round(params.floorArea * 85), leadTimeDays: 3 },
    { category: "Superstructure", itemCount: 12, totalCost: Math.round(params.wallArea * 75), leadTimeDays: 5 },
    { category: "Roofing", itemCount: 9, totalCost: Math.round(params.floorArea * 45), leadTimeDays: 7 },
    { category: "Windows & Doors", itemCount: (params.windowCount || 4) + (params.doorCount || 3), totalCost: Math.round((params.windowCount || 4) * 450 + (params.doorCount || 3) * 200), leadTimeDays: 14 },
    { category: "Electrical", itemCount: params.electricalPoints * 3, totalCost: Math.round(params.electricalPoints * 45), leadTimeDays: 2 },
    { category: "Plumbing & Heating", itemCount: (params.plumbingPoints + params.heatingRadiators) * 4, totalCost: Math.round(params.plumbingPoints * 120 + params.heatingRadiators * 180), leadTimeDays: 5 },
    { category: "Finishes", itemCount: 15, totalCost: Math.round(params.floorArea * 65), leadTimeDays: 3 },
    { category: "Fixings & Consumables", itemCount: 25, totalCost: Math.round(params.floorArea * 12), leadTimeDays: 1 },
  ];
}
