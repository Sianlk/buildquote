import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "success" | "warning" | "destructive" | "primary";
  className?: string;
}

const variantStyles = {
  default: "bg-muted/50 text-muted-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  primary: "bg-primary/10 text-primary",
};

export function StatCard({
  icon: Icon,
  label,
  value,
  subValue,
  trend,
  trendValue,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg shrink-0", variantStyles[variant])}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground truncate">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold truncate">{value}</p>
              {trend && trendValue && (
                <span
                  className={cn(
                    "text-xs",
                    trend === "up" && "text-success",
                    trend === "down" && "text-destructive",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trend === "up" && "↑"}
                  {trend === "down" && "↓"}
                  {trendValue}
                </span>
              )}
            </div>
            {subValue && (
              <p className="text-xs text-muted-foreground truncate">{subValue}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
