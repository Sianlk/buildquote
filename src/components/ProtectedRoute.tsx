import { forwardRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Some router/layout wrappers may attempt to attach refs to route elements.
// Exporting a forwardRef-safe version prevents noisy dev warnings.
export const ProtectedRouteWithRef = forwardRef<unknown, ProtectedRouteProps>(
  function ProtectedRouteWithRef({ children }, _ref) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }
);
