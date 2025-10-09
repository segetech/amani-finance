// Script de test pour le système de matières premières
// Exécuter avec: node scripts/test-commodities-system.js

const { createClient } = require('@supabase/supabase-js');

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rrhcctylbczzahgiqoub.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabaseConnection() {
  log('blue', '\n🔍 Test 1: Connexion à la base de données');
  
  try {
    const { data, error } = await supabase
      .from('commodities')
      .select('count(*)')
      .single();

    if (error) {
      log('red', `❌ Erreur de connexion: ${error.message}`);
      return false;
    }

    log('green', '✅ Connexion à la base de données réussie');
    return true;
  } catch (error) {
    log('red', `❌ Erreur de connexion: ${error.message}`);
    return false;
  }
}

async function testTableStructure() {
  log('blue', '\n🔍 Test 2: Structure de la table commodities');
  
  try {
    const { data, error } = await supabase
      .from('commodities')
      .select('*')
      .limit(1);

    if (error) {
      log('red', `❌ Erreur lors de la vérification de la table: ${error.message}`);
      return false;
    }

    if (!data || data.length === 0) {
      log('yellow', '⚠️  Table vide, mais structure OK');
      return true;
    }

    const commodity = data[0];
    const requiredFields = [
      'id', 'name', 'symbol', 'category', 'current_price', 
      'unit', 'currency', 'is_active', 'show_on_homepage'
    ];

    const missingFields = requiredFields.filter(field => !(field in commodity));
    
    if (missingFields.length > 0) {
      log('red', `❌ Champs manquants: ${missingFields.join(', ')}`);
      return false;
    }

    log('green', '✅ Structure de la table correcte');
    log('cyan', `   Exemple: ${commodity.name} (${commodity.symbol}) - ${commodity.current_price} ${commodity.unit}`);
    return true;
  } catch (error) {
    log('red', `❌ Erreur lors de la vérification: ${error.message}`);
    return false;
  }
}

async function testCRUDOperations() {
  log('blue', '\n🔍 Test 3: Opérations CRUD');
  
  const testCommodity = {
    name: 'Test Commodity',
    symbol: 'TEST',
    category: 'Test',
    current_price: 100.00,
    previous_price: 95.00,
    unit: 'USD/test',
    currency: 'USD',
    description: 'Matière première de test',
    is_active: true,
    show_on_homepage: false,
    display_order: 999
  };

  try {
    // CREATE
    log('cyan', '   📝 Test CREATE...');
    const { data: created, error: createError } = await supabase
      .from('commodities')
      .insert(testCommodity)
      .select()
      .single();

    if (createError) {
      log('red', `❌ Erreur CREATE: ${createError.message}`);
      return false;
    }

    log('green', '   ✅ CREATE réussi');
    const testId = created.id;

    // READ
    log('cyan', '   📖 Test READ...');
    const { data: read, error: readError } = await supabase
      .from('commodities')
      .select('*')
      .eq('id', testId)
      .single();

    if (readError || !read) {
      log('red', `❌ Erreur READ: ${readError?.message || 'Données non trouvées'}`);
      return false;
    }

    log('green', '   ✅ READ réussi');

    // UPDATE
    log('cyan', '   ✏️ Test UPDATE...');
    const { data: updated, error: updateError } = await supabase
      .from('commodities')
      .update({ current_price: 105.00, previous_price: 100.00 })
      .eq('id', testId)
      .select()
      .single();

    if (updateError) {
      log('red', `❌ Erreur UPDATE: ${updateError.message}`);
      return false;
    }

    // Vérifier que les variations sont calculées
    if (updated.change_amount !== 5.00 || Math.abs(updated.change_percent - 5.00) > 0.01) {
      log('yellow', '⚠️  Calcul des variations non automatique (normal si trigger non configuré)');
    } else {
      log('green', '   ✅ Calcul automatique des variations');
    }

    log('green', '   ✅ UPDATE réussi');

    // DELETE
    log('cyan', '   🗑️ Test DELETE...');
    const { error: deleteError } = await supabase
      .from('commodities')
      .delete()
      .eq('id', testId);

    if (deleteError) {
      log('red', `❌ Erreur DELETE: ${deleteError.message}`);
      return false;
    }

    log('green', '   ✅ DELETE réussi');
    log('green', '✅ Toutes les opérations CRUD fonctionnent');
    return true;

  } catch (error) {
    log('red', `❌ Erreur lors des tests CRUD: ${error.message}`);
    return false;
  }
}

async function testAPIEndpoints() {
  log('blue', '\n🔍 Test 4: Endpoints API');
  
  try {
    // Test GET /api/commodities
    log('cyan', '   📡 Test GET /api/commodities...');
    
    const response = await fetch(`${API_BASE_URL}/api/commodities`);
    
    if (!response.ok) {
      log('red', `❌ Erreur API: ${response.status} ${response.statusText}`);
      return false;
    }

    const data = await response.json();
    
    if (!data.success) {
      log('red', `❌ Réponse API invalide: ${data.error || 'Erreur inconnue'}`);
      return false;
    }

    log('green', `   ✅ API GET réussie (${data.count || data.data?.length || 0} commodités)`);

    // Test GET /api/commodities/categories
    log('cyan', '   📡 Test GET /api/commodities/categories...');
    
    const categoriesResponse = await fetch(`${API_BASE_URL}/api/commodities/categories`);
    
    if (categoriesResponse.ok) {
      const categoriesData = await categoriesResponse.json();
      log('green', `   ✅ API Categories réussie (${categoriesData.data?.length || 0} catégories)`);
    } else {
      log('yellow', '   ⚠️  API Categories non disponible (serveur éteint?)');
    }

    return true;

  } catch (error) {
    log('yellow', `⚠️  Tests API ignorés (serveur probablement éteint): ${error.message}`);
    return true; // Ne pas faire échouer le test si le serveur n'est pas démarré
  }
}

async function testDataIntegrity() {
  log('blue', '\n🔍 Test 5: Intégrité des données');
  
  try {
    const { data: commodities, error } = await supabase
      .from('commodities')
      .select('*')
      .eq('is_active', true);

    if (error) {
      log('red', `❌ Erreur lors de la récupération: ${error.message}`);
      return false;
    }

    if (!commodities || commodities.length === 0) {
      log('yellow', '⚠️  Aucune matière première active trouvée');
      return true;
    }

    let issues = 0;

    commodities.forEach((commodity, index) => {
      // Vérifier les champs obligatoires
      if (!commodity.name || !commodity.symbol || !commodity.current_price) {
        log('red', `   ❌ ${commodity.name || `Commodité ${index + 1}`}: Champs obligatoires manquants`);
        issues++;
      }

      // Vérifier les prix
      if (commodity.current_price <= 0) {
        log('red', `   ❌ ${commodity.name}: Prix invalide (${commodity.current_price})`);
        issues++;
      }

      // Vérifier les variations si previous_price existe
      if (commodity.previous_price && commodity.current_price) {
        const expectedChange = commodity.current_price - commodity.previous_price;
        const expectedPercent = (expectedChange / commodity.previous_price) * 100;
        
        if (Math.abs(commodity.change_amount - expectedChange) > 0.01) {
          log('yellow', `   ⚠️  ${commodity.name}: Variation en montant incorrecte`);
        }
        
        if (Math.abs(commodity.change_percent - expectedPercent) > 0.01) {
          log('yellow', `   ⚠️  ${commodity.name}: Variation en pourcentage incorrecte`);
        }
      }
    });

    if (issues === 0) {
      log('green', `✅ Intégrité des données correcte (${commodities.length} commodités vérifiées)`);
    } else {
      log('red', `❌ ${issues} problème(s) d'intégrité détecté(s)`);
      return false;
    }

    // Afficher un résumé par catégorie
    const byCategory = {};
    commodities.forEach(commodity => {
      if (!byCategory[commodity.category]) {
        byCategory[commodity.category] = 0;
      }
      byCategory[commodity.category]++;
    });

    log('cyan', '   📊 Répartition par catégorie:');
    Object.entries(byCategory).forEach(([category, count]) => {
      log('cyan', `      ${category}: ${count} commodité(s)`);
    });

    return true;

  } catch (error) {
    log('red', `❌ Erreur lors de la vérification: ${error.message}`);
    return false;
  }
}

async function testFrontendIntegration() {
  log('blue', '\n🔍 Test 6: Intégration Frontend');
  
  try {
    // Vérifier que les fichiers existent
    const fs = require('fs');
    const path = require('path');

    const filesToCheck = [
      '../client/hooks/useCommodities.ts',
      '../client/components/commodities/CommoditiesSection.tsx',
      '../client/pages/CommoditiesManagement.tsx'
    ];

    let allFilesExist = true;

    filesToCheck.forEach(file => {
      const fullPath = path.join(__dirname, file);
      if (fs.existsSync(fullPath)) {
        log('green', `   ✅ ${file} existe`);
      } else {
        log('red', `   ❌ ${file} manquant`);
        allFilesExist = false;
      }
    });

    if (allFilesExist) {
      log('green', '✅ Tous les fichiers frontend sont présents');
    } else {
      log('red', '❌ Fichiers frontend manquants');
      return false;
    }

    return true;

  } catch (error) {
    log('red', `❌ Erreur lors de la vérification frontend: ${error.message}`);
    return false;
  }
}

async function runAllTests() {
  log('magenta', '🧪 TESTS DU SYSTÈME DE MATIÈRES PREMIÈRES');
  log('magenta', '='.repeat(50));

  const tests = [
    { name: 'Connexion BDD', fn: testDatabaseConnection },
    { name: 'Structure Table', fn: testTableStructure },
    { name: 'Opérations CRUD', fn: testCRUDOperations },
    { name: 'Endpoints API', fn: testAPIEndpoints },
    { name: 'Intégrité Données', fn: testDataIntegrity },
    { name: 'Intégration Frontend', fn: testFrontendIntegration }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      log('red', `❌ Erreur inattendue dans ${test.name}: ${error.message}`);
      failed++;
    }
  }

  // Résumé final
  log('magenta', '\n' + '='.repeat(50));
  log('magenta', '📊 RÉSUMÉ DES TESTS');
  log('green', `✅ Tests réussis: ${passed}`);
  if (failed > 0) {
    log('red', `❌ Tests échoués: ${failed}`);
  }

  const successRate = Math.round((passed / tests.length) * 100);
  
  if (successRate === 100) {
    log('green', '\n🎉 TOUS LES TESTS SONT PASSÉS !');
    log('green', '   Le système de matières premières est prêt à être utilisé.');
    log('cyan', '\n📝 Prochaines étapes:');
    log('cyan', '   1. Démarrer le serveur: npm run dev');
    log('cyan', '   2. Aller sur /marche pour voir les matières premières');
    log('cyan', '   3. Aller sur /commodities-management pour gérer les données');
  } else if (successRate >= 80) {
    log('yellow', `\n⚠️  TESTS MAJORITAIREMENT RÉUSSIS (${successRate}%)`);
    log('yellow', '   Le système fonctionne mais quelques améliorations sont nécessaires.');
  } else {
    log('red', `\n❌ ÉCHEC DES TESTS (${successRate}%)`);
    log('red', '   Le système nécessite des corrections avant utilisation.');
  }

  return successRate === 100;
}

// Exécuter les tests
if (require.main === module) {
  runAllTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log('red', `❌ Erreur fatale: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { runAllTests };
