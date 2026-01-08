import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, Building2, Crown } from "lucide-react";

const tiers = [
  {
    name: "Free",
    icon: Sparkles,
    price: "£0",
    period: "forever",
    description: "Perfect for exploring capabilities",
    tierClass: "tier-free",
    features: [
      { text: "1 active project", included: true },
      { text: "Basic geometry engine", included: true },
      { text: "Budget estimate range", included: true },
      { text: "Watermarked CAD preview", included: true },
      { text: "Full CAD exports", included: false },
      { text: "Detailed quotes", included: false },
      { text: "Compliance reports", included: false },
    ],
    cta: "Start Free",
    ctaVariant: "outline" as const,
  },
  {
    name: "Pro",
    icon: Building2,
    price: "£79",
    period: "/month",
    description: "For independent contractors",
    tierClass: "tier-pro",
    popular: true,
    features: [
      { text: "Unlimited projects", included: true },
      { text: "Full CAD generation", included: true },
      { text: "Line-by-line costings", included: true },
      { text: "Auto scheduling", included: true },
      { text: "Compliance checks", included: true },
      { text: "JCT invoicing", included: true },
      { text: "Material ordering", included: true },
    ],
    cta: "Start Pro Trial",
    ctaVariant: "premium" as const,
  },
  {
    name: "Business",
    icon: Crown,
    price: "£249",
    period: "/month",
    description: "For teams and enterprises",
    tierClass: "tier-business",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Multi-user organisation", included: true },
      { text: "HMO conversion module", included: true },
      { text: "Renters Rights compliance", included: true },
      { text: "Custom rate templates", included: true },
      { text: "White-label documents", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Contact Sales",
    ctaVariant: "hero-outline" as const,
  },
];

export function PricingSection() {
  return (
    <section className="py-24 relative" id="pricing">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase mb-4 block">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free. Scale as you grow. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative glass-card p-8 rounded-2xl ${tier.tierClass}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <tier.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{tier.name}</h3>
              </div>

              <div className="mb-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground">{tier.period}</span>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                {tier.description}
              </p>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-success flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground/50"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button variant={tier.ctaVariant} className="w-full">
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Enterprise callout */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="tier-enterprise glass-card p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold mb-2">Enterprise & White-Label</h3>
            <p className="text-muted-foreground mb-6">
              Custom branding, API access, sub-tenant management, and dedicated support for 
              housing associations, local authorities, and large contractors.
            </p>
            <Button variant="premium" size="lg">
              Request Enterprise Quote
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
