import React, { useCallback, useEffect, useRef, useState } from 'react';
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

function fileMatchesAllowedTypes(file, allowedTypes) {
  if (!allowedTypes?.length) {
    return file.type.startsWith('image/');
  }
  const mime = file.type || '';
  return allowedTypes.some((type) => {
    if (type === 'image') {
      return mime.startsWith('image/');
    }
    return mime === type || mime.startsWith(`${type}/`);
  });
}

function acceptAttr(allowedTypes) {
  if (!allowedTypes?.length) {
    return 'image/*';
  }
  return allowedTypes
    .map((type) => (type.includes('/') ? type : `${type}/*`))
    .join(',');
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
  const [uploadProgress, setUploadProgress] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [activeTab, setActiveTab] = useState('library');

  const fileInputRef = useRef(null);
  const dragDepth = useRef(0);

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

  const uploadFiles = useCallback(
    async (fileList) => {
      if (!media?.uploadImage) {
        return;
      }
      const all = Array.from(fileList || []);
      const valid = all.filter((file) => fileMatchesAllowedTypes(file, allowedTypes));
      if (!valid.length) {
        if (all.length) {
          setError('No supported files in selection.');
        }
        return;
      }
      const files = multiple ? valid : valid.slice(0, 1);

      setUploading(true);
      setError(null);

      const uploadedItems = [];
      try {
        for (let i = 0; i < files.length; i += 1) {
          setUploadProgress({ current: i + 1, total: files.length });
          const uploaded = await media.uploadImage(files[i]);
          if (uploaded) {
            uploadedItems.push(uploaded);
          }
        }
        await fetchImagesPage(1, '');
        setSearch('');
        if (uploadedItems.length) {
          setSelected((prev) =>
            multiple ? [...prev, ...uploadedItems] : [uploadedItems[uploadedItems.length - 1]],
          );
          setActiveTab('library');
        }
      } catch (e) {
        setError(e?.message || 'Upload failed');
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [media, allowedTypes, multiple, fetchImagesPage],
  );

  function handleInputChange(event) {
    const { files } = event.target;
    event.target.value = '';
    uploadFiles(files);
  }

  function handleDragEnter(event) {
    event.preventDefault();
    if (!media?.uploadImage || uploading) {
      return;
    }
    dragDepth.current += 1;
    setDragActive(true);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDragLeave(event) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) {
      setDragActive(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragActive(false);
    if (!media?.uploadImage || uploading) {
      return;
    }
    uploadFiles(event.dataTransfer?.files);
  }

  function handleConfirm() {
    if (!selected.length) {
      return;
    }
    onSelect(normalizeMediaSelection(selected, multiple));
  }

  const canUpload = Boolean(media?.uploadImage);

  const showUploadTab = canUpload && activeTab === 'upload';

  return (
    <Modal
      className="rbb-media-modal"
      title={title}
      onRequestClose={onClose}
      shouldCloseOnClickOutside
      shouldCloseOnEsc
      size="large"
    >
      {canUpload && (
        <input
          ref={fileInputRef}
          type="file"
          className="rbb-media-modal__file-input"
          accept={acceptAttr(allowedTypes)}
          multiple={multiple}
          onChange={handleInputChange}
          disabled={uploading}
        />
      )}

      {canUpload && (
        <div className="rbb-media-modal__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'library'}
            className={`rbb-media-modal__tab${activeTab === 'library' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            Media library
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'upload'}
            className={`rbb-media-modal__tab${activeTab === 'upload' ? ' is-active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload files
          </button>
        </div>
      )}

      {error && <p className="rbb-media-modal__error">{error}</p>}

      {showUploadTab ? (
        <div
          className={`rbb-media-modal__upload-pane${dragActive ? ' is-drag-active' : ''}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !uploading) {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="rbb-media-modal__upload-inner">
            {uploading ? (
              <>
                <Spinner />
                <p className="rbb-media-modal__upload-title">
                  {uploadProgress && uploadProgress.total > 1
                    ? `Uploading ${uploadProgress.current} of ${uploadProgress.total}…`
                    : 'Uploading…'}
                </p>
              </>
            ) : (
              <>
                <span className="rbb-media-modal__upload-icon" aria-hidden>⬆</span>
                <p className="rbb-media-modal__upload-title">
                  Drag &amp; drop {multiple ? 'images' : 'an image'} here
                </p>
                <p className="rbb-media-modal__upload-hint">or click to browse your device</p>
                <Button variant="primary">
                  {multiple ? 'Select images' : 'Select image'}
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
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
          </div>

          <div
            className={`rbb-media-modal__grid-wrap${dragActive ? ' is-drag-active' : ''}`}
            onDragEnter={canUpload ? handleDragEnter : undefined}
            onDragOver={canUpload ? handleDragOver : undefined}
            onDragLeave={canUpload ? handleDragLeave : undefined}
            onDrop={canUpload ? handleDrop : undefined}
          >
            {canUpload && dragActive && (
              <div className="rbb-media-modal__dropzone">
                <span>Drop {multiple ? 'images' : 'an image'} to upload</span>
              </div>
            )}
            {loading ? (
              <div className="rbb-media-modal__loading">
                <Spinner />
              </div>
            ) : items.length === 0 ? (
              <div className="rbb-media-modal__empty">
                <p>No images found.</p>
                {canUpload && (
                  <Button variant="secondary" onClick={() => setActiveTab('upload')}>
                    Upload from your device
                  </Button>
                )}
              </div>
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
                      {isSelected(item) && <span className="rbb-media-modal__check" aria-hidden>✓</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      <div className="rbb-media-modal__footer">
        {!showUploadTab ? (
          <>
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
          </>
        ) : (
          <span className="rbb-media-modal__pager">
            {selected.length ? `${selected.length} selected` : ''}
          </span>
        )}
       
        <div className="rbb-media-modal__confirm">
          {/* <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button> */}
         
            <Button variant="primary" disabled={!selected.length} onClick={handleConfirm}>
              {multiple ? `Insert (${selected.length})` : 'Insert'}
            </Button>
          
        </div>
       
      </div>
    </Modal>
  );
}
