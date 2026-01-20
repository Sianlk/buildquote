// Enhanced Critical Path Scheduling Engine
// Trade dependencies, phase sequencing, weather buffers, regulatory gating

import { REGULATORY_GATES, type RegulatoryGate } from "./job-validation-gates";

export const SCHEDULING_VERSION = "2026.01";

// Task Status
export type TaskStatus = "pending" | "ready" | "in_progress" | "blocked" | "completed" | "failed";

// Enhanced Task Interface
export interface ScheduleTask {
  id: string;
  name: string;
  trade: string;
  phase: string;
  duration: number; // Working days
  dependencies: string[];
  resources: string[];
  labourHours: number;
  machinery: string[];
  
  // Scheduling
  earlyStart?: number;
  earlyFinish?: number;
  lateStart?: number;
  lateFinish?: number;
  float?: number; // Slack time
  isCritical?: boolean;
  
  // Status
  status: TaskStatus;
  progress: number; // 0-100
  actualStart?: Date;
  actualFinish?: Date;
  
  // Gating
  requiredGates: string[];
  completedGates: string[];
  
  // Buffers
  weatherSensitive: boolean;
  weatherBuffer: number; // Additional days for weather
  leadTime: number; // Material lead time days
}

// Project Schedule
export interface ProjectSchedule {
  projectId: string;
  projectType: string;
  startDate: Date;
  tasks: ScheduleTask[];
  totalDuration: number;
  criticalPath: string[];
  phaseBreakdown: Record<string, { start: number; end: number; tasks: string[] }>;
  resourceCalendar: Map<number, { trades: string[]; machinery: string[] }>;
  regulatoryHolds: { taskId: string; gateId: string; description: string }[];
  weatherDays: number;
}

// Construction Phases
export const CONSTRUCTION_PHASES = [
  { id: "preliminaries", name: "Preliminaries", order: 1 },
  { id: "groundworks", name: "Groundworks", order: 2 },
  { id: "foundations", name: "Foundations", order: 3 },
  { id: "structure", name: "Structure", order: 4 },
  { id: "roof", name: "Roof", order: 5 },
  { id: "watertight", name: "Watertight Shell", order: 6 },
  { id: "first_fix", name: "First Fix M&E", order: 7 },
  { id: "plastering", name: "Plastering", order: 8 },
  { id: "second_fix", name: "Second Fix", order: 9 },
  { id: "finishes", name: "Finishes", order: 10 },
  { id: "external", name: "External Works", order: 11 },
  { id: "snagging", name: "Snagging & Handover", order: 12 },
];

// Extended Task Templates with full metadata
export const ENHANCED_TASK_TEMPLATES: Record<string, ScheduleTask[]> = {
  extension: [
    // Preliminaries
    {
      id: "site_setup",
      name: "Site Setup & Welfare",
      trade: "General",
      phase: "preliminaries",
      duration: 1,
      dependencies: [],
      resources: ["Site Manager"],
      labourHours: 8,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: ["bc_commencement"],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 0,
    },
    {
      id: "scaffold_erect",
      name: "Scaffold Erection",
      trade: "Scaffolder",
      phase: "preliminaries",
      duration: 2,
      dependencies: ["site_setup"],
      resources: ["Scaffolding team"],
      labourHours: 32,
      machinery: ["Scaffold tower", "Material hoist"],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 1,
      leadTime: 3,
    },

    // Groundworks
    {
      id: "excavation",
      name: "Foundation Excavation",
      trade: "Groundworks",
      phase: "groundworks",
      duration: 3,
      dependencies: ["site_setup"],
      resources: ["Machine operator", "Labourer x2"],
      labourHours: 48,
      machinery: ["Mini digger 3t", "Dumper 1t"],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 2,
      leadTime: 0,
    },
    {
      id: "foundation_concrete",
      name: "Foundation Concrete",
      trade: "Groundworks",
      phase: "foundations",
      duration: 2,
      dependencies: ["excavation"],
      resources: ["Concreter x2", "Pump operator"],
      labourHours: 32,
      machinery: ["Concrete pump"],
      status: "pending",
      progress: 0,
      requiredGates: ["bc_foundations"],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 1,
      leadTime: 2, // Concrete ordering
    },
    {
      id: "drainage",
      name: "Below Ground Drainage",
      trade: "Groundworks",
      phase: "groundworks",
      duration: 2,
      dependencies: ["excavation"],
      resources: ["Drainage engineer", "Labourer"],
      labourHours: 24,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: ["bc_drains"],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 1,
      leadTime: 3,
    },
    {
      id: "floor_slab",
      name: "Floor Slab",
      trade: "Groundworks",
      phase: "foundations",
      duration: 2,
      dependencies: ["foundation_concrete", "drainage"],
      resources: ["Concreter x2"],
      labourHours: 24,
      machinery: ["Power float"],
      status: "pending",
      progress: 0,
      requiredGates: ["bc_dpc"],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 1,
      leadTime: 2,
    },

    // Structure
    {
      id: "brickwork",
      name: "External Walls (Brickwork)",
      trade: "Bricklayer",
      phase: "structure",
      duration: 8,
      dependencies: ["floor_slab"],
      resources: ["Bricklayer x2", "Hod carrier"],
      labourHours: 128,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 3,
      leadTime: 5, // Brick delivery
    },
    {
      id: "steels",
      name: "Steel Installation",
      trade: "Steelwork",
      phase: "structure",
      duration: 1,
      dependencies: ["brickwork"],
      resources: ["Steel fixer x2"],
      labourHours: 16,
      machinery: ["Telehandler"],
      status: "pending",
      progress: 0,
      requiredGates: ["bc_structure"],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 14, // Steel fabrication
    },

    // Roof
    {
      id: "roof_structure",
      name: "Roof Structure",
      trade: "Carpenter",
      phase: "roof",
      duration: 4,
      dependencies: ["steels"],
      resources: ["Carpenter x2"],
      labourHours: 64,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 2,
      leadTime: 7,
    },
    {
      id: "roof_tiles",
      name: "Roof Tiling",
      trade: "Roofer",
      phase: "roof",
      duration: 3,
      dependencies: ["roof_structure"],
      resources: ["Roofer x2"],
      labourHours: 48,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: true,
      weatherBuffer: 2,
      leadTime: 5,
    },

    // Watertight
    {
      id: "windows_doors",
      name: "Windows & External Doors",
      trade: "Joiner",
      phase: "watertight",
      duration: 2,
      dependencies: ["brickwork"],
      resources: ["Window fitter x2"],
      labourHours: 32,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 21, // Window manufacturing
    },

    // First Fix
    {
      id: "first_fix_plumbing",
      name: "First Fix Plumbing",
      trade: "Plumber",
      phase: "first_fix",
      duration: 3,
      dependencies: ["windows_doors", "roof_tiles"],
      resources: ["Plumber"],
      labourHours: 24,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 3,
    },
    {
      id: "first_fix_electrical",
      name: "First Fix Electrical",
      trade: "Electrician",
      phase: "first_fix",
      duration: 3,
      dependencies: ["windows_doors", "roof_tiles"],
      resources: ["Electrician"],
      labourHours: 24,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: ["elec_part_p"],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 2,
    },
    {
      id: "insulation",
      name: "Insulation",
      trade: "Insulator",
      phase: "first_fix",
      duration: 2,
      dependencies: ["first_fix_plumbing", "first_fix_electrical"],
      resources: ["Insulator"],
      labourHours: 16,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 3,
    },

    // Plastering
    {
      id: "plasterboard",
      name: "Plasterboard",
      trade: "Plasterer",
      phase: "plastering",
      duration: 3,
      dependencies: ["insulation"],
      resources: ["Plasterer", "Labourer"],
      labourHours: 40,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 2,
    },
    {
      id: "skim",
      name: "Skim Coat",
      trade: "Plasterer",
      phase: "plastering",
      duration: 4,
      dependencies: ["plasterboard"],
      resources: ["Plasterer"],
      labourHours: 32,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 1,
    },

    // Second Fix
    {
      id: "second_fix_carpentry",
      name: "Second Fix Carpentry",
      trade: "Carpenter",
      phase: "second_fix",
      duration: 3,
      dependencies: ["skim"],
      resources: ["Carpenter"],
      labourHours: 24,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 7, // Door/skirting delivery
    },
    {
      id: "second_fix_plumbing",
      name: "Second Fix Plumbing",
      trade: "Plumber",
      phase: "second_fix",
      duration: 2,
      dependencies: ["skim"],
      resources: ["Plumber"],
      labourHours: 16,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: ["gas_safe_reg"],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 5,
    },
    {
      id: "second_fix_electrical",
      name: "Second Fix Electrical",
      trade: "Electrician",
      phase: "second_fix",
      duration: 2,
      dependencies: ["skim"],
      resources: ["Electrician"],
      labourHours: 16,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: ["elec_installation_cert"],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 2,
    },

    // Finishes
    {
      id: "decoration",
      name: "Decoration",
      trade: "Decorator",
      phase: "finishes",
      duration: 5,
      dependencies: ["second_fix_carpentry"],
      resources: ["Decorator x2"],
      labourHours: 80,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 1,
    },
    {
      id: "flooring",
      name: "Flooring",
      trade: "Floor Layer",
      phase: "finishes",
      duration: 2,
      dependencies: ["decoration"],
      resources: ["Floor layer"],
      labourHours: 16,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 7,
    },
    {
      id: "tiling",
      name: "Wall & Floor Tiling",
      trade: "Tiler",
      phase: "finishes",
      duration: 3,
      dependencies: ["second_fix_plumbing"],
      resources: ["Tiler"],
      labourHours: 24,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: [],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 5,
    },

    // Snagging
    {
      id: "snagging",
      name: "Snagging & Handover",
      trade: "All Trades",
      phase: "snagging",
      duration: 3,
      dependencies: ["flooring", "tiling", "second_fix_electrical"],
      resources: ["Site Manager"],
      labourHours: 24,
      machinery: [],
      status: "pending",
      progress: 0,
      requiredGates: ["bc_completion", "elec_eicr", "gas_safety_cert"],
      completedGates: [],
      weatherSensitive: false,
      weatherBuffer: 0,
      leadTime: 0,
    },
  ],
};

// Calculate Critical Path
export function calculateCriticalPath(tasks: ScheduleTask[]): ProjectSchedule {
  const taskMap = new Map<string, ScheduleTask>();
  tasks.forEach(t => taskMap.set(t.id, { ...t }));

  // Forward pass - calculate early start/finish
  const calculateEarlyTimes = (taskId: string): number => {
    const task = taskMap.get(taskId)!;
    if (task.earlyStart !== undefined) return task.earlyFinish!;

    if (task.dependencies.length === 0) {
      task.earlyStart = 1;
    } else {
      const maxDependency = Math.max(
        ...task.dependencies.map(depId => {
          const dep = taskMap.get(depId);
          if (!dep) return 0;
          return calculateEarlyTimes(depId);
        })
      );
      task.earlyStart = maxDependency + 1 + task.leadTime;
    }

    // Add weather buffer
    task.earlyFinish = task.earlyStart + task.duration + task.weatherBuffer - 1;
    return task.earlyFinish;
  };

  tasks.forEach(t => calculateEarlyTimes(t.id));

  // Find project duration
  const totalDuration = Math.max(...Array.from(taskMap.values()).map(t => t.earlyFinish || 0));

  // Backward pass - calculate late start/finish
  const calculateLateTimes = (taskId: string): number => {
    const task = taskMap.get(taskId)!;
    if (task.lateFinish !== undefined) return task.lateStart!;

    // Find all tasks that depend on this one
    const dependents = Array.from(taskMap.values()).filter(t => 
      t.dependencies.includes(taskId)
    );

    if (dependents.length === 0) {
      task.lateFinish = totalDuration;
    } else {
      const minDependent = Math.min(
        ...dependents.map(dep => {
          calculateLateTimes(dep.id);
          return (dep.lateStart || totalDuration) - dep.leadTime;
        })
      );
      task.lateFinish = minDependent - 1;
    }

    task.lateStart = task.lateFinish - task.duration - task.weatherBuffer + 1;
    task.float = task.lateStart - (task.earlyStart || 0);
    task.isCritical = task.float === 0;

    return task.lateStart;
  };

  tasks.forEach(t => calculateLateTimes(t.id));

  // Build critical path
  const criticalPath = Array.from(taskMap.values())
    .filter(t => t.isCritical)
    .sort((a, b) => (a.earlyStart || 0) - (b.earlyStart || 0))
    .map(t => t.id);

  // Phase breakdown
  const phaseBreakdown: Record<string, { start: number; end: number; tasks: string[] }> = {};
  for (const phase of CONSTRUCTION_PHASES) {
    const phaseTasks = Array.from(taskMap.values()).filter(t => t.phase === phase.id);
    if (phaseTasks.length > 0) {
      phaseBreakdown[phase.id] = {
        start: Math.min(...phaseTasks.map(t => t.earlyStart || 0)),
        end: Math.max(...phaseTasks.map(t => t.earlyFinish || 0)),
        tasks: phaseTasks.map(t => t.id),
      };
    }
  }

  // Weather days calculation
  const weatherDays = Array.from(taskMap.values()).reduce((sum, t) => sum + t.weatherBuffer, 0);

  // Regulatory holds
  const regulatoryHolds = Array.from(taskMap.values())
    .filter(t => t.requiredGates.length > 0)
    .flatMap(t => t.requiredGates.map(g => {
      const gate = Object.values(REGULATORY_GATES).flat().find(rg => rg.id === g);
      return {
        taskId: t.id,
        gateId: g,
        description: gate?.name || g,
      };
    }));

  return {
    projectId: "",
    projectType: "extension",
    startDate: new Date(),
    tasks: Array.from(taskMap.values()),
    totalDuration,
    criticalPath,
    phaseBreakdown,
    resourceCalendar: new Map(),
    regulatoryHolds,
    weatherDays,
  };
}

// Get trade colors
export const TRADE_COLORS: Record<string, string> = {
  "General": "hsl(var(--chart-1))",
  "Scaffolder": "hsl(30, 60%, 50%)",
  "Groundworks": "hsl(var(--chart-2))",
  "Bricklayer": "hsl(15, 70%, 55%)",
  "Steelwork": "hsl(0, 0%, 50%)",
  "Carpenter": "hsl(var(--chart-3))",
  "Roofer": "hsl(var(--chart-4))",
  "Joiner": "hsl(var(--chart-5))",
  "Plumber": "hsl(210, 70%, 50%)",
  "Electrician": "hsl(45, 80%, 50%)",
  "Insulator": "hsl(90, 50%, 50%)",
  "Plasterer": "hsl(280, 60%, 60%)",
  "Decorator": "hsl(340, 70%, 55%)",
  "Floor Layer": "hsl(160, 50%, 45%)",
  "Tiler": "hsl(200, 60%, 50%)",
  "All Trades": "hsl(var(--primary))",
};
