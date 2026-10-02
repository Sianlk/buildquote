import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Star } from "lucide-react";
import { z } from "zod";

type Review = { id: string; rating: number; title: string | null; review_text: string | null; workmanship_rating: number | null; communication_rating: number | null; value_rating: number | null; would_recommend: boolean | null; trade_response: string | null; is_verified_job: boolean | null; created_at: string };

const reviewSchema = z.object({
  title: z.string().trim().min(3, "Add a short title").max(100),
  review_text: z.string().trim().min(20, "Please write at least 20 characters").max(2000),
});

function Stars({ value, onChange, size = 5 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" disabled={!onChange} onClick={() => onChange?.(n)} aria-label={`${n} stars`}>
          <Star className={`h-${size} w-${size} ${n <= value ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>))}
    </div>
  );
}

export function TradeReviews({ tradeProfileId, ownerId, businessName, rating, count }: { tradeProfileId: string; ownerId: string; businessName: string; rating: number; count: number }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [f, setF] = useState({ rating: 5, workmanship: 5, communication: 5, value: 5, title: "", text: "", recommend: true });

  const load = async () => {
    const { data } = await supabase.from("trade_reviews").select("*").eq("trade_profile_id", tradeProfileId).order("created_at", { ascending: false });
    setReviews((data || []) as Review[]);
  };
  useEffect(() => { if (open) load(); }, [open]);

  const submit = async () => {
    if (!user) return;
    if (user.id === ownerId) { toast({ title: "You can't review your own business", variant: "destructive" }); return; }
    const v = reviewSchema.safeParse({ title: f.title, review_text: f.text });
    if (!v.success) { toast({ title: v.error.issues[0].message, variant: "destructive" }); return; }
    if (reviews.some((r) => (r as unknown as { reviewer_id: string }).reviewer_id === user.id)) { toast({ title: "You've already reviewed this trade", variant: "destructive" }); return; }
    const { error } = await supabase.from("trade_reviews").insert({
      trade_profile_id: tradeProfileId, reviewer_id: user.id, rating: f.rating, workmanship_rating: f.workmanship, communication_rating: f.communication,
      value_rating: f.value, title: v.data.title, review_text: v.data.review_text, would_recommend: f.recommend,
    });
    if (error) toast({ title: "Could not post review", description: error.message, variant: "destructive" });
    else { toast({ title: "Thanks — review posted" }); setF({ ...f, title: "", text: "" }); load(); }
  };

  const avg = (k: keyof Review) => reviews.length ? (reviews.reduce((s, r) => s + ((r[k] as number) || 0), 0) / reviews.length).toFixed(1) : "–";
  const recommend = reviews.length ? Math.round(reviews.filter((r) => r.would_recommend).length / reviews.length * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button size="sm" variant="outline">Reviews ({count})</Button></DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{businessName} — reviews</DialogTitle></DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center text-sm">
          <div><p className="text-2xl font-bold">{Number(rating || 0).toFixed(1)}</p><p className="text-muted-foreground text-xs">Overall</p></div>
          <div><p className="text-xl font-semibold">{avg("workmanship_rating")}</p><p className="text-muted-foreground text-xs">Workmanship</p></div>
          <div><p className="text-xl font-semibold">{avg("communication_rating")}</p><p className="text-muted-foreground text-xs">Communication</p></div>
          <div><p className="text-xl font-semibold">{avg("value_rating")}</p><p className="text-muted-foreground text-xs">Value</p></div>
          <div><p className="text-xl font-semibold">{recommend}%</p><p className="text-muted-foreground text-xs">Would recommend</p></div>
        </div>

        {user && user.id !== ownerId && (
          <div className="space-y-3 border border-border rounded-md p-3">
            <h4 className="font-semibold text-sm">Leave a review</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {([["rating", "Overall"], ["workmanship", "Workmanship"], ["communication", "Communication"], ["value", "Value for money"]] as const).map(([k, l]) => (
                <div key={k}><Label className="text-xs">{l}</Label><Stars value={f[k]} onChange={(n) => setF({ ...f, [k]: n })} /></div>))}
            </div>
            <Input placeholder="Title, e.g. Excellent kitchen extension" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
            <Textarea rows={3} placeholder="What work was done, was it on time and on budget?" value={f.text} onChange={(e) => setF({ ...f, text: e.target.value })} />
            <label className="flex items-center gap-2 text-sm"><Switch checked={f.recommend} onCheckedChange={(v) => setF({ ...f, recommend: v })} />I would recommend this trade</label>
            <Button onClick={submit}>Post review</Button>
          </div>
        )}

        <div className="space-y-3">
          {reviews.length === 0 && <p className="text-sm text-muted-foreground">No reviews yet.</p>}
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-border pb-3">
              <div className="flex items-center justify-between"><Stars value={r.rating} size={4} />
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("en-GB")}</span></div>
              <p className="font-medium text-sm mt-1">{r.title} {r.is_verified_job && <Badge variant="outline" className="ml-1">Verified job</Badge>}</p>
              <p className="text-sm text-muted-foreground">{r.review_text}</p>
              {r.trade_response && <p className="text-sm mt-1 pl-3 border-l-2 border-primary"><strong>Reply:</strong> {r.trade_response}</p>}
            </div>))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
