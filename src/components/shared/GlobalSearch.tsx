import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  FileText,
  Receipt,
  ClipboardCheck,
  Calculator,
  Users,
  Settings,
  Plus,
  Zap,
  Hammer,
  Droplets,
  Calendar,
  Building,
  HelpCircle,
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const commands: CommandItem[] = [
    // Navigation
    {
      id: "dashboard",
      label: "Go to Dashboard",
      icon: LayoutDashboard,
      shortcut: "⌘D",
      action: () => navigate("/dashboard"),
      category: "Navigation",
    },
    {
      id: "projects",
      label: "Go to Projects",
      icon: Building,
      shortcut: "⌘P",
      action: () => navigate("/dashboard/projects"),
      category: "Navigation",
    },
    {
      id: "invoices",
      label: "Go to Invoices",
      icon: Receipt,
      shortcut: "⌘I",
      action: () => navigate("/dashboard/invoices"),
      category: "Navigation",
    },
    {
      id: "trade-jobs",
      label: "Go to Trade Jobs",
      icon: Hammer,
      shortcut: "⌘J",
      action: () => navigate("/dashboard/trade-jobs"),
      category: "Navigation",
    },
    {
      id: "compliance",
      label: "Go to Compliance",
      icon: ClipboardCheck,
      action: () => navigate("/dashboard/compliance"),
      category: "Navigation",
    },
    {
      id: "schedules",
      label: "Go to Schedules",
      icon: Calendar,
      action: () => navigate("/dashboard/schedules"),
      category: "Navigation",
    },
    // Quick Actions
    {
      id: "new-project",
      label: "Create New Project",
      icon: Plus,
      shortcut: "⌘N",
      action: () => navigate("/dashboard/new-project"),
      category: "Quick Actions",
    },
    {
      id: "new-invoice",
      label: "Create New Invoice",
      icon: FileText,
      action: () => navigate("/dashboard/invoices"),
      category: "Quick Actions",
    },
    {
      id: "new-quote",
      label: "Create New Quote",
      icon: Calculator,
      action: () => navigate("/dashboard/trade-jobs"),
      category: "Quick Actions",
    },
    // Trade Modules
    {
      id: "electrical",
      label: "Electrical Module",
      icon: Zap,
      action: () => navigate("/dashboard/electrical"),
      category: "Trade Modules",
    },
    {
      id: "plumbing",
      label: "Plumbing Module",
      icon: Droplets,
      action: () => navigate("/dashboard/plumbing"),
      category: "Trade Modules",
    },
    {
      id: "carpentry",
      label: "Carpentry Module",
      icon: Hammer,
      action: () => navigate("/dashboard/carpentry"),
      category: "Trade Modules",
    },
    // Finance
    {
      id: "receipts",
      label: "Digital Receipts",
      icon: Receipt,
      action: () => navigate("/dashboard/receipts"),
      category: "Finance",
    },
    {
      id: "tax-returns",
      label: "Tax Returns",
      icon: Calculator,
      action: () => navigate("/dashboard/tax-returns"),
      category: "Finance",
    },
    // Settings
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      action: () => navigate("/dashboard/settings"),
      category: "Settings",
    },
    {
      id: "calculators",
      label: "Calculators",
      icon: Calculator,
      action: () => navigate("/dashboard/calculators"),
      category: "Tools",
    },
  ];

  const groupedCommands = commands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {Object.entries(groupedCommands).map(([category, items], idx) => (
          <div key={category}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={category}>
              {items.map((item) => (
                <CommandItem
                  key={item.id}
                  onSelect={() => runCommand(item.action)}
                  className="flex items-center gap-3"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      {item.shortcut}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
