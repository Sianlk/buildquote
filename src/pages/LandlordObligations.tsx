import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Gavel,
  ThermometerSun,
  Droplets,
  Building,
  Receipt,
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
  { requirement: "Fire doors (30-min FD30)", mandatory: true, appliesTo: "HMOs 3+ storeys" },
  { requirement: "Emergency lighting", mandatory: true, appliesTo: "HMOs" },
  { requirement: "Fire risk assessment", mandatory: true, appliesTo: "HMOs and common areas" },
  { requirement: "Fire blanket in shared kitchen", mandatory: true, appliesTo: "All HMOs" },
  { requirement: "Interlinked mains-powered alarms", mandatory: true, appliesTo: "HMOs" },
];

// Legal forms
const LEGAL_FORMS = [
  { name: "Form 3 - Section 8 Notice", link: "https://www.gov.uk/government/publications/form-3-notice-seeking-possession-of-a-property-let-on-an-assured-tenancy-or-assured-agricultural-occupancy", type: "Eviction" },
  { name: "Form 4 - Section 13 (Rent Increase)", link: "https://www.gov.uk/government/publications/form-4-landlords-notice-proposing-a-new-rent-under-an-assured-periodic-tenancy-or-statutory-periodic-tenancy", type: "Rent" },
  { name: "How to Rent Booklet", link: "https://www.gov.uk/government/publications/how-to-rent", type: "Required" },
  { name: "N5 - Claim for Possession", link: "https://www.gov.uk/government/publications/form-n5-claim-form-for-possession-of-property", type: "Court" },
  { name: "N119 - Particulars of Claim (Rent Arrears)", link: "https://www.gov.uk/government/publications/form-n119-particulars-of-claim-for-possession-rent-arrears", type: "Court" },
  { name: "N325 - Request for Warrant of Possession", link: "https://www.gov.uk/government/publications/form-n325-request-for-warrant-of-possession-of-land", type: "Court" },
  { name: "Gas Safety Certificate (CP12)", link: "https://www.gassaferegister.co.uk/", type: "Safety" },
  { name: "Prescribed Information (Deposit)", link: "https://www.gov.uk/tenancy-deposit-protection/get-deposit-protected", type: "Required" },
];

// Repair timescales
const REPAIR_OBLIGATIONS = [
  { category: "Emergency", timeframe: "24 hours", examples: ["No heating in winter", "Gas leak", "No water", "Dangerous electrics"] },
  { category: "Urgent", timeframe: "3-7 days", examples: ["Broken heating", "Minor leaks", "Broken locks", "No hot water"] },
  { category: "Routine", timeframe: "28 days", examples: ["Minor plaster", "Non-urgent damp", "Garden", "Cosmetic damage"] },
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

// Section 24 Finance Act data
const SECTION_24_DATA = {
  overview: "Section 24 of the Finance Act 2015 restricts mortgage interest relief for residential landlords. Since April 2020, landlords can no longer deduct mortgage interest from rental income. Instead, they receive a basic rate (20%) tax credit.",
  timeline: [
    { year: "2017-18", deduction: "75% deduction, 25% credit" },
    { year: "2018-19", deduction: "50% deduction, 50% credit" },
    { year: "2019-20", deduction: "25% deduction, 75% credit" },
    { year: "2020 onwards", deduction: "0% deduction, 100% basic rate credit" },
  ],
  impacts: [
    { scenario: "Basic rate taxpayer", impact: "Minimal impact — credit matches old deduction at 20%." },
    { scenario: "Higher rate taxpayer (40%)", impact: "Significant tax increase — previously deducted at 40%, now credited at 20%. Effective tax rate rises substantially." },
    { scenario: "Additional rate (45%)", impact: "Largest impact — can push landlords into loss-making positions on paper while still having tax liability." },
    { scenario: "Portfolio landlords", impact: "May push total income into higher tax band, triggering 40% or 45% rate on other income too." },
  ],
  mitigations: [
    "Incorporate via limited company — mortgage interest remains a business expense (but triggers CGT on transfer).",
    "Reduce mortgage leverage — pay down mortgages to reduce interest costs.",
    "Increase rents — offset reduced profit margins (market-dependent).",
    "Switch to commercial property — Section 24 applies only to residential lettings.",
    "Claim all allowable expenses — maintenance, insurance, agent fees, travel, stationery.",
  ],
};

// HHSRS Data
const HHSRS_HAZARDS = [
  { category: "Physiological", hazards: ["Damp and mould growth", "Excess cold", "Excess heat", "Asbestos", "Carbon monoxide", "Lead", "Radiation", "Uncombusted fuel gas", "Volatile organic compounds"] },
  { category: "Psychological", hazards: ["Crowding and space", "Entry by intruders", "Lighting", "Noise"] },
  { category: "Infection", hazards: ["Domestic hygiene, pests and refuse", "Food safety", "Personal hygiene, sanitation and drainage", "Water supply"] },
  { category: "Accidents", hazards: ["Falls on stairs", "Falls on the level", "Falls between levels", "Electrical hazards", "Fire", "Hot surfaces and materials", "Collision and entrapment", "Explosions", "Position and operability of amenities", "Structural collapse and falling elements"] },
];

const HHSRS_BANDS = [
  { band: "A", score: "5,000+", action: "Category 1 hazard — LA must take enforcement action", severity: "Critical" },
  { band: "B", score: "2,000-4,999", action: "Category 1 hazard — LA must take enforcement action", severity: "Critical" },
  { band: "C", score: "1,000-1,999", action: "Category 1 hazard — LA must take enforcement action", severity: "Critical" },
  { band: "D", score: "500-999", action: "Category 2 hazard — LA may take action", severity: "Major" },
  { band: "E", score: "200-499", action: "Category 2 hazard — LA may take action", severity: "Moderate" },
  { band: "F-J", score: "1-199", action: "Category 2 hazard — low risk, advisory", severity: "Minor" },
];

// Awaab's Law Data
const AWAABS_LAW = {
  background: "Awaab's Law is named after Awaab Ishak, a 2-year-old who died in December 2020 from a respiratory condition caused by mould in his social housing home in Rochdale. The Social Housing (Regulation) Act 2023 introduced fixed timescales for landlords to address hazards.",
  timescales: [
    { hazard: "Emergency hazard (imminent risk to life)", response: "24 hours", action: "Make safe / provide alternative accommodation" },
    { hazard: "Damp and mould (reported)", response: "14 days", action: "Inspect and provide written response" },
    { hazard: "Damp and mould (confirmed)", response: "7 days", action: "Begin repair works" },
    { hazard: "Repair completion", response: "Reasonable timescale", action: "Complete all remedial works" },
  ],
  privateExtension: "Initially applies to social housing from October 2025. The government has signalled that similar fixed timescales will extend to the private rented sector (PRS) via the Renters' Rights Act 2025, expected from 2026.",
  landlordActions: [
    "Respond to all damp/mould reports within 14 days with a written assessment.",
    "Begin remediation within 7 days of confirming the issue.",
    "Document all communications and repair actions — critical for defending complaints.",
    "Install adequate ventilation (extractor fans, trickle vents) proactively.",
    "Conduct annual property inspections and photograph any damp/condensation issues.",
    "Address root causes (leaks, missing DPC, insufficient insulation) not just cosmetic fixes.",
  ],
};

// Renters' Rights Act 2025 Data
const RENTERS_RIGHTS_ACT = {
  effectiveDate: "1 May 2026",
  keyChanges: [
    {
      title: "Section 21 Abolished",
      description: "No-fault evictions are completely abolished. All evictions must use Section 8 grounds.",
      impact: "Landlords must have a valid legal reason to evict (e.g., rent arrears, selling, moving in).",
    },
    {
      title: "Assured Periodic Tenancies Only",
      description: "All tenancies become monthly rolling contracts. Fixed-term tenancies are no longer permitted.",
      impact: "Tenants can leave with 2 months' notice at any time. No break clauses or minimum terms.",
    },
    {
      title: "Rent Increases Limited",
      description: "Rent can only be increased once per year via a formal Section 13 notice with 2 months' notice.",
      impact: "No rent review clauses. Tenant can challenge at First-tier Tribunal if increase is above market rate.",
    },
    {
      title: "Advance Rent Restrictions",
      description: "Landlords cannot request more than 1 month's rent in advance or accept bids above advertised rent.",
      impact: "Prevents rent bidding wars. Advertising must state the actual rent amount.",
    },
    {
      title: "Pets Allowed by Default",
      description: "Tenants have the right to request pets. Landlords cannot unreasonably refuse.",
      impact: "Landlords can require pet insurance. Refusal must be justified within 42 days.",
    },
    {
      title: "Private Rented Sector Database",
      description: "All landlords must register on the new national PRS database (Landlord Register).",
      impact: "Registration required before letting. Non-compliance is a criminal offence.",
    },
    {
      title: "New Ombudsman",
      description: "All private landlords must join the new PRS Ombudsman scheme.",
      impact: "Tenants can escalate complaints. Landlords must comply with Ombudsman decisions.",
    },
  ],
  section8Grounds: [
    { ground: "Ground 1", reason: "Landlord requires property for own occupation", notice: "4 months", mandatory: true },
    { ground: "Ground 1A", reason: "Landlord intends to sell", notice: "4 months", mandatory: true },
    { ground: "Ground 2", reason: "Mortgage lender requires possession", notice: "2 months", mandatory: true },
    { ground: "Ground 6", reason: "Demolition or substantial works", notice: "4 months", mandatory: true },
    { ground: "Ground 8", reason: "Serious rent arrears (2+ months)", notice: "2 weeks (4 weeks for periodic)", mandatory: true },
    { ground: "Ground 10", reason: "Some rent arrears at hearing date", notice: "2 weeks", mandatory: false },
    { ground: "Ground 11", reason: "Persistent delays in paying rent", notice: "2 weeks", mandatory: false },
    { ground: "Ground 12", reason: "Breach of tenancy obligation", notice: "2 weeks", mandatory: false },
    { ground: "Ground 14", reason: "Antisocial behaviour / nuisance", notice: "Immediate / 2 weeks", mandatory: false },
    { ground: "Ground 17", reason: "Tenant's false statement induced grant of tenancy", notice: "2 weeks", mandatory: false },
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
          <Badge className="bg-primary">Updated February 2026</Badge>
        </div>

        {/* Core Obligations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LANDLORD_OBLIGATIONS.map((o) => (
            <Card key={o.title} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10"><o.icon className="h-5 w-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
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

        <Tabs defaultValue="renters-rights">
          <ScrollArea className="w-full">
            <TabsList className="flex w-max gap-1 h-auto p-1">
              <TabsTrigger value="renters-rights" className="text-xs px-2 py-1.5 whitespace-nowrap"><Gavel className="h-3 w-3 mr-1" />Renters' Rights Act</TabsTrigger>
              <TabsTrigger value="section-24" className="text-xs px-2 py-1.5 whitespace-nowrap"><Receipt className="h-3 w-3 mr-1" />Section 24</TabsTrigger>
              <TabsTrigger value="hmo" className="text-xs px-2 py-1.5 whitespace-nowrap"><Users className="h-3 w-3 mr-1" />HMO Licensing</TabsTrigger>
              <TabsTrigger value="hhsrs" className="text-xs px-2 py-1.5 whitespace-nowrap"><Building className="h-3 w-3 mr-1" />HHSRS</TabsTrigger>
              <TabsTrigger value="awaabs-law" className="text-xs px-2 py-1.5 whitespace-nowrap"><Droplets className="h-3 w-3 mr-1" />Awaab's Law</TabsTrigger>
              <TabsTrigger value="fire" className="text-xs px-2 py-1.5 whitespace-nowrap"><Flame className="h-3 w-3 mr-1" />Fire Safety</TabsTrigger>
              <TabsTrigger value="epc" className="text-xs px-2 py-1.5 whitespace-nowrap"><ThermometerSun className="h-3 w-3 mr-1" />EPC</TabsTrigger>
              <TabsTrigger value="repairs" className="text-xs px-2 py-1.5 whitespace-nowrap"><Clock className="h-3 w-3 mr-1" />Repairs</TabsTrigger>
              <TabsTrigger value="forms" className="text-xs px-2 py-1.5 whitespace-nowrap"><FileText className="h-3 w-3 mr-1" />Forms</TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Renters' Rights Act Tab */}
          <TabsContent value="renters-rights" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Gavel className="h-5 w-5" />Renters' Rights Act 2025</CardTitle>
                <CardDescription>Effective {RENTERS_RIGHTS_ACT.effectiveDate} — Key changes for landlords</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                  <h4 className="font-medium flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-destructive" />Critical: Section 21 Abolished</h4>
                  <p className="text-sm text-muted-foreground">From {RENTERS_RIGHTS_ACT.effectiveDate}, no-fault evictions are completely abolished. All future evictions must use Section 8 grounds with valid legal reasons.</p>
                </div>

                <div className="grid gap-4">
                  {RENTERS_RIGHTS_ACT.keyChanges.map((change, i) => (
                    <div key={i} className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-1">{change.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{change.description}</p>
                      <div className="p-2 rounded bg-muted">
                        <p className="text-xs"><strong>Impact:</strong> {change.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Section 8 Grounds for Possession</CardTitle>
                <CardDescription>Available grounds after Section 21 abolition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 whitespace-nowrap">Ground</th>
                        <th className="text-left p-2 whitespace-nowrap">Reason</th>
                        <th className="text-left p-2 whitespace-nowrap">Notice Period</th>
                        <th className="text-left p-2 whitespace-nowrap">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RENTERS_RIGHTS_ACT.section8Grounds.map((g, i) => (
                        <tr key={i} className="border-b">
                          <td className="p-2 font-medium whitespace-nowrap">{g.ground}</td>
                          <td className="p-2">{g.reason}</td>
                          <td className="p-2 whitespace-nowrap">{g.notice}</td>
                          <td className="p-2"><Badge variant={g.mandatory ? "default" : "secondary"} className="text-xs">{g.mandatory ? "Mandatory" : "Discretionary"}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Section 24 Tab */}
          <TabsContent value="section-24" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Receipt className="h-5 w-5" />Section 24 — Mortgage Interest Relief</CardTitle>
                <CardDescription>Finance Act 2015 — Impact on residential landlords</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/50">
                  <p className="text-sm">{SECTION_24_DATA.overview}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Phase-In Timeline</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {SECTION_24_DATA.timeline.map((t, i) => (
                      <div key={i} className="p-3 rounded-lg border text-center">
                        <p className="font-medium text-sm">{t.year}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.deduction}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Impact by Tax Band</h4>
                  <div className="space-y-3">
                    {SECTION_24_DATA.impacts.map((item, i) => (
                      <div key={i} className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{item.scenario}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.impact}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Mitigation Strategies</h4>
                  <div className="space-y-2">
                    {SECTION_24_DATA.mitigations.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{m}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HMO Tab */}
          <TabsContent value="hmo" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />HMO Licensing Requirements</CardTitle>
                <CardDescription>Based on occupants and households, NOT storeys (2026 rules)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/50">
                  <h4 className="font-medium flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-warning" />Important: HMO Definition (2026)</h4>
                  <p className="text-sm text-muted-foreground">
                    A property is an HMO if it's occupied by <strong>3+ people from 2+ households</strong> who share facilities.
                    Mandatory licensing applies to HMOs with <strong>5+ occupants from 2+ households</strong>. The old "3-storey" rule is obsolete — licensing is based on occupancy thresholds only.
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
                      {LICENSING_APPLICATION.howTo.map((s) => (<li key={s}>{s}</li>))}
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
                          <a href={l.href} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-2" />{l.label}</a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HHSRS Tab */}
          <TabsContent value="hhsrs" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Building className="h-5 w-5" />HHSRS — Housing Health & Safety Rating System</CardTitle>
                <CardDescription>Housing Act 2004 — Risk-based assessment of residential properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm">The HHSRS is used by local authorities to assess 29 hazards in residential properties. Category 1 hazards (Bands A-C) <strong>require</strong> enforcement action. Category 2 hazards allow discretionary action. Understanding these helps landlords proactively address issues before inspection.</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Hazard Categories (29 Total)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {HHSRS_HAZARDS.map((cat) => (
                      <div key={cat.category} className="p-4 rounded-lg border">
                        <h5 className="font-medium mb-2">{cat.category}</h5>
                        <div className="space-y-1">
                          {cat.hazards.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="h-3 w-3 text-warning flex-shrink-0" />
                              <span className="text-muted-foreground">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Scoring Bands & Enforcement</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Band</th>
                          <th className="text-left p-2">Score Range</th>
                          <th className="text-left p-2">Action</th>
                          <th className="text-left p-2">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {HHSRS_BANDS.map((b, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 font-medium">{b.band}</td>
                            <td className="p-2 font-mono">{b.score}</td>
                            <td className="p-2 text-muted-foreground">{b.action}</td>
                            <td className="p-2"><Badge variant={b.severity === "Critical" ? "destructive" : b.severity === "Major" ? "default" : "secondary"} className="text-xs">{b.severity}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Awaab's Law Tab */}
          <TabsContent value="awaabs-law" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Droplets className="h-5 w-5" />Awaab's Law — Damp & Mould Timescales</CardTitle>
                <CardDescription>Social Housing (Regulation) Act 2023 — Extending to PRS</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm">{AWAABS_LAW.background}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Mandatory Response Timescales</h4>
                  <div className="space-y-3">
                    {AWAABS_LAW.timescales.map((t, i) => (
                      <div key={i} className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{t.hazard}</h5>
                          <p className="text-xs text-muted-foreground">{t.action}</p>
                        </div>
                        <Badge variant="destructive" className="text-xs whitespace-nowrap">{t.response}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-warning/10 border border-warning/50">
                  <h4 className="font-medium flex items-center gap-2 mb-2"><AlertTriangle className="h-4 w-4 text-warning" />Private Sector Extension</h4>
                  <p className="text-sm text-muted-foreground">{AWAABS_LAW.privateExtension}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Recommended Landlord Actions</h4>
                  <div className="space-y-2">
                    {AWAABS_LAW.landlordActions.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded bg-muted">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-sm">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
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
                    <div key={i} className="p-3 rounded-lg border flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h4 className="font-medium text-sm">{f.requirement}</h4>
                        <p className="text-xs text-muted-foreground">Applies to: {f.appliesTo}</p>
                      </div>
                      <Badge variant={f.mandatory ? "destructive" : "secondary"} className="flex-shrink-0">{f.mandatory ? "Mandatory" : "Recommended"}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4" asChild>
                  <a href="https://www.gov.uk/fire-safety-law-guidance" target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" />Fire Safety Guidance</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* EPC Tab */}
          <TabsContent value="epc" className="mt-4 space-y-4">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ThermometerSun className="h-5 w-5" />EPC Requirements</CardTitle></CardHeader>
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
                  <a href="https://www.gov.uk/find-energy-certificate" target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" />Find EPC</a>
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
                        {r.examples.map((e, i) => <li key={i} className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />{e}</li>)}
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
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <h4 className="font-medium text-sm">{f.name}</h4>
                        <Badge variant={f.type === "Required" ? "default" : "outline"} className="flex-shrink-0 text-xs">{f.type}</Badge>
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
        </Tabs>

        {/* Useful Contacts */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Phone className="h-5 w-5" />Useful Contacts</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Gas Safe Register", number: "0800 408 5500", url: "https://www.gassaferegister.co.uk" },
                { name: "NICEIC (Electrical)", number: "0333 015 6625", url: "https://www.niceic.com" },
                { name: "Deposit Protection Service", number: "0330 303 0030", url: "https://www.depositprotection.com" },
                { name: "Citizens Advice", number: "0800 144 8848", url: "https://www.citizensadvice.org.uk" },
                { name: "NRLA (Landlord Association)", number: "0300 131 6400", url: "https://www.nrla.org.uk" },
                { name: "Health & Safety Executive", number: "0345 300 9923", url: "https://www.hse.gov.uk" },
              ].map((contact) => (
                <div key={contact.name} className="p-4 rounded-lg border">
                  <h4 className="font-medium text-sm">{contact.name}</h4>
                  <p className="text-sm text-muted-foreground font-mono">{contact.number}</p>
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <a href={contact.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3 w-3 mr-1" />Website</a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="p-4 rounded-lg border bg-muted/50 text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This information is for guidance only and does not constitute legal advice. Regulations vary by jurisdiction and are subject to change. Always consult current legislation and seek professional legal advice for specific situations. Data accurate as of February 2026.
        </div>
      </div>
    </DashboardLayout>
  );
}
