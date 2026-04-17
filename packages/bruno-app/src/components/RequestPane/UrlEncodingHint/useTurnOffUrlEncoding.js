import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import { updateItemSettings } from 'providers/ReduxStore/slices/collections';

const DEFAULT_SETTINGS = {
  encodeUrl: false,
  followRedirects: true,
  maxRedirects: 5,
  timeout: 'inherit'
};

const useTurnOffUrlEncoding = (item, collection) => {
  const dispatch = useDispatch();

  return useCallback(() => {
    if (!item || !collection) return;
    const rawSettings = item.draft ? get(item, 'draft.settings', {}) : get(item, 'settings', {});
    const merged = { ...DEFAULT_SETTINGS, ...rawSettings, encodeUrl: false };
    dispatch(
      updateItemSettings({
        collectionUid: collection.uid,
        itemUid: item.uid,
        settings: merged
      })
    );
  }, [dispatch, item, collection]);
};

export default useTurnOffUrlEncoding;
