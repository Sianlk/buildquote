import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Smartphone } from "lucide-react";
import { getMeaningfulActionCount } from "@/lib/analytics-tracker";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Check if dismissed - 30 days suppression
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 30 * 24 * 60 * 60 * 1000) return;

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    const checkAndShow = () => {
      // Only show after 2+ meaningful user actions
      const actions = getMeaningfulActionCount();
      if (actions >= 2) {
        setShowBanner(true);
      }
    };

    if (isIOSDevice) {
      // Check periodically for iOS
      const interval = setInterval(checkAndShow, 5000);
      return () => clearInterval(interval);
    }

    // Handle Android/Desktop install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Delay showing until meaningful actions threshold met
      const checkInterval = setInterval(() => {
        const actions = getMeaningfulActionCount();
        if (actions >= 2) {
          setShowBanner(true);
          clearInterval(checkInterval);
        }
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  // Never obstruct forms - hide when input is focused
  useEffect(() => {
    const hideOnFocus = () => {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.tagName === "SELECT")) {
        setShowBanner(false);
      }
    };
    document.addEventListener("focusin", hideOnFocus);
    return () => document.removeEventListener("focusin", hideOnFocus);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setShowBanner(false);
    setInstallPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96 animate-in slide-in-from-bottom-5">
      <Card className="border-primary/20 shadow-lg bg-background/95 backdrop-blur">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
              <Smartphone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm mb-1">Install BuildQuote</h4>
              <p className="text-xs text-muted-foreground mb-3">
                {isIOS
                  ? "Tap Share → 'Add to Home Screen' for offline site access & quick launch."
                  : "Install for offline site access, quick launch & push notifications."}
              </p>
              <div className="flex items-center gap-2">
                {!isIOS && (
                  <Button size="sm" onClick={handleInstall}>
                    <Download className="h-4 w-4 mr-1" />
                    Install
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={handleDismiss}>
                  {isIOS ? "Got it" : "Later"}
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
