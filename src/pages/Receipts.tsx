import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { ReceiptOCRUpload } from "@/components/receipts/ReceiptOCRUpload";
import {
  Receipt,
  Plus,
  Upload,
  Download,
  Loader2,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  Search,
  Filter,
  Camera,
} from "lucide-react";

const EXPENSE_CATEGORIES = [
  { id: "materials", name: "Materials & Supplies" },
  { id: "tools", name: "Tools & Equipment" },
  { id: "vehicle", name: "Vehicle & Fuel" },
  { id: "insurance", name: "Insurance" },
  { id: "clothing", name: "Workwear & PPE" },
  { id: "training", name: "Training & Courses" },
  { id: "software", name: "Software & Subscriptions" },
  { id: "advertising", name: "Advertising & Marketing" },
  { id: "office", name: "Office & Admin" },
  { id: "phone", name: "Phone & Internet" },
  { id: "subcontractor", name: "Subcontractor Payments" },
  { id: "other", name: "Other Business Expense" },
];

const PAYMENT_METHODS = [
  { id: "card", name: "Debit/Credit Card" },
  { id: "cash", name: "Cash" },
  { id: "bank_transfer", name: "Bank Transfer" },
  { id: "trade_account", name: "Trade Account" },
];

export default function Receipts() {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showOCRUpload, setShowOCRUpload] = useState(false);
  
  // Form state
  const [receiptType, setReceiptType] = useState("expense");
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [netAmount, setNetAmount] = useState("");
  const [vatAmount, setVatAmount] = useState("");
  const [receiptDate, setReceiptDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    if (user) fetchReceipts();
  }, [user]);

  const fetchReceipts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("trade_receipts")
      .select("*")
      .order("receipt_date", { ascending: false });
    if (data) setReceipts(data);
    setLoading(false);
  };

  const getTaxYear = (date: string) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = d.getMonth();
    // UK tax year runs April 6 - April 5
    return month >= 3 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
  };

  const handleSaveReceipt = async () => {
    if (!user || !category || !description || !netAmount) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    const net = parseFloat(netAmount) || 0;
    const vat = parseFloat(vatAmount) || 0;
    
    try {
      const { error } = await supabase.from("trade_receipts").insert({
        user_id: user.id,
        receipt_type: receiptType,
        category,
        supplier,
        description,
        net_amount: net,
        vat_amount: vat,
        gross_amount: net + vat,
        receipt_date: receiptDate,
        payment_method: paymentMethod,
        tax_year: getTaxYear(receiptDate),
        is_claimable: true,
      });
      
      if (error) throw error;
      toast.success("Receipt saved successfully");
      setDialogOpen(false);
      resetForm();
      fetchReceipts();
    } catch (error: any) {
      toast.error(error.message || "Failed to save receipt");
    } finally {
      setSaving(false);
    }
  };

  const handleOCRExtracted = (data: {
    supplier?: string;
    date?: string;
    total?: number;
    vat?: number;
    items?: string[];
    confidence: number;
  }) => {
    if (data.supplier) setSupplier(data.supplier);
    if (data.date) setReceiptDate(data.date);
    if (data.total && data.vat) {
      setNetAmount((data.total - data.vat).toFixed(2));
      setVatAmount(data.vat.toFixed(2));
    } else if (data.total) {
      setNetAmount(data.total.toFixed(2));
    }
    if (data.items && data.items.length > 0) {
      setDescription(data.items.join(", ").slice(0, 100));
    }
    setShowOCRUpload(false);
    setDialogOpen(true);
    toast.success("Receipt data extracted! Please verify and save.");
  };

  const resetForm = () => {
    setReceiptType("expense");
    setCategory("");
    setSupplier("");
    setDescription("");
    setNetAmount("");
    setVatAmount("");
    setReceiptDate(format(new Date(), "yyyy-MM-dd"));
    setPaymentMethod("");
  };

  const filteredReceipts = receipts.filter(r => {
    const matchesSearch = 
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Summary calculations
  const currentTaxYear = getTaxYear(new Date().toISOString());
  const thisYearReceipts = receipts.filter(r => r.tax_year === currentTaxYear);
  
  const totalExpenses = thisYearReceipts
    .filter(r => r.receipt_type === "expense")
    .reduce((sum, r) => sum + (r.gross_amount || 0), 0);
  
  const totalVatPaid = thisYearReceipts
    .filter(r => r.receipt_type === "expense")
    .reduce((sum, r) => sum + (r.vat_amount || 0), 0);

  const categoryTotals = EXPENSE_CATEGORIES.map(cat => {
    const total = thisYearReceipts
      .filter(r => r.category === cat.id)
      .reduce((sum, r) => sum + (r.gross_amount || 0), 0);
    return { ...cat, total };
  }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

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
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Digital Receipts</h1>
            <p className="text-sm text-muted-foreground">
              Track expenses for tax returns • Tax Year: {currentTaxYear}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowOCRUpload(!showOCRUpload)}>
              <Camera className="h-4 w-4 mr-2" />
              Scan Receipt
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Receipt
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Receipt</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={receiptType} onValueChange={setReceiptType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Supplier</Label>
                  <Input
                    placeholder="e.g., Screwfix, Travis Perkins"
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Description *</Label>
                  <Input
                    placeholder="What did you purchase?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Net Amount (£) *</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={netAmount}
                      onChange={(e) => setNetAmount(e.target.value)}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label>VAT Amount (£)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={vatAmount}
                      onChange={(e) => setVatAmount(e.target.value)}
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-secondary/30">
                  <div className="flex justify-between text-sm">
                    <span>Gross Amount</span>
                    <span className="font-mono font-medium">
                      £{((parseFloat(netAmount) || 0) + (parseFloat(vatAmount) || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <Label>Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleSaveReceipt} className="w-full" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Receipt className="h-4 w-4 mr-2" />}
                  Save Receipt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>
        
        {/* OCR Upload Section */}
        {showOCRUpload && (
          <ReceiptOCRUpload onExtracted={handleOCRExtracted} />
        )}
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Expenses</p>
                  <p className="text-xl font-bold">£{totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">VAT Paid</p>
                  <p className="text-xl font-bold">£{totalVatPaid.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Receipt className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Receipts This Year</p>
                  <p className="text-xl font-bold">{thisYearReceipts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Calendar className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tax Year</p>
                  <p className="text-xl font-bold">{currentTaxYear}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Category Breakdown */}
        {categoryTotals.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryTotals.slice(0, 5).map((cat) => (
                  <div key={cat.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{cat.name}</span>
                        <span className="font-medium">£{cat.total.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${Math.min(100, (cat.total / totalExpenses) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search receipts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {EXPENSE_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
        
        {/* Receipts List */}
        {filteredReceipts.length === 0 ? (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="font-semibold mb-2">No receipts found</h3>
            <p className="text-muted-foreground mb-4">
              Start tracking your business expenses for tax returns.
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Receipt
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReceipts.map((receipt) => (
              <Card key={receipt.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${receipt.receipt_type === "expense" ? "bg-destructive/10" : "bg-success/10"}`}>
                        {receipt.receipt_type === "expense" ? (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        ) : (
                          <TrendingUp className="h-5 w-5 text-success" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{receipt.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {receipt.supplier || "No supplier"} • {format(new Date(receipt.receipt_date), "d MMM yyyy")}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">
                            {EXPENSE_CATEGORIES.find(c => c.id === receipt.category)?.name || receipt.category}
                          </Badge>
                          {receipt.vat_amount > 0 && (
                            <Badge variant="secondary">VAT: £{receipt.vat_amount.toFixed(2)}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${receipt.receipt_type === "expense" ? "text-destructive" : "text-success"}`}>
                        {receipt.receipt_type === "expense" ? "-" : "+"}£{receipt.gross_amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Net: £{receipt.net_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
