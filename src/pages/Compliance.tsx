import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import {
  ClipboardCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";

type Project = Tables<"projects">;
type ComplianceReport = Tables<"compliance_reports">;

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

  // Group reports by project
  const reportsByProject = reports.reduce((acc, report) => {
    if (!acc[report.project_id]) {
      acc[report.project_id] = [];
    }
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
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Compliance Reports</h1>
            <p className="text-muted-foreground">
              UK Building Regulations compliance status for all projects
            </p>
          </div>
        </div>

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
                      <Link
                        to={`/dashboard/projects/${projectId}`}
                        className="text-lg font-semibold hover:text-primary transition-colors"
                      >
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
                        <div
                          key={report.id}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20"
                        >
                          {getStatusIcon(report.status || "info")}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{report.check_name}</p>
                            <p className="text-xs text-muted-foreground">{report.regulation}</p>
                          </div>
                        </div>
                      ))}
                    {projectReports.filter((r) => r.status === "fail" || r.status === "warning")
                      .length > 3 && (
                      <Link
                        to={`/dashboard/projects/${projectId}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View all issues →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
