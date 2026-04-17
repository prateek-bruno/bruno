import React from 'react';
import useHintVariant, { HINT_VARIANTS, HINT_VARIANT_LABELS } from './useHintVariant';

const VariantPicker = () => {
  const [variant, setVariant] = useHintVariant();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        color: '#fff',
        padding: '6px 10px',
        borderRadius: 6,
        fontSize: 11,
        fontFamily: 'monospace',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        pointerEvents: 'auto'
      }}
      data-testid="url-encoding-hint-variant-picker"
    >
      <span>URL-encoding hint:</span>
      <select
        value={variant}
        onChange={(e) => setVariant(e.target.value)}
        style={{
          background: '#222',
          color: '#fff',
          border: '1px solid #555',
          borderRadius: 3,
          padding: '2px 4px',
          fontSize: 11
        }}
      >
        {HINT_VARIANTS.map((v) => (
          <option key={v} value={v}>
            {v} — {HINT_VARIANT_LABELS[v]}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VariantPicker;
