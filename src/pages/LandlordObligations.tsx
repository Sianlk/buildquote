import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const TENANT_RIGHTS = [
  {
    title: "Right to a safe home",
    description: "Landlords must ensure the property is safe and free from hazards. This includes structural safety, fire safety, and freedom from damp and mould.",
    icon: Shield,
  },
  {
    title: "Right to repairs",
    description: "Landlords must keep the property in good repair, including the structure, exterior, heating, hot water, and sanitation.",
    icon: Hammer,
  },
  {
    title: "Right to quiet enjoyment",
    description: "Tenants have the right to live in the property without unnecessary interference from the landlord.",
    icon: Home,
  },
  {
    title: "Right to deposit protection",
    description: "Deposits must be protected in a government-approved scheme within 30 days and prescribed information provided.",
    icon: Scale,
  },
  {
    title: "Right to notice periods",
    description: "Landlords must give proper notice before ending a tenancy. Under Renters Reform Act, this is typically 2 months for no-fault evictions.",
    icon: Clock,
  },
  {
    title: "Right to challenge rent increases",
    description: "Tenants can challenge unfair rent increases through the First-tier Tribunal.",
    icon: FileText,
  },
];

const RENTERS_REFORM_ACT_CHANGES = [
  {
    change: "Abolition of Section 21 'no-fault' evictions",
    impact: "Landlords will need valid grounds to evict tenants",
    status: "Phased implementation",
  },
  {
    change: "Periodic tenancies become standard",
    impact: "Fixed-term tenancies will largely be abolished",
    status: "Coming soon",
  },
  {
    change: "Decent Homes Standard for private rentals",
    impact: "All private rentals must meet minimum standards",
    status: "Coming soon",
  },
  {
    change: "Pet-friendly by default",
    impact: "Landlords cannot unreasonably refuse pets",
    status: "Coming soon",
  },
  {
    change: "Landlord Ombudsman",
    impact: "New redress scheme for tenants",
    status: "In development",
  },
  {
    change: "Property Portal",
    impact: "Publicly searchable database of landlords and properties",
    status: "In development",
  },
];

const REPAIR_RIGHTS = [
  {
    category: "Emergency Repairs",
    timeframe: "24 hours",
    examples: ["No heating in winter", "No hot water", "Gas leak", "Major water leak", "Dangerous electrical fault", "Broken locks/security issue"],
  },
  {
    category: "Urgent Repairs",
    timeframe: "3-7 days",
    examples: ["Broken heating in mild weather", "Minor water leak", "Toilet not flushing", "Pest infestation", "Broken windows"],
  },
  {
    category: "Routine Repairs",
    timeframe: "28 days",
    examples: ["Minor plaster repairs", "Non-urgent damp issues", "Worn fixtures", "Cosmetic damage", "Garden maintenance"],
  },
];

const USEFUL_CONTACTS = [
  { name: "Shelter Housing Advice", phone: "0808 800 4444", description: "Free housing advice and support" },
  { name: "Citizens Advice", phone: "0800 144 8848", description: "General advice on housing rights" },
  { name: "Environmental Health", phone: "Local council", description: "Report housing hazards and disrepair" },
  { name: "Deposit Protection Schemes", phone: "Various", description: "DPS, TDS, or mydeposits" },
  { name: "First-tier Tribunal", phone: "0300 123 4504", description: "Challenge rent increases or deposit disputes" },
  { name: "Housing Ombudsman", phone: "0300 111 3000", description: "Complaints about social housing" },
];

export default function RentersRights() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Scale className="h-6 w-6" />
              Renters' Rights Guide
            </h1>
            <p className="text-sm text-muted-foreground">
              Know your rights as a tenant in England & Wales
            </p>
          </div>
          <Badge className="bg-primary">Updated January 2026</Badge>
        </div>

        {/* Key Rights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TENANT_RIGHTS.map((right) => (
            <Card key={right.title}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <right.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">{right.title}</h4>
                    <p className="text-xs text-muted-foreground">{right.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="reform">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="reform">Renters Reform Act</TabsTrigger>
            <TabsTrigger value="repairs">Repair Rights</TabsTrigger>
            <TabsTrigger value="eviction">Eviction Protection</TabsTrigger>
            <TabsTrigger value="contacts">Useful Contacts</TabsTrigger>
          </TabsList>

          <TabsContent value="reform" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Renters Reform Act 2024
                </CardTitle>
                <CardDescription>
                  Major changes to private renting in England - phased implementation ongoing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {RENTERS_REFORM_ACT_CHANGES.map((item, i) => (
                    <div key={i} className="flex items-start justify-between p-4 rounded-lg border">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{item.change}</h4>
                        <p className="text-sm text-muted-foreground">{item.impact}</p>
                      </div>
                      <Badge variant={item.status === "Phased implementation" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repairs" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="h-5 w-5" />
                  Repair Response Times
                </CardTitle>
                <CardDescription>
                  Reasonable timeframes landlords should respond to repair requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {REPAIR_RIGHTS.map((category) => (
                    <div key={category.category} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{category.category}</h4>
                        <Badge variant={
                          category.category === "Emergency Repairs" ? "destructive" :
                          category.category === "Urgent Repairs" ? "default" : "secondary"
                        }>
                          {category.timeframe}
                        </Badge>
                      </div>
                      <ul className="space-y-1">
                        {category.examples.map((example, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>If Your Landlord Won't Repair</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="step1">
                    <AccordionTrigger>Step 1: Report in writing</AccordionTrigger>
                    <AccordionContent>
                      Always report repairs in writing (email or letter) and keep copies. This creates a paper trail proving you reported the issue.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="step2">
                    <AccordionTrigger>Step 2: Give reasonable time</AccordionTrigger>
                    <AccordionContent>
                      Allow your landlord reasonable time to respond - 24 hours for emergencies, up to 28 days for routine repairs.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="step3">
                    <AccordionTrigger>Step 3: Contact Environmental Health</AccordionTrigger>
                    <AccordionContent>
                      If repairs affect your health or safety, contact your local council's Environmental Health team. They can inspect and issue improvement notices.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="step4">
                    <AccordionTrigger>Step 4: Seek legal advice</AccordionTrigger>
                    <AccordionContent>
                      Contact Shelter or Citizens Advice for free legal advice. You may be able to claim compensation or withhold rent in extreme cases (seek advice first).
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="eviction" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Eviction Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/50">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Important: You cannot be forced to leave immediately
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Even if you receive an eviction notice, you don't have to leave until a court orders it
                    and bailiffs are sent. Seek advice immediately if you receive any eviction notice.
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Your Rights During Eviction</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      Right to proper written notice (at least 2 months for most evictions)
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      Right to remain until a court order is granted
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      Right to attend court and present your case
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      Right to challenge invalid notices
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                      Protection from retaliatory eviction after complaints
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      Section 21 Notice (No-Fault)
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Being abolished under Renters Reform Act</li>
                      <li>• Currently requires 2 months' notice</li>
                      <li>• Invalid if deposit wasn't protected</li>
                      <li>• Invalid if required docs weren't provided</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      Section 8 Notice (Fault-Based)
                    </h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Requires specific legal grounds</li>
                      <li>• Notice period varies by ground</li>
                      <li>• Some grounds are discretionary</li>
                      <li>• You can challenge in court</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Useful Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {USEFUL_CONTACTS.map((contact) => (
                    <div key={contact.name} className="p-4 rounded-lg border">
                      <h4 className="font-medium mb-1">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{contact.description}</p>
                      <Badge variant="outline">{contact.phone}</Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href="https://england.shelter.org.uk" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Shelter
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://www.citizensadvice.org.uk" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Citizens Advice
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://www.gov.uk/private-renting" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      GOV.UK Renting
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> This information is for general guidance only and applies primarily
              to England. Scottish, Welsh and Northern Irish law may differ. Laws change frequently - always
              check current legislation and seek professional advice for specific situations. BuildQuote
              accepts no responsibility for actions taken based on this information.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
