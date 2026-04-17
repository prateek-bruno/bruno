import React, { useEffect, useRef, useState } from 'react';
import useDebounce from 'hooks/useDebounce';
import useTurnOffUrlEncoding from './useTurnOffUrlEncoding';
import HintPopover from './HintPopover';
import useHoverOpen from './useHoverOpen';

const MARK_CLASS = 'cm-url-hint-mark-c';
const PERCENT_TRIPLET_G = /%[0-9a-fA-F]{2}/g;
const DEBOUNCE_MS = 300;

const VariantC = ({ item, collection, editorRef }) => {
  const turnOff = useTurnOffUrlEncoding(item, collection);
  const { open, openNow, scheduleClose, closeNow } = useHoverOpen();
  const marksRef = useRef([]);
  const anchorRef = useRef(null);
  const [, forceRender] = useState(0);

  const url = (item?.draft ? item.draft.request?.url : item.request?.url) || '';
  const debouncedUrl = useDebounce(url, DEBOUNCE_MS);

  // apply marks on debounced url change
  useEffect(() => {
    const editor = editorRef?.current?.editor;
    if (!editor) return;

    marksRef.current.forEach((m) => {
      try {
        m.clear();
      } catch {
        // ignore
      }
    });
    marksRef.current = [];

    // close any stale popover attached to a mark we just wiped
    closeNow();
    anchorRef.current = null;

    const doc = editor.getDoc();
    const value = editor.getValue();
    let match;
    PERCENT_TRIPLET_G.lastIndex = 0;
    while ((match = PERCENT_TRIPLET_G.exec(value))) {
      const from = doc.posFromIndex(match.index);
      const to = doc.posFromIndex(match.index + match[0].length);
      try {
        const mark = doc.markText(from, to, { className: MARK_CLASS });
        marksRef.current.push(mark);
      } catch {
        // defensive
      }
    }
  }, [debouncedUrl, editorRef, closeNow]);

  // delegate hover/click on the editor wrapper to the marked spans
  useEffect(() => {
    const editor = editorRef?.current?.editor;
    if (!editor) return;
    const wrapper = editor.getWrapperElement?.();
    if (!wrapper) return;

    const findMarkSpan = (target) => {
      let el = target;
      while (el && el !== wrapper) {
        if (el.classList && el.classList.contains(MARK_CLASS)) return el;
        el = el.parentElement;
      }
      return null;
    };

    const handleMouseOver = (e) => {
      const span = findMarkSpan(e.target);
      if (!span) return;
      anchorRef.current = span;
      forceRender((n) => n + 1);
      openNow();
    };

    const handleMouseOut = (e) => {
      const span = findMarkSpan(e.target);
      if (!span) return;
      const related = e.relatedTarget;
      if (related && findMarkSpan(related)) return;
      scheduleClose();
    };

    const handleClick = (e) => {
      const span = findMarkSpan(e.target);
      if (!span) return;
      anchorRef.current = span;
      forceRender((n) => n + 1);
      openNow();
    };

    wrapper.addEventListener('mouseover', handleMouseOver);
    wrapper.addEventListener('mouseout', handleMouseOut);
    wrapper.addEventListener('click', handleClick);

    return () => {
      wrapper.removeEventListener('mouseover', handleMouseOver);
      wrapper.removeEventListener('mouseout', handleMouseOut);
      wrapper.removeEventListener('click', handleClick);
    };
  }, [editorRef, openNow, scheduleClose]);

  // clear marks on unmount
  useEffect(
    () => () => {
      marksRef.current.forEach((m) => {
        try {
          m.clear();
        } catch {
          // ignore
        }
      });
      marksRef.current = [];
    },
    []
  );

  return (
    <>
      <style>{`
        .${MARK_CLASS} {
          background: rgba(234, 179, 8, 0.28);
          border-bottom: 1px dashed rgba(234, 179, 8, 0.95);
          cursor: help;
        }
        .${MARK_CLASS}:hover {
          background: rgba(234, 179, 8, 0.45);
        }
      `}
      </style>
      <HintPopover
        anchorRef={anchorRef}
        open={open}
        onOpen={openNow}
        onClose={scheduleClose}
      >
        <div style={{ marginBottom: 10 }}>
          Your URL looks already-encoded. Bruno will encode this sequence a second time.
        </div>
        <button
          type="button"
          onClick={() => {
            turnOff();
            closeNow();
          }}
          style={{
            background: '#111111',
            border: '1px solid #111111',
            borderRadius: 3,
            padding: '4px 10px',
            fontSize: 12,
            cursor: 'pointer',
            color: '#ffffff',
            fontWeight: 500
          }}
        >
          Turn off URL Encoding
        </button>
      </HintPopover>
    </>
  );
};

export default VariantC;
