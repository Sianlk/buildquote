import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;

        if (keyMatch && ctrlMatch && altMatch && shiftMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

export function useDashboardShortcuts() {
  const navigate = useNavigate();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "n",
      ctrl: true,
      action: () => navigate("/dashboard/new-project"),
      description: "New Project",
    },
    {
      key: "p",
      ctrl: true,
      action: () => navigate("/dashboard/projects"),
      description: "Go to Projects",
    },
    {
      key: "d",
      ctrl: true,
      action: () => navigate("/dashboard"),
      description: "Go to Dashboard",
    },
    {
      key: "i",
      ctrl: true,
      action: () => navigate("/dashboard/invoices"),
      description: "Go to Invoices",
    },
    {
      key: "j",
      ctrl: true,
      action: () => navigate("/dashboard/trade-jobs"),
      description: "Go to Trade Jobs",
    },
    {
      key: "/",
      action: () => {
        const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      },
      description: "Focus Search",
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return shortcuts;
}
