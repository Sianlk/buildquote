import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { sanitizeSvg } from "@/lib/svg-sanitizer";
import {
  ArrowLeft,
  FileText,
  PenTool,
  ClipboardCheck,
  Calculator,
  Loader2,
  Download,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

type Project = Tables<"projects">;
type ProjectGeometry = Tables<"project_geometry">;
type ComplianceReport = Tables<"compliance_reports">;
type CadDrawing = Tables<"cad_drawings">;

const PROJECT_TYPE_LABELS: Record<string, string> = {
  single_storey_rear: "Single Storey Rear",
  single_storey_side: "Single Storey Side",
  double_storey_rear: "Double Storey Rear",
  double_storey_side: "Double Storey Side",
  wrap_around: "Wrap Around",
  loft_dormer: "Loft Dormer",
  loft_hip_to_gable: "Loft Hip to Gable",
  loft_mansard: "Loft Mansard",
  loft_velux: "Loft Velux",
  hmo_conversion: "HMO Conversion",
  garage_integral: "Integral Garage",
  garage_detached: "Detached Garage",
  basement_conversion: "Basement Conversion",
  new_build: "New Build",
  renovation: "Renovation",
  office_conversion: "Office Conversion",
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [geometry, setGeometry] = useState<ProjectGeometry | null>(null);
  const [compliance, setCompliance] = useState<ComplianceReport[]>([]);
  const [drawings, setDrawings] = useState<CadDrawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingCad, setGeneratingCad] = useState<string | null>(null);
  const [checkingCompliance, setCheckingCompliance] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState<CadDrawing | null>(null);

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  async function fetchProject() {
    const { data: projectData, error: projectError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (projectError || !projectData) {
      toast.error("Project not found");
      navigate("/dashboard/projects");
      return;
    }

    setProject(projectData);

    // Fetch geometry
    const { data: geometryData } = await supabase
      .from("project_geometry")
      .select("*")
      .eq("project_id", id)
      .single();

    if (geometryData) setGeometry(geometryData);

    // Fetch compliance reports
    const { data: complianceData } = await supabase
      .from("compliance_reports")
      .select("*")
      .eq("project_id", id);

    if (complianceData) setCompliance(complianceData);

    // Fetch CAD drawings
    const { data: drawingsData } = await supabase
      .from("cad_drawings")
      .select("*")
      .eq("project_id", id);

    if (drawingsData) setDrawings(drawingsData);

    setLoading(false);
  }

  async function generateCadDrawing(drawingType: string) {
    if (!project || !geometry) {
      toast.error("Project geometry not found");
      return;
    }

    setGeneratingCad(drawingType);

    try {
      const response = await supabase.functions.invoke("generate-cad", {
        body: {
          projectId: project.id,
          drawingType,
          geometry: {
            length_m: geometry.length_m,
            width_m: geometry.width_m,
            height_m: geometry.height_m,
            floor_area_sqm: geometry.floor_area_sqm,
            wall_type: geometry.wall_type,
            roof_type: geometry.roof_type,
            foundation_type: geometry.foundation_type,
            windows: geometry.windows,
            doors: geometry.doors,
            rooms: geometry.rooms,
            project_type: project.project_type,
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success(`${drawingType.replace("_", " ")} generated successfully`);
      fetchProject();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate drawing");
    } finally {
      setGeneratingCad(null);
    }
  }

  async function runComplianceCheck() {
    if (!project || !geometry) {
      toast.error("Project geometry not found");
      return;
    }

    setCheckingCompliance(true);

    try {
      const response = await supabase.functions.invoke("check-compliance", {
        body: {
          projectId: project.id,
          projectType: project.project_type,
          geometry: {
            length_m: geometry.length_m,
            width_m: geometry.width_m,
            height_m: geometry.height_m,
            floor_area_sqm: geometry.floor_area_sqm,
            wall_type: geometry.wall_type,
            roof_type: geometry.roof_type,
            foundation_type: geometry.foundation_type,
            windows: geometry.windows,
            doors: geometry.doors,
            electrical_points: geometry.electrical_points,
          },
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast.success("Compliance check completed");
      fetchProject();
    } catch (error: any) {
      toast.error(error.message || "Failed to run compliance check");
    } finally {
      setCheckingCompliance(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
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

  if (!project) {
    return null;
  }

  // Calculate cost breakdown
  const baseRate = 1850;
  const qualityMultiplier = project.build_quality === "luxury" ? 1.6 : project.build_quality === "premium" ? 1.3 : project.build_quality === "basic" ? 0.8 : 1;
  const floorArea = geometry?.floor_area_sqm || 0;
  const baseCost = floorArea * baseRate * qualityMultiplier;
  const electricalCost = (geometry?.electrical_points || 0) * 85;
  const plumbingCost = (geometry?.plumbing_points || 0) * 350;
  const heatingCost = (geometry?.heating_radiators || 0) * 280;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard/projects")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground">
                {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
                {project.address && ` • ${project.address}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm capitalize">
                {project.status || "Draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
            <TabsTrigger value="cad">CAD Drawings</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Metrics */}
              <div className="glass-card p-6 rounded-xl">
                <h3 className="font-semibold mb-4">Project Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Cost</p>
                    <p className="stat-number text-2xl">
                      £{(project.estimated_cost || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="stat-number text-2xl">
                      {project.estimated_duration_weeks || 0} weeks
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Floor Area</p>
                    <p className="font-mono text-lg">{geometry?.floor_area_sqm || 0} m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Build Quality</p>
                    <p className="capitalize text-lg">{project.build_quality || "Standard"}</p>
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              {geometry && (
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="font-semibold mb-4">Dimensions & Specifications</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Length</p>
                      <p className="font-mono">{geometry.length_m}m</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Width</p>
                      <p className="font-mono">{geometry.width_m}m</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Height</p>
                      <p className="font-mono">{geometry.height_m}m</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Wall Type</p>
                      <p className="capitalize">{geometry.wall_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Roof Type</p>
                      <p className="capitalize">{geometry.roof_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Foundation</p>
                      <p className="capitalize">{geometry.foundation_type}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Services Summary */}
              {geometry && (
                <div className="glass-card p-6 rounded-xl">
                  <h3 className="font-semibold mb-4">MEP Services</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Electrical Points</p>
                      <p className="text-xl font-mono">{geometry.electrical_points || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Plumbing Points</p>
                      <p className="text-xl font-mono">{geometry.plumbing_points || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Radiators</p>
                      <p className="text-xl font-mono">{geometry.heating_radiators || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Compliance Status */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Compliance Status</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runComplianceCheck}
                    disabled={checkingCompliance}
                  >
                    {checkingCompliance ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Run Check
                  </Button>
                </div>
                {compliance.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    No compliance checks run yet. Click "Run Check" to analyze.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {compliance.slice(0, 4).map((check) => (
                      <div
                        key={check.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-secondary/30"
                      >
                        {getStatusIcon(check.status || "info")}
                        <span className="text-sm flex-1">{check.check_name}</span>
                        <span className="text-xs text-muted-foreground">{check.regulation}</span>
                      </div>
                    ))}
                    {compliance.length > 4 && (
                      <p className="text-xs text-muted-foreground">
                        +{compliance.length - 4} more checks
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Cost Breakdown Tab */}
          <TabsContent value="costs">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Detailed Cost Breakdown</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <h4 className="font-medium mb-3">Construction Costs</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base construction ({floorArea}m² × £{baseRate}/m²)</span>
                      <span className="font-mono">£{Math.round(floorArea * baseRate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quality adjustment ({project.build_quality} ×{qualityMultiplier})</span>
                      <span className="font-mono">£{Math.round(baseCost - floorArea * baseRate).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t border-border/50 pt-2 mt-2">
                      <span>Subtotal</span>
                      <span className="font-mono">£{Math.round(baseCost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30">
                  <h4 className="font-medium mb-3">MEP Services</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Electrical ({geometry?.electrical_points || 0} points @ £85)</span>
                      <span className="font-mono">£{electricalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Plumbing ({geometry?.plumbing_points || 0} points @ £350)</span>
                      <span className="font-mono">£{plumbingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Heating ({geometry?.heating_radiators || 0} radiators @ £280)</span>
                      <span className="font-mono">£{heatingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium border-t border-border/50 pt-2 mt-2">
                      <span>Subtotal</span>
                      <span className="font-mono">£{(electricalCost + plumbingCost + heatingCost).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Estimated Cost</span>
                    <span className="stat-number text-3xl">
                      £{(project.estimated_cost || 0).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on BCIS rates and Housebuilder's Bible guidelines. Subject to site survey.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* CAD Drawings Tab */}
          <TabsContent value="cad">
            <div className="space-y-6">
              {/* Generate Buttons */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <PenTool className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Generate CAD Drawings</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  AI-generated technical drawings based on project geometry. BS 1192 compliant.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["floor_plan", "elevation_front", "elevation_side", "section", "site_plan"].map(
                    (type) => (
                      <Button
                        key={type}
                        variant="outline"
                        onClick={() => generateCadDrawing(type)}
                        disabled={generatingCad !== null}
                      >
                        {generatingCad === type ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <PenTool className="h-4 w-4 mr-2" />
                        )}
                        {type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Button>
                    )
                  )}
                </div>
              </div>

              {/* Existing Drawings */}
              {drawings.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {drawings.map((drawing) => (
                    <div
                      key={drawing.id}
                      className="glass-card p-4 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setSelectedDrawing(drawing)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium capitalize">
                          {drawing.drawing_type.replace(/_/g, " ")}
                        </h4>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div
                        className="bg-secondary/30 rounded-lg p-4 aspect-video flex items-center justify-center overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: sanitizeSvg(drawing.svg_content || "") }}
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Generated {new Date(drawing.created_at!).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {drawings.length === 0 && (
                <div className="glass-card p-12 rounded-xl text-center">
                  <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No drawings generated yet</h3>
                  <p className="text-muted-foreground">
                    Click the buttons above to generate CAD drawings for this project.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Building Regulations Compliance</h3>
                </div>
                <Button onClick={runComplianceCheck} disabled={checkingCompliance}>
                  {checkingCompliance ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="h-4 w-4 mr-2" />
                  )}
                  Run Compliance Check
                </Button>
              </div>

              {compliance.length === 0 ? (
                <div className="glass-card p-12 rounded-xl text-center">
                  <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No compliance checks run</h3>
                  <p className="text-muted-foreground mb-4">
                    Run a compliance check to analyze your project against UK Building Regulations.
                  </p>
                  <Button onClick={runComplianceCheck} disabled={checkingCompliance}>
                    Run Check
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="glass-card p-4 rounded-xl">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold">{compliance.length}</p>
                        <p className="text-sm text-muted-foreground">Total Checks</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-success">
                          {compliance.filter((c) => c.status === "pass").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Passed</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-warning">
                          {compliance.filter((c) => c.status === "warning").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Warnings</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-destructive">
                          {compliance.filter((c) => c.status === "fail").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </div>

                  {/* Group by regulation */}
                  {["Part L", "Part B", "Part K", "Part M", "Permitted Development", "AI Advisory"].map(
                    (reg) => {
                      const regChecks = compliance.filter((c) => c.regulation === reg);
                      if (regChecks.length === 0) return null;

                      return (
                        <div key={reg} className="glass-card p-6 rounded-xl">
                          <h4 className="font-semibold mb-4">{reg}</h4>
                          <div className="space-y-3">
                            {regChecks.map((check) => (
                              <div
                                key={check.id}
                                className="p-4 rounded-lg bg-secondary/30"
                              >
                                <div className="flex items-start gap-3">
                                  {getStatusIcon(check.status || "info")}
                                  <div className="flex-1">
                                    <p className="font-medium">{check.check_name}</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {check.details}
                                    </p>
                                    {check.ai_explanation && (
                                      <div className="mt-3 p-3 rounded bg-primary/5 border border-primary/20">
                                        <p className="text-xs font-medium text-primary mb-1">
                                          AI Guidance
                                        </p>
                                        <p className="text-sm whitespace-pre-line">
                                          {check.ai_explanation}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
              <h3 className="font-semibold capitalize">
                {selectedDrawing.drawing_type.replace(/_/g, " ")}
              </h3>
              <Button variant="ghost" onClick={() => setSelectedDrawing(null)}>
                Close
              </Button>
            </div>
            <div
              className="bg-white rounded-lg p-4"
              dangerouslySetInnerHTML={{ __html: sanitizeSvg(selectedDrawing.svg_content || "") }}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
