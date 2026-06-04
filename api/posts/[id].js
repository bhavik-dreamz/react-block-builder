/**
 * api/posts/[id].js
 *
 * GET    /api/posts/:id  — load a single page by slug
 * DELETE /api/posts/:id  — delete a page by slug
 *
 * :id is the page slug (e.g. "home", "about", "page-1234-abcde")
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars');
  return createClient(url, key);
}

function mapRow(row) {
  return {
    id: row.slug,
    title: row.title,
    html: row.content ?? '',
    json: row.json ?? '[]',
    updatedAt: row.updated_at,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const slug = req.query.id;

  if (!slug) {
    return res.status(400).json({ error: 'Missing page id (slug)' });
  }

  const supabase = getSupabase();

  // ── GET /api/posts/:id ───────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('posts')
      .select('slug, title, content, json, updated_at')
      .eq('slug', slug)
      .single();

    if (error?.code === 'PGRST116' || !data) {
      return res.status(404).json({ error: 'Page not found' });
    }

    if (error) {
      console.error('Load error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(mapRow(data));
  }

  // ── DELETE /api/posts/:id ────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    // First confirm the row exists
    const { data: existing } = await supabase
      .from('posts')
      .select('id, slug')
      .eq('slug', slug)
      .single();

    console.log('DELETE attempt — slug:', slug, '| found row:', existing);

    const { data: deleted, error } = await supabase
      .from('posts')
      .delete()
      .eq('slug', slug)
      .select('slug');

    console.log('DELETE result — deleted rows:', deleted, '| error:', error);

    if (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!deleted || deleted.length === 0) {
      return res.status(404).json({ error: `No row found with slug="${slug}". Check RLS or column value.` });
    }

    return res.status(200).json({ ok: true, deleted });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
