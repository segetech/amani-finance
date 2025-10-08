// Test des utilisateurs dans Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUsers() {
  console.log('👥 Test des utilisateurs Supabase...\n');

  try {
    // Test 1: Vérifier la table profiles
    console.log('1. Test de la table profiles:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role')
      .limit(10);

    if (profilesError) {
      console.error('❌ Erreur profiles:', profilesError);
    } else {
      console.log(`✅ ${profiles?.length || 0} profils trouvés`);
      profiles?.forEach(profile => {
        console.log(`   - ${profile.email} (${profile.role || 'no role'})`);
      });
    }

    // Test 2: Essayer de se connecter avec un utilisateur test
    console.log('\n2. Test de connexion:');
    const testCredentials = [
      { email: 'admin@amani.com', password: 'admin123' },
      { email: 'test@amani.com', password: 'test123' },
      { email: 'editor@amani.com', password: 'editor123' }
    ];

    for (const cred of testCredentials) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cred.email,
          password: cred.password
        });

        if (error) {
          console.log(`❌ ${cred.email}: ${error.message}`);
        } else {
          console.log(`✅ ${cred.email}: Connexion réussie`);
          console.log(`   User ID: ${data.user?.id}`);
          
          // Se déconnecter immédiatement
          await supabase.auth.signOut();
          break; // Arrêter après la première connexion réussie
        }
      } catch (err) {
        console.log(`💥 ${cred.email}: Erreur inattendue`);
      }
    }

    // Test 3: Vérifier les catégories
    console.log('\n3. Test des catégories:');
    const { data: categories, error: catError } = await supabase
      .from('content_categories')
      .select('id, name, slug, is_active')
      .eq('is_active', true);

    if (catError) {
      console.error('❌ Erreur catégories:', catError);
    } else {
      console.log(`✅ ${categories?.length || 0} catégories actives`);
      categories?.slice(0, 5).forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug})`);
      });
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

testUsers();
