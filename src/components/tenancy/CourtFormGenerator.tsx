import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Download, ExternalLink, FileText, Scale, AlertTriangle, Info, CheckCircle } from "lucide-react";

// Court form definitions
const COURT_FORMS = [
  {
    id: 'n5',
    name: 'Form N5 - Claim for Possession of Property',
    type: 'Possession',
    fee: '£355 (online) / £401 (paper)',
    description: 'Standard possession claim form used for all Section 8 claims and accelerated possession under Section 21.',
    officialLink: 'https://www.gov.uk/government/publications/form-n5-claim-form-for-possession-of-property',
    requiredDocs: [
      'Tenancy agreement (original or certified copy)',
      'Section 8 or Section 21 notice (as served)',
      'Proof of service',
      'Rent statement showing arrears (if applicable)',
      'Evidence of deposit protection (if applicable)',
    ],
    howToFill: [
      'Complete Section 1 with court details (find your local county court)',
      'Section 2: Enter claimant (landlord) details including address for service',
      'Section 3: Enter defendant (tenant) details',
      'Section 4: Describe the property address in full',
      'Section 5: State the grounds for possession (refer to Section 8 notice grounds)',
      'Section 6: Provide particulars of claim (arrears amounts, dates, grounds relied upon)',
      'Section 7: Calculate and state court fee',
      'Sign and date the form',
    ],
    tips: [
      'File online via MCOL for lower fees',
      'Keep copies of everything submitted',
      'Serve defendant within 4 months of issue',
    ],
  },
  {
    id: 'n119',
    name: 'Form N119 - Particulars of Claim for Possession (Rent Arrears)',
    type: 'Rent Arrears',
    fee: 'Included with N5',
    description: 'Detailed schedule of rent arrears to accompany Form N5 when claiming possession on Ground 8, 10, or 11.',
    officialLink: 'https://www.gov.uk/government/publications/form-n119-particulars-of-claim-for-possession-rent-arrears',
    requiredDocs: [
      'Form N5 (main claim form)',
      'Full rent account/statement',
      'Copy of tenancy agreement showing rent amount and payment dates',
      'Section 8 notice showing arrears at date of notice',
    ],
    howToFill: [
      'Part A: Property and tenancy details',
      'Part B: Current rent amount and payment frequency',
      'Part C: Schedule showing rent due, amounts paid, and running balance',
      'Part D: Total arrears at date of notice',
      'Part E: Total arrears at date of claim',
      'Part F: Daily rate of rent (for ongoing calculation)',
      'Attach to Form N5 as particulars of claim',
    ],
    tips: [
      'Be precise with dates and amounts',
      'Calculate arrears up to date of filing',
      'Show any partial payments received',
      'Ground 8 requires 2 months arrears at both notice AND hearing dates',
    ],
  },
  {
    id: 'n5b',
    name: 'Form N5B - Claim for Accelerated Possession',
    type: 'Accelerated Possession',
    fee: '£355 (online) / £401 (paper)',
    description: 'Accelerated possession claim for Section 21 cases only. No court hearing required if papers are in order.',
    officialLink: 'https://www.gov.uk/government/publications/form-n5b-claim-for-possession-of-property-assured-shorthold-tenancy-accelerated-procedure',
    requiredDocs: [
      'Original Section 21 notice (Form 6A)',
      'Tenancy agreement',
      'Proof of service of Section 21',
      'Proof of deposit protection and prescribed information',
      'Copy of EPC provided to tenant',
      'Copy of Gas Safety Certificate provided',
      '"How to Rent" guide proof of service',
    ],
    howToFill: [
      'Complete all tenant and landlord details',
      'Confirm tenancy type (AST)',
      'State notice period given (minimum 2 months)',
      'Confirm all prescribed documents were served',
      'List all attached evidence',
      'Sign declaration of truth',
    ],
    tips: [
      'Section 21 is being abolished - check current status',
      'All documents must have been served correctly',
      'Missing documents = claim dismissed',
    ],
  },
  {
    id: 'n11',
    name: 'Form N11 - Defence Form',
    type: 'Defence',
    fee: 'Free',
    description: 'Defence form for tenants responding to possession claims. Landlords should be aware of common defences.',
    officialLink: 'https://www.gov.uk/government/publications/form-n11-defence-form',
    requiredDocs: [],
    howToFill: [
      'Tenant completes within 14 days of service',
      'States grounds of defence',
      'Common defences: deposit not protected, harassment, disrepair',
    ],
    tips: [
      'As landlord, anticipate these defences',
      'Ensure all compliance before issuing claim',
    ],
  },
  {
    id: 'n244',
    name: 'Form N244 - Application Notice',
    type: 'Application',
    fee: '£119',
    description: 'General application form for requesting court orders, extensions, or variations.',
    officialLink: 'https://www.gov.uk/government/publications/form-n244-application-notice',
    requiredDocs: [
      'Witness statement supporting application',
      'Draft order (if applicable)',
      'Fee payment',
    ],
    howToFill: [
      'Describe the order you are asking the court to make',
      'State why the order is needed',
      'Include any supporting evidence',
      'Specify if hearing needed or paper determination',
    ],
    tips: [
      'Used for warrant applications',
      'Used for setting aside judgments',
      'Used for permission to appeal',
    ],
  },
  {
    id: 'n325',
    name: 'Form N325 - Warrant of Possession',
    type: 'Enforcement',
    fee: '£130',
    description: 'Request for bailiffs to enforce a possession order after tenants fail to vacate.',
    officialLink: 'https://www.gov.uk/government/publications/form-n325-request-for-warrant-of-possession-of-land',
    requiredDocs: [
      'Copy of original possession order',
      'Proof order has expired without vacation',
    ],
    howToFill: [
      'Enter case number and court',
      'Confirm possession order date',
      'State date tenant should have vacated',
      'Confirm tenant still in occupation',
      'Request eviction date',
    ],
    tips: [
      'Apply as soon as order expires',
      'Bailiff evictions take 4-6 weeks',
      'High Court Enforcement Officers (HCEO) faster but costs more',
    ],
  },
];

interface FormData {
  claimantName: string;
  claimantAddress: string;
  defendantName: string;
  propertyAddress: string;
  tenancyStartDate: string;
  rentAmount: number;
  rentFrequency: string;
  arrearsAmount: number;
  arrearsAtNotice: number;
  noticeServedDate: string;
  grounds: string;
  additionalInfo: string;
}

export function CourtFormGenerator() {
  const [selectedForm, setSelectedForm] = useState<typeof COURT_FORMS[0] | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    claimantName: '',
    claimantAddress: '',
    defendantName: '',
    propertyAddress: '',
    tenancyStartDate: '',
    rentAmount: 0,
    rentFrequency: 'monthly',
    arrearsAmount: 0,
    arrearsAtNotice: 0,
    noticeServedDate: '',
    grounds: '',
    additionalInfo: '',
  });

  const downloadTextFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateN5Content = () => {
    const date = new Date().toLocaleDateString('en-GB');
    return `
FORM N5 - CLAIM FOR POSSESSION OF PROPERTY
DRAFT TEMPLATE - NOT FOR DIRECT COURT SUBMISSION
Generated: ${date}

============================================
IMPORTANT: This is a DRAFT to help you prepare.
Download the official form from gov.uk and transfer
these details to the official PDF form.
============================================

SECTION 1 - COURT
Court: [Enter your local County Court]
Case Number: [To be assigned by court]

SECTION 2 - CLAIMANT (LANDLORD)
Name: ${formData.claimantName || '[Enter landlord name]'}
Address: ${formData.claimantAddress || '[Enter landlord address]'}

SECTION 3 - DEFENDANT (TENANT)
Name: ${formData.defendantName || '[Enter tenant name]'}
Address: ${formData.propertyAddress || '[Property address]'}

SECTION 4 - PROPERTY
Address: ${formData.propertyAddress || '[Enter full property address]'}

SECTION 5 - GROUNDS FOR POSSESSION
Notice type: Section 8 Housing Act 1988
Notice served: ${formData.noticeServedDate || '[Date notice served]'}
Grounds relied upon: ${formData.grounds || '[Enter grounds e.g., Ground 8, 10, 11]'}

SECTION 6 - PARTICULARS OF CLAIM
Tenancy commenced: ${formData.tenancyStartDate || '[Tenancy start date]'}
Rent: £${formData.rentAmount || 0} per ${formData.rentFrequency}
Arrears at date of notice: £${formData.arrearsAtNotice || 0}
Arrears at date of claim: £${formData.arrearsAmount || 0}
Daily rent rate: £${((formData.rentAmount || 0) * 12 / 365).toFixed(2)}

Additional information:
${formData.additionalInfo || '[Any additional relevant information]'}

SECTION 7 - COURT FEE
Fee: £355 (online) / £401 (paper)

DECLARATION
I believe the facts stated in this claim form are true.
I understand that proceedings for contempt of court may
be brought against anyone who makes a false statement.

Signed: ____________________
Date: ${date}

============================================
NEXT STEPS:
1. Download official N5 from gov.uk
2. Transfer these details to official form
3. Attach Form N119 if claiming rent arrears
4. Include copies of all required documents
5. File at court or online via MCOL
============================================
`;
  };

  const generateN119Content = () => {
    const date = new Date().toLocaleDateString('en-GB');
    const dailyRate = (formData.rentAmount * 12) / 365;
    
    return `
FORM N119 - PARTICULARS OF CLAIM FOR POSSESSION (RENT ARREARS)
DRAFT TEMPLATE - NOT FOR DIRECT COURT SUBMISSION
Generated: ${date}

============================================
IMPORTANT: This is a DRAFT to help you prepare.
Download the official form from gov.uk and transfer
these details to the official PDF form.
============================================

PART A - PROPERTY AND TENANCY DETAILS
Property: ${formData.propertyAddress || '[Property address]'}
Landlord: ${formData.claimantName || '[Landlord name]'}
Tenant: ${formData.defendantName || '[Tenant name]'}
Tenancy start: ${formData.tenancyStartDate || '[Start date]'}
Tenancy type: Assured Shorthold Tenancy

PART B - RENT DETAILS
Current rent: £${formData.rentAmount || 0}
Payment frequency: ${formData.rentFrequency}
Payment due date: [Day of month rent is due]

PART C - RENT ACCOUNT SCHEDULE
[Insert detailed schedule showing:]
Date Due | Rent Due | Paid | Balance
-----------------------------------
[Add rows for each payment period]
[Show running balance]

PART D - ARREARS AT DATE OF NOTICE
Date notice served: ${formData.noticeServedDate || '[Date]'}
Arrears at that date: £${formData.arrearsAtNotice || 0}

PART E - ARREARS AT DATE OF CLAIM  
Date of this claim: ${date}
Current arrears: £${formData.arrearsAmount || 0}

PART F - DAILY RATE
Daily rent rate: £${dailyRate.toFixed(2)}
(Calculated as: £${formData.rentAmount || 0} x 12 ÷ 365)

GROUNDS RELIED UPON
${formData.grounds || '[Ground 8 and/or Ground 10 and/or Ground 11]'}

For Ground 8:
- Arrears at notice date: £${formData.arrearsAtNotice || 0} (must equal 2+ months)
- Arrears at claim date: £${formData.arrearsAmount || 0} (must equal 2+ months)

============================================
CHECKLIST:
☐ Full rent schedule attached
☐ Notice copy attached  
☐ Tenancy agreement attached
☐ Calculations verified
============================================
`;
  };

  const handleGenerateForm = (formId: string) => {
    let content = '';
    let filename = '';
    
    switch (formId) {
      case 'n5':
        content = generateN5Content();
        filename = 'N5_Possession_Claim_DRAFT.txt';
        break;
      case 'n119':
        content = generateN119Content();
        filename = 'N119_Rent_Arrears_DRAFT.txt';
        break;
      default:
        content = `Draft template for ${formId} - Please download official form from gov.uk`;
        filename = `${formId}_DRAFT.txt`;
    }
    
    downloadTextFile(filename, content);
  };

  return (
    <div className="space-y-6">
      {/* Quick Links to Official Forms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Court Forms - Direct Download Links
          </CardTitle>
          <CardDescription>
            Official gov.uk forms with in-app guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {COURT_FORMS.map((form) => (
              <Card key={form.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={form.type === 'Possession' ? 'destructive' : form.type === 'Rent Arrears' ? 'default' : 'secondary'}>
                      {form.type}
                    </Badge>
                    <Badge variant="outline">{form.fee}</Badge>
                  </div>
                  <h4 className="font-medium text-sm mb-2">{form.name}</h4>
                  <p className="text-xs text-muted-foreground mb-3">{form.description}</p>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={form.officialLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-3 w-3 mr-2" />
                        Official Form
                      </a>
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        setSelectedForm(form);
                        setFormDialogOpen(true);
                      }}
                    >
                      <Info className="h-3 w-3 mr-2" />
                      How to Fill
                    </Button>
                    {(form.id === 'n5' || form.id === 'n119') && (
                      <Button 
                        size="sm"
                        onClick={() => handleGenerateForm(form.id)}
                      >
                        <FileText className="h-3 w-3 mr-2" />
                        Generate Draft
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Helper Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedForm?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedForm && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <p className="text-sm">{selectedForm.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge>{selectedForm.type}</Badge>
                    <Badge variant="outline">Fee: {selectedForm.fee}</Badge>
                  </div>
                </div>

                {selectedForm.requiredDocs.length > 0 && (
                  <Accordion type="single" collapsible defaultValue="docs">
                    <AccordionItem value="docs">
                      <AccordionTrigger>Required Documents</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {selectedForm.requiredDocs.map((doc, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                <Accordion type="single" collapsible defaultValue="howto">
                  <AccordionItem value="howto">
                    <AccordionTrigger>Step-by-Step Guide</AccordionTrigger>
                    <AccordionContent>
                      <ol className="space-y-2 list-decimal list-inside">
                        {selectedForm.howToFill.map((step, i) => (
                          <li key={i} className="text-sm">{step}</li>
                        ))}
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="p-3 rounded-lg bg-warning/10 border border-warning/50">
                  <h4 className="font-medium flex items-center gap-2 text-sm mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Important Tips
                  </h4>
                  <ul className="space-y-1">
                    {selectedForm.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-muted-foreground">• {tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <a href={selectedForm.officialLink} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Official Form
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* In-App Form Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Draft Form</CardTitle>
          <CardDescription>
            Fill in details to generate a draft document. Transfer to official forms before submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="n5">
            <TabsList>
              <TabsTrigger value="n5">N5 Possession</TabsTrigger>
              <TabsTrigger value="n119">N119 Arrears</TabsTrigger>
            </TabsList>

            <TabsContent value="n5" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Claimant (Landlord) Name</Label>
                  <Input
                    value={formData.claimantName}
                    onChange={(e) => setFormData(f => ({ ...f, claimantName: e.target.value }))}
                    placeholder="Full legal name"
                  />
                </div>
                <div>
                  <Label>Defendant (Tenant) Name</Label>
                  <Input
                    value={formData.defendantName}
                    onChange={(e) => setFormData(f => ({ ...f, defendantName: e.target.value }))}
                    placeholder="Full legal name"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Claimant Address</Label>
                  <Textarea
                    value={formData.claimantAddress}
                    onChange={(e) => setFormData(f => ({ ...f, claimantAddress: e.target.value }))}
                    placeholder="Address for service of documents"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Property Address</Label>
                  <Textarea
                    value={formData.propertyAddress}
                    onChange={(e) => setFormData(f => ({ ...f, propertyAddress: e.target.value }))}
                    placeholder="Full property address"
                  />
                </div>
                <div>
                  <Label>Tenancy Start Date</Label>
                  <Input
                    type="date"
                    value={formData.tenancyStartDate}
                    onChange={(e) => setFormData(f => ({ ...f, tenancyStartDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Notice Served Date</Label>
                  <Input
                    type="date"
                    value={formData.noticeServedDate}
                    onChange={(e) => setFormData(f => ({ ...f, noticeServedDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Monthly Rent (£)</Label>
                  <Input
                    type="number"
                    value={formData.rentAmount || ''}
                    onChange={(e) => setFormData(f => ({ ...f, rentAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Current Arrears (£)</Label>
                  <Input
                    type="number"
                    value={formData.arrearsAmount || ''}
                    onChange={(e) => setFormData(f => ({ ...f, arrearsAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Grounds for Possession</Label>
                  <Input
                    value={formData.grounds}
                    onChange={(e) => setFormData(f => ({ ...f, grounds: e.target.value }))}
                    placeholder="e.g., Ground 8 (mandatory), Ground 10, Ground 11"
                  />
                </div>
              </div>
              <Button onClick={() => handleGenerateForm('n5')}>
                <Download className="h-4 w-4 mr-2" />
                Generate N5 Draft
              </Button>
            </TabsContent>

            <TabsContent value="n119" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Monthly Rent (£)</Label>
                  <Input
                    type="number"
                    value={formData.rentAmount || ''}
                    onChange={(e) => setFormData(f => ({ ...f, rentAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Arrears at Notice Date (£)</Label>
                  <Input
                    type="number"
                    value={formData.arrearsAtNotice || ''}
                    onChange={(e) => setFormData(f => ({ ...f, arrearsAtNotice: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Current Total Arrears (£)</Label>
                  <Input
                    type="number"
                    value={formData.arrearsAmount || ''}
                    onChange={(e) => setFormData(f => ({ ...f, arrearsAmount: parseFloat(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Daily Rate</Label>
                  <Input
                    readOnly
                    value={`£${((formData.rentAmount || 0) * 12 / 365).toFixed(2)}`}
                  />
                </div>
              </div>
              <Button onClick={() => handleGenerateForm('n119')}>
                <Download className="h-4 w-4 mr-2" />
                Generate N119 Draft
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="p-4 rounded-lg border border-warning/50 bg-warning/5">
        <p className="text-sm text-muted-foreground">
          <strong>Legal Disclaimer:</strong> These templates are provided for guidance only 
          and do not constitute legal advice. Always use official gov.uk forms for court 
          submissions and seek qualified legal advice for your specific circumstances. 
          Court procedures and fees may change - verify current requirements before filing.
        </p>
      </div>
    </div>
  );
}
