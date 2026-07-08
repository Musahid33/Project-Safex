const { createClient } = require('@supabase/supabase-js');

// 🔒 SECURE CONFIG: Use environment variables in production, fallback for dev
const supabaseUrl = process.env.SUPABASE_URL || 'https://duyvrtunxqaawgytkxhv.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_Zlek_bcKAv11vgZMvohs9Q_r0huogOg';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("⚡ Safex database connection initialized successfully!");

module.exports = supabase;