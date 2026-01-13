// Material Systems and Construction Techniques Reference
// Based on current UK construction practices and modern building methods

// ============================================================================
// MATERIAL TAXONOMY AND PROPERTIES
// ============================================================================

export interface MaterialProperties {
  name: string;
  density: number; // kg/m³
  thermalConductivity: number; // W/mK
  fireRating: string;
  durability: string;
  sustainability: string;
  typicalApplications: string[];
}

export const MATERIAL_PROPERTIES: Record<string, MaterialProperties> = {
  steel: {
    name: 'Structural Steel',
    density: 7850,
    thermalConductivity: 50,
    fireRating: 'Non-combustible but loses strength at high temperatures',
    durability: 'Excellent with proper protection',
    sustainability: 'High embodied energy but fully recyclable',
    typicalApplications: ['Frames', 'Beams', 'Lintels', 'Columns'],
  },
  aluminium: {
    name: 'Aluminium',
    density: 2700,
    thermalConductivity: 160,
    fireRating: 'Non-combustible, melts at 660°C',
    durability: 'Excellent corrosion resistance',
    sustainability: 'High embodied energy, excellent recyclability',
    typicalApplications: ['Windows', 'Curtain walling', 'Rainscreens', 'Roofing'],
  },
  copper: {
    name: 'Copper',
    density: 8960,
    thermalConductivity: 385,
    fireRating: 'Non-combustible',
    durability: '100+ years with patina development',
    sustainability: 'High embodied energy, fully recyclable',
    typicalApplications: ['Roofing', 'Rainwater goods', 'Flashing'],
  },
  zinc: {
    name: 'Zinc',
    density: 7140,
    thermalConductivity: 116,
    fireRating: 'Non-combustible',
    durability: '60-80 years typical',
    sustainability: 'Lower embodied energy than copper',
    typicalApplications: ['Standing seam roofing', 'Cladding'],
  },
  glass: {
    name: 'Glass',
    density: 2500,
    thermalConductivity: 1.0,
    fireRating: 'A1 non-combustible (standard glass)',
    durability: 'Excellent if protected',
    sustainability: 'Recyclable, moderate embodied energy',
    typicalApplications: ['Windows', 'Curtain walls', 'Rooflights', 'Structural glazing'],
  },
  concrete: {
    name: 'Concrete',
    density: 2400,
    thermalConductivity: 1.7,
    fireRating: 'A1 non-combustible, excellent fire resistance',
    durability: '50-100+ years',
    sustainability: 'High embodied energy, limited recyclability',
    typicalApplications: ['Foundations', 'Floors', 'Walls', 'Frames'],
  },
  brick: {
    name: 'Clay Brick',
    density: 1920,
    thermalConductivity: 0.8,
    fireRating: 'A1 non-combustible',
    durability: '100+ years',
    sustainability: 'High firing energy, but very long life',
    typicalApplications: ['External walls', 'Internal walls', 'Paving'],
  },
  stone: {
    name: 'Natural Stone',
    density: 2600,
    thermalConductivity: 1.5,
    fireRating: 'A1 non-combustible',
    durability: '100+ years (species dependent)',
    sustainability: 'Low processing energy, finite resource',
    typicalApplications: ['Cladding', 'Load-bearing walls', 'Paving'],
  },
  timber_softwood: {
    name: 'Softwood Timber',
    density: 500,
    thermalConductivity: 0.13,
    fireRating: 'D-s2 (combustible with char protection)',
    durability: '30-60 years treated',
    sustainability: 'Renewable, carbon storing',
    typicalApplications: ['Framing', 'Joists', 'Rafters', 'Cladding'],
  },
  timber_hardwood: {
    name: 'Hardwood Timber',
    density: 700,
    thermalConductivity: 0.18,
    fireRating: 'D-s2 (combustible with char protection)',
    durability: '60-100 years',
    sustainability: 'Renewable if certified',
    typicalApplications: ['Flooring', 'Joinery', 'Structural'],
  },
  grp: {
    name: 'GRP (Glass Reinforced Plastic)',
    density: 1800,
    thermalConductivity: 0.3,
    fireRating: 'B-s3 (treated)',
    durability: '30-50 years',
    sustainability: 'Difficult to recycle',
    typicalApplications: ['Rooflights', 'Cladding panels', 'Flat roofing'],
  },
};

// ============================================================================
// STRUCTURAL SYSTEMS
// ============================================================================

export interface StructuralSystem {
  name: string;
  description: string;
  typicalSpans: string;
  advantages: string[];
  disadvantages: string[];
  typicalCostRangeSqm: { min: number; max: number };
  suitableFor: string[];
}

export const STRUCTURAL_SYSTEMS: Record<string, StructuralSystem> = {
  loadbearing_masonry: {
    name: 'Loadbearing Masonry',
    description: 'Traditional brick and block construction with loadbearing walls',
    typicalSpans: 'Limited by floor joist span (typically 4-5m)',
    advantages: [
      'Well understood by all trades',
      'Good thermal mass',
      'Excellent sound insulation',
      'Fire resistant',
    ],
    disadvantages: [
      'Weather dependent construction',
      'Slow on site',
      'Heavy foundations required',
    ],
    typicalCostRangeSqm: { min: 1100, max: 1500 },
    suitableFor: ['Traditional houses', 'Extensions', 'Renovations'],
  },
  timber_frame: {
    name: 'Timber Frame',
    description: 'Factory-made timber panels with external cladding',
    typicalSpans: '6m typical (engineered joists up to 8m)',
    advantages: [
      'Fast on-site erection',
      'Good thermal performance',
      'Reduced foundation loads',
      'Factory quality control',
    ],
    disadvantages: [
      'Requires careful moisture management',
      'Less thermal mass',
      'Acoustic considerations',
    ],
    typicalCostRangeSqm: { min: 1200, max: 1600 },
    suitableFor: ['Houses', 'Apartments up to 6 storeys', 'Extensions'],
  },
  steel_frame: {
    name: 'Steel Frame',
    description: 'Hot-rolled or light gauge steel frame with infill cladding',
    typicalSpans: 'Up to 12m+ for hot-rolled sections',
    advantages: [
      'Long spans possible',
      'Rapid erection',
      'Precise tolerances',
      'Adaptable layouts',
    ],
    disadvantages: [
      'Requires fire protection',
      'Thermal bridging issues',
      'Higher cost for small projects',
    ],
    typicalCostRangeSqm: { min: 1400, max: 2000 },
    suitableFor: ['Commercial', 'Large spans', 'Multi-storey'],
  },
  concrete_frame: {
    name: 'Reinforced Concrete Frame',
    description: 'In-situ or precast concrete structural frame',
    typicalSpans: 'Up to 9m for flat slabs, longer with PT',
    advantages: [
      'Excellent fire resistance',
      'Good acoustic performance',
      'High thermal mass',
      'Long lifespan',
    ],
    disadvantages: [
      'Slow construction',
      'Weather dependent (in-situ)',
      'Heavy foundations',
      'High embodied carbon',
    ],
    typicalCostRangeSqm: { min: 1500, max: 2200 },
    suitableFor: ['Apartments', 'Commercial', 'Multi-storey'],
  },
  sips: {
    name: 'Structural Insulated Panels (SIPs)',
    description: 'Sandwich panels of OSB with foam core',
    typicalSpans: 'Up to 5m typical',
    advantages: [
      'Excellent insulation values',
      'Very fast construction',
      'Airtight construction',
      'Reduced foundations',
    ],
    disadvantages: [
      'Requires careful sealing',
      'Limited span capability',
      'Fire spread concerns',
    ],
    typicalCostRangeSqm: { min: 1300, max: 1700 },
    suitableFor: ['Low energy houses', 'Extensions', 'Self-build'],
  },
  icf: {
    name: 'Insulated Concrete Formwork (ICF)',
    description: 'Polystyrene formwork filled with concrete',
    typicalSpans: 'Similar to masonry',
    advantages: [
      'Good insulation',
      'Strong construction',
      'Suitable for DIY builders',
      'Good in flood-prone areas',
    ],
    disadvantages: [
      'Higher material costs',
      'Specialist fixings needed',
      'Limited design flexibility',
    ],
    typicalCostRangeSqm: { min: 1400, max: 1800 },
    suitableFor: ['Energy efficient houses', 'Basements', 'Self-build'],
  },
  clt: {
    name: 'Cross Laminated Timber (CLT)',
    description: 'Engineered solid timber panels for walls, floors and roofs',
    typicalSpans: 'Up to 6m floors, longer for roofs',
    advantages: [
      'Very fast construction',
      'Excellent sustainability',
      'Carbon storing',
      'Beautiful exposed finishes',
    ],
    disadvantages: [
      'Higher cost',
      'Fire design considerations',
      'Acoustic detailing needed',
      'Moisture protection critical',
    ],
    typicalCostRangeSqm: { min: 1600, max: 2400 },
    suitableFor: ['Multi-storey timber', 'Schools', 'Offices', 'High-end residential'],
  },
};

// ============================================================================
// FACADE SYSTEMS
// ============================================================================

export interface FacadeSystem {
  name: string;
  type: 'loadbearing' | 'rainscreen' | 'curtain_wall' | 'cladding';
  uValueAchievable: number; // W/m²K
  fireClassification: string;
  maintenanceFrequency: string;
  typicalCostSqm: number;
  lifespan: string;
}

export const FACADE_SYSTEMS: Record<string, FacadeSystem> = {
  brick_cavity: {
    name: 'Traditional Brick Cavity Wall',
    type: 'loadbearing',
    uValueAchievable: 0.18,
    fireClassification: 'A1 non-combustible',
    maintenanceFrequency: 'Minimal - repoint every 30 years',
    typicalCostSqm: 120,
    lifespan: '100+ years',
  },
  render_on_block: {
    name: 'Render on Blockwork',
    type: 'cladding',
    uValueAchievable: 0.18,
    fireClassification: 'A1/A2 depending on insulation',
    maintenanceFrequency: 'Repaint every 10-15 years',
    typicalCostSqm: 75,
    lifespan: '30-40 years for render',
  },
  timber_rainscreen: {
    name: 'Timber Rainscreen',
    type: 'rainscreen',
    uValueAchievable: 0.15,
    fireClassification: 'D-s2 (not suitable for tall buildings)',
    maintenanceFrequency: 'Stain every 3-5 years or let weather',
    typicalCostSqm: 95,
    lifespan: '25-50 years depending on species',
  },
  metal_rainscreen: {
    name: 'Metal Rainscreen (Aluminium/Zinc)',
    type: 'rainscreen',
    uValueAchievable: 0.15,
    fireClassification: 'A1 non-combustible',
    maintenanceFrequency: 'Minimal',
    typicalCostSqm: 180,
    lifespan: '60+ years',
  },
  stone_cladding: {
    name: 'Natural Stone Cladding',
    type: 'cladding',
    uValueAchievable: 0.18,
    fireClassification: 'A1 non-combustible',
    maintenanceFrequency: 'Minimal',
    typicalCostSqm: 250,
    lifespan: '100+ years',
  },
  curtain_wall_aluminium: {
    name: 'Aluminium Curtain Wall',
    type: 'curtain_wall',
    uValueAchievable: 1.2,
    fireClassification: 'A2-s1 (typical)',
    maintenanceFrequency: 'Cleaning, seal replacement every 20 years',
    typicalCostSqm: 650,
    lifespan: '40-50 years',
  },
};

// ============================================================================
// ROOFING SYSTEMS
// ============================================================================

export interface RoofingSystem {
  name: string;
  pitchRange: string;
  weight: number; // kg/m²
  fireRating: string;
  insulationIntegrated: boolean;
  typicalCostSqm: number;
  lifespan: string;
}

export const ROOFING_SYSTEMS: Record<string, RoofingSystem> = {
  concrete_tiles: {
    name: 'Concrete Interlocking Tiles',
    pitchRange: '17.5° - 90°',
    weight: 50,
    fireRating: 'A1',
    insulationIntegrated: false,
    typicalCostSqm: 45,
    lifespan: '50 years',
  },
  clay_tiles: {
    name: 'Clay Plain Tiles',
    pitchRange: '35° - 90°',
    weight: 65,
    fireRating: 'A1',
    insulationIntegrated: false,
    typicalCostSqm: 90,
    lifespan: '60+ years',
  },
  natural_slate: {
    name: 'Natural Slate',
    pitchRange: '20° - 90°',
    weight: 40,
    fireRating: 'A1',
    insulationIntegrated: false,
    typicalCostSqm: 115,
    lifespan: '100+ years',
  },
  standing_seam_zinc: {
    name: 'Zinc Standing Seam',
    pitchRange: '3° - 90°',
    weight: 6,
    fireRating: 'A1',
    insulationIntegrated: false,
    typicalCostSqm: 200,
    lifespan: '80 years',
  },
  epdm_flat: {
    name: 'EPDM Rubber Membrane',
    pitchRange: '0° - 5°',
    weight: 2,
    fireRating: 'Varies',
    insulationIntegrated: false,
    typicalCostSqm: 48,
    lifespan: '25 years',
  },
  single_ply: {
    name: 'PVC Single Ply Membrane',
    pitchRange: '0° - 5°',
    weight: 2,
    fireRating: 'A2-s1 typical',
    insulationIntegrated: false,
    typicalCostSqm: 80,
    lifespan: '25-30 years',
  },
  green_roof: {
    name: 'Extensive Green Roof',
    pitchRange: '0° - 30°',
    weight: 80,
    fireRating: 'A1 substrate',
    insulationIntegrated: true,
    typicalCostSqm: 120,
    lifespan: '30-50 years',
  },
  pv_integrated: {
    name: 'Integrated PV Roof',
    pitchRange: '10° - 45°',
    weight: 15,
    fireRating: 'Varies',
    insulationIntegrated: false,
    typicalCostSqm: 180,
    lifespan: '25-30 years (panels)',
  },
};

// ============================================================================
// WINDOW SYSTEMS
// ============================================================================

export interface WindowSystem {
  frameMaterial: string;
  glazingType: string;
  typicalUValue: number;
  gValue: number;
  acousticRating: string;
  securityRating: string;
  typicalCostSqm: number;
  maintenanceFrequency: string;
  lifespan: string;
}

export const WINDOW_SYSTEMS: Record<string, WindowSystem> = {
  upvc_double: {
    frameMaterial: 'uPVC',
    glazingType: 'Double glazed argon filled',
    typicalUValue: 1.4,
    gValue: 0.63,
    acousticRating: '32 dB Rw',
    securityRating: 'PAS 24',
    typicalCostSqm: 380,
    maintenanceFrequency: 'Clean hinges annually',
    lifespan: '25-30 years',
  },
  upvc_triple: {
    frameMaterial: 'uPVC',
    glazingType: 'Triple glazed argon filled',
    typicalUValue: 0.8,
    gValue: 0.50,
    acousticRating: '36 dB Rw',
    securityRating: 'PAS 24',
    typicalCostSqm: 520,
    maintenanceFrequency: 'Clean hinges annually',
    lifespan: '25-30 years',
  },
  aluminium_double: {
    frameMaterial: 'Thermally broken aluminium',
    glazingType: 'Double glazed argon filled',
    typicalUValue: 1.6,
    gValue: 0.63,
    acousticRating: '35 dB Rw',
    securityRating: 'PAS 24',
    typicalCostSqm: 750,
    maintenanceFrequency: 'Minimal',
    lifespan: '40+ years',
  },
  aluminium_triple: {
    frameMaterial: 'Thermally broken aluminium',
    glazingType: 'Triple glazed argon/krypton',
    typicalUValue: 0.9,
    gValue: 0.50,
    acousticRating: '40 dB Rw',
    securityRating: 'PAS 24',
    typicalCostSqm: 920,
    maintenanceFrequency: 'Minimal',
    lifespan: '40+ years',
  },
  timber_double: {
    frameMaterial: 'Engineered timber',
    glazingType: 'Double glazed argon filled',
    typicalUValue: 1.3,
    gValue: 0.63,
    acousticRating: '34 dB Rw',
    securityRating: 'PAS 24',
    typicalCostSqm: 850,
    maintenanceFrequency: 'Repaint every 5-8 years',
    lifespan: '30-40 years',
  },
  timber_alu_clad: {
    frameMaterial: 'Timber with aluminium external',
    glazingType: 'Triple glazed argon/krypton',
    typicalUValue: 0.8,
    gValue: 0.50,
    acousticRating: '42 dB Rw',
    securityRating: 'PAS 24',
    typicalCostSqm: 1200,
    maintenanceFrequency: 'Internal timber maintenance',
    lifespan: '40+ years',
  },
};

// ============================================================================
// ENVIRONMENTAL PERFORMANCE
// ============================================================================

export interface ThermalPerformance {
  element: string;
  currentBuildingRegsUValue: number;
  passivaHausUValue: number;
  newBuild2025UValue: number;
}

export const THERMAL_REQUIREMENTS: ThermalPerformance[] = [
  { element: 'External Walls', currentBuildingRegsUValue: 0.26, passivaHausUValue: 0.15, newBuild2025UValue: 0.18 },
  { element: 'Ground Floor', currentBuildingRegsUValue: 0.18, passivaHausUValue: 0.15, newBuild2025UValue: 0.13 },
  { element: 'Pitched Roof', currentBuildingRegsUValue: 0.16, passivaHausUValue: 0.10, newBuild2025UValue: 0.11 },
  { element: 'Flat Roof', currentBuildingRegsUValue: 0.18, passivaHausUValue: 0.10, newBuild2025UValue: 0.11 },
  { element: 'Windows', currentBuildingRegsUValue: 1.6, passivaHausUValue: 0.8, newBuild2025UValue: 1.2 },
  { element: 'Doors', currentBuildingRegsUValue: 1.6, passivaHausUValue: 0.8, newBuild2025UValue: 1.0 },
];

// ============================================================================
// CAD/CAM AND DIGITAL FABRICATION
// ============================================================================

export const DIGITAL_FABRICATION = {
  mass_customisation: {
    description: 'Computer-controlled manufacturing allowing unique components at mass production prices',
    examples: ['CNC cut panels', 'Laser cut metalwork', 'Robotically welded steelwork'],
    benefits: ['Geometric freedom', 'Reduced waste', 'Consistent quality'],
    typicalTolerance: '±0.5mm',
  },
  parametric_design: {
    description: 'Algorithm-driven design where changes propagate through the model',
    software: ['Grasshopper', 'Dynamo', 'GenerativeComponents'],
    applications: ['Complex facades', 'Optimised structures', 'Acoustic ceilings'],
  },
  bim: {
    description: 'Building Information Modelling - 3D model as database of building information',
    software: ['Revit', 'ArchiCAD', 'Vectorworks'],
    benefits: ['Clash detection', 'Quantity take-off', 'Facilities management'],
  },
  prefabrication_levels: {
    level_1: 'Components (windows, doors)',
    level_2: 'Panels (wall panels, floor cassettes)',
    level_3: 'Modules (bathroom pods, room modules)',
    level_4: 'Complete buildings (volumetric construction)',
  },
};

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

export function calculateUValue(
  layers: Array<{ thickness_mm: number; conductivity: number }>
): number {
  const Rsi = 0.13; // Internal surface resistance
  const Rse = 0.04; // External surface resistance
  
  const totalR = layers.reduce((sum, layer) => {
    return sum + (layer.thickness_mm / 1000) / layer.conductivity;
  }, Rsi + Rse);
  
  return 1 / totalR;
}

export function calculateInsulationThickness(
  targetUValue: number,
  insulationConductivity: number,
  otherLayersRValue: number
): number {
  // R total = 1/U
  const Rtotal = 1 / targetUValue;
  const Rsi = 0.13;
  const Rse = 0.04;
  
  // R insulation = R total - Rsi - Rse - other layers
  const Rinsulation = Rtotal - Rsi - Rse - otherLayersRValue;
  
  // Thickness = R × λ (conductivity)
  return Math.ceil(Rinsulation * insulationConductivity * 1000);
}

export function calculateThermalBridging(
  linearLength: number,
  psiValue: number
): number {
  return linearLength * psiValue; // W/K
}

export function calculateHeatLoss(
  area: number,
  uValue: number,
  temperatureDifference: number
): number {
  return area * uValue * temperatureDifference; // Watts
}

export function calculateAnnualHeatingDemand(
  totalHeatLoss: number,
  degreeDays: number = 2200
): number {
  // UK average 2200 degree days
  return (totalHeatLoss * degreeDays * 24) / 1000; // kWh/year
}
