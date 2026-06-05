import React, { useState } from 'react';
import { useMediaLibrary } from './MediaLibraryContext.jsx';
import MediaLibraryModal from './MediaLibraryModal.jsx';

/**
 * Replaces Gutenberg's default MediaUpload (wp.media) with a host-driven library modal.
 */
export default function HostMediaUpload({
  onSelect,
  allowedTypes,
  multiple = false,
  render,
  title,
  onClose,
}) {
  const media = useMediaLibrary();
  const [isOpen, setIsOpen] = useState(false);

  if (!media?.listImages) {
    return render ? render({ open: () => {} }) : null;
  }

  const open = () => setIsOpen(true);

  const close = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <>
      {render({ open })}
      {isOpen && (
        <MediaLibraryModal
          title={title || 'Select image'}
          allowedTypes={allowedTypes}
          multiple={multiple}
          onClose={close}
          onSelect={(selection) => {
            onSelect(selection);
            close();
          }}
        />
      )}
    </>
  );
}
