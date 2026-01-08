import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
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
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

type Project = Tables<"projects">;
type CadDrawing = Tables<"cad_drawings">;

const DRAWING_TYPES = [
  { value: "floor_plan", label: "Floor Plan" },
  { value: "elevation_front", label: "Front Elevation" },
  { value: "elevation_side", label: "Side Elevation" },
  { value: "section", label: "Building Section" },
  { value: "site_plan", label: "Site Plan" },
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

export default function CAD() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [drawings, setDrawings] = useState<CadDrawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<CadDrawing | null>(null);
  
  // Standalone drawing generator state
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorMode, setGeneratorMode] = useState<"project" | "standalone">("standalone");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [drawingType, setDrawingType] = useState("floor_plan");
  
  // Standalone geometry inputs
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("4");
  const [height, setHeight] = useState("2.4");
  const [wallType, setWallType] = useState("cavity");
  const [roofType, setRoofType] = useState("pitched");
  const [foundationType, setFoundationType] = useState("strip");
  const [projectType, setProjectType] = useState("single_storey_rear");

  useEffect(() => {
    fetchData();
  }, [user]);

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

  const getProjectName = (projectId: string | null) => {
    if (!projectId) return "Standalone Drawing";
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const generateDrawing = async () => {
    setGenerating(true);
    
    try {
      let geometry: any;
      let projectId: string | null = null;
      
      if (generatorMode === "project" && selectedProject) {
        // Fetch geometry from project
        const { data: geoData } = await supabase
          .from("project_geometry")
          .select("*")
          .eq("project_id", selectedProject)
          .single();
          
        const project = projects.find(p => p.id === selectedProject);
        
        if (!geoData) {
          toast.error("No geometry found for this project");
          return;
        }
        
        geometry = {
          ...geoData,
          project_type: project?.project_type || "single_storey_rear",
        };
        projectId = selectedProject;
      } else {
        // Use standalone inputs
        const floorArea = parseFloat(length) * parseFloat(width);
        geometry = {
          length_m: parseFloat(length),
          width_m: parseFloat(width),
          height_m: parseFloat(height),
          floor_area_sqm: floorArea,
          wall_type: wallType,
          roof_type: roofType,
          foundation_type: foundationType,
          project_type: projectType,
          windows: [{ width: 1.2, height: 1.5, type: "double", frame: "upvc" }],
          doors: [{ width: 0.9, height: 2.1, type: "external" }],
          rooms: [{ name: "Main Space", length: parseFloat(length), width: parseFloat(width), height: parseFloat(height) }],
        };
      }
      
      const response = await supabase.functions.invoke("generate-cad", {
        body: {
          projectId: projectId || "standalone-" + Date.now(),
          drawingType,
          geometry,
        },
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to generate drawing");
      }
      
      if (response.data?.error) {
        throw new Error(response.data.error);
      }
      
      toast.success(`${drawingType.replace(/_/g, " ")} generated successfully!`);
      setShowGenerator(false);
      fetchData(); // Refresh drawings list
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
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">CAD Drawings</h1>
            <p className="text-muted-foreground">
              Generate technical drawings independently or from project data
            </p>
          </div>
          <Button onClick={() => setShowGenerator(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Generate Drawing
          </Button>
        </div>

        {/* Drawing Generator Panel */}
        {showGenerator && (
          <div className="glass-card p-6 rounded-xl mb-8 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Generate New Drawing</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowGenerator(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Mode Selection */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setGeneratorMode("standalone")}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  generatorMode === "standalone" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <FileText className="h-6 w-6 mb-2 mx-auto text-primary" />
                <div className="font-medium">Standalone Drawing</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter dimensions directly - no project required
                </p>
              </button>
              <button
                onClick={() => setGeneratorMode("project")}
                className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                  generatorMode === "project" 
                    ? "border-primary bg-primary/10" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <PenTool className="h-6 w-6 mb-2 mx-auto text-primary" />
                <div className="font-medium">From Project</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use existing project geometry data
                </p>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Source Selection */}
              <div className="space-y-4">
                {generatorMode === "project" ? (
                  <div>
                    <Label>Select Project</Label>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose a project..." />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div>
                      <Label>Project Type</Label>
                      <Select value={projectType} onValueChange={setProjectType}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROJECT_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
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
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label>Wall Type</Label>
                        <Select value={wallType} onValueChange={setWallType}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cavity">Cavity</SelectItem>
                            <SelectItem value="solid">Solid</SelectItem>
                            <SelectItem value="timber_frame">Timber Frame</SelectItem>
                            <SelectItem value="sips">SIPs</SelectItem>
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
                            <SelectItem value="mono_pitch">Mono-Pitch</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Foundation</Label>
                        <Select value={foundationType} onValueChange={setFoundationType}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="strip">Strip</SelectItem>
                            <SelectItem value="trench">Trench Fill</SelectItem>
                            <SelectItem value="raft">Raft</SelectItem>
                            <SelectItem value="piled">Piled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Right Column - Drawing Type */}
              <div className="space-y-4">
                <div>
                  <Label>Drawing Type</Label>
                  <Select value={drawingType} onValueChange={setDrawingType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DRAWING_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {generatorMode === "standalone" && (
                  <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                    <div className="text-sm font-medium">Preview Dimensions</div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Floor Area: <span className="font-mono text-primary">{(parseFloat(length) * parseFloat(width)).toFixed(1)} m²</span></div>
                      <div>Volume: <span className="font-mono text-primary">{(parseFloat(length) * parseFloat(width) * parseFloat(height)).toFixed(1)} m³</span></div>
                    </div>
                  </div>
                )}
                
                <Button
                  onClick={generateDrawing}
                  disabled={generating || (generatorMode === "project" && !selectedProject)}
                  className="w-full gap-2"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <PenTool className="h-4 w-4" />
                      Generate {DRAWING_TYPES.find(t => t.value === drawingType)?.label}
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  Drawings are generated following BS 1192 CAD standards with UK Building Regulations compliance.
                </p>
              </div>
            </div>
          </div>
        )}

        {drawings.length === 0 && !showGenerator ? (
          <div className="glass-card p-12 rounded-xl text-center">
            <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No drawings yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate CAD drawings using the button above - no project required.
            </p>
            <Button onClick={() => setShowGenerator(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate Your First Drawing
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                className="glass-card p-4 rounded-xl hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium capitalize">
                      {drawing.drawing_type.replace(/_/g, " ")}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {getProjectName(drawing.project_id)}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedDrawing(drawing)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => downloadSvg(drawing)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div
                  className="bg-secondary/30 rounded-lg p-4 aspect-video flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={() => setSelectedDrawing(drawing)}
                  dangerouslySetInnerHTML={{ __html: drawing.svg_content || "" }}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(drawing.created_at!).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Drawing Modal */}
      {selectedDrawing && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedDrawing(null)}
        >
          <div
            className="bg-card max-w-4xl w-full max-h-[90vh] overflow-auto rounded-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold capitalize">
                  {selectedDrawing.drawing_type.replace(/_/g, " ")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {getProjectName(selectedDrawing.project_id)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => downloadSvg(selectedDrawing)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download SVG
                </Button>
                <Button variant="ghost" onClick={() => setSelectedDrawing(null)}>
                  Close
                </Button>
              </div>
            </div>
            <div
              className="bg-white rounded-lg p-4"
              dangerouslySetInnerHTML={{ __html: selectedDrawing.svg_content || "" }}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
