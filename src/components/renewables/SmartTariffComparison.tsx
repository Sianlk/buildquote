import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, Clock, TrendingUp, Car, Battery, Sun } from "lucide-react";

// Smart tariff definitions (Jan 2026 rates)
interface SmartTariff {
  id: string;
  name: string;
  provider: string;
  description: string;
  peakRate: number; // p/kWh
  offPeakRate: number; // p/kWh
  offPeakHours: string;
  standingCharge: number; // p/day
  exportRate: number; // p/kWh
  bestFor: string[];
}

const SMART_TARIFFS: SmartTariff[] = [
  {
    id: "standard",
    name: "Standard Variable",
    provider: "Any",
    description: "Typical single-rate tariff for comparison",
    peakRate: 28,
    offPeakRate: 28,
    offPeakHours: "N/A",
    standingCharge: 60,
    exportRate: 0,
    bestFor: ["No flexibility", "Low usage"],
  },
  {
    id: "octopus_go",
    name: "Octopus Go",
    provider: "Octopus Energy",
    description: "4 hours of super cheap electricity at night (00:30-04:30)",
    peakRate: 30,
    offPeakRate: 9,
    offPeakHours: "00:30-04:30",
    standingCharge: 53,
    exportRate: 4.1,
    bestFor: ["EV charging", "Battery storage"],
  },
  {
    id: "intelligent_octopus",
    name: "Intelligent Octopus Go",
    provider: "Octopus Energy",
    description: "Smart EV charging with extended cheap windows",
    peakRate: 30,
    offPeakRate: 9,
    offPeakHours: "23:30-05:30 + smart slots",
    standingCharge: 53,
    exportRate: 15,
    bestFor: ["Compatible EVs", "Smart charging"],
  },
  {
    id: "octopus_agile",
    name: "Octopus Agile",
    provider: "Octopus Energy",
    description: "Half-hourly pricing. Can go negative!",
    peakRate: 45,
    offPeakRate: 7,
    offPeakHours: "Variable (typically 01:00-05:00)",
    standingCharge: 53,
    exportRate: 15,
    bestFor: ["Battery storage", "Flexible loads", "Solar + battery"],
  },
  {
    id: "ovo_drive",
    name: "OVO Drive",
    provider: "OVO Energy",
    description: "EV tariff with cheaper night rates",
    peakRate: 29,
    offPeakRate: 12,
    offPeakHours: "00:00-07:00",
    standingCharge: 58,
    exportRate: 7.5,
    bestFor: ["EV owners", "Night charging"],
  },
  {
    id: "edf_goflex",
    name: "EDF GoElectric",
    provider: "EDF Energy",
    description: "Competitive EV rates with longer off-peak",
    peakRate: 32,
    offPeakRate: 10,
    offPeakHours: "00:00-07:00",
    standingCharge: 55,
    exportRate: 5.6,
    bestFor: ["EV charging", "Heat pumps"],
  },
];

export default function SmartTariffComparison() {
  const [annualUsage, setAnnualUsage] = useState(3500);
  const [offPeakPercentage, setOffPeakPercentage] = useState([40]);
  const [hasEV, setHasEV] = useState(false);
  const [evMiles, setEvMiles] = useState(8000);
  const [hasBattery, setHasBattery] = useState(false);
  const [hasSolar, setHasSolar] = useState(false);
  const [solarExport, setSolarExport] = useState(2000);

  const results = useMemo(() => {
    // Calculate EV consumption if applicable
    const evConsumption = hasEV ? Math.round(evMiles * 0.3) : 0; // 0.3 kWh/mile
    const totalUsage = annualUsage + evConsumption;

    // Calculate costs for each tariff
    const tariffAnalysis = SMART_TARIFFS.map(tariff => {
      const offPeakRatio = offPeakPercentage[0] / 100;
      const peakUsage = totalUsage * (1 - offPeakRatio);
      const offPeakUsage = totalUsage * offPeakRatio;

      // Annual electricity cost
      const peakCost = (peakUsage * tariff.peakRate) / 100;
      const offPeakCost = (offPeakUsage * tariff.offPeakRate) / 100;
      const standingCost = (tariff.standingCharge * 365) / 100;
      
      // Export income (if solar)
      const exportIncome = hasSolar ? (solarExport * tariff.exportRate) / 100 : 0;

      const totalCost = Math.round(peakCost + offPeakCost + standingCost - exportIncome);

      // Calculate suitability score
      let suitabilityScore = 50;
      if (hasEV && tariff.bestFor.some(b => b.toLowerCase().includes("ev"))) suitabilityScore += 25;
      if (hasBattery && tariff.bestFor.some(b => b.toLowerCase().includes("battery"))) suitabilityScore += 20;
      if (hasSolar && tariff.exportRate > 10) suitabilityScore += 15;
      if (offPeakRatio > 0.5 && tariff.offPeakRate < 12) suitabilityScore += 10;

      return {
        tariff,
        peakCost: Math.round(peakCost),
        offPeakCost: Math.round(offPeakCost),
        standingCost: Math.round(standingCost),
        exportIncome: Math.round(exportIncome),
        totalCost,
        suitabilityScore: Math.min(100, suitabilityScore),
      };
    });

    // Sort by total cost
    const sorted = [...tariffAnalysis].sort((a, b) => a.totalCost - b.totalCost);
    const cheapest = sorted[0];
    const standard = tariffAnalysis.find(t => t.tariff.id === "standard");
    const savingsVsStandard = standard ? standard.totalCost - cheapest.totalCost : 0;

    return {
      totalUsage,
      evConsumption,
      tariffAnalysis: sorted,
      cheapest,
      savingsVsStandard,
    };
  }, [annualUsage, offPeakPercentage, hasEV, evMiles, hasBattery, hasSolar, solarExport]);

  return (
    <div className="space-y-4">
      {/* Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Usage Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Annual Electricity (kWh)</Label>
              <Input
                type="number"
                value={annualUsage}
                onChange={(e) => setAnnualUsage(Number(e.target.value))}
                min={1000}
                max={15000}
              />
            </div>
            <div className="space-y-2">
              <Label>Off-Peak Usage: {offPeakPercentage[0]}%</Label>
              <Slider
                value={offPeakPercentage}
                onValueChange={setOffPeakPercentage}
                min={10}
                max={80}
                step={5}
              />
              <p className="text-xs text-muted-foreground">
                How much usage you can shift to night/off-peak
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Car className="h-4 w-4" />
              Electric Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Have EV?</Label>
              <Switch checked={hasEV} onCheckedChange={setHasEV} />
            </div>
            {hasEV && (
              <div className="space-y-2">
                <Label>Annual Miles</Label>
                <Input
                  type="number"
                  value={evMiles}
                  onChange={(e) => setEvMiles(Number(e.target.value))}
                  min={1000}
                  max={30000}
                />
                <p className="text-xs text-muted-foreground">
                  +{results.evConsumption.toLocaleString()} kWh/year
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Solar & Battery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                Battery Storage
              </Label>
              <Switch checked={hasBattery} onCheckedChange={setHasBattery} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Solar PV</Label>
              <Switch checked={hasSolar} onCheckedChange={setHasSolar} />
            </div>
            {hasSolar && (
              <div className="space-y-2">
                <Label>Annual Export (kWh)</Label>
                <Input
                  type="number"
                  value={solarExport}
                  onChange={(e) => setSolarExport(Number(e.target.value))}
                  min={0}
                  max={8000}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Best Tariff Summary */}
      <Card className="border-success bg-success/5">
        <CardContent className="pt-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Best Tariff for Your Usage</p>
              <h3 className="text-2xl font-bold">{results.cheapest?.tariff.name}</h3>
              <p className="text-sm text-muted-foreground">{results.cheapest?.tariff.provider}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Annual Cost</p>
              <p className="text-3xl font-bold text-success">£{results.cheapest?.totalCost.toLocaleString()}</p>
              {results.savingsVsStandard > 0 && (
                <Badge variant="default" className="mt-1">
                  Save £{results.savingsVsStandard}/year vs standard
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tariff Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            All Tariffs Compared
          </CardTitle>
          <CardDescription>
            Based on {results.totalUsage.toLocaleString()} kWh/year total usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Tariff</th>
                  <th className="text-left p-2 whitespace-nowrap">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Off-Peak
                  </th>
                  <th className="text-right p-2">Peak Rate</th>
                  <th className="text-right p-2">Off-Peak Rate</th>
                  <th className="text-right p-2">Export Rate</th>
                  <th className="text-right p-2 font-medium">Annual Cost</th>
                  <th className="text-center p-2">Match</th>
                </tr>
              </thead>
              <tbody>
                {results.tariffAnalysis.map((item, idx) => (
                  <tr
                    key={item.tariff.id}
                    className={`border-b ${idx === 0 ? "bg-success/10" : ""}`}
                  >
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{item.tariff.name}</p>
                        <p className="text-xs text-muted-foreground">{item.tariff.provider}</p>
                      </div>
                    </td>
                    <td className="p-2 text-xs">{item.tariff.offPeakHours}</td>
                    <td className="p-2 text-right font-mono">{item.tariff.peakRate}p</td>
                    <td className="p-2 text-right font-mono text-success">{item.tariff.offPeakRate}p</td>
                    <td className="p-2 text-right font-mono">{item.tariff.exportRate}p</td>
                    <td className="p-2 text-right font-mono font-medium">
                      £{item.totalCost.toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      <Badge
                        variant={item.suitabilityScore >= 75 ? "default" : item.suitabilityScore >= 50 ? "secondary" : "outline"}
                      >
                        {item.suitabilityScore}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
