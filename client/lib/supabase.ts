import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

// Configuration de l'instance Supabase avec des options de persistance de session
// IMPORTANT: protéger l'accès à window pour les builds SSR
const safeStorage = typeof window !== 'undefined' ? window.localStorage : undefined;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // ne pas forcer un storageKey personnalisé: utiliser la convention par défaut de Supabase
    storage: safeStorage,
  },
  global: {
    headers: {
      'X-Client-Info': 'amani-finance/1.0.0'
    }
  }
});

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
