// Expanded Glazing Components Library - Full Bill of Materials
// Includes Windows, Doors, Bifolds, Velux, Conservatories, Juliet Balconies
// All subcomponents including screws, fixings, seals, o-rings, etc.
// Based on Jan 2026 UK Trade Prices

import { DetailedComponent } from './detailed-components-data';

// ============================================
// WINDOWS - uPVC, Aluminium, Timber
// ============================================
export const WINDOW_COMPONENTS: DetailedComponent[] = [
  // uPVC Casement Windows
  { id: 'upvc_casement_600x900', name: 'uPVC Casement Window 600x900mm', category: 'glazing', unit: 'nr', tradeCost: 185.00, retailCost: 275.00, partCode: 'UW-6090' },
  { id: 'upvc_casement_900x1200', name: 'uPVC Casement Window 900x1200mm', category: 'glazing', unit: 'nr', tradeCost: 265.00, retailCost: 395.00, partCode: 'UW-9012' },
  { id: 'upvc_casement_1200x1200', name: 'uPVC Casement Window 1200x1200mm', category: 'glazing', unit: 'nr', tradeCost: 345.00, retailCost: 515.00, partCode: 'UW-1212' },
  { id: 'upvc_casement_1800x1200', name: 'uPVC Casement Window 1800x1200mm', category: 'glazing', unit: 'nr', tradeCost: 465.00, retailCost: 695.00, partCode: 'UW-1812' },
  
  // uPVC Tilt & Turn
  { id: 'upvc_tilt_turn_600x1200', name: 'uPVC Tilt & Turn 600x1200mm', category: 'glazing', unit: 'nr', tradeCost: 295.00, retailCost: 445.00, partCode: 'UTT-6012' },
  { id: 'upvc_tilt_turn_900x1500', name: 'uPVC Tilt & Turn 900x1500mm', category: 'glazing', unit: 'nr', tradeCost: 385.00, retailCost: 575.00, partCode: 'UTT-9015' },
  
  // Aluminium Windows
  { id: 'alu_casement_600x900', name: 'Aluminium Casement Window 600x900mm', category: 'glazing', unit: 'nr', tradeCost: 385.00, retailCost: 575.00, partCode: 'AW-6090' },
  { id: 'alu_casement_900x1200', name: 'Aluminium Casement Window 900x1200mm', category: 'glazing', unit: 'nr', tradeCost: 495.00, retailCost: 745.00, partCode: 'AW-9012' },
  { id: 'alu_casement_1200x1200', name: 'Aluminium Casement Window 1200x1200mm', category: 'glazing', unit: 'nr', tradeCost: 645.00, retailCost: 965.00, partCode: 'AW-1212' },
  { id: 'alu_casement_1800x1500', name: 'Aluminium Casement Window 1800x1500mm', category: 'glazing', unit: 'nr', tradeCost: 895.00, retailCost: 1345.00, partCode: 'AW-1815' },
  { id: 'alu_fixed_light_1200x2100', name: 'Aluminium Fixed Light 1200x2100mm', category: 'glazing', unit: 'nr', tradeCost: 545.00, retailCost: 815.00, partCode: 'AFL-1221' },
  
  // Timber Windows
  { id: 'timber_casement_600x900', name: 'Timber Casement Window 600x900mm', category: 'glazing', unit: 'nr', tradeCost: 425.00, retailCost: 635.00, partCode: 'TW-6090' },
  { id: 'timber_sash_900x1500', name: 'Timber Sash Window 900x1500mm', category: 'glazing', unit: 'nr', tradeCost: 850.00, retailCost: 1275.00, partCode: 'TSW-9015' },
  { id: 'timber_sash_1200x1800', name: 'Timber Sash Window 1200x1800mm', category: 'glazing', unit: 'nr', tradeCost: 1150.00, retailCost: 1725.00, partCode: 'TSW-1218' },
  
  // Bay Windows
  { id: 'bay_window_upvc_2400', name: 'uPVC Bay Window 2400mm Wide', category: 'glazing', unit: 'nr', tradeCost: 1850.00, retailCost: 2775.00, partCode: 'UBW-24' },
  { id: 'bay_window_alu_2400', name: 'Aluminium Bay Window 2400mm Wide', category: 'glazing', unit: 'nr', tradeCost: 2650.00, retailCost: 3975.00, partCode: 'ABW-24' },
  { id: 'bow_window_upvc_3000', name: 'uPVC Bow Window 3000mm Wide', category: 'glazing', unit: 'nr', tradeCost: 2450.00, retailCost: 3675.00, partCode: 'UBOW-30' },
];

// ============================================
// DOORS - External, Composite, French, Patio
// ============================================
export const DOOR_COMPONENTS: DetailedComponent[] = [
  // Composite Doors
  { id: 'composite_door_solid', name: 'Composite Front Door Solid', category: 'glazing', unit: 'nr', tradeCost: 685.00, retailCost: 1025.00, partCode: 'CFD-SOL' },
  { id: 'composite_door_glazed', name: 'Composite Front Door Half Glazed', category: 'glazing', unit: 'nr', tradeCost: 785.00, retailCost: 1175.00, partCode: 'CFD-GLZ' },
  { id: 'composite_door_full_glazed', name: 'Composite Front Door Full Glazed', category: 'glazing', unit: 'nr', tradeCost: 895.00, retailCost: 1345.00, partCode: 'CFD-FGL' },
  { id: 'composite_side_panel', name: 'Composite Side Panel 300mm', category: 'glazing', unit: 'nr', tradeCost: 385.00, retailCost: 575.00, partCode: 'CFD-SP3' },
  { id: 'composite_side_panel_450', name: 'Composite Side Panel 450mm', category: 'glazing', unit: 'nr', tradeCost: 445.00, retailCost: 665.00, partCode: 'CFD-SP45' },
  
  // uPVC Doors
  { id: 'upvc_back_door_half', name: 'uPVC Back Door Half Glazed', category: 'glazing', unit: 'nr', tradeCost: 385.00, retailCost: 575.00, partCode: 'UBD-HGL' },
  { id: 'upvc_back_door_full', name: 'uPVC Back Door Full Glazed', category: 'glazing', unit: 'nr', tradeCost: 445.00, retailCost: 665.00, partCode: 'UBD-FGL' },
  { id: 'upvc_stable_door', name: 'uPVC Stable Door', category: 'glazing', unit: 'nr', tradeCost: 585.00, retailCost: 875.00, partCode: 'USD-STA' },
  
  // French Doors
  { id: 'french_doors_upvc_1200', name: 'uPVC French Doors 1200mm', category: 'glazing', unit: 'pair', tradeCost: 685.00, retailCost: 1025.00, partCode: 'UFD-12' },
  { id: 'french_doors_upvc_1500', name: 'uPVC French Doors 1500mm', category: 'glazing', unit: 'pair', tradeCost: 785.00, retailCost: 1175.00, partCode: 'UFD-15' },
  { id: 'french_doors_upvc_1800', name: 'uPVC French Doors 1800mm', category: 'glazing', unit: 'pair', tradeCost: 895.00, retailCost: 1345.00, partCode: 'UFD-18' },
  { id: 'french_doors_alu_1500', name: 'Aluminium French Doors 1500mm', category: 'glazing', unit: 'pair', tradeCost: 1285.00, retailCost: 1925.00, partCode: 'AFD-15' },
  { id: 'french_doors_alu_1800', name: 'Aluminium French Doors 1800mm', category: 'glazing', unit: 'pair', tradeCost: 1485.00, retailCost: 2225.00, partCode: 'AFD-18' },
  
  // Patio Doors (Sliding)
  { id: 'patio_door_upvc_2100', name: 'uPVC Patio Door 2-Pane 2100mm', category: 'glazing', unit: 'nr', tradeCost: 685.00, retailCost: 1025.00, partCode: 'UPD-21' },
  { id: 'patio_door_upvc_2700', name: 'uPVC Patio Door 2-Pane 2700mm', category: 'glazing', unit: 'nr', tradeCost: 885.00, retailCost: 1325.00, partCode: 'UPD-27' },
  { id: 'patio_door_upvc_3000', name: 'uPVC Patio Door 3-Pane 3000mm', category: 'glazing', unit: 'nr', tradeCost: 1185.00, retailCost: 1775.00, partCode: 'UPD-30' },
  { id: 'patio_door_alu_2400', name: 'Aluminium Patio Door 2-Pane 2400mm', category: 'glazing', unit: 'nr', tradeCost: 1485.00, retailCost: 2225.00, partCode: 'APD-24' },
  { id: 'patio_door_alu_3000', name: 'Aluminium Patio Door 3-Pane 3000mm', category: 'glazing', unit: 'nr', tradeCost: 1985.00, retailCost: 2975.00, partCode: 'APD-30' },
];

// ============================================
// BIFOLD DOORS
// ============================================
export const BIFOLD_COMPONENTS: DetailedComponent[] = [
  // uPVC Bifolds
  { id: 'bifold_upvc_2_pane_1800', name: 'uPVC Bifold 2-Pane 1800mm', category: 'glazing', unit: 'nr', tradeCost: 1450.00, retailCost: 2175.00, partCode: 'UBF-2-18' },
  { id: 'bifold_upvc_3_pane_2400', name: 'uPVC Bifold 3-Pane 2400mm', category: 'glazing', unit: 'nr', tradeCost: 1950.00, retailCost: 2925.00, partCode: 'UBF-3-24' },
  { id: 'bifold_upvc_4_pane_3200', name: 'uPVC Bifold 4-Pane 3200mm', category: 'glazing', unit: 'nr', tradeCost: 2650.00, retailCost: 3975.00, partCode: 'UBF-4-32' },
  { id: 'bifold_upvc_5_pane_4000', name: 'uPVC Bifold 5-Pane 4000mm', category: 'glazing', unit: 'nr', tradeCost: 3250.00, retailCost: 4875.00, partCode: 'UBF-5-40' },
  
  // Aluminium Bifolds - Slimline
  { id: 'bifold_alu_2_pane_1800', name: 'Alu Slim Bifold 2-Pane 1800mm', category: 'glazing', unit: 'nr', tradeCost: 2150.00, retailCost: 3225.00, partCode: 'ABF-2-18' },
  { id: 'bifold_alu_3_pane_2400', name: 'Alu Slim Bifold 3-Pane 2400mm', category: 'glazing', unit: 'nr', tradeCost: 2850.00, retailCost: 4275.00, partCode: 'ABF-3-24' },
  { id: 'bifold_alu_3_pane_3000', name: 'Alu Slim Bifold 3-Pane 3000mm', category: 'glazing', unit: 'nr', tradeCost: 3250.00, retailCost: 4875.00, partCode: 'ABF-3-30' },
  { id: 'bifold_alu_4_pane_3200', name: 'Alu Slim Bifold 4-Pane 3200mm', category: 'glazing', unit: 'nr', tradeCost: 3850.00, retailCost: 5775.00, partCode: 'ABF-4-32' },
  { id: 'bifold_alu_4_pane_4000', name: 'Alu Slim Bifold 4-Pane 4000mm', category: 'glazing', unit: 'nr', tradeCost: 4450.00, retailCost: 6675.00, partCode: 'ABF-4-40' },
  { id: 'bifold_alu_5_pane_5000', name: 'Alu Slim Bifold 5-Pane 5000mm', category: 'glazing', unit: 'nr', tradeCost: 5650.00, retailCost: 8475.00, partCode: 'ABF-5-50' },
  { id: 'bifold_alu_6_pane_6000', name: 'Alu Slim Bifold 6-Pane 6000mm', category: 'glazing', unit: 'nr', tradeCost: 6850.00, retailCost: 10275.00, partCode: 'ABF-6-60' },
  
  // Bifold Hardware
  { id: 'bifold_track_top', name: 'Bifold Top Track (per metre)', category: 'hardware', unit: 'm', tradeCost: 45.00, retailCost: 68.00, partCode: 'BFT-TOP' },
  { id: 'bifold_track_bottom', name: 'Bifold Bottom Track (per metre)', category: 'hardware', unit: 'm', tradeCost: 38.00, retailCost: 57.00, partCode: 'BFT-BTM' },
  { id: 'bifold_hinge_set', name: 'Bifold Hinge Set (per leaf)', category: 'hardware', unit: 'set', tradeCost: 85.00, retailCost: 128.00, partCode: 'BFH-SET' },
  { id: 'bifold_roller_carriage', name: 'Bifold Roller Carriage', category: 'hardware', unit: 'nr', tradeCost: 65.00, retailCost: 98.00, partCode: 'BFR-CAR' },
  { id: 'bifold_drop_bolt', name: 'Bifold Drop Bolt', category: 'hardware', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'BF-DB' },
  { id: 'bifold_flush_bolt', name: 'Bifold Flush Bolt Pair', category: 'hardware', unit: 'pair', tradeCost: 35.00, retailCost: 52.00, partCode: 'BF-FB' },
];

// ============================================
// VELUX & ROOF WINDOWS
// ============================================
export const VELUX_COMPONENTS: DetailedComponent[] = [
  // Centre Pivot Velux
  { id: 'velux_ck02_550x780', name: 'VELUX GGL CK02 550x780mm Pine', category: 'glazing', unit: 'nr', tradeCost: 385.00, retailCost: 578.00, partCode: 'V-CK02' },
  { id: 'velux_mk04_780x980', name: 'VELUX GGL MK04 780x980mm Pine', category: 'glazing', unit: 'nr', tradeCost: 425.00, retailCost: 638.00, partCode: 'V-MK04' },
  { id: 'velux_mk06_780x1180', name: 'VELUX GGL MK06 780x1180mm Pine', category: 'glazing', unit: 'nr', tradeCost: 485.00, retailCost: 728.00, partCode: 'V-MK06' },
  { id: 'velux_mk08_780x1400', name: 'VELUX GGL MK08 780x1400mm Pine', category: 'glazing', unit: 'nr', tradeCost: 545.00, retailCost: 818.00, partCode: 'V-MK08' },
  { id: 'velux_pk08_940x1400', name: 'VELUX GGL PK08 940x1400mm Pine', category: 'glazing', unit: 'nr', tradeCost: 595.00, retailCost: 893.00, partCode: 'V-PK08' },
  { id: 'velux_sk06_1140x1180', name: 'VELUX GGL SK06 1140x1180mm Pine', category: 'glazing', unit: 'nr', tradeCost: 585.00, retailCost: 878.00, partCode: 'V-SK06' },
  { id: 'velux_uk04_1340x980', name: 'VELUX GGL UK04 1340x980mm Pine', category: 'glazing', unit: 'nr', tradeCost: 625.00, retailCost: 938.00, partCode: 'V-UK04' },
  { id: 'velux_uk08_1340x1400', name: 'VELUX GGL UK08 1340x1400mm Pine', category: 'glazing', unit: 'nr', tradeCost: 725.00, retailCost: 1088.00, partCode: 'V-UK08' },
  
  // White Polyurethane Velux
  { id: 'velux_ggu_mk04', name: 'VELUX GGU MK04 780x980mm White PU', category: 'glazing', unit: 'nr', tradeCost: 485.00, retailCost: 728.00, partCode: 'VU-MK04' },
  { id: 'velux_ggu_mk06', name: 'VELUX GGU MK06 780x1180mm White PU', category: 'glazing', unit: 'nr', tradeCost: 545.00, retailCost: 818.00, partCode: 'VU-MK06' },
  { id: 'velux_ggu_mk08', name: 'VELUX GGU MK08 780x1400mm White PU', category: 'glazing', unit: 'nr', tradeCost: 625.00, retailCost: 938.00, partCode: 'VU-MK08' },
  
  // Top-Hung Velux
  { id: 'velux_gpu_mk04', name: 'VELUX GPU Top-Hung MK04 780x980mm', category: 'glazing', unit: 'nr', tradeCost: 585.00, retailCost: 878.00, partCode: 'GPU-MK04' },
  { id: 'velux_gpu_mk08', name: 'VELUX GPU Top-Hung MK08 780x1400mm', category: 'glazing', unit: 'nr', tradeCost: 745.00, retailCost: 1118.00, partCode: 'GPU-MK08' },
  
  // Electric / Solar Velux
  { id: 'velux_integra_mk04', name: 'VELUX INTEGRA Electric MK04', category: 'glazing', unit: 'nr', tradeCost: 895.00, retailCost: 1343.00, partCode: 'VI-MK04' },
  { id: 'velux_integra_mk06', name: 'VELUX INTEGRA Electric MK06', category: 'glazing', unit: 'nr', tradeCost: 985.00, retailCost: 1478.00, partCode: 'VI-MK06' },
  { id: 'velux_integra_mk08', name: 'VELUX INTEGRA Electric MK08', category: 'glazing', unit: 'nr', tradeCost: 1085.00, retailCost: 1628.00, partCode: 'VI-MK08' },
  { id: 'velux_solar_mk04', name: 'VELUX INTEGRA Solar MK04', category: 'glazing', unit: 'nr', tradeCost: 1185.00, retailCost: 1778.00, partCode: 'VS-MK04' },
  { id: 'velux_solar_mk08', name: 'VELUX INTEGRA Solar MK08', category: 'glazing', unit: 'nr', tradeCost: 1385.00, retailCost: 2078.00, partCode: 'VS-MK08' },
  
  // Velux Flashings
  { id: 'velux_flashing_edw_mk04', name: 'VELUX EDW Tile Flashing MK04', category: 'glazing', unit: 'nr', tradeCost: 85.00, retailCost: 128.00, partCode: 'VFL-EDW-MK04' },
  { id: 'velux_flashing_edw_mk06', name: 'VELUX EDW Tile Flashing MK06', category: 'glazing', unit: 'nr', tradeCost: 95.00, retailCost: 143.00, partCode: 'VFL-EDW-MK06' },
  { id: 'velux_flashing_edw_mk08', name: 'VELUX EDW Tile Flashing MK08', category: 'glazing', unit: 'nr', tradeCost: 105.00, retailCost: 158.00, partCode: 'VFL-EDW-MK08' },
  { id: 'velux_flashing_edl_mk04', name: 'VELUX EDL Slate Flashing MK04', category: 'glazing', unit: 'nr', tradeCost: 95.00, retailCost: 143.00, partCode: 'VFL-EDL-MK04' },
  { id: 'velux_flashing_edl_mk06', name: 'VELUX EDL Slate Flashing MK06', category: 'glazing', unit: 'nr', tradeCost: 105.00, retailCost: 158.00, partCode: 'VFL-EDL-MK06' },
  { id: 'velux_flashing_edl_mk08', name: 'VELUX EDL Slate Flashing MK08', category: 'glazing', unit: 'nr', tradeCost: 115.00, retailCost: 173.00, partCode: 'VFL-EDL-MK08' },
  { id: 'velux_flashing_combo_ekw', name: 'VELUX EKW Combi Flashing Kit', category: 'glazing', unit: 'kit', tradeCost: 185.00, retailCost: 278.00, partCode: 'VFL-EKW' },
  
  // Velux Accessories
  { id: 'velux_insulation_collar', name: 'VELUX BDX Insulation Collar', category: 'glazing', unit: 'nr', tradeCost: 125.00, retailCost: 188.00, partCode: 'V-BDX' },
  { id: 'velux_lining_kit_lsb', name: 'VELUX LSB Lining Kit MK04', category: 'glazing', unit: 'kit', tradeCost: 145.00, retailCost: 218.00, partCode: 'V-LSB' },
  { id: 'velux_vapour_barrier', name: 'VELUX BBX Vapour Barrier', category: 'glazing', unit: 'nr', tradeCost: 35.00, retailCost: 53.00, partCode: 'V-BBX' },
  { id: 'velux_control_rod', name: 'VELUX ZCT Control Rod 100cm', category: 'glazing', unit: 'nr', tradeCost: 28.00, retailCost: 42.00, partCode: 'V-ZCT' },
  { id: 'velux_blind_blackout', name: 'VELUX Blackout Blind MK04', category: 'glazing', unit: 'nr', tradeCost: 85.00, retailCost: 128.00, partCode: 'V-DKL' },
  { id: 'velux_blind_venetian', name: 'VELUX Venetian Blind MK04', category: 'glazing', unit: 'nr', tradeCost: 125.00, retailCost: 188.00, partCode: 'V-PAL' },
];

// ============================================
// JULIET BALCONIES
// ============================================
export const JULIET_BALCONY_COMPONENTS: DetailedComponent[] = [
  // Glass Juliet Balconies
  { id: 'juliet_glass_1000', name: 'Glass Juliet Balcony 1000mm', category: 'glazing', unit: 'nr', tradeCost: 285.00, retailCost: 428.00, partCode: 'JB-G10' },
  { id: 'juliet_glass_1200', name: 'Glass Juliet Balcony 1200mm', category: 'glazing', unit: 'nr', tradeCost: 345.00, retailCost: 518.00, partCode: 'JB-G12' },
  { id: 'juliet_glass_1500', name: 'Glass Juliet Balcony 1500mm', category: 'glazing', unit: 'nr', tradeCost: 425.00, retailCost: 638.00, partCode: 'JB-G15' },
  { id: 'juliet_glass_1800', name: 'Glass Juliet Balcony 1800mm', category: 'glazing', unit: 'nr', tradeCost: 485.00, retailCost: 728.00, partCode: 'JB-G18' },
  { id: 'juliet_glass_2100', name: 'Glass Juliet Balcony 2100mm', category: 'glazing', unit: 'nr', tradeCost: 545.00, retailCost: 818.00, partCode: 'JB-G21' },
  { id: 'juliet_glass_2400', name: 'Glass Juliet Balcony 2400mm', category: 'glazing', unit: 'nr', tradeCost: 625.00, retailCost: 938.00, partCode: 'JB-G24' },
  { id: 'juliet_glass_3000', name: 'Glass Juliet Balcony 3000mm', category: 'glazing', unit: 'nr', tradeCost: 745.00, retailCost: 1118.00, partCode: 'JB-G30' },
  
  // Steel Bar Juliet Balconies
  { id: 'juliet_steel_1000', name: 'Steel Bar Juliet 1000mm Black', category: 'glazing', unit: 'nr', tradeCost: 145.00, retailCost: 218.00, partCode: 'JB-S10' },
  { id: 'juliet_steel_1200', name: 'Steel Bar Juliet 1200mm Black', category: 'glazing', unit: 'nr', tradeCost: 165.00, retailCost: 248.00, partCode: 'JB-S12' },
  { id: 'juliet_steel_1500', name: 'Steel Bar Juliet 1500mm Black', category: 'glazing', unit: 'nr', tradeCost: 195.00, retailCost: 293.00, partCode: 'JB-S15' },
  { id: 'juliet_steel_1800', name: 'Steel Bar Juliet 1800mm Black', category: 'glazing', unit: 'nr', tradeCost: 225.00, retailCost: 338.00, partCode: 'JB-S18' },
  
  // Juliet Balcony Fixings
  { id: 'juliet_fixing_kit', name: 'Juliet Balcony Fixing Kit', category: 'fixing', unit: 'kit', tradeCost: 35.00, retailCost: 53.00, partCode: 'JB-FIX' },
  { id: 'juliet_standoff_50mm', name: 'Glass Standoff 50mm (set 4)', category: 'fixing', unit: 'set', tradeCost: 45.00, retailCost: 68.00, partCode: 'JB-SO50' },
  { id: 'juliet_side_mount', name: 'Juliet Side Mount Bracket', category: 'fixing', unit: 'pair', tradeCost: 55.00, retailCost: 83.00, partCode: 'JB-SMB' },
];

// ============================================
// CONSERVATORIES
// ============================================
export const CONSERVATORY_COMPONENTS: DetailedComponent[] = [
  // Lean-to Conservatories
  { id: 'conserv_lean_3x2', name: 'Lean-to Conservatory 3x2m uPVC', category: 'glazing', unit: 'kit', tradeCost: 3850.00, retailCost: 5775.00, partCode: 'CLT-32' },
  { id: 'conserv_lean_3x3', name: 'Lean-to Conservatory 3x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 4650.00, retailCost: 6975.00, partCode: 'CLT-33' },
  { id: 'conserv_lean_4x3', name: 'Lean-to Conservatory 4x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 5450.00, retailCost: 8175.00, partCode: 'CLT-43' },
  { id: 'conserv_lean_5x3', name: 'Lean-to Conservatory 5x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 6450.00, retailCost: 9675.00, partCode: 'CLT-53' },
  
  // Edwardian Conservatories
  { id: 'conserv_edwardian_3x3', name: 'Edwardian Conservatory 3x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 5850.00, retailCost: 8775.00, partCode: 'CED-33' },
  { id: 'conserv_edwardian_4x3', name: 'Edwardian Conservatory 4x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 6850.00, retailCost: 10275.00, partCode: 'CED-43' },
  { id: 'conserv_edwardian_4x4', name: 'Edwardian Conservatory 4x4m uPVC', category: 'glazing', unit: 'kit', tradeCost: 8250.00, retailCost: 12375.00, partCode: 'CED-44' },
  
  // Victorian Conservatories
  { id: 'conserv_victorian_3x3', name: 'Victorian Conservatory 3x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 6450.00, retailCost: 9675.00, partCode: 'CVC-33' },
  { id: 'conserv_victorian_4x3', name: 'Victorian Conservatory 4x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 7650.00, retailCost: 11475.00, partCode: 'CVC-43' },
  { id: 'conserv_victorian_5x3', name: 'Victorian Conservatory 5x3m uPVC', category: 'glazing', unit: 'kit', tradeCost: 8850.00, retailCost: 13275.00, partCode: 'CVC-53' },
  
  // P-Shape Conservatories
  { id: 'conserv_pshape_4x4', name: 'P-Shape Conservatory 4x4m uPVC', category: 'glazing', unit: 'kit', tradeCost: 9850.00, retailCost: 14775.00, partCode: 'CPS-44' },
  { id: 'conserv_pshape_5x4', name: 'P-Shape Conservatory 5x4m uPVC', category: 'glazing', unit: 'kit', tradeCost: 11850.00, retailCost: 17775.00, partCode: 'CPS-54' },
  
  // Conservatory Roofing
  { id: 'conserv_roof_poly_clear', name: 'Polycarbonate Roof 25mm Clear (m²)', category: 'glazing', unit: 'm²', tradeCost: 42.00, retailCost: 63.00, partCode: 'CRF-PC' },
  { id: 'conserv_roof_poly_opal', name: 'Polycarbonate Roof 25mm Opal (m²)', category: 'glazing', unit: 'm²', tradeCost: 45.00, retailCost: 68.00, partCode: 'CRF-PO' },
  { id: 'conserv_roof_glass_self', name: 'Self-Cleaning Glass Roof (m²)', category: 'glazing', unit: 'm²', tradeCost: 185.00, retailCost: 278.00, partCode: 'CRF-SCG' },
  { id: 'conserv_roof_solid_tile', name: 'Solid Tiled Roof Conversion (m²)', category: 'glazing', unit: 'm²', tradeCost: 285.00, retailCost: 428.00, partCode: 'CRF-TIL' },
  { id: 'conserv_roof_hybrid', name: 'Hybrid Roof (solid + glass)', category: 'glazing', unit: 'm²', tradeCost: 225.00, retailCost: 338.00, partCode: 'CRF-HYB' },
  
  // Conservatory Components
  { id: 'conserv_ridge_beam', name: 'Conservatory Ridge Beam (per m)', category: 'glazing', unit: 'm', tradeCost: 65.00, retailCost: 98.00, partCode: 'CRB-M' },
  { id: 'conserv_ring_beam', name: 'Conservatory Ring Beam System', category: 'glazing', unit: 'set', tradeCost: 450.00, retailCost: 675.00, partCode: 'CRING' },
  { id: 'conserv_dwarf_wall_per_m', name: 'Dwarf Wall per Linear Metre', category: 'glazing', unit: 'm', tradeCost: 125.00, retailCost: 188.00, partCode: 'CDW-M' },
  { id: 'conserv_base_kit', name: 'Conservatory Base Kit (steelwork)', category: 'glazing', unit: 'kit', tradeCost: 850.00, retailCost: 1275.00, partCode: 'CBK' },
];

// ============================================
// FIXINGS, SEALS, O-RINGS & CONSUMABLES
// ============================================
export const GLAZING_FIXINGS_CONSUMABLES: DetailedComponent[] = [
  // Frame Fixings
  { id: 'frame_fixing_80', name: 'Frame Fixing 10x80mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 15.50, retailCost: 23.00, partCode: 'FF-80' },
  { id: 'frame_fixing_100', name: 'Frame Fixing 10x100mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 18.50, retailCost: 28.00, partCode: 'FF-100' },
  { id: 'frame_fixing_120', name: 'Frame Fixing 10x120mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 22.50, retailCost: 34.00, partCode: 'FF-120' },
  { id: 'frame_fixing_150', name: 'Frame Fixing 10x150mm (box 50)', category: 'fixing', unit: 'box', tradeCost: 18.50, retailCost: 28.00, partCode: 'FF-150' },
  
  // Screws
  { id: 'screw_4x25_ss', name: 'S/S Screw 4x25mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 8.50, retailCost: 13.00, partCode: 'SS-425' },
  { id: 'screw_4x40_ss', name: 'S/S Screw 4x40mm (box 200)', category: 'fixing', unit: 'box', tradeCost: 9.50, retailCost: 14.00, partCode: 'SS-440' },
  { id: 'screw_5x50_ss', name: 'S/S Screw 5x50mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 8.50, retailCost: 13.00, partCode: 'SS-550' },
  { id: 'screw_self_drill_4x25', name: 'Self-Drill Screw 4x25mm (box 500)', category: 'fixing', unit: 'box', tradeCost: 12.50, retailCost: 19.00, partCode: 'SD-425' },
  { id: 'screw_conserv_75', name: 'Conservatory Roof Screw 75mm (box 100)', category: 'fixing', unit: 'box', tradeCost: 15.50, retailCost: 23.00, partCode: 'CRS-75' },
  
  // Packers & Shims
  { id: 'packers_mixed_200', name: 'Window Packers Mixed (bag 200)', category: 'fixing', unit: 'bag', tradeCost: 12.50, retailCost: 19.00, partCode: 'WP-MIX' },
  { id: 'packers_1mm', name: 'Packers 1mm (bag 100)', category: 'fixing', unit: 'bag', tradeCost: 5.50, retailCost: 8.00, partCode: 'WP-1' },
  { id: 'packers_2mm', name: 'Packers 2mm (bag 100)', category: 'fixing', unit: 'bag', tradeCost: 5.50, retailCost: 8.00, partCode: 'WP-2' },
  { id: 'packers_3mm', name: 'Packers 3mm (bag 100)', category: 'fixing', unit: 'bag', tradeCost: 5.50, retailCost: 8.00, partCode: 'WP-3' },
  { id: 'packers_5mm', name: 'Packers 5mm (bag 100)', category: 'fixing', unit: 'bag', tradeCost: 5.50, retailCost: 8.00, partCode: 'WP-5' },
  { id: 'glazing_bridge', name: 'Glazing Bridge Pack', category: 'fixing', unit: 'pack', tradeCost: 4.50, retailCost: 7.00, partCode: 'GB-PK' },
  
  // Seals & Gaskets
  { id: 'seal_e_profile_10m', name: 'E-Profile Seal 10m Roll', category: 'seal', unit: 'roll', tradeCost: 4.50, retailCost: 7.00, partCode: 'SE-E10' },
  { id: 'seal_d_profile_10m', name: 'D-Profile Seal 10m Roll', category: 'seal', unit: 'roll', tradeCost: 5.50, retailCost: 8.00, partCode: 'SE-D10' },
  { id: 'seal_p_profile_10m', name: 'P-Profile Seal 10m Roll', category: 'seal', unit: 'roll', tradeCost: 4.95, retailCost: 7.50, partCode: 'SE-P10' },
  { id: 'seal_wedge_gasket', name: 'Wedge Gasket 50m Roll', category: 'seal', unit: 'roll', tradeCost: 18.50, retailCost: 28.00, partCode: 'SWG-50' },
  { id: 'seal_bubble_gasket', name: 'Bubble Gasket 50m Roll', category: 'seal', unit: 'roll', tradeCost: 22.50, retailCost: 34.00, partCode: 'SBG-50' },
  { id: 'seal_flipper_gasket', name: 'Flipper Gasket 50m Roll', category: 'seal', unit: 'roll', tradeCost: 24.50, retailCost: 37.00, partCode: 'SFG-50' },
  { id: 'seal_wool_pile_5mm', name: 'Wool Pile 5mm x 100m', category: 'seal', unit: 'roll', tradeCost: 15.50, retailCost: 23.00, partCode: 'SWP-5' },
  { id: 'seal_wool_pile_7mm', name: 'Wool Pile 7mm x 100m', category: 'seal', unit: 'roll', tradeCost: 18.50, retailCost: 28.00, partCode: 'SWP-7' },
  
  // O-Rings
  { id: 'oring_set_upvc', name: 'uPVC O-Ring Assortment (225pc)', category: 'seal', unit: 'set', tradeCost: 18.50, retailCost: 28.00, partCode: 'OR-UPVC' },
  { id: 'oring_glazing_10mm', name: 'Glazing O-Ring 10mm (pack 50)', category: 'seal', unit: 'pack', tradeCost: 8.50, retailCost: 13.00, partCode: 'OR-10' },
  { id: 'oring_glazing_15mm', name: 'Glazing O-Ring 15mm (pack 50)', category: 'seal', unit: 'pack', tradeCost: 9.50, retailCost: 14.00, partCode: 'OR-15' },
  { id: 'oring_cylinder_euro', name: 'Euro Cylinder O-Rings (pack 20)', category: 'seal', unit: 'pack', tradeCost: 5.50, retailCost: 8.00, partCode: 'OR-EC' },
  { id: 'oring_handle_stem', name: 'Handle Stem O-Rings (pack 20)', category: 'seal', unit: 'pack', tradeCost: 4.50, retailCost: 7.00, partCode: 'OR-HS' },
  
  // Sealants & Adhesives
  { id: 'silicone_frame_white', name: 'Frame Silicone White 310ml', category: 'consumable', unit: 'tube', tradeCost: 4.50, retailCost: 7.00, partCode: 'SIL-FW' },
  { id: 'silicone_frame_brown', name: 'Frame Silicone Brown 310ml', category: 'consumable', unit: 'tube', tradeCost: 4.50, retailCost: 7.00, partCode: 'SIL-FB' },
  { id: 'silicone_frame_black', name: 'Frame Silicone Black 310ml', category: 'consumable', unit: 'tube', tradeCost: 4.50, retailCost: 7.00, partCode: 'SIL-FK' },
  { id: 'silicone_glazing_clear', name: 'Low Mod Glazing Silicone Clear 310ml', category: 'consumable', unit: 'tube', tradeCost: 5.50, retailCost: 8.00, partCode: 'SIL-GC' },
  { id: 'silicone_neutral_cure', name: 'Neutral Cure Silicone 310ml', category: 'consumable', unit: 'tube', tradeCost: 6.50, retailCost: 10.00, partCode: 'SIL-NC' },
  { id: 'butyl_tape_6mm', name: 'Butyl Tape 6mm x 10m', category: 'consumable', unit: 'roll', tradeCost: 5.50, retailCost: 8.00, partCode: 'BT-6' },
  { id: 'butyl_tape_9mm', name: 'Butyl Tape 9mm x 10m', category: 'consumable', unit: 'roll', tradeCost: 6.50, retailCost: 10.00, partCode: 'BT-9' },
  { id: 'foam_tape_3x9', name: 'Foam Tape 3x9mm x 10m', category: 'consumable', unit: 'roll', tradeCost: 3.50, retailCost: 5.00, partCode: 'FT-39' },
  { id: 'expanding_foam_750', name: 'Expanding Foam 750ml', category: 'consumable', unit: 'can', tradeCost: 5.50, retailCost: 8.00, partCode: 'EF-750' },
  { id: 'expanding_foam_low', name: 'Low Expansion Window Foam 750ml', category: 'consumable', unit: 'can', tradeCost: 8.50, retailCost: 13.00, partCode: 'EF-LOW' },
  { id: 'foam_cleaner', name: 'Foam Cleaner 500ml', category: 'consumable', unit: 'can', tradeCost: 6.50, retailCost: 10.00, partCode: 'FC-500' },
  
  // Hardware
  { id: 'handle_espag_white', name: 'Espag Window Handle White', category: 'hardware', unit: 'nr', tradeCost: 6.50, retailCost: 10.00, partCode: 'WH-EW' },
  { id: 'handle_espag_chrome', name: 'Espag Window Handle Chrome', category: 'hardware', unit: 'nr', tradeCost: 8.50, retailCost: 13.00, partCode: 'WH-EC' },
  { id: 'handle_espag_gold', name: 'Espag Window Handle Gold', category: 'hardware', unit: 'nr', tradeCost: 8.50, retailCost: 13.00, partCode: 'WH-EG' },
  { id: 'hinge_friction_12', name: 'Friction Stay Hinge 12" (pair)', category: 'hardware', unit: 'pair', tradeCost: 12.50, retailCost: 19.00, partCode: 'FSH-12' },
  { id: 'hinge_friction_16', name: 'Friction Stay Hinge 16" (pair)', category: 'hardware', unit: 'pair', tradeCost: 14.50, retailCost: 22.00, partCode: 'FSH-16' },
  { id: 'hinge_friction_20', name: 'Friction Stay Hinge 20" (pair)', category: 'hardware', unit: 'pair', tradeCost: 16.50, retailCost: 25.00, partCode: 'FSH-20' },
  { id: 'espag_lock_20mm', name: 'Espag Lock 20mm Backset', category: 'hardware', unit: 'nr', tradeCost: 18.50, retailCost: 28.00, partCode: 'EL-20' },
  { id: 'multipoint_lock', name: 'Multipoint Door Lock', category: 'hardware', unit: 'nr', tradeCost: 45.00, retailCost: 68.00, partCode: 'MPL' },
  { id: 'euro_cylinder_35_35', name: 'Euro Cylinder 35/35 Anti-Snap', category: 'hardware', unit: 'nr', tradeCost: 15.50, retailCost: 23.00, partCode: 'EC-35' },
  { id: 'euro_cylinder_40_40', name: 'Euro Cylinder 40/40 Anti-Snap', category: 'hardware', unit: 'nr', tradeCost: 18.50, retailCost: 28.00, partCode: 'EC-40' },
  { id: 'euro_cylinder_45_45', name: 'Euro Cylinder 45/45 Anti-Snap', category: 'hardware', unit: 'nr', tradeCost: 22.50, retailCost: 34.00, partCode: 'EC-45' },
  { id: 'door_handle_lever_ch', name: 'Door Lever Handle Chrome', category: 'hardware', unit: 'set', tradeCost: 18.50, retailCost: 28.00, partCode: 'DHL-CH' },
  { id: 'door_letter_plate', name: 'Letter Plate Chrome', category: 'hardware', unit: 'nr', tradeCost: 15.50, retailCost: 23.00, partCode: 'LP-CH' },
  { id: 'door_knocker', name: 'Door Knocker Chrome', category: 'hardware', unit: 'nr', tradeCost: 18.50, retailCost: 28.00, partCode: 'DK-CH' },
  { id: 'door_viewer', name: 'Door Viewer Wide Angle', category: 'hardware', unit: 'nr', tradeCost: 8.50, retailCost: 13.00, partCode: 'DV-WA' },
  { id: 'security_chain', name: 'Security Chain Chrome', category: 'hardware', unit: 'nr', tradeCost: 12.50, retailCost: 19.00, partCode: 'SC-CH' },
  
  // Glazing Units
  { id: 'dgu_4_16_4_std', name: 'DGU 4-16-4mm Standard (m²)', category: 'glazing', unit: 'm²', tradeCost: 45.00, retailCost: 68.00, partCode: 'DGU-STD' },
  { id: 'dgu_4_16_4_lowe', name: 'DGU 4-16-4mm Low-E Argon (m²)', category: 'glazing', unit: 'm²', tradeCost: 55.00, retailCost: 83.00, partCode: 'DGU-LE' },
  { id: 'tgu_4_12_4_12_4', name: 'TGU Triple Glazed (m²)', category: 'glazing', unit: 'm²', tradeCost: 85.00, retailCost: 128.00, partCode: 'TGU' },
  { id: 'obscure_glass', name: 'Obscure Glazing Upgrade (m²)', category: 'glazing', unit: 'm²', tradeCost: 15.00, retailCost: 23.00, partCode: 'OG-UP' },
  { id: 'toughened_upgrade', name: 'Toughened Glass Upgrade (m²)', category: 'glazing', unit: 'm²', tradeCost: 25.00, retailCost: 38.00, partCode: 'TG-UP' },
  { id: 'laminated_upgrade', name: 'Laminated Glass Upgrade (m²)', category: 'glazing', unit: 'm²', tradeCost: 35.00, retailCost: 53.00, partCode: 'LG-UP' },
];

// Combined Glazing Export
export const ALL_GLAZING_COMPONENTS: DetailedComponent[] = [
  ...WINDOW_COMPONENTS,
  ...DOOR_COMPONENTS,
  ...BIFOLD_COMPONENTS,
  ...VELUX_COMPONENTS,
  ...JULIET_BALCONY_COMPONENTS,
  ...CONSERVATORY_COMPONENTS,
  ...GLAZING_FIXINGS_CONSUMABLES,
];

// Helper to get components by category
export const getGlazingComponentsByCategory = (category: string): DetailedComponent[] => {
  return ALL_GLAZING_COMPONENTS.filter(c => c.category === category);
};

// Get all fixings and consumables for a glazing job
export const getGlazingJobConsumables = (jobType: 'window' | 'door' | 'bifold' | 'velux' | 'juliet' | 'conservatory'): DetailedComponent[] => {
  const baseConsumables = GLAZING_FIXINGS_CONSUMABLES.filter(c => 
    ['fixing', 'seal', 'consumable'].includes(c.category)
  );
  
  switch (jobType) {
    case 'velux':
      return baseConsumables.filter(c => 
        c.id.includes('screw') || c.id.includes('foam') || c.id.includes('silicone') || c.id.includes('seal')
      );
    case 'bifold':
      return baseConsumables.filter(c => 
        c.id.includes('frame') || c.id.includes('foam') || c.id.includes('silicone') || c.id.includes('packer')
      );
    case 'conservatory':
      return baseConsumables;
    default:
      return baseConsumables.filter(c => 
        c.id.includes('frame') || c.id.includes('foam') || c.id.includes('silicone') || c.id.includes('packer') || c.id.includes('seal')
      );
  }
};
