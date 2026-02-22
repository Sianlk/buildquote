// Versioned Compliance Engine - Feb 2026 UK Building Regulations
// Approved Documents A-P, transitional logic, evidence tracking, scoring

export const COMPLIANCE_DATASET_VERSION = "2026.02";

export interface ComplianceDataset {
  id: string;
  jurisdiction: "england" | "wales" | "scotland" | "northern_ireland";
  effectiveFrom: string;
  versionLabel: string;
}

export type SeverityLevel = "critical" | "major" | "minor" | "advisory";
export type LogicType = "checklist" | "threshold" | "evidence_required";

export interface ComplianceRule {
  id: string;
  regulationName: string;
  sectionReference: string;
  approvedDocument: string;
  jurisdiction: string;
  severityLevel: SeverityLevel;
  effectiveFrom: string;
  amendmentVersion: string;
  logicType: LogicType;
  thresholdValue?: number;
  thresholdUnit?: string;
  guidanceText: string;
  checkFn?: (project: ProjectComplianceData) => ComplianceCheckResult;
}

export interface ProjectComplianceData {
  projectType: string;
  floorArea: number;
  height: number;
  wallType: string;
  roofType: string;
  foundationType: string;
  glazingArea: number;
  totalWallArea: number;
  electricalPoints: number;
  plumbingPoints: number;
  heatingRadiators: number;
  rooms: { type: string; sqm: number }[];
  postcode?: string;
  planningSubmissionDate?: string;
}

export interface ComplianceCheckResult {
  ruleId: string;
  passed: boolean;
  status: "pass" | "fail" | "warning" | "info";
  details: string;
  regulationRef: string;
  approvedDocument: string;
  evidenceRequired?: string;
}

// Feb 2026 Approved Documents with version tracking
export const APPROVED_DOCUMENTS: ComplianceRule[] = [
  // Part A - Structure
  {
    id: "part-a-foundations",
    regulationName: "Part A - Structural Safety",
    sectionReference: "A1/A2",
    approvedDocument: "Approved Document A",
    jurisdiction: "england",
    severityLevel: "critical",
    effectiveFrom: "2024-06-01",
    amendmentVersion: "2024 Edition",
    logicType: "checklist",
    guidanceText: "Foundation design must be verified by a structural engineer. Strip foundations minimum 450mm deep in firm clay.",
    checkFn: (p) => ({
      ruleId: "part-a-foundations",
      passed: true,
      status: "info",
      details: `Foundation type: ${p.foundationType}. Structural engineer verification required for all foundation designs.`,
      regulationRef: "Building Regulations 2010, Schedule 1, Part A",
      approvedDocument: "Approved Document A (2024 Edition)",
      evidenceRequired: "Structural engineer's calculation certificate"
    })
  },
  // Part B - Fire Safety
  {
    id: "part-b-escape",
    regulationName: "Part B - Fire Safety",
    sectionReference: "B1",
    approvedDocument: "Approved Document B Vol 1",
    jurisdiction: "england",
    severityLevel: "critical",
    effectiveFrom: "2024-06-01",
    amendmentVersion: "2024 Edition (post-Grenfell)",
    logicType: "checklist",
    guidanceText: "Means of escape: inner rooms require protected corridor or alternative escape window. Habitable rooms above 4.5m require protected stairway.",
    checkFn: (p) => {
      const hasUpperFloors = p.projectType.includes("double") || p.projectType.includes("loft");
      return {
        ruleId: "part-b-escape",
        passed: true,
        status: hasUpperFloors ? "warning" : "pass",
        details: hasUpperFloors
          ? "Multi-storey: protected stairway and fire doors (FD30S) required. Smoke/heat detection to BS 5839-6 Grade D LD2 minimum."
          : "Single storey: ensure adequate escape routes and smoke detection.",
        regulationRef: "Building Regulations 2010, Schedule 1, Part B1",
        approvedDocument: "Approved Document B Vol 1 (2024)",
        evidenceRequired: "Fire safety strategy document"
      };
    }
  },
  {
    id: "part-b-materials",
    regulationName: "Part B - Fire Safety (Materials)",
    sectionReference: "B2-B5",
    approvedDocument: "Approved Document B Vol 2",
    jurisdiction: "england",
    severityLevel: "critical",
    effectiveFrom: "2024-06-01",
    amendmentVersion: "2024 Edition",
    logicType: "checklist",
    guidanceText: "External wall materials must achieve Class B-s3,d2 or better for buildings over 11m. Combustible materials banned above 18m.",
  },
  // Part C - Site Preparation
  {
    id: "part-c-moisture",
    regulationName: "Part C - Site Preparation & Moisture",
    sectionReference: "C1-C2",
    approvedDocument: "Approved Document C",
    jurisdiction: "england",
    severityLevel: "major",
    effectiveFrom: "2013-01-01",
    amendmentVersion: "2013 Edition",
    logicType: "checklist",
    guidanceText: "DPC minimum 150mm above external ground level. DPM to ground floors. Adequate subfloor ventilation for suspended floors.",
  },
  // Part E - Sound
  {
    id: "part-e-sound",
    regulationName: "Part E - Resistance to Sound",
    sectionReference: "E1-E4",
    approvedDocument: "Approved Document E",
    jurisdiction: "england",
    severityLevel: "minor",
    effectiveFrom: "2015-01-01",
    amendmentVersion: "2015 Edition",
    logicType: "threshold",
    thresholdValue: 45,
    thresholdUnit: "dB Rw",
    guidanceText: "Separating walls and floors between dwellings must achieve minimum 45 dB Rw airborne sound insulation.",
  },
  // Part F - Ventilation
  {
    id: "part-f-ventilation",
    regulationName: "Part F - Ventilation",
    sectionReference: "F1",
    approvedDocument: "Approved Document F Vol 1",
    jurisdiction: "england",
    severityLevel: "major",
    effectiveFrom: "2022-06-15",
    amendmentVersion: "2021 Edition",
    logicType: "checklist",
    guidanceText: "All habitable rooms require background ventilation (trickle vents). Kitchens: 30 l/s extract. Bathrooms: 15 l/s extract. Whole dwelling ventilation rate applies.",
    checkFn: (p) => ({
      ruleId: "part-f-ventilation",
      passed: true,
      status: "warning",
      details: `Floor area ${p.floorArea}m². Ensure trickle vents to all windows, extract fans to wet rooms (kitchen 30 l/s, bathroom 15 l/s), and whole-dwelling ventilation strategy.`,
      regulationRef: "Building Regulations 2010, Schedule 1, Part F",
      approvedDocument: "Approved Document F Vol 1 (2021 Edition)",
    })
  },
  // Part K - Protection from Falling
  {
    id: "part-k-guarding",
    regulationName: "Part K - Protection from Falling",
    sectionReference: "K1-K6",
    approvedDocument: "Approved Document K",
    jurisdiction: "england",
    severityLevel: "critical",
    effectiveFrom: "2013-01-01",
    amendmentVersion: "2013 Edition",
    logicType: "threshold",
    thresholdValue: 600,
    thresholdUnit: "mm drop",
    guidanceText: "Guarding required where drop exceeds 600mm. Minimum guarding height: 900mm for floors/landings below 600mm above ground, 1100mm for balconies/roof edges.",
  },
  // Part L - Conservation of Energy (2025 update)
  {
    id: "part-l-fabric",
    regulationName: "Part L - Conservation of Fuel & Power",
    sectionReference: "L1A/L1B",
    approvedDocument: "Approved Document L Vol 1",
    jurisdiction: "england",
    severityLevel: "critical",
    effectiveFrom: "2023-06-15",
    amendmentVersion: "2022 Edition (Future Homes Standard interim)",
    logicType: "threshold",
    guidanceText: "New builds: walls U-value ≤0.18 W/m²K, floor ≤0.13, roof ≤0.11, windows ≤1.2. Extensions: walls ≤0.28, floor ≤0.22, roof ≤0.16, windows ≤1.4.",
    checkFn: (p) => {
      const isNewBuild = p.projectType === "new_build";
      const glazingRatio = p.totalWallArea > 0 ? (p.glazingArea / p.totalWallArea) * 100 : 0;
      const maxGlazing = isNewBuild ? 25 : 25;
      const passed = glazingRatio <= maxGlazing;
      return {
        ruleId: "part-l-fabric",
        passed,
        status: passed ? "pass" : "fail",
        details: `Glazing ratio: ${glazingRatio.toFixed(1)}% (max ${maxGlazing}%). ${isNewBuild ? "New build" : "Extension"} U-values apply. SAP/SBEM calculation required.`,
        regulationRef: "Building Regulations 2010, Schedule 1, Part L",
        approvedDocument: "Approved Document L Vol 1 (2022 Edition)",
        evidenceRequired: "SAP calculation or SBEM report"
      };
    }
  },
  // Part M - Access
  {
    id: "part-m-access",
    regulationName: "Part M - Access to & Use of Buildings",
    sectionReference: "M4(1)",
    approvedDocument: "Approved Document M Vol 1",
    jurisdiction: "england",
    severityLevel: "major",
    effectiveFrom: "2024-06-01",
    amendmentVersion: "2024 Edition",
    logicType: "checklist",
    guidanceText: "Category 1 (Visitable): level or ramped approach, minimum 850mm clear door opening width, WC at entrance level. New dwellings only.",
    checkFn: (p) => {
      const isNewBuild = p.projectType === "new_build";
      return {
        ruleId: "part-m-access",
        passed: true,
        status: isNewBuild ? "warning" : "info",
        details: isNewBuild
          ? "New dwelling: M4(1) Visitable standard mandatory. Ensure level approach, 850mm door widths, and entrance-level WC."
          : "Extension: ensure any new entrance meets accessibility requirements.",
        regulationRef: "Building Regulations 2010, Schedule 1, Part M",
        approvedDocument: "Approved Document M Vol 1 (2024 Edition)",
      };
    }
  },
  // Part O - Overheating (new)
  {
    id: "part-o-overheating",
    regulationName: "Part O - Overheating",
    sectionReference: "O1",
    approvedDocument: "Approved Document O",
    jurisdiction: "england",
    severityLevel: "major",
    effectiveFrom: "2022-06-15",
    amendmentVersion: "2022 Edition",
    logicType: "checklist",
    guidanceText: "New residential buildings must limit unwanted solar gains and provide adequate purge ventilation. Simplified method or dynamic thermal modelling required.",
    checkFn: (p) => {
      const isNewBuild = p.projectType === "new_build";
      return {
        ruleId: "part-o-overheating",
        passed: true,
        status: isNewBuild ? "warning" : "info",
        details: isNewBuild
          ? "New build: Part O overheating assessment required. Consider glazing orientation, shading, and cross-ventilation."
          : "Extension: consider impact on overheating risk for affected rooms.",
        regulationRef: "Building Regulations 2010, Schedule 1, Part O",
        approvedDocument: "Approved Document O (2022 Edition)",
      };
    }
  },
  // Part P - Electrical Safety
  {
    id: "part-p-electrical",
    regulationName: "Part P - Electrical Safety",
    sectionReference: "P1",
    approvedDocument: "Approved Document P",
    jurisdiction: "england",
    severityLevel: "critical",
    effectiveFrom: "2013-01-01",
    amendmentVersion: "2013 Edition",
    logicType: "threshold",
    guidanceText: "Notifiable electrical work (new circuits, consumer units, work in special locations) must be carried out by a Part P registered installer or inspected by Building Control.",
    checkFn: (p) => ({
      ruleId: "part-p-electrical",
      passed: p.electricalPoints > 0,
      status: p.electricalPoints > 0 ? "warning" : "info",
      details: p.electricalPoints > 0
        ? `${p.electricalPoints} electrical points specified. Part P registered installer required for notifiable work. EICR on completion.`
        : "No electrical points specified. If adding circuits, Part P compliance required.",
      regulationRef: "Building Regulations 2010, Schedule 1, Part P",
      approvedDocument: "Approved Document P (2013 Edition)",
      evidenceRequired: "Part P certificate / EICR"
    })
  },
  // Permitted Development
  {
    id: "pd-rear-extension",
    regulationName: "Permitted Development Rights",
    sectionReference: "Class A, Schedule 2, Part 1",
    approvedDocument: "GPDO 2015 (as amended)",
    jurisdiction: "england",
    severityLevel: "major",
    effectiveFrom: "2020-08-01",
    amendmentVersion: "2024 Amendment",
    logicType: "threshold",
    thresholdValue: 4,
    thresholdUnit: "metres (detached)",
    guidanceText: "Rear extensions: max 3m (attached) or 4m (detached) under PD. Max height 4m, eaves height must not exceed existing dwelling eaves.",
  },
];

// Run all applicable compliance checks for a project
export function runComplianceChecks(project: ProjectComplianceData): {
  results: ComplianceCheckResult[];
  score: number;
  datasetVersion: string;
  timestamp: string;
  disclaimer: string;
} {
  const results: ComplianceCheckResult[] = [];

  for (const rule of APPROVED_DOCUMENTS) {
    if (rule.checkFn) {
      results.push(rule.checkFn(project));
    } else {
      results.push({
        ruleId: rule.id,
        passed: true,
        status: "info",
        details: rule.guidanceText,
        regulationRef: `${rule.regulationName} - ${rule.sectionReference}`,
        approvedDocument: `${rule.approvedDocument} (${rule.amendmentVersion})`,
      });
    }
  }

  const total = results.length;
  const passed = results.filter(r => r.status === "pass" || r.status === "info").length;
  const score = total > 0 ? Math.round((passed / total) * 100) : 0;

  return {
    results,
    score,
    datasetVersion: COMPLIANCE_DATASET_VERSION,
    timestamp: new Date().toISOString(),
    disclaimer: "This compliance check is for guidance only and does not constitute professional certification. Always consult a qualified building control surveyor or approved inspector before commencing works."
  };
}

// Check transitional provisions
export function checkTransitionalProvisions(
  planningSubmissionDate: string,
  ruleEffectiveFrom: string
): { transitional: boolean; message: string } {
  const submission = new Date(planningSubmissionDate);
  const effective = new Date(ruleEffectiveFrom);

  if (submission < effective) {
    return {
      transitional: true,
      message: `Planning submitted (${planningSubmissionDate}) before amendment effective date (${ruleEffectiveFrom}). Earlier version of regulations may apply subject to transitional provisions.`
    };
  }

  return { transitional: false, message: "Current regulations apply." };
}

// Get applicable documents for project type
export function getApplicableDocuments(projectType: string): string[] {
  const core = ["A", "B", "C", "F", "K", "L", "P"];
  const newBuild = ["E", "G", "H", "J", "M", "O", "Q", "R", "S"];

  if (projectType === "new_build") return [...core, ...newBuild];
  if (projectType.includes("loft")) return [...core, "M"];
  if (projectType.includes("hmo")) return [...core, "E", "M"];
  return core;
}
