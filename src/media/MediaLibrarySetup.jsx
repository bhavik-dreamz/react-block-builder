import { useEffect } from 'react';
import { MediaLibraryProvider } from './MediaLibraryContext.jsx';
import {
  registerHostMediaUpload,
  unregisterHostMediaUpload,
} from './registerHostMediaUpload.js';

export function MediaLibrarySetup({ media, children }) {
  useEffect(() => {
    if (!media?.listImages) {
      unregisterHostMediaUpload();
      return undefined;
    }

    registerHostMediaUpload();
    return () => unregisterHostMediaUpload();
  }, [media]);

  if (!media?.listImages) {
    return children;
  }

  return <MediaLibraryProvider media={media}>{children}</MediaLibraryProvider>;
}
