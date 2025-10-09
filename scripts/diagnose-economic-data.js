// Script de diagnostic pour le système de données économiques
// Exécuter avec: node scripts/diagnose-economic-data.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rrhcctylbczzahgiqoub.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Diagnostic du système de données économiques\n');

// Test avec la clé service role
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Test avec la clé anon (comme dans l'app)
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function diagnoseSystem() {
  console.log('1. Test de connexion avec clé service role...');
  
  try {
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('economic_countries')
      .select('*')
      .limit(1);
      
    if (adminError) {
      console.error('❌ Erreur avec clé admin:', adminError);
    } else {
      console.log('✅ Connexion admin réussie, données trouvées:', adminData?.length || 0);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion admin:', error);
  }

  console.log('\n2. Test de connexion avec clé anon...');
  
  try {
    const { data: anonData, error: anonError } = await supabaseAnon
      .from('economic_countries')
      .select('*')
      .limit(1);
      
    if (anonError) {
      console.error('❌ Erreur avec clé anon:', anonError);
    } else {
      console.log('✅ Connexion anon réussie, données trouvées:', anonData?.length || 0);
    }
  } catch (error) {
    console.error('❌ Erreur de connexion anon:', error);
  }

  console.log('\n3. Test de mise à jour avec clé admin...');
  
  try {
    // D'abord, récupérer un pays existant
    const { data: countries, error: fetchError } = await supabaseAdmin
      .from('economic_countries')
      .select('*')
      .limit(1);
      
    if (fetchError || !countries || countries.length === 0) {
      console.error('❌ Aucun pays trouvé pour le test de mise à jour');
      return;
    }
    
    const testCountry = countries[0];
    console.log('📝 Test de mise à jour sur:', testCountry.name);
    
    // Tenter une mise à jour simple
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('economic_countries')
      .update({ description: `Test mise à jour ${new Date().toISOString()}` })
      .eq('id', testCountry.id)
      .select()
      .single();
      
    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour:', updateError);
    } else {
      console.log('✅ Mise à jour réussie avec clé admin');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test de mise à jour:', error);
  }

  console.log('\n4. Test de mise à jour avec clé anon...');
  
  try {
    const { data: countries, error: fetchError } = await supabaseAnon
      .from('economic_countries')
      .select('*')
      .limit(1);
      
    if (fetchError || !countries || countries.length === 0) {
      console.error('❌ Aucun pays trouvé avec clé anon');
      return;
    }
    
    const testCountry = countries[0];
    
    const { data: updateData, error: updateError } = await supabaseAnon
      .from('economic_countries')
      .update({ description: `Test anon ${new Date().toISOString()}` })
      .eq('id', testCountry.id)
      .select()
      .single();
      
    if (updateError) {
      console.error('❌ Erreur lors de la mise à jour avec clé anon:', updateError);
      console.log('💡 Ceci est probablement lié aux permissions RLS');
    } else {
      console.log('✅ Mise à jour réussie avec clé anon');
    }
  } catch (error) {
    console.error('❌ Erreur lors du test anon:', error);
  }

  console.log('\n5. Vérification des politiques RLS...');
  
  try {
    const { data: policies, error: policiesError } = await supabaseAdmin
      .rpc('exec_sql', { 
        sql: `
          SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
          FROM pg_policies 
          WHERE tablename IN ('economic_countries', 'regional_economic_metrics');
        `
      });
      
    if (policiesError) {
      console.error('❌ Erreur lors de la vérification des politiques:', policiesError);
    } else {
      console.log('📋 Politiques RLS trouvées:', policies?.length || 0);
      if (policies) {
        policies.forEach(policy => {
          console.log(`  - ${policy.tablename}.${policy.policyname}: ${policy.cmd} (${policy.permissive})`);
        });
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des politiques:', error);
  }

  console.log('\n📊 Résumé du diagnostic:');
  console.log('- Si les tests admin passent mais pas les tests anon, c\'est un problème de RLS');
  console.log('- Si aucun test ne passe, c\'est un problème de migration/tables');
  console.log('- Vérifiez les politiques RLS dans Supabase Dashboard > Authentication > Policies');
}

// Exécuter le diagnostic
if (import.meta.url === `file://${process.argv[1]}`) {
  diagnoseSystem()
    .then(() => {
      console.log('\n✅ Diagnostic terminé');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Erreur lors du diagnostic:', error);
      process.exit(1);
    });
}

export { diagnoseSystem };
