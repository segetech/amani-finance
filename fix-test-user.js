// Corriger l'utilisateur de test
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixTestUser() {
  console.log('🔧 Correction de l\'utilisateur de test...\n');

  // Essayer plusieurs combinaisons d'identifiants
  const testCredentials = [
    { email: 'test@amani.com', password: 'test123456' },
    { email: 'test@amani.com', password: 'test123' },
    { email: 'admin@amani.com', password: 'admin123' },
    { email: 'admin@amani.com', password: 'admin123456' },
    { email: 'user@amani.com', password: 'user123' }
  ];

  console.log('🔍 Test des identifiants existants...');
  
  for (const cred of testCredentials) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cred.email,
        password: cred.password
      });

      if (!error && data.user) {
        console.log(`✅ Connexion réussie avec ${cred.email}`);
        console.log(`   User ID: ${data.user.id}`);
        console.log(`   Email confirmé: ${data.user.email_confirmed_at ? 'Oui' : 'Non'}`);
        
        // Vérifier le profil
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profile) {
          console.log(`   Profil: ${profile.first_name} ${profile.last_name}`);
        }

        await supabase.auth.signOut();
        
        console.log(`\n🎯 Utilisez ces identifiants pour vous connecter:`);
        console.log(`   Email: ${cred.email}`);
        console.log(`   Mot de passe: ${cred.password}`);
        return;
      }
    } catch (err) {
      // Continuer avec les autres identifiants
    }
  }

  console.log('❌ Aucun utilisateur existant trouvé. Création d\'un nouvel utilisateur...\n');

  // Créer un nouvel utilisateur avec confirmation automatique
  try {
    // Méthode 1: Inscription normale
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'demo@amani.com',
      password: 'demo123456',
      options: {
        data: {
          first_name: 'Demo',
          last_name: 'User'
        }
      }
    });

    if (signUpError) {
      console.error('❌ Erreur inscription:', signUpError.message);
      
      // Si l'utilisateur existe déjà, essayer de se connecter
      if (signUpError.message.includes('already registered')) {
        console.log('ℹ️ Utilisateur demo@amani.com existe déjà, test de connexion...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'demo@amani.com',
          password: 'demo123456'
        });

        if (!signInError && signInData.user) {
          console.log('✅ Connexion réussie avec demo@amani.com');
          console.log(`\n🎯 Utilisez ces identifiants:`);
          console.log(`   Email: demo@amani.com`);
          console.log(`   Mot de passe: demo123456`);
          await supabase.auth.signOut();
          return;
        }
      }
    } else if (signUpData.user) {
      console.log('✅ Nouvel utilisateur créé!');
      console.log(`   User ID: ${signUpData.user.id}`);
      console.log(`   Email: ${signUpData.user.email}`);
      
      // Si l'email n'est pas confirmé automatiquement
      if (!signUpData.user.email_confirmed_at) {
        console.log('⚠️ Email non confirmé. Vérifiez votre boîte mail ou configurez Supabase pour confirmer automatiquement.');
      }
      
      console.log(`\n🎯 Utilisez ces identifiants:`);
      console.log(`   Email: demo@amani.com`);
      console.log(`   Mot de passe: demo123456`);
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }

  // Instructions supplémentaires
  console.log(`\n📋 Instructions supplémentaires:`);
  console.log(`1. Si la connexion échoue encore, vérifiez dans Supabase Dashboard:`);
  console.log(`   - Allez dans Authentication > Users`);
  console.log(`   - Vérifiez que l'utilisateur existe et est confirmé`);
  console.log(`   - Si nécessaire, confirmez manuellement l'email`);
  console.log(`\n2. Alternative: Créez un utilisateur manuellement dans Supabase Dashboard`);
  console.log(`   - Authentication > Users > Add user`);
  console.log(`   - Email: admin@amani.com`);
  console.log(`   - Password: admin123456`);
  console.log(`   - Cochez "Auto Confirm User"`);
}

fixTestUser();
