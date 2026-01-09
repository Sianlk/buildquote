// Materials Shopping List - Consolidates materials across jobs and generates supplier orders

export interface MaterialItem {
  name: string;
  quantity: number;
  unit: string;
  unitCostTrade: number;
  unitCostRetail: number;
  supplier?: string;
  category?: string;
}

export interface ConsolidatedMaterial {
  name: string;
  totalQuantity: number;
  unit: string;
  unitCostTrade: number;
  unitCostRetail: number;
  totalCostTrade: number;
  totalCostRetail: number;
  category: string;
  suppliers: string[];
  jobs: string[];
}

export interface SupplierOrder {
  supplier: string;
  materials: ConsolidatedMaterial[];
  totalCostTrade: number;
  totalCostRetail: number;
  itemCount: number;
}

export const PREFERRED_SUPPLIERS: Record<string, string[]> = {
  "Timber & Sheet Materials": ["Jewson", "Travis Perkins", "Selco"],
  "Plumbing & Heating": ["Plumb Center", "City Plumbing", "Screwfix"],
  "Electrical": ["Edmundson Electrical", "CEF", "Screwfix"],
  "Building Materials": ["Jewson", "Travis Perkins", "Buildbase"],
  "Fixings & Fasteners": ["Screwfix", "Toolstation", "Fixings Warehouse"],
  "Decorating": ["Dulux Decorator Centre", "Crown Decorating", "Brewers"],
  "Tiles & Flooring": ["Topps Tiles", "CTD Tiles", "Tile Giant"],
  "Roofing": ["Burton Roofing", "Roofing Megastore", "Travis Perkins"],
  "Insulation": ["Jewson", "Travis Perkins", "Insulation Superstore"],
  "Tools & PPE": ["Screwfix", "Toolstation", "FFX"],
  "General": ["Screwfix", "Toolstation", "Wickes"],
};

export const MATERIAL_CATEGORIES: Record<string, string> = {
  // Plumbing
  "15mm copper pipe": "Plumbing & Heating",
  "22mm copper pipe": "Plumbing & Heating",
  "Compression fittings": "Plumbing & Heating",
  "Push-fit fittings": "Plumbing & Heating",
  "Solder ring fittings": "Plumbing & Heating",
  "Radiators": "Plumbing & Heating",
  "Radiator valves": "Plumbing & Heating",
  "Combi boiler": "Plumbing & Heating",
  "System boiler": "Plumbing & Heating",
  "Unvented cylinder": "Plumbing & Heating",
  "Flue kit": "Plumbing & Heating",
  "Magnetic filter": "Plumbing & Heating",
  "Inhibitor": "Plumbing & Heating",
  "PTFE tape": "Plumbing & Heating",
  "Flux": "Plumbing & Heating",
  "Solder": "Plumbing & Heating",
  
  // Electrical
  "Twin & earth cable": "Electrical",
  "6242Y cable": "Electrical",
  "SWA cable": "Electrical",
  "Flex cable": "Electrical",
  "Consumer unit": "Electrical",
  "MCB": "Electrical",
  "RCBO": "Electrical",
  "Socket outlets": "Electrical",
  "Light switches": "Electrical",
  "Downlights": "Electrical",
  "Cable clips": "Electrical",
  "Junction boxes": "Electrical",
  "Back boxes": "Electrical",
  
  // Carpentry
  "Softwood timber": "Timber & Sheet Materials",
  "Hardwood timber": "Timber & Sheet Materials",
  "Plywood": "Timber & Sheet Materials",
  "MDF": "Timber & Sheet Materials",
  "Chipboard": "Timber & Sheet Materials",
  "OSB": "Timber & Sheet Materials",
  "Skirting board": "Timber & Sheet Materials",
  "Architrave": "Timber & Sheet Materials",
  "Internal doors": "Timber & Sheet Materials",
  "Door handles": "Fixings & Fasteners",
  "Hinges": "Fixings & Fasteners",
  "Wood screws": "Fixings & Fasteners",
  "Nails": "Fixings & Fasteners",
  "Wood glue": "Fixings & Fasteners",
  
  // Plastering
  "Plasterboard": "Building Materials",
  "Bonding plite": "Building Materials",
  "Multi-finish plaster": "Building Materials",
  "Thistle hardwall": "Building Materials",
  "Scrim tape": "Building Materials",
  "Plaster beads": "Building Materials",
  "Dry wall screws": "Fixings & Fasteners",
  
  // General
  "Dust sheets": "General",
  "Masking tape": "General",
  "Silicone sealant": "General",
  "Expanding foam": "General",
};

export function consolidateMaterials(
  jobMaterials: { jobName: string; materials: MaterialItem[] }[]
): ConsolidatedMaterial[] {
  const consolidated: Map<string, ConsolidatedMaterial> = new Map();

  jobMaterials.forEach(({ jobName, materials }) => {
    materials.forEach(mat => {
      const key = `${mat.name.toLowerCase()}_${mat.unit}`;
      const existing = consolidated.get(key);
      
      if (existing) {
        existing.totalQuantity += mat.quantity;
        existing.totalCostTrade = existing.totalQuantity * existing.unitCostTrade;
        existing.totalCostRetail = existing.totalQuantity * existing.unitCostRetail;
        if (!existing.jobs.includes(jobName)) {
          existing.jobs.push(jobName);
        }
      } else {
        const category = MATERIAL_CATEGORIES[mat.name] || 
          Object.entries(MATERIAL_CATEGORIES).find(([k]) => 
            mat.name.toLowerCase().includes(k.toLowerCase())
          )?.[1] || "General";
        
        consolidated.set(key, {
          name: mat.name,
          totalQuantity: mat.quantity,
          unit: mat.unit,
          unitCostTrade: mat.unitCostTrade,
          unitCostRetail: mat.unitCostRetail,
          totalCostTrade: mat.quantity * mat.unitCostTrade,
          totalCostRetail: mat.quantity * mat.unitCostRetail,
          category,
          suppliers: PREFERRED_SUPPLIERS[category] || PREFERRED_SUPPLIERS["General"],
          jobs: [jobName],
        });
      }
    });
  });

  return Array.from(consolidated.values()).sort((a, b) => a.category.localeCompare(b.category));
}

export function generateSupplierOrders(
  materials: ConsolidatedMaterial[],
  preferredSupplier?: string
): SupplierOrder[] {
  const supplierMap: Map<string, ConsolidatedMaterial[]> = new Map();

  materials.forEach(mat => {
    const supplier = preferredSupplier || mat.suppliers[0] || "Screwfix";
    const existing = supplierMap.get(supplier) || [];
    existing.push(mat);
    supplierMap.set(supplier, existing);
  });

  return Array.from(supplierMap.entries()).map(([supplier, mats]) => ({
    supplier,
    materials: mats,
    totalCostTrade: mats.reduce((sum, m) => sum + m.totalCostTrade, 0),
    totalCostRetail: mats.reduce((sum, m) => sum + m.totalCostRetail, 0),
    itemCount: mats.length,
  }));
}

export function groupByCategory(materials: ConsolidatedMaterial[]): Record<string, ConsolidatedMaterial[]> {
  return materials.reduce((acc, mat) => {
    if (!acc[mat.category]) acc[mat.category] = [];
    acc[mat.category].push(mat);
    return acc;
  }, {} as Record<string, ConsolidatedMaterial[]>);
}
