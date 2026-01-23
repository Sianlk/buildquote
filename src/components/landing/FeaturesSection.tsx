import {
  Calculator,
  Calendar,
  Shield,
  FileText,
  Package,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: ClipboardList,
    title: "Templates & Packs",
    description: "Downloadable tenancy, compliance, and project document templates with guided completion steps.",
    tag: "Downloadable",
    link: "/dashboard/tenancy",
    section: "features",
  },
  {
    icon: Calculator,
    title: "Instant Cost Engine",
    description: "BCIS-aligned rates with regional multipliers. Line-by-line breakdowns with profit margins and contingencies.",
    tag: "Deterministic",
    link: "/dashboard/projects/new",
    section: "demo",
  },
  {
    icon: Calendar,
    title: "Auto Scheduler",
    description: "Trade sequencing with realistic durations. Critical path analysis and resource allocation.",
    tag: "Logic-Based",
    link: "/dashboard/projects",
    section: "workflow",
  },
  {
    icon: Shield,
    title: "Compliance Checks",
    description: "Building regs, fire safety, and Renters Rights Act compliance. Automated risk flagging.",
    tag: "UK Standards",
    link: "/dashboard/compliance",
    section: "compliance",
  },
  {
    icon: FileText,
    title: "JCT Invoicing",
    description: "Professional invoices with retention logic, VAT handling, and payment milestone tracking.",
    tag: "Financial",
    link: "/dashboard/invoices",
    section: "invoicing",
  },
  {
    icon: Package,
    title: "Material Ordering",
    description: "Supplier mapping, waste factors, and lead-time calculations. Direct ordering integration.",
    tag: "Procurement",
    link: "/dashboard/materials",
    section: "materials",
  },
];

export function FeaturesSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="features" className="py-24 relative">
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
              className="group feature-card cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => scrollToSection(feature.section)}
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
              
              <Link 
                to={feature.link}
                className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                Learn more
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
