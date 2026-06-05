import { normalizeMediaItem } from './normalizeMedia.js';

/**
 * Gutenberg `settings.mediaUpload` adapter — uses host `uploadImage` for file picks / drops.
 */
export function createMediaUploadHandler(mediaHandlers) {
  if (!mediaHandlers?.uploadImage) {
    return null;
  }

  return function mediaUpload({
    filesList,
    onFileChange,
    onError,
    multiple,
  }) {
    const files = Array.from(filesList || []);
    if (!files.length) {
      return;
    }

    Promise.all(files.map((file) => mediaHandlers.uploadImage(file)))
      .then((results) => {
        const normalized = results.map(normalizeMediaItem);
        onFileChange(normalized);
      })
      .catch((error) => {
        if (onError) {
          onError(error);
        } else {
          console.error('mediaUpload failed:', error);
        }
      });
  };
}
