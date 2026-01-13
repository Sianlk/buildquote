import { useEffect, useRef, useCallback } from "react";

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousDataRef = useRef<string>("");
  const isSavingRef = useRef(false);

  const save = useCallback(async () => {
    if (isSavingRef.current) return;
    
    isSavingRef.current = true;
    try {
      await onSave(data);
    } catch (error) {
      console.error("Auto-save failed:", error);
    } finally {
      isSavingRef.current = false;
    }
  }, [data, onSave]);

  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (currentData === previousDataRef.current) return;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      previousDataRef.current = currentData;
      save();
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, debounceMs, enabled, save]);

  // Save immediately on unmount if there are pending changes
  useEffect(() => {
    return () => {
      const currentData = JSON.stringify(data);
      if (currentData !== previousDataRef.current && enabled) {
        save();
      }
    };
  }, []);

  return {
    saveNow: save,
    isSaving: isSavingRef.current,
  };
}
