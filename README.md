# react-block-builder

Gutenberg-powered **block editor** and **SSR-safe renderer** for React. Use in **Next.js (App Router)**, **Remix**, or **Vite** — no WordPress install required.

**[Live demo](https://react-block-builder.vercel.app/)** · Demo source: [`examples/demo/`](examples/demo/)

> **Full documentation** (npm publish, Vercel deploy, Next.js/Remix/Vite, AI agent rules):  
> **[docs/FULL_GUIDE.md](docs/FULL_GUIDE.md)** · Quick reference for Cursor/agents: **[AGENTS.md](AGENTS.md)**

---

## Install

```bash
npm install react-block-builder react react-dom
```

**Peer dependencies:** `react` and `react-dom` (`^18` or `^19`). Your app must provide a single React instance ([dedupe](#vite--cra) in Vite).

---

## Package exports

| Import path | Use |
|-------------|-----|
| `react-block-builder` / `react-block-builder/editor` | `BlockEditor` (client only) |
| `react-block-builder/renderer` | `BlockRenderer` (SSR / RSC safe) |
| `react-block-builder/styles` | Editor CSS (required for the editor UI) |
| `react-block-builder/bootstrap` | Optional; editor entry already runs bootstrap |

```js
import { BlockEditor, initBlocks } from 'react-block-builder/editor';
import { BlockRenderer, BLOCK_LIBRARY_STYLES } from 'react-block-builder/renderer';
import 'react-block-builder/styles';
```

---

## Quick start (any React app)

**1. Editor (client only)**

```jsx
import 'react-block-builder/styles';
import { BlockEditor } from 'react-block-builder/editor';

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
import { BlockRenderer } from 'react-block-builder/renderer';
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
| **Editor** | `import 'react-block-builder/styles'` |
| **Rendered HTML** | `import '@wordpress/block-library/build-style/style.css'` (or `BLOCK_LIBRARY_STYLES` constant from the renderer entry) |

Do **not** import editor styles on public-only routes — they are large (~500KB).

---

## Next.js (App Router)

**Editor — client component**

```jsx
// app/admin/editor/BlockEditorClient.jsx
'use client';

import 'react-block-builder/styles';
import { BlockEditor } from 'react-block-builder/editor';

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
import { BlockRenderer } from 'react-block-builder/renderer';
import '@wordpress/block-library/build-style/style.css';

export default async function Page({ params }) {
  const page = await getPage(params.slug);
  return <BlockRenderer html={page.html} className="entry-content" />;
}
```

`next.config.js` (if you hit ESM/CJS issues with WordPress packages):

```js
const nextConfig = {
  transpilePackages: ['react-block-builder'],
};
export default nextConfig;
```

---

## Remix

**Editor — client route**

```jsx
// app/routes/admin.editor.tsx
import 'react-block-builder/styles';
import { BlockEditor } from 'react-block-builder/editor';
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
import { BlockRenderer } from 'react-block-builder/renderer';
import blockLibraryStyles from '@wordpress/block-library/build-style/style.css?url';

export const links = () => [{ rel: 'stylesheet', href: blockLibraryStyles }];

export default function Page() {
  const { page } = useLoaderData();
  return <BlockRenderer html={page.html} />;
}
```

---

## Vite / CRA

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', '@wordpress/element'],
  },
  optimizeDeps: {
    include: [
      '@wordpress/block-editor',
      '@wordpress/blocks',
      '@wordpress/components',
      '@wordpress/block-library',
    ],
  },
});
```

Use the same imports as [Quick start](#quick-start-any-react-app). For Create React App, you may need `react-app-rewired` or migrate to Vite for WordPress package resolution.

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
import { initBlocks, BlockEditor } from 'react-block-builder/editor';

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
| `onViewSite` | Optional callback (demo uses for preview route) |

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
git clone https://github.com/bhavik-dreamz/react-block-builder.git
cd react-block-builder
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
