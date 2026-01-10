// Schedules Module Data - Gantt Charts & Task Dependencies

export interface ProjectTask {
  id: string;
  name: string;
  trade: string;
  duration: number; // days
  dependencies: string[]; // task IDs
  resources: string[];
  startDay?: number;
  endDay?: number;
  progress?: number;
  color?: string;
}

export interface GanttData {
  tasks: ProjectTask[];
  projectDuration: number;
  criticalPath: string[];
}

// Standard construction task templates by project type
export const TASK_TEMPLATES: Record<string, ProjectTask[]> = {
  extension: [
    { id: 'foundations', name: 'Foundations', trade: 'Groundworks', duration: 5, dependencies: [], resources: ['Mini digger', 'Concrete mixer'] },
    { id: 'drainage', name: 'Below Ground Drainage', trade: 'Groundworks', duration: 3, dependencies: ['foundations'], resources: ['Pipe laser'] },
    { id: 'floor_slab', name: 'Floor Slab', trade: 'Groundworks', duration: 2, dependencies: ['drainage'], resources: ['Power float'] },
    { id: 'dpc', name: 'DPC & DPM', trade: 'Bricklayer', duration: 1, dependencies: ['floor_slab'], resources: [] },
    { id: 'brickwork', name: 'External Walls', trade: 'Bricklayer', duration: 8, dependencies: ['dpc'], resources: ['Scaffolding'] },
    { id: 'roof_structure', name: 'Roof Structure', trade: 'Carpenter', duration: 4, dependencies: ['brickwork'], resources: ['Scaffolding'] },
    { id: 'roof_tiles', name: 'Roof Tiling', trade: 'Roofer', duration: 3, dependencies: ['roof_structure'], resources: [] },
    { id: 'windows', name: 'Windows & Doors', trade: 'Joiner', duration: 2, dependencies: ['brickwork'], resources: [] },
    { id: 'first_fix_plumbing', name: 'First Fix Plumbing', trade: 'Plumber', duration: 3, dependencies: ['windows'], resources: [] },
    { id: 'first_fix_electrical', name: 'First Fix Electrical', trade: 'Electrician', duration: 3, dependencies: ['windows'], resources: [] },
    { id: 'plastering', name: 'Plastering', trade: 'Plasterer', duration: 5, dependencies: ['first_fix_plumbing', 'first_fix_electrical'], resources: [] },
    { id: 'second_fix_carpentry', name: 'Second Fix Carpentry', trade: 'Carpenter', duration: 3, dependencies: ['plastering'], resources: [] },
    { id: 'second_fix_plumbing', name: 'Second Fix Plumbing', trade: 'Plumber', duration: 2, dependencies: ['plastering'], resources: [] },
    { id: 'second_fix_electrical', name: 'Second Fix Electrical', trade: 'Electrician', duration: 2, dependencies: ['plastering'], resources: [] },
    { id: 'decorating', name: 'Decorating', trade: 'Decorator', duration: 4, dependencies: ['second_fix_carpentry'], resources: [] },
    { id: 'flooring', name: 'Flooring', trade: 'Floor Layer', duration: 2, dependencies: ['decorating'], resources: [] },
    { id: 'snagging', name: 'Snagging & Handover', trade: 'All Trades', duration: 2, dependencies: ['flooring', 'second_fix_plumbing', 'second_fix_electrical'], resources: [] },
  ],
  loft: [
    { id: 'scaffold', name: 'Scaffolding Erection', trade: 'Scaffolder', duration: 1, dependencies: [], resources: ['Scaffolding'] },
    { id: 'strip_roof', name: 'Strip Existing Roof', trade: 'Roofer', duration: 2, dependencies: ['scaffold'], resources: [] },
    { id: 'steel', name: 'Steels Installation', trade: 'Steelwork', duration: 1, dependencies: ['strip_roof'], resources: ['Crane'] },
    { id: 'dormer_frame', name: 'Dormer Frame', trade: 'Carpenter', duration: 3, dependencies: ['steel'], resources: [] },
    { id: 'roof_cover', name: 'Roof Covering', trade: 'Roofer', duration: 3, dependencies: ['dormer_frame'], resources: [] },
    { id: 'staircase', name: 'Staircase', trade: 'Carpenter', duration: 2, dependencies: ['steel'], resources: [] },
    { id: 'floor_joists', name: 'Floor Joists', trade: 'Carpenter', duration: 2, dependencies: ['steel'], resources: [] },
    { id: 'insulation', name: 'Insulation', trade: 'Insulator', duration: 2, dependencies: ['floor_joists'], resources: [] },
    { id: 'first_fix_me', name: 'First Fix M&E', trade: 'Multi-trade', duration: 4, dependencies: ['insulation'], resources: [] },
    { id: 'plasterboard', name: 'Plasterboard', trade: 'Plasterer', duration: 3, dependencies: ['first_fix_me'], resources: [] },
    { id: 'skim', name: 'Skim Coat', trade: 'Plasterer', duration: 2, dependencies: ['plasterboard'], resources: [] },
    { id: 'second_fix', name: 'Second Fix M&E', trade: 'Multi-trade', duration: 3, dependencies: ['skim'], resources: [] },
    { id: 'doors', name: 'Doors & Skirting', trade: 'Carpenter', duration: 2, dependencies: ['skim'], resources: [] },
    { id: 'decorate', name: 'Decoration', trade: 'Decorator', duration: 3, dependencies: ['doors', 'second_fix'], resources: [] },
    { id: 'floor', name: 'Flooring', trade: 'Floor Layer', duration: 2, dependencies: ['decorate'], resources: [] },
    { id: 'snag', name: 'Snagging', trade: 'All Trades', duration: 1, dependencies: ['floor'], resources: [] },
  ],
  bathroom: [
    { id: 'strip', name: 'Strip Out Existing', trade: 'Labourer', duration: 1, dependencies: [], resources: ['Skip'] },
    { id: 'plumbing_move', name: 'Plumbing Alterations', trade: 'Plumber', duration: 2, dependencies: ['strip'], resources: [] },
    { id: 'electrical', name: 'Electrical Work', trade: 'Electrician', duration: 1, dependencies: ['strip'], resources: [] },
    { id: 'tanking', name: 'Tanking & Waterproofing', trade: 'Tiler', duration: 1, dependencies: ['plumbing_move'], resources: [] },
    { id: 'tiling_walls', name: 'Wall Tiling', trade: 'Tiler', duration: 2, dependencies: ['tanking'], resources: [] },
    { id: 'tiling_floor', name: 'Floor Tiling', trade: 'Tiler', duration: 1, dependencies: ['tiling_walls'], resources: [] },
    { id: 'sanitary', name: 'Fit Sanitaryware', trade: 'Plumber', duration: 1, dependencies: ['tiling_floor'], resources: [] },
    { id: 'second_fix_elec', name: 'Electrical Second Fix', trade: 'Electrician', duration: 0.5, dependencies: ['tiling_walls'], resources: [] },
    { id: 'silicone', name: 'Silicone & Seal', trade: 'Plumber', duration: 0.5, dependencies: ['sanitary'], resources: [] },
    { id: 'accessories', name: 'Accessories & Mirrors', trade: 'Handyman', duration: 0.5, dependencies: ['silicone', 'second_fix_elec'], resources: [] },
  ],
  kitchen: [
    { id: 'strip', name: 'Strip Out Existing', trade: 'Labourer', duration: 1, dependencies: [], resources: ['Skip'] },
    { id: 'plumbing', name: 'Plumbing First Fix', trade: 'Plumber', duration: 1, dependencies: ['strip'], resources: [] },
    { id: 'electrical', name: 'Electrical First Fix', trade: 'Electrician', duration: 1, dependencies: ['strip'], resources: [] },
    { id: 'plaster', name: 'Replastering', trade: 'Plasterer', duration: 1, dependencies: ['plumbing', 'electrical'], resources: [] },
    { id: 'floor_prep', name: 'Floor Preparation', trade: 'Floor Layer', duration: 1, dependencies: ['plaster'], resources: [] },
    { id: 'floor', name: 'Floor Covering', trade: 'Floor Layer', duration: 1, dependencies: ['floor_prep'], resources: [] },
    { id: 'units', name: 'Install Units', trade: 'Kitchen Fitter', duration: 3, dependencies: ['floor'], resources: [] },
    { id: 'worktop', name: 'Worktops', trade: 'Kitchen Fitter', duration: 1, dependencies: ['units'], resources: [] },
    { id: 'plumb_second', name: 'Plumbing Second Fix', trade: 'Plumber', duration: 0.5, dependencies: ['worktop'], resources: [] },
    { id: 'elec_second', name: 'Electrical Second Fix', trade: 'Electrician', duration: 0.5, dependencies: ['worktop'], resources: [] },
    { id: 'splashback', name: 'Splashback/Tiling', trade: 'Tiler', duration: 1, dependencies: ['worktop'], resources: [] },
    { id: 'appliances', name: 'Appliances', trade: 'Kitchen Fitter', duration: 0.5, dependencies: ['plumb_second', 'elec_second'], resources: [] },
    { id: 'decoration', name: 'Touch Up Decoration', trade: 'Decorator', duration: 0.5, dependencies: ['splashback', 'appliances'], resources: [] },
  ],
};

// Trade colors for Gantt visualization
export const TRADE_COLORS: Record<string, string> = {
  'Groundworks': 'hsl(var(--chart-1))',
  'Bricklayer': 'hsl(var(--chart-2))',
  'Carpenter': 'hsl(var(--chart-3))',
  'Roofer': 'hsl(var(--chart-4))',
  'Joiner': 'hsl(var(--chart-5))',
  'Plumber': 'hsl(210, 70%, 50%)',
  'Electrician': 'hsl(45, 80%, 50%)',
  'Plasterer': 'hsl(280, 60%, 60%)',
  'Decorator': 'hsl(340, 70%, 55%)',
  'Floor Layer': 'hsl(160, 50%, 45%)',
  'Tiler': 'hsl(200, 60%, 50%)',
  'Scaffolder': 'hsl(30, 60%, 50%)',
  'Steelwork': 'hsl(0, 0%, 50%)',
  'Insulator': 'hsl(90, 50%, 50%)',
  'Multi-trade': 'hsl(270, 50%, 50%)',
  'Kitchen Fitter': 'hsl(180, 60%, 45%)',
  'Handyman': 'hsl(60, 50%, 50%)',
  'Labourer': 'hsl(220, 30%, 55%)',
  'All Trades': 'hsl(var(--primary))',
};

// Calculate schedule from tasks using CPM
export function calculateSchedule(tasks: ProjectTask[]): GanttData {
  const taskMap = new Map<string, ProjectTask>();
  tasks.forEach(t => taskMap.set(t.id, { ...t, startDay: 0, endDay: 0 }));
  
  // Forward pass - calculate early start/finish
  const calculateStart = (taskId: string): number => {
    const task = taskMap.get(taskId)!;
    if (task.startDay !== undefined && task.startDay > 0) return task.startDay;
    
    if (task.dependencies.length === 0) {
      task.startDay = 1;
    } else {
      const maxEnd = Math.max(...task.dependencies.map(depId => {
        const depTask = taskMap.get(depId);
        if (!depTask) return 0;
        calculateStart(depId);
        return depTask.endDay || 0;
      }));
      task.startDay = maxEnd + 1;
    }
    task.endDay = task.startDay + task.duration - 1;
    return task.startDay;
  };
  
  tasks.forEach(t => calculateStart(t.id));
  
  const projectDuration = Math.max(...Array.from(taskMap.values()).map(t => t.endDay || 0));
  
  // Find critical path (simplified - tasks with no float)
  const criticalPath: string[] = [];
  taskMap.forEach((task, id) => {
    // Check if task is on critical path (simplified check)
    const hasFollowers = Array.from(taskMap.values()).some(t => t.dependencies.includes(id));
    if (!hasFollowers && task.endDay === projectDuration) {
      criticalPath.push(id);
    }
  });
  
  return {
    tasks: Array.from(taskMap.values()).map(t => ({
      ...t,
      color: TRADE_COLORS[t.trade] || 'hsl(var(--muted-foreground))'
    })),
    projectDuration,
    criticalPath
  };
}

// Resource leveling helpers
export function getResourcesByDay(tasks: ProjectTask[]): Map<number, string[]> {
  const resources = new Map<number, string[]>();
  
  tasks.forEach(task => {
    if (!task.startDay || !task.endDay) return;
    for (let day = task.startDay; day <= task.endDay; day++) {
      const existing = resources.get(day) || [];
      resources.set(day, [...existing, task.trade, ...task.resources]);
    }
  });
  
  return resources;
}

// Working days calculations
export function addWorkingDays(startDate: Date, days: number): Date {
  let count = 0;
  const result = new Date(startDate);
  
  while (count < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
  }
  
  return result;
}

// Format for display
export function formatGanttDate(day: number, projectStart: Date): string {
  const date = addWorkingDays(projectStart, day - 1);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
