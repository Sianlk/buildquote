// Construction rates based on Jan 2026 UK Trade Prices
// Sources: BCIS, RICS, Housebuilder's Bible 15th Edition guidelines

export const MATERIALS_2026 = {
  // Brickwork - 60 bricks per sqm standard
  bricks: {
    standard: { unit: "brick", rate: 0.85, waste: 0.05, description: "Engineering brick" },
    facing: { unit: "brick", rate: 1.20, waste: 0.05, description: "Facing brick" },
    reclaimed: { unit: "brick", rate: 2.50, waste: 0.08, description: "Reclaimed brick" },
  },
  blocks: {
    standard: { unit: "block", rate: 1.80, waste: 0.03, description: "100mm dense block" },
    aerated: { unit: "block", rate: 3.20, waste: 0.03, description: "100mm Celcon/Thermalite" },
    insulated: { unit: "block", rate: 12.50, waste: 0.02, description: "Insulated ICF block" },
  },
  mortar: { unit: "m³", rate: 145, waste: 0.10, description: "Ready-mix mortar" },
  
  // Concrete & Foundations
  concrete: {
    c20: { unit: "m³", rate: 115, waste: 0.05, description: "C20 ready-mix" },
    c25: { unit: "m³", rate: 125, waste: 0.05, description: "C25 ready-mix" },
    c30: { unit: "m³", rate: 135, waste: 0.05, description: "C30 ready-mix" },
    c40: { unit: "m³", rate: 155, waste: 0.05, description: "C40 ready-mix" },
  },
  rebar: { unit: "tonne", rate: 950, waste: 0.05, description: "Steel reinforcement" },
  mesh: { unit: "m²", rate: 8.50, waste: 0.08, description: "A393 mesh" },
  dpm: { unit: "m²", rate: 1.80, waste: 0.10, description: "1200g DPM" },
  
  // Timber
  timber: {
    c16: { unit: "m³", rate: 380, waste: 0.12, description: "C16 structural timber" },
    c24: { unit: "m³", rate: 450, waste: 0.12, description: "C24 structural timber" },
    sheet: { unit: "m²", rate: 18.50, waste: 0.10, description: "18mm OSB3" },
    ply: { unit: "m²", rate: 32, waste: 0.10, description: "18mm WBP plywood" },
  },
  
  // Insulation
  insulation: {
    mineral_100: { unit: "m²", rate: 8.50, waste: 0.05, description: "100mm mineral wool" },
    pir_50: { unit: "m²", rate: 14, waste: 0.05, description: "50mm PIR board" },
    pir_100: { unit: "m²", rate: 26, waste: 0.05, description: "100mm PIR board" },
    eps_100: { unit: "m²", rate: 12, waste: 0.05, description: "100mm EPS" },
  },
  
  // Roofing
  roofing: {
    felt: { unit: "m²", rate: 4.50, waste: 0.10, description: "Breathable membrane" },
    tiles_concrete: { unit: "m²", rate: 28, waste: 0.05, description: "Concrete interlocking tiles" },
    tiles_clay: { unit: "m²", rate: 65, waste: 0.05, description: "Clay plain tiles" },
    slates: { unit: "m²", rate: 85, waste: 0.05, description: "Natural slate" },
    epdm: { unit: "m²", rate: 45, waste: 0.08, description: "EPDM flat roof" },
    grp: { unit: "m²", rate: 85, waste: 0.08, description: "GRP flat roof" },
  },
  
  // Windows & Doors
  windows: {
    upvc_double: { unit: "m²", rate: 380, waste: 0, description: "uPVC double glazed" },
    upvc_triple: { unit: "m²", rate: 520, waste: 0, description: "uPVC triple glazed" },
    aluminium: { unit: "m²", rate: 750, waste: 0, description: "Aluminium double glazed" },
    timber: { unit: "m²", rate: 850, waste: 0, description: "Timber double glazed" },
  },
  doors: {
    internal: { unit: "nr", rate: 145, waste: 0, description: "Oak veneer internal" },
    external_composite: { unit: "nr", rate: 850, waste: 0, description: "Composite front door" },
    bifold_3m: { unit: "nr", rate: 3200, waste: 0, description: "3m bifold aluminium" },
    bifold_4m: { unit: "nr", rate: 4500, waste: 0, description: "4m bifold aluminium" },
    sliding_3m: { unit: "nr", rate: 2800, waste: 0, description: "3m sliding patio" },
  },
  
  // Finishes
  plasterboard: { unit: "m²", rate: 6.50, waste: 0.10, description: "12.5mm plasterboard" },
  skim: { unit: "m²", rate: 2.20, waste: 0.15, description: "Multi-finish plaster" },
  paint: { unit: "litre", rate: 45, waste: 0.10, description: "Dulux Trade emulsion" },
  
  // Electrical
  electrical: {
    socket: { unit: "nr", rate: 12, waste: 0, description: "Double socket + backbox" },
    switch: { unit: "nr", rate: 8, waste: 0, description: "Light switch + backbox" },
    downlight: { unit: "nr", rate: 18, waste: 0, description: "LED downlight" },
    consumer_unit: { unit: "nr", rate: 280, waste: 0, description: "18-way consumer unit" },
    cable_twin: { unit: "m", rate: 2.80, waste: 0.15, description: "2.5mm T&E cable" },
  },
  
  // Plumbing
  plumbing: {
    copper_15: { unit: "m", rate: 4.50, waste: 0.10, description: "15mm copper pipe" },
    copper_22: { unit: "m", rate: 6.80, waste: 0.10, description: "22mm copper pipe" },
    plastic_waste: { unit: "m", rate: 8.50, waste: 0.10, description: "110mm soil pipe" },
    radiator_600x1000: { unit: "nr", rate: 145, waste: 0, description: "K2 600x1000 radiator" },
    radiator_600x1400: { unit: "nr", rate: 195, waste: 0, description: "K2 600x1400 radiator" },
  },
  
  // Sanitaryware
  sanitaryware: {
    wc_standard: { unit: "nr", rate: 185, waste: 0, description: "Close-coupled WC" },
    wc_wall_hung: { unit: "nr", rate: 450, waste: 0, description: "Wall-hung WC + frame" },
    basin_pedestal: { unit: "nr", rate: 165, waste: 0, description: "Basin & pedestal" },
    basin_wall: { unit: "nr", rate: 280, waste: 0, description: "Wall-hung basin" },
    bath_steel: { unit: "nr", rate: 220, waste: 0, description: "1700mm steel bath" },
    bath_acrylic: { unit: "nr", rate: 145, waste: 0, description: "1700mm acrylic bath" },
    shower_enclosure: { unit: "nr", rate: 380, waste: 0, description: "900x900 quadrant" },
    shower_tray: { unit: "nr", rate: 185, waste: 0, description: "900x900 stone resin tray" },
  },
};

export const LABOUR_RATES_2026 = {
  // Rates per hour - Trade prices Jan 2026
  groundworker: { rate: 32, description: "Groundworks & excavation" },
  bricklayer: { rate: 38, description: "Bricklayer" },
  labourer: { rate: 18, description: "General labourer" },
  carpenter_1st: { rate: 36, description: "1st fix carpenter" },
  carpenter_2nd: { rate: 38, description: "2nd fix carpenter" },
  roofer: { rate: 35, description: "Roofer" },
  plasterer: { rate: 32, description: "Plasterer" },
  electrician: { rate: 48, description: "Electrician" },
  plumber: { rate: 52, description: "Plumber/Heating engineer" },
  decorator: { rate: 28, description: "Painter & decorator" },
  tiler: { rate: 35, description: "Wall & floor tiler" },
  kitchen_fitter: { rate: 36, description: "Kitchen fitter" },
  steelfixer: { rate: 40, description: "Steel fixer" },
};

export const PLANT_RATES_2026 = {
  // Daily hire rates
  mini_digger_1t: { rate: 95, description: "1 tonne mini digger" },
  mini_digger_3t: { rate: 145, description: "3 tonne mini digger" },
  excavator_8t: { rate: 280, description: "8 tonne tracked excavator" },
  dumper_1t: { rate: 65, description: "1 tonne high-tip dumper" },
  dumper_3t: { rate: 95, description: "3 tonne forward-tip dumper" },
  concrete_pump: { rate: 450, description: "Concrete pump (per pour)" },
  scaffold: { rate: 15, description: "Scaffold per m (per week)" },
  tower_scaffold: { rate: 85, description: "Scaffold tower" },
  generator_5kva: { rate: 35, description: "5kVA generator" },
  mixer_cement: { rate: 25, description: "Cement mixer" },
  skip_6yd: { rate: 320, description: "6 yard skip" },
  skip_8yd: { rate: 380, description: "8 yard skip" },
  forklift: { rate: 185, description: "Telehandler" },
  crane: { rate: 850, description: "Mobile crane (per lift)" },
};

export const TRADE_PRODUCTIVITY = {
  // Output per day (8 hours)
  bricklaying: {
    bricks_per_day: 450, // Bricks per bricklayer per day
    blocks_per_day: 80, // Blocks per bricklayer per day
    labourer_ratio: 0.5, // Labourers per bricklayer
  },
  excavation: {
    strip_m3_per_day: 15, // m³ per day with mini digger
    trench_m_per_day: 25, // m trench per day
  },
  carpentry: {
    floor_joists_m2_per_day: 20,
    roof_m2_per_day: 12,
    stud_wall_m2_per_day: 25,
  },
  plastering: {
    board_m2_per_day: 40,
    skim_m2_per_day: 60,
  },
  roofing: {
    tiles_m2_per_day: 15,
    flat_m2_per_day: 20,
  },
  electrical: {
    points_per_day: 8,
    board_per_day: 1,
  },
  plumbing: {
    points_per_day: 4,
    radiators_per_day: 5,
  },
};

// Regional multipliers for UK (Jan 2026)
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

// Calculate bricks required for wall area
export function calculateBricksRequired(wallArea: number, openingsArea: number = 0): number {
  const BRICKS_PER_SQM = 60; // Standard half-brick wall
  const netArea = wallArea - openingsArea;
  const wasteFactor = 1.05;
  return Math.ceil(netArea * BRICKS_PER_SQM * wasteFactor);
}

// Calculate blocks required for inner leaf
export function calculateBlocksRequired(wallArea: number, openingsArea: number = 0): number {
  const BLOCKS_PER_SQM = 10; // 100mm blocks
  const netArea = wallArea - openingsArea;
  const wasteFactor = 1.03;
  return Math.ceil(netArea * BLOCKS_PER_SQM * wasteFactor);
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

// Calculate labour hours for a task
export function calculateLabourHours(
  quantity: number,
  outputPerDay: number,
  hoursPerDay: number = 8
): number {
  return (quantity / outputPerDay) * hoursPerDay;
}
