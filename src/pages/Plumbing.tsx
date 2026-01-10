import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Droplet, Flame, AlertTriangle, CheckCircle2, Calculator, FileText, Shield, Thermometer } from "lucide-react";
import {
  GAS_SAFE_REGULATIONS,
  PIPE_SIZING_TABLE,
  GAS_PIPE_SIZING,
  BOILER_INSTALLATION_CHECKLIST,
  WATER_REGULATIONS,
  CYLINDER_SIZING_GUIDE,
  FLOW_RATE_REQUIREMENTS,
  calculatePipeSize,
  calculateGasPipeSize,
  recommendCylinderSize
} from "@/lib/plumbing-module-data";

const Plumbing = () => {
  const [flowRate, setFlowRate] = useState<string>("");
  const [pipeLength, setPipeLength] = useState<string>("");
  const [boilerLoad, setBoilerLoad] = useState<string>("");
  const [bedrooms, setBedrooms] = useState<string>("");
  const [bathrooms, setBathrooms] = useState<string>("");
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);

  const handleCheckToggle = (checkId: string) => {
    setCompletedChecks(prev =>
      prev.includes(checkId)
        ? prev.filter(id => id !== checkId)
        : [...prev, checkId]
    );
  };

  const pipeSizeResult = flowRate ? calculatePipeSize(parseFloat(flowRate)) : null;
  const gasPipeResult = pipeLength && boilerLoad
    ? calculateGasPipeSize(parseFloat(pipeLength), parseFloat(boilerLoad))
    : null;
  const cylinderRecommendation = bedrooms && bathrooms
    ? recommendCylinderSize(parseInt(bedrooms), parseInt(bathrooms))
    : null;

  const checklistProgress = (completedChecks.length / BOILER_INSTALLATION_CHECKLIST.length) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Droplet className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Plumbing & Gas Module</h1>
            <p className="text-muted-foreground">Gas Safe regulations, pipe sizing, and installation checklists</p>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Disclaimer:</strong> This module provides reference information only. All gas work must be carried out by a Gas Safe registered engineer. Always refer to current regulations and manufacturer's instructions.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="gas-safe" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="gas-safe" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Gas Safe
            </TabsTrigger>
            <TabsTrigger value="pipe-sizing" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Pipe Sizing
            </TabsTrigger>
            <TabsTrigger value="boiler-install" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Boiler Install
            </TabsTrigger>
            <TabsTrigger value="water-regs" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Water Regs
            </TabsTrigger>
            <TabsTrigger value="cylinders" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Cylinders
            </TabsTrigger>
          </TabsList>

          {/* Gas Safe Regulations Tab */}
          <TabsContent value="gas-safe" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Gas Safe Regulations
                </CardTitle>
                <CardDescription>
                  Gas Safety (Installation and Use) Regulations 1998 - Key Requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {GAS_SAFE_REGULATIONS.map((reg) => (
                    <div key={reg.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{reg.category}</Badge>
                            <span className="text-sm text-muted-foreground">{reg.reference}</span>
                          </div>
                          <h4 className="font-semibold mb-1">{reg.requirement}</h4>
                          <p className="text-sm text-muted-foreground">{reg.details}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pipe Sizing Tab */}
          <TabsContent value="pipe-sizing" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Water Pipe Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>Water Pipe Size Calculator</CardTitle>
                  <CardDescription>Calculate pipe size based on required flow rate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flowRate">Required Flow Rate (L/min)</Label>
                    <Input
                      id="flowRate"
                      type="number"
                      placeholder="Enter flow rate"
                      value={flowRate}
                      onChange={(e) => setFlowRate(e.target.value)}
                    />
                  </div>
                  {pipeSizeResult && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Recommended Pipe Sizes:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Copper:</span>
                          <p className="font-bold text-lg">{pipeSizeResult.copper}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Plastic:</span>
                          <p className="font-bold text-lg">{pipeSizeResult.plastic}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gas Pipe Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>Gas Pipe Size Calculator</CardTitle>
                  <CardDescription>Calculate gas pipe size based on length and load</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pipeLength">Pipe Length (m)</Label>
                      <Input
                        id="pipeLength"
                        type="number"
                        placeholder="Length"
                        value={pipeLength}
                        onChange={(e) => setPipeLength(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="boilerLoad">Boiler Load (kW)</Label>
                      <Input
                        id="boilerLoad"
                        type="number"
                        placeholder="Load"
                        value={boilerLoad}
                        onChange={(e) => setBoilerLoad(e.target.value)}
                      />
                    </div>
                  </div>
                  {gasPipeResult && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Recommended Pipe Sizes:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Copper:</span>
                          <p className="font-bold text-lg">{gasPipeResult.copper}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">CSWA Pipe:</span>
                          <p className="font-bold text-lg">{gasPipeResult.cswa}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Reference Tables */}
            <Card>
              <CardHeader>
                <CardTitle>Water Pipe Sizing Reference</CardTitle>
                <CardDescription>Standard pipe sizes based on flow rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Flow Rate (L/min)</th>
                        <th className="text-left p-2">Copper</th>
                        <th className="text-left p-2">Plastic</th>
                        <th className="text-left p-2">Application</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PIPE_SIZING_TABLE.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{row.flowRate}</td>
                          <td className="p-2 font-medium">{row.copperSize}</td>
                          <td className="p-2 font-medium">{row.plasticSize}</td>
                          <td className="p-2 text-muted-foreground">{row.application}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gas Pipe Sizing Reference</CardTitle>
                <CardDescription>Based on pipe length and maximum load</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Pipe Length</th>
                        <th className="text-left p-2">Max Load</th>
                        <th className="text-left p-2">Copper</th>
                        <th className="text-left p-2">CSWA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GAS_PIPE_SIZING.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{row.pipeLength}</td>
                          <td className="p-2">{row.maxLoad}</td>
                          <td className="p-2 font-medium">{row.copperSize}</td>
                          <td className="p-2 font-medium">{row.cswaPipeSize}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Boiler Installation Tab */}
          <TabsContent value="boiler-install" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Boiler Installation Checklist</span>
                  <Badge variant={checklistProgress === 100 ? "default" : "secondary"}>
                    {Math.round(checklistProgress)}% Complete
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Complete checklist for domestic boiler installation - Gas Safe compliant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Pre-Installation", "Installation", "Commissioning"].map((phase) => (
                    <div key={phase}>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        {phase}
                        <Badge variant="outline">
                          {BOILER_INSTALLATION_CHECKLIST.filter(c => c.phase === phase && completedChecks.includes(c.id)).length}/
                          {BOILER_INSTALLATION_CHECKLIST.filter(c => c.phase === phase).length}
                        </Badge>
                      </h3>
                      <div className="space-y-3">
                        {BOILER_INSTALLATION_CHECKLIST.filter(c => c.phase === phase).map((check) => (
                          <div
                            key={check.id}
                            className={`flex items-start gap-3 p-3 border rounded-lg ${
                              completedChecks.includes(check.id) ? 'bg-primary/5 border-primary/20' : ''
                            }`}
                          >
                            <Checkbox
                              id={check.id}
                              checked={completedChecks.includes(check.id)}
                              onCheckedChange={() => handleCheckToggle(check.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <label htmlFor={check.id} className="font-medium cursor-pointer">
                                  {check.task}
                                </label>
                                {check.critical && (
                                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{check.requirement}</p>
                              <span className="text-xs text-muted-foreground">Ref: {check.gasRegRef}</span>
                            </div>
                            {completedChecks.includes(check.id) && (
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Water Regulations Tab */}
          <TabsContent value="water-regs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Water Regulations (WRAS)</CardTitle>
                <CardDescription>
                  Water Supply (Water Fittings) Regulations 1999 - Key Requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {WATER_REGULATIONS.map((reg) => (
                    <div key={reg.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{reg.regulation}</h4>
                        {reg.wrasApproved && (
                          <Badge variant="outline" className="text-xs">WRAS Approved</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{reg.requirement}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Rate Requirements</CardTitle>
                <CardDescription>Minimum and optimal flow rates for outlets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Outlet</th>
                        <th className="text-left p-2">Min Flow</th>
                        <th className="text-left p-2">Optimal Flow</th>
                        <th className="text-left p-2">Min Pressure</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FLOW_RATE_REQUIREMENTS.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{row.outlet}</td>
                          <td className="p-2">{row.minFlow}</td>
                          <td className="p-2">{row.optimalFlow}</td>
                          <td className="p-2">{row.minPressure}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cylinders Tab */}
          <TabsContent value="cylinders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cylinder Size Calculator</CardTitle>
                <CardDescription>Recommend hot water cylinder size based on property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Number of Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="Bedrooms"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Number of Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      placeholder="Bathrooms"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                    />
                  </div>
                </div>
                {cylinderRecommendation && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Recommended Cylinder Size:</h4>
                    <p className="text-2xl font-bold text-primary">{cylinderRecommendation}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cylinder Sizing Guide</CardTitle>
                <CardDescription>Standard recommendations by property size</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Bedrooms</th>
                        <th className="text-left p-2">Bathrooms</th>
                        <th className="text-left p-2">Recommended Size</th>
                        <th className="text-left p-2">Recovery Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CYLINDER_SIZING_GUIDE.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{row.bedrooms}</td>
                          <td className="p-2">{row.bathrooms}</td>
                          <td className="p-2 font-medium">{row.recommendedSize}</td>
                          <td className="p-2 text-muted-foreground">{row.recoveryTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Plumbing;
