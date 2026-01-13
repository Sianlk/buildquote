import { AlertTriangle, Shield, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface LiabilityDisclaimerProps {
  variant?: "default" | "compact" | "prominent";
  showIcon?: boolean;
  context?: "calculation" | "cad" | "structural" | "electrical" | "legal" | "general";
}

export const LiabilityDisclaimer = ({ 
  variant = "default", 
  showIcon = true,
  context = "general"
}: LiabilityDisclaimerProps) => {
  const contextMessages: Record<string, { title: string; description: string }> = {
    calculation: {
      title: "Estimates for Guidance Only",
      description: "All cost estimates, material quantities, and labour calculations are provided for planning purposes only. Actual costs may vary based on site conditions, market fluctuations, and specific project requirements. Always obtain verified quotes from qualified contractors before commencing work."
    },
    cad: {
      title: "CAD Drawings Require Professional Verification",
      description: "Automated CAD drawings are generated for indicative purposes and do not constitute certified architectural or structural engineering documents. All drawings must be reviewed, verified, and approved by a qualified architect or structural engineer before submission for building control approval or construction use."
    },
    structural: {
      title: "Structural Calculations Require Engineer Sign-off",
      description: "Beam sizing, load calculations, foundation specifications, and all structural data are preliminary estimates only. A qualified structural engineer must perform independent calculations and provide certified structural drawings before any construction work. BuildQuote accepts no liability for structural failures."
    },
    electrical: {
      title: "Part P Compliance Required",
      description: "Electrical specifications and layouts are indicative only. All electrical work must be designed, installed, tested, and certified by a Part P registered competent person or notified to Building Control. Non-compliant work is dangerous and illegal."
    },
    legal: {
      title: "Legal Documents Require Solicitor Review",
      description: "Template documents, tenancy agreements, and compliance checklists are provided as starting points only and do not constitute legal advice. All legal documents should be reviewed by a qualified solicitor before use. Legislation may have changed since document creation."
    },
    general: {
      title: "Professional Oversight Required",
      description: "BuildQuote provides tools for estimation and planning purposes only. All outputs should be verified by appropriately qualified professionals. Use of this platform does not replace the need for professional architectural, structural, surveying, legal, or other specialist advice."
    }
  };

  const message = contextMessages[context];

  if (variant === "compact") {
    return (
      <div className="text-xs text-muted-foreground/70 flex items-start gap-2 p-2 bg-muted/30 rounded border border-border/50">
        {showIcon && <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-warning" />}
        <span>
          <strong className="text-muted-foreground">Disclaimer:</strong> {message.description}
        </span>
      </div>
    );
  }

  if (variant === "prominent") {
    return (
      <Alert className="border-warning/50 bg-warning/5">
        <Shield className="h-4 w-4 text-warning" />
        <AlertTitle className="text-warning">{message.title}</AlertTitle>
        <AlertDescription className="text-sm text-muted-foreground mt-2">
          {message.description}
          <div className="mt-3 pt-3 border-t border-border/50 text-xs">
            <strong>By using this tool, you acknowledge:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>These outputs are for guidance and planning only</li>
              <li>Professional verification is required before construction</li>
              <li>BuildQuote Limited accepts no liability for errors or omissions</li>
              <li>You accept full responsibility for independent verification</li>
            </ul>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-border/50 bg-card/50">
      {showIcon && <Info className="h-4 w-4" />}
      <AlertTitle>{message.title}</AlertTitle>
      <AlertDescription className="text-xs text-muted-foreground">
        {message.description}
      </AlertDescription>
    </Alert>
  );
};

export const FullLegalDisclaimer = () => {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <div className="p-4 border border-border rounded-lg bg-card/50">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Terms of Use & Limitations of Liability
        </h3>
        
        <div className="space-y-3 text-xs">
          <div>
            <strong className="text-foreground">1. No Professional Certification</strong>
            <p className="mt-1">
              BuildQuote is a software tool providing automated estimates and outputs. Neither the platform nor its operators hold themselves out as chartered architects, structural engineers, quantity surveyors, solicitors, or any other regulated profession. No certification, professional indemnity, or warranty of fitness for purpose is provided.
            </p>
          </div>
          
          <div>
            <strong className="text-foreground">2. User Responsibility</strong>
            <p className="mt-1">
              By using BuildQuote, users accept full responsibility for independently verifying all outputs with appropriately qualified professionals before reliance, submission to authorities, or commencement of construction work. Users acknowledge that automated systems cannot account for all site-specific conditions.
            </p>
          </div>
          
          <div>
            <strong className="text-foreground">3. Limitation of Liability</strong>
            <p className="mt-1">
              To the fullest extent permitted by law, BuildQuote Limited, its directors, employees, and affiliates shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages arising from use of the platform, including but not limited to: construction defects, regulatory non-compliance, cost overruns, project delays, personal injury, or property damage.
            </p>
          </div>
          
          <div>
            <strong className="text-foreground">4. Building Regulations</strong>
            <p className="mt-1">
              Compliance checks are based on our interpretation of UK Building Regulations as of January 2026. Regulations change frequently. Users must verify current requirements with their local Building Control authority. Approval from BuildQuote's automated checks does not constitute Building Control approval.
            </p>
          </div>
          
          <div>
            <strong className="text-foreground">5. Cost Estimates</strong>
            <p className="mt-1">
              All pricing is indicative based on aggregated industry data projected to January 2026. Actual costs vary by region, availability, contractor margins, and market conditions. Estimates should not be used as fixed-price quotations without professional quantity surveyor verification.
            </p>
          </div>
          
          <div>
            <strong className="text-foreground">6. CAD Drawings</strong>
            <p className="mt-1">
              Automated CAD outputs are schematic representations for planning purposes only. They do not constitute certified architectural drawings and must not be used for construction without professional architect and/or structural engineer review, stamping, and approval.
            </p>
          </div>
          
          <div className="pt-2 border-t border-border/50">
            <p className="text-muted-foreground/70">
              <strong>Governing Law:</strong> These terms are governed by the laws of England and Wales. 
              BuildQuote Limited. Registered in England & Wales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
