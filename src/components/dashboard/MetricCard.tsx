import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  currentValue?: number;
  format?: "currency" | "number" | "percent";
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  href?: string;
}

export function MetricCard({
  title,
  value,
  previousValue,
  currentValue,
  format = "number",
  icon,
  loading = false,
  className,
  href,
}: MetricCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case "currency":
        return `£${val.toLocaleString()}`;
      case "percent":
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString();
    }
  };

  const calculateChange = () => {
    if (!previousValue || !currentValue) return null;
    if (previousValue === 0) return currentValue > 0 ? 100 : 0;
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  const change = calculateChange();
  const trend = change === null ? null : change > 0 ? "up" : change < 0 ? "down" : "neutral";

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && change !== null && (
            <Badge
              variant="secondary"
              className={cn(
                "text-xs",
                trend === "up" && "bg-success/10 text-success",
                trend === "down" && "bg-destructive/10 text-destructive",
                trend === "neutral" && "bg-muted text-muted-foreground"
              )}
            >
              {trend === "up" && <ArrowUpRight className="h-3 w-3 mr-0.5" />}
              {trend === "down" && <ArrowDownRight className="h-3 w-3 mr-0.5" />}
              {trend === "neutral" && <Minus className="h-3 w-3 mr-0.5" />}
              {Math.abs(change).toFixed(1)}%
            </Badge>
          )}
        </div>
        {previousValue !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            vs {formatValue(previousValue)} previous
          </p>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export function MetricGrid({ children, columns = 4 }: MetricGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
    >
      {children}
    </div>
  );
}
