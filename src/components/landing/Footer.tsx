import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Building2, Mail, MapPin } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Calculators", href: "/calculators" },
    { label: "Get Started", href: "/signup" },
  ],
  resources: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "CAD Drawings", href: "/dashboard/cad" },
    { label: "Building Regs", href: "/dashboard/compliance" },
    { label: "Materials", href: "/dashboard/materials" },
  ],
  compliance: [
    { label: "Building Regs", href: "/dashboard/compliance" },
    { label: "Fire Safety", href: "/dashboard/compliance" },
    { label: "Tenancy & Legal", href: "/dashboard/tenancy" },
    { label: "Renters Rights", href: "/dashboard/renters-rights" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Disclaimer", href: "/terms#disclaimer" },
  ],
};

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  const renderLink = (link: { label: string; href: string }) => {
    // Check if it's an anchor link or external
    if (link.href.startsWith("#") || link.href.startsWith("/#")) {
      return (
        <a
          href={link.href}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.label}
        </a>
      );
    }
    // Internal route
    return (
      <Link
        to={link.href}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <footer ref={ref} className="border-t border-border/50 bg-card/30">
      <div className="container px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">BQ</span>
              </div>
              <span className="font-semibold text-lg tracking-tight">
                BuildQuote<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              The UK's most advanced construction operating system. 
              Quote, build, and invoice with confidence.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>London, United Kingdom</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>hello@buildquote.co.uk</span>
              </div>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Compliance</h4>
            <ul className="space-y-2">
              {footerLinks.compliance.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>{renderLink(link)}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BuildQuote UK. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>Registered in England & Wales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-card/50 border-t border-border/30">
        <div className="container px-4 py-4">
          <p className="text-xs text-muted-foreground/70 text-center max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> BuildQuote provides estimates and automated outputs for guidance purposes only. 
            All drawings, calculations, and compliance assessments should be verified by qualified professionals 
            before use. BuildQuote does not replace professional architectural, structural, or surveying services.
            Use of this platform constitutes acceptance of our{" "}
            <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";
