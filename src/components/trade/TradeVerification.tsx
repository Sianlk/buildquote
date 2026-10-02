import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Upload, Trash2, CheckCircle, Clock, XCircle } from "lucide-react";

export const DOC_TYPES: Record<string, string> = {
  public_liability: "Public liability insurance certificate",
  employers_liability: "Employers' liability insurance (if you employ staff)",
  qualification: "Trade qualification (NVQ, City & Guilds, CSCS card)",
  gas_safe: "Gas Safe registration card",
  electrical: "NICEIC / NAPIT / ELECSA certificate",
  photo_id: "Photo ID (passport or driving licence)",
  vat: "VAT registration certificate",
  company: "Companies House certificate",
  trustmark: "TrustMark / FMB / MCS membership",
};
const REQUIRED = ["public_liability", "qualification", "photo_id"];

type Doc = { id: string; doc_type: string; reference_number: string | null; expires_on: string | null; status: string; file_path: string; reviewer_notes: string | null };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TradeVerification({ profile, onChange }: { profile: any; onChange: () => void }) {
  const { toast } = useToast();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [form, setForm] = useState({
    vat_number: profile.vat_number || "", company_number: profile.company_number || "",
    public_liability_cover: profile.public_liability_cover || "", insurance_valid_until: profile.insurance_valid_until || "",
    gas_safe_number: profile.gas_safe_number || "", niceic_number: profile.niceic_number || "",
  });
  const [docType, setDocType] = useState("public_liability");
  const [ref, setRef] = useState("");
  const [expires, setExpires] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("trade_verification_documents").select("*").eq("trade_profile_id", profile.id).order("created_at");
    setDocs((data || []) as Doc[]);
  };
  useEffect(() => { load(); }, [profile.id]);

  const saveDetails = async () => {
    const vat = form.vat_number.replace(/\s/g, "").toUpperCase();
    if (vat && !/^(GB)?(\d{9}|\d{12})$/.test(vat)) { toast({ title: "VAT number looks wrong", description: "UK VAT numbers are 9 digits, e.g. GB123456789.", variant: "destructive" }); return; }
    if (form.company_number && !/^[A-Z0-9]{8}$/i.test(form.company_number.trim())) { toast({ title: "Company number looks wrong", description: "Companies House numbers are 8 characters.", variant: "destructive" }); return; }
    const { error } = await supabase.from("trade_profiles").update({
      vat_number: vat || null, company_number: form.company_number.trim().toUpperCase() || null,
      public_liability_cover: form.public_liability_cover ? Number(form.public_liability_cover) : null,
      insurance_valid_until: form.insurance_valid_until || null, gas_safe_number: form.gas_safe_number || null, niceic_number: form.niceic_number || null,
    }).eq("id", profile.id);
    if (error) toast({ title: "Could not save", description: error.message, variant: "destructive" }); else { toast({ title: "Details saved" }); onChange(); }
  };

  const upload = async (file?: File) => {
    if (!file) return;
    if (file.size > 10_000_000) { toast({ title: "File too large", description: "Max 10MB.", variant: "destructive" }); return; }
    if (!/^(application\/pdf|image\/(png|jpeg|webp))$/.test(file.type)) { toast({ title: "Use a PDF or photo", variant: "destructive" }); return; }
    setBusy(true);
    const path = `${profile.user_id}/${docType}-${Date.now()}.${file.name.split(".").pop()}`;
    const up = await supabase.storage.from("trade-documents").upload(path, file);
    if (up.error) { setBusy(false); toast({ title: "Upload failed", description: up.error.message, variant: "destructive" }); return; }
    const { error } = await supabase.from("trade_verification_documents").insert({
      user_id: profile.user_id, trade_profile_id: profile.id, doc_type: docType, reference_number: ref || null, expires_on: expires || null, file_path: path,
    });
    setBusy(false); setRef(""); setExpires("");
    if (error) toast({ title: "Could not record document", description: error.message, variant: "destructive" }); else { toast({ title: "Document uploaded" }); load(); }
  };

  const remove = async (d: Doc) => {
    await supabase.storage.from("trade-documents").remove([d.file_path]);
    await supabase.from("trade_verification_documents").delete().eq("id", d.id);
    load();
  };

  const submit = async () => {
    const { error } = await supabase.from("trade_profiles").update({ verification_status: "pending" }).eq("id", profile.id);
    if (error) toast({ title: "Could not submit", description: error.message, variant: "destructive" });
    else { toast({ title: "Submitted for checks", description: "We review documents within 2 working days." }); onChange(); }
  };

  const have = new Set(docs.filter((d) => d.status !== "rejected").map((d) => d.doc_type));
  const checks = [
    ...REQUIRED.map((r) => ({ label: DOC_TYPES[r], ok: have.has(r) })),
    { label: "Insurance expiry date entered", ok: !!form.insurance_valid_until && new Date(form.insurance_valid_until) > new Date() },
    { label: "VAT or Companies House number (if applicable)", ok: !!(form.vat_number || form.company_number) },
  ];
  const score = Math.round(checks.filter((c) => c.ok).length / checks.length * 100);
  const requiredDone = REQUIRED.every((r) => have.has(r));
  const status = profile.verification_status || "unverified";

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Get verified</CardTitle>
          <Badge variant={status === "approved" ? "default" : "outline"} className="capitalize">{status === "approved" ? "Verified" : status}</Badge>
        </div>
        <CardDescription>Verified trades show a badge and rank first in search. We check ID, insurance and qualifications by hand, and re-check when insurance expires.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-1"><span>Profile trust score</span><span>{score}%</span></div>
          <Progress value={score} />
          <ul className="mt-3 grid gap-1 md:grid-cols-2 text-sm">
            {checks.map((c) => <li key={c.label} className="flex items-center gap-2">{c.ok ? <CheckCircle className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}{c.label}</li>)}
          </ul>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div><Label className="text-xs">VAT number</Label><Input placeholder="GB123456789" value={form.vat_number} onChange={(e) => setForm({ ...form, vat_number: e.target.value })} /></div>
          <div><Label className="text-xs">Companies House number</Label><Input placeholder="12345678" value={form.company_number} onChange={(e) => setForm({ ...form, company_number: e.target.value })} /></div>
          <div><Label className="text-xs">Public liability cover (£)</Label><Input type="number" placeholder="2000000" value={form.public_liability_cover} onChange={(e) => setForm({ ...form, public_liability_cover: e.target.value })} /></div>
          <div><Label className="text-xs">Insurance valid until</Label><Input type="date" value={form.insurance_valid_until} onChange={(e) => setForm({ ...form, insurance_valid_until: e.target.value })} /></div>
          <div><Label className="text-xs">Gas Safe number</Label><Input value={form.gas_safe_number} onChange={(e) => setForm({ ...form, gas_safe_number: e.target.value })} /></div>
          <div><Label className="text-xs">NICEIC / NAPIT number</Label><Input value={form.niceic_number} onChange={(e) => setForm({ ...form, niceic_number: e.target.value })} /></div>
        </div>
        <Button variant="outline" onClick={saveDetails}>Save details</Button>

        <div className="space-y-3 border-t border-border pt-4">
          <h4 className="font-semibold text-sm">Upload documents (PDF or photo, max 10MB)</h4>
          <div className="grid gap-3 md:grid-cols-4 items-end">
            <div className="md:col-span-2"><Label className="text-xs">Document</Label>
              <Select value={docType} onValueChange={setDocType}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(DOC_TYPES).map(([k, v]) => <SelectItem key={k} value={k}>{v}{REQUIRED.includes(k) ? " *" : ""}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs">Policy / licence number</Label><Input value={ref} onChange={(e) => setRef(e.target.value)} /></div>
            <div><Label className="text-xs">Expiry date</Label><Input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} /></div>
          </div>
          <Button variant="outline" disabled={busy} asChild><label className="cursor-pointer"><Upload className="h-4 w-4 mr-2" />{busy ? "Uploading…" : "Choose file & upload"}
            <input type="file" accept="application/pdf,image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => upload(e.target.files?.[0])} /></label></Button>
          <div className="space-y-2">
            {docs.map((d) => (
              <div key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-md border border-border text-sm">
                <div><p className="font-medium">{DOC_TYPES[d.doc_type] || d.doc_type}</p>
                  <p className="text-xs text-muted-foreground">{d.reference_number || "No ref"}{d.expires_on ? ` · expires ${new Date(d.expires_on).toLocaleDateString("en-GB")}` : ""}{d.reviewer_notes ? ` · ${d.reviewer_notes}` : ""}</p></div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{d.status === "approved" ? <CheckCircle className="h-3 w-3 mr-1" /> : d.status === "rejected" ? <XCircle className="h-3 w-3 mr-1" /> : null}{d.status}</Badge>
                  {d.status === "pending" && <Button variant="ghost" size="sm" aria-label="Delete document" onClick={() => remove(d)}><Trash2 className="h-4 w-4" /></Button>}
                </div>
              </div>))}
          </div>
        </div>
        {status !== "approved" && (
          <Button onClick={submit} disabled={!requiredDone || status === "pending"}>
            {status === "pending" ? "Under review" : requiredDone ? "Submit for verification" : "Upload the 3 required documents to submit"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
