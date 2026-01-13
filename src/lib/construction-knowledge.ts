// Comprehensive Construction Knowledge Base
// UK Building Construction Data, Calculations, and Technical Reference
// Based on industry standards and current UK trade practices (Jan 2026)

// ============================================================================
// PROJECT COST BREAKDOWN STRUCTURE
// ============================================================================

export interface ProjectCostBreakdown {
  design: number; // 3% of total
  preliminaries: number; // 3% of total
  finance: number; // 7% of total
  profit: number; // 7% of total
  plot: number; // 30% minimum (variable by location)
  construction: number; // ~50% of total
}

export const COST_DISTRIBUTION = {
  design_percentage: 0.03,
  preliminaries_percentage: 0.03,
  finance_percentage: 0.07,
  profit_percentage: 0.07,
  plot_minimum_percentage: 0.30,
  construction_percentage: 0.50,
};

// ============================================================================
// MODEL HOUSE SPECIFICATIONS (160m² 4-bed detached reference)
// ============================================================================

export interface ModelHouseSpecs {
  internalFloorArea: number; // m²
  externalDimensions: { length: number; width: number }; // metres
  wallThickness: number; // mm
  floors: number;
  floorAreaPerFloor: number; // m²
  chimneyIncluded: boolean;
}

export const MODEL_HOUSE: ModelHouseSpecs = {
  internalFloorArea: 160,
  externalDimensions: { length: 13, width: 7.3 },
  wallThickness: 375,
  floors: 2,
  floorAreaPerFloor: 80,
  chimneyIncluded: false,
};

// ============================================================================
// MODEL HOUSE COST SUMMARY (Jan 2026 UK prices)
// ============================================================================

export const MODEL_HOUSE_COSTS = {
  professionals: { design_fees: 11000, total: 11000 },
  groundworks: {
    excavation_foundations: { materials: 8400, labour: 6900, plant: 5400, total: 21000 },
    drains_services: { materials: 4700, labour: 2900, total: 8000 },
    service_connections: { fees: 5600, total: 6000 },
    subtotal: 35000,
  },
  superstructure: {
    inner_skin: { materials: 2600, labour: 3300, total: 6000 },
    steels_lintels: { materials: 1300, labour: 200, total: 1500 },
    external_cladding: { materials: 7000, labour: 7000, total: 14000 },
    insulation: { materials: 3900, labour: 1500, total: 5000 },
    joinery: { materials: 11000, labour: 2000, total: 13000 },
    internal_floor: { materials: 3900, labour: 2500, total: 6000 },
    internal_walls: { materials: 1600, labour: 1800, total: 3000 },
    roof_carpentry: { materials: 2500, labour: 1500, total: 4000 },
    roof_cover: { materials: 6200, labour: 3200, total: 9000 },
    rainwater: { materials: 1000, labour: 1300, total: 2300 },
    subtotal: 64000,
  },
  heating_plumbing: {
    heating_system: { total: 7500 },
    hot_water: { total: 2500 },
    sanitaryware: { total: 5000 },
    subtotal: 15000,
  },
  electrical: { materials: 2000, labour: 4500, total: 6500 },
  finishes: {
    plastering: { materials: 3200, labour: 5200, total: 8400 },
    second_fix_carpentry: { materials: 4500, labour: 4000, total: 8500 },
    decoration: { materials: 1800, labour: 3200, total: 5000 },
    floor_finishes: { materials: 3200, labour: 2800, total: 6000 },
    subtotal: 28000,
  },
  external_works: { driveway: 4000, landscaping: 2500, total: 6500 },
  grand_total: 166000,
  cost_per_sqm: 1037,
};

// ============================================================================
// FOUNDATION CALCULATIONS
// ============================================================================

export interface FoundationCalculation {
  type: 'strip' | 'trench_fill' | 'raft' | 'piled';
  width_mm: number;
  depth_mm: number;
  concrete_grade: string;
  reinforcement: boolean;
}

export const FOUNDATION_SPECS = {
  strip: {
    standard_width: 600, // mm
    min_depth: 250, // mm concrete thickness
    trench_depth_min: 450, // mm below ground
    trench_depth_typical: 750, // mm typical
    concrete_grade: 'C25',
    description: 'Traditional strip footings with block/brick footings above',
  },
  trench_fill: {
    standard_width: 600, // mm (450mm available)
    min_depth: 600, // mm
    typical_depth: 900, // mm
    concrete_grade: 'C25',
    description: 'Trench filled with concrete to near ground level - faster than strip',
  },
  raft: {
    typical_thickness: 300, // mm
    edge_beam_depth: 450, // mm
    edge_beam_width: 450, // mm
    reinforcement: 'A393 mesh top and bottom',
    concrete_grade: 'C30',
    description: 'Full slab foundation for poor ground or where differential settlement expected',
  },
  piled: {
    min_pile_diameter: 300, // mm
    typical_pile_diameter: 450, // mm
    pile_spacing: 2500, // mm typical
    ground_beam_width: 450, // mm
    ground_beam_depth: 450, // mm
    description: 'For very poor ground, made ground, or trees affecting foundations',
  },
};

// Foundation costs per linear metre (Jan 2026)
export const FOUNDATION_RATES_PER_M = {
  strip_600w: { materials: 28, labour: 15, total: 43 },
  strip_face_brick: { materials: 52, labour: 35, total: 87 },
  trench_fill_600w: { materials: 48, labour: 5, total: 53 },
  trench_fill_450w: { materials: 36, labour: 6, total: 42 },
  trenchblock_300mm: { materials: 30, labour: 19, total: 49 },
};

// Material rates for foundations
export const FOUNDATION_MATERIALS = {
  trenchblock_300mm: { unit: 'm²', rate: 30 },
  celcon_blocks: { unit: 'm²', rate: 12 },
  regrade_bricks: { unit: 'm²', rate: 10 },
  face_bricks: { unit: 'm²', rate: 48 },
  blockwork_mortar: { unit: 'm²', rate: 1.00 },
  brickwork_mortar: { unit: 'm²', rate: 3.60 },
  dpc: { unit: 'm', rate: 1.00 },
  readymix_concrete: { unit: 'm³', rate: 80 },
};

// ============================================================================
// GROUND FLOOR SPECIFICATIONS
// ============================================================================

export const GROUND_FLOOR_OPTIONS = {
  solid_slab: {
    layers: ['hardcore', 'sand_blinding', 'dpm', 'concrete', 'insulation', 'screed', 'floor_cover'],
    total_depth_mm: 500,
    concrete_thickness: 100, // mm
    cost_per_sqm: { unreinforced: 76, reinforced: 83 },
    description: 'Most labour intensive, cheapest on materials - suitable for DIY',
  },
  beam_and_block: {
    cost_per_sqm: 77, // inc 100mm insulation and 65mm screed
    beam_spacing: 600, // mm typical
    block_size: { width: 440, length: 100, depth: 215 }, // mm standard block
    min_area_economic: 50, // m² - below this not economic
    camber: 13, // mm per 4m beam (1:300 ratio)
    description: 'Fast, dry installation - popular for speed',
  },
  hollow_core: {
    cost_per_sqm: 90, // inc 100mm insulation and 65mm screed
    plank_depth: 150, // mm typical
    max_span: 8000, // mm
    description: 'Most expensive precast - excellent soundproofing, used in apartments',
  },
  jet_floor: {
    cost_per_sqm: 77, // inc 65mm screed (insulation built-in)
    description: 'Insulated beam floor system - polystyrene infill blocks',
  },
  timber_joist: {
    cost_per_sqm: 89, // inc base concrete and chipboard
    description: 'Traditional but requires concrete capping, ventilation airbricks',
  },
  i_beam: {
    cost_per_sqm: 94, // inc base concrete and chipboard
    max_span: 6000, // mm
    description: 'No shrinkage, no squeaking - American innovation',
  },
};

export const FLOOR_COMPONENT_RATES = {
  beam_and_block: { materials: 25, labour: 13, total: 38 },
  jet_floor: { materials: 26, labour: 13, total: 39 },
  hollow_core: { materials: 40, labour: 13, total: 53 },
  telescopic_vents: { materials: 1.30, labour: 1.80, total: 3, unit: 'each' },
  airbricks: { materials: 1, total: 1, unit: 'each' },
  dpm_100m2_roll: { materials: 0.60, labour: 1.80, total: 2, unit: 'm²' },
  insulation_125mm: { materials: 20, labour: 4, total: 24, unit: 'm²' },
  insulation_150mm: { materials: 25, labour: 4, total: 29, unit: 'm²' },
  eps_175mm: { materials: 14, labour: 4, total: 18, unit: 'm²' },
  screed_65mm: { materials: 8, labour: 7, total: 15, unit: 'm²' },
  gypsum_screed_50mm: { materials: 20, total: 20, unit: 'm²' },
  concrete_100mm: { materials: 8, labour: 9, total: 17, unit: 'm²' },
  leanmix_50mm: { materials: 4, labour: 4, total: 8, unit: 'm²' },
  reinforcing_mesh: { materials: 4, labour: 4, total: 8, unit: 'm²' },
  hardcore_150mm: { materials: 8, labour: 8, total: 16, unit: 'm²' },
  sand_blinding: { materials: 3, labour: 2, total: 5, unit: 'm²' },
  joists_50x200: { materials: 14, labour: 17, total: 31, unit: 'm²' },
  i_beams_50x200: { materials: 25, labour: 11, total: 36, unit: 'm²' },
  chipboard_22mm: { materials: 11, labour: 6, total: 17, unit: 'm²' },
};

// ============================================================================
// WALL CONSTRUCTION SPECIFICATIONS
// ============================================================================

export const WALL_CONSTRUCTION = {
  cavity_wall: {
    standard_width: 350, // mm (getting wider for more insulation)
    inner_skin: 100, // mm blocks
    cavity: 150, // mm (filled with insulation)
    outer_skin: 100, // mm bricks/blocks
  },
  block_types: {
    dense: { weight: 'heavy', strength_n: 7, cost_sqm: 8, use: 'below ground' },
    lightweight_clinker: { weight: 'half dense', strength_n: 3.5, cost_sqm: 8, use: 'inner leaf, partitions' },
    aircrete: { weight: 'very light', strength_n: 3.5, cost_sqm: 12, use: 'inner leaf, insulating' },
  },
  bricks_per_sqm: 60, // standard half-brick wall
  blocks_per_sqm: 10, // standard 100mm blocks
  mortar_per_1000_bricks: 0.5, // m³
  mortar_per_100_blocks: 0.05, // m³
};

export const INNER_SKIN_RATES = {
  celcon_100mm: { materials: 14, accessories: 2, labour_mins: 35, labour_rate: 15, total: 29 },
  hemelite_blocks: { materials: 12, accessories: 2, labour_mins: 35, labour_rate: 15, total: 29 },
  thin_joint_blocks: { materials: 12, accessories: 4, labour_mins: 25, labour_rate: 10, total: 26 },
  timber_frame_90mm: { materials: 19, accessories: 14, labour_mins: 50, labour_rate: 21, total: 40 },
  timber_frame_140mm: { materials: 23, accessories: 14, labour_mins: 50, labour_rate: 21, total: 44 },
  timber_frame_185mm: { materials: 24, accessories: 14, labour_mins: 50, labour_rate: 21, total: 45 },
};

// Bricklayer rates (labour only per m²)
export const BRICKLAYING_RATES = {
  face_brickwork: { min: 12, max: 16, typical: 14 },
  blockwork: { min: 10, max: 14, typical: 12 },
  bricks_per_day: 450, // face brickwork
  bricks_per_day_eng: 550, // engineering bricks
  blocks_per_day: 80, // 100mm blocks
};

// ============================================================================
// OUTER SKIN / CLADDING OPTIONS
// ============================================================================

export const OUTER_SKIN_COSTS_SQM = {
  brick_facing: { materials: 52, labour: 35, total: 87 },
  render_on_block: { materials: 18, labour: 22, total: 40 },
  reconstituted_stone: { materials: 32, labour: 40, total: 72 },
  natural_stone: { materials: 95, labour: 67, total: 162 },
  timber_cladding_softwood: { materials: 28, labour: 18, total: 46 },
  timber_cladding_cedar: { materials: 52, labour: 18, total: 70 },
  timber_cladding_thermowood: { materials: 45, labour: 18, total: 63 },
  timber_cladding_accoya: { materials: 85, labour: 18, total: 103 },
  timber_cladding_charred: { materials: 95, labour: 22, total: 117 },
  fibre_cement_board: { materials: 32, labour: 18, total: 50 },
  upvc_cladding: { materials: 22, labour: 15, total: 37 },
  vertical_tiling: { materials: 45, labour: 35, total: 80 },
  brick_slips: { materials: 55, labour: 45, total: 100 },
  corten_steel: { materials: 120, labour: 45, total: 165 },
  structural_glass: { materials: 1000, labour: 200, total: 1200 },
};

// ============================================================================
// INSULATION SPECIFICATIONS
// ============================================================================

export const INSULATION_TYPES = {
  glass_fibre: {
    conductivity: 0.044, // W/mK
    density: 12, // kg/m³
    fire_rating: 'A1',
    pros: ['Cheap', 'Non-combustible'],
    cons: ['Itchy to work with', 'Sags in walls without wicking'],
  },
  mineral_wool: {
    conductivity: 0.037, // W/mK
    density: 45, // kg/m³
    fire_rating: 'A1',
    pros: ['Excellent fire resistance', 'Acoustic properties'],
    cons: ['Heavier than glass wool'],
    brand: 'Rockwool',
  },
  sheeps_wool: {
    conductivity: 0.038, // W/mK
    fire_rating: 'B-s1',
    pros: ['Natural', 'Pleasant to work with', 'Breathable'],
    cons: ['Expensive', 'Needs moth treatment'],
  },
  expanded_polystyrene: {
    conductivity: 0.038, // W/mK
    density: 15, // kg/m³
    brands: ['Jablite', 'Kay-cel'],
    pros: ['Cheap', 'Lightweight', 'Can be blown into cavities'],
    cons: ['Lower performance than PIR'],
  },
  extruded_polystyrene: {
    conductivity: 0.034, // W/mK
    brand: 'Styrofoam',
    pros: ['Moisture resistant', 'Good for below ground'],
    cons: ['More expensive than EPS'],
  },
  polyurethane_pir: {
    conductivity: 0.022, // W/mK
    brands: ['Celotex', 'Kingspan'],
    pros: ['Most efficient mass-market insulator', 'Foil-faced'],
    cons: ['Expensive', 'Combustible'],
  },
  cellulose_fibre: {
    conductivity: 0.040, // W/mK
    brand: 'Warmcel',
    pros: ['Recycled newspapers', 'No vapour barrier needed'],
    cons: ['Must be blown in by specialists'],
  },
};

export const INSULATION_COSTS_SQM = {
  glass_fibre_100mm: { materials: 4, labour: 3, total: 7 },
  glass_fibre_150mm: { materials: 6, labour: 3, total: 9 },
  mineral_wool_100mm: { materials: 6, labour: 3, total: 9 },
  mineral_wool_150mm: { materials: 9, labour: 3, total: 12 },
  pir_50mm: { materials: 11, labour: 4, total: 15 },
  pir_100mm: { materials: 20, labour: 4, total: 24 },
  pir_120mm: { materials: 26, labour: 4, total: 30 },
  eps_100mm: { materials: 9, labour: 3, total: 12 },
  sheeps_wool_100mm: { materials: 18, labour: 4, total: 22 },
};

// ============================================================================
// ROOFING SPECIFICATIONS
// ============================================================================

export const ROOF_COVERING_COSTS_SQM = {
  concrete_interlocking: { materials: 22, labour: 18, total: 40, lifespan_years: 50 },
  clay_plain_tiles: { materials: 52, labour: 38, total: 90, lifespan_years: 60 },
  clay_interlocking: { materials: 42, labour: 25, total: 67, lifespan_years: 60 },
  natural_slate: { materials: 68, labour: 45, total: 113, lifespan_years: 100 },
  reconstituted_slate: { materials: 32, labour: 28, total: 60, lifespan_years: 40 },
  fibre_cement_slate: { materials: 28, labour: 25, total: 53, lifespan_years: 30 },
  zinc_standing_seam: { materials: 145, labour: 55, total: 200, lifespan_years: 80 },
  copper: { materials: 180, labour: 60, total: 240, lifespan_years: 100 },
  lead: { materials: 165, labour: 55, total: 220, lifespan_years: 100 },
};

export const FLAT_ROOF_COSTS_SQM = {
  mastic_asphalt: { materials: 35, labour: 35, total: 70, guarantee_years: 20 },
  built_up_felt: { materials: 25, labour: 25, total: 50, guarantee_years: 15 },
  epdm_rubber: { materials: 28, labour: 20, total: 48, guarantee_years: 25 },
  single_ply_pvc: { materials: 45, labour: 35, total: 80, guarantee_years: 25 },
  grp_fibreglass: { materials: 55, labour: 30, total: 85, guarantee_years: 25 },
  green_roof_extensive: { materials: 85, labour: 35, total: 120, description: 'Sedum plants' },
  green_roof_intensive: { materials: 180, labour: 70, total: 250, description: 'Full roof garden' },
};

// ============================================================================
// RAINWATER / ROOF EDGE
// ============================================================================

export const RAINWATER_RATES = {
  labour_rate_per_hour: 22,
  fascia_boards_fix_mins_per_m: 15,
  soffit_board_fix_mins_per_m: 30,
  bargeboards_fix_mins_per_m: 30,
  cappings_fix_mins_per_m: 15,
  rainwater_goods_fix_mins_per_m: 30,
};

export const RAINWATER_MATERIALS = {
  upvc_rainwater: { rate_per_m: 15 },
  aluminium_rainwater: { rate_per_m: 30 },
  cast_iron_rainwater: { rate_per_m: 85 },
  copper_rainwater: { rate_per_m: 120 },
  upvc_fascias_soffits: { rate_per_m: 8 },
  timber_fascias_soffits: { rate_per_m: 6 },
  stainless_steel_cappings: { rate_per_m: 8 },
};

export const RAINWATER_TOTALS_PER_M = {
  timber_fascias_soffits: { materials: 6, time_mins: 45, labour: 17, total: 23 },
  timber_bargeboards: { materials: 6, time_mins: 30, labour: 11, total: 17 },
  upvc_fascias_soffits: { materials: 8, time_mins: 45, labour: 22, total: 30 },
  upvc_rainwater: { materials: 15, time_mins: 30, labour: 11, total: 26 },
  metal_rainwater: { materials: 30, time_mins: 30, labour: 11, total: 41 },
  stainless_cappings: { materials: 8, time_mins: 15, labour: 6, total: 14 },
};

// ============================================================================
// HEATING SYSTEMS
// ============================================================================

export const BOILER_TYPES = {
  combi: {
    output_range: '24-40 kW',
    dhw_method: 'Instantaneous',
    hot_water_storage: false,
    mains_pressure: true,
    typical_cost: 2400,
    pros: ['Compact', 'No cylinder needed', 'Mains pressure showers'],
    cons: ['Limited DHW flow', 'Less suitable for large houses'],
  },
  system: {
    output_range: '12-30 kW',
    dhw_method: 'Unvented cylinder',
    hot_water_storage: true,
    mains_pressure: true,
    typical_cost: 2150,
    cylinder_cost: 1650,
    pros: ['Better for larger houses', 'Multiple outlets at once'],
    cons: ['Needs cylinder space', 'More complex'],
  },
  regular: {
    output_range: '12-30 kW',
    dhw_method: 'Vented cylinder + header tank',
    hot_water_storage: true,
    mains_pressure: false,
    typical_cost: 1800,
    pros: ['Simple, proven technology', 'Compatible with solar thermal'],
    cons: ['Needs loft tanks', 'Lower water pressure'],
  },
};

export const RADIATOR_OUTPUTS = {
  // Output in kW based on size
  '300x400': 0.25,
  '300x600': 0.40,
  '400x800': 0.60,
  '600x600': 0.80,
  '600x1000': 1.20,
  '600x1400': 1.60,
  '600x2000': 2.40,
  '700x2000_double': 4.00,
};

export const HEATING_SYSTEM_COSTS = {
  radiator_system_typical: {
    boiler: 2400,
    radiators_15nr: 750,
    piping_100m: 300,
    trv_valves_15nr: 150,
    controls: 200,
    labour: 3500,
    total: 7300,
  },
  underfloor_heating_wet: {
    cost_per_sqm_additional: 18, // vs radiators
    manifold: 450,
    controls: 350,
    description: 'UFH adds £1,500-£2,500 to typical 4-bed house',
  },
  skirting_heating: {
    cost_per_linear_m: 35,
    description: 'More even heat, but expensive for whole house',
  },
};

// Heat requirement calculation (simplified)
export function calculateHeatRequirement(
  floorArea: number,
  insulationLevel: 'poor' | 'average' | 'good' | 'excellent'
): number {
  const wattsPerSqm: Record<string, number> = {
    poor: 100, // old house, minimal insulation
    average: 70, // Part L compliant (2006)
    good: 50, // Part L compliant (2022)
    excellent: 25, // Passivhaus standard
  };
  return (floorArea * wattsPerSqm[insulationLevel]) / 1000; // kW
}

// ============================================================================
// ELECTRICAL SPECIFICATIONS
// ============================================================================

export const ELECTRICAL_POINTS_TYPICAL = {
  // Typical 4-bed house
  double_sockets: 35,
  single_sockets: 5,
  lighting_points: 28,
  switches: 22,
  outdoor_lights: 4,
  smoke_alarms: 5,
  cooker_point: 1,
  hob_point: 1,
  shower_point: 1,
  consumer_unit: 1,
  outdoor_socket: 2,
  tv_points: 4,
  data_points: 4,
};

export const ELECTRICAL_RATES = {
  points_first_fix_per_day: 12,
  points_second_fix_per_day: 16,
  consumer_unit_per_day: 1,
  test_and_certification: 350,
};

export const ELECTRICAL_COSTS_TYPICAL = {
  materials_4_bed: 2000,
  labour_4_bed: 4500,
  total_4_bed: 6500,
  cost_per_point: 55, // average including materials and labour
};

// ============================================================================
// FIRST FLOOR / INTERMEDIATE FLOOR COSTS
// ============================================================================

export const FIRST_FLOOR_RATES_SQM = {
  timber_joists: { materials: 18, time_mins: 45, labour: 17, total: 35 },
  i_beams: { materials: 20, time_mins: 30, labour: 11, total: 31 },
  chipboard_22mm: { materials: 11, time_mins: 15, labour: 6, total: 17 },
  weatherdeck_22mm: { materials: 17, time_mins: 15, labour: 6, total: 22 },
  acoustic_quilt: { materials: 3, time_mins: 10, labour: 4, total: 7 },
  acoustic_upgrade_party: { materials: 22, time_mins: 40, labour: 15, total: 37 },
  beam_and_block: { materials: 25, time_mins: 35, labour: 13, total: 38 },
  hollow_core: { materials: 40, time_mins: 30, labour: 11, total: 51 },
  screed_65mm: { materials: 8, time_mins: 20, labour: 7, total: 15 },
  gypsum_screed_50mm: { materials: 20, total: 20 }, // supply and fix
};

export const FLOOR_OPTIONS_TOTAL_SQM = {
  timber_joist_40dB: 60, // Part E2 compliant
  timber_joist_party_floor: 100, // Party floor standard
  i_beam_40dB: 55,
  i_beam_party_floor: 100,
  beam_block_40dB: 50,
  beam_block_party: 55,
  hollow_core_party: 66, // All versions meet party floor standard
};

// ============================================================================
// SOUND INSULATION (Part E)
// ============================================================================

export const SOUND_INSULATION = {
  naked_floor: {
    construction: 'Timber joists, chipboard, single plasterboard',
    db_reduction: 35,
    compliant: false,
  },
  part_e2_domestic: {
    construction: 'Add insulation + heavier ceiling board (10kg/m²)',
    db_reduction: 40,
    additional_cost_sqm: 0,
    compliant: true,
  },
  with_carpet: {
    improvement_db: 5,
    description: 'Carpet + underlay dramatically improves impact sound',
  },
  resilient_bars: {
    improvement_db: 2,
    cost_per_m: 0.65,
    description: 'Separates ceiling from joists',
  },
  double_plasterboard: {
    improvement_db: 3,
    additional_cost_sqm: 5,
  },
  floating_floor: {
    improvement_db: 5,
    additional_cost_sqm: 12,
    floor_depth_addition_mm: 50,
  },
  precast_concrete: {
    airborne_improvement_db: 15, // vs timber
    description: 'Substantial improvement but cost penalty',
  },
};

// ============================================================================
// FINISHES COSTS
// ============================================================================

export const FINISH_COSTS_SQM = {
  plastering_skim_2coat: { materials: 3, labour: 9, total: 12 },
  plasterboard_and_skim: { materials: 8, labour: 15, total: 23 },
  dry_lining_dot_dab: { materials: 7, labour: 10, total: 17 },
  render_external: { materials: 12, labour: 22, total: 34 },
  paint_emulsion_2coat: { materials: 2, labour: 5, total: 7 },
  paint_satinwood: { materials: 3, labour: 8, total: 11 },
  wallpaper: { materials: 8, labour: 12, total: 20 },
  wall_tiling: { materials: 35, labour: 28, total: 63 },
  floor_tiling_ceramic: { materials: 28, labour: 25, total: 53 },
  floor_tiling_porcelain: { materials: 45, labour: 28, total: 73 },
  laminate_flooring: { materials: 22, labour: 8, total: 30 },
  engineered_oak: { materials: 55, labour: 12, total: 67 },
  solid_oak: { materials: 85, labour: 15, total: 100 },
  carpet_mid_range: { materials: 28, labour: 5, total: 33 },
};

export const SECOND_FIX_CARPENTRY_RATES = {
  skirting_per_m: { materials: 3, labour: 4, total: 7 },
  architrave_per_m: { materials: 2, labour: 3, total: 5 },
  door_lining_set: { materials: 45, labour: 25, total: 70 },
  internal_door_hung: { materials: 145, labour: 45, total: 190 },
  staircase_standard: { materials: 1200, labour: 800, total: 2000 },
  staircase_oak: { materials: 4500, labour: 1200, total: 5700 },
};

// ============================================================================
// PROJECT MANAGEMENT FACTORS
// ============================================================================

export const PROJECT_MANAGEMENT_FACTORS = {
  experience: {
    numerous_previous: 1.0,
    quite_a_bit_well_organised: 1.5,
    never_tried_before: 4.0,
  },
  complexity: {
    boring_design: 1.0,
    few_unusual_features: 1.5,
    architect_really_chuffed: 3.0,
  },
  site: {
    flat_open_loads_of_room: 1.0,
    tight_and_slopes: 1.5,
    clifftop_4wd_only: 3.0,
  },
  publicity: {
    no_filming: 1.0,
    grand_designs_interested: 1.5,
    grand_designs_filming: 3.0,
  },
};

// Builder profit margins
export const BUILDER_MARGINS = {
  project_management_overhead: 0.15, // 15% on raw costs
  minimum_profit: 0.05, // 5%
  typical_profit: 0.15, // 15%
  maximum_profit: 0.50, // 50% (busy times, risky jobs)
  recession_margin: 0.05, // 5% (hard times)
  boom_margin: 0.30, // 30% (good times)
};

// ============================================================================
// STAMP DUTY (2026 rates)
// ============================================================================

export function calculateStampDuty(purchasePrice: number, isAdditionalProperty: boolean = false): number {
  const bands = [
    { threshold: 125000, rate: 0 },
    { threshold: 250000, rate: 0.02 },
    { threshold: 925000, rate: 0.05 },
    { threshold: 1500000, rate: 0.10 },
    { threshold: Infinity, rate: 0.12 },
  ];
  
  const additionalRate = isAdditionalProperty ? 0.03 : 0;
  let duty = 0;
  let previousThreshold = 0;
  
  for (const band of bands) {
    if (purchasePrice > previousThreshold) {
      const taxableAmount = Math.min(purchasePrice, band.threshold) - previousThreshold;
      duty += taxableAmount * (band.rate + additionalRate);
      previousThreshold = band.threshold;
    } else {
      break;
    }
  }
  
  return duty;
}

// ============================================================================
// DRAINAGE SPECIFICATIONS
// ============================================================================

export const DRAINAGE_SPECS = {
  trench_width: 450, // mm (digger narrow bucket)
  pipe_size_standard: 110, // mm for up to 5 WCs
  min_depth: 600, // mm (else needs protection)
  max_working_depth: 1200, // mm (problems working deeper)
  optimum_fall: '1:80', // 250mm per 20m run
  pea_shingle_per_8m: 1, // tonne
  backfill_percentage: 80, // % of excavated material returns
};

export const DRAINAGE_RATES = {
  straight_run_per_m: 40, // excavate, lay, backfill
  with_fittings_per_m: 70, // including manholes etc
  inspection_chamber: 195,
  manhole_600x600: 520,
  rodding_access: 85,
  soakaway_crate: 620,
  connection_to_main: 850,
};

// ============================================================================
// SERVICE CONNECTION COSTS
// ============================================================================

export const SERVICE_CONNECTIONS = {
  electricity: { typical: 1200, range: '500-3000' },
  gas: { typical: 800, range: '400-2500' },
  water: { typical: 1500, range: '800-3500' },
  sewer: { typical: 2500, range: '1000-5000' },
  telecoms: { typical: 200, range: '0-500' },
  total_typical: 6200,
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function calculateWallArea(
  perimeter: number,
  height: number,
  openingsArea: number = 0
): number {
  return (perimeter * height) - openingsArea;
}

export function calculateBricksForWall(wallAreaSqm: number, wasteFactor: number = 1.05): number {
  return Math.ceil(wallAreaSqm * 60 * wasteFactor);
}

export function calculateBlocksForWall(wallAreaSqm: number, wasteFactor: number = 1.03): number {
  return Math.ceil(wallAreaSqm * 10 * wasteFactor);
}

export function calculateConcreteVolume(
  area: number,
  thickness_mm: number
): number {
  return area * (thickness_mm / 1000);
}

export function calculateTrenchfillConcrete(perimeterM: number, widthMm: number, depthMm: number): number {
  return perimeterM * (widthMm / 1000) * (depthMm / 1000);
}

export function calculateMortarForBricks(brickCount: number): number {
  return (brickCount / 1000) * 0.5; // m³
}

export function calculateMortarForBlocks(blockCount: number): number {
  return (blockCount / 100) * 0.05; // m³
}

export function calculateRoofArea(footprint: number, pitchDegrees: number): number {
  const pitchRadians = (pitchDegrees * Math.PI) / 180;
  return footprint / Math.cos(pitchRadians);
}

export function calculateScaffoldPerimeter(
  buildingPerimeter: number,
  lifts: number = 2
): { linMetres: number; weeks: number; cost: number } {
  const linMetres = buildingPerimeter * lifts;
  const typicalWeeks = 16;
  const costPerMeterWeek = 15;
  return {
    linMetres,
    weeks: typicalWeeks,
    cost: linMetres * typicalWeeks * costPerMeterWeek,
  };
}
