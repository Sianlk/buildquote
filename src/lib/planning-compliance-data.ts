// UK Planning and Building Regulations Compliance Data
// Accurate measurements and thresholds - January 2026
// Reference: Town and Country Planning (General Permitted Development) (England) Order 2015 (as amended)

export interface PermittedDevelopmentLimits {
  category: string;
  description: string;
  limits: MeasurementLimit[];
  conditions: string[];
  excludedAreas: string[];
  reference: string;
}

export interface MeasurementLimit {
  parameter: string;
  value: number;
  unit: 'metres' | 'square_metres' | 'percentage' | 'degrees';
  condition?: string;
}

// CRITICAL: Permitted Development Rights - Accurate January 2026
export const PERMITTED_DEVELOPMENT_LIMITS: PermittedDevelopmentLimits[] = [
  {
    category: 'Rear Extensions',
    description: 'Single-storey rear extensions under Class A',
    limits: [
      { parameter: 'max_depth_detached', value: 4.0, unit: 'metres', condition: 'Detached houses' },
      { parameter: 'max_depth_attached', value: 3.0, unit: 'metres', condition: 'Semi-detached/terraced' },
      { parameter: 'max_height', value: 4.0, unit: 'metres', condition: 'Highest point' },
      { parameter: 'max_eaves_height', value: 3.0, unit: 'metres', condition: 'If within 2m of boundary' },
      { parameter: 'max_coverage', value: 50, unit: 'percentage', condition: 'Of original curtilage (excluding original house)' },
    ],
    conditions: [
      'No extension forward of principal elevation facing highway',
      'Materials must be similar in appearance to existing house',
      'No verandas, balconies or raised platforms',
      'Upper-floor side-facing windows must be obscure-glazed and non-opening (unless 1.7m+ above floor)',
    ],
    excludedAreas: ['Conservation Area', 'AONB', 'National Park', 'World Heritage Site', 'Broads'],
    reference: 'GPDO 2015 Schedule 2 Part 1 Class A',
  },
  {
    category: 'Two-Storey Rear Extensions',
    description: 'Two-storey rear extensions under Class A',
    limits: [
      { parameter: 'max_depth', value: 3.0, unit: 'metres', condition: 'All house types' },
      { parameter: 'min_boundary_distance', value: 7.0, unit: 'metres', condition: 'Rear boundary' },
      { parameter: 'max_eaves_height', value: 3.0, unit: 'metres', condition: 'Must match existing' },
      { parameter: 'max_roof_pitch', value: 0, unit: 'degrees', condition: 'Must match existing roof pitch' },
    ],
    conditions: [
      'Eaves and ridge height must not exceed existing house',
      'Roof pitch must match existing',
      'No cladding on external walls',
    ],
    excludedAreas: ['Conservation Area', 'AONB', 'National Park', 'World Heritage Site', 'Article 4 Direction area'],
    reference: 'GPDO 2015 Schedule 2 Part 1 Class A',
  },
  {
    category: 'Side Extensions',
    description: 'Single-storey side extensions',
    limits: [
      { parameter: 'max_width', value: 0, unit: 'metres', condition: 'Half width of original house' },
      { parameter: 'max_height', value: 4.0, unit: 'metres', condition: 'Highest point' },
    ],
    conditions: [
      'Must not extend beyond side wall of original house where it faces a highway',
      'Width must be no more than half the width of original house',
    ],
    excludedAreas: ['Conservation Area', 'AONB', 'National Park'],
    reference: 'GPDO 2015 Schedule 2 Part 1 Class A',
  },
  {
    category: 'Loft Conversions',
    description: 'Roof alterations and dormer extensions under Class B/C',
    limits: [
      { parameter: 'max_volume_detached', value: 50, unit: 'square_metres', condition: 'Cubic metres additional roof space - detached' },
      { parameter: 'max_volume_attached', value: 40, unit: 'square_metres', condition: 'Cubic metres additional roof space - terraced/semi' },
      { parameter: 'max_height_above_existing', value: 0, unit: 'metres', condition: 'Must not exceed highest part of existing roof' },
    ],
    conditions: [
      'No extension beyond plane of existing roof slope facing highway',
      'Materials must be similar in appearance',
      'Side-facing windows must be obscure-glazed and non-opening below 1.7m',
      'Dormer must be set back at least 20cm from eaves',
    ],
    excludedAreas: ['Conservation Area', 'AONB', 'National Park', 'World Heritage Site'],
    reference: 'GPDO 2015 Schedule 2 Part 1 Class B & C',
  },
  {
    category: 'Outbuildings',
    description: 'Detached outbuildings, garages, sheds under Class E',
    limits: [
      { parameter: 'max_height_dual_pitch', value: 4.0, unit: 'metres', condition: 'Dual pitched roof' },
      { parameter: 'max_height_other', value: 3.0, unit: 'metres', condition: 'Any other roof' },
      { parameter: 'max_eaves_height', value: 2.5, unit: 'metres', condition: 'All outbuildings' },
      { parameter: 'max_coverage', value: 50, unit: 'percentage', condition: 'Of total curtilage area' },
      { parameter: 'min_boundary_distance_over_2.5m', value: 2.0, unit: 'metres', condition: 'If building over 2.5m height' },
    ],
    conditions: [
      'Not forward of principal elevation',
      'Not used for residential accommodation',
      'Single storey only',
    ],
    excludedAreas: ['Listed Building curtilage', 'Scheduled Monument'],
    reference: 'GPDO 2015 Schedule 2 Part 1 Class E',
  },
];

// Building Regulations Part M - Access Requirements
export const PART_M_REQUIREMENTS = {
  category_1_visitable: {
    description: 'Minimum requirements for all new dwellings',
    requirements: [
      { item: 'Level/ramped approach from parking to entrance', standard: 'Gradient max 1:12 for ramps' },
      { item: 'Entrance door width', standard: 'Minimum 850mm clear opening' },
      { item: 'Corridor width', standard: 'Minimum 900mm (1050mm at door approaches)' },
      { item: 'Habitable room at entrance level', standard: 'One room minimum' },
      { item: 'WC at entrance level', standard: 'Where one is provided overall' },
    ],
  },
  category_2_accessible: {
    description: 'Higher accessibility standard (may be required by planning condition)',
    requirements: [
      { item: 'Step-free access', standard: 'Throughout entrance storey' },
      { item: 'Wheelchair turning circle', standard: '1500mm in hallway' },
      { item: 'Door widths', standard: 'Minimum 850mm clear (775mm internal doors)' },
      { item: 'Bathroom', standard: 'Wheelchair accessible WC at entrance level' },
      { item: 'Sockets and switches', standard: '450-1200mm from floor' },
    ],
  },
  category_3_wheelchair: {
    description: 'Wheelchair user dwellings (planning condition only)',
    requirements: [
      { item: 'Parking space', standard: 'Minimum 3300mm wide' },
      { item: 'Transfer space', standard: '750mm beside WC and 1100mm beside bed' },
      { item: 'Kitchen work surfaces', standard: 'Adjustable height or knee space below' },
      { item: 'Shower', standard: 'Level access, 1500mm x 1500mm minimum' },
    ],
  },
};

// Building Regulations Part B - Fire Safety Minimum Standards
export const PART_B_FIRE_REQUIREMENTS = {
  escape_routes: {
    travel_distance_single_direction: { max_metres: 9, condition: 'To protected route' },
    travel_distance_multi_direction: { max_metres: 18, condition: 'Alternative routes available' },
    corridor_width_minimum: { metres: 1.05, condition: 'Less than 50 persons' },
    door_width_minimum: { metres: 0.75, condition: 'Less than 50 persons' },
    stair_width_minimum: { metres: 0.9, condition: 'Dwelling houses' },
  },
  compartmentation: {
    loft_hatch_rating: { minutes: 30, type: 'FD30 in 30-min construction' },
    party_wall_rating: { minutes: 60, condition: 'Full height including roof void' },
    floor_rating_3_storey: { minutes: 30, condition: '3+ storey houses' },
  },
  detection: {
    grade_d1_ld2: {
      description: 'Standard for 3+ storey houses',
      coverage: 'All circulation areas, principal habitable rooms, kitchen',
      type: 'Mains-powered with battery backup, interlinked',
    },
    grade_d1_ld3: {
      description: 'Standard for 1-2 storey houses',
      coverage: 'All circulation areas on escape routes',
      type: 'Mains-powered with battery backup, interlinked',
    },
  },
};

// HMO Minimum Room Sizes - Updated 2026
export const HMO_ROOM_SIZE_STANDARDS = {
  bedroom_1_person: { min_sqm: 6.51, description: '1 person over 10 years old' },
  bedroom_2_persons: { min_sqm: 10.22, description: '2 persons over 10 years old' },
  bedroom_child_under_10: { min_sqm: 4.64, description: '1 child under 10' },
  kitchen_up_to_5: { min_sqm: 7.0, description: 'Shared kitchen 1-5 occupants' },
  kitchen_6_to_10: { min_sqm: 10.0, description: 'Shared kitchen 6-10 occupants' },
  kitchen_11_plus: { min_sqm: 13.5, description: 'Shared kitchen 11+ occupants' },
  bathroom_ratio: { value: 1, per_occupants: 5, description: '1 bathroom per 5 tenants' },
  wc_ratio: { value: 1, per_occupants: 5, description: '1 WC per 5 tenants (can be in bathroom)' },
  kitchen_sink_ratio: { value: 1, per_occupants: 5, description: '1 sink per 5 tenants' },
  cooker_ratio: { value: 1, per_occupants: 5, description: '1 cooker per 5 tenants' },
};

// Compliance validation functions
export function validateExtensionCompliance(
  extensionType: 'single_rear' | 'double_rear' | 'side' | 'loft',
  depth: number,
  height: number,
  houseType: 'detached' | 'semi' | 'terraced',
  inDesignatedArea: boolean
): { compliant: boolean; issues: string[]; warnings: string[] } {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (extensionType === 'single_rear') {
    const maxDepth = houseType === 'detached' ? 4.0 : 3.0;
    if (depth > maxDepth) {
      issues.push(`Extension depth ${depth}m exceeds PD limit of ${maxDepth}m for ${houseType} houses. Planning permission required.`);
    }
    if (height > 4.0) {
      issues.push(`Extension height ${height}m exceeds 4m maximum. Planning permission required.`);
    }
    if (inDesignatedArea && depth > 3.0) {
      warnings.push(`In designated area: Prior Approval may be needed for extensions over 3m.`);
    }
  }

  if (extensionType === 'double_rear') {
    if (depth > 3.0) {
      issues.push(`Two-storey extension depth ${depth}m exceeds 3m PD limit. Planning permission required.`);
    }
    // Note: 7m rear boundary requirement would need plot data
    warnings.push(`Ensure minimum 7m distance to rear boundary is maintained.`);
  }

  if (extensionType === 'loft') {
    const maxVolume = houseType === 'detached' ? 50 : 40;
    warnings.push(`Loft conversions limited to ${maxVolume} cubic metres additional roof space.`);
    if (inDesignatedArea) {
      issues.push(`Dormer extensions not permitted under PD in designated areas. Planning permission required.`);
    }
  }

  return {
    compliant: issues.length === 0,
    issues,
    warnings,
  };
}

export function validateHMORoomSizes(rooms: { type: string; sqm: number }[]): {
  compliant: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  rooms.forEach((room, index) => {
    if (room.type === 'bedroom_single' && room.sqm < 6.51) {
      issues.push(`Room ${index + 1}: ${room.sqm}m² is below minimum 6.51m² for single bedroom (HMO standards)`);
    }
    if (room.type === 'bedroom_double' && room.sqm < 10.22) {
      issues.push(`Room ${index + 1}: ${room.sqm}m² is below minimum 10.22m² for double bedroom (HMO standards)`);
    }
  });

  return {
    compliant: issues.length === 0,
    issues,
  };
}

// Scale calculation for CAD drawings
export const CAD_SCALE_FACTORS = {
  '1:1': 1,
  '1:2': 0.5,
  '1:5': 0.2,
  '1:10': 0.1,
  '1:20': 0.05,
  '1:50': 0.02,
  '1:100': 0.01,
  '1:200': 0.005,
  '1:500': 0.002,
  '1:1000': 0.001,
  '1:1250': 0.0008,
  '1:2500': 0.0004,
};

// Standard drawing scales per RIBA/BS 1192
export const RECOMMENDED_DRAWING_SCALES = {
  site_location_plan: '1:1250',
  site_block_plan: '1:500',
  floor_plans: '1:50',
  sections: '1:50',
  elevations: '1:50',
  detail_drawings: '1:5',
  construction_details: '1:10',
  landscape_plans: '1:100',
};

// A4/A3 drawing sheet sizes in mm
export const DRAWING_SHEET_SIZES = {
  A4: { width: 297, height: 210, landscape: { width: 297, height: 210 } },
  A3: { width: 420, height: 297, landscape: { width: 420, height: 297 } },
  A2: { width: 594, height: 420, landscape: { width: 594, height: 420 } },
  A1: { width: 841, height: 594, landscape: { width: 841, height: 594 } },
  A0: { width: 1189, height: 841, landscape: { width: 1189, height: 841 } },
};

// Calculate if a drawing will fit on a given sheet at a specific scale
export function willDrawingFit(
  buildingLengthMetres: number,
  buildingWidthMetres: number,
  scale: keyof typeof CAD_SCALE_FACTORS,
  sheetSize: keyof typeof DRAWING_SHEET_SIZES,
  marginMm: number = 20
): { fits: boolean; requiredScale?: string } {
  const scaleFactor = CAD_SCALE_FACTORS[scale];
  const sheet = DRAWING_SHEET_SIZES[sheetSize];
  
  // Convert building dimensions to mm at scale
  const drawingWidthMm = (buildingLengthMetres * 1000) * scaleFactor;
  const drawingHeightMm = (buildingWidthMetres * 1000) * scaleFactor;
  
  const availableWidth = sheet.width - (marginMm * 2);
  const availableHeight = sheet.height - (marginMm * 2);
  
  const fits = drawingWidthMm <= availableWidth && drawingHeightMm <= availableHeight;
  
  if (!fits) {
    // Find the scale that would fit
    for (const [scaleName, factor] of Object.entries(CAD_SCALE_FACTORS)) {
      const testWidth = (buildingLengthMetres * 1000) * factor;
      const testHeight = (buildingWidthMetres * 1000) * factor;
      if (testWidth <= availableWidth && testHeight <= availableHeight) {
        return { fits: false, requiredScale: scaleName };
      }
    }
  }
  
  return { fits, requiredScale: fits ? undefined : 'Drawing too large for any standard scale' };
}
