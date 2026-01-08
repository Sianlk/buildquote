import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Zap, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 blur-[120px] rounded-full" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm mb-8 animate-slide-up">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">UK Construction Standard Compliant</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up delay-100">
            <span className="block text-foreground">Precision Builds.</span>
            <span className="block glow-text text-primary">Instant Quotes.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-200">
            The UK's most advanced construction operating system. Generate CAD drawings, 
            accurate costings, and compliance reports in minutes — not weeks.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up delay-300">
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Start Free Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="#demo">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up delay-400">
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/30 border border-border/30">
              <Shield className="h-5 w-5 text-success" />
              <span className="text-sm text-muted-foreground">BCIS Rate Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/30 border border-border/30">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">BS 1192 CAD Standard</span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/30 border border-border/30">
              <Calculator className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">JCT Invoice Ready</span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="glass-card p-8 rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="stat-number">£2.4B+</div>
                <div className="text-sm text-muted-foreground mt-1">Project Value Quoted</div>
              </div>
              <div className="text-center">
                <div className="stat-number">47K+</div>
                <div className="text-sm text-muted-foreground mt-1">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="stat-number">98.7%</div>
                <div className="text-sm text-muted-foreground mt-1">Quote Accuracy</div>
              </div>
              <div className="text-center">
                <div className="stat-number">4.2hrs</div>
                <div className="text-sm text-muted-foreground mt-1">Avg. Time Saved</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
