/**
 * 🔌 Safex Database Connection Module
 * 
 * Initializes and exports a singleton Supabase client.
 * Uses environment variables in production with secure fallbacks for development.
 * 
 * @module db
 */

const { createClient } = require('@supabase/supabase-js');

// ─── Configuration ───────────────────────────────────────────────────────────
const REQUIRED_ENV_VARS = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];

function validateEnvironment() {
  const missing = REQUIRED_ENV_VARS.filter(
    (key) => !process.env[key]
  );
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    console.error(
      `❌ Missing required environment variables in production: ${missing.join(', ')}`
    );
    console.error('   Please set them in your .env file or hosting dashboard.');
  }
}

validateEnvironment();

const supabaseUrl =
  process.env.SUPABASE_URL ||
  'https://duyvrtunxqaawgytkxhv.supabase.co';

const supabaseKey =
  process.env.SUPABASE_ANON_KEY ||
  'sb_publishable_Zlek_bcKAv11vgZMvohs9Q_r0huogOg';

// ─── Singleton Client ────────────────────────────────────────────────────────
let supabaseInstance = null;

function getSupabaseClient() {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // stateless — each request is independent
        detectSessionInUrl: false,
      },
      global: {
        headers: {
          'x-application-name': 'safex',
        },
      },
    });
    console.log('⚡ Safex database connection initialized successfully!');
  }
  return supabaseInstance;
}

const supabase = getSupabaseClient();

module.exports = supabase;
