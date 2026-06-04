# React Block Builder — Project Documentation

> **For AI agents:** Read this file first before making any changes. It covers architecture, data flow, routing, API layer, and Supabase schema.

---

## Overview

A standalone Gutenberg-powered page builder built with **React + Vite**. Users compose pages visually using WordPress blocks, save them to **Supabase** via **Vercel serverless API routes**, and preview the rendered frontend output.

**Live stack:**
- Frontend: React 19 + Vite
- Block editor: `@wordpress/block-editor` (Gutenberg)
- Backend: Vercel serverless functions (`/api` folder)
- Database: Supabase (PostgreSQL)
- Deployed on: Vercel

---

## Project Structure

```
react-block-builder/
├── api/                          ← Vercel serverless API routes (Node.js, server-side)
│   ├── posts.js                  → GET /api/posts  (list all pages)
│   │                             → POST /api/posts (create or update a page)
│   └── posts/
│       └── [id].js               → GET /api/posts/:slug  (load one page)
│                                 → DELETE /api/posts/:slug (delete a page)
│
├── src/
│   ├── main.jsx                  ← App entry point — mounts RouterProvider + Root
│   ├── App.jsx                   ← Block editor wrapper (EditorProvider + EditorApp)
│   ├── FrontendPage.jsx          ← Legacy viewer (replaced by pages/PageViewer.jsx)
│   │
│   ├── router/
│   │   └── RouterContext.jsx     ← Client-side router (no react-router, pure state)
│   │
│   ├── pages/
│   │   ├── PageList.jsx          ← Default view: table of all saved pages
│   │   └── PageViewer.jsx        ← Clean frontend view of a single page
│   │
│   ├── components/
│   │   ├── Header.jsx            ← Editor top bar (save, preview, back to pages)
│   │   ├── LeftToolbarButtonSet.jsx ← Undo/Redo/Templates/ListView buttons
│   │   ├── OptionsMenu.jsx       ← Fullscreen / spotlight / code mode menu
│   │   ├── TemplatePicker.jsx    ← Template panel (insert block templates)
│   │   └── Icons.jsx             ← SVG icon components
│   │
│   ├── context/
│   │   └── EditorContext.jsx     ← All editor state (blocks, history, save, preview)
│   │
│   ├── data/
│   │   ├── api.js                ← Frontend data layer (fetch → /api/posts)
│   │   ├── blockTemplates.js     ← Predefined block layout templates
│   │   └── customBlocksConfig.json ← Config for custom blocks
│   │
│   ├── blocks/                   ← Custom Gutenberg blocks
│   │   ├── cta-block/
│   │   ├── hero-banner/
│   │   ├── card-grid/
│   │   ├── image-text/
│   │   ├── extendBlocks.js       ← Extends core blocks with extra attributes
│   │   └── paragraphFormats.jsx  ← Custom inline rich-text formats
│   │
│   ├── config/
│   │   └── editorSettings.js     ← Gutenberg editor settings object
│   │
│   ├── lib/
│   │   └── supabaseClient.js     ← Supabase client (VITE_ env vars, browser only)
│   │
│   ├── bootstrap.js              ← MUST be imported first — fixes WP block registry
│   ├── registerBlocks.jsx        ← Registers all custom + core blocks
│   ├── index.css                 ← All styles (editor + PageList + PageViewer)
│   └── images/                   ← Logo and block icons
│
├── vercel.json                   ← SPA rewrite (excludes /api/* from catch-all)
├── vite.config.js                ← Vite config + proxy /api → localhost:3000
└── .env                          ← Local env vars (VITE_ prefix for browser use)
```

---

## Routing

**File:** `src/router/RouterContext.jsx`

Simple state-based router — **no react-router**. Three routes:

| Route name | Params | Shows |
|---|---|---|
| `list` | — | `PageList.jsx` (default on load) |
| `editor` | `{ pageId, pageTitle, isNew? }` | `App.jsx` (block editor) |
| `viewer` | `{ pageId }` | `PageViewer.jsx` (frontend preview) |

```js
// Navigate programmatically:
const { navigate } = useRouter();
navigate('editor', { pageId: 'home', pageTitle: 'Home' });
navigate('viewer', { pageId: 'home' });
navigate('list');
```

---

## Editor State

**File:** `src/context/EditorContext.jsx`

All editor state lives here. Key props accepted by `EditorProvider`:

| Prop | Type | Purpose |
|---|---|---|
| `pageId` | string | Slug of the page being edited |
| `initialTitle` | string | Starting title for the page title input |
| `onNavigate` | function | Router navigate fn — enables "← Pages" and "View Page" |
| `onViewSite` | function | Legacy: opens viewer (used when onNavigate not available) |

Key state exported via `useEditor()`:

```js
const {
  blocks, setBlocks,       // current block array
  pageTitle, setPageTitle, // editable title
  pageId,                  // slug
  handleSave,              // saves to /api/posts
  handleClear,             // clears canvas
  handleUndo, handleRedo,  // history
  preview, setPreview,     // toggle frontend preview mode
  editorMode, setEditorMode, // 'visual' | 'code'
  fullscreen, spotlightMode, distractionFree,
  templatePickerOpen, setTemplatePickerOpen,
  listViewOpen, setListViewOpen,
} = useEditor();
```

---

## Data Layer

**File:** `src/data/api.js`

All four functions auto-detect whether the API is reachable:
- **`vercel dev` or deployed** → calls `/api/posts` serverless routes
- **plain `vite dev`** → silently falls back to **localStorage**

```js
import { savePage, loadPage, listPages, deletePage, generatePageId } from './data/api';

// Save / update a page
await savePage(id, title, html, json);

// Load a single page → returns { id, title, html, json, updatedAt } or null
await loadPage(id);

// List all pages → returns array sorted newest first
await listPages();

// Delete a page
await deletePage(id);

// Generate a new unique page ID (slug)
const id = generatePageId(); // → "page-1717491234-abc12"
```

**Page object shape** (used everywhere):
```js
{
  id: 'home',                    // slug — used as DB lookup key
  title: 'Home Page',
  html: '<!-- wp:paragraph -->…', // serialized Gutenberg HTML
  json: '[{"name":"core/paragraph",…}]', // raw blocks JSON string
  updatedAt: '2025-06-04T10:00:00.000Z',
}
```

---

## API Routes (Vercel Serverless)

**All Supabase access happens server-side in `/api/*.js` — never in the browser.**

### `GET /api/posts`
Returns array of all pages, sorted newest first.

### `POST /api/posts`
Create or update (upsert) a page.
```json
// Request body:
{ "id": "home", "title": "Home", "html": "...", "json": "..." }
```

### `GET /api/posts/:id`
Load a single page by slug. Returns 404 if not found.

### `DELETE /api/posts/:id`
Delete a page by slug. Returns `{ ok: true, deleted: [...] }` or 404.

---

## Supabase

### Table: `posts`

```sql
create table posts (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  slug       text unique not null,   -- used as the page "id" in the frontend
  content    text,                   -- serialized Gutenberg HTML
  json       text,                   -- raw blocks JSON string
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

> ⚠️ The frontend uses `slug` as the page identifier — **not** `id` (uuid). All API queries use `.eq('slug', value)`.

### RLS (Row Level Security)

If RLS is enabled on the `posts` table, you must add policies for all operations. For dev/private use:

```sql
-- Allow all operations (disable effective RLS for this table):
create policy "allow all" on posts for all using (true) with check (true);
```

Or per-operation:
```sql
create policy "allow select" on posts for select using (true);
create policy "allow insert" on posts for insert with check (true);
create policy "allow update" on posts for update using (true);
create policy "allow delete" on posts for delete using (true);
```

> **Common bug:** DELETE/UPDATE silently affects 0 rows when RLS is on but no DELETE policy exists. The API will return a 404 "No row found" in this case.

---

## Environment Variables

### `.env` (local — browser-accessible via `import.meta.env`)
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
Used by: `src/lib/supabaseClient.js` (legacy direct Supabase access, kept for potential future use)

### Vercel Project Settings (server-side, private)
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```
Used by: `/api/posts.js` and `/api/posts/[id].js`

> The API files check `process.env.SUPABASE_URL` first, then fall back to `process.env.VITE_SUPABASE_URL` so local `.env` works with `vercel dev` without any extra setup.

---

## Local Development

### Option A — Full stack (API routes + React, recommended)
```bash
# Terminal 1: runs /api/* serverless functions on port 3000
vercel dev

# Terminal 2: runs React on port 5173, proxies /api → port 3000
vite dev
```
Open `http://localhost:5173` — both UI and API work.

### Option B — Frontend only (no API, uses localStorage)
```bash
vite dev
```
Open `http://localhost:5173` — works offline, data saved to localStorage only.

### Vite proxy config (`vite.config.js`)
```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // vercel dev port
      changeOrigin: true,
    },
  },
}
```

---

## Custom Blocks

Registered in `src/registerBlocks.jsx`. Each block lives in `src/blocks/<name>/index.jsx`.

| Block | Name |
|---|---|
| CTA Block | `myapp/cta-block` |
| Hero Banner | `myapp/hero-banner` |
| Card Grid | `myapp/card-grid` |
| Image + Text | `myapp/image-text` |

To add a new custom block:
1. Create `src/blocks/my-block/index.jsx`
2. Register it in `src/registerBlocks.jsx`

---

## Key Design Decisions

1. **No react-router** — routing is a simple `useState` object in `RouterContext.jsx`. Adding react-router is a drop-in if needed.

2. **Supabase never called from browser** — all DB access goes through `/api/*` so keys stay private. `src/lib/supabaseClient.js` exists but is only used if you re-add direct calls.

3. **localStorage mirror** — every `savePage()` call also writes to localStorage. `loadPage()` and `listPages()` fall back to localStorage when the API is unreachable. This means the editor always works offline.

4. **`id` vs `slug`** — Supabase row `id` is a UUID (internal). The app uses `slug` as the public identifier. All API queries filter by `slug`.

5. **`bootstrap.js` must be first import** — it patches the WordPress block registry before any `@wordpress/*` packages load. Moving it breaks the editor.
