// Job Execution Validation Gates
// Regulatory gates, material validation, inspection logging, certification uploads

export const VALIDATION_VERSION = "2026.01";

// Regulatory Gate Types
export interface RegulatoryGate {
  id: string;
  name: string;
  description: string;
  category: "inspection" | "certification" | "approval" | "documentation";
  trade: string;
  mandatory: boolean;
  blockingPhase?: string;
  validityPeriod?: number; // days
  authority?: string;
  notes: string;
}

export const REGULATORY_GATES: Record<string, RegulatoryGate[]> = {
  // Building Control Inspections
  building_control: [
    {
      id: "bc_commencement",
      name: "Commencement Notice",
      description: "Notify building control before work starts",
      category: "approval",
      trade: "all",
      mandatory: true,
      blockingPhase: "foundations",
      authority: "Local Authority Building Control",
      notes: "Submit at least 2 days before work begins"
    },
    {
      id: "bc_foundations",
      name: "Foundation Inspection",
      description: "Building control inspection of excavations before concrete pour",
      category: "inspection",
      trade: "groundworks",
      mandatory: true,
      blockingPhase: "floor_slab",
      authority: "Local Authority Building Control",
      notes: "Inspector must sign off before any concrete is poured"
    },
    {
      id: "bc_dpc",
      name: "DPC/DPM Inspection",
      description: "Damp proof course and membrane inspection",
      category: "inspection",
      trade: "groundworks",
      mandatory: true,
      blockingPhase: "brickwork",
      authority: "Local Authority Building Control",
      notes: "Required before above-ground construction"
    },
    {
      id: "bc_structure",
      name: "Structural Frame Inspection",
      description: "Inspection of structural elements before covering",
      category: "inspection",
      trade: "carpentry",
      mandatory: true,
      blockingPhase: "plastering",
      authority: "Local Authority Building Control",
      notes: "Steel, timber frame, or masonry inspection"
    },
    {
      id: "bc_drains",
      name: "Drainage Inspection",
      description: "Below ground drainage test and inspection",
      category: "inspection",
      trade: "groundworks",
      mandatory: true,
      blockingPhase: "floor_slab",
      authority: "Local Authority Building Control",
      notes: "Air/water test required"
    },
    {
      id: "bc_completion",
      name: "Completion Certificate",
      description: "Final building control sign-off",
      category: "certification",
      trade: "all",
      mandatory: true,
      authority: "Local Authority Building Control",
      notes: "Required for legal completion - affects property value and insurance"
    },
  ],

  // Gas Safety
  gas: [
    {
      id: "gas_safe_reg",
      name: "Gas Safe Registration Check",
      description: "Verify engineer is Gas Safe registered for scope of work",
      category: "certification",
      trade: "plumber",
      mandatory: true,
      blockingPhase: "gas_works",
      authority: "Gas Safe Register",
      notes: "Check registration covers work type (domestic, commercial, LPG)"
    },
    {
      id: "gas_safety_cert",
      name: "Gas Safety Certificate (CP12)",
      description: "Gas safety record for all gas appliances",
      category: "certification",
      trade: "plumber",
      mandatory: true,
      validityPeriod: 365,
      authority: "Gas Safe Register",
      notes: "Required annually for rental properties - criminal offense if not provided"
    },
    {
      id: "gas_commissioning",
      name: "Boiler Commissioning Certificate",
      description: "Manufacturer commissioning record",
      category: "documentation",
      trade: "plumber",
      mandatory: true,
      authority: "Manufacturer",
      notes: "Required for warranty - must be registered with manufacturer"
    },
  ],

  // Electrical
  electrical: [
    {
      id: "elec_part_p",
      name: "Part P Notification",
      description: "Building Regulations Part P notification",
      category: "approval",
      trade: "electrician",
      mandatory: true,
      authority: "Local Authority or Competent Person Scheme",
      notes: "Required for notifiable work (new circuits, bathroom work, consumer unit)"
    },
    {
      id: "elec_eicr",
      name: "EICR (Electrical Safety Certificate)",
      description: "Electrical Installation Condition Report",
      category: "certification",
      trade: "electrician",
      mandatory: true,
      validityPeriod: 1825, // 5 years for rental
      authority: "NICEIC / NAPIT / ELECSA",
      notes: "Mandatory for rental properties - max 5-year validity"
    },
    {
      id: "elec_installation_cert",
      name: "Electrical Installation Certificate",
      description: "BS 7671 compliant installation certificate",
      category: "certification",
      trade: "electrician",
      mandatory: true,
      authority: "Competent Person Scheme",
      notes: "Required for all new electrical work"
    },
    {
      id: "elec_minor_works",
      name: "Minor Works Certificate",
      description: "Certificate for additions to existing circuits",
      category: "documentation",
      trade: "electrician",
      mandatory: false,
      notes: "For non-notifiable work (additional sockets, lights)"
    },
  ],

  // Fire Safety
  fire_safety: [
    {
      id: "fire_alarm_cert",
      name: "Fire Alarm Installation Certificate",
      description: "Certificate for Grade D/LD alarm system",
      category: "certification",
      trade: "electrician",
      mandatory: true,
      authority: "Fire alarm installer",
      notes: "Required for HMOs and new builds"
    },
    {
      id: "fire_risk_assessment",
      name: "Fire Risk Assessment",
      description: "Documented fire risk assessment",
      category: "documentation",
      trade: "all",
      mandatory: true,
      authority: "Competent person",
      notes: "Mandatory for HMOs and multi-occupied buildings"
    },
    {
      id: "emergency_lighting_cert",
      name: "Emergency Lighting Certificate",
      description: "Emergency lighting installation and test certificate",
      category: "certification",
      trade: "electrician",
      mandatory: true,
      authority: "Electrical contractor",
      notes: "Required for common areas in HMOs"
    },
  ],

  // HMO Specific
  hmo: [
    {
      id: "hmo_licence",
      name: "HMO Licence",
      description: "Mandatory or additional HMO licence",
      category: "approval",
      trade: "all",
      mandatory: true,
      validityPeriod: 1825, // 5 years
      authority: "Local Authority",
      notes: "Required before letting - criminal offense to operate without"
    },
    {
      id: "hmo_room_sizes",
      name: "Room Size Compliance",
      description: "Minimum room sizes verified",
      category: "inspection",
      trade: "all",
      mandatory: true,
      authority: "Local Authority",
      notes: "Single: 6.51m², Couple: 10.22m²"
    },
    {
      id: "hmo_amenity_ratios",
      name: "Amenity Ratio Compliance",
      description: "Kitchen/bathroom ratios verified",
      category: "inspection",
      trade: "all",
      mandatory: true,
      authority: "Local Authority",
      notes: "Check local authority specific requirements"
    },
  ],

  // Planning
  planning: [
    {
      id: "planning_permission",
      name: "Planning Permission",
      description: "Full planning permission approval",
      category: "approval",
      trade: "all",
      mandatory: false, // Depends on PD rights
      validityPeriod: 1095, // 3 years to commence
      authority: "Local Planning Authority",
      notes: "Required if not within Permitted Development"
    },
    {
      id: "pd_cert",
      name: "Lawful Development Certificate",
      description: "Confirmation of Permitted Development rights",
      category: "certification",
      trade: "all",
      mandatory: false,
      authority: "Local Planning Authority",
      notes: "Recommended for all PD projects for legal certainty"
    },
    {
      id: "party_wall",
      name: "Party Wall Agreement",
      description: "Party wall awards/agreements",
      category: "approval",
      trade: "all",
      mandatory: true, // When applicable
      authority: "Party Wall Surveyor",
      notes: "Required 2 months before work affecting party wall"
    },
  ],
};

// Validation Status
export type ValidationStatus = "pending" | "in_progress" | "passed" | "failed" | "expired";

export interface ValidationRecord {
  gateId: string;
  status: ValidationStatus;
  dateChecked?: string;
  expiryDate?: string;
  certificateNumber?: string;
  inspector?: string;
  notes?: string;
  documentUrl?: string;
}

// Job Completion Validation
export interface JobValidation {
  jobId: string;
  trade: string;
  requiredGates: string[];
  completedGates: ValidationRecord[];
  materialValidation: {
    allMaterialsLogged: boolean;
    complianceChecked: boolean;
    issues: string[];
  };
  canComplete: boolean;
  blockers: string[];
}

export function validateJobCompletion(params: {
  jobId: string;
  trade: string;
  projectType: string;
  isHMO: boolean;
  completedGates: ValidationRecord[];
}): JobValidation {
  const { jobId, trade, projectType, isHMO, completedGates } = params;

  // Get required gates for trade
  let requiredGateIds: string[] = [];

  // Building control gates
  if (["groundworks", "carpentry", "bricklayer"].includes(trade)) {
    requiredGateIds.push(...REGULATORY_GATES.building_control.filter(g => 
      g.trade === trade || g.trade === "all"
    ).map(g => g.id));
  }

  // Trade-specific gates
  if (trade === "plumber") {
    requiredGateIds.push(...REGULATORY_GATES.gas.map(g => g.id));
  }
  if (trade === "electrician") {
    requiredGateIds.push(...REGULATORY_GATES.electrical.map(g => g.id));
  }

  // HMO specific
  if (isHMO) {
    requiredGateIds.push(...REGULATORY_GATES.hmo.map(g => g.id));
    requiredGateIds.push(...REGULATORY_GATES.fire_safety.map(g => g.id));
  }

  // Check completion
  const passedGates = completedGates.filter(g => g.status === "passed").map(g => g.gateId);
  const blockers: string[] = [];

  for (const gateId of requiredGateIds) {
    const gate = Object.values(REGULATORY_GATES).flat().find(g => g.id === gateId);
    if (gate?.mandatory && !passedGates.includes(gateId)) {
      blockers.push(`${gate.name} not completed`);
    }
  }

  // Check expired gates
  const now = new Date();
  for (const record of completedGates) {
    if (record.expiryDate && new Date(record.expiryDate) < now) {
      const gate = Object.values(REGULATORY_GATES).flat().find(g => g.id === record.gateId);
      if (gate?.mandatory) {
        blockers.push(`${gate.name} has expired`);
      }
    }
  }

  return {
    jobId,
    trade,
    requiredGates: requiredGateIds,
    completedGates,
    materialValidation: {
      allMaterialsLogged: true, // Would be checked against materials database
      complianceChecked: true,
      issues: [],
    },
    canComplete: blockers.length === 0,
    blockers,
  };
}

// Get gates by trade
export function getGatesForTrade(trade: string, isHMO: boolean = false): RegulatoryGate[] {
  const gates: RegulatoryGate[] = [];

  // Building control for all
  gates.push(...REGULATORY_GATES.building_control.filter(g => 
    g.trade === trade || g.trade === "all"
  ));

  // Trade specific
  if (trade === "plumber") {
    gates.push(...REGULATORY_GATES.gas);
  }
  if (trade === "electrician") {
    gates.push(...REGULATORY_GATES.electrical);
  }

  // HMO requirements
  if (isHMO) {
    gates.push(...REGULATORY_GATES.hmo);
    gates.push(...REGULATORY_GATES.fire_safety);
  }

  return gates;
}
