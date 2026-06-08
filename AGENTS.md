# AI Agent Instructions — gutenberg-block-kit

Read **`docs/FULL_GUIDE.md`** for the complete handbook (npm publish, Vercel, Next.js, Remix, Vite, architecture).

## Project type

**npm library** (Gutenberg block editor + SSR renderer), **not** a single-page app.  
Demo app: `examples/demo/` only.

## Critical rules

1. **`src/`** = published library. **`examples/demo/`** = persistence, Supabase, FrontendPage — never ship in `dist` exports.
2. **`react` / `react-dom`** → `peerDependencies` only (never `dependencies`).
3. **Editor** = client-only (`gutenberg-block-kit/editor`). **Renderer** = SSR-safe (`gutenberg-block-kit/renderer`).
4. No top-level `window`/`document`/`localStorage` in `src/` (guard with `typeof window`).
5. No `next/*`, `@remix-run/*`, or framework imports in `src/`.
6. Do not import `@wordpress/block-editor` from `renderer.jsx`.
7. Persistence = **`onSave` / `onLoad` props** on `BlockEditor` — no built-in API in the package.
8. JavaScript only unless user requests TypeScript.

## Package exports

| Import | Use |
|--------|-----|
| `gutenberg-block-kit/editor` | `BlockEditor`, `initBlocks`, `EditorProvider`, `useEditor` |
| `gutenberg-block-kit/editor-client` | `ClientBlockEditor` (SSR-safe loader for editor) |
| `gutenberg-block-kit/renderer` | `BlockRenderer` (server-safe) |
| `gutenberg-block-kit/styles` | Editor CSS |
| `gutenberg-block-kit/bootstrap` | Optional (editor entry already loads it) |

`BlockRenderer` is **not** on the root export.

## Build & test

```bash
pnpm run build:lib          # → dist/ (npm publish)
pnpm run build:demo         # → dist-demo/ (Vercel)
pnpm run test:exports && pnpm run test:bundle && pnpm run test:boundary
```

## Common tasks

| Task | Command / location |
|------|---------------------|
| Local demo | `pnpm run dev` |
| Publish npm | `build:lib` → `npm version` → `npm publish` |
| Vercel demo | Build: `pnpm run build:demo`, output: `dist-demo` |
| Add consumer block | `blockRegistry` or `customBlocksConfig` prop |
| Change editor styles | `src/styles.js` + `scripts/build-styles.mjs` |

## Files to avoid changing without reason

- `vite.lib.config.js` — multi-entry lib build; React externalized
- `package.json` `exports` — public API surface
- Block implementations in `src/blocks/*` unless user asks

## Full documentation

→ [docs/FULL_GUIDE.md](docs/FULL_GUIDE.md)
