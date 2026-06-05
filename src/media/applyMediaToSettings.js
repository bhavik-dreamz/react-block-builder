import { createMediaUploadHandler } from './createMediaUpload.js';

/**
 * Attach host media handlers to Gutenberg editor settings.
 */
export function applyMediaToSettings(baseSettings, mediaHandlers) {
  if (!mediaHandlers?.listImages) {
    return baseSettings;
  }

  const uploadHandler = createMediaUploadHandler(mediaHandlers);

  return {
    ...baseSettings,
    imageEditing: baseSettings.imageEditing ?? true,
    mediaUpload: uploadHandler || baseSettings.mediaUpload || stubMediaUpload,
  };
}

/** Enables MediaUploadCheck when only library pick is configured (no upload). */
function stubMediaUpload({ filesList, onFileChange }) {
  if (!filesList?.length) {
    onFileChange([]);
  }
}
