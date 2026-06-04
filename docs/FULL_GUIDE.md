# react-block-builder — Complete Guide

**Audience:** Developers integrating the package, and **AI coding agents** maintaining this repo.

**Repository:** [github.com/bhavik-dreamz/react-block-builder](https://github.com/bhavik-dreamz/react-block-builder)

---

## Table of contents

1. [What this project is](#1-what-this-project-is)
2. [Architecture (for AI agents)](#2-architecture-for-ai-agents)
3. [Repository layout](#3-repository-layout)
4. [Package exports](#4-package-exports)
5. [Build the npm library](#5-build-the-npm-library)
6. [Publish to npm](#6-publish-to-npm)
7. [Run the demo locally](#7-run-the-demo-locally)
8. [Deploy demo to Vercel](#8-deploy-demo-to-vercel)
9. [Use in a consumer app](#9-use-in-a-consumer-app)
10. [Next.js (App Router)](#10-nextjs-app-router)
11. [Remix](#11-remix)
12. [Vite / Create React App](#12-vite--create-react-app)
13. [Custom blocks registry](#13-custom-blocks-registry)
14. [Persistence API (onSave / onLoad)](#14-persistence-api-onsave--onload)
15. [CSS requirements](#15-css-requirements)
16. [Testing before release](#16-testing-before-release)
17. [Rules for AI agents](#17-rules-for-ai-agents)
18. [Troubleshooting](#18-troubleshooting)

---

## 1. What this project is

`react-block-builder` is a **publishable npm library** (JavaScript, not TypeScript) that wraps WordPress Gutenberg (`@wordpress/block-editor`) for use in any React app.

| Piece | Role | Runs on server? |
|-------|------|-----------------|
| **BlockEditor** | Visual Gutenberg editor | **No** — client only |
| **BlockRenderer** | Renders saved HTML | **Yes** — SSR / RSC safe |
| **styles** | Editor UI CSS (~500KB) | Import on editor routes only |
| **bootstrap** | Sets `window.React` for Gutenberg | Browser only (no-op in Node) |

The **demo** (`examples/demo/`) is a separate playground app. It is **not** published to npm.

---

## 2. Architecture (for AI agents)

### Hard boundaries

```
PUBLISHED (dist/ + src/ library code)
├── src/editor.js          → BlockEditor entry (imports bootstrap + App)
├── src/renderer.js        → BlockRenderer only (~1.5KB built)
├── src/bootstrap.js       → window.React guard
├── src/styles.js          → CSS side-effect imports → dist/styles.css
├── src/App.jsx            → Main editor UI
├── src/registerBlocks.jsx → initBlocks(), block registry
└── src/blocks/*           → Custom Gutenberg blocks

NOT PUBLISHED
└── examples/demo/         → main.jsx, api.js, Supabase, FrontendPage
```

### Do not

- Put `localStorage`, Supabase, or `savePage` in `src/` library code.
- Import `react-block-builder/editor` in Server Components or Node SSR.
- Bundle `react` / `react-dom` inside the library (they are **peerDependencies**).
- Add `next/*`, `@remix-run/*`, or framework-specific imports to `src/`.
- Export `api.js` or demo files from `package.json` `exports`.

### Do

- Keep persistence via **props**: `onSave`, `onLoad`, `onClear`.
- Register host blocks via `blockRegistry`, `customBlocksConfig`, or `initBlocks()`.
- Use **subpath imports**: `/editor` vs `/renderer` for bundle splitting.
- Run `pnpm run test:bundle` and `pnpm run test:boundary` before publishing.

### Build pipeline

```
pnpm run build:lib
  ├── vite.lib.config.js  → dist/*.mjs, dist/*.cjs (ESM + CJS)
  └── scripts/build-styles.mjs → dist/styles.css

pnpm run build:demo
  ├── build:lib (required first)
  └── vite.config.js (root: examples/demo) → dist-demo/
```

---

## 3. Repository layout

```
react-block-builder/
├── src/                      # Library source (published via dist/)
│   ├── App.jsx               # BlockEditor component
│   ├── editor.js             # Package entry: editor
│   ├── index.js              # Default entry (= editor)
│   ├── renderer.jsx          # BlockRenderer component
│   ├── renderer.js           # Package entry: renderer
│   ├── bootstrap.js          # Gutenberg React shim
│   ├── styles.js             # Editor CSS entry
│   ├── registerBlocks.jsx    # initBlocks + JSON factory
│   ├── context/EditorContext.jsx
│   ├── blocks/               # Hand-crafted blocks
│   └── data/
│       ├── customBlocksConfig.json
│       └── blockTemplates.js
├── examples/
│   ├── demo/                 # Local + Vercel demo app
│   │   ├── main.jsx
│   │   ├── FrontendPage.jsx
│   │   ├── api.js            # localStorage + optional Supabase
│   │   └── index.html
│   ├── smoke-*.mjs             # CI-style checks
│   └── verify-*.mjs
├── scripts/build-styles.mjs    # Aggregates CSS → dist/styles.css
├── vite.lib.config.js          # Library build
├── vite.config.js              # Demo dev/build
├── dist/                       # npm publish output (gitignored)
├── dist-demo/                  # Vercel demo output (gitignored)
├── package.json
├── README.md                   # Short user readme
├── AGENTS.md                   # AI agent quick reference
└── docs/FULL_GUIDE.md          # This file
```

---

## 4. Package exports

| Subpath | File | Purpose |
|---------|------|---------|
| `react-block-builder` | `dist/editor.mjs` | Default = editor |
| `react-block-builder/editor` | `dist/editor.mjs` | BlockEditor, initBlocks, EditorProvider |
| `react-block-builder/renderer` | `dist/renderer.mjs` | BlockRenderer only |
| `react-block-builder/styles` | `dist/styles.css` | Editor styles |
| `react-block-builder/bootstrap` | `dist/bootstrap.mjs` | Optional (editor already imports it) |

**Important:** `BlockRenderer` is **not** on the root export. Use `react-block-builder/renderer`.

---

## 5. Build the npm library

### Prerequisites

- Node.js **>= 22** (see `package.json` `engines`)
- pnpm (recommended) or npm

### Commands

```bash
cd react-block-builder
pnpm install

# Build library → dist/
pnpm run build:lib

# Or alias:
pnpm run build
```

### Output in `dist/`

| Artifact | Description |
|----------|-------------|
| `editor.mjs` / `editor.cjs` | Editor entry stub |
| `editor-*.mjs` / `editor-*.js` | Editor chunk (~8MB — Gutenberg) |
| `renderer.mjs` / `renderer.cjs` | Renderer (~1.5KB, no block-editor) |
| `bootstrap.mjs` / `bootstrap.cjs` | Bootstrap |
| `styles.css` | All editor styles concatenated |

Only `dist/` is published (`package.json` → `"files": ["dist"]`).

---

## 6. Publish to npm

### One-time setup

1. Create account: [npmjs.com](https://www.npmjs.com/signup)
2. Login locally:
   ```bash
   npm login
   ```
3. Check package name is free:
   ```bash
   npm view react-block-builder
   ```
   If taken, change `"name"` in `package.json` (e.g. `@your-scope/react-block-builder`).

### Pre-publish checklist

```bash
pnpm run build:lib
pnpm run test:exports
pnpm run test:bundle      # renderer must not include block-editor
pnpm run test:boundary    # dist must not contain demo/supabase code
pnpm run test:ssr
```

### Version bump

```bash
# patch | minor | major
npm version patch
```

### Publish

```bash
# Dry run (see what files will upload)
npm pack --dry-run

# Publish (first time for scoped packages: --access public)
npm publish
# or
npm publish --access public   # if name is @scope/react-block-builder
```

### After publish — install in any app

```bash
npm install react-block-builder react react-dom
```

### Link locally without publishing (development)

```bash
# In react-block-builder repo
pnpm run build:lib
npm link

# In your Next.js / Vite app
npm link react-block-builder
```

---

## 7. Run the demo locally

The demo lives in **`examples/demo/`**. It uses the library via Vite aliases (dev → `src/`, production build → `dist/`).

### Start dev server

```bash
cd react-block-builder
pnpm install
pnpm run dev
```

Open **http://localhost:5173**

### What the demo does

- Imports `BlockEditor` from `react-block-builder/editor`
- Imports `react-block-builder/styles`
- Saves pages via `examples/demo/api.js` (localStorage + optional Supabase)
- “View site” uses `FrontendPage` + `BlockRenderer`

### Optional Supabase (demo only)

Create `.env` at **repo root**:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If unset, demo still works with **localStorage only**.

### Build & preview demo production bundle

```bash
pnpm run build:demo    # dist-demo/
pnpm run preview:demo  # serve dist-demo
```

---

## 8. Deploy demo to Vercel

### Option A — Vercel dashboard (GitHub)

1. Push repo to GitHub.
2. [vercel.com/new](https://vercel.com/new) → Import repository.
3. Configure:

   | Setting | Value |
   |---------|--------|
   | **Framework Preset** | Other |
   | **Root Directory** | `.` (repo root) |
   | **Build Command** | `pnpm run build:demo` |
   | **Output Directory** | `dist-demo` |
   | **Install Command** | `pnpm install` |

4. Environment variables (optional): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
5. Deploy.

### Option B — `vercel.json` (included in repo)

Root `vercel.json`:

```json
{
  "buildCommand": "pnpm run build:demo",
  "outputDirectory": "dist-demo",
  "installCommand": "pnpm install"
}
```

CLI:

```bash
npm i -g vercel
vercel
vercel --prod
```

### Notes

- Demo deploy uses **`build:demo`**, not `build:lib` alone.
- Library publish to npm is **independent** of Vercel demo.
- `dist/` and `dist-demo/` are gitignored; Vercel builds them on deploy.

---

## 9. Use in a consumer app

### Minimal editor page

```jsx
import 'react-block-builder/styles';
import { BlockEditor } from 'react-block-builder/editor';

export default function AdminEditor() {
  return (
    <BlockEditor
      initialTitle="Home"
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

### Minimal public page

```jsx
import { BlockRenderer } from 'react-block-builder/renderer';
import '@wordpress/block-library/build-style/style.css';

export function PublicPage({ html }) {
  return <BlockRenderer html={html} />;
}
```

### Saved data shape

```json
{
  "id": "home",
  "title": "Home",
  "html": "<!-- wp:paragraph -->...",
  "json": "[{\"name\":\"core/paragraph\",...}]",
  "updatedAt": "2026-03-04T12:00:00.000Z"
}
```

- **`html`** → pass to `BlockRenderer`
- **`json`** → pass to `BlockEditor` as `initialContent` to reopen in editor

---

## 10. Next.js (App Router)

### Project setup

```bash
npx create-next-app@latest my-site
cd my-site
npm install react-block-builder
```

`next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['react-block-builder'],
};

module.exports = nextConfig;
```

### Editor route (client only)

`app/admin/editor/BlockEditorClient.jsx`:

```jsx
'use client';

import 'react-block-builder/styles';
import { BlockEditor } from 'react-block-builder/editor';

export default function BlockEditorClient({ pageId, initial }) {
  return (
    <BlockEditor
      initialPageId={pageId}
      initialTitle={initial?.title ?? 'Untitled'}
      initialContent={initial?.json ?? initial?.html}
      onSave={async (payload) => {
        await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
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

`app/admin/editor/page.jsx`:

```jsx
import dynamic from 'next/dynamic';

const BlockEditorClient = dynamic(
  () => import('./BlockEditorClient'),
  { ssr: false, loading: () => <p>Loading editor…</p> },
);

export default function EditorPage() {
  return <BlockEditorClient pageId="home" />;
}
```

### Public page (Server Component)

`app/(site)/[slug]/page.jsx`:

```jsx
import { BlockRenderer } from 'react-block-builder/renderer';
import '@wordpress/block-library/build-style/style.css';

async function getPage(slug) {
  const res = await fetch(`${process.env.API_URL}/pages/${slug}`, {
    cache: 'no-store',
  });
  return res.json();
}

export default async function Page({ params }) {
  const page = await getPage(params.slug);
  return (
    <article>
      <h1>{page.title}</h1>
      <BlockRenderer html={page.html} />
    </article>
  );
}
```

### API route example (save)

`app/api/pages/route.js`:

```js
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const file = path.join(process.cwd(), 'data/pages.json');

export async function POST(request) {
  const body = await request.json();
  let pages = {};
  try {
    pages = JSON.parse(await readFile(file, 'utf8'));
  } catch {}
  pages[body.id] = { ...body, updatedAt: new Date().toISOString() };
  await writeFile(file, JSON.stringify(pages, null, 2));
  return Response.json(pages[body.id]);
}
```

---

## 11. Remix

`app/routes/admin.editor.tsx` — client-only editor:

```tsx
import type { MetaFunction } from '@remix-run/node';
import 'react-block-builder/styles';
import { BlockEditor } from 'react-block-builder/editor';
import { useFetcher } from '@remix-run/react';

export const meta: MetaFunction = () => [{ title: 'Editor' }];

export default function AdminEditor() {
  const fetcher = useFetcher();

  return (
    <BlockEditor
      onSave={(data) => {
        fetcher.submit(data, { method: 'post', action: '/api/pages' });
      }}
      onLoad={async (id) => {
        const res = await fetch(`/api/pages/${id}`);
        return res.ok ? res.json() : null;
      }}
    />
  );
}
```

Use `ClientOnly` from `remix-utils` if hydration issues occur.

Public route — `BlockRenderer` in loader + component (SSR safe).

---

## 12. Vite / Create React App

### Vite

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', '@wordpress/element'],
  },
  optimizeDeps: {
    include: [
      '@wordpress/block-editor',
      '@wordpress/blocks',
      '@wordpress/components',
      '@wordpress/block-library',
      '@wordpress/data',
      '@wordpress/element',
    ],
  },
});
```

Use the same imports as in [section 9](#9-use-in-a-consumer-app).

### Create React App

CRA is harder with modern `@wordpress/*` ESM packages. **Prefer Vite or Next.js.** If you must use CRA, try `react-app-rewired` + `customize-cra` to add aliases and transpilation.

---

## 13. Custom blocks registry

### JSON blocks via `blockRegistry`

```jsx
<BlockEditor
  blockRegistry={[
    {
      name: 'myapp/feature',
      title: 'Feature',
      category: 'myapp-blocks',
      icon: 'star-filled',
      attributes: {
        heading: { type: 'string', default: 'Hello' },
        accentColor: { type: 'string', default: '#3858e9' },
      },
    },
  ]}
/>
```

### Extra JSON via `customBlocksConfig`

```jsx
<BlockEditor customBlocksConfig={blocksFromYourApi} />
```

### Imperative

```js
import { initBlocks, BlockEditor } from 'react-block-builder/editor';

initBlocks(myBlocks, { customBlocksConfig: moreBlocks });
```

Bundled package blocks (in `src/blocks/`) and `customBlocksConfig.json` always register on first init unless you fork the package.

---

## 14. Persistence API (onSave / onLoad)

The library **does not** ship storage. You implement:

| Prop | Signature | Purpose |
|------|-----------|---------|
| `onSave` | `async ({ id, title, html, json }) => void` | Persist serialized output |
| `onLoad` | `async (pageId) => object \| null` | Restore page |
| `onClear` | `async (pageId) => void` | Optional reset |

Reference implementation: `examples/demo/api.js` (copy patterns, do not import from demo in apps).

---

## 15. CSS requirements

| Surface | Import |
|---------|--------|
| Editor routes | `import 'react-block-builder/styles'` |
| Public / SSR pages | `import '@wordpress/block-library/build-style/style.css'` |

Never import editor styles on public-only routes (large bundle).

---

## 16. Testing before release

```bash
pnpm run test:exports    # export map + styles.css
pnpm run test:bundle     # renderer isolated from editor
pnpm run test:boundary   # no demo/supabase in dist/
pnpm run test:ssr        # bootstrap + renderer in Node
```

---

## 17. Rules for AI agents

When editing this repository:

1. **Library vs demo** — Business logic for saving pages belongs in `examples/demo/`, not `src/`.
2. **Peer deps** — Never add `react` to `dependencies`; only `peerDependencies` + `devDependencies`.
3. **Exports** — Any new public API needs `src/*.js` entry + `vite.lib.config.js` entry + `package.json` `exports`.
4. **SSR** — No top-level `window`/`document`/`localStorage` in `src/` (use `typeof window !== 'undefined'`).
5. **Renderer isolation** — `src/renderer.jsx` must not import `@wordpress/block-editor` or `registerBlocks.jsx`.
6. **Build** — `pnpm run build:lib` before `npm publish`; run all `test:*` scripts.
7. **No TypeScript** — Project is JavaScript unless user explicitly requests TS.
8. **No framework imports** in `src/` — no `next/*`, `@remix-run/*`.
9. **Preserve APIs** — `BlockEditor`, `onSave`, `onLoad`, `blockRegistry`, `initBlocks` are the integration contract.
10. **Docs** — Update `README.md` and this file when changing exports or workflow.

---

## 18. Troubleshooting

| Problem | Cause | Fix |
|---------|--------|-----|
| Invalid hook call / two Reacts | Duplicate React | `react`/`react-dom` as peers; dedupe in Vite; one React version in app |
| `window is not defined` | Editor imported on server | `dynamic(..., { ssr: false })` or `'use client'` |
| `document is not defined` | Editor chunk loaded in Node | Import only `react-block-builder/renderer` on server |
| Blocks unstyled on frontend | Missing block library CSS | Import `@wordpress/block-library/build-style/style.css` |
| Editor UI broken / unstyled | Missing editor CSS | `import 'react-block-builder/styles'` |
| Huge bundle on public page | Editor CSS/JS on wrong route | Split routes; use `/renderer` only |
| `npm publish` missing files | Forgot build | Run `pnpm run build:lib` first |
| Vercel 404 on demo | Wrong output dir | Output must be `dist-demo`, build `pnpm run build:demo` |
| Supabase errors in demo | Missing env | Add `.env` or ignore (localStorage still works) |

---

## Quick command reference

```bash
pnpm install
pnpm run dev              # Demo @ localhost:5173
pnpm run build:lib        # npm package → dist/
pnpm run build:demo       # Vercel/static demo → dist-demo/
pnpm run test:exports
pnpm run test:bundle
pnpm run test:boundary
npm version patch && npm publish
```

---

*Last updated: portability refactor (Steps 1–8).*
