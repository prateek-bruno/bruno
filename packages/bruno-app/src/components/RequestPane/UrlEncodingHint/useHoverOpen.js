import { useCallback, useEffect, useRef, useState } from 'react';

const CLOSE_DELAY_MS = 150;

const useHoverOpen = () => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const openNow = useCallback(() => {
    clearTimer();
    setOpen(true);
  }, []);

  const scheduleClose = useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      setOpen(false);
      timerRef.current = null;
    }, CLOSE_DELAY_MS);
  }, []);

  const closeNow = useCallback(() => {
    clearTimer();
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    clearTimer();
    setOpen((v) => !v);
  }, []);

  useEffect(() => () => clearTimer(), []);

  return { open, openNow, scheduleClose, closeNow, toggle };
};

export default useHoverOpen;
