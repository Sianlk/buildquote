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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Download,
  Eye,
} from "lucide-react";
import {
  QuoteDetails,
  QuoteLineItem,
  CompanyDetails,
  DEFAULT_COMPANY,
  generateQuoteNumber,
  formatCurrency,
  formatDate,
  printQuote,
  downloadQuoteAsHTML,
  generateQuoteHTML,
} from "@/lib/quote-pdf-generator";

interface QuoteGeneratorProps {
  initialItems?: QuoteLineItem[];
  customerName?: string;
  customerAddress?: string;
  customerPhone?: string;
  customerEmail?: string;
  projectDescription?: string;
}

export function QuoteGenerator({
  initialItems = [],
  customerName = "",
  customerAddress = "",
  customerPhone = "",
  customerEmail = "",
  projectDescription = "",
}: QuoteGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [company, setCompany] = useState<CompanyDetails>(DEFAULT_COMPANY);
  const [items, setItems] = useState<QuoteLineItem[]>(initialItems);
  const [customer, setCustomer] = useState({
    name: customerName,
    address: customerAddress,
    phone: customerPhone,
    email: customerEmail,
  });
  const [description, setDescription] = useState(projectDescription);
  const [notes, setNotes] = useState("");
  const [vatRate, setVatRate] = useState(20);
  const [validDays, setValidDays] = useState(30);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unit: "item", unitPrice: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof QuoteLineItem, value: string | number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "quantity" || field === "unitPrice") {
      updated[index].total = updated[index].quantity * updated[index].unitPrice;
    }
    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;

  const buildQuote = (): QuoteDetails => {
    const quoteDate = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);

    return {
      quoteNumber: generateQuoteNumber(),
      quoteDate: quoteDate.toISOString(),
      validUntil: validUntil.toISOString(),
      customerName: customer.name,
      customerAddress: customer.address,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      projectDescription: description,
      items,
      subtotal,
      vatRate,
      vatAmount,
      total,
      notes,
      paymentTerms: "20% deposit, balance on completion",
    };
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
    printQuote(buildQuote(), company);
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
    downloadQuoteAsHTML(buildQuote(), company);
    toast.success("Quote downloaded");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Quote
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Create Professional Quote</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-6 pb-4">
              {/* Company Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Your Company Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <Input
                        value={company.name}
                        onChange={e => setCompany({ ...company, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={company.phone}
                        onChange={e => setCompany({ ...company, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={company.email}
                        onChange={e => setCompany({ ...company, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Website</Label>
                      <Input
                        value={company.website || ""}
                        onChange={e => setCompany({ ...company, website: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address</Label>
                      <Input
                        value={company.address}
                        onChange={e => setCompany({ ...company, address: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>VAT Number (optional)</Label>
                      <Input
                        value={company.vatNumber || ""}
                        onChange={e => setCompany({ ...company, vatNumber: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Company Number (optional)</Label>
                      <Input
                        value={company.companyNumber || ""}
                        onChange={e => setCompany({ ...company, companyNumber: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Customer Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Customer Name *</Label>
                      <Input
                        value={customer.name}
                        onChange={e => setCustomer({ ...customer, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={customer.email}
                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Valid For (days)</Label>
                      <Input
                        type="number"
                        value={validDays}
                        onChange={e => setValidDays(parseInt(e.target.value) || 30)}
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Address</Label>
                      <Textarea
                        value={customer.address}
                        onChange={e => setCustomer({ ...customer, address: e.target.value })}
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Description */}
              <div>
                <Label>Project Description</Label>
                <Textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="mt-1"
                  rows={2}
                  placeholder="Brief description of the work to be carried out..."
                />
              </div>

              {/* Line Items */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Line Items</CardTitle>
                    <Button size="sm" onClick={addItem}>
                      <Plus className="h-4 w-4 mr-1" /> Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="w-20">Qty</TableHead>
                        <TableHead className="w-20">Unit</TableHead>
                        <TableHead className="w-28">Unit Price</TableHead>
                        <TableHead className="w-28">Total</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>
                            <Input
                              value={item.description}
                              onChange={e => updateItem(idx, "description", e.target.value)}
                              placeholder="Item description"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={e => updateItem(idx, "quantity", parseFloat(e.target.value) || 0)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.unit}
                              onChange={e => updateItem(idx, "unit", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.unitPrice}
                              onChange={e => updateItem(idx, "unitPrice", parseFloat(e.target.value) || 0)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(idx)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No items added. Click "Add Item" to start.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Totals */}
                  <div className="flex justify-end mt-4">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>VAT</span>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={vatRate}
                            onChange={e => setVatRate(parseFloat(e.target.value) || 0)}
                            className="w-16 h-8"
                          />
                          <span>%</span>
                          <span>{formatCurrency(vatAmount)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-2">
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="mt-1"
                  rows={2}
                  placeholder="Any additional notes for the customer..."
                />
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setPreviewOpen(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print Quote
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Quote Preview</DialogTitle>
          </DialogHeader>
          <div 
            className="border rounded-lg overflow-hidden"
            dangerouslySetInnerHTML={{ __html: generateQuoteHTML(buildQuote(), company) }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
