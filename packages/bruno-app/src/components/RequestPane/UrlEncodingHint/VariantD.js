import React, { useEffect, useRef } from 'react';
import { IconInfoCircle } from '@tabler/icons';
import useDebounce from 'hooks/useDebounce';
import useTurnOffUrlEncoding from './useTurnOffUrlEncoding';
import HintPopover from './HintPopover';
import useHoverOpen from './useHoverOpen';

const MARK_CLASS = 'cm-url-encoded-triplet';
const PERCENT_TRIPLET_G = /%[0-9a-fA-F]{2}/g;
const DEBOUNCE_MS = 300;

const VariantD = ({ item, collection, editorRef }) => {
  const turnOff = useTurnOffUrlEncoding(item, collection);
  const { open, openNow, scheduleClose, closeNow, toggle } = useHoverOpen();
  const marksRef = useRef([]);
  const anchorRef = useRef(null);

  const url = (item?.draft ? item.draft.request?.url : item.request?.url) || '';
  const debouncedUrl = useDebounce(url, DEBOUNCE_MS);

  useEffect(() => {
    const editor = editorRef?.current?.editor;
    if (!editor) return;

    marksRef.current.forEach((m) => {
      try {
        m.clear();
      } catch {
        // mark may already be cleared after a setValue
      }
    });
    marksRef.current = [];

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
  }, [debouncedUrl, editorRef]);

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
        }
      `}
      </style>
      <button
        ref={anchorRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
        data-testid="url-encoding-hint-decoration"
        aria-label="URL encoding hint"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: 2,
          background: 'transparent',
          border: 'none',
          color: 'rgba(234, 179, 8, 1)',
          cursor: 'pointer'
        }}
      >
        <IconInfoCircle size={16} strokeWidth={2} />
      </button>
      <HintPopover
        anchorRef={anchorRef}
        open={open}
        onOpen={openNow}
        onClose={scheduleClose}
      >
        <div style={{ marginBottom: 10 }}>
          Your URL looks already-encoded. Bruno will encode the highlighted parts a second time.
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

export default VariantD;
