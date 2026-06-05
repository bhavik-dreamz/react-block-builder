import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Button, Spinner, TextControl } from '@wordpress/components';
import { useMediaLibrary } from './MediaLibraryContext.jsx';
import { normalizeMediaSelection } from './normalizeMedia.js';

function matchesAllowedTypes(item, allowedTypes) {
  if (!allowedTypes?.length) {
    return true;
  }
  const mime = item.mimeType || item.mime || 'image/jpeg';
  return allowedTypes.some((type) => {
    if (type === 'image') {
      return mime.startsWith('image/');
    }
    return mime === type || mime.startsWith(`${type}/`);
  });
}

export default function MediaLibraryModal({
  title = 'Select image',
  allowedTypes,
  multiple = false,
  onClose,
  onSelect,
}) {
  const media = useMediaLibrary();
  const perPage = media?.perPage ?? 20;

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  const fetchImagesPage = useCallback(
    async (nextPage, nextSearch) => {
      if (!media?.listImages) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await media.listImages({
          page: nextPage,
          perPage,
          search: nextSearch,
        });
        const filtered = (result?.items || []).filter((item) =>
          matchesAllowedTypes(item, allowedTypes),
        );
        setItems(filtered);
        setTotal(result?.total ?? filtered.length);
        setTotalPages(result?.totalPages ?? 1);
        setPage(result?.page ?? nextPage);
      } catch (e) {
        setError(e?.message || 'Failed to load images');
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [media, perPage, allowedTypes],
  );

  useEffect(() => {
    fetchImagesPage(1, search);
  }, []);

  function toggleSelect(item) {
    if (multiple) {
      setSelected((prev) => {
        const exists = prev.some((p) => p.id === item.id && p.url === item.url);
        if (exists) {
          return prev.filter((p) => !(p.id === item.id && p.url === item.url));
        }
        return [...prev, item];
      });
    } else {
      setSelected([item]);
    }
  }

  function isSelected(item) {
    return selected.some((p) => p.id === item.id && p.url === item.url);
  }

  async function handleUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !media?.uploadImage) {
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const uploaded = await media.uploadImage(file);
      await fetchImagesPage(page, search);
      if (uploaded) {
        setSelected(multiple ? (prev) => [...prev, uploaded] : [uploaded]);
      }
    } catch (e) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  function handleConfirm() {
    if (!selected.length) {
      return;
    }
    onSelect(normalizeMediaSelection(selected, multiple));
  }

  return (
    <Modal
      className="rbb-media-modal"
      title={title}
      onRequestClose={onClose}
      shouldCloseOnClickOutside
      shouldCloseOnEsc
      size="large"
    >
      <div className="rbb-media-modal__toolbar">
        <TextControl
          label="Search"
          hideLabelFromVision
          placeholder="Search images…"
          value={search}
          onChange={setSearch}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchImagesPage(1, search);
            }
          }}
        />
        <Button variant="secondary" onClick={() => fetchImagesPage(1, search)} disabled={loading}>
          Search
        </Button>
        {media?.uploadImage && (
          <>
            <FormFileUploadButton uploading={uploading} onChange={handleUpload} />
          </>
        )}
      </div>

      {error && <p className="rbb-media-modal__error">{error}</p>}

      <div className="rbb-media-modal__grid-wrap">
        {loading ? (
          <div className="rbb-media-modal__loading">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <p className="rbb-media-modal__empty">No images found.</p>
        ) : (
          <ul className="rbb-media-modal__grid">
            {items.map((item) => (
              <li key={`${item.id}-${item.url}`}>
                <button
                  type="button"
                  className={`rbb-media-modal__thumb${isSelected(item) ? ' is-selected' : ''}`}
                  onClick={() => toggleSelect(item)}
                >
                  <img src={item.url} alt={item.alt || item.title || ''} />
                  {item.title && <span className="rbb-media-modal__caption">{item.title}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rbb-media-modal__footer">
        <span className="rbb-media-modal__pager">
          Page {page} of {totalPages} · {total} total
        </span>
        <div className="rbb-media-modal__pager-actions">
          <Button
            variant="secondary"
            disabled={loading || page <= 1}
            onClick={() => fetchImagesPage(page - 1, search)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            disabled={loading || page >= totalPages}
            onClick={() => fetchImagesPage(page + 1, search)}
          >
            Next
          </Button>
        </div>
        <div className="rbb-media-modal__confirm">
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!selected.length} onClick={handleConfirm}>
            {multiple ? `Insert (${selected.length})` : 'Insert'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function FormFileUploadButton({ uploading, onChange }) {
  return (
    <label className="rbb-media-modal__upload">
      <input type="file" accept="image/*" onChange={onChange} disabled={uploading} hidden />
      <Button variant="secondary" disabled={uploading}>
        {uploading ? 'Uploading…' : 'Upload image'}
      </Button>
    </label>
  );
}
