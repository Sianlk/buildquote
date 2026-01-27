// Detailed component breakdowns for trade jobs
// Full real-world component specifications including pipes, fittings, consumables
// Based on Jan 2026 UK Trade Prices

export interface DetailedComponent {
  id: string;
  name: string;
  category: 'pipe' | 'fitting' | 'valve' | 'seal' | 'fixing' | 'consumable' | 'electrical' | 'tool' | 'timber' | 'hardware' | 'safety' | 'insulation' | 'drainage' | 'roofing' | 'masonry' | 'glazing' | 'hvac' | 'security' | 'renewables';
  unit: string;
  tradeCost: number;
  retailCost: number;
  supplier?: string;
  partCode?: string;
  minOrderQty?: number;
  leadTimeDays?: number;
}

// Plumbing Components - Comprehensive Breakdown
export const PLUMBING_COMPONENTS: DetailedComponent[] = [
  // Copper Pipes
  { id: 'cu_pipe_15', name: '15mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 3.20, retailCost: 4.50, partCode: 'CU15-3M' },
  { id: 'cu_pipe_22', name: '22mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 5.20, retailCost: 6.80, partCode: 'CU22-3M' },
  { id: 'cu_pipe_28', name: '28mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 8.50, retailCost: 12.00, partCode: 'CU28-3M' },
  { id: 'cu_pipe_35', name: '35mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 14.50, retailCost: 19.00, partCode: 'CU35-3M' },
  
  // Plastic Pipes
  { id: 'pex_pipe_15', name: '15mm PEX-AL-PEX Pipe', category: 'pipe', unit: 'm', tradeCost: 1.85, retailCost: 2.80, partCode: 'PEX15' },
  { id: 'pex_pipe_22', name: '22mm PEX-AL-PEX Pipe', category: 'pipe', unit: 'm', tradeCost: 2.95, retailCost: 4.20, partCode: 'PEX22' },
  { id: 'pushfit_15', name: '15mm Speedfit Pipe (barrier)', category: 'pipe', unit: 'm', tradeCost: 1.45, retailCost: 2.20, partCode: 'SF15' },
  { id: 'pushfit_22', name: '22mm Speedfit Pipe (barrier)', category: 'pipe', unit: 'm', tradeCost: 2.15, retailCost: 3.20, partCode: 'SF22' },
  
  // Waste Pipes
  { id: 'waste_32', name: '32mm Push-fit Waste Pipe (3m)', category: 'pipe', unit: 'length', tradeCost: 5.50, retailCost: 8.00, partCode: 'W32-3M' },
  { id: 'waste_40', name: '40mm Push-fit Waste Pipe (3m)', category: 'pipe', unit: 'length', tradeCost: 6.20, retailCost: 9.00, partCode: 'W40-3M' },
  { id: 'soil_110', name: '110mm Soil Pipe (3m)', category: 'pipe', unit: 'length', tradeCost: 25.50, retailCost: 36.00, partCode: 'S110-3M' },
  
  // Copper Fittings - Elbows
  { id: 'cu_elbow_15_90', name: '15mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 0.85, retailCost: 1.40, partCode: 'CE15-90' },
  { id: 'cu_elbow_22_90', name: '22mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 1.45, retailCost: 2.20, partCode: 'CE22-90' },
  { id: 'cu_elbow_15_45', name: '15mm Copper 45° Elbow', category: 'fitting', unit: 'nr', tradeCost: 0.95, retailCost: 1.50, partCode: 'CE15-45' },
  { id: 'cu_elbow_22_45', name: '22mm Copper 45° Elbow', category: 'fitting', unit: 'nr', tradeCost: 1.65, retailCost: 2.40, partCode: 'CE22-45' },
  
  // Copper Fittings - Tees
  { id: 'cu_tee_15', name: '15mm Copper Equal Tee', category: 'fitting', unit: 'nr', tradeCost: 1.25, retailCost: 1.90, partCode: 'CT15' },
  { id: 'cu_tee_22', name: '22mm Copper Equal Tee', category: 'fitting', unit: 'nr', tradeCost: 2.15, retailCost: 3.20, partCode: 'CT22' },
  { id: 'cu_tee_22x15', name: '22mm x 15mm Copper Reducing Tee', category: 'fitting', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'CT22-15' },
  { id: 'cu_tee_28x22', name: '28mm x 22mm Copper Reducing Tee', category: 'fitting', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'CT28-22' },
  
  // Copper Fittings - Couplers & Reducers
  { id: 'cu_coupler_15', name: '15mm Copper Straight Coupler', category: 'fitting', unit: 'nr', tradeCost: 0.65, retailCost: 1.00, partCode: 'CC15' },
  { id: 'cu_coupler_22', name: '22mm Copper Straight Coupler', category: 'fitting', unit: 'nr', tradeCost: 1.15, retailCost: 1.70, partCode: 'CC22' },
  { id: 'cu_reducer_22x15', name: '22mm x 15mm Copper Reducer', category: 'fitting', unit: 'nr', tradeCost: 1.35, retailCost: 2.00, partCode: 'CR22-15' },
  { id: 'cu_reducer_28x22', name: '28mm x 22mm Copper Reducer', category: 'fitting', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'CR28-22' },
  
  // Compression Fittings
  { id: 'comp_elbow_15', name: '15mm Compression Elbow', category: 'fitting', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'CME15' },
  { id: 'comp_elbow_22', name: '22mm Compression Elbow', category: 'fitting', unit: 'nr', tradeCost: 4.50, retailCost: 6.50, partCode: 'CME22' },
  { id: 'comp_tee_15', name: '15mm Compression Tee', category: 'fitting', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'CMT15' },
  { id: 'comp_tee_22', name: '22mm Compression Tee', category: 'fitting', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'CMT22' },
  { id: 'comp_straight_15', name: '15mm Compression Straight', category: 'fitting', unit: 'nr', tradeCost: 2.25, retailCost: 3.40, partCode: 'CMS15' },
  { id: 'comp_straight_22', name: '22mm Compression Straight', category: 'fitting', unit: 'nr', tradeCost: 3.75, retailCost: 5.50, partCode: 'CMS22' },
  
  // Push-fit Fittings
  { id: 'pf_elbow_15', name: '15mm Push-fit Elbow', category: 'fitting', unit: 'nr', tradeCost: 3.45, retailCost: 5.20, partCode: 'PFE15' },
  { id: 'pf_elbow_22', name: '22mm Push-fit Elbow', category: 'fitting', unit: 'nr', tradeCost: 5.85, retailCost: 8.50, partCode: 'PFE22' },
  { id: 'pf_tee_15', name: '15mm Push-fit Tee', category: 'fitting', unit: 'nr', tradeCost: 4.95, retailCost: 7.50, partCode: 'PFT15' },
  { id: 'pf_tee_22', name: '22mm Push-fit Tee', category: 'fitting', unit: 'nr', tradeCost: 8.25, retailCost: 12.00, partCode: 'PFT22' },
  
  // Valves
  { id: 'iso_valve_15', name: '15mm Isolation Valve (chrome)', category: 'valve', unit: 'nr', tradeCost: 4.85, retailCost: 7.50, partCode: 'IV15' },
  { id: 'iso_valve_22', name: '22mm Isolation Valve (chrome)', category: 'valve', unit: 'nr', tradeCost: 6.95, retailCost: 10.50, partCode: 'IV22' },
  { id: 'gate_valve_15', name: '15mm Gate Valve', category: 'valve', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'GV15' },
  { id: 'gate_valve_22', name: '22mm Gate Valve', category: 'valve', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'GV22' },
  { id: 'stopcock_15', name: '15mm Stopcock', category: 'valve', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'SC15' },
  { id: 'check_valve_15', name: '15mm Single Check Valve', category: 'valve', unit: 'nr', tradeCost: 8.95, retailCost: 13.50, partCode: 'CV15' },
  { id: 'dbl_check_22', name: '22mm Double Check Valve', category: 'valve', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'DCV22' },
  { id: 'prv_15', name: '15mm Pressure Reducing Valve', category: 'valve', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'PRV15' },
  { id: 'prv_22', name: '22mm Pressure Reducing Valve', category: 'valve', unit: 'nr', tradeCost: 65.00, retailCost: 92.00, partCode: 'PRV22' },
  
  // Radiator Valves
  { id: 'trv_15', name: '15mm TRV (Thermostatic Radiator Valve)', category: 'valve', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'TRV15' },
  { id: 'lockshield_15', name: '15mm Lockshield Valve', category: 'valve', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'LS15' },
  { id: 'drain_valve', name: 'Drain Valve', category: 'valve', unit: 'nr', tradeCost: 4.25, retailCost: 6.50, partCode: 'DV' },
  { id: 'aav_15', name: '15mm Air Admittance Valve', category: 'valve', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'AAV15' },
  
  // Seals and O-rings
  { id: 'fibre_washer_15', name: '15mm Fibre Washer (pack of 10)', category: 'seal', unit: 'pack', tradeCost: 1.85, retailCost: 2.80, partCode: 'FW15' },
  { id: 'fibre_washer_22', name: '22mm Fibre Washer (pack of 10)', category: 'seal', unit: 'pack', tradeCost: 2.45, retailCost: 3.60, partCode: 'FW22' },
  { id: 'rubber_washer_15', name: '15mm Rubber Washer (pack of 10)', category: 'seal', unit: 'pack', tradeCost: 1.45, retailCost: 2.20, partCode: 'RW15' },
  { id: 'rubber_washer_22', name: '22mm Rubber Washer (pack of 10)', category: 'seal', unit: 'pack', tradeCost: 1.95, retailCost: 2.90, partCode: 'RW22' },
  { id: 'oring_15', name: '15mm O-Ring (pack of 10)', category: 'seal', unit: 'pack', tradeCost: 2.25, retailCost: 3.40, partCode: 'OR15' },
  { id: 'oring_22', name: '22mm O-Ring (pack of 10)', category: 'seal', unit: 'pack', tradeCost: 2.85, retailCost: 4.20, partCode: 'OR22' },
  { id: 'comp_olive_15', name: '15mm Compression Olive (brass, pack of 10)', category: 'seal', unit: 'pack', tradeCost: 2.95, retailCost: 4.40, partCode: 'CO15' },
  { id: 'comp_olive_22', name: '22mm Compression Olive (brass, pack of 10)', category: 'seal', unit: 'pack', tradeCost: 4.25, retailCost: 6.20, partCode: 'CO22' },
  { id: 'tap_washer_set', name: 'Tap Washer Assortment (50pc)', category: 'seal', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'TWS50' },
  { id: 'boss_seal', name: 'Boss White Seal (400g)', category: 'seal', unit: 'tub', tradeCost: 6.50, retailCost: 9.50, partCode: 'BW400' },
  
  // Fixings and Clips
  { id: 'pipe_clip_15_plas', name: '15mm Plastic Pipe Clip (pack of 50)', category: 'fixing', unit: 'pack', tradeCost: 4.25, retailCost: 6.50, partCode: 'PC15P' },
  { id: 'pipe_clip_22_plas', name: '22mm Plastic Pipe Clip (pack of 50)', category: 'fixing', unit: 'pack', tradeCost: 5.50, retailCost: 8.00, partCode: 'PC22P' },
  { id: 'pipe_clip_15_chr', name: '15mm Chrome Pipe Clip (pack of 10)', category: 'fixing', unit: 'pack', tradeCost: 6.85, retailCost: 10.00, partCode: 'PC15C' },
  { id: 'pipe_clip_22_chr', name: '22mm Chrome Pipe Clip (pack of 10)', category: 'fixing', unit: 'pack', tradeCost: 8.95, retailCost: 13.00, partCode: 'PC22C' },
  { id: 'munsen_ring_15', name: '15mm Munsen Ring (pack of 10)', category: 'fixing', unit: 'pack', tradeCost: 5.85, retailCost: 8.50, partCode: 'MR15' },
  { id: 'munsen_ring_22', name: '22mm Munsen Ring (pack of 10)', category: 'fixing', unit: 'pack', tradeCost: 7.25, retailCost: 10.50, partCode: 'MR22' },
  { id: 'rad_brackets', name: 'Radiator Wall Brackets (pair)', category: 'fixing', unit: 'pair', tradeCost: 6.50, retailCost: 9.50, partCode: 'RWB' },
  { id: 'basin_brackets', name: 'Basin Fixing Brackets (pair)', category: 'fixing', unit: 'pair', tradeCost: 8.50, retailCost: 12.50, partCode: 'BFB' },
  { id: 'wc_fixing_kit', name: 'WC Floor Fixing Kit', category: 'fixing', unit: 'kit', tradeCost: 4.85, retailCost: 7.20, partCode: 'WCFK' },
  
  // Consumables
  { id: 'ptfe_tape', name: 'PTFE Tape (12mm x 12m)', category: 'consumable', unit: 'roll', tradeCost: 0.85, retailCost: 1.50, partCode: 'PTFE' },
  { id: 'ptfe_tape_gas', name: 'Gas PTFE Tape (Yellow, 12m)', category: 'consumable', unit: 'roll', tradeCost: 1.45, retailCost: 2.20, partCode: 'PTFEG' },
  { id: 'jointing_compound', name: 'Jointing Compound (400g)', category: 'consumable', unit: 'tub', tradeCost: 5.85, retailCost: 8.50, partCode: 'JC400' },
  { id: 'flux_paste', name: 'Soldering Flux Paste (100g)', category: 'consumable', unit: 'tub', tradeCost: 4.25, retailCost: 6.20, partCode: 'FP100' },
  { id: 'solder_lead_free', name: 'Lead-Free Solder (500g reel)', category: 'consumable', unit: 'reel', tradeCost: 28.50, retailCost: 42.00, partCode: 'SLF500' },
  { id: 'silicone_white', name: 'Silicone Sealant White (300ml)', category: 'consumable', unit: 'tube', tradeCost: 4.25, retailCost: 6.50, partCode: 'SSW' },
  { id: 'silicone_clear', name: 'Silicone Sealant Clear (300ml)', category: 'consumable', unit: 'tube', tradeCost: 4.85, retailCost: 7.20, partCode: 'SSC' },
  { id: 'plumbers_mait', name: 'Plumbers Mait (750g)', category: 'consumable', unit: 'tub', tradeCost: 5.25, retailCost: 7.80, partCode: 'PM750' },
  { id: 'fire_cement', name: 'Fire Cement (500g)', category: 'consumable', unit: 'tub', tradeCost: 4.85, retailCost: 7.20, partCode: 'FC500' },
  { id: 'pipe_freeze_kit', name: 'Pipe Freezing Kit', category: 'consumable', unit: 'kit', tradeCost: 28.50, retailCost: 42.00, partCode: 'PFK' },
  { id: 'system_cleaner', name: 'Heating System Cleaner (1L)', category: 'consumable', unit: 'litre', tradeCost: 18.50, retailCost: 28.00, partCode: 'HSC1' },
  { id: 'system_inhibitor', name: 'System Inhibitor X100 (1L)', category: 'consumable', unit: 'litre', tradeCost: 18.50, retailCost: 28.00, partCode: 'SI1' },
  { id: 'leak_sealer', name: 'Central Heating Leak Sealer (500ml)', category: 'consumable', unit: 'bottle', tradeCost: 12.50, retailCost: 18.00, partCode: 'LS500' },
  { id: 'descaler', name: 'Limescale Remover (1L)', category: 'consumable', unit: 'litre', tradeCost: 8.50, retailCost: 12.50, partCode: 'LR1' },
];

// Electrical Components
export const ELECTRICAL_COMPONENTS: DetailedComponent[] = [
  // Cables
  { id: 'cable_1mm_te', name: '1.0mm² T&E Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 42.00, retailCost: 62.00, partCode: 'TE1-100' },
  { id: 'cable_1.5mm_te', name: '1.5mm² T&E Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 58.00, retailCost: 85.00, partCode: 'TE15-100' },
  { id: 'cable_2.5mm_te', name: '2.5mm² T&E Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 95.00, retailCost: 140.00, partCode: 'TE25-100' },
  { id: 'cable_4mm_te', name: '4.0mm² T&E Cable (50m)', category: 'electrical', unit: 'roll', tradeCost: 85.00, retailCost: 125.00, partCode: 'TE4-50' },
  { id: 'cable_6mm_te', name: '6.0mm² T&E Cable (50m)', category: 'electrical', unit: 'roll', tradeCost: 125.00, retailCost: 185.00, partCode: 'TE6-50' },
  { id: 'cable_10mm_te', name: '10.0mm² T&E Cable (25m)', category: 'electrical', unit: 'roll', tradeCost: 95.00, retailCost: 140.00, partCode: 'TE10-25' },
  { id: 'swa_cable_4mm', name: '4mm² 3-Core SWA Cable (per m)', category: 'electrical', unit: 'm', tradeCost: 4.85, retailCost: 7.20, partCode: 'SWA4' },
  { id: 'flex_1mm', name: '1.0mm² 3-Core Flex (per m)', category: 'electrical', unit: 'm', tradeCost: 0.85, retailCost: 1.30, partCode: 'FX1' },
  
  // Consumer Units & Protection
  { id: 'cu_10way', name: '10-Way Consumer Unit (metal)', category: 'electrical', unit: 'nr', tradeCost: 145.00, retailCost: 210.00, partCode: 'CU10' },
  { id: 'cu_12way', name: '12-Way Consumer Unit (metal)', category: 'electrical', unit: 'nr', tradeCost: 175.00, retailCost: 255.00, partCode: 'CU12' },
  { id: 'rcbo_6a', name: 'RCBO 6A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO6' },
  { id: 'rcbo_16a', name: 'RCBO 16A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO16' },
  { id: 'rcbo_32a', name: 'RCBO 32A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO32' },
  { id: 'mcb_6a', name: 'MCB 6A Type B', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'MCB6' },
  { id: 'mcb_16a', name: 'MCB 16A Type B', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'MCB16' },
  { id: 'mcb_32a', name: 'MCB 32A Type B', category: 'electrical', unit: 'nr', tradeCost: 5.25, retailCost: 7.80, partCode: 'MCB32' },
  { id: 'rcd_63a', name: 'RCD 63A 30mA', category: 'electrical', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'RCD63' },
  { id: 'spd', name: 'Surge Protection Device (Type 2)', category: 'electrical', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'SPD2' },
  
  // Wiring Accessories
  { id: 'socket_single', name: 'Single Socket (white)', category: 'electrical', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'SS' },
  { id: 'socket_double', name: 'Double Socket (white)', category: 'electrical', unit: 'nr', tradeCost: 3.85, retailCost: 5.80, partCode: 'DS' },
  { id: 'socket_usb', name: 'Double Socket with USB', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.50, partCode: 'DSU' },
  { id: 'switch_1g', name: '1-Gang 2-Way Switch', category: 'electrical', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'S1G' },
  { id: 'switch_2g', name: '2-Gang 2-Way Switch', category: 'electrical', unit: 'nr', tradeCost: 3.25, retailCost: 4.80, partCode: 'S2G' },
  { id: 'dimmer_1g', name: '1-Gang LED Dimmer', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 28.00, partCode: 'D1G' },
  { id: 'fused_spur', name: 'Fused Connection Unit 13A', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'FCU' },
  { id: 'cooker_switch', name: '45A Cooker Switch with Socket', category: 'electrical', unit: 'nr', tradeCost: 14.50, retailCost: 22.00, partCode: 'CS45' },
  { id: 'shower_switch', name: '45A Double Pole Shower Switch', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.50, partCode: 'SS45' },
  
  // Boxes and Enclosures  
  { id: 'back_box_25', name: '25mm Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 0.85, retailCost: 1.30, partCode: 'BB25' },
  { id: 'back_box_35', name: '35mm Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 0.95, retailCost: 1.45, partCode: 'BB35' },
  { id: 'back_box_47', name: '47mm Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 1.15, retailCost: 1.70, partCode: 'BB47' },
  { id: 'dry_lining_box', name: '35mm Dry Lining Box', category: 'electrical', unit: 'nr', tradeCost: 0.65, retailCost: 0.95, partCode: 'DLB35' },
  { id: 'junction_box_20a', name: '20A Junction Box (4 terminal)', category: 'electrical', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'JB20' },
  { id: 'junction_box_30a', name: '30A Junction Box (3 terminal)', category: 'electrical', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'JB30' },
  
  // Cable Management
  { id: 'conduit_20mm', name: '20mm Oval Conduit (3m)', category: 'electrical', unit: 'length', tradeCost: 1.85, retailCost: 2.80, partCode: 'OC20' },
  { id: 'trunking_25x16', name: 'Mini Trunking 25x16 (3m)', category: 'electrical', unit: 'length', tradeCost: 2.45, retailCost: 3.60, partCode: 'MT25' },
  { id: 'trunking_40x25', name: 'Mini Trunking 40x25 (3m)', category: 'electrical', unit: 'length', tradeCost: 4.25, retailCost: 6.20, partCode: 'MT40' },
  { id: 'cable_clips', name: 'T&E Cable Clips (pack of 100)', category: 'electrical', unit: 'pack', tradeCost: 3.85, retailCost: 5.80, partCode: 'CC100' },
  { id: 'grommet_20mm', name: '20mm Grommet (pack of 100)', category: 'electrical', unit: 'pack', tradeCost: 4.25, retailCost: 6.20, partCode: 'GR20' },
  
  // Connectors
  { id: 'wago_221_2', name: 'Wago 221 2-Way Connector (pack of 50)', category: 'electrical', unit: 'pack', tradeCost: 18.50, retailCost: 28.00, partCode: 'W221-2' },
  { id: 'wago_221_3', name: 'Wago 221 3-Way Connector (pack of 50)', category: 'electrical', unit: 'pack', tradeCost: 22.50, retailCost: 34.00, partCode: 'W221-3' },
  { id: 'wago_221_5', name: 'Wago 221 5-Way Connector (pack of 25)', category: 'electrical', unit: 'pack', tradeCost: 18.50, retailCost: 28.00, partCode: 'W221-5' },
  { id: 'choc_block_15a', name: '15A Terminal Block Strip', category: 'electrical', unit: 'strip', tradeCost: 0.85, retailCost: 1.30, partCode: 'TB15' },
  { id: 'choc_block_30a', name: '30A Terminal Block Strip', category: 'electrical', unit: 'strip', tradeCost: 1.25, retailCost: 1.90, partCode: 'TB30' },
  { id: 'crimp_kit', name: 'Crimp Terminal Kit (200pc)', category: 'electrical', unit: 'kit', tradeCost: 12.50, retailCost: 18.50, partCode: 'CTK' },
];

// Carpentry Components
export const CARPENTRY_COMPONENTS: DetailedComponent[] = [
  // Timber
  { id: 'cls_38x89', name: 'CLS Timber 38x89mm (2.4m)', category: 'pipe', unit: 'length', tradeCost: 4.25, retailCost: 6.20, partCode: 'CLS38' },
  { id: 'cls_38x140', name: 'CLS Timber 38x140mm (2.4m)', category: 'pipe', unit: 'length', tradeCost: 6.50, retailCost: 9.50, partCode: 'CLS140' },
  { id: 'batten_25x50', name: 'Treated Batten 25x50mm (3m)', category: 'pipe', unit: 'length', tradeCost: 1.85, retailCost: 2.80, partCode: 'BT25' },
  { id: 'batten_50x50', name: 'Treated Batten 50x50mm (3m)', category: 'pipe', unit: 'length', tradeCost: 3.25, retailCost: 4.80, partCode: 'BT50' },
  { id: 'joist_47x150', name: 'Floor Joist C16 47x150mm (3m)', category: 'pipe', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'FJ47' },
  { id: 'joist_47x200', name: 'Floor Joist C16 47x200mm (3m)', category: 'pipe', unit: 'length', tradeCost: 11.50, retailCost: 17.00, partCode: 'FJ200' },
  
  // Sheet Materials
  { id: 'ply_18mm', name: '18mm Hardwood Plywood (2440x1220)', category: 'pipe', unit: 'sheet', tradeCost: 48.00, retailCost: 72.00, partCode: 'PLY18' },
  { id: 'ply_12mm', name: '12mm Hardwood Plywood (2440x1220)', category: 'pipe', unit: 'sheet', tradeCost: 35.00, retailCost: 52.00, partCode: 'PLY12' },
  { id: 'osb_18mm', name: '18mm OSB3 (2440x1220)', category: 'pipe', unit: 'sheet', tradeCost: 22.00, retailCost: 32.00, partCode: 'OSB18' },
  { id: 'mdf_18mm', name: '18mm MDF (2440x1220)', category: 'pipe', unit: 'sheet', tradeCost: 28.00, retailCost: 42.00, partCode: 'MDF18' },
  { id: 'mdf_12mm', name: '12mm MDF (2440x1220)', category: 'pipe', unit: 'sheet', tradeCost: 18.50, retailCost: 28.00, partCode: 'MDF12' },
  { id: 'chipboard_18mm', name: '18mm Chipboard Flooring (2400x600)', category: 'pipe', unit: 'sheet', tradeCost: 12.50, retailCost: 18.50, partCode: 'CB18' },
  
  // Fixings - Screws
  { id: 'screw_4x40', name: 'Wood Screws 4x40mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 6.50, retailCost: 9.50, partCode: 'WS440' },
  { id: 'screw_4x50', name: 'Wood Screws 4x50mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 7.50, retailCost: 11.00, partCode: 'WS450' },
  { id: 'screw_5x60', name: 'Wood Screws 5x60mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 9.50, retailCost: 14.00, partCode: 'WS560' },
  { id: 'screw_5x80', name: 'Wood Screws 5x80mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 8.50, retailCost: 12.50, partCode: 'WS580' },
  { id: 'screw_6x100', name: 'Wood Screws 6x100mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 12.50, retailCost: 18.50, partCode: 'WS6100' },
  { id: 'drywall_screw_38', name: 'Drywall Screws 38mm (box 500)', category: 'fixing', unit: 'box', tradeCost: 8.50, retailCost: 12.50, partCode: 'DW38' },
  
  // Fixings - Nails & Brackets
  { id: 'nail_65mm', name: 'Round Wire Nails 65mm (1kg)', category: 'fixing', unit: 'kg', tradeCost: 4.25, retailCost: 6.20, partCode: 'RN65' },
  { id: 'nail_100mm', name: 'Round Wire Nails 100mm (1kg)', category: 'fixing', unit: 'kg', tradeCost: 4.85, retailCost: 7.20, partCode: 'RN100' },
  { id: 'brad_40mm', name: 'Panel Pins 40mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 3.85, retailCost: 5.80, partCode: 'PP40' },
  { id: 'joist_hanger', name: 'Joist Hanger 47x150mm', category: 'fixing', unit: 'nr', tradeCost: 3.25, retailCost: 4.80, partCode: 'JH47' },
  { id: 'angle_bracket', name: 'Heavy Duty Angle Bracket 90x90mm', category: 'fixing', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'AB90' },
  { id: 'truss_clip', name: 'Truss Clip', category: 'fixing', unit: 'nr', tradeCost: 0.45, retailCost: 0.70, partCode: 'TC' },
  
  // Adhesives
  { id: 'wood_glue_500', name: 'Wood Glue PVA (500ml)', category: 'consumable', unit: 'bottle', tradeCost: 4.25, retailCost: 6.20, partCode: 'WG500' },
  { id: 'grab_adhesive', name: 'Grab Adhesive (310ml)', category: 'consumable', unit: 'tube', tradeCost: 5.85, retailCost: 8.50, partCode: 'GA310' },
  { id: 'expanding_foam', name: 'Expanding Foam (750ml)', category: 'consumable', unit: 'can', tradeCost: 6.50, retailCost: 9.50, partCode: 'EF750' },
  { id: 'no_more_nails', name: 'No More Nails Original (300ml)', category: 'consumable', unit: 'tube', tradeCost: 5.25, retailCost: 7.80, partCode: 'NMN' },
];

// Helper function to get components by category
export function getComponentsByCategory(category: DetailedComponent['category'], source: 'plumbing' | 'electrical' | 'carpentry' = 'plumbing'): DetailedComponent[] {
  const components = source === 'plumbing' ? PLUMBING_COMPONENTS : 
                     source === 'electrical' ? ELECTRICAL_COMPONENTS : CARPENTRY_COMPONENTS;
  return components.filter(c => c.category === category);
}

// Get all components for a trade
export function getAllComponentsForTrade(trade: string): DetailedComponent[] {
  switch (trade) {
    case 'plumbing':
      return PLUMBING_COMPONENTS;
    case 'electrical':
      return ELECTRICAL_COMPONENTS;
    case 'carpentry':
      return CARPENTRY_COMPONENTS;
    default:
      return [];
  }
}

// Calculate total cost for selected components
export function calculateComponentsCost(components: { component: DetailedComponent; quantity: number }[], useTradePrices: boolean): number {
  return components.reduce((total, { component, quantity }) => {
    const unitCost = useTradePrices ? component.tradeCost : component.retailCost;
    return total + (unitCost * quantity);
  }, 0);
}