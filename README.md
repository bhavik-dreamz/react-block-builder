# gutenberg-block-kit

Gutenberg-powered **block editor** and **SSR-safe renderer** for React. Use in **Next.js (App Router)**, **Remix**, or **Vite** — no WordPress install required.

**[Live demo](https://gutenberg-block-kit.vercel.app/)** · Demo source: [`examples/demo/`](examples/demo/)

> **Full documentation** (npm publish, Vercel deploy, Next.js/Remix/Vite, AI agent rules):  
> **[docs/FULL_GUIDE.md](docs/FULL_GUIDE.md)** · Quick reference for Cursor/agents: **[AGENTS.md](AGENTS.md)**

---

## Install

```bash
npm install gutenberg-block-kit react react-dom
```

**Peer dependencies:** `react` and `react-dom` (`^18` or `^19`). Your app must provide a single React instance ([dedupe](#vite--cra) in Vite).

---

## Package exports

| Import path | Use |
|-------------|-----|
| `gutenberg-block-kit` / `gutenberg-block-kit/editor` | `BlockEditor` (client only) |
| `gutenberg-block-kit/renderer` | `BlockRenderer` (SSR / RSC safe) |
| `gutenberg-block-kit/styles` | Editor CSS (required for the editor UI) |
| `gutenberg-block-kit/bootstrap` | Optional; editor entry already runs bootstrap |

```js
import { BlockEditor, initBlocks } from 'gutenberg-block-kit/editor';
import { BlockRenderer, BLOCK_LIBRARY_STYLES } from 'gutenberg-block-kit/renderer';
import 'gutenberg-block-kit/styles';
```

---

## Quick start (any React app)

**1. Editor (client only)**

```jsx
import 'gutenberg-block-kit/styles';
import { BlockEditor } from 'gutenberg-block-kit/editor';

export default function CMSPage() {
  return (
    <BlockEditor
      initialTitle="Home"
      initialContent={savedJsonOrHtml}
      onSave={async ({ id, title, html, json }) => {
        await fetch(`/api/pages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, html, json }),
        });
      }}
      onLoad={async (id) => {
        const res = await fetch(`/api/pages/${id}`);
        return res.ok ? res.json() : null;
      }}
    />
  );
}
```

**2. Public page (server or client)**

```jsx
import { BlockRenderer } from 'gutenberg-block-kit/renderer';
import '@wordpress/block-library/build-style/style.css';

export function PublicPage({ html }) {
  return <BlockRenderer html={html} />;
}
```

- **`html`** — from `serialize(blocks)` when saving in the editor.
- **`json`** — store separately to reopen the page in the editor (`initialContent`).

---

## Required CSS

| Surface | Import |
|---------|--------|
| **Editor** | `import 'gutenberg-block-kit/styles'` |
| **Rendered HTML** | `import '@wordpress/block-library/build-style/style.css'` (or `BLOCK_LIBRARY_STYLES` constant from the renderer entry) |

Do **not** import editor styles on public-only routes — they are large (~500KB).

---

## Next.js (App Router)

**Editor — client component**

```jsx
// app/admin/editor/BlockEditorClient.jsx
'use client';

import 'gutenberg-block-kit/styles';
import { BlockEditor } from 'gutenberg-block-kit/editor';

export default function BlockEditorClient(props) {
  return <BlockEditor {...props} />;
}
```

```jsx
// app/admin/editor/page.jsx
import dynamic from 'next/dynamic';

const BlockEditorClient = dynamic(
  () => import('./BlockEditorClient'),
  { ssr: false },
);

export default function EditorPage() {
  return (
    <BlockEditorClient
      onSave={async (payload) => { /* ... */ }}
      onLoad={async (id) => { /* ... */ }}
    />
  );
}
```

**Public page — server component**

```jsx
// app/pages/[slug]/page.jsx
import { BlockRenderer } from 'gutenberg-block-kit/renderer';
import '@wordpress/block-library/build-style/style.css';

export default async function Page({ params }) {
  const page = await getPage(params.slug);
  return <BlockRenderer html={page.html} className="entry-content" />;
}
```

`next.config.js` (if you hit ESM/CJS issues with WordPress packages):

```js
const nextConfig = {
  transpilePackages: ['gutenberg-block-kit'],
};
export default nextConfig;
```

---

## Remix

**Editor — client route**

```jsx
// app/routes/admin.editor.tsx
import 'gutenberg-block-kit/styles';
import { BlockEditor } from 'gutenberg-block-kit/editor';
import { ClientOnly } from 'remix-utils/client-only'; // or your own guard

export default function AdminEditor() {
  return (
    <ClientOnly fallback={<p>Loading editor…</p>}>
      {() => (
        <BlockEditor
          onSave={savePage}
          onLoad={loadPage}
        />
      )}
    </ClientOnly>
  );
}
```

**Public route — SSR**

```jsx
// app/routes/pages.$slug.tsx
import { BlockRenderer } from 'gutenberg-block-kit/renderer';
import blockLibraryStyles from '@wordpress/block-library/build-style/style.css?url';

export const links = () => [{ rel: 'stylesheet', href: blockLibraryStyles }];

export default function Page() {
  const { page } = useLoaderData();
  return <BlockRenderer html={page.html} />;
}
```

---

## Vite / React Router / Remix

Use the included Vite plugin — **do not** add `@wordpress/*` to `optimizeDeps.include` yourself (those packages live under `gutenberg-block-kit` and Vite cannot resolve them at your app root).

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { gutenbergBlockKitVite } from 'gutenberg-block-kit/vite';

export default defineConfig({
  plugins: [react(), gutenbergBlockKitVite()],
});
```

**Editor route (SSR)** — never top-level `import { BlockEditor } from 'gutenberg-block-kit/editor'` in a route file (React Router evaluates all routes on the server → `document is not defined`). Use `ClientBlockEditor` instead:

```jsx
// app/routes/admin.editor.tsx
import { useEffect } from 'react';
import { ClientBlockEditor } from 'gutenberg-block-kit/editor-client';

export function HydrateFallback() {
  return <p>Loading editor…</p>;
}

export async function clientLoader() {
  return { pageId: 'home' };
}
clientLoader.hydrate = true;

export default function AdminEditor({ loaderData }) {
  useEffect(() => {
    import('gutenberg-block-kit/styles');
  }, []);

  return (
    <ClientBlockEditor
      fallback={<p>Loading editor…</p>}
      initialTitle="Home"
      onSave={async (payload) => { /* … */ }}
      onLoad={async (id) => { /* … */ }}
    />
  );
}
```

**Public route (SSR)** — only the renderer:

```jsx
import { BlockRenderer } from 'gutenberg-block-kit/renderer';
import '@wordpress/block-library/build-style/style.css';

export default function PublicPage({ loaderData }) {
  return <BlockRenderer html={loaderData.page.html} />;
}
```

The plugin resolves `@wordpress/block-library/build-style/style.css` and other `@wordpress/*` imports from the kit's dependencies.

---

## Block registry (custom blocks)

Register **your** blocks without editing the package.

### Option A — `blockRegistry` prop (JSON-shaped blocks)

Same shape as [`src/data/customBlocksConfig.json`](src/data/customBlocksConfig.json):

```jsx
<BlockEditor
  blockRegistry={[
    {
      name: 'myapp/pricing',
      title: 'Pricing',
      category: 'myapp-blocks',
      icon: 'money-alt',
      attributes: {
        price: { type: 'string', default: '$9' },
        accentColor: { type: 'string', default: '#3858e9' },
      },
    },
  ]}
  onSave={onSave}
  onLoad={onLoad}
/>
```

### Option B — `customBlocksConfig` prop (merged at init)

```jsx
<BlockEditor customBlocksConfig={blocksFromApi} onSave={onSave} onLoad={onLoad} />
```

### Option C — `initBlocks()` before mount

```jsx
import { initBlocks, BlockEditor } from 'gutenberg-block-kit/editor';

initBlocks(myBlocks, { customBlocksConfig: moreBlocks });

export default function Editor() {
  return <BlockEditor onSave={onSave} onLoad={onLoad} />;
}
```

**Bundled defaults:** core Gutenberg blocks, package custom blocks (`hero-banner`, `cta-block`, etc.), and entries from `customBlocksConfig.json`. Host blocks are **added** via `blockRegistry` / `customBlocksConfig`; they do not replace bundled blocks.

**Hand-crafted blocks** in the package use `registerBlockType` in `src/blocks/*` — copy that pattern in your app if you need React edit/save components beyond the JSON factory.

---

## `BlockEditor` props

| Prop | Description |
|------|-------------|
| `onSave` | `async ({ id, title, html, json }) => void` |
| `onLoad` | `async (pageId) => page \| null` |
| `onClear` | `async (pageId) => void` (optional) |
| `initialContent` | Block JSON string/array or serialized HTML |
| `initialTitle` | Page title (default `"Home"`) |
| `initialPageId` | Slug/id (default `"home"`) |
| `blockRegistry` | Array of JSON block definitions |
| `customBlocksConfig` | Extra JSON blocks merged at first `initBlocks` |
| `editorSettings` | Partial override of Gutenberg `BlockEditorProvider` settings (merged with defaults) |
| `onViewSite` | Optional callback (demo uses for preview route) |

### Custom media library (images)

Frontend-only apps pass **`media`** callbacks — the editor shows a **Media Library** popup (grid + pagination + upload). Your backend handles storage.

```jsx
<BlockEditor
  media={{
    perPage: 20,
    listImages: async ({ page, perPage, search }) => {
      const res = await fetch(
        `/api/media?page=${page}&perPage=${perPage}&q=${encodeURIComponent(search)}`,
      );
      return res.json();
      // { items: [{ id, url, alt?, title?, mimeType? }], total, page, perPage, totalPages }
    },
    uploadImage: async (file) => {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/media/upload', { method: 'POST', body });
      return res.json(); // { id, url, alt?, title?, mimeType? }
    },
  }}
  onSave={onSave}
  onLoad={onLoad}
/>
```

- **`listImages`** — required for the library button; powers search + pagination.
- **`uploadImage`** — optional; enables Upload in the modal and drag-and-drop file upload in blocks.
- Without `media`, image blocks fall back to **URL-only** (link) input.

See `examples/demo/mediaHandlers.js` for a localStorage demo.

### Override editor settings

```jsx
import 'gutenberg-block-kit/styles';
import {
  BlockEditor,
  EDITOR_SETTINGS,
  mergeEditorSettings,
} from 'gutenberg-block-kit/editor';

const mySettings = mergeEditorSettings(EDITOR_SETTINGS, {
  bodyPlaceholder: 'Start writing…',
  hasFixedToolbar: true,
  colors: [{ name: 'Brand', slug: 'brand', color: '#3858e9' }],
  allowedBlockTypes: ['core/paragraph', 'core/heading', 'core/image'],
});

<BlockEditor editorSettings={mySettings} onSave={onSave} onLoad={onLoad} />

// Or inline partial override:
<BlockEditor
  editorSettings={{ bodyPlaceholder: 'Add content…', imageEditing: true }}
  onSave={onSave}
  onLoad={onLoad}
/>
```

---

## `BlockRenderer` props

| Prop | Default | Description |
|------|---------|-------------|
| `html` | `''` | Serialized block HTML |
| `className` | `entry-content wp-block-post-content` | Wrapper classes |
| `id` | — | Optional wrapper `id` |
| `as` | `'div'` | Wrapper element |

---

## Data format

```json
{
  "id": "home",
  "title": "Home",
  "html": "<!-- wp:paragraph -->...",
  "json": "[{\"name\":\"core/paragraph\", ...}]",
  "updatedAt": "2026-03-04T12:00:00.000Z"
}
```

---

## Develop this repo

```bash
git clone https://github.com/bhavik-dreamz/gutenberg-block-kit.git
cd gutenberg-block-kit
pnpm install
pnpm run dev          # examples/demo → http://localhost:5173
pnpm run build:lib    # npm package → dist/
pnpm run test:exports && pnpm run test:bundle && pnpm run test:boundary
```

### Layout

```
src/                    # Published library
examples/demo/          # Playground (not on npm)
dist/                   # Published build output
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm run dev` | Demo app |
| `pnpm run build` / `build:lib` | Library → `dist/` |
| `pnpm run build:demo` | Demo → `dist-demo/` |
| `pnpm run test:exports` | Verify export map |
| `pnpm run test:bundle` | Renderer isolated from editor |
| `pnpm run test:boundary` | No demo code in `dist/` |

---

## License

MIT · [Bhavik Patel](https://github.com/bhavik-dreamz)
