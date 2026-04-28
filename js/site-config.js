/* ═══════════════════════════════════════════════════
   AHNAF PORTFOLIO — SITE CONFIG
   Edit this file to connect your Supabase backend.
   See README for setup instructions.
═══════════════════════════════════════════════════ */

window.AHNAF_CONFIG = {

  // ── SUPABASE (required for persistent storage) ──
  // Step 1: Create a FREE account at https://supabase.com
  // Step 2: Create a new project
  // Step 3: Go to Project Settings → API
  // Step 4: Copy "Project URL" and "anon/public" key below
  supabaseUrl:      'https://<pehnbigwultrezpwsjik>.supabase.co',
  supabaseAnonKey:  'sb_publishable_Xun_YPVeNTDO6wWMJ-RnYw_jHAlUlTD',

  // ── STORAGE ──
  // Name of the Supabase Storage bucket for uploaded images/videos
  // Create a PUBLIC bucket with this exact name in your Supabase project
  storageBucket: 'portfolio-media',

  // ── ADMIN ACCESS ──
  // Change this to a strong password before deploying!
  adminPasscode: 'Ahnaf2025!',

  // ── SITE INFO ──
  siteName: 'Ahnaf Portfolio'
};
