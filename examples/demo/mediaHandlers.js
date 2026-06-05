/**
 * Demo media library — stores image metadata in localStorage.
 * Replace with your API in a real app (S3, Cloudinary, WordPress REST, etc.).
 */
const LS_KEY = 'rbb_demo_media';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeAll(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items));
}

function seedIfEmpty() {
  const items = readAll();
  if (items.length) {
    return items;
  }
  const seeded = [
    {
      id: 'seed-1',
      url: 'https://picsum.photos/seed/rbb1/800/600',
      title: 'Sample 1',
      alt: 'Sample landscape',
      mimeType: 'image/jpeg',
    },
    {
      id: 'seed-2',
      url: 'https://picsum.photos/seed/rbb2/800/600',
      title: 'Sample 2',
      alt: 'Sample landscape',
      mimeType: 'image/jpeg',
    },
  ];
  writeAll(seeded);
  return seeded;
}

export const demoMediaHandlers = {
  perPage: 12,

  async listImages({ page = 1, perPage = 12, search = '' }) {
    let items = seedIfEmpty();
    const q = search.trim().toLowerCase();
    if (q) {
      items = items.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(q) ||
          (item.alt || '').toLowerCase().includes(q),
      );
    }
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / perPage));
    const start = (page - 1) * perPage;
    return {
      items: items.slice(start, start + perPage),
      total,
      page,
      perPage,
      totalPages,
    };
  },

  async uploadImage(file) {
    const objectUrl = URL.createObjectURL(file);
    const item = {
      id: `local-${Date.now()}`,
      url: objectUrl,
      title: file.name,
      alt: file.name,
      mimeType: file.type || 'image/jpeg',
    };
    const items = readAll();
    items.unshift(item);
    writeAll(items);
    return item;
  },
};
