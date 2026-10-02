import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { printQuote, generateQuoteNumber, DEFAULT_COMPANY, type CompanyDetails } from "@/lib/quote-pdf-generator";
import { Plus, Trash2, FileDown, Receipt, CheckCircle, Upload, Save, FilePlus } from "lucide-react";
import { z } from "zod";

type Line = { description: string; quantity: number; unit: string; unitPrice: number; total: number; kind?: "labour" | "materials" | "other" };
type Quote = {
  id?: string; quote_number: string; customer_name: string; customer_address: string; customer_email: string; customer_phone: string;
  project_description: string; items: Line[]; vat_rate: number; cis_rate: number; status: string; valid_until: string | null;
  invoice_number: string | null; invoiced_at: string | null; due_date: string | null; paid_at: string | null; notes: string | null;
};
const COMPANY_KEY = "bq_company_details";
const gbp = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n || 0);
const blank = (): Quote => ({
  quote_number: generateQuoteNumber(), customer_name: "", customer_address: "", customer_email: "", customer_phone: "",
  project_description: "", items: [{ description: "", quantity: 1, unit: "item", unitPrice: 0, total: 0, kind: "labour" }],
  vat_rate: 20, cis_rate: 0, status: "draft", valid_until: new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10),
  invoice_number: null, invoiced_at: null, due_date: null, paid_at: null, notes: "",
});
const schema = z.object({
  customer_name: z.string().trim().min(1, "Client name is required").max(120),
  customer_email: z.string().trim().max(255).email("Invalid client email").or(z.literal("")),
  items: z.array(z.object({ description: z.string().trim().min(1, "Every line needs a description").max(300) })).min(1),
});

export function totals(q: Pick<Quote, "items" | "vat_rate" | "cis_rate">) {
  const subtotal = q.items.reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const labour = q.items.filter((l) => l.kind === "labour").reduce((s, l) => s + l.quantity * l.unitPrice, 0);
  const vat = subtotal * q.vat_rate / 100;
  const cis = labour * q.cis_rate / 100;
  return { subtotal, vat, total: subtotal + vat, cis, labour };
}

export default function Quotes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const sub = useSubscription();
  const [list, setList] = useState<Quote[]>([]);
  const [q, setQ] = useState<Quote>(blank());
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<CompanyDetails & { bank?: string }>(() => {
    try { return { ...DEFAULT_COMPANY, ...JSON.parse(localStorage.getItem(COMPANY_KEY) || "{}") }; } catch { return DEFAULT_COMPANY; }
  });
  useEffect(() => { localStorage.setItem(COMPANY_KEY, JSON.stringify(company)); }, [company]);

  const load = async () => {
    const { data } = await supabase.from("quotes").select("*").order("created_at", { ascending: false });
    const rows = (data || []) as unknown as Quote[];
    setList(rows);
    const open = new URLSearchParams(window.location.search).get("open");
    const hit = open && rows.find((r) => r.id === open);
    if (hit) setQ(hit);
  };
  useEffect(() => { if (user) load(); }, [user]);

  const t = useMemo(() => totals(q), [q]);
  const setLine = (i: number, patch: Partial<Line>) => setQ((p) => ({ ...p, items: p.items.map((l, j) => j === i ? { ...l, ...patch, total: (patch.quantity ?? l.quantity) * (patch.unitPrice ?? l.unitPrice) } : l) }));

  const save = async (extra: Partial<Quote> = {}) => {
    const next = { ...q, ...extra };
    const v = schema.safeParse(next);
    if (!v.success) { toast({ title: "Check the quote", description: v.error.issues[0].message, variant: "destructive" }); return null; }
    setSaving(true);
    const tt = totals(next);
    const row = {
      ...next, items: next.items as unknown as never, subtotal: tt.subtotal, vat_amount: tt.vat, total: tt.total, cis_amount: tt.cis, user_id: user!.id,
    };
    const res = next.id
      ? await supabase.from("quotes").update(row).eq("id", next.id).select().single()
      : await supabase.from("quotes").insert(row).select().single();
    setSaving(false);
    if (res.error) { toast({ title: "Could not save", description: res.error.message, variant: "destructive" }); return null; }
    const saved = res.data as unknown as Quote; setQ(saved); load();
    toast({ title: "Saved" }); return saved;
  };

  const toInvoice = () => save({
    status: "invoiced", invoice_number: q.invoice_number || q.quote_number.replace(/^Q/, "INV"),
    invoiced_at: new Date().toISOString(), due_date: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10),
  });

  const pdf = (doc: "QUOTATION" | "INVOICE") => {
    if (!sub.canDownload) { toast({ title: "Free downloads used", description: "Subscribe for £5.99/month for unlimited downloads.", variant: "destructive" }); return; }
    printQuote({
      docType: doc, quoteNumber: doc === "INVOICE" ? (q.invoice_number || q.quote_number) : q.quote_number,
      quoteDate: (doc === "INVOICE" ? q.invoiced_at : null) || new Date().toISOString(), validUntil: q.valid_until || new Date().toISOString(),
      dueDate: q.due_date || undefined, customerName: q.customer_name, customerAddress: q.customer_address, customerEmail: q.customer_email,
      customerPhone: q.customer_phone, projectDescription: q.project_description, items: q.items.map((l) => ({ ...l, total: l.quantity * l.unitPrice })),
      subtotal: t.subtotal, vatRate: q.vat_rate, vatAmount: t.vat, total: t.total, cisRate: q.cis_rate, cisAmount: t.cis,
      notes: q.notes || undefined, bankDetails: company.bank,
      paymentTerms: doc === "INVOICE" ? `Payment due within 14 days${q.due_date ? ` (by ${new Date(q.due_date).toLocaleDateString("en-GB")})` : ""}. Late payment interest may be charged under the Late Payment of Commercial Debts Act 1998.` : "20% deposit, stage payments, balance on completion.",
    }, sub.canUseBrandedExports ? company : { ...company, logo: undefined });
    sub.incrementDownload();
  };

  const onLogo = (f?: File) => {
    if (!f) return;
    if (f.size > 500_000) { toast({ title: "Logo too large", description: "Use an image under 500KB.", variant: "destructive" }); return; }
    const r = new FileReader(); r.onload = () => setCompany((p) => ({ ...p, logo: String(r.result) })); r.readAsDataURL(f);
  };

  const outstanding = list.filter((x) => x.status === "invoiced").reduce((s, x) => s + totals(x).total, 0);
  const paid = list.filter((x) => x.status === "paid").reduce((s, x) => s + totals(x).total, 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-2xl md:text-3xl font-bold">Quotes & Invoices</h1>
            <p className="text-muted-foreground">Create a quote, turn it into a tax invoice in one click, and download a branded PDF.</p></div>
          <Button onClick={() => setQ(blank())}><FilePlus className="h-4 w-4 mr-2" />New quote</Button>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[["Quotes", list.length], ["Accepted", list.filter((x) => x.status === "accepted").length], ["Outstanding", gbp(outstanding)], ["Paid", gbp(paid)]].map(([k, v]) => (
            <Card key={k as string}><CardContent className="pt-6"><p className="text-xs text-muted-foreground">{k}</p><p className="text-xl font-bold">{v}</p></CardContent></Card>))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{q.status === "draft" || q.status === "sent" || q.status === "accepted" ? "Quote" : "Invoice"} {q.invoice_number || q.quote_number}</CardTitle>
                <Badge variant="outline" className="capitalize">{q.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div><Label>Client name *</Label><Input value={q.customer_name} onChange={(e) => setQ({ ...q, customer_name: e.target.value })} /></div>
                <div><Label>Client email</Label><Input value={q.customer_email} onChange={(e) => setQ({ ...q, customer_email: e.target.value })} /></div>
                <div><Label>Client phone</Label><Input value={q.customer_phone} onChange={(e) => setQ({ ...q, customer_phone: e.target.value })} /></div>
                <div><Label>Site address</Label><Input value={q.customer_address} onChange={(e) => setQ({ ...q, customer_address: e.target.value })} /></div>
              </div>
              <div><Label>Description of works</Label><Textarea rows={2} value={q.project_description} onChange={(e) => setQ({ ...q, project_description: e.target.value })} /></div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[620px]">
                  <thead><tr className="text-left text-muted-foreground border-b"><th className="py-2">Description</th><th className="w-28">Type</th><th className="w-20">Qty</th><th className="w-20">Unit</th><th className="w-24">Price £</th><th className="text-right w-24">Total</th><th /></tr></thead>
                  <tbody>{q.items.map((l, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-1 pr-1"><Input className="h-8" value={l.description} onChange={(e) => setLine(i, { description: e.target.value })} placeholder="e.g. Labour – first fix plumbing" /></td>
                      <td className="pr-1"><Select value={l.kind || "other"} onValueChange={(v) => setLine(i, { kind: v as Line["kind"] })}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="labour">Labour</SelectItem><SelectItem value="materials">Materials</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></td>
                      <td className="pr-1"><Input className="h-8" type="number" value={l.quantity} onChange={(e) => setLine(i, { quantity: parseFloat(e.target.value) || 0 })} /></td>
                      <td className="pr-1"><Input className="h-8" value={l.unit} onChange={(e) => setLine(i, { unit: e.target.value })} /></td>
                      <td className="pr-1"><Input className="h-8" type="number" step="0.01" value={l.unitPrice} onChange={(e) => setLine(i, { unitPrice: parseFloat(e.target.value) || 0 })} /></td>
                      <td className="text-right">{gbp(l.quantity * l.unitPrice)}</td>
                      <td><Button variant="ghost" size="sm" aria-label="Remove line" onClick={() => setQ({ ...q, items: q.items.filter((_, j) => j !== i) })}><Trash2 className="h-4 w-4" /></Button></td>
                    </tr>))}</tbody>
                </table>
              </div>
              <Button variant="outline" size="sm" onClick={() => setQ({ ...q, items: [...q.items, { description: "", quantity: 1, unit: "item", unitPrice: 0, total: 0, kind: "materials" }] })}><Plus className="h-4 w-4 mr-1" />Add line</Button>

              <div className="grid gap-3 md:grid-cols-3">
                <div><Label>VAT rate</Label><Select value={String(q.vat_rate)} onValueChange={(v) => setQ({ ...q, vat_rate: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="20">20% standard</SelectItem><SelectItem value="5">5% reduced (eligible renovations, energy-saving)</SelectItem><SelectItem value="0">0% (new build / not VAT registered)</SelectItem></SelectContent></Select></div>
                <div><Label>CIS deduction (subcontractors)</Label><Select value={String(q.cis_rate)} onValueChange={(v) => setQ({ ...q, cis_rate: Number(v) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="0">None</SelectItem><SelectItem value="20">20% (CIS registered)</SelectItem><SelectItem value="30">30% (not registered)</SelectItem></SelectContent></Select></div>
                <div><Label>Quote valid until</Label><Input type="date" value={q.valid_until || ""} onChange={(e) => setQ({ ...q, valid_until: e.target.value })} /></div>
              </div>
              <div><Label>Notes</Label><Textarea rows={2} value={q.notes || ""} onChange={(e) => setQ({ ...q, notes: e.target.value })} /></div>

              <div className="text-sm space-y-1 ml-auto max-w-xs">
                <div className="flex justify-between"><span>Subtotal</span><span>{gbp(t.subtotal)}</span></div>
                <div className="flex justify-between"><span>VAT {q.vat_rate}%</span><span>{gbp(t.vat)}</span></div>
                <div className="flex justify-between font-bold"><span>Total</span><span>{gbp(t.total)}</span></div>
                {t.cis > 0 && <><div className="flex justify-between text-muted-foreground"><span>CIS {q.cis_rate}% on labour</span><span>-{gbp(t.cis)}</span></div>
                  <div className="flex justify-between font-bold"><span>Payable</span><span>{gbp(t.total - t.cis)}</span></div></>}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => save()} disabled={saving}><Save className="h-4 w-4 mr-2" />Save</Button>
                <Button variant="outline" onClick={() => pdf("QUOTATION")}><FileDown className="h-4 w-4 mr-2" />Quote PDF</Button>
                {q.id && q.status !== "accepted" && !q.invoice_number && <Button variant="outline" onClick={() => save({ status: "accepted" })}><CheckCircle className="h-4 w-4 mr-2" />Mark accepted</Button>}
                {q.id && !q.invoice_number && <Button variant="secondary" onClick={toInvoice}><Receipt className="h-4 w-4 mr-2" />Convert to invoice</Button>}
                {q.invoice_number && <Button variant="outline" onClick={() => pdf("INVOICE")}><FileDown className="h-4 w-4 mr-2" />Invoice PDF</Button>}
                {q.invoice_number && q.status !== "paid" && <Button variant="outline" onClick={() => save({ status: "paid", paid_at: new Date().toISOString() })}><CheckCircle className="h-4 w-4 mr-2" />Mark paid</Button>}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Your business details</CardTitle><CardDescription>Shown on every quote and invoice.</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                {(["name", "address", "phone", "email", "vatNumber", "companyNumber"] as const).map((k) => (
                  <Input key={k} placeholder={{ name: "Business name", address: "Address", phone: "Phone", email: "Email", vatNumber: "VAT number", companyNumber: "Company number" }[k]} value={company[k] || ""} onChange={(e) => setCompany((p) => ({ ...p, [k]: e.target.value }))} />))}
                <Textarea rows={2} placeholder="Bank details for invoices (sort code, account)" value={company.bank || ""} onChange={(e) => setCompany((p) => ({ ...p, bank: e.target.value }))} />
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild><label className="cursor-pointer"><Upload className="h-4 w-4 mr-1" />Logo<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} /></label></Button>
                  {company.logo && <img src={company.logo} alt="Your logo" className="h-8" />}
                </div>
                {!sub.canUseBrandedExports && <p className="text-xs text-muted-foreground">Logo prints on PDFs for subscribers (£5.99/month). {Math.max(0, 2 - sub.downloadsUsed)} free downloads left this month.</p>}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Saved quotes & invoices</CardTitle></CardHeader>
              <CardContent className="space-y-2 max-h-[480px] overflow-y-auto">
                {list.length === 0 && <p className="text-sm text-muted-foreground">Nothing saved yet.</p>}
                {list.map((x) => (
                  <button key={x.id} onClick={() => setQ(x)} className="w-full text-left p-2 rounded-md border border-border hover:bg-secondary/50">
                    <div className="flex justify-between text-sm"><span className="font-medium">{x.invoice_number || x.quote_number}</span><Badge variant="outline" className="capitalize">{x.status}</Badge></div>
                    <div className="flex justify-between text-xs text-muted-foreground"><span>{x.customer_name}</span><span>{gbp(totals(x).total)}</span></div>
                  </button>))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
