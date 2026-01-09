// Electrical Module Data - Consumer Unit Calculations, Cable Sizing, Part P Compliance

export const CONSUMER_UNIT_TYPES = [
  { id: "split_load", name: "Split Load CU", description: "Main switch + 2 RCDs protecting circuits", maxWays: 12 },
  { id: "rcbo", name: "Full RCBO Board", description: "Individual RCBO per circuit", maxWays: 16 },
  { id: "dual_rcd", name: "Dual RCD", description: "Two RCDs protecting alternate circuits", maxWays: 10 },
  { id: "main_switch", name: "Main Switch Only", description: "For circuits protected by RCBO at source", maxWays: 8 },
];

export const CIRCUIT_TYPES = [
  { id: "ring_main", name: "Ring Main (Sockets)", mcb: 32, cableSize: "2.5mm²", maxLength: 50, colour: "Red" },
  { id: "radial_20a", name: "Radial 20A (Sockets)", mcb: 20, cableSize: "2.5mm²", maxLength: 20, colour: "Red" },
  { id: "radial_16a", name: "Radial 16A (Sockets)", mcb: 16, cableSize: "2.5mm²", maxLength: 17, colour: "Red" },
  { id: "lighting", name: "Lighting Circuit", mcb: 6, cableSize: "1.5mm²", maxLength: 30, colour: "Grey" },
  { id: "immersion", name: "Immersion Heater", mcb: 16, cableSize: "2.5mm²", maxLength: 23, colour: "White" },
  { id: "cooker", name: "Cooker Circuit", mcb: 32, cableSize: "6mm²", maxLength: 27, colour: "Red" },
  { id: "cooker_45a", name: "Cooker 45A", mcb: 45, cableSize: "10mm²", maxLength: 22, colour: "Red" },
  { id: "shower_8kw", name: "Electric Shower (8.5kW)", mcb: 40, cableSize: "6mm²", maxLength: 24, colour: "White" },
  { id: "shower_10kw", name: "Electric Shower (10.5kW)", mcb: 45, cableSize: "10mm²", maxLength: 22, colour: "White" },
  { id: "ev_charger", name: "EV Charger (7kW)", mcb: 32, cableSize: "6mm²", maxLength: 30, colour: "Orange" },
  { id: "ev_charger_22kw", name: "EV Charger (22kW)", mcb: 63, cableSize: "16mm²", maxLength: 25, colour: "Orange" },
  { id: "garage", name: "Garage/Outbuilding", mcb: 32, cableSize: "6mm² SWA", maxLength: 50, colour: "Orange" },
  { id: "hot_tub", name: "Hot Tub (13A)", mcb: 16, cableSize: "2.5mm²", maxLength: 20, colour: "White" },
  { id: "hot_tub_32a", name: "Hot Tub (32A)", mcb: 32, cableSize: "6mm²", maxLength: 27, colour: "White" },
  { id: "smoke_alarm", name: "Smoke/CO Alarms", mcb: 6, cableSize: "1.5mm²", maxLength: 40, colour: "Grey" },
  { id: "solar_pv", name: "Solar PV Inverter", mcb: 16, cableSize: "4mm²", maxLength: 30, colour: "Green" },
  { id: "underfloor", name: "Underfloor Heating", mcb: 16, cableSize: "2.5mm²", maxLength: 20, colour: "White" },
];

export const CABLE_SIZING_TABLE = {
  "1.0mm²": { ccc_clipped: 15, ccc_conduit: 13.5, ccc_insulated: 11, voltage_drop: 44 },
  "1.5mm²": { ccc_clipped: 20, ccc_conduit: 17.5, ccc_insulated: 14.5, voltage_drop: 29 },
  "2.5mm²": { ccc_clipped: 27, ccc_conduit: 24, ccc_insulated: 20, voltage_drop: 18 },
  "4mm²": { ccc_clipped: 37, ccc_conduit: 32, ccc_insulated: 27, voltage_drop: 11 },
  "6mm²": { ccc_clipped: 47, ccc_conduit: 41, ccc_insulated: 34, voltage_drop: 7.3 },
  "10mm²": { ccc_clipped: 65, ccc_conduit: 57, ccc_insulated: 46, voltage_drop: 4.4 },
  "16mm²": { ccc_clipped: 87, ccc_conduit: 76, ccc_insulated: 62, voltage_drop: 2.8 },
  "25mm²": { ccc_clipped: 114, ccc_conduit: 101, ccc_insulated: 80, voltage_drop: 1.75 },
};

export const DERATING_FACTORS = {
  ambient_temp: [
    { temp: 25, factor: 1.03 },
    { temp: 30, factor: 1.0 },
    { temp: 35, factor: 0.94 },
    { temp: 40, factor: 0.87 },
    { temp: 45, factor: 0.79 },
    { temp: 50, factor: 0.71 },
  ],
  grouping: [
    { cables: 1, factor: 1.0 },
    { cables: 2, factor: 0.8 },
    { cables: 3, factor: 0.7 },
    { cables: 4, factor: 0.65 },
    { cables: 5, factor: 0.6 },
    { cables: 6, factor: 0.57 },
  ],
  thermal_insulation: [
    { length: "Not enclosed", factor: 1.0 },
    { length: "50mm enclosed", factor: 0.89 },
    { length: "100mm enclosed", factor: 0.81 },
    { length: "200mm enclosed", factor: 0.68 },
    { length: "400mm+ enclosed", factor: 0.55 },
  ],
};

export const PART_P_NOTIFIABLE_WORK = [
  {
    id: "new_circuit",
    name: "Installation of new circuit",
    description: "Any new circuit from consumer unit",
    notifiable: true,
    guidance: "Requires Building Control notification and inspection",
    exemptions: ["Like-for-like replacement of existing circuits in same location"],
  },
  {
    id: "consumer_unit",
    name: "Consumer unit replacement",
    description: "Full or partial CU replacement",
    notifiable: true,
    guidance: "Must meet BS 7671 18th Edition. New CUs must be metal clad",
    exemptions: ["Like-for-like MCB replacement within same CU"],
  },
  {
    id: "special_location",
    name: "Work in special locations",
    description: "Bathrooms, swimming pools, saunas, hot tubs",
    notifiable: true,
    guidance: "Zone regulations apply - no socket outlets in Zone 2",
    exemptions: ["SELV lighting systems under 12V"],
  },
  {
    id: "outdoor_install",
    name: "Outdoor electrical installation",
    description: "Garden lighting, power to outbuildings, EV chargers",
    notifiable: true,
    guidance: "Must use appropriate IP-rated enclosures and armoured cable",
    exemptions: ["12V garden lighting fed from indoor transformer"],
  },
  {
    id: "kitchen_circuit",
    name: "New kitchen circuits",
    description: "Installation of new circuits in kitchen",
    notifiable: true,
    guidance: "RCD protection required for all circuits",
    exemptions: ["Replacement of existing sockets in same location"],
  },
];

export const PART_P_COMPLIANCE_CHECKLIST = [
  { id: "competent_person", question: "Is work being done by registered competent person scheme member?", required: true },
  { id: "building_control", question: "Has Building Control been notified for notifiable work?", required: true },
  { id: "design_check", question: "Has circuit design been verified against BS 7671?", required: true },
  { id: "rcd_protection", question: "Are all socket outlets RCD protected?", required: true },
  { id: "bonding", question: "Is supplementary bonding in place where required?", required: true },
  { id: "ze_tested", question: "Has external earth fault loop impedance (Ze) been tested?", required: true },
  { id: "insulation", question: "Has insulation resistance testing been completed?", required: true },
  { id: "polarity", question: "Has polarity been verified on all circuits?", required: true },
  { id: "rcd_test", question: "Have RCDs been tested at 1x and 5x rated current?", required: true },
  { id: "eicr", question: "Has Electrical Installation Certificate (EIC) been issued?", required: true },
  { id: "minor_works", question: "Has Minor Electrical Works Certificate been issued (if applicable)?", required: false },
  { id: "user_instructions", question: "Have operating instructions been provided to user?", required: true },
];

export const ZONE_REGULATIONS_BATHROOM = [
  { zone: "Zone 0", description: "Inside bath or shower basin", requirements: "Only SELV up to 12V AC, IPX7 minimum", allowed: ["SELV lighting max 12V"] },
  { zone: "Zone 1", description: "Above bath/shower to 2.25m height", requirements: "IPX4 minimum (IPX5 if jets), SELV or 240V with 30mA RCD", allowed: ["Showers", "SELV lighting", "Water heaters"] },
  { zone: "Zone 2", description: "0.6m around Zone 1 and above", requirements: "IPX4 minimum, RCD protected", allowed: ["Luminaires", "Fans", "Shaver sockets (SELV)"] },
  { zone: "Outside Zones", description: "Beyond Zone 2", requirements: "Standard requirements with RCD protection", allowed: ["Socket outlets (3m from Zone 1)", "All standard equipment"] },
];

export const TESTING_REQUIREMENTS = [
  { test: "Continuity of protective conductors", method: "Low resistance ohmmeter", pass_criteria: "R1+R2 measured values match design", frequency: "All new circuits" },
  { test: "Continuity of ring final circuit conductors", method: "Low resistance ohmmeter", pass_criteria: "All readings within 0.05Ω", frequency: "All ring circuits" },
  { test: "Insulation resistance", method: "Insulation resistance tester @ 500V DC", pass_criteria: "≥1MΩ (minimum 0.5MΩ acceptable)", frequency: "All circuits" },
  { test: "Polarity", method: "Continuity or voltage test", pass_criteria: "L-N-E correctly connected", frequency: "All points" },
  { test: "Earth electrode resistance", method: "Earth electrode tester", pass_criteria: "RA × Ia ≤ 50V", frequency: "TT installations" },
  { test: "Earth fault loop impedance (Zs)", method: "Loop impedance tester", pass_criteria: "Zs ≤ tabulated max for MCB type", frequency: "All circuits" },
  { test: "Prospective fault current (PFC)", method: "PFC tester at origin", pass_criteria: "CU rated for measured PFC", frequency: "At origin" },
  { test: "RCD operation", method: "RCD tester", pass_criteria: "≤40ms at 5×IΔn, ≤300ms at 1×IΔn", frequency: "All RCDs" },
  { test: "Functional tests", method: "Operation of all devices", pass_criteria: "All devices operate correctly", frequency: "All switchgear" },
];

export const ZS_MAX_VALUES = {
  "Type B": {
    "6A": 7.67,
    "10A": 4.6,
    "16A": 2.87,
    "20A": 2.3,
    "25A": 1.84,
    "32A": 1.44,
    "40A": 1.15,
    "50A": 0.92,
    "63A": 0.73,
  },
  "Type C": {
    "6A": 3.83,
    "10A": 2.3,
    "16A": 1.44,
    "20A": 1.15,
    "25A": 0.92,
    "32A": 0.72,
    "40A": 0.57,
    "50A": 0.46,
    "63A": 0.36,
  },
  "Type D": {
    "6A": 1.92,
    "10A": 1.15,
    "16A": 0.72,
    "20A": 0.57,
    "25A": 0.46,
    "32A": 0.36,
    "40A": 0.29,
    "50A": 0.23,
    "63A": 0.18,
  },
};

export function calculateCableSize(
  circuitType: string,
  length: number,
  installMethod: "clipped" | "conduit" | "insulated",
  ambientTemp: number = 30,
  groupedCables: number = 1
): { cable: string; voltageDrop: number; maxLength: number; passes: boolean } {
  const circuit = CIRCUIT_TYPES.find(c => c.id === circuitType);
  if (!circuit) return { cable: "Unknown", voltageDrop: 0, maxLength: 0, passes: false };

  const ambientFactor = DERATING_FACTORS.ambient_temp.find(a => a.temp === ambientTemp)?.factor || 1.0;
  const groupFactor = DERATING_FACTORS.grouping.find(g => g.cables === groupedCables)?.factor || 1.0;
  
  const cableData = CABLE_SIZING_TABLE[circuit.cableSize as keyof typeof CABLE_SIZING_TABLE];
  if (!cableData) return { cable: circuit.cableSize, voltageDrop: 0, maxLength: 0, passes: false };

  const ccc = cableData[`ccc_${installMethod}` as keyof typeof cableData] as number;
  const derated = ccc * ambientFactor * groupFactor;
  const voltageDrop = (cableData.voltage_drop * length * circuit.mcb) / 1000;
  const maxVoltageDropPercent = 4; // 4% max for lighting, 5% for other
  const maxVoltageDrop = 230 * (maxVoltageDropPercent / 100);
  
  return {
    cable: circuit.cableSize,
    voltageDrop: parseFloat(voltageDrop.toFixed(2)),
    maxLength: circuit.maxLength,
    passes: voltageDrop <= maxVoltageDrop && derated >= circuit.mcb
  };
}

export function calculateConsumerUnitSize(circuits: { type: string; quantity: number }[]): {
  totalWays: number;
  recommended: typeof CONSUMER_UNIT_TYPES[0];
  circuits: { name: string; mcb: number; cable: string }[];
} {
  const circuitList: { name: string; mcb: number; cable: string }[] = [];
  
  circuits.forEach(c => {
    const circuit = CIRCUIT_TYPES.find(ct => ct.id === c.type);
    if (circuit) {
      for (let i = 0; i < c.quantity; i++) {
        circuitList.push({ name: circuit.name, mcb: circuit.mcb, cable: circuit.cableSize });
      }
    }
  });

  const totalWays = circuitList.length;
  const recommended = CONSUMER_UNIT_TYPES.find(cu => cu.maxWays >= totalWays) || CONSUMER_UNIT_TYPES[1];

  return { totalWays, recommended, circuits: circuitList };
}
