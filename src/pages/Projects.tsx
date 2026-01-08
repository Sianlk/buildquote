import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  FolderOpen,
  MoreVertical,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { format } from "date-fns";

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

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchProjects();
  }, [user, statusFilter, typeFilter, sortBy, sortOrder]);

  async function fetchProjects() {
    if (!user) return;

    let query = supabase
      .from("projects")
      .select("*")
      .order(sortBy as "updated_at" | "created_at" | "name" | "estimated_cost", { ascending: sortOrder === "asc" });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter as any);
    }

    if (typeFilter !== "all") {
      query = query.eq("project_type", typeFilter as any);
    }

    const { data, error } = await query;

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.postcode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (error) {
      toast.error("Failed to delete project");
    } else {
      toast.success("Project deleted");
      setProjects(projects.filter((p) => p.id !== projectId));
    }
  };

  const handleDuplicate = async (project: Project) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        name: `${project.name} (Copy)`,
        project_type: project.project_type,
        address: project.address,
        postcode: project.postcode,
        description: project.description,
        build_quality: project.build_quality,
        estimated_cost: project.estimated_cost,
        estimated_duration_weeks: project.estimated_duration_weeks,
        status: "draft",
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to duplicate project");
    } else {
      toast.success("Project duplicated");
      setProjects([data, ...projects]);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage all your construction projects
            </p>
          </div>
          <Button asChild>
            <Link to="/dashboard/new-project">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 rounded-xl mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="quoted">Quoted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated_at">Last Updated</SelectItem>
                <SelectItem value="created_at">Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="estimated_cost">Cost</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={toggleSortOrder}>
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 rounded-xl animate-pulse">
                <div className="h-4 bg-secondary rounded w-3/4 mb-4" />
                <div className="h-3 bg-secondary rounded w-1/2 mb-2" />
                <div className="h-3 bg-secondary rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all" || typeFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first project to get started"}
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
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="glass-card p-6 rounded-xl hover:border-primary/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-4">
                  <Link
                    to={`/dashboard/projects/${project.id}`}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
                    </p>
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/dashboard/projects/${project.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(project)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(project.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                      STATUS_COLORS[project.status || "draft"]
                    }`}
                  >
                    {project.status || "Draft"}
                  </span>
                  {project.build_quality && (
                    <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                      {project.build_quality}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
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
                  <p className="text-xs text-muted-foreground truncate mb-2">
                    {project.address}
                    {project.postcode && `, ${project.postcode}`}
                  </p>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Updated{" "}
                    {format(new Date(project.updated_at || project.created_at!), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredProjects.length > 0 && (
          <div className="mt-8 p-4 rounded-xl bg-secondary/30 border border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{filteredProjects.length}</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  £{filteredProjects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {filteredProjects.filter((p) => p.status === "quoted" || p.status === "approved").length}
                </p>
                <p className="text-sm text-muted-foreground">Active Quotes</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {filteredProjects.filter((p) => p.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
