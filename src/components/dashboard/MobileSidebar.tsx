import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  FolderOpen,
  Calculator,
  FileText,
  Settings,
  LogOut,
  Building2,
  PenTool,
  ClipboardCheck,
  Receipt,
  Package,
  Users,
  HelpCircle,
  Calendar,
  Scale,
  Hammer,
  Home,
} from "lucide-react";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Projects", href: "/dashboard/projects" },
  { icon: Calculator, label: "New Quote", href: "/dashboard/new-project" },
];

const moduleNavItems = [
  { icon: PenTool, label: "CAD Drawings", href: "/dashboard/cad" },
  { icon: Calendar, label: "Schedules", href: "/dashboard/schedules" },
  { icon: ClipboardCheck, label: "Building Regs", href: "/dashboard/compliance" },
  { icon: Hammer, label: "Structural Calcs", href: "/dashboard/structural" },
  { icon: Receipt, label: "Invoices", href: "/dashboard/invoices" },
  { icon: Package, label: "Materials", href: "/dashboard/materials" },
  { icon: Home, label: "Tenancy & Legal", href: "/dashboard/tenancy" },
  { icon: Scale, label: "Renters Rights", href: "/dashboard/renters-rights" },
];

const bottomNavItems = [
  { icon: Users, label: "Team", href: "/dashboard/team" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  { icon: HelpCircle, label: "Help", href: "/dashboard/support" },
];

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const NavItem = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => {
    const isActive = location.pathname === href;
    return (
      <Link
        to={href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
          isActive
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        )}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
    );
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">BQ</span>
            </div>
            <span className="font-semibold text-lg">BuildQuote</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </nav>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Modules
            </h4>
            <nav className="space-y-1">
              {moduleNavItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Account
            </h4>
            <nav className="space-y-1">
              {bottomNavItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>
          </div>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.email}
              </p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={() => { signOut(); onClose(); }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
