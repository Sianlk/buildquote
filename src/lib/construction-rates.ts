// Construction rates based on Jan 2026 UK Trade Prices
// Sources: BCIS, RICS, Housebuilder's Bible 15th Edition guidelines, Spon's
// Includes TRADE pricing for contractors and RETAIL pricing for customer quotes

export const MATERIALS_2026 = {
  // Brickwork - 60 bricks per sqm standard
  bricks: {
    standard: { unit: "brick", trade: 0.65, retail: 0.85, waste: 0.05, description: "Engineering brick" },
    facing: { unit: "brick", trade: 0.95, retail: 1.20, waste: 0.05, description: "Facing brick" },
    reclaimed: { unit: "brick", trade: 1.80, retail: 2.50, waste: 0.08, description: "Reclaimed brick" },
    handmade: { unit: "brick", trade: 1.40, retail: 1.85, waste: 0.05, description: "Handmade facing" },
  },
  blocks: {
    standard: { unit: "block", trade: 1.35, retail: 1.80, waste: 0.03, description: "100mm dense block" },
    aerated: { unit: "block", trade: 2.60, retail: 3.20, waste: 0.03, description: "100mm Celcon/Thermalite" },
    insulated: { unit: "block", trade: 10.50, retail: 12.50, waste: 0.02, description: "Insulated ICF block" },
    foundation: { unit: "block", trade: 2.10, retail: 2.65, waste: 0.03, description: "440x215x100 trench block" },
  },
  mortar: { unit: "m³", trade: 115, retail: 145, waste: 0.10, description: "Ready-mix mortar" },
  sand: { unit: "tonne", trade: 38, retail: 52, waste: 0.10, description: "Building sand" },
  cement: { unit: "bag", trade: 5.20, retail: 6.80, waste: 0.05, description: "25kg OPC cement" },
  
  // Concrete & Foundations
  concrete: {
    c20: { unit: "m³", trade: 95, retail: 115, waste: 0.05, description: "C20 ready-mix" },
    c25: { unit: "m³", trade: 105, retail: 125, waste: 0.05, description: "C25 ready-mix" },
    c30: { unit: "m³", trade: 115, retail: 135, waste: 0.05, description: "C30 ready-mix" },
    c40: { unit: "m³", trade: 135, retail: 155, waste: 0.05, description: "C40 ready-mix" },
    pump_charge: { unit: "pour", trade: 380, retail: 450, waste: 0, description: "Concrete pump hire" },
  },
  rebar: { unit: "tonne", trade: 850, retail: 950, waste: 0.05, description: "Steel reinforcement" },
  mesh: { unit: "m²", trade: 6.80, retail: 8.50, waste: 0.08, description: "A393 mesh" },
  dpm: { unit: "m²", trade: 1.40, retail: 1.80, waste: 0.10, description: "1200g DPM" },
  radon_barrier: { unit: "m²", trade: 4.50, retail: 5.80, waste: 0.10, description: "Radon barrier membrane" },
  
  // Timber
  timber: {
    c16: { unit: "m³", trade: 320, retail: 380, waste: 0.12, description: "C16 structural timber" },
    c24: { unit: "m³", trade: 385, retail: 450, waste: 0.12, description: "C24 structural timber" },
    sheet: { unit: "m²", trade: 14.50, retail: 18.50, waste: 0.10, description: "18mm OSB3" },
    ply: { unit: "m²", trade: 26, retail: 32, waste: 0.10, description: "18mm WBP plywood" },
    floor_joist: { unit: "m", trade: 4.80, retail: 6.20, waste: 0.05, description: "47x200 C24 joist" },
    wall_plate: { unit: "m", trade: 2.85, retail: 3.60, waste: 0.05, description: "100x50 treated wall plate" },
  },
  
  // Steel (structural)
  steel: {
    rsj_152x89: { unit: "m", trade: 42, retail: 58, waste: 0, description: "152x89x16 RSJ" },
    rsj_203x102: { unit: "m", trade: 58, retail: 78, waste: 0, description: "203x102x23 RSJ" },
    rsj_254x102: { unit: "m", trade: 72, retail: 95, waste: 0, description: "254x102x28 RSJ" },
    rsj_305x165: { unit: "m", trade: 115, retail: 145, waste: 0, description: "305x165x40 RSJ" },
    padstone: { unit: "nr", trade: 28, retail: 38, waste: 0, description: "Concrete padstone 440x215x215" },
  },
  
  // Insulation
  insulation: {
    mineral_100: { unit: "m²", trade: 6.50, retail: 8.50, waste: 0.05, description: "100mm mineral wool" },
    mineral_150: { unit: "m²", trade: 9.20, retail: 12.00, waste: 0.05, description: "150mm mineral wool" },
    pir_50: { unit: "m²", trade: 11, retail: 14, waste: 0.05, description: "50mm PIR board" },
    pir_100: { unit: "m²", trade: 21, retail: 26, waste: 0.05, description: "100mm PIR board" },
    pir_120: { unit: "m²", trade: 26, retail: 32, waste: 0.05, description: "120mm PIR board" },
    eps_100: { unit: "m²", trade: 9, retail: 12, waste: 0.05, description: "100mm EPS" },
    floor_100: { unit: "m²", trade: 18, retail: 24, waste: 0.05, description: "100mm floor insulation" },
  },
  
  // Roofing
  roofing: {
    felt: { unit: "m²", trade: 3.20, retail: 4.50, waste: 0.10, description: "Breathable membrane" },
    tiles_concrete: { unit: "m²", trade: 22, retail: 28, waste: 0.05, description: "Concrete interlocking tiles" },
    tiles_clay: { unit: "m²", trade: 52, retail: 65, waste: 0.05, description: "Clay plain tiles" },
    slates: { unit: "m²", trade: 68, retail: 85, waste: 0.05, description: "Natural slate" },
    slates_recon: { unit: "m²", trade: 32, retail: 42, waste: 0.05, description: "Reconstituted slate" },
    epdm: { unit: "m²", trade: 35, retail: 45, waste: 0.08, description: "EPDM flat roof" },
    grp: { unit: "m²", trade: 68, retail: 85, waste: 0.08, description: "GRP flat roof" },
    battens: { unit: "m", trade: 0.85, retail: 1.10, waste: 0.10, description: "25x50 treated batten" },
    ridge: { unit: "m", trade: 18, retail: 24, waste: 0.05, description: "Ridge tiles" },
    hip: { unit: "m", trade: 22, retail: 28, waste: 0.05, description: "Hip tiles" },
    fascia: { unit: "m", trade: 12, retail: 16, waste: 0.05, description: "uPVC fascia 175mm" },
    soffit: { unit: "m", trade: 14, retail: 18, waste: 0.05, description: "uPVC vented soffit 225mm" },
    guttering: { unit: "m", trade: 8.50, retail: 11, waste: 0.05, description: "uPVC half-round gutter" },
    downpipe: { unit: "m", trade: 6.80, retail: 8.50, waste: 0.05, description: "uPVC 68mm downpipe" },
  },
  
  // Windows & Doors
  windows: {
    upvc_double: { unit: "m²", trade: 295, retail: 380, waste: 0, description: "uPVC double glazed" },
    upvc_triple: { unit: "m²", trade: 420, retail: 520, waste: 0, description: "uPVC triple glazed" },
    aluminium_double: { unit: "m²", trade: 580, retail: 750, waste: 0, description: "Aluminium double glazed" },
    aluminium_triple: { unit: "m²", trade: 720, retail: 920, waste: 0, description: "Aluminium triple glazed" },
    timber_double: { unit: "m²", trade: 680, retail: 850, waste: 0, description: "Timber double glazed" },
    velux_m04: { unit: "nr", trade: 420, retail: 550, waste: 0, description: "Velux M04 780x980" },
    velux_s06: { unit: "nr", trade: 520, retail: 680, waste: 0, description: "Velux S06 1140x1180" },
  },
  doors: {
    internal: { unit: "nr", trade: 95, retail: 145, waste: 0, description: "Oak veneer internal" },
    internal_fire: { unit: "nr", trade: 185, retail: 245, waste: 0, description: "FD30 fire door" },
    external_composite: { unit: "nr", trade: 650, retail: 850, waste: 0, description: "Composite front door" },
    external_timber: { unit: "nr", trade: 480, retail: 620, waste: 0, description: "Hardwood external door" },
    bifold_3m: { unit: "nr", trade: 2400, retail: 3200, waste: 0, description: "3m bifold aluminium" },
    bifold_4m: { unit: "nr", trade: 3400, retail: 4500, waste: 0, description: "4m bifold aluminium" },
    sliding_3m: { unit: "nr", trade: 2100, retail: 2800, waste: 0, description: "3m sliding patio" },
    french: { unit: "nr", trade: 850, retail: 1100, waste: 0, description: "French doors pair" },
    frame_set: { unit: "nr", trade: 45, retail: 62, waste: 0, description: "Door lining set" },
  },
  
  // Finishes
  plasterboard: { unit: "m²", trade: 4.80, retail: 6.50, waste: 0.10, description: "12.5mm plasterboard" },
  plasterboard_fire: { unit: "m²", trade: 7.20, retail: 9.50, waste: 0.10, description: "12.5mm pink fire board" },
  plasterboard_moisture: { unit: "m²", trade: 8.50, retail: 11, waste: 0.10, description: "12.5mm green moisture board" },
  skim: { unit: "m²", trade: 1.60, retail: 2.20, waste: 0.15, description: "Multi-finish plaster" },
  paint: { unit: "litre", trade: 32, retail: 45, waste: 0.10, description: "Dulux Trade emulsion" },
  skirting: { unit: "m", trade: 2.80, retail: 3.80, waste: 0.10, description: "MDF skirting 120mm" },
  architrave: { unit: "m", trade: 1.80, retail: 2.40, waste: 0.10, description: "MDF architrave 70mm" },
  flooring_laminate: { unit: "m²", trade: 18, retail: 28, waste: 0.10, description: "AC4 laminate flooring" },
  flooring_engineered: { unit: "m²", trade: 45, retail: 65, waste: 0.10, description: "Engineered oak flooring" },
  tiling_wall: { unit: "m²", trade: 28, retail: 42, waste: 0.10, description: "Ceramic wall tiles" },
  tiling_floor: { unit: "m²", trade: 35, retail: 52, waste: 0.10, description: "Porcelain floor tiles" },
  
  // Electrical
  electrical: {
    socket: { unit: "nr", trade: 8, retail: 12, waste: 0, description: "Double socket + backbox" },
    socket_usb: { unit: "nr", trade: 14, retail: 18, waste: 0, description: "Double socket with USB" },
    switch: { unit: "nr", trade: 5, retail: 8, waste: 0, description: "Light switch + backbox" },
    dimmer: { unit: "nr", trade: 18, retail: 25, waste: 0, description: "LED dimmer switch" },
    downlight: { unit: "nr", trade: 12, retail: 18, waste: 0, description: "LED downlight" },
    pendant: { unit: "nr", trade: 8, retail: 12, waste: 0, description: "Pendant ceiling rose" },
    consumer_unit: { unit: "nr", trade: 220, retail: 280, waste: 0, description: "18-way consumer unit" },
    cable_twin: { unit: "m", trade: 1.95, retail: 2.80, waste: 0.15, description: "2.5mm T&E cable" },
    cable_6mm: { unit: "m", trade: 3.20, retail: 4.50, waste: 0.15, description: "6mm T&E cable (cooker)" },
    cable_10mm: { unit: "m", trade: 4.80, retail: 6.50, waste: 0.15, description: "10mm T&E cable (shower)" },
    smoke_detector: { unit: "nr", trade: 28, retail: 38, waste: 0, description: "Mains smoke detector" },
    extractor_fan: { unit: "nr", trade: 65, retail: 95, waste: 0, description: "Bathroom extractor fan" },
    cooker_switch: { unit: "nr", trade: 22, retail: 32, waste: 0, description: "45A cooker switch" },
  },
  
  // Plumbing
  plumbing: {
    copper_15: { unit: "m", trade: 3.20, retail: 4.50, waste: 0.10, description: "15mm copper pipe" },
    copper_22: { unit: "m", trade: 5.20, retail: 6.80, waste: 0.10, description: "22mm copper pipe" },
    copper_28: { unit: "m", trade: 8.50, retail: 11, waste: 0.10, description: "28mm copper pipe" },
    plastic_waste_40: { unit: "m", trade: 4.50, retail: 6, waste: 0.10, description: "40mm waste pipe" },
    plastic_waste_110: { unit: "m", trade: 6.80, retail: 8.50, waste: 0.10, description: "110mm soil pipe" },
    radiator_600x1000: { unit: "nr", trade: 115, retail: 145, waste: 0, description: "K2 600x1000 radiator" },
    radiator_600x1400: { unit: "nr", trade: 155, retail: 195, waste: 0, description: "K2 600x1400 radiator" },
    radiator_600x600: { unit: "nr", trade: 78, retail: 98, waste: 0, description: "K2 600x600 radiator" },
    trv_valve: { unit: "nr", trade: 18, retail: 25, waste: 0, description: "TRV radiator valve" },
    lockshield: { unit: "nr", trade: 8, retail: 12, waste: 0, description: "Lockshield valve" },
    boiler_combi: { unit: "nr", trade: 1850, retail: 2400, waste: 0, description: "30kW combi boiler" },
    boiler_system: { unit: "nr", trade: 1650, retail: 2150, waste: 0, description: "24kW system boiler" },
    cylinder_unvented: { unit: "nr", trade: 1200, retail: 1650, waste: 0, description: "200L unvented cylinder" },
    ufh_m2: { unit: "m²", trade: 35, retail: 48, waste: 0.05, description: "Wet UFH per sqm" },
  },
  
  // Sanitaryware
  sanitaryware: {
    wc_standard: { unit: "nr", trade: 145, retail: 185, waste: 0, description: "Close-coupled WC" },
    wc_wall_hung: { unit: "nr", trade: 350, retail: 450, waste: 0, description: "Wall-hung WC + frame" },
    wc_back_to_wall: { unit: "nr", trade: 280, retail: 360, waste: 0, description: "Back-to-wall WC" },
    basin_pedestal: { unit: "nr", trade: 125, retail: 165, waste: 0, description: "Basin & pedestal" },
    basin_wall: { unit: "nr", trade: 210, retail: 280, waste: 0, description: "Wall-hung basin" },
    basin_vanity: { unit: "nr", trade: 320, retail: 420, waste: 0, description: "Vanity unit & basin" },
    bath_steel: { unit: "nr", trade: 175, retail: 220, waste: 0, description: "1700mm steel bath" },
    bath_acrylic: { unit: "nr", trade: 110, retail: 145, waste: 0, description: "1700mm acrylic bath" },
    bath_freestanding: { unit: "nr", trade: 650, retail: 850, waste: 0, description: "Freestanding bath" },
    shower_enclosure: { unit: "nr", trade: 295, retail: 380, waste: 0, description: "900x900 quadrant" },
    shower_tray: { unit: "nr", trade: 145, retail: 185, waste: 0, description: "900x900 stone resin tray" },
    shower_wetroom: { unit: "nr", trade: 420, retail: 550, waste: 0, description: "Walk-in wetroom panel" },
    shower_mixer: { unit: "nr", trade: 185, retail: 250, waste: 0, description: "Thermostatic shower mixer" },
    electric_shower: { unit: "nr", trade: 145, retail: 195, waste: 0, description: "8.5kW electric shower" },
    bath_tap: { unit: "nr", trade: 95, retail: 135, waste: 0, description: "Bath mixer tap" },
    basin_tap: { unit: "nr", trade: 65, retail: 95, waste: 0, description: "Basin mixer tap" },
    kitchen_tap: { unit: "nr", trade: 85, retail: 125, waste: 0, description: "Kitchen mixer tap" },
    kitchen_sink: { unit: "nr", trade: 145, retail: 195, waste: 0, description: "1.5 bowl SS sink" },
  },
  
  // Drainage
  drainage: {
    inspection_chamber: { unit: "nr", trade: 145, retail: 195, waste: 0, description: "450mm inspection chamber" },
    manhole: { unit: "nr", trade: 380, retail: 520, waste: 0, description: "600x600 manhole" },
    linear_drain: { unit: "m", trade: 85, retail: 115, waste: 0, description: "Linear channel drain" },
    soakaway: { unit: "nr", trade: 450, retail: 620, waste: 0, description: "Soakaway crate system" },
  },
};

export const LABOUR_RATES_2026 = {
  // Rates per hour - Trade prices Jan 2026
  // Includes employer costs (NI, holiday, pension)
  groundworker: { trade: 26, retail: 32, description: "Groundworks & excavation" },
  bricklayer: { trade: 32, retail: 38, description: "Bricklayer" },
  labourer: { trade: 15, retail: 18, description: "General labourer" },
  carpenter_1st: { trade: 30, retail: 36, description: "1st fix carpenter" },
  carpenter_2nd: { trade: 32, retail: 38, description: "2nd fix carpenter" },
  roofer: { trade: 29, retail: 35, description: "Roofer" },
  plasterer: { trade: 26, retail: 32, description: "Plasterer" },
  electrician: { trade: 40, retail: 48, description: "Electrician" },
  plumber: { trade: 44, retail: 52, description: "Plumber/Heating engineer" },
  decorator: { trade: 23, retail: 28, description: "Painter & decorator" },
  tiler: { trade: 29, retail: 35, description: "Wall & floor tiler" },
  kitchen_fitter: { trade: 30, retail: 36, description: "Kitchen fitter" },
  steelfixer: { trade: 34, retail: 40, description: "Steel fixer" },
  scaffolder: { trade: 28, retail: 34, description: "Scaffolder" },
  glazier: { trade: 32, retail: 38, description: "Window fitter" },
  drainage: { trade: 28, retail: 34, description: "Drainage engineer" },
};

export const PLANT_RATES_2026 = {
  // Daily hire rates (trade) / inclusive rates (retail)
  mini_digger_1t: { trade: 75, retail: 95, description: "1 tonne mini digger" },
  mini_digger_3t: { trade: 115, retail: 145, description: "3 tonne mini digger" },
  excavator_8t: { trade: 220, retail: 280, description: "8 tonne tracked excavator" },
  dumper_1t: { trade: 52, retail: 65, description: "1 tonne high-tip dumper" },
  dumper_3t: { trade: 78, retail: 95, description: "3 tonne forward-tip dumper" },
  concrete_pump: { trade: 380, retail: 450, description: "Concrete pump (per pour)" },
  scaffold: { trade: 12, retail: 15, description: "Scaffold per m (per week)" },
  tower_scaffold: { trade: 68, retail: 85, description: "Scaffold tower" },
  generator_5kva: { trade: 28, retail: 35, description: "5kVA generator" },
  mixer_cement: { trade: 18, retail: 25, description: "Cement mixer" },
  skip_6yd: { trade: 260, retail: 320, description: "6 yard skip" },
  skip_8yd: { trade: 310, retail: 380, description: "8 yard skip" },
  skip_12yd: { trade: 420, retail: 520, description: "12 yard skip" },
  forklift: { trade: 145, retail: 185, description: "Telehandler" },
  crane: { trade: 680, retail: 850, description: "Mobile crane (per lift)" },
  cherry_picker: { trade: 185, retail: 240, description: "Cherry picker" },
  plate_compactor: { trade: 28, retail: 38, description: "Plate compactor" },
  breaker: { trade: 45, retail: 58, description: "Electric breaker" },
};

export const TRADE_PRODUCTIVITY = {
  // Output per day (8 hours) - based on Housebuilder's Bible / Spon's
  bricklaying: {
    bricks_per_day: 450, // Bricks per bricklayer per day (face work)
    bricks_per_day_eng: 550, // Engineering bricks
    blocks_per_day: 80, // Blocks per bricklayer per day
    labourer_ratio: 0.5, // Labourers per bricklayer
  },
  excavation: {
    strip_m3_per_day: 15, // m³ per day with mini digger
    trench_m_per_day: 25, // m trench per day
    reduced_level_m3: 35, // m³ reduced level dig per day
  },
  carpentry: {
    floor_joists_m2_per_day: 20,
    roof_m2_per_day: 12,
    stud_wall_m2_per_day: 25,
    first_fix_m2_per_day: 15, // Doors, frames, etc
    second_fix_m2_per_day: 8, // Skirting, architrave, etc
  },
  plastering: {
    board_m2_per_day: 40,
    skim_m2_per_day: 60,
    render_m2_per_day: 25,
  },
  roofing: {
    tiles_m2_per_day: 15,
    flat_m2_per_day: 20,
    fascia_m_per_day: 25,
  },
  electrical: {
    points_per_day: 8,
    board_per_day: 1,
    first_fix_points: 12,
    second_fix_points: 16,
  },
  plumbing: {
    points_per_day: 4,
    radiators_per_day: 5,
    first_fix_points: 6,
    bathroom_days: 2, // Per complete bathroom
  },
  decoration: {
    prep_m2_per_day: 40,
    paint_m2_per_day: 60, // Per coat
  },
  tiling: {
    wall_m2_per_day: 8,
    floor_m2_per_day: 12,
  },
};

// Regional multipliers for UK (Jan 2026) - based on BCIS location indices
export const REGIONAL_MULTIPLIERS = {
  london: 1.28,
  south_east: 1.12,
  south_west: 1.02,
  east_anglia: 1.00,
  east_midlands: 0.96,
  west_midlands: 0.97,
  north_west: 0.94,
  yorkshire: 0.92,
  north_east: 0.90,
  scotland: 0.95,
  wales: 0.93,
  northern_ireland: 0.88,
};

// Professional fees multipliers
export const PROFESSIONAL_FEES = {
  architect_percentage: 0.08, // 8% of build cost
  structural_engineer_percentage: 0.025, // 2.5% of structural work
  building_control_per_sqm: 4.50, // Per sqm
  planning_fee_householder: 258, // 2026 rate
  planning_fee_new_dwelling: 578, // Per dwelling
  warranty_percentage: 0.012, // 1.2% for 10-year warranty
  party_wall_surveyor: 1200, // Average party wall agreement
};

// Preliminaries percentages
export const PRELIMINARIES = {
  site_setup: 0.02, // 2% - welfare, fencing, storage
  site_management: 0.04, // 4% - project management
  insurance: 0.025, // 2.5% - contract works insurance
  small_works_uplift: 0.05, // 5% additional for jobs under £50k
  contingency_standard: 0.10, // 10% contingency
  contingency_renovation: 0.15, // 15% for renovation (unknowns)
};

// Calculate bricks required for wall area (60 per sqm standard)
export function calculateBricksRequired(wallArea: number, openingsArea: number = 0): number {
  const BRICKS_PER_SQM = 60; // Standard half-brick wall
  const netArea = wallArea - openingsArea;
  const wasteFactor = 1.05;
  return Math.ceil(netArea * BRICKS_PER_SQM * wasteFactor);
}

// Calculate blocks required for inner leaf (10 per sqm)
export function calculateBlocksRequired(wallArea: number, openingsArea: number = 0): number {
  const BLOCKS_PER_SQM = 10; // 100mm blocks
  const netArea = wallArea - openingsArea;
  const wasteFactor = 1.03;
  return Math.ceil(netArea * BLOCKS_PER_SQM * wasteFactor);
}

// Calculate mortar required (per 1000 bricks = 0.5m³)
export function calculateMortarRequired(brickCount: number): number {
  return (brickCount / 1000) * 0.5;
}

// Calculate concrete volume for foundations
export function calculateFoundationConcrete(
  perimeterM: number,
  foundationType: "strip" | "trench" | "raft" | "piled"
): number {
  switch (foundationType) {
    case "strip":
      return perimeterM * 0.6 * 0.25; // 600mm wide x 250mm deep
    case "trench":
      return perimeterM * 0.6 * 0.9; // 600mm wide x 900mm deep (trench fill)
    case "raft":
      return 0; // Calculated separately based on area
    case "piled":
      return perimeterM * 0.3; // Ground beams only
    default:
      return perimeterM * 0.6 * 0.25;
  }
}

export function calculateRaftConcrete(floorArea: number): number {
  return floorArea * 0.3; // 300mm thick raft
}

// Calculate floor slab concrete (150mm standard)
export function calculateFloorSlabConcrete(floorArea: number): number {
  return floorArea * 0.15;
}

// Calculate labour hours for a task
export function calculateLabourHours(
  quantity: number,
  outputPerDay: number,
  hoursPerDay: number = 8
): number {
  return (quantity / outputPerDay) * hoursPerDay;
}

// Calculate total labour cost (trade or retail)
export function calculateLabourCost(
  hours: number,
  trade: string,
  pricingType: "trade" | "retail" = "retail"
): number {
  const rates = LABOUR_RATES_2026[trade as keyof typeof LABOUR_RATES_2026];
  if (!rates) return 0;
  return hours * (pricingType === "trade" ? rates.trade : rates.retail);
}

// Calculate material cost (trade or retail)
export function calculateMaterialCost(
  quantity: number,
  material: any,
  pricingType: "trade" | "retail" = "retail"
): number {
  const rate = pricingType === "trade" ? material.trade : material.retail;
  const wasteFactor = 1 + (material.waste || 0);
  return quantity * rate * wasteFactor;
}

// Get pricing type based on user type
export type PricingType = "trade" | "retail";

// Structural calculations helpers
export const STRUCTURAL_CALCS = {
  // Dead loads (kN/m²)
  dead_loads: {
    timber_floor: 0.50,
    concrete_floor: 2.50,
    pitched_roof: 0.75,
    flat_roof: 1.00,
    partition_allowance: 1.00,
    ceiling: 0.25,
  },
  // Live loads (kN/m²)
  live_loads: {
    domestic_floor: 1.50,
    domestic_roof: 0.75,
    snow_load: 0.60, // UK average
  },
  // Steel beam sizing (simplified spans)
  steel_spans: {
    "152x89": 2.5, // max span in m for domestic floor
    "203x102": 3.5,
    "254x102": 4.5,
    "305x165": 6.0,
    "356x171": 7.5,
  },
};

// ============================================================================
// ADDITIONAL HELPER FUNCTIONS
// ============================================================================

// Calculate total project cost with all factors
export function calculateTotalProjectCost(
  buildCost: number,
  region: keyof typeof REGIONAL_MULTIPLIERS,
  isRenovation: boolean = false
): {
  baseCost: number;
  regionalCost: number;
  preliminaries: number;
  contingency: number;
  total: number;
} {
  const regionalMultiplier = REGIONAL_MULTIPLIERS[region];
  const regionalCost = buildCost * regionalMultiplier;
  
  const prelimsRate = PRELIMINARIES.site_setup + PRELIMINARIES.site_management + PRELIMINARIES.insurance;
  const preliminaries = regionalCost * prelimsRate;
  
  const contingencyRate = isRenovation ? PRELIMINARIES.contingency_renovation : PRELIMINARIES.contingency_standard;
  const contingency = regionalCost * contingencyRate;
  
  return {
    baseCost: buildCost,
    regionalCost,
    preliminaries,
    contingency,
    total: regionalCost + preliminaries + contingency,
  };
}

// Calculate bricklaying costs for a given wall area
export function calculateBrickworkCosts(
  wallAreaSqm: number,
  openingsAreaSqm: number,
  brickType: keyof typeof MATERIALS_2026.bricks,
  pricingType: "trade" | "retail" = "retail"
): {
  netArea: number;
  bricksRequired: number;
  mortarRequired: number;
  labourHours: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
} {
  const netArea = wallAreaSqm - openingsAreaSqm;
  const bricksRequired = calculateBricksRequired(wallAreaSqm, openingsAreaSqm);
  const mortarRequired = calculateMortarRequired(bricksRequired);
  
  const labourDays = bricksRequired / TRADE_PRODUCTIVITY.bricklaying.bricks_per_day;
  const labourHours = labourDays * 8;
  
  const brick = MATERIALS_2026.bricks[brickType];
  const brickCost = calculateMaterialCost(bricksRequired, brick, pricingType);
  const mortarCost = calculateMaterialCost(mortarRequired, MATERIALS_2026.mortar, pricingType);
  const materialCost = brickCost + mortarCost;
  
  const labourCost = calculateLabourCost(labourHours, 'bricklayer', pricingType);
  const labourerHours = labourHours * TRADE_PRODUCTIVITY.bricklaying.labourer_ratio;
  const labourerCost = calculateLabourCost(labourerHours, 'labourer', pricingType);
  
  return {
    netArea,
    bricksRequired,
    mortarRequired,
    labourHours,
    materialCost,
    labourCost: labourCost + labourerCost,
    totalCost: materialCost + labourCost + labourerCost,
  };
}

// Calculate roof cost based on type and area
export function calculateRoofCost(
  footprintAreaSqm: number,
  pitchDegrees: number,
  roofType: keyof typeof MATERIALS_2026.roofing,
  pricingType: "trade" | "retail" = "retail"
): {
  slopeAreaSqm: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
} {
  // Calculate slope area from footprint and pitch
  const pitchRadians = (pitchDegrees * Math.PI) / 180;
  const slopeAreaSqm = footprintAreaSqm / Math.cos(pitchRadians);
  
  const roofMaterial = MATERIALS_2026.roofing[roofType];
  const materialCost = calculateMaterialCost(slopeAreaSqm, roofMaterial, pricingType);
  
  const labourDays = slopeAreaSqm / TRADE_PRODUCTIVITY.roofing.tiles_m2_per_day;
  const labourHours = labourDays * 8;
  const labourCost = calculateLabourCost(labourHours, 'roofer', pricingType);
  
  return {
    slopeAreaSqm,
    materialCost,
    labourCost,
    totalCost: materialCost + labourCost,
  };
}

// Calculate heating system cost
export function calculateHeatingSystemCost(
  floorAreaSqm: number,
  systemType: 'radiators' | 'ufh',
  boilerType: 'combi' | 'system' = 'combi',
  pricingType: "trade" | "retail" = "retail"
): {
  boilerCost: number;
  emitterCost: number;
  pipeworkCost: number;
  controlsCost: number;
  labourCost: number;
  totalCost: number;
} {
  const boiler = boilerType === 'combi' 
    ? MATERIALS_2026.plumbing.boiler_combi 
    : MATERIALS_2026.plumbing.boiler_system;
  const boilerCost = pricingType === 'trade' ? boiler.trade : boiler.retail;
  
  let emitterCost: number;
  if (systemType === 'ufh') {
    const ufh = MATERIALS_2026.plumbing.ufh_m2;
    emitterCost = calculateMaterialCost(floorAreaSqm, ufh, pricingType);
  } else {
    // Estimate number of radiators (1 per 10m² roughly)
    const radCount = Math.ceil(floorAreaSqm / 10);
    const rad = MATERIALS_2026.plumbing.radiator_600x1000;
    const trv = MATERIALS_2026.plumbing.trv_valve;
    emitterCost = radCount * ((pricingType === 'trade' ? rad.trade : rad.retail) + 
                              (pricingType === 'trade' ? trv.trade : trv.retail));
  }
  
  // Estimate pipework (about 0.8m per m² floor area)
  const pipeLength = floorAreaSqm * 0.8;
  const pipe = MATERIALS_2026.plumbing.copper_15;
  const pipeworkCost = calculateMaterialCost(pipeLength, pipe, pricingType);
  
  const controlsCost = 350; // Typical controls package
  
  // Labour: about 1 day per 15m² for heating install
  const labourDays = floorAreaSqm / 15;
  const labourHours = labourDays * 8;
  const labourCost = calculateLabourCost(labourHours, 'plumber', pricingType);
  
  return {
    boilerCost,
    emitterCost,
    pipeworkCost,
    controlsCost,
    labourCost,
    totalCost: boilerCost + emitterCost + pipeworkCost + controlsCost + labourCost,
  };
}

// Calculate electrical installation cost
export function calculateElectricalCost(
  floorAreaSqm: number,
  socketPoints: number,
  lightingPoints: number,
  pricingType: "trade" | "retail" = "retail"
): {
  materialCost: number;
  labourCost: number;
  totalCost: number;
  costPerPoint: number;
} {
  const socket = MATERIALS_2026.electrical.socket;
  const light = MATERIALS_2026.electrical.downlight;
  const cu = MATERIALS_2026.electrical.consumer_unit;
  const cable = MATERIALS_2026.electrical.cable_twin;
  
  // Calculate material costs
  const socketCost = socketPoints * (pricingType === 'trade' ? socket.trade : socket.retail);
  const lightCost = lightingPoints * (pricingType === 'trade' ? light.trade : light.retail);
  const cuCost = pricingType === 'trade' ? cu.trade : cu.retail;
  
  // Estimate cable length (about 6m per point average)
  const totalPoints = socketPoints + lightingPoints;
  const cableLength = totalPoints * 6;
  const cableCost = calculateMaterialCost(cableLength, cable, pricingType);
  
  const materialCost = socketCost + lightCost + cuCost + cableCost;
  
  // Labour calculation
  const firstFixDays = totalPoints / TRADE_PRODUCTIVITY.electrical.first_fix_points;
  const secondFixDays = totalPoints / TRADE_PRODUCTIVITY.electrical.second_fix_points;
  const testCertDays = 0.5;
  const totalDays = firstFixDays + secondFixDays + testCertDays;
  const labourHours = totalDays * 8;
  const labourCost = calculateLabourCost(labourHours, 'electrician', pricingType);
  
  return {
    materialCost,
    labourCost,
    totalCost: materialCost + labourCost,
    costPerPoint: (materialCost + labourCost) / totalPoints,
  };
}
