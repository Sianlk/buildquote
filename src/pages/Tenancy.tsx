import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  Home,
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Download,
  Printer,
  Scale,
  Users,
  Calendar,
  ClipboardCheck,
} from "lucide-react";

// Landlord Compliance Checklist - Updated for Renters Reform Act 2024
const LANDLORD_COMPLIANCE_CHECKLIST = [
  {
    id: "gas_safety",
    category: "Safety Certificates",
    item: "Gas Safety Certificate (CP12)",
    requirement: "Annual inspection by Gas Safe registered engineer",
    frequency: "Every 12 months",
    penalty: "Up to £6,000 fine",
    critical: true,
  },
  {
    id: "eicr",
    category: "Safety Certificates",
    item: "Electrical Installation Condition Report (EICR)",
    requirement: "Inspection by qualified electrician",
    frequency: "Every 5 years",
    penalty: "Up to £30,000 fine",
    critical: true,
  },
  {
    id: "epc",
    category: "Safety Certificates",
    item: "Energy Performance Certificate (EPC)",
    requirement: "Minimum rating E (C from 2025 for new tenancies)",
    frequency: "Every 10 years",
    penalty: "Up to £5,000 fine",
    critical: true,
  },
  {
    id: "smoke_alarms",
    category: "Safety Equipment",
    item: "Smoke Alarms",
    requirement: "Working smoke alarm on each storey",
    frequency: "Test at start of each tenancy",
    penalty: "Up to £5,000 fine",
    critical: true,
  },
  {
    id: "co_alarms",
    category: "Safety Equipment",
    item: "Carbon Monoxide Alarms",
    requirement: "In any room with solid fuel burning appliance or gas appliance",
    frequency: "Test at start of each tenancy",
    penalty: "Up to £5,000 fine",
    critical: true,
  },
  {
    id: "deposit_protection",
    category: "Deposit",
    item: "Deposit Protection",
    requirement: "Protect in government-approved scheme within 30 days",
    frequency: "Within 30 days of receipt",
    penalty: "Up to 3x deposit",
    critical: true,
  },
  {
    id: "deposit_certificate",
    category: "Deposit",
    item: "Prescribed Information",
    requirement: "Provide deposit certificate and prescribed information",
    frequency: "Within 30 days of protection",
    penalty: "Cannot serve Section 21",
    critical: true,
  },
  {
    id: "how_to_rent",
    category: "Documentation",
    item: "How to Rent Guide",
    requirement: "Provide latest government checklist to tenant",
    frequency: "At start of tenancy",
    penalty: "Cannot serve Section 21",
    critical: true,
  },
  {
    id: "right_to_rent",
    category: "Documentation",
    item: "Right to Rent Check",
    requirement: "Verify tenant's immigration status",
    frequency: "Before tenancy starts",
    penalty: "Up to £3,000 per tenant",
    critical: true,
  },
  {
    id: "legionella",
    category: "Health & Safety",
    item: "Legionella Risk Assessment",
    requirement: "Assess and control legionella risk in water systems",
    frequency: "Before letting, review annually",
    penalty: "Civil and criminal liability",
    critical: false,
  },
  {
    id: "hhsrs",
    category: "Health & Safety",
    item: "HHSRS Compliance",
    requirement: "Property free from Category 1 hazards",
    frequency: "Ongoing",
    penalty: "Improvement notice or prosecution",
    critical: true,
  },
  {
    id: "selective_licence",
    category: "Licensing",
    item: "Selective Licensing (if applicable)",
    requirement: "Check if property is in selective licensing area",
    frequency: "Before letting",
    penalty: "Up to £30,000 fine",
    critical: false,
  },
  {
    id: "hmo_licence",
    category: "Licensing",
    item: "HMO Licence (if applicable)",
    requirement: "Mandatory for 5+ tenants from 2+ households",
    frequency: "Every 5 years",
    penalty: "Up to £30,000 fine",
    critical: false,
  },
];

// AST Template sections
const AST_SECTIONS = [
  { id: "parties", title: "Parties to the Agreement", required: true },
  { id: "property", title: "Property Details", required: true },
  { id: "term", title: "Term of Tenancy", required: true },
  { id: "rent", title: "Rent and Payment Terms", required: true },
  { id: "deposit", title: "Deposit", required: true },
  { id: "obligations_tenant", title: "Tenant's Obligations", required: true },
  { id: "obligations_landlord", title: "Landlord's Obligations", required: true },
  { id: "break_clause", title: "Break Clause", required: false },
  { id: "inventory", title: "Inventory Reference", required: true },
  { id: "notices", title: "Notices", required: true },
  { id: "signatures", title: "Signatures", required: true },
];

export default function Tenancy() {
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);
  const [astDialogOpen, setAstDialogOpen] = useState(false);
  const [s21DialogOpen, setS21DialogOpen] = useState(false);
  
  // AST Form state
  const [landlordName, setLandlordName] = useState("");
  const [landlordAddress, setLandlordAddress] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [rentFrequency, setRentFrequency] = useState("monthly");
  const [depositAmount, setDepositAmount] = useState("");
  const [tenancyStartDate, setTenancyStartDate] = useState("");
  const [tenancyTerm, setTenancyTerm] = useState("12");

  const toggleCheck = (checkId: string) => {
    setCompletedChecks(prev =>
      prev.includes(checkId)
        ? prev.filter(id => id !== checkId)
        : [...prev, checkId]
    );
  };

  const criticalChecks = LANDLORD_COMPLIANCE_CHECKLIST.filter(c => c.critical);
  const completedCritical = criticalChecks.filter(c => completedChecks.includes(c.id)).length;
  const compliancePercent = (completedChecks.length / LANDLORD_COMPLIANCE_CHECKLIST.length) * 100;

  const generateAST = () => {
    if (!landlordName || !tenantName || !propertyAddress || !rentAmount || !tenancyStartDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const astHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Assured Shorthold Tenancy Agreement</title>
        <style>
          body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
          h1 { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; }
          h2 { margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
          .parties { background: #f5f5f5; padding: 20px; margin: 20px 0; }
          .clause { margin: 15px 0; }
          .signature-block { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature-line { width: 45%; }
          .signature-line hr { margin: 40px 0 10px; }
          .important { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>ASSURED SHORTHOLD TENANCY AGREEMENT</h1>
        <p style="text-align: center;">Made in accordance with the Housing Act 1988 (as amended)</p>
        
        <div class="parties">
          <h2>1. PARTIES</h2>
          <p><strong>LANDLORD:</strong> ${landlordName}</p>
          <p>Address: ${landlordAddress}</p>
          <p><strong>TENANT:</strong> ${tenantName}</p>
        </div>
        
        <h2>2. PROPERTY</h2>
        <p>The property known as: <strong>${propertyAddress}</strong></p>
        <p>Together with the fixtures, fittings and furniture as listed in the inventory.</p>
        
        <h2>3. TERM</h2>
        <p>The tenancy shall be for a fixed term of <strong>${tenancyTerm} months</strong> commencing on <strong>${new Date(tenancyStartDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.</p>
        <p>After the fixed term, the tenancy will continue on a rolling periodic basis until terminated by either party giving the appropriate notice.</p>
        
        <h2>4. RENT</h2>
        <p>The rent shall be <strong>£${rentAmount}</strong> per ${rentFrequency}, payable in advance.</p>
        <p>The first payment is due on ${new Date(tenancyStartDate).toLocaleDateString('en-GB')} and subsequent payments on the same date each ${rentFrequency === 'monthly' ? 'month' : 'week'}.</p>
        
        <h2>5. DEPOSIT</h2>
        <p>The Tenant shall pay a deposit of <strong>£${depositAmount}</strong>.</p>
        <p>This deposit will be protected in a government-approved tenancy deposit scheme within 30 days of receipt and the prescribed information will be provided to the Tenant.</p>
        
        <div class="important">
          <strong>Important Notice:</strong> Under the Renters Reform Act 2024, landlords must not require a deposit exceeding 5 weeks' rent (where annual rent is under £50,000).
        </div>
        
        <h2>6. TENANT'S OBLIGATIONS</h2>
        <p>The Tenant agrees to:</p>
        <ul>
          <li>Pay the rent on time and in the manner specified</li>
          <li>Keep the Property clean and in good condition</li>
          <li>Not cause nuisance or annoyance to neighbours</li>
          <li>Not make alterations without written consent</li>
          <li>Allow access for inspections with reasonable notice (minimum 24 hours)</li>
          <li>Report any disrepair or damage promptly</li>
          <li>Use the Property as a private residence only</li>
        </ul>
        
        <h2>7. LANDLORD'S OBLIGATIONS</h2>
        <p>The Landlord agrees to:</p>
        <ul>
          <li>Keep the structure and exterior in repair</li>
          <li>Keep installations for water, gas, electricity, and sanitation in repair</li>
          <li>Keep heating and hot water installations in repair</li>
          <li>Ensure the Property meets minimum safety standards</li>
          <li>Provide valid Gas Safety Certificate, EICR, and EPC</li>
          <li>Protect the deposit in an approved scheme</li>
          <li>Give proper notice before any inspections or works</li>
        </ul>
        
        <h2>8. NOTICES</h2>
        <p>Any notice required under this agreement must be in writing and delivered to the address specified for service.</p>
        
        <div class="important">
          <strong>Renters Reform Act 2024:</strong> Section 21 "no-fault" evictions are being abolished. Landlords must use Section 8 grounds to regain possession.
        </div>
        
        <div class="signature-block">
          <div class="signature-line">
            <hr />
            <p>Landlord Signature</p>
            <p>Date: _______________</p>
          </div>
          <div class="signature-line">
            <hr />
            <p>Tenant Signature</p>
            <p>Date: _______________</p>
          </div>
        </div>
        
        <div class="footer">
          <p>This is a legally binding document. Both parties should keep a signed copy.</p>
          <p>Generated by BuildQuote • ${new Date().toLocaleDateString('en-GB')}</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([astHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AST-${propertyAddress.replace(/[^a-z0-9]/gi, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Tenancy agreement downloaded");
    setAstDialogOpen(false);
  };

  const generateS21 = () => {
    // Note: Under Renters Reform Act 2024, Section 21 is being abolished
    toast.info("Section 21 notices are being phased out under the Renters Reform Act 2024. Consider using Section 8 grounds instead.");
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <Home className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tenancy & Legal</h1>
            <p className="text-muted-foreground">
              Document templates and landlord compliance checklists
            </p>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Renters Reform Act 2024:</strong> Significant changes to landlord-tenant law are in effect. Section 21 "no-fault" evictions are being abolished. Always seek legal advice for specific situations.
          </AlertDescription>
        </Alert>

        {/* Compliance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Compliance Score</p>
                  <p className="text-xl font-bold">{compliancePercent.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Critical Items</p>
                  <p className="text-xl font-bold">{completedCritical}/{criticalChecks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Completed</p>
                  <p className="text-xl font-bold">{completedChecks.length}/{LANDLORD_COMPLIANCE_CHECKLIST.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="compliance" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="renters-rights" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Renters Rights
            </TabsTrigger>
            <TabsTrigger value="hmo" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              HMO Guide
            </TabsTrigger>
          </TabsList>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Landlord Compliance Checklist</CardTitle>
                <CardDescription>
                  Essential requirements for legal letting in England
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Safety Certificates", "Safety Equipment", "Deposit", "Documentation", "Health & Safety", "Licensing"].map(category => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3">{category}</h3>
                      <div className="space-y-2">
                        {LANDLORD_COMPLIANCE_CHECKLIST.filter(c => c.category === category).map(check => (
                          <div
                            key={check.id}
                            className={`p-4 rounded-lg border ${
                              completedChecks.includes(check.id) 
                                ? "bg-success/5 border-success/20" 
                                : check.critical 
                                ? "bg-destructive/5 border-destructive/20"
                                : "bg-muted/30"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox
                                id={check.id}
                                checked={completedChecks.includes(check.id)}
                                onCheckedChange={() => toggleCheck(check.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <label htmlFor={check.id} className="font-medium cursor-pointer">
                                    {check.item}
                                  </label>
                                  {check.critical && (
                                    <Badge variant="destructive" className="text-xs">Required</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{check.requirement}</p>
                                <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                  <Badge variant="outline">{check.frequency}</Badge>
                                  <Badge variant="secondary" className="text-destructive">
                                    Penalty: {check.penalty}
                                  </Badge>
                                </div>
                              </div>
                              {completedChecks.includes(check.id) && (
                                <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* AST Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tenancy Agreement
                  </CardTitle>
                  <CardDescription>
                    Generate an Assured Shorthold Tenancy agreement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={astDialogOpen} onOpenChange={setAstDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Create AST</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                      <DialogHeader>
                        <DialogTitle>Generate Tenancy Agreement</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="flex-1 pr-4">
                        <div className="space-y-4 pb-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Landlord Name *</Label>
                              <Input
                                value={landlordName}
                                onChange={(e) => setLandlordName(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Landlord Address</Label>
                              <Input
                                value={landlordAddress}
                                onChange={(e) => setLandlordAddress(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Tenant Name(s) *</Label>
                            <Input
                              value={tenantName}
                              onChange={(e) => setTenantName(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>Property Address *</Label>
                            <Textarea
                              value={propertyAddress}
                              onChange={(e) => setPropertyAddress(e.target.value)}
                              className="mt-1"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Monthly Rent (£) *</Label>
                              <Input
                                type="number"
                                value={rentAmount}
                                onChange={(e) => setRentAmount(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Deposit (£)</Label>
                              <Input
                                type="number"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                                className="mt-1"
                                placeholder="Max 5 weeks rent"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Start Date *</Label>
                              <Input
                                type="date"
                                value={tenancyStartDate}
                                onChange={(e) => setTenancyStartDate(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Term (months)</Label>
                              <Input
                                type="number"
                                value={tenancyTerm}
                                onChange={(e) => setTenancyTerm(e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <Button onClick={generateAST} className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Generate & Download AST
                          </Button>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* Section 21 Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Section 21 Notice
                  </CardTitle>
                  <CardDescription>
                    Being abolished under Renters Reform Act 2024
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={generateS21} disabled>
                    <span className="line-through">Create Section 21</span>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    No-fault evictions are being phased out. Use Section 8 grounds instead.
                  </p>
                </CardContent>
              </Card>

              {/* Section 8 Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Section 8 Grounds
                  </CardTitle>
                  <CardDescription>
                    Grounds for possession under Housing Act 1988
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Grounds
                  </Button>
                </CardContent>
              </Card>

              {/* Inventory Template */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Inventory Template
                  </CardTitle>
                  <CardDescription>
                    Document property condition at start/end
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Download Template
                  </Button>
                </CardContent>
              </Card>

              {/* How to Rent Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    How to Rent Guide
                  </CardTitle>
                  <CardDescription>
                    Government checklist (required for all tenancies)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open("https://www.gov.uk/government/publications/how-to-rent", "_blank")}
                  >
                    View on GOV.UK
                  </Button>
                </CardContent>
              </Card>

              {/* Rent Increase Notice */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Rent Increase Notice
                  </CardTitle>
                  <CardDescription>
                    Section 13 notice for rent increases
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Create Notice
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Renters Rights Tab */}
          <TabsContent value="renters-rights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Renters Reform Act 2024 - Key Changes</CardTitle>
                <CardDescription>
                  Major changes to the private rented sector
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: "Abolition of Section 21",
                    description: "No-fault evictions are being phased out. Landlords must use Section 8 grounds with valid reasons.",
                    impact: "Landlords",
                  },
                  {
                    title: "Periodic Tenancies",
                    description: "All assured tenancies will become periodic from the start. Fixed terms are being abolished.",
                    impact: "Both",
                  },
                  {
                    title: "Pet Requests",
                    description: "Tenants have the right to request pets. Landlords cannot unreasonably refuse.",
                    impact: "Tenants",
                  },
                  {
                    title: "Decent Homes Standard",
                    description: "The Decent Homes Standard will apply to the private rented sector.",
                    impact: "Landlords",
                  },
                  {
                    title: "Private Rented Sector Ombudsman",
                    description: "All landlords must register with the new PRS Ombudsman.",
                    impact: "Landlords",
                  },
                  {
                    title: "Rent Increases",
                    description: "Rent can only be increased once per year via Section 13 notice.",
                    impact: "Both",
                  },
                  {
                    title: "Property Portal",
                    description: "Landlords must register on the new property portal.",
                    impact: "Landlords",
                  },
                ].map((change, idx) => (
                  <div key={idx} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{change.title}</h4>
                      <Badge variant={change.impact === "Landlords" ? "destructive" : change.impact === "Tenants" ? "default" : "secondary"}>
                        {change.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{change.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* HMO Tab */}
          <TabsContent value="hmo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>HMO Licensing Requirements</CardTitle>
                <CardDescription>
                  Houses in Multiple Occupation regulations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    A mandatory HMO licence is required if 5 or more tenants from 2 or more households share facilities.
                  </AlertDescription>
                </Alert>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: "Room Sizes", items: ["Single bedroom: 6.51m² minimum", "Double bedroom: 10.22m² minimum", "Shared kitchen: 7m² + 3m² per person over 5"] },
                    { title: "Fire Safety", items: ["Fire doors to all rooms", "Smoke alarms on each floor", "Fire blanket in kitchen", "Emergency lighting"] },
                    { title: "Kitchen Facilities", items: ["1 cooker per 5 people", "1 sink per 5 people", "1 fridge per 5 people", "Adequate storage"] },
                    { title: "Bathroom Facilities", items: ["1 bathroom per 5 people", "1 WC per 5 people", "Hot and cold water", "Adequate ventilation"] },
                  ].map((section, idx) => (
                    <Card key={idx}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{section.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3 w-3 text-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
