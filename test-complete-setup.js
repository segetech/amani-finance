// Test complet de la configuration
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const uploadthingToken = process.env.UPLOADTHING_TOKEN;
const muxTokenId = process.env.MUX_TOKEN_ID;
const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

console.log('🧪 Test complet de la configuration Amani Finance\n');

// Test 1: Variables d'environnement
console.log('1️⃣ Variables d\'environnement:');
console.log('   ✅ Supabase URL:', supabaseUrl ? 'OK' : '❌ Manquant');
console.log('   ✅ Supabase Key:', supabaseKey ? 'OK' : '❌ Manquant');
console.log('   ✅ UploadThing Token:', uploadthingToken ? 'OK' : '❌ Manquant');
console.log('   ✅ Mux Token ID:', muxTokenId ? 'OK' : '❌ Manquant');
console.log('   ✅ Mux Token Secret:', muxTokenSecret ? 'OK' : '❌ Manquant');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Configuration Supabase incomplète');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  try {
    // Test 2: Connexion Supabase
    console.log('\n2️⃣ Test connexion Supabase:');
    const { data: pingData, error: pingError } = await supabase
      .from('content_categories')
      .select('count')
      .limit(1);
    
    if (pingError) {
      console.log('   ❌ Erreur connexion:', pingError.message);
    } else {
      console.log('   ✅ Connexion Supabase OK');
    }

    // Test 3: Catégories
    console.log('\n3️⃣ Test catégories:');
    const { data: categories, error: catError } = await supabase
      .from('content_categories')
      .select('id, name, slug, is_active')
      .eq('is_active', true)
      .order('sort_order');

    if (catError) {
      console.log('   ❌ Erreur catégories:', catError.message);
    } else {
      console.log(`   ✅ ${categories?.length || 0} catégories actives trouvées`);
      categories?.slice(0, 3).forEach(cat => {
        console.log(`      - ${cat.name} (${cat.slug})`);
      });
    }

    // Test 4: Contenus existants
    console.log('\n4️⃣ Test contenus:');
    const { data: contents, error: contentError } = await supabase
      .from('contents')
      .select('id, title, type, status')
      .limit(5);

    if (contentError) {
      console.log('   ❌ Erreur contenus:', contentError.message);
    } else {
      console.log(`   ✅ ${contents?.length || 0} contenus trouvés`);
      contents?.forEach(content => {
        console.log(`      - ${content.title} (${content.type}, ${content.status})`);
      });
    }

    // Test 5: UploadThing
    console.log('\n5️⃣ Test UploadThing:');
    if (uploadthingToken) {
      try {
        const decoded = JSON.parse(Buffer.from(uploadthingToken, 'base64').toString());
        console.log('   ✅ Token UploadThing valide');
        console.log(`      App ID: ${decoded.appId}`);
        console.log(`      Régions: ${decoded.regions.join(', ')}`);
      } catch (error) {
        console.log('   ❌ Token UploadThing invalide');
      }
    } else {
      console.log('   ❌ Token UploadThing manquant');
    }

    // Test 6: Mux
    console.log('\n6️⃣ Test Mux:');
    if (muxTokenId && muxTokenSecret && muxTokenSecret !== 'YOUR_MUX_TOKEN_SECRET') {
      console.log('   ✅ Configuration Mux complète');
      console.log(`      Token ID: ${muxTokenId}`);
    } else {
      console.log('   ❌ Configuration Mux incomplète');
    }

    // Résumé final
    console.log('\n📊 Résumé:');
    const checks = [
      supabaseUrl && supabaseKey,
      !pingError,
      !catError && categories && categories.length > 0,
      uploadthingToken,
      muxTokenId && muxTokenSecret && muxTokenSecret !== 'YOUR_MUX_TOKEN_SECRET'
    ];
    
    const passedChecks = checks.filter(Boolean).length;
    const totalChecks = checks.length;
    
    console.log(`   ${passedChecks}/${totalChecks} tests réussis`);
    
    if (passedChecks === totalChecks) {
      console.log('   🎉 Configuration complète et fonctionnelle !');
      console.log('\n🚀 Prochaines étapes:');
      console.log('   1. Accédez à http://localhost:8080/test-media');
      console.log('   2. Testez l\'upload d\'images et vidéos');
      console.log('   3. Accédez à http://localhost:8080/test-article-form');
      console.log('   4. Vérifiez que les catégories s\'affichent');
      console.log('   5. Créez votre premier article avec médias !');
    } else {
      console.log('   ⚠️ Configuration incomplète');
      console.log('   Vérifiez les éléments marqués ❌ ci-dessus');
    }

  } catch (error) {
    console.error('\n💥 Erreur lors des tests:', error);
  }
}

runTests();
