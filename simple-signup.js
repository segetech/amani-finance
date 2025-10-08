// Inscription simple d'un utilisateur de test
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function signUpTestUser() {
  console.log('📝 Inscription d\'un utilisateur de test...\n');

  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@amani.com',
      password: 'test123456',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User'
        }
      }
    });

    if (error) {
      console.error('❌ Erreur inscription:', error.message);
      
      // Si l'utilisateur existe, essayer de se connecter
      if (error.message.includes('already registered')) {
        console.log('\n🔄 Tentative de connexion...');
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'test@amani.com',
          password: 'test123456'
        });

        if (signInError) {
          console.error('❌ Échec connexion:', signInError.message);
        } else {
          console.log('✅ Connexion réussie!');
          console.log('   User ID:', signInData.user?.id);
          console.log('   Email:', signInData.user?.email);
          console.log('   Email confirmé:', signInData.user?.email_confirmed_at ? 'Oui' : 'Non');
          
          // Vérifier le profil
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signInData.user?.id)
            .single();

          if (profileError) {
            console.log('⚠️ Pas de profil trouvé, création...');
            
            // Créer le profil
            const { error: createProfileError } = await supabase
              .from('profiles')
              .insert({
                id: signInData.user?.id,
                first_name: 'Test',
                last_name: 'User',
                email: signInData.user?.email
              });

            if (createProfileError) {
              console.error('❌ Erreur création profil:', createProfileError);
            } else {
              console.log('✅ Profil créé');
            }
          } else {
            console.log('✅ Profil existant trouvé');
          }
          
          await supabase.auth.signOut();
        }
      }
    } else {
      console.log('✅ Inscription réussie!');
      console.log('   User ID:', data.user?.id);
      console.log('   Email:', data.user?.email);
      console.log('   Confirmation requise:', data.user?.email_confirmed_at ? 'Non' : 'Oui');
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

signUpTestUser();
