// Auto-generate schedules and Bill of Materials for new projects
// This module provides automatic generation of scheduling tasks and material lists

import { ProjectTask, TASK_TEMPLATES, calculateSchedule } from './schedules-module-data';

// Map project types to schedule templates
const PROJECT_TYPE_TO_TEMPLATE: Record<string, string> = {
  single_storey_rear: 'extension',
  single_storey_side: 'extension',
  double_storey_rear: 'extension',
  double_storey_side: 'extension',
  wrap_around: 'extension',
  loft_dormer: 'loft',
  loft_hip_to_gable: 'loft',
  loft_mansard: 'loft',
  loft_velux: 'loft',
  hmo_conversion: 'extension',
  garage_integral: 'extension',
  garage_detached: 'extension',
  basement_conversion: 'extension',
  new_build: 'extension',
  renovation: 'extension',
  office_conversion: 'extension',
};

// Generate schedule tasks for a project
export function generateProjectSchedule(
  projectType: string,
  floorArea: number,
  customStartDate?: Date
): {
  tasks: ProjectTask[];
  totalDuration: number;
  criticalPath: string[];
  startDate: Date;
} {
  const templateKey = PROJECT_TYPE_TO_TEMPLATE[projectType] || 'extension';
  const baseTasks = TASK_TEMPLATES[templateKey] || TASK_TEMPLATES.extension;
  
  // Scale durations based on floor area
  const areaFactor = Math.max(0.5, Math.min(2, floorArea / 25)); // Base is 25sqm
  
  const scaledTasks: ProjectTask[] = baseTasks.map(task => ({
    ...task,
    duration: Math.max(1, Math.round(task.duration * areaFactor)),
  }));
  
  const schedule = calculateSchedule(scaledTasks);
  
  return {
    tasks: schedule.tasks,
    totalDuration: schedule.projectDuration,
    criticalPath: schedule.criticalPath,
    startDate: customStartDate || new Date(),
  };
}

// Bill of Materials item
export interface BOMItem {
  category: string;
  partCode: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  leadTimeDays?: number;
}

// Generate Bill of Materials based on project geometry
export function generateBillOfMaterials(
  projectType: string,
  geometry: {
    floorArea: number;
    wallArea: number;
    height: number;
    electricalPoints: number;
    plumbingPoints: number;
    heatingRadiators: number;
    windowCount: number;
    doorCount: number;
    rooms?: { type: string; sqm: number }[];
  },
  buildQuality: 'basic' | 'standard' | 'premium' | 'luxury' = 'standard'
): BOMItem[] {
  const bom: BOMItem[] = [];
  const qualityMultiplier = {
    basic: 0.8,
    standard: 1.0,
    premium: 1.3,
    luxury: 1.6,
  }[buildQuality];

  // Determine if we need groundworks
  const needsGroundworks = [
    'single_storey_rear', 'single_storey_side', 'double_storey_rear',
    'double_storey_side', 'wrap_around', 'new_build', 'basement_conversion'
  ].includes(projectType);

  // Groundworks - Foundations
  if (needsGroundworks) {
    const perimeterEstimate = Math.sqrt(geometry.floorArea) * 4;
    const concreteVolume = perimeterEstimate * 0.6 * 0.3; // 600mm wide x 300mm deep
    
    bom.push({
      category: 'Groundworks',
      partCode: 'GW-CONC-C25',
      description: 'Concrete C25 for foundations',
      quantity: Math.ceil(concreteVolume),
      unit: 'm³',
      unitCost: 125,
      totalCost: Math.ceil(concreteVolume) * 125,
      leadTimeDays: 3,
    });
    
    bom.push({
      category: 'Groundworks',
      partCode: 'GW-REBAR-16',
      description: 'Reinforcement bar 16mm',
      quantity: Math.ceil(concreteVolume * 80),
      unit: 'kg',
      unitCost: 1.20,
      totalCost: Math.ceil(concreteVolume * 80) * 1.20,
      leadTimeDays: 5,
    });
    
    bom.push({
      category: 'Groundworks',
      partCode: 'GW-DPM-1200',
      description: 'DPM 1200 gauge polythene',
      quantity: Math.ceil(geometry.floorArea * 1.1),
      unit: 'm²',
      unitCost: 1.50,
      totalCost: Math.ceil(geometry.floorArea * 1.1) * 1.50,
      leadTimeDays: 2,
    });
  }

  // Brickwork & Blockwork
  const brickArea = geometry.wallArea * 0.7; // 70% external is brickwork
  const bricksRequired = Math.ceil(brickArea * 60); // 60 bricks per sqm
  const blocksRequired = Math.ceil(geometry.wallArea * 10); // 10 blocks per sqm
  
  if (brickArea > 0) {
    bom.push({
      category: 'Masonry',
      partCode: 'MS-BRICK-FAC',
      description: 'Facing bricks (Class B)',
      quantity: bricksRequired,
      unit: 'nr',
      unitCost: 0.95 * qualityMultiplier,
      totalCost: Math.round(bricksRequired * 0.95 * qualityMultiplier),
      leadTimeDays: 10,
    });
    
    bom.push({
      category: 'Masonry',
      partCode: 'MS-BLOCK-AER',
      description: 'Aerated blocks 440x215x100',
      quantity: blocksRequired,
      unit: 'nr',
      unitCost: 3.50,
      totalCost: Math.round(blocksRequired * 3.50),
      leadTimeDays: 5,
    });
    
    // Mortar
    bom.push({
      category: 'Masonry',
      partCode: 'MS-MORTAR-25',
      description: 'Pre-mixed mortar bags 25kg',
      quantity: Math.ceil(bricksRequired / 50),
      unit: 'bags',
      unitCost: 5.50,
      totalCost: Math.ceil(bricksRequired / 50) * 5.50,
      leadTimeDays: 2,
    });
    
    // Wall ties
    bom.push({
      category: 'Masonry',
      partCode: 'MS-TIES-SS',
      description: 'Stainless steel wall ties',
      quantity: Math.ceil(geometry.wallArea * 2.5),
      unit: 'nr',
      unitCost: 0.35,
      totalCost: Math.ceil(geometry.wallArea * 2.5) * 0.35,
      leadTimeDays: 2,
    });
  }

  // Insulation
  bom.push({
    category: 'Insulation',
    partCode: 'IN-PIR-100',
    description: 'PIR insulation boards 100mm',
    quantity: Math.ceil(geometry.wallArea * 1.05),
    unit: 'm²',
    unitCost: 28.50,
    totalCost: Math.ceil(geometry.wallArea * 1.05) * 28.50,
    leadTimeDays: 5,
  });
  
  bom.push({
    category: 'Insulation',
    partCode: 'IN-QUILT-170',
    description: 'Mineral wool quilt 170mm (loft)',
    quantity: Math.ceil(geometry.floorArea * 1.1),
    unit: 'm²',
    unitCost: 8.50,
    totalCost: Math.ceil(geometry.floorArea * 1.1) * 8.50,
    leadTimeDays: 3,
  });

  // Roofing
  const isLoft = projectType.includes('loft');
  if (!isLoft) {
    bom.push({
      category: 'Roofing',
      partCode: 'RF-TILE-CONC',
      description: 'Concrete roof tiles',
      quantity: Math.ceil(geometry.floorArea * 12),
      unit: 'nr',
      unitCost: 0.85 * qualityMultiplier,
      totalCost: Math.round(geometry.floorArea * 12 * 0.85 * qualityMultiplier),
      leadTimeDays: 10,
    });
    
    bom.push({
      category: 'Roofing',
      partCode: 'RF-BATTEN-25',
      description: 'Treated roof battens 25x50mm',
      quantity: Math.ceil(geometry.floorArea * 3),
      unit: 'lm',
      unitCost: 1.20,
      totalCost: Math.round(geometry.floorArea * 3 * 1.20),
      leadTimeDays: 3,
    });
    
    bom.push({
      category: 'Roofing',
      partCode: 'RF-FELT-1F48',
      description: 'Breathable roofing membrane',
      quantity: Math.ceil(geometry.floorArea * 1.15),
      unit: 'm²',
      unitCost: 2.20,
      totalCost: Math.round(geometry.floorArea * 1.15 * 2.20),
      leadTimeDays: 2,
    });
  }

  // Carpentry - Structural
  bom.push({
    category: 'Carpentry',
    partCode: 'CA-JOIST-47x225',
    description: 'C24 floor joists 47x225mm',
    quantity: Math.ceil(geometry.floorArea / 0.4 * (geometry.floorArea / 4)),
    unit: 'lm',
    unitCost: 6.50,
    totalCost: Math.round(Math.ceil(geometry.floorArea / 0.4 * (geometry.floorArea / 4)) * 6.50),
    leadTimeDays: 5,
  });

  // Plasterboard
  bom.push({
    category: 'Drylining',
    partCode: 'DL-PBOARD-12.5',
    description: 'Plasterboard 12.5mm 2400x1200',
    quantity: Math.ceil((geometry.wallArea * 2 + geometry.floorArea) / 2.88),
    unit: 'sheets',
    unitCost: 8.50,
    totalCost: Math.ceil((geometry.wallArea * 2 + geometry.floorArea) / 2.88) * 8.50,
    leadTimeDays: 3,
  });
  
  bom.push({
    category: 'Drylining',
    partCode: 'DL-SCREW-42',
    description: 'Drywall screws 42mm box 1000',
    quantity: Math.ceil((geometry.wallArea * 2) / 100),
    unit: 'boxes',
    unitCost: 12.50,
    totalCost: Math.ceil((geometry.wallArea * 2) / 100) * 12.50,
    leadTimeDays: 2,
  });

  // Electrical
  bom.push({
    category: 'Electrical',
    partCode: 'EL-SOCKET-DP',
    description: 'Double socket outlet 13A',
    quantity: Math.ceil(geometry.electricalPoints * 0.7),
    unit: 'nr',
    unitCost: 8.50 * qualityMultiplier,
    totalCost: Math.round(geometry.electricalPoints * 0.7 * 8.50 * qualityMultiplier),
    leadTimeDays: 3,
  });
  
  bom.push({
    category: 'Electrical',
    partCode: 'EL-SWITCH-1G',
    description: 'Light switch 1-gang',
    quantity: Math.ceil(geometry.electricalPoints * 0.3),
    unit: 'nr',
    unitCost: 4.50 * qualityMultiplier,
    totalCost: Math.round(geometry.electricalPoints * 0.3 * 4.50 * qualityMultiplier),
    leadTimeDays: 3,
  });
  
  bom.push({
    category: 'Electrical',
    partCode: 'EL-CABLE-2.5',
    description: 'Twin & earth cable 2.5mm² 100m',
    quantity: Math.ceil(geometry.electricalPoints / 8),
    unit: 'coils',
    unitCost: 85.00,
    totalCost: Math.ceil(geometry.electricalPoints / 8) * 85.00,
    leadTimeDays: 2,
  });
  
  bom.push({
    category: 'Electrical',
    partCode: 'EL-CU-10WAY',
    description: 'Consumer unit 10-way RCBO',
    quantity: 1,
    unit: 'nr',
    unitCost: 185.00,
    totalCost: 185.00,
    leadTimeDays: 5,
  });

  // Plumbing
  if (geometry.plumbingPoints > 0) {
    bom.push({
      category: 'Plumbing',
      partCode: 'PL-PIPE-22CU',
      description: '22mm copper pipe 3m lengths',
      quantity: Math.ceil(geometry.plumbingPoints * 3),
      unit: 'lengths',
      unitCost: 18.50,
      totalCost: Math.ceil(geometry.plumbingPoints * 3) * 18.50,
      leadTimeDays: 3,
    });
    
    bom.push({
      category: 'Plumbing',
      partCode: 'PL-PIPE-15CU',
      description: '15mm copper pipe 3m lengths',
      quantity: Math.ceil(geometry.plumbingPoints * 2),
      unit: 'lengths',
      unitCost: 12.50,
      totalCost: Math.ceil(geometry.plumbingPoints * 2) * 12.50,
      leadTimeDays: 3,
    });
    
    bom.push({
      category: 'Plumbing',
      partCode: 'PL-WASTE-40',
      description: '40mm waste pipe 3m lengths',
      quantity: Math.ceil(geometry.plumbingPoints * 1.5),
      unit: 'lengths',
      unitCost: 8.50,
      totalCost: Math.ceil(geometry.plumbingPoints * 1.5) * 8.50,
      leadTimeDays: 2,
    });
  }

  // Heating
  if (geometry.heatingRadiators > 0) {
    bom.push({
      category: 'Heating',
      partCode: 'HT-RAD-600x1000',
      description: 'Radiator 600x1000mm double panel',
      quantity: geometry.heatingRadiators,
      unit: 'nr',
      unitCost: 145.00 * qualityMultiplier,
      totalCost: Math.round(geometry.heatingRadiators * 145.00 * qualityMultiplier),
      leadTimeDays: 7,
    });
    
    bom.push({
      category: 'Heating',
      partCode: 'HT-TRV-PAIR',
      description: 'Thermostatic radiator valve pair',
      quantity: geometry.heatingRadiators,
      unit: 'pairs',
      unitCost: 28.00,
      totalCost: geometry.heatingRadiators * 28.00,
      leadTimeDays: 3,
    });
  }

  // Windows & Doors
  if (geometry.windowCount > 0) {
    bom.push({
      category: 'Windows',
      partCode: 'WIN-UPVC-DG',
      description: 'uPVC double glazed window 1200x1500',
      quantity: geometry.windowCount,
      unit: 'nr',
      unitCost: 450.00 * qualityMultiplier,
      totalCost: Math.round(geometry.windowCount * 450.00 * qualityMultiplier),
      leadTimeDays: 14,
    });
  }
  
  if (geometry.doorCount > 0) {
    bom.push({
      category: 'Doors',
      partCode: 'DR-INT-OAK',
      description: 'Internal door oak veneer',
      quantity: Math.ceil(geometry.doorCount * 0.8),
      unit: 'nr',
      unitCost: 85.00 * qualityMultiplier,
      totalCost: Math.round(geometry.doorCount * 0.8 * 85.00 * qualityMultiplier),
      leadTimeDays: 7,
    });
    
    bom.push({
      category: 'Doors',
      partCode: 'DR-EXT-COMP',
      description: 'External composite door',
      quantity: Math.ceil(geometry.doorCount * 0.2),
      unit: 'nr',
      unitCost: 650.00 * qualityMultiplier,
      totalCost: Math.round(geometry.doorCount * 0.2 * 650.00 * qualityMultiplier),
      leadTimeDays: 14,
    });
  }

  // Fixings & Consumables
  bom.push({
    category: 'Fixings',
    partCode: 'FX-NAILS-MIX',
    description: 'Nail assortment pack',
    quantity: Math.ceil(geometry.floorArea / 10),
    unit: 'boxes',
    unitCost: 12.00,
    totalCost: Math.ceil(geometry.floorArea / 10) * 12.00,
    leadTimeDays: 2,
  });
  
  bom.push({
    category: 'Fixings',
    partCode: 'FX-SCREWS-MIX',
    description: 'Screw assortment pack',
    quantity: Math.ceil(geometry.floorArea / 10),
    unit: 'boxes',
    unitCost: 15.00,
    totalCost: Math.ceil(geometry.floorArea / 10) * 15.00,
    leadTimeDays: 2,
  });
  
  bom.push({
    category: 'Adhesives',
    partCode: 'AD-PU-FOAM',
    description: 'Expanding foam 750ml',
    quantity: Math.ceil(geometry.windowCount + geometry.doorCount),
    unit: 'cans',
    unitCost: 8.50,
    totalCost: Math.ceil(geometry.windowCount + geometry.doorCount) * 8.50,
    leadTimeDays: 2,
  });
  
  bom.push({
    category: 'Sealants',
    partCode: 'SL-SILICONE',
    description: 'Silicone sealant 310ml',
    quantity: Math.ceil((geometry.windowCount + geometry.plumbingPoints) / 2),
    unit: 'tubes',
    unitCost: 6.50,
    totalCost: Math.ceil((geometry.windowCount + geometry.plumbingPoints) / 2) * 6.50,
    leadTimeDays: 2,
  });

  // Calculate and add waste factor (5%)
  const wasteFactor = 1.05;
  bom.forEach(item => {
    if (!['Electrical', 'Plumbing', 'Heating', 'Windows', 'Doors'].includes(item.category)) {
      item.quantity = Math.ceil(item.quantity * wasteFactor);
      item.totalCost = Math.round(item.quantity * item.unitCost);
    }
  });

  return bom;
}

// Calculate total BoM value
export function calculateBOMTotal(bom: BOMItem[]): {
  totalCost: number;
  byCategory: Record<string, number>;
  itemCount: number;
  longestLeadTime: number;
} {
  const byCategory: Record<string, number> = {};
  let longestLeadTime = 0;
  
  bom.forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + item.totalCost;
    if (item.leadTimeDays && item.leadTimeDays > longestLeadTime) {
      longestLeadTime = item.leadTimeDays;
    }
  });
  
  return {
    totalCost: bom.reduce((sum, item) => sum + item.totalCost, 0),
    byCategory,
    itemCount: bom.length,
    longestLeadTime,
  };
}

// Export formatted for display
export function formatBOMForExport(bom: BOMItem[]): Record<string, any>[] {
  return bom.map((item, idx) => ({
    line: idx + 1,
    category: item.category,
    part_code: item.partCode,
    description: item.description,
    quantity: item.quantity,
    unit: item.unit,
    unit_cost: `£${item.unitCost.toFixed(2)}`,
    total_cost: `£${item.totalCost.toFixed(2)}`,
    lead_time: item.leadTimeDays ? `${item.leadTimeDays} days` : '-',
  }));
}
