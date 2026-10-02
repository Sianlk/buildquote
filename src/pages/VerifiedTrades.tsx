import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { TradeReviews } from "@/components/trade/TradeReviews";
import { ShieldCheck, Star, MapPin, Search } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function VerifiedTrades() {
  const [q, setQ] = useState("");
  const { data: trades, isLoading } = useQuery({
    queryKey: ["verified-trades"],
    queryFn: async () => (await supabase.from("trade_profiles").select("*").eq("is_verified", true).order("average_rating", { ascending: false })).data || [],
  });
  const list = (trades || []).filter((t: any) => `${t.business_name} ${t.trade_type} ${(t.service_areas || []).join(" ")}`.toLowerCase().includes(q.toLowerCase()));
  const insured = (t: any) => t.insurance_valid_until && new Date(t.insurance_valid_until) > new Date();

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><ShieldCheck className="h-7 w-7 text-primary" />Verified trades</h1>
            <p className="text-muted-foreground">Every trade here has had ID, insurance and qualifications checked by hand. Read reviews from real clients.</p></div>
          <div className="flex gap-2"><Button variant="outline" asChild><Link to="/dashboard/marketplace">Marketplace</Link></Button>
            <Button asChild><Link to="/dashboard/marketplace?tab=my-profile">Are you a trade? Get verified</Link></Button></div>
        </div>
        <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by trade, business or area" value={q} onChange={(e) => setQ(e.target.value)} /></div>

        <Card><CardContent className="pt-6 grid gap-4 md:grid-cols-4 text-sm">
          {[["1. ID checked", "Passport or driving licence matched to the business owner."], ["2. Insured", "Public liability certificate in date — re-checked on expiry."], ["3. Qualified", "NVQ / City & Guilds, Gas Safe, NICEIC or NAPIT where the trade requires it."], ["4. Reviewed", "Clients rate workmanship, communication and value."]].map(([h, d]) => (
            <div key={h}><p className="font-semibold">{h}</p><p className="text-muted-foreground">{d}</p></div>))}
        </CardContent></Card>

        {isLoading ? <p>Loading…</p> : list.length === 0 ? (
          <Card><CardContent className="pt-6 text-sm text-muted-foreground">No verified trades yet{q ? " match your search" : ""}. New trades appear here as soon as their documents are approved.</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {list.map((t: any) => (
              <Card key={t.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2"><div><CardTitle className="text-base">{t.business_name}</CardTitle><CardDescription>{t.trade_type}{t.experience_years ? ` • ${t.experience_years} yrs` : ""}</CardDescription></div>
                    <Badge><ShieldCheck className="h-3 w-3 mr-1" />Verified</Badge></div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-3"><span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" />{Number(t.average_rating || 0).toFixed(1)} ({t.total_reviews || 0})</span>
                    {t.service_areas?.length > 0 && <span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" />{t.service_areas.slice(0, 3).join(", ")}</span>}</div>
                  <div className="flex flex-wrap gap-1">
                    {insured(t) && <Badge variant="outline">Insured to {new Date(t.insurance_valid_until).toLocaleDateString("en-GB")}{t.public_liability_cover ? ` • £${(t.public_liability_cover / 1e6).toFixed(0)}m cover` : ""}</Badge>}
                    {t.vat_number && <Badge variant="outline">VAT registered</Badge>}
                    {t.company_number && <Badge variant="outline">Ltd company {t.company_number}</Badge>}
                    {t.gas_safe_number && <Badge variant="outline">Gas Safe {t.gas_safe_number}</Badge>}
                    {t.niceic_number && <Badge variant="outline">NICEIC/NAPIT {t.niceic_number}</Badge>}
                    {t.verification_date && <Badge variant="outline">Verified {new Date(t.verification_date).toLocaleDateString("en-GB")}</Badge>}
                  </div>
                  {t.description && <p className="text-muted-foreground line-clamp-3">{t.description}</p>}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.day_rate ? `£${t.day_rate}/day` : t.hourly_rate ? `£${t.hourly_rate}/hr` : ""}</span>
                    <div className="flex gap-2"><TradeReviews tradeProfileId={t.id} ownerId={t.user_id} businessName={t.business_name} rating={t.average_rating} count={t.total_reviews || 0} />
                      {(t.contact_email || t.contact_phone) && <Button size="sm" asChild><a href={t.contact_email ? `mailto:${t.contact_email}` : `tel:${t.contact_phone}`}>Contact</a></Button>}</div>
                  </div>
                </CardContent>
              </Card>))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
