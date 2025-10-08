// Créer un utilisateur de test
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Clé service role si disponible
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Création d\'un utilisateur de test...\n');

// Utiliser la clé service si disponible, sinon la clé anon
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestUser() {
  try {
    // Essayer de créer un utilisateur de test
    const testUser = {
      email: 'test@amani.com',
      password: 'test123456',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          role: 'admin'
        }
      }
    };

    console.log('📝 Tentative de création utilisateur:', testUser.email);

    const { data, error } = await supabase.auth.admin.createUser({
      email: testUser.email,
      password: testUser.password,
      user_metadata: testUser.options.data,
      email_confirm: true // Confirmer l'email automatiquement
    });

    if (error) {
      console.error('❌ Erreur création utilisateur:', error);
      
      // Si l'utilisateur existe déjà, essayer de se connecter
      if (error.message.includes('already registered')) {
        console.log('ℹ️ Utilisateur existe déjà, test de connexion...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testUser.email,
          password: testUser.password
        });

        if (signInError) {
          console.error('❌ Échec connexion:', signInError.message);
        } else {
          console.log('✅ Connexion réussie avec utilisateur existant');
          console.log('   User ID:', signInData.user?.id);
          console.log('   Email:', signInData.user?.email);
          await supabase.auth.signOut();
        }
      }
    } else {
      console.log('✅ Utilisateur créé avec succès!');
      console.log('   User ID:', data.user?.id);
      console.log('   Email:', data.user?.email);
    }

    // Vérifier les tables disponibles
    console.log('\n🔍 Vérification des tables...');
    
    // Essayer différents noms de tables pour les profils
    const tablesToCheck = ['profiles', 'users', 'user_profiles', 'auth_users'];
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (!error) {
          console.log(`✅ Table "${tableName}" trouvée`);
          if (data && data.length > 0) {
            console.log('   Colonnes:', Object.keys(data[0]).join(', '));
          }
        }
      } catch (err) {
        // Table n'existe pas, continuer
      }
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

createTestUser();
