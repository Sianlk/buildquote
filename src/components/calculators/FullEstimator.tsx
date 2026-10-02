import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { REGIONAL_MULTIPLIERS } from "@/lib/construction-rates";
import {
  BUILD_TYPES, SPEC_LABEL, calculateEstimate, defaultsFromArea,
  DAY_RATES, type MyRates,
  type BuildType, type Spec, type Region, type EstimateInput, type BOMLine,
} from "@/lib/full-estimator";
import { printQuote, generateQuoteNumber, DEFAULT_COMPANY, type CompanyDetails } from "@/lib/quote-pdf-generator";
import { FileDown, Upload, Trash2, Save, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SUPPLIERS = [
  { name: "Screwfix", url: (q: string) => `https://www.screwfix.com/search?search=${encodeURIComponent(q)}` },
  { name: "Toolstation", url: (q: string) => `https://www.toolstation.com/search?q=${encodeURIComponent(q)}` },
  { name: "B&Q", url: (q: string) => `https://www.diy.com/search?term=${encodeURIComponent(q)}` },
  { name: "Travis Perkins", url: (q: string) => `https://www.travisperkins.co.uk/search?text=${encodeURIComponent(q)}` },
];
const searchTerm = (item: string) => item.replace(/\(.*?\)/g, "").split(/[—+/]/)[0].trim();

const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
const COMPANY_KEY = "bq_company_details";

export function FullEstimator() {
  const { toast } = useToast();
  const sub = useSubscription();
  const [mode, setMode] = useState<"easy" | "complex">("easy");
  const [buildType, setBuildType] = useState<BuildType>("single_extension");
  const [spec, setSpec] = useState<Spec>("mid");
  const [region, setRegion] = useState<Region>("south_east");
  const [area, setArea] = useState(25);
  const [c, setC] = useState<Partial<EstimateInput>>({});
  const [incKitchen, setIncKitchen] = useState(true);
  const [incDeco, setIncDeco] = useState(true);
  const [contingency, setContingency] = useState(10);
  const [vatReg, setVatReg] = useState(true);
  const [customer, setCustomer] = useState({ name: "", address: "", email: "" });
  const [company, setCompany] = useState<CompanyDetails>(() => {
    try { return { ...DEFAULT_COMPANY, ...JSON.parse(localStorage.getItem(COMPANY_KEY) || "{}") }; } catch { return DEFAULT_COMPANY; }
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState({ openPlan: true, lounge: false, bedrooms: 0, bathrooms: 1, ensuites: 0, utility: false, wc: false });
  const [myRates, setMyRates] = useState<MyRates>({});
  const [useMine, setUseMine] = useState(false);
  const [showRates, setShowRates] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("estimator_rates").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      const r = (data?.estimator_rates || {}) as MyRates;
      setMyRates(r); if (Object.keys(r).length) setUseMine(true);
    });
  }, [user]);
  const saveRates = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ estimator_rates: myRates as never }).eq("user_id", user.id);
    if (error) toast({ title: "Could not save rates", description: error.message, variant: "destructive" });
    else { setUseMine(true); toast({ title: "Your rates are saved", description: "Every estimate and quote now uses them." }); }
  };
  const [edits, setEdits] = useState<Record<number, Partial<BOMLine>>>({});

  useEffect(() => { localStorage.setItem(COMPANY_KEY, JSON.stringify(company)); }, [company]);
  useEffect(() => { setC({}); setEdits({}); }, [buildType]);

  const input: EstimateInput = useMemo(() => {
    const d = defaultsFromArea(area, buildType);
    return {
      buildType, spec, region, length: 0, width: 0, storeys: 1, ceilingHeight: 2.4, bedrooms: 0, bathrooms: 0, kitchens: 0,
      windows: 0, externalDoors: 0, internalDoors: 0, rooflights: 0, ...d,
      ...(mode === "easy" ? { kitchens: rooms.openPlan ? 1 : 0, bedrooms: rooms.bedrooms, bathrooms: rooms.bathrooms + rooms.ensuites + (rooms.wc ? 1 : 0),
        internalDoors: rooms.bedrooms + rooms.bathrooms + rooms.ensuites + (rooms.wc ? 1 : 0) + (rooms.utility ? 1 : 0) + (rooms.lounge ? 1 : 0) } : c),
      includeKitchen: incKitchen && (mode === "complex" || rooms.openPlan), includeDecoration: incDeco, contingencyPct: contingency, vatRegistered: vatReg, rates: useMine ? myRates : undefined,
    } as EstimateInput;
  }, [area, buildType, spec, region, mode, c, rooms, useMine, myRates, incKitchen, incDeco, contingency, vatReg]);

  const est = useMemo(() => calculateEstimate(input), [input]);
  const bom = est.bom.map((b, i) => {
    const e = edits[i]; if (!e) return b;
    const m = { ...b, ...e }; return { ...m, total: Math.round(m.qty * m.rate * 100) / 100 };
  });
  const matTotal = bom.reduce((s, b) => s + b.total, 0);
  const delta = matTotal - est.materials;
  const subtotal = est.subtotal + delta * 1.23;
  const vat = subtotal * est.vatRate / 100;
  const total = subtotal + vat;

  const num = (k: keyof EstimateInput) => (
    <div key={k}>
      <Label className="text-xs capitalize">{String(k).replace(/([A-Z])/g, " $1")}</Label>
      <Input type="number" step="0.1" value={(input[k] as number) ?? 0}
        onChange={(e) => setC((p) => ({ ...p, [k]: Math.max(0, parseFloat(e.target.value) || 0) }))} />
    </div>
  );

  const onLogo = (f?: File) => {
    if (!f) return;
    if (f.size > 500_000) { toast({ title: "Logo too large", description: "Please use an image under 500KB.", variant: "destructive" }); return; }
    const r = new FileReader(); r.onload = () => setCompany((p) => ({ ...p, logo: String(r.result) })); r.readAsDataURL(f);
  };

  const download = () => {
    if (!sub.canDownload) { toast({ title: "Free downloads used", description: "Subscribe for £5.99/month for unlimited branded quotes.", variant: "destructive" }); return; }
    const byCat: Record<string, number> = {};
    bom.forEach((b) => { byCat[b.category] = (byCat[b.category] || 0) + b.total; });
    const items = [
      ...Object.entries(byCat).map(([k, v]) => ({ description: `${k} — materials`, quantity: 1, unit: "item", unitPrice: v, total: v })),
      ...est.labour.map((l) => ({ description: `${l.trade} labour`, quantity: l.days, unit: "day", unitPrice: l.dayRate, total: l.total })),
      { description: "Preliminaries (site set-up, welfare, scaffold)", quantity: 1, unit: "item", unitPrice: est.prelims, total: est.prelims },
      { description: "Professional fees (design, engineer, Building Control)", quantity: 1, unit: "item", unitPrice: est.fees, total: est.fees },
      { description: `Contingency ${contingency}%`, quantity: 1, unit: "item", unitPrice: est.contingency, total: est.contingency },
      { description: "Overheads & profit", quantity: 1, unit: "item", unitPrice: est.profit + delta * 0.23, total: est.profit + delta * 0.23 },
    ];
    const today = new Date(); const valid = new Date(Date.now() + 30 * 864e5);
    printQuote({
      quoteNumber: generateQuoteNumber(), quoteDate: today.toISOString(), validUntil: valid.toISOString(),
      customerName: customer.name || "Client", customerAddress: customer.address || "", customerEmail: customer.email,
      projectDescription: `${BUILD_TYPES[buildType].label} — ${est.area}m², ${SPEC_LABEL[spec]} spec. Programme approx. ${est.programmeWeeks} weeks.`,
      items, subtotal, vatRate: est.vatRate, vatAmount: vat, total,
      notes: est.notes, paymentTerms: "20% deposit, stage payments, balance on completion. Payment within 14 days of invoice.",
    }, sub.canUseBrandedExports ? company : { ...company, logo: undefined });
    sub.incrementDownload();
  };

  const saveAsQuote = async () => {
    if (!user) return;
    const byCat: Record<string, number> = {};
    bom.forEach((b) => { byCat[b.category] = (byCat[b.category] || 0) + b.total; });
    const items = [
      ...Object.entries(byCat).map(([k, v]) => ({ description: `${k} — materials`, quantity: 1, unit: "item", unitPrice: Math.round(v * 100) / 100, total: v, kind: "materials" })),
      ...est.labour.map((l) => ({ description: `${l.trade} labour`, quantity: l.days, unit: "day", unitPrice: l.dayRate, total: l.total, kind: "labour" })),
      { description: "Preliminaries, professional fees, contingency, overheads & profit", quantity: 1, unit: "item", unitPrice: Math.round((subtotal - matTotal - est.labourTotal) * 100) / 100, total: 0, kind: "other" },
    ];
    const { error } = await supabase.from("quotes").insert({
      user_id: user.id, quote_number: generateQuoteNumber(), customer_name: customer.name || "Client", customer_address: customer.address,
      customer_email: customer.email, project_description: `${BUILD_TYPES[buildType].label} — ${est.area}m², ${SPEC_LABEL[spec]} spec`,
      items: items as never, subtotal, vat_rate: est.vatRate, vat_amount: vat, total, notes: est.notes,
    });
    if (error) { toast({ title: "Could not save", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Saved to Quotes & Invoices" }); navigate("/dashboard/quotes");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle>Build Estimator</CardTitle>
              <CardDescription>Every build type, low / mid / high spec, full materials list, labour and a PDF quote.</CardDescription>
            </div>
            <Tabs value={mode} onValueChange={(v) => setMode(v as "easy" | "complex")}>
              <TabsList><TabsTrigger value="easy">Easy</TabsTrigger><TabsTrigger value="complex">Detailed</TabsTrigger></TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label className="text-xs">Type of build</Label>
              <Select value={buildType} onValueChange={(v) => setBuildType(v as BuildType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(BUILD_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Specification</Label>
              <Select value={spec} onValueChange={(v) => setSpec(v as Spec)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{(Object.keys(SPEC_LABEL) as Spec[]).map((s) => <SelectItem key={s} value={s}>{SPEC_LABEL[s]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Region</Label>
              <Select value={region} onValueChange={(v) => setRegion(v as Region)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.keys(REGIONAL_MULTIPLIERS).map((r) => <SelectItem key={r} value={r} className="capitalize">{r.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          {mode === "easy" ? (
            <div className="space-y-3">
              <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
                <div><Label className="text-xs">Total floor area (m²)</Label>
                  <Input type="number" value={area} onChange={(e) => setArea(Math.max(1, parseFloat(e.target.value) || 1))} /></div>
                {([["bedrooms", "Bedrooms"], ["bathrooms", "Bathrooms"], ["ensuites", "En-suites"]] as const).map(([k, l]) => (
                  <div key={k}><Label className="text-xs">{l}</Label>
                    <Input type="number" min={0} value={rooms[k]} onChange={(e) => setRooms((r) => ({ ...r, [k]: Math.max(0, parseInt(e.target.value) || 0) }))} /></div>))}
              </div>
              <div className="flex flex-wrap gap-2">
                {([["openPlan", "Open-plan kitchen / diner"], ["lounge", "Separate lounge"], ["utility", "Utility room"], ["wc", "Downstairs WC"]] as const).map(([k, l]) => (
                  <Button key={k} type="button" size="sm" variant={rooms[k] ? "default" : "outline"} onClick={() => setRooms((r) => ({ ...r, [k]: !r[k] }))}>{l}</Button>))}
              </div>
              <p className="text-sm rounded-md bg-secondary/50 p-3">
                <strong>Quick quote:</strong> a {area}m² {BUILD_TYPES[buildType].label.toLowerCase()} ({SPEC_LABEL[spec].toLowerCase()})
                {rooms.openPlan ? " with open-plan kitchen/diner" : ""}{rooms.lounge ? ", lounge" : ""}{rooms.bedrooms ? `, ${rooms.bedrooms} bedroom(s)` : ""}{rooms.bathrooms ? `, ${rooms.bathrooms} bathroom(s)` : ""}{rooms.ensuites ? `, ${rooms.ensuites} en-suite(s)` : ""}
                {" "}is typically <strong>{gbp(est.benchmark[0])} – {gbp(est.benchmark[1])}</strong> ex VAT. Our itemised estimate: materials {gbp(est.materials)}, labour {gbp(est.labourTotal)}, total {gbp(est.total)} inc. fees, contingency{est.vatRate ? " and VAT" : ""}.
              </p>
            </div>
          ) : (
            <div className="grid gap-3 grid-cols-2 md:grid-cols-6">
              {(["length", "width", "storeys", "ceilingHeight", "bedrooms", "bathrooms", "kitchens", "windows", "externalDoors", "internalDoors", "rooflights"] as (keyof EstimateInput)[]).map(num)}
              <div><Label className="text-xs">Contingency %</Label><Input type="number" value={contingency} onChange={(e) => setContingency(Math.max(0, parseFloat(e.target.value) || 0))} /></div>
            </div>
          )}
          <div className="flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2"><Switch checked={incKitchen} onCheckedChange={setIncKitchen} />Include kitchen</label>
            <label className="flex items-center gap-2"><Switch checked={incDeco} onCheckedChange={setIncDeco} />Include decoration & flooring</label>
            <label className="flex items-center gap-2"><Switch checked={vatReg} onCheckedChange={setVatReg} />Charge VAT (VAT registered)</label>
          </div>
          <p className="text-xs text-muted-foreground border-l-2 border-primary pl-3">{est.notes}</p>
          <div className="border border-border rounded-md p-3 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="flex items-center gap-2 text-sm font-medium"><Switch checked={useMine} onCheckedChange={setUseMine} />Use my own local rates {useMine ? "" : "(currently UK 2026 averages × region)"}</label>
              <Button size="sm" variant="ghost" onClick={() => setShowRates((v) => !v)}>{showRates ? "Hide" : "Edit my rates"}</Button>
            </div>
            {showRates && <>
              <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
                {Object.keys(DAY_RATES).map((t) => (
                  <div key={t}><Label className="text-xs">{t} £/day</Label>
                    <Input type="number" placeholder={String(Math.round(DAY_RATES[t] * REGIONAL_MULTIPLIERS[region]))} value={myRates.day?.[t] ?? ""}
                      onChange={(e) => setMyRates((r) => ({ ...r, day: { ...r.day, [t]: parseFloat(e.target.value) || 0 } }))} /></div>))}
                <div><Label className="text-xs">Materials vs list price %</Label><Input type="number" placeholder="0 (e.g. -15 trade discount)" value={myRates.materialAdjustPct ?? ""} onChange={(e) => setMyRates((r) => ({ ...r, materialAdjustPct: parseFloat(e.target.value) || 0 }))} /></div>
                <div><Label className="text-xs">Overheads & profit %</Label><Input type="number" placeholder="15" value={myRates.profitPct ?? ""} onChange={(e) => setMyRates((r) => ({ ...r, profitPct: e.target.value === "" ? undefined : parseFloat(e.target.value) }))} /></div>
                <div><Label className="text-xs">Preliminaries %</Label><Input type="number" placeholder="8" value={myRates.prelimsPct ?? ""} onChange={(e) => setMyRates((r) => ({ ...r, prelimsPct: e.target.value === "" ? undefined : parseFloat(e.target.value) }))} /></div>
              </div>
              <p className="text-xs text-muted-foreground">Leave a box blank to keep the regional average shown in grey. Your day rates are used exactly as entered.</p>
              <Button size="sm" onClick={saveRates}>Save my rates</Button>
            </>}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        {[["Total quote", gbp(total)], ["Materials", gbp(matTotal)], ["Labour", gbp(est.labourTotal)], ["Programme", `${est.programmeWeeks} weeks`]].map(([k, v]) => (
          <Card key={k}><CardContent className="pt-6"><p className="text-xs text-muted-foreground">{k}</p><p className="text-2xl font-bold">{v}</p></CardContent></Card>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Market benchmark for {est.area}m²: {gbp(est.benchmark[0])} – {gbp(est.benchmark[1])} (ex VAT). Pipe: {est.pipe15}m of 15mm, {est.pipe22}m of 22mm. Cable: {est.cableTwin25}m 2.5mm², {est.cableTwin15}m 1.5mm².</p>

      <Tabs defaultValue="bom">
        <TabsList className="flex w-full overflow-x-auto justify-start">
          <TabsTrigger value="bom">Materials ({bom.length})</TabsTrigger>
          <TabsTrigger value="labour">Labour</TabsTrigger>
          <TabsTrigger value="heat">Radiators / BTU</TabsTrigger>
          <TabsTrigger value="quote">Quote & PDF</TabsTrigger>
        </TabsList>
        <TabsContent value="bom">
          <Card><CardContent className="pt-4 overflow-x-auto">
            <p className="text-xs text-muted-foreground mb-2">Quantities and prices are editable — changes flow into the quote. Use the Buy links to compare live prices at UK merchants (trade accounts often get 10–30% off).</p>
            <table className="w-full text-sm min-w-[640px]">
              <thead><tr className="text-left text-muted-foreground border-b"><th className="py-2">Category</th><th>Item</th><th className="w-20">Qty</th><th>Unit</th><th className="w-24">Rate £</th><th className="text-right">Total</th><th className="pl-3">Buy</th></tr></thead>
              <tbody>{bom.map((b, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-1"><Badge variant="outline">{b.category}</Badge></td><td>{b.item}</td>
                  <td><Input className="h-8" type="number" value={b.qty} onChange={(e) => setEdits((p) => ({ ...p, [i]: { ...p[i], qty: parseFloat(e.target.value) || 0 } }))} /></td>
                  <td>{b.unit}</td>
                  <td><Input className="h-8" type="number" step="0.01" value={b.rate} onChange={(e) => setEdits((p) => ({ ...p, [i]: { ...p[i], rate: parseFloat(e.target.value) || 0 } }))} /></td>
                  <td className="text-right">{gbp(b.total)}</td>
                  <td className="pl-3 whitespace-nowrap text-xs">{SUPPLIERS.map((sp) => <a key={sp.name} href={sp.url(searchTerm(b.item))} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mr-2 inline-flex items-center gap-0.5">{sp.name}<ExternalLink className="h-3 w-3" /></a>)}</td>
                </tr>))}</tbody>
            </table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="labour">
          <Card><CardContent className="pt-4 overflow-x-auto">
            <table className="w-full text-sm"><thead><tr className="text-left text-muted-foreground border-b"><th className="py-2">Trade</th><th>Days</th><th>Hours</th><th>Day rate</th><th className="text-right">Total</th></tr></thead>
              <tbody>{est.labour.map((l) => <tr key={l.trade} className="border-b border-border/50"><td className="py-1">{l.trade}</td><td>{l.days}</td><td>{l.days * 8}</td><td>{gbp(l.dayRate)}</td><td className="text-right">{gbp(l.total)}</td></tr>)}</tbody></table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="heat">
          <Card><CardContent className="pt-4 overflow-x-auto">
            <table className="w-full text-sm"><thead><tr className="text-left text-muted-foreground border-b"><th className="py-2">Room</th><th>Area m²</th><th>Watts</th><th>BTU</th><th>Suggested radiator</th></tr></thead>
              <tbody>{est.rooms.map((r) => <tr key={r.room} className="border-b border-border/50"><td className="py-1">{r.room}</td><td>{r.area}</td><td>{r.watts}</td><td>{r.btu.toLocaleString()}</td><td>{r.radiator}</td></tr>)}</tbody></table>
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="quote">
          <Card><CardContent className="pt-4 grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Your business</h4>
              {(["name", "address", "phone", "email", "vatNumber"] as const).map((k) => (
                <Input key={k} placeholder={k} value={company[k] || ""} onChange={(e) => setCompany((p) => ({ ...p, [k]: e.target.value }))} />))}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild><label className="cursor-pointer"><Upload className="h-4 w-4 mr-1" />Upload logo<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} /></label></Button>
                {company.logo && <><img src={company.logo} alt="Logo" className="h-8" /><Button variant="ghost" size="sm" onClick={() => setCompany((p) => ({ ...p, logo: undefined }))}><Trash2 className="h-4 w-4" /></Button></>}
              </div>
              {!sub.canUseBrandedExports && <p className="text-xs text-muted-foreground">Logo appears on PDFs for subscribers (£5.99/month).</p>}
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Client</h4>
              <Input placeholder="Client name" value={customer.name} onChange={(e) => setCustomer((p) => ({ ...p, name: e.target.value }))} />
              <Input placeholder="Site address" value={customer.address} onChange={(e) => setCustomer((p) => ({ ...p, address: e.target.value }))} />
              <Input placeholder="Client email" value={customer.email} onChange={(e) => setCustomer((p) => ({ ...p, email: e.target.value }))} />
              <div className="text-sm pt-2 space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>{gbp(subtotal)}</span></div>
                <div className="flex justify-between"><span>VAT {est.vatRate}%</span><span>{gbp(vat)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>{gbp(total)}</span></div>
              </div>
              <Button className="w-full" variant="outline" onClick={saveAsQuote}><Save className="h-4 w-4 mr-2" />Save to Quotes & Invoices</Button>
              <Button className="w-full" onClick={download}><FileDown className="h-4 w-4 mr-2" />Download PDF quote</Button>
              {!sub.isSubscribed && <p className="text-xs text-muted-foreground">{Math.max(0, 2 - sub.downloadsUsed)} free downloads left this month.</p>}
            </div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
