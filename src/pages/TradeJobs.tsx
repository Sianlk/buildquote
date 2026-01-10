import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Wrench,
  Zap,
  Hammer,
  PaintBucket,
  Palette,
  Grid3X3,
  Home,
  Square,
  Shovel,
  Plus,
  Calculator,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Printer,
  Download,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import { TRADE_CATEGORIES, calculateJobCost, getJobsForTrade, TradeJob } from "@/lib/trade-jobs-data";
import { MaterialsShoppingList } from "@/components/materials/MaterialsShoppingList";
import { QuoteGenerator } from "@/components/quotes/QuoteGenerator";
import { MaterialItem, consolidateMaterials, generateSupplierOrders } from "@/lib/materials-shopping-list";

const TRADE_ICONS: Record<string, any> = {
  plumbing: Wrench,
  electrical: Zap,
  carpentry: Hammer,
  plastering: PaintBucket,
  decorating: Palette,
  tiling: Grid3X3,
  roofing: Home,
  bricklaying: Square,
  groundworks: Shovel,
};

const STATUS_CONFIG = {
  quoted: { label: "Quoted", color: "bg-muted text-muted-foreground", icon: FileText },
  accepted: { label: "Accepted", color: "bg-primary/10 text-primary", icon: CheckCircle },
  in_progress: { label: "In Progress", color: "bg-warning/10 text-warning", icon: Clock },
  completed: { label: "Completed", color: "bg-success/10 text-success", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-destructive/10 text-destructive", icon: AlertCircle },
};

export default function TradeJobs() {
  const { user } = useAuth();
  const [selectedTrade, setSelectedTrade] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isTradePrice, setIsTradePrice] = useState(true);
  const [calculatedCost, setCalculatedCost] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Customer details
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [notes, setNotes] = useState("");
  const [markup, setMarkup] = useState(20);
  
  // Saved jobs
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showQuoteGenerator, setShowQuoteGenerator] = useState(false);

  useEffect(() => {
    if (user) fetchSavedJobs();
  }, [user]);

  const fetchSavedJobs = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("trade_jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSavedJobs(data);
    setLoadingJobs(false);
  };

  const handleCalculate = () => {
    if (!selectedTrade || !selectedJob) {
      toast.error("Please select a trade and job type");
      return;
    }
    const cost = calculateJobCost(selectedTrade, selectedJob, isTradePrice, quantity);
    setCalculatedCost(cost);
  };

  const handleSaveJob = async () => {
    if (!calculatedCost || !user) return;
    
    setSaving(true);
    const customerPrice = calculatedCost.totalCost * (1 + markup / 100);
    
    try {
      const { error } = await supabase.from("trade_jobs").insert({
        user_id: user.id,
        trade: selectedTrade,
        job_type: selectedJob,
        job_description: calculatedCost.job,
        customer_name: customerName,
        customer_address: customerAddress,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        materials: calculatedCost.materials,
        labour_hours: calculatedCost.labourHours,
        labour_rate: calculatedCost.labourRate,
        materials_cost: calculatedCost.materialsCost,
        total_cost: calculatedCost.totalCost,
        customer_price: customerPrice,
        profit_margin: markup,
        job_date: jobDate || null,
        notes: notes,
        status: "quoted",
      });
      
      if (error) throw error;
      toast.success("Job saved successfully");
      setDialogOpen(false);
      resetForm();
      fetchSavedJobs();
    } catch (error: any) {
      toast.error(error.message || "Failed to save job");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedTrade("");
    setSelectedJob("");
    setQuantity(1);
    setCalculatedCost(null);
    setCustomerName("");
    setCustomerAddress("");
    setCustomerPhone("");
    setCustomerEmail("");
    setJobDate("");
    setNotes("");
    setMarkup(20);
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    const updates: any = { status };
    if (status === "completed") {
      updates.completion_date = new Date().toISOString().split("T")[0];
    }
    
    const { error } = await supabase
      .from("trade_jobs")
      .update(updates)
      .eq("id", jobId);
    
    if (error) {
      toast.error("Failed to update job");
    } else {
      toast.success("Job updated");
      fetchSavedJobs();
    }
  };

  const jobs = selectedTrade ? getJobsForTrade(selectedTrade) : [];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Trade Jobs Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Calculate materials, labour, and create customer quotes
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Job Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Create Job Quote</DialogTitle>
              </DialogHeader>
              
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-6 pb-4">
                  {/* Trade & Job Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Trade</Label>
                      <Select value={selectedTrade} onValueChange={(v) => { setSelectedTrade(v); setSelectedJob(""); setCalculatedCost(null); }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select trade" />
                        </SelectTrigger>
                        <SelectContent>
                          {TRADE_CATEGORIES.map((trade) => (
                            <SelectItem key={trade.id} value={trade.id}>
                              {trade.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Job Type</Label>
                      <Select value={selectedJob} onValueChange={(v) => { setSelectedJob(v); setCalculatedCost(null); }} disabled={!selectedTrade}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select job" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobs.map((job) => (
                            <SelectItem key={job.id} value={job.id}>
                              {job.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => { setQuantity(parseInt(e.target.value) || 1); setCalculatedCost(null); }}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isTradePrice ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setIsTradePrice(true); setCalculatedCost(null); }}
                      >
                        Trade Prices
                      </Button>
                      <Button
                        variant={!isTradePrice ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setIsTradePrice(false); setCalculatedCost(null); }}
                      >
                        Retail Prices
                      </Button>
                    </div>
                    
                    <Button onClick={handleCalculate} disabled={!selectedTrade || !selectedJob}>
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculate
                    </Button>
                  </div>
                  
                  {/* Calculated Results */}
                  {calculatedCost && (
                    <div className="space-y-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{calculatedCost.job}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Cost Summary */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-3 rounded-lg bg-secondary/30">
                              <p className="text-xs text-muted-foreground">Labour Hours</p>
                              <p className="text-lg font-semibold">{calculatedCost.labourHours}h</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30">
                              <p className="text-xs text-muted-foreground">Labour Cost</p>
                              <p className="text-lg font-semibold">£{calculatedCost.labourCost.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-secondary/30">
                              <p className="text-xs text-muted-foreground">Materials Cost</p>
                              <p className="text-lg font-semibold">£{calculatedCost.materialsCost.toFixed(2)}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-primary/10">
                              <p className="text-xs text-muted-foreground">Total Cost</p>
                              <p className="text-lg font-semibold text-primary">£{calculatedCost.totalCost.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          {/* Materials Breakdown */}
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="materials">
                              <AccordionTrigger>Materials Breakdown ({calculatedCost.materials.length} items)</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {calculatedCost.materials.map((mat: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-sm p-2 bg-muted/30 rounded">
                                      <span>{mat.name}</span>
                                      <span className="text-muted-foreground">
                                        {mat.totalQuantity} {mat.unit} × £{(isTradePrice ? mat.unitCostTrade : mat.unitCostRetail).toFixed(2)} = <span className="text-foreground font-medium">£{mat.totalCost.toFixed(2)}</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="tools">
                              <AccordionTrigger>Tools Required ({calculatedCost.tools.length})</AccordionTrigger>
                              <AccordionContent>
                                <div className="flex flex-wrap gap-2">
                                  {calculatedCost.tools.map((tool: string, idx: number) => (
                                    <Badge key={idx} variant="outline">{tool}</Badge>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="instructions">
                              <AccordionTrigger>Step-by-Step Instructions</AccordionTrigger>
                              <AccordionContent>
                                <ol className="space-y-2 text-sm">
                                  {calculatedCost.instructions.map((step: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
                                        {idx + 1}
                                      </span>
                                      <span>{step.replace(/^\d+\.\s*/, '')}</span>
                                    </li>
                                  ))}
                                </ol>
                              </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="safety">
                              <AccordionTrigger>Safety Notes</AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-1 text-sm">
                                  {calculatedCost.safetyNotes.map((note: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2">
                                      <AlertCircle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                                      <span>{note}</span>
                                    </li>
                                  ))}
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                            
                            {calculatedCost.buildingRegsNotes && (
                              <AccordionItem value="regs">
                                <AccordionTrigger>Building Regulations</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-1 text-sm">
                                    {calculatedCost.buildingRegsNotes.map((note: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-2">
                                        <FileText className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                                        <span>{note}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            )}
                          </Accordion>
                        </CardContent>
                      </Card>
                      
                      {/* Customer Quote Section */}
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Customer Quote</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Customer Name</Label>
                              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1" />
                            </div>
                            <div>
                              <Label>Job Date</Label>
                              <Input type="date" value={jobDate} onChange={(e) => setJobDate(e.target.value)} className="mt-1" />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Address</Label>
                            <Textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="mt-1" rows={2} />
                          </div>
                          
                          <div>
                            <Label>Notes</Label>
                            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" rows={2} />
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <Label>Markup %</Label>
                              <Input
                                type="number"
                                value={markup}
                                onChange={(e) => setMarkup(parseFloat(e.target.value) || 0)}
                                className="mt-1"
                              />
                            </div>
                            <div className="flex-1">
                              <Label>Customer Price</Label>
                              <div className="mt-1 p-3 bg-primary/10 rounded-lg text-center">
                                <span className="text-2xl font-bold text-primary">
                                  £{(calculatedCost.totalCost * (1 + markup / 100)).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <Button onClick={handleSaveJob} className="w-full" disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                            Save Job Quote
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Trade Categories Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {TRADE_CATEGORIES.map((trade) => {
            const Icon = TRADE_ICONS[trade.id] || Wrench;
            return (
              <Card
                key={trade.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => {
                  setSelectedTrade(trade.id);
                  setDialogOpen(true);
                }}
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="p-3 rounded-lg bg-primary/10 mb-2">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{trade.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {trade.jobs.length} job types
                  </p>
                  <p className="text-xs text-primary mt-1">
                    £{trade.hourlyRateRetail}/hr
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Action Buttons for Selected Jobs */}
        {savedJobs.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedJobIds.length} job{selectedJobIds.length !== 1 ? 's' : ''} selected
                  </span>
                  {selectedJobIds.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={() => setSelectedJobIds([])}>
                      Clear
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    disabled={selectedJobIds.length === 0}
                    onClick={() => setShowShoppingList(true)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shopping List
                  </Button>
                  <Button 
                    disabled={selectedJobIds.length === 0}
                    onClick={() => setShowQuoteGenerator(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Quote
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Saved Jobs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-4">
            <JobsList 
              jobs={savedJobs.filter(j => ["quoted", "accepted", "in_progress"].includes(j.status))} 
              loading={loadingJobs}
              onStatusChange={updateJobStatus}
              selectedIds={selectedJobIds}
              onSelectionChange={setSelectedJobIds}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <JobsList 
              jobs={savedJobs.filter(j => j.status === "completed")} 
              loading={loadingJobs}
              onStatusChange={updateJobStatus}
              selectedIds={selectedJobIds}
              onSelectionChange={setSelectedJobIds}
            />
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            <JobsList 
              jobs={savedJobs} 
              loading={loadingJobs}
              onStatusChange={updateJobStatus}
              selectedIds={selectedJobIds}
              onSelectionChange={setSelectedJobIds}
            />
          </TabsContent>
        </Tabs>

        {/* Materials Shopping List Dialog */}
        <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Materials Shopping List</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1">
              <MaterialsShoppingList
                jobMaterials={savedJobs
                  .filter(j => selectedJobIds.includes(j.id))
                  .map(j => ({
                    jobName: j.job_description || j.job_type,
                    materials: (j.materials || []).map((m: any) => ({
                      name: m.name,
                      quantity: m.totalQuantity || m.quantity || 1,
                      unit: m.unit,
                      unitCostTrade: m.unitCostTrade || m.unitCost || 0,
                      unitCostRetail: m.unitCostRetail || m.unitCost || 0
                    }))
                  }))
                }
                isTradePrice={true}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Quote Generator Dialog */}
        <Dialog open={showQuoteGenerator} onOpenChange={setShowQuoteGenerator}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Generate Customer Quote</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1">
              <QuoteGenerator
                initialItems={savedJobs
                  .filter(j => selectedJobIds.includes(j.id))
                  .map(j => ({
                    description: j.job_description || j.job_type,
                    quantity: 1,
                    unit: "job",
                    unitPrice: j.customer_price || j.total_cost || 0,
                    total: j.customer_price || j.total_cost || 0
                  }))
                }
                customerName={savedJobs.find(j => selectedJobIds.includes(j.id))?.customer_name || ""}
                customerAddress={savedJobs.find(j => selectedJobIds.includes(j.id))?.customer_address || ""}
                customerEmail={savedJobs.find(j => selectedJobIds.includes(j.id))?.customer_email || ""}
                customerPhone={savedJobs.find(j => selectedJobIds.includes(j.id))?.customer_phone || ""}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function JobsList({ jobs, loading, onStatusChange, selectedIds, onSelectionChange }: { 
  jobs: any[]; 
  loading: boolean; 
  onStatusChange: (id: string, status: string) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No jobs found</p>
      </div>
    );
  }
  
  const toggleSelection = (jobId: string) => {
    if (selectedIds.includes(jobId)) {
      onSelectionChange(selectedIds.filter(id => id !== jobId));
    } else {
      onSelectionChange([...selectedIds, jobId]);
    }
  };

  return (
    <div className="space-y-3">
      {jobs.map((job) => {
        const status = STATUS_CONFIG[job.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.quoted;
        const StatusIcon = status.icon;
        const isSelected = selectedIds.includes(job.id);
        
        return (
          <Card key={job.id} className={isSelected ? "border-primary" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleSelection(job.id)}
                    className="mt-1"
                  />
                  <div className={`p-2 rounded-lg ${status.color}`}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{job.job_description}</h3>
                    <p className="text-sm text-muted-foreground">{job.customer_name || "No customer"}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline">{job.trade}</Badge>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <p className="text-xl font-bold text-primary">
                    £{(job.customer_price || job.total_cost || 0).toLocaleString()}
                  </p>
                  <div className="flex gap-2">
                    {job.status === "quoted" && (
                      <Button size="sm" variant="outline" onClick={() => onStatusChange(job.id, "accepted")}>
                        Accept
                      </Button>
                    )}
                    {job.status === "accepted" && (
                      <Button size="sm" variant="outline" onClick={() => onStatusChange(job.id, "in_progress")}>
                        Start
                      </Button>
                    )}
                    {job.status === "in_progress" && (
                      <Button size="sm" variant="default" onClick={() => onStatusChange(job.id, "completed")}>
                        Complete
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
