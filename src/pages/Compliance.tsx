import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Building,
  Flame,
  Thermometer,
  Home,
  Shield,
  FileText,
  Ruler,
} from "lucide-react";
import { Link } from "react-router-dom";

type Project = Tables<"projects">;
type ComplianceReport = Tables<"compliance_reports">;

// Planning & Regulations Reference Data
const PLANNING_REGS = {
  permitted_development: {
    title: "Permitted Development Rights",
    items: [
      { rule: "Single-storey rear extension", limit: "Detached: 4m, Semi/Terraced: 3m depth", ref: "GPDO 2015, Part 1, Class A" },
      { rule: "Two-storey rear extension", limit: "3m max depth, 7m from rear boundary", ref: "Part 1, Class A" },
      { rule: "Side extension", limit: "Single storey only, max half width of original", ref: "Part 1, Class A" },
      { rule: "Maximum height (single storey)", limit: "4m to eaves/ridge", ref: "Part 1, Class A" },
      { rule: "Maximum eaves height (two storey)", limit: "3m if within 2m of boundary", ref: "Part 1, Class A" },
      { rule: "Loft conversions", limit: "40m³ (terraced), 50m³ (semi/detached)", ref: "Part 1, Class B/C" },
      { rule: "Roof extensions", limit: "No higher than existing ridge, not front-facing", ref: "Part 1, Class B" },
      { rule: "Outbuildings", limit: "Max 50% garden coverage, 2.5m if within 2m of boundary", ref: "Part 1, Class E" },
    ]
  },
  building_regs: {
    title: "Building Regulations 2010 (as amended 2026)",
    parts: [
      { part: "Part A", name: "Structure", desc: "Foundations, walls, floors, roofs — structural integrity and loading" },
      { part: "Part B", name: "Fire Safety", desc: "Fire detection, escape routes, fire resistance, spread of flame" },
      { part: "Part C", name: "Site Preparation", desc: "Damp-proofing, contamination, subsoil drainage" },
      { part: "Part D", name: "Toxic Substances", desc: "Cavity insulation materials" },
      { part: "Part E", name: "Sound Insulation", desc: "Airborne and impact sound between dwellings" },
      { part: "Part F", name: "Ventilation", desc: "Background, purge, and extract ventilation rates" },
      { part: "Part G", name: "Sanitation", desc: "Hot/cold water supply, bathrooms, drainage" },
      { part: "Part H", name: "Drainage", desc: "Foul and surface water drainage" },
      { part: "Part J", name: "Combustion Appliances", desc: "Flues, hearths, CO provision" },
      { part: "Part K", name: "Protection from Falling", desc: "Stairs, ramps, guards, barriers (min 900mm)" },
      { part: "Part L", name: "Conservation of Energy", desc: "U-values, air tightness, SAP/EPC calculations — 2025 uplift" },
      { part: "Part M", name: "Access & Use", desc: "Level access, WC provision, Part M4(2) for new dwellings" },
      { part: "Part O", name: "Overheating", desc: "Glazing limits, cross-ventilation, solar shading" },
      { part: "Part P", name: "Electrical Safety", desc: "Notifiable electrical work in dwellings" },
      { part: "Part Q", name: "Security", desc: "Doorsets and windows — PAS 24:2022 standard" },
      { part: "Part R", name: "Infrastructure", desc: "Broadband infrastructure in new buildings" },
      { part: "Part S", name: "EV Charging", desc: "EV charge point infrastructure — mandatory 2026" },
    ]
  },
  u_values: {
    title: "2025 Part L U-Value Requirements (W/m²K)",
    values: [
      { element: "External Walls (new)", target: "0.18", notional: "0.18" },
      { element: "External Walls (extension)", target: "0.28", notional: "0.18" },
      { element: "Floor (new)", target: "0.13", notional: "0.13" },
      { element: "Floor (extension)", target: "0.22", notional: "0.13" },
      { element: "Roof (new)", target: "0.11", notional: "0.11" },
      { element: "Roof (extension)", target: "0.16", notional: "0.11" },
      { element: "Windows", target: "1.4", notional: "1.2" },
      { element: "Doors", target: "1.4", notional: "1.0" },
      { element: "Rooflights", target: "1.7", notional: "1.7" },
    ]
  },
  hmo: {
    title: "HMO Licensing (2026 Rules)",
    rules: [
      { type: "Mandatory", criteria: "5+ occupants from 2+ households (NO storey requirement)", action: "Apply to local authority — £500-£1,500 typically" },
      { type: "Additional", criteria: "3-4 occupants from 2+ households (varies by council — check e.g. Brent, Newham)", action: "Apply to local authority — check council website" },
      { type: "Selective", criteria: "All rented properties in designated areas", action: "Apply within licensing area — per council designation" },
      { type: "Room Sizes", criteria: "Single: 6.51m² min, Double: 10.22m², Kitchen shared 5+: 10m²+", action: "Measure all bedrooms and shared spaces" },
      { type: "Fire Safety", criteria: "LD2 grade fire alarm, fire doors, escape routes", action: "Engage fire risk assessor, install compliant system" },
      { type: "Amenities", criteria: "1 bathroom per 5 occupants, adequate kitchen facilities", action: "Count occupants vs facilities ratio" },
    ]
  },
  epc: {
    title: "EPC & Energy Compliance",
    items: [
      { rule: "EPC required", detail: "Before marketing for sale or rent", ref: "MEES 2018/2025" },
      { rule: "Minimum Band E", detail: "Required for all tenancies (current)", ref: "MEES 2018" },
      { rule: "Minimum Band C", detail: "New tenancies from April 2028 (proposed)", ref: "MEES consultation" },
      { rule: "SAP Calculation", detail: "Required for new builds and conversions", ref: "Part L 2025" },
      { rule: "Part S EV", detail: "EV charge point required for new dwellings", ref: "Building Regs Part S" },
      { rule: "Air Tightness", detail: "Max 8m³/h/m² for new builds; test required", ref: "Part L 2025" },
    ]
  }
};

export default function Compliance() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    if (!user) return;

    const [projectsRes, reportsRes] = await Promise.all([
      supabase.from("projects").select("*"),
      supabase.from("compliance_reports").select("*").order("created_at", { ascending: false }),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (reportsRes.data) setReports(reportsRes.data);
    setLoading(false);
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

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

  const reportsByProject = reports.reduce((acc, report) => {
    if (!acc[report.project_id]) acc[report.project_id] = [];
    acc[report.project_id].push(report);
    return acc;
  }, {} as Record<string, ComplianceReport[]>);

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
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6" />
              Compliance & Planning
            </h1>
            <p className="text-sm text-muted-foreground">
              UK Building Regulations, planning rules, HMO, EPC, and project compliance
            </p>
          </div>
        </div>

        <Tabs defaultValue="reports">
          <ScrollArea className="w-full">
            <TabsList className="w-full h-auto flex flex-nowrap justify-start gap-1 mb-4">
              <TabsTrigger value="reports" className="flex-shrink-0">Project Reports</TabsTrigger>
              <TabsTrigger value="planning" className="flex-shrink-0">Planning Helper</TabsTrigger>
              <TabsTrigger value="building-regs" className="flex-shrink-0">Building Regs</TabsTrigger>
              <TabsTrigger value="u-values" className="flex-shrink-0">Part L / U-Values</TabsTrigger>
              <TabsTrigger value="hmo" className="flex-shrink-0">HMO Licensing</TabsTrigger>
              <TabsTrigger value="epc" className="flex-shrink-0">EPC & Energy</TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Project Reports Tab */}
          <TabsContent value="reports">
            {Object.keys(reportsByProject).length === 0 ? (
              <div className="glass-card p-12 rounded-xl text-center">
                <ClipboardCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No compliance reports</h3>
                <p className="text-muted-foreground mb-4">
                  Run compliance checks from your project details page.
                </p>
                <Button asChild>
                  <Link to="/dashboard/projects">View Projects</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(reportsByProject).map(([projectId, projectReports]) => {
                  const passCount = projectReports.filter((r) => r.status === "pass").length;
                  const warnCount = projectReports.filter((r) => r.status === "warning").length;
                  const failCount = projectReports.filter((r) => r.status === "fail").length;
                  const totalChecks = projectReports.filter((r) => r.status !== "info").length;
                  const score = totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 100;

                  return (
                    <div key={projectId} className="glass-card p-6 rounded-xl">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Link to={`/dashboard/projects/${projectId}`} className="text-lg font-semibold hover:text-primary transition-colors">
                            {getProjectName(projectId)}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            Last checked: {new Date(projectReports[0]?.created_at || "").toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="stat-number text-2xl">{score}%</div>
                          <p className="text-xs text-muted-foreground">Compliance Score</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-2 rounded-lg bg-secondary/30">
                          <p className="text-lg font-bold">{projectReports.length}</p>
                          <p className="text-xs text-muted-foreground">Total</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-success/10">
                          <p className="text-lg font-bold text-success">{passCount}</p>
                          <p className="text-xs text-muted-foreground">Passed</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-warning/10">
                          <p className="text-lg font-bold text-warning">{warnCount}</p>
                          <p className="text-xs text-muted-foreground">Warnings</p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-destructive/10">
                          <p className="text-lg font-bold text-destructive">{failCount}</p>
                          <p className="text-xs text-muted-foreground">Failed</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {projectReports
                          .filter((r) => r.status === "fail" || r.status === "warning")
                          .slice(0, 3)
                          .map((report) => (
                            <div key={report.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20">
                              {getStatusIcon(report.status || "info")}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{report.check_name}</p>
                                <p className="text-xs text-muted-foreground">{report.regulation}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Planning Helper Tab */}
          <TabsContent value="planning">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {PLANNING_REGS.permitted_development.title}
                  </CardTitle>
                  <CardDescription>
                    Quick reference for householder permitted development rights under the GPDO 2015 (as amended).
                    Always check with your local planning authority for Article 4 directions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {PLANNING_REGS.permitted_development.items.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg bg-secondary/30 flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.rule}</p>
                          <p className="text-sm text-muted-foreground">{item.limit}</p>
                        </div>
                        <Badge variant="outline" className="text-xs w-fit">{item.ref}</Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/30">
                    <p className="text-sm"><strong>Important:</strong> PD rights do not apply in Conservation Areas, AONBs, Listed Buildings, or where Article 4 directions are in place. Always verify with your LPA.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Building Regs Tab */}
          <TabsContent value="building-regs">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {PLANNING_REGS.building_regs.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PLANNING_REGS.building_regs.parts.map((part) => (
                      <div key={part.part} className="p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-primary/20 text-primary border-0">{part.part}</Badge>
                          <span className="font-medium text-sm">{part.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{part.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* U-Values Tab */}
          <TabsContent value="u-values">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5" />
                  {PLANNING_REGS.u_values.title}
                </CardTitle>
                <CardDescription>
                  Minimum fabric performance requirements under Part L 2025. Lower values = better insulation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Element</th>
                        <th className="text-right p-2">Limiting U-Value</th>
                        <th className="text-right p-2">Notional (Target)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PLANNING_REGS.u_values.values.map((v, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="p-2">{v.element}</td>
                          <td className="p-2 text-right font-mono">{v.target}</td>
                          <td className="p-2 text-right font-mono text-muted-foreground">{v.notional}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HMO Tab */}
          <TabsContent value="hmo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {PLANNING_REGS.hmo.title}
                </CardTitle>
                <CardDescription>
                  2026-accurate HMO licensing based on occupancy thresholds and household counts. The old "3-storey" rule is obsolete.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PLANNING_REGS.hmo.rules.map((rule, i) => (
                    <div key={i} className="p-4 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={rule.type === "Mandatory" ? "default" : "outline"}>{rule.type}</Badge>
                      </div>
                      <p className="text-sm font-medium">{rule.criteria}</p>
                      <p className="text-xs text-muted-foreground mt-1">→ {rule.action}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                  <p className="text-sm"><strong>Warning:</strong> Operating an unlicensed HMO can result in unlimited fines, rent repayment orders (up to 12 months), and criminal prosecution. Always check your council's specific requirements.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EPC Tab */}
          <TabsContent value="epc">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  {PLANNING_REGS.epc.title}
                </CardTitle>
                <CardDescription>
                  Energy Performance Certificate requirements and Minimum Energy Efficiency Standards (MEES).
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PLANNING_REGS.epc.items.map((item, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30 flex flex-col sm:flex-row sm:items-center gap-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.rule}</p>
                        <p className="text-sm text-muted-foreground">{item.detail}</p>
                      </div>
                      <Badge variant="outline" className="text-xs w-fit">{item.ref}</Badge>
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
}
