// Carpentry Module Data - Timber Span Tables, Joist Calculators, Building Regs Guidance

export interface TimberSpanData {
  timberSize: string;
  gradeC16: string;
  gradeC24: string;
  application: string;
  maxCentres: string;
}

export interface JoistSpanData {
  joistSize: string;
  spacing400mm: string;
  spacing450mm: string;
  spacing600mm: string;
  deadLoad: string;
}

export interface BuildingRegGuidance {
  id: string;
  category: string;
  requirement: string;
  details: string;
  reference: string;
}

export interface StructuralChecklistItem {
  id: string;
  phase: string;
  task: string;
  requirement: string;
  buildingRegRef: string;
  critical: boolean;
}

// Floor Joist Span Tables (Domestic - 1.5kN/m² imposed load)
export const FLOOR_JOIST_SPANS_C16: JoistSpanData[] = [
  { joistSize: "38 x 97mm", spacing400mm: "1.55m", spacing450mm: "1.48m", spacing600mm: "1.30m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 122mm", spacing400mm: "2.10m", spacing450mm: "2.00m", spacing600mm: "1.78m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 147mm", spacing400mm: "2.64m", spacing450mm: "2.53m", spacing600mm: "2.27m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 170mm", spacing400mm: "3.06m", spacing450mm: "2.94m", spacing600mm: "2.64m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 195mm", spacing400mm: "3.50m", spacing450mm: "3.36m", spacing600mm: "3.03m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 220mm", spacing400mm: "3.93m", spacing450mm: "3.78m", spacing600mm: "3.40m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 147mm", spacing400mm: "2.75m", spacing450mm: "2.64m", spacing600mm: "2.37m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 170mm", spacing400mm: "3.18m", spacing450mm: "3.06m", spacing600mm: "2.76m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 195mm", spacing400mm: "3.63m", spacing450mm: "3.50m", spacing600mm: "3.16m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 220mm", spacing400mm: "4.09m", spacing450mm: "3.93m", spacing600mm: "3.55m", deadLoad: "0.25 kN/m²" }
];

// Floor Joist Span Tables C24 Grade
export const FLOOR_JOIST_SPANS_C24: JoistSpanData[] = [
  { joistSize: "38 x 97mm", spacing400mm: "1.72m", spacing450mm: "1.64m", spacing600mm: "1.44m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 122mm", spacing400mm: "2.33m", spacing450mm: "2.22m", spacing600mm: "1.97m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 147mm", spacing400mm: "2.93m", spacing450mm: "2.81m", spacing600mm: "2.52m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 170mm", spacing400mm: "3.40m", spacing450mm: "3.26m", spacing600mm: "2.93m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 195mm", spacing400mm: "3.88m", spacing450mm: "3.73m", spacing600mm: "3.36m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 220mm", spacing400mm: "4.36m", spacing450mm: "4.19m", spacing600mm: "3.78m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 147mm", spacing400mm: "3.05m", spacing450mm: "2.93m", spacing600mm: "2.64m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 170mm", spacing400mm: "3.53m", spacing450mm: "3.40m", spacing600mm: "3.06m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 195mm", spacing400mm: "4.03m", spacing450mm: "3.88m", spacing600mm: "3.51m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 220mm", spacing400mm: "4.54m", spacing450mm: "4.36m", spacing600mm: "3.94m", deadLoad: "0.25 kN/m²" }
];

// Ceiling Joist Spans (No storage)
export const CEILING_JOIST_SPANS_C16: JoistSpanData[] = [
  { joistSize: "38 x 97mm", spacing400mm: "2.56m", spacing450mm: "2.45m", spacing600mm: "2.15m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 122mm", spacing400mm: "3.47m", spacing450mm: "3.32m", spacing600mm: "2.92m", deadLoad: "0.25 kN/m²" },
  { joistSize: "38 x 147mm", spacing400mm: "4.37m", spacing450mm: "4.19m", spacing600mm: "3.67m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 97mm", spacing400mm: "2.68m", spacing450mm: "2.56m", spacing600mm: "2.25m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 122mm", spacing400mm: "3.62m", spacing450mm: "3.47m", spacing600mm: "3.05m", deadLoad: "0.25 kN/m²" },
  { joistSize: "47 x 147mm", spacing400mm: "4.56m", spacing450mm: "4.37m", spacing600mm: "3.84m", deadLoad: "0.25 kN/m²" }
];

// Roof Rafter Spans (Pitched roof 22.5° to 30°)
export const RAFTER_SPANS_C16: TimberSpanData[] = [
  { timberSize: "38 x 97mm", gradeC16: "1.80m", gradeC24: "2.00m", application: "Light roof covering", maxCentres: "400mm" },
  { timberSize: "38 x 122mm", gradeC16: "2.44m", gradeC24: "2.71m", application: "Standard tiles", maxCentres: "400mm" },
  { timberSize: "38 x 147mm", gradeC16: "3.07m", gradeC24: "3.41m", application: "Heavy tiles/slates", maxCentres: "400mm" },
  { timberSize: "47 x 122mm", gradeC16: "2.55m", gradeC24: "2.83m", application: "Standard tiles", maxCentres: "450mm" },
  { timberSize: "47 x 147mm", gradeC16: "3.20m", gradeC24: "3.56m", application: "Heavy tiles/slates", maxCentres: "450mm" },
  { timberSize: "47 x 170mm", gradeC16: "3.71m", gradeC24: "4.12m", application: "Heavy tiles/slates", maxCentres: "600mm" },
  { timberSize: "47 x 195mm", gradeC16: "4.24m", gradeC24: "4.71m", application: "Snow load areas", maxCentres: "600mm" }
];

// Building Regulations Guidance for Structural Carpentry
export const BUILDING_REG_GUIDANCE: BuildingRegGuidance[] = [
  {
    id: "br-1",
    category: "Part A - Structure",
    requirement: "Structural Stability",
    details: "All structural timber must be properly sized, graded, and fixed to ensure building stability. Use BS 5268 or Eurocode 5 for design.",
    reference: "Approved Document A"
  },
  {
    id: "br-2",
    category: "Part A - Structure",
    requirement: "Timber Grading",
    details: "Structural timber must be stress graded to C16, C24, or TR26 and marked accordingly. Use graded timber from approved suppliers.",
    reference: "BS 4978"
  },
  {
    id: "br-3",
    category: "Part A - Structure",
    requirement: "Joist Hangers",
    details: "Use appropriate joist hangers where joists bear onto masonry or steelwork. Hangers must be specified for the load and joist size.",
    reference: "AD A Section 2C"
  },
  {
    id: "br-4",
    category: "Part B - Fire Safety",
    requirement: "Fire Stopping",
    details: "All holes through fire-resisting construction must be fire stopped. Timber must achieve required fire resistance periods.",
    reference: "Approved Document B"
  },
  {
    id: "br-5",
    category: "Part B - Fire Safety",
    requirement: "30-Minute Fire Resistance",
    details: "Domestic floors typically require 30-minute fire resistance. Achieved through ceiling specification and insulation.",
    reference: "AD B Table A1"
  },
  {
    id: "br-6",
    category: "Part C - Damp",
    requirement: "Timber Treatment",
    details: "All timber in contact with masonry or in damp locations must be treated with preservative. DPC to be provided.",
    reference: "Approved Document C"
  },
  {
    id: "br-7",
    category: "Part E - Sound",
    requirement: "Sound Insulation",
    details: "Separating floors between dwellings must achieve minimum 45dB airborne and 62dB impact sound insulation.",
    reference: "Approved Document E"
  },
  {
    id: "br-8",
    category: "Part L - Thermal",
    requirement: "Floor U-Values",
    details: "Ground floors and exposed floors must achieve U-value of 0.18 W/m²K (new build) or as existing (refurbishment).",
    reference: "Approved Document L"
  },
  {
    id: "br-9",
    category: "Part K - Protection",
    requirement: "Staircase Regulations",
    details: "Max rise 220mm, min going 220mm, max pitch 42°. Handrails required 900mm-1000mm height. Balustrades max 100mm gap.",
    reference: "Approved Document K"
  },
  {
    id: "br-10",
    category: "Part K - Protection",
    requirement: "Loft Conversions",
    details: "Loft floor must support 1.5kN/m² imposed load. Fire escape route to ground floor required. Party wall fire stopping essential.",
    reference: "AD K & AD B"
  }
];

// Structural Work Checklist
export const STRUCTURAL_WORK_CHECKLIST: StructuralChecklistItem[] = [
  {
    id: "sw-1",
    phase: "Planning",
    task: "Structural Engineer Assessment",
    requirement: "Complex structural work requires SE calculations and drawings. Building Control approval needed.",
    buildingRegRef: "Part A",
    critical: true
  },
  {
    id: "sw-2",
    phase: "Planning",
    task: "Building Control Notification",
    requirement: "Submit Building Notice or Full Plans application before starting notifiable work.",
    buildingRegRef: "Building Regulations",
    critical: true
  },
  {
    id: "sw-3",
    phase: "Materials",
    task: "Timber Grading Verification",
    requirement: "Check all structural timber is correctly graded and marked. Keep delivery notes for inspection.",
    buildingRegRef: "BS 4978",
    critical: true
  },
  {
    id: "sw-4",
    phase: "Materials",
    task: "Moisture Content Check",
    requirement: "Timber should be 18-22% MC for internal use. Check with moisture meter.",
    buildingRegRef: "BS 5268-2",
    critical: false
  },
  {
    id: "sw-5",
    phase: "Installation",
    task: "Bearing Length Check",
    requirement: "Minimum 50mm bearing on masonry, 40mm on steel. Use joist hangers where appropriate.",
    buildingRegRef: "Part A",
    critical: true
  },
  {
    id: "sw-6",
    phase: "Installation",
    task: "Noggin Installation",
    requirement: "Install solid blocking/noggins at 1.2m centres for joists over 2.5m span. Also at partition positions.",
    buildingRegRef: "Best Practice",
    critical: false
  },
  {
    id: "sw-7",
    phase: "Installation",
    task: "Strapping and Fixing",
    requirement: "Install lateral restraint straps to external walls at 2m centres. L-straps at gable walls.",
    buildingRegRef: "Part A 2C",
    critical: true
  },
  {
    id: "sw-8",
    phase: "Installation",
    task: "Trimming Around Openings",
    requirement: "Install trimmers and trimming joists around stairwell openings. Hangers or notched joints.",
    buildingRegRef: "Part A",
    critical: true
  },
  {
    id: "sw-9",
    phase: "Completion",
    task: "Building Control Inspection",
    requirement: "Request inspection at appropriate stages. Structural work before covering up.",
    buildingRegRef: "Building Regulations",
    critical: true
  },
  {
    id: "sw-10",
    phase: "Completion",
    task: "Completion Certificate",
    requirement: "Obtain completion certificate from Building Control once all work approved.",
    buildingRegRef: "Building Regulations",
    critical: true
  }
];

// Stud Wall Specifications
export const STUD_WALL_SPECS: Array<{
  application: string;
  studSize: string;
  centres: string;
  headPlate: string;
  solePlate: string;
  noggings: string;
}> = [
  { application: "Non-loadbearing partition", studSize: "38 x 63mm", centres: "400-600mm", headPlate: "Same as stud", solePlate: "Same as stud", noggings: "Mid-height or at board edges" },
  { application: "Standard partition (plasterboard)", studSize: "38 x 89mm", centres: "400mm", headPlate: "Double if long span", solePlate: "Same as stud", noggings: "1200mm centres" },
  { application: "Tall partition (>2.7m)", studSize: "47 x 100mm", centres: "400mm", headPlate: "Double", solePlate: "Same as stud", noggings: "800mm centres" },
  { application: "Loadbearing partition", studSize: "47 x 100mm min", centres: "400mm", headPlate: "Double", solePlate: "Double", noggings: "600mm centres" },
  { application: "Sound insulation partition", studSize: "47 x 100mm", centres: "400mm", headPlate: "Double", solePlate: "Same as stud", noggings: "At acoustic insulation joints" }
];

// Notching and Drilling Rules
export const NOTCHING_DRILLING_RULES: Array<{
  element: string;
  notchingZone: string;
  maxNotchDepth: string;
  drillingZone: string;
  maxHoleDiameter: string;
}> = [
  { element: "Floor Joists", notchingZone: "0.07 to 0.25 span from support", maxNotchDepth: "0.125 x depth", drillingZone: "0.25 to 0.4 span from support", maxHoleDiameter: "0.25 x depth" },
  { element: "Ceiling Joists", notchingZone: "Not recommended", maxNotchDepth: "N/A", drillingZone: "Centre third of span", maxHoleDiameter: "0.25 x depth" },
  { element: "Studs", notchingZone: "Top third of stud", maxNotchDepth: "0.33 x stud width", drillingZone: "Centre of stud", maxHoleDiameter: "0.25 x stud width" }
];

// Joist span calculator
export function calculateJoistSize(span: number, spacing: number, grade: 'C16' | 'C24'): string {
  const table = grade === 'C16' ? FLOOR_JOIST_SPANS_C16 : FLOOR_JOIST_SPANS_C24;
  const spacingKey = spacing <= 400 ? 'spacing400mm' : spacing <= 450 ? 'spacing450mm' : 'spacing600mm';
  
  for (const joist of table) {
    const maxSpan = parseFloat(joist[spacingKey].replace('m', ''));
    if (maxSpan >= span) {
      return joist.joistSize;
    }
  }
  return "Engineered joists required - span exceeds table";
}

// Rafter sizing calculator
export function calculateRafterSize(span: number, centres: number, grade: 'C16' | 'C24'): string {
  const gradeKey = grade === 'C16' ? 'gradeC16' : 'gradeC24';
  
  for (const rafter of RAFTER_SPANS_C16) {
    const maxCentres = parseInt(rafter.maxCentres.replace('mm', ''));
    const maxSpan = parseFloat(rafter[gradeKey].replace('m', ''));
    if (maxSpan >= span && maxCentres >= centres) {
      return rafter.timberSize;
    }
  }
  return "Engineered solution required";
}

// Calculate max notch depth
export function calculateMaxNotchDepth(joistDepth: number): number {
  return joistDepth * 0.125;
}

// Calculate max hole diameter
export function calculateMaxHoleDiameter(joistDepth: number): number {
  return joistDepth * 0.25;
}
