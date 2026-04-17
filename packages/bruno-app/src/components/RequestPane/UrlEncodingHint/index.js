import React from 'react';
import useUrlEncodingAmbiguity from './useUrlEncodingAmbiguity';
import useHintVariant from './useHintVariant';
import VariantA from './VariantA';
import VariantB from './VariantB';
import VariantC from './VariantC';
import VariantD from './VariantD';

const UrlEncodingHint = ({ item, collection, slot, editorRef }) => {
  const { showHint } = useUrlEncodingAmbiguity(item);
  const [variant] = useHintVariant();

  if (!showHint) return null;

  if (slot === 'below') {
    if (variant === 'A') return <VariantA item={item} collection={collection} />;
    return null;
  }

  if (slot === 'inline') {
    if (variant === 'B') return <VariantB item={item} collection={collection} />;
    if (variant === 'C') return <VariantC item={item} collection={collection} editorRef={editorRef} />;
    if (variant === 'D') return <VariantD item={item} collection={collection} editorRef={editorRef} />;
    return null;
  }

  return null;
};

export { default as useHintVariant } from './useHintVariant';
export { default as VariantE } from './VariantE';
export { default as useUrlEncodingAmbiguity } from './useUrlEncodingAmbiguity';
export default UrlEncodingHint;
