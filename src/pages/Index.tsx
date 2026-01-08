import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { WorkflowSection } from "@/components/landing/WorkflowSection";
import { DemoSection } from "@/components/landing/DemoSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <DemoSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
