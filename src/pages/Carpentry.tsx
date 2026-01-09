import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Hammer, Calculator, FileText, Ruler, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  FLOOR_JOIST_SPANS_C16,
  FLOOR_JOIST_SPANS_C24,
  CEILING_JOIST_SPANS_C16,
  RAFTER_SPANS_C16,
  BUILDING_REG_GUIDANCE,
  STRUCTURAL_WORK_CHECKLIST,
  STUD_WALL_SPECS,
  NOTCHING_DRILLING_RULES,
  calculateJoistSize,
  calculateRafterSize,
  calculateMaxNotchDepth,
  calculateMaxHoleDiameter
} from "@/lib/carpentry-module-data";

const Carpentry = () => {
  const [joistSpan, setJoistSpan] = useState<string>("");
  const [joistSpacing, setJoistSpacing] = useState<string>("400");
  const [joistGrade, setJoistGrade] = useState<"C16" | "C24">("C16");
  const [rafterSpan, setRafterSpan] = useState<string>("");
  const [rafterCentres, setRafterCentres] = useState<string>("400");
  const [rafterGrade, setRafterGrade] = useState<"C16" | "C24">("C16");
  const [joistDepth, setJoistDepth] = useState<string>("");
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);

  const handleCheckToggle = (checkId: string) => {
    setCompletedChecks(prev =>
      prev.includes(checkId)
        ? prev.filter(id => id !== checkId)
        : [...prev, checkId]
    );
  };

  const joistSizeResult = joistSpan
    ? calculateJoistSize(parseFloat(joistSpan), parseInt(joistSpacing), joistGrade)
    : null;

  const rafterSizeResult = rafterSpan
    ? calculateRafterSize(parseFloat(rafterSpan), parseInt(rafterCentres), rafterGrade)
    : null;

  const notchingResult = joistDepth
    ? {
        maxNotch: calculateMaxNotchDepth(parseFloat(joistDepth)),
        maxHole: calculateMaxHoleDiameter(parseFloat(joistDepth))
      }
    : null;

  const checklistProgress = (completedChecks.length / STRUCTURAL_WORK_CHECKLIST.length) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Hammer className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Carpentry & Joinery Module</h1>
            <p className="text-muted-foreground">Timber span tables, joist calculators, and Building Regs guidance</p>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Disclaimer:</strong> These tables are for guidance only. Complex structural work requires calculation by a qualified structural engineer. Always check with Building Control for compliance.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="joist-calc" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-2">
            <TabsTrigger value="joist-calc" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Joist Calculator
            </TabsTrigger>
            <TabsTrigger value="span-tables" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Span Tables
            </TabsTrigger>
            <TabsTrigger value="building-regs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Building Regs
            </TabsTrigger>
            <TabsTrigger value="stud-walls" className="flex items-center gap-2">
              <Hammer className="h-4 w-4" />
              Stud Walls
            </TabsTrigger>
            <TabsTrigger value="checklist" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Checklist
            </TabsTrigger>
          </TabsList>

          {/* Joist Calculator Tab */}
          <TabsContent value="joist-calc" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Floor Joist Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>Floor Joist Size Calculator</CardTitle>
                  <CardDescription>Calculate required joist size for your span</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joistSpan">Clear Span (metres)</Label>
                    <Input
                      id="joistSpan"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 3.5"
                      value={joistSpan}
                      onChange={(e) => setJoistSpan(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Joist Spacing</Label>
                      <Select value={joistSpacing} onValueChange={setJoistSpacing}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="400">400mm</SelectItem>
                          <SelectItem value="450">450mm</SelectItem>
                          <SelectItem value="600">600mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timber Grade</Label>
                      <Select value={joistGrade} onValueChange={(v) => setJoistGrade(v as "C16" | "C24")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C16">C16</SelectItem>
                          <SelectItem value="C24">C24</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {joistSizeResult && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Recommended Joist Size:</h4>
                      <p className="text-2xl font-bold text-primary">{joistSizeResult}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Based on {joistGrade} grade at {joistSpacing}mm centres
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Rafter Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle>Rafter Size Calculator</CardTitle>
                  <CardDescription>Calculate required rafter size for pitched roofs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rafterSpan">Rafter Span (metres)</Label>
                    <Input
                      id="rafterSpan"
                      type="number"
                      step="0.1"
                      placeholder="e.g. 2.5"
                      value={rafterSpan}
                      onChange={(e) => setRafterSpan(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rafter Centres</Label>
                      <Select value={rafterCentres} onValueChange={setRafterCentres}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="400">400mm</SelectItem>
                          <SelectItem value="450">450mm</SelectItem>
                          <SelectItem value="600">600mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Timber Grade</Label>
                      <Select value={rafterGrade} onValueChange={(v) => setRafterGrade(v as "C16" | "C24")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="C16">C16</SelectItem>
                          <SelectItem value="C24">C24</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {rafterSizeResult && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Recommended Rafter Size:</h4>
                      <p className="text-2xl font-bold text-primary">{rafterSizeResult}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Notching Calculator */}
            <Card>
              <CardHeader>
                <CardTitle>Notching & Drilling Calculator</CardTitle>
                <CardDescription>Maximum allowable notch depth and hole diameter for joists</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-w-md space-y-2">
                  <Label htmlFor="joistDepth">Joist Depth (mm)</Label>
                  <Input
                    id="joistDepth"
                    type="number"
                    placeholder="e.g. 195"
                    value={joistDepth}
                    onChange={(e) => setJoistDepth(e.target.value)}
                  />
                </div>
                {notchingResult && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Maximum Notch Depth:</h4>
                      <p className="text-2xl font-bold text-primary">{notchingResult.maxNotch.toFixed(1)}mm</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        In zone 0.07 to 0.25 of span from support
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Maximum Hole Diameter:</h4>
                      <p className="text-2xl font-bold text-primary">{notchingResult.maxHole.toFixed(1)}mm</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        In zone 0.25 to 0.4 of span from support
                      </p>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Element</th>
                        <th className="text-left p-2">Notching Zone</th>
                        <th className="text-left p-2">Max Notch</th>
                        <th className="text-left p-2">Drilling Zone</th>
                        <th className="text-left p-2">Max Hole</th>
                      </tr>
                    </thead>
                    <tbody>
                      {NOTCHING_DRILLING_RULES.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{row.element}</td>
                          <td className="p-2">{row.notchingZone}</td>
                          <td className="p-2">{row.maxNotchDepth}</td>
                          <td className="p-2">{row.drillingZone}</td>
                          <td className="p-2">{row.maxHoleDiameter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Span Tables Tab */}
          <TabsContent value="span-tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Floor Joist Spans - C16 Grade</CardTitle>
                <CardDescription>Maximum clear spans for domestic floor joists (1.5kN/m² imposed load)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Joist Size</th>
                        <th className="text-left p-2">400mm Centres</th>
                        <th className="text-left p-2">450mm Centres</th>
                        <th className="text-left p-2">600mm Centres</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FLOOR_JOIST_SPANS_C16.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{row.joistSize}</td>
                          <td className="p-2">{row.spacing400mm}</td>
                          <td className="p-2">{row.spacing450mm}</td>
                          <td className="p-2">{row.spacing600mm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Floor Joist Spans - C24 Grade</CardTitle>
                <CardDescription>Higher grade timber allows longer spans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Joist Size</th>
                        <th className="text-left p-2">400mm Centres</th>
                        <th className="text-left p-2">450mm Centres</th>
                        <th className="text-left p-2">600mm Centres</th>
                      </tr>
                    </thead>
                    <tbody>
                      {FLOOR_JOIST_SPANS_C24.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{row.joistSize}</td>
                          <td className="p-2">{row.spacing400mm}</td>
                          <td className="p-2">{row.spacing450mm}</td>
                          <td className="p-2">{row.spacing600mm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ceiling Joist Spans - C16 Grade</CardTitle>
                <CardDescription>For ceilings with no storage above</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Joist Size</th>
                        <th className="text-left p-2">400mm Centres</th>
                        <th className="text-left p-2">450mm Centres</th>
                        <th className="text-left p-2">600mm Centres</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CEILING_JOIST_SPANS_C16.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{row.joistSize}</td>
                          <td className="p-2">{row.spacing400mm}</td>
                          <td className="p-2">{row.spacing450mm}</td>
                          <td className="p-2">{row.spacing600mm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rafter Spans</CardTitle>
                <CardDescription>For pitched roofs 22.5° to 30°</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Timber Size</th>
                        <th className="text-left p-2">C16 Span</th>
                        <th className="text-left p-2">C24 Span</th>
                        <th className="text-left p-2">Max Centres</th>
                        <th className="text-left p-2">Application</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RAFTER_SPANS_C16.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{row.timberSize}</td>
                          <td className="p-2">{row.gradeC16}</td>
                          <td className="p-2">{row.gradeC24}</td>
                          <td className="p-2">{row.maxCentres}</td>
                          <td className="p-2 text-muted-foreground">{row.application}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Building Regs Tab */}
          <TabsContent value="building-regs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Building Regulations Guidance</CardTitle>
                <CardDescription>Key requirements for structural carpentry work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {BUILDING_REG_GUIDANCE.map((reg) => (
                    <div key={reg.id} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{reg.category}</Badge>
                        <span className="text-sm text-muted-foreground">{reg.reference}</span>
                      </div>
                      <h4 className="font-semibold mb-1">{reg.requirement}</h4>
                      <p className="text-sm text-muted-foreground">{reg.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stud Walls Tab */}
          <TabsContent value="stud-walls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Stud Wall Specifications</CardTitle>
                <CardDescription>Recommended stud sizes and configurations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Application</th>
                        <th className="text-left p-2">Stud Size</th>
                        <th className="text-left p-2">Centres</th>
                        <th className="text-left p-2">Head Plate</th>
                        <th className="text-left p-2">Noggings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STUD_WALL_SPECS.map((row, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2 font-medium">{row.application}</td>
                          <td className="p-2">{row.studSize}</td>
                          <td className="p-2">{row.centres}</td>
                          <td className="p-2">{row.headPlate}</td>
                          <td className="p-2 text-muted-foreground">{row.noggings}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Structural Work Checklist</span>
                  <Badge variant={checklistProgress === 100 ? "default" : "secondary"}>
                    {Math.round(checklistProgress)}% Complete
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Essential checklist for structural carpentry work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {["Planning", "Materials", "Installation", "Completion"].map((phase) => (
                    <div key={phase}>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        {phase}
                        <Badge variant="outline">
                          {STRUCTURAL_WORK_CHECKLIST.filter(c => c.phase === phase && completedChecks.includes(c.id)).length}/
                          {STRUCTURAL_WORK_CHECKLIST.filter(c => c.phase === phase).length}
                        </Badge>
                      </h3>
                      <div className="space-y-3">
                        {STRUCTURAL_WORK_CHECKLIST.filter(c => c.phase === phase).map((check) => (
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
                              <span className="text-xs text-muted-foreground">Ref: {check.buildingRegRef}</span>
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Carpentry;
