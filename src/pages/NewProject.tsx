import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";

type ProjectType = 
  | "single_storey_rear" | "single_storey_side" | "double_storey_rear" | "double_storey_side" | "wrap_around"
  | "loft_dormer" | "loft_hip_to_gable" | "loft_mansard" | "loft_velux"
  | "hmo_conversion" | "garage_integral" | "garage_detached" | "basement_conversion"
  | "new_build" | "renovation" | "office_conversion";

type BuildQuality = "basic" | "standard" | "premium" | "luxury";

const PROJECT_CATEGORIES = [
  {
    id: "extension",
    label: "Extensions",
    icon: Home,
    types: [
      { value: "single_storey_rear", label: "Single Storey Rear" },
      { value: "single_storey_side", label: "Single Storey Side" },
      { value: "double_storey_rear", label: "Double Storey Rear" },
      { value: "double_storey_side", label: "Double Storey Side" },
      { value: "wrap_around", label: "Wrap Around" },
    ],
  },
  {
    id: "loft",
    label: "Loft Conversions",
    icon: Building2,
    types: [
      { value: "loft_dormer", label: "Dormer" },
      { value: "loft_hip_to_gable", label: "Hip to Gable" },
      { value: "loft_mansard", label: "Mansard" },
      { value: "loft_velux", label: "Velux / Rooflight" },
    ],
  },
  {
    id: "garage",
    label: "Garage Conversions",
    icon: Warehouse,
    types: [
      { value: "garage_integral", label: "Integral Garage" },
      { value: "garage_detached", label: "Detached Garage" },
    ],
  },
  {
    id: "hmo",
    label: "HMO & Conversions",
    icon: Users,
    types: [
      { value: "hmo_conversion", label: "HMO Conversion" },
      { value: "office_conversion", label: "Office to Residential" },
      { value: "basement_conversion", label: "Basement Conversion" },
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: Building2,
    types: [
      { value: "new_build", label: "New Build" },
      { value: "renovation", label: "Full Renovation" },
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
  { value: "london", label: "London", multiplier: 1.25 },
  { value: "south_east", label: "South East", multiplier: 1.10 },
  { value: "south_west", label: "South West", multiplier: 1.00 },
  { value: "midlands", label: "Midlands", multiplier: 0.95 },
  { value: "north", label: "North", multiplier: 0.90 },
  { value: "scotland", label: "Scotland", multiplier: 0.95 },
  { value: "wales", label: "Wales", multiplier: 0.92 },
  { value: "ni", label: "Northern Ireland", multiplier: 0.88 },
];

// Base rates per m² from Housebuilder's Bible / BCIS
const BASE_RATES: Record<string, number> = {
  single_storey_rear: 2100,
  single_storey_side: 2000,
  double_storey_rear: 1850,
  double_storey_side: 1800,
  wrap_around: 2200,
  loft_dormer: 1400,
  loft_hip_to_gable: 1600,
  loft_mansard: 1800,
  loft_velux: 1100,
  hmo_conversion: 1200,
  garage_integral: 1100,
  garage_detached: 950,
  basement_conversion: 2800,
  new_build: 2000,
  renovation: 1500,
  office_conversion: 1300,
};

export default function NewProject() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Project basics
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [description, setDescription] = useState("");

  // Step 2: Dimensions
  const [length, setLength] = useState("4.5");
  const [width, setWidth] = useState("3.5");
  const [height, setHeight] = useState("2.4");

  // Step 3: Specifications
  const [buildQuality, setBuildQuality] = useState<BuildQuality>("standard");
  const [region, setRegion] = useState("south_east");
  const [wallType, setWallType] = useState("cavity");
  const [roofType, setRoofType] = useState("pitched");
  const [foundationType, setFoundationType] = useState("strip");

  // Step 4: Services
  const [electricalPoints, setElectricalPoints] = useState("12");
  const [plumbingPoints, setPlumbingPoints] = useState("4");
  const [heatingRadiators, setHeatingRadiators] = useState("3");
  const [windows, setWindows] = useState<{ width: number; height: number; type: string }[]>([
    { width: 1.2, height: 1.5, type: "double" },
  ]);
  const [doors, setDoors] = useState<{ width: number; height: number; type: string }[]>([
    { width: 0.9, height: 2.1, type: "internal" },
  ]);

  // Calculations
  const floorArea = parseFloat(length) * parseFloat(width);
  const volume = floorArea * parseFloat(height);
  
  const baseRate = projectType ? BASE_RATES[projectType] || 1850 : 1850;
  const qualityMultiplier = BUILD_QUALITIES.find(q => q.value === buildQuality)?.multiplier || 1;
  const regionMultiplier = REGIONS.find(r => r.value === region)?.multiplier || 1;
  
  const baseCost = floorArea * baseRate * qualityMultiplier * regionMultiplier;
  const electricalCost = parseInt(electricalPoints) * 85;
  const plumbingCost = parseInt(plumbingPoints) * 350;
  const heatingCost = parseInt(heatingRadiators) * 280;
  const windowsCost = windows.reduce((sum, w) => sum + (w.width * w.height * 650), 0);
  const doorsCost = doors.reduce((sum, d) => sum + (d.type === "external" ? 1200 : 450), 0);
  
  const totalCost = Math.round(baseCost + electricalCost + plumbingCost + heatingCost + windowsCost + doorsCost);
  const durationWeeks = Math.max(4, Math.round(floorArea * 0.3));

  const handleAddWindow = () => {
    setWindows([...windows, { width: 1.2, height: 1.5, type: "double" }]);
  };

  const handleAddDoor = () => {
    setDoors([...doors, { width: 0.9, height: 2.1, type: "internal" }]);
  };

  const handleSubmit = async () => {
    if (!user || !projectType) return;
    
    setLoading(true);
    
    try {
      // Create project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName,
          project_type: projectType,
          address,
          postcode,
          description,
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
          length_m: parseFloat(length),
          width_m: parseFloat(width),
          height_m: parseFloat(height),
          floor_area_sqm: floorArea,
          wall_type: wallType,
          roof_type: roofType,
          foundation_type: foundationType,
          electrical_points: parseInt(electricalPoints),
          plumbing_points: parseInt(plumbingPoints),
          heating_radiators: parseInt(heatingRadiators),
          windows: windows,
          doors: doors,
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
      <div className="p-8 max-w-4xl mx-auto">
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
            Enter your project details to generate an instant quote.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => s < step && setStep(s)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  s === step
                    ? "bg-primary text-primary-foreground"
                    : s < step
                    ? "bg-success text-success-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {s}
              </button>
              {s < 4 && (
                <div className={`w-12 h-0.5 ${s < step ? "bg-success" : "bg-secondary"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="glass-card p-8 rounded-xl mb-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Project Details
              </h2>

              <div className="space-y-4">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    placeholder="e.g., Smith Rear Extension"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Project Type</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {PROJECT_CATEGORIES.map((category) => (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <category.icon className="h-4 w-4" />
                          {category.label}
                        </div>
                        <div className="space-y-1">
                          {category.types.map((type) => (
                            <button
                              key={type.value}
                              onClick={() => setProjectType(type.value as ProjectType)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                projectType === type.value
                                  ? "bg-primary/10 text-primary border border-primary/50"
                                  : "bg-secondary/30 hover:bg-secondary/50"
                              }`}
                            >
                              {type.label}
                            </button>
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
                Dimensions
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Length (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label>Width (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label>Height (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30">
                <div>
                  <span className="text-sm text-muted-foreground">Floor Area</span>
                  <div className="font-mono text-2xl font-semibold">{floorArea.toFixed(1)} m²</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Volume</span>
                  <div className="font-mono text-2xl font-semibold">{volume.toFixed(1)} m³</div>
                </div>
              </div>

              <div>
                <Label>Build Quality</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {BUILD_QUALITIES.map((quality) => (
                    <button
                      key={quality.value}
                      onClick={() => setBuildQuality(quality.value)}
                      className={`p-4 rounded-lg text-left transition-colors ${
                        buildQuality === quality.value
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
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Construction Specifications
              </h2>

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

              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DoorOpen className="h-4 w-4" />
                  Windows
                </h3>
                <div className="space-y-2">
                  {windows.map((window, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Input
                        type="number"
                        step="0.1"
                        value={window.width}
                        onChange={(e) => {
                          const newWindows = [...windows];
                          newWindows[index].width = parseFloat(e.target.value);
                          setWindows(newWindows);
                        }}
                        className="w-20 font-mono"
                        placeholder="Width"
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        type="number"
                        step="0.1"
                        value={window.height}
                        onChange={(e) => {
                          const newWindows = [...windows];
                          newWindows[index].height = parseFloat(e.target.value);
                          setWindows(newWindows);
                        }}
                        className="w-20 font-mono"
                        placeholder="Height"
                      />
                      <Select
                        value={window.type}
                        onValueChange={(value) => {
                          const newWindows = [...windows];
                          newWindows[index].type = value;
                          setWindows(newWindows);
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="double">Double Glazed</SelectItem>
                          <SelectItem value="triple">Triple Glazed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setWindows(windows.filter((_, i) => i !== index))}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddWindow}>
                    + Add Window
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <DoorOpen className="h-4 w-4" />
                  Doors
                </h3>
                <div className="space-y-2">
                  {doors.map((door, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                      <Input
                        type="number"
                        step="0.1"
                        value={door.width}
                        onChange={(e) => {
                          const newDoors = [...doors];
                          newDoors[index].width = parseFloat(e.target.value);
                          setDoors(newDoors);
                        }}
                        className="w-20 font-mono"
                        placeholder="Width"
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        type="number"
                        step="0.1"
                        value={door.height}
                        onChange={(e) => {
                          const newDoors = [...doors];
                          newDoors[index].height = parseFloat(e.target.value);
                          setDoors(newDoors);
                        }}
                        className="w-20 font-mono"
                        placeholder="Height"
                      />
                      <Select
                        value={door.type}
                        onValueChange={(value) => {
                          const newDoors = [...doors];
                          newDoors[index].type = value;
                          setDoors(newDoors);
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="internal">Internal</SelectItem>
                          <SelectItem value="external">External</SelectItem>
                          <SelectItem value="bifold">Bi-fold</SelectItem>
                          <SelectItem value="sliding">Sliding</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDoors(doors.filter((_, i) => i !== index))}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleAddDoor}>
                    + Add Door
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                Services & MEP
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Electrical Points
                  </Label>
                  <Input
                    type="number"
                    value={electricalPoints}
                    onChange={(e) => setElectricalPoints(e.target.value)}
                    className="mt-1 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">@ £85/point</p>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    Plumbing Points
                  </Label>
                  <Input
                    type="number"
                    value={plumbingPoints}
                    onChange={(e) => setPlumbingPoints(e.target.value)}
                    className="mt-1 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">@ £350/point</p>
                </div>
                <div>
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-primary" />
                    Radiators
                  </Label>
                  <Input
                    type="number"
                    value={heatingRadiators}
                    onChange={(e) => setHeatingRadiators(e.target.value)}
                    className="mt-1 font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">@ £280/unit</p>
                </div>
              </div>

              {/* Quote Summary */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/30">
                <h3 className="font-semibold mb-4">Quote Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base construction ({floorArea.toFixed(1)}m² × £{baseRate})</span>
                    <span className="font-mono">£{Math.round(floorArea * baseRate).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quality adjustment (×{qualityMultiplier})</span>
                    <span className="font-mono">£{Math.round(floorArea * baseRate * (qualityMultiplier - 1)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Regional adjustment (×{regionMultiplier})</span>
                    <span className="font-mono">£{Math.round(floorArea * baseRate * qualityMultiplier * (regionMultiplier - 1)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Electrical ({electricalPoints} points)</span>
                    <span className="font-mono">£{electricalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plumbing ({plumbingPoints} points)</span>
                    <span className="font-mono">£{plumbingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Heating ({heatingRadiators} radiators)</span>
                    <span className="font-mono">£{heatingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Windows ({windows.length})</span>
                    <span className="font-mono">£{Math.round(windowsCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Doors ({doors.length})</span>
                    <span className="font-mono">£{Math.round(doorsCost).toLocaleString()}</span>
                  </div>
                  <div className="border-t border-border/50 pt-3 flex justify-between font-semibold text-lg">
                    <span>Total Estimate</span>
                    <span className="stat-number">£{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Duration</span>
                    <span className="font-mono">{durationWeeks} weeks</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> This estimate is based on BCIS rates and Housebuilder's Bible guidelines. 
                Actual costs may vary based on site conditions, access, and specific requirements. 
                Please have all quotes verified by a qualified professional.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {step < 4 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && (!projectName || !projectType)}
            >
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
