import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Smartphone } from "lucide-react";

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
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if dismissed before
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) {
      return; // Don't show for 7 days after dismissal
    }

    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    if (isIOSDevice) {
      // Show banner for iOS after delay
      setTimeout(() => setShowBanner(true), 3000);
      return;
    }

    // Handle Android/Desktop install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    
    if (choice.outcome === "accepted") {
      setShowBanner(false);
    }
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
                  ? "Tap the Share button, then 'Add to Home Screen' for quick access."
                  : "Install our app for the best experience and offline access."}
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
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
