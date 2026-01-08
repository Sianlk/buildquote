import { 
  PenTool, 
  Calculator, 
  Calendar, 
  Shield, 
  FileText, 
  Package,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: PenTool,
    title: "AI CAD Generation",
    description: "BS 1192 compliant technical drawings generated from parametric inputs. SVG exports ready for planning submissions.",
    tag: "AI-Powered",
  },
  {
    icon: Calculator,
    title: "Instant Cost Engine",
    description: "BCIS-aligned rates with regional multipliers. Line-by-line breakdowns with profit margins and contingencies.",
    tag: "Deterministic",
  },
  {
    icon: Calendar,
    title: "Auto Scheduler",
    description: "Trade sequencing with realistic durations. Critical path analysis and resource allocation.",
    tag: "Logic-Based",
  },
  {
    icon: Shield,
    title: "Compliance Checks",
    description: "Building regs, fire safety, and Renters Rights Act compliance. Automated risk flagging.",
    tag: "UK Standards",
  },
  {
    icon: FileText,
    title: "JCT Invoicing",
    description: "Professional invoices with retention logic, VAT handling, and payment milestone tracking.",
    tag: "Financial",
  },
  {
    icon: Package,
    title: "Material Ordering",
    description: "Supplier mapping, waste factors, and lead-time calculations. Direct ordering integration.",
    tag: "Procurement",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background" />
      
      <div className="container relative z-10 px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase mb-4 block">
            Core Modules
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Quote, Build & Invoice
          </h2>
          <p className="text-muted-foreground text-lg">
            Six integrated modules working from a single data source. 
            Change one dimension, update everything.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card p-6 rounded-xl hover:border-primary/30 transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/50">
                  {feature.tag}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              
              <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Learn more
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
