import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Thermometer, Home, Flame, CheckCircle, AlertTriangle, ExternalLink, PoundSterling } from "lucide-react";
import { RENEWABLE_TECHNOLOGIES, GRANTS } from "@/lib/renewables-module-data";

// Insulation levels with heat loss multipliers (W/m²K equivalent)
const INSULATION_LEVELS = {
  poor: { label: "Poor (Pre-1960, no upgrades)", heatLossMultiplier: 1.5, description: "Solid walls, single glazing, minimal loft insulation" },
  average: { label: "Average (1960-1990)", heatLossMultiplier: 1.0, description: "Cavity walls, double glazing, some loft insulation" },
  good: { label: "Good (1990-2010)", heatLossMultiplier: 0.75, description: "Insulated walls, double glazing, 200mm loft" },
  excellent: { label: "Excellent (Post-2010/Retrofit)", heatLossMultiplier: 0.55, description: "High insulation, triple glazing, 300mm+ loft" },
};

// Property types with base heat demand
const PROPERTY_TYPES = {
  flat: { label: "Flat/Apartment", baseKw: 4, floorMultiplier: 0.04 },
  terraced: { label: "Terraced House", baseKw: 5, floorMultiplier: 0.05 },
  semi: { label: "Semi-Detached", baseKw: 6, floorMultiplier: 0.055 },
  detached: { label: "Detached House", baseKw: 8, floorMultiplier: 0.06 },
  bungalow: { label: "Bungalow", baseKw: 6, floorMultiplier: 0.065 },
};

// Heating system compatibility
const CURRENT_HEATING = {
  gas_boiler: { label: "Gas Boiler", compatible: true, notes: "Standard replacement, BUS grant eligible" },
  oil_boiler: { label: "Oil Boiler", compatible: true, notes: "BUS grant eligible, removes oil dependency" },
  lpg: { label: "LPG Boiler", compatible: true, notes: "BUS grant eligible" },
  electric: { label: "Electric Heating", compatible: true, notes: "Not BUS eligible (already electric)" },
  storage_heaters: { label: "Storage Heaters", compatible: true, notes: "Not BUS eligible, but good upgrade" },
  coal_solid: { label: "Coal/Solid Fuel", compatible: true, notes: "BUS grant eligible, major upgrade" },
};

// Climate zones (UK regions)
const CLIMATE_ZONES = {
  south: { label: "South England", designTemp: -3, heatingDays: 220 },
  midlands: { label: "Midlands/Wales", designTemp: -4, heatingDays: 240 },
  north: { label: "North England", designTemp: -5, heatingDays: 260 },
  scotland: { label: "Scotland", designTemp: -7, heatingDays: 280 },
  highlands: { label: "Scottish Highlands", designTemp: -10, heatingDays: 300 },
};

export default function HeatPumpSizingWizard() {
  // Property inputs
  const [propertyType, setPropertyType] = useState<keyof typeof PROPERTY_TYPES>("semi");
  const [floorArea, setFloorArea] = useState(90);
  const [bedrooms, setBedrooms] = useState(3);
  const [insulation, setInsulation] = useState<keyof typeof INSULATION_LEVELS>("average");
  const [climateZone, setClimateZone] = useState<keyof typeof CLIMATE_ZONES>("midlands");
  const [currentHeating, setCurrentHeating] = useState<keyof typeof CURRENT_HEATING>("gas_boiler");
  
  // Hot water demand
  const [occupants, setOccupants] = useState(3);
  const [bathrooms, setBathrooms] = useState(1);
  
  // Garden space for GSHP
  const [hasGarden, setHasGarden] = useState("yes");
  const [gardenSize, setGardenSize] = useState("medium");

  // Calculate recommendations
  const recommendations = useMemo(() => {
    const propType = PROPERTY_TYPES[propertyType];
    const insulLevel = INSULATION_LEVELS[insulation];
    const climate = CLIMATE_ZONES[climateZone];
    const heating = CURRENT_HEATING[currentHeating];
    
    // Calculate heat demand using MCS-style calculation
    // Base: property type base + (floor area × multiplier)
    const baseHeatDemand = propType.baseKw + (floorArea * propType.floorMultiplier);
    
    // Adjust for insulation
    const insulationAdjusted = baseHeatDemand * insulLevel.heatLossMultiplier;
    
    // Adjust for climate (colder = more heat)
    const climateFactor = 1 + (Math.abs(climate.designTemp) - 4) * 0.03;
    const climateAdjusted = insulationAdjusted * climateFactor;
    
    // Add hot water demand (approx 1kW per bathroom, 0.5kW per person)
    const hotWaterDemand = bathrooms * 0.8 + occupants * 0.3;
    
    // Total heat demand
    const totalDemand = climateAdjusted + hotWaterDemand;
    
    // Round to nearest kW
    const recommendedKw = Math.ceil(totalDemand);
    
    // Determine ASHP recommendation
    let ashpModel: keyof typeof RENEWABLE_TECHNOLOGIES;
    if (recommendedKw <= 9) {
      ashpModel = "ashp_8kw";
    } else {
      ashpModel = "ashp_12kw";
    }
    const ashp = RENEWABLE_TECHNOLOGIES[ashpModel];
    
    // GSHP recommendation (if space available)
    const gshpViable = hasGarden === "yes" && (gardenSize === "medium" || gardenSize === "large");
    const gshp = RENEWABLE_TECHNOLOGIES.gshp_10kw;
    
    // BUS grant eligibility
    const busEligible = ["gas_boiler", "oil_boiler", "lpg", "coal_solid"].includes(currentHeating);
    const busGrant = busEligible ? 7500 : 0;
    
    // Running cost comparison (annual)
    // Assume current gas cost 5p/kWh, electricity 28p/kWh
    const annualHeatDemandKwh = floorArea * 100 * insulLevel.heatLossMultiplier; // rough estimate
    
    const currentGasCost = Math.round(annualHeatDemandKwh * 0.05);
    const currentOilCost = Math.round(annualHeatDemandKwh * 0.07);
    
    // Heat pump running cost (COP 3.0 for ASHP, 4.0 for GSHP)
    const ashpRunningCost = Math.round((annualHeatDemandKwh / 3.0) * 0.28);
    const gshpRunningCost = Math.round((annualHeatDemandKwh / 4.0) * 0.28);
    
    // Current running cost based on heating type
    let currentRunningCost = currentGasCost;
    if (currentHeating === "oil_boiler") currentRunningCost = currentOilCost;
    if (currentHeating === "electric" || currentHeating === "storage_heaters") {
      currentRunningCost = Math.round(annualHeatDemandKwh * 0.28);
    }
    
    // Annual savings (if replacing fossil fuel)
    const ashpSavings = currentRunningCost - ashpRunningCost;
    const gshpSavings = currentRunningCost - gshpRunningCost;
    
    // Suitability warnings
    const warnings: string[] = [];
    if (insulation === "poor") {
      warnings.push("Poor insulation will reduce efficiency. Consider upgrading insulation first.");
    }
    if (recommendedKw > 15) {
      warnings.push("High heat demand. Consider insulation upgrades to reduce system size.");
    }
    if (bedrooms >= 4 && bathrooms < 2) {
      warnings.push("Consider cylinder size for hot water demand with larger household.");
    }
    if (currentHeating === "electric" || currentHeating === "storage_heaters") {
      warnings.push("Already using electricity - no BUS grant, but running costs should improve.");
    }
    
    // Positives
    const positives: string[] = [];
    if (busEligible) {
      positives.push("Eligible for £7,500 BUS grant");
    }
    if (insulation === "good" || insulation === "excellent") {
      positives.push("Good insulation will maximize heat pump efficiency");
    }
    if (gshpViable) {
      positives.push("Garden suitable for ground source installation");
    }
    if (currentHeating === "oil_boiler" || currentHeating === "lpg") {
      positives.push("Removing oil/LPG dependency - good for environment and price stability");
    }
    
    return {
      recommendedKw,
      totalDemand: Math.round(totalDemand * 10) / 10,
      ashp,
      ashpModel,
      gshp,
      gshpViable,
      busEligible,
      busGrant,
      annualHeatDemandKwh,
      currentRunningCost,
      ashpRunningCost,
      gshpRunningCost,
      ashpSavings,
      gshpSavings,
      warnings,
      positives,
      heating,
    };
  }, [propertyType, floorArea, bedrooms, insulation, climateZone, currentHeating, occupants, bathrooms, hasGarden, gardenSize]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Heat Pump Sizing Wizard
          </CardTitle>
          <CardDescription>
            Get ASHP/GSHP recommendations based on your property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Property Type */}
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select value={propertyType} onValueChange={(v) => setPropertyType(v as keyof typeof PROPERTY_TYPES)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PROPERTY_TYPES).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Floor Area */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Floor Area (m²)</Label>
              <Input
                type="number"
                value={floorArea}
                onChange={(e) => setFloorArea(Number(e.target.value))}
                min={30}
                max={400}
              />
            </div>
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                min={1}
                max={8}
              />
            </div>
          </div>

          {/* Insulation Level */}
          <div className="space-y-2">
            <Label>Insulation Level</Label>
            <Select value={insulation} onValueChange={(v) => setInsulation(v as keyof typeof INSULATION_LEVELS)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INSULATION_LEVELS).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {INSULATION_LEVELS[insulation].description}
            </p>
          </div>

          {/* Climate Zone */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={climateZone} onValueChange={(v) => setClimateZone(v as keyof typeof CLIMATE_ZONES)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CLIMATE_ZONES).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Current Heating */}
          <div className="space-y-2">
            <Label>Current Heating System</Label>
            <Select value={currentHeating} onValueChange={(v) => setCurrentHeating(v as keyof typeof CURRENT_HEATING)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CURRENT_HEATING).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {CURRENT_HEATING[currentHeating].notes}
            </p>
          </div>

          {/* Occupancy */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Occupants</Label>
              <Input
                type="number"
                value={occupants}
                onChange={(e) => setOccupants(Number(e.target.value))}
                min={1}
                max={10}
              />
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                min={1}
                max={5}
              />
            </div>
          </div>

          {/* Garden for GSHP */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Garden Access?</Label>
              <Select value={hasGarden} onValueChange={setHasGarden}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {hasGarden === "yes" && (
              <div className="space-y-2">
                <Label>Garden Size</Label>
                <Select value={gardenSize} onValueChange={setGardenSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (&lt;100m²)</SelectItem>
                    <SelectItem value="medium">Medium (100-300m²)</SelectItem>
                    <SelectItem value="large">Large (&gt;300m²)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-warning" />
            Sizing Recommendation
          </CardTitle>
          <CardDescription>
            Calculated heat demand: {recommendations.totalDemand}kW
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* ASHP Recommendation */}
          <div className="p-4 rounded-lg border bg-primary/5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <Thermometer className="h-4 w-4" />
                Air Source Heat Pump
              </h4>
              <Badge>Recommended</Badge>
            </div>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model Size</span>
                <span className="font-mono">{recommendations.ashp.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Install Cost</span>
                <span className="font-mono">
                  £{recommendations.ashp.typicalCost.min.toLocaleString()} - £{recommendations.ashp.typicalCost.max.toLocaleString()}
                </span>
              </div>
              {recommendations.busEligible && (
                <div className="flex justify-between text-success">
                  <span>After BUS Grant</span>
                  <span className="font-mono font-medium">
                    £{(recommendations.ashp.typicalCost.min - 7500).toLocaleString()} - £{(recommendations.ashp.typicalCost.max - 7500).toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Annual Cost</span>
                <span className="font-mono">£{recommendations.ashpRunningCost}</span>
              </div>
              {recommendations.ashpSavings > 0 && (
                <div className="flex justify-between text-success">
                  <span>Est. Annual Savings</span>
                  <span className="font-mono">£{recommendations.ashpSavings}</span>
                </div>
              )}
            </div>
          </div>

          {/* GSHP Recommendation */}
          {recommendations.gshpViable && (
            <div className="p-4 rounded-lg border space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Ground Source Heat Pump
                </h4>
                <Badge variant="outline">Alternative</Badge>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model Size</span>
                  <span className="font-mono">{recommendations.gshp.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Install Cost</span>
                  <span className="font-mono">
                    £{recommendations.gshp.typicalCost.min.toLocaleString()} - £{recommendations.gshp.typicalCost.max.toLocaleString()}
                  </span>
                </div>
                {recommendations.busEligible && (
                  <div className="flex justify-between text-success">
                    <span>After BUS Grant</span>
                    <span className="font-mono">
                      £{(recommendations.gshp.typicalCost.min - 7500).toLocaleString()} - £{(recommendations.gshp.typicalCost.max - 7500).toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Efficiency (COP)</span>
                  <span className="font-mono">4.0 - 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Annual Cost</span>
                  <span className="font-mono">£{recommendations.gshpRunningCost}</span>
                </div>
              </div>
            </div>
          )}

          {/* BUS Grant */}
          {recommendations.busEligible && (
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <PoundSterling className="h-4 w-4 text-success" />
                Boiler Upgrade Scheme
              </h4>
              <p className="text-sm text-muted-foreground">
                You're eligible for a £7,500 grant towards heat pump installation.
              </p>
            </div>
          )}

          {/* Positives */}
          {recommendations.positives.length > 0 && (
            <div className="space-y-2">
              {recommendations.positives.map((pos, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                  <span>{pos}</span>
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {recommendations.warnings.length > 0 && (
            <div className="space-y-2">
              {recommendations.warnings.map((warn, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{warn}</span>
                </div>
              ))}
            </div>
          )}

          <Button variant="outline" className="w-full" asChild>
            <a href="https://www.gov.uk/apply-boiler-upgrade-scheme" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply for BUS Grant
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
