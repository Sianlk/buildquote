import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRouteWithRef } from "@/components/ProtectedRoute";
import { PWAInstallPrompt } from "@/components/shared/PWAInstallPrompt";
import { OfflineIndicator } from "@/components/shared/OfflineIndicator";
import { GlobalSearch } from "@/components/shared/GlobalSearch";
import { AIChatWidget } from "@/components/shared/AIChatWidget";
import { Loader2 } from "lucide-react";

// Eagerly loaded pages (critical path)
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Lazy loaded pages (code splitting for bundle optimization)
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NewProject = lazy(() => import("./pages/NewProject"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Compliance = lazy(() => import("./pages/Compliance"));
const Invoices = lazy(() => import("./pages/Invoices"));
const Materials = lazy(() => import("./pages/Materials"));
const Settings = lazy(() => import("./pages/Settings"));
const TradeJobs = lazy(() => import("./pages/TradeJobs"));
const Receipts = lazy(() => import("./pages/Receipts"));
const TaxReturns = lazy(() => import("./pages/TaxReturns"));
const Electrical = lazy(() => import("./pages/Electrical"));
const Plumbing = lazy(() => import("./pages/Plumbing"));
const Carpentry = lazy(() => import("./pages/Carpentry"));
const Schedules = lazy(() => import("./pages/Schedules"));
const Tenancy = lazy(() => import("./pages/Tenancy"));
const LandlordObligations = lazy(() => import("./pages/LandlordObligations"));
// Note: Legacy /dashboard/renters-rights route redirects to LandlordObligations
const Renewables = lazy(() => import("./pages/Renewables"));
const Finance = lazy(() => import("./pages/Finance"));
const Calculators = lazy(() => import("./pages/Calculators"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <BrowserRouter>
        <AuthProvider>
          <GlobalSearch />
          <AIChatWidget />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/calculators" element={<Calculators />} />
              
              {/* Protected dashboard routes */}
              <Route path="/dashboard" element={<ProtectedRouteWithRef><Dashboard /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/new-project" element={<ProtectedRouteWithRef><NewProject /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/projects" element={<ProtectedRouteWithRef><Projects /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/projects/:id" element={<ProtectedRouteWithRef><ProjectDetail /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/compliance" element={<ProtectedRouteWithRef><Compliance /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/invoices" element={<ProtectedRouteWithRef><Invoices /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/materials" element={<ProtectedRouteWithRef><Materials /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/trade-jobs" element={<ProtectedRouteWithRef><TradeJobs /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/receipts" element={<ProtectedRouteWithRef><Receipts /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/tax-returns" element={<ProtectedRouteWithRef><TaxReturns /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/electrical" element={<ProtectedRouteWithRef><Electrical /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/plumbing" element={<ProtectedRouteWithRef><Plumbing /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/carpentry" element={<ProtectedRouteWithRef><Carpentry /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/schedules" element={<ProtectedRouteWithRef><Schedules /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/tenancy" element={<ProtectedRouteWithRef><Tenancy /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/landlord-obligations" element={<ProtectedRouteWithRef><LandlordObligations /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/renewables" element={<ProtectedRouteWithRef><Renewables /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/finance" element={<ProtectedRouteWithRef><Finance /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/calculators" element={<ProtectedRouteWithRef><Calculators /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/settings" element={<ProtectedRouteWithRef><Settings /></ProtectedRouteWithRef>} />
              <Route path="/dashboard/admin" element={<ProtectedRouteWithRef><Admin /></ProtectedRouteWithRef>} />
              
              {/* Legacy redirects */}
              <Route path="/dashboard/renters-rights" element={<ProtectedRouteWithRef><LandlordObligations /></ProtectedRouteWithRef>} />
              
              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;