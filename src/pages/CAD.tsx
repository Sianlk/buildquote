import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import {
  PenTool,
  Loader2,
  Download,
  Plus,
  X,
  Eye,
  Home,
  Zap,
  Droplets,
  Square,
  DoorOpen,
  Wind,
  Flame,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { ROOM_TYPES, ELECTRICAL_POINTS, PLUMBING_FIXTURES, FLOORING_TYPES, HEATING_SYSTEMS, WINDOW_TYPES, DOOR_TYPES, RoomConfiguration } from "@/lib/room-configuration";
import { CADPreviewModal } from "@/components/cad/CADPreviewModal";

type Project = Tables<"projects">;
type CadDrawing = Tables<"cad_drawings">;

const DRAWING_TYPES = [
  { value: "floor_plan", label: "Floor Plan" },
  { value: "elevation_front", label: "Front Elevation" },
  { value: "elevation_side", label: "Side Elevation" },
  { value: "section", label: "Building Section" },
  { value: "site_plan", label: "Site Plan" },
  { value: "electrical_layout", label: "Electrical Layout" },
  { value: "plumbing_layout", label: "Plumbing Layout" },
  { value: "structural_details", label: "Structural Details" },
];

const PROJECT_TYPES = [
  { value: "single_storey_rear", label: "Single Storey Rear Extension" },
  { value: "single_storey_side", label: "Single Storey Side Extension" },
  { value: "double_storey_rear", label: "Double Storey Rear Extension" },
  { value: "double_storey_side", label: "Double Storey Side Extension" },
  { value: "wrap_around", label: "Wrap Around Extension" },
  { value: "loft_dormer", label: "Dormer Loft Conversion" },
  { value: "loft_hip_to_gable", label: "Hip to Gable Loft" },
  { value: "loft_mansard", label: "Mansard Loft" },
  { value: "new_build", label: "New Build" },
  { value: "garage_integral", label: "Garage Conversion" },
  { value: "office_conversion", label: "Office to Residential" },
];

const WALL_TYPES = [
  { value: "cavity", label: "Cavity Wall (300mm)", uValue: 0.18 },
  { value: "solid", label: "Solid Wall (450mm)", uValue: 0.30 },
  { value: "timber_frame", label: "Timber Frame (150mm)", uValue: 0.15 },
  { value: "sips", label: "SIPs (170mm)", uValue: 0.12 },
  { value: "icf", label: "ICF (250mm)", uValue: 0.11 },
];

const ROOF_TYPES = [
  { value: "pitched", label: "Pitched (35°)", uValue: 0.13 },
  { value: "flat", label: "Flat (EPDM/GRP)", uValue: 0.15 },
  { value: "mono_pitch", label: "Mono-Pitch (15°)", uValue: 0.13 },
  { value: "mansard", label: "Mansard", uValue: 0.13 },
];

const FOUNDATION_TYPES = [
  { value: "strip", label: "Strip Foundation", depth: "1000mm", width: "600mm" },
  { value: "trench", label: "Trench Fill", depth: "1000mm", width: "450mm" },
  { value: "raft", label: "Raft Foundation", depth: "300mm", width: "Full" },
  { value: "piled", label: "Piled Foundation", depth: "3000mm+", width: "300mm dia" },
];

interface RoomConfig {
  id: string;
  type: string;
  name: string;
  length: number;
  width: number;
  height: number;
  windows: { type: string; width: number; height: number; quantity: number }[];
  doors: { type: string; width: number; height: number; swing: string }[];
  electrical: { type: string; quantity: number }[];
  plumbing: { type: string; quantity: number }[];
  flooring: string;
  heating: string;
  features: string[];
}

export default function CAD() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [drawings, setDrawings] = useState<CadDrawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<CadDrawing | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<"project" | "standalone">("standalone");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [drawingType, setDrawingType] = useState("floor_plan");
  
  // Building dimensions
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("4");
  const [height, setHeight] = useState("2.4");
  const [wallType, setWallType] = useState("cavity");
  const [roofType, setRoofType] = useState("pitched");
  const [foundationType, setFoundationType] = useState("strip");
  const [projectType, setProjectType] = useState("single_storey_rear");
  
  // Room configurations
  const [rooms, setRooms] = useState<RoomConfig[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  
  // Building regs validation
  const [buildingRegsValid, setBuildingRegsValid] = useState<{valid: boolean; issues: string[]; passes: string[]}>({
    valid: true,
    issues: [],
    passes: []
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    validateBuildingRegs();
  }, [rooms, length, width, height, wallType, roofType]);

  async function fetchData() {
    if (!user) return;

    const [projectsRes, drawingsRes] = await Promise.all([
      supabase.from("projects").select("*").order("updated_at", { ascending: false }),
      supabase.from("cad_drawings").select("*").order("created_at", { ascending: false }),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (drawingsRes.data) setDrawings(drawingsRes.data);
    setLoading(false);
  }

  const validateBuildingRegs = () => {
    const issues: string[] = [];
    const passes: string[] = [];
    const floorArea = parseFloat(length) * parseFloat(width);
    const h = parseFloat(height);
    
    // Part M - Accessibility
    const hasAccessibleDoor = rooms.some(r => r.doors.some(d => d.width >= 0.9));
    if (hasAccessibleDoor) {
      passes.push("Part M: Door width ≥900mm for wheelchair access");
    } else if (rooms.length > 0) {
      issues.push("Part M: At least one door should be ≥900mm for wheelchair access");
    }
    
    // Part L - Thermal
    const wall = WALL_TYPES.find(w => w.value === wallType);
    if (wall && wall.uValue <= 0.18) {
      passes.push(`Part L: Wall U-value ${wall.uValue} W/m²K meets requirement (≤0.18)`);
    } else if (wall) {
      issues.push(`Part L: Wall U-value ${wall.uValue} W/m²K exceeds limit (0.18 W/m²K)`);
    }
    
    // Part B - Fire Safety
    const hasSmokeDetector = rooms.some(r => r.electrical.some(e => e.type === "smoke_detector"));
    if (hasSmokeDetector) {
      passes.push("Part B: Smoke detector provision included");
    } else if (rooms.length > 0) {
      issues.push("Part B: Smoke detectors required on each floor level");
    }
    
    // Height check
    if (h >= 2.4) {
      passes.push(`Part K: Ceiling height ${h}m meets minimum (2.4m)`);
    } else {
      issues.push(`Part K: Ceiling height ${h}m below minimum (2.4m required)`);
    }
    
    // Ventilation check
    const totalWindowArea = rooms.reduce((sum, r) => {
      return sum + r.windows.reduce((ws, w) => ws + (w.width * w.height * w.quantity), 0);
    }, 0);
    const requiredVentArea = floorArea * 0.05;
    
    if (totalWindowArea >= requiredVentArea) {
      passes.push(`Part F: Window area ${totalWindowArea.toFixed(2)}m² meets 5% floor area requirement`);
    } else if (rooms.length > 0) {
      issues.push(`Part F: Window area ${totalWindowArea.toFixed(2)}m² below 5% of floor area (${requiredVentArea.toFixed(2)}m² required)`);
    }
    
    // Electrical circuits
    const totalSockets = rooms.reduce((sum, r) => {
      return sum + r.electrical.filter(e => e.type.includes("socket")).reduce((s, e) => s + e.quantity, 0);
    }, 0);
    if (totalSockets > 0) {
      passes.push(`Part P: ${totalSockets} socket outlets specified - BS 7671 compliance required`);
    }
    
    setBuildingRegsValid({
      valid: issues.length === 0,
      issues,
      passes
    });
  };

  const addRoom = () => {
    const newRoom: RoomConfig = {
      id: `room-${Date.now()}`,
      type: "living_room",
      name: "New Room",
      length: 4,
      width: 3,
      height: parseFloat(height),
      windows: [],
      doors: [{ type: "internal_panel", width: 0.826, height: 2.04, swing: "left" }],
      electrical: [
        { type: "socket_double", quantity: 4 },
        { type: "switch_1g", quantity: 1 },
        { type: "ceiling_rose", quantity: 1 },
      ],
      plumbing: [],
      flooring: "engineered_wood",
      heating: "radiator",
      features: [],
    };
    setRooms([...rooms, newRoom]);
    setActiveRoomId(newRoom.id);
  };

  const updateRoom = (roomId: string, updates: Partial<RoomConfig>) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, ...updates } : r));
  };

  const removeRoom = (roomId: string) => {
    setRooms(rooms.filter(r => r.id !== roomId));
    if (activeRoomId === roomId) setActiveRoomId(null);
  };

  const addWindowToRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoom(roomId, {
        windows: [...room.windows, { type: "casement_double", width: 1.2, height: 1.5, quantity: 1 }]
      });
    }
  };

  const addDoorToRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoom(roomId, {
        doors: [...room.doors, { type: "internal_panel", width: 0.826, height: 2.04, swing: "left" }]
      });
    }
  };

  const toggleElectrical = (roomId: string, type: string, checked: boolean) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      if (checked) {
        const existing = room.electrical.find(e => e.type === type);
        if (!existing) {
          updateRoom(roomId, {
            electrical: [...room.electrical, { type, quantity: 1 }]
          });
        }
      } else {
        updateRoom(roomId, {
          electrical: room.electrical.filter(e => e.type !== type)
        });
      }
    }
  };

  const updateElectricalQty = (roomId: string, type: string, quantity: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      updateRoom(roomId, {
        electrical: room.electrical.map(e => e.type === type ? { ...e, quantity } : e)
      });
    }
  };

  const togglePlumbing = (roomId: string, type: string, checked: boolean) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      if (checked) {
        const existing = room.plumbing.find(p => p.type === type);
        if (!existing) {
          updateRoom(roomId, {
            plumbing: [...room.plumbing, { type, quantity: 1 }]
          });
        }
      } else {
        updateRoom(roomId, {
          plumbing: room.plumbing.filter(p => p.type !== type)
        });
      }
    }
  };

  const generateDrawing = async () => {
    setGenerating(true);
    
    try {
      const floorArea = parseFloat(length) * parseFloat(width);
      const geometry = {
        length_m: parseFloat(length),
        width_m: parseFloat(width),
        height_m: parseFloat(height),
        floor_area_sqm: floorArea,
        wall_type: wallType,
        wall_thickness: WALL_TYPES.find(w => w.value === wallType)?.uValue || 0.18,
        roof_type: roofType,
        foundation_type: foundationType,
        foundation_details: FOUNDATION_TYPES.find(f => f.value === foundationType),
        project_type: projectType,
        rooms: rooms.map(r => ({
          ...r,
          floor_area: r.length * r.width,
          roomTypeDetails: ROOM_TYPES.find(rt => rt.id === r.type),
        })),
        windows: rooms.flatMap(r => r.windows.map(w => ({ ...w, room: r.name }))),
        doors: rooms.flatMap(r => r.doors.map(d => ({ ...d, room: r.name }))),
        electrical: rooms.flatMap(r => r.electrical.map(e => ({ ...e, room: r.name }))),
        plumbing: rooms.flatMap(r => r.plumbing.map(p => ({ ...p, room: r.name }))),
        buildingRegs: buildingRegsValid,
        structural: {
          wall_uValue: WALL_TYPES.find(w => w.value === wallType)?.uValue,
          roof_uValue: ROOF_TYPES.find(r => r.value === roofType)?.uValue,
          foundation: FOUNDATION_TYPES.find(f => f.value === foundationType),
          loadBearing: wallType === "cavity" || wallType === "solid",
          steelRequired: parseFloat(length) > 4 || parseFloat(width) > 4,
        }
      };
      
      const response = await supabase.functions.invoke("generate-cad", {
        body: {
          projectId: "standalone-" + Date.now(),
          drawingType,
          geometry,
        },
      });
      
      if (response.error) throw new Error(response.error.message);
      if (response.data?.error) throw new Error(response.data.error);
      
      toast.success(`${drawingType.replace(/_/g, " ")} generated successfully!`);
      setShowGenerator(false);
      fetchData();
    } catch (error: any) {
      console.error("CAD generation error:", error);
      toast.error(error.message || "Failed to generate drawing");
    } finally {
      setGenerating(false);
    }
  };

  const downloadSvg = (drawing: CadDrawing) => {
    if (!drawing.svg_content) return;
    const blob = new Blob([drawing.svg_content], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${drawing.drawing_type}-${drawing.id.slice(0, 8)}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">CAD Drawings</h1>
            <p className="text-muted-foreground">
              Generate detailed architectural drawings with full specifications
            </p>
          </div>
          <Button onClick={() => setShowGenerator(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Generate Drawing
          </Button>
        </div>

        {/* Drawing Generator */}
        {showGenerator && (
          <Card className="mb-6 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Room Configurator</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowGenerator(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dimensions" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="dimensions">Dimensions</TabsTrigger>
                  <TabsTrigger value="rooms">Rooms ({rooms.length})</TabsTrigger>
                  <TabsTrigger value="electrical">Electrical</TabsTrigger>
                  <TabsTrigger value="plumbing">Plumbing</TabsTrigger>
                  <TabsTrigger value="validation">Validation</TabsTrigger>
                </TabsList>
                
                {/* Dimensions Tab */}
                <TabsContent value="dimensions" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Project Type</Label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Drawing Type</Label>
                      <Select value={drawingType} onValueChange={setDrawingType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DRAWING_TYPES.map(t => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    <div>
                      <Label>Length (m)</Label>
                      <Input type="number" step="0.1" value={length} onChange={e => setLength(e.target.value)} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <Label>Width (m)</Label>
                      <Input type="number" step="0.1" value={width} onChange={e => setWidth(e.target.value)} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <Label>Height (m)</Label>
                      <Input type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} className="mt-1 font-mono" />
                    </div>
                    <div>
                      <Label>Wall Type</Label>
                      <Select value={wallType} onValueChange={setWallType}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {WALL_TYPES.map(w => (
                            <SelectItem key={w.value} value={w.value}>
                              {w.label} (U={w.uValue})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Roof Type</Label>
                      <Select value={roofType} onValueChange={setRoofType}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {ROOF_TYPES.map(r => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Foundation</Label>
                      <Select value={foundationType} onValueChange={setFoundationType}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {FOUNDATION_TYPES.map(f => (
                            <SelectItem key={f.value} value={f.value}>
                              {f.label} ({f.depth})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Floor Area:</span>
                      <span className="ml-2 font-mono font-medium">{(parseFloat(length) * parseFloat(width)).toFixed(1)} m²</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volume:</span>
                      <span className="ml-2 font-mono font-medium">{(parseFloat(length) * parseFloat(width) * parseFloat(height)).toFixed(1)} m³</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Wall U-Value:</span>
                      <span className="ml-2 font-mono font-medium">{WALL_TYPES.find(w => w.value === wallType)?.uValue} W/m²K</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Roof U-Value:</span>
                      <span className="ml-2 font-mono font-medium">{ROOF_TYPES.find(r => r.value === roofType)?.uValue} W/m²K</span>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Rooms Tab */}
                <TabsContent value="rooms" className="mt-4">
                  <div className="flex gap-4">
                    {/* Room List */}
                    <div className="w-64 space-y-2">
                      <Button onClick={addRoom} className="w-full" variant="outline">
                        <Plus className="h-4 w-4 mr-2" /> Add Room
                      </Button>
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2 pr-2">
                          {rooms.map(room => (
                            <div
                              key={room.id}
                              onClick={() => setActiveRoomId(room.id)}
                              className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                                activeRoomId === room.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{room.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => { e.stopPropagation(); removeRoom(room.id); }}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {room.length}m × {room.width}m = {(room.length * room.width).toFixed(1)}m²
                              </p>
                              <div className="flex gap-1 mt-1">
                                {room.windows.length > 0 && <Badge variant="outline" className="text-xs">{room.windows.reduce((s,w) => s+w.quantity, 0)} win</Badge>}
                                {room.doors.length > 0 && <Badge variant="outline" className="text-xs">{room.doors.length} door</Badge>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    
                    {/* Room Editor */}
                    {activeRoom ? (
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Label>Room Type</Label>
                            <Select value={activeRoom.type} onValueChange={v => updateRoom(activeRoom.id, { type: v })}>
                              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {ROOM_TYPES.map(rt => (
                                  <SelectItem key={rt.id} value={rt.id}>{rt.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Room Name</Label>
                            <Input value={activeRoom.name} onChange={e => updateRoom(activeRoom.id, { name: e.target.value })} className="mt-1" />
                          </div>
                          <div>
                            <Label>Length (m)</Label>
                            <Input type="number" step="0.1" value={activeRoom.length} onChange={e => updateRoom(activeRoom.id, { length: parseFloat(e.target.value) || 0 })} className="mt-1 font-mono" />
                          </div>
                          <div>
                            <Label>Width (m)</Label>
                            <Input type="number" step="0.1" value={activeRoom.width} onChange={e => updateRoom(activeRoom.id, { width: parseFloat(e.target.value) || 0 })} className="mt-1 font-mono" />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Flooring</Label>
                            <Select value={activeRoom.flooring} onValueChange={v => updateRoom(activeRoom.id, { flooring: v })}>
                              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {FLOORING_TYPES.map(f => (
                                  <SelectItem key={f.id} value={f.id}>{f.name} (£{f.costPerSqm}/m²)</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Heating</Label>
                            <Select value={activeRoom.heating} onValueChange={v => updateRoom(activeRoom.id, { heating: v })}>
                              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {HEATING_SYSTEMS.map(h => (
                                  <SelectItem key={h.id} value={h.id}>{h.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        {/* Windows */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="flex items-center gap-2"><Square className="h-4 w-4" /> Windows</Label>
                            <Button size="sm" variant="outline" onClick={() => addWindowToRoom(activeRoom.id)}>
                              <Plus className="h-3 w-3 mr-1" /> Add Window
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {activeRoom.windows.map((win, idx) => (
                              <div key={idx} className="grid grid-cols-5 gap-2 items-end">
                                <div>
                                  <Label className="text-xs">Type</Label>
                                  <Select value={win.type} onValueChange={v => {
                                    const newWindows = [...activeRoom.windows];
                                    newWindows[idx] = { ...win, type: v };
                                    updateRoom(activeRoom.id, { windows: newWindows });
                                  }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {WINDOW_TYPES.map(wt => (
                                        <SelectItem key={wt.id} value={wt.id}>{wt.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">Width (m)</Label>
                                  <Input type="number" step="0.1" value={win.width} className="font-mono" onChange={e => {
                                    const newWindows = [...activeRoom.windows];
                                    newWindows[idx] = { ...win, width: parseFloat(e.target.value) || 0 };
                                    updateRoom(activeRoom.id, { windows: newWindows });
                                  }} />
                                </div>
                                <div>
                                  <Label className="text-xs">Height (m)</Label>
                                  <Input type="number" step="0.1" value={win.height} className="font-mono" onChange={e => {
                                    const newWindows = [...activeRoom.windows];
                                    newWindows[idx] = { ...win, height: parseFloat(e.target.value) || 0 };
                                    updateRoom(activeRoom.id, { windows: newWindows });
                                  }} />
                                </div>
                                <div>
                                  <Label className="text-xs">Qty</Label>
                                  <Input type="number" min="1" value={win.quantity} className="font-mono" onChange={e => {
                                    const newWindows = [...activeRoom.windows];
                                    newWindows[idx] = { ...win, quantity: parseInt(e.target.value) || 1 };
                                    updateRoom(activeRoom.id, { windows: newWindows });
                                  }} />
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  updateRoom(activeRoom.id, { windows: activeRoom.windows.filter((_, i) => i !== idx) });
                                }}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Doors */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="flex items-center gap-2"><DoorOpen className="h-4 w-4" /> Doors</Label>
                            <Button size="sm" variant="outline" onClick={() => addDoorToRoom(activeRoom.id)}>
                              <Plus className="h-3 w-3 mr-1" /> Add Door
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {activeRoom.doors.map((door, idx) => (
                              <div key={idx} className="grid grid-cols-5 gap-2 items-end">
                                <div>
                                  <Label className="text-xs">Type</Label>
                                  <Select value={door.type} onValueChange={v => {
                                    const newDoors = [...activeRoom.doors];
                                    newDoors[idx] = { ...door, type: v };
                                    updateRoom(activeRoom.id, { doors: newDoors });
                                  }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {DOOR_TYPES.map(dt => (
                                        <SelectItem key={dt.id} value={dt.id}>{dt.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">Width (m)</Label>
                                  <Input type="number" step="0.01" value={door.width} className="font-mono" onChange={e => {
                                    const newDoors = [...activeRoom.doors];
                                    newDoors[idx] = { ...door, width: parseFloat(e.target.value) || 0 };
                                    updateRoom(activeRoom.id, { doors: newDoors });
                                  }} />
                                </div>
                                <div>
                                  <Label className="text-xs">Height (m)</Label>
                                  <Input type="number" step="0.01" value={door.height} className="font-mono" onChange={e => {
                                    const newDoors = [...activeRoom.doors];
                                    newDoors[idx] = { ...door, height: parseFloat(e.target.value) || 0 };
                                    updateRoom(activeRoom.id, { doors: newDoors });
                                  }} />
                                </div>
                                <div>
                                  <Label className="text-xs">Swing</Label>
                                  <Select value={door.swing} onValueChange={v => {
                                    const newDoors = [...activeRoom.doors];
                                    newDoors[idx] = { ...door, swing: v };
                                    updateRoom(activeRoom.id, { doors: newDoors });
                                  }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                      <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => {
                                  updateRoom(activeRoom.id, { doors: activeRoom.doors.filter((_, i) => i !== idx) });
                                }}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>Add a room to configure details</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Electrical Tab */}
                <TabsContent value="electrical" className="mt-4">
                  {activeRoom ? (
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4 text-warning" />
                        Electrical Points for: {activeRoom.name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {ELECTRICAL_POINTS.map(ep => {
                          const existing = activeRoom.electrical.find(e => e.type === ep.id);
                          return (
                            <div key={ep.id} className="p-3 border rounded-lg space-y-2">
                              <div className="flex items-start gap-2">
                                <Checkbox
                                  checked={!!existing}
                                  onCheckedChange={(checked) => toggleElectrical(activeRoom.id, ep.id, checked as boolean)}
                                />
                                <div className="flex-1">
                                  <Label className="text-sm font-medium">{ep.name}</Label>
                                  <p className="text-xs text-muted-foreground">{ep.symbol}</p>
                                </div>
                              </div>
                              {existing && (
                                <div>
                                  <Label className="text-xs">Quantity</Label>
                                  <Input
                                    type="number"
                                    min="1"
                                    value={existing.quantity}
                                    onChange={e => updateElectricalQty(activeRoom.id, ep.id, parseInt(e.target.value) || 1)}
                                    className="h-8 font-mono"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">BS 7671 Requirements:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Socket outlets to be minimum 450mm from floor (Part M)</li>
                          <li>• Light switches at 1200mm height</li>
                          <li>• RCD protection required for all socket circuits</li>
                          <li>• Smoke detectors: mains-powered, interlinked on each floor</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Select a room to configure electrical points
                    </div>
                  )}
                </TabsContent>
                
                {/* Plumbing Tab */}
                <TabsContent value="plumbing" className="mt-4">
                  {activeRoom ? (
                    <div className="space-y-4">
                      <h3 className="font-medium flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-primary" />
                        Plumbing Fixtures for: {activeRoom.name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {PLUMBING_FIXTURES.map(pf => {
                          const existing = activeRoom.plumbing.find(p => p.type === pf.id);
                          return (
                            <div key={pf.id} className="p-3 border rounded-lg">
                              <div className="flex items-start gap-2">
                                <Checkbox
                                  checked={!!existing}
                                  onCheckedChange={(checked) => togglePlumbing(activeRoom.id, pf.id, checked as boolean)}
                                />
                                <div>
                                  <Label className="text-sm font-medium">{pf.name}</Label>
                                  <p className="text-xs text-muted-foreground">{pf.connections}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Part G & Part H Requirements:</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Hot water max temp 48°C at outlets (TMV required)</li>
                          <li>• Waste pipes: minimum 1:40 fall</li>
                          <li>• Soil stack connection for WC</li>
                          <li>• 110mm soil pipe for WC, 40mm for basin/bath</li>
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Select a room to configure plumbing fixtures
                    </div>
                  )}
                </TabsContent>
                
                {/* Validation Tab */}
                <TabsContent value="validation" className="mt-4">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${buildingRegsValid.valid ? "border-success/50 bg-success/5" : "border-warning/50 bg-warning/5"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {buildingRegsValid.valid ? (
                          <CheckCircle className="h-5 w-5 text-success" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-warning" />
                        )}
                        <span className="font-medium">
                          Building Regulations Compliance: {buildingRegsValid.valid ? "All Checks Passed" : `${buildingRegsValid.issues.length} Issues`}
                        </span>
                      </div>
                    </div>
                    
                    {buildingRegsValid.passes.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-success" /> Passed Checks
                        </h4>
                        <div className="space-y-1">
                          {buildingRegsValid.passes.map((pass, idx) => (
                            <div key={idx} className="text-sm p-2 bg-success/10 rounded text-success-foreground">
                              {pass}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {buildingRegsValid.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning" /> Issues to Address
                        </h4>
                        <div className="space-y-1">
                          {buildingRegsValid.issues.map((issue, idx) => (
                            <div key={idx} className="text-sm p-2 bg-warning/10 rounded text-warning-foreground">
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="structural">
                        <AccordionTrigger>Structural Calculations</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-muted/50 rounded">
                                <p className="text-muted-foreground">Foundation Type</p>
                                <p className="font-medium">{FOUNDATION_TYPES.find(f => f.value === foundationType)?.label}</p>
                                <p className="text-xs text-muted-foreground">Depth: {FOUNDATION_TYPES.find(f => f.value === foundationType)?.depth}</p>
                              </div>
                              <div className="p-3 bg-muted/50 rounded">
                                <p className="text-muted-foreground">Roof Load</p>
                                <p className="font-medium">1.5 kN/m² (typical)</p>
                                <p className="text-xs text-muted-foreground">BS EN 1991-1-1</p>
                              </div>
                              <div className="p-3 bg-muted/50 rounded">
                                <p className="text-muted-foreground">Steel Beam Required</p>
                                <p className="font-medium">{parseFloat(length) > 4 || parseFloat(width) > 4 ? "Yes - span exceeds 4m" : "No - within timber joist span"}</p>
                              </div>
                              <div className="p-3 bg-muted/50 rounded">
                                <p className="text-muted-foreground">Wall Load Bearing</p>
                                <p className="font-medium">{wallType === "cavity" || wallType === "solid" ? "Yes" : "Frame structure"}</p>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowGenerator(false)}>Cancel</Button>
                <Button onClick={generateDrawing} disabled={generating} className="gap-2">
                  {generating ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                  ) : (
                    <><PenTool className="h-4 w-4" /> Generate {DRAWING_TYPES.find(t => t.value === drawingType)?.label}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Drawings Grid */}
        {drawings.length === 0 && !showGenerator ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No drawings yet</h3>
            <p className="text-muted-foreground mb-4">Configure rooms and generate detailed architectural drawings</p>
            <Button onClick={() => setShowGenerator(true)}>
              <Plus className="h-4 w-4 mr-2" /> Create Your First Drawing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drawings.map(drawing => (
              <Card key={drawing.id} className="overflow-hidden hover:border-primary/50 transition-colors">
                <div className="aspect-video bg-muted relative">
                  {drawing.svg_content && (
                    <div
                      className="absolute inset-0 p-2"
                      dangerouslySetInnerHTML={{ __html: drawing.svg_content }}
                    />
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge>{drawing.drawing_type.replace(/_/g, " ")}</Badge>
                    <Badge variant="outline">{drawing.project_type.replace(/_/g, " ")}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Generated {new Date(drawing.created_at || "").toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedDrawing(drawing)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => downloadSvg(drawing)}>
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CAD Preview Modal */}
        <CADPreviewModal
          open={!!selectedDrawing}
          onOpenChange={(open) => !open && setSelectedDrawing(null)}
          svgContent={selectedDrawing?.svg_content || ""}
          drawingType={selectedDrawing?.drawing_type || "floor_plan"}
          drawingId={selectedDrawing?.id}
          dimensions={
            selectedDrawing?.metadata && typeof selectedDrawing.metadata === 'object' 
              ? (selectedDrawing.metadata as any).dimensions 
              : { length: parseFloat(length), width: parseFloat(width), height: parseFloat(height) }
          }
        />
      </div>
    </DashboardLayout>
  );
}
