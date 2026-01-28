import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Sun, Battery, TrendingUp, Zap, PoundSterling } from "lucide-react";

// Solar system options
const SOLAR_OPTIONS = [
  { id: "3kw", label: "3kWp (10-12 panels)", generation: 2700, cost: 6250 },
  { id: "4kw", label: "4kWp (14-16 panels)", generation: 3600, cost: 7500 },
  { id: "5kw", label: "5kWp (17-20 panels)", generation: 4500, cost: 8750 },
  { id: "6kw", label: "6kWp (20-24 panels)", generation: 5400, cost: 10500 },
];

// Battery options
const BATTERY_OPTIONS = [
  { id: "none", label: "No Battery", capacity: 0, cost: 0 },
  { id: "5kwh", label: "5kWh Battery", capacity: 5, cost: 4250 },
  { id: "7kwh", label: "7.5kWh Battery", capacity: 7.5, cost: 5500 },
  { id: "10kwh", label: "10kWh Battery", capacity: 10, cost: 7250 },
  { id: "13kwh", label: "13.5kWh (Tesla Powerwall)", capacity: 13.5, cost: 9500 },
];

export default function SolarBatteryPackageCalculator() {
  const [solarSize, setSolarSize] = useState("4kw");
  const [batterySize, setBatterySize] = useState("10kwh");
  const [electricityRate, setElectricityRate] = useState([28]); // p/kWh
  const [segRate, setSegRate] = useState([5]); // p/kWh export

  const results = useMemo(() => {
    const solar = SOLAR_OPTIONS.find(s => s.id === solarSize) || SOLAR_OPTIONS[1];
    const battery = BATTERY_OPTIONS.find(b => b.id === batterySize) || BATTERY_OPTIONS[0];

    // Self-consumption rates vary based on battery size
    const baseSelfConsumption = 0.30; // 30% without battery
    const batteryBoost = battery.capacity > 0 ? Math.min(0.45, battery.capacity * 0.04) : 0;
    const selfConsumptionRate = baseSelfConsumption + batteryBoost;

    // Energy calculations
    const selfConsumed = Math.round(solar.generation * selfConsumptionRate);
    const exported = solar.generation - selfConsumed;

    // Financial calculations
    const savingsFromSelfConsumption = Math.round((selfConsumed * electricityRate[0]) / 100);
    const exportIncome = Math.round((exported * segRate[0]) / 100);
    const totalAnnualBenefit = savingsFromSelfConsumption + exportIncome;

    // Costs
    const totalCost = solar.cost + battery.cost;
    const paybackYears = totalAnnualBenefit > 0 ? Math.round((totalCost / totalAnnualBenefit) * 10) / 10 : 0;

    // 25-year analysis
    const twentyFiveYearSavings = totalAnnualBenefit * 25;
    const twentyFiveYearROI = Math.round(((twentyFiveYearSavings - totalCost) / totalCost) * 100);

    // Carbon savings
    const carbonSaved = Math.round(solar.generation * 0.233);

    // Optimal pairing check
    const batteryToSolarRatio = battery.capacity / (solar.generation / 1000);
    let pairingAdvice = "";
    if (battery.capacity === 0) {
      pairingAdvice = "Add battery to increase self-consumption from 30% to 60%+";
    } else if (batteryToSolarRatio < 1.5) {
      pairingAdvice = "Consider larger battery for optimal self-consumption";
    } else if (batteryToSolarRatio > 3) {
      pairingAdvice = "Battery may be oversized for this solar system";
    } else {
      pairingAdvice = "Optimal pairing for maximum self-consumption";
    }

    return {
      solar,
      battery,
      selfConsumptionRate: Math.round(selfConsumptionRate * 100),
      selfConsumed,
      exported,
      savingsFromSelfConsumption,
      exportIncome,
      totalAnnualBenefit,
      totalCost,
      paybackYears,
      twentyFiveYearSavings,
      twentyFiveYearROI,
      carbonSaved,
      pairingAdvice,
    };
  }, [solarSize, batterySize, electricityRate, segRate]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-warning" />
            <Battery className="h-5 w-5 text-success" />
            Solar + Battery Package
          </CardTitle>
          <CardDescription>
            Find the optimal solar and battery combination for your home
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Solar Size */}
          <div className="space-y-2">
            <Label>Solar PV System Size</Label>
            <Select value={solarSize} onValueChange={setSolarSize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOLAR_OPTIONS.map(opt => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label} - £{opt.cost.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Generates ~{results.solar.generation.toLocaleString()} kWh/year
            </p>
          </div>

          {/* Battery Size */}
          <div className="space-y-2">
            <Label>Battery Storage</Label>
            <Select value={batterySize} onValueChange={setBatterySize}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BATTERY_OPTIONS.map(opt => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label} {opt.cost > 0 && `- £${opt.cost.toLocaleString()}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Electricity Rate */}
          <div className="space-y-2">
            <Label>Electricity Rate: {electricityRate[0]}p/kWh</Label>
            <Slider
              value={electricityRate}
              onValueChange={setElectricityRate}
              min={15}
              max={45}
              step={1}
            />
          </div>

          {/* Export Rate */}
          <div className="space-y-2">
            <Label>Export (SEG) Rate: {segRate[0]}p/kWh</Label>
            <Slider
              value={segRate}
              onValueChange={setSegRate}
              min={3}
              max={15}
              step={0.5}
            />
            <p className="text-xs text-muted-foreground">
              Octopus Outgoing pays up to 15p, fixed SEG ~4-5p
            </p>
          </div>

          {/* Pairing Advice */}
          <div className={`p-3 rounded-lg border ${
            results.pairingAdvice.includes("Optimal") ? "bg-success/10 border-success/30" : "bg-muted"
          }`}>
            <p className="text-sm font-medium">{results.pairingAdvice}</p>
          </div>
        </CardContent>
      </Card>

      {/* Results Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Package Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Self-Consumption */}
          <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Self-Consumption Rate</span>
              <Badge variant={results.selfConsumptionRate >= 60 ? "default" : "secondary"}>
                {results.selfConsumptionRate}%
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Self-Consumed</span>
                <p className="font-mono">{results.selfConsumed.toLocaleString()} kWh</p>
              </div>
              <div>
                <span className="text-muted-foreground">Exported</span>
                <p className="font-mono">{results.exported.toLocaleString()} kWh</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="p-4 rounded-lg bg-success/10 border border-success/30 space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <PoundSterling className="h-4 w-4 text-success" />
              Annual Financial Benefit
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Bill Savings</span>
                <p className="font-mono text-success">£{results.savingsFromSelfConsumption}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Export Income</span>
                <p className="font-mono text-success">£{results.exportIncome}</p>
              </div>
            </div>
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total Annual Benefit</span>
              <span className="font-mono text-success text-lg">£{results.totalAnnualBenefit}</span>
            </div>
          </div>

          {/* Investment Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">Package Cost</p>
              <p className="font-mono font-medium text-lg">£{results.totalCost.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">Payback Period</p>
              <p className="font-mono font-medium text-lg">{results.paybackYears} years</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">25-Year Savings</p>
              <p className="font-mono font-medium text-success">£{results.twentyFiveYearSavings.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">25-Year ROI</p>
              <p className="font-mono font-medium text-success">{results.twentyFiveYearROI}%</p>
            </div>
          </div>

          {/* Carbon Savings */}
          <div className="p-3 rounded-lg border flex justify-between items-center">
            <span className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              Annual CO₂ Saved
            </span>
            <Badge variant="secondary">{results.carbonSaved.toLocaleString()} kg</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
