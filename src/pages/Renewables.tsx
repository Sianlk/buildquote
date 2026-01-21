import { useState, useMemo } from "react";
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
  RENEWABLE_TECHNOLOGIES,
  EPC_BAND_SCORES,
  calculateEPCUpgradePath,
  calculateSolarROI,
  calculateHeatPumpSavings,
  GRANT_SCHEMES,
} from "@/lib/renewables-module-data";

const TECH_ICONS: Record<string, React.ReactNode> = {
  solar_pv: <Sun className="h-5 w-5" />,
  battery_storage: <Battery className="h-5 w-5" />,
  ashp: <Thermometer className="h-5 w-5" />,
  gshp: <Thermometer className="h-5 w-5" />,
  ev_charger: <Car className="h-5 w-5" />,
  mvhr: <Leaf className="h-5 w-5" />,
};

export default function Renewables() {
  const [currentEPC, setCurrentEPC] = useState("D");
  const [targetEPC, setTargetEPC] = useState("C");
  const [propertyType, setPropertyType] = useState("semi_detached");
  const [annualElectricity, setAnnualElectricity] = useState(3500);
  const [annualGas, setAnnualGas] = useState(12000);
  const [roofArea, setRoofArea] = useState(30);

  const upgradePath = useMemo(() => 
    calculateEPCUpgradePath(currentEPC, targetEPC),
    [currentEPC, targetEPC]
  );

  const solarROI = useMemo(() => 
    calculateSolarROI(roofArea, annualElectricity),
    [roofArea, annualElectricity]
  );

  const heatPumpSavings = useMemo(() => 
    calculateHeatPumpSavings(annualGas, "ashp"),
    [annualGas]
  );

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
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="epc">EPC Calculator</TabsTrigger>
            <TabsTrigger value="solar">Solar PV</TabsTrigger>
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
                    <Label>Current EPC Rating</Label>
                    <Select value={currentEPC} onValueChange={setCurrentEPC}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(EPC_BAND_SCORES).map((band) => (
                          <SelectItem key={band} value={band}>
                            Band {band}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Target EPC Rating</Label>
                    <Select value={targetEPC} onValueChange={setTargetEPC}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(EPC_BAND_SCORES)
                          .filter((b) => EPC_BAND_SCORES[b as keyof typeof EPC_BAND_SCORES].min > 
                            EPC_BAND_SCORES[currentEPC as keyof typeof EPC_BAND_SCORES].min)
                          .map((band) => (
                            <SelectItem key={band} value={band}>
                              Band {band}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Property Type</Label>
                    <Select value={propertyType} onValueChange={setPropertyType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detached">Detached</SelectItem>
                        <SelectItem value="semi_detached">Semi-Detached</SelectItem>
                        <SelectItem value="terraced">Terraced</SelectItem>
                        <SelectItem value="flat">Flat/Apartment</SelectItem>
                        <SelectItem value="bungalow">Bungalow</SelectItem>
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
                  <CardTitle>Upgrade Pathway: {currentEPC} → {targetEPC}</CardTitle>
                  <CardDescription>
                    Recommended measures to reach your target EPC rating
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upgradePath.measures.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a target rating higher than your current rating
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-sm text-muted-foreground">Total Cost</p>
                          <p className="text-2xl font-bold">
                            £{upgradePath.totalCost.min.toLocaleString()} - £{upgradePath.totalCost.max.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-sm text-muted-foreground">Annual Savings</p>
                          <p className="text-2xl font-bold text-success">
                            £{upgradePath.totalSavings.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted text-center">
                          <p className="text-sm text-muted-foreground">Within £10k Cap</p>
                          {upgradePath.withinCap ? (
                            <CheckCircle className="h-8 w-8 text-success mx-auto" />
                          ) : (
                            <AlertTriangle className="h-8 w-8 text-warning mx-auto" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {upgradePath.measures.map((measure, i) => (
                          <div key={i} className="p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{measure.measure}</h4>
                              <Badge variant="outline">+{measure.epcImpact} points</Badge>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Cost</p>
                                <p className="font-mono">
                                  £{measure.typicalCost.min.toLocaleString()} - £{measure.typicalCost.max.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Annual Savings</p>
                                <p className="font-mono text-success">£{measure.annualSavings}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Payback</p>
                                <p className="font-mono">
                                  {Math.round((measure.typicalCost.min + measure.typicalCost.max) / 2 / measure.annualSavings)} years
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
                      <span className="font-mono font-medium">{solarROI.systemSize} kWp</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Generation</span>
                      <span className="font-mono font-medium">{solarROI.annualGeneration.toLocaleString()} kWh</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation Cost</span>
                      <span className="font-mono font-medium">
                        £{solarROI.installCost.min.toLocaleString()} - £{solarROI.installCost.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>Annual Savings</span>
                      <span className="font-mono font-medium">£{solarROI.annualSavings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period</span>
                      <span className="font-mono font-medium">{solarROI.paybackYears} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Saved Annually</span>
                      <span className="font-mono font-medium">{solarROI.carbonSaved} kg</span>
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
                      <span className="font-mono font-medium">{heatPumpSavings.systemSize} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation Cost</span>
                      <span className="font-mono">
                        £{heatPumpSavings.installCost.min.toLocaleString()} - £{heatPumpSavings.installCost.max.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>After BUS Grant</span>
                      <span className="font-mono text-success">
                        £{Math.max(0, heatPumpSavings.installCost.min - 7500).toLocaleString()} - £{Math.max(0, heatPumpSavings.installCost.max - 7500).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-success">
                      <span>Annual Savings</span>
                      <span className="font-mono font-medium">£{heatPumpSavings.annualSavings}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CO₂ Saved Annually</span>
                      <span className="font-mono">{heatPumpSavings.carbonSaved} kg</span>
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
              {GRANT_SCHEMES.map((grant) => (
                <Card key={grant.name}>
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
                          {typeof grant.amount === 'number' 
                            ? `£${grant.amount.toLocaleString()}`
                            : grant.amount}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Eligible Technologies:</p>
                        <div className="flex flex-wrap gap-2">
                          {grant.eligibleTechnologies.map((tech) => (
                            <Badge key={tech} variant="outline">{tech}</Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Eligibility:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {grant.eligibility.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 mt-1 text-success flex-shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button className="w-full" asChild>
                        <a href={grant.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Apply Now
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
              {RENEWABLE_TECHNOLOGIES.map((tech) => (
                <Card key={tech.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {TECH_ICONS[tech.id]}
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tech.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost Range</span>
                        <span className="font-mono">
                          £{tech.costRange.min.toLocaleString()} - £{tech.costRange.max.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Typical Savings</span>
                        <span className="font-mono text-success">£{tech.typicalSavings}/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CO₂ Reduction</span>
                        <span className="font-mono">{tech.carbonReduction} kg/year</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payback</span>
                        <span className="font-mono">{tech.paybackYears} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">EPC Impact</span>
                        <Badge variant="outline">+{tech.epcImpact} points</Badge>
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
