import React, { useState } from 'react';
import { IconInfoCircle, IconX } from '@tabler/icons';
import useTurnOffUrlEncoding from './useTurnOffUrlEncoding';

const VariantA = ({ item, collection }) => {
  const turnOff = useTurnOffUrlEncoding(item, collection);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      data-testid="url-encoding-hint-banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 10px',
        marginTop: 4,
        fontSize: 12,
        background: 'rgba(234, 179, 8, 0.10)',
        border: '1px solid rgba(234, 179, 8, 0.45)',
        borderRadius: 4,
        color: 'inherit'
      }}
    >
      <IconInfoCircle size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1 }}>
        Your URL looks already-encoded. If the request fails, try{' '}
        <button
          type="button"
          onClick={turnOff}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'inherit',
            fontWeight: 600,
            textDecoration: 'underline'
          }}
        >
          turning off URL Encoding
        </button>
        .
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: 'inherit',
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <IconX size={14} strokeWidth={2} />
      </button>
    </div>
  );
};

export default VariantA;
