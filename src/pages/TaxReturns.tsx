import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Calculator,
  FileText,
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  AlertCircle,
  CheckCircle,
  Download,
  Loader2,
  Info,
} from "lucide-react";

// UK Tax Rates 2024/25 (applicable for self assessment in Jan 2026)
const TAX_RATES = {
  personalAllowance: 12570,
  basicRateThreshold: 50270,
  higherRateThreshold: 125140,
  basicRate: 0.20,
  higherRate: 0.40,
  additionalRate: 0.45,
  class2NI: 3.45 * 52, // Weekly rate x 52
  class4NI: {
    threshold: 12570,
    upperLimit: 50270,
    rate1: 0.09,
    rate2: 0.02,
  },
  vatThreshold: 90000,
  vatFlatRate: {
    'construction': 0.095,
    'plumbing': 0.095,
    'electrical': 0.095,
    'general_contractor': 0.095,
    'default': 0.12,
  },
};

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

export default function TaxReturns() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState("2024/2025");
  
  // Manual income input for additional sources
  const [additionalIncome, setAdditionalIncome] = useState(0);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    const [receiptsRes, jobsRes] = await Promise.all([
      supabase.from("trade_receipts").select("*").eq("user_id", user.id),
      supabase.from("trade_jobs").select("*").eq("user_id", user.id).eq("status", "completed"),
    ]);
    
    if (receiptsRes.data) setReceipts(receiptsRes.data);
    if (jobsRes.data) setJobs(jobsRes.data);
    setLoading(false);
  };

  // Filter by tax year
  const yearReceipts = receipts.filter(r => r.tax_year === selectedYear);
  const yearJobs = jobs.filter(j => {
    const date = new Date(j.completion_date || j.created_at);
    const year = date.getFullYear();
    const month = date.getMonth();
    const taxYear = month >= 3 ? `${year}/${year + 1}` : `${year - 1}/${year}`;
    return taxYear === selectedYear;
  });

  // Calculate totals
  const totalIncome = yearJobs.reduce((sum, j) => sum + (j.customer_price || 0), 0) + additionalIncome;
  const totalExpenses = yearReceipts
    .filter(r => r.receipt_type === "expense")
    .reduce((sum, r) => sum + (r.gross_amount || 0), 0);
  const totalVatPaid = yearReceipts
    .filter(r => r.receipt_type === "expense")
    .reduce((sum, r) => sum + (r.vat_amount || 0), 0);
  
  const profit = totalIncome - totalExpenses;
  
  // Calculate tax
  const calculateIncomeTax = (income: number) => {
    if (income <= TAX_RATES.personalAllowance) return 0;
    
    let tax = 0;
    let taxableIncome = income - TAX_RATES.personalAllowance;
    
    // Reduce personal allowance for high earners
    if (income > 100000) {
      const reduction = Math.min((income - 100000) / 2, TAX_RATES.personalAllowance);
      taxableIncome = income - (TAX_RATES.personalAllowance - reduction);
    }
    
    // Basic rate
    const basicRateBand = Math.min(taxableIncome, TAX_RATES.basicRateThreshold - TAX_RATES.personalAllowance);
    tax += basicRateBand * TAX_RATES.basicRate;
    
    // Higher rate
    if (taxableIncome > basicRateBand) {
      const higherRateBand = Math.min(taxableIncome - basicRateBand, TAX_RATES.higherRateThreshold - TAX_RATES.basicRateThreshold);
      tax += higherRateBand * TAX_RATES.higherRate;
    }
    
    // Additional rate
    if (taxableIncome > TAX_RATES.higherRateThreshold - TAX_RATES.personalAllowance) {
      const additionalBand = taxableIncome - (TAX_RATES.higherRateThreshold - TAX_RATES.personalAllowance);
      tax += additionalBand * TAX_RATES.additionalRate;
    }
    
    return Math.max(0, tax);
  };

  const calculateNI = (profit: number) => {
    let ni = 0;
    
    // Class 2 NI (flat rate if profit > £6,725)
    if (profit > 6725) {
      ni += TAX_RATES.class2NI;
    }
    
    // Class 4 NI
    if (profit > TAX_RATES.class4NI.threshold) {
      const band1 = Math.min(profit, TAX_RATES.class4NI.upperLimit) - TAX_RATES.class4NI.threshold;
      ni += band1 * TAX_RATES.class4NI.rate1;
      
      if (profit > TAX_RATES.class4NI.upperLimit) {
        ni += (profit - TAX_RATES.class4NI.upperLimit) * TAX_RATES.class4NI.rate2;
      }
    }
    
    return Math.max(0, ni);
  };

  const incomeTax = calculateIncomeTax(profit);
  const nationalInsurance = calculateNI(profit);
  const totalTaxDue = incomeTax + nationalInsurance;
  const netProfit = profit - totalTaxDue;
  
  // VAT calculations
  const vatCollected = yearJobs.reduce((sum, j) => sum + ((j.customer_price || 0) * 0.2), 0);
  const vatLiability = vatCollected - totalVatPaid;
  const isVatRegistered = totalIncome >= TAX_RATES.vatThreshold;

  // Expense breakdown
  const expenseByCategory = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: yearReceipts
      .filter(r => r.category === cat.id)
      .reduce((sum, r) => sum + (r.gross_amount || 0), 0)
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

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
            <h1 className="text-xl md:text-2xl font-bold">Tax Returns</h1>
            <p className="text-sm text-muted-foreground">
              Self Assessment calculation based on UK tax rates
            </p>
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024/2025">2024/25</SelectItem>
                <SelectItem value="2023/2024">2023/24</SelectItem>
                <SelectItem value="2022/2023">2022/23</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </div>
        
        {/* Tax Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <TrendingUp className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Income</p>
                  <p className="text-xl font-bold">£{totalIncome.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                  <PiggyBank className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Net Profit</p>
                  <p className="text-xl font-bold">£{profit.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-warning/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <Calculator className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Tax Due</p>
                  <p className="text-xl font-bold text-warning">£{totalTaxDue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Tax Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span>Gross Income</span>
                  <span className="font-mono">£{totalIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-muted-foreground">
                  <span>Less: Allowable Expenses</span>
                  <span className="font-mono">-£{totalExpenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b font-medium">
                  <span>Taxable Profit</span>
                  <span className="font-mono">£{profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-muted-foreground">
                  <span>Personal Allowance</span>
                  <span className="font-mono">-£{TAX_RATES.personalAllowance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Income Tax (Basic Rate 20%)</span>
                  <span className="font-mono text-destructive">£{incomeTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>National Insurance (Class 2 + 4)</span>
                  <span className="font-mono text-destructive">£{nationalInsurance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-lg">
                  <span>Total Tax Due</span>
                  <span className="font-mono text-warning">£{totalTaxDue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-t font-bold text-lg text-success">
                  <span>After Tax Profit</span>
                  <span className="font-mono">£{netProfit.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Payment on Account */}
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 text-primary" />
                  Payment on Account
                </div>
                <p className="text-xs text-muted-foreground">
                  If this is your first year or tax bill is over £1,000, you may need to make payments on account:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">31 January</p>
                    <p className="font-medium">£{(totalTaxDue * 0.5).toLocaleString()}</p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs text-muted-foreground">31 July</p>
                    <p className="font-medium">£{(totalTaxDue * 0.5).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* VAT Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                VAT Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className={`p-4 rounded-lg ${isVatRegistered ? "bg-warning/10 border border-warning/50" : "bg-muted/50"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isVatRegistered ? (
                    <AlertCircle className="h-5 w-5 text-warning" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                  <span className="font-medium">
                    {isVatRegistered ? "VAT Registration Required" : "Below VAT Threshold"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  VAT registration threshold: £{TAX_RATES.vatThreshold.toLocaleString()}/year
                </p>
                <Progress 
                  value={Math.min(100, (totalIncome / TAX_RATES.vatThreshold) * 100)} 
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your income: £{totalIncome.toLocaleString()} ({((totalIncome / TAX_RATES.vatThreshold) * 100).toFixed(0)}% of threshold)
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span>VAT Collected (on invoices)</span>
                  <span className="font-mono">£{vatCollected.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b text-muted-foreground">
                  <span>VAT Paid (on expenses)</span>
                  <span className="font-mono">-£{totalVatPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 font-medium">
                  <span>VAT Liability</span>
                  <span className={`font-mono ${vatLiability >= 0 ? "text-destructive" : "text-success"}`}>
                    £{vatLiability.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5 space-y-2">
                <p className="text-sm font-medium">Flat Rate Scheme Option</p>
                <p className="text-xs text-muted-foreground">
                  Construction trades can use 9.5% flat rate scheme. You'd pay:
                </p>
                <p className="font-medium">
                  £{(totalIncome * 0.095).toLocaleString()} (vs £{vatLiability.toLocaleString()} standard)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Expense Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Allowable Expenses Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {expenseByCategory.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No expenses recorded for this tax year
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {expenseByCategory.map((cat) => (
                  <div key={cat.id} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm">{cat.name}</span>
                      <Badge variant="outline">
                        {((cat.total / totalExpenses) * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <p className="text-xl font-bold">£{cat.total.toLocaleString()}</p>
                    <Progress 
                      value={(cat.total / totalExpenses) * 100} 
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Key Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Important Deadlines - Tax Year {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Online Filing Deadline</span>
                </div>
                <p className="text-2xl font-bold">31 January 2026</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Submit your self assessment online
                </p>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-5 w-5 text-warning" />
                  <span className="font-medium">Payment Due</span>
                </div>
                <p className="text-2xl font-bold">31 January 2026</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pay any tax owed for {selectedYear}
                </p>
              </div>
              
              <div className="p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <span className="font-medium">Late Penalty</span>
                </div>
                <p className="text-2xl font-bold">£100+</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Initial penalty for late filing
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
