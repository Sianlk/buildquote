import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Calculator,
  PoundSterling,
  Building2,
  Home,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import {
  calculateSDLT,
  calculateBTLMortgage,
  calculateHMOYield,
  calculateDevelopmentFinance,
  calculateSPVTax,
} from "@/lib/property-finance-module";

export default function Finance() {
  // SDLT Calculator State
  const [purchasePrice, setPurchasePrice] = useState(250000);
  const [isAdditional, setIsAdditional] = useState(true);
  const [isCompany, setIsCompany] = useState(false);

  // BTL Calculator State
  const [btlPrice, setBtlPrice] = useState(200000);
  const [btlRent, setBtlRent] = useState(1000);
  const [btlDeposit, setBtlDeposit] = useState(25);
  const [btlRate, setBtlRate] = useState(5.5);

  // HMO Calculator State
  const [hmoPrice, setHmoPrice] = useState(300000);
  const [hmoRooms, setHmoRooms] = useState(5);
  const [hmoRoomRent, setHmoRoomRent] = useState(600);

  // Development Finance State
  const [devPurchasePrice, setDevPurchasePrice] = useState(200000);
  const [devBuildCosts, setDevBuildCosts] = useState(150000);
  const [devGDV, setDevGDV] = useState(500000);

  // SPV Calculator State
  const [spvRent, setSpvRent] = useState(50000);
  const [spvInterest, setSpvInterest] = useState(15000);
  const [spvExpenses, setSpvExpenses] = useState(5000);

  // Calculations
  const sdlt = useMemo(() => 
    calculateSDLT(purchasePrice, { additionalDwelling: isAdditional, companyPurchase: isCompany }),
    [purchasePrice, isAdditional, isCompany]
  );

  const btlCalc = useMemo(() => 
    calculateBTLMortgage({ propertyValue: btlPrice, monthlyRent: btlRent, ltv: (100 - btlDeposit) / 100, interestRate: btlRate / 100 }),
    [btlPrice, btlRent, btlDeposit, btlRate]
  );

  const hmoYield = useMemo(() => 
    calculateHMOYield({ propertyValue: hmoPrice, roomCount: hmoRooms, avgRoomRent: hmoRoomRent }),
    [hmoPrice, hmoRooms, hmoRoomRent]
  );

  const devFinance = useMemo(() => 
    calculateDevelopmentFinance({ purchasePrice: devPurchasePrice, buildCosts: devBuildCosts, gdv: devGDV }),
    [devPurchasePrice, devBuildCosts, devGDV]
  );

  const spvTax = useMemo(() => 
    calculateSPVTax({ grossRent: spvRent, mortgageInterest: spvInterest, allowableExpenses: spvExpenses }),
    [spvRent, spvInterest, spvExpenses]
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <PoundSterling className="h-6 w-6" />
              Property Finance Calculator
            </h1>
            <p className="text-sm text-muted-foreground">
              SDLT, BTL yields, HMO analysis, development finance & SPV tax planning
            </p>
          </div>
          <Badge className="bg-primary">2026 Tax Rates</Badge>
        </div>

        <Tabs defaultValue="sdlt">
          <TabsList className="flex-wrap h-auto">
            <TabsTrigger value="sdlt">SDLT Calculator</TabsTrigger>
            <TabsTrigger value="btl">BTL Yield</TabsTrigger>
            <TabsTrigger value="hmo">HMO Analysis</TabsTrigger>
            <TabsTrigger value="development">Development Finance</TabsTrigger>
            <TabsTrigger value="spv">SPV Tax Planning</TabsTrigger>
          </TabsList>

          {/* SDLT Tab */}
          <TabsContent value="sdlt" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Purchase Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Purchase Price (£)</Label>
                    <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(Number(e.target.value))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Additional Property (+3%)?</Label>
                    <Switch checked={isAdditional} onCheckedChange={setIsAdditional} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Purchasing via Company (+2%)?</Label>
                    <Switch checked={isCompany} onCheckedChange={setIsCompany} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>SDLT Breakdown</CardTitle></CardHeader>
                <CardContent>
                  <div className="p-6 rounded-lg bg-primary/10 text-center mb-4">
                    <p className="text-sm text-muted-foreground">Total SDLT Payable</p>
                    <p className="text-4xl font-bold text-primary">£{sdlt.total.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-2">{sdlt.effectiveRate}% effective rate</p>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://www.gov.uk/stamp-duty-land-tax" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />HMRC SDLT Guide
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* BTL Tab */}
          <TabsContent value="btl" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Home className="h-5 w-5" />BTL Property Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Purchase Price (£)</Label>
                    <Input type="number" value={btlPrice} onChange={(e) => setBtlPrice(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Monthly Rent (£)</Label>
                    <Input type="number" value={btlRent} onChange={(e) => setBtlRent(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Deposit (%)</Label>
                    <Select value={btlDeposit.toString()} onValueChange={(v) => setBtlDeposit(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[15, 20, 25, 30, 40].map((n) => <SelectItem key={n} value={n.toString()}>{n}%</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input type="number" step="0.1" value={btlRate} onChange={(e) => setBtlRate(Number(e.target.value))} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>BTL Analysis</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-muted text-center">
                      <p className="text-sm text-muted-foreground">Gross Yield</p>
                      <p className="text-2xl font-bold">{btlCalc.annualYield}%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted text-center">
                      <p className="text-sm text-muted-foreground">Monthly Cashflow</p>
                      <p className="text-2xl font-bold text-success">£{btlCalc.cashflow}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Mortgage Amount</span><span className="font-mono">£{btlCalc.mortgageAmount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Monthly Payment</span><span className="font-mono">£{btlCalc.monthlyPayment}</span></div>
                    <div className="flex justify-between"><span>ICR @ Stress Test</span><span className="font-mono">{btlCalc.icr}</span></div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      {btlCalc.meetsStressTest ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                      <span className={btlCalc.meetsStressTest ? "text-success" : "text-destructive"}>
                        {btlCalc.meetsStressTest ? "Passes stress test" : "Fails stress test"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HMO Tab */}
          <TabsContent value="hmo" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />HMO Property Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Purchase Price (£)</Label>
                    <Input type="number" value={hmoPrice} onChange={(e) => setHmoPrice(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Number of Lettable Rooms</Label>
                    <Select value={hmoRooms.toString()} onValueChange={(v) => setHmoRooms(Number(v))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => <SelectItem key={n} value={n.toString()}>{n} rooms</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Average Room Rent (£/month)</Label>
                    <Input type="number" value={hmoRoomRent} onChange={(e) => setHmoRoomRent(Number(e.target.value))} />
                  </div>
                  {hmoRooms >= 5 && (
                    <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-sm">
                      <AlertTriangle className="h-4 w-4 inline mr-2 text-warning" />5+ rooms requires mandatory HMO licence
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>HMO Analysis</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-muted text-center">
                      <p className="text-sm text-muted-foreground">Gross Yield</p>
                      <p className="text-2xl font-bold">{hmoYield.grossYield}%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/10 text-center">
                      <p className="text-sm text-muted-foreground">Net Yield</p>
                      <p className="text-2xl font-bold text-success">{hmoYield.netYield}%</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Monthly Income</span><span className="font-mono">£{hmoYield.totalMonthlyRent.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Annual Income</span><span className="font-mono">£{hmoYield.totalAnnualRent.toLocaleString()}</span></div>
                    <div className="flex justify-between text-success"><span>Net Operating Income</span><span className="font-mono">£{hmoYield.netOperatingIncome.toLocaleString()}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Development Finance Tab */}
          <TabsContent value="development" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Development Appraisal</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Site/Property Purchase (£)</Label>
                    <Input type="number" value={devPurchasePrice} onChange={(e) => setDevPurchasePrice(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Build/Refurb Costs (£)</Label>
                    <Input type="number" value={devBuildCosts} onChange={(e) => setDevBuildCosts(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Gross Development Value (£)</Label>
                    <Input type="number" value={devGDV} onChange={(e) => setDevGDV(Number(e.target.value))} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Development Analysis</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-muted text-center">
                      <p className="text-sm text-muted-foreground">Profit on Cost</p>
                      <p className="text-2xl font-bold">{devFinance.profitOnCost}%</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted text-center">
                      <p className="text-sm text-muted-foreground">Profit on GDV</p>
                      <p className="text-2xl font-bold">{devFinance.profitOnGDV}%</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Total Project Cost</span><span className="font-mono">£{devFinance.totalProjectCost.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Max Loan ({devFinance.ltc}% LTC)</span><span className="font-mono">£{devFinance.maxLoan.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Equity Required</span><span className="font-mono">£{devFinance.equity.toLocaleString()}</span></div>
                    <div className="flex justify-between text-success"><span>Net Profit</span><span className="font-mono">£{devFinance.profitAfterFinance.toLocaleString()}</span></div>
                  </div>
                  <div className="mt-4 p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      {devFinance.viable ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
                      <span>{devFinance.viable ? "Project viable (20%+ profit on cost)" : "Low margin - review costs"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* SPV Tab */}
          <TabsContent value="spv" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />SPV Tax Planning</CardTitle>
                  <CardDescription>Corporation tax & extraction modelling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Annual Gross Rent (£)</Label>
                    <Input type="number" value={spvRent} onChange={(e) => setSpvRent(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mortgage Interest (£)</Label>
                    <Input type="number" value={spvInterest} onChange={(e) => setSpvInterest(Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label>Allowable Expenses (£)</Label>
                    <Input type="number" value={spvExpenses} onChange={(e) => setSpvExpenses(Number(e.target.value))} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle>Tax Analysis</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 rounded-lg bg-muted text-center">
                      <p className="text-sm text-muted-foreground">Corp Tax (25%)</p>
                      <p className="text-2xl font-bold">£{spvTax.corporationTax.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-success/10 text-center">
                      <p className="text-sm text-muted-foreground">Profit After Tax</p>
                      <p className="text-2xl font-bold text-success">£{spvTax.profitAfterTax.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Taxable Profit</span><span className="font-mono">£{spvTax.taxableProfit.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Dividend (gross)</span><span className="font-mono">£{spvTax.dividendGross.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Dividend Tax (higher rate)</span><span className="font-mono">-£{spvTax.dividendTax.toLocaleString()}</span></div>
                    <div className="flex justify-between text-success"><span>Net to Director</span><span className="font-mono">£{spvTax.netDividend.toLocaleString()}</span></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Effective rate: {spvTax.effectiveTaxRate}% (corp tax + dividend tax)</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">
              <strong>Disclaimer:</strong> These calculators provide estimates only. Always consult a qualified accountant or tax advisor.
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
