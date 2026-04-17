import React, { useState } from 'react';
import useTurnOffUrlEncoding from './useTurnOffUrlEncoding';

const DISMISS_STORAGE_KEY = 'bruno.urlEncodingHint.dismissedRequests';

const hasDismissed = (uid) => {
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    if (!raw) return false;
    const list = JSON.parse(raw);
    return Array.isArray(list) && list.includes(uid);
  } catch {
    return false;
  }
};

const persistDismissal = (uid) => {
  try {
    const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    if (Array.isArray(list) && !list.includes(uid)) {
      list.push(uid);
      localStorage.setItem(DISMISS_STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    // ignore
  }
};

const SURFACE = '#ffffff';
const TEXT = '#111111';
const TEXT_MUTED = '#555555';
const BORDER = 'rgba(0, 0, 0, 0.12)';
const ACCENT_BG = 'rgba(234, 179, 8, 0.95)';
const ACCENT_BORDER = 'rgba(180, 134, 4, 1)';

const VariantE = ({ item, collection, onKeep, onCancelSend }) => {
  const turnOff = useTurnOffUrlEncoding(item, collection);
  const [showDetails, setShowDetails] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);

  const handleKeepOn = () => {
    if (dontAskAgain && item?.uid) persistDismissal(item.uid);
    onKeep?.();
  };

  const handleTurnOff = () => {
    if (dontAskAgain && item?.uid) persistDismissal(item.uid);
    turnOff();
    onKeep?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-testid="url-encoding-hint-modal"
      onClick={onCancelSend}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 460,
          maxWidth: '90vw',
          background: SURFACE,
          color: TEXT,
          borderRadius: 6,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
          padding: 22,
          fontSize: 13,
          lineHeight: 1.55
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: TEXT }}>
          Your URL looks already-encoded
        </h3>
        <p style={{ marginBottom: 12, color: TEXT }}>
          With URL Encoding on, Bruno will encode your URL a second time. This commonly
          breaks signed URLs from services like AWS S3, Azure, and GCP.
        </p>
        <p style={{ marginBottom: 18, color: TEXT }}>Turn URL Encoding off for this request?</p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 14 }}>
          <button
            type="button"
            onClick={handleKeepOn}
            style={{
              background: '#ffffff',
              border: `1px solid ${BORDER}`,
              borderRadius: 3,
              padding: '6px 14px',
              fontSize: 12,
              cursor: 'pointer',
              color: TEXT
            }}
          >
            Keep encoding on
          </button>
          <button
            type="button"
            onClick={handleTurnOff}
            style={{
              background: ACCENT_BG,
              border: `1px solid ${ACCENT_BORDER}`,
              borderRadius: 3,
              padding: '6px 14px',
              fontSize: 12,
              cursor: 'pointer',
              color: '#111111',
              fontWeight: 600
            }}
          >
            Turn encoding off
          </button>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: TEXT_MUTED,
            cursor: 'pointer',
            marginBottom: 10
          }}
        >
          <input
            type="checkbox"
            checked={dontAskAgain}
            onChange={(e) => setDontAskAgain(e.target.checked)}
          />
          Don&apos;t ask again for this request
        </label>

        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          style={{
            background: 'transparent',
            border: 'none',
            padding: 0,
            fontSize: 11,
            color: TEXT_MUTED,
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          {showDetails ? 'Hide' : 'Show'} technical details
        </button>
        {showDetails && (
          <div
            style={{
              marginTop: 8,
              padding: 10,
              fontSize: 11,
              lineHeight: 1.5,
              color: TEXT,
              background: '#f6f6f6',
              border: `1px solid ${BORDER}`,
              borderRadius: 3
            }}
          >
            Example:{' '}
            <code style={{ fontFamily: 'monospace', background: '#eaeaea', padding: '0 3px', borderRadius: 2 }}>
              %2F
            </code>{' '}
            becomes{' '}
            <code style={{ fontFamily: 'monospace', background: '#eaeaea', padding: '0 3px', borderRadius: 2 }}>
              %252F
            </code>{' '}
            when re-encoded, which breaks AWS signatures.
          </div>
        )}
      </div>
    </div>
  );
};

VariantE.hasDismissed = hasDismissed;

export default VariantE;
