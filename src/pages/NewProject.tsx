import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Home,
  Building2,
  Warehouse,
  Users,
  Ruler,
  DoorOpen,
  Lightbulb,
  Droplets,
  Thermometer,
  Plus,
  Trash2,
  Bed,
  Bath,
  UtensilsCrossed,
  Sofa,
} from "lucide-react";
import {
  MATERIALS_2026,
  LABOUR_RATES_2026,
  PLANT_RATES_2026,
  REGIONAL_MULTIPLIERS,
  calculateBricksRequired,
  calculateBlocksRequired,
  calculateFoundationConcrete,
} from "@/lib/construction-rates";

type ProjectType =
  | "single_storey_rear" | "single_storey_side" | "double_storey_rear" | "double_storey_side" | "wrap_around"
  | "loft_dormer" | "loft_hip_to_gable" | "loft_mansard" | "loft_velux"
  | "hmo_conversion" | "garage_integral" | "garage_detached" | "basement_conversion"
  | "new_build" | "renovation" | "office_conversion";

type BuildQuality = "basic" | "standard" | "premium" | "luxury";
type RoomType = "bedroom" | "bathroom" | "ensuite" | "kitchen" | "living" | "utility" | "office" | "wc";

interface Room {
  id: string;
  type: RoomType;
  name: string;
  length: number;
  width: number;
  height: number;
}

interface WindowSpec {
  width: number;
  height: number;
  type: "single" | "double" | "triple";
  frame: "upvc" | "aluminium" | "timber";
}

interface DoorSpec {
  width: number;
  height: number;
  type: "internal" | "external" | "bifold" | "sliding";
}

const PROJECT_CATEGORIES = [
  {
    id: "extension",
    label: "Extensions",
    icon: Home,
    types: [
      { value: "single_storey_rear", label: "Single Storey Rear", baseRate: 2100 },
      { value: "single_storey_side", label: "Single Storey Side", baseRate: 2000 },
      { value: "double_storey_rear", label: "Double Storey Rear", baseRate: 1850 },
      { value: "double_storey_side", label: "Double Storey Side", baseRate: 1800 },
      { value: "wrap_around", label: "Wrap Around", baseRate: 2200 },
    ],
  },
  {
    id: "loft",
    label: "Loft Conversions",
    icon: Building2,
    types: [
      { value: "loft_dormer", label: "Dormer", baseRate: 1400 },
      { value: "loft_hip_to_gable", label: "Hip to Gable", baseRate: 1600 },
      { value: "loft_mansard", label: "Mansard", baseRate: 1800 },
      { value: "loft_velux", label: "Velux / Rooflight", baseRate: 1100 },
    ],
  },
  {
    id: "garage",
    label: "Garage Conversions",
    icon: Warehouse,
    types: [
      { value: "garage_integral", label: "Integral Garage", baseRate: 1100 },
      { value: "garage_detached", label: "Detached Garage", baseRate: 950 },
    ],
  },
  {
    id: "hmo",
    label: "HMO & Conversions",
    icon: Users,
    types: [
      { value: "hmo_conversion", label: "HMO Conversion", baseRate: 1200 },
      { value: "office_conversion", label: "Office to Residential", baseRate: 1300 },
      { value: "basement_conversion", label: "Basement Conversion", baseRate: 2800 },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: Building2,
    types: [
      { value: "new_build", label: "New Build", baseRate: 2000 },
      { value: "renovation", label: "Full Renovation", baseRate: 1500 },
    ],
  },
];

const BUILD_QUALITIES: { value: BuildQuality; label: string; multiplier: number; description: string }[] = [
  { value: "basic", label: "Basic", multiplier: 0.8, description: "Standard materials, minimal finishes" },
  { value: "standard", label: "Standard", multiplier: 1.0, description: "Good quality materials, typical specification" },
  { value: "premium", label: "Premium", multiplier: 1.3, description: "High-end materials, enhanced specification" },
  { value: "luxury", label: "Luxury", multiplier: 1.6, description: "Top-tier materials, bespoke finishes" },
];

const REGIONS = [
  { value: "london", label: "London", multiplier: 1.28 },
  { value: "south_east", label: "South East", multiplier: 1.12 },
  { value: "south_west", label: "South West", multiplier: 1.02 },
  { value: "east_anglia", label: "East Anglia", multiplier: 1.00 },
  { value: "east_midlands", label: "East Midlands", multiplier: 0.96 },
  { value: "west_midlands", label: "West Midlands", multiplier: 0.97 },
  { value: "north_west", label: "North West", multiplier: 0.94 },
  { value: "yorkshire", label: "Yorkshire", multiplier: 0.92 },
  { value: "north_east", label: "North East", multiplier: 0.90 },
  { value: "scotland", label: "Scotland", multiplier: 0.95 },
  { value: "wales", label: "Wales", multiplier: 0.93 },
  { value: "northern_ireland", label: "Northern Ireland", multiplier: 0.88 },
];

const ROOM_TYPES: { value: RoomType; label: string; icon: any; defaultSize: { l: number; w: number } }[] = [
  { value: "bedroom", label: "Bedroom", icon: Bed, defaultSize: { l: 4.0, w: 3.5 } },
  { value: "bathroom", label: "Bathroom", icon: Bath, defaultSize: { l: 2.5, w: 2.0 } },
  { value: "ensuite", label: "En-suite", icon: Bath, defaultSize: { l: 2.0, w: 1.5 } },
  { value: "kitchen", label: "Kitchen", icon: UtensilsCrossed, defaultSize: { l: 4.0, w: 3.0 } },
  { value: "living", label: "Living Room", icon: Sofa, defaultSize: { l: 5.0, w: 4.0 } },
  { value: "utility", label: "Utility", icon: Droplets, defaultSize: { l: 2.5, w: 2.0 } },
  { value: "office", label: "Home Office", icon: Building2, defaultSize: { l: 3.0, w: 2.5 } },
  { value: "wc", label: "WC / Cloakroom", icon: Bath, defaultSize: { l: 1.5, w: 1.0 } },
];

export default function NewProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Project basics - MULTI SELECT
  const [projectName, setProjectName] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Rooms
  const [rooms, setRooms] = useState<Room[]>([
    { id: "1", type: "living", name: "Open Plan Living", length: 5.0, width: 4.0, height: 2.4 },
  ]);
  const [height, setHeight] = useState("2.4");

  // Step 3: Specifications
  const [buildQuality, setBuildQuality] = useState<BuildQuality>("standard");
  const [region, setRegion] = useState("south_east");
  const [wallType, setWallType] = useState("cavity");
  const [roofType, setRoofType] = useState("pitched");
  const [foundationType, setFoundationType] = useState("strip");

  // Step 4: Windows, Doors & Services
  const [windows, setWindows] = useState<WindowSpec[]>([
    { width: 1.2, height: 1.5, type: "double", frame: "upvc" },
  ]);
  const [doors, setDoors] = useState<DoorSpec[]>([
    { width: 0.9, height: 2.1, type: "internal" },
    { width: 0.9, height: 2.1, type: "external" },
  ]);
  const [electricalPoints, setElectricalPoints] = useState("16");
  const [plumbingPoints, setPlumbingPoints] = useState("6");
  const [heatingRadiators, setHeatingRadiators] = useState("4");

  // Toggle project type selection
  const toggleProjectType = (type: ProjectType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Add/remove rooms
  const addRoom = (type: RoomType) => {
    const roomType = ROOM_TYPES.find(r => r.value === type);
    const count = rooms.filter(r => r.type === type).length + 1;
    setRooms([...rooms, {
      id: Date.now().toString(),
      type,
      name: `${roomType?.label} ${count}`,
      length: roomType?.defaultSize.l || 3.0,
      width: roomType?.defaultSize.w || 3.0,
      height: parseFloat(height),
    }]);
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  const updateRoom = (id: string, field: keyof Room, value: any) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  // Calculations
  const totalFloorArea = rooms.reduce((sum, r) => sum + r.length * r.width, 0);
  const totalVolume = rooms.reduce((sum, r) => sum + r.length * r.width * r.height, 0);
  const perimeter = rooms.reduce((sum, r) => sum + 2 * (r.length + r.width), 0);
  const wallArea = perimeter * parseFloat(height);

  // Calculate openings area
  const windowsArea = windows.reduce((sum, w) => sum + w.width * w.height, 0);
  const doorsArea = doors.reduce((sum, d) => sum + d.width * d.height, 0);
  const netWallArea = wallArea - windowsArea - doorsArea;

  // Get base rate from selected types (use highest)
  const getBaseRate = () => {
    if (selectedTypes.length === 0) return 1850;
    const rates = selectedTypes.map(type => {
      for (const cat of PROJECT_CATEGORIES) {
        const found = cat.types.find(t => t.value === type);
        if (found) return found.baseRate;
      }
      return 1850;
    });
    return Math.max(...rates);
  };

  const baseRate = getBaseRate();
  const qualityMultiplier = BUILD_QUALITIES.find(q => q.value === buildQuality)?.multiplier || 1;
  const regionMultiplier = REGIONS.find(r => r.value === region)?.multiplier || 1;

  // Determine if project is internal-only (renovation, HMO, office conversion, garage conversion)
  const isInternalOnly = selectedTypes.every(type => 
    ["renovation", "hmo_conversion", "office_conversion", "garage_integral", "garage_detached"].includes(type)
  );
  
  // Determine if project needs foundations (new builds and extensions need them, conversions don't)
  const needsFoundations = selectedTypes.some(type => 
    ["single_storey_rear", "single_storey_side", "double_storey_rear", "double_storey_side", 
     "wrap_around", "new_build", "basement_conversion"].includes(type)
  );
  
  // Determine if project needs external walls
  const needsExternalWalls = selectedTypes.some(type =>
    ["single_storey_rear", "single_storey_side", "double_storey_rear", "double_storey_side",
     "wrap_around", "new_build"].includes(type)
  );
  
  // Determine if project needs roofing
  const needsRoofing = selectedTypes.some(type =>
    ["single_storey_rear", "single_storey_side", "double_storey_rear", "double_storey_side",
     "wrap_around", "new_build", "loft_dormer", "loft_hip_to_gable", "loft_mansard"].includes(type)
  );

  // Detailed material calculations - only if needed
  const bricksRequired = needsExternalWalls ? calculateBricksRequired(netWallArea, 0) : 0;
  const blocksRequired = needsExternalWalls ? calculateBlocksRequired(netWallArea, 0) : 0;
  const foundationConcrete = needsFoundations ? calculateFoundationConcrete(perimeter, foundationType as any) : 0;
  const floorConcrete = needsFoundations ? totalFloorArea * 0.15 : 0; // 150mm slab only for new floor

  // Material costs (Jan 2026 prices) - adjusted based on project type
  const materialCosts = {
    bricks: bricksRequired * MATERIALS_2026.bricks.facing.rate,
    blocks: blocksRequired * MATERIALS_2026.blocks.aerated.rate,
    concrete: (foundationConcrete + floorConcrete) * MATERIALS_2026.concrete.c25.rate,
    rebar: ((foundationConcrete + floorConcrete) * 80) / 1000 * MATERIALS_2026.rebar.rate, // 80kg/m³
    insulation: needsExternalWalls ? netWallArea * MATERIALS_2026.insulation.pir_100.rate : 0,
    roofing: needsRoofing ? totalFloorArea * (roofType === "flat" ? MATERIALS_2026.roofing.epdm.rate : MATERIALS_2026.roofing.tiles_concrete.rate) : 0,
    plasterboard: netWallArea * 2 * MATERIALS_2026.plasterboard.rate, // Both sides - always needed for finishes
    windows: isInternalOnly ? 0 : windows.reduce((sum, w) => {
      const area = w.width * w.height;
      const rate = MATERIALS_2026.windows[`${w.frame}_${w.type}` as keyof typeof MATERIALS_2026.windows]?.rate ||
        MATERIALS_2026.windows.upvc_double.rate;
      return sum + area * rate;
    }, 0),
    doors: doors.reduce((sum, d) => {
      if (d.type === "bifold") return sum + MATERIALS_2026.doors.bifold_3m.rate;
      if (d.type === "sliding") return sum + MATERIALS_2026.doors.sliding_3m.rate;
      if (d.type === "external") return sum + (isInternalOnly ? 0 : MATERIALS_2026.doors.external_composite.rate);
      return sum + MATERIALS_2026.doors.internal.rate;
    }, 0),
    electrical: parseInt(electricalPoints) * (MATERIALS_2026.electrical.socket.rate + MATERIALS_2026.electrical.cable_twin.rate * 10),
    plumbing: parseInt(plumbingPoints) * 150,
    heating: parseInt(heatingRadiators) * MATERIALS_2026.plumbing.radiator_600x1000.rate,
  };

  // Labour calculations (hours) - adjusted based on project type
  const labourHours = {
    groundwork: needsFoundations ? (foundationConcrete / 2) * 8 : 0, // 2m³ per day
    bricklaying: needsExternalWalls ? (bricksRequired / 450) * 8 : 0,
    blockwork: needsExternalWalls ? (blocksRequired / 80) * 8 : 0,
    carpentry: totalFloorArea * (isInternalOnly ? 0.4 : 0.8), // Less for internal-only
    roofing: needsRoofing ? totalFloorArea * 0.6 : 0,
    plastering: (netWallArea * 2) / 60 * 8, // Always needed
    electrical: parseInt(electricalPoints) * 1.2,
    plumbing: parseInt(plumbingPoints) * 2.5,
    heating: parseInt(heatingRadiators) * 1.5,
    decoration: netWallArea * 0.15,
  };

  const labourCosts = {
    groundwork: labourHours.groundwork * LABOUR_RATES_2026.groundworker.rate,
    bricklaying: labourHours.bricklaying * LABOUR_RATES_2026.bricklayer.rate,
    blockwork: labourHours.blockwork * LABOUR_RATES_2026.bricklayer.rate * 0.5 + labourHours.blockwork * LABOUR_RATES_2026.labourer.rate * 0.5,
    carpentry: labourHours.carpentry * LABOUR_RATES_2026.carpenter_1st.rate,
    roofing: labourHours.roofing * LABOUR_RATES_2026.roofer.rate,
    plastering: labourHours.plastering * LABOUR_RATES_2026.plasterer.rate,
    electrical: labourHours.electrical * LABOUR_RATES_2026.electrician.rate,
    plumbing: labourHours.plumbing * LABOUR_RATES_2026.plumber.rate,
    heating: labourHours.heating * LABOUR_RATES_2026.plumber.rate,
    decoration: labourHours.decoration * LABOUR_RATES_2026.decorator.rate,
  };

  // Plant costs - adjusted based on project type
  const plantCosts = {
    excavator: needsFoundations ? 5 * PLANT_RATES_2026.mini_digger_3t.rate : 0,
    scaffold: needsExternalWalls ? (perimeter * 6) * PLANT_RATES_2026.scaffold.rate : 0, // 6 weeks
    skip: (needsFoundations ? 3 : 1) * PLANT_RATES_2026.skip_8yd.rate, // Less for internal
  };

  // Bathroom/kitchen specific costs
  const bathroomCount = rooms.filter(r => r.type === "bathroom" || r.type === "ensuite").length;
  const wcCount = rooms.filter(r => r.type === "wc").length;
  const kitchenCount = rooms.filter(r => r.type === "kitchen").length;

  const sanitaryCosts = {
    bathrooms: bathroomCount * 2800 * qualityMultiplier,
    wcs: wcCount * 850 * qualityMultiplier,
    kitchens: kitchenCount * 8500 * qualityMultiplier,
  };

  // Totals
  const totalMaterials = Object.values(materialCosts).reduce((a, b) => a + b, 0);
  const totalLabour = Object.values(labourCosts).reduce((a, b) => a + b, 0);
  const totalPlant = Object.values(plantCosts).reduce((a, b) => a + b, 0);
  const totalSanitary = Object.values(sanitaryCosts).reduce((a, b) => a + b, 0);

  const subtotal = totalMaterials + totalLabour + totalPlant + totalSanitary;
  const regionalAdjustment = subtotal * (regionMultiplier - 1);
  const preliminaries = subtotal * 0.12; // 12% preliminaries
  const contingency = subtotal * 0.10; // 10% contingency

  const totalCost = Math.round(subtotal + regionalAdjustment + preliminaries + contingency);
  const totalLabourHours = Object.values(labourHours).reduce((a, b) => a + b, 0);
  const durationWeeks = Math.max(4, Math.ceil(totalLabourHours / 40)); // 40 hrs per week

  const handleSubmit = async () => {
    if (!user || selectedTypes.length === 0) return;

    setLoading(true);

    try {
      // Create project (using first type for DB)
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          project_type: selectedTypes[0],
          address,
          postcode,
          description: `${description}\n\nProject types: ${selectedTypes.join(", ")}`,
          build_quality: buildQuality,
          estimated_cost: totalCost,
          estimated_duration_weeks: durationWeeks,
          status: "draft",
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Create geometry
      const { error: geometryError } = await supabase
        .from("project_geometry")
        .insert({
          project_id: project.id,
          length_m: Math.sqrt(totalFloorArea),
          width_m: Math.sqrt(totalFloorArea),
          height_m: parseFloat(height),
          floor_area_sqm: totalFloorArea,
          wall_type: wallType,
          roof_type: roofType,
          foundation_type: foundationType,
          electrical_points: parseInt(electricalPoints),
          plumbing_points: parseInt(plumbingPoints),
          heating_radiators: parseInt(heatingRadiators),
          windows: windows as any,
          doors: doors as any,
          rooms: rooms as any,
        });

      if (geometryError) throw geometryError;

      toast.success("Project created successfully!");
      navigate(`/dashboard/projects/${project.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">Create New Project</h1>
          <p className="text-muted-foreground">
            Configure your project to generate an instant quote with detailed breakdowns.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {["Project Types", "Rooms", "Specifications", "Services & Quote"].map((label, i) => (
            <div key={i} className="flex items-center">
              <button
                onClick={() => i + 1 < step && setStep(i + 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step === i + 1
                  ? "bg-primary text-primary-foreground"
                  : i + 1 < step
                    ? "bg-success/20 text-success"
                    : "bg-secondary text-muted-foreground"
                  }`}
              >
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-current/20 text-xs">
                  {i + 1}
                </span>
                <span className="hidden md:inline">{label}</span>
              </button>
              {i < 3 && <div className={`w-8 h-0.5 ${i + 1 < step ? "bg-success" : "bg-secondary"}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card p-8 rounded-xl mb-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Project Details & Types
              </h2>
              <p className="text-sm text-muted-foreground">
                Select all applicable project types (e.g., rear extension + loft conversion)
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    placeholder="e.g., Smith Family Extension & Loft"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Select Project Types (Multiple Allowed)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {PROJECT_CATEGORIES.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </div>
                        <div className="space-y-1">
                          {category.types.map((type) => (
                            <label
                              key={type.value}
                              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${selectedTypes.includes(type.value as ProjectType)
                                ? "bg-primary/10 text-primary border border-primary/50"
                                : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                                }`}
                            >
                              <Checkbox
                                checked={selectedTypes.includes(type.value as ProjectType)}
                                onCheckedChange={() => toggleProjectType(type.value as ProjectType)}
                              />
                              <span className="flex-1">{type.label}</span>
                              <span className="text-xs font-mono text-muted-foreground">
                                £{type.baseRate}/m²
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Address</Label>
                    <Input
                      placeholder="123 Main Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Postcode</Label>
                    <Input
                      placeholder="SW1A 1AA"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    placeholder="Additional notes about the project..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Rooms & Dimensions
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <Label>Default Ceiling Height</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-24 font-mono"
                />
                <span className="text-sm text-muted-foreground">metres</span>
              </div>

              {/* Room type selector */}
              <div>
                <Label className="mb-2 block">Add Rooms</Label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_TYPES.map((roomType) => (
                    <Button
                      key={roomType.value}
                      variant="outline"
                      size="sm"
                      onClick={() => addRoom(roomType.value)}
                      className="gap-2"
                    >
                      <roomType.icon className="h-4 w-4" />
                      {roomType.label}
                      <Plus className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rooms list */}
              <div className="space-y-3">
                {rooms.map((room) => {
                  const roomType = ROOM_TYPES.find(r => r.value === room.type);
                  const RoomIcon = roomType?.icon || Sofa;
                  const area = room.length * room.width;

                  return (
                    <div key={room.id} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
                      <RoomIcon className="h-5 w-5 text-primary flex-shrink-0" />
                      <Input
                        value={room.name}
                        onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                        className="w-40"
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          step="0.1"
                          value={room.length}
                          onChange={(e) => updateRoom(room.id, "length", parseFloat(e.target.value))}
                          className="w-20 font-mono"
                        />
                        <span className="text-muted-foreground">×</span>
                        <Input
                          type="number"
                          step="0.1"
                          value={room.width}
                          onChange={(e) => updateRoom(room.id, "width", parseFloat(e.target.value))}
                          className="w-20 font-mono"
                        />
                        <span className="text-muted-foreground">×</span>
                        <Input
                          type="number"
                          step="0.1"
                          value={room.height}
                          onChange={(e) => updateRoom(room.id, "height", parseFloat(e.target.value))}
                          className="w-20 font-mono"
                        />
                      </div>
                      <div className="text-sm font-mono text-muted-foreground w-20">
                        {area.toFixed(1)}m²
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRoom(room.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div>
                  <span className="text-sm text-muted-foreground">Total Floor Area</span>
                  <div className="font-mono text-2xl font-semibold text-primary">{totalFloorArea.toFixed(1)} m²</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                  <div className="font-mono text-2xl font-semibold">{totalVolume.toFixed(1)} m³</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Room Count</span>
                  <div className="font-mono text-2xl font-semibold">{rooms.length}</div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Construction Specifications
              </h2>

              <div>
                <Label>Build Quality</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {BUILD_QUALITIES.map((quality) => (
                    <button
                      key={quality.value}
                      onClick={() => setBuildQuality(quality.value)}
                      className={`p-4 rounded-lg text-left transition-colors ${buildQuality === quality.value
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-secondary/30 border border-border hover:bg-secondary/50"
                        }`}
                    >
                      <div className="font-medium">{quality.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{quality.description}</div>
                      <div className="text-xs font-mono text-primary mt-2">×{quality.multiplier}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label} (×{r.multiplier})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Wall Type</Label>
                  <Select value={wallType} onValueChange={setWallType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cavity">Cavity Wall</SelectItem>
                      <SelectItem value="solid">Solid Wall</SelectItem>
                      <SelectItem value="timber_frame">Timber Frame</SelectItem>
                      <SelectItem value="sips">SIPs</SelectItem>
                      <SelectItem value="icf">ICF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Roof Type</Label>
                  <Select value={roofType} onValueChange={setRoofType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pitched">Pitched</SelectItem>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="mono_pitch">Mono Pitch</SelectItem>
                      <SelectItem value="lantern">Lantern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Foundation Type</Label>
                  <Select value={foundationType} onValueChange={setFoundationType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strip">Strip Foundation</SelectItem>
                      <SelectItem value="trench">Trench Fill</SelectItem>
                      <SelectItem value="raft">Raft Foundation</SelectItem>
                      <SelectItem value="piled">Piled Foundation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Services, Windows & Detailed Quote
              </h2>

              {/* Windows */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DoorOpen className="h-4 w-4" />
                  Windows ({windows.length})
                </h3>
                <div className="space-y-2">
                  {windows.map((window, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Input type="number" step="0.1" value={window.width}
                        onChange={(e) => {
                          const newWindows = [...windows];
                          newWindows[index].width = parseFloat(e.target.value);
                          setWindows(newWindows);
                        }}
                        className="w-20 font-mono" placeholder="W" />
                      <span className="text-muted-foreground">×</span>
                      <Input type="number" step="0.1" value={window.height}
                        onChange={(e) => {
                          const newWindows = [...windows];
                          newWindows[index].height = parseFloat(e.target.value);
                          setWindows(newWindows);
                        }}
                        className="w-20 font-mono" placeholder="H" />
                      <Select value={window.type} onValueChange={(value: any) => {
                        const newWindows = [...windows];
                        newWindows[index].type = value;
                        setWindows(newWindows);
                      }}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="double">Double</SelectItem>
                          <SelectItem value="triple">Triple</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={window.frame} onValueChange={(value: any) => {
                        const newWindows = [...windows];
                        newWindows[index].frame = value;
                        setWindows(newWindows);
                      }}>
                        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="upvc">uPVC</SelectItem>
                          <SelectItem value="aluminium">Aluminium</SelectItem>
                          <SelectItem value="timber">Timber</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => setWindows(windows.filter((_, i) => i !== index))} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setWindows([...windows, { width: 1.2, height: 1.5, type: "double", frame: "upvc" }])}>
                    <Plus className="h-4 w-4 mr-1" /> Add Window
                  </Button>
                </div>
              </div>

              {/* Doors */}
              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DoorOpen className="h-4 w-4" />
                  Doors ({doors.length})
                </h3>
                <div className="space-y-2">
                  {doors.map((door, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Input type="number" step="0.1" value={door.width}
                        onChange={(e) => {
                          const newDoors = [...doors];
                          newDoors[index].width = parseFloat(e.target.value);
                          setDoors(newDoors);
                        }}
                        className="w-20 font-mono" />
                      <span className="text-muted-foreground">×</span>
                      <Input type="number" step="0.1" value={door.height}
                        onChange={(e) => {
                          const newDoors = [...doors];
                          newDoors[index].height = parseFloat(e.target.value);
                          setDoors(newDoors);
                        }}
                        className="w-20 font-mono" />
                      <Select value={door.type} onValueChange={(value: any) => {
                        const newDoors = [...doors];
                        newDoors[index].type = value;
                        setDoors(newDoors);
                      }}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                          <SelectItem value="bifold">Bi-fold</SelectItem>
                          <SelectItem value="sliding">Sliding</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="sm" onClick={() => setDoors(doors.filter((_, i) => i !== index))} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setDoors([...doors, { width: 0.9, height: 2.1, type: "internal" }])}>
                    <Plus className="h-4 w-4 mr-1" /> Add Door
                  </Button>
                </div>
              </div>

              {/* MEP Services */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Electrical Points
                  </Label>
                  <Input type="number" value={electricalPoints} onChange={(e) => setElectricalPoints(e.target.value)} className="mt-1 font-mono" />
                  <p className="text-xs text-muted-foreground mt-1">@ £{(MATERIALS_2026.electrical.socket.rate + 28).toFixed(0)}/point</p>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    Plumbing Points
                  </Label>
                  <Input type="number" value={plumbingPoints} onChange={(e) => setPlumbingPoints(e.target.value)} className="mt-1 font-mono" />
                  <p className="text-xs text-muted-foreground mt-1">@ £150/point</p>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    Radiators
                  </Label>
                  <Input type="number" value={heatingRadiators} onChange={(e) => setHeatingRadiators(e.target.value)} className="mt-1 font-mono" />
                  <p className="text-xs text-muted-foreground mt-1">@ £{MATERIALS_2026.plumbing.radiator_600x1000.rate}/unit</p>
                </div>
              </div>

              {/* Detailed Cost Breakdown */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/30">
                <h3 className="font-semibold mb-4 text-lg">Detailed Cost Breakdown (Jan 2026 Prices)</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Materials */}
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Materials</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bricks ({bricksRequired.toLocaleString()} @ 60/m²)</span>
                        <span className="font-mono">£{Math.round(materialCosts.bricks).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Blocks ({blocksRequired.toLocaleString()})</span>
                        <span className="font-mono">£{Math.round(materialCosts.blocks).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Concrete ({(foundationConcrete + floorConcrete).toFixed(1)}m³)</span>
                        <span className="font-mono">£{Math.round(materialCosts.concrete).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Insulation ({netWallArea.toFixed(0)}m²)</span>
                        <span className="font-mono">£{Math.round(materialCosts.insulation).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Roofing ({totalFloorArea.toFixed(0)}m²)</span>
                        <span className="font-mono">£{Math.round(materialCosts.roofing).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Windows ({windows.length})</span>
                        <span className="font-mono">£{Math.round(materialCosts.windows).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doors ({doors.length})</span>
                        <span className="font-mono">£{Math.round(materialCosts.doors).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Materials</span>
                        <span className="font-mono">£{Math.round(totalMaterials).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Labour */}
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Labour ({Math.round(totalLabourHours)} hours)</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Groundworks ({Math.round(labourHours.groundwork)}h)</span>
                        <span className="font-mono">£{Math.round(labourCosts.groundwork).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bricklaying ({Math.round(labourHours.bricklaying)}h)</span>
                        <span className="font-mono">£{Math.round(labourCosts.bricklaying).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Carpentry ({Math.round(labourHours.carpentry)}h)</span>
                        <span className="font-mono">£{Math.round(labourCosts.carpentry).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Electrical ({Math.round(labourHours.electrical)}h)</span>
                        <span className="font-mono">£{Math.round(labourCosts.electrical).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plumbing ({Math.round(labourHours.plumbing)}h)</span>
                        <span className="font-mono">£{Math.round(labourCosts.plumbing).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Labour</span>
                        <span className="font-mono">£{Math.round(totalLabour).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Plant & Equipment */}
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Plant & Equipment</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mini Excavator (5 days)</span>
                        <span className="font-mono">£{Math.round(plantCosts.excavator).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Scaffold ({perimeter.toFixed(0)}m × 6 wks)</span>
                        <span className="font-mono">£{Math.round(plantCosts.scaffold).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Skip Hire (3×)</span>
                        <span className="font-mono">£{Math.round(plantCosts.skip).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Plant</span>
                        <span className="font-mono">£{Math.round(totalPlant).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Fittings */}
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Sanitary & Kitchen</h4>
                    <div className="space-y-1 text-sm">
                      {bathroomCount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bathrooms ({bathroomCount})</span>
                          <span className="font-mono">£{Math.round(sanitaryCosts.bathrooms).toLocaleString()}</span>
                        </div>
                      )}
                      {wcCount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">WCs ({wcCount})</span>
                          <span className="font-mono">£{Math.round(sanitaryCosts.wcs).toLocaleString()}</span>
                        </div>
                      )}
                      {kitchenCount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Kitchen ({kitchenCount})</span>
                          <span className="font-mono">£{Math.round(sanitaryCosts.kitchens).toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-1 font-medium">
                        <span>Total Fittings</span>
                        <span className="font-mono">£{Math.round(totalSanitary).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 pt-4 border-t border-border/50 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">£{Math.round(subtotal).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Regional Adjustment ({region} ×{regionMultiplier})</span>
                    <span className="font-mono">£{Math.round(regionalAdjustment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Preliminaries (12%)</span>
                    <span className="font-mono">£{Math.round(preliminaries).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contingency (10%)</span>
                    <span className="font-mono">£{Math.round(contingency).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-semibold text-xl">
                    <span>Total Estimate</span>
                    <span className="stat-number">£{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Estimated Duration</span>
                    <span className="font-mono">{durationWeeks} weeks</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Cost per m²</span>
                    <span className="font-mono">£{Math.round(totalCost / totalFloorArea).toLocaleString()}/m²</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This estimate is based on BCIS rates, RICS guidance, and Jan 2026 trade prices.
                Actual costs may vary based on site conditions, access, and specific requirements.
                All outputs require verification by qualified professionals.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 1}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {step < 4 ? (
            <Button onClick={() => setStep(step + 1)} disabled={step === 1 && (!projectName || selectedTypes.length === 0)}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Project
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
