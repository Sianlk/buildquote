import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LiabilityDisclaimer } from "@/components/shared/LiabilityDisclaimer";
import { Loader2, MapPin, AlertTriangle, CheckCircle, Info, ExternalLink } from "lucide-react";

type House = "detached" | "semi" | "terrace" | "flat";
type Work = "rear_single" | "rear_double" | "side" | "loft_dormer" | "loft_hip" | "rooflights" | "porch" | "outbuilding" | "garage_conversion" | "hmo_small" | "hmo_large" | "office_to_resi" | "new_dwelling";

const WORKS: Record<Work, string> = {
  rear_single: "Single-storey rear extension", rear_double: "Two-storey rear extension", side: "Single-storey side extension",
  loft_dormer: "Loft conversion with rear dormer", loft_hip: "Hip-to-gable loft conversion", rooflights: "Loft conversion with rooflights only",
  porch: "Front porch", outbuilding: "Garden room / outbuilding", garage_conversion: "Garage conversion (internal)",
  hmo_small: "Small HMO, 3–6 people (C3 → C4)", hmo_large: "Large HMO, 7+ people (sui generis)", office_to_resi: "Office / shop to flats (Class MA)", new_dwelling: "New house / infill plot",
};
const DATASETS: Record<string, string> = {
  "conservation-area": "Conservation area", "article-4-direction-area": "Article 4 direction", "listed-building-outline": "Listed building",
  "flood-risk-zone": "Flood risk zone", "green-belt": "Green belt", "area-of-outstanding-natural-beauty": "National Landscape (AONB)",
  "national-park": "National park", "tree-preservation-zone": "Tree Preservation Order area", "world-heritage-site": "World Heritage Site",
};

type Place = { postcode: string; council: string; region: string; country: string; lat: number; lng: number; ward: string };
type Constraint = { dataset: string; name: string; reference: string };
type Verdict = { route: string; tone: "ok" | "warn" | "stop"; reasons: string[]; likelihood: number; design: string[]; fees: [string, string][] };

function assess(work: Work, house: House, depth: number, height: number, volume: number, constraints: Constraint[], country: string): Verdict {
  const has = (d: string) => constraints.some((c) => c.dataset === d);
  const art22 = has("conservation-area") || has("area-of-outstanding-natural-beauty") || has("national-park") || has("world-heritage-site");
  const reasons: string[] = []; const design: string[] = []; const fees: [string, string][] = [];
  let route = "Permitted development (no planning application)"; let tone: Verdict["tone"] = "ok"; let likelihood = 85;
  const needPP = (why: string) => { route = "Planning permission needed"; tone = "warn"; reasons.push(why); likelihood -= 15; };

  if (country !== "England") reasons.push(`Rules here follow England's GPDO. ${country} has its own permitted development rules and fees — confirm with the council.`);
  if (house === "flat" && !["hmo_small", "hmo_large", "office_to_resi", "new_dwelling"].includes(work)) needPP("Flats and maisonettes have no householder permitted development rights.");
  if (has("listed-building-outline")) { route = "Listed building consent + planning"; tone = "stop"; reasons.push("Listed building: almost any external or internal alteration affecting character needs Listed Building Consent. Unauthorised works are a criminal offence."); likelihood -= 30; }
  if (has("article-4-direction-area")) reasons.push("An Article 4 direction applies here — it may remove some permitted development rights (often HMOs, windows, front extensions). Check the council's Article 4 list.");

  const attached = house !== "detached";
  switch (work) {
    case "rear_single": {
      const pd = attached ? 3 : 4, pa = attached ? 6 : 8;
      if (height > 4) needPP("Single-storey rear extensions over 4m high are not permitted development.");
      else if (depth <= pd) reasons.push(`Within the ${pd}m depth limit for a ${house} house (max 4m high, eaves ≤3m within 2m of a boundary).`);
      else if (depth <= pa && !art22) { route = "Prior approval (larger home extension)"; tone = "warn"; reasons.push(`${depth}m is over ${pd}m but within ${pa}m — needs the neighbour-consultation prior approval process (42 days).`); fees.push(["Prior approval fee (England)", "£120–£258"]); likelihood -= 5; }
      else needPP(`${depth}m exceeds the ${art22 ? pd : pa}m limit${art22 ? " (larger home extension scheme doesn't apply in designated areas)" : ""}.`);
      design.push("Keep eaves ≤3m within 2m of the boundary", "Flat roof with lantern or low-pitch roof is rarely refused", "Match or complement existing brick");
      break;
    }
    case "rear_double":
      if (depth > 3) needPP("Two-storey rear extensions are limited to 3m deep under PD.");
      if (art22) needPP("Two-storey extensions are not PD in conservation areas / national landscapes.");
      reasons.push("Must be ≥7m from the rear boundary, roof pitch to match, no balconies, upper side windows obscure-glazed and non-opening below 1.7m.");
      design.push("Apply the 45° rule from neighbours' nearest habitable window", "Set the roof ridge below the main ridge", "Hipped roof reduces overshadowing objections");
      break;
    case "side":
      if (art22) needPP("Side extensions are not permitted development in conservation areas, national parks or national landscapes.");
      else reasons.push("PD if single storey, max 4m high and no wider than half the original house width.");
      design.push("Set back 0.5–1m from the front wall to look subservient", "Keep a 1m gap to the boundary to avoid a terracing effect");
      break;
    case "loft_dormer": case "loft_hip": case "rooflights": {
      const limit = house === "terrace" ? 40 : 50;
      if (art22) needPP("Loft conversions that change the roof shape are not PD in designated areas.");
      else if (volume > limit) needPP(`Added roof volume ${volume}m³ exceeds the ${limit}m³ PD allowance for a ${house} house.`);
      else reasons.push(`Within the ${limit}m³ volume allowance. Dormer must be set back ≥20cm from the eaves, not higher than the ridge, not on the front roof slope; side windows obscure-glazed.`);
      if (work === "loft_hip" && house === "terrace") needPP("Mid-terrace houses have no hip to convert — this would be a mansard/front alteration needing permission.");
      design.push("Rear dormers clad in tile or slate to match roof are most often approved", "Avoid front dormers unless the street already has them", "A Juliet balcony is acceptable; a balcony or terrace is not PD");
      break;
    }
    case "porch":
      reasons.push("PD if footprint ≤3m², ≤3m high and ≥2m from a boundary with a highway.");
      if (art22) reasons.push("In designated areas check the council's design guide — porches are still PD but Article 4s often cover front elevations.");
      break;
    case "outbuilding":
      if (height > 2.5) reasons.push("Within 2m of a boundary the outbuilding must be max 2.5m high; otherwise 4m dual-pitch / 3m other.");
      reasons.push("Must not cover more than 50% of the garden, not forward of the house, and not used as a separate dwelling.");
      if (art22) reasons.push("In designated areas outbuildings to the side of the house need permission.");
      break;
    case "garage_conversion":
      reasons.push("Internal works are usually PD (check no condition removed rights on newer estates). Building Regulations approval always needed.");
      break;
    case "hmo_small":
      if (has("article-4-direction-area")) needPP("C3 → C4 small HMO needs planning permission where an Article 4 direction covers HMOs.");
      else reasons.push("C3 → C4 change of use is PD unless an Article 4 direction applies. You still need an HMO licence for 5+ people (mandatory) or under the council's additional licensing scheme.");
      fees.push(["HMO licence (typical, varies by council)", "£600–£1,500 for 5 years"]);
      break;
    case "hmo_large":
      needPP("HMOs for 7+ people are sui generis — full planning permission always required.");
      fees.push(["HMO licence (typical)", "£800–£1,800 for 5 years"]);
      design.push("Show bedrooms ≥6.51m² (1 person) / ≥10.22m² (2 people)", "Provide bin and cycle storage on drawings", "Kitchen ratio ~1 per 5 occupants; bathroom 1 per 5");
      break;
    case "office_to_resi":
      route = "Prior approval (Class MA)"; tone = "warn";
      reasons.push("Class E to residential needs prior approval: building vacant 3 months, homes must meet Nationally Described Space Standards and have adequate natural light. Not available in listed buildings or (for some parts) conservation areas.");
      fees.push(["Class MA prior approval fee", "£120 per home (approx.)"]);
      break;
    case "new_dwelling":
      needPP("New dwellings always need full planning permission (or Permission in Principle for small sites).");
      fees.push(["Full application fee (England, 1–9 homes)", "£578 per home"], ["Biodiversity net gain assessment", "£1,000–£3,000"], ["CIL (if the council charges it)", "£0–£400 per m²"]);
      design.push("Match the prevailing building line and plot widths", "21m back-to-back distance between facing habitable windows", "Meet NDSS internal space and parking standards");
      break;
  }
  if (has("flood-risk-zone")) { reasons.push("Flood risk zone: a Flood Risk Assessment will be required with any application."); fees.push(["Flood risk assessment", "£400–£1,500"]); likelihood -= 10; }
  if (has("tree-preservation-zone")) reasons.push("Tree Preservation Order nearby: you need consent to prune or remove protected trees; an arboricultural report may be needed.");
  if (has("green-belt")) { reasons.push("Green belt: extensions must not be 'disproportionate' — typically councils cap at 30–50% over the original volume."); likelihood -= 15; }
  if (has("conservation-area")) design.push("Use traditional materials (timber/aluminium flush windows, natural slate)", "A Heritage Statement is required with applications");

  if (route.startsWith("Planning")) fees.unshift(["Householder planning fee (England, from Dec 2024)", "£528"]);
  else if (route.startsWith("Permitted")) fees.unshift(["Lawful Development Certificate (recommended, proves PD)", "£264"]);
  fees.push(["Planning / measured drawings", "£800–£2,500"], ["Building Regulations (full plans or building notice)", "£600–£1,500"], ["Structural engineer calcs", "£400–£1,000"]);
  if (attached && ["rear_single", "rear_double", "side", "loft_dormer", "loft_hip", "new_dwelling"].includes(work)) fees.push(["Party Wall surveyor (per neighbour, if needed)", "£900–£1,500"]);
  return { route, tone, reasons, likelihood: Math.max(10, Math.min(95, likelihood)), design, fees };
}

export default function PlanningChecker() {
  const [postcode, setPostcode] = useState("");
  const [house, setHouse] = useState<House>("semi");
  const [work, setWork] = useState<Work>("rear_single");
  const [depth, setDepth] = useState(4);
  const [height, setHeight] = useState(3.5);
  const [volume, setVolume] = useState(40);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [place, setPlace] = useState<Place | null>(null);
  const [constraints, setConstraints] = useState<Constraint[]>([]);

  const lookup = async () => {
    const pc = postcode.trim().toUpperCase();
    if (!/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/.test(pc)) { setError("Enter a full UK postcode, e.g. SW1A 1AA"); return; }
    setLoading(true); setError("");
    try {
      const r = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`).then((x) => x.json());
      if (r.status !== 200) throw new Error("Postcode not found");
      const p: Place = { postcode: r.result.postcode, council: r.result.admin_district, region: r.result.region || r.result.country, country: r.result.country, lat: r.result.latitude, lng: r.result.longitude, ward: r.result.admin_ward };
      setPlace(p);
      const qs = Object.keys(DATASETS).map((d) => `dataset=${d}`).join("&");
      const c = await fetch(`https://www.planning.data.gov.uk/entity.json?latitude=${p.lat}&longitude=${p.lng}&${qs}&exclude_field=geometry&limit=50`).then((x) => x.json()).catch(() => ({ entities: [] }));
      setConstraints((c.entities || []).map((e: { dataset: string; name: string; reference: string }) => ({ dataset: e.dataset, name: e.name, reference: e.reference })));
    } catch (e) { setError((e as Error).message); setPlace(null); setConstraints([]); }
    setLoading(false);
  };

  const v = place ? assess(work, house, depth, height, volume, constraints, place.country) : null;
  const showDepth = ["rear_single", "rear_double", "side"].includes(work);
  const showVolume = work.startsWith("loft") || work === "rooflights";

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8 space-y-6">
        <div><h1 className="text-2xl md:text-3xl font-bold">Planning Checker</h1>
          <p className="text-muted-foreground">Enter a postcode and your plans — see the council, local protections, whether you need permission, what design is most likely approved, and the costs.</p></div>
        <LiabilityDisclaimer variant="compact" context="compliance" />

        <Card>
          <CardContent className="pt-6 grid gap-3 md:grid-cols-4 items-end">
            <div><Label className="text-xs">Property postcode</Label><Input placeholder="e.g. M20 2RN" value={postcode} onChange={(e) => setPostcode(e.target.value)} onKeyDown={(e) => e.key === "Enter" && lookup()} /></div>
            <div><Label className="text-xs">Property type</Label>
              <Select value={house} onValueChange={(x) => setHouse(x as House)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="detached">Detached house</SelectItem><SelectItem value="semi">Semi-detached</SelectItem><SelectItem value="terrace">Terraced</SelectItem><SelectItem value="flat">Flat / maisonette</SelectItem></SelectContent></Select></div>
            <div className="md:col-span-2"><Label className="text-xs">What do you want to do?</Label>
              <Select value={work} onValueChange={(x) => setWork(x as Work)}><SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{Object.entries(WORKS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}</SelectContent></Select></div>
            {showDepth && <div><Label className="text-xs">Depth from rear/side wall (m)</Label><Input type="number" step="0.1" value={depth} onChange={(e) => setDepth(parseFloat(e.target.value) || 0)} /></div>}
            {(showDepth || work === "outbuilding") && <div><Label className="text-xs">Max height (m)</Label><Input type="number" step="0.1" value={height} onChange={(e) => setHeight(parseFloat(e.target.value) || 0)} /></div>}
            {showVolume && <div><Label className="text-xs">Added roof volume (m³)</Label><Input type="number" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value) || 0)} /></div>}
            <Button onClick={lookup} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}Check</Button>
            {error && <p className="text-sm text-destructive md:col-span-4">{error}</p>}
          </CardContent>
        </Card>

        {place && v && (
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader><CardTitle className="text-base">{place.postcode}</CardTitle><CardDescription>{place.ward}, {place.region}</CardDescription></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>Local planning authority:</strong> {place.council}</p>
                <a className="text-primary inline-flex items-center gap-1 hover:underline" target="_blank" rel="noopener noreferrer" href={`https://www.planningportal.co.uk/applications`}>Apply via Planning Portal <ExternalLink className="h-3 w-3" /></a><br />
                <a className="text-primary inline-flex items-center gap-1 hover:underline" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/search?q=${encodeURIComponent(place.council + " council planning application search")}`}>Search nearby approvals on {place.council}'s planning register <ExternalLink className="h-3 w-3" /></a>
                <div className="pt-2"><p className="font-medium mb-1">Protections at this postcode</p>
                  {place.country !== "England" ? <p className="text-muted-foreground">Constraint data covers England only.</p> :
                    constraints.length === 0 ? <p className="flex items-center gap-1 text-muted-foreground"><CheckCircle className="h-4 w-4 text-primary" />None found</p> :
                      <div className="flex flex-wrap gap-1">{constraints.map((c, i) => <Badge key={i} variant="outline">{DATASETS[c.dataset] || c.dataset}{c.name ? `: ${c.name}` : ""}</Badge>)}</div>}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  {v.tone === "ok" ? <CheckCircle className="h-5 w-5 text-primary" /> : v.tone === "warn" ? <Info className="h-5 w-5 text-primary" /> : <AlertTriangle className="h-5 w-5 text-destructive" />}
                  {v.route}
                </CardTitle>
                <CardDescription>{WORKS[work]} · {house} · estimated approval likelihood {v.likelihood}%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <ul className="list-disc pl-5 space-y-1">{v.reasons.map((r, i) => <li key={i}>{r}</li>)}</ul>
                {v.design.length > 0 && <div><p className="font-medium mb-1">Designs most likely to be approved</p><ul className="list-disc pl-5 space-y-1">{v.design.map((d, i) => <li key={i}>{d}</li>)}</ul></div>}
                <div><p className="font-medium mb-1">Likely costs before you build</p>
                  <table className="w-full"><tbody>{v.fees.map(([k, val]) => <tr key={k} className="border-b border-border/50"><td className="py-1">{k}</td><td className="text-right whitespace-nowrap">{val}</td></tr>)}</tbody></table></div>
                <p className="text-xs text-muted-foreground">Decision times: householder 8 weeks, prior approval 42 days, major 13 weeks. Building Regulations approval is needed separately for almost all of these works.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
