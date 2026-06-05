# gutenberg-block-kit demo

Playground app — **not** published to npm.

See **[docs/FULL_GUIDE.md](../../docs/FULL_GUIDE.md)** for:

- Local dev (`pnpm run dev`)
- Vercel deployment
- How this demo differs from the npm package

```bash
# From repo root
pnpm install
pnpm run dev
```

Uses `BlockEditor` from the package with local `api.js` (`onSave` / `onLoad`).

Optional Supabase: copy `../../.env.example` to repo root as `.env`.
