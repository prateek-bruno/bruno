import { useCallback, useEffect, useState } from 'react';

export const HINT_VARIANTS = ['A', 'B', 'C', 'D', 'E'];
export const DEFAULT_HINT_VARIANT = 'A';
export const HINT_VARIANT_STORAGE_KEY = 'bruno.urlEncodingHint.variant';
const HINT_VARIANT_CHANGE_EVENT = 'bruno:url-encoding-hint-variant-change';

export const HINT_VARIANT_LABELS = {
  A: 'Banner below URL bar',
  B: 'Chip beside URL bar',
  C: 'In-URL highlight (hover the highlight)',
  D: 'In-URL highlight + ⓘ button',
  E: 'Pre-send modal'
};

const normalize = (value) => (HINT_VARIANTS.includes(value) ? value : DEFAULT_HINT_VARIANT);

const readFromStorage = () => {
  try {
    const raw = localStorage.getItem(HINT_VARIANT_STORAGE_KEY);
    if (raw === null) return DEFAULT_HINT_VARIANT;
    return normalize(JSON.parse(raw));
  } catch {
    return DEFAULT_HINT_VARIANT;
  }
};

const useHintVariant = () => {
  const [variant, setVariant] = useState(readFromStorage);

  useEffect(() => {
    const handleInApp = (event) => {
      if (event?.detail && HINT_VARIANTS.includes(event.detail)) {
        setVariant(event.detail);
      }
    };
    const handleStorage = (event) => {
      if (event.key !== HINT_VARIANT_STORAGE_KEY) return;
      setVariant(readFromStorage());
    };
    window.addEventListener(HINT_VARIANT_CHANGE_EVENT, handleInApp);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener(HINT_VARIANT_CHANGE_EVENT, handleInApp);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const updateVariant = useCallback((next) => {
    const value = normalize(next);
    try {
      localStorage.setItem(HINT_VARIANT_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // ignore quota/privacy-mode failures
    }
    window.dispatchEvent(new CustomEvent(HINT_VARIANT_CHANGE_EVENT, { detail: value }));
  }, []);

  return [variant, updateVariant];
};

export default useHintVariant;
