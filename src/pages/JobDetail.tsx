import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, MapPin, Send } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [partner, setPartner] = useState<string | null>(null);
  const [body, setBody] = useState("");

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => (await supabase.from("marketplace_jobs").select("*").eq("id", id!).maybeSingle()).data,
    enabled: !!id,
  });
  const isOwner = !!job && job.customer_id === user?.id;

  const { data: quotes } = useQuery({
    queryKey: ["job-quotes", id],
    queryFn: async () => {
      const { data } = await supabase.from("job_quotes").select("*, trade_profiles(id, user_id, business_name, trade_type, is_verified, average_rating, total_reviews)").eq("job_id", id!).order("quote_amount");
      return data || [];
    },
    enabled: !!id && !!user,
  });

  const { data: messages } = useQuery({
    queryKey: ["job-messages", id],
    queryFn: async () => (await supabase.from("job_messages").select("*").eq("job_id", id!).order("created_at")).data || [],
    enabled: !!id && !!user,
    refetchInterval: 5000,
  });

  // Conversations: owner talks to each trade separately; a trade talks to the owner.
  const partners = useMemo(() => {
    if (!isOwner) return job ? [job.customer_id] : [];
    const set = new Set<string>();
    (quotes || []).forEach((q: any) => q.trade_profiles?.user_id && set.add(q.trade_profiles.user_id));
    (messages || []).forEach((m: any) => set.add(m.sender_id === user?.id ? m.recipient_id : m.sender_id));
    return [...set];
  }, [isOwner, job, quotes, messages, user]);
  useEffect(() => { if (!partner && partners.length) setPartner(partners[0]); }, [partners, partner]);

  const nameFor = (uid: string) => {
    if (job && uid === job.customer_id) return "Job poster";
    const q: any = (quotes || []).find((x: any) => x.trade_profiles?.user_id === uid);
    return q?.trade_profiles?.business_name || "Tradesperson";
  };
  const thread = (messages || []).filter((m: any) => m.sender_id === partner || m.recipient_id === partner);

  useEffect(() => {
    const unread = thread.filter((m: any) => m.recipient_id === user?.id && !m.read_at).map((m: any) => m.id);
    if (unread.length) supabase.from("job_messages").update({ read_at: new Date().toISOString() }).in("id", unread).then(() => {});
  }, [thread.length]);

  const send = async () => {
    const text = body.trim();
    if (!text || !partner || !user) return;
    if (text.length > 2000) { toast.error("Messages are limited to 2,000 characters"); return; }
    const { error } = await supabase.from("job_messages").insert({ job_id: id!, sender_id: user.id, recipient_id: partner, body: text });
    if (error) { toast.error(error.message); return; }
    setBody(""); qc.invalidateQueries({ queryKey: ["job-messages", id] });
  };

  const accept = async (q: any) => {
    const a = await supabase.from("job_quotes").update({ status: "accepted" }).eq("id", q.id);
    const b = await supabase.from("marketplace_jobs").update({ status: "in_progress", selected_trade_id: q.trade_profile_id }).eq("id", id!);
    if (a.error || b.error) { toast.error((a.error || b.error)!.message); return; }
    await supabase.from("job_quotes").update({ status: "declined" }).eq("job_id", id!).neq("id", q.id);
    toast.success(`${q.trade_profiles?.business_name || "Trade"} hired`);
    qc.invalidateQueries({ queryKey: ["job", id] }); qc.invalidateQueries({ queryKey: ["job-quotes", id] });
  };
  const setStatus = async (status: string) => {
    const { error } = await supabase.from("marketplace_jobs").update({ status }).eq("id", id!);
    if (error) toast.error(error.message); else { toast.success(`Job marked ${status.replace("_", " ")}`); qc.invalidateQueries({ queryKey: ["job", id] }); }
  };

  if (isLoading) return <DashboardLayout><div className="p-8">Loading…</div></DashboardLayout>;
  if (!job) return <DashboardLayout><div className="p-8 space-y-3"><p>This job isn't available — it may be closed.</p><Button variant="outline" asChild><Link to="/dashboard/marketplace">Back to Marketplace</Link></Button></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <Button variant="ghost" size="sm" asChild><Link to="/dashboard/marketplace"><ArrowLeft className="h-4 w-4 mr-1" />Marketplace</Link></Button>
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><CardTitle className="text-xl">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}{job.postcode ? `, ${job.postcode.split(" ")[0]}` : ""} • {job.trade_required} • posted {new Date(job.created_at!).toLocaleDateString("en-GB")}</CardDescription></div>
              <div className="flex gap-2"><Badge variant={job.urgency === "urgent" ? "destructive" : "outline"}>{job.urgency}</Badge><Badge variant="outline" className="capitalize">{(job.status || "open").replace("_", " ")}</Badge></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="whitespace-pre-wrap text-sm">{job.description}</p>
            <p className="text-sm font-medium">Budget: {job.budget_min || job.budget_max ? `£${job.budget_min ?? "?"} – £${job.budget_max ?? "?"}` : "To be agreed"}</p>
            {isOwner && <div className="flex flex-wrap gap-2">
              {job.status !== "completed" && job.status !== "open" && <Button size="sm" variant="outline" onClick={() => setStatus("completed")}>Mark completed</Button>}
              {job.status === "open" && <Button size="sm" variant="outline" onClick={() => setStatus("closed")}>Close job</Button>}
              {job.status === "closed" && <Button size="sm" variant="outline" onClick={() => setStatus("open")}>Re-open job</Button>}
            </div>}
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">{isOwner ? `Quotes received (${quotes?.length || 0})` : "Your quote"}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(quotes || []).length === 0 && <p className="text-sm text-muted-foreground">{isOwner ? "No quotes yet — trades are notified when they browse jobs." : "You haven't quoted yet. Use Submit Quote on the Browse Jobs tab."}</p>}
              {(quotes || []).map((q: any) => (
                <div key={q.id} className="border border-border rounded-md p-3 space-y-1">
                  <div className="flex justify-between items-center"><span className="font-medium">{q.trade_profiles?.business_name || "Tradesperson"} {q.trade_profiles?.is_verified && <CheckCircle className="inline h-4 w-4 text-primary" />}</span><span className="font-bold">£{Number(q.quote_amount).toLocaleString()}</span></div>
                  <p className="text-xs text-muted-foreground">{q.estimated_duration || "Duration TBC"}{q.available_start_date ? ` • can start ${new Date(q.available_start_date).toLocaleDateString("en-GB")}` : ""} • ★ {Number(q.trade_profiles?.average_rating || 0).toFixed(1)} ({q.trade_profiles?.total_reviews || 0})</p>
                  {q.message && <p className="text-sm">{q.message}</p>}
                  <div className="flex gap-2 items-center"><Badge variant="outline" className="capitalize">{q.status || "pending"}</Badge>
                    {isOwner && <Button size="sm" variant="ghost" onClick={() => setPartner(q.trade_profiles?.user_id)}>Message</Button>}
                    {isOwner && job.status === "open" && <Button size="sm" onClick={() => accept(q)}>Hire</Button>}</div>
                </div>))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Messages</CardTitle>
              {isOwner && partners.length > 1 && <div className="flex flex-wrap gap-1 pt-2">{partners.map((p) => <Button key={p} size="sm" variant={p === partner ? "default" : "outline"} onClick={() => setPartner(p)}>{nameFor(p)}</Button>)}</div>}
            </CardHeader>
            <CardContent className="space-y-3">
              {!partner ? <p className="text-sm text-muted-foreground">Messages appear here once a trade quotes or gets in touch.</p> : <>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {thread.length === 0 && <p className="text-sm text-muted-foreground">Start the conversation with {nameFor(partner)}.</p>}
                  {thread.map((m: any) => (
                    <div key={m.id} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.sender_id === user?.id ? "ml-auto bg-primary text-primary-foreground" : "bg-secondary"}`}>
                      <p className="whitespace-pre-wrap">{m.body}</p><p className="text-[10px] opacity-70">{new Date(m.created_at).toLocaleString("en-GB")}</p>
                    </div>))}
                </div>
                <div className="flex gap-2"><Textarea rows={2} placeholder={`Message ${nameFor(partner)}…`} value={body} onChange={(e) => setBody(e.target.value)} />
                  <Button onClick={send} aria-label="Send message"><Send className="h-4 w-4" /></Button></div>
                <p className="text-xs text-muted-foreground">Keep payments and contact on BuildQuote until you've checked the trade's verification and reviews.</p>
              </>}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
