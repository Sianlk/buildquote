import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sun, TrendingUp, Calculator, Zap, PoundSterling, ExternalLink } from "lucide-react";
import { RENEWABLE_TECHNOLOGIES } from "@/lib/renewables-module-data";

// Panel orientation efficiency factors
const ORIENTATION_FACTORS: Record<string, number> = {
  south: 1.0,
  "south-east": 0.96,
  "south-west": 0.96,
  east: 0.85,
  west: 0.85,
  "north-east": 0.70,
  "north-west": 0.70,
  north: 0.55,
  flat: 0.90,
};

// Roof pitch efficiency (optimal 30-40 degrees)
const PITCH_FACTORS: Record<string, number> = {
  flat_0: 0.85,
  low_15: 0.92,
  optimal_30: 1.0,
  moderate_40: 0.98,
  steep_50: 0.90,
  very_steep_60: 0.80,
};

// Shading impact on generation
const SHADING_FACTORS: Record<string, number> = {
  none: 1.0,
  light: 0.90,
  moderate: 0.75,
  heavy: 0.50,
};

// SEG tariff rates (p/kWh) - 2026 rates
const SEG_TARIFFS: Record<string, { name: string; rate: number; description: string }> = {
  octopus_outgoing: { name: "Octopus Outgoing", rate: 15.0, description: "Variable rate, time-of-use" },
  octopus_fixed: { name: "Octopus Fixed SEG", rate: 4.1, description: "Fixed rate guarantee" },
  edf_export: { name: "EDF Export", rate: 5.6, description: "Standard export rate" },
  british_gas: { name: "British Gas", rate: 5.5, description: "Standard export rate" },
  ovo_energy: { name: "OVO Energy", rate: 7.5, description: "Competitive fixed rate" },
  e_on: { name: "E.ON Next Export", rate: 4.0, description: "Standard export rate" },
  social_energy: { name: "Social Energy", rate: 8.5, description: "Higher fixed rate" },
};

export default function SolarPVROICalculator() {
  // System inputs
  const [roofArea, setRoofArea] = useState(30);
  const [orientation, setOrientation] = useState("south");
  const [pitch, setPitch] = useState("optimal_30");
  const [shading, setShading] = useState("none");
  
  // Usage inputs
  const [annualElectricity, setAnnualElectricity] = useState(3500);
  const [electricityRate, setElectricityRate] = useState(28); // p/kWh
  const [selfConsumption, setSelfConsumption] = useState([35]); // % of generation used
  
  // Export tariff
  const [segTariff, setSegTariff] = useState("octopus_outgoing");
  
  // Calculate system sizing and ROI
  const results = useMemo(() => {
    // Determine system size based on roof area
    const size = roofArea >= 45 ? "solar_pv_6kw" : roofArea >= 30 ? "solar_pv_4kw" : "solar_pv_3kw";
    const tech = RENEWABLE_TECHNOLOGIES[size];
    const systemSizeKw = size === "solar_pv_6kw" ? 6 : size === "solar_pv_4kw" ? 4 : 3;
    
    // Base generation (kWh/year per kWp in UK) - varies by location
    const baseYieldPerKw = 900; // UK average
    
    // Apply efficiency factors
    const orientationFactor = ORIENTATION_FACTORS[orientation] || 1.0;
    const pitchFactor = PITCH_FACTORS[pitch] || 1.0;
    const shadingFactor = SHADING_FACTORS[shading] || 1.0;
    
    // Total efficiency multiplier
    const totalEfficiency = orientationFactor * pitchFactor * shadingFactor;
    
    // Annual generation
    const annualGeneration = Math.round(systemSizeKw * baseYieldPerKw * totalEfficiency);
    
    // Self-consumption calculation
    const selfConsumptionRate = selfConsumption[0] / 100;
    const kwhSelfConsumed = Math.round(annualGeneration * selfConsumptionRate);
    const kwhExported = annualGeneration - kwhSelfConsumed;
    
    // Financial calculations
    const savingsFromSelfConsumption = Math.round((kwhSelfConsumed * electricityRate) / 100);
    const segRate = SEG_TARIFFS[segTariff]?.rate || 5;
    const exportIncome = Math.round((kwhExported * segRate) / 100);
    const totalAnnualBenefit = savingsFromSelfConsumption + exportIncome;
    
    // Installation costs
    const installCostMin = tech.typicalCost.min;
    const installCostMax = tech.typicalCost.max;
    const avgInstallCost = (installCostMin + installCostMax) / 2;
    
    // Payback calculation
    const paybackYears = totalAnnualBenefit > 0 
      ? Math.round((avgInstallCost / totalAnnualBenefit) * 10) / 10 
      : 0;
    
    // 25-year savings (panel warranty period)
    const twentyFiveYearSavings = totalAnnualBenefit * 25;
    const twentyFiveYearROI = Math.round(((twentyFiveYearSavings - avgInstallCost) / avgInstallCost) * 100);
    
    // Carbon savings
    const carbonSavedKg = Math.round(annualGeneration * 0.233); // UK grid average
    
    return {
      systemSizeKw,
      tech,
      totalEfficiency: Math.round(totalEfficiency * 100),
      annualGeneration,
      kwhSelfConsumed,
      kwhExported,
      savingsFromSelfConsumption,
      exportIncome,
      totalAnnualBenefit,
      installCostMin,
      installCostMax,
      avgInstallCost,
      paybackYears,
      twentyFiveYearSavings,
      twentyFiveYearROI,
      carbonSavedKg,
      segRate,
    };
  }, [roofArea, orientation, pitch, shading, annualElectricity, electricityRate, selfConsumption, segTariff]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Solar PV ROI Calculator
          </CardTitle>
          <CardDescription>
            Factor in orientation, shading, and Smart Export Guarantee tariffs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Roof Area */}
          <div className="space-y-2">
            <Label>Available Roof Area (m²)</Label>
            <Input
              type="number"
              value={roofArea}
              onChange={(e) => setRoofArea(Number(e.target.value))}
              min={10}
              max={100}
            />
            <p className="text-xs text-muted-foreground">
              Typical UK home: 20-40m². Affects system size recommendation.
            </p>
          </div>

          {/* Orientation */}
          <div className="space-y-2">
            <Label>Panel Orientation</Label>
            <Select value={orientation} onValueChange={setOrientation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="south">South (100%)</SelectItem>
                <SelectItem value="south-east">South-East (96%)</SelectItem>
                <SelectItem value="south-west">South-West (96%)</SelectItem>
                <SelectItem value="east">East (85%)</SelectItem>
                <SelectItem value="west">West (85%)</SelectItem>
                <SelectItem value="north-east">North-East (70%)</SelectItem>
                <SelectItem value="north-west">North-West (70%)</SelectItem>
                <SelectItem value="north">North (55%)</SelectItem>
                <SelectItem value="flat">Flat Roof (90%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <Label>Roof Pitch</Label>
            <Select value={pitch} onValueChange={setPitch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat_0">Flat (0°) - 85%</SelectItem>
                <SelectItem value="low_15">Low (15°) - 92%</SelectItem>
                <SelectItem value="optimal_30">Optimal (30-35°) - 100%</SelectItem>
                <SelectItem value="moderate_40">Moderate (40°) - 98%</SelectItem>
                <SelectItem value="steep_50">Steep (50°) - 90%</SelectItem>
                <SelectItem value="very_steep_60">Very Steep (60°) - 80%</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Shading */}
          <div className="space-y-2">
            <Label>Shading Level</Label>
            <Select value={shading} onValueChange={setShading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Shading (100%)</SelectItem>
                <SelectItem value="light">Light Shading (90%)</SelectItem>
                <SelectItem value="moderate">Moderate Shading (75%)</SelectItem>
                <SelectItem value="heavy">Heavy Shading (50%)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Trees, chimneys, or nearby buildings affecting roof
            </p>
          </div>

          {/* Self Consumption */}
          <div className="space-y-2">
            <Label>Self-Consumption Rate: {selfConsumption[0]}%</Label>
            <Slider
              value={selfConsumption}
              onValueChange={setSelfConsumption}
              min={20}
              max={80}
              step={5}
            />
            <p className="text-xs text-muted-foreground">
              Typical: 30-40% without battery, 60-80% with battery
            </p>
          </div>

          {/* Electricity Rate */}
          <div className="space-y-2">
            <Label>Current Electricity Rate (p/kWh)</Label>
            <Input
              type="number"
              value={electricityRate}
              onChange={(e) => setElectricityRate(Number(e.target.value))}
              min={10}
              max={50}
            />
          </div>

          {/* SEG Tariff */}
          <div className="space-y-2">
            <Label>Smart Export Guarantee Tariff</Label>
            <Select value={segTariff} onValueChange={setSegTariff}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SEG_TARIFFS).map(([key, tariff]) => (
                  <SelectItem key={key} value={key}>
                    {tariff.name} ({tariff.rate}p/kWh)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {SEG_TARIFFS[segTariff]?.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            ROI Analysis
          </CardTitle>
          <CardDescription>
            Based on your inputs with {results.systemSizeKw}kWp system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* System Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">System Size</span>
              <Badge>{results.systemSizeKw} kWp</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Overall Efficiency</span>
              <span className="font-mono">{results.totalEfficiency}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Annual Generation</span>
              <span className="font-mono font-medium">{results.annualGeneration.toLocaleString()} kWh</span>
            </div>
          </div>

          {/* Energy Distribution */}
          <div className="p-4 rounded-lg border space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Energy Distribution
            </h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Self-Consumed</span>
              <span className="font-mono">{results.kwhSelfConsumed.toLocaleString()} kWh</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exported to Grid</span>
              <span className="font-mono">{results.kwhExported.toLocaleString()} kWh</span>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 rounded-lg bg-success/10 border border-success/30 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-success" />
              Annual Financial Benefit
            </h4>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bill Savings</span>
              <span className="font-mono text-success">£{results.savingsFromSelfConsumption}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">SEG Export Income ({results.segRate}p/kWh)</span>
              <span className="font-mono text-success">£{results.exportIncome}</span>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Annual Benefit</span>
              <span className="font-mono text-success text-lg">£{results.totalAnnualBenefit}</span>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">Install Cost</p>
              <p className="font-mono font-medium">
                £{results.installCostMin.toLocaleString()} - £{results.installCostMax.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">Payback Period</p>
              <p className="font-mono font-medium text-lg">{results.paybackYears} years</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">25-Year Savings</p>
              <p className="font-mono font-medium text-success">
                £{results.twentyFiveYearSavings.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">25-Year ROI</p>
              <p className="font-mono font-medium text-success">{results.twentyFiveYearROI}%</p>
            </div>
          </div>

          {/* Carbon Savings */}
          <div className="p-3 rounded-lg border flex justify-between items-center">
            <span className="text-sm">Annual CO₂ Saved</span>
            <Badge variant="secondary">{results.carbonSavedKg.toLocaleString()} kg</Badge>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a href="https://www.mcs.org.uk/find-an-installer" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Find MCS Certified Installer
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
