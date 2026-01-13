import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import CAD from "./pages/CAD";
import Compliance from "./pages/Compliance";
import Invoices from "./pages/Invoices";
import Materials from "./pages/Materials";
import Settings from "./pages/Settings";
import TradeJobs from "./pages/TradeJobs";
import Receipts from "./pages/Receipts";
import TaxReturns from "./pages/TaxReturns";
import Electrical from "./pages/Electrical";
import Plumbing from "./pages/Plumbing";
import Carpentry from "./pages/Carpentry";
import Schedules from "./pages/Schedules";
import Tenancy from "./pages/Tenancy";
import RentersRights from "./pages/RentersRights";
import Calculators from "./pages/Calculators";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/calculators" element={<Calculators />} />
            
            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/new-project" element={<ProtectedRoute><NewProject /></ProtectedRoute>} />
            <Route path="/dashboard/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/dashboard/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/dashboard/cad" element={<ProtectedRoute><CAD /></ProtectedRoute>} />
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
            <Route path="/dashboard/renters-rights" element={<ProtectedRoute><RentersRights /></ProtectedRoute>} />
            <Route path="/dashboard/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            
            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
