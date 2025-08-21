import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file');
}

// Configuration de l'instance Supabase avec des options de persistance de session
// IMPORTANT: protéger l'accès à window pour les builds SSR et créer un singleton pour éviter plusieurs instances
const isBrowser = typeof window !== 'undefined';
const safeStorage = isBrowser ? window.localStorage : undefined;

// Utiliser un storageKey spécifique à l'app pour éviter les conflits entre plusieurs clients
const authOptions = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  storage: safeStorage,
  storageKey: 'amani-finance-auth'
} as const;

// Singleton côté navigateur pour éviter le warning "Multiple GoTrueClient instances"
let clientInstance: ReturnType<typeof createClient>;
if (isBrowser) {
  const w = window as unknown as { __amani_supabase?: ReturnType<typeof createClient> };
  if (!w.__amani_supabase) {
    w.__amani_supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: authOptions,
      global: {
        headers: {
          'X-Client-Info': 'amani-finance/1.0.0'
        }
      }
    });
  }
  clientInstance = w.__amani_supabase;
} else {
  // En environnement non-navigateur, créer une instance isolée
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: authOptions,
    global: {
      headers: {
        'X-Client-Info': 'amani-finance/1.0.0'
      }
    }
  });
}

export const supabase = clientInstance;

// Helper functions for common operations
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
