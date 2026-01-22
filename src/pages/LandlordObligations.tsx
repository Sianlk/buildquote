import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Scale,
  Shield,
  Home,
  AlertTriangle,
  CheckCircle,
  Phone,
  ExternalLink,
  FileText,
  Clock,
  Flame,
  Zap,
  Users,
  Key,
  Banknote,
  Download,
} from "lucide-react";
import { EPC_REQUIREMENTS } from "@/lib/hmo-compliance-data";

// Landlord core obligations - 2026 aligned
const LANDLORD_OBLIGATIONS = [
  {
    title: "Gas Safety",
    description: "Annual Gas Safety Certificate (CP12) required for all gas appliances.",
    icon: Flame,
    deadline: "Annual",
    penalty: "Up to £6,000 fine",
    link: "https://www.gassaferegister.co.uk/",
  },
  {
    title: "Electrical Safety",
    description: "EICR required every 5 years. Must be provided before move-in.",
    icon: Zap,
    deadline: "Every 5 years",
    penalty: "Up to £30,000 fine",
    link: "https://www.gov.uk/government/publications/electrical-safety-standards-in-the-private-rented-sector-guidance-for-landlords-tenants-and-local-authorities",
  },
  {
    title: "EPC Rating",
    description: "Minimum rating E currently, moving to C for new tenancies.",
    icon: Home,
    deadline: "Valid for 10 years",
    penalty: "Up to £5,000 fine",
    link: "https://www.gov.uk/find-energy-certificate",
  },
  {
    title: "Deposit Protection",
    description: "Deposits must be protected in a government scheme within 30 days.",
    icon: Banknote,
    deadline: "Within 30 days",
    penalty: "1-3x deposit compensation",
    link: "https://www.gov.uk/deposit-protection-schemes-and-landlords",
  },
  {
    title: "Right to Rent",
    description: "Check all adult tenants have right to rent in England.",
    icon: Key,
    deadline: "Before tenancy starts",
    penalty: "Up to £20,000 per tenant",
    link: "https://www.gov.uk/check-tenant-right-to-rent-documents",
  },
  {
    title: "Smoke & CO Alarms",
    description: "Working smoke alarm on each storey. CO alarm in rooms with combustion appliances.",
    icon: Shield,
    deadline: "At start of tenancy",
    penalty: "Up to £5,000 fine",
    link: "https://www.gov.uk/government/publications/smoke-and-carbon-monoxide-alarms-explanatory-booklet-for-landlords",
  },
];

// HMO info
const HMO_LICENSE_INFO = [
  { type: "Mandatory HMO", criteria: "5+ occupants from 2+ households", duration: "5 years", minSingle: 6.51, minDouble: 10.22 },
  { type: "Additional Licensing", criteria: "3-4 occupants from 2+ households (where schemes exist)", duration: "5 years", minSingle: 6.51, minDouble: 10.22 },
  { type: "Selective Licensing", criteria: "All private rentals in designated areas", duration: "5 years", minSingle: 0, minDouble: 0 },
];

// Fire Safety
const FIRE_SAFETY_ITEMS = [
  { requirement: "Smoke alarms on each storey", mandatory: true, appliesTo: "All rentals" },
  { requirement: "CO alarms with combustion appliances", mandatory: true, appliesTo: "All rentals" },
  { requirement: "Fire doors (30-min)", mandatory: true, appliesTo: "HMOs 3+ storeys" },
  { requirement: "Emergency lighting", mandatory: true, appliesTo: "HMOs" },
  { requirement: "Fire risk assessment", mandatory: true, appliesTo: "HMOs and common areas" },
];

// Legal forms
const LEGAL_FORMS = [
  { name: "Form 3 - Section 8", link: "https://www.gov.uk/government/publications/form-3-notice-seeking-possession-of-a-property-let-on-an-assured-tenancy-or-assured-agricultural-occupancy", type: "Eviction" },
  { name: "Form 4 - Section 13 (Rent Increase)", link: "https://www.gov.uk/government/publications/form-4-landlords-notice-proposing-a-new-rent-under-an-assured-periodic-tenancy-or-statutory-periodic-tenancy", type: "Rent" },
  { name: "How to Rent Booklet", link: "https://www.gov.uk/government/publications/how-to-rent", type: "Required" },
  { name: "N5 - Claim for Possession", link: "https://www.gov.uk/government/publications/form-n5-claim-form-for-possession-of-property", type: "Court" },
  { name: "N119 - Particulars of Claim (Rent Arrears)", link: "https://www.gov.uk/government/publications/form-n119-particulars-of-claim-for-possession-rent-arrears", type: "Court" },
];

// Repair timescales
const REPAIR_OBLIGATIONS = [
  { category: "Emergency", timeframe: "24 hours", examples: ["No heating in winter", "Gas leak", "No water"] },
  { category: "Urgent", timeframe: "3-7 days", examples: ["Broken heating", "Minor leaks", "Broken locks"] },
  { category: "Routine", timeframe: "28 days", examples: ["Minor plaster", "Non-urgent damp", "Garden"] },
];

const LICENSING_APPLICATION = {
  howTo: [
    "Identify whether your property needs Mandatory HMO, Additional, or Selective licensing.",
    "Use your local council's private renting / property licensing page to apply.",
    "Prepare supporting documents (EICR, gas safety certificate, floor plan/room sizes where required, fire safety evidence, tenancy agreement).",
    "Pay the application fee and diarise renewal (usually every 5 years).",
  ],
  typicalCosts: [
    { label: "HMO licence (typical)", value: "£500–£1,500" },
    { label: "Additional licensing (typical)", value: "£350–£1,250" },
    { label: "Selective licensing (typical)", value: "£300–£1,000" },
  ],
  officialLinks: [
    { label: "Find your local council", href: "https://www.gov.uk/find-local-council" },
    { label: "HMO licence guidance", href: "https://www.gov.uk/house-in-multiple-occupation-licence" },
    { label: "Private renting guidance", href: "https://www.gov.uk/private-renting" },
  ],
};

export default function LandlordObligations() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Scale className="h-6 w-6" />
              Landlord Compliance Guide
            </h1>
            <p className="text-sm text-muted-foreground">Essential legal obligations for UK landlords — 2026 aligned</p>
          </div>
          <Badge className="bg-primary">Updated January 2026</Badge>
        </div>

        {/* Core Obligations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LANDLORD_OBLIGATIONS.map((o) => (
            <Card key={o.title} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><o.icon className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{o.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{o.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">{o.deadline}</Badge>
                      <Badge variant="destructive" className="text-xs">{o.penalty}</Badge>
                    </div>
                    <Button variant="link" size="sm" className="p-0 h-auto" asChild>
                      <a href={o.link} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1" />Official Guidance</a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="hmo">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="hmo">HMO Licensing</TabsTrigger>
            <TabsTrigger value="fire">Fire Safety</TabsTrigger>
            <TabsTrigger value="repairs">Repairs</TabsTrigger>
            <TabsTrigger value="forms">Forms & Templates</TabsTrigger>
            <TabsTrigger value="epc">EPC Requirements</TabsTrigger>
          </TabsList>

          {/* HMO Tab */}
          <TabsContent value="hmo" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />HMO Licensing Requirements</CardTitle>
                <CardDescription>Based on occupants, NOT storeys</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/50">
                  <h4 className="font-medium flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-warning" />Important: HMO Definition</h4>
                  <p className="text-sm text-muted-foreground">
                    A property is an HMO if it's occupied by <strong>3+ people from 2+ households</strong> who share facilities. 
                    Mandatory licensing applies to HMOs with <strong>5+ occupants from 2+ households</strong>.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {HMO_LICENSE_INFO.map((l) => (
                    <div key={l.type} className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">{l.type}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{l.criteria}</p>
                      <Badge variant="outline">{l.duration}</Badge>
                      {l.minSingle > 0 && <p className="text-xs mt-2">Min room: {l.minSingle}m² single / {l.minDouble}m² double</p>}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">How to apply for a licence</h4>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal ml-4">
                      {LICENSING_APPLICATION.howTo.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Typical costs (vary by council)</h4>
                    <div className="space-y-2 text-sm">
                      {LICENSING_APPLICATION.typicalCosts.map((c) => (
                        <div key={c.label} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{c.label}</span>
                          <span className="font-mono">{c.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {LICENSING_APPLICATION.officialLinks.map((l) => (
                        <Button key={l.href} variant="outline" size="sm" asChild>
                          <a href={l.href} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-2" />
                            {l.label}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button variant="outline" asChild>
                  <a href="https://www.gov.uk/house-in-multiple-occupation-licence" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />HMO Licensing Guide
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fire Safety Tab */}
          <TabsContent value="fire" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5" />Fire Safety Requirements</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {FIRE_SAFETY_ITEMS.map((f, i) => (
                    <div key={i} className="p-3 rounded-lg border flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{f.requirement}</h4>
                        <p className="text-xs text-muted-foreground">Applies to: {f.appliesTo}</p>
                      </div>
                      <Badge variant={f.mandatory ? "destructive" : "secondary"}>{f.mandatory ? "Mandatory" : "Recommended"}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="https://www.gov.uk/fire-safety-law-guidance" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />Fire Safety Guidance
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Repairs Tab */}
          <TabsContent value="repairs" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Repair Obligations</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {REPAIR_OBLIGATIONS.map((r) => (
                    <div key={r.category} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{r.category}</h4>
                        <Badge variant={r.category === "Emergency" ? "destructive" : r.category === "Urgent" ? "default" : "secondary"}>{r.timeframe}</Badge>
                      </div>
                      <ul className="text-sm space-y-1">
                        {r.examples.map((e, i) => <li key={i} className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-3 w-3 text-primary" />{e}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms Tab */}
          <TabsContent value="forms" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Official Forms & Templates</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {LEGAL_FORMS.map((f) => (
                    <div key={f.name} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{f.name}</h4>
                        <Badge variant={f.type === "Required" ? "default" : "outline"}>{f.type}</Badge>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={f.link} target="_blank" rel="noopener noreferrer"><Download className="h-3 w-3 mr-2" />Download</a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EPC Tab */}
          <TabsContent value="epc" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" />EPC Requirements</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground">Current Minimum</p>
                    <p className="text-3xl font-bold text-primary">{EPC_REQUIREMENTS.currentMinimum}</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground">Proposed Minimum</p>
                    <p className="text-3xl font-bold text-success">{EPC_REQUIREMENTS.proposedMinimum}</p>
                  </div>
                  <div className="p-4 rounded-lg border text-center">
                    <p className="text-sm text-muted-foreground">Cost Cap</p>
                    <p className="text-3xl font-bold">£{EPC_REQUIREMENTS.costCap.toLocaleString()}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EPC_REQUIREMENTS.retrofitMeasures.slice(0, 6).map((m, i) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-medium text-sm">{m.measure}</h5>
                        <Badge variant="outline">+{m.epcImpact}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Cost: £{m.cost.min.toLocaleString()} - £{m.cost.max.toLocaleString()}</p>
                      <p className="text-xs text-success">Saves ~£{m.savingsPerYear}/year</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="https://www.gov.uk/find-energy-certificate" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />Find EPC
                  </a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Useful Contacts */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" />Useful Contacts</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "NRLA", link: "https://www.nrla.org.uk/" },
                { name: "Gas Safe Register", link: "https://www.gassaferegister.co.uk/" },
                { name: "NICEIC", link: "https://www.niceic.com/" },
                { name: "Property Redress", link: "https://www.theprs.co.uk/" },
              ].map((c) => (
                <Button key={c.name} variant="outline" className="h-auto p-4" asChild>
                  <a href={c.link} target="_blank" rel="noopener noreferrer">{c.name}</a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This information is for general guidance only. Always seek professional legal advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
