import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import {
  Home,
  FileText,
  AlertTriangle,
  Download,
  CheckCircle,
  XCircle,
  Scale,
  Shield,
  Users,
  Calendar,
  ClipboardCheck,
  Flame,
  Thermometer,
  Building,
  Banknote,
  Info,
  ChevronRight,
} from "lucide-react";
import {
  DOCUMENT_TEMPLATES,
  SECTION_8_GROUNDS,
  LANDLORD_COMPLIANCE_CHECKLIST,
  HMO_REQUIREMENTS,
  generateASTTemplate,
  generateSection21Notice,
} from "@/lib/tenancy-legal-data";
import {
  HMO_LICENSE_TYPES,
  FIRE_SAFETY_REQUIREMENTS,
  HHSRS_HAZARDS,
  EPC_REQUIREMENTS,
  DAMP_MOULD_STANDARDS,
  PROPERTY_FINANCE_OPTIONS,
  COMPLIANCE_PATHWAYS,
  LANDLORD_RISK_PROTECTION,
} from "@/lib/hmo-compliance-data";

export default function Tenancy() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [checklistStatus, setChecklistStatus] = useState<Record<string, boolean>>({});
  const [astDialogOpen, setAstDialogOpen] = useState(false);
  const [s21DialogOpen, setS21DialogOpen] = useState(false);

  // AST form state
  const [astForm, setAstForm] = useState({
    landlordName: "",
    landlordAddress: "",
    tenantName: "",
    propertyAddress: "",
    rent: 0,
    depositAmount: 0,
    startDate: new Date().toISOString().split('T')[0],
    paymentDay: 1,
  });

  // S21 form state
  const [s21Form, setS21Form] = useState({
    landlordName: "",
    landlordAddress: "",
    tenantName: "",
    propertyAddress: "",
    dateServed: new Date().toISOString().split('T')[0],
  });

  const handleGenerateAST = () => {
    const content = generateASTTemplate(astForm);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AST_Agreement.txt';
    a.click();
    URL.revokeObjectURL(url);
    setAstDialogOpen(false);
  };

  const handleGenerateS21 = () => {
    const content = generateSection21Notice(s21Form);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Section21_Notice.txt';
    a.click();
    URL.revokeObjectURL(url);
    setS21DialogOpen(false);
  };

  const toggleChecklistItem = (id: string) => {
    setChecklistStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedItems = Object.values(checklistStatus).filter(Boolean).length;
  const totalItems = LANDLORD_COMPLIANCE_CHECKLIST.flatMap(c => c.items).length;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Home className="h-6 w-6" />
              Tenancy & Legal
            </h1>
            <p className="text-sm text-muted-foreground">
              Document templates, compliance checklists & legal notices
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            Renters Reform Act 2024 Compliant
          </Badge>
        </div>

        <Tabs defaultValue="templates">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 w-full h-auto gap-1">
            <TabsTrigger value="templates" className="text-xs px-2 py-1.5">
              <FileText className="h-3 w-3 mr-1 hidden sm:inline" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs px-2 py-1.5">
              <ClipboardCheck className="h-3 w-3 mr-1 hidden sm:inline" />
              Checklist
            </TabsTrigger>
            <TabsTrigger value="hmo" className="text-xs px-2 py-1.5">
              <Users className="h-3 w-3 mr-1 hidden sm:inline" />
              HMO
            </TabsTrigger>
            <TabsTrigger value="fire" className="text-xs px-2 py-1.5">
              <Flame className="h-3 w-3 mr-1 hidden sm:inline" />
              Fire Safety
            </TabsTrigger>
            <TabsTrigger value="hhsrs" className="text-xs px-2 py-1.5">
              <Shield className="h-3 w-3 mr-1 hidden sm:inline" />
              HHSRS
            </TabsTrigger>
            <TabsTrigger value="epc" className="text-xs px-2 py-1.5">
              <Thermometer className="h-3 w-3 mr-1 hidden sm:inline" />
              EPC
            </TabsTrigger>
            <TabsTrigger value="finance" className="text-xs px-2 py-1.5">
              <Banknote className="h-3 w-3 mr-1 hidden sm:inline" />
              Finance
            </TabsTrigger>
            <TabsTrigger value="pathways" className="text-xs px-2 py-1.5">
              <Building className="h-3 w-3 mr-1 hidden sm:inline" />
              Pathways
            </TabsTrigger>
            <TabsTrigger value="section8" className="text-xs px-2 py-1.5">
              <Scale className="h-3 w-3 mr-1 hidden sm:inline" />
              Section 8
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="mt-4 space-y-4">
            {/* Quick Generate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    AST Agreement Generator
                  </CardTitle>
                  <CardDescription>
                    Generate a standard Assured Shorthold Tenancy agreement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={astDialogOpen} onOpenChange={setAstDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">Generate AST</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Generate AST Agreement</DialogTitle>
                      </DialogHeader>
                      <ScrollArea className="max-h-[70vh] pr-4">
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                              <Label>Landlord Name *</Label>
                              <Input
                                value={astForm.landlordName}
                                onChange={(e) => setAstForm(f => ({ ...f, landlordName: e.target.value }))}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Landlord Address *</Label>
                              <Textarea
                                value={astForm.landlordAddress}
                                onChange={(e) => setAstForm(f => ({ ...f, landlordAddress: e.target.value }))}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Tenant Name *</Label>
                              <Input
                                value={astForm.tenantName}
                                onChange={(e) => setAstForm(f => ({ ...f, tenantName: e.target.value }))}
                              />
                            </div>
                            <div className="col-span-2">
                              <Label>Property Address *</Label>
                              <Textarea
                                value={astForm.propertyAddress}
                                onChange={(e) => setAstForm(f => ({ ...f, propertyAddress: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Monthly Rent (£) *</Label>
                              <Input
                                type="number"
                                value={astForm.rent || ""}
                                onChange={(e) => setAstForm(f => ({ ...f, rent: parseFloat(e.target.value) || 0 }))}
                              />
                            </div>
                            <div>
                              <Label>Deposit Amount (£) *</Label>
                              <Input
                                type="number"
                                value={astForm.depositAmount || ""}
                                onChange={(e) => setAstForm(f => ({ ...f, depositAmount: parseFloat(e.target.value) || 0 }))}
                              />
                            </div>
                            <div>
                              <Label>Start Date *</Label>
                              <Input
                                type="date"
                                value={astForm.startDate}
                                onChange={(e) => setAstForm(f => ({ ...f, startDate: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label>Payment Day *</Label>
                              <Input
                                type="number"
                                min={1}
                                max={28}
                                value={astForm.paymentDay}
                                onChange={(e) => setAstForm(f => ({ ...f, paymentDay: parseInt(e.target.value) || 1 }))}
                              />
                            </div>
                          </div>
                          <Button onClick={handleGenerateAST} className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Generate & Download
                          </Button>
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              <Card className="border-warning/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Section 21 Notice
                  </CardTitle>
                  <CardDescription>
                    Generate Form 6A (being phased out under Renters Reform Act)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={s21DialogOpen} onOpenChange={setS21DialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">Generate Section 21</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Generate Section 21 Notice</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="p-3 rounded-lg bg-warning/10 text-warning text-sm">
                          <AlertTriangle className="h-4 w-4 inline mr-2" />
                          Section 21 is being abolished under the Renters Reform Act 2024
                        </div>
                        <div>
                          <Label>Landlord Name *</Label>
                          <Input
                            value={s21Form.landlordName}
                            onChange={(e) => setS21Form(f => ({ ...f, landlordName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Landlord Address *</Label>
                          <Textarea
                            value={s21Form.landlordAddress}
                            onChange={(e) => setS21Form(f => ({ ...f, landlordAddress: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Tenant Name *</Label>
                          <Input
                            value={s21Form.tenantName}
                            onChange={(e) => setS21Form(f => ({ ...f, tenantName: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Property Address *</Label>
                          <Textarea
                            value={s21Form.propertyAddress}
                            onChange={(e) => setS21Form(f => ({ ...f, propertyAddress: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Date Served</Label>
                          <Input
                            type="date"
                            value={s21Form.dateServed}
                            onChange={(e) => setS21Form(f => ({ ...f, dateServed: e.target.value }))}
                          />
                        </div>
                        <Button onClick={handleGenerateS21} className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Generate & Download
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* All Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Document Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {DOCUMENT_TEMPLATES.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                      <p className="text-xs text-muted-foreground">{template.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Landlord Compliance Checklist
                  </CardTitle>
                  <Badge variant={completedItems === totalItems ? "default" : "secondary"}>
                    {completedItems}/{totalItems} Complete
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {LANDLORD_COMPLIANCE_CHECKLIST.map((section) => (
                  <div key={section.category}>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {section.category}
                    </h4>
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={checklistStatus[item.id] || false}
                              onCheckedChange={() => toggleChecklistItem(item.id)}
                            />
                            <div>
                              <p className="text-sm font-medium">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Frequency: {item.frequency}
                              </p>
                            </div>
                          </div>
                          <Badge variant={item.required === true ? "destructive" : "outline"}>
                            {item.required === true ? "Required" : typeof item.required === 'string' ? item.required : "Optional"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="section8" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Section 8 Grounds for Possession
                </CardTitle>
                <CardDescription>
                  Under Section 8 of the Housing Act 1988, landlords can seek possession based on specific grounds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 text-destructive flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Mandatory Grounds (Court must grant possession)
                  </h4>
                  <div className="space-y-2">
                    {SECTION_8_GROUNDS.mandatory.map((ground) => (
                      <div key={ground.ground} className="p-3 rounded-lg border">
                        <div className="flex justify-between items-start mb-1">
                          <Badge>Ground {ground.ground}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Notice: {ground.notice}
                          </span>
                        </div>
                        <p className="text-sm">{ground.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 text-warning flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Discretionary Grounds (Court decides)
                  </h4>
                  <div className="space-y-2">
                    {SECTION_8_GROUNDS.discretionary.map((ground) => (
                      <div key={ground.ground} className="p-3 rounded-lg border">
                        <div className="flex justify-between items-start mb-1">
                          <Badge variant="secondary">Ground {ground.ground}</Badge>
                          <span className="text-xs text-muted-foreground">
                            Notice: {ground.notice}
                          </span>
                        </div>
                        <p className="text-sm">{ground.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hmo" className="mt-4 space-y-4">
            {/* License Types */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {HMO_LICENSE_TYPES.map((license) => (
                <Card key={license.id} className={license.id === 'mandatory' ? 'border-destructive/50' : ''}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {license.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{license.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-xs text-muted-foreground mb-1">Criteria:</p>
                      <ul className="space-y-1">
                        {license.criteria.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-1 text-xs">
                            <ChevronRight className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-xs text-muted-foreground">Fee: £{license.fees.min}-£{license.fees.max}</span>
                      <Badge variant="outline" className="text-xs">{license.duration}</Badge>
                    </div>
                    <div className="p-2 bg-destructive/10 rounded text-xs">
                      <strong>Penalty:</strong> Up to £30,000 civil penalty
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Basic Requirements */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">HMO Standards & Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-destructive" />
                      Mandatory Requirements
                    </h4>
                    <ul className="space-y-1">
                      {HMO_REQUIREMENTS.mandatory.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-destructive mt-0.5">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Additional Requirements
                    </h4>
                    <ul className="space-y-1">
                      {HMO_REQUIREMENTS.additional.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <span className="text-primary mt-0.5">•</span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fire Safety Tab */}
          <TabsContent value="fire" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Flame className="h-5 w-5 text-destructive" />
                  Fire Safety Requirements
                </CardTitle>
                <CardDescription className="text-xs">
                  LACORS Housing Fire Safety Guide & Regulatory Reform Order 2005
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {FIRE_SAFETY_REQUIREMENTS.map((section) => (
                    <AccordionItem key={section.category} value={section.category}>
                      <AccordionTrigger className="text-sm">{section.category}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {section.items.map((item, i) => (
                            <div key={i} className="flex items-start justify-between p-2 rounded border text-xs">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{item.name}</span>
                                  {item.mandatory && <Badge variant="destructive" className="text-[10px] px-1 py-0">Required</Badge>}
                                </div>
                                <p className="text-muted-foreground">{item.requirement}</p>
                              </div>
                              <Badge variant="outline" className="text-[10px] ml-2 flex-shrink-0">{item.reference}</Badge>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HHSRS Tab */}
          <TabsContent value="hhsrs" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Housing Health & Safety Rating System (HHSRS)
                </CardTitle>
                <CardDescription className="text-xs">
                  29 hazards assessed by local authority environmental health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {HHSRS_HAZARDS.map((category) => (
                    <AccordionItem key={category.category} value={category.category}>
                      <AccordionTrigger className="text-sm">{category.category}</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {category.hazards.map((hazard, i) => (
                            <div key={i} className="p-2 rounded border text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{hazard.name}</span>
                                <Badge 
                                  variant={hazard.severity === 'high' ? 'destructive' : hazard.severity === 'medium' ? 'secondary' : 'outline'}
                                  className="text-[10px] px-1 py-0"
                                >
                                  {hazard.severity}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground">{hazard.description}</p>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Damp & Mould */}
            <Card className="border-warning/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Damp & Mould Standards (Awaab's Law)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Landlord Requirements</h4>
                    <ul className="space-y-1">
                      {DAMP_MOULD_STANDARDS.landlordObligations.map((action, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-primary mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Response Timelines</h4>
                    <ul className="space-y-1">
                      {Object.entries(DAMP_MOULD_STANDARDS.strictTimelines).map(([key, value], i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Calendar className="h-3 w-3 text-warning mt-0.5" />
                          <span><strong>{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EPC Tab */}
          <TabsContent value="epc" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary" />
                  EPC Requirements & Retrofit Pathway
                </CardTitle>
                <CardDescription className="text-xs">
                  Minimum Energy Efficiency Standards (MEES) for rental properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/30 text-center">
                    <p className="text-xs text-muted-foreground">Current Minimum</p>
                    <p className="text-2xl font-bold text-warning">{EPC_REQUIREMENTS.currentMinimum}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-primary/10 text-center">
                    <p className="text-xs text-muted-foreground">Proposed Minimum</p>
                    <p className="text-2xl font-bold text-primary">{EPC_REQUIREMENTS.proposedMinimum}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/30 text-center col-span-2">
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="text-sm font-medium">{EPC_REQUIREMENTS.proposedDate}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm">Retrofit Measures</h4>
                  <div className="space-y-2">
                    {EPC_REQUIREMENTS.retrofitMeasures.map((measure, i) => (
                      <div key={i} className="flex flex-wrap items-center justify-between p-2 rounded border text-xs gap-2">
                        <span className="font-medium flex-1 min-w-[150px]">{measure.measure}</span>
                        <span className="text-muted-foreground">£{measure.cost.min.toLocaleString()}-£{measure.cost.max.toLocaleString()}</span>
                        <span className="text-success">Saves £{measure.savingsPerYear}/yr</span>
                        <Badge variant="outline" className="text-[10px]">{measure.epcImpact}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-sm">Available Exemptions</h4>
                  <div className="flex flex-wrap gap-2">
                    {EPC_REQUIREMENTS.exemptions.map((ex, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{ex}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Finance Tab */}
          <TabsContent value="finance" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {PROPERTY_FINANCE_OPTIONS.map((option) => (
                <Card key={option.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      {option.name}
                    </CardTitle>
                    <CardDescription className="text-xs">{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-secondary/30 rounded text-center">
                        <p className="text-muted-foreground">LTV</p>
                        <p className="font-medium">{option.typicalLTV}</p>
                      </div>
                      <div className="p-2 bg-secondary/30 rounded text-center">
                        <p className="text-muted-foreground">Rate</p>
                        <p className="font-medium">{option.typicalRate}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium mb-1">Criteria:</p>
                      <ul className="space-y-0.5">
                        {option.criteria.slice(0, 3).map((c, i) => (
                          <li key={i} className="flex items-start gap-1">
                            <ChevronRight className="h-3 w-3 mt-0.5 text-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-primary font-medium">Best for: {option.bestFor}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Risk Protection */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Landlord Risk Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <h4 className="font-medium mb-2">Recommended Insurance</h4>
                    {LANDLORD_RISK_PROTECTION.insurance.filter(i => i.recommended).map((ins, i) => (
                      <div key={i} className="flex items-center justify-between p-2 border-b">
                        <span className="font-medium">{ins.type}</span>
                        <span className="text-muted-foreground">{ins.coverage}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Tenant Referencing Checks</h4>
                    <ul className="space-y-1">
                      {LANDLORD_RISK_PROTECTION.tenantReferencing.map((check, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-success" />
                          <span>{check}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pathways Tab */}
          <TabsContent value="pathways" className="mt-4 space-y-4">
            {COMPLIANCE_PATHWAYS.map((pathway) => (
              <Card key={pathway.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {pathway.name}
                  </CardTitle>
                  <CardDescription className="text-xs">{pathway.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pathway.steps.map((step) => (
                      <div key={step.step} className="flex gap-3 p-3 rounded border">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-bold text-primary">{step.step}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <h4 className="font-medium text-sm">{step.title}</h4>
                            <Badge variant="outline" className="text-xs">{step.timeline}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{step.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {step.documents.map((doc, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px]">{doc}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This information is provided for guidance only and does not
              constitute legal advice. Laws and regulations change frequently. Always seek professional
              legal advice before taking any action relating to tenancy agreements or eviction notices.
              BuildQuote accepts no responsibility for any actions taken based on this information.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
