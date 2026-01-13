// Comprehensive Construction Estimator Calculators
// UK Building Standards - Jan 2026 Pricing

import { MATERIALS_2026, LABOUR_RATES_2026, PLANT_RATES_2026, TRADE_PRODUCTIVITY, REGIONAL_MULTIPLIERS } from './construction-rates';
import { FOUNDATION_SPECS, FOUNDATION_RATES_PER_M, WALL_CONSTRUCTION, INSULATION_COSTS_SQM, ROOF_COVERING_COSTS_SQM, FLAT_ROOF_COSTS_SQM, BOILER_TYPES, RADIATOR_OUTPUTS, HEATING_SYSTEM_COSTS, calculateHeatRequirement, calculateWallArea, calculateBricksForWall, calculateBlocksForWall, calculateConcreteVolume, calculateRoofArea, calculateScaffoldPerimeter } from './construction-knowledge';

// ============================================================================
// BRICKWORK & MASONRY CALCULATOR
// ============================================================================

export interface BrickworkCalculation {
  wallArea: number;
  bricksRequired: number;
  blocksRequired: number;
  mortarVolume: number;
  wastage: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  labourDays: number;
  breakdown: {
    bricks: { quantity: number; cost: number };
    blocks: { quantity: number; cost: number };
    mortar: { volume: number; cost: number };
    sand: { volume: number; cost: number };
    cement: { bags: number; cost: number };
    dpc: { length: number; cost: number };
    lintels: { quantity: number; cost: number };
  };
}

export function calculateBrickwork(params: {
  length: number; // metres
  height: number;
  wallType: 'cavity' | 'solid' | 'block_only';
  brickType: 'standard' | 'facing' | 'reclaimed' | 'handmade';
  blockType: 'standard' | 'aerated' | 'insulated';
  openingsArea?: number; // deduction for windows/doors
  lintelsCount?: number;
  dpcLength?: number;
  region?: keyof typeof REGIONAL_MULTIPLIERS;
  pricingType?: 'trade' | 'retail';
}): BrickworkCalculation {
  const {
    length,
    height,
    wallType,
    brickType,
    blockType,
    openingsArea = 0,
    lintelsCount = 0,
    dpcLength = 0,
    region = 'south_east',
    pricingType = 'retail'
  } = params;

  const regionMultiplier = REGIONAL_MULTIPLIERS[region];
  const pricing = pricingType;

  // Calculate wall area
  const grossArea = length * height;
  const netArea = Math.max(0, grossArea - openingsArea);

  // Bricks: 60 per sqm for half-brick skin
  const bricksPerSqm = WALL_CONSTRUCTION.bricks_per_sqm;
  const blocksPerSqm = WALL_CONSTRUCTION.blocks_per_sqm;
  
  const wasteFactor = 1.05; // 5% waste
  
  let bricksRequired = 0;
  let blocksRequired = 0;
  
  if (wallType === 'cavity') {
    bricksRequired = Math.ceil(netArea * bricksPerSqm * wasteFactor);
    blocksRequired = Math.ceil(netArea * blocksPerSqm * wasteFactor);
  } else if (wallType === 'solid') {
    bricksRequired = Math.ceil(netArea * bricksPerSqm * 2 * wasteFactor); // Double thickness
  } else {
    blocksRequired = Math.ceil(netArea * blocksPerSqm * wasteFactor);
  }

  // Mortar calculations
  const mortarPerBricks = WALL_CONSTRUCTION.mortar_per_1000_bricks;
  const mortarPerBlocks = WALL_CONSTRUCTION.mortar_per_100_blocks;
  const mortarVolume = (bricksRequired / 1000 * mortarPerBricks) + (blocksRequired / 100 * mortarPerBlocks);
  
  // Material costs
  const brickRate = MATERIALS_2026.bricks[brickType]?.[pricing] || MATERIALS_2026.bricks.standard[pricing];
  const blockRate = MATERIALS_2026.blocks[blockType]?.[pricing] || MATERIALS_2026.blocks.standard[pricing];
  
  const brickCost = bricksRequired * brickRate;
  const blockCost = blocksRequired * blockRate;
  const mortarCost = mortarVolume * MATERIALS_2026.mortar[pricing];
  const sandCost = mortarVolume * 1.5 * MATERIALS_2026.sand[pricing]; // 1.5 tonnes per m³ mortar
  const cementBags = Math.ceil(mortarVolume * 8); // ~8 bags per m³
  const cementCost = cementBags * MATERIALS_2026.cement[pricing];
  const dpcCost = dpcLength * 1.0; // ~£1/m for DPC
  const lintelCost = lintelsCount * 45; // Average lintel cost

  const materialCost = (brickCost + blockCost + mortarCost + sandCost + cementCost + dpcCost + lintelCost) * regionMultiplier;

  // Labour calculations
  const bricklayerRate = LABOUR_RATES_2026.bricklayer[pricing];
  const labourerRate = LABOUR_RATES_2026.labourer[pricing];
  
  const brickDays = bricksRequired / TRADE_PRODUCTIVITY.bricklaying.bricks_per_day;
  const blockDays = blocksRequired / TRADE_PRODUCTIVITY.bricklaying.blocks_per_day;
  const totalDays = brickDays + blockDays;
  
  const labourCost = (totalDays * 8 * (bricklayerRate + labourerRate * 0.5)) * regionMultiplier;

  return {
    wallArea: netArea,
    bricksRequired,
    blocksRequired,
    mortarVolume,
    wastage: wasteFactor - 1,
    materialCost,
    labourCost,
    totalCost: materialCost + labourCost,
    labourDays: Math.ceil(totalDays),
    breakdown: {
      bricks: { quantity: bricksRequired, cost: brickCost * regionMultiplier },
      blocks: { quantity: blocksRequired, cost: blockCost * regionMultiplier },
      mortar: { volume: mortarVolume, cost: mortarCost * regionMultiplier },
      sand: { volume: mortarVolume * 1.5, cost: sandCost * regionMultiplier },
      cement: { bags: cementBags, cost: cementCost * regionMultiplier },
      dpc: { length: dpcLength, cost: dpcCost * regionMultiplier },
      lintels: { quantity: lintelsCount, cost: lintelCost * regionMultiplier },
    }
  };
}

// ============================================================================
// ROOFING CALCULATOR
// ============================================================================

export interface RoofingCalculation {
  roofArea: number;
  coveringCost: number;
  structureCost: number;
  rainwaterCost: number;
  labourCost: number;
  totalCost: number;
  labourDays: number;
  breakdown: {
    covering: { type: string; area: number; cost: number };
    felt: { area: number; cost: number };
    battens: { length: number; cost: number };
    ridge: { length: number; cost: number };
    fascia: { length: number; cost: number };
    soffit: { length: number; cost: number };
    guttering: { length: number; cost: number };
    downpipes: { quantity: number; cost: number };
  };
}

export function calculateRoofing(params: {
  planLength: number;
  planWidth: number;
  pitch: number; // degrees
  roofType: 'pitched' | 'flat' | 'mono_pitch';
  coveringType: keyof typeof ROOF_COVERING_COSTS_SQM | keyof typeof FLAT_ROOF_COSTS_SQM;
  ridgeLength?: number;
  eaveLength?: number;
  region?: keyof typeof REGIONAL_MULTIPLIERS;
  pricingType?: 'trade' | 'retail';
}): RoofingCalculation {
  const {
    planLength,
    planWidth,
    pitch,
    roofType,
    coveringType,
    ridgeLength = planLength,
    eaveLength = planLength * 2 + planWidth * 2,
    region = 'south_east',
    pricingType = 'retail'
  } = params;

  const regionMultiplier = REGIONAL_MULTIPLIERS[region];
  const pricing = pricingType;

  // Calculate roof area accounting for pitch
  const pitchRadians = pitch * (Math.PI / 180);
  const roofArea = roofType === 'flat' 
    ? planLength * planWidth 
    : (planLength * planWidth) / Math.cos(pitchRadians);

  // Get covering costs
  let coveringRate: { materials: number; labour: number; total: number };
  if (roofType === 'flat') {
    coveringRate = FLAT_ROOF_COSTS_SQM[coveringType as keyof typeof FLAT_ROOF_COSTS_SQM] || FLAT_ROOF_COSTS_SQM.epdm_rubber;
  } else {
    coveringRate = ROOF_COVERING_COSTS_SQM[coveringType as keyof typeof ROOF_COVERING_COSTS_SQM] || ROOF_COVERING_COSTS_SQM.concrete_interlocking;
  }

  const coveringCost = roofArea * coveringRate.total * regionMultiplier;
  
  // Felt/membrane
  const feltArea = roofArea * 1.1; // 10% overlap
  const feltCost = feltArea * MATERIALS_2026.roofing.felt[pricing] * regionMultiplier;
  
  // Battens (for pitched roofs)
  const battenLength = roofType === 'flat' ? 0 : roofArea * 3.5; // ~3.5m per sqm
  const battenCost = battenLength * MATERIALS_2026.roofing.battens[pricing] * regionMultiplier;
  
  // Ridge
  const ridgeCost = ridgeLength * MATERIALS_2026.roofing.ridge[pricing] * regionMultiplier;
  
  // Fascia & soffit
  const fasciaLength = eaveLength;
  const fasciaCost = fasciaLength * MATERIALS_2026.roofing.fascia[pricing] * regionMultiplier;
  const soffitCost = fasciaLength * MATERIALS_2026.roofing.soffit[pricing] * regionMultiplier;
  
  // Rainwater goods
  const gutteringCost = fasciaLength * MATERIALS_2026.roofing.guttering[pricing] * regionMultiplier;
  const downpipeCount = Math.ceil(fasciaLength / 10); // 1 per 10m max
  const downpipeCost = downpipeCount * 3 * MATERIALS_2026.roofing.downpipe[pricing] * regionMultiplier; // 3m average per downpipe

  const structureCost = feltCost + battenCost + ridgeCost;
  const rainwaterCost = fasciaCost + soffitCost + gutteringCost + downpipeCost;

  // Labour
  const productivity = roofType === 'flat' 
    ? TRADE_PRODUCTIVITY.roofing.flat_m2_per_day 
    : TRADE_PRODUCTIVITY.roofing.tiles_m2_per_day;
  const fasciaProductivity = TRADE_PRODUCTIVITY.roofing.fascia_m_per_day;
  
  const tilesDays = roofArea / productivity;
  const fasciaDays = fasciaLength / fasciaProductivity;
  const totalDays = tilesDays + fasciaDays;
  
  const labourCost = totalDays * 8 * LABOUR_RATES_2026.roofer[pricing] * regionMultiplier;

  return {
    roofArea,
    coveringCost,
    structureCost,
    rainwaterCost,
    labourCost,
    totalCost: coveringCost + structureCost + rainwaterCost + labourCost,
    labourDays: Math.ceil(totalDays),
    breakdown: {
      covering: { type: coveringType, area: roofArea, cost: coveringCost },
      felt: { area: feltArea, cost: feltCost },
      battens: { length: battenLength, cost: battenCost },
      ridge: { length: ridgeLength, cost: ridgeCost },
      fascia: { length: fasciaLength, cost: fasciaCost },
      soffit: { length: fasciaLength, cost: soffitCost },
      guttering: { length: fasciaLength, cost: gutteringCost },
      downpipes: { quantity: downpipeCount, cost: downpipeCost },
    }
  };
}

// ============================================================================
// ELECTRICAL CALCULATOR
// ============================================================================

export interface ElectricalCalculation {
  totalPoints: number;
  cableLength: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  labourDays: number;
  certificationCost: number;
  breakdown: {
    sockets: { quantity: number; cost: number };
    switches: { quantity: number; cost: number };
    lights: { quantity: number; cost: number };
    specialCircuits: { quantity: number; cost: number };
    consumerUnit: { quantity: number; cost: number };
    cable: { length: number; cost: number };
    smokeDetectors: { quantity: number; cost: number };
  };
}

export function calculateElectrical(params: {
  floorArea: number;
  rooms: number;
  sockets: number;
  switches: number;
  downlights: number;
  pendants?: number;
  smokeDetectors?: number;
  extractor_fans?: number;
  consumerUnit?: boolean;
  cookerCircuit?: boolean;
  showerCircuit?: boolean;
  evCharger?: boolean;
  region?: keyof typeof REGIONAL_MULTIPLIERS;
  pricingType?: 'trade' | 'retail';
}): ElectricalCalculation {
  const {
    floorArea,
    rooms,
    sockets,
    switches,
    downlights,
    pendants = 0,
    smokeDetectors = Math.ceil(rooms / 2),
    extractor_fans = 0,
    consumerUnit = false,
    cookerCircuit = false,
    showerCircuit = false,
    evCharger = false,
    region = 'south_east',
    pricingType = 'retail'
  } = params;

  const regionMultiplier = REGIONAL_MULTIPLIERS[region];
  const pricing = pricingType;

  // Calculate totals
  const totalPoints = sockets + switches + downlights + pendants + smokeDetectors + extractor_fans;
  
  // Estimate cable length (average 4m per point + main runs)
  const cableLength = totalPoints * 4 + floorArea * 1.5;
  
  // Material costs
  const socketCost = sockets * MATERIALS_2026.electrical.socket[pricing];
  const switchCost = switches * MATERIALS_2026.electrical.switch[pricing];
  const downlightCost = downlights * MATERIALS_2026.electrical.downlight[pricing];
  const pendantCost = pendants * MATERIALS_2026.electrical.pendant[pricing];
  const smokeCost = smokeDetectors * MATERIALS_2026.electrical.smoke_detector[pricing];
  const extractorCost = extractor_fans * MATERIALS_2026.electrical.extractor_fan[pricing];
  const cuCost = consumerUnit ? MATERIALS_2026.electrical.consumer_unit[pricing] : 0;
  const cookerCost = cookerCircuit ? MATERIALS_2026.electrical.cooker_switch[pricing] : 0;
  
  // Cable costs
  const twinCableLength = cableLength * 0.7;
  const sixMmLength = cookerCircuit ? 15 : 0;
  const tenMmLength = showerCircuit ? 20 : 0;
  
  const cableCost = 
    twinCableLength * MATERIALS_2026.electrical.cable_twin[pricing] +
    sixMmLength * MATERIALS_2026.electrical.cable_6mm[pricing] +
    tenMmLength * MATERIALS_2026.electrical.cable_10mm[pricing];
  
  // EV charger
  const evCost = evCharger ? 850 : 0; // Typical installation cost

  const materialCost = (socketCost + switchCost + downlightCost + pendantCost + 
    smokeCost + extractorCost + cuCost + cookerCost + cableCost + evCost) * regionMultiplier;

  // Labour
  const firstFixPoints = TRADE_PRODUCTIVITY.electrical.first_fix_points;
  const secondFixPoints = TRADE_PRODUCTIVITY.electrical.second_fix_points;
  
  const firstFixDays = totalPoints / firstFixPoints;
  const secondFixDays = totalPoints / secondFixPoints;
  const cuDays = consumerUnit ? 1 : 0;
  const totalDays = firstFixDays + secondFixDays + cuDays;
  
  const labourCost = totalDays * 8 * LABOUR_RATES_2026.electrician[pricing] * regionMultiplier;
  
  // Certification (Part P)
  const certificationCost = 250 * regionMultiplier;

  return {
    totalPoints,
    cableLength,
    materialCost,
    labourCost,
    totalCost: materialCost + labourCost + certificationCost,
    labourDays: Math.ceil(totalDays),
    certificationCost,
    breakdown: {
      sockets: { quantity: sockets, cost: socketCost * regionMultiplier },
      switches: { quantity: switches, cost: switchCost * regionMultiplier },
      lights: { quantity: downlights + pendants, cost: (downlightCost + pendantCost) * regionMultiplier },
      specialCircuits: { quantity: (cookerCircuit ? 1 : 0) + (showerCircuit ? 1 : 0) + (evCharger ? 1 : 0), cost: (cookerCost + evCost) * regionMultiplier },
      consumerUnit: { quantity: consumerUnit ? 1 : 0, cost: cuCost * regionMultiplier },
      cable: { length: cableLength, cost: cableCost * regionMultiplier },
      smokeDetectors: { quantity: smokeDetectors, cost: smokeCost * regionMultiplier },
    }
  };
}

// ============================================================================
// PLUMBING & HEATING CALCULATOR
// ============================================================================

export interface PlumbingCalculation {
  radiators: number;
  heatOutput: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  labourDays: number;
  breakdown: {
    boiler: { type: string; cost: number };
    radiators: { quantity: number; cost: number };
    cylinder?: { cost: number };
    pipework: { length: number; cost: number };
    sanitaryware: { items: number; cost: number };
    ufh?: { area: number; cost: number };
  };
}

export function calculatePlumbingHeating(params: {
  floorArea: number;
  rooms: number;
  boilerType: 'combi' | 'system';
  radiatorCount: number;
  bathrooms: number;
  ensuites?: number;
  wcs?: number;
  kitchenSink?: boolean;
  utility?: boolean;
  ufhArea?: number;
  towelRails?: number;
  outsideTaps?: number;
  region?: keyof typeof REGIONAL_MULTIPLIERS;
  pricingType?: 'trade' | 'retail';
}): PlumbingCalculation {
  const {
    floorArea,
    rooms,
    boilerType,
    radiatorCount,
    bathrooms,
    ensuites = 0,
    wcs = 0,
    kitchenSink = true,
    utility = false,
    ufhArea = 0,
    towelRails = bathrooms + ensuites,
    outsideTaps = 0,
    region = 'south_east',
    pricingType = 'retail'
  } = params;

  const regionMultiplier = REGIONAL_MULTIPLIERS[region];
  const pricing = pricingType;

  // Calculate heat requirement
  const heatOutput = calculateHeatRequirement(floorArea * 2.4, 'average'); // Assume 2.4m ceiling

  // Boiler cost
  const boilerCost = MATERIALS_2026.plumbing[boilerType === 'combi' ? 'boiler_combi' : 'boiler_system'][pricing];
  const cylinderCost = boilerType === 'system' ? MATERIALS_2026.plumbing.cylinder_unvented[pricing] : 0;

  // Radiators (average size)
  const radiatorCost = radiatorCount * MATERIALS_2026.plumbing.radiator_600x1000[pricing];
  const trvCost = radiatorCount * MATERIALS_2026.plumbing.trv_valve[pricing];
  const lockshieldCost = radiatorCount * MATERIALS_2026.plumbing.lockshield[pricing];
  const towelRailCost = towelRails * 180; // Average towel rail

  // Pipework (estimate)
  const copper15Length = floorArea * 1.5 + radiatorCount * 3;
  const copper22Length = radiatorCount * 2;
  const pipe15Cost = copper15Length * MATERIALS_2026.plumbing.copper_15[pricing];
  const pipe22Cost = copper22Length * MATERIALS_2026.plumbing.copper_22[pricing];
  
  // UFH
  const ufhCost = ufhArea * MATERIALS_2026.plumbing.ufh_m2[pricing];

  // Sanitaryware
  const bathroomCost = bathrooms * (
    MATERIALS_2026.sanitaryware.bath_acrylic[pricing] +
    MATERIALS_2026.sanitaryware.basin_pedestal[pricing] +
    MATERIALS_2026.sanitaryware.wc_standard[pricing] +
    MATERIALS_2026.sanitaryware.shower_mixer[pricing]
  );
  const ensuiteCost = ensuites * (
    MATERIALS_2026.sanitaryware.shower_enclosure[pricing] +
    MATERIALS_2026.sanitaryware.shower_tray[pricing] +
    MATERIALS_2026.sanitaryware.basin_vanity[pricing] +
    MATERIALS_2026.sanitaryware.wc_standard[pricing]
  );
  const wcCost = wcs * (
    MATERIALS_2026.sanitaryware.wc_standard[pricing] +
    MATERIALS_2026.sanitaryware.basin_pedestal[pricing] / 2
  );
  const kitchenCost = kitchenSink ? (MATERIALS_2026.sanitaryware.kitchen_sink[pricing] + MATERIALS_2026.sanitaryware.kitchen_tap[pricing]) : 0;

  const sanitarywareCost = bathroomCost + ensuiteCost + wcCost + kitchenCost;

  const materialCost = (boilerCost + cylinderCost + radiatorCost + trvCost + lockshieldCost + 
    towelRailCost + pipe15Cost + pipe22Cost + ufhCost + sanitarywareCost) * regionMultiplier;

  // Labour
  const bathroomDays = (bathrooms + ensuites) * TRADE_PRODUCTIVITY.plumbing.bathroom_days;
  const radiatorDays = radiatorCount / TRADE_PRODUCTIVITY.plumbing.radiators_per_day;
  const boilerDay = 1;
  const ufhDays = ufhArea / 20; // ~20 sqm per day for UFH
  const totalDays = bathroomDays + radiatorDays + boilerDay + ufhDays;
  
  const labourCost = totalDays * 8 * LABOUR_RATES_2026.plumber[pricing] * regionMultiplier;

  return {
    radiators: radiatorCount,
    heatOutput,
    materialCost,
    labourCost,
    totalCost: materialCost + labourCost,
    labourDays: Math.ceil(totalDays),
    breakdown: {
      boiler: { type: boilerType, cost: boilerCost * regionMultiplier },
      radiators: { quantity: radiatorCount + towelRails, cost: (radiatorCost + trvCost + lockshieldCost + towelRailCost) * regionMultiplier },
      cylinder: boilerType === 'system' ? { cost: cylinderCost * regionMultiplier } : undefined,
      pipework: { length: copper15Length + copper22Length, cost: (pipe15Cost + pipe22Cost) * regionMultiplier },
      sanitaryware: { items: bathrooms + ensuites + wcs + (kitchenSink ? 1 : 0), cost: sanitarywareCost * regionMultiplier },
      ufh: ufhArea > 0 ? { area: ufhArea, cost: ufhCost * regionMultiplier } : undefined,
    }
  };
}

// ============================================================================
// FOUNDATION CALCULATOR
// ============================================================================

export interface FoundationCalculation {
  perimeterLength: number;
  trenchVolume: number;
  concreteVolume: number;
  rebarTonnes: number;
  materialCost: number;
  labourCost: number;
  plantCost: number;
  totalCost: number;
  labourDays: number;
  breakdown: {
    excavation: { volume: number; cost: number };
    concrete: { volume: number; cost: number };
    rebar: { tonnes: number; cost: number };
    dpm: { area: number; cost: number };
    blocks: { quantity: number; cost: number };
  };
}

export function calculateFoundation(params: {
  length: number;
  width: number;
  foundationType: 'strip' | 'trench_fill' | 'raft' | 'piled';
  depth?: number;
  foundationWidth?: number;
  reinforced?: boolean;
  region?: keyof typeof REGIONAL_MULTIPLIERS;
  pricingType?: 'trade' | 'retail';
}): FoundationCalculation {
  const {
    length,
    width,
    foundationType,
    depth = (foundationType === 'trench_fill' ? FOUNDATION_SPECS.trench_fill.typical_depth : FOUNDATION_SPECS.strip.trench_depth_typical) || 900,
    foundationWidth = 600,
    reinforced = foundationType === 'raft',
    region = 'south_east',
    pricingType = 'retail'
  } = params;

  const regionMultiplier = REGIONAL_MULTIPLIERS[region];
  const pricing = pricingType;

  const perimeterLength = 2 * (length + width);
  const floorArea = length * width;

  let trenchVolume: number;
  let concreteVolume: number;
  let excavationVolume: number;

  if (foundationType === 'raft') {
    trenchVolume = floorArea * 0.45; // Edge beam
    concreteVolume = floorArea * 0.3; // 300mm slab
    excavationVolume = floorArea * 0.5;
  } else if (foundationType === 'piled') {
    const pileCount = Math.ceil(perimeterLength / 2.5);
    trenchVolume = perimeterLength * 0.45 * 0.45; // Ground beams
    concreteVolume = pileCount * (Math.PI * 0.225 * 0.225 * 3) + trenchVolume; // 450mm dia piles 3m deep
    excavationVolume = pileCount * 0.5;
  } else {
    const depthM = depth / 1000;
    const widthM = foundationWidth / 1000;
    trenchVolume = perimeterLength * depthM * widthM;
    concreteVolume = foundationType === 'trench_fill' 
      ? trenchVolume * 0.9 // Fill to near top
      : perimeterLength * 0.25 * widthM; // Just concrete pad for strip
    excavationVolume = trenchVolume * 1.1; // Swell factor
  }

  // Rebar for reinforced
  const rebarTonnes = reinforced ? concreteVolume * 0.12 : 0; // ~120kg/m³

  // Material costs
  const concreteCost = concreteVolume * MATERIALS_2026.concrete.c25[pricing];
  const pumpCost = concreteVolume > 5 ? MATERIALS_2026.concrete.pump_charge[pricing] : 0;
  const rebarCost = rebarTonnes * MATERIALS_2026.rebar[pricing];
  const dpmCost = floorArea * MATERIALS_2026.dpm[pricing];
  
  // Blocks for strip foundation above ground
  const blocksAboveGround = foundationType === 'strip' ? perimeterLength * 5 : 0; // ~5 blocks per linear metre
  const blockCost = blocksAboveGround * MATERIALS_2026.blocks.foundation[pricing];

  const materialCost = (concreteCost + pumpCost + rebarCost + dpmCost + blockCost) * regionMultiplier;

  // Labour
  const excavationDays = excavationVolume / TRADE_PRODUCTIVITY.excavation.strip_m3_per_day;
  const concreteDays = concreteVolume / 10; // ~10m³ can be poured per day with pump
  const totalDays = excavationDays + concreteDays + (foundationType === 'strip' ? excavationDays : 0);
  
  const labourCost = totalDays * 8 * (LABOUR_RATES_2026.groundworker[pricing] * 2) * regionMultiplier;

  // Plant
  const diggerDays = excavationDays;
  const plantCost = (diggerDays * PLANT_RATES_2026.mini_digger_3t[pricing] + 
    PLANT_RATES_2026.dumper_1t[pricing] * diggerDays) * regionMultiplier;

  return {
    perimeterLength,
    trenchVolume,
    concreteVolume,
    rebarTonnes,
    materialCost,
    labourCost,
    plantCost,
    totalCost: materialCost + labourCost + plantCost,
    labourDays: Math.ceil(totalDays),
    breakdown: {
      excavation: { volume: excavationVolume, cost: plantCost },
      concrete: { volume: concreteVolume, cost: (concreteCost + pumpCost) * regionMultiplier },
      rebar: { tonnes: rebarTonnes, cost: rebarCost * regionMultiplier },
      dpm: { area: floorArea, cost: dpmCost * regionMultiplier },
      blocks: { quantity: blocksAboveGround, cost: blockCost * regionMultiplier },
    }
  };
}

// ============================================================================
// STRUCTURAL STEEL CALCULATOR
// ============================================================================

export interface SteelCalculation {
  beams: { size: string; length: number; weight: number }[];
  totalWeight: number;
  padstones: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
}

export function calculateStructuralSteel(params: {
  openings: { span: number; load: 'light' | 'medium' | 'heavy' }[];
  region?: keyof typeof REGIONAL_MULTIPLIERS;
  pricingType?: 'trade' | 'retail';
}): SteelCalculation {
  const { openings, region = 'south_east', pricingType = 'retail' } = params;
  const regionMultiplier = REGIONAL_MULTIPLIERS[region];
  const pricing = pricingType;

  // Simplified beam sizing
  const beamSizeTable: Record<string, Record<string, string>> = {
    light: { '2': '152x89', '3': '152x89', '4': '203x102', '5': '254x102', '6': '305x165' },
    medium: { '2': '152x89', '3': '203x102', '4': '254x102', '5': '305x165', '6': '305x165' },
    heavy: { '2': '203x102', '3': '254x102', '4': '305x165', '5': '305x165', '6': '305x165' },
  };

  const beams = openings.map(opening => {
    const spanKey = Math.min(6, Math.ceil(opening.span)).toString();
    const size = beamSizeTable[opening.load]?.[spanKey] || '254x102';
    const length = opening.span + 0.3; // Add bearing
    const weightPerM = size === '152x89' ? 16 : size === '203x102' ? 23 : size === '254x102' ? 28 : 40;
    return {
      size,
      length,
      weight: length * weightPerM,
    };
  });

  const totalWeight = beams.reduce((sum, b) => sum + b.weight, 0) / 1000; // To tonnes
  const padstones = beams.length * 2;

  // Cost based on size
  const beamCosts: Record<string, number> = {
    '152x89': MATERIALS_2026.steel.rsj_152x89[pricing],
    '203x102': MATERIALS_2026.steel.rsj_203x102[pricing],
    '254x102': MATERIALS_2026.steel.rsj_254x102[pricing],
    '305x165': MATERIALS_2026.steel.rsj_305x165[pricing],
  };

  const steelCost = beams.reduce((sum, b) => sum + b.length * (beamCosts[b.size] || 70), 0);
  const padstoneCost = padstones * MATERIALS_2026.steel.padstone[pricing];
  const materialCost = (steelCost + padstoneCost) * regionMultiplier;

  // Labour (installation)
  const labourCost = beams.length * 4 * LABOUR_RATES_2026.steelfixer[pricing] * regionMultiplier;

  return {
    beams,
    totalWeight,
    padstones,
    materialCost,
    labourCost,
    totalCost: materialCost + labourCost,
  };
}

// ============================================================================
// COMPLETE PROJECT ESTIMATOR
// ============================================================================

export interface ProjectEstimate {
  foundation: FoundationCalculation;
  brickwork: BrickworkCalculation;
  roofing: RoofingCalculation;
  electrical: ElectricalCalculation;
  plumbing: PlumbingCalculation;
  steel?: SteelCalculation;
  finishing: {
    plastering: number;
    decoration: number;
    flooring: number;
    secondFix: number;
  };
  preliminaries: number;
  contingency: number;
  totalMaterials: number;
  totalLabour: number;
  totalPlant: number;
  grandTotal: number;
  costPerSqm: number;
  durationWeeks: number;
}

export function calculateFullProjectEstimate(params: {
  length: number;
  width: number;
  height: number;
  projectType: string;
  foundationType: 'strip' | 'trench_fill' | 'raft' | 'piled';
  wallType: 'cavity' | 'solid' | 'block_only';
  roofType: 'pitched' | 'flat' | 'mono_pitch';
  roofPitch?: number;
  rooms: number;
  bathrooms: number;
  ensuites?: number;
  boilerType: 'combi' | 'system';
  steelOpenings?: { span: number; load: 'light' | 'medium' | 'heavy' }[];
  region?: keyof typeof REGIONAL_MULTIPLIERS;
  pricingType?: 'trade' | 'retail';
  buildQuality?: 'basic' | 'standard' | 'premium' | 'luxury';
}): ProjectEstimate {
  const {
    length,
    width,
    height,
    projectType,
    foundationType,
    wallType,
    roofType,
    roofPitch = 35,
    rooms,
    bathrooms,
    ensuites = 0,
    boilerType,
    steelOpenings = [],
    region = 'south_east',
    pricingType = 'retail',
    buildQuality = 'standard'
  } = params;

  const floorArea = length * width;
  const qualityMultiplier = buildQuality === 'basic' ? 0.85 : buildQuality === 'premium' ? 1.25 : buildQuality === 'luxury' ? 1.5 : 1;

  // Calculate all components
  const foundation = calculateFoundation({
    length, width, foundationType, region, pricingType
  });

  const perimeterLength = 2 * (length + width);
  const wallHeight = height + 0.5; // Include foundation above ground
  const openingsArea = floorArea * 0.15; // Estimate 15% openings

  const brickwork = calculateBrickwork({
    length: perimeterLength,
    height: wallHeight,
    wallType,
    brickType: buildQuality === 'luxury' ? 'handmade' : buildQuality === 'basic' ? 'standard' : 'facing',
    blockType: buildQuality === 'premium' || buildQuality === 'luxury' ? 'aerated' : 'standard',
    openingsArea,
    lintelsCount: Math.ceil(openingsArea / 2),
    dpcLength: perimeterLength,
    region,
    pricingType
  });

  const roofing = calculateRoofing({
    planLength: length,
    planWidth: width,
    pitch: roofPitch,
    roofType,
    coveringType: buildQuality === 'luxury' ? 'natural_slate' : buildQuality === 'premium' ? 'clay_plain_tiles' : 'concrete_interlocking',
    region,
    pricingType
  });

  const sockets = rooms * 4 + bathrooms * 2;
  const switches = rooms * 2;
  const downlights = floorArea / 4;

  const electrical = calculateElectrical({
    floorArea,
    rooms,
    sockets,
    switches,
    downlights,
    smokeDetectors: Math.max(2, Math.ceil(rooms / 2)),
    consumerUnit: true,
    region,
    pricingType
  });

  const plumbing = calculatePlumbingHeating({
    floorArea,
    rooms,
    boilerType,
    radiatorCount: rooms,
    bathrooms,
    ensuites,
    region,
    pricingType
  });

  const steel = steelOpenings.length > 0 
    ? calculateStructuralSteel({ openings: steelOpenings, region, pricingType })
    : undefined;

  // Finishing costs (per sqm)
  const regionMultiplier = REGIONAL_MULTIPLIERS[region];
  const finishing = {
    plastering: floorArea * 25 * qualityMultiplier * regionMultiplier,
    decoration: floorArea * 15 * qualityMultiplier * regionMultiplier,
    flooring: floorArea * (buildQuality === 'luxury' ? 85 : buildQuality === 'premium' ? 55 : 25) * regionMultiplier,
    secondFix: floorArea * 35 * qualityMultiplier * regionMultiplier,
  };

  // Totals
  const subtotal = 
    foundation.totalCost +
    brickwork.totalCost +
    roofing.totalCost +
    electrical.totalCost +
    plumbing.totalCost +
    (steel?.totalCost || 0) +
    finishing.plastering +
    finishing.decoration +
    finishing.flooring +
    finishing.secondFix;

  const preliminaries = subtotal * 0.08; // 8% prelims
  const contingency = subtotal * 0.10; // 10% contingency

  const grandTotal = (subtotal + preliminaries + contingency) * qualityMultiplier;

  // Duration estimate
  const totalLabourDays = 
    foundation.labourDays +
    brickwork.labourDays +
    roofing.labourDays +
    electrical.labourDays +
    plumbing.labourDays +
    Math.ceil(floorArea / 20); // Finishing

  const durationWeeks = Math.ceil(totalLabourDays / 5);

  return {
    foundation,
    brickwork,
    roofing,
    electrical,
    plumbing,
    steel,
    finishing,
    preliminaries,
    contingency,
    totalMaterials: foundation.materialCost + brickwork.materialCost + roofing.coveringCost + roofing.structureCost + electrical.materialCost + plumbing.materialCost,
    totalLabour: foundation.labourCost + brickwork.labourCost + roofing.labourCost + electrical.labourCost + plumbing.labourCost,
    totalPlant: foundation.plantCost,
    grandTotal,
    costPerSqm: grandTotal / floorArea,
    durationWeeks,
  };
}
