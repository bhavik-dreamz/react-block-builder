/**
 * Demo persistence layer — localStorage + optional Supabase sync.
 * Not exported from the package. Wire your own API via BlockEditor onSave/onLoad.
 */
import { supabase } from './supabaseClient.js';

const LS_KEY = 'rbb_pages';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeAll(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export async function savePage(id, title, html, json) {
  const all = readAll();
  const page = { id, title, html, json, updatedAt: new Date().toISOString() };
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    const { data: existing, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing post:', fetchError);
      throw new Error('Failed to check existing post');
    }

    if (existing) {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title,
          content: html,
          json,
          updated_at: new Date().toISOString(),
        })
        .eq('slug', slug)
        .select();
      console.log('Supabase update result:', { data, error });
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            slug,
            content: html,
            json,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select();
      console.log('Supabase insert result:', { data, error });
    }
  }

  all[id] = page;
  writeAll(all);
  return page;
}

export async function loadPage(id) {
  const all = readAll();
  return all[id] ?? null;
}

export async function listPages() {
  const all = readAll();
  return Object.values(all).sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );
}

export async function deletePage(id) {
  const all = readAll();
  delete all[id];
  writeAll(all);
}
