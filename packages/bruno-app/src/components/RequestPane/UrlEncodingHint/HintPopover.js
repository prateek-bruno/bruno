import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

const HintPopover = ({ anchorRef, open, onClose, onOpen, width = 280, children }) => {
  const popoverRef = useRef(null);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!open) return;
    const el = anchorRef?.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top = rect.bottom + 6;
    let left = rect.right - width;
    if (left < 8) left = 8;
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8;
    setPosition({ top, left });
  }, [open, anchorRef, width]);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (popoverRef.current && popoverRef.current.contains(e.target)) return;
      if (anchorRef?.current && anchorRef.current.contains(e.target)) return;
      onClose?.();
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose, anchorRef]);

  if (!open || !position) return null;

  return ReactDOM.createPortal(
    <div
      ref={popoverRef}
      role="tooltip"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 1000,
        width,
        padding: '10px 12px',
        fontSize: 12,
        lineHeight: 1.5,
        background: '#ffffff',
        color: '#111111',
        border: '1px solid rgba(234, 179, 8, 0.65)',
        borderRadius: 4,
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.28)'
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default HintPopover;
