/**
 * useDebouncedValue — delays updating a value until the user stops changing it.
 *
 * Used by the Browse page search input to avoid firing a query on every keystroke.
 * Instead, waits for the user to stop typing (default 400ms) before updating.
 *
 * Example:
 *   const [search, setSearch] = useState('');
 *   const debouncedSearch = useDebouncedValue(search, 400);
 *   // debouncedSearch updates 400ms after the last setSearch call
 */

import { useState, useEffect } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}
