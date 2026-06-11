# CLAUDE.md — gutenberg-block-kit

Project overview + rules. Auto-loaded every session, so you don't re-explain.

## What this is

**npm library** (`gutenberg-block-kit`, v1.1.0): Gutenberg block editor + SSR-safe renderer for React. Consumed in Next.js / Remix / Vite via `onSave`/`onLoad` hooks. **Not** a single-page app. Demo app lives in `examples/demo/` only.

JavaScript (JSX), not TypeScript, unless explicitly asked. pnpm. Node >= 22. Vite 8.

## Full handbook

Detailed rules + architecture already documented — read these, don't duplicate:

@AGENTS.md

Deeper handbook (publish, Vercel, Next.js, Remix, Vite, architecture): `docs/FULL_GUIDE.md`.

## Hard rules (recap — full list in AGENTS.md)

1. `src/` = published library. `examples/demo/` (persistence, Supabase, FrontendPage) never ships in `dist`.
2. `react` / `react-dom` → `peerDependencies` only, never `dependencies`.
3. Editor = client-only (`/editor`). Renderer = SSR-safe (`/renderer`). Never import `@wordpress/block-editor` from `renderer.jsx`.
4. No top-level `window`/`document`/`localStorage` in `src/` — guard with `typeof window`.
5. No `next/*`, `@remix-run/*`, framework imports in `src/`.
6. Persistence = `onSave`/`onLoad` props on `BlockEditor`. No built-in API.
7. `BlockRenderer` not on root export.

## Build & test

```bash
pnpm run build:lib    # → dist/ (npm publish)
pnpm run build:demo   # → dist-demo/ (Vercel)
pnpm run test:exports && pnpm run test:bundle && pnpm run test:boundary
```

## Don't touch without reason

`vite.lib.config.js` (multi-entry lib build, React externalized) · `package.json` `exports` (public API surface) · `src/blocks/*` (block impls).
