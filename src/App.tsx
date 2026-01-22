import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/new-project" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
              <Route path="/dashboard/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/dashboard/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
              <Route path="/dashboard/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
              <Route path="/dashboard/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
              <Route path="/dashboard/materials" element={<ProtectedRoute><Materials /></ProtectedRoute>} />
              <Route path="/dashboard/trade-jobs" element={<ProtectedRoute><TradeJobs /></ProtectedRoute>} />
              <Route path="/dashboard/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
              <Route path="/dashboard/tax-returns" element={<ProtectedRoute><TaxReturns /></ProtectedRoute>} />
              <Route path="/dashboard/electrical" element={<ProtectedRoute><Electrical /></ProtectedRoute>} />
              <Route path="/dashboard/plumbing" element={<ProtectedRoute><Plumbing /></ProtectedRoute>} />
              <Route path="/dashboard/carpentry" element={<ProtectedRoute><Carpentry /></ProtectedRoute>} />
              <Route path="/dashboard/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
              <Route path="/dashboard/tenancy" element={<ProtectedRoute><Tenancy /></ProtectedRoute>} />
              <Route path="/dashboard/landlord-obligations" element={<ProtectedRoute><LandlordObligations /></ProtectedRoute>} />
              <Route path="/dashboard/renewables" element={<ProtectedRoute><Renewables /></ProtectedRoute>} />
              <Route path="/dashboard/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
              <Route path="/dashboard/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/dashboard/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              
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