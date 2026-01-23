import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Input Dimensions",
    description: "Enter basic measurements: room sizes, extension footprint, or conversion layout.",
  },
  {
    number: "02",
    title: "Generate Everything",
    description: "One click produces costings, schedules, compliance checks, and documents.",
  },
  {
    number: "03",
    title: "Review & Adjust",
    description: "Fine-tune rates, add custom items, or override automated calculations.",
  },
  {
    number: "04",
    title: "Export & Invoice",
    description: "Download professional PDFs, share with clients, and track payments.",
  },
];

export function WorkflowSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="container px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="text-primary text-sm font-semibold tracking-wide uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From Dimensions to Invoice in Minutes
          </h2>
          <p className="text-muted-foreground text-lg">
            A streamlined workflow that eliminates weeks of manual estimating.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent hidden md:block" />

            <div className="space-y-8 md:space-y-0">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative flex flex-col md:flex-row items-start gap-6 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Number badge */}
                  <div className="flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2 z-10">
                    <div className="w-14 h-14 rounded-full bg-card border-2 border-primary flex items-center justify-center">
                      <span className="font-mono font-bold text-primary">{step.number}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 ${index % 2 === 0 ? "md:pr-20" : "md:pl-20"}`}>
                    <div className={`glass-card p-6 rounded-xl ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-primary font-medium cursor-pointer hover:gap-3 transition-all">
              <span>See a complete project walkthrough</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
