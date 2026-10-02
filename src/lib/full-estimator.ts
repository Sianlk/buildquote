// Full UK build estimator — one engine powers both Easy and Complex modes.
// Rates: UK 2026 averages (BCIS/trade-survey informed), ex VAT. Regional multiplier applied.
import { REGIONAL_MULTIPLIERS } from "./construction-rates";

export type Region = keyof typeof REGIONAL_MULTIPLIERS;
export type Spec = "low" | "mid" | "high";
export type BuildType =
  | "new_build" | "single_extension" | "double_extension" | "wrap_extension"
  | "loft_velux" | "loft_dormer" | "loft_hip_to_gable" | "loft_mansard"
  | "renovation" | "office_conversion" | "hmo_conversion" | "garage_conversion" | "basement";

export const BUILD_TYPES: Record<BuildType, { label: string; perM2: [number, number, number]; newStructure: boolean; roof: boolean; foundations: boolean; vatZero?: boolean; notes: string }> = {
  new_build: { label: "New build house", perM2: [1900, 2450, 3300], newStructure: true, roof: true, foundations: true, vatZero: true, notes: "Full planning permission + Building Regs full plans. New dwellings are zero-rated for VAT. Part L 2021 / Future Homes Standard and Part O overheating apply." },
  single_extension: { label: "Single-storey extension", perM2: [2000, 2600, 3400], newStructure: true, roof: true, foundations: true, notes: "Permitted Development: rear up to 3m (attached) / 4m (detached), max 4m high; 6m/8m via prior approval. Side extensions max half width of house, single storey, 4m high." },
  double_extension: { label: "Two-storey extension", perM2: [1800, 2350, 3100], newStructure: true, roof: true, foundations: true, notes: "PD: rear max 3m deep, ≥7m from rear boundary, matching materials, no side windows above ground unless obscure-glazed and non-opening below 1.7m." },
  wrap_extension: { label: "Wrap-around extension", perM2: [2200, 2800, 3700], newStructure: true, roof: true, foundations: true, notes: "Normally needs full planning permission (side + rear elements combined fall outside PD)." },
  loft_velux: { label: "Loft conversion — Velux / rooflight", perM2: [1400, 1800, 2400], newStructure: false, roof: false, foundations: false, notes: "PD volume allowance 40m³ terrace / 50m³ semi/detached. Rooflights ≤150mm projection. Fire escape strategy (Part B) required." },
  loft_dormer: { label: "Loft conversion — rear dormer", perM2: [1750, 2250, 2950], newStructure: false, roof: true, foundations: false, notes: "PD: dormer set back ≥20cm from eaves, not higher than ridge, not on principal elevation, materials similar." },
  loft_hip_to_gable: { label: "Loft conversion — hip to gable", perM2: [1850, 2400, 3100], newStructure: false, roof: true, foundations: false, notes: "Usually PD within volume allowance; party wall notice likely." },
  loft_mansard: { label: "Loft conversion — mansard", perM2: [2200, 2800, 3600], newStructure: false, roof: true, foundations: false, notes: "Almost always requires full planning permission." },
  renovation: { label: "Full renovation / refurbishment", perM2: [850, 1400, 2200], newStructure: false, roof: false, foundations: false, notes: "Reduced 5% VAT may apply to homes empty 2+ years. Rewire needs Part P certification; boiler needs Gas Safe." },
  office_conversion: { label: "Office to residential conversion", perM2: [1100, 1650, 2400], newStructure: false, roof: false, foundations: false, notes: "Class MA prior approval (Use Class E to C3) — min 1,000m²? no cap since 2024; must meet Nationally Described Space Standards and natural light." },
  hmo_conversion: { label: "HMO conversion", perM2: [1250, 1800, 2600], newStructure: false, roof: false, foundations: false, notes: "Mandatory licence for 5+ occupiers / 2+ households. Rooms min 6.51m² (1 adult) / 10.22m² (2 adults). Article 4 areas need planning for C3→C4. LD2 fire alarm, FD30 doors." },
  garage_conversion: { label: "Garage conversion", perM2: [1150, 1550, 2150], newStructure: false, roof: false, foundations: false, notes: "Usually PD if internal only; Building Regs for insulation, ventilation, fire escape." },
  basement: { label: "Basement conversion / dig-out", perM2: [3000, 3900, 5200], newStructure: true, roof: false, foundations: true, notes: "Type C cavity drain waterproofing (BS 8102), party wall award, often planning in London boroughs." },
};

export const SPEC_LABEL: Record<Spec, string> = { low: "Basic / budget", mid: "Standard / mid-range", high: "High-end / premium" };

// Day rates (£/day, 2026 UK average, outside London before multiplier)
export const DAY_RATES: Record<string, number> = {
  Groundworker: 200, Bricklayer: 260, Carpenter: 240, Roofer: 240, Plasterer: 230,
  Electrician: 280, Plumber: 280, "Gas Engineer": 300, Decorator: 190, Tiler: 220,
  Labourer: 150, "Steel erector": 280, Glazier: 230, "Kitchen fitter": 240,
};

export interface EstimateInput {
  buildType: BuildType; spec: Spec; region: Region;
  length: number; width: number; storeys: number; ceilingHeight: number;
  bedrooms: number; bathrooms: number; kitchens: number;
  windows: number; externalDoors: number; internalDoors: number;
  rooflights: number; includeKitchen: boolean; includeDecoration: boolean;
  contingencyPct: number; vatRegistered: boolean;
}

export interface BOMLine { category: string; item: string; qty: number; unit: string; rate: number; total: number }
export interface LabourLine { trade: string; days: number; dayRate: number; total: number }
export interface RoomHeat { room: string; area: number; btu: number; watts: number; radiator: string }
export interface Estimate {
  area: number; bom: BOMLine[]; labour: LabourLine[]; rooms: RoomHeat[];
  materials: number; labourTotal: number; prelims: number; fees: number; contingency: number;
  profit: number; subtotal: number; vat: number; total: number; vatRate: number;
  benchmark: [number, number]; programmeWeeks: number;
  pipe15: number; pipe22: number; cableTwin25: number; cableTwin15: number;
  notes: string;
}

const specMult: Record<Spec, number> = { low: 0.85, mid: 1, high: 1.45 };
const r2 = (n: number) => Math.round(n * 100) / 100;

export function defaultsFromArea(area: number, buildType: BuildType): Partial<EstimateInput> {
  const storeys = buildType === "new_build" || buildType === "double_extension" ? 2 : 1;
  const footprint = area / storeys;
  const width = Math.max(2.5, Math.sqrt(footprint / 1.4));
  const length = footprint / width;
  const beds = Math.max(1, Math.round(area / (buildType === "hmo_conversion" ? 14 : 28)));
  return {
    length: r2(length), width: r2(width), storeys, ceilingHeight: 2.4,
    bedrooms: buildType.includes("extension") ? 0 : beds,
    bathrooms: buildType === "hmo_conversion" ? beds : Math.max(buildType.includes("extension") ? 0 : 1, Math.round(beds / 2)),
    kitchens: buildType === "single_extension" || buildType === "wrap_extension" || buildType === "new_build" || buildType === "renovation" || buildType === "office_conversion" ? 1 : buildType === "hmo_conversion" ? Math.max(1, Math.ceil(beds / 5)) : 0,
    windows: Math.max(1, Math.round(area / 9)), externalDoors: buildType.includes("loft") ? 0 : 1,
    internalDoors: Math.round(area / 12), rooflights: buildType.startsWith("loft") ? 2 : buildType.includes("extension") ? 1 : 0,
  };
}

/** Room heat loss: W/m³ by room type (CIBSE simplified) → BTU, nearest standard radiator. */
function radiatorFor(room: string, area: number, h: number, spec: Spec): RoomHeat {
  const wPerM3 = room.startsWith("Bath") ? 58 : room.startsWith("Living") ? 52 : room.startsWith("Kitchen") ? 44 : 40;
  const insul = spec === "high" ? 0.85 : spec === "low" ? 1.1 : 1;
  const watts = Math.round(area * h * wPerM3 * insul);
  const btu = Math.round(watts * 3.412);
  const sizes = [[400, "600×400 single"], [700, "600×600 single"], [1000, "600×800 double"], [1400, "600×1000 double"], [1800, "600×1200 double"], [2300, "600×1400 double"], [2900, "600×1800 double"]] as const;
  const s = sizes.find(([w]) => w >= watts);
  return { room, area: r2(area), btu, watts, radiator: s ? s[1] : `2× 600×1200 double` };
}

export function calculateEstimate(i: EstimateInput): Estimate {
  const bt = BUILD_TYPES[i.buildType];
  const sm = specMult[i.spec];
  const reg = REGIONAL_MULTIPLIERS[i.region];
  const footprint = i.length * i.width;
  const area = footprint * i.storeys;
  const perim = 2 * (i.length + i.width);
  const wallH = i.ceilingHeight * i.storeys + 0.3 * i.storeys;
  const openings = i.windows * 1.5 + i.externalDoors * 2;
  const extWall = bt.newStructure ? Math.max(0, perim * wallH - openings) * (i.buildType.includes("extension") ? 0.75 : 1) : 0;
  const intWall = area * 0.9; // m² stud partition faces approx
  const bom: BOMLine[] = [];
  const add = (category: string, item: string, qty: number, unit: string, rate: number) => {
    if (qty <= 0) return;
    const q = Math.ceil(qty * 100) / 100; const rt = r2(rate * reg);
    bom.push({ category, item, qty: Math.ceil(q), unit, rate: rt, total: r2(Math.ceil(q) * rt) });
  };

  // Groundworks & foundations
  if (bt.foundations) {
    const trench = perim * 0.6 * 1.0;
    add("Groundworks", "Excavation & muck-away (strip foundation 600×1000)", trench * 1.3, "m³", 65);
    add("Groundworks", "Ready-mix concrete C25/30 foundations", trench * 1.05, "m³", 125);
    add("Groundworks", "Concrete C25/30 ground slab 100mm", footprint * 0.1 * 1.05, "m³", 125);
    add("Groundworks", "MOT Type 1 sub-base 150mm", footprint * 0.15 * 2.1, "t", 32);
    add("Groundworks", "Sand blinding 25mm", footprint * 0.025 * 1.6, "t", 38);
    add("Groundworks", "DPM 1200g polythene", footprint * 1.15, "m²", 1.1);
    add("Groundworks", "PIR floor insulation 100mm (Part L)", footprint * 1.05, "m²", 21);
    add("Groundworks", "Sand & cement screed 65mm", footprint * 0.065 * 2.1, "t", 55);
    add("Groundworks", "A393 steel mesh", footprint / 10.5, "sheet", 48);
    add("Groundworks", "Trench blocks 7N 300mm", perim * 0.6 * 10 / 1, "block", 4.2);
    add("Drainage", "110mm uPVC underground pipe", perim * 0.8, "m", 9);
    add("Drainage", "Inspection chamber 450mm", Math.max(1, Math.round(perim / 20)), "nr", 95);
    add("Drainage", "Bends, couplers & junctions 110mm", Math.round(perim / 3), "nr", 7.5);
  }
  // Superstructure
  if (extWall > 0) {
    add("Masonry", "Facing bricks (60/m², 5% waste)", extWall * 60 * 1.05, "brick", i.spec === "high" ? 1.1 : 0.75);
    add("Masonry", "Aerated blocks 100mm inner leaf (10/m²)", extWall * 10 * 1.05, "block", 2.9);
    add("Masonry", "Cavity insulation 100mm full-fill batts", extWall * 1.05, "m²", 9);
    add("Masonry", "Mortar — building sand", extWall * 0.06, "t", 45);
    add("Masonry", "Cement 25kg", extWall * 0.35, "bag", 7.5);
    add("Masonry", "Stainless wall ties (2.5/m²)", extWall * 2.5, "nr", 0.32);
    add("Masonry", "Cavity trays & weep vents", Math.max(4, i.windows + i.externalDoors) * 2, "nr", 6);
    add("Masonry", "Steel lintels (Catnic) per opening", i.windows + i.externalDoors, "nr", 85);
    add("Masonry", "Cavity closers", (i.windows + i.externalDoors) * 5, "m", 4.5);
    add("Masonry", "Wall starter kits", 2 * i.storeys, "nr", 18);
  }
  if (i.buildType.includes("extension") || i.buildType === "loft_hip_to_gable" || i.buildType === "loft_dormer" || i.buildType === "loft_mansard") {
    add("Structure", "Steel beam (UB 203×133) incl. padstones", Math.max(1, Math.round(i.width / 3)), "beam", i.buildType.startsWith("loft") ? 650 : 900);
    add("Structure", "Structural engineer calcs", 1, "item", 650);
  }
  // Floors (upper / loft)
  if (i.storeys > 1 || i.buildType.startsWith("loft")) {
    const fa = i.buildType.startsWith("loft") ? area : footprint * (i.storeys - 1);
    add("Carpentry", "C24 joists 47×200 @400 ctrs", fa / 0.4 / Math.max(1, i.width) * i.width, "m", 6.2);
    add("Carpentry", "Joist hangers", fa / 0.4 * 0.5, "nr", 2.1);
    add("Carpentry", "22mm P5 chipboard flooring T&G", fa * 1.1, "m²", 9.5);
    add("Carpentry", "Flooring screws 4×50 (25/m²)", fa * 25 / 200, "box 200", 7.5);
    add("Carpentry", "Acoustic mineral wool 100mm", fa * 1.05, "m²", 5.8);
    add("Carpentry", "Herringbone strutting", fa / 4, "set", 3.5);
  }
  // Roof
  if (bt.roof) {
    const ra = footprint * (i.buildType.includes("extension") ? 1.1 : 1.25);
    add("Roofing", "C24 rafters 47×150 @400 ctrs", ra / 0.4 * 0.9, "m", 4.6);
    add("Roofing", "Wall plate 100×50 & restraint straps", perim, "m", 5);
    add("Roofing", "Breathable membrane", ra * 1.15, "m²", 1.6);
    add("Roofing", "Battens 25×50 treated", ra * 3.2, "m", 0.75);
    add("Roofing", i.spec === "high" ? "Natural slate 500×250" : "Concrete interlocking tiles", ra * (i.spec === "high" ? 20 : 10), "tile", i.spec === "high" ? 2.4 : 1.2);
    add("Roofing", "Tile/slate nails (stainless) 1kg", ra / 10, "kg", 9);
    add("Roofing", "PIR insulation 150mm between + 50mm under rafters", ra * 1.05, "m²", 38);
    add("Roofing", "Fascia, soffit & guttering", perim * 0.6, "m", 32);
    add("Roofing", "Lead flashing code 4", Math.max(3, i.width), "m", 28);
  }
  if (i.rooflights > 0) add("Roofing", i.spec === "high" ? "Velux GGU M08 + flashing + blind" : "Velux GGL M06 + flashing", i.rooflights, "nr", i.spec === "high" ? 780 : 480);
  // Windows & doors
  add("Glazing", `uPVC/alu double-glazed window (${i.spec === "high" ? "aluminium, triple" : "uPVC A-rated"}) 1.2×1.2`, i.windows, "nr", i.spec === "high" ? 950 : i.spec === "mid" ? 520 : 380);
  add("Glazing", "External door / composite", i.externalDoors, "nr", i.spec === "high" ? 2200 : 1100);
  add("Glazing", "Window fixings, foam & silicone per opening", i.windows + i.externalDoors, "set", 14);
  add("Joinery", "Internal door FD30 (fire door where required) + lining", i.internalDoors, "nr", i.spec === "high" ? 320 : 180);
  add("Joinery", "Ironmongery set (hinges ×3, handle, latch, screws)", i.internalDoors, "set", i.spec === "high" ? 85 : 35);
  add("Joinery", "Architrave & skirting MDF", area * 1.4, "m", 3.8);
  add("Joinery", "Lost-head nails / pin nails", Math.ceil(area / 30), "box", 6);
  // Partitions & plastering
  add("Carpentry", "CLS 38×89 studwork", intWall * 2.6, "m", 2.3);
  add("Drylining", "Plasterboard 12.5mm 2.4×1.2", (intWall * 2 + area) * 1.1 / 2.88, "sheet", 10.5);
  add("Drylining", "Moisture board for wet areas", i.bathrooms * 8, "sheet", 15);
  add("Drylining", "Drywall screws 3.5×38 (30/m²)", (intWall * 2 + area) * 30 / 1000, "box 1000", 11);
  add("Drylining", "Scrim tape & beading", Math.ceil(area / 20), "pack", 16);
  add("Plastering", "Multi-finish plaster 25kg (~10m²/bag)", (intWall * 2 + area + extWall) / 10, "bag", 11);
  // Electrical
  const sockets = Math.round(area / 5) + i.kitchens * 6; const lights = Math.round(area / 6);
  const cableTwin25 = Math.round(sockets * 9); const cableTwin15 = Math.round(lights * 7);
  add("Electrical", "Twin & earth 2.5mm² (100m drum)", cableTwin25 / 100, "drum", 78);
  add("Electrical", "Twin & earth 1.5mm² (100m drum)", cableTwin15 / 100, "drum", 56);
  add("Electrical", "6mm² cooker cable", i.kitchens * 15, "m", 2.6);
  add("Electrical", "Double sockets (USB on high spec)", sockets, "nr", i.spec === "high" ? 22 : 6);
  add("Electrical", "Back boxes 35mm + screws", sockets + lights, "nr", 0.9);
  add("Electrical", "LED downlights fire-rated", lights * 2, "nr", i.spec === "high" ? 24 : 9);
  add("Electrical", "Light switches", Math.round(lights * 0.8), "nr", i.spec === "high" ? 18 : 4);
  add("Electrical", "Mains smoke/heat alarms interlinked", Math.max(2, i.storeys + 1), "nr", 32);
  if (i.buildType === "new_build" || i.buildType === "renovation" || i.buildType === "hmo_conversion" || i.buildType === "office_conversion")
    add("Electrical", "18th Ed consumer unit (RCBO, SPD)", 1, "nr", 420);
  add("Electrical", "Clips, grommets, connectors (sundries)", Math.ceil(area / 25), "pack", 18);
  // Plumbing & heating
  const rooms: RoomHeat[] = [];
  const h = i.ceilingHeight;
  const living = Math.max(0, area - i.bedrooms * 11 - i.bathrooms * 5 - i.kitchens * 12);
  if (living > 0) rooms.push(radiatorFor("Living / open-plan", living, h, i.spec));
  for (let b = 0; b < i.bedrooms; b++) rooms.push(radiatorFor(`Bedroom ${b + 1}`, 11, h, i.spec));
  for (let b = 0; b < i.bathrooms; b++) rooms.push(radiatorFor(`Bathroom ${b + 1}`, 5, h, i.spec));
  for (let k = 0; k < i.kitchens; k++) rooms.push(radiatorFor(`Kitchen ${k + 1}`, 12, h, i.spec));
  const rads = rooms.length;
  const pipe15 = Math.round(rads * 8 + i.bathrooms * 14 + i.kitchens * 8);
  const pipe22 = Math.round(Math.sqrt(area) * 4 * i.storeys);
  add("Plumbing", "15mm copper / PEX pipe", pipe15, "m", 3.4);
  add("Plumbing", "22mm copper pipe", pipe22, "m", 6.8);
  add("Plumbing", "Radiators (sized per room, see heat schedule)", rads, "nr", i.spec === "high" ? 260 : 95);
  add("Plumbing", "TRV + lockshield valve pairs", rads, "pair", i.spec === "high" ? 38 : 16);
  add("Plumbing", "Compression/press fittings, elbows, tees", rads * 8 + i.bathrooms * 12, "nr", 2.4);
  add("Plumbing", "Pipe clips & insulation lagging", (pipe15 + pipe22) / 2, "m", 1.2);
  add("Plumbing", "Isolation valves (service valves)", i.bathrooms * 4 + i.kitchens * 2, "nr", 4.5);
  add("Plumbing", "O-rings, PTFE, flux & solder (sundries)", Math.ceil(rads / 3), "pack", 12);
  add("Plumbing", "40mm/32mm waste pipe & traps", i.bathrooms * 6 + i.kitchens * 4, "m", 4);
  add("Plumbing", "110mm soil stack & fittings", i.bathrooms > 0 ? i.storeys * 3 : 0, "m", 18);
  add("Bathroom", "Bathroom suite (WC, basin, bath/shower, taps)", i.bathrooms, "suite", i.spec === "high" ? 3800 : i.spec === "mid" ? 1600 : 850);
  add("Bathroom", "Wall & floor tiles", i.bathrooms * 22, "m²", i.spec === "high" ? 55 : 24);
  add("Bathroom", "Tile adhesive 20kg / grout / tanking", i.bathrooms * 4, "set", 32);
  add("Bathroom", "Extractor fan (Part F)", i.bathrooms + i.kitchens, "nr", 65);
  if (i.buildType === "new_build" || i.buildType === "hmo_conversion" || i.buildType === "office_conversion" || (i.buildType === "renovation" && i.spec !== "low"))
    add("Heating", i.spec === "high" ? "Air-source heat pump 8kW + cylinder (BUS grant £7,500 eligible)" : "Combi boiler 30kW + flue + filter", 1, "nr", i.spec === "high" ? 11000 : 1900);
  if (i.includeKitchen && i.kitchens > 0) add("Kitchen", `Kitchen units, worktop & appliances (${i.spec})`, i.kitchens, "kitchen", i.spec === "high" ? 22000 : i.spec === "mid" ? 9000 : 4500);
  if (i.includeDecoration) {
    add("Decoration", "Mist coat + 2 coats emulsion (5L ~ 30m²)", (intWall * 2 + area * 2) / 30 * 3, "5L tin", i.spec === "high" ? 48 : 22);
    add("Decoration", "Gloss/satinwood for joinery 2.5L", Math.ceil(area / 25), "tin", 28);
    add("Decoration", "Flooring (LVT / carpet / engineered oak)", area, "m²", i.spec === "high" ? 75 : i.spec === "mid" ? 35 : 18);
  }
  add("Sundries", "Skips 8yd", Math.max(1, Math.ceil(area / 20)), "skip", 340);
  add("Sundries", "Fixings, sealants, PPE & consumables", Math.ceil(area / 10), "pack", 22);

  const materials = r2(bom.reduce((s, b) => s + b.total, 0) * sm);
  bom.forEach((b) => { b.rate = r2(b.rate * sm); b.total = r2(b.qty * b.rate); });

  // Labour (days) — productivity based
  const ld: Record<string, number> = {};
  const L = (t: string, d: number) => { if (d > 0) ld[t] = (ld[t] || 0) + d; };
  if (bt.foundations) { L("Groundworker", footprint * 0.35 + perim * 0.25); L("Labourer", footprint * 0.3); }
  if (extWall > 0) { L("Bricklayer", extWall * 120 / 450); L("Labourer", extWall * 120 / 900); }
  if (bt.roof) { L("Roofer", footprint * 0.18); L("Carpenter", footprint * 0.15); }
  if (i.buildType.includes("extension") || i.buildType.startsWith("loft_") && i.buildType !== "loft_velux") L("Steel erector", 2);
  L("Carpenter", intWall * 0.12 + (i.internalDoors * 0.6) + (i.storeys > 1 || i.buildType.startsWith("loft") ? area * 0.08 : 0));
  L("Plasterer", (intWall * 2 + area + extWall) / 25);
  L("Electrician", (sockets + lights) * 0.25 + 2);
  L("Plumber", rads * 0.5 + i.bathrooms * 3 + i.kitchens * 1.5);
  if (i.buildType === "new_build" || i.buildType === "renovation" || i.buildType === "hmo_conversion" || i.buildType === "office_conversion") L("Gas Engineer", 2);
  L("Glazier", (i.windows + i.externalDoors + i.rooflights) * 0.4);
  L("Tiler", i.bathrooms * 3);
  if (i.includeKitchen && i.kitchens > 0) L("Kitchen fitter", i.kitchens * 5);
  if (i.includeDecoration) L("Decorator", area * 0.12);
  L("Labourer", area * 0.1);
  const labMult = i.spec === "high" ? 1.2 : i.spec === "low" ? 0.92 : 1;
  const labour: LabourLine[] = Object.entries(ld).map(([trade, d]) => {
    const days = Math.ceil(d * labMult * 2) / 2; const dayRate = r2(DAY_RATES[trade] * reg);
    return { trade, days, dayRate, total: r2(days * dayRate) };
  });
  const labourTotal = r2(labour.reduce((s, l) => s + l.total, 0));
  const direct = materials + labourTotal;
  const prelims = r2(direct * 0.08);
  const fees = r2(Math.max(1200, direct * (bt.newStructure ? 0.08 : 0.05))); // architect/engineer/BC/planning
  const contingency = r2((direct + prelims) * i.contingencyPct / 100);
  const profit = r2((direct + prelims) * 0.15);
  const subtotal = r2(direct + prelims + fees + contingency + profit);
  const vatRate = !i.vatRegistered ? 0 : bt.vatZero ? 0 : 20;
  const vat = r2(subtotal * vatRate / 100);
  const [lo, mid, hi] = bt.perM2; const pm = i.spec === "low" ? lo : i.spec === "mid" ? mid : hi;
  const benchmark: [number, number] = [Math.round(area * pm * reg * 0.9), Math.round(area * pm * reg * 1.1)];
  const crewDays = Object.values(ld).reduce((a, b) => a + b, 0) * labMult;
  return {
    area: r2(area), bom, labour, rooms, materials, labourTotal, prelims, fees, contingency, profit,
    subtotal, vat, total: r2(subtotal + vat), vatRate, benchmark,
    programmeWeeks: Math.max(2, Math.ceil(crewDays / 2.5 / 5)),
    pipe15, pipe22, cableTwin25, cableTwin15, notes: bt.notes,
  };
}
