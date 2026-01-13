import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface RecentActivityItem {
  id: string;
  type: "project" | "invoice" | "job" | "receipt" | "compliance";
  title: string;
  description: string;
  status?: string;
  timestamp: string;
  link?: string;
}

interface RecentActivityProps {
  items: RecentActivityItem[];
  loading?: boolean;
  title?: string;
}

const TYPE_ICONS = {
  project: CheckCircle,
  invoice: Clock,
  job: CheckCircle,
  receipt: CheckCircle,
  compliance: AlertCircle,
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-success/10 text-success",
  paid: "bg-success/10 text-success",
  draft: "bg-muted text-muted-foreground",
  in_progress: "bg-warning/10 text-warning",
  quoted: "bg-primary/10 text-primary",
  sent: "bg-primary/10 text-primary",
  overdue: "bg-destructive/10 text-destructive",
};

export function RecentActivity({
  items,
  loading = false,
  title = "Recent Activity",
}: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recent activity to show
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/projects">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.slice(0, 5).map((item) => {
            const Icon = TYPE_ICONS[item.type];
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-full bg-muted shrink-0">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm truncate">{item.title}</p>
                    {item.status && (
                      <Badge
                        variant="secondary"
                        className={STATUS_STYLES[item.status] || ""}
                      >
                        {item.status.replace(/_/g, " ")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {item.link && (
                  <Button variant="ghost" size="icon" asChild className="shrink-0">
                    <Link to={item.link}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
