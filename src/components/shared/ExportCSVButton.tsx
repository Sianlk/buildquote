import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";

interface ExportCSVButtonProps {
  data: Record<string, any>[];
  filename: string;
  columns?: { key: string; label: string }[];
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportCSVButton({
  data,
  filename,
  columns,
  variant = "outline",
  size = "sm",
}: ExportCSVButtonProps) {
  const exportToCSV = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    // Determine columns
    const cols = columns || Object.keys(data[0]).map(key => ({ key, label: key }));
    
    // Create CSV header
    const header = cols.map(c => `"${c.label}"`).join(",");
    
    // Create CSV rows
    const rows = data.map(item =>
      cols.map(c => {
        const value = item[c.key];
        if (value === null || value === undefined) return '""';
        if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(",")
    );
    
    // Combine
    const csv = [header, ...rows].join("\n");
    
    // Download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exported ${data.length} records`);
  };

  return (
    <Button variant={variant} size={size} onClick={exportToCSV}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );
}
