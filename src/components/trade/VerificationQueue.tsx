import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DOC_TYPES } from "./TradeVerification";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function VerificationQueue() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [docs, setDocs] = useState<Record<string, any[]>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = async () => {
    const { data } = await supabase.from("trade_profiles").select("*").eq("verification_status", "pending");
    setProfiles(data || []);
    if (data?.length) {
      const { data: d } = await supabase.from("trade_verification_documents").select("*").in("trade_profile_id", data.map((p) => p.id));
      const g: Record<string, any[]> = {}; (d || []).forEach((x) => { (g[x.trade_profile_id] ||= []).push(x); }); setDocs(g);
    }
  };
  useEffect(() => { load(); }, []);

  const view = async (path: string) => {
    const { data } = await supabase.storage.from("trade-documents").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  };
  const decide = async (p: any, approve: boolean) => {
    const now = new Date().toISOString();
    await supabase.from("trade_verification_documents").update({ status: approve ? "approved" : "rejected", reviewed_by: user?.id, reviewed_at: now, reviewer_notes: notes[p.id] || null }).eq("trade_profile_id", p.id).eq("status", "pending");
    const { error } = await supabase.from("trade_profiles").update({ is_verified: approve, verification_status: approve ? "approved" : "rejected", verification_date: approve ? now : null }).eq("id", p.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" }); else { toast({ title: approve ? "Trade verified" : "Rejected" }); load(); }
  };

  return (
    <Card>
      <CardHeader><CardTitle>Trade verification queue</CardTitle><CardDescription>Check documents match the business name, are in date, and cover the trade advertised.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        {profiles.length === 0 && <p className="text-sm text-muted-foreground">No trades waiting.</p>}
        {profiles.map((p) => (
          <div key={p.id} className="border border-border rounded-md p-3 space-y-2">
            <div className="flex flex-wrap justify-between gap-2"><div><p className="font-medium">{p.business_name}</p>
              <p className="text-xs text-muted-foreground">{p.trade_type} · VAT {p.vat_number || "–"} · Co. {p.company_number || "–"} · PL cover £{p.public_liability_cover || "–"} · insured to {p.insurance_valid_until || "–"}</p></div></div>
            {(docs[p.id] || []).map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm"><span>{DOC_TYPES[d.doc_type] || d.doc_type} {d.reference_number ? `(${d.reference_number})` : ""} {d.expires_on ? `exp ${d.expires_on}` : ""}</span>
                <div className="flex gap-2 items-center"><Badge variant="outline">{d.status}</Badge><Button size="sm" variant="ghost" onClick={() => view(d.file_path)}>View</Button></div></div>))}
            <Input placeholder="Notes to the trade (optional)" value={notes[p.id] || ""} onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })} />
            <div className="flex gap-2"><Button size="sm" onClick={() => decide(p, true)}>Approve</Button><Button size="sm" variant="outline" onClick={() => decide(p, false)}>Reject</Button></div>
          </div>))}
      </CardContent>
    </Card>
  );
}
