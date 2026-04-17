import React, { useRef } from 'react';
import { IconAlertTriangle } from '@tabler/icons';
import useTurnOffUrlEncoding from './useTurnOffUrlEncoding';
import HintPopover from './HintPopover';
import useHoverOpen from './useHoverOpen';

const VariantB = ({ item, collection }) => {
  const turnOff = useTurnOffUrlEncoding(item, collection);
  const { open, openNow, scheduleClose, closeNow, toggle } = useHoverOpen();
  const anchorRef = useRef(null);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggle();
        }}
        onMouseEnter={openNow}
        onMouseLeave={scheduleClose}
        data-testid="url-encoding-hint-chip"
        aria-label="URL encoding hint"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 22,
          height: 22,
          padding: 0,
          background: 'rgba(234, 179, 8, 0.15)',
          border: '1px solid rgba(234, 179, 8, 0.6)',
          borderRadius: 11,
          color: '#a16207',
          cursor: 'pointer'
        }}
      >
        <IconAlertTriangle size={14} strokeWidth={2} />
      </button>
      <HintPopover
        anchorRef={anchorRef}
        open={open}
        onOpen={openNow}
        onClose={scheduleClose}
      >
        <div style={{ marginBottom: 10 }}>
          Your URL looks already-encoded. With URL Encoding on, Bruno will encode it a second time.
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

export default VariantB;
