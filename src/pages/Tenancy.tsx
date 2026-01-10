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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
} from "lucide-react";
import {
  DOCUMENT_TEMPLATES,
  SECTION_8_GROUNDS,
  LANDLORD_COMPLIANCE_CHECKLIST,
  HMO_REQUIREMENTS,
  generateASTTemplate,
  generateSection21Notice,
} from "@/lib/tenancy-legal-data";

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
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="templates" className="gap-2">
              <FileText className="h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="section8" className="gap-2">
              <Scale className="h-4 w-4" />
              Section 8 Grounds
            </TabsTrigger>
            <TabsTrigger value="hmo" className="gap-2">
              <Users className="h-4 w-4" />
              HMO
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

          <TabsContent value="hmo" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  HMO Licensing Requirements
                </CardTitle>
                <CardDescription>
                  Houses in Multiple Occupation require mandatory licensing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-destructive" />
                    Mandatory Requirements
                  </h4>
                  <ul className="space-y-2">
                    {HMO_REQUIREMENTS.mandatory.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-destructive mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Additional Requirements
                  </h4>
                  <ul className="space-y-2">
                    {HMO_REQUIREMENTS.additional.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
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
