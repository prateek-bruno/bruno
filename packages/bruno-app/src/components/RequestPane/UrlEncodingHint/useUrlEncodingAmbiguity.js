import { useMemo } from 'react';
import get from 'lodash/get';

const PERCENT_TRIPLET_RE = /%[0-9a-fA-F]{2}/;

const getUrl = (item) =>
  (item?.draft ? get(item, 'draft.request.url') : get(item, 'request.url')) || '';

const getEncodeUrlSetting = (item) => {
  const draftValue = get(item, 'draft.settings.encodeUrl');
  if (draftValue !== undefined) return draftValue;
  return get(item, 'settings.encodeUrl');
};

const useUrlEncodingAmbiguity = (item) => {
  const url = getUrl(item);
  const encodeUrlOn = getEncodeUrlSetting(item) === true;

  const hasEncodedSequences = useMemo(
    () => typeof url === 'string' && PERCENT_TRIPLET_RE.test(url),
    [url]
  );

  return {
    url,
    encodeUrlOn,
    hasEncodedSequences,
    showHint: encodeUrlOn && hasEncodedSequences
  };
};

export default useUrlEncodingAmbiguity;
