import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles, CreditCard } from "lucide-react";

const tiers = [
  {
    name: "Free Trial",
    icon: Sparkles,
    price: "£0",
    period: "for 7 days",
    description: "Try every core tool free. No card required.",
    tierClass: "tier-free",
    features: [
      { text: "Create & calculate quotes", included: true },
      { text: "Materials lists & procurement", included: true },
      { text: "Schedules & compliance checks", included: true },
      { text: "2 PDF downloads included", included: true },
      { text: "Browse marketplace jobs", included: true },
      { text: "Branded exports & logos", included: false },
      { text: "Unlimited downloads", included: false },
      { text: "Post & bid on marketplace jobs", included: false },
    ],
    cta: "Start Free Trial",
    ctaVariant: "outline" as const,
  },
  {
    name: "Core",
    icon: CreditCard,
    price: "£5.99",
    period: "/month",
    description: "Everything you need. One flat price. Cancel anytime.",
    tierClass: "tier-pro",
    popular: true,
    features: [
      { text: "Everything in Free Trial", included: true },
      { text: "Unlimited projects & quotes", included: true },
      { text: "Branded PDFs with your logo", included: true },
      { text: "Unlimited PDF downloads", included: true },
      { text: "Full marketplace access", included: true },
      { text: "Post jobs & receive bids", included: true },
      { text: "Professional email delivery", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Subscribe — £5.99/mo",
    ctaVariant: "premium" as const,
  },
];

export const PricingSection = forwardRef<HTMLElement, Record<string, never>>(function PricingSection(_props, ref) {
  return (
    <section ref={ref} className="py-24 relative" id="pricing">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase mb-4 block">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, Honest Pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free for 7 days, then just £5.99/month. No hidden costs. Cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative glass-card p-8 rounded-2xl ${tier.tierClass}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    Best Value
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
                <span className="text-muted-foreground ml-1">{tier.period}</span>
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
                    <span className={feature.included ? "text-foreground text-sm" : "text-muted-foreground/50 text-sm"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button variant={tier.ctaVariant} className="w-full" size="lg">
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-muted-foreground text-sm mt-8">
          Need enterprise features? <a href="/contact" className="text-primary underline">Contact us</a> for custom plans with SSO, API access, and multi-org support.
        </p>
      </div>
    </section>
  );
});

PricingSection.displayName = "PricingSection";
