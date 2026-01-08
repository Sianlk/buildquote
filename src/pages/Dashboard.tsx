import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  Plus,
  FolderOpen,
  Calculator,
  Clock,
  TrendingUp,
  FileText,
  ArrowRight,
  Building2,
  Home,
  PenTool,
} from "lucide-react";

type Project = Tables<"projects">;

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

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  quoted: "bg-success/10 text-success",
  approved: "bg-success/20 text-success",
  completed: "bg-success/30 text-success",
  archived: "bg-muted/50 text-muted-foreground",
};

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      if (!user) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(6);

      if (!error && data) {
        setProjects(data);
      }
      setLoading(false);
    }

    fetchProjects();
  }, [user]);

  const stats = [
    {
      label: "Total Projects",
      value: projects.length.toString(),
      icon: FolderOpen,
      change: "+2 this month",
    },
    {
      label: "Quoted Value",
      value: `£${projects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0).toLocaleString()}`,
      icon: Calculator,
      change: "Across all projects",
    },
    {
      label: "Avg. Duration",
      value: `${Math.round(projects.reduce((sum, p) => sum + (p.estimated_duration_weeks || 0), 0) / (projects.length || 1))} wks`,
      icon: Clock,
      change: "Per project",
    },
    {
      label: "Conversion Rate",
      value: "87%",
      icon: TrendingUp,
      change: "+5% vs last month",
    },
  ];

  const quickActions = [
    { label: "New Extension Quote", href: "/dashboard/new-project?type=extension", icon: Home },
    { label: "New Loft Quote", href: "/dashboard/new-project?type=loft", icon: Building2 },
    { label: "Generate CAD", href: "/dashboard/cad", icon: PenTool },
    { label: "View All Projects", href: "/dashboard/projects", icon: FolderOpen },
  ];

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your projects.
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/new-project">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="stat-number text-3xl mb-1">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="glass-card p-4 rounded-xl hover:border-primary/50 transition-colors group"
              >
                <action.icon className="h-6 w-6 text-primary mb-3" />
                <p className="font-medium text-sm group-hover:text-primary transition-colors">
                  {action.label}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Projects</h2>
            <Link
              to="/dashboard/projects"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                  <div className="h-4 bg-secondary rounded w-3/4 mb-4" />
                  <div className="h-3 bg-secondary rounded w-1/2 mb-2" />
                  <div className="h-3 bg-secondary rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="glass-card p-12 rounded-xl text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to get started with instant quotes and CAD generation.
              </p>
              <Button asChild>
                <Link to="/dashboard/new-project">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to={`/dashboard/projects/${project.id}`}
                  className="glass-card p-6 rounded-xl hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        STATUS_COLORS[project.status || "draft"]
                      }`}
                    >
                      {project.status || "Draft"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Estimated Cost</p>
                      <p className="font-mono font-medium">
                        £{(project.estimated_cost || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Duration</p>
                      <p className="font-mono font-medium">
                        {project.estimated_duration_weeks || 0} weeks
                      </p>
                    </div>
                  </div>
                  
                  {project.address && (
                    <p className="text-xs text-muted-foreground mt-4 truncate">
                      {project.address}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
