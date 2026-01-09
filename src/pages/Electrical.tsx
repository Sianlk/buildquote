import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Zap,
  Calculator,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Cable,
  Gauge,
  ShieldCheck,
  Droplets,
} from "lucide-react";
import {
  CONSUMER_UNIT_TYPES,
  CIRCUIT_TYPES,
  CABLE_SIZING_TABLE,
  DERATING_FACTORS,
  PART_P_NOTIFIABLE_WORK,
  PART_P_COMPLIANCE_CHECKLIST,
  ZONE_REGULATIONS_BATHROOM,
  TESTING_REQUIREMENTS,
  ZS_MAX_VALUES,
  calculateCableSize,
  calculateConsumerUnitSize,
} from "@/lib/electrical-module-data";

export default function Electrical() {
  const [activeTab, setActiveTab] = useState("consumer-unit");
  const [selectedCircuits, setSelectedCircuits] = useState<{ type: string; quantity: number }[]>([]);
  const [cuResult, setCuResult] = useState<ReturnType<typeof calculateConsumerUnitSize> | null>(null);
  
  // Cable sizing
  const [selectedCircuitType, setSelectedCircuitType] = useState("");
  const [cableLength, setCableLength] = useState(10);
  const [installMethod, setInstallMethod] = useState<"clipped" | "conduit" | "insulated">("clipped");
  const [ambientTemp, setAmbientTemp] = useState(30);
  const [groupedCables, setGroupedCables] = useState(1);
  const [cableResult, setCableResult] = useState<ReturnType<typeof calculateCableSize> | null>(null);
  
  // Part P checklist
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});

  const addCircuit = (type: string) => {
    const existing = selectedCircuits.find(c => c.type === type);
    if (existing) {
      setSelectedCircuits(selectedCircuits.map(c => 
        c.type === type ? { ...c, quantity: c.quantity + 1 } : c
      ));
    } else {
      setSelectedCircuits([...selectedCircuits, { type, quantity: 1 }]);
    }
    setCuResult(null);
  };

  const removeCircuit = (type: string) => {
    const existing = selectedCircuits.find(c => c.type === type);
    if (existing && existing.quantity > 1) {
      setSelectedCircuits(selectedCircuits.map(c => 
        c.type === type ? { ...c, quantity: c.quantity - 1 } : c
      ));
    } else {
      setSelectedCircuits(selectedCircuits.filter(c => c.type !== type));
    }
    setCuResult(null);
  };

  const calculateCU = () => {
    if (selectedCircuits.length === 0) {
      toast.error("Please add at least one circuit");
      return;
    }
    const result = calculateConsumerUnitSize(selectedCircuits);
    setCuResult(result);
  };

  const calculateCable = () => {
    if (!selectedCircuitType) {
      toast.error("Please select a circuit type");
      return;
    }
    const result = calculateCableSize(
      selectedCircuitType,
      cableLength,
      installMethod,
      ambientTemp,
      groupedCables
    );
    setCableResult(result);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedChecks = Object.values(checklistItems).filter(Boolean).length;
  const requiredChecks = PART_P_COMPLIANCE_CHECKLIST.filter(c => c.required).length;
  const allRequiredComplete = PART_P_COMPLIANCE_CHECKLIST
    .filter(c => c.required)
    .every(c => checklistItems[c.id]);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              Electrical Module
            </h1>
            <p className="text-sm text-muted-foreground">
              Consumer unit calculations, cable sizing, and Part P compliance
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="consumer-unit" className="gap-2">
              <Gauge className="h-4 w-4" />
              <span className="hidden sm:inline">Consumer Unit</span>
              <span className="sm:hidden">CU</span>
            </TabsTrigger>
            <TabsTrigger value="cable-sizing" className="gap-2">
              <Cable className="h-4 w-4" />
              <span className="hidden sm:inline">Cable Sizing</span>
              <span className="sm:hidden">Cable</span>
            </TabsTrigger>
            <TabsTrigger value="part-p" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Part P</span>
              <span className="sm:hidden">P</span>
            </TabsTrigger>
            <TabsTrigger value="zones" className="gap-2">
              <Droplets className="h-4 w-4" />
              <span className="hidden sm:inline">Zones</span>
              <span className="sm:hidden">Z</span>
            </TabsTrigger>
          </TabsList>

          {/* Consumer Unit Calculator */}
          <TabsContent value="consumer-unit" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Circuits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {CIRCUIT_TYPES.map(circuit => {
                        const selected = selectedCircuits.find(c => c.type === circuit.id);
                        return (
                          <div key={circuit.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{circuit.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {circuit.mcb}A MCB | {circuit.cableSize}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {selected && (
                                <Badge variant="secondary">{selected.quantity}</Badge>
                              )}
                              <Button size="sm" variant="outline" onClick={() => removeCircuit(circuit.id)} disabled={!selected}>
                                -
                              </Button>
                              <Button size="sm" onClick={() => addCircuit(circuit.id)}>
                                +
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Selected Circuits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCircuits.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Add circuits from the left panel
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {selectedCircuits.map(sc => {
                          const circuit = CIRCUIT_TYPES.find(c => c.id === sc.type);
                          return (
                            <div key={sc.type} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                              <span>{circuit?.name}</span>
                              <span className="font-medium">× {sc.quantity}</span>
                            </div>
                          );
                        })}
                        <div className="pt-4 border-t">
                          <Button onClick={calculateCU} className="w-full">
                            <Calculator className="h-4 w-4 mr-2" />
                            Calculate Consumer Unit
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {cuResult && (
                  <Card className="border-primary">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-primary">Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 rounded-lg bg-primary/10">
                        <p className="font-semibold">{cuResult.recommended.name}</p>
                        <p className="text-sm text-muted-foreground">{cuResult.recommended.description}</p>
                        <div className="flex gap-4 mt-2">
                          <Badge>Min {cuResult.totalWays} ways</Badge>
                          <Badge variant="outline">Recommend {Math.ceil(cuResult.totalWays * 1.2)} ways</Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Circuit Schedule</p>
                        <div className="space-y-1 max-h-48 overflow-y-auto">
                          {cuResult.circuits.map((c, i) => (
                            <div key={i} className="flex justify-between text-xs p-2 bg-secondary/30 rounded">
                              <span>{c.name}</span>
                              <span>{c.mcb}A | {c.cable}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Cable Sizing */}
          <TabsContent value="cable-sizing" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cable Size Calculator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Circuit Type</Label>
                    <Select value={selectedCircuitType} onValueChange={setSelectedCircuitType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select circuit" />
                      </SelectTrigger>
                      <SelectContent>
                        {CIRCUIT_TYPES.map(c => (
                          <SelectItem key={c.id} value={c.id}>{c.name} ({c.mcb}A)</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Cable Run Length (m)</Label>
                    <Input 
                      type="number" 
                      value={cableLength} 
                      onChange={e => setCableLength(parseFloat(e.target.value) || 0)} 
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Installation Method</Label>
                    <Select value={installMethod} onValueChange={(v: any) => setInstallMethod(v)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clipped">Clipped Direct</SelectItem>
                        <SelectItem value="conduit">In Conduit/Trunking</SelectItem>
                        <SelectItem value="insulated">Enclosed in Insulation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Ambient Temp (°C)</Label>
                      <Select value={ambientTemp.toString()} onValueChange={v => setAmbientTemp(parseInt(v))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DERATING_FACTORS.ambient_temp.map(t => (
                            <SelectItem key={t.temp} value={t.temp.toString()}>{t.temp}°C</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Grouped Cables</Label>
                      <Select value={groupedCables.toString()} onValueChange={v => setGroupedCables(parseInt(v))}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DERATING_FACTORS.grouping.map(g => (
                            <SelectItem key={g.cables} value={g.cables.toString()}>{g.cables}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={calculateCable} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Cable Size
                  </Button>

                  {cableResult && (
                    <div className={`p-4 rounded-lg ${cableResult.passes ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {cableResult.passes ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="font-semibold">
                          {cableResult.passes ? "Cable Size OK" : "Cable Size Insufficient"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Required Cable</p>
                          <p className="font-semibold">{cableResult.cable}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Voltage Drop</p>
                          <p className="font-semibold">{cableResult.voltageDrop}V</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Length</p>
                          <p className="font-semibold">{cableResult.maxLength}m</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Your Length</p>
                          <p className="font-semibold">{cableLength}m</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cable Sizing Reference</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Size</TableHead>
                        <TableHead>Clipped</TableHead>
                        <TableHead>Conduit</TableHead>
                        <TableHead>Insulated</TableHead>
                        <TableHead>mV/A/m</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(CABLE_SIZING_TABLE).map(([size, data]) => (
                        <TableRow key={size}>
                          <TableCell className="font-medium">{size}</TableCell>
                          <TableCell>{data.ccc_clipped}A</TableCell>
                          <TableCell>{data.ccc_conduit}A</TableCell>
                          <TableCell>{data.ccc_insulated}A</TableCell>
                          <TableCell>{data.voltage_drop}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Part P Compliance */}
          <TabsContent value="part-p" className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Notifiable Work</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {PART_P_NOTIFIABLE_WORK.map(work => (
                      <AccordionItem key={work.id} value={work.id}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            {work.name}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-2">
                          <p className="text-sm">{work.description}</p>
                          <div className="p-3 rounded bg-amber-500/10 text-sm">
                            <p className="font-medium">Guidance:</p>
                            <p>{work.guidance}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Exemptions:</p>
                            <ul className="text-sm text-muted-foreground list-disc list-inside">
                              {work.exemptions.map((e, i) => (
                                <li key={i}>{e}</li>
                              ))}
                            </ul>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Compliance Checklist</CardTitle>
                    <Badge variant={allRequiredComplete ? "default" : "secondary"}>
                      {completedChecks}/{PART_P_COMPLIANCE_CHECKLIST.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {PART_P_COMPLIANCE_CHECKLIST.map(item => (
                        <div 
                          key={item.id} 
                          className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                            checklistItems[item.id] ? "bg-green-500/10" : "bg-secondary/30"
                          }`}
                        >
                          <Checkbox 
                            id={item.id} 
                            checked={checklistItems[item.id] || false}
                            onCheckedChange={() => toggleChecklistItem(item.id)}
                          />
                          <div className="flex-1">
                            <label htmlFor={item.id} className="text-sm cursor-pointer">
                              {item.question}
                            </label>
                            {item.required && (
                              <Badge variant="destructive" className="ml-2 text-xs">Required</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Testing Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Pass Criteria</TableHead>
                        <TableHead>When</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {TESTING_REQUIREMENTS.map((test, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{test.test}</TableCell>
                          <TableCell className="text-sm">{test.method}</TableCell>
                          <TableCell className="text-sm">{test.pass_criteria}</TableCell>
                          <TableCell className="text-sm">{test.frequency}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bathroom Zones */}
          <TabsContent value="zones" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bathroom Zone Regulations (BS 7671)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {ZONE_REGULATIONS_BATHROOM.map(zone => (
                    <Card key={zone.zone} className="border-2">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Badge variant={zone.zone === "Zone 0" ? "destructive" : zone.zone === "Zone 1" ? "default" : "secondary"}>
                            {zone.zone}
                          </Badge>
                          {zone.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Requirements:</p>
                          <p className="text-sm text-muted-foreground">{zone.requirements}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Allowed Equipment:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {zone.allowed.map((item, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{item}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maximum Zs Values (Ω)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rating</TableHead>
                        <TableHead>Type B</TableHead>
                        <TableHead>Type C</TableHead>
                        <TableHead>Type D</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.keys(ZS_MAX_VALUES["Type B"]).map(rating => (
                        <TableRow key={rating}>
                          <TableCell className="font-medium">{rating}</TableCell>
                          <TableCell>{ZS_MAX_VALUES["Type B"][rating as keyof typeof ZS_MAX_VALUES["Type B"]]}Ω</TableCell>
                          <TableCell>{ZS_MAX_VALUES["Type C"][rating as keyof typeof ZS_MAX_VALUES["Type C"]]}Ω</TableCell>
                          <TableCell>{ZS_MAX_VALUES["Type D"][rating as keyof typeof ZS_MAX_VALUES["Type D"]]}Ω</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground text-center">
          ⚠️ Disclaimer: This tool provides guidance only. All electrical work must be carried out by a competent person 
          and comply with BS 7671 (18th Edition). Always verify calculations independently.
        </p>
      </div>
    </DashboardLayout>
  );
}
