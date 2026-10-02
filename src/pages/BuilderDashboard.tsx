import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DAY_RATES, type MyRates } from "@/lib/full-estimator";
import { generateQuoteNumber } from "@/lib/quote-pdf-generator";
import { toast } from "sonner";
import { ShieldCheck, Receipt, Briefcase, PoundSterling, Users } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const gbp = (n: number) => `£${Math.round(n || 0).toLocaleString("en-GB")}`;

export default function BuilderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rates, setRates] = useState<MyRates>({});

  const { data: profile } = useQuery({
    queryKey: ["bd-profile", user?.id],
    queryFn: async () => (await supabase.from("profiles").select("estimator_rates").eq("user_id", user!.id).maybeSingle()).data,
    enabled: !!user,
  });
  useEffect(() => { if (profile) setRates((profile.estimator_rates || {}) as MyRates); }, [profile]);

  const { data: trade } = useQuery({
    queryKey: ["bd-trade", user?.id],
    queryFn: async () => (await supabase.from("trade_profiles").select("*").eq("user_id", user!.id).maybeSingle()).data,
    enabled: !!user,
  });
  const { data: bids } = useQuery({
    queryKey: ["bd-bids", trade?.id],
    queryFn: async () => (await supabase.from("job_quotes").select("*, marketplace_jobs(id, title, location, customer_id, status)").eq("trade_profile_id", trade!.id).order("created_at", { ascending: false })).data || [],
    enabled: !!trade,
  });
  const { data: docs } = useQuery({
    queryKey: ["bd-quotes", user?.id],
    queryFn: async () => (await supabase.from("quotes").select("id, quote_number, invoice_number, status, total, customer_name, created_at").order("created_at", { ascending: false })).data || [],
    enabled: !!user,
  });
  const { data: hired } = useQuery({
    queryKey: ["bd-hired", user?.id],
    queryFn: async () => (await supabase.from("marketplace_jobs").select("id, title, status, selected_trade_id, trade_profiles:selected_trade_id(business_name, trade_type, is_verified, average_rating)").eq("customer_id", user!.id).not("selected_trade_id", "is", null)).data || [],
    enabled: !!user,
  });
  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => (await supabase.rpc("has_role", { _user_id: user!.id, _role: "admin" })).data === true,
    enabled: !!user,
  });
  const { data: approved } = useQuery({
    queryKey: ["bd-approved"],
    queryFn: async () => (await supabase.from("trade_profiles").select("id, business_name, trade_type, verification_date, average_rating, total_reviews").eq("is_verified", true).order("verification_date", { ascending: false }).limit(20)).data || [],
    enabled: !!isAdmin,
  });

  const saveRates = async () => {
    const { error } = await supabase.from("profiles").update({ estimator_rates: rates as never }).eq("user_id", user!.id);
    if (error) toast.error(error.message); else toast.success("Rates saved — the estimator and quotes now use them");
  };

  const invoiceFromBid = async (b: any) => {
    const job = b.marketplace_jobs;
    const { data, error } = await supabase.from("quotes").insert({
      user_id: user!.id, quote_number: generateQuoteNumber(), customer_name: "Marketplace client", project_description: job?.title || "Marketplace job",
      items: [{ description: `${job?.title || "Works"} — as quoted on BuildQuote Marketplace`, quantity: 1, unit: "job", unitPrice: Number(b.quote_amount), total: Number(b.quote_amount), kind: "labour" }] as never,
      subtotal: Number(b.quote_amount), vat_rate: trade?.vat_number ? 20 : 0, vat_amount: trade?.vat_number ? Number(b.quote_amount) * 0.2 : 0,
      total: Number(b.quote_amount) * (trade?.vat_number ? 1.2 : 1), status: "accepted", notes: `Marketplace job ${job?.id}`,
    }).select("id").single();
    if (error) { toast.error(error.message); return; }
    toast.success("Quote created from the accepted job — convert it to an invoice on the next page");
    navigate(`/dashboard/quotes?open=${data.id}`);
  };

  const won = (bids || []).filter((b: any) => b.status === "accepted");
  const pipeline = (bids || []).filter((b: any) => !b.status || b.status === "pending").reduce((s: number, b: any) => s + Number(b.quote_amount), 0);
  const unpaid = (docs || []).filter((d: any) => d.status === "invoiced").reduce((s: number, d: any) => s + Number(d.total), 0);
  const paid = (docs || []).filter((d: any) => d.status === "paid").reduce((s: number, d: any) => s + Number(d.total), 0);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-2xl md:text-3xl font-bold">Builder dashboard</h1>
            <p className="text-muted-foreground">Your rates, the quotes you've sent, jobs won, invoices and trades.</p></div>
          <div className="flex gap-2"><Button variant="outline" asChild><Link to="/dashboard/marketplace?tab=browse-jobs">Find jobs</Link></Button><Button asChild><Link to="/dashboard/quotes">New quote</Link></Button></div>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[[Briefcase, "Quotes sent", String(bids?.length || 0)], [PoundSterling, "Pipeline (pending)", gbp(pipeline)], [Receipt, "Unpaid invoices", gbp(unpaid)], [PoundSterling, "Paid", gbp(paid)]].map(([Icon, k, v]: any) => (
            <Card key={k}><CardContent className="pt-6"><p className="text-xs text-muted-foreground flex items-center gap-1"><Icon className="h-3 w-3" />{k}</p><p className="text-xl font-bold">{v}</p></CardContent></Card>))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Quotes I've submitted on the Marketplace</CardTitle>
              <CardDescription>{trade ? `${trade.business_name} · ${won.length} won` : "Create a trade profile to quote on jobs."}</CardDescription></CardHeader>
            <CardContent className="space-y-2">
              {!trade && <Button asChild><Link to="/dashboard/marketplace?tab=my-profile">Create trade profile</Link></Button>}
              {trade && (bids || []).length === 0 && <p className="text-sm text-muted-foreground">No quotes yet.</p>}
              {(bids || []).map((b: any) => (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 border border-border rounded-md p-3 text-sm">
                  <div><p className="font-medium">{b.marketplace_jobs?.title || "Job removed"}</p><p className="text-xs text-muted-foreground">{b.marketplace_jobs?.location} · sent {new Date(b.created_at).toLocaleDateString("en-GB")}</p></div>
                  <div className="flex items-center gap-2"><span className="font-semibold">{gbp(b.quote_amount)}</span><Badge variant="outline" className="capitalize">{b.status || "pending"}</Badge>
                    {b.marketplace_jobs && <Button size="sm" variant="ghost" asChild><Link to={`/dashboard/marketplace/jobs/${b.marketplace_jobs.id}`}>Messages</Link></Button>}
                    {b.status === "accepted" && <Button size="sm" onClick={() => invoiceFromBid(b)}>Create invoice</Button>}</div>
                </div>))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Verification</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {trade ? <><Badge className="capitalize">{trade.is_verified ? "Verified" : trade.verification_status}</Badge>
                <p className="text-muted-foreground">{trade.is_verified ? `Verified on ${new Date(trade.verification_date!).toLocaleDateString("en-GB")}. Insurance valid to ${trade.insurance_valid_until ? new Date(trade.insurance_valid_until).toLocaleDateString("en-GB") : "—"}.` : "Upload ID, insurance and a qualification to get the verified badge."}</p>
                <Button size="sm" variant="outline" asChild><Link to="/dashboard/marketplace?tab=my-profile">Manage documents</Link></Button></> : <p className="text-muted-foreground">No trade profile yet.</p>}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">My rates</CardTitle><CardDescription>Used by the Estimator for every quote. Leave blank to use the regional average shown.</CardDescription></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
              {Object.keys(DAY_RATES).map((t) => (
                <div key={t}><Label className="text-xs">{t} £/day</Label><Input type="number" placeholder={String(DAY_RATES[t])} value={rates.day?.[t] || ""} onChange={(e) => setRates((r) => ({ ...r, day: { ...r.day, [t]: parseFloat(e.target.value) || 0 } }))} /></div>))}
              <div><Label className="text-xs">Materials vs list %</Label><Input type="number" placeholder="0" value={rates.materialAdjustPct ?? ""} onChange={(e) => setRates((r) => ({ ...r, materialAdjustPct: parseFloat(e.target.value) || 0 }))} /></div>
              <div><Label className="text-xs">Overheads & profit %</Label><Input type="number" placeholder="15" value={rates.profitPct ?? ""} onChange={(e) => setRates((r) => ({ ...r, profitPct: e.target.value === "" ? undefined : parseFloat(e.target.value) }))} /></div>
              <div><Label className="text-xs">Preliminaries %</Label><Input type="number" placeholder="8" value={rates.prelimsPct ?? ""} onChange={(e) => setRates((r) => ({ ...r, prelimsPct: e.target.value === "" ? undefined : parseFloat(e.target.value) }))} /></div>
            </div>
            <Button onClick={saveRates}>Save my rates</Button>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />Trades I've hired</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {(hired || []).length === 0 && <p className="text-muted-foreground">None yet — hire from a job's quotes.</p>}
              {(hired || []).map((h: any) => (
                <div key={h.id} className="flex justify-between border-b border-border/50 pb-2"><span>{h.trade_profiles?.business_name || "Trade"} {h.trade_profiles?.is_verified && <ShieldCheck className="inline h-4 w-4 text-primary" />}<span className="text-muted-foreground"> · {h.title}</span></span><Badge variant="outline" className="capitalize">{(h.status || "").replace("_", " ")}</Badge></div>))}
            </CardContent>
          </Card>
          {isAdmin && (
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" />Approved trades</CardTitle><CardDescription><Link className="text-primary hover:underline" to="/dashboard/admin">Open the approval queue</Link></CardDescription></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {(approved || []).length === 0 && <p className="text-muted-foreground">No trades approved yet.</p>}
                {(approved || []).map((t: any) => (
                  <div key={t.id} className="flex justify-between border-b border-border/50 pb-2"><span>{t.business_name}<span className="text-muted-foreground"> · {t.trade_type}</span></span><span className="text-muted-foreground">{t.verification_date ? new Date(t.verification_date).toLocaleDateString("en-GB") : ""}</span></div>))}
              </CardContent>
            </Card>)}
        </div>
      </div>
    </DashboardLayout>
  );
}
