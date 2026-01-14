import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  Send,
  Loader2,
  Clock,
  Wrench,
  Package,
} from "lucide-react";
import jsPDF from "jspdf";

interface InvoiceLineItem {
  description: string;
  category: 'labour' | 'materials' | 'plant' | 'other';
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  hours?: number;
  rate?: number;
}

interface InvoiceGeneratorProps {
  initialItems?: InvoiceLineItem[];
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  projectDescription?: string;
  jobReference?: string;
}

const DEFAULT_COMPANY = {
  name: "Your Company Name",
  address: "Your Address, City, Postcode",
  phone: "Your Phone",
  email: "your@email.com",
  vatNumber: "",
};

export function InvoiceGenerator({
  initialItems = [],
  customerName = "",
  customerAddress = "",
  customerPhone = "",
  customerEmail = "",
  projectDescription = "",
  jobReference = "",
}: InvoiceGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [company, setCompany] = useState(DEFAULT_COMPANY);
  const [items, setItems] = useState<InvoiceLineItem[]>(initialItems);
  const [customer, setCustomer] = useState({
    name: customerName,
    address: customerAddress,
    phone: customerPhone,
    email: customerEmail,
  });
  const [description, setDescription] = useState(projectDescription);
  const [reference, setReference] = useState(jobReference);
  const [notes, setNotes] = useState("");
  const [vatRate, setVatRate] = useState(20);
  const [paymentTerms, setPaymentTerms] = useState(30);
  const [retentionRate, setRetentionRate] = useState(0);

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `INV-${year}${month}-${random}`;
  };

  const addItem = (category: 'labour' | 'materials' | 'plant' | 'other') => {
    const newItem: InvoiceLineItem = {
      description: "",
      category,
      quantity: 1,
      unit: category === 'labour' ? 'hrs' : 'item',
      unitPrice: 0,
      total: 0,
      hours: category === 'labour' ? 1 : undefined,
      rate: category === 'labour' ? 45 : undefined,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceLineItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    
    if (updated[index].category === 'labour' && (field === 'hours' || field === 'rate')) {
      const hours = updated[index].hours || 0;
      const rate = updated[index].rate || 0;
      updated[index].quantity = hours;
      updated[index].unitPrice = rate;
      updated[index].total = hours * rate;
    } else if (field === "quantity" || field === "unitPrice") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setItems(updated);
  };

  const labourItems = items.filter(i => i.category === 'labour');
  const materialItems = items.filter(i => i.category === 'materials');
  const plantItems = items.filter(i => i.category === 'plant');

  const labourTotal = labourItems.reduce((sum, item) => sum + item.total, 0);
  const materialsTotal = materialItems.reduce((sum, item) => sum + item.total, 0);
  const plantTotal = plantItems.reduce((sum, item) => sum + item.total, 0);

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const retentionAmount = subtotal * (retentionRate / 100);
  const netAfterRetention = subtotal - retentionAmount;
  const vatAmount = netAfterRetention * (vatRate / 100);
  const total = netAfterRetention + vatAmount;

  const totalLabourHours = labourItems.reduce((sum, item) => sum + (item.hours || 0), 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const generatePDF = (): jsPDF => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const invoiceNumber = generateInvoiceNumber();
    const invoiceDate = new Date().toLocaleDateString("en-GB");
    const dueDate = new Date(Date.now() + paymentTerms * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB");

    // Header
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 35, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text(company.name, 15, 22);
    doc.setFontSize(14);
    doc.text("INVOICE", pageWidth - 15, 15, { align: "right" });
    doc.setFontSize(11);
    doc.text(invoiceNumber, pageWidth - 15, 25, { align: "right" });

    // Company details
    let yPos = 45;
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(company.address, 15, yPos);
    doc.text(`Tel: ${company.phone} | Email: ${company.email}`, 15, yPos + 4);
    if (company.vatNumber) {
      doc.text(`VAT: ${company.vatNumber}`, pageWidth - 15, yPos, { align: "right" });
    }

    // Invoice details box
    yPos = 60;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(pageWidth - 85, yPos, 70, 30, 3, 3, "F");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Invoice Date:", pageWidth - 80, yPos + 8);
    doc.text("Due Date:", pageWidth - 80, yPos + 16);
    doc.text("Reference:", pageWidth - 80, yPos + 24);
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "bold");
    doc.text(invoiceDate, pageWidth - 20, yPos + 8, { align: "right" });
    doc.text(dueDate, pageWidth - 20, yPos + 16, { align: "right" });
    doc.text(reference || "-", pageWidth - 20, yPos + 24, { align: "right" });

    // Bill To
    doc.setFont("helvetica", "normal");
    doc.setTextColor(37, 99, 235);
    doc.text("BILL TO", 15, yPos + 5);
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(customer.name, 15, yPos + 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(customer.address, 15, yPos + 18);

    // Project description
    yPos = 100;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(15, yPos, pageWidth - 30, 12, 2, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Project: " + (description || "Services rendered"), 20, yPos + 7);

    // Items table header
    yPos = 120;
    doc.setFillColor(37, 99, 235);
    doc.rect(15, yPos, pageWidth - 30, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, yPos + 5.5);
    doc.text("Category", 100, yPos + 5.5);
    doc.text("Qty", 130, yPos + 5.5);
    doc.text("Rate", 150, yPos + 5.5);
    doc.text("Total", pageWidth - 20, yPos + 5.5, { align: "right" });

    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(15, yPos, pageWidth - 30, 7, "F");
      }
      yPos += 5;
      doc.text(item.description.substring(0, 40) || "Item", 20, yPos);
      doc.text(item.category, 100, yPos);
      doc.text(`${item.quantity} ${item.unit}`, 130, yPos);
      doc.text(formatCurrency(item.unitPrice), 150, yPos);
      doc.text(formatCurrency(item.total), pageWidth - 20, yPos, { align: "right" });
      yPos += 2;
    });

    // Totals
    yPos += 15;
    const totalsX = 120;
    doc.setTextColor(100, 100, 100);
    doc.text("Labour Total:", totalsX, yPos);
    doc.text(formatCurrency(labourTotal), pageWidth - 20, yPos, { align: "right" });
    yPos += 6;
    doc.text("Materials Total:", totalsX, yPos);
    doc.text(formatCurrency(materialsTotal), pageWidth - 20, yPos, { align: "right" });
    yPos += 6;
    doc.text("Plant Total:", totalsX, yPos);
    doc.text(formatCurrency(plantTotal), pageWidth - 20, yPos, { align: "right" });
    yPos += 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX, yPos, pageWidth - 15, yPos);
    yPos += 6;
    doc.text("Subtotal:", totalsX, yPos);
    doc.setTextColor(30, 30, 30);
    doc.text(formatCurrency(subtotal), pageWidth - 20, yPos, { align: "right" });
    
    if (retentionRate > 0) {
      yPos += 6;
      doc.setTextColor(200, 100, 100);
      doc.text(`Retention (${retentionRate}%):`, totalsX, yPos);
      doc.text(`-${formatCurrency(retentionAmount)}`, pageWidth - 20, yPos, { align: "right" });
    }
    
    yPos += 6;
    doc.setTextColor(100, 100, 100);
    doc.text(`VAT (${vatRate}%):`, totalsX, yPos);
    doc.setTextColor(30, 30, 30);
    doc.text(formatCurrency(vatAmount), pageWidth - 20, yPos, { align: "right" });
    
    yPos += 10;
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(totalsX - 5, yPos - 3, pageWidth - totalsX - 10, 12, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL DUE", totalsX, yPos + 5);
    doc.text(formatCurrency(total), pageWidth - 20, yPos + 5, { align: "right" });

    // Payment info
    yPos += 25;
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Payment Terms", 15, yPos);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    yPos += 5;
    doc.text(`Payment due within ${paymentTerms} days. Reference: ${invoiceNumber}`, 15, yPos);

    // Notes
    if (notes) {
      yPos += 12;
      doc.setFillColor(255, 251, 235);
      doc.roundedRect(15, yPos, pageWidth - 30, 15, 2, 2, "F");
      doc.setTextColor(146, 64, 14);
      doc.setFontSize(8);
      doc.text("Notes: " + notes, 20, yPos + 8, { maxWidth: pageWidth - 40 });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(company.name, 15, pageHeight - 12);
    doc.text("Thank you for your business", pageWidth / 2, pageHeight - 12, { align: "center" });
    doc.text(new Date().toLocaleDateString("en-GB"), pageWidth - 15, pageHeight - 12, { align: "right" });

    return doc;
  };

  const handlePrint = () => {
    if (items.length === 0) {
      toast.error("Add at least one line item");
      return;
    }
    if (!customer.name) {
      toast.error("Customer name is required");
      return;
    }
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl, "_blank");
    if (printWindow) {
      printWindow.onload = () => printWindow.print();
    }
  };

  const handleDownload = () => {
    if (items.length === 0) {
      toast.error("Add at least one line item");
      return;
    }
    if (!customer.name) {
      toast.error("Customer name is required");
      return;
    }
    const doc = generatePDF();
    doc.save(`Invoice-${generateInvoiceNumber()}.pdf`);
    toast.success("Invoice PDF downloaded");
  };

  const handleSendEmail = async () => {
    if (!customer.email) {
      toast.error("Customer email is required");
      return;
    }
    if (items.length === 0) {
      toast.error("Add at least one line item");
      return;
    }

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: customer.email,
          subject: `Invoice ${generateInvoiceNumber()} from ${company.name}`,
          html: `
            <h1>Invoice from ${company.name}</h1>
            <p>Dear ${customer.name},</p>
            <p>Please find attached your invoice for ${description || 'services rendered'}.</p>
            <p><strong>Total Due: ${formatCurrency(total)}</strong></p>
            <p>Payment Terms: ${paymentTerms} days</p>
            <p>Thank you for your business.</p>
            <p>Best regards,<br/>${company.name}</p>
          `,
          replyTo: company.email,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast.success(`Invoice sent to ${customer.email}`);
    } catch (error: any) {
      console.error("Email error:", error);
      toast.error(error.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const ItemsSection = ({ 
    title, 
    category, 
    categoryItems, 
    icon: Icon 
  }: { 
    title: string; 
    category: 'labour' | 'materials' | 'plant' | 'other'; 
    categoryItems: InvoiceLineItem[];
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => addItem(category)}>
            <Plus className="h-3 w-3 mr-1" /> Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {categoryItems.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No items added</p>
        ) : (
          <div className="space-y-2">
            {categoryItems.map((item) => {
              const globalIdx = items.findIndex(i => i === item);
              return (
                <div key={globalIdx} className="grid grid-cols-12 gap-2 items-center text-sm">
                  <div className="col-span-5">
                    <Input
                      value={item.description}
                      onChange={e => updateItem(globalIdx, "description", e.target.value)}
                      placeholder="Description"
                      className="h-8 text-xs"
                    />
                  </div>
                  {category === 'labour' ? (
                    <>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.hours || 0}
                          onChange={e => updateItem(globalIdx, "hours", parseFloat(e.target.value) || 0)}
                          placeholder="Hrs"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.rate || 0}
                          onChange={e => updateItem(globalIdx, "rate", parseFloat(e.target.value) || 0)}
                          placeholder="£/hr"
                          className="h-8 text-xs"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={e => updateItem(globalIdx, "quantity", parseFloat(e.target.value) || 0)}
                          placeholder="Qty"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={item.unitPrice}
                          onChange={e => updateItem(globalIdx, "unitPrice", parseFloat(e.target.value) || 0)}
                          placeholder="£"
                          className="h-8 text-xs"
                        />
                      </div>
                    </>
                  )}
                  <div className="col-span-2 text-right font-medium text-xs">
                    {formatCurrency(item.total)}
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => removeItem(globalIdx)}
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Generate Invoice
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create Professional Invoice</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4 pb-4">
            {/* Company & Customer in 2 cols */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Your Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    value={company.name}
                    onChange={e => setCompany({ ...company, name: e.target.value })}
                    placeholder="Company Name"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={company.address}
                    onChange={e => setCompany({ ...company, address: e.target.value })}
                    placeholder="Address"
                    className="h-8 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={company.phone}
                      onChange={e => setCompany({ ...company, phone: e.target.value })}
                      placeholder="Phone"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={company.email}
                      onChange={e => setCompany({ ...company, email: e.target.value })}
                      placeholder="Email"
                      className="h-8 text-sm"
                    />
                  </div>
                  <Input
                    value={company.vatNumber}
                    onChange={e => setCompany({ ...company, vatNumber: e.target.value })}
                    placeholder="VAT Number (optional)"
                    className="h-8 text-sm"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Customer Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Input
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Customer Name *"
                    className="h-8 text-sm"
                  />
                  <Input
                    value={customer.address}
                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                    placeholder="Address"
                    className="h-8 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={customer.phone}
                      onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="Phone"
                      className="h-8 text-sm"
                    />
                    <Input
                      value={customer.email}
                      onChange={e => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="Email"
                      className="h-8 text-sm"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Job Reference</Label>
                <Input
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="JOB-001"
                  className="h-8 text-sm mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Project Description</Label>
                <Input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief description of work"
                  className="h-8 text-sm mt-1"
                />
              </div>
            </div>

            {/* Line Items by Category */}
            <ItemsSection title="Labour" category="labour" categoryItems={labourItems} icon={Clock} />
            <ItemsSection title="Materials" category="materials" categoryItems={materialItems} icon={Package} />
            <ItemsSection title="Plant & Equipment" category="plant" categoryItems={plantItems} icon={Wrench} />

            {/* Summary */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Labour Hours</p>
                    <p className="text-lg font-bold">{totalLabourHours}h</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Labour</p>
                    <p className="text-lg font-bold">{formatCurrency(labourTotal)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Materials</p>
                    <p className="text-lg font-bold">{formatCurrency(materialsTotal)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Plant</p>
                    <p className="text-lg font-bold">{formatCurrency(plantTotal)}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-24">Payment Terms</Label>
                      <Select value={paymentTerms.toString()} onValueChange={v => setPaymentTerms(parseInt(v))}>
                        <SelectTrigger className="h-8 text-xs flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="14">14 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-24">Retention %</Label>
                      <Input
                        type="number"
                        value={retentionRate}
                        onChange={e => setRetentionRate(parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs flex-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs w-24">VAT %</Label>
                      <Input
                        type="number"
                        value={vatRate}
                        onChange={e => setVatRate(parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {retentionRate > 0 && (
                      <div className="flex justify-between text-warning">
                        <span>Retention ({retentionRate}%)</span>
                        <span>-{formatCurrency(retentionAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>VAT ({vatRate}%)</span>
                      <span>{formatCurrency(vatAmount)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Due</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <div>
              <Label className="text-xs">Additional Notes</Label>
              <Textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="mt-1 text-sm"
                rows={2}
                placeholder="Payment instructions, warranty info, etc."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={handlePrint} variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                onClick={handleSendEmail}
                variant="secondary"
                disabled={sending || !customer.email}
                className="flex-1"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Email
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
