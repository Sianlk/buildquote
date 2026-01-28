import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Thermometer, TreeDeciduous, AlertTriangle, CheckCircle2, Info } from "lucide-react";

// Soil thermal conductivity (W/mK)
const SOIL_TYPES: Record<string, { conductivity: number; label: string; extractionRate: number }> = {
  clay_wet: { conductivity: 1.8, label: "Wet Clay", extractionRate: 55 },
  clay_dry: { conductivity: 1.0, label: "Dry Clay", extractionRate: 35 },
  sand_wet: { conductivity: 2.4, label: "Wet Sand/Gravel", extractionRate: 65 },
  sand_dry: { conductivity: 0.4, label: "Dry Sand", extractionRate: 20 },
  chalk: { conductivity: 1.5, label: "Chalk", extractionRate: 45 },
  rock: { conductivity: 3.5, label: "Rock/Limestone", extractionRate: 70 },
  average: { conductivity: 1.5, label: "Average UK Soil", extractionRate: 45 },
};

// Property heat demand estimates (kW)
const PROPERTY_TYPES: Record<string, { heatLoss: number; label: string }> = {
  flat_1bed: { heatLoss: 4, label: "1-Bed Flat" },
  flat_2bed: { heatLoss: 5, label: "2-Bed Flat" },
  terrace_2bed: { heatLoss: 6, label: "2-Bed Terraced" },
  terrace_3bed: { heatLoss: 8, label: "3-Bed Terraced" },
  semi_3bed: { heatLoss: 10, label: "3-Bed Semi-Detached" },
  semi_4bed: { heatLoss: 12, label: "4-Bed Semi-Detached" },
  detached_3bed: { heatLoss: 12, label: "3-Bed Detached" },
  detached_4bed: { heatLoss: 15, label: "4-Bed Detached" },
  detached_5bed: { heatLoss: 18, label: "5-Bed Detached" },
};

const INSULATION_FACTORS: Record<string, { factor: number; label: string }> = {
  poor: { factor: 1.3, label: "Poor (Pre-1980, uninsulated)" },
  average: { factor: 1.0, label: "Average (1980-2000)" },
  good: { factor: 0.8, label: "Good (2000-2015)" },
  excellent: { factor: 0.65, label: "Excellent (Post-2015 or retrofitted)" },
};

export default function GSHPSizingCalculator() {
  const [propertyType, setPropertyType] = useState("semi_3bed");
  const [insulation, setInsulation] = useState("average");
  const [soilType, setSoilType] = useState("average");
  const [gardenLength, setGardenLength] = useState(20);
  const [gardenWidth, setGardenWidth] = useState(10);

  const results = useMemo(() => {
    const property = PROPERTY_TYPES[propertyType] || PROPERTY_TYPES.semi_3bed;
    const insulationFactor = INSULATION_FACTORS[insulation]?.factor || 1.0;
    const soil = SOIL_TYPES[soilType] || SOIL_TYPES.average;

    // Calculate heat demand
    const heatDemand = Math.round(property.heatLoss * insulationFactor * 10) / 10;

    // Garden area
    const gardenArea = gardenLength * gardenWidth;

    // Borehole calculations (vertical)
    // Typical extraction rate: 30-70 W/m depending on soil
    const extractionRatePerMetre = soil.extractionRate; // W/m
    const boreholeDepthRequired = Math.ceil((heatDemand * 1000) / extractionRatePerMetre);
    const numberOfBoreholes = boreholeDepthRequired > 150 ? Math.ceil(boreholeDepthRequired / 100) : 1;
    const depthPerBorehole = Math.ceil(boreholeDepthRequired / numberOfBoreholes);

    // Horizontal trench calculations
    // Typical extraction rate: 15-40 W/m² depending on soil
    const trenchExtractionRate = soil.extractionRate * 0.6; // W/m²
    const trenchAreaRequired = Math.ceil((heatDemand * 1000) / trenchExtractionRate);
    const trenchLengthRequired = Math.ceil(trenchAreaRequired / 1); // 1m width trenches
    const trenchIsFeasible = trenchAreaRequired <= gardenArea * 0.7; // Max 70% of garden

    // Slinky coil option (more compact)
    const slinkyAreaRequired = Math.ceil(trenchAreaRequired * 0.5); // Slinkies need ~50% less area
    const slinkyIsFeasible = slinkyAreaRequired <= gardenArea * 0.6;

    // Cost estimates
    const boreholeCost = numberOfBoreholes * depthPerBorehole * 85; // £85/m drilling
    const trenchCost = trenchAreaRequired * 35; // £35/m² excavation
    const slinkyCost = slinkyAreaRequired * 45; // £45/m² for slinky
    const heatPumpCost = Math.round(heatDemand * 1200); // £1200/kW for GSHP unit

    // Recommended option
    let recommendation: "borehole" | "trench" | "slinky" | "none" = "none";
    let feasibilityNote = "";

    if (slinkyIsFeasible && slinkyCost + heatPumpCost < boreholeCost + heatPumpCost) {
      recommendation = "slinky";
      feasibilityNote = "Slinky coils offer best value for your garden size";
    } else if (trenchIsFeasible && trenchCost + heatPumpCost < boreholeCost + heatPumpCost) {
      recommendation = "trench";
      feasibilityNote = "Horizontal trenches are most cost-effective";
    } else if (gardenArea >= 50) {
      recommendation = "borehole";
      feasibilityNote = "Boreholes recommended due to garden constraints";
    } else {
      feasibilityNote = "Garden may be too small for GSHP - consider ASHP";
    }

    // BUS grant eligibility
    const busGrant = 7500;

    return {
      heatDemand,
      gardenArea,
      boreholeDepthRequired,
      numberOfBoreholes,
      depthPerBorehole,
      trenchAreaRequired,
      trenchLengthRequired,
      trenchIsFeasible,
      slinkyAreaRequired,
      slinkyIsFeasible,
      boreholeCost,
      trenchCost,
      slinkyCost,
      heatPumpCost,
      totalBoreholeCost: boreholeCost + heatPumpCost,
      totalTrenchCost: trenchCost + heatPumpCost,
      totalSlinkyCost: slinkyCost + heatPumpCost,
      recommendation,
      feasibilityNote,
      busGrant,
      soil,
    };
  }, [propertyType, insulation, soilType, gardenLength, gardenWidth]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            GSHP Sizing Calculator
          </CardTitle>
          <CardDescription>
            Calculate borehole depth or trench area based on your property and garden
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Property Type */}
          <div className="space-y-2">
            <Label>Property Type</Label>
            <Select value={propertyType} onValueChange={setPropertyType}>
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

          {/* Insulation Level */}
          <div className="space-y-2">
            <Label>Insulation Level</Label>
            <Select value={insulation} onValueChange={setInsulation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INSULATION_FACTORS).map(([key, val]) => (
                  <SelectItem key={key} value={key}>{val.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label>Soil Type</Label>
            <Select value={soilType} onValueChange={setSoilType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOIL_TYPES).map(([key, val]) => (
                  <SelectItem key={key} value={key}>
                    {val.label} ({val.extractionRate} W/m)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Higher conductivity = more efficient heat extraction
            </p>
          </div>

          {/* Garden Dimensions */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TreeDeciduous className="h-4 w-4" />
              Garden Dimensions
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Length (m)</Label>
                <Input
                  type="number"
                  value={gardenLength}
                  onChange={(e) => setGardenLength(Number(e.target.value))}
                  min={5}
                  max={100}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Width (m)</Label>
                <Input
                  type="number"
                  value={gardenWidth}
                  onChange={(e) => setGardenWidth(Number(e.target.value))}
                  min={5}
                  max={50}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total area: {results.gardenArea}m²
            </p>
          </div>

          {/* Heat Demand Result */}
          <div className="p-4 rounded-lg bg-muted border">
            <div className="flex justify-between items-center">
              <span className="font-medium">Estimated Heat Demand</span>
              <Badge variant="default">{results.heatDemand} kW</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Ground Loop Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recommendation */}
          <Alert className={results.recommendation !== "none" ? "border-success bg-success/10" : ""}>
            <Info className="h-4 w-4" />
            <AlertDescription>{results.feasibilityNote}</AlertDescription>
          </Alert>

          {/* Borehole Option */}
          <div className={`p-4 rounded-lg border ${results.recommendation === "borehole" ? "border-success bg-success/5" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Vertical Boreholes</h4>
              {results.recommendation === "borehole" && <Badge>Recommended</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Number of Boreholes</span>
                <p className="font-mono font-medium">{results.numberOfBoreholes}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Depth Each</span>
                <p className="font-mono font-medium">{results.depthPerBorehole}m</p>
              </div>
              <div>
                <span className="text-muted-foreground">Drilling Cost</span>
                <p className="font-mono">£{results.boreholeCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total System</span>
                <p className="font-mono font-medium">£{results.totalBoreholeCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Horizontal Trench Option */}
          <div className={`p-4 rounded-lg border ${results.recommendation === "trench" ? "border-success bg-success/5" : ""} ${!results.trenchIsFeasible ? "opacity-60" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Horizontal Trenches</h4>
              {results.recommendation === "trench" && <Badge>Recommended</Badge>}
              {!results.trenchIsFeasible && <Badge variant="destructive">Too Large</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Area Required</span>
                <p className="font-mono font-medium">{results.trenchAreaRequired}m²</p>
              </div>
              <div>
                <span className="text-muted-foreground">Trench Length</span>
                <p className="font-mono font-medium">{results.trenchLengthRequired}m</p>
              </div>
              <div>
                <span className="text-muted-foreground">Excavation Cost</span>
                <p className="font-mono">£{results.trenchCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total System</span>
                <p className="font-mono font-medium">£{results.totalTrenchCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Slinky Coil Option */}
          <div className={`p-4 rounded-lg border ${results.recommendation === "slinky" ? "border-success bg-success/5" : ""} ${!results.slinkyIsFeasible ? "opacity-60" : ""}`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Slinky Coils</h4>
              {results.recommendation === "slinky" && <Badge>Recommended</Badge>}
              {!results.slinkyIsFeasible && <Badge variant="destructive">Too Large</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Area Required</span>
                <p className="font-mono font-medium">{results.slinkyAreaRequired}m²</p>
              </div>
              <div>
                <span className="text-muted-foreground">vs Garden</span>
                <p className="font-mono">{Math.round((results.slinkyAreaRequired / results.gardenArea) * 100)}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">Install Cost</span>
                <p className="font-mono">£{results.slinkyCost.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total System</span>
                <p className="font-mono font-medium">£{results.totalSlinkyCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* BUS Grant */}
          <div className="p-3 rounded-lg bg-success/10 border border-success/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-sm">Boiler Upgrade Scheme Grant</p>
                <p className="text-xs text-muted-foreground">Available for MCS-certified installations</p>
              </div>
              <Badge variant="default" className="text-lg">-£{results.busGrant.toLocaleString()}</Badge>
            </div>
          </div>

          {/* Warning */}
          <Alert variant="default">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Estimates are indicative. A professional MCS survey is required for accurate sizing and ground conditions assessment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
