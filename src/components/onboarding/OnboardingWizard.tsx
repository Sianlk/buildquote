import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Play,
  BookOpen,
  Calculator,
  Package,
  ClipboardCheck,
  Wrench,
  Home,
  Lightbulb,
  Target,
  Sparkles,
} from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  tutorial: string[];
  actions: { label: string; href: string }[];
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: "project",
    title: "Create Your First Project",
    description: "Set up a new construction project with dimensions, room configurations, and specifications.",
    icon: Home,
    tutorial: [
      "Click 'New Quote' from the sidebar or dashboard",
      "Select the project type (extension, loft, HMO conversion, etc.)",
      "Enter building dimensions and room configurations",
      "Choose build quality and regional pricing",
      "Review the auto-generated cost estimate",
      "Save the project to your dashboard"
    ],
    actions: [
      { label: "Create Project", href: "/dashboard/new-project" }
    ]
  },
  {
    id: "estimates",
    title: "Generate Accurate Estimates",
    description: "Use our 2026-indexed pricing engine for precise material, labour, and plant costs.",
    icon: Calculator,
    tutorial: [
      "Project dimensions auto-calculate material quantities",
      "60 bricks/m² rule applied for accurate brickwork",
      "Regional multipliers adjust for UK location pricing",
      "Build quality affects material specification",
      "Labour hours calculated from productivity benchmarks",
      "Export estimates as professional PDF quotes"
    ],
    actions: [
      { label: "Try Calculators", href: "/dashboard/calculators" }
    ]
  },
  {
    id: "materials",
    title: "Materials & Shopping Lists",
    description: "Generate complete shopping lists with all components, fixings, and consumables.",
    icon: Package,
    tutorial: [
      "Access the Materials module from your project",
      "View auto-generated quantity take-offs",
      "All fixings, adhesives, and consumables included",
      "Waste factors automatically applied",
      "Export to supplier-ready formats",
      "Compare trade vs retail pricing"
    ],
    actions: [
      { label: "View Materials", href: "/dashboard/materials" }
    ]
  },
  {
    id: "compliance",
    title: "Building Regulations Check",
    description: "Validate your project against UK Building Regulations Parts A-S.",
    icon: ClipboardCheck,
    tutorial: [
      "Automatic Part L thermal compliance checks",
      "Part B fire safety validation",
      "Part M accessibility requirements",
      "Part P electrical safety",
      "AI-generated compliance explanations",
      "Download compliant specification packs"
    ],
    actions: [
      { label: "Check Compliance", href: "/dashboard/compliance" }
    ]
  },
  {
    id: "tradejobs",
    title: "Trade Job Management",
    description: "Manage individual trade jobs with component breakdowns and customer pricing.",
    icon: Wrench,
    tutorial: [
      "Create jobs for Plumbing, Electrical, Carpentry, etc.",
      "Select specific components (pipes, fittings, cables)",
      "All required materials auto-calculated",
      "Set labour rates and profit margins",
      "Generate customer quotes and invoices",
      "Track job status from quote to completion"
    ],
    actions: [
      { label: "Trade Jobs", href: "/dashboard/trade-jobs" }
    ]
  }
];

export function OnboardingWizard() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const step = ONBOARDING_STEPS[currentStep];
  const progress = (completedSteps.length / ONBOARDING_STEPS.length) * 100;

  const markComplete = () => {
    if (!completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
    }
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const StepIcon = step.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Getting Started Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Platform Onboarding
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedSteps.length}/{ONBOARDING_STEPS.length} Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex gap-2 overflow-x-auto py-2">
          {ONBOARDING_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                idx === currentStep
                  ? "bg-primary text-primary-foreground"
                  : completedSteps.includes(s.id)
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {completedSteps.includes(s.id) ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="w-4 h-4 rounded-full border flex items-center justify-center text-xs">
                  {idx + 1}
                </span>
              )}
              <span className="hidden sm:inline">{s.title.split(" ").slice(0, 2).join(" ")}</span>
            </button>
          ))}
        </div>

        {/* Current Step Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <StepIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{step.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              </div>
              {completedSteps.includes(step.id) && (
                <Badge variant="outline" className="text-success border-success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tutorial Steps */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                How To
              </h4>
              <ol className="space-y-2">
                {step.tutorial.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              {step.actions.map((action) => (
                <Button
                  key={action.href}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    markComplete();
                    setOpen(false);
                    window.location.href = action.href;
                  }}
                >
                  <Play className="h-3 w-3 mr-2" />
                  {action.label}
                </Button>
              ))}
              <Button size="sm" onClick={markComplete}>
                <CheckCircle className="h-3 w-3 mr-2" />
                Mark Complete
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {ONBOARDING_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-colors ${
                  idx === currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep(Math.min(ONBOARDING_STEPS.length - 1, currentStep + 1))}
            disabled={currentStep === ONBOARDING_STEPS.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Tips */}
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-warning mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <strong>Tip:</strong> Core calculations, material lists, and compliance checks are 
                included in the free tier. Premium credits are only used for CAD exports, BIM documents, 
                investor reports, and AI forecasting.
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
