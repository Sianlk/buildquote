import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  generateInvoicePDF,
  downloadPDF,
  printPDF,
  type InvoiceData,
  type CompanyBranding,
} from "@/lib/pdf-generator";
import {
  Receipt,
  Plus,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Loader2,
  Printer,
} from "lucide-react";

type Project = Tables<"projects">;
type Invoice = Tables<"invoices">;

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
  draft: { bg: "bg-muted/50", text: "text-muted-foreground", icon: FileText },
  sent: { bg: "bg-primary/10", text: "text-primary", icon: Send },
  paid: { bg: "bg-success/10", text: "text-success", icon: CheckCircle },
  overdue: { bg: "bg-destructive/10", text: "text-destructive", icon: AlertCircle },
  pending: { bg: "bg-warning/10", text: "text-warning", icon: Clock },
};

export default function Invoices() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // New invoice form state
  const [selectedProject, setSelectedProject] = useState("");
  const [invoiceType, setInvoiceType] = useState("interim");
  const [netValue, setNetValue] = useState("");
  const [vatPercent, setVatPercent] = useState("20");
  const [retentionPercent, setRetentionPercent] = useState("5");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    if (!user) return;

    const [projectsRes, invoicesRes] = await Promise.all([
      supabase.from("projects").select("*"),
      supabase.from("invoices").select("*").order("created_at", { ascending: false }),
    ]);

    if (projectsRes.data) setProjects(projectsRes.data);
    if (invoicesRes.data) setInvoices(invoicesRes.data);
    setLoading(false);
  }

  const getProjectName = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    return project?.name || "Unknown Project";
  };

  const generateInvoiceNumber = () => {
    const prefix = "BQ";
    const date = format(new Date(), "yyMM");
    const seq = String(invoices.length + 1).padStart(4, "0");
    return `${prefix}-${date}-${seq}`;
  };

  const calculateTotals = () => {
    const net = parseFloat(netValue) || 0;
    const vat = (net * parseFloat(vatPercent)) / 100;
    const retention = (net * parseFloat(retentionPercent)) / 100;
    const gross = net + vat;
    return { net, vat, retention, gross, payable: gross - retention };
  };

  const handleCreateInvoice = async () => {
    if (!selectedProject || !netValue) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreating(true);
    const totals = calculateTotals();

    try {
      const { data, error } = await supabase
        .from("invoices")
        .insert({
          project_id: selectedProject,
          invoice_number: generateInvoiceNumber(),
          type: invoiceType,
          net_value: totals.net,
          vat_percent: parseFloat(vatPercent),
          vat_value: totals.vat,
          retention_percent: parseFloat(retentionPercent),
          retention_value: totals.retention,
          gross_value: totals.gross,
          due_date: dueDate || null,
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Invoice created successfully");
      setInvoices([data, ...invoices]);
      setDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create invoice");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setSelectedProject("");
    setInvoiceType("interim");
    setNetValue("");
    setVatPercent("20");
    setRetentionPercent("5");
    setDueDate("");
  };

  const updateInvoiceStatus = async (invoiceId: string, status: string) => {
    const updates: any = { status };
    if (status === "paid") {
      updates.paid_date = new Date().toISOString().split("T")[0];
    }

    const { error } = await supabase
      .from("invoices")
      .update(updates)
      .eq("id", invoiceId);

    if (error) {
      toast.error("Failed to update invoice");
    } else {
      toast.success("Invoice updated");
      setInvoices(invoices.map((inv) => 
        inv.id === invoiceId ? { ...inv, ...updates } : inv
      ));
    }
  };

  const totals = calculateTotals();

  // Summary calculations
  const totalOutstanding = invoices
    .filter((inv) => inv.status !== "paid")
    .reduce((sum, inv) => sum + (inv.gross_value || 0), 0);
  
  const totalPaid = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + (inv.gross_value || 0), 0);

  const totalRetention = invoices.reduce((sum, inv) => sum + (inv.retention_value || 0), 0);

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-muted-foreground">
              JCT-compliant invoicing with retention management
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Invoice Type</Label>
                    <Select value={invoiceType} onValueChange={setInvoiceType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interim">Interim</SelectItem>
                        <SelectItem value="final">Final</SelectItem>
                        <SelectItem value="retention_release">Retention Release</SelectItem>
                        <SelectItem value="variation">Variation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Net Value (£)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={netValue}
                    onChange={(e) => setNetValue(e.target.value)}
                    className="mt-1 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>VAT (%)</Label>
                    <Select value={vatPercent} onValueChange={setVatPercent}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0% (Zero Rated)</SelectItem>
                        <SelectItem value="5">5% (Reduced)</SelectItem>
                        <SelectItem value="20">20% (Standard)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Retention (%)</Label>
                    <Select value={retentionPercent} onValueChange={setRetentionPercent}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="2.5">2.5%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Calculation Preview */}
                <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Net Value</span>
                    <span className="font-mono">£{totals.net.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT ({vatPercent}%)</span>
                    <span className="font-mono">£{totals.vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border/50 pt-2">
                    <span>Gross Value</span>
                    <span className="font-mono font-medium">£{totals.gross.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Less Retention ({retentionPercent}%)</span>
                    <span className="font-mono">-£{totals.retention.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold border-t border-border/50 pt-2">
                    <span>Amount Due</span>
                    <span className="font-mono text-primary">£{totals.payable.toLocaleString()}</span>
                  </div>
                </div>

                <Button onClick={handleCreateInvoice} className="w-full" disabled={creating}>
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Create Invoice
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
            <p className="stat-number text-2xl">£{totalOutstanding.toLocaleString()}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
            <p className="stat-number text-2xl">£{totalPaid.toLocaleString()}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Retention Held</p>
            <p className="stat-number text-2xl">£{totalRetention.toLocaleString()}</p>
          </div>
          <div className="glass-card p-6 rounded-xl">
            <p className="text-sm text-muted-foreground mb-1">Invoices</p>
            <p className="stat-number text-2xl">{invoices.length}</p>
          </div>
        </div>

        {/* Invoice List */}
        {invoices.length === 0 ? (
          <div className="glass-card p-12 rounded-xl text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No invoices yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first invoice to start tracking payments.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const statusConfig = STATUS_COLORS[invoice.status || "draft"];
              const StatusIcon = statusConfig.icon;

              return (
                <div key={invoice.id} className="glass-card p-6 rounded-xl">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon className={`h-5 w-5 ${statusConfig.text}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold font-mono">{invoice.invoice_number}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusConfig.bg} ${statusConfig.text}`}>
                            {invoice.status}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground capitalize">
                            {invoice.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {getProjectName(invoice.project_id)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Created: {format(new Date(invoice.created_at!), "MMM d, yyyy")}</span>
                          {invoice.due_date && (
                            <span>Due: {format(new Date(invoice.due_date), "MMM d, yyyy")}</span>
                          )}
                          {invoice.paid_date && (
                            <span className="text-success">Paid: {format(new Date(invoice.paid_date), "MMM d, yyyy")}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="stat-number text-2xl mb-2">
                        £{(invoice.gross_value || 0).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        {invoice.status === "draft" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvoiceStatus(invoice.id, "sent")}
                          >
                            <Send className="h-4 w-4 mr-1" />
                            Send
                          </Button>
                        )}
                        {invoice.status === "sent" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateInvoiceStatus(invoice.id, "paid")}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Mark Paid
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const invoiceData: InvoiceData = {
                              invoiceNumber: invoice.invoice_number,
                              date: format(new Date(invoice.created_at!), "dd/MM/yyyy"),
                              dueDate: invoice.due_date ? format(new Date(invoice.due_date), "dd/MM/yyyy") : undefined,
                              projectName: getProjectName(invoice.project_id),
                              customerName: "Customer",
                              netValue: invoice.net_value,
                              vatPercent: invoice.vat_percent || 20,
                              vatValue: invoice.vat_value || 0,
                              retentionPercent: invoice.retention_percent || 0,
                              retentionValue: invoice.retention_value || 0,
                              grossValue: invoice.gross_value,
                              payableAmount: invoice.gross_value - (invoice.retention_value || 0),
                              type: invoice.type || "interim",
                              status: invoice.status || "draft",
                            };
                            const doc = generateInvoicePDF(invoiceData);
                            downloadPDF(doc, `Invoice-${invoice.invoice_number}.pdf`);
                            toast.success("PDF downloaded");
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const invoiceData: InvoiceData = {
                              invoiceNumber: invoice.invoice_number,
                              date: format(new Date(invoice.created_at!), "dd/MM/yyyy"),
                              dueDate: invoice.due_date ? format(new Date(invoice.due_date), "dd/MM/yyyy") : undefined,
                              projectName: getProjectName(invoice.project_id),
                              customerName: "Customer",
                              netValue: invoice.net_value,
                              vatPercent: invoice.vat_percent || 20,
                              vatValue: invoice.vat_value || 0,
                              retentionPercent: invoice.retention_percent || 0,
                              retentionValue: invoice.retention_value || 0,
                              grossValue: invoice.gross_value,
                              payableAmount: invoice.gross_value - (invoice.retention_value || 0),
                              type: invoice.type || "interim",
                              status: invoice.status || "draft",
                            };
                            const doc = generateInvoicePDF(invoiceData);
                            printPDF(doc);
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Invoice breakdown */}
                  <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Net</p>
                      <p className="font-mono">£{(invoice.net_value || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">VAT ({invoice.vat_percent || 0}%)</p>
                      <p className="font-mono">£{(invoice.vat_value || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Retention ({invoice.retention_percent || 0}%)</p>
                      <p className="font-mono">-£{(invoice.retention_value || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount Due</p>
                      <p className="font-mono font-medium text-primary">
                        £{((invoice.gross_value || 0) - (invoice.retention_value || 0)).toLocaleString()}
                      </p>
                    </div>
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
