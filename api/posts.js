/**
 * api/posts.js
 *
 * GET  /api/posts  — list all pages (sorted newest first)
 * POST /api/posts  — create or update a page (upsert by slug)
 *
 * Supabase table schema:
 *   id         uuid primary key default gen_random_uuid()
 *   title      text not null
 *   slug       text unique not null
 *   content    text          -- serialized Gutenberg HTML
 *   json       text          -- raw blocks JSON
 *   created_at timestamptz default now()
 *   updated_at timestamptz default now()
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  const supabase = getSupabase();

  // ── GET /api/posts — list all ────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('posts')
      .select('slug, title, content, json, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('List error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json((data ?? []).map(mapRow));
  }

  // ── POST /api/posts — upsert ─────────────────────────────────────────────
  if (req.method === 'POST') {
    const { id, title, html, json } = req.body ?? {};

    if (!id || !title) {
      return res.status(400).json({ error: '`id` (slug) and `title` are required' });
    }

    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from('posts')
      .select('id')
      .eq('slug', id)
      .single();

    let result, error;

    if (existing) {
      ({ data: result, error } = await supabase
        .from('posts')
        .update({ title, content: html, json, updated_at: now })
        .eq('slug', id)
        .select('slug, title, content, json, updated_at')
        .single());
    } else {
      ({ data: result, error } = await supabase
        .from('posts')
        .insert([{ title, slug: id, content: html, json, created_at: now, updated_at: now }])
        .select('slug, title, content, json, updated_at')
        .single());
    }

    if (error) {
      console.error('Upsert error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(mapRow(result));
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
