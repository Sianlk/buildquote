import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  FileText, 
  Calendar, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export function DemoSection() {
  const [dimensions, setDimensions] = useState({
    length: "4.5",
    width: "3.2",
    height: "2.4",
  });

  const area = parseFloat(dimensions.length) * parseFloat(dimensions.width);
  const volume = area * parseFloat(dimensions.height);
  const estimatedCost = Math.round(area * 1850); // £1850/sqm average
  const duration = Math.round(area * 0.8); // 0.8 days per sqm

  return (
    <section className="py-24 relative" id="demo">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase mb-4 block">
            Live Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Try the Parametric Engine
          </h2>
          <p className="text-muted-foreground text-lg">
            Enter dimensions and watch costs, schedules, and quantities calculate instantly.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="glass-card p-8 rounded-2xl premium-border">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Extension Dimensions
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="length" className="text-sm text-muted-foreground">
                      Length (m)
                    </Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      value={dimensions.length}
                      onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="width" className="text-sm text-muted-foreground">
                      Width (m)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      value={dimensions.width}
                      onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm text-muted-foreground">
                      Height (m)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={dimensions.height}
                      onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                  <div>
                    <span className="text-sm text-muted-foreground">Floor Area</span>
                    <div className="font-mono text-xl font-semibold text-foreground">
                      {area.toFixed(1)} m²
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Volume</span>
                    <div className="font-mono text-xl font-semibold text-foreground">
                      {volume.toFixed(1)} m³
                    </div>
                  </div>
                </div>

                <Button variant="premium" className="w-full" size="lg">
                  Generate Full Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Output Panel */}
            <div className="space-y-4">
              {/* Cost Card */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-medium">Budget Estimate</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/50">
                    BCIS Rates
                  </span>
                </div>
                <div className="stat-number text-3xl">
                  £{estimatedCost.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on £1,850/m² regional average (London & SE)
                </p>
              </div>

              {/* Schedule Card */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">Estimated Duration</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/50">
                    Auto Schedule
                  </span>
                </div>
                <div className="stat-number text-3xl">
                  {duration} days
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Including groundworks, structure, and finishes
                </p>
              </div>

              {/* Compliance Card */}
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium">Compliance Status</span>
                  </div>
                  <span className="text-xs font-semibold text-success px-2 py-1 rounded bg-success/10">
                    PASS
                  </span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Permitted Development eligible</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Building Regs Part L compliant</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    <span>Fire escape routes verified</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
