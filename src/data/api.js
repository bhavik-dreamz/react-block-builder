/**
 * src/data/api.js — Frontend data layer.
 *
 * All Supabase logic lives in /api/* serverless functions.
 * This file only calls those routes with fetch().
 *
 * Swap guide:
 *   - Local dev with Vercel routes: use `vercel dev` instead of `vite dev`
 *   - Deployed:  calls go to  https://your-app.vercel.app/api/posts[/slug]
 *
 * Shape returned by every function:
 *   { id, title, html, json, updatedAt }
 */

const LS_KEY = 'rbb_pages'; // localStorage fallback namespace

export function generatePageId() {
  return `page-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── localStorage fallback helpers ────────────────────────────────────────────

function lsReadAll() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}

function lsWriteAll(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

// ── Detect whether API routes are reachable ───────────────────────────────────
// In plain `vite dev` (no vercel dev) /api/* returns 404, so we fall back to
// localStorage automatically.

let _useApi = null; // null = not yet tested

async function apiAvailable() {
  if (_useApi !== null) return _useApi;
  try {
    const r = await fetch('/api/posts', { method: 'GET' });
    _useApi = r.ok || r.status !== 404;
  } catch {
    _useApi = false;
  }
  return _useApi;
}

// ═════════════════════════════════════════════════════════════════════════════
//  PUBLIC API
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Save (create or update) a page.
 */
export async function savePage(id, title, html, json) {
  const updatedAt = new Date().toISOString();

  if (await apiAvailable()) {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, html, json }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error ?? `Save failed (${res.status})`);
    }
    const saved = await res.json();
    // Mirror to localStorage so offline reads still work
    const all = lsReadAll();
    all[id] = saved;
    lsWriteAll(all);
    return saved;
  }

  // ── localStorage fallback ────────────────────────────────────────────────
  const page = { id, title, html, json, updatedAt };
  const all = lsReadAll();
  all[id] = page;
  lsWriteAll(all);
  return page;
}

/**
 * Load a single page by id (slug). Returns null if not found.
 */
export async function loadPage(id) {
  if (await apiAvailable()) {
    const res = await fetch(`/api/posts/${encodeURIComponent(id)}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Load failed (${res.status})`);
    return res.json();
  }

  const all = lsReadAll();
  return all[id] ?? null;
}

/**
 * List all saved pages, newest first.
 */
export async function listPages() {
  if (await apiAvailable()) {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error(`List failed (${res.status})`);
    return res.json();
  }

  const all = lsReadAll();
  return Object.values(all).sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
}

/**
 * Delete a page by id (slug).
 */
export async function deletePage(id) {
  if (await apiAvailable()) {
    const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Delete failed (${res.status})`);
  }

  const all = lsReadAll();
  delete all[id];
  lsWriteAll(all);
}

