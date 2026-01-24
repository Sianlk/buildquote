import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Package, CalendarDays } from "lucide-react";

type DemoDims = {
  lengthM: number;
  widthM: number;
  heightM: number;
};

function clampNumber(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function formatGBP(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildDemoOutputs(dims: DemoDims) {
  const area = clampNumber(dims.lengthM * dims.widthM, 1, 500);
  const volume = area * clampNumber(dims.heightM, 2, 6);

  // Deterministic demo logic (no AI/credits). These are illustrative outputs only.
  const ratePerSqm = 1850;
  const estimatedCost = Math.round(area * ratePerSqm);
  const durationDays = Math.max(5, Math.round(area * 0.8));

  const materials = [
    { item: "Concrete (foundations)", qty: `${Math.max(2, Math.round(area * 0.12))} m³` },
    { item: "Blocks / masonry", qty: `${Math.max(200, Math.round(area * 38))} units` },
    { item: "Timber (structural + carcassing)", qty: `${Math.max(0.5, +(area * 0.08).toFixed(1))} m³` },
    { item: "Insulation", qty: `${Math.max(20, Math.round(area * 2.6))} m²` },
    { item: "Plasterboard", qty: `${Math.max(15, Math.round(area * 2.2))} m²` },
    { item: "Fixings & consumables", qty: "1 set" },
  ];

  const schedule = [
    { phase: "Survey + scope", days: 1 },
    { phase: "Groundworks + foundations", days: Math.max(2, Math.round(durationDays * 0.25)) },
    { phase: "Structure + roof", days: Math.max(2, Math.round(durationDays * 0.35)) },
    { phase: "First fix (MEP)", days: Math.max(1, Math.round(durationDays * 0.15)) },
    { phase: "Insulation + plastering", days: Math.max(1, Math.round(durationDays * 0.15)) },
    { phase: "Second fix + finishes", days: Math.max(1, Math.round(durationDays * 0.10)) },
  ];

  const quoteLines = [
    { desc: "Preliminaries & setup", value: Math.round(estimatedCost * 0.08) },
    { desc: "Groundworks", value: Math.round(estimatedCost * 0.18) },
    { desc: "Structure & envelope", value: Math.round(estimatedCost * 0.32) },
    { desc: "MEP (first + second fix)", value: Math.round(estimatedCost * 0.18) },
    { desc: "Finishes", value: Math.round(estimatedCost * 0.16) },
    { desc: "Contingency", value: Math.round(estimatedCost * 0.08) },
  ];

  const quoteTotal = quoteLines.reduce((sum, l) => sum + l.value, 0);

  return {
    area,
    volume,
    ratePerSqm,
    estimatedCost: quoteTotal,
    durationDays,
    quoteLines,
    materials,
    schedule,
  };
}

export function DemoQuoteDialog({
  dimensions,
  children,
}: {
  dimensions: { length: string; width: string; height: string };
  children: React.ReactNode;
}) {
  const dims = useMemo<DemoDims>(() => {
    return {
      lengthM: Number(dimensions.length || 0),
      widthM: Number(dimensions.width || 0),
      heightM: Number(dimensions.height || 0),
    };
  }, [dimensions.height, dimensions.length, dimensions.width]);

  const out = useMemo(() => buildDemoOutputs(dims), [dims]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-3">
            <span>Demo output (illustrative)</span>
            <Badge variant="secondary">No AI used</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground">Floor area</div>
              <div className="text-lg font-semibold">{out.area.toFixed(1)} m²</div>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="text-lg font-semibold">{out.volume.toFixed(1)} m³</div>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground">Estimated duration</div>
              <div className="text-lg font-semibold">{out.durationDays} days</div>
            </div>
          </div>

          <Tabs defaultValue="quote" className="space-y-3">
            <TabsList className="w-full justify-start gap-2 overflow-x-auto whitespace-nowrap">
              <TabsTrigger value="quote" className="inline-flex items-center gap-2 whitespace-nowrap">
                <FileText className="h-4 w-4" /> Quote
              </TabsTrigger>
              <TabsTrigger value="materials" className="inline-flex items-center gap-2 whitespace-nowrap">
                <Package className="h-4 w-4" /> Materials
              </TabsTrigger>
              <TabsTrigger value="schedule" className="inline-flex items-center gap-2 whitespace-nowrap">
                <CalendarDays className="h-4 w-4" /> Schedule
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quote" className="space-y-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">Estimated total</div>
                    <div className="text-xs text-muted-foreground">Based on {formatGBP(out.ratePerSqm)}/m² demo rate</div>
                  </div>
                  <div className="text-2xl font-bold">{formatGBP(out.estimatedCost)}</div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  {out.quoteLines.map((l) => (
                    <div key={l.desc} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{l.desc}</span>
                      <span className="font-medium">{formatGBP(l.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="materials" className="space-y-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm font-semibold mb-2">Indicative materials list</div>
                <div className="space-y-2">
                  {out.materials.map((m) => (
                    <div key={m.item} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{m.item}</span>
                      <span className="font-medium whitespace-nowrap">{m.qty}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-3">
              <div className="rounded-lg border bg-card p-4">
                <div className="text-sm font-semibold mb-2">Indicative schedule</div>
                <div className="space-y-2">
                  {out.schedule.map((s) => (
                    <div key={s.phase} className="flex items-center justify-between gap-4 text-sm">
                      <span className="text-muted-foreground">{s.phase}</span>
                      <span className="font-medium whitespace-nowrap">{s.days}d</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <p className="text-xs text-muted-foreground">
            Disclaimer: demo outputs are for illustration only and are not a substitute for professional design, specification, or certified drawings.
          </p>

          <div className="flex justify-end">
            <Button asChild variant="secondary">
              <a href="/signup">Continue to signup</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
