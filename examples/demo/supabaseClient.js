/**
 * Demo-only Supabase client (optional). Not shipped with gutenberg-block-kit.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create the client when env is configured. Without it the demo falls
// back to localStorage (see api.js) instead of crashing at import time.
export const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
