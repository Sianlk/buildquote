// Export Utilities - PDF and Excel (CSV) generation for scheduling and project data
// Jan 2026

import jsPDF from "jspdf";

export interface ExportColumn {
  key: string;
  label: string;
  width?: number;
}

// ============================================
// CSV/EXCEL EXPORT
// ============================================
export function exportToCSV(
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename: string
): void {
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Create CSV header
  const header = columns.map(c => `"${c.label}"`).join(",");

  // Create CSV rows
  const rows = data.map(item =>
    columns.map(c => {
      const value = item[c.key];
      if (value === null || value === undefined) return '""';
      if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(",")
  );

  // Combine and download
  const csv = [header, ...rows].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" }); // BOM for Excel compatibility
  downloadBlob(blob, `${filename}-${formatDate(new Date())}.csv`);
}

export function exportToExcel(
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename: string,
  sheetName: string = "Data"
): void {
  // For true Excel format, we use a simple XML-based approach
  // This creates an .xls file that Excel can open
  
  if (data.length === 0) {
    console.warn("No data to export");
    return;
  }

  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Styles>
    <Style ss:ID="header">
      <Font ss:Bold="1"/>
      <Interior ss:Color="#4472C4" ss:Pattern="Solid"/>
      <Font ss:Color="#FFFFFF"/>
    </Style>
    <Style ss:ID="currency">
      <NumberFormat ss:Format="£#,##0.00"/>
    </Style>
  </Styles>
  <Worksheet ss:Name="${sheetName}">
    <Table>`;

  // Column widths
  const colDefs = columns.map(c => 
    `<Column ss:Width="${c.width || 100}"/>`
  ).join("");

  // Header row
  const headerRow = `<Row ss:StyleID="header">
    ${columns.map(c => `<Cell><Data ss:Type="String">${escapeXml(c.label)}</Data></Cell>`).join("")}
  </Row>`;

  // Data rows
  const dataRows = data.map(item => {
    const cells = columns.map(c => {
      const value = item[c.key];
      if (value === null || value === undefined) {
        return `<Cell><Data ss:Type="String"></Data></Cell>`;
      }
      if (typeof value === "number") {
        return `<Cell><Data ss:Type="Number">${value}</Data></Cell>`;
      }
      if (typeof value === "object") {
        return `<Cell><Data ss:Type="String">${escapeXml(JSON.stringify(value))}</Data></Cell>`;
      }
      return `<Cell><Data ss:Type="String">${escapeXml(String(value))}</Data></Cell>`;
    }).join("");
    return `<Row>${cells}</Row>`;
  }).join("");

  const xmlFooter = `</Table>
  </Worksheet>
</Workbook>`;

  const xml = xmlHeader + colDefs + headerRow + dataRows + xmlFooter;
  const blob = new Blob([xml], { type: "application/vnd.ms-excel" });
  downloadBlob(blob, `${filename}-${formatDate(new Date())}.xls`);
}

// ============================================
// PDF EXPORT
// ============================================
export function exportToPDF(
  title: string,
  data: Record<string, any>[],
  columns: ExportColumn[],
  filename: string,
  options: {
    orientation?: "portrait" | "landscape";
    includeDate?: boolean;
    companyName?: string;
    subtitle?: string;
  } = {}
): void {
  const {
    orientation = "portrait",
    includeDate = true,
    companyName = "BuildQuote",
    subtitle = "",
  } = options;

  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let y = margin;

  // Header
  doc.setFillColor(30, 64, 175); // Primary blue
  doc.rect(0, 0, pageWidth, 25, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(companyName, margin, 12);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  if (includeDate) {
    doc.text(formatDate(new Date()), pageWidth - margin, 12, { align: "right" });
  }

  y = 35;

  // Title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, margin, y);
  y += 6;

  if (subtitle) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(subtitle, margin, y);
    y += 8;
  } else {
    y += 4;
  }

  // Table
  const colWidth = (pageWidth - 2 * margin) / columns.length;
  const rowHeight = 8;

  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, pageWidth - 2 * margin, rowHeight, "F");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  
  columns.forEach((col, i) => {
    const x = margin + i * colWidth + 2;
    doc.text(truncateText(col.label, colWidth - 4), x, y + 5);
  });
  y += rowHeight;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  
  data.forEach((row, rowIndex) => {
    // Check for page break
    if (y > pageHeight - 20) {
      doc.addPage();
      y = margin;
    }

    // Alternating row colors
    if (rowIndex % 2 === 1) {
      doc.setFillColor(250, 250, 250);
      doc.rect(margin, y, pageWidth - 2 * margin, rowHeight, "F");
    }

    columns.forEach((col, i) => {
      const x = margin + i * colWidth + 2;
      let value = row[col.key];
      if (value === null || value === undefined) value = "";
      if (typeof value === "object") value = JSON.stringify(value);
      doc.text(truncateText(String(value), colWidth - 4), x, y + 5);
    });
    y += rowHeight;
  });

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    doc.text("Generated by BuildQuote", margin, pageHeight - 10);
  }

  doc.save(`${filename}-${formatDate(new Date())}.pdf`);
}

// ============================================
// SCHEDULING EXPORT
// ============================================
export interface ScheduleTask {
  id: string;
  task_name: string;
  trade?: string;
  duration_days: number;
  start_day?: number;
  end_day?: number;
  dependencies?: string[];
  labour_hours?: number;
}

export function exportScheduleToExcel(
  tasks: ScheduleTask[],
  projectName: string
): void {
  const columns: ExportColumn[] = [
    { key: "task_name", label: "Task", width: 200 },
    { key: "trade", label: "Trade", width: 100 },
    { key: "duration_days", label: "Duration (Days)", width: 80 },
    { key: "start_day", label: "Start Day", width: 80 },
    { key: "end_day", label: "End Day", width: 80 },
    { key: "labour_hours", label: "Labour Hours", width: 80 },
    { key: "dependencies", label: "Dependencies", width: 150 },
  ];

  const data = tasks.map(t => ({
    ...t,
    dependencies: t.dependencies?.join(", ") || "",
  }));

  exportToExcel(data, columns, `${projectName}-schedule`, "Schedule");
}

export function exportScheduleToPDF(
  tasks: ScheduleTask[],
  projectName: string,
  totalDuration?: number
): void {
  const columns: ExportColumn[] = [
    { key: "task_name", label: "Task", width: 50 },
    { key: "trade", label: "Trade", width: 25 },
    { key: "duration_days", label: "Days", width: 15 },
    { key: "start_day", label: "Start", width: 15 },
    { key: "end_day", label: "End", width: 15 },
  ];

  const data = tasks.map(t => ({
    ...t,
    dependencies: t.dependencies?.join(", ") || "",
  }));

  exportToPDF(
    `Project Schedule: ${projectName}`,
    data,
    columns,
    `${projectName}-schedule`,
    {
      orientation: "landscape",
      subtitle: totalDuration ? `Total Duration: ${totalDuration} days` : undefined,
    }
  );
}

// ============================================
// PROJECT DATA EXPORT
// ============================================
export interface ProjectExportData {
  id: string;
  name: string;
  project_type: string;
  status?: string;
  estimated_cost?: number;
  estimated_duration_weeks?: number;
  created_at?: string;
  address?: string;
}

export function exportProjectsToExcel(projects: ProjectExportData[]): void {
  const columns: ExportColumn[] = [
    { key: "name", label: "Project Name", width: 200 },
    { key: "project_type", label: "Type", width: 120 },
    { key: "status", label: "Status", width: 80 },
    { key: "estimated_cost", label: "Estimated Cost (£)", width: 100 },
    { key: "estimated_duration_weeks", label: "Duration (Weeks)", width: 100 },
    { key: "address", label: "Address", width: 200 },
    { key: "created_at", label: "Created", width: 100 },
  ];

  const data = projects.map(p => ({
    ...p,
    created_at: p.created_at ? formatDate(new Date(p.created_at)) : "",
    estimated_cost: p.estimated_cost || 0,
  }));

  exportToExcel(data, columns, "projects-export", "Projects");
}

export function exportProjectsToPDF(projects: ProjectExportData[]): void {
  const columns: ExportColumn[] = [
    { key: "name", label: "Project", width: 40 },
    { key: "project_type", label: "Type", width: 30 },
    { key: "status", label: "Status", width: 20 },
    { key: "estimated_cost", label: "Cost", width: 25 },
    { key: "created_at", label: "Created", width: 25 },
  ];

  const data = projects.map(p => ({
    ...p,
    created_at: p.created_at ? formatDate(new Date(p.created_at)) : "",
    estimated_cost: p.estimated_cost ? `£${p.estimated_cost.toLocaleString()}` : "-",
  }));

  exportToPDF("Projects Summary", data, columns, "projects-export", {
    orientation: "landscape",
    subtitle: `Total: ${projects.length} projects`,
  });
}

// ============================================
// MATERIALS EXPORT
// ============================================
export interface MaterialExportData {
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  partCode?: string;
}

export function exportMaterialsToExcel(
  materials: MaterialExportData[],
  projectName: string
): void {
  const columns: ExportColumn[] = [
    { key: "name", label: "Material", width: 200 },
    { key: "partCode", label: "Part Code", width: 80 },
    { key: "quantity", label: "Qty", width: 60 },
    { key: "unit", label: "Unit", width: 60 },
    { key: "unitCost", label: "Unit Cost (£)", width: 80 },
    { key: "totalCost", label: "Total (£)", width: 80 },
    { key: "supplier", label: "Supplier", width: 120 },
  ];

  const total = materials.reduce((sum, m) => sum + m.totalCost, 0);
  const data = [
    ...materials,
    { name: "TOTAL", quantity: "", unit: "", unitCost: "", totalCost: total, supplier: "", partCode: "" },
  ];

  exportToExcel(data, columns, `${projectName}-materials`, "Materials");
}

export function exportMaterialsToPDF(
  materials: MaterialExportData[],
  projectName: string
): void {
  const columns: ExportColumn[] = [
    { key: "name", label: "Material", width: 45 },
    { key: "partCode", label: "Code", width: 15 },
    { key: "quantity", label: "Qty", width: 10 },
    { key: "unit", label: "Unit", width: 10 },
    { key: "unitCost", label: "Unit £", width: 15 },
    { key: "totalCost", label: "Total £", width: 15 },
  ];

  const total = materials.reduce((sum, m) => sum + m.totalCost, 0);

  exportToPDF(
    `Materials List: ${projectName}`,
    materials,
    columns,
    `${projectName}-materials`,
    {
      orientation: "portrait",
      subtitle: `Total: £${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
    }
  );
}

// ============================================
// TRADE JOBS EXPORT
// ============================================
export interface TradeJobExportData {
  id: string;
  trade: string;
  job_type: string;
  customer_name?: string;
  customer_price?: number;
  total_cost?: number;
  profit_margin?: number;
  status?: string;
  job_date?: string;
}

export function exportTradeJobsToExcel(jobs: TradeJobExportData[]): void {
  const columns: ExportColumn[] = [
    { key: "trade", label: "Trade", width: 100 },
    { key: "job_type", label: "Job Type", width: 150 },
    { key: "customer_name", label: "Customer", width: 150 },
    { key: "total_cost", label: "Cost (£)", width: 80 },
    { key: "customer_price", label: "Price (£)", width: 80 },
    { key: "profit_margin", label: "Margin (%)", width: 60 },
    { key: "status", label: "Status", width: 80 },
    { key: "job_date", label: "Date", width: 100 },
  ];

  exportToExcel(jobs, columns, "trade-jobs-export", "Trade Jobs");
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncateText(text: string, maxWidth: number): string {
  // Simple truncation - for PDF we estimate ~3 chars per mm
  const maxChars = Math.floor(maxWidth * 3);
  if (text.length > maxChars) {
    return text.substring(0, maxChars - 2) + "..";
  }
  return text;
}
