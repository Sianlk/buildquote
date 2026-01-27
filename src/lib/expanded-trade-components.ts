// Expanded Detailed Components Library - Full Bill of Materials
// Every possible component needed for trade jobs including consumables, fixings, and accessories
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

// ============================================
// PLUMBING COMPONENTS - Complete Library
// ============================================
export const PLUMBING_COMPONENTS: DetailedComponent[] = [
  // Copper Pipes - All Sizes
  { id: 'cu_pipe_8', name: '8mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 2.40, retailCost: 3.20, partCode: 'CU8-3M' },
  { id: 'cu_pipe_10', name: '10mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 2.80, retailCost: 3.80, partCode: 'CU10-3M' },
  { id: 'cu_pipe_15', name: '15mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 3.20, retailCost: 4.50, partCode: 'CU15-3M' },
  { id: 'cu_pipe_22', name: '22mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 5.20, retailCost: 6.80, partCode: 'CU22-3M' },
  { id: 'cu_pipe_28', name: '28mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 8.50, retailCost: 12.00, partCode: 'CU28-3M' },
  { id: 'cu_pipe_35', name: '35mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 14.50, retailCost: 19.00, partCode: 'CU35-3M' },
  { id: 'cu_pipe_42', name: '42mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 22.50, retailCost: 28.00, partCode: 'CU42-3M' },
  { id: 'cu_pipe_54', name: '54mm Copper Pipe (3m length)', category: 'pipe', unit: 'm', tradeCost: 32.00, retailCost: 42.00, partCode: 'CU54-3M' },
  
  // Plastic Pipes - Barrier & Non-Barrier
  { id: 'pex_pipe_10', name: '10mm PEX-AL-PEX Pipe (50m coil)', category: 'pipe', unit: 'coil', tradeCost: 65.00, retailCost: 85.00, partCode: 'PEX10-50' },
  { id: 'pex_pipe_15', name: '15mm PEX-AL-PEX Pipe (50m coil)', category: 'pipe', unit: 'coil', tradeCost: 85.00, retailCost: 115.00, partCode: 'PEX15-50' },
  { id: 'pex_pipe_22', name: '22mm PEX-AL-PEX Pipe (50m coil)', category: 'pipe', unit: 'coil', tradeCost: 125.00, retailCost: 165.00, partCode: 'PEX22-50' },
  { id: 'pushfit_10', name: '10mm Speedfit Pipe (50m)', category: 'pipe', unit: 'coil', tradeCost: 55.00, retailCost: 75.00, partCode: 'SF10-50' },
  { id: 'pushfit_15', name: '15mm Speedfit Pipe (50m)', category: 'pipe', unit: 'coil', tradeCost: 65.00, retailCost: 88.00, partCode: 'SF15-50' },
  { id: 'pushfit_22', name: '22mm Speedfit Pipe (50m)', category: 'pipe', unit: 'coil', tradeCost: 95.00, retailCost: 125.00, partCode: 'SF22-50' },
  { id: 'pushfit_28', name: '28mm Speedfit Pipe (25m)', category: 'pipe', unit: 'coil', tradeCost: 85.00, retailCost: 115.00, partCode: 'SF28-25' },
  
  // MDPE Water Mains Pipe
  { id: 'mdpe_20', name: '20mm Blue MDPE Pipe (25m)', category: 'pipe', unit: 'coil', tradeCost: 28.00, retailCost: 38.00, partCode: 'MDPE20-25' },
  { id: 'mdpe_25', name: '25mm Blue MDPE Pipe (25m)', category: 'pipe', unit: 'coil', tradeCost: 35.00, retailCost: 48.00, partCode: 'MDPE25-25' },
  { id: 'mdpe_32', name: '32mm Blue MDPE Pipe (25m)', category: 'pipe', unit: 'coil', tradeCost: 52.00, retailCost: 68.00, partCode: 'MDPE32-25' },
  
  // Gas Pipes
  { id: 'gas_cu_15', name: '15mm Gas Copper Pipe (3m)', category: 'pipe', unit: 'm', tradeCost: 4.20, retailCost: 5.80, partCode: 'GCU15' },
  { id: 'gas_cu_22', name: '22mm Gas Copper Pipe (3m)', category: 'pipe', unit: 'm', tradeCost: 6.50, retailCost: 8.50, partCode: 'GCU22' },
  { id: 'gas_cu_28', name: '28mm Gas Copper Pipe (3m)', category: 'pipe', unit: 'm', tradeCost: 10.50, retailCost: 14.00, partCode: 'GCU28' },
  { id: 'csst_15', name: '15mm CSST Gas Pipe (10m)', category: 'pipe', unit: 'coil', tradeCost: 85.00, retailCost: 115.00, partCode: 'CSST15' },
  { id: 'csst_22', name: '22mm CSST Gas Pipe (10m)', category: 'pipe', unit: 'coil', tradeCost: 115.00, retailCost: 155.00, partCode: 'CSST22' },
  
  // Waste Pipes - All Sizes
  { id: 'waste_32', name: '32mm Push-fit Waste Pipe (3m)', category: 'drainage', unit: 'length', tradeCost: 5.50, retailCost: 8.00, partCode: 'W32-3M' },
  { id: 'waste_40', name: '40mm Push-fit Waste Pipe (3m)', category: 'drainage', unit: 'length', tradeCost: 6.20, retailCost: 9.00, partCode: 'W40-3M' },
  { id: 'waste_50', name: '50mm Push-fit Waste Pipe (3m)', category: 'drainage', unit: 'length', tradeCost: 8.50, retailCost: 12.00, partCode: 'W50-3M' },
  { id: 'soil_110', name: '110mm Soil Pipe (3m)', category: 'drainage', unit: 'length', tradeCost: 25.50, retailCost: 36.00, partCode: 'S110-3M' },
  { id: 'soil_160', name: '160mm Soil Pipe (3m)', category: 'drainage', unit: 'length', tradeCost: 45.00, retailCost: 62.00, partCode: 'S160-3M' },
  
  // Copper Fittings - Complete Range
  { id: 'cu_elbow_8_90', name: '8mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 0.65, retailCost: 0.95, partCode: 'CE8-90' },
  { id: 'cu_elbow_10_90', name: '10mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 0.75, retailCost: 1.10, partCode: 'CE10-90' },
  { id: 'cu_elbow_15_90', name: '15mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 0.85, retailCost: 1.40, partCode: 'CE15-90' },
  { id: 'cu_elbow_22_90', name: '22mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 1.45, retailCost: 2.20, partCode: 'CE22-90' },
  { id: 'cu_elbow_28_90', name: '28mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'CE28-90' },
  { id: 'cu_elbow_35_90', name: '35mm Copper 90° Elbow', category: 'fitting', unit: 'nr', tradeCost: 5.50, retailCost: 7.80, partCode: 'CE35-90' },
  { id: 'cu_elbow_15_45', name: '15mm Copper 45° Elbow', category: 'fitting', unit: 'nr', tradeCost: 0.95, retailCost: 1.50, partCode: 'CE15-45' },
  { id: 'cu_elbow_22_45', name: '22mm Copper 45° Elbow', category: 'fitting', unit: 'nr', tradeCost: 1.65, retailCost: 2.40, partCode: 'CE22-45' },
  { id: 'cu_elbow_28_45', name: '28mm Copper 45° Elbow', category: 'fitting', unit: 'nr', tradeCost: 3.25, retailCost: 4.80, partCode: 'CE28-45' },
  
  // Copper Tees - All Combinations
  { id: 'cu_tee_15', name: '15mm Copper Equal Tee', category: 'fitting', unit: 'nr', tradeCost: 1.25, retailCost: 1.90, partCode: 'CT15' },
  { id: 'cu_tee_22', name: '22mm Copper Equal Tee', category: 'fitting', unit: 'nr', tradeCost: 2.15, retailCost: 3.20, partCode: 'CT22' },
  { id: 'cu_tee_28', name: '28mm Copper Equal Tee', category: 'fitting', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'CT28' },
  { id: 'cu_tee_22x15', name: '22mm x 15mm Copper Reducing Tee', category: 'fitting', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'CT22-15' },
  { id: 'cu_tee_28x22', name: '28mm x 22mm Copper Reducing Tee', category: 'fitting', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'CT28-22' },
  { id: 'cu_tee_28x15', name: '28mm x 15mm Copper Reducing Tee', category: 'fitting', unit: 'nr', tradeCost: 4.95, retailCost: 7.50, partCode: 'CT28-15' },
  { id: 'cu_tee_35x22', name: '35mm x 22mm Copper Reducing Tee', category: 'fitting', unit: 'nr', tradeCost: 8.50, retailCost: 12.00, partCode: 'CT35-22' },
  
  // Copper Couplers & Reducers
  { id: 'cu_coupler_15', name: '15mm Copper Straight Coupler', category: 'fitting', unit: 'nr', tradeCost: 0.65, retailCost: 1.00, partCode: 'CC15' },
  { id: 'cu_coupler_22', name: '22mm Copper Straight Coupler', category: 'fitting', unit: 'nr', tradeCost: 1.15, retailCost: 1.70, partCode: 'CC22' },
  { id: 'cu_coupler_28', name: '28mm Copper Straight Coupler', category: 'fitting', unit: 'nr', tradeCost: 2.25, retailCost: 3.40, partCode: 'CC28' },
  { id: 'cu_reducer_22x15', name: '22mm x 15mm Copper Reducer', category: 'fitting', unit: 'nr', tradeCost: 1.35, retailCost: 2.00, partCode: 'CR22-15' },
  { id: 'cu_reducer_28x22', name: '28mm x 22mm Copper Reducer', category: 'fitting', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'CR28-22' },
  { id: 'cu_reducer_28x15', name: '28mm x 15mm Copper Reducer', category: 'fitting', unit: 'nr', tradeCost: 2.65, retailCost: 3.90, partCode: 'CR28-15' },
  { id: 'cu_reducer_35x28', name: '35mm x 28mm Copper Reducer', category: 'fitting', unit: 'nr', tradeCost: 4.50, retailCost: 6.50, partCode: 'CR35-28' },
  { id: 'cu_reducer_35x22', name: '35mm x 22mm Copper Reducer', category: 'fitting', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'CR35-22' },
  
  // Compression Fittings - Complete Range
  { id: 'comp_elbow_8', name: '8mm Compression Elbow', category: 'fitting', unit: 'nr', tradeCost: 2.25, retailCost: 3.40, partCode: 'CME8' },
  { id: 'comp_elbow_10', name: '10mm Compression Elbow', category: 'fitting', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'CME10' },
  { id: 'comp_elbow_15', name: '15mm Compression Elbow', category: 'fitting', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'CME15' },
  { id: 'comp_elbow_22', name: '22mm Compression Elbow', category: 'fitting', unit: 'nr', tradeCost: 4.50, retailCost: 6.50, partCode: 'CME22' },
  { id: 'comp_elbow_28', name: '28mm Compression Elbow', category: 'fitting', unit: 'nr', tradeCost: 8.50, retailCost: 12.00, partCode: 'CME28' },
  { id: 'comp_tee_8', name: '8mm Compression Tee', category: 'fitting', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'CMT8' },
  { id: 'comp_tee_10', name: '10mm Compression Tee', category: 'fitting', unit: 'nr', tradeCost: 3.95, retailCost: 5.80, partCode: 'CMT10' },
  { id: 'comp_tee_15', name: '15mm Compression Tee', category: 'fitting', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'CMT15' },
  { id: 'comp_tee_22', name: '22mm Compression Tee', category: 'fitting', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'CMT22' },
  { id: 'comp_tee_28', name: '28mm Compression Tee', category: 'fitting', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'CMT28' },
  { id: 'comp_straight_8', name: '8mm Compression Straight', category: 'fitting', unit: 'nr', tradeCost: 1.85, retailCost: 2.80, partCode: 'CMS8' },
  { id: 'comp_straight_10', name: '10mm Compression Straight', category: 'fitting', unit: 'nr', tradeCost: 1.95, retailCost: 2.95, partCode: 'CMS10' },
  { id: 'comp_straight_15', name: '15mm Compression Straight', category: 'fitting', unit: 'nr', tradeCost: 2.25, retailCost: 3.40, partCode: 'CMS15' },
  { id: 'comp_straight_22', name: '22mm Compression Straight', category: 'fitting', unit: 'nr', tradeCost: 3.75, retailCost: 5.50, partCode: 'CMS22' },
  { id: 'comp_straight_28', name: '28mm Compression Straight', category: 'fitting', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'CMS28' },
  
  // Push-Fit Fittings - Speedfit Style
  { id: 'pf_elbow_10', name: '10mm Push-fit Elbow', category: 'fitting', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'PFE10' },
  { id: 'pf_elbow_15', name: '15mm Push-fit Elbow', category: 'fitting', unit: 'nr', tradeCost: 3.45, retailCost: 5.20, partCode: 'PFE15' },
  { id: 'pf_elbow_22', name: '22mm Push-fit Elbow', category: 'fitting', unit: 'nr', tradeCost: 5.85, retailCost: 8.50, partCode: 'PFE22' },
  { id: 'pf_elbow_28', name: '28mm Push-fit Elbow', category: 'fitting', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'PFE28' },
  { id: 'pf_tee_10', name: '10mm Push-fit Tee', category: 'fitting', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'PFT10' },
  { id: 'pf_tee_15', name: '15mm Push-fit Tee', category: 'fitting', unit: 'nr', tradeCost: 4.95, retailCost: 7.50, partCode: 'PFT15' },
  { id: 'pf_tee_22', name: '22mm Push-fit Tee', category: 'fitting', unit: 'nr', tradeCost: 8.25, retailCost: 12.00, partCode: 'PFT22' },
  { id: 'pf_tee_28', name: '28mm Push-fit Tee', category: 'fitting', unit: 'nr', tradeCost: 16.50, retailCost: 24.00, partCode: 'PFT28' },
  { id: 'pf_straight_15', name: '15mm Push-fit Straight Coupler', category: 'fitting', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'PFS15' },
  { id: 'pf_straight_22', name: '22mm Push-fit Straight Coupler', category: 'fitting', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'PFS22' },
  { id: 'pf_reducer_22x15', name: '22mm x 15mm Push-fit Reducer', category: 'fitting', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'PFR22-15' },
  { id: 'pf_reducer_28x22', name: '28mm x 22mm Push-fit Reducer', category: 'fitting', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'PFR28-22' },
  { id: 'pf_valve_15', name: '15mm Push-fit Service Valve', category: 'valve', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'PFV15' },
  { id: 'pf_valve_22', name: '22mm Push-fit Service Valve', category: 'valve', unit: 'nr', tradeCost: 9.50, retailCost: 14.00, partCode: 'PFV22' },
  
  // Valves - Comprehensive
  { id: 'iso_valve_8', name: '8mm Isolation Valve (chrome)', category: 'valve', unit: 'nr', tradeCost: 3.85, retailCost: 5.80, partCode: 'IV8' },
  { id: 'iso_valve_10', name: '10mm Isolation Valve (chrome)', category: 'valve', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'IV10' },
  { id: 'iso_valve_15', name: '15mm Isolation Valve (chrome)', category: 'valve', unit: 'nr', tradeCost: 4.85, retailCost: 7.50, partCode: 'IV15' },
  { id: 'iso_valve_22', name: '22mm Isolation Valve (chrome)', category: 'valve', unit: 'nr', tradeCost: 6.95, retailCost: 10.50, partCode: 'IV22' },
  { id: 'iso_valve_28', name: '28mm Isolation Valve', category: 'valve', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'IV28' },
  { id: 'gate_valve_15', name: '15mm Gate Valve (brass)', category: 'valve', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'GV15' },
  { id: 'gate_valve_22', name: '22mm Gate Valve (brass)', category: 'valve', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'GV22' },
  { id: 'gate_valve_28', name: '28mm Gate Valve (brass)', category: 'valve', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'GV28' },
  { id: 'ball_valve_15', name: '15mm Full Bore Ball Valve', category: 'valve', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'BV15' },
  { id: 'ball_valve_22', name: '22mm Full Bore Ball Valve', category: 'valve', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'BV22' },
  { id: 'ball_valve_28', name: '28mm Full Bore Ball Valve', category: 'valve', unit: 'nr', tradeCost: 28.00, retailCost: 38.00, partCode: 'BV28' },
  { id: 'stopcock_15', name: '15mm Brass Stopcock', category: 'valve', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'SC15' },
  { id: 'stopcock_22', name: '22mm Brass Stopcock', category: 'valve', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'SC22' },
  { id: 'check_valve_15', name: '15mm Single Check Valve', category: 'valve', unit: 'nr', tradeCost: 8.95, retailCost: 13.50, partCode: 'CV15' },
  { id: 'check_valve_22', name: '22mm Single Check Valve', category: 'valve', unit: 'nr', tradeCost: 14.50, retailCost: 21.00, partCode: 'CV22' },
  { id: 'dbl_check_15', name: '15mm Double Check Valve', category: 'valve', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'DCV15' },
  { id: 'dbl_check_22', name: '22mm Double Check Valve', category: 'valve', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'DCV22' },
  { id: 'prv_15', name: '15mm Pressure Reducing Valve', category: 'valve', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'PRV15' },
  { id: 'prv_22', name: '22mm Pressure Reducing Valve', category: 'valve', unit: 'nr', tradeCost: 65.00, retailCost: 92.00, partCode: 'PRV22' },
  { id: 'expansion_vessel_8', name: '8L Expansion Vessel', category: 'valve', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'EV8' },
  { id: 'expansion_vessel_12', name: '12L Expansion Vessel', category: 'valve', unit: 'nr', tradeCost: 55.00, retailCost: 78.00, partCode: 'EV12' },
  { id: 'expansion_vessel_18', name: '18L Expansion Vessel', category: 'valve', unit: 'nr', tradeCost: 75.00, retailCost: 105.00, partCode: 'EV18' },
  { id: 'expansion_vessel_24', name: '24L Expansion Vessel', category: 'valve', unit: 'nr', tradeCost: 95.00, retailCost: 135.00, partCode: 'EV24' },
  
  // Radiator Valves
  { id: 'trv_10', name: '10mm TRV (Thermostatic)', category: 'valve', unit: 'nr', tradeCost: 16.50, retailCost: 24.00, partCode: 'TRV10' },
  { id: 'trv_15', name: '15mm TRV (Thermostatic)', category: 'valve', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'TRV15' },
  { id: 'trv_angled', name: '15mm Angled TRV', category: 'valve', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'TRVA15' },
  { id: 'trv_straight', name: '15mm Straight TRV', category: 'valve', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'TRVS15' },
  { id: 'lockshield_10', name: '10mm Lockshield Valve', category: 'valve', unit: 'nr', tradeCost: 5.50, retailCost: 8.00, partCode: 'LS10' },
  { id: 'lockshield_15', name: '15mm Lockshield Valve', category: 'valve', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'LS15' },
  { id: 'lockshield_angled', name: '15mm Angled Lockshield', category: 'valve', unit: 'nr', tradeCost: 8.50, retailCost: 12.00, partCode: 'LSA15' },
  { id: 'drain_valve_15', name: '15mm Drain Valve', category: 'valve', unit: 'nr', tradeCost: 4.25, retailCost: 6.50, partCode: 'DV15' },
  { id: 'aav_32', name: '32mm Air Admittance Valve', category: 'valve', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'AAV32' },
  { id: 'aav_110', name: '110mm Air Admittance Valve', category: 'valve', unit: 'nr', tradeCost: 25.00, retailCost: 36.00, partCode: 'AAV110' },
  { id: 'auto_air_vent', name: 'Automatic Air Vent 1/2"', category: 'valve', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'AAV-H' },
  { id: 'zone_valve_22', name: '22mm 2-Port Motorised Valve', category: 'valve', unit: 'nr', tradeCost: 48.00, retailCost: 72.00, partCode: 'ZV22' },
  { id: 'zone_valve_28', name: '28mm 2-Port Motorised Valve', category: 'valve', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'ZV28' },
  { id: 'mid_pos_valve', name: '22mm Mid-Position Valve', category: 'valve', unit: 'nr', tradeCost: 55.00, retailCost: 78.00, partCode: 'MPV22' },
  
  // Seals, O-Rings & Washers
  { id: 'fibre_washer_8', name: '8mm Fibre Washer (pack 10)', category: 'seal', unit: 'pack', tradeCost: 1.45, retailCost: 2.20, partCode: 'FW8' },
  { id: 'fibre_washer_10', name: '10mm Fibre Washer (pack 10)', category: 'seal', unit: 'pack', tradeCost: 1.55, retailCost: 2.40, partCode: 'FW10' },
  { id: 'fibre_washer_15', name: '15mm Fibre Washer (pack 10)', category: 'seal', unit: 'pack', tradeCost: 1.85, retailCost: 2.80, partCode: 'FW15' },
  { id: 'fibre_wasber_22', name: '22mm Fibre Washer (pack 10)', category: 'seal', unit: 'pack', tradeCost: 2.45, retailCost: 3.60, partCode: 'FW22' },
  { id: 'fibre_washer_28', name: '28mm Fibre Washer (pack 10)', category: 'seal', unit: 'pack', tradeCost: 3.25, retailCost: 4.80, partCode: 'FW28' },
  { id: 'rubber_washer_15', name: '15mm Rubber Washer (pack 10)', category: 'seal', unit: 'pack', tradeCost: 1.45, retailCost: 2.20, partCode: 'RW15' },
  { id: 'rubber_washer_22', name: '22mm Rubber Washer (pack 10)', category: 'seal', unit: 'pack', tradeCost: 1.95, retailCost: 2.90, partCode: 'RW22' },
  { id: 'oring_assorted', name: 'O-Ring Assortment Box (225pc)', category: 'seal', unit: 'box', tradeCost: 12.50, retailCost: 18.00, partCode: 'OR-BOX' },
  { id: 'oring_15', name: '15mm O-Ring (pack 10)', category: 'seal', unit: 'pack', tradeCost: 2.25, retailCost: 3.40, partCode: 'OR15' },
  { id: 'oring_22', name: '22mm O-Ring (pack 10)', category: 'seal', unit: 'pack', tradeCost: 2.85, retailCost: 4.20, partCode: 'OR22' },
  { id: 'comp_olive_15', name: '15mm Brass Olive (pack 10)', category: 'seal', unit: 'pack', tradeCost: 2.95, retailCost: 4.40, partCode: 'CO15' },
  { id: 'comp_olive_22', name: '22mm Brass Olive (pack 10)', category: 'seal', unit: 'pack', tradeCost: 4.25, retailCost: 6.20, partCode: 'CO22' },
  { id: 'comp_olive_28', name: '28mm Brass Olive (pack 10)', category: 'seal', unit: 'pack', tradeCost: 5.85, retailCost: 8.50, partCode: 'CO28' },
  { id: 'tap_washer_set', name: 'Tap Washer Assortment (50pc)', category: 'seal', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'TWS50' },
  { id: 'boss_seal', name: 'Boss White Seal (400g)', category: 'seal', unit: 'tub', tradeCost: 6.50, retailCost: 9.50, partCode: 'BW400' },
  { id: 'loctite_55', name: 'Loctite 55 Thread Seal (50m)', category: 'seal', unit: 'roll', tradeCost: 12.50, retailCost: 18.00, partCode: 'L55' },
  { id: 'flex_gasket_40', name: '40mm Flexible Waste Connector Seal', category: 'seal', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'FG40' },
  { id: 'flex_gasket_110', name: '110mm Soil Pipe Connector Seal', category: 'seal', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'FG110' },
  
  // Pipe Clips & Fixings
  { id: 'pipe_clip_15_plas', name: '15mm Plastic Pipe Clip (pack 50)', category: 'fixing', unit: 'pack', tradeCost: 4.25, retailCost: 6.50, partCode: 'PC15P' },
  { id: 'pipe_clip_22_plas', name: '22mm Plastic Pipe Clip (pack 50)', category: 'fixing', unit: 'pack', tradeCost: 5.50, retailCost: 8.00, partCode: 'PC22P' },
  { id: 'pipe_clip_28_plas', name: '28mm Plastic Pipe Clip (pack 25)', category: 'fixing', unit: 'pack', tradeCost: 4.25, retailCost: 6.20, partCode: 'PC28P' },
  { id: 'pipe_clip_15_chr', name: '15mm Chrome Pipe Clip (pack 10)', category: 'fixing', unit: 'pack', tradeCost: 6.85, retailCost: 10.00, partCode: 'PC15C' },
  { id: 'pipe_clip_22_chr', name: '22mm Chrome Pipe Clip (pack 10)', category: 'fixing', unit: 'pack', tradeCost: 8.95, retailCost: 13.00, partCode: 'PC22C' },
  { id: 'munsen_ring_15', name: '15mm Munsen Ring (pack 10)', category: 'fixing', unit: 'pack', tradeCost: 5.85, retailCost: 8.50, partCode: 'MR15' },
  { id: 'munsen_ring_22', name: '22mm Munsen Ring (pack 10)', category: 'fixing', unit: 'pack', tradeCost: 7.25, retailCost: 10.50, partCode: 'MR22' },
  { id: 'munsen_ring_28', name: '28mm Munsen Ring (pack 10)', category: 'fixing', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'MR28' },
  { id: 'rad_brackets_600', name: 'Radiator Brackets 600mm (pair)', category: 'fixing', unit: 'pair', tradeCost: 6.50, retailCost: 9.50, partCode: 'RB600' },
  { id: 'rad_brackets_1000', name: 'Radiator Brackets 1000mm (pair)', category: 'fixing', unit: 'pair', tradeCost: 8.50, retailCost: 12.50, partCode: 'RB1000' },
  { id: 'rad_brackets_1400', name: 'Radiator Brackets 1400mm (pair)', category: 'fixing', unit: 'pair', tradeCost: 10.50, retailCost: 15.00, partCode: 'RB1400' },
  { id: 'basin_brackets', name: 'Basin Fixing Brackets (pair)', category: 'fixing', unit: 'pair', tradeCost: 8.50, retailCost: 12.50, partCode: 'BFB' },
  { id: 'wc_fixing_kit', name: 'WC Floor Fixing Kit', category: 'fixing', unit: 'kit', tradeCost: 4.85, retailCost: 7.20, partCode: 'WCFK' },
  { id: 'bath_fixing_kit', name: 'Bath Waste/Overflow Fixing Kit', category: 'fixing', unit: 'kit', tradeCost: 6.50, retailCost: 9.50, partCode: 'BWFK' },
  { id: 'threaded_rod_m10', name: 'M10 Threaded Rod (1m)', category: 'fixing', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'TR10' },
  { id: 'threaded_rod_m12', name: 'M12 Threaded Rod (1m)', category: 'fixing', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'TR12' },
  
  // Consumables - Complete
  { id: 'ptfe_tape', name: 'PTFE Tape (12mm x 12m)', category: 'consumable', unit: 'roll', tradeCost: 0.85, retailCost: 1.50, partCode: 'PTFE' },
  { id: 'ptfe_tape_gas', name: 'Gas PTFE Tape Yellow (12m)', category: 'consumable', unit: 'roll', tradeCost: 1.45, retailCost: 2.20, partCode: 'PTFEG' },
  { id: 'ptfe_tape_hd', name: 'Heavy Duty PTFE Tape (12m)', category: 'consumable', unit: 'roll', tradeCost: 2.25, retailCost: 3.40, partCode: 'PTFE-HD' },
  { id: 'jointing_compound', name: 'Jointing Compound (400g)', category: 'consumable', unit: 'tub', tradeCost: 5.85, retailCost: 8.50, partCode: 'JC400' },
  { id: 'flux_paste', name: 'Soldering Flux Paste (100g)', category: 'consumable', unit: 'tub', tradeCost: 4.25, retailCost: 6.20, partCode: 'FP100' },
  { id: 'flux_paste_500', name: 'Soldering Flux Paste (500g)', category: 'consumable', unit: 'tub', tradeCost: 14.50, retailCost: 21.00, partCode: 'FP500' },
  { id: 'solder_lead_free', name: 'Lead-Free Solder (500g reel)', category: 'consumable', unit: 'reel', tradeCost: 28.50, retailCost: 42.00, partCode: 'SLF500' },
  { id: 'solder_sticks', name: 'Solder Ring Sticks (10 pack)', category: 'consumable', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'SRS10' },
  { id: 'silicone_white', name: 'Silicone Sealant White (300ml)', category: 'consumable', unit: 'tube', tradeCost: 4.25, retailCost: 6.50, partCode: 'SSW' },
  { id: 'silicone_clear', name: 'Silicone Sealant Clear (300ml)', category: 'consumable', unit: 'tube', tradeCost: 4.85, retailCost: 7.20, partCode: 'SSC' },
  { id: 'silicone_sanitary', name: 'Sanitary Silicone Anti-Mould (300ml)', category: 'consumable', unit: 'tube', tradeCost: 6.50, retailCost: 9.50, partCode: 'SSS' },
  { id: 'plumbers_mait', name: 'Plumbers Mait (750g)', category: 'consumable', unit: 'tub', tradeCost: 5.25, retailCost: 7.80, partCode: 'PM750' },
  { id: 'fire_cement', name: 'Fire Cement (500g)', category: 'consumable', unit: 'tub', tradeCost: 4.85, retailCost: 7.20, partCode: 'FC500' },
  { id: 'pipe_freeze_kit', name: 'Pipe Freezing Kit (Large)', category: 'consumable', unit: 'kit', tradeCost: 28.50, retailCost: 42.00, partCode: 'PFK' },
  { id: 'pipe_freeze_refill', name: 'Pipe Freeze Spray Refill (500ml)', category: 'consumable', unit: 'can', tradeCost: 18.50, retailCost: 26.00, partCode: 'PFR' },
  { id: 'system_cleaner', name: 'Heating System Cleaner X300 (1L)', category: 'consumable', unit: 'litre', tradeCost: 18.50, retailCost: 28.00, partCode: 'HSC1' },
  { id: 'system_inhibitor', name: 'System Inhibitor X100 (1L)', category: 'consumable', unit: 'litre', tradeCost: 18.50, retailCost: 28.00, partCode: 'SI1' },
  { id: 'system_descaler', name: 'System Descaler X400 (1L)', category: 'consumable', unit: 'litre', tradeCost: 22.50, retailCost: 32.00, partCode: 'SD1' },
  { id: 'leak_sealer', name: 'Central Heating Leak Sealer (500ml)', category: 'consumable', unit: 'bottle', tradeCost: 12.50, retailCost: 18.00, partCode: 'LS500' },
  { id: 'limescale_remover', name: 'Limescale Remover (1L)', category: 'consumable', unit: 'litre', tradeCost: 8.50, retailCost: 12.50, partCode: 'LR1' },
  { id: 'drain_cleaner', name: 'Professional Drain Cleaner (1L)', category: 'consumable', unit: 'litre', tradeCost: 12.50, retailCost: 18.00, partCode: 'DC1' },
  { id: 'pipe_lagging_15', name: '15mm Pipe Insulation (2m length)', category: 'insulation', unit: 'length', tradeCost: 1.25, retailCost: 1.90, partCode: 'PL15' },
  { id: 'pipe_lagging_22', name: '22mm Pipe Insulation (2m length)', category: 'insulation', unit: 'length', tradeCost: 1.45, retailCost: 2.20, partCode: 'PL22' },
  { id: 'pipe_lagging_28', name: '28mm Pipe Insulation (2m length)', category: 'insulation', unit: 'length', tradeCost: 1.85, retailCost: 2.80, partCode: 'PL28' },
  { id: 'cylinder_jacket', name: 'Hot Water Cylinder Jacket 80mm', category: 'insulation', unit: 'nr', tradeCost: 18.50, retailCost: 28.00, partCode: 'CJ80' },
];

// ============================================
// ELECTRICAL COMPONENTS - Complete Library
// ============================================
export const ELECTRICAL_COMPONENTS: DetailedComponent[] = [
  // Cables - All Types & Sizes
  { id: 'cable_1mm_te', name: '1.0mm² T&E Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 42.00, retailCost: 62.00, partCode: 'TE1-100' },
  { id: 'cable_1.5mm_te', name: '1.5mm² T&E Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 58.00, retailCost: 85.00, partCode: 'TE15-100' },
  { id: 'cable_2.5mm_te', name: '2.5mm² T&E Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 95.00, retailCost: 140.00, partCode: 'TE25-100' },
  { id: 'cable_4mm_te', name: '4.0mm² T&E Cable (50m)', category: 'electrical', unit: 'roll', tradeCost: 85.00, retailCost: 125.00, partCode: 'TE4-50' },
  { id: 'cable_6mm_te', name: '6.0mm² T&E Cable (50m)', category: 'electrical', unit: 'roll', tradeCost: 125.00, retailCost: 185.00, partCode: 'TE6-50' },
  { id: 'cable_10mm_te', name: '10.0mm² T&E Cable (25m)', category: 'electrical', unit: 'roll', tradeCost: 95.00, retailCost: 140.00, partCode: 'TE10-25' },
  { id: 'cable_16mm_te', name: '16.0mm² T&E Cable (25m)', category: 'electrical', unit: 'roll', tradeCost: 145.00, retailCost: 210.00, partCode: 'TE16-25' },
  { id: 'swa_cable_2.5mm', name: '2.5mm² 3-Core SWA Cable (per m)', category: 'electrical', unit: 'm', tradeCost: 3.85, retailCost: 5.60, partCode: 'SWA25' },
  { id: 'swa_cable_4mm', name: '4mm² 3-Core SWA Cable (per m)', category: 'electrical', unit: 'm', tradeCost: 4.85, retailCost: 7.20, partCode: 'SWA4' },
  { id: 'swa_cable_6mm', name: '6mm² 3-Core SWA Cable (per m)', category: 'electrical', unit: 'm', tradeCost: 6.50, retailCost: 9.50, partCode: 'SWA6' },
  { id: 'swa_cable_10mm', name: '10mm² 3-Core SWA Cable (per m)', category: 'electrical', unit: 'm', tradeCost: 9.50, retailCost: 14.00, partCode: 'SWA10' },
  { id: 'flex_0.75mm', name: '0.75mm² 3-Core Flex (per m)', category: 'electrical', unit: 'm', tradeCost: 0.65, retailCost: 0.95, partCode: 'FX075' },
  { id: 'flex_1mm', name: '1.0mm² 3-Core Flex (per m)', category: 'electrical', unit: 'm', tradeCost: 0.85, retailCost: 1.30, partCode: 'FX1' },
  { id: 'flex_1.5mm', name: '1.5mm² 3-Core Flex (per m)', category: 'electrical', unit: 'm', tradeCost: 1.25, retailCost: 1.90, partCode: 'FX15' },
  { id: 'meter_tails_16', name: '16mm² Meter Tails (pair 1m)', category: 'electrical', unit: 'pair', tradeCost: 12.50, retailCost: 18.00, partCode: 'MT16' },
  { id: 'meter_tails_25', name: '25mm² Meter Tails (pair 1m)', category: 'electrical', unit: 'pair', tradeCost: 18.50, retailCost: 26.00, partCode: 'MT25' },
  { id: 'earth_cable_6', name: '6mm² Earth Cable Green/Yellow (per m)', category: 'electrical', unit: 'm', tradeCost: 1.85, retailCost: 2.80, partCode: 'EC6' },
  { id: 'earth_cable_10', name: '10mm² Earth Cable Green/Yellow (per m)', category: 'electrical', unit: 'm', tradeCost: 2.85, retailCost: 4.20, partCode: 'EC10' },
  { id: 'earth_cable_16', name: '16mm² Earth Cable Green/Yellow (per m)', category: 'electrical', unit: 'm', tradeCost: 4.25, retailCost: 6.20, partCode: 'EC16' },
  { id: 'fire_cable_1.5', name: '1.5mm² Fire Rated Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 185.00, retailCost: 265.00, partCode: 'FC15-100' },
  { id: 'fire_cable_2.5', name: '2.5mm² Fire Rated Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 245.00, retailCost: 350.00, partCode: 'FC25-100' },
  { id: 'data_cat5e', name: 'CAT5e UTP Cable (305m box)', category: 'electrical', unit: 'box', tradeCost: 65.00, retailCost: 95.00, partCode: 'CAT5E' },
  { id: 'data_cat6', name: 'CAT6 UTP Cable (305m box)', category: 'electrical', unit: 'box', tradeCost: 95.00, retailCost: 140.00, partCode: 'CAT6' },
  { id: 'coax_cable', name: 'Coaxial TV Cable (100m)', category: 'electrical', unit: 'roll', tradeCost: 45.00, retailCost: 65.00, partCode: 'COAX100' },
  
  // Consumer Units & Distribution
  { id: 'cu_6way', name: '6-Way Consumer Unit (metal)', category: 'electrical', unit: 'nr', tradeCost: 95.00, retailCost: 140.00, partCode: 'CU6' },
  { id: 'cu_10way', name: '10-Way Consumer Unit (metal)', category: 'electrical', unit: 'nr', tradeCost: 145.00, retailCost: 210.00, partCode: 'CU10' },
  { id: 'cu_12way', name: '12-Way Consumer Unit (metal)', category: 'electrical', unit: 'nr', tradeCost: 175.00, retailCost: 255.00, partCode: 'CU12' },
  { id: 'cu_16way', name: '16-Way Consumer Unit (metal)', category: 'electrical', unit: 'nr', tradeCost: 225.00, retailCost: 325.00, partCode: 'CU16' },
  { id: 'cu_18way', name: '18-Way Consumer Unit (metal)', category: 'electrical', unit: 'nr', tradeCost: 265.00, retailCost: 385.00, partCode: 'CU18' },
  { id: 'cu_dual_rcd', name: 'Dual RCD Consumer Unit 12-Way', category: 'electrical', unit: 'nr', tradeCost: 195.00, retailCost: 285.00, partCode: 'CU12DR' },
  { id: 'garage_unit', name: '4-Way Garage Unit with RCD', category: 'electrical', unit: 'nr', tradeCost: 85.00, retailCost: 125.00, partCode: 'GU4' },
  { id: 'rcbo_6a_b', name: 'RCBO 6A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO6B' },
  { id: 'rcbo_10a_b', name: 'RCBO 10A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO10B' },
  { id: 'rcbo_16a_b', name: 'RCBO 16A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO16B' },
  { id: 'rcbo_20a_b', name: 'RCBO 20A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO20B' },
  { id: 'rcbo_32a_b', name: 'RCBO 32A Type B', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'RCBO32B' },
  { id: 'rcbo_40a_b', name: 'RCBO 40A Type B', category: 'electrical', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'RCBO40B' },
  { id: 'rcbo_50a_b', name: 'RCBO 50A Type B', category: 'electrical', unit: 'nr', tradeCost: 32.00, retailCost: 48.00, partCode: 'RCBO50B' },
  { id: 'mcb_6a_b', name: 'MCB 6A Type B', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'MCB6B' },
  { id: 'mcb_10a_b', name: 'MCB 10A Type B', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'MCB10B' },
  { id: 'mcb_16a_b', name: 'MCB 16A Type B', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'MCB16B' },
  { id: 'mcb_20a_b', name: 'MCB 20A Type B', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'MCB20B' },
  { id: 'mcb_32a_b', name: 'MCB 32A Type B', category: 'electrical', unit: 'nr', tradeCost: 5.25, retailCost: 7.80, partCode: 'MCB32B' },
  { id: 'mcb_40a_b', name: 'MCB 40A Type B', category: 'electrical', unit: 'nr', tradeCost: 5.85, retailCost: 8.50, partCode: 'MCB40B' },
  { id: 'mcb_50a_b', name: 'MCB 50A Type B', category: 'electrical', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'MCB50B' },
  { id: 'mcb_63a_b', name: 'MCB 63A Type B', category: 'electrical', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'MCB63B' },
  { id: 'mcb_32a_c', name: 'MCB 32A Type C', category: 'electrical', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'MCB32C' },
  { id: 'mcb_40a_c', name: 'MCB 40A Type C', category: 'electrical', unit: 'nr', tradeCost: 7.50, retailCost: 11.00, partCode: 'MCB40C' },
  { id: 'rcd_40a', name: 'RCD 40A 30mA', category: 'electrical', unit: 'nr', tradeCost: 32.00, retailCost: 48.00, partCode: 'RCD40' },
  { id: 'rcd_63a', name: 'RCD 63A 30mA', category: 'electrical', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'RCD63' },
  { id: 'rcd_80a', name: 'RCD 80A 30mA', category: 'electrical', unit: 'nr', tradeCost: 42.00, retailCost: 62.00, partCode: 'RCD80' },
  { id: 'rcd_100a', name: 'RCD 100A 100mA (Main Switch)', category: 'electrical', unit: 'nr', tradeCost: 55.00, retailCost: 78.00, partCode: 'RCD100' },
  { id: 'spd_type1', name: 'Surge Protection Device Type 1+2', category: 'electrical', unit: 'nr', tradeCost: 125.00, retailCost: 180.00, partCode: 'SPD1' },
  { id: 'spd_type2', name: 'Surge Protection Device Type 2', category: 'electrical', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'SPD2' },
  { id: 'main_switch_100a', name: '100A Main Switch', category: 'electrical', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'MS100' },
  { id: 'isolator_100a', name: '100A Switch Disconnector', category: 'electrical', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'SD100' },
  
  // Wiring Accessories - Complete Range
  { id: 'socket_single', name: 'Single Socket Outlet (white)', category: 'electrical', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'SS' },
  { id: 'socket_double', name: 'Double Socket Outlet (white)', category: 'electrical', unit: 'nr', tradeCost: 3.85, retailCost: 5.80, partCode: 'DS' },
  { id: 'socket_double_sw', name: 'Double Switched Socket (white)', category: 'electrical', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'DSS' },
  { id: 'socket_usb_a', name: 'Double Socket with USB-A Ports', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.50, partCode: 'DSU-A' },
  { id: 'socket_usb_c', name: 'Double Socket with USB-C PD', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'DSU-C' },
  { id: 'socket_outdoor', name: 'Outdoor Socket IP66', category: 'electrical', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'OS-IP66' },
  { id: 'socket_floor', name: 'Floor Socket (brass)', category: 'electrical', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'FS-BR' },
  { id: 'socket_shaver', name: 'Shaver Socket (dual voltage)', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'SHV' },
  { id: 'switch_1g', name: '1-Gang 2-Way Switch', category: 'electrical', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'S1G' },
  { id: 'switch_2g', name: '2-Gang 2-Way Switch', category: 'electrical', unit: 'nr', tradeCost: 3.25, retailCost: 4.80, partCode: 'S2G' },
  { id: 'switch_3g', name: '3-Gang 2-Way Switch', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'S3G' },
  { id: 'switch_4g', name: '4-Gang 2-Way Switch', category: 'electrical', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'S4G' },
  { id: 'switch_inter', name: 'Intermediate Switch', category: 'electrical', unit: 'nr', tradeCost: 5.50, retailCost: 8.00, partCode: 'SI' },
  { id: 'dimmer_1g', name: '1-Gang LED Dimmer Switch', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 28.00, partCode: 'D1G' },
  { id: 'dimmer_2g', name: '2-Gang LED Dimmer Switch', category: 'electrical', unit: 'nr', tradeCost: 32.00, retailCost: 48.00, partCode: 'D2G' },
  { id: 'dimmer_trailing', name: 'Trailing Edge LED Dimmer', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 38.00, partCode: 'DTE' },
  { id: 'fused_spur', name: 'Fused Connection Unit 13A', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'FCU' },
  { id: 'fused_spur_sw', name: 'Switched FCU 13A', category: 'electrical', unit: 'nr', tradeCost: 5.85, retailCost: 8.50, partCode: 'SFCU' },
  { id: 'fused_spur_neon', name: 'FCU 13A Switched + Neon', category: 'electrical', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'SFCU-N' },
  { id: 'fused_spur_flex', name: 'FCU 13A with Flex Outlet', category: 'electrical', unit: 'nr', tradeCost: 7.50, retailCost: 11.00, partCode: 'FCU-F' },
  { id: 'cooker_switch', name: '45A Cooker Switch with Socket', category: 'electrical', unit: 'nr', tradeCost: 14.50, retailCost: 22.00, partCode: 'CS45' },
  { id: 'cooker_switch_only', name: '45A Cooker Switch (no socket)', category: 'electrical', unit: 'nr', tradeCost: 10.50, retailCost: 15.00, partCode: 'CS45O' },
  { id: 'shower_switch', name: '45A Double Pole Shower Switch', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.50, partCode: 'SS45' },
  { id: 'pull_cord_45a', name: '45A Pull Cord Switch', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'PC45' },
  { id: 'pull_cord_6a', name: '6A Pull Cord Switch (light)', category: 'electrical', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'PC6' },
  { id: 'fan_isolator', name: 'Fan Isolator Switch 10A', category: 'electrical', unit: 'nr', tradeCost: 5.85, retailCost: 8.50, partCode: 'FI10' },
  { id: 'bell_push', name: 'Bell Push (white)', category: 'electrical', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'BP' },
  { id: 'blank_plate_1g', name: '1-Gang Blank Plate', category: 'electrical', unit: 'nr', tradeCost: 1.25, retailCost: 1.90, partCode: 'BL1G' },
  { id: 'blank_plate_2g', name: '2-Gang Blank Plate', category: 'electrical', unit: 'nr', tradeCost: 1.65, retailCost: 2.40, partCode: 'BL2G' },
  { id: 'flex_outlet', name: '20A Flex Outlet Plate', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'FO20' },
  { id: 'tv_outlet', name: 'TV Coaxial Outlet', category: 'electrical', unit: 'nr', tradeCost: 4.50, retailCost: 6.50, partCode: 'TVO' },
  { id: 'sat_outlet', name: 'Satellite F-Type Outlet', category: 'electrical', unit: 'nr', tradeCost: 4.50, retailCost: 6.50, partCode: 'SAT' },
  { id: 'data_outlet', name: 'CAT6 Data Outlet', category: 'electrical', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'DATA' },
  { id: 'bt_outlet', name: 'BT Telephone Outlet', category: 'electrical', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'BT' },
  
  // Back Boxes & Enclosures
  { id: 'back_box_16', name: '16mm Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 0.75, retailCost: 1.10, partCode: 'BB16' },
  { id: 'back_box_25', name: '25mm Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 0.85, retailCost: 1.30, partCode: 'BB25' },
  { id: 'back_box_35', name: '35mm Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 0.95, retailCost: 1.45, partCode: 'BB35' },
  { id: 'back_box_47', name: '47mm Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 1.15, retailCost: 1.70, partCode: 'BB47' },
  { id: 'dry_lining_25', name: '25mm Dry Lining Box', category: 'electrical', unit: 'nr', tradeCost: 0.55, retailCost: 0.85, partCode: 'DLB25' },
  { id: 'dry_lining_35', name: '35mm Dry Lining Box', category: 'electrical', unit: 'nr', tradeCost: 0.65, retailCost: 0.95, partCode: 'DLB35' },
  { id: 'dry_lining_47', name: '47mm Dry Lining Box', category: 'electrical', unit: 'nr', tradeCost: 0.75, retailCost: 1.10, partCode: 'DLB47' },
  { id: 'double_box_25', name: '25mm Double Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 1.45, retailCost: 2.20, partCode: 'DBB25' },
  { id: 'double_box_35', name: '35mm Double Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 1.65, retailCost: 2.40, partCode: 'DBB35' },
  { id: 'double_box_47', name: '47mm Double Metal Back Box', category: 'electrical', unit: 'nr', tradeCost: 1.95, retailCost: 2.90, partCode: 'DBB47' },
  { id: 'junction_box_20a', name: '20A Junction Box (4 terminal)', category: 'electrical', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'JB20' },
  { id: 'junction_box_30a', name: '30A Junction Box (3 terminal)', category: 'electrical', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'JB30' },
  { id: 'junction_box_60a', name: '60A Junction Box', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'JB60' },
  { id: 'maint_free_jb', name: 'Maintenance Free Junction Box', category: 'electrical', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'MFJB' },
  { id: 'ceiling_rose', name: 'Ceiling Rose (white)', category: 'electrical', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'CR' },
  { id: 'batten_holder', name: 'Batten Lampholder BC', category: 'electrical', unit: 'nr', tradeCost: 1.85, retailCost: 2.80, partCode: 'BH' },
  { id: 'batten_holder_es', name: 'Batten Lampholder ES', category: 'electrical', unit: 'nr', tradeCost: 1.95, retailCost: 2.90, partCode: 'BH-ES' },
  
  // Cable Management
  { id: 'conduit_20mm', name: '20mm Oval Conduit (3m)', category: 'electrical', unit: 'length', tradeCost: 1.85, retailCost: 2.80, partCode: 'OC20' },
  { id: 'conduit_25mm', name: '25mm Round Conduit (3m)', category: 'electrical', unit: 'length', tradeCost: 3.25, retailCost: 4.80, partCode: 'RC25' },
  { id: 'conduit_boxes', name: '20mm Conduit Box (back outlet)', category: 'electrical', unit: 'nr', tradeCost: 0.85, retailCost: 1.30, partCode: 'CB20' },
  { id: 'trunking_16x16', name: 'Mini Trunking 16x16 (3m)', category: 'electrical', unit: 'length', tradeCost: 1.65, retailCost: 2.40, partCode: 'MT16' },
  { id: 'trunking_25x16', name: 'Mini Trunking 25x16 (3m)', category: 'electrical', unit: 'length', tradeCost: 2.45, retailCost: 3.60, partCode: 'MT25' },
  { id: 'trunking_40x25', name: 'Mini Trunking 40x25 (3m)', category: 'electrical', unit: 'length', tradeCost: 4.25, retailCost: 6.20, partCode: 'MT40' },
  { id: 'trunking_50x50', name: 'Maxi Trunking 50x50 (3m)', category: 'electrical', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'MX50' },
  { id: 'dado_trunking', name: 'Dado Trunking 175x57 (3m)', category: 'electrical', unit: 'length', tradeCost: 22.50, retailCost: 32.00, partCode: 'DT175' },
  { id: 'cable_clips_round', name: 'Round Cable Clips (pack 100)', category: 'electrical', unit: 'pack', tradeCost: 2.85, retailCost: 4.20, partCode: 'CCR' },
  { id: 'cable_clips_flat', name: 'T&E Cable Clips (pack 100)', category: 'electrical', unit: 'pack', tradeCost: 3.85, retailCost: 5.80, partCode: 'CC100' },
  { id: 'grommet_20mm', name: '20mm Grommet (pack 100)', category: 'electrical', unit: 'pack', tradeCost: 4.25, retailCost: 6.20, partCode: 'GR20' },
  { id: 'grommet_25mm', name: '25mm Grommet (pack 50)', category: 'electrical', unit: 'pack', tradeCost: 4.85, retailCost: 7.20, partCode: 'GR25' },
  { id: 'cable_ties_100', name: 'Cable Ties 100mm (pack 100)', category: 'electrical', unit: 'pack', tradeCost: 1.85, retailCost: 2.80, partCode: 'CT100' },
  { id: 'cable_ties_200', name: 'Cable Ties 200mm (pack 100)', category: 'electrical', unit: 'pack', tradeCost: 2.45, retailCost: 3.60, partCode: 'CT200' },
  { id: 'cable_ties_300', name: 'Cable Ties 300mm (pack 100)', category: 'electrical', unit: 'pack', tradeCost: 3.85, retailCost: 5.60, partCode: 'CT300' },
  
  // Connectors & Terminals
  { id: 'wago_221_2', name: 'Wago 221 2-Way Connector (pack 50)', category: 'electrical', unit: 'pack', tradeCost: 18.50, retailCost: 28.00, partCode: 'W221-2' },
  { id: 'wago_221_3', name: 'Wago 221 3-Way Connector (pack 50)', category: 'electrical', unit: 'pack', tradeCost: 22.50, retailCost: 34.00, partCode: 'W221-3' },
  { id: 'wago_221_5', name: 'Wago 221 5-Way Connector (pack 25)', category: 'electrical', unit: 'pack', tradeCost: 18.50, retailCost: 28.00, partCode: 'W221-5' },
  { id: 'wago_222_2', name: 'Wago 222 2-Way (pack 50)', category: 'electrical', unit: 'pack', tradeCost: 12.50, retailCost: 18.00, partCode: 'W222-2' },
  { id: 'wago_222_3', name: 'Wago 222 3-Way (pack 50)', category: 'electrical', unit: 'pack', tradeCost: 15.50, retailCost: 22.00, partCode: 'W222-3' },
  { id: 'strip_connector', name: 'Strip Connector 15A (12 way)', category: 'electrical', unit: 'strip', tradeCost: 0.85, retailCost: 1.30, partCode: 'SC15' },
  { id: 'strip_connector_30', name: 'Strip Connector 30A (12 way)', category: 'electrical', unit: 'strip', tradeCost: 1.45, retailCost: 2.20, partCode: 'SC30' },
  { id: 'crimp_terminals', name: 'Insulated Crimp Terminals (assorted 200pc)', category: 'electrical', unit: 'box', tradeCost: 12.50, retailCost: 18.00, partCode: 'ICT200' },
  { id: 'bootlace_ferrules', name: 'Bootlace Ferrules Assorted (pack 100)', category: 'electrical', unit: 'pack', tradeCost: 6.50, retailCost: 9.50, partCode: 'BF100' },
  { id: 'earth_clamp', name: 'Main Earth Clamp', category: 'electrical', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'MEC' },
  { id: 'earth_rod', name: 'Earth Rod 1.2m with Clamp', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'ER12' },
  { id: 'earth_block', name: 'Earth Terminal Block', category: 'electrical', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'ETB' },
  { id: 'neutral_bar', name: 'Neutral Bar', category: 'electrical', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'NB' },
  
  // Lighting - LED Downlights & Fittings
  { id: 'downlight_fire', name: 'Fire Rated LED Downlight (warm)', category: 'electrical', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'DL-FR' },
  { id: 'downlight_fire_dim', name: 'Dimmable Fire Rated Downlight', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'DL-FRD' },
  { id: 'downlight_ip65', name: 'IP65 Bathroom Downlight', category: 'electrical', unit: 'nr', tradeCost: 14.50, retailCost: 21.00, partCode: 'DL-IP65' },
  { id: 'downlight_std', name: 'Standard LED Downlight 6W', category: 'electrical', unit: 'nr', tradeCost: 5.50, retailCost: 8.00, partCode: 'DL-STD' },
  { id: 'led_panel_600', name: 'LED Panel 600x600 40W', category: 'electrical', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'LP600' },
  { id: 'led_batten_4ft', name: 'LED Batten 4ft 40W', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'LB4' },
  { id: 'led_batten_5ft', name: 'LED Batten 5ft 50W', category: 'electrical', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'LB5' },
  { id: 'led_floodlight_10', name: 'LED Floodlight 10W IP65', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'LF10' },
  { id: 'led_floodlight_30', name: 'LED Floodlight 30W IP65', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'LF30' },
  { id: 'led_floodlight_50', name: 'LED Floodlight 50W IP65', category: 'electrical', unit: 'nr', tradeCost: 25.00, retailCost: 36.00, partCode: 'LF50' },
  { id: 'led_floodlight_100', name: 'LED Floodlight 100W IP65', category: 'electrical', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'LF100' },
  { id: 'led_strip_5m', name: 'LED Strip 5m (warm white)', category: 'electrical', unit: 'roll', tradeCost: 18.50, retailCost: 26.00, partCode: 'LS5' },
  { id: 'led_driver_30', name: 'LED Driver 30W', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'LD30' },
  { id: 'led_driver_60', name: 'LED Driver 60W', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'LD60' },
  { id: 'pir_sensor', name: 'PIR Sensor (ceiling mount)', category: 'electrical', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'PIR-C' },
  { id: 'pir_corner', name: 'PIR Sensor (corner mount)', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'PIR-CR' },
  { id: 'photocell', name: 'Photocell (dusk to dawn)', category: 'electrical', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'PC' },
  { id: 'emergency_light', name: 'Emergency Bulkhead 3W LED', category: 'electrical', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'EML' },
  { id: 'emergency_exit', name: 'Emergency Exit Sign LED', category: 'electrical', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'EX' },
  
  // Smoke & CO Alarms
  { id: 'smoke_mains', name: 'Mains Smoke Alarm (interlink)', category: 'electrical', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'SM-M' },
  { id: 'smoke_heat', name: 'Mains Heat Alarm (interlink)', category: 'electrical', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'SM-H' },
  { id: 'smoke_co', name: 'Mains CO Alarm (interlink)', category: 'electrical', unit: 'nr', tradeCost: 32.00, retailCost: 48.00, partCode: 'SM-CO' },
  { id: 'smoke_multi', name: 'Multi-Sensor Alarm (smoke/heat)', category: 'electrical', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'SM-MS' },
  { id: 'smoke_base', name: 'Alarm Mounting Base', category: 'electrical', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'SM-B' },
  
  // EV Charging
  { id: 'ev_charger_7kw', name: 'EV Charger 7kW Untethered', category: 'electrical', unit: 'nr', tradeCost: 485.00, retailCost: 695.00, partCode: 'EV7' },
  { id: 'ev_charger_22kw', name: 'EV Charger 22kW 3-Phase', category: 'electrical', unit: 'nr', tradeCost: 950.00, retailCost: 1350.00, partCode: 'EV22' },
  { id: 'ev_cable_type2', name: 'Type 2 EV Cable 5m', category: 'electrical', unit: 'nr', tradeCost: 125.00, retailCost: 185.00, partCode: 'EVC-T2' },
  
  // Consumables
  { id: 'insulation_tape', name: 'Insulation Tape (pack 10)', category: 'consumable', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'IT10' },
  { id: 'insulation_tape_col', name: 'Coloured Tape Set (L/N/E)', category: 'consumable', unit: 'set', tradeCost: 4.85, retailCost: 7.20, partCode: 'ITC' },
  { id: 'warning_tape', name: 'Warning Tape "Electric Cable"', category: 'consumable', unit: 'roll', tradeCost: 8.50, retailCost: 12.50, partCode: 'WT' },
  { id: 'heat_shrink', name: 'Heat Shrink Tubing (assorted)', category: 'consumable', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'HS' },
  { id: 'self_amal_tape', name: 'Self-Amalgamating Tape', category: 'consumable', unit: 'roll', tradeCost: 4.85, retailCost: 7.20, partCode: 'SAT' },
  { id: 'cable_labels', name: 'Cable Labels (500)', category: 'consumable', unit: 'roll', tradeCost: 12.50, retailCost: 18.00, partCode: 'CL500' },
  { id: 'circuit_labels', name: 'Circuit Labels Set', category: 'consumable', unit: 'set', tradeCost: 4.85, retailCost: 7.20, partCode: 'CLS' },
];

// ============================================
// CARPENTRY COMPONENTS - Complete Library
// ============================================
export const CARPENTRY_COMPONENTS: DetailedComponent[] = [
  // Timber - Sawn & Treated
  { id: 'timber_25x50', name: 'C16 Timber 25x50mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 3.85, retailCost: 5.60, partCode: 'T2550' },
  { id: 'timber_38x50', name: 'C16 Timber 38x50mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 4.85, retailCost: 7.20, partCode: 'T3850' },
  { id: 'timber_47x50', name: 'C16 Timber 47x50mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 5.50, retailCost: 8.00, partCode: 'T4750' },
  { id: 'timber_47x75', name: 'C16 Timber 47x75mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'T4775' },
  { id: 'timber_47x100', name: 'C16 Timber 47x100mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 10.50, retailCost: 15.00, partCode: 'T47100' },
  { id: 'timber_47x125', name: 'C16 Timber 47x125mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 12.50, retailCost: 18.00, partCode: 'T47125' },
  { id: 'timber_47x150', name: 'C16 Timber 47x150mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 14.50, retailCost: 21.00, partCode: 'T47150' },
  { id: 'timber_47x175', name: 'C16 Timber 47x175mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 18.50, retailCost: 26.00, partCode: 'T47175' },
  { id: 'timber_47x200', name: 'C16 Timber 47x200mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 22.50, retailCost: 32.00, partCode: 'T47200' },
  { id: 'timber_47x225', name: 'C16 Timber 47x225mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 26.00, retailCost: 38.00, partCode: 'T47225' },
  { id: 'timber_c24_47x100', name: 'C24 Timber 47x100mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 14.50, retailCost: 21.00, partCode: 'C24-100' },
  { id: 'timber_c24_47x150', name: 'C24 Timber 47x150mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 18.50, retailCost: 26.00, partCode: 'C24-150' },
  { id: 'timber_c24_47x200', name: 'C24 Timber 47x200mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 28.00, retailCost: 42.00, partCode: 'C24-200' },
  { id: 'treated_47x100', name: 'Treated Timber 47x100mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 14.50, retailCost: 21.00, partCode: 'TR47100' },
  { id: 'treated_47x150', name: 'Treated Timber 47x150mm (4.8m)', category: 'timber', unit: 'length', tradeCost: 18.50, retailCost: 26.00, partCode: 'TR47150' },
  { id: 'treated_75x75', name: 'Treated Timber 75x75mm (3m)', category: 'timber', unit: 'length', tradeCost: 18.50, retailCost: 26.00, partCode: 'TR7575' },
  { id: 'treated_100x100', name: 'Treated Timber 100x100mm (3m)', category: 'timber', unit: 'length', tradeCost: 28.00, retailCost: 42.00, partCode: 'TR100' },
  { id: 'battens_25x50', name: 'Roofing Battens 25x50mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 2.85, retailCost: 4.20, partCode: 'RB2550' },
  { id: 'counterbattens', name: 'Counter Battens 25x38mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 2.25, retailCost: 3.40, partCode: 'CB2538' },
  
  // Sheet Materials
  { id: 'plywood_9mm', name: '9mm Softwood Plywood (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 18.50, retailCost: 26.00, partCode: 'PLY9' },
  { id: 'plywood_12mm', name: '12mm Softwood Plywood (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 24.00, retailCost: 35.00, partCode: 'PLY12' },
  { id: 'plywood_18mm', name: '18mm Softwood Plywood (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 32.00, retailCost: 48.00, partCode: 'PLY18' },
  { id: 'plywood_wbp_18', name: '18mm WBP Plywood (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 42.00, retailCost: 62.00, partCode: 'WBP18' },
  { id: 'osb_11mm', name: '11mm OSB3 (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 14.50, retailCost: 21.00, partCode: 'OSB11' },
  { id: 'osb_18mm', name: '18mm OSB3 (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 22.50, retailCost: 32.00, partCode: 'OSB18' },
  { id: 'chipboard_18mm', name: '18mm Chipboard P5 (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 18.50, retailCost: 26.00, partCode: 'CB18' },
  { id: 'chipboard_22mm', name: '22mm T&G Chipboard (2400x600)', category: 'timber', unit: 'sheet', tradeCost: 12.50, retailCost: 18.00, partCode: 'CB22TG' },
  { id: 'mdf_6mm', name: '6mm MDF (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 12.50, retailCost: 18.00, partCode: 'MDF6' },
  { id: 'mdf_9mm', name: '9mm MDF (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 14.50, retailCost: 21.00, partCode: 'MDF9' },
  { id: 'mdf_12mm', name: '12mm MDF (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 18.50, retailCost: 26.00, partCode: 'MDF12' },
  { id: 'mdf_18mm', name: '18mm MDF (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 25.00, retailCost: 36.00, partCode: 'MDF18' },
  { id: 'mdf_moisture_18', name: '18mm Moisture Resistant MDF', category: 'timber', unit: 'sheet', tradeCost: 32.00, retailCost: 48.00, partCode: 'MRDF18' },
  { id: 'hardboard_3mm', name: '3.2mm Hardboard (2440x1220)', category: 'timber', unit: 'sheet', tradeCost: 6.50, retailCost: 9.50, partCode: 'HB3' },
  
  // Mouldings & Trims
  { id: 'skirting_torus_94', name: 'Torus Skirting 94mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 5.50, retailCost: 8.00, partCode: 'SK94T' },
  { id: 'skirting_torus_119', name: 'Torus Skirting 119mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 6.50, retailCost: 9.50, partCode: 'SK119T' },
  { id: 'skirting_torus_144', name: 'Torus Skirting 144mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'SK144T' },
  { id: 'skirting_ogee_94', name: 'Ogee Skirting 94mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 5.50, retailCost: 8.00, partCode: 'SK94O' },
  { id: 'skirting_ogee_119', name: 'Ogee Skirting 119mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 6.50, retailCost: 9.50, partCode: 'SK119O' },
  { id: 'skirting_square_94', name: 'Square Edge Skirting 94mm (4.2m)', category: 'timber', unit: 'length', tradeCost: 4.50, retailCost: 6.50, partCode: 'SK94S' },
  { id: 'skirting_mdf_120', name: 'MDF Skirting 120mm (4.4m)', category: 'timber', unit: 'length', tradeCost: 3.85, retailCost: 5.60, partCode: 'SKMD120' },
  { id: 'architrave_torus_57', name: 'Torus Architrave 57mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 3.25, retailCost: 4.80, partCode: 'AR57T' },
  { id: 'architrave_torus_69', name: 'Torus Architrave 69mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 3.85, retailCost: 5.60, partCode: 'AR69T' },
  { id: 'architrave_ogee_57', name: 'Ogee Architrave 57mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 3.25, retailCost: 4.80, partCode: 'AR57O' },
  { id: 'architrave_mdf_70', name: 'MDF Architrave 70mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 2.25, retailCost: 3.40, partCode: 'ARMD70' },
  { id: 'dado_rail', name: 'Dado Rail 57mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 4.85, retailCost: 7.20, partCode: 'DR57' },
  { id: 'picture_rail', name: 'Picture Rail 44mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 4.25, retailCost: 6.20, partCode: 'PR44' },
  { id: 'coving_100mm', name: 'Plaster Coving 100mm (2m)', category: 'timber', unit: 'length', tradeCost: 4.25, retailCost: 6.20, partCode: 'CV100' },
  { id: 'coving_127mm', name: 'Plaster Coving 127mm (2m)', category: 'timber', unit: 'length', tradeCost: 5.50, retailCost: 8.00, partCode: 'CV127' },
  { id: 'scotia_12mm', name: 'Scotia Moulding 12mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 1.45, retailCost: 2.20, partCode: 'SC12' },
  { id: 'quadrant_12mm', name: 'Quadrant Moulding 12mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 1.25, retailCost: 1.90, partCode: 'QD12' },
  { id: 'door_stop', name: 'Door Stop 12x34mm (2.4m)', category: 'timber', unit: 'length', tradeCost: 1.85, retailCost: 2.80, partCode: 'DS1234' },
  
  // Doors & Frames
  { id: 'door_oak_4panel', name: 'Oak 4 Panel Door 1981x762', category: 'timber', unit: 'nr', tradeCost: 95.00, retailCost: 145.00, partCode: 'DRO4P' },
  { id: 'door_oak_6panel', name: 'Oak 6 Panel Door 1981x762', category: 'timber', unit: 'nr', tradeCost: 115.00, retailCost: 165.00, partCode: 'DRO6P' },
  { id: 'door_flush', name: 'Flush Door 1981x762', category: 'timber', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'DRFL' },
  { id: 'door_fd30', name: 'FD30 Fire Door 1981x762', category: 'timber', unit: 'nr', tradeCost: 125.00, retailCost: 180.00, partCode: 'FD30' },
  { id: 'door_fd60', name: 'FD60 Fire Door 1981x762', category: 'timber', unit: 'nr', tradeCost: 185.00, retailCost: 265.00, partCode: 'FD60' },
  { id: 'door_glass_oak', name: 'Oak Glazed Door 1981x762', category: 'timber', unit: 'nr', tradeCost: 145.00, retailCost: 210.00, partCode: 'DROG' },
  { id: 'door_lining_set', name: 'Door Lining Set 32x115mm', category: 'timber', unit: 'set', tradeCost: 45.00, retailCost: 65.00, partCode: 'DLS' },
  { id: 'door_lining_fd30', name: 'FD30 Door Lining Set', category: 'timber', unit: 'set', tradeCost: 65.00, retailCost: 95.00, partCode: 'DLSF' },
  { id: 'door_casing', name: 'Door Casing Set (with architrave)', category: 'timber', unit: 'set', tradeCost: 55.00, retailCost: 78.00, partCode: 'DCS' },
  { id: 'ext_door_frame', name: 'External Door Frame (softwood)', category: 'timber', unit: 'nr', tradeCost: 85.00, retailCost: 125.00, partCode: 'EDF' },
  { id: 'threshold_oak', name: 'Oak Threshold 900mm', category: 'timber', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'THO' },
  { id: 'threshold_ali', name: 'Aluminium Threshold 900mm', category: 'timber', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'THA' },
  
  // Door Furniture & Ironmongery
  { id: 'hinge_butt_100', name: 'Butt Hinge 100mm (pair)', category: 'hardware', unit: 'pair', tradeCost: 5.50, retailCost: 8.00, partCode: 'HB100' },
  { id: 'hinge_butt_100_bc', name: 'Butt Hinge 100mm Ball Bearing (pair)', category: 'hardware', unit: 'pair', tradeCost: 8.50, retailCost: 12.50, partCode: 'HBB100' },
  { id: 'hinge_fire_100', name: 'Fire Door Hinge 100mm (pair)', category: 'hardware', unit: 'pair', tradeCost: 12.50, retailCost: 18.00, partCode: 'HF100' },
  { id: 'hinge_rising', name: 'Rising Butt Hinge (pair)', category: 'hardware', unit: 'pair', tradeCost: 14.50, retailCost: 21.00, partCode: 'HRB' },
  { id: 'hinge_parliament', name: 'Parliament Hinge 100mm (pair)', category: 'hardware', unit: 'pair', tradeCost: 22.50, retailCost: 32.00, partCode: 'HP100' },
  { id: 'handle_lever', name: 'Lever Handle Set (chrome)', category: 'hardware', unit: 'set', tradeCost: 18.50, retailCost: 26.00, partCode: 'HL-C' },
  { id: 'handle_lever_ss', name: 'Lever Handle Set (S/Steel)', category: 'hardware', unit: 'set', tradeCost: 28.00, retailCost: 42.00, partCode: 'HL-SS' },
  { id: 'handle_round', name: 'Round Knob Handle Set', category: 'hardware', unit: 'set', tradeCost: 12.50, retailCost: 18.00, partCode: 'HRN' },
  { id: 'latch_tubular', name: 'Tubular Latch 76mm', category: 'hardware', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'LT76' },
  { id: 'latch_tubular_64', name: 'Tubular Latch 64mm', category: 'hardware', unit: 'nr', tradeCost: 3.25, retailCost: 4.80, partCode: 'LT64' },
  { id: 'deadlock_76', name: 'Deadlock 76mm (5 lever)', category: 'hardware', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'DL76' },
  { id: 'sashlock_76', name: 'Sashlock 76mm (5 lever)', category: 'hardware', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'SL76' },
  { id: 'lock_euro', name: 'Euro Cylinder Lock', category: 'hardware', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'ECL' },
  { id: 'lock_euro_anti_snap', name: 'Anti-Snap Euro Cylinder', category: 'hardware', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'ECAS' },
  { id: 'door_closer', name: 'Door Closer (size 3)', category: 'hardware', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'DC3' },
  { id: 'door_closer_conc', name: 'Concealed Door Closer', category: 'hardware', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'DCC' },
  { id: 'intumescent_strips', name: 'Intumescent Strips (set)', category: 'hardware', unit: 'set', tradeCost: 8.50, retailCost: 12.50, partCode: 'IS' },
  { id: 'smoke_seals', name: 'Smoke Seals (set)', category: 'hardware', unit: 'set', tradeCost: 6.50, retailCost: 9.50, partCode: 'SS' },
  { id: 'letter_plate', name: 'Letter Plate (chrome)', category: 'hardware', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'LP-C' },
  { id: 'door_numbers', name: 'Door Number Set', category: 'hardware', unit: 'set', tradeCost: 8.50, retailCost: 12.50, partCode: 'DN' },
  { id: 'door_knocker', name: 'Door Knocker (chrome)', category: 'hardware', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'DK' },
  { id: 'cabin_hook', name: 'Cabin Hook 100mm', category: 'hardware', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'CH100' },
  { id: 'door_stop_floor', name: 'Floor Door Stop', category: 'hardware', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'DSF' },
  { id: 'door_wedge', name: 'Rubber Door Wedge', category: 'hardware', unit: 'nr', tradeCost: 1.85, retailCost: 2.80, partCode: 'DW' },
  
  // Fixings - Screws
  { id: 'screws_35mm', name: 'Wood Screws 4x35mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 8.50, retailCost: 12.50, partCode: 'WS35' },
  { id: 'screws_50mm', name: 'Wood Screws 4x50mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 10.50, retailCost: 15.00, partCode: 'WS50' },
  { id: 'screws_75mm', name: 'Wood Screws 5x75mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 12.50, retailCost: 18.00, partCode: 'WS75' },
  { id: 'screws_100mm', name: 'Wood Screws 5x100mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 14.50, retailCost: 21.00, partCode: 'WS100' },
  { id: 'drywall_32mm', name: 'Drywall Screws 32mm (box 500)', category: 'fixing', unit: 'box', tradeCost: 8.50, retailCost: 12.50, partCode: 'DWS32' },
  { id: 'drywall_42mm', name: 'Drywall Screws 42mm (box 500)', category: 'fixing', unit: 'box', tradeCost: 10.50, retailCost: 15.00, partCode: 'DWS42' },
  { id: 'drywall_65mm', name: 'Drywall Screws 65mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 12.50, retailCost: 18.00, partCode: 'DWS65' },
  { id: 'coach_screw_10x100', name: 'Coach Screws M10x100 (box 25)', category: 'fixing', unit: 'box', tradeCost: 12.50, retailCost: 18.00, partCode: 'CS10100' },
  { id: 'coach_bolt_m10', name: 'Coach Bolt M10x150 (box 10)', category: 'fixing', unit: 'box', tradeCost: 8.50, retailCost: 12.50, partCode: 'CB10150' },
  { id: 'frame_fixing_140', name: 'Frame Fixings 8x140mm (box 50)', category: 'fixing', unit: 'box', tradeCost: 18.50, retailCost: 26.00, partCode: 'FF140' },
  
  // Fixings - Nails
  { id: 'round_nails_50', name: 'Round Wire Nails 50mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 4.85, retailCost: 7.20, partCode: 'RN50' },
  { id: 'round_nails_75', name: 'Round Wire Nails 75mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 4.85, retailCost: 7.20, partCode: 'RN75' },
  { id: 'round_nails_100', name: 'Round Wire Nails 100mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 5.50, retailCost: 8.00, partCode: 'RN100' },
  { id: 'lost_head_50', name: 'Lost Head Nails 50mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 5.50, retailCost: 8.00, partCode: 'LH50' },
  { id: 'panel_pins_25', name: 'Panel Pins 25mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 4.25, retailCost: 6.20, partCode: 'PP25' },
  { id: 'panel_pins_40', name: 'Panel Pins 40mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 4.85, retailCost: 7.20, partCode: 'PP40' },
  { id: 'brad_nails_18g', name: '18 Gauge Brad Nails 32mm (5000)', category: 'fixing', unit: 'box', tradeCost: 12.50, retailCost: 18.00, partCode: 'BN32' },
  { id: 'brad_nails_16g', name: '16 Gauge Finish Nails 50mm (2500)', category: 'fixing', unit: 'box', tradeCost: 18.50, retailCost: 26.00, partCode: 'FN50' },
  { id: 'clout_nails', name: 'Clout Nails 30mm (500g)', category: 'fixing', unit: 'pack', tradeCost: 4.85, retailCost: 7.20, partCode: 'CN30' },
  { id: 'masonry_nails', name: 'Masonry Nails 50mm (100)', category: 'fixing', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'MN50' },
  
  // Wall Plugs & Anchors
  { id: 'wall_plugs_red', name: 'Wall Plugs 6mm Red (100)', category: 'fixing', unit: 'pack', tradeCost: 2.45, retailCost: 3.60, partCode: 'WPR' },
  { id: 'wall_plugs_brown', name: 'Wall Plugs 7mm Brown (100)', category: 'fixing', unit: 'pack', tradeCost: 2.85, retailCost: 4.20, partCode: 'WPB' },
  { id: 'wall_plugs_yellow', name: 'Wall Plugs 5mm Yellow (100)', category: 'fixing', unit: 'pack', tradeCost: 2.25, retailCost: 3.40, partCode: 'WPY' },
  { id: 'plasterboard_fixings', name: 'Spring Toggle Fixings (25)', category: 'fixing', unit: 'pack', tradeCost: 12.50, retailCost: 18.00, partCode: 'STF' },
  { id: 'hollow_wall_anchors', name: 'Hollow Wall Anchors (25)', category: 'fixing', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'HWA' },
  { id: 'hammer_fixings', name: 'Hammer Fixings 6x60 (50)', category: 'fixing', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'HF660' },
  { id: 'chemical_anchor', name: 'Chemical Anchor Resin 300ml', category: 'fixing', unit: 'tube', tradeCost: 14.50, retailCost: 21.00, partCode: 'CAR' },
  { id: 'rawl_studs', name: 'Rawl Studs M10x130 (10)', category: 'fixing', unit: 'pack', tradeCost: 12.50, retailCost: 18.00, partCode: 'RS10' },
  
  // Joist Hangers & Brackets
  { id: 'joist_hanger_47', name: 'Joist Hanger 47mm', category: 'hardware', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'JH47' },
  { id: 'joist_hanger_75', name: 'Joist Hanger 75mm', category: 'hardware', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'JH75' },
  { id: 'joist_hanger_100', name: 'Joist Hanger 100mm', category: 'hardware', unit: 'nr', tradeCost: 5.85, retailCost: 8.50, partCode: 'JH100' },
  { id: 'timber_connector', name: 'Timber Connector Plate', category: 'hardware', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'TCP' },
  { id: 'angle_bracket_50', name: 'Angle Bracket 50x50mm', category: 'hardware', unit: 'nr', tradeCost: 0.85, retailCost: 1.30, partCode: 'AB50' },
  { id: 'angle_bracket_90', name: 'Angle Bracket 90x90mm', category: 'hardware', unit: 'nr', tradeCost: 1.45, retailCost: 2.20, partCode: 'AB90' },
  { id: 'l_bracket', name: 'L-Bracket Heavy Duty', category: 'hardware', unit: 'nr', tradeCost: 2.25, retailCost: 3.40, partCode: 'LBR' },
  { id: 't_bracket', name: 'T-Bracket Heavy Duty', category: 'hardware', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'TBR' },
  { id: 'noggin_hanger', name: 'Noggin Hanger', category: 'hardware', unit: 'nr', tradeCost: 1.85, retailCost: 2.80, partCode: 'NH' },
  { id: 'post_anchor', name: 'Post Anchor 91mm', category: 'hardware', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'PA91' },
  { id: 'post_anchor_100', name: 'Post Anchor 100mm', category: 'hardware', unit: 'nr', tradeCost: 10.50, retailCost: 15.00, partCode: 'PA100' },
  { id: 'fence_bracket', name: 'Fence Panel Bracket (pair)', category: 'hardware', unit: 'pair', tradeCost: 4.85, retailCost: 7.20, partCode: 'FPB' },
  
  // Adhesives
  { id: 'wood_glue', name: 'PVA Wood Glue 1L', category: 'consumable', unit: 'bottle', tradeCost: 6.50, retailCost: 9.50, partCode: 'WG1' },
  { id: 'wood_glue_5', name: 'PVA Wood Glue 5L', category: 'consumable', unit: 'bottle', tradeCost: 22.50, retailCost: 32.00, partCode: 'WG5' },
  { id: 'polyurethane_glue', name: 'Polyurethane Wood Glue 750ml', category: 'consumable', unit: 'bottle', tradeCost: 12.50, retailCost: 18.00, partCode: 'PUG' },
  { id: 'grip_fill', name: 'Gripfill Adhesive 350ml', category: 'consumable', unit: 'tube', tradeCost: 4.85, retailCost: 7.20, partCode: 'GF' },
  { id: 'grip_fill_max', name: 'Gripfill Max 310ml', category: 'consumable', unit: 'tube', tradeCost: 6.50, retailCost: 9.50, partCode: 'GFM' },
  { id: 'no_more_nails', name: 'No More Nails 310ml', category: 'consumable', unit: 'tube', tradeCost: 5.50, retailCost: 8.00, partCode: 'NMN' },
  { id: 'contact_adhesive', name: 'Contact Adhesive 1L', category: 'consumable', unit: 'tin', tradeCost: 14.50, retailCost: 21.00, partCode: 'CA1' },
  { id: 'expanding_foam', name: 'Expanding Foam 750ml', category: 'consumable', unit: 'can', tradeCost: 5.50, retailCost: 8.00, partCode: 'EF' },
  { id: 'fire_foam', name: 'Fire Rated Expanding Foam', category: 'consumable', unit: 'can', tradeCost: 12.50, retailCost: 18.00, partCode: 'FF' },
  { id: 'wood_filler', name: 'Wood Filler 500g', category: 'consumable', unit: 'tub', tradeCost: 4.85, retailCost: 7.20, partCode: 'WF' },
  { id: 'wood_filler_2part', name: '2-Part Wood Filler 500g', category: 'consumable', unit: 'tin', tradeCost: 14.50, retailCost: 21.00, partCode: 'WF2P' },
  { id: 'decorators_caulk', name: 'Decorators Caulk 310ml', category: 'consumable', unit: 'tube', tradeCost: 2.45, retailCost: 3.60, partCode: 'DC' },
];

// ============================================
// ROOFING COMPONENTS
// ============================================
export const ROOFING_COMPONENTS: DetailedComponent[] = [
  // Tiles
  { id: 'concrete_tile', name: 'Concrete Interlocking Tile', category: 'roofing', unit: 'nr', tradeCost: 1.25, retailCost: 1.90, partCode: 'CIT' },
  { id: 'clay_tile', name: 'Clay Plain Tile', category: 'roofing', unit: 'nr', tradeCost: 0.85, retailCost: 1.30, partCode: 'CPT' },
  { id: 'slate_natural', name: 'Natural Slate 500x250', category: 'roofing', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'NS' },
  { id: 'slate_fiber', name: 'Fibre Cement Slate', category: 'roofing', unit: 'nr', tradeCost: 1.65, retailCost: 2.40, partCode: 'FCS' },
  { id: 'ridge_tile_concrete', name: 'Concrete Ridge Tile', category: 'roofing', unit: 'nr', tradeCost: 4.50, retailCost: 6.50, partCode: 'CRT' },
  { id: 'ridge_tile_clay', name: 'Clay Ridge Tile', category: 'roofing', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'CLRT' },
  { id: 'hip_tile', name: 'Hip Tile', category: 'roofing', unit: 'nr', tradeCost: 5.50, retailCost: 8.00, partCode: 'HT' },
  { id: 'valley_tile', name: 'Valley Tile', category: 'roofing', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'VT' },
  { id: 'eaves_tile', name: 'Eaves/Top Tile', category: 'roofing', unit: 'nr', tradeCost: 1.45, retailCost: 2.20, partCode: 'ET' },
  { id: 'tile_clip', name: 'Tile Clip (pack 100)', category: 'roofing', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'TC' },
  { id: 'tile_nail', name: 'Tile Nails (1kg)', category: 'roofing', unit: 'kg', tradeCost: 6.50, retailCost: 9.50, partCode: 'TN' },
  
  // Underlays & Membranes
  { id: 'breathable_membrane', name: 'Breathable Membrane (50m roll)', category: 'roofing', unit: 'roll', tradeCost: 85.00, retailCost: 125.00, partCode: 'BM50' },
  { id: 'felt_1f', name: 'Roofing Felt 1F (15m roll)', category: 'roofing', unit: 'roll', tradeCost: 22.50, retailCost: 32.00, partCode: 'RF1F' },
  { id: 'epdm_membrane', name: 'EPDM Membrane (per m²)', category: 'roofing', unit: 'm²', tradeCost: 18.50, retailCost: 26.00, partCode: 'EPDM' },
  { id: 'torch_on_felt', name: 'Torch-On Felt (8m roll)', category: 'roofing', unit: 'roll', tradeCost: 65.00, retailCost: 95.00, partCode: 'TOF' },
  { id: 'grp_resin', name: 'GRP Fibreglass Resin (5kg)', category: 'roofing', unit: 'tin', tradeCost: 45.00, retailCost: 65.00, partCode: 'GRP5' },
  { id: 'grp_matting', name: 'GRP Fibreglass Matting (10m²)', category: 'roofing', unit: 'roll', tradeCost: 35.00, retailCost: 52.00, partCode: 'GRPM' },
  
  // Dry Fix Systems
  { id: 'dry_ridge_kit', name: 'Dry Ridge System Kit (6m)', category: 'roofing', unit: 'kit', tradeCost: 65.00, retailCost: 95.00, partCode: 'DRK' },
  { id: 'dry_verge_kit', name: 'Dry Verge System (pair)', category: 'roofing', unit: 'pair', tradeCost: 12.50, retailCost: 18.00, partCode: 'DVK' },
  { id: 'hip_support_tray', name: 'Hip Support Tray', category: 'roofing', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'HST' },
  { id: 'universal_union', name: 'Universal Dry Ridge Union', category: 'roofing', unit: 'nr', tradeCost: 5.50, retailCost: 8.00, partCode: 'UDR' },
  { id: 'ridge_roll', name: 'Ridge Ventilation Roll (6m)', category: 'roofing', unit: 'roll', tradeCost: 32.00, retailCost: 48.00, partCode: 'RVR' },
  
  // Flashings
  { id: 'lead_code_4', name: 'Lead Sheet Code 4 (per m)', category: 'roofing', unit: 'm', tradeCost: 22.50, retailCost: 32.00, partCode: 'LC4' },
  { id: 'lead_code_5', name: 'Lead Sheet Code 5 (per m)', category: 'roofing', unit: 'm', tradeCost: 28.00, retailCost: 42.00, partCode: 'LC5' },
  { id: 'lead_flashing_kit', name: 'Lead Flashing Kit', category: 'roofing', unit: 'kit', tradeCost: 85.00, retailCost: 125.00, partCode: 'LFK' },
  { id: 'lead_substitute', name: 'Lead Substitute Roll (per m)', category: 'roofing', unit: 'm', tradeCost: 12.50, retailCost: 18.00, partCode: 'LS' },
  { id: 'valley_tray', name: 'GRP Valley Tray (1.5m)', category: 'roofing', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'VT15' },
  { id: 'stepped_flashing', name: 'Stepped Flashing Roll (3m)', category: 'roofing', unit: 'roll', tradeCost: 35.00, retailCost: 52.00, partCode: 'SF' },
  
  // Ventilation
  { id: 'tile_vent', name: 'Tile Vent', category: 'roofing', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'TV' },
  { id: 'slate_vent', name: 'Slate Vent', category: 'roofing', unit: 'nr', tradeCost: 22.50, retailCost: 32.00, partCode: 'SV' },
  { id: 'eaves_vent', name: 'Eaves Ventilator (per m)', category: 'roofing', unit: 'm', tradeCost: 3.85, retailCost: 5.60, partCode: 'EV' },
  { id: 'soffit_vent', name: 'Continuous Soffit Vent (2.5m)', category: 'roofing', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'SSV' },
  { id: 'roof_cowl', name: 'Roof Cowl Vent', category: 'roofing', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'RCV' },
  
  // Fascia, Soffit & Guttering
  { id: 'fascia_board_200', name: 'uPVC Fascia Board 200mm (5m)', category: 'roofing', unit: 'length', tradeCost: 28.00, retailCost: 42.00, partCode: 'FB200' },
  { id: 'fascia_board_225', name: 'uPVC Fascia Board 225mm (5m)', category: 'roofing', unit: 'length', tradeCost: 32.00, retailCost: 48.00, partCode: 'FB225' },
  { id: 'soffit_board_200', name: 'uPVC Soffit Board 200mm (5m)', category: 'roofing', unit: 'length', tradeCost: 22.50, retailCost: 32.00, partCode: 'SB200' },
  { id: 'soffit_board_300', name: 'uPVC Soffit Board 300mm (5m)', category: 'roofing', unit: 'length', tradeCost: 28.00, retailCost: 42.00, partCode: 'SB300' },
  { id: 'bargeboard', name: 'uPVC Bargeboard (5m)', category: 'roofing', unit: 'length', tradeCost: 35.00, retailCost: 52.00, partCode: 'BB' },
  { id: 'gutter_112mm', name: 'Half Round Gutter 112mm (4m)', category: 'drainage', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'GU112' },
  { id: 'gutter_square', name: 'Square Line Gutter (4m)', category: 'drainage', unit: 'length', tradeCost: 12.50, retailCost: 18.00, partCode: 'GSQ' },
  { id: 'gutter_high_cap', name: 'High Capacity Gutter (4m)', category: 'drainage', unit: 'length', tradeCost: 18.50, retailCost: 26.00, partCode: 'GHC' },
  { id: 'downpipe_68mm', name: 'Round Downpipe 68mm (2.5m)', category: 'drainage', unit: 'length', tradeCost: 6.50, retailCost: 9.50, partCode: 'DP68' },
  { id: 'downpipe_square', name: 'Square Downpipe (2.5m)', category: 'drainage', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'DPS' },
  { id: 'gutter_bracket', name: 'Gutter Bracket', category: 'drainage', unit: 'nr', tradeCost: 1.45, retailCost: 2.20, partCode: 'GB' },
  { id: 'downpipe_clip', name: 'Downpipe Clip', category: 'drainage', unit: 'nr', tradeCost: 1.25, retailCost: 1.90, partCode: 'DPC' },
  { id: 'gutter_outlet', name: 'Gutter Outlet', category: 'drainage', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'GO' },
  { id: 'gutter_corner', name: 'Gutter Corner (90°)', category: 'drainage', unit: 'nr', tradeCost: 5.50, retailCost: 8.00, partCode: 'GC' },
  { id: 'gutter_union', name: 'Gutter Union', category: 'drainage', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'GUN' },
  { id: 'gutter_stop_end', name: 'Gutter Stop End', category: 'drainage', unit: 'nr', tradeCost: 2.25, retailCost: 3.40, partCode: 'GSE' },
  { id: 'downpipe_shoe', name: 'Downpipe Shoe', category: 'drainage', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'DPS' },
  { id: 'downpipe_offset_bend', name: 'Downpipe Offset Bend', category: 'drainage', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'DOB' },
  { id: 'hopper_head', name: 'Hopper Head', category: 'drainage', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'HH' },
  { id: 'gutter_guard', name: 'Gutter Guard Mesh (per m)', category: 'drainage', unit: 'm', tradeCost: 4.85, retailCost: 7.20, partCode: 'GGM' },
];

// ============================================
// MASONRY COMPONENTS
// ============================================
export const MASONRY_COMPONENTS: DetailedComponent[] = [
  // Bricks & Blocks
  { id: 'facing_brick', name: 'Facing Brick (per 1000)', category: 'masonry', unit: '1000', tradeCost: 850.00, retailCost: 1200.00, partCode: 'FB' },
  { id: 'engineering_brick', name: 'Engineering Brick Class B (per 1000)', category: 'masonry', unit: '1000', tradeCost: 650.00, retailCost: 950.00, partCode: 'EB' },
  { id: 'common_brick', name: 'Common Brick (per 1000)', category: 'masonry', unit: '1000', tradeCost: 450.00, retailCost: 650.00, partCode: 'CB' },
  { id: 'block_100', name: '100mm Concrete Block', category: 'masonry', unit: 'nr', tradeCost: 1.45, retailCost: 2.20, partCode: 'BL100' },
  { id: 'block_140', name: '140mm Concrete Block', category: 'masonry', unit: 'nr', tradeCost: 2.25, retailCost: 3.40, partCode: 'BL140' },
  { id: 'aerated_block_100', name: '100mm Aerated Block', category: 'masonry', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'AB100' },
  { id: 'aerated_block_140', name: '140mm Aerated Block', category: 'masonry', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'AB140' },
  { id: 'padstone', name: 'Concrete Padstone 440x215x100', category: 'masonry', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'PS' },
  
  // Mortar & Sand
  { id: 'building_sand', name: 'Building Sand (bulk bag)', category: 'masonry', unit: 'bag', tradeCost: 45.00, retailCost: 65.00, partCode: 'BS' },
  { id: 'sharp_sand', name: 'Sharp Sand (bulk bag)', category: 'masonry', unit: 'bag', tradeCost: 45.00, retailCost: 65.00, partCode: 'SS' },
  { id: 'cement_25kg', name: 'Portland Cement 25kg', category: 'masonry', unit: 'bag', tradeCost: 5.50, retailCost: 8.00, partCode: 'PC25' },
  { id: 'hydrated_lime', name: 'Hydrated Lime 25kg', category: 'masonry', unit: 'bag', tradeCost: 8.50, retailCost: 12.50, partCode: 'HL25' },
  { id: 'plasticiser', name: 'Mortar Plasticiser 5L', category: 'masonry', unit: 'bottle', tradeCost: 8.50, retailCost: 12.50, partCode: 'MP5' },
  { id: 'ready_mix_mortar', name: 'Ready Mix Mortar 25kg', category: 'masonry', unit: 'bag', tradeCost: 6.50, retailCost: 9.50, partCode: 'RMM' },
  { id: 'pointing_mortar', name: 'Pointing Mortar (tub)', category: 'masonry', unit: 'tub', tradeCost: 12.50, retailCost: 18.00, partCode: 'PM' },
  
  // DPC & Lintels
  { id: 'dpc_100', name: 'DPC 100mm (30m roll)', category: 'masonry', unit: 'roll', tradeCost: 18.50, retailCost: 26.00, partCode: 'DPC100' },
  { id: 'dpc_150', name: 'DPC 150mm (30m roll)', category: 'masonry', unit: 'roll', tradeCost: 22.50, retailCost: 32.00, partCode: 'DPC150' },
  { id: 'dpc_225', name: 'DPC 225mm (30m roll)', category: 'masonry', unit: 'roll', tradeCost: 28.00, retailCost: 42.00, partCode: 'DPC225' },
  { id: 'dpc_tray', name: 'Cavity Tray DPC', category: 'masonry', unit: 'm', tradeCost: 8.50, retailCost: 12.50, partCode: 'DPCT' },
  { id: 'lintel_1200', name: 'Steel Lintel 1200mm', category: 'masonry', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'SL1200' },
  { id: 'lintel_1500', name: 'Steel Lintel 1500mm', category: 'masonry', unit: 'nr', tradeCost: 55.00, retailCost: 78.00, partCode: 'SL1500' },
  { id: 'lintel_1800', name: 'Steel Lintel 1800mm', category: 'masonry', unit: 'nr', tradeCost: 75.00, retailCost: 105.00, partCode: 'SL1800' },
  { id: 'lintel_2100', name: 'Steel Lintel 2100mm', category: 'masonry', unit: 'nr', tradeCost: 95.00, retailCost: 140.00, partCode: 'SL2100' },
  { id: 'lintel_2400', name: 'Steel Lintel 2400mm', category: 'masonry', unit: 'nr', tradeCost: 115.00, retailCost: 165.00, partCode: 'SL2400' },
  { id: 'concrete_lintel_900', name: 'Concrete Lintel 900mm', category: 'masonry', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'CL900' },
  { id: 'concrete_lintel_1200', name: 'Concrete Lintel 1200mm', category: 'masonry', unit: 'nr', tradeCost: 25.00, retailCost: 36.00, partCode: 'CL1200' },
  
  // Wall Ties & Accessories
  { id: 'wall_tie_225', name: 'Wall Ties 225mm (250 pack)', category: 'masonry', unit: 'pack', tradeCost: 28.00, retailCost: 42.00, partCode: 'WT225' },
  { id: 'wall_tie_275', name: 'Wall Ties 275mm (250 pack)', category: 'masonry', unit: 'pack', tradeCost: 35.00, retailCost: 52.00, partCode: 'WT275' },
  { id: 'retrofit_wall_tie', name: 'Retrofit Wall Ties (50 pack)', category: 'masonry', unit: 'pack', tradeCost: 45.00, retailCost: 65.00, partCode: 'RWT' },
  { id: 'weep_vent', name: 'Weep Vent (pack 10)', category: 'masonry', unit: 'pack', tradeCost: 8.50, retailCost: 12.50, partCode: 'WV' },
  { id: 'cavity_closer', name: 'Cavity Closer 50mm (2.5m)', category: 'masonry', unit: 'length', tradeCost: 6.50, retailCost: 9.50, partCode: 'CC50' },
  { id: 'air_brick', name: 'Air Brick 215x65mm', category: 'masonry', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'ABRK' },
  { id: 'air_brick_terracotta', name: 'Terracotta Air Brick', category: 'masonry', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'ABRT' },
  { id: 'movement_joint', name: 'Movement Joint Filler (per m)', category: 'masonry', unit: 'm', tradeCost: 5.50, retailCost: 8.00, partCode: 'MJF' },
];

// ============================================
// INSULATION COMPONENTS
// ============================================
export const INSULATION_COMPONENTS: DetailedComponent[] = [
  // PIR/PUR Boards
  { id: 'pir_25mm', name: 'PIR Insulation 25mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 8.50, retailCost: 12.50, partCode: 'PIR25' },
  { id: 'pir_50mm', name: 'PIR Insulation 50mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 14.50, retailCost: 21.00, partCode: 'PIR50' },
  { id: 'pir_75mm', name: 'PIR Insulation 75mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 18.50, retailCost: 26.00, partCode: 'PIR75' },
  { id: 'pir_100mm', name: 'PIR Insulation 100mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 22.50, retailCost: 32.00, partCode: 'PIR100' },
  { id: 'pir_120mm', name: 'PIR Insulation 120mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 28.00, retailCost: 42.00, partCode: 'PIR120' },
  { id: 'pir_150mm', name: 'PIR Insulation 150mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 35.00, retailCost: 52.00, partCode: 'PIR150' },
  
  // Mineral Wool
  { id: 'mineral_wool_100', name: 'Mineral Wool 100mm (pack)', category: 'insulation', unit: 'pack', tradeCost: 32.00, retailCost: 48.00, partCode: 'MW100' },
  { id: 'mineral_wool_150', name: 'Mineral Wool 150mm (pack)', category: 'insulation', unit: 'pack', tradeCost: 45.00, retailCost: 65.00, partCode: 'MW150' },
  { id: 'mineral_wool_200', name: 'Mineral Wool 200mm (pack)', category: 'insulation', unit: 'pack', tradeCost: 55.00, retailCost: 78.00, partCode: 'MW200' },
  { id: 'mineral_wool_270', name: 'Mineral Wool 270mm (pack)', category: 'insulation', unit: 'pack', tradeCost: 65.00, retailCost: 95.00, partCode: 'MW270' },
  { id: 'acoustic_slab', name: 'Acoustic Mineral Slab 50mm', category: 'insulation', unit: 'pack', tradeCost: 35.00, retailCost: 52.00, partCode: 'AS50' },
  
  // EPS & XPS
  { id: 'eps_25mm', name: 'EPS Insulation 25mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 3.85, retailCost: 5.60, partCode: 'EPS25' },
  { id: 'eps_50mm', name: 'EPS Insulation 50mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 6.50, retailCost: 9.50, partCode: 'EPS50' },
  { id: 'eps_100mm', name: 'EPS Insulation 100mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 12.50, retailCost: 18.00, partCode: 'EPS100' },
  { id: 'xps_50mm', name: 'XPS Floor Insulation 50mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 14.50, retailCost: 21.00, partCode: 'XPS50' },
  { id: 'xps_100mm', name: 'XPS Floor Insulation 100mm (per m²)', category: 'insulation', unit: 'm²', tradeCost: 28.00, retailCost: 42.00, partCode: 'XPS100' },
  
  // Membranes
  { id: 'vaporbar', name: 'Vapour Barrier 500 gauge (25m roll)', category: 'insulation', unit: 'roll', tradeCost: 45.00, retailCost: 65.00, partCode: 'VB500' },
  { id: 'breather_membrane', name: 'Breather Membrane (50m roll)', category: 'insulation', unit: 'roll', tradeCost: 95.00, retailCost: 140.00, partCode: 'BRM' },
  { id: 'radon_membrane', name: 'Radon Barrier (per m²)', category: 'insulation', unit: 'm²', tradeCost: 4.85, retailCost: 7.20, partCode: 'RDM' },
  { id: 'insulation_tape', name: 'Insulation Foil Tape (50m)', category: 'insulation', unit: 'roll', tradeCost: 8.50, retailCost: 12.50, partCode: 'IFT' },
];

// ============================================
// SAFETY EQUIPMENT
// ============================================
export const SAFETY_COMPONENTS: DetailedComponent[] = [
  { id: 'hard_hat', name: 'Safety Hard Hat', category: 'safety', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'HH' },
  { id: 'safety_glasses', name: 'Safety Glasses (clear)', category: 'safety', unit: 'nr', tradeCost: 2.85, retailCost: 4.20, partCode: 'SG' },
  { id: 'safety_goggles', name: 'Safety Goggles', category: 'safety', unit: 'nr', tradeCost: 5.50, retailCost: 8.00, partCode: 'SGG' },
  { id: 'dust_mask_p2', name: 'Dust Mask P2 (box 10)', category: 'safety', unit: 'box', tradeCost: 12.50, retailCost: 18.00, partCode: 'DMP2' },
  { id: 'dust_mask_p3', name: 'Dust Mask P3 (box 10)', category: 'safety', unit: 'box', tradeCost: 22.50, retailCost: 32.00, partCode: 'DMP3' },
  { id: 'half_mask', name: 'Half Face Respirator', category: 'safety', unit: 'nr', tradeCost: 25.00, retailCost: 36.00, partCode: 'HFR' },
  { id: 'filters_p3', name: 'P3 Filters (pair)', category: 'safety', unit: 'pair', tradeCost: 12.50, retailCost: 18.00, partCode: 'FP3' },
  { id: 'ear_defenders', name: 'Ear Defenders', category: 'safety', unit: 'nr', tradeCost: 12.50, retailCost: 18.00, partCode: 'ED' },
  { id: 'ear_plugs', name: 'Ear Plugs (box 200)', category: 'safety', unit: 'box', tradeCost: 18.50, retailCost: 26.00, partCode: 'EP' },
  { id: 'work_gloves', name: 'Work Gloves (riggers)', category: 'safety', unit: 'pair', tradeCost: 4.85, retailCost: 7.20, partCode: 'WG' },
  { id: 'cut_gloves', name: 'Cut Resistant Gloves', category: 'safety', unit: 'pair', tradeCost: 8.50, retailCost: 12.50, partCode: 'CG' },
  { id: 'nitrile_gloves', name: 'Nitrile Gloves (box 100)', category: 'safety', unit: 'box', tradeCost: 8.50, retailCost: 12.50, partCode: 'NG' },
  { id: 'knee_pads', name: 'Knee Pads (pair)', category: 'safety', unit: 'pair', tradeCost: 18.50, retailCost: 26.00, partCode: 'KP' },
  { id: 'hi_vis_vest', name: 'Hi-Vis Vest', category: 'safety', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'HVV' },
  { id: 'hi_vis_jacket', name: 'Hi-Vis Jacket', category: 'safety', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'HVJ' },
  { id: 'safety_boots', name: 'Safety Boots S3', category: 'safety', unit: 'pair', tradeCost: 45.00, retailCost: 65.00, partCode: 'SB' },
  { id: 'harness', name: 'Fall Arrest Harness', category: 'safety', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'FAH' },
  { id: 'lanyard', name: 'Shock Absorbing Lanyard', category: 'safety', unit: 'nr', tradeCost: 45.00, retailCost: 65.00, partCode: 'SAL' },
  { id: 'first_aid_kit', name: 'First Aid Kit (10 person)', category: 'safety', unit: 'kit', tradeCost: 22.50, retailCost: 32.00, partCode: 'FAK' },
  { id: 'fire_extinguisher', name: 'Fire Extinguisher 2kg CO2', category: 'safety', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'FE2' },
  { id: 'barrier_tape', name: 'Barrier Tape 500m', category: 'safety', unit: 'roll', tradeCost: 8.50, retailCost: 12.50, partCode: 'BT' },
  { id: 'hazard_signs', name: 'Hazard Warning Signs (set)', category: 'safety', unit: 'set', tradeCost: 18.50, retailCost: 26.00, partCode: 'HWS' },
];

// ============================================
// GLAZING COMPONENTS - Windows, Doors, Bifolds, Skylights, Guttering
// ============================================
export const GLAZING_COMPONENTS: DetailedComponent[] = [
  // Windows - uPVC
  { id: 'upvc_casement_600x900', name: 'uPVC Casement Window 600x900mm', category: 'glazing', unit: 'nr', tradeCost: 185.00, retailCost: 265.00, partCode: 'UPV-C609' },
  { id: 'upvc_casement_900x1200', name: 'uPVC Casement Window 900x1200mm', category: 'glazing', unit: 'nr', tradeCost: 245.00, retailCost: 350.00, partCode: 'UPV-C912' },
  { id: 'upvc_casement_1200x1200', name: 'uPVC Casement Window 1200x1200mm', category: 'glazing', unit: 'nr', tradeCost: 295.00, retailCost: 420.00, partCode: 'UPV-C1212' },
  { id: 'upvc_tilt_turn_1200x1200', name: 'uPVC Tilt & Turn 1200x1200mm', category: 'glazing', unit: 'nr', tradeCost: 385.00, retailCost: 550.00, partCode: 'UPV-TT1212' },
  { id: 'upvc_bay_2400x1200', name: 'uPVC Bay Window 2400x1200mm', category: 'glazing', unit: 'nr', tradeCost: 1450.00, retailCost: 2100.00, partCode: 'UPV-BAY24' },
  { id: 'upvc_triple_glazed', name: 'Triple Glazed uPVC 1200x1200mm', category: 'glazing', unit: 'nr', tradeCost: 425.00, retailCost: 620.00, partCode: 'UPV-TG1212' },
  
  // Windows - Aluminium
  { id: 'alu_casement_1200x1200', name: 'Aluminium Casement Window 1200x1200mm', category: 'glazing', unit: 'nr', tradeCost: 485.00, retailCost: 695.00, partCode: 'ALU-C1212' },
  { id: 'alu_sliding_1800x1200', name: 'Aluminium Sliding Window 1800x1200mm', category: 'glazing', unit: 'nr', tradeCost: 650.00, retailCost: 950.00, partCode: 'ALU-S1812' },
  
  // Doors
  { id: 'upvc_front_door', name: 'uPVC Front Door Composite 2100x900mm', category: 'glazing', unit: 'nr', tradeCost: 685.00, retailCost: 980.00, partCode: 'UPV-FD21' },
  { id: 'upvc_back_door', name: 'uPVC Back Door Half-Glazed 2100x900mm', category: 'glazing', unit: 'nr', tradeCost: 485.00, retailCost: 695.00, partCode: 'UPV-BD21' },
  { id: 'upvc_french_doors', name: 'uPVC French Doors 2100x1800mm', category: 'glazing', unit: 'pair', tradeCost: 895.00, retailCost: 1280.00, partCode: 'UPV-FR21' },
  { id: 'upvc_patio_door_2100', name: 'uPVC Sliding Patio Door 2100x2100mm', category: 'glazing', unit: 'nr', tradeCost: 785.00, retailCost: 1120.00, partCode: 'UPV-PD21' },
  
  // Bifold Doors
  { id: 'alu_bifold_2400', name: 'Aluminium Bifold 2-Pane 2400x2100mm', category: 'glazing', unit: 'nr', tradeCost: 1850.00, retailCost: 2650.00, partCode: 'ALU-BF24' },
  { id: 'alu_bifold_3000', name: 'Aluminium Bifold 3-Pane 3000x2100mm', category: 'glazing', unit: 'nr', tradeCost: 2450.00, retailCost: 3500.00, partCode: 'ALU-BF30' },
  { id: 'alu_bifold_4000', name: 'Aluminium Bifold 4-Pane 4000x2100mm', category: 'glazing', unit: 'nr', tradeCost: 3250.00, retailCost: 4650.00, partCode: 'ALU-BF40' },
  { id: 'alu_bifold_5000', name: 'Aluminium Bifold 5-Pane 5000x2100mm', category: 'glazing', unit: 'nr', tradeCost: 4150.00, retailCost: 5950.00, partCode: 'ALU-BF50' },
  
  // Skylights & Roof Windows
  { id: 'velux_ck02', name: 'VELUX CK02 Roof Window 550x780mm', category: 'glazing', unit: 'nr', tradeCost: 285.00, retailCost: 420.00, partCode: 'VLX-CK02' },
  { id: 'velux_mk04', name: 'VELUX MK04 Roof Window 780x980mm', category: 'glazing', unit: 'nr', tradeCost: 325.00, retailCost: 480.00, partCode: 'VLX-MK04' },
  { id: 'velux_mk06', name: 'VELUX MK06 Roof Window 780x1180mm', category: 'glazing', unit: 'nr', tradeCost: 385.00, retailCost: 565.00, partCode: 'VLX-MK06' },
  { id: 'velux_mk08', name: 'VELUX MK08 Roof Window 780x1400mm', category: 'glazing', unit: 'nr', tradeCost: 450.00, retailCost: 660.00, partCode: 'VLX-MK08' },
  { id: 'velux_flashing_mk04', name: 'VELUX Flashing Kit MK04', category: 'glazing', unit: 'nr', tradeCost: 85.00, retailCost: 125.00, partCode: 'VLX-FL-MK04' },
  { id: 'flat_roof_skylight_900', name: 'Flat Roof Skylight 900x900mm', category: 'glazing', unit: 'nr', tradeCost: 520.00, retailCost: 765.00, partCode: 'FRS-9090' },
  { id: 'sun_tunnel_350', name: 'Sun Tunnel 350mm Rigid', category: 'glazing', unit: 'nr', tradeCost: 320.00, retailCost: 470.00, partCode: 'ST-350R' },
  
  // Conservatory Components
  { id: 'conservatory_lean_to_3x3', name: 'Lean-to Conservatory Kit 3x3m', category: 'glazing', unit: 'kit', tradeCost: 4500.00, retailCost: 6500.00, partCode: 'CON-LT33' },
  { id: 'polycarbonate_roof_clear', name: 'Polycarbonate Roof Panel 25mm Clear (m²)', category: 'glazing', unit: 'm²', tradeCost: 42.00, retailCost: 62.00, partCode: 'PC-CLR25' },
  { id: 'glass_roof_self_clean', name: 'Self-Cleaning Glass Roof Panel (m²)', category: 'glazing', unit: 'm²', tradeCost: 185.00, retailCost: 265.00, partCode: 'GR-SC' },
  
  // Guttering - uPVC
  { id: 'gutter_half_round_4m', name: 'Half Round Gutter 4m Length', category: 'glazing', unit: 'length', tradeCost: 12.50, retailCost: 18.50, partCode: 'GT-HR4' },
  { id: 'gutter_ogee_4m', name: 'Ogee Gutter 4m Length', category: 'glazing', unit: 'length', tradeCost: 16.50, retailCost: 24.00, partCode: 'GT-OG4' },
  { id: 'gutter_bracket', name: 'Gutter Bracket', category: 'glazing', unit: 'nr', tradeCost: 1.85, retailCost: 2.80, partCode: 'GT-BRK' },
  { id: 'gutter_union', name: 'Gutter Union Joint', category: 'glazing', unit: 'nr', tradeCost: 3.25, retailCost: 4.80, partCode: 'GT-UNI' },
  { id: 'gutter_stop_end', name: 'Gutter Stop End', category: 'glazing', unit: 'nr', tradeCost: 2.45, retailCost: 3.60, partCode: 'GT-SE' },
  { id: 'gutter_running_outlet', name: 'Gutter Running Outlet', category: 'glazing', unit: 'nr', tradeCost: 4.25, retailCost: 6.20, partCode: 'GT-RO' },
  { id: 'gutter_angle_90', name: 'Gutter 90° Angle', category: 'glazing', unit: 'nr', tradeCost: 4.85, retailCost: 7.20, partCode: 'GT-A90' },
  { id: 'downpipe_68mm_2.5m', name: 'Downpipe 68mm 2.5m Length', category: 'glazing', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'DP-68' },
  { id: 'downpipe_bracket', name: 'Downpipe Bracket', category: 'glazing', unit: 'nr', tradeCost: 1.65, retailCost: 2.40, partCode: 'DP-BRK' },
  { id: 'downpipe_shoe', name: 'Downpipe Shoe', category: 'glazing', unit: 'nr', tradeCost: 3.85, retailCost: 5.60, partCode: 'DP-SHO' },
  { id: 'hopper_head', name: 'Hopper Head', category: 'glazing', unit: 'nr', tradeCost: 12.50, retailCost: 18.50, partCode: 'HP-HD' },
  
  // Hardware
  { id: 'window_handle_chrome', name: 'Espag Window Handle Chrome', category: 'hardware', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'WH-CHR' },
  { id: 'window_hinge_friction', name: 'Friction Stay Hinge 12" (pair)', category: 'hardware', unit: 'pair', tradeCost: 12.50, retailCost: 18.00, partCode: 'WH-FSH' },
  { id: 'door_handle_lever', name: 'Door Handle Lever Set Chrome', category: 'hardware', unit: 'set', tradeCost: 18.50, retailCost: 28.00, partCode: 'DH-LEV' },
  { id: 'door_lock_multipoint', name: 'Multipoint Door Lock', category: 'hardware', unit: 'nr', tradeCost: 45.00, retailCost: 68.00, partCode: 'DL-MP' },
  { id: 'door_cylinder_euro', name: 'Euro Cylinder Lock 35/35', category: 'hardware', unit: 'nr', tradeCost: 15.50, retailCost: 24.00, partCode: 'DC-EU35' },
  
  // Glass & Seals
  { id: 'dgu_low_e', name: 'Double Glazed Unit Low-E Argon (m²)', category: 'glazing', unit: 'm²', tradeCost: 55.00, retailCost: 82.00, partCode: 'DGU-LE' },
  { id: 'tgu_triple', name: 'Triple Glazed Unit 4-12-4-12-4 (m²)', category: 'glazing', unit: 'm²', tradeCost: 85.00, retailCost: 125.00, partCode: 'TGU-TRP' },
  { id: 'window_seal_e_profile', name: 'E-Profile Window Seal 10m', category: 'seal', unit: 'roll', tradeCost: 4.50, retailCost: 6.80, partCode: 'WS-EP10' },
  { id: 'silicone_glazing_clear', name: 'Low Modulus Glazing Silicone Clear 310ml', category: 'consumable', unit: 'tube', tradeCost: 5.50, retailCost: 8.20, partCode: 'SIL-GCL' },
  { id: 'frame_fixing_100mm', name: 'Frame Fixing 10x100mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 18.50, retailCost: 28.00, partCode: 'FF-100' },
  { id: 'packers_mixed', name: 'Window Packers Mixed (bag 200)', category: 'fixing', unit: 'bag', tradeCost: 12.50, retailCost: 18.50, partCode: 'WP-MIX' },
  { id: 'expanding_foam_window', name: 'Low Expansion Window Foam 750ml', category: 'consumable', unit: 'can', tradeCost: 8.50, retailCost: 12.50, partCode: 'FOM-LEW' },
];

// ============================================
// HVAC COMPONENTS - Heating, Ventilation, AC
// ============================================
export const HVAC_COMPONENTS: DetailedComponent[] = [
  // Radiators
  { id: 'rad_type21_600x800', name: 'Type 21 Radiator 600x800mm', category: 'hvac', unit: 'nr', tradeCost: 85.00, retailCost: 125.00, partCode: 'RAD-21-68' },
  { id: 'rad_type21_600x1000', name: 'Type 21 Radiator 600x1000mm', category: 'hvac', unit: 'nr', tradeCost: 105.00, retailCost: 155.00, partCode: 'RAD-21-610' },
  { id: 'rad_type21_600x1200', name: 'Type 21 Radiator 600x1200mm', category: 'hvac', unit: 'nr', tradeCost: 125.00, retailCost: 185.00, partCode: 'RAD-21-612' },
  { id: 'rad_type22_600x1000', name: 'Type 22 Radiator 600x1000mm', category: 'hvac', unit: 'nr', tradeCost: 125.00, retailCost: 185.00, partCode: 'RAD-22-610' },
  { id: 'rad_type22_600x1400', name: 'Type 22 Radiator 600x1400mm', category: 'hvac', unit: 'nr', tradeCost: 165.00, retailCost: 245.00, partCode: 'RAD-22-614' },
  { id: 'rad_column_3col_600x600', name: 'Column Radiator 3-Col 600x600mm', category: 'hvac', unit: 'nr', tradeCost: 185.00, retailCost: 275.00, partCode: 'RAD-C3-66' },
  { id: 'rad_towel_1200x500', name: 'Towel Radiator 1200x500mm Chrome', category: 'hvac', unit: 'nr', tradeCost: 85.00, retailCost: 125.00, partCode: 'RAD-TR-125' },
  
  // Boilers
  { id: 'boiler_combi_25kw', name: 'Combi Boiler 25kW', category: 'hvac', unit: 'nr', tradeCost: 750.00, retailCost: 1100.00, partCode: 'BLR-C25' },
  { id: 'boiler_combi_30kw', name: 'Combi Boiler 30kW', category: 'hvac', unit: 'nr', tradeCost: 850.00, retailCost: 1250.00, partCode: 'BLR-C30' },
  { id: 'boiler_flue_horizontal', name: 'Horizontal Flue Kit 1m', category: 'hvac', unit: 'kit', tradeCost: 65.00, retailCost: 95.00, partCode: 'BLR-FLH' },
  
  // Underfloor Heating
  { id: 'ufh_mat_1m2', name: 'UFH Electric Mat 1m² 150W', category: 'hvac', unit: 'm²', tradeCost: 55.00, retailCost: 82.00, partCode: 'UFH-EM1' },
  { id: 'ufh_cable_kit_5m2', name: 'UFH Cable Kit 5m²', category: 'hvac', unit: 'kit', tradeCost: 145.00, retailCost: 215.00, partCode: 'UFH-CK5' },
  { id: 'ufh_thermostat', name: 'UFH Thermostat Digital', category: 'hvac', unit: 'nr', tradeCost: 55.00, retailCost: 82.00, partCode: 'UFH-TH' },
  { id: 'ufh_pipe_16mm_100m', name: 'UFH Pipe 16mm 100m Coil', category: 'hvac', unit: 'coil', tradeCost: 125.00, retailCost: 185.00, partCode: 'UFH-P16' },
  { id: 'ufh_manifold_4port', name: 'UFH Manifold 4-Port', category: 'hvac', unit: 'nr', tradeCost: 165.00, retailCost: 245.00, partCode: 'UFH-M4' },
  
  // Ventilation
  { id: 'extractor_100mm', name: 'Extractor Fan 100mm Standard', category: 'hvac', unit: 'nr', tradeCost: 18.50, retailCost: 28.00, partCode: 'EXT-100' },
  { id: 'extractor_100mm_timer', name: 'Extractor Fan 100mm Timer', category: 'hvac', unit: 'nr', tradeCost: 32.00, retailCost: 48.00, partCode: 'EXT-100T' },
  { id: 'extractor_100mm_humidistat', name: 'Extractor Fan 100mm Humidistat', category: 'hvac', unit: 'nr', tradeCost: 45.00, retailCost: 68.00, partCode: 'EXT-100H' },
  { id: 'inline_fan_100mm', name: 'Inline Duct Fan 100mm', category: 'hvac', unit: 'nr', tradeCost: 42.00, retailCost: 62.00, partCode: 'ILF-100' },
  { id: 'ducting_100mm_3m', name: 'Flexible Ducting 100mm 3m', category: 'hvac', unit: 'length', tradeCost: 8.50, retailCost: 12.50, partCode: 'DUCT-100' },
  { id: 'wall_vent_100mm', name: 'Wall Vent Kit 100mm', category: 'hvac', unit: 'kit', tradeCost: 12.50, retailCost: 18.50, partCode: 'WV-100' },
  
  // Air Conditioning
  { id: 'ac_split_2.5kw', name: 'Split AC Unit 2.5kW', category: 'hvac', unit: 'nr', tradeCost: 450.00, retailCost: 680.00, partCode: 'AC-S25' },
  { id: 'ac_split_3.5kw', name: 'Split AC Unit 3.5kW', category: 'hvac', unit: 'nr', tradeCost: 550.00, retailCost: 820.00, partCode: 'AC-S35' },
  { id: 'ac_split_5kw', name: 'Split AC Unit 5kW', category: 'hvac', unit: 'nr', tradeCost: 750.00, retailCost: 1120.00, partCode: 'AC-S50' },
  
  // TRV & Controls
  { id: 'trv_15', name: '15mm TRV (Thermostatic)', category: 'valve', unit: 'nr', tradeCost: 18.50, retailCost: 26.00, partCode: 'TRV15' },
  { id: 'lockshield_15', name: '15mm Lockshield Valve', category: 'valve', unit: 'nr', tradeCost: 6.50, retailCost: 9.50, partCode: 'LS15' },
  { id: 'smart_thermostat', name: 'Smart Thermostat WiFi', category: 'hvac', unit: 'nr', tradeCost: 145.00, retailCost: 215.00, partCode: 'ST-WIFI' },
  { id: 'room_thermostat', name: 'Room Thermostat Digital', category: 'hvac', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'RT-DIG' },
  { id: 'programmer_7day', name: '7-Day Programmer', category: 'hvac', unit: 'nr', tradeCost: 45.00, retailCost: 68.00, partCode: 'PROG-7D' },
];

// ============================================
// RENEWABLES COMPONENTS - Solar, Battery, Heat Pumps
// ============================================
export const RENEWABLES_COMPONENTS: DetailedComponent[] = [
  // Solar PV Panels
  { id: 'solar_panel_400w', name: 'Solar PV Panel 400W Mono', category: 'renewables', unit: 'nr', tradeCost: 125.00, retailCost: 185.00, partCode: 'SPV-400M' },
  { id: 'solar_panel_450w', name: 'Solar PV Panel 450W Mono', category: 'renewables', unit: 'nr', tradeCost: 145.00, retailCost: 215.00, partCode: 'SPV-450M' },
  { id: 'solar_panel_500w', name: 'Solar PV Panel 500W Mono', category: 'renewables', unit: 'nr', tradeCost: 175.00, retailCost: 265.00, partCode: 'SPV-500M' },
  { id: 'solar_panel_bifacial', name: 'Solar PV Panel 420W Bifacial', category: 'renewables', unit: 'nr', tradeCost: 165.00, retailCost: 245.00, partCode: 'SPV-420BF' },
  
  // Solar Mounting Systems
  { id: 'solar_rail_2m', name: 'Solar Mounting Rail 2m', category: 'renewables', unit: 'nr', tradeCost: 22.00, retailCost: 35.00, partCode: 'SMR-2M' },
  { id: 'solar_rail_3m', name: 'Solar Mounting Rail 3m', category: 'renewables', unit: 'nr', tradeCost: 32.00, retailCost: 48.00, partCode: 'SMR-3M' },
  { id: 'solar_clamp_mid', name: 'Solar Mid Clamp (pair)', category: 'renewables', unit: 'pair', tradeCost: 4.50, retailCost: 7.00, partCode: 'SC-MID' },
  { id: 'solar_clamp_end', name: 'Solar End Clamp (pair)', category: 'renewables', unit: 'pair', tradeCost: 5.50, retailCost: 8.50, partCode: 'SC-END' },
  { id: 'solar_roof_hook', name: 'Solar Roof Hook Tile', category: 'renewables', unit: 'nr', tradeCost: 8.50, retailCost: 14.00, partCode: 'SRH-T' },
  { id: 'solar_roof_hook_slate', name: 'Solar Roof Hook Slate', category: 'renewables', unit: 'nr', tradeCost: 12.00, retailCost: 18.00, partCode: 'SRH-S' },
  { id: 'solar_flat_mount', name: 'Solar Flat Roof Mount Kit', category: 'renewables', unit: 'kit', tradeCost: 85.00, retailCost: 125.00, partCode: 'SFRM' },
  { id: 'solar_ground_mount', name: 'Solar Ground Mount Frame (4 panel)', category: 'renewables', unit: 'kit', tradeCost: 285.00, retailCost: 425.00, partCode: 'SGM-4' },
  
  // Solar Inverters
  { id: 'inverter_3kw', name: 'Solar Inverter 3kW String', category: 'renewables', unit: 'nr', tradeCost: 650.00, retailCost: 950.00, partCode: 'INV-3K' },
  { id: 'inverter_4kw', name: 'Solar Inverter 4kW String', category: 'renewables', unit: 'nr', tradeCost: 780.00, retailCost: 1150.00, partCode: 'INV-4K' },
  { id: 'inverter_5kw', name: 'Solar Inverter 5kW String', category: 'renewables', unit: 'nr', tradeCost: 920.00, retailCost: 1350.00, partCode: 'INV-5K' },
  { id: 'inverter_6kw', name: 'Solar Inverter 6kW String', category: 'renewables', unit: 'nr', tradeCost: 1050.00, retailCost: 1550.00, partCode: 'INV-6K' },
  { id: 'inverter_hybrid_5kw', name: 'Hybrid Inverter 5kW (Battery Ready)', category: 'renewables', unit: 'nr', tradeCost: 1450.00, retailCost: 2150.00, partCode: 'INV-H5K' },
  { id: 'inverter_hybrid_8kw', name: 'Hybrid Inverter 8kW (Battery Ready)', category: 'renewables', unit: 'nr', tradeCost: 1850.00, retailCost: 2750.00, partCode: 'INV-H8K' },
  { id: 'microinverter_400', name: 'Microinverter 400W', category: 'renewables', unit: 'nr', tradeCost: 125.00, retailCost: 185.00, partCode: 'MI-400' },
  { id: 'optimiser_500', name: 'Power Optimiser 500W', category: 'renewables', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'PO-500' },
  
  // Battery Storage Systems
  { id: 'battery_5kwh', name: 'Home Battery 5kWh LiFePO4', category: 'renewables', unit: 'nr', tradeCost: 2850.00, retailCost: 4250.00, partCode: 'BAT-5K' },
  { id: 'battery_10kwh', name: 'Home Battery 10kWh LiFePO4', category: 'renewables', unit: 'nr', tradeCost: 4950.00, retailCost: 7450.00, partCode: 'BAT-10K' },
  { id: 'battery_13kwh', name: 'Home Battery 13.5kWh Tesla PW', category: 'renewables', unit: 'nr', tradeCost: 6850.00, retailCost: 9500.00, partCode: 'BAT-TPW' },
  { id: 'battery_module_2kwh', name: 'Battery Module 2.4kWh (stackable)', category: 'renewables', unit: 'nr', tradeCost: 1250.00, retailCost: 1850.00, partCode: 'BAT-M2' },
  { id: 'battery_bms', name: 'Battery Management System', category: 'renewables', unit: 'nr', tradeCost: 185.00, retailCost: 275.00, partCode: 'BMS' },
  { id: 'battery_cabinet', name: 'Battery Enclosure Cabinet', category: 'renewables', unit: 'nr', tradeCost: 145.00, retailCost: 215.00, partCode: 'BAT-CAB' },
  
  // Solar Cables & Connectors
  { id: 'solar_cable_4mm', name: 'Solar DC Cable 4mm² (100m)', category: 'renewables', unit: 'roll', tradeCost: 85.00, retailCost: 125.00, partCode: 'SDC-4' },
  { id: 'solar_cable_6mm', name: 'Solar DC Cable 6mm² (100m)', category: 'renewables', unit: 'roll', tradeCost: 115.00, retailCost: 175.00, partCode: 'SDC-6' },
  { id: 'mc4_connector_pair', name: 'MC4 Connector Pair', category: 'renewables', unit: 'pair', tradeCost: 3.50, retailCost: 5.50, partCode: 'MC4' },
  { id: 'mc4_branch_pair', name: 'MC4 Y-Branch Connector Pair', category: 'renewables', unit: 'pair', tradeCost: 8.50, retailCost: 13.00, partCode: 'MC4-Y' },
  { id: 'mc4_tool', name: 'MC4 Crimping Tool', category: 'tool', unit: 'nr', tradeCost: 45.00, retailCost: 68.00, partCode: 'MC4-T' },
  { id: 'solar_isolator_dc', name: 'DC Isolator 1000V 32A', category: 'renewables', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'ISO-DC' },
  { id: 'solar_isolator_ac', name: 'AC Isolator 20A', category: 'renewables', unit: 'nr', tradeCost: 18.00, retailCost: 28.00, partCode: 'ISO-AC' },
  { id: 'solar_surge_dc', name: 'DC Surge Protector Type II', category: 'renewables', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'SPD-DC' },
  
  // EV Chargers
  { id: 'ev_charger_7kw_untethered', name: 'EV Charger 7kW Untethered', category: 'renewables', unit: 'nr', tradeCost: 485.00, retailCost: 695.00, partCode: 'EVC-7U' },
  { id: 'ev_charger_7kw_tethered', name: 'EV Charger 7kW Tethered 5m', category: 'renewables', unit: 'nr', tradeCost: 550.00, retailCost: 795.00, partCode: 'EVC-7T' },
  { id: 'ev_charger_22kw', name: 'EV Charger 22kW 3-Phase', category: 'renewables', unit: 'nr', tradeCost: 950.00, retailCost: 1450.00, partCode: 'EVC-22' },
  { id: 'ev_charger_solar', name: 'EV Charger 7kW Solar Compatible', category: 'renewables', unit: 'nr', tradeCost: 650.00, retailCost: 950.00, partCode: 'EVC-SOL' },
  { id: 'ev_cable_type2', name: 'Type 2 EV Cable 5m', category: 'renewables', unit: 'nr', tradeCost: 125.00, retailCost: 185.00, partCode: 'EVC-T2' },
  { id: 'ev_post_mount', name: 'EV Charger Post Mount', category: 'renewables', unit: 'nr', tradeCost: 145.00, retailCost: 215.00, partCode: 'EVC-PM' },
  
  // Heat Pump Components
  { id: 'ashp_8kw', name: 'Air Source Heat Pump 8kW', category: 'renewables', unit: 'nr', tradeCost: 3850.00, retailCost: 5750.00, partCode: 'ASHP-8K' },
  { id: 'ashp_12kw', name: 'Air Source Heat Pump 12kW', category: 'renewables', unit: 'nr', tradeCost: 5250.00, retailCost: 7850.00, partCode: 'ASHP-12K' },
  { id: 'ashp_16kw', name: 'Air Source Heat Pump 16kW', category: 'renewables', unit: 'nr', tradeCost: 6450.00, retailCost: 9650.00, partCode: 'ASHP-16K' },
  { id: 'hp_buffer_100l', name: 'Heat Pump Buffer Tank 100L', category: 'renewables', unit: 'nr', tradeCost: 385.00, retailCost: 575.00, partCode: 'HPB-100' },
  { id: 'hp_buffer_200l', name: 'Heat Pump Buffer Tank 200L', category: 'renewables', unit: 'nr', tradeCost: 550.00, retailCost: 825.00, partCode: 'HPB-200' },
  { id: 'hp_cylinder_210l', name: 'Heat Pump Cylinder 210L', category: 'renewables', unit: 'nr', tradeCost: 1250.00, retailCost: 1850.00, partCode: 'HPC-210' },
  { id: 'hp_cylinder_300l', name: 'Heat Pump Cylinder 300L', category: 'renewables', unit: 'nr', tradeCost: 1650.00, retailCost: 2450.00, partCode: 'HPC-300' },
  { id: 'hp_flow_sensor', name: 'Heat Pump Flow Sensor', category: 'renewables', unit: 'nr', tradeCost: 85.00, retailCost: 125.00, partCode: 'HP-FS' },
  { id: 'hp_outdoor_unit_stand', name: 'ASHP Anti-Vibration Stand', category: 'renewables', unit: 'nr', tradeCost: 125.00, retailCost: 185.00, partCode: 'ASHP-ST' },
  { id: 'hp_refrigerant_pipe_5m', name: 'Refrigerant Pipe Set 5m', category: 'renewables', unit: 'set', tradeCost: 145.00, retailCost: 215.00, partCode: 'HP-RP5' },
  { id: 'hp_refrigerant_pipe_10m', name: 'Refrigerant Pipe Set 10m', category: 'renewables', unit: 'set', tradeCost: 250.00, retailCost: 375.00, partCode: 'HP-RP10' },
  
  // Smart Energy Management
  { id: 'smart_meter_clamp', name: 'CT Clamp Energy Monitor', category: 'renewables', unit: 'nr', tradeCost: 35.00, retailCost: 52.00, partCode: 'CT-MON' },
  { id: 'smart_energy_hub', name: 'Smart Energy Hub/Gateway', category: 'renewables', unit: 'nr', tradeCost: 185.00, retailCost: 275.00, partCode: 'SEH' },
  { id: 'solar_diverter', name: 'Solar Immersion Diverter', category: 'renewables', unit: 'nr', tradeCost: 285.00, retailCost: 425.00, partCode: 'SDIV' },
  { id: 'smart_thermostat_hp', name: 'Smart Thermostat Heat Pump Compatible', category: 'renewables', unit: 'nr', tradeCost: 165.00, retailCost: 245.00, partCode: 'STH-HP' },
  { id: 'energy_monitor_3ph', name: 'Energy Monitor 3-Phase', category: 'renewables', unit: 'nr', tradeCost: 225.00, retailCost: 335.00, partCode: 'EM-3P' },
  
  // MVHR / Ventilation
  { id: 'mvhr_unit', name: 'MVHR Unit 350m³/h', category: 'renewables', unit: 'nr', tradeCost: 1850.00, retailCost: 2750.00, partCode: 'MVHR-350' },
  { id: 'mvhr_duct_160', name: 'MVHR Duct 160mm (3m)', category: 'renewables', unit: 'length', tradeCost: 28.00, retailCost: 42.00, partCode: 'MVD-160' },
  { id: 'mvhr_vent_supply', name: 'MVHR Supply Valve', category: 'renewables', unit: 'nr', tradeCost: 22.00, retailCost: 35.00, partCode: 'MVV-S' },
  { id: 'mvhr_vent_extract', name: 'MVHR Extract Valve', category: 'renewables', unit: 'nr', tradeCost: 22.00, retailCost: 35.00, partCode: 'MVV-E' },
  { id: 'mvhr_silencer', name: 'MVHR Duct Silencer 160mm', category: 'renewables', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'MVS-160' },
  
  // Installation Consumables
  { id: 'solar_sealant', name: 'Solar Roof Sealant (310ml)', category: 'consumable', unit: 'nr', tradeCost: 8.50, retailCost: 12.50, partCode: 'SRS' },
  { id: 'cable_gland_solar', name: 'Weatherproof Cable Gland', category: 'renewables', unit: 'nr', tradeCost: 4.50, retailCost: 7.00, partCode: 'CG-W' },
  { id: 'earth_rod_1m', name: 'Earth Rod 1.2m with Clamp', category: 'renewables', unit: 'nr', tradeCost: 18.00, retailCost: 28.00, partCode: 'ER-1M' },
  { id: 'generation_meter', name: 'Generation Meter MID Approved', category: 'renewables', unit: 'nr', tradeCost: 65.00, retailCost: 95.00, partCode: 'GM-MID' },
  { id: 'g99_relay', name: 'G99 Protection Relay', category: 'renewables', unit: 'nr', tradeCost: 285.00, retailCost: 425.00, partCode: 'G99' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================
export function getAllComponentsForTrade(trade: string): DetailedComponent[] {
  switch (trade.toLowerCase()) {
    case 'plumbing':
    case 'plumbing & heating':
      return PLUMBING_COMPONENTS;
    case 'electrical':
      return ELECTRICAL_COMPONENTS;
    case 'carpentry':
    case 'carpentry & joinery':
      return CARPENTRY_COMPONENTS;
    case 'roofing':
      return ROOFING_COMPONENTS;
    case 'masonry':
    case 'bricklaying':
      return MASONRY_COMPONENTS;
    case 'insulation':
      return INSULATION_COMPONENTS;
    case 'safety':
      return SAFETY_COMPONENTS;
    case 'glazing':
      return GLAZING_COMPONENTS;
    case 'hvac':
    case 'heating':
      return HVAC_COMPONENTS;
    case 'renewables':
    case 'solar':
    case 'battery':
    case 'heat pump':
      return RENEWABLES_COMPONENTS;
    default:
      return [...PLUMBING_COMPONENTS, ...ELECTRICAL_COMPONENTS, ...CARPENTRY_COMPONENTS, ...GLAZING_COMPONENTS, ...HVAC_COMPONENTS, ...RENEWABLES_COMPONENTS];
  }
}

export function getComponentById(componentId: string): DetailedComponent | undefined {
  const allComponents = [
    ...PLUMBING_COMPONENTS,
    ...ELECTRICAL_COMPONENTS,
    ...CARPENTRY_COMPONENTS,
    ...ROOFING_COMPONENTS,
    ...MASONRY_COMPONENTS,
    ...INSULATION_COMPONENTS,
    ...SAFETY_COMPONENTS,
    ...GLAZING_COMPONENTS,
    ...HVAC_COMPONENTS,
    ...RENEWABLES_COMPONENTS,
  ];
  return allComponents.find(c => c.id === componentId);
}

export function getComponentsByCategory(category: DetailedComponent['category']): DetailedComponent[] {
  const allComponents = [
    ...PLUMBING_COMPONENTS,
    ...ELECTRICAL_COMPONENTS,
    ...CARPENTRY_COMPONENTS,
    ...ROOFING_COMPONENTS,
    ...MASONRY_COMPONENTS,
    ...INSULATION_COMPONENTS,
    ...SAFETY_COMPONENTS,
    ...GLAZING_COMPONENTS,
    ...HVAC_COMPONENTS,
    ...RENEWABLES_COMPONENTS,
  ];
  return allComponents.filter(c => c.category === category);
}

export function calculateComponentsCost(
  components: { component: DetailedComponent; quantity: number }[],
  useTradePrices: boolean
): number {
  return components.reduce((total, { component, quantity }) => {
    const price = useTradePrices ? component.tradeCost : component.retailCost;
    return total + (price * quantity);
  }, 0);
}

export function getRequiredComponentsForJob(tradeId: string, _jobId: string): DetailedComponent[] {
  // Map specific jobs to their required components
  return getAllComponentsForTrade(tradeId).slice(0, 20);
}
