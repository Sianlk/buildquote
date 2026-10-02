import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink } from "lucide-react";

/**
 * England statutory planning fees, 1 April 2025 schedule (MHCLG indexation table).
 * Fees are set nationally, so every English council charges the same application fee;
 * they rise each 1 April by CPI. What varies per council: Building Control, CIL, HMO licence.
 */
export const FEE_SCHEDULE_LABEL = "England statutory fees from 1 April 2025";
const GBP = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;

export type FeeApp =
  | "householder" | "householder_multi" | "householder_ancillary" | "ldc_proposed" | "ldc_existing"
  | "prior_larger_home" | "prior_class_ma" | "prior_class_q" | "new_dwellings" | "change_of_use" | "listed_building" | "conditions_householder" | "nmc_householder";

export const FEE_APPS: Record<FeeApp, string> = {
  householder: "Householder application (extension / loft / alteration to one house)",
  householder_multi: "Householder works to two or more houses or flats",
  householder_ancillary: "Outbuilding, fence, wall or gate within the garden",
  ldc_proposed: "Lawful Development Certificate — proposed (proves it's permitted development)",
  ldc_existing: "Lawful Development Certificate — existing use / works",
  prior_larger_home: "Prior approval — larger rear extension or building upwards",
  prior_class_ma: "Prior approval — office / shop (Class E) to homes (Class MA)",
  prior_class_q: "Prior approval — agricultural or other building to homes (Class Q/M/N)",
  new_dwellings: "Full planning — new houses / flats",
  change_of_use: "Full planning — change of use (e.g. large HMO, C3 to C4 in Article 4 area)",
  listed_building: "Listed Building Consent",
  conditions_householder: "Discharge of conditions (householder)",
  nmc_householder: "Non-material amendment (householder)",
};

/** Map Planning Checker works to the most likely application. */
export function defaultFeeApp(work: string, route: string): FeeApp {
  if (route.startsWith("Listed")) return "listed_building";
  if (route.startsWith("Prior")) return work === "office_to_resi" ? "prior_class_ma" : "prior_larger_home";
  if (work === "new_dwelling") return "new_dwellings";
  if (work === "hmo_small" || work === "hmo_large") return route.startsWith("Planning") ? "change_of_use" : "ldc_proposed";
  if (work === "outbuilding" || work === "porch") return route.startsWith("Planning") ? "householder_ancillary" : "ldc_proposed";
  return route.startsWith("Planning") ? "householder" : "ldc_proposed";
}

function statutoryFee(app: FeeApp, homes: number, needsBuildingOps: boolean): { fee: number; basis: string } {
  const perHome = (n: number) => (n < 10 ? 588 * n : n <= 50 ? 635 * n : Math.min(31385 + 189 * (n - 50), 411885));
  switch (app) {
    case "householder": return { fee: 528, basis: "Single dwellinghouse" };
    case "householder_multi": return { fee: 1043, basis: "Two or more dwellinghouses/flats" };
    case "householder_ancillary": return { fee: 262, basis: "Works within/along the boundary" };
    case "ldc_proposed": return { fee: 264, basis: "Half the householder fee (£528 ÷ 2)" };
    case "ldc_existing": return { fee: 528, basis: "Same as the full householder fee" };
    case "prior_larger_home": return { fee: 240, basis: "Part 1 Class A / AA" };
    case "prior_class_ma": return { fee: 250 * Math.max(1, homes), basis: `£250 × ${Math.max(1, homes)} home(s)` };
    case "prior_class_q": return { fee: needsBuildingOps ? 516 : 240, basis: needsBuildingOps ? "Includes building operations" : "Change of use only" };
    case "new_dwellings": return { fee: perHome(Math.max(1, homes)), basis: homes < 10 ? `£588 × ${Math.max(1, homes)} home(s)` : homes <= 50 ? `£635 × ${homes} homes` : "£31,385 + £189 per home over 50" };
    case "change_of_use": return { fee: homes > 1 ? perHome(homes) : 588, basis: homes > 1 ? `Creating ${homes} homes` : "Material change of use" };
    case "listed_building": return { fee: 0, basis: "No fee for Listed Building Consent" };
    case "conditions_householder": return { fee: 86, basis: "Per request" };
    case "nmc_householder": return { fee: 44, basis: "Householder development" };
  }
}

export function CouncilFeeCalculator({ council, country, initialApp, isLondon }: { council?: string; country?: string; initialApp?: FeeApp; isLondon?: boolean }) {
  const [app, setApp] = useState<FeeApp>(initialApp || "householder");
  const [homes, setHomes] = useState(1);
  const [area, setArea] = useState(25);
  const [buildOps, setBuildOps] = useState(false);
  const [buildingControl, setBuildingControl] = useState(true);
  const [cilRate, setCilRate] = useState(0);
  const [hmoLicence, setHmoLicence] = useState(false);
  const [lastApp, setLastApp] = useState(initialApp);
  if (initialApp && initialApp !== lastApp) { setLastApp(initialApp); setApp(initialApp); }

  const england = !country || country === "England";
  const res = useMemo(() => {
    const s = statutoryFee(app, homes, buildOps);
    const lines: { item: string; amount: number; note: string; exact: boolean }[] = [];
    lines.push({ item: FEE_APPS[app], amount: s.fee, note: s.basis, exact: england });
    if (s.fee > 0) lines.push({ item: "Planning Portal service charge (if submitted online)", amount: 70, note: "Approx., incl. VAT", exact: false });
    if (buildingControl) {
      // Council Building Control charges are set locally; typical scale by floor area.
      const bc = area <= 10 ? 650 : area <= 40 ? 950 : area <= 60 ? 1150 : area <= 100 ? 1450 : 1450 + (area - 100) * 6;
      lines.push({ item: "Building Regulations (council full plans + inspections)", amount: bc * (isLondon ? 1.2 : 1), note: `Typical for ${area}m² — each council publishes its own charges`, exact: false });
    }
    const cilApplies = (app === "new_dwellings" || area >= 100) && cilRate > 0;
    if (cilApplies) lines.push({ item: "Community Infrastructure Levy", amount: cilRate * area, note: `£${cilRate}/m² × ${area}m² (self-build & extensions under 100m² usually exempt)`, exact: false });
    if (hmoLicence) lines.push({ item: "HMO licence (5 years)", amount: isLondon ? 1500 : 1000, note: "Set by each council — typically £600–£1,800", exact: false });
    return { lines, total: lines.reduce((a, l) => a + l.amount, 0) };
  }, [app, homes, area, buildOps, buildingControl, cilRate, hmoLicence, england, isLondon]);

  const showHomes = ["prior_class_ma", "new_dwellings", "change_of_use"].includes(app);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Council fee calculator{council ? ` — ${council}` : ""}</CardTitle>
        <CardDescription>
          {england ? `Planning application fees are set by law and are the same at every English council (${FEE_SCHEDULE_LABEL}, rising each April with inflation). Building Control, CIL and HMO licence fees are set by each council.` : `${country} sets its own planning fees — the figures below use England's schedule as a guide only. Check the ${country} planning portal for the exact fee.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-3"><Label className="text-xs">Application type</Label>
            <Select value={app} onValueChange={(v) => setApp(v as FeeApp)}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{Object.entries(FEE_APPS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent></Select></div>
          {showHomes && <div><Label className="text-xs">Number of homes created</Label><Input type="number" min={1} value={homes} onChange={(e) => setHomes(Math.max(1, parseInt(e.target.value) || 1))} /></div>}
          <div><Label className="text-xs">New floor area (m²)</Label><Input type="number" min={0} value={area} onChange={(e) => setArea(Math.max(0, parseFloat(e.target.value) || 0))} /></div>
          <div><Label className="text-xs">Council CIL rate £/m² (0 if none)</Label><Input type="number" min={0} value={cilRate} onChange={(e) => setCilRate(Math.max(0, parseFloat(e.target.value) || 0))} /></div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <label className="flex items-center gap-2"><Switch checked={buildingControl} onCheckedChange={setBuildingControl} />Include Building Regulations</label>
          {app === "prior_class_q" && <label className="flex items-center gap-2"><Switch checked={buildOps} onCheckedChange={setBuildOps} />Includes building works</label>}
          <label className="flex items-center gap-2"><Switch checked={hmoLicence} onCheckedChange={setHmoLicence} />Include HMO licence</label>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {res.lines.map((l) => (
              <tr key={l.item} className="border-b border-border/50 align-top">
                <td className="py-2 pr-2"><p>{l.item}</p><p className="text-xs text-muted-foreground">{l.note}{l.exact ? " · statutory fee" : " · estimate"}</p></td>
                <td className="py-2 text-right whitespace-nowrap font-medium">{l.amount === 0 ? "Free" : GBP(l.amount)}</td>
              </tr>))}
            <tr><td className="py-2 font-bold">Total fees to the council</td><td className="py-2 text-right font-bold">{GBP(res.total)}</td></tr>
          </tbody>
        </table>
        <div className="flex flex-wrap gap-4 text-xs">
          <a className="text-primary inline-flex items-center gap-1 hover:underline" href="https://www.gov.uk/guidance/fees-for-planning-applications" target="_blank" rel="noopener noreferrer">GOV.UK fee guidance <ExternalLink className="h-3 w-3" /></a>
          <a className="text-primary inline-flex items-center gap-1 hover:underline" href="https://www.planningportal.co.uk/info/200126/applications/59/how_to_apply/7" target="_blank" rel="noopener noreferrer">Planning Portal fee calculator <ExternalLink className="h-3 w-3" /></a>
          {council && <a className="text-primary inline-flex items-center gap-1 hover:underline" href={`https://www.google.com/search?q=${encodeURIComponent(council + " council building control charges CIL charging schedule")}`} target="_blank" rel="noopener noreferrer">{council} Building Control & CIL rates <ExternalLink className="h-3 w-3" /></a>}
        </div>
      </CardContent>
    </Card>
  );
}
