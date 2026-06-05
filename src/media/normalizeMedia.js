/**
 * Map host media records to the shape Gutenberg blocks expect.
 */
export function normalizeMediaItem(item) {
  if (!item?.url) {
    throw new Error('Media item must include a url');
  }

  const url = item.url;

  return {
    id: item.id ?? url,
    url,
    alt: item.alt ?? '',
    title: item.title ?? '',
    caption: item.caption ?? '',
    mime: item.mimeType ?? item.mime ?? 'image/jpeg',
    type: item.type ?? 'image',
    width: item.width,
    height: item.height,
    sizes: {
      full: {
        url,
        width: item.width,
        height: item.height,
      },
      ...(item.sizes || {}),
    },
  };
}

export function normalizeMediaSelection(items, multiple) {
  const list = Array.isArray(items) ? items : [items];
  const normalized = list.map(normalizeMediaItem);
  return multiple ? normalized : normalized[0];
}
