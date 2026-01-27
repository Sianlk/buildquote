import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sun,
  Battery,
  Thermometer,
  Zap,
  Leaf,
  TrendingUp,
  PoundSterling,
  Home,
  Calculator,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Car,
} from "lucide-react";
import {
  EPC_BANDS,
  GRANTS,
  RENEWABLE_TECHNOLOGIES,
  calculateEPCPathway,
  type EPCBand,
} from "@/lib/renewables-module-data";
import SolarPVROICalculator from "@/components/renewables/SolarPVROICalculator";
import HeatPumpSizingWizard from "@/components/renewables/HeatPumpSizingWizard";

const TECH_ICONS: Record<string, React.ReactNode> = {
  solar_pv: <Sun className="h-5 w-5" />,
  battery_storage: <Battery className="h-5 w-5" />,
  ashp: <Thermometer className="h-5 w-5" />,
  gshp: <Thermometer className="h-5 w-5" />,
  ev_charger: <Car className="h-5 w-5" />,
  mvhr: <Leaf className="h-5 w-5" />,
};

export default function Renewables() {
  const [currentSAP, setCurrentSAP] = useState<number>(62);
  const [targetBand, setTargetBand] = useState<EPCBand>("C");
  const [propertyType, setPropertyType] = useState<"detached" | "semi" | "terraced" | "flat">("semi");
  const [annualElectricity, setAnnualElectricity] = useState(3500);
  const [annualGas, setAnnualGas] = useState(12000);
  const [roofArea, setRoofArea] = useState(30);

  const epcPlan = useMemo(
    () => calculateEPCPathway(currentSAP, targetBand, propertyType),
    [currentSAP, targetBand, propertyType]
  );

  const solar = useMemo(() => {
    // Very lightweight, deterministic estimate based on our tech catalogue.
    const size = roofArea >= 45 ? "solar_pv_6kw" : roofArea >= 30 ? "solar_pv_4kw" : "solar_pv_3kw";
    const tech = RENEWABLE_TECHNOLOGIES[size];
    const installCost = {
      min: tech.typicalCost.min,
      max: tech.typicalCost.max,
    };
    const annualSavings = Math.round((tech.annualSaving.min + tech.annualSaving.max) / 2);
    const systemSize = size === "solar_pv_6kw" ? 6 : size === "solar_pv_4kw" ? 4 : 3;
    const annualGeneration = Math.round(Math.min(annualElectricity * 0.9, systemSize * 900));
    const avgCost = (installCost.min + installCost.max) / 2;
    const paybackYears = annualSavings > 0 ? Math.round((avgCost / annualSavings) * 10) / 10 : 0;

    return {
      tech,
      systemSize,
      annualGeneration,
      installCost,
      annualSavings,
      paybackYears,
      carbonSaved: tech.carbonSaving,
    };
  }, [roofArea, annualElectricity]);

  const heatPump = useMemo(() => {
    // Heuristic sizing: average UK home ~ 8kW ASHP; larger heat demand pushes to 12kW.
    const key = annualGas >= 15000 ? "ashp_12kw" : "ashp_8kw";
    const tech = RENEWABLE_TECHNOLOGIES[key];
    const installCost = {
      min: tech.typicalCost.min,
      max: tech.typicalCost.max,
    };
    const annualSavings = Math.round((tech.annualSaving.min + tech.annualSaving.max) / 2);
    return {
      tech,
      systemSize: key === "ashp_12kw" ? 12 : 8,
      installCost,
      annualSavings,
      carbonSaved: tech.carbonSaving,
    };
  }, [annualGas]);

  const grants = useMemo(
    () => Object.entries(GRANTS).map(([id, g]) => ({ id, ...g })),
    []
  );

  const epcBandOptions = useMemo(() => Object.keys(EPC_BANDS) as EPCBand[], []);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Leaf className="h-6 w-6 text-success" />
              Renewables & EPC Pathways
            </h1>
            <p className="text-sm text-muted-foreground">
              Calculate upgrades to reach EPC C+ with cost, payback & grant eligibility
            </p>
          </div>
          <Badge className="bg-success">2026 Compliant</Badge>
        </div>

        <Tabs defaultValue="epc">
          <TabsList className="flex-wrap h-auto overflow-x-auto">
            <TabsTrigger value="epc">EPC Calculator</TabsTrigger>
            <TabsTrigger value="solar-roi">Solar PV ROI</TabsTrigger>
            <TabsTrigger value="solar">Solar PV</TabsTrigger>
            <TabsTrigger value="battery">Battery Storage</TabsTrigger>
            <TabsTrigger value="heatpump-wizard">Heat Pump Wizard</TabsTrigger>
            <TabsTrigger value="heatpump">Heat Pumps</TabsTrigger>
            <TabsTrigger value="grants">Grants & Funding</TabsTrigger>
            <TabsTrigger value="technologies">All Technologies</TabsTrigger>
          </TabsList>

          {/* EPC Calculator Tab */}
          <TabsContent value="epc" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current SAP score</Label>
                    <Input
                      type="number"
                      value={currentSAP}
                      min={1}
                      max={100}
                      onChange={(e) => setCurrentSAP(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      SAP is the numeric score behind EPC bands.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Target EPC band</Label>
                    <Select value={targetBand} onValueChange={(v) => setTargetBand(v as EPCBand)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {epcBandOptions.map((band) => (
                          <SelectItem key={band} value={band}>
                            Band {band}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select value={propertyType} onValueChange={(v) => setPropertyType(v as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detached">Detached</SelectItem>
                        <SelectItem value="semi">Semi-Detached</SelectItem>
                        <SelectItem value="terraced">Terraced</SelectItem>
                        <SelectItem value="flat">Flat/Apartment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Annual Electricity (kWh)</Label>
                    <Input
                      type="number"
                      value={annualElectricity}
                      onChange={(e) => setAnnualElectricity(Number(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Annual Gas (kWh)</Label>
                    <Input
                      type="number"
                      value={annualGas}
                      onChange={(e) => setAnnualGas(Number(e.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Upgrade Pathway: SAP {currentSAP} → EPC {targetBand}</CardTitle>
                  <CardDescription>
                    Recommended measures to reach your target EPC rating
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {epcPlan.upgrades.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      You already meet the selected target.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-sm text-muted-foreground">Total Cost</p>
                          <p className="text-2xl font-bold">
                            £{epcPlan.totalCost.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-sm text-muted-foreground">Annual Savings</p>
                          <p className="text-2xl font-bold text-success">
                            £{epcPlan.annualSavings.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-sm text-muted-foreground">Payback</p>
                          <p className="text-2xl font-bold">{epcPlan.paybackYears}y</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {epcPlan.upgrades.map((u, i) => (
                          <div key={i} className="p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{u.technology.name}</h4>
                              <Badge variant="outline">+{Math.round(u.sapGain)} SAP</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Cost</p>
                                <p className="font-mono">
                                  £{Math.round(u.cost).toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Annual Savings</p>
                                <p className="font-mono text-success">£{Math.round(u.savings)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Payback</p>
                                <p className="font-mono">
                                  {u.savings > 0 ? Math.round((u.cost / u.savings) * 10) / 10 : "—"} years
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Solar PV ROI Calculator Tab */}
          <TabsContent value="solar-roi" className="mt-4 space-y-4">
            <SolarPVROICalculator />
          </TabsContent>

          {/* Solar Tab */}
          <TabsContent value="solar" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sun className="h-5 w-5 text-warning" />
                    Solar PV Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Available Roof Area (m²)</Label>
                    <Input
                      type="number"
                      value={roofArea}
                      onChange={(e) => setRoofArea(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Typical: 20-40m² for average UK home
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-muted space-y-3">
                    <div className="flex justify-between">
                      <span>Recommended System Size</span>
                      <span className="font-mono font-medium">{solar.systemSize} kWp</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Generation</span>
                      <span className="font-mono font-medium">{solar.annualGeneration.toLocaleString()} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation Cost</span>
                      <span className="font-mono font-medium">
                        £{solar.installCost.min.toLocaleString()} - £{solar.installCost.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>Annual Savings</span>
                      <span className="font-mono font-medium">£{solar.annualSavings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period</span>
                      <span className="font-mono font-medium">{solar.paybackYears} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Saved Annually</span>
                      <span className="font-mono font-medium">{solar.carbonSaved} kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5" />
                    Battery Storage Option
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Adding battery storage increases self-consumption from ~30% to ~70%, maximizing savings.
                    </p>

                    <div className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">Recommended: 5kWh Battery</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Cost</span>
                          <span className="font-mono">£3,000 - £5,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Additional Savings</span>
                          <span className="font-mono text-success">£200 - £400/year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Lifespan</span>
                          <span className="font-mono">10-15 years</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" asChild>
                      <a href="https://www.mcs.org.uk/find-an-installer" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Find MCS Installer
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Battery Storage Tab */}
          <TabsContent value="battery" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-primary" />
                    Battery Storage Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50 border">
                    <p className="text-sm text-muted-foreground mb-3">
                      Home batteries store excess solar energy for evening use, increasing self-consumption from ~30% to ~70%.
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg border bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">5kWh Battery</h4>
                          <Badge variant="outline">Popular</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="text-muted-foreground">Cost:</span> <span className="font-mono">£3,500 - £5,000</span></div>
                          <div><span className="text-muted-foreground">Backup:</span> <span className="font-mono">4-5 hours</span></div>
                          <div className="text-success"><span className="text-muted-foreground">Savings:</span> <span className="font-mono">£200/year</span></div>
                          <div><span className="text-muted-foreground">Lifespan:</span> <span className="font-mono">10-15 years</span></div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">10kWh Battery</h4>
                          <Badge variant="outline">Whole Home</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="text-muted-foreground">Cost:</span> <span className="font-mono">£6,000 - £8,500</span></div>
                          <div><span className="text-muted-foreground">Backup:</span> <span className="font-mono">8-10 hours</span></div>
                          <div className="text-success"><span className="text-muted-foreground">Savings:</span> <span className="font-mono">£400/year</span></div>
                          <div><span className="text-muted-foreground">Lifespan:</span> <span className="font-mono">10-15 years</span></div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-lg border bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">13.5kWh Battery (Tesla Powerwall)</h4>
                          <Badge>Premium</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="text-muted-foreground">Cost:</span> <span className="font-mono">£8,500 - £11,000</span></div>
                          <div><span className="text-muted-foreground">Backup:</span> <span className="font-mono">12+ hours</span></div>
                          <div className="text-success"><span className="text-muted-foreground">Savings:</span> <span className="font-mono">£500/year</span></div>
                          <div><span className="text-muted-foreground">Lifespan:</span> <span className="font-mono">10-15 years</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-warning" />
                    Smart Energy Systems
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border">
                      <h4 className="font-medium mb-1">Time-of-Use Tariffs</h4>
                      <p className="text-sm text-muted-foreground">
                        Charge batteries when electricity is cheap (overnight) and use during peak times. 
                        Compatible with Octopus Go, Intelligent Octopus, and similar tariffs.
                      </p>
                      <Badge variant="outline" className="mt-2">Saves up to 50% on bills</Badge>
                    </div>
                    
                    <div className="p-3 rounded-lg border">
                      <h4 className="font-medium mb-1">Vehicle-to-Home (V2H)</h4>
                      <p className="text-sm text-muted-foreground">
                        Use your EV battery to power your home during outages or peak times. 
                        Requires compatible EV and charger (e.g., Nissan Leaf, Ford F-150 Lightning).
                      </p>
                      <Badge variant="outline" className="mt-2">60-100kWh storage</Badge>
                    </div>
                    
                    <div className="p-3 rounded-lg border">
                      <h4 className="font-medium mb-1">Smart Home Integration</h4>
                      <p className="text-sm text-muted-foreground">
                        Batteries integrate with smart home systems to optimise energy usage automatically.
                        Works with Givenergy, SolarEdge, Enphase, and Tesla apps.
                      </p>
                    </div>
                    
                    <div className="p-3 rounded-lg border bg-success/10">
                      <h4 className="font-medium mb-1 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Grid Services Income
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Earn money by allowing your battery to support the grid during peak demand.
                        Programs like Octopus Powerups pay £1-2/kWh for grid services.
                      </p>
                      <Badge variant="secondary" className="mt-2">£50-150/year potential</Badge>
                    </div>
                  </div>
                  
                  <Button variant="outline" asChild>
                    <a href="https://www.mcs.org.uk/find-an-installer" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Find MCS Installer
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Heat Pump Sizing Wizard Tab */}
          <TabsContent value="heatpump-wizard" className="mt-4 space-y-4">
            <HeatPumpSizingWizard />
          </TabsContent>

          {/* Heat Pumps Tab */}
          <TabsContent value="heatpump" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    Air Source Heat Pump
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 rounded-lg bg-muted space-y-3">
                    <div className="flex justify-between">
                      <span>Based on Gas Usage</span>
                      <span className="font-mono">{annualGas.toLocaleString()} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Size Needed</span>
                      <span className="font-mono font-medium">{heatPump.systemSize} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation Cost</span>
                      <span className="font-mono">
                        £{heatPump.installCost.min.toLocaleString()} - £{heatPump.installCost.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>After BUS Grant</span>
                      <span className="font-mono text-success">
                        £{Math.max(0, heatPump.installCost.min - 7500).toLocaleString()} - £{Math.max(0, heatPump.installCost.max - 7500).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>Annual Savings</span>
                      <span className="font-mono font-medium">£{heatPump.annualSavings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Saved Annually</span>
                      <span className="font-mono">{heatPump.carbonSaved} kg</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 rounded-lg bg-success/10 border border-success/30">
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <PoundSterling className="h-4 w-4" />
                      Boiler Upgrade Scheme (BUS)
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      £7,500 grant available for ASHP installations. Must use MCS-certified installer.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-primary" />
                    Ground Source Heat Pump
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Higher efficiency (COP 4.0-5.0) but requires ground works. Better for larger properties with garden space.
                    </p>

                    <div className="p-4 rounded-lg bg-muted space-y-3">
                      <div className="flex justify-between">
                        <span>Typical Cost</span>
                        <span className="font-mono">£15,000 - £35,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>After BUS Grant</span>
                        <span className="font-mono text-success">£7,500 - £27,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency (COP)</span>
                        <span className="font-mono">4.0 - 5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lifespan</span>
                        <span className="font-mono">20-25 years</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://www.gov.uk/apply-boiler-upgrade-scheme" target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Apply for BUS Grant
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Grants Tab */}
          <TabsContent value="grants" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {grants.map((grant) => (
                <Card key={grant.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <PoundSterling className="h-5 w-5 text-success" />
                      {grant.name}
                    </CardTitle>
                    <CardDescription>{grant.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-4 rounded-lg bg-success/10 text-center">
                        <p className="text-sm text-muted-foreground">Grant Amount</p>
                        <p className="text-2xl font-bold text-success">
                          {typeof grant.amount === "number" ? `£${grant.amount.toLocaleString()}` : grant.amount}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Eligibility:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {grant.eligibility.map((req: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 mt-1 text-success flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full" asChild>
                        <a
                          href={
                            grant.id === "BUS"
                              ? "https://www.gov.uk/apply-boiler-upgrade-scheme"
                              : grant.id === "SEG"
                                ? "https://www.ofgem.gov.uk/environmental-and-social-schemes/smart-export-guarantee-seg"
                                : grant.id === "OZEV"
                                  ? "https://www.gov.uk/guidance/electric-vehicle-chargepoint-grant-for-landlords"
                                  : "https://www.gov.uk/energy-company-obligation"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Official scheme page
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* All Technologies Tab */}
          <TabsContent value="technologies" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(RENEWABLE_TECHNOLOGIES).map((tech) => (
                <Card key={tech.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {TECH_ICONS[tech.id] ?? <Leaf className="h-5 w-5" />}
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tech.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost Range</span>
                        <span className="font-mono">
                          £{tech.typicalCost.min.toLocaleString()} - £{tech.typicalCost.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Typical Savings</span>
                        <span className="font-mono text-success">
                          £{Math.round((tech.annualSaving.min + tech.annualSaving.max) / 2)}/year
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CO₂ Reduction</span>
                        <span className="font-mono">{tech.carbonSaving} kg/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payback</span>
                        <span className="font-mono">{tech.paybackYears.min}-{tech.paybackYears.max} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">SAP Impact</span>
                        <Badge variant="outline">+{tech.sapImpact.min}-{tech.sapImpact.max}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category</span>
                        <Badge variant="secondary">{tech.category}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> Calculations are estimates based on typical UK properties. 
              Actual costs, savings, and EPC improvements will vary based on property characteristics, 
              installer quotes, and energy prices. Always obtain multiple quotes from MCS-certified installers.
              Grant eligibility is subject to scheme terms and availability.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
