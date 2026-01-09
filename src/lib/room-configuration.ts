// Comprehensive room configuration system for detailed architectural drawings
// Based on UK Building Regulations, RIBA guidelines, and industry standards

export interface WindowConfig {
  id: string;
  width: number; // meters
  height: number;
  sillHeight: number;
  type: 'casement' | 'sash' | 'fixed' | 'tilt_turn' | 'roof' | 'bay' | 'oriel';
  glazing: 'double' | 'triple';
  openingSide: 'left' | 'right' | 'both' | 'top' | 'none';
  wall: 'north' | 'south' | 'east' | 'west';
  position: number; // distance from left corner of wall
}

export interface DoorConfig {
  id: string;
  width: number;
  height: number;
  type: 'single' | 'double' | 'sliding' | 'bifold' | 'french' | 'pocket';
  material: 'timber' | 'upvc' | 'composite' | 'aluminium' | 'glass';
  fireRated: boolean;
  fireRating?: 'FD30' | 'FD60';
  swing: 'left' | 'right' | 'both';
  internal: boolean;
  wall: 'north' | 'south' | 'east' | 'west';
  position: number;
}

export interface ElectricalPoint {
  id: string;
  type: 'socket_single' | 'socket_double' | 'socket_usb' | 'switch_1g' | 'switch_2g' | 'switch_dimmer' | 
        'ceiling_rose' | 'downlight' | 'wall_light' | 'pendant' | 'spotlight' | 
        'tv_point' | 'data_point' | 'telephone' | 'smoke_detector' | 'heat_detector' |
        'co_detector' | 'consumer_unit' | 'extractor_fan' | 'cooker_outlet' | 'fused_spur';
  position: { x: number; y: number };
  height: number; // from floor
  circuit: string;
}

export interface PlumbingPoint {
  id: string;
  type: 'radiator' | 'towel_rail' | 'underfloor_manifold' | 
        'basin' | 'wc' | 'bath' | 'shower' | 'bidet' |
        'kitchen_sink' | 'dishwasher' | 'washing_machine' |
        'boiler' | 'hot_water_cylinder' | 'cold_water_tank' |
        'waste_stack' | 'soil_pipe' | 'svp' | 'aco_drain' |
        'outside_tap' | 'gas_meter' | 'stopcock';
  position: { x: number; y: number };
  requiresVent: boolean;
  hotWater: boolean;
  coldWater: boolean;
  waste: boolean;
}

export interface RoomConfig {
  id: string;
  name: string;
  type: RoomType;
  length: number;
  width: number;
  height: number;
  windows: WindowConfig[];
  doors: DoorConfig[];
  electrical: ElectricalPoint[];
  plumbing: PlumbingPoint[];
  flooring: FlooringType;
  heating: HeatingType;
  features: RoomFeature[];
}

export type RoomType = 
  | 'master_bedroom' | 'bedroom_double' | 'bedroom_single' | 'box_room'
  | 'ensuite' | 'bathroom' | 'shower_room' | 'wc' | 'wetroom'
  | 'living_room' | 'lounge' | 'sitting_room' | 'family_room'
  | 'kitchen' | 'kitchen_diner' | 'utility' | 'pantry'
  | 'dining_room' | 'breakfast_room'
  | 'hallway' | 'landing' | 'entrance_hall' | 'corridor'
  | 'home_office' | 'study' | 'library'
  | 'dressing_room' | 'walk_in_wardrobe'
  | 'garage' | 'workshop' | 'plant_room'
  | 'conservatory' | 'orangery' | 'garden_room'
  | 'loft_room' | 'attic' | 'basement'
  | 'open_plan' | 'extension';

export type FlooringType = 
  | 'carpet' | 'hardwood' | 'engineered_wood' | 'laminate' 
  | 'lvt' | 'vinyl' | 'tiles_ceramic' | 'tiles_porcelain' 
  | 'natural_stone' | 'concrete_polished' | 'resin' | 'rubber';

export type HeatingType = 
  | 'radiator' | 'underfloor_water' | 'underfloor_electric' 
  | 'towel_rail' | 'fan_coil' | 'air_source' | 'none';

export type RoomFeature = 
  | 'integrated_wardrobe' | 'walk_in_wardrobe' | 'dressing_area'
  | 'en_suite_access' | 'balcony_access' | 'patio_doors'
  | 'fireplace' | 'log_burner' | 'feature_wall'
  | 'vaulted_ceiling' | 'exposed_beams' | 'skylight'
  | 'bay_window' | 'juliet_balcony'
  | 'island_unit' | 'breakfast_bar' | 'utility_access'
  | 'built_in_storage' | 'alcove_shelving'
  | 'tv_wall_mount' | 'home_cinema' | 'surround_sound'
  | 'wall_panelling' | 'wainscoting';

// Exported arrays for UI selection - using id/name for backwards compatibility with CAD.tsx
export const ROOM_TYPES: { id: RoomType; name: string; category: string }[] = [
  // Bedrooms
  { id: 'master_bedroom', name: 'Master Bedroom', category: 'Bedrooms' },
  { id: 'bedroom_double', name: 'Double Bedroom', category: 'Bedrooms' },
  { id: 'bedroom_single', name: 'Single Bedroom', category: 'Bedrooms' },
  { id: 'box_room', name: 'Box Room', category: 'Bedrooms' },
  { id: 'dressing_room', name: 'Dressing Room', category: 'Bedrooms' },
  { id: 'walk_in_wardrobe', name: 'Walk-in Wardrobe', category: 'Bedrooms' },
  // Bathrooms
  { id: 'ensuite', name: 'En-Suite', category: 'Bathrooms' },
  { id: 'bathroom', name: 'Bathroom', category: 'Bathrooms' },
  { id: 'shower_room', name: 'Shower Room', category: 'Bathrooms' },
  { id: 'wc', name: 'WC/Cloakroom', category: 'Bathrooms' },
  { id: 'wetroom', name: 'Wetroom', category: 'Bathrooms' },
  // Living Areas
  { id: 'living_room', name: 'Living Room', category: 'Living Areas' },
  { id: 'lounge', name: 'Lounge', category: 'Living Areas' },
  { id: 'sitting_room', name: 'Sitting Room', category: 'Living Areas' },
  { id: 'family_room', name: 'Family Room', category: 'Living Areas' },
  { id: 'dining_room', name: 'Dining Room', category: 'Living Areas' },
  { id: 'breakfast_room', name: 'Breakfast Room', category: 'Living Areas' },
  { id: 'open_plan', name: 'Open Plan Living', category: 'Living Areas' },
  // Kitchen & Utility
  { id: 'kitchen', name: 'Kitchen', category: 'Kitchen & Utility' },
  { id: 'kitchen_diner', name: 'Kitchen-Diner', category: 'Kitchen & Utility' },
  { id: 'utility', name: 'Utility Room', category: 'Kitchen & Utility' },
  { id: 'pantry', name: 'Pantry', category: 'Kitchen & Utility' },
  // Circulation
  { id: 'hallway', name: 'Hallway', category: 'Circulation' },
  { id: 'landing', name: 'Landing', category: 'Circulation' },
  { id: 'entrance_hall', name: 'Entrance Hall', category: 'Circulation' },
  { id: 'corridor', name: 'Corridor', category: 'Circulation' },
  // Work & Study
  { id: 'home_office', name: 'Home Office', category: 'Work & Study' },
  { id: 'study', name: 'Study', category: 'Work & Study' },
  { id: 'library', name: 'Library', category: 'Work & Study' },
  // Other
  { id: 'garage', name: 'Garage', category: 'Other' },
  { id: 'workshop', name: 'Workshop', category: 'Other' },
  { id: 'plant_room', name: 'Plant Room', category: 'Other' },
  { id: 'conservatory', name: 'Conservatory', category: 'Other' },
  { id: 'orangery', name: 'Orangery', category: 'Other' },
  { id: 'garden_room', name: 'Garden Room', category: 'Other' },
  { id: 'loft_room', name: 'Loft Room', category: 'Other' },
  { id: 'attic', name: 'Attic', category: 'Other' },
  { id: 'basement', name: 'Basement', category: 'Other' },
  { id: 'extension', name: 'Extension', category: 'Other' },
];

export const ELECTRICAL_POINTS: { id: string; name: string; symbol: string; category: string }[] = [
  // Sockets
  { id: 'socket_single', name: 'Single Socket', symbol: '⊡', category: 'Sockets' },
  { id: 'socket_double', name: 'Double Socket', symbol: '⊡⊡', category: 'Sockets' },
  { id: 'socket_usb', name: 'USB Socket', symbol: '⊡U', category: 'Sockets' },
  { id: 'fused_spur', name: 'Fused Spur', symbol: 'FS', category: 'Sockets' },
  { id: 'cooker_outlet', name: 'Cooker Outlet', symbol: 'CO', category: 'Sockets' },
  // Switches
  { id: 'switch_1g', name: '1-Gang Switch', symbol: 'S1', category: 'Switches' },
  { id: 'switch_2g', name: '2-Gang Switch', symbol: 'S2', category: 'Switches' },
  { id: 'switch_dimmer', name: 'Dimmer Switch', symbol: 'SD', category: 'Switches' },
  // Lighting
  { id: 'ceiling_rose', name: 'Ceiling Rose', symbol: '⊙', category: 'Lighting' },
  { id: 'downlight', name: 'Downlight', symbol: '◉', category: 'Lighting' },
  { id: 'wall_light', name: 'Wall Light', symbol: '◐', category: 'Lighting' },
  { id: 'pendant', name: 'Pendant', symbol: '⊛', category: 'Lighting' },
  { id: 'spotlight', name: 'Spotlight', symbol: '◈', category: 'Lighting' },
  // Data & AV
  { id: 'tv_point', name: 'TV Point', symbol: 'TV', category: 'Data & AV' },
  { id: 'data_point', name: 'Data Point (Cat6)', symbol: 'D', category: 'Data & AV' },
  { id: 'telephone', name: 'Telephone Point', symbol: 'T', category: 'Data & AV' },
  // Safety
  { id: 'smoke_detector', name: 'Smoke Detector', symbol: 'SD', category: 'Safety' },
  { id: 'heat_detector', name: 'Heat Detector', symbol: 'HD', category: 'Safety' },
  { id: 'co_detector', name: 'CO Detector', symbol: 'CO', category: 'Safety' },
  // Other
  { id: 'consumer_unit', name: 'Consumer Unit', symbol: 'CU', category: 'Other' },
  { id: 'extractor_fan', name: 'Extractor Fan', symbol: 'EF', category: 'Other' },
];

export const PLUMBING_FIXTURES: { id: string; name: string; connections: string; category: string }[] = [
  // Heating
  { id: 'radiator', name: 'Radiator', connections: 'HW/CW', category: 'Heating' },
  { id: 'towel_rail', name: 'Towel Rail', connections: 'HW/CW', category: 'Heating' },
  { id: 'underfloor_manifold', name: 'UFH Manifold', connections: 'HW/CW', category: 'Heating' },
  // Sanitaryware
  { id: 'basin', name: 'Basin', connections: 'HW/CW/W', category: 'Sanitaryware' },
  { id: 'wc', name: 'WC', connections: 'CW/W', category: 'Sanitaryware' },
  { id: 'bath', name: 'Bath', connections: 'HW/CW/W', category: 'Sanitaryware' },
  { id: 'shower', name: 'Shower', connections: 'HW/CW/W', category: 'Sanitaryware' },
  { id: 'bidet', name: 'Bidet', connections: 'HW/CW/W', category: 'Sanitaryware' },
  // Kitchen
  { id: 'kitchen_sink', name: 'Kitchen Sink', connections: 'HW/CW/W', category: 'Kitchen' },
  { id: 'dishwasher', name: 'Dishwasher', connections: 'HW/CW/W', category: 'Kitchen' },
  { id: 'washing_machine', name: 'Washing Machine', connections: 'HW/CW/W', category: 'Kitchen' },
  // Hot Water
  { id: 'boiler', name: 'Boiler', connections: 'Gas/HW/CW', category: 'Hot Water' },
  { id: 'hot_water_cylinder', name: 'Hot Water Cylinder', connections: 'HW/CW', category: 'Hot Water' },
  { id: 'cold_water_tank', name: 'Cold Water Tank', connections: 'CW', category: 'Hot Water' },
  // Drainage
  { id: 'waste_stack', name: 'Waste Stack', connections: 'W', category: 'Drainage' },
  { id: 'soil_pipe', name: 'Soil Pipe', connections: 'SVP', category: 'Drainage' },
  { id: 'svp', name: 'Soil Vent Pipe', connections: 'SVP', category: 'Drainage' },
  { id: 'aco_drain', name: 'ACO Drain', connections: 'W', category: 'Drainage' },
  // Other
  { id: 'outside_tap', name: 'Outside Tap', connections: 'CW', category: 'Other' },
  { id: 'gas_meter', name: 'Gas Meter', connections: 'Gas', category: 'Other' },
  { id: 'stopcock', name: 'Stopcock', connections: 'CW', category: 'Other' },
];

export const FLOORING_TYPES: { id: FlooringType; name: string; costPerSqm: number }[] = [
  { id: 'carpet', name: 'Carpet', costPerSqm: 25 },
  { id: 'hardwood', name: 'Solid Hardwood', costPerSqm: 85 },
  { id: 'engineered_wood', name: 'Engineered Wood', costPerSqm: 55 },
  { id: 'laminate', name: 'Laminate', costPerSqm: 22 },
  { id: 'lvt', name: 'Luxury Vinyl Tile (LVT)', costPerSqm: 45 },
  { id: 'vinyl', name: 'Vinyl Sheet', costPerSqm: 18 },
  { id: 'tiles_ceramic', name: 'Ceramic Tiles', costPerSqm: 40 },
  { id: 'tiles_porcelain', name: 'Porcelain Tiles', costPerSqm: 60 },
  { id: 'natural_stone', name: 'Natural Stone', costPerSqm: 120 },
  { id: 'concrete_polished', name: 'Polished Concrete', costPerSqm: 95 },
  { id: 'resin', name: 'Resin Flooring', costPerSqm: 75 },
  { id: 'rubber', name: 'Rubber Flooring', costPerSqm: 35 },
];

export const HEATING_SYSTEMS: { id: HeatingType; name: string }[] = [
  { id: 'radiator', name: 'Radiators' },
  { id: 'underfloor_water', name: 'Underfloor Heating (Wet)' },
  { id: 'underfloor_electric', name: 'Underfloor Heating (Electric)' },
  { id: 'towel_rail', name: 'Heated Towel Rail' },
  { id: 'fan_coil', name: 'Fan Coil Unit' },
  { id: 'air_source', name: 'Air Source Heat Pump' },
  { id: 'none', name: 'No Heating' },
];

export const WINDOW_TYPES: { id: string; name: string }[] = [
  { id: 'casement', name: 'Casement Window' },
  { id: 'sash', name: 'Sash Window' },
  { id: 'fixed', name: 'Fixed Window' },
  { id: 'tilt_turn', name: 'Tilt & Turn' },
  { id: 'roof', name: 'Roof Window' },
  { id: 'bay', name: 'Bay Window' },
  { id: 'oriel', name: 'Oriel Window' },
];

export const DOOR_TYPES: { id: string; name: string }[] = [
  { id: 'single', name: 'Single Door' },
  { id: 'double', name: 'Double Door' },
  { id: 'sliding', name: 'Sliding Door' },
  { id: 'bifold', name: 'Bi-fold Door' },
  { id: 'french', name: 'French Doors' },
  { id: 'pocket', name: 'Pocket Door' },
];

// Re-export RoomConfig as RoomConfiguration for backwards compatibility
export type RoomConfiguration = RoomConfig;

// Room templates with typical configurations
export const ROOM_TEMPLATES: Record<RoomType, Partial<RoomConfig>> = {
  master_bedroom: {
    name: 'Master Bedroom',
    height: 2.4,
    windows: [],
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.15, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.15, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_2g', position: { x: 0.15, y: 0.15 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e5', type: 'tv_point', position: { x: 0.5, y: 0.85 }, height: 1.2, circuit: 'ring_main' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'carpet',
    heating: 'radiator',
    features: [],
  },
  bedroom_double: {
    name: 'Double Bedroom',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.15, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.85, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_1g', position: { x: 0.15, y: 0.15 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'carpet',
    heating: 'radiator',
    features: [],
  },
  bedroom_single: {
    name: 'Single Bedroom',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.15, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'switch_1g', position: { x: 0.15, y: 0.15 }, height: 1.2, circuit: 'lighting' },
      { id: 'e3', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'carpet',
    heating: 'radiator',
    features: [],
  },
  box_room: {
    name: 'Box Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.5, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'carpet',
    heating: 'radiator',
    features: [],
  },
  ensuite: {
    name: 'En-Suite',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_1g', position: { x: 0.15, y: 0.15 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'downlight', position: { x: 0.3, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e3', type: 'downlight', position: { x: 0.7, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e4', type: 'extractor_fan', position: { x: 0.5, y: 0.8 }, height: 2.4, circuit: 'lighting' },
      { id: 'e5', type: 'fused_spur', position: { x: 0.8, y: 0.15 }, height: 1.2, circuit: 'ring_main' },
    ],
    plumbing: [
      { id: 'p1', type: 'shower', position: { x: 0.8, y: 0.8 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'basin', position: { x: 0.5, y: 0.1 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'wc', position: { x: 0.2, y: 0.1 }, requiresVent: true, hotWater: false, coldWater: true, waste: true },
      { id: 'p4', type: 'towel_rail', position: { x: 0.9, y: 0.5 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_porcelain',
    heating: 'towel_rail',
    features: [],
  },
  bathroom: {
    name: 'Bathroom',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'downlight', position: { x: 0.25, y: 0.25 }, height: 2.4, circuit: 'lighting' },
      { id: 'e3', type: 'downlight', position: { x: 0.75, y: 0.25 }, height: 2.4, circuit: 'lighting' },
      { id: 'e4', type: 'downlight', position: { x: 0.5, y: 0.75 }, height: 2.4, circuit: 'lighting' },
      { id: 'e5', type: 'extractor_fan', position: { x: 0.5, y: 0.9 }, height: 2.4, circuit: 'lighting' },
      { id: 'e6', type: 'fused_spur', position: { x: 0.8, y: 0.1 }, height: 1.2, circuit: 'ring_main' },
    ],
    plumbing: [
      { id: 'p1', type: 'bath', position: { x: 0.5, y: 0.85 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'basin', position: { x: 0.5, y: 0.1 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'wc', position: { x: 0.15, y: 0.1 }, requiresVent: true, hotWater: false, coldWater: true, waste: true },
      { id: 'p4', type: 'towel_rail', position: { x: 0.02, y: 0.5 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_porcelain',
    heating: 'towel_rail',
    features: [],
  },
  shower_room: {
    name: 'Shower Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'downlight', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e3', type: 'extractor_fan', position: { x: 0.5, y: 0.9 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'shower', position: { x: 0.75, y: 0.75 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'basin', position: { x: 0.5, y: 0.1 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'wc', position: { x: 0.15, y: 0.1 }, requiresVent: true, hotWater: false, coldWater: true, waste: true },
      { id: 'p4', type: 'towel_rail', position: { x: 0.02, y: 0.5 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_porcelain',
    heating: 'towel_rail',
    features: [],
  },
  wc: {
    name: 'WC',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e3', type: 'extractor_fan', position: { x: 0.5, y: 0.9 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'wc', position: { x: 0.5, y: 0.15 }, requiresVent: true, hotWater: false, coldWater: true, waste: true },
      { id: 'p2', type: 'basin', position: { x: 0.5, y: 0.85 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
    ],
    flooring: 'tiles_ceramic',
    heating: 'radiator',
    features: [],
  },
  wetroom: {
    name: 'Wetroom',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'downlight', position: { x: 0.3, y: 0.3 }, height: 2.4, circuit: 'lighting' },
      { id: 'e3', type: 'downlight', position: { x: 0.7, y: 0.7 }, height: 2.4, circuit: 'lighting' },
      { id: 'e4', type: 'extractor_fan', position: { x: 0.5, y: 0.95 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'shower', position: { x: 0.5, y: 0.5 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'basin', position: { x: 0.5, y: 0.05 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'wc', position: { x: 0.15, y: 0.05 }, requiresVent: true, hotWater: false, coldWater: true, waste: true },
      { id: 'p4', type: 'underfloor_manifold', position: { x: 0.95, y: 0.5 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_porcelain',
    heating: 'underfloor_water',
    features: [],
  },
  living_room: {
    name: 'Living Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.25 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.05, y: 0.75 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.95, y: 0.25 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e4', type: 'socket_double', position: { x: 0.95, y: 0.75 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e5', type: 'switch_2g', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e6', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e7', type: 'tv_point', position: { x: 0.5, y: 0.95 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e8', type: 'data_point', position: { x: 0.5, y: 0.95 }, height: 0.45, circuit: 'data' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'engineered_wood',
    heating: 'radiator',
    features: [],
  },
  lounge: {
    name: 'Lounge',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.25 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.05, y: 0.75 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.95, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e4', type: 'switch_dimmer', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e5', type: 'pendant', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e6', type: 'wall_light', position: { x: 0.95, y: 0.3 }, height: 1.8, circuit: 'lighting' },
      { id: 'e7', type: 'wall_light', position: { x: 0.95, y: 0.7 }, height: 1.8, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'hardwood',
    heating: 'radiator',
    features: [],
  },
  sitting_room: {
    name: 'Sitting Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.9, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_1g', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'carpet',
    heating: 'radiator',
    features: [],
  },
  family_room: {
    name: 'Family Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.2 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.05, y: 0.8 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.95, y: 0.2 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e4', type: 'socket_double', position: { x: 0.95, y: 0.8 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e5', type: 'switch_2g', position: { x: 0.05, y: 0.05 }, height: 1.2, circuit: 'lighting' },
      { id: 'e6', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e7', type: 'tv_point', position: { x: 0.5, y: 0.02 }, height: 1.2, circuit: 'ring_main' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'lvt',
    heating: 'radiator',
    features: [],
  },
  kitchen: {
    name: 'Kitchen',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.3, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.5, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e4', type: 'socket_double', position: { x: 0.7, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e5', type: 'cooker_outlet', position: { x: 0.9, y: 0.05 }, height: 0.45, circuit: 'cooker' },
      { id: 'e6', type: 'fused_spur', position: { x: 0.15, y: 0.05 }, height: 0.2, circuit: 'appliance' },
      { id: 'e7', type: 'fused_spur', position: { x: 0.25, y: 0.05 }, height: 0.2, circuit: 'appliance' },
      { id: 'e8', type: 'switch_2g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e9', type: 'downlight', position: { x: 0.25, y: 0.25 }, height: 2.4, circuit: 'lighting' },
      { id: 'e10', type: 'downlight', position: { x: 0.75, y: 0.25 }, height: 2.4, circuit: 'lighting' },
      { id: 'e11', type: 'downlight', position: { x: 0.25, y: 0.75 }, height: 2.4, circuit: 'lighting' },
      { id: 'e12', type: 'downlight', position: { x: 0.75, y: 0.75 }, height: 2.4, circuit: 'lighting' },
      { id: 'e13', type: 'extractor_fan', position: { x: 0.5, y: 0.05 }, height: 1.8, circuit: 'cooker_hood' },
    ],
    plumbing: [
      { id: 'p1', type: 'kitchen_sink', position: { x: 0.4, y: 0.05 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'dishwasher', position: { x: 0.25, y: 0.05 }, requiresVent: false, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'radiator', position: { x: 0.95, y: 0.5 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
      { id: 'p4', type: 'boiler', position: { x: 0.95, y: 0.9 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
    ],
    flooring: 'tiles_porcelain',
    heating: 'radiator',
    features: [],
  },
  kitchen_diner: {
    name: 'Kitchen Diner',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.25, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.4, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e4', type: 'cooker_outlet', position: { x: 0.6, y: 0.05 }, height: 0.45, circuit: 'cooker' },
      { id: 'e5', type: 'socket_double', position: { x: 0.95, y: 0.8 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e6', type: 'switch_2g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e7', type: 'downlight', position: { x: 0.2, y: 0.2 }, height: 2.4, circuit: 'lighting' },
      { id: 'e8', type: 'downlight', position: { x: 0.5, y: 0.2 }, height: 2.4, circuit: 'lighting' },
      { id: 'e9', type: 'pendant', position: { x: 0.5, y: 0.7 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'kitchen_sink', position: { x: 0.3, y: 0.05 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'dishwasher', position: { x: 0.15, y: 0.05 }, requiresVent: false, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'radiator', position: { x: 0.5, y: 0.98 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'lvt',
    heating: 'radiator',
    features: ['island_unit', 'breakfast_bar'],
  },
  utility: {
    name: 'Utility Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.2, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.5, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e3', type: 'fused_spur', position: { x: 0.3, y: 0.05 }, height: 0.3, circuit: 'appliance' },
      { id: 'e4', type: 'fused_spur', position: { x: 0.6, y: 0.05 }, height: 0.3, circuit: 'appliance' },
      { id: 'e5', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'kitchen_sink', position: { x: 0.4, y: 0.05 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'washing_machine', position: { x: 0.2, y: 0.05 }, requiresVent: false, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'boiler', position: { x: 0.8, y: 0.05 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
    ],
    flooring: 'tiles_ceramic',
    heating: 'radiator',
    features: [],
  },
  pantry: {
    name: 'Pantry',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e2', type: 'socket_single', position: { x: 0.5, y: 0.95 }, height: 1.0, circuit: 'ring_main' },
    ],
    plumbing: [],
    flooring: 'tiles_ceramic',
    heating: 'none',
    features: ['built_in_storage'],
  },
  dining_room: {
    name: 'Dining Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.95, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_dimmer', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'pendant', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'hardwood',
    heating: 'radiator',
    features: [],
  },
  breakfast_room: {
    name: 'Breakfast Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.5, y: 0.95 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e3', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_ceramic',
    heating: 'radiator',
    features: [],
  },
  hallway: {
    name: 'Hallway',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_2g', position: { x: 0.1, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'switch_2g', position: { x: 0.9, y: 0.9 }, height: 1.2, circuit: 'lighting' },
      { id: 'e3', type: 'downlight', position: { x: 0.5, y: 0.25 }, height: 2.4, circuit: 'lighting' },
      { id: 'e4', type: 'downlight', position: { x: 0.5, y: 0.75 }, height: 2.4, circuit: 'lighting' },
      { id: 'e5', type: 'smoke_detector', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'fire_alarm' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_porcelain',
    heating: 'radiator',
    features: [],
  },
  landing: {
    name: 'Landing',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_2g', position: { x: 0.1, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e3', type: 'smoke_detector', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'fire_alarm' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'carpet',
    heating: 'radiator',
    features: [],
  },
  entrance_hall: {
    name: 'Entrance Hall',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_2g', position: { x: 0.1, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'pendant', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e3', type: 'smoke_detector', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'fire_alarm' },
      { id: 'e4', type: 'socket_double', position: { x: 0.95, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_porcelain',
    heating: 'radiator',
    features: [],
  },
  corridor: {
    name: 'Corridor',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_2g', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'downlight', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [],
    flooring: 'carpet',
    heating: 'none',
    features: [],
  },
  home_office: {
    name: 'Home Office',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.5, y: 0.05 }, height: 0.3, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.3, y: 0.05 }, height: 0.3, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.7, y: 0.05 }, height: 0.3, circuit: 'ring_main' },
      { id: 'e4', type: 'data_point', position: { x: 0.5, y: 0.05 }, height: 0.3, circuit: 'data' },
      { id: 'e5', type: 'telephone', position: { x: 0.5, y: 0.05 }, height: 0.3, circuit: 'telecom' },
      { id: 'e6', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e7', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.98 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'engineered_wood',
    heating: 'radiator',
    features: [],
  },
  study: {
    name: 'Study',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.5, y: 0.05 }, height: 0.3, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.3, y: 0.05 }, height: 0.3, circuit: 'ring_main' },
      { id: 'e3', type: 'data_point', position: { x: 0.5, y: 0.05 }, height: 0.3, circuit: 'data' },
      { id: 'e4', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e5', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.98 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'hardwood',
    heating: 'radiator',
    features: ['alcove_shelving'],
  },
  library: {
    name: 'Library',
    height: 2.7,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.95, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_dimmer', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'pendant', position: { x: 0.5, y: 0.5 }, height: 2.7, circuit: 'lighting' },
      { id: 'e5', type: 'wall_light', position: { x: 0.25, y: 0.02 }, height: 2.0, circuit: 'lighting' },
      { id: 'e6', type: 'wall_light', position: { x: 0.75, y: 0.02 }, height: 2.0, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'hardwood',
    heating: 'radiator',
    features: ['alcove_shelving', 'fireplace'],
  },
  dressing_room: {
    name: 'Dressing Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.5, y: 0.95 }, height: 1.0, circuit: 'ring_main' },
      { id: 'e2', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e3', type: 'downlight', position: { x: 0.25, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e4', type: 'downlight', position: { x: 0.75, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'carpet',
    heating: 'radiator',
    features: ['integrated_wardrobe'],
  },
  walk_in_wardrobe: {
    name: 'Walk-in Wardrobe',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e2', type: 'downlight', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [],
    flooring: 'carpet',
    heating: 'none',
    features: ['integrated_wardrobe'],
  },
  garage: {
    name: 'Garage',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.5 }, height: 1.1, circuit: 'garage' },
      { id: 'e2', type: 'socket_double', position: { x: 0.9, y: 0.5 }, height: 1.1, circuit: 'garage' },
      { id: 'e3', type: 'consumer_unit', position: { x: 0.05, y: 0.9 }, height: 1.5, circuit: 'main' },
      { id: 'e4', type: 'switch_1g', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e5', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'stopcock', position: { x: 0.05, y: 0.05 }, requiresVent: false, hotWater: false, coldWater: true, waste: false },
      { id: 'p2', type: 'gas_meter', position: { x: 0.95, y: 0.05 }, requiresVent: true, hotWater: false, coldWater: false, waste: false },
    ],
    flooring: 'concrete_polished',
    heating: 'none',
    features: [],
  },
  workshop: {
    name: 'Workshop',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.05 }, height: 1.1, circuit: 'workshop' },
      { id: 'e2', type: 'socket_double', position: { x: 0.3, y: 0.05 }, height: 1.1, circuit: 'workshop' },
      { id: 'e3', type: 'socket_double', position: { x: 0.5, y: 0.05 }, height: 1.1, circuit: 'workshop' },
      { id: 'e4', type: 'socket_double', position: { x: 0.7, y: 0.05 }, height: 1.1, circuit: 'workshop' },
      { id: 'e5', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e6', type: 'ceiling_rose', position: { x: 0.25, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e7', type: 'ceiling_rose', position: { x: 0.75, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [],
    flooring: 'concrete_polished',
    heating: 'none',
    features: [],
  },
  plant_room: {
    name: 'Plant Room',
    height: 2.1,
    electrical: [
      { id: 'e1', type: 'fused_spur', position: { x: 0.5, y: 0.05 }, height: 1.2, circuit: 'heating' },
      { id: 'e2', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e3', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.1, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'boiler', position: { x: 0.5, y: 0.05 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'hot_water_cylinder', position: { x: 0.8, y: 0.05 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
      { id: 'p3', type: 'underfloor_manifold', position: { x: 0.2, y: 0.05 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_ceramic',
    heating: 'none',
    features: [],
  },
  conservatory: {
    name: 'Conservatory',
    height: 2.7,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.25 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.05, y: 0.75 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.95, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e4', type: 'switch_1g', position: { x: 0.02, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e5', type: 'downlight', position: { x: 0.25, y: 0.25 }, height: 2.7, circuit: 'lighting' },
      { id: 'e6', type: 'downlight', position: { x: 0.75, y: 0.25 }, height: 2.7, circuit: 'lighting' },
      { id: 'e7', type: 'downlight', position: { x: 0.5, y: 0.75 }, height: 2.7, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.98 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'tiles_porcelain',
    heating: 'radiator',
    features: [],
  },
  orangery: {
    name: 'Orangery',
    height: 2.7,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.3 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.05, y: 0.7 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.95, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e4', type: 'switch_dimmer', position: { x: 0.02, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e5', type: 'pendant', position: { x: 0.5, y: 0.5 }, height: 2.7, circuit: 'lighting' },
      { id: 'e6', type: 'wall_light', position: { x: 0.25, y: 0.02 }, height: 2.0, circuit: 'lighting' },
      { id: 'e7', type: 'wall_light', position: { x: 0.75, y: 0.02 }, height: 2.0, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'underfloor_manifold', position: { x: 0.02, y: 0.1 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'natural_stone',
    heating: 'underfloor_water',
    features: ['skylight'],
  },
  garden_room: {
    name: 'Garden Room',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.9, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_1g', position: { x: 0.02, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'lvt',
    heating: 'radiator',
    features: ['patio_doors'],
  },
  loft_room: {
    name: 'Loft Room',
    height: 2.2,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.9, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_1g', position: { x: 0.05, y: 0.1 }, height: 1.0, circuit: 'lighting' },
      { id: 'e4', type: 'downlight', position: { x: 0.3, y: 0.5 }, height: 2.2, circuit: 'lighting' },
      { id: 'e5', type: 'downlight', position: { x: 0.7, y: 0.5 }, height: 2.2, circuit: 'lighting' },
      { id: 'e6', type: 'smoke_detector', position: { x: 0.5, y: 0.5 }, height: 2.2, circuit: 'fire_alarm' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'engineered_wood',
    heating: 'radiator',
    features: ['skylight', 'vaulted_ceiling'],
  },
  attic: {
    name: 'Attic',
    height: 1.8,
    electrical: [
      { id: 'e1', type: 'switch_1g', position: { x: 0.05, y: 0.5 }, height: 1.0, circuit: 'lighting' },
      { id: 'e2', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 1.8, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'cold_water_tank', position: { x: 0.5, y: 0.5 }, requiresVent: false, hotWater: false, coldWater: true, waste: false },
    ],
    flooring: 'lvt',
    heating: 'none',
    features: [],
  },
  basement: {
    name: 'Basement',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.5 }, height: 0.45, circuit: 'basement' },
      { id: 'e2', type: 'socket_double', position: { x: 0.9, y: 0.5 }, height: 0.45, circuit: 'basement' },
      { id: 'e3', type: 'switch_1g', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
      { id: 'e5', type: 'fused_spur', position: { x: 0.9, y: 0.9 }, height: 0.3, circuit: 'sump_pump' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'concrete_polished',
    heating: 'radiator',
    features: [],
  },
  open_plan: {
    name: 'Open Plan Living',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.05, y: 0.1 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.05, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'socket_double', position: { x: 0.05, y: 0.9 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e4', type: 'socket_double', position: { x: 0.95, y: 0.3 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e5', type: 'socket_double', position: { x: 0.95, y: 0.7 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e6', type: 'socket_double', position: { x: 0.3, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e7', type: 'socket_double', position: { x: 0.5, y: 0.05 }, height: 1.1, circuit: 'ring_main' },
      { id: 'e8', type: 'cooker_outlet', position: { x: 0.7, y: 0.05 }, height: 0.45, circuit: 'cooker' },
      { id: 'e9', type: 'switch_2g', position: { x: 0.02, y: 0.5 }, height: 1.2, circuit: 'lighting' },
      { id: 'e10', type: 'downlight', position: { x: 0.2, y: 0.2 }, height: 2.4, circuit: 'lighting' },
      { id: 'e11', type: 'downlight', position: { x: 0.5, y: 0.2 }, height: 2.4, circuit: 'lighting' },
      { id: 'e12', type: 'downlight', position: { x: 0.8, y: 0.2 }, height: 2.4, circuit: 'lighting' },
      { id: 'e13', type: 'pendant', position: { x: 0.3, y: 0.6 }, height: 2.4, circuit: 'lighting' },
      { id: 'e14', type: 'pendant', position: { x: 0.7, y: 0.8 }, height: 2.4, circuit: 'lighting' },
      { id: 'e15', type: 'tv_point', position: { x: 0.5, y: 0.98 }, height: 1.2, circuit: 'ring_main' },
      { id: 'e16', type: 'extractor_fan', position: { x: 0.5, y: 0.05 }, height: 1.8, circuit: 'cooker_hood' },
    ],
    plumbing: [
      { id: 'p1', type: 'kitchen_sink', position: { x: 0.4, y: 0.05 }, requiresVent: true, hotWater: true, coldWater: true, waste: true },
      { id: 'p2', type: 'dishwasher', position: { x: 0.25, y: 0.05 }, requiresVent: false, hotWater: true, coldWater: true, waste: true },
      { id: 'p3', type: 'radiator', position: { x: 0.02, y: 0.3 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
      { id: 'p4', type: 'radiator', position: { x: 0.02, y: 0.7 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'engineered_wood',
    heating: 'radiator',
    features: ['island_unit', 'patio_doors'],
  },
  extension: {
    name: 'Extension',
    height: 2.4,
    electrical: [
      { id: 'e1', type: 'socket_double', position: { x: 0.1, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e2', type: 'socket_double', position: { x: 0.9, y: 0.5 }, height: 0.45, circuit: 'ring_main' },
      { id: 'e3', type: 'switch_1g', position: { x: 0.05, y: 0.1 }, height: 1.2, circuit: 'lighting' },
      { id: 'e4', type: 'ceiling_rose', position: { x: 0.5, y: 0.5 }, height: 2.4, circuit: 'lighting' },
    ],
    plumbing: [
      { id: 'p1', type: 'radiator', position: { x: 0.5, y: 0.02 }, requiresVent: false, hotWater: true, coldWater: true, waste: false },
    ],
    flooring: 'lvt',
    heating: 'radiator',
    features: [],
  },
};

// Building Regulations minimum requirements
export const BUILDING_REGS = {
  minCeilingHeight: 2.1, // metres
  minBedroomArea: 6.5, // sqm for single, 10.2 for double
  minKitchenWidth: 1.8, // metres
  minBathroomWidth: 1.6,
  minWCWidth: 0.8,
  minDoorWidth: 0.75, // Part M accessible: 0.8
  minCorridorWidth: 0.9,
  minStairWidth: 0.85,
  windowAreaRatio: 0.17, // 17% of floor area for Part L daylight
  socketHeightStandard: 0.45,
  socketHeightAccessible: 0.45, // 450mm-1200mm Part M
  switchHeight: 1.2, // 900mm-1200mm Part M
  radiatorOutputPerSqm: 100, // watts per sqm typical
  ventilationRates: {
    kitchen: 60, // l/s intermittent or 13 l/s continuous
    bathroom: 15,
    utility: 30,
    wc: 6,
  },
};

// Electrical point SVG symbols (BS 3939 based)
export const ELECTRICAL_SYMBOLS = {
  socket_single: '<rect x="-6" y="-4" width="12" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-3" y1="0" x2="3" y2="0" stroke="currentColor" stroke-width="0.5"/>',
  socket_double: '<rect x="-8" y="-4" width="16" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-4" y1="0" x2="-1" y2="0" stroke="currentColor" stroke-width="0.5"/><line x1="1" y1="0" x2="4" y2="0" stroke="currentColor" stroke-width="0.5"/>',
  socket_usb: '<rect x="-8" y="-4" width="16" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="4" text-anchor="middle">USB</text>',
  switch_1g: '<circle r="4" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="0" y1="-4" x2="0" y2="4" stroke="currentColor" stroke-width="0.5"/>',
  switch_2g: '<circle r="4" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-2" y1="-4" x2="-2" y2="4" stroke="currentColor" stroke-width="0.5"/><line x1="2" y1="-4" x2="2" y2="4" stroke="currentColor" stroke-width="0.5"/>',
  switch_dimmer: '<circle r="4" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">D</text>',
  ceiling_rose: '<circle r="3" fill="none" stroke="currentColor" stroke-width="0.5"/><circle r="1" fill="currentColor"/>',
  downlight: '<circle r="4" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-2" y1="-2" x2="2" y2="2" stroke="currentColor" stroke-width="0.5"/><line x1="2" y1="-2" x2="-2" y2="2" stroke="currentColor" stroke-width="0.5"/>',
  wall_light: '<path d="M-4,-3 L4,-3 L4,3 L-4,3 Z" fill="none" stroke="currentColor" stroke-width="0.5"/><circle r="2" fill="none" stroke="currentColor" stroke-width="0.5"/>',
  pendant: '<circle r="5" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="0" y1="-5" x2="0" y2="-8" stroke="currentColor" stroke-width="0.5"/>',
  spotlight: '<polygon points="0,-4 4,4 -4,4" fill="none" stroke="currentColor" stroke-width="0.5"/>',
  tv_point: '<rect x="-5" y="-4" width="10" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="4" text-anchor="middle">TV</text>',
  data_point: '<rect x="-5" y="-4" width="10" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">DATA</text>',
  telephone: '<rect x="-5" y="-4" width="10" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">TEL</text>',
  smoke_detector: '<circle r="5" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">SD</text>',
  heat_detector: '<circle r="5" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">HD</text>',
  co_detector: '<circle r="5" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">CO</text>',
  consumer_unit: '<rect x="-10" y="-6" width="20" height="12" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">CU</text>',
  extractor_fan: '<circle r="5" fill="none" stroke="currentColor" stroke-width="0.5"/><path d="M-3,0 C-3,-2 0,-3 0,-3 C0,-3 3,-2 3,0 C3,2 0,3 0,3 C0,3 -3,2 -3,0" fill="none" stroke="currentColor" stroke-width="0.5"/>',
  cooker_outlet: '<rect x="-6" y="-6" width="12" height="12" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">45A</text>',
  fused_spur: '<rect x="-6" y="-4" width="12" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">FCU</text>',
};

// Plumbing point SVG symbols
export const PLUMBING_SYMBOLS = {
  radiator: '<rect x="-12" y="-4" width="24" height="8" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-10" y1="-4" x2="-10" y2="4" stroke="currentColor" stroke-width="0.3"/><line x1="-6" y1="-4" x2="-6" y2="4" stroke="currentColor" stroke-width="0.3"/><line x1="-2" y1="-4" x2="-2" y2="4" stroke="currentColor" stroke-width="0.3"/><line x1="2" y1="-4" x2="2" y2="4" stroke="currentColor" stroke-width="0.3"/><line x1="6" y1="-4" x2="6" y2="4" stroke="currentColor" stroke-width="0.3"/><line x1="10" y1="-4" x2="10" y2="4" stroke="currentColor" stroke-width="0.3"/>',
  towel_rail: '<rect x="-4" y="-10" width="8" height="20" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-2" y1="-8" x2="-2" y2="8" stroke="currentColor" stroke-width="0.3"/><line x1="2" y1="-8" x2="2" y2="8" stroke="currentColor" stroke-width="0.3"/>',
  basin: '<ellipse rx="8" ry="6" fill="none" stroke="currentColor" stroke-width="0.5"/><circle r="1" fill="currentColor"/>',
  wc: '<ellipse rx="5" ry="8" fill="none" stroke="currentColor" stroke-width="0.5"/><rect x="-6" y="-12" width="12" height="4" fill="none" stroke="currentColor" stroke-width="0.5"/>',
  bath: '<rect x="-15" y="-8" width="30" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="0.5"/><circle cx="-10" cy="0" r="1" fill="currentColor"/>',
  shower: '<rect x="-10" y="-10" width="20" height="20" fill="none" stroke="currentColor" stroke-width="0.5"/><circle r="2" fill="currentColor"/>',
  bidet: '<ellipse rx="5" ry="7" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-3" y1="0" x2="3" y2="0" stroke="currentColor" stroke-width="0.5"/>',
  kitchen_sink: '<rect x="-12" y="-8" width="24" height="16" fill="none" stroke="currentColor" stroke-width="0.5"/><circle r="1.5" fill="currentColor"/>',
  dishwasher: '<rect x="-8" y="-8" width="16" height="16" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="4" text-anchor="middle">DW</text>',
  washing_machine: '<rect x="-8" y="-8" width="16" height="16" fill="none" stroke="currentColor" stroke-width="0.5"/><circle r="5" fill="none" stroke="currentColor" stroke-width="0.5"/>',
  boiler: '<rect x="-8" y="-10" width="16" height="20" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">BOILER</text>',
  hot_water_cylinder: '<ellipse rx="6" ry="10" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">HWC</text>',
  cold_water_tank: '<rect x="-10" y="-8" width="20" height="16" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">CWT</text>',
  underfloor_manifold: '<rect x="-10" y="-5" width="20" height="10" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">UFH</text>',
  waste_stack: '<circle r="4" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">W</text>',
  soil_pipe: '<circle r="6" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">SVP</text>',
  svp: '<circle r="6" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">SVP</text>',
  aco_drain: '<rect x="-15" y="-3" width="30" height="6" fill="none" stroke="currentColor" stroke-width="0.5"/><line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" stroke-width="0.3" stroke-dasharray="2,1"/>',
  outside_tap: '<circle r="4" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">OT</text>',
  gas_meter: '<rect x="-8" y="-6" width="16" height="12" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="2" font-size="3" text-anchor="middle">GAS</text>',
  stopcock: '<polygon points="0,-4 4,0 0,4 -4,0" fill="none" stroke="currentColor" stroke-width="0.5"/><text x="0" y="1" font-size="2" text-anchor="middle">S</text>',
};

// Generate default room configuration based on type
export function createDefaultRoom(type: RoomType, dimensions: { length: number; width: number }): RoomConfig {
  const template = ROOM_TEMPLATES[type] || ROOM_TEMPLATES.extension;
  
  return {
    id: `room-${Date.now()}`,
    name: template.name || type.replace(/_/g, ' '),
    type,
    length: dimensions.length,
    width: dimensions.width,
    height: template.height || 2.4,
    windows: template.windows || [],
    doors: template.doors || [],
    electrical: template.electrical || [],
    plumbing: template.plumbing || [],
    flooring: template.flooring || 'carpet',
    heating: template.heating || 'radiator',
    features: template.features || [],
  };
}

// Calculate minimum window area for Part L compliance
export function calculateMinWindowArea(floorArea: number): number {
  return floorArea * BUILDING_REGS.windowAreaRatio;
}

// Calculate radiator output required
export function calculateRadiatorOutput(roomArea: number, roomHeight: number): number {
  const volume = roomArea * roomHeight;
  // Simplified calculation - actual depends on heat loss, insulation, etc.
  return volume * 40; // watts (approx 40W per m³)
}

// Count electrical points for cost estimation
export function countElectricalPoints(rooms: RoomConfig[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  rooms.forEach(room => {
    room.electrical.forEach(point => {
      counts[point.type] = (counts[point.type] || 0) + 1;
    });
  });
  
  return counts;
}

// Count plumbing points for cost estimation  
export function countPlumbingPoints(rooms: RoomConfig[]): Record<string, number> {
  const counts: Record<string, number> = {};
  
  rooms.forEach(room => {
    room.plumbing.forEach(point => {
      counts[point.type] = (counts[point.type] || 0) + 1;
    });
  });
  
  return counts;
}
