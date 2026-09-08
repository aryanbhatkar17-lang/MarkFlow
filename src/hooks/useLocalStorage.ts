"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Persist a value in localStorage with SSR-safe hydration.
 *
 * - Reads once after mount (avoids Next.js hydration mismatches).
 * - Writes are debounced so rapid edits don't thrash storage.
 * - `isHydrated` lets callers wait before trusting the value.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs = 400,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Keep latest value for the debounce flush without re-subscribing timers
  const valueRef = useRef(storedValue);
  valueRef.current = storedValue;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage after the first client paint.
  // If the key is missing, seed it with the current in-memory value so
  // first-visit defaults (e.g. welcome note) survive a hard refresh.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) {
        setStoredValue(JSON.parse(raw) as T);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueRef.current));
      }
    } catch {
      // Corrupt JSON / privacy mode — fall back to initialValue
      console.warn(`[useLocalStorage] Failed to read key "${key}"`);
    } finally {
      setIsHydrated(true);
    }
  }, [key]);

  const persist = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch (err) {
        console.warn(`[useLocalStorage] Failed to write key "${key}"`, err);
      }
    },
    [key],
  );

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        valueRef.current = next;

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          persist(next);
          timerRef.current = null;
        }, debounceMs);

        return next;
      });
    },
    [debounceMs, persist],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        persist(valueRef.current);
      }
    };
  }, [persist]);

  return [storedValue, setValue, isHydrated];
}
