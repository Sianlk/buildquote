import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { ContactForm } from "@/components/shared/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Questions about BuildQuote? We're here to help landlords, trades, and property professionals across the UK.
            </p>
          </div>
          
          <ContactForm className="max-w-4xl mx-auto" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
