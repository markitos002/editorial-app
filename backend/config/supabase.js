// config/supabase.js
const { createClient } = require('@supabase/supabase-js');

// Configuración del cliente de Supabase para Storage
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

// Cliente con service role para operaciones de backend (incluye Storage)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Cliente normal para operaciones públicas
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {
    supabase,      // Cliente público
    supabaseAdmin  // Cliente admin para storage
};
