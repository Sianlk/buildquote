// Prefabricated Construction Module Data
// Modular, panelised, and volumetric construction options
// Based on Jan 2026 UK Trade Prices

export interface PrefabOption {
  id: string;
  name: string;
  category: 'modular' | 'panelised' | 'volumetric' | 'hybrid' | 'garden_room' | 'annexe';
  description: string;
  sizeRange: string;
  pricePerSqm: { min: number; max: number };
  leadTime: string;
  installTime: string;
  benefits: string[];
  specifications: string[];
  warrantyYears: number;
  buildingRegsCompliant: boolean;
}

export const PREFAB_OPTIONS: PrefabOption[] = [
  // Garden Rooms
  {
    id: 'garden_room_basic',
    name: 'Garden Room Basic',
    category: 'garden_room',
    description: 'Insulated garden room suitable for home office or studio use',
    sizeRange: '8-15 m²',
    pricePerSqm: { min: 850, max: 1200 },
    leadTime: '4-6 weeks',
    installTime: '2-3 days',
    benefits: ['No planning required under 15m²', 'Quick installation', 'Year-round use', 'Full electrics included'],
    specifications: ['150mm wall insulation', 'Double glazed windows', 'Composite cladding', 'LED lighting package'],
    warrantyYears: 10,
    buildingRegsCompliant: true,
  },
  {
    id: 'garden_room_premium',
    name: 'Garden Room Premium',
    category: 'garden_room',
    description: 'High-spec insulated garden room with enhanced features',
    sizeRange: '10-25 m²',
    pricePerSqm: { min: 1200, max: 1800 },
    leadTime: '5-8 weeks',
    installTime: '3-5 days',
    benefits: ['Bifold doors option', 'Air source heat pump compatible', 'Smart home ready', 'Acoustic insulation'],
    specifications: ['200mm wall insulation', 'Triple glazed options', 'Aluminium/Timber hybrid', 'MVHR option'],
    warrantyYears: 15,
    buildingRegsCompliant: true,
  },
  {
    id: 'garden_studio_with_wc',
    name: 'Garden Studio with WC',
    category: 'garden_room',
    description: 'Self-contained garden building with toilet/shower',
    sizeRange: '15-30 m²',
    pricePerSqm: { min: 1500, max: 2200 },
    leadTime: '6-10 weeks',
    installTime: '5-7 days',
    benefits: ['Full plumbing included', 'Macerator WC option', 'Hot water cylinder', 'Separate utility area'],
    specifications: ['Full wet room spec', 'Soil connection or macerator', 'Hot water cylinder', 'Ventilation system'],
    warrantyYears: 15,
    buildingRegsCompliant: true,
  },
  
  // Granny Annexes
  {
    id: 'annexe_studio',
    name: 'Studio Annexe',
    category: 'annexe',
    description: 'Self-contained studio annexe with kitchenette and bathroom',
    sizeRange: '25-35 m²',
    pricePerSqm: { min: 1800, max: 2500 },
    leadTime: '8-12 weeks',
    installTime: '1-2 weeks',
    benefits: ['Fully self-contained', 'Building regs compliant', 'Accessible design options', 'Energy efficient'],
    specifications: ['Full kitchen', 'Wet room or bathroom', 'Heating system', 'Part M compliant options'],
    warrantyYears: 20,
    buildingRegsCompliant: true,
  },
  {
    id: 'annexe_1bed',
    name: '1-Bed Annexe',
    category: 'annexe',
    description: 'One bedroom granny annexe with separate living area',
    sizeRange: '35-50 m²',
    pricePerSqm: { min: 2000, max: 2800 },
    leadTime: '10-14 weeks',
    installTime: '2-3 weeks',
    benefits: ['Separate bedroom', 'Full living space', 'Future-proof design', 'Multigenerational living'],
    specifications: ['Full kitchen', 'Bathroom with shower', 'Central heating', 'ASHP compatible'],
    warrantyYears: 20,
    buildingRegsCompliant: true,
  },
  {
    id: 'annexe_2bed',
    name: '2-Bed Annexe',
    category: 'annexe',
    description: 'Two bedroom self-contained annexe',
    sizeRange: '50-70 m²',
    pricePerSqm: { min: 2200, max: 3000 },
    leadTime: '12-16 weeks',
    installTime: '3-4 weeks',
    benefits: ['Two bedrooms', 'Family accommodation', 'Rental potential', 'High specification'],
    specifications: ['Full kitchen/diner', 'Family bathroom', 'En-suite option', 'Air source heat pump'],
    warrantyYears: 20,
    buildingRegsCompliant: true,
  },
  
  // Panelised Systems
  {
    id: 'sips_extension',
    name: 'SIPs Extension',
    category: 'panelised',
    description: 'Structural Insulated Panel extension kit',
    sizeRange: '15-60 m²',
    pricePerSqm: { min: 1400, max: 2000 },
    leadTime: '6-10 weeks',
    installTime: '1-2 weeks',
    benefits: ['Exceptional thermal performance', 'Fast erection', 'Minimal site waste', 'Airtight construction'],
    specifications: ['U-value 0.11 W/m²K', '142mm or 172mm panels', 'OSB3 facing', 'EPS or PUR core'],
    warrantyYears: 25,
    buildingRegsCompliant: true,
  },
  {
    id: 'timber_frame_kit',
    name: 'Timber Frame Extension Kit',
    category: 'panelised',
    description: 'Pre-manufactured timber frame extension panels',
    sizeRange: '15-100 m²',
    pricePerSqm: { min: 1100, max: 1600 },
    leadTime: '6-8 weeks',
    installTime: '1-2 weeks',
    benefits: ['Traditional appearance', 'Design flexibility', 'Good thermal mass', 'Sustainable'],
    specifications: ['C16/C24 timber studs', 'Breather membrane', 'Factory insulated option', 'OSB sheathing'],
    warrantyYears: 20,
    buildingRegsCompliant: true,
  },
  {
    id: 'icf_system',
    name: 'ICF Extension',
    category: 'panelised',
    description: 'Insulated Concrete Formwork extension system',
    sizeRange: '20-150 m²',
    pricePerSqm: { min: 1300, max: 1900 },
    leadTime: '4-6 weeks',
    installTime: '2-4 weeks',
    benefits: ['Exceptional strength', 'Excellent thermal mass', 'Sound insulation', 'Flood resilient'],
    specifications: ['EPS formwork', 'Concrete core', 'Steel reinforcement', 'U-value 0.15 W/m²K'],
    warrantyYears: 50,
    buildingRegsCompliant: true,
  },
  
  // Volumetric / Modular
  {
    id: 'modular_extension_single',
    name: 'Single Storey Modular Extension',
    category: 'volumetric',
    description: 'Factory-built modular extension delivered complete',
    sizeRange: '15-40 m²',
    pricePerSqm: { min: 1800, max: 2600 },
    leadTime: '8-12 weeks',
    installTime: '1-3 days',
    benefits: ['Minimal site disruption', 'Quality controlled', 'All-weather build', 'Pre-fitted internals'],
    specifications: ['Steel or timber frame', 'Factory finished', 'M&E pre-installed', 'Crane installation'],
    warrantyYears: 25,
    buildingRegsCompliant: true,
  },
  {
    id: 'modular_extension_double',
    name: 'Two Storey Modular Extension',
    category: 'volumetric',
    description: 'Two-storey factory-built modular extension',
    sizeRange: '30-80 m²',
    pricePerSqm: { min: 2000, max: 2800 },
    leadTime: '10-16 weeks',
    installTime: '2-5 days',
    benefits: ['Maximum floor space', 'Fast completion', 'Controlled quality', 'Pre-approved designs'],
    specifications: ['Stacked modules', 'Steel frame structure', 'Full internal fit-out', 'Building regs approved'],
    warrantyYears: 25,
    buildingRegsCompliant: true,
  },
  
  // Loft Pods
  {
    id: 'loft_pod_dormer',
    name: 'Prefab Dormer Loft Pod',
    category: 'volumetric',
    description: 'Factory-built dormer installed in one lift',
    sizeRange: 'Standard dormer sizes',
    pricePerSqm: { min: 2200, max: 3200 },
    leadTime: '6-10 weeks',
    installTime: '1-2 days',
    benefits: ['Roof off one day only', 'Factory quality', 'Weather independent', 'Minimal disruption'],
    specifications: ['GRP or metal cladding', 'Pre-fitted windows', 'Internal lining complete', 'Electrics first fix'],
    warrantyYears: 20,
    buildingRegsCompliant: true,
  },
  {
    id: 'loft_pod_hip_gable',
    name: 'Hip to Gable Loft Pod',
    category: 'volumetric',
    description: 'Complete hip to gable conversion as prefab module',
    sizeRange: 'Property specific',
    pricePerSqm: { min: 2400, max: 3500 },
    leadTime: '8-12 weeks',
    installTime: '2-4 days',
    benefits: ['Major works completed offsite', 'Structural engineer certified', 'Complete solution', 'Quick site time'],
    specifications: ['Structural steel frame', 'Roof structure included', 'All windows fitted', 'Insulation complete'],
    warrantyYears: 25,
    buildingRegsCompliant: true,
  },
  
  // Hybrid Systems
  {
    id: 'hybrid_steel_pod',
    name: 'Hybrid Steel Pod Extension',
    category: 'hybrid',
    description: 'Steel frame with modular infill panels',
    sizeRange: '20-100 m²',
    pricePerSqm: { min: 1600, max: 2400 },
    leadTime: '8-12 weeks',
    installTime: '2-4 weeks',
    benefits: ['Long spans possible', 'Architectural flexibility', 'Fire resistant', 'Large openings'],
    specifications: ['Steel portal frame', 'SIP or timber infill', 'Galvanised steel', 'Intumescent paint option'],
    warrantyYears: 30,
    buildingRegsCompliant: true,
  },
  {
    id: 'flatpack_extension',
    name: 'Flat Pack Extension Kit',
    category: 'hybrid',
    description: 'DIY-friendly flat pack extension system',
    sizeRange: '10-30 m²',
    pricePerSqm: { min: 900, max: 1400 },
    leadTime: '4-6 weeks',
    installTime: '2-6 weeks (DIY)',
    benefits: ['DIY installation', 'Lower cost', 'Flexible timing', 'Step-by-step guides'],
    specifications: ['Pre-cut panels', 'All fixings included', 'Video instructions', 'Technical support'],
    warrantyYears: 10,
    buildingRegsCompliant: true,
  },
];

// Prefab Suppliers UK
export const PREFAB_SUPPLIERS = [
  { name: 'ModularUK', speciality: 'Volumetric modules', location: 'National', website: 'modularuk.co.uk' },
  { name: 'SIPBuild', speciality: 'SIPs panels', location: 'Midlands', website: 'sipbuild.co.uk' },
  { name: 'GardenAffair', speciality: 'Garden rooms', location: 'National', website: 'gardenaffair.co.uk' },
  { name: 'ModularExtensions', speciality: 'Residential extensions', location: 'South East', website: 'modularextensions.co.uk' },
  { name: 'PodSpace', speciality: 'Garden studios', location: 'National', website: 'podspace.co.uk' },
  { name: 'GrannyAnnexe', speciality: 'Self-contained annexes', location: 'National', website: 'grannyannexe.co.uk' },
  { name: 'HufHaus', speciality: 'Premium modular homes', location: 'International', website: 'huf-haus.com' },
  { name: 'Potton', speciality: 'Timber frame systems', location: 'National', website: 'potton.co.uk' },
];

// Calculate prefab cost estimate
export const calculatePrefabCost = (
  option: PrefabOption, 
  floorArea: number, 
  quality: 'basic' | 'standard' | 'premium'
): { minCost: number; maxCost: number; perSqm: number } => {
  const qualityMultiplier = quality === 'basic' ? 0.9 : quality === 'premium' ? 1.15 : 1.0;
  
  const basePricePerSqm = (option.pricePerSqm.min + option.pricePerSqm.max) / 2;
  const adjustedPerSqm = basePricePerSqm * qualityMultiplier;
  
  return {
    minCost: Math.round(option.pricePerSqm.min * floorArea * qualityMultiplier),
    maxCost: Math.round(option.pricePerSqm.max * floorArea * qualityMultiplier),
    perSqm: Math.round(adjustedPerSqm),
  };
};

// Get suitable prefab options for a project
export const getSuitablePrefabOptions = (
  floorArea: number,
  projectType: string
): PrefabOption[] => {
  if (projectType.includes('loft')) {
    return PREFAB_OPTIONS.filter(o => o.id.includes('loft'));
  }
  if (projectType.includes('garden') || floorArea < 30) {
    return PREFAB_OPTIONS.filter(o => ['garden_room', 'annexe'].includes(o.category));
  }
  if (floorArea > 60) {
    return PREFAB_OPTIONS.filter(o => ['volumetric', 'panelised', 'hybrid'].includes(o.category));
  }
  return PREFAB_OPTIONS;
};
