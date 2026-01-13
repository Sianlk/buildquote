import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LiabilityDisclaimer } from "@/components/shared/LiabilityDisclaimer";
import {
  calculateBrickwork,
  calculateRoofing,
  calculateElectrical,
  calculatePlumbingHeating,
  calculateFoundation,
  calculateStructuralSteel,
  calculateFullProjectEstimate,
  type BrickworkCalculation,
  type RoofingCalculation,
  type ElectricalCalculation,
  type PlumbingCalculation,
  type FoundationCalculation,
  type SteelCalculation,
  type ProjectEstimate,
} from "@/lib/estimator-calculators";
import { REGIONAL_MULTIPLIERS } from "@/lib/construction-rates";
import {
  Calculator,
  Wrench,
  Zap,
  Droplets,
  Blocks,
  Home,
  ArrowRight,
  Download,
  FileText,
} from "lucide-react";

type Region = keyof typeof REGIONAL_MULTIPLIERS;

const formatCurrency = (value: number) => `£${value.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

export default function Calculators() {
  const [activeTab, setActiveTab] = useState("brickwork");
  const [region, setRegion] = useState<Region>("south_east");
  const [pricingType, setPricingType] = useState<"trade" | "retail">("retail");

  // Brickwork state
  const [brickLength, setBrickLength] = useState("10");
  const [brickHeight, setBrickHeight] = useState("2.7");
  const [wallType, setWallType] = useState<"cavity" | "solid" | "block_only">("cavity");
  const [brickType, setBrickType] = useState<"standard" | "facing" | "reclaimed" | "handmade">("facing");
  const [brickResult, setBrickResult] = useState<BrickworkCalculation | null>(null);

  // Roofing state
  const [roofLength, setRoofLength] = useState("8");
  const [roofWidth, setRoofWidth] = useState("6");
  const [roofPitch, setRoofPitch] = useState("35");
  const [roofType, setRoofType] = useState<"pitched" | "flat" | "mono_pitch">("pitched");
  const [coveringType, setCoveringType] = useState("concrete_interlocking");
  const [roofResult, setRoofResult] = useState<RoofingCalculation | null>(null);

  // Electrical state
  const [elecFloorArea, setElecFloorArea] = useState("50");
  const [elecRooms, setElecRooms] = useState("4");
  const [elecSockets, setElecSockets] = useState("20");
  const [elecSwitches, setElecSwitches] = useState("8");
  const [elecDownlights, setElecDownlights] = useState("12");
  const [elecResult, setElecResult] = useState<ElectricalCalculation | null>(null);

  // Plumbing state
  const [plumbFloorArea, setPlumbFloorArea] = useState("80");
  const [plumbRooms, setPlumbRooms] = useState("6");
  const [plumbRadiators, setPlumbRadiators] = useState("8");
  const [plumbBathrooms, setPlumbBathrooms] = useState("2");
  const [boilerType, setBoilerType] = useState<"combi" | "system">("combi");
  const [plumbResult, setPlumbResult] = useState<PlumbingCalculation | null>(null);

  // Foundation state
  const [foundLength, setFoundLength] = useState("6");
  const [foundWidth, setFoundWidth] = useState("4");
  const [foundationType, setFoundationType] = useState<"strip" | "trench_fill" | "raft" | "piled">("trench_fill");
  const [foundResult, setFoundResult] = useState<FoundationCalculation | null>(null);

  // Full project state
  const [projectLength, setProjectLength] = useState("6");
  const [projectWidth, setProjectWidth] = useState("4");
  const [projectHeight, setProjectHeight] = useState("2.4");
  const [projectRooms, setProjectRooms] = useState("4");
  const [projectBathrooms, setProjectBathrooms] = useState("1");
  const [projectQuality, setProjectQuality] = useState<"basic" | "standard" | "premium" | "luxury">("standard");
  const [projectResult, setProjectResult] = useState<ProjectEstimate | null>(null);

  const calculateBrick = () => {
    const result = calculateBrickwork({
      length: parseFloat(brickLength),
      height: parseFloat(brickHeight),
      wallType,
      brickType,
      blockType: "aerated",
      region,
      pricingType,
    });
    setBrickResult(result);
  };

  const calculateRoof = () => {
    const result = calculateRoofing({
      planLength: parseFloat(roofLength),
      planWidth: parseFloat(roofWidth),
      pitch: parseFloat(roofPitch),
      roofType,
      coveringType: coveringType as any,
      region,
      pricingType,
    });
    setRoofResult(result);
  };

  const calculateElec = () => {
    const result = calculateElectrical({
      floorArea: parseFloat(elecFloorArea),
      rooms: parseInt(elecRooms),
      sockets: parseInt(elecSockets),
      switches: parseInt(elecSwitches),
      downlights: parseInt(elecDownlights),
      consumerUnit: true,
      region,
      pricingType,
    });
    setElecResult(result);
  };

  const calculatePlumb = () => {
    const result = calculatePlumbingHeating({
      floorArea: parseFloat(plumbFloorArea),
      rooms: parseInt(plumbRooms),
      boilerType,
      radiatorCount: parseInt(plumbRadiators),
      bathrooms: parseInt(plumbBathrooms),
      region,
      pricingType,
    });
    setPlumbResult(result);
  };

  const calculateFound = () => {
    const result = calculateFoundation({
      length: parseFloat(foundLength),
      width: parseFloat(foundWidth),
      foundationType,
      region,
      pricingType,
    });
    setFoundResult(result);
  };

  const calculateProject = () => {
    const result = calculateFullProjectEstimate({
      length: parseFloat(projectLength),
      width: parseFloat(projectWidth),
      height: parseFloat(projectHeight),
      projectType: "single_storey_rear",
      foundationType: "trench_fill",
      wallType: "cavity",
      roofType: "pitched",
      rooms: parseInt(projectRooms),
      bathrooms: parseInt(projectBathrooms),
      boilerType: "combi",
      region,
      pricingType,
      buildQuality: projectQuality,
    });
    setProjectResult(result);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Construction Calculators</h1>
            <p className="text-muted-foreground">
              Professional estimating tools with UK Jan 2026 pricing
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(REGIONAL_MULTIPLIERS).map((r) => (
                  <SelectItem key={r} value={r}>
                    {r.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={pricingType} onValueChange={(v) => setPricingType(v as "trade" | "retail")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trade">Trade</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <LiabilityDisclaimer variant="compact" context="calculation" />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="brickwork" className="gap-2">
              <Blocks className="h-4 w-4" />
              <span className="hidden md:inline">Brickwork</span>
            </TabsTrigger>
            <TabsTrigger value="roofing" className="gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden md:inline">Roofing</span>
            </TabsTrigger>
            <TabsTrigger value="electrical" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden md:inline">Electrical</span>
            </TabsTrigger>
            <TabsTrigger value="plumbing" className="gap-2">
              <Droplets className="h-4 w-4" />
              <span className="hidden md:inline">Plumbing</span>
            </TabsTrigger>
            <TabsTrigger value="foundation" className="gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden md:inline">Foundation</span>
            </TabsTrigger>
            <TabsTrigger value="full" className="gap-2">
              <Calculator className="h-4 w-4" />
              <span className="hidden md:inline">Full Project</span>
            </TabsTrigger>
          </TabsList>

          {/* Brickwork Calculator */}
          <TabsContent value="brickwork" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Blocks className="h-5 w-5 text-primary" />
                    Brickwork Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate bricks, blocks, mortar and labour for masonry walls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Wall Length (m)</Label>
                      <Input type="number" value={brickLength} onChange={(e) => setBrickLength(e.target.value)} />
                    </div>
                    <div>
                      <Label>Wall Height (m)</Label>
                      <Input type="number" value={brickHeight} onChange={(e) => setBrickHeight(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Wall Type</Label>
                      <Select value={wallType} onValueChange={(v) => setWallType(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cavity">Cavity Wall</SelectItem>
                          <SelectItem value="solid">Solid Wall</SelectItem>
                          <SelectItem value="block_only">Block Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Brick Type</Label>
                      <Select value={brickType} onValueChange={(v) => setBrickType(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="facing">Facing</SelectItem>
                          <SelectItem value="reclaimed">Reclaimed</SelectItem>
                          <SelectItem value="handmade">Handmade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={calculateBrick} className="w-full">
                    Calculate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {brickResult && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Wall Area</p>
                        <p className="text-xl font-bold">{brickResult.wallArea.toFixed(1)} m²</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Labour Days</p>
                        <p className="text-xl font-bold">{brickResult.labourDays} days</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span>Bricks ({brickResult.breakdown.bricks.quantity})</span>
                        <span className="font-mono">{formatCurrency(brickResult.breakdown.bricks.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Blocks ({brickResult.breakdown.blocks.quantity})</span>
                        <span className="font-mono">{formatCurrency(brickResult.breakdown.blocks.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Mortar ({brickResult.breakdown.mortar.volume.toFixed(2)} m³)</span>
                        <span className="font-mono">{formatCurrency(brickResult.breakdown.mortar.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Materials Total</span>
                        <span className="font-mono font-semibold">{formatCurrency(brickResult.materialCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Labour</span>
                        <span className="font-mono">{formatCurrency(brickResult.labourCost)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(brickResult.totalCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Roofing Calculator */}
          <TabsContent value="roofing" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Roofing Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate tiles, battens, felt and rainwater goods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Length (m)</Label>
                      <Input type="number" value={roofLength} onChange={(e) => setRoofLength(e.target.value)} />
                    </div>
                    <div>
                      <Label>Width (m)</Label>
                      <Input type="number" value={roofWidth} onChange={(e) => setRoofWidth(e.target.value)} />
                    </div>
                    <div>
                      <Label>Pitch (°)</Label>
                      <Input type="number" value={roofPitch} onChange={(e) => setRoofPitch(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Roof Type</Label>
                      <Select value={roofType} onValueChange={(v) => setRoofType(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pitched">Pitched</SelectItem>
                          <SelectItem value="flat">Flat</SelectItem>
                          <SelectItem value="mono_pitch">Mono-Pitch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Covering</Label>
                      <Select value={coveringType} onValueChange={setCoveringType}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concrete_interlocking">Concrete Tiles</SelectItem>
                          <SelectItem value="clay_plain_tiles">Clay Tiles</SelectItem>
                          <SelectItem value="natural_slate">Natural Slate</SelectItem>
                          <SelectItem value="reconstituted_slate">Recon Slate</SelectItem>
                          <SelectItem value="epdm_rubber">EPDM Flat</SelectItem>
                          <SelectItem value="grp_fibreglass">GRP Flat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={calculateRoof} className="w-full">
                    Calculate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {roofResult && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Roof Area</p>
                        <p className="text-xl font-bold">{roofResult.roofArea.toFixed(1)} m²</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Labour Days</p>
                        <p className="text-xl font-bold">{roofResult.labourDays} days</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span>Covering ({roofResult.breakdown.covering.type})</span>
                        <span className="font-mono">{formatCurrency(roofResult.breakdown.covering.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Felt/Membrane</span>
                        <span className="font-mono">{formatCurrency(roofResult.breakdown.felt.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Fascia & Soffit</span>
                        <span className="font-mono">{formatCurrency(roofResult.breakdown.fascia.cost + roofResult.breakdown.soffit.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Rainwater Goods</span>
                        <span className="font-mono">{formatCurrency(roofResult.breakdown.guttering.cost + roofResult.breakdown.downpipes.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Labour</span>
                        <span className="font-mono">{formatCurrency(roofResult.labourCost)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(roofResult.totalCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Electrical Calculator */}
          <TabsContent value="electrical" className="mt-6">
            <LiabilityDisclaimer variant="compact" context="electrical" />
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Electrical Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate sockets, lighting, and cable requirements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Floor Area (m²)</Label>
                      <Input type="number" value={elecFloorArea} onChange={(e) => setElecFloorArea(e.target.value)} />
                    </div>
                    <div>
                      <Label>Rooms</Label>
                      <Input type="number" value={elecRooms} onChange={(e) => setElecRooms(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Sockets</Label>
                      <Input type="number" value={elecSockets} onChange={(e) => setElecSockets(e.target.value)} />
                    </div>
                    <div>
                      <Label>Switches</Label>
                      <Input type="number" value={elecSwitches} onChange={(e) => setElecSwitches(e.target.value)} />
                    </div>
                    <div>
                      <Label>Downlights</Label>
                      <Input type="number" value={elecDownlights} onChange={(e) => setElecDownlights(e.target.value)} />
                    </div>
                  </div>
                  
                  <Button onClick={calculateElec} className="w-full">
                    Calculate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {elecResult && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Total Points</p>
                        <p className="text-xl font-bold">{elecResult.totalPoints}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Cable Length</p>
                        <p className="text-xl font-bold">{elecResult.cableLength.toFixed(0)} m</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span>Materials</span>
                        <span className="font-mono">{formatCurrency(elecResult.materialCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Labour ({elecResult.labourDays} days)</span>
                        <span className="font-mono">{formatCurrency(elecResult.labourCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Part P Certification</span>
                        <span className="font-mono">{formatCurrency(elecResult.certificationCost)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(elecResult.totalCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Plumbing Calculator */}
          <TabsContent value="plumbing" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-primary" />
                    Plumbing & Heating Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate heating system, sanitaryware and pipework
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Floor Area (m²)</Label>
                      <Input type="number" value={plumbFloorArea} onChange={(e) => setPlumbFloorArea(e.target.value)} />
                    </div>
                    <div>
                      <Label>Rooms</Label>
                      <Input type="number" value={plumbRooms} onChange={(e) => setPlumbRooms(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Radiators</Label>
                      <Input type="number" value={plumbRadiators} onChange={(e) => setPlumbRadiators(e.target.value)} />
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input type="number" value={plumbBathrooms} onChange={(e) => setPlumbBathrooms(e.target.value)} />
                    </div>
                    <div>
                      <Label>Boiler</Label>
                      <Select value={boilerType} onValueChange={(v) => setBoilerType(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="combi">Combi</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={calculatePlumb} className="w-full">
                    Calculate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {plumbResult && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Heat Output</p>
                        <p className="text-xl font-bold">{(plumbResult.heatOutput / 1000).toFixed(1)} kW</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Labour Days</p>
                        <p className="text-xl font-bold">{plumbResult.labourDays} days</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span>Boiler ({plumbResult.breakdown.boiler.type})</span>
                        <span className="font-mono">{formatCurrency(plumbResult.breakdown.boiler.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Radiators ({plumbResult.breakdown.radiators.quantity})</span>
                        <span className="font-mono">{formatCurrency(plumbResult.breakdown.radiators.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Sanitaryware</span>
                        <span className="font-mono">{formatCurrency(plumbResult.breakdown.sanitaryware.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Pipework</span>
                        <span className="font-mono">{formatCurrency(plumbResult.breakdown.pipework.cost)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(plumbResult.totalCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Foundation Calculator */}
          <TabsContent value="foundation" className="mt-6">
            <LiabilityDisclaimer variant="compact" context="structural" />
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    Foundation Calculator
                  </CardTitle>
                  <CardDescription>
                    Calculate excavation, concrete and reinforcement
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Length (m)</Label>
                      <Input type="number" value={foundLength} onChange={(e) => setFoundLength(e.target.value)} />
                    </div>
                    <div>
                      <Label>Width (m)</Label>
                      <Input type="number" value={foundWidth} onChange={(e) => setFoundWidth(e.target.value)} />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Foundation Type</Label>
                    <Select value={foundationType} onValueChange={(v) => setFoundationType(v as any)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strip">Strip Foundation</SelectItem>
                        <SelectItem value="trench_fill">Trench Fill</SelectItem>
                        <SelectItem value="raft">Raft Foundation</SelectItem>
                        <SelectItem value="piled">Piled Foundation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button onClick={calculateFound} className="w-full">
                    Calculate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {foundResult && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <CardTitle>Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Concrete Volume</p>
                        <p className="text-xl font-bold">{foundResult.concreteVolume.toFixed(1)} m³</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Labour Days</p>
                        <p className="text-xl font-bold">{foundResult.labourDays} days</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span>Excavation & Plant</span>
                        <span className="font-mono">{formatCurrency(foundResult.plantCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Concrete ({foundResult.breakdown.concrete.volume.toFixed(1)} m³)</span>
                        <span className="font-mono">{formatCurrency(foundResult.breakdown.concrete.cost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Materials Total</span>
                        <span className="font-mono">{formatCurrency(foundResult.materialCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Labour</span>
                        <span className="font-mono">{formatCurrency(foundResult.labourCost)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total Cost</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(foundResult.totalCost)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Full Project Calculator */}
          <TabsContent value="full" className="mt-6">
            <LiabilityDisclaimer variant="prominent" context="calculation" />
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-primary" />
                    Full Project Estimator
                  </CardTitle>
                  <CardDescription>
                    Complete extension cost breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Length (m)</Label>
                      <Input type="number" value={projectLength} onChange={(e) => setProjectLength(e.target.value)} />
                    </div>
                    <div>
                      <Label>Width (m)</Label>
                      <Input type="number" value={projectWidth} onChange={(e) => setProjectWidth(e.target.value)} />
                    </div>
                    <div>
                      <Label>Height (m)</Label>
                      <Input type="number" value={projectHeight} onChange={(e) => setProjectHeight(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Rooms</Label>
                      <Input type="number" value={projectRooms} onChange={(e) => setProjectRooms(e.target.value)} />
                    </div>
                    <div>
                      <Label>Bathrooms</Label>
                      <Input type="number" value={projectBathrooms} onChange={(e) => setProjectBathrooms(e.target.value)} />
                    </div>
                    <div>
                      <Label>Quality</Label>
                      <Select value={projectQuality} onValueChange={(v) => setProjectQuality(v as any)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="luxury">Luxury</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <Button onClick={calculateProject} className="w-full" size="lg">
                    Generate Full Estimate <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {projectResult && (
                <Card className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Project Estimate</CardTitle>
                      <Badge variant="outline">{projectQuality}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Floor Area</p>
                        <p className="text-lg font-bold">{parseFloat(projectLength) * parseFloat(projectWidth)} m²</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Cost/m²</p>
                        <p className="text-lg font-bold">{formatCurrency(projectResult.costPerSqm)}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-muted-foreground">Duration</p>
                        <p className="text-lg font-bold">{projectResult.durationWeeks} weeks</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span>Foundation</span>
                        <span className="font-mono">{formatCurrency(projectResult.foundation.totalCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Brickwork & Masonry</span>
                        <span className="font-mono">{formatCurrency(projectResult.brickwork.totalCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Roofing</span>
                        <span className="font-mono">{formatCurrency(projectResult.roofing.totalCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Electrical</span>
                        <span className="font-mono">{formatCurrency(projectResult.electrical.totalCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Plumbing & Heating</span>
                        <span className="font-mono">{formatCurrency(projectResult.plumbing.totalCost)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Finishing</span>
                        <span className="font-mono">{formatCurrency(
                          projectResult.finishing.plastering + 
                          projectResult.finishing.decoration + 
                          projectResult.finishing.flooring + 
                          projectResult.finishing.secondFix
                        )}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b text-muted-foreground">
                        <span>Preliminaries (8%)</span>
                        <span className="font-mono">{formatCurrency(projectResult.preliminaries)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b text-muted-foreground">
                        <span>Contingency (10%)</span>
                        <span className="font-mono">{formatCurrency(projectResult.contingency)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Grand Total</span>
                        <span className="text-3xl font-bold text-primary">{formatCurrency(projectResult.grandTotal)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
