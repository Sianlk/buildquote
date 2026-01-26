import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  ExportColumn,
} from "@/lib/export-utils";

interface ExportButtonsProps {
  data: Record<string, any>[];
  columns: ExportColumn[];
  filename: string;
  title?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportButtons({
  data,
  columns,
  filename,
  title,
  variant = "outline",
  size = "sm",
}: ExportButtonsProps) {
  const handleExportCSV = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToCSV(data, columns, filename);
    toast.success(`Exported ${data.length} records to CSV`);
  };

  const handleExportExcel = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToExcel(data, columns, filename);
    toast.success(`Exported ${data.length} records to Excel`);
  };

  const handleExportPDF = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToPDF(title || filename, data, columns, filename, {
      orientation: columns.length > 5 ? "landscape" : "portrait",
    });
    toast.success(`Exported ${data.length} records to PDF`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Excel (.xls)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick export button for single format
interface QuickExportButtonProps {
  data: Record<string, any>[];
  columns: ExportColumn[];
  filename: string;
  format: "csv" | "excel" | "pdf";
  title?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  label?: string;
}

export function QuickExportButton({
  data,
  columns,
  filename,
  format,
  title,
  variant = "outline",
  size = "sm",
  label,
}: QuickExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    switch (format) {
      case "csv":
        exportToCSV(data, columns, filename);
        break;
      case "excel":
        exportToExcel(data, columns, filename);
        break;
      case "pdf":
        exportToPDF(title || filename, data, columns, filename);
        break;
    }
    toast.success(`Exported ${data.length} records`);
  };

  const Icon = format === "pdf" ? FileText : FileSpreadsheet;
  const defaultLabel = format === "pdf" ? "Export PDF" : format === "excel" ? "Export Excel" : "Export CSV";

  return (
    <Button variant={variant} size={size} onClick={handleExport}>
      <Icon className="h-4 w-4 mr-2" />
      {label || defaultLabel}
    </Button>
  );
}
