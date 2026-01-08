import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tables } from "@/integrations/supabase/types";
import {
  PenTool,
  Loader2,
  Download,
  RefreshCw,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

type Project = Tables<"projects">;
type CadDrawing = Tables<"cad_drawings">;

export default function CAD() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [drawings, setDrawings] = useState<CadDrawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDrawing, setSelectedDrawing] = useState<CadDrawing | null>(null);

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
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
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
              AI-generated technical drawings for your projects
            </p>
          </div>
        </div>

        {drawings.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center">
            <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No drawings yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate CAD drawings from your project details page.
            </p>
            <Button asChild>
              <Link to="/dashboard/projects">
                View Projects
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawings.map((drawing) => (
              <div
                key={drawing.id}
                className="glass-card p-4 rounded-xl cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setSelectedDrawing(drawing)}
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
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div
                  className="bg-secondary/30 rounded-lg p-4 aspect-video flex items-center justify-center overflow-hidden"
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
              <Button variant="ghost" onClick={() => setSelectedDrawing(null)}>
                Close
              </Button>
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
