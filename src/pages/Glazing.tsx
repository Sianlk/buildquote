import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  SquareStack, 
  Calculator, 
  Package, 
  FileText,
  Home,
  DoorOpen,
  Sun
} from "lucide-react";
import { ALL_GLAZING_COMPONENTS } from "@/lib/glazing-trade-components";
import { GLAZING_COMPONENTS } from "@/lib/expanded-trade-components";

// Combine all glazing components
const ALL_COMPONENTS = [...GLAZING_COMPONENTS, ...ALL_GLAZING_COMPONENTS];

// Group components by category
const groupedComponents = ALL_COMPONENTS.reduce((acc, comp) => {
  if (!acc[comp.category]) acc[comp.category] = [];
  acc[comp.category].push(comp);
  return acc;
}, {} as Record<string, typeof ALL_COMPONENTS>);

// Job types with BoM
const GLAZING_JOBS = [
  {
    id: "upvc-window",
    name: "uPVC Window Installation",
    description: "Standard double glazed uPVC window supply and fit",
    labour_hours: 2,
    skill: "Glazier / Window Fitter",
    tools: ["Drill/Driver", "Spirit Level", "Tape Measure", "Silicone Gun", "Hammer", "Chisel"],
    components: [
      { name: "uPVC Window Frame (standard)", qty: 1, unit: "nr" },
      { name: "Double Glazed Unit 24mm", qty: 1.2, unit: "m²" },
      { name: "uPVC Window Handle", qty: 1, unit: "nr" },
      { name: "Window Hinges (pair)", qty: 1, unit: "pair" },
      { name: "Expanding Foam", qty: 0.5, unit: "can" },
      { name: "Silicone Sealant", qty: 1, unit: "tube" },
      { name: "Glazing Packers", qty: 20, unit: "nr" },
      { name: "Frame Fixings 7.5x112mm", qty: 8, unit: "nr" },
    ],
  },
  {
    id: "bifold-door",
    name: "Bifold Door Installation",
    description: "Aluminium bifold door supply and fit (3-panel)",
    labour_hours: 8,
    skill: "Specialist Window/Door Fitter",
    tools: ["Drill/Driver", "Spirit Level", "Laser Level", "Silicone Gun", "Pry Bar", "Router"],
    components: [
      { name: "Aluminium Bifold Door 3-Panel", qty: 1, unit: "nr" },
      { name: "Double Glazed Unit 24mm", qty: 5.5, unit: "m²" },
      { name: "Bifold Track System", qty: 1, unit: "set" },
      { name: "Bifold Rollers", qty: 6, unit: "nr" },
      { name: "Multipoint Lock", qty: 1, unit: "nr" },
      { name: "Threshold Seal", qty: 3, unit: "m" },
      { name: "Expanding Foam", qty: 2, unit: "can" },
      { name: "Silicone Sealant", qty: 3, unit: "tube" },
      { name: "Frame Fixings 7.5x152mm", qty: 16, unit: "nr" },
    ],
  },
  {
    id: "velux-window",
    name: "Velux Roof Window Installation",
    description: "Centre-pivot roof window with flashing kit",
    labour_hours: 6,
    skill: "Roofer / Velux Installer",
    tools: ["Drill/Driver", "Reciprocating Saw", "Spirit Level", "Roofing Knife", "Slate Ripper"],
    components: [
      { name: "Velux Centre-Pivot Window", qty: 1, unit: "nr" },
      { name: "Velux Flashing Kit", qty: 1, unit: "set" },
      { name: "Velux Insulation Collar", qty: 1, unit: "nr" },
      { name: "Velux Vapour Barrier", qty: 1, unit: "nr" },
      { name: "Roofing Felt", qty: 2, unit: "m²" },
      { name: "Timber Battens", qty: 6, unit: "m" },
      { name: "Stainless Steel Screws", qty: 30, unit: "nr" },
      { name: "Lead Flashing", qty: 1.5, unit: "m" },
    ],
  },
  {
    id: "juliet-balcony",
    name: "Juliet Balcony Installation",
    description: "Glass Juliet balcony with French doors",
    labour_hours: 10,
    skill: "Glazier + Structural Installer",
    tools: ["Drill/Driver", "SDS Drill", "Spirit Level", "Torque Wrench", "Silicone Gun"],
    components: [
      { name: "Juliet Balcony Glass Panel", qty: 1, unit: "nr" },
      { name: "Juliet Balcony Brackets", qty: 4, unit: "nr" },
      { name: "French Doors (pair)", qty: 1, unit: "set" },
      { name: "Multipoint Lock", qty: 1, unit: "nr" },
      { name: "Door Handles (pair)", qty: 1, unit: "set" },
      { name: "Hinges (per door)", qty: 6, unit: "nr" },
      { name: "Chemical Anchor Resin", qty: 2, unit: "tube" },
      { name: "M12 Threaded Rods", qty: 8, unit: "nr" },
      { name: "Silicone Sealant", qty: 2, unit: "tube" },
    ],
  },
  {
    id: "conservatory",
    name: "Conservatory Installation",
    description: "Victorian style conservatory (3x3m)",
    labour_hours: 40,
    skill: "Conservatory Installer Team",
    tools: ["Full Tool Kit", "Scaffolding", "Crane/Hoist", "Laser Level"],
    components: [
      { name: "Conservatory Base/Dwarf Wall", qty: 12, unit: "m" },
      { name: "uPVC Window Frame (standard)", qty: 6, unit: "nr" },
      { name: "Double Glazed Unit 24mm", qty: 18, unit: "m²" },
      { name: "Polycarbonate Roof Panels", qty: 12, unit: "m²" },
      { name: "Aluminium Roof Bars", qty: 8, unit: "nr" },
      { name: "Ridge Beam", qty: 1, unit: "nr" },
      { name: "Guttering", qty: 10, unit: "m" },
      { name: "Downpipes", qty: 2, unit: "nr" },
      { name: "French Doors (pair)", qty: 1, unit: "set" },
      { name: "Expanding Foam", qty: 10, unit: "can" },
      { name: "Silicone Sealant", qty: 12, unit: "tube" },
    ],
  },
];

// Calculator state
export default function Glazing() {
  const [windowWidth, setWindowWidth] = useState("");
  const [windowHeight, setWindowHeight] = useState("");
  const [selectedJob, setSelectedJob] = useState<typeof GLAZING_JOBS[0] | null>(null);

  const glassArea = windowWidth && windowHeight 
    ? (parseFloat(windowWidth) / 1000) * (parseFloat(windowHeight) / 1000) 
    : 0;
  const uValue = 1.2; // Standard double glazing
  const estimatedCost = glassArea > 0 ? Math.round(glassArea * 185) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SquareStack className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Glazing Module</h1>
            <p className="text-muted-foreground">Windows, doors, Velux, bifolds, conservatories & Juliet balconies</p>
          </div>
        </div>

        <Tabs defaultValue="jobs" className="space-y-4">
          <ScrollArea className="w-full">
            <TabsList className="flex w-max gap-1 h-auto p-1">
              <TabsTrigger value="jobs" className="text-xs px-2 py-1.5 whitespace-nowrap">
                <FileText className="h-3 w-3 mr-1" />
                Jobs & BoM
              </TabsTrigger>
              <TabsTrigger value="windows" className="text-xs px-2 py-1.5 whitespace-nowrap">
                <Home className="h-3 w-3 mr-1" />
                Windows
              </TabsTrigger>
              <TabsTrigger value="doors" className="text-xs px-2 py-1.5 whitespace-nowrap">
                <DoorOpen className="h-3 w-3 mr-1" />
                Doors
              </TabsTrigger>
              <TabsTrigger value="rooflights" className="text-xs px-2 py-1.5 whitespace-nowrap">
                <Sun className="h-3 w-3 mr-1" />
                Rooflights
              </TabsTrigger>
              <TabsTrigger value="components" className="text-xs px-2 py-1.5 whitespace-nowrap">
                <Package className="h-3 w-3 mr-1" />
                Components
              </TabsTrigger>
              <TabsTrigger value="calculator" className="text-xs px-2 py-1.5 whitespace-nowrap">
                <Calculator className="h-3 w-3 mr-1" />
                Calculator
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Jobs & BoM Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {GLAZING_JOBS.map((job) => (
                <Card 
                  key={job.id} 
                  className={`cursor-pointer transition-all ${selectedJob?.id === job.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedJob(job)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{job.name}</CardTitle>
                    <CardDescription>{job.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <Badge variant="outline">{job.labour_hours}h labour</Badge>
                      <Badge variant="secondary">{job.skill}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedJob && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Bill of Materials: {selectedJob.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground">Labour Hours</div>
                      <div className="text-xl font-bold">{selectedJob.labour_hours}h</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground">Skill Required</div>
                      <div className="text-sm font-medium">{selectedJob.skill}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground">Tools Required</div>
                      <div className="text-xs">{selectedJob.tools.slice(0, 3).join(", ")}...</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">Component</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead>Unit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedJob.components.map((comp, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{comp.name}</TableCell>
                            <TableCell className="text-right">{comp.qty}</TableCell>
                            <TableCell>{comp.unit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Tools Required:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.tools.map((tool) => (
                        <Badge key={tool} variant="outline">{tool}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Windows Tab */}
          <TabsContent value="windows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Window Components & Pricing</CardTitle>
                <CardDescription>uPVC and aluminium window frames, units, and accessories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Component</TableHead>
                        <TableHead>Part Code</TableHead>
                        <TableHead className="text-right">Trade</TableHead>
                        <TableHead className="text-right">Retail</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(groupedComponents['window'] || []).map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-medium">{comp.name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{comp.partCode}</Badge></TableCell>
                          <TableCell className="text-right">£{comp.tradeCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">£{comp.retailCost.toFixed(2)}</TableCell>
                          <TableCell>{comp.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doors Tab */}
          <TabsContent value="doors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Door Components & Pricing</CardTitle>
                <CardDescription>Bifolds, French doors, patio doors, and composite doors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Component</TableHead>
                        <TableHead>Part Code</TableHead>
                        <TableHead className="text-right">Trade</TableHead>
                        <TableHead className="text-right">Retail</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(groupedComponents['door'] || []).map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-medium">{comp.name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{comp.partCode}</Badge></TableCell>
                          <TableCell className="text-right">£{comp.tradeCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">£{comp.retailCost.toFixed(2)}</TableCell>
                          <TableCell>{comp.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rooflights Tab */}
          <TabsContent value="rooflights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rooflight & Velux Components</CardTitle>
                <CardDescription>Velux windows, flat roof skylights, and flashing kits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Component</TableHead>
                        <TableHead>Part Code</TableHead>
                        <TableHead className="text-right">Trade</TableHead>
                        <TableHead className="text-right">Retail</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(groupedComponents['rooflight'] || []).map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-medium">{comp.name}</TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{comp.partCode}</Badge></TableCell>
                          <TableCell className="text-right">£{comp.tradeCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">£{comp.retailCost.toFixed(2)}</TableCell>
                          <TableCell>{comp.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Components Tab */}
          <TabsContent value="components" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Full Component Library ({ALL_COMPONENTS.length} items)</CardTitle>
                <CardDescription>Complete glazing components with trade and retail pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Component</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Part Code</TableHead>
                        <TableHead className="text-right">Trade</TableHead>
                        <TableHead className="text-right">Retail</TableHead>
                        <TableHead>Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ALL_COMPONENTS.slice(0, 50).map((comp) => (
                        <TableRow key={comp.id}>
                          <TableCell className="font-medium">{comp.name}</TableCell>
                          <TableCell><Badge variant="secondary" className="text-xs">{comp.category}</Badge></TableCell>
                          <TableCell><Badge variant="outline" className="text-xs">{comp.partCode}</Badge></TableCell>
                          <TableCell className="text-right">£{comp.tradeCost.toFixed(2)}</TableCell>
                          <TableCell className="text-right">£{comp.retailCost.toFixed(2)}</TableCell>
                          <TableCell>{comp.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {ALL_COMPONENTS.length > 50 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Showing 50 of {ALL_COMPONENTS.length} components. Use Trade Jobs for full access.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Glass Area Calculator</CardTitle>
                  <CardDescription>Calculate glazing area and U-value compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Width (mm)</Label>
                      <Input 
                        type="number" 
                        placeholder="1200" 
                        value={windowWidth}
                        onChange={(e) => setWindowWidth(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Height (mm)</Label>
                      <Input 
                        type="number" 
                        placeholder="1500" 
                        value={windowHeight}
                        onChange={(e) => setWindowHeight(e.target.value)}
                      />
                    </div>
                  </div>

                  {glassArea > 0 && (
                    <div className="p-4 rounded-lg bg-muted space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Glass Area:</span>
                        <span className="font-bold">{glassArea.toFixed(2)} m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">U-Value (double glazed):</span>
                        <span className="font-bold">{uValue} W/m²K</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. Cost (supply only):</span>
                        <span className="font-bold text-primary">£{estimatedCost}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Building Regs Compliance</CardTitle>
                  <CardDescription>Part L thermal requirements for glazing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Windows (Part L 2021)</span>
                      <Badge>U ≤ 1.4 W/m²K</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Doors (Part L 2021)</span>
                      <Badge>U ≤ 1.4 W/m²K</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Rooflights (Part L 2021)</span>
                      <Badge>U ≤ 1.7 W/m²K</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Curtain Walling</span>
                      <Badge>U ≤ 1.6 W/m²K</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
