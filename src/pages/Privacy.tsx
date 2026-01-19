import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Shield, Eye, Lock, Database, Globe, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">
              Last updated: January 2026
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                1. Information We Collect
              </h2>
              <div className="prose prose-sm text-muted-foreground space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">1.1 Account Information</h3>
                  <p>When you create an account, we collect your name, email address, company name, and phone number.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">1.2 Project Data</h3>
                  <p>We collect information you provide about your construction projects, including dimensions, specifications, addresses, and client details.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">1.3 Usage Data</h3>
                  <p>We automatically collect information about how you use the Service, including pages visited, features used, and time spent.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">1.4 Device Information</h3>
                  <p>We collect device type, operating system, browser type, and IP address for security and analytics purposes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                2. How We Use Your Information
              </h2>
              <div className="prose prose-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>To provide and maintain the Service</li>
                  <li>To process your projects and generate estimates, drawings, and reports</li>
                  <li>To communicate with you about your account and projects</li>
                  <li>To improve and personalize the Service</li>
                  <li>To ensure security and prevent fraud</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-primary" />
                3. Data Security
              </h2>
              <div className="prose prose-sm text-muted-foreground">
                <p>
                  We implement industry-standard security measures including:
                </p>
                <ul className="mt-4 space-y-2">
                  <li>Encryption of data in transit (TLS/SSL)</li>
                  <li>Encryption of data at rest</li>
                  <li>Regular security audits</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data centers with redundancy</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                4. Data Sharing
              </h2>
              <div className="prose prose-sm text-muted-foreground">
                <p>
                  We do not sell your personal data. We may share data with:
                </p>
                <ul className="mt-4 space-y-2">
                  <li><strong>Service Providers:</strong> Third parties who assist in operating the Service</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                5. Your Rights (GDPR)
              </h2>
              <div className="prose prose-sm text-muted-foreground">
                <p>Under UK GDPR, you have the right to:</p>
                <ul className="mt-4 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
                  <li><strong>Erasure:</strong> Request deletion of your data</li>
                  <li><strong>Restriction:</strong> Request restriction of processing</li>
                  <li><strong>Portability:</strong> Request transfer of your data</li>
                  <li><strong>Object:</strong> Object to certain processing activities</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, use our Contact Form or AI Chat support.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
              <div className="prose prose-sm text-muted-foreground">
                <p>
                  We retain your data for as long as your account is active or as needed to provide services. 
                  Project data is retained for 7 years after completion for audit and warranty purposes. 
                  You may request deletion at any time, subject to legal retention requirements.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <div className="prose prose-sm text-muted-foreground">
                <p>
                  We use cookies and similar technologies for:
                </p>
                <ul className="mt-4 space-y-2">
                  <li><strong>Essential:</strong> Required for the Service to function</li>
                  <li><strong>Analytics:</strong> To understand how the Service is used</li>
                  <li><strong>Preferences:</strong> To remember your settings</li>
                </ul>
                <p className="mt-4">
                  You can control cookies through your browser settings.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-primary" />
                8. Contact Us
              </h2>
              <div className="prose prose-sm text-muted-foreground">
                <p>
                  For privacy-related inquiries, use our Contact Form or AI Chat support.
                </p>
                <p className="mt-2">
                  <strong>Data Protection Officer</strong><br />
                  BuildQuote Limited
                </p>
                <p className="mt-4">
                  You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) 
                  at ico.org.uk
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
