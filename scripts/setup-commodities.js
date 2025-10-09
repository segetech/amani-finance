// Script pour configurer le système de matières premières
// Exécuter avec: node scripts/setup-commodities.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rrhcctylbczzahgiqoub.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupCommoditiesSystem() {
  try {
    console.log('🚀 Configuration du système de matières premières...\n');

    // 1. Lire et exécuter le script SQL de migration
    const migrationPath = path.join(__dirname, '..', 'database_migrations', 'add_commodities_system.sql');
    
    if (fs.existsSync(migrationPath)) {
      console.log('📄 Lecture du fichier de migration...');
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Diviser le SQL en commandes individuelles
      const commands = migrationSQL
        .split(';')
        .map(cmd => cmd.trim())
        .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

      console.log(`📊 Exécution de ${commands.length} commandes SQL...\n`);

      for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        if (command.trim()) {
          try {
            console.log(`⚡ Commande ${i + 1}/${commands.length}...`);
            const { error } = await supabase.rpc('exec_sql', { sql: command });
            
            if (error) {
              console.warn(`⚠️  Avertissement pour la commande ${i + 1}: ${error.message}`);
            } else {
              console.log(`✅ Commande ${i + 1} exécutée avec succès`);
            }
          } catch (err) {
            console.warn(`⚠️  Erreur pour la commande ${i + 1}: ${err.message}`);
          }
        }
      }
    } else {
      console.log('⚠️  Fichier de migration non trouvé, création directe des données...');
    }

    // 2. Vérifier si la table existe et contient des données
    console.log('\n🔍 Vérification de la table commodities...');
    
    const { data: existingCommodities, error: checkError } = await supabase
      .from('commodities')
      .select('id, name')
      .limit(1);

    if (checkError) {
      console.error('❌ Erreur lors de la vérification de la table:', checkError.message);
      return;
    }

    if (existingCommodities && existingCommodities.length > 0) {
      console.log('✅ La table commodities existe déjà et contient des données');
      
      // Afficher les commodités existantes
      const { data: allCommodities } = await supabase
        .from('commodities')
        .select('name, symbol, category, current_price, unit')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (allCommodities) {
        console.log('\n📋 Matières premières existantes:');
        allCommodities.forEach(commodity => {
          console.log(`  • ${commodity.name} (${commodity.symbol}) - ${commodity.current_price} ${commodity.unit} - ${commodity.category}`);
        });
      }
    } else {
      console.log('📝 Insertion des données de test...');
      
      // Données de test si la table est vide
      const testCommodities = [
        {
          name: 'Café Arabica',
          symbol: 'COFFEE',
          category: 'Agriculture',
          subcategory: 'Boissons',
          current_price: 1.65,
          previous_price: 1.58,
          unit: 'USD/livre',
          currency: 'USD',
          market: 'ICE',
          description: 'Café Arabica de qualité supérieure',
          country_origin: 'Brésil',
          icon: 'Coffee',
          show_on_homepage: true,
          is_active: true,
          display_order: 1
        },
        {
          name: 'Cacao',
          symbol: 'COCOA',
          category: 'Agriculture',
          subcategory: 'Boissons',
          current_price: 2850.00,
          previous_price: 2780.00,
          unit: 'USD/tonne',
          currency: 'USD',
          market: 'ICE',
          description: 'Fèves de cacao',
          country_origin: 'Côte d\'Ivoire',
          icon: 'Cookie',
          show_on_homepage: true,
          is_active: true,
          display_order: 2
        },
        {
          name: 'Coton',
          symbol: 'COTTON',
          category: 'Agriculture',
          subcategory: 'Fibres',
          current_price: 0.72,
          previous_price: 0.69,
          unit: 'USD/livre',
          currency: 'USD',
          market: 'ICE',
          description: 'Coton brut',
          country_origin: 'Mali',
          icon: 'Shirt',
          show_on_homepage: true,
          is_active: true,
          display_order: 3
        },
        {
          name: 'Or',
          symbol: 'GOLD',
          category: 'Métaux précieux',
          subcategory: 'Précieux',
          current_price: 1985.50,
          previous_price: 1978.20,
          unit: 'USD/once',
          currency: 'USD',
          market: 'COMEX',
          description: 'Or fin 99.9%',
          country_origin: 'Mali',
          icon: 'Coins',
          show_on_homepage: true,
          is_active: true,
          display_order: 4
        },
        {
          name: 'Pétrole Brent',
          symbol: 'BRENT',
          category: 'Énergie',
          subcategory: 'Pétrole',
          current_price: 82.45,
          previous_price: 81.20,
          unit: 'USD/baril',
          currency: 'USD',
          market: 'ICE',
          description: 'Pétrole brut Brent',
          country_origin: 'Mer du Nord',
          icon: 'Fuel',
          show_on_homepage: true,
          is_active: true,
          display_order: 5
        }
      ];

      // Calculer les variations
      testCommodities.forEach(commodity => {
        if (commodity.previous_price && commodity.current_price) {
          commodity.change_amount = commodity.current_price - commodity.previous_price;
          commodity.change_percent = ((commodity.change_amount / commodity.previous_price) * 100);
        }
      });

      const { data: insertedCommodities, error: insertError } = await supabase
        .from('commodities')
        .insert(testCommodities)
        .select();

      if (insertError) {
        console.error('❌ Erreur lors de l\'insertion des données:', insertError.message);
      } else {
        console.log(`✅ ${insertedCommodities?.length || 0} matières premières ajoutées avec succès`);
      }
    }

    // 3. Vérification finale
    console.log('\n🔍 Vérification finale...');
    
    const { data: finalCheck, error: finalError } = await supabase
      .from('commodities')
      .select('id, name, category, is_active')
      .eq('is_active', true);

    if (finalError) {
      console.error('❌ Erreur lors de la vérification finale:', finalError.message);
    } else {
      console.log(`✅ Système configuré avec succès! ${finalCheck?.length || 0} matières premières actives`);
      
      // Grouper par catégorie
      const byCategory = {};
      finalCheck?.forEach(commodity => {
        if (!byCategory[commodity.category]) {
          byCategory[commodity.category] = [];
        }
        byCategory[commodity.category].push(commodity.name);
      });

      console.log('\n📊 Répartition par catégorie:');
      Object.entries(byCategory).forEach(([category, commodities]) => {
        console.log(`  ${category}: ${commodities.length} matières premières`);
        commodities.forEach(name => console.log(`    • ${name}`));
      });
    }

    console.log('\n🎉 Configuration terminée avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('  1. Vérifiez la page /marche pour voir les matières premières');
    console.log('  2. Utilisez le dashboard pour gérer les prix');
    console.log('  3. Configurez les mises à jour automatiques des prix');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (require.main === module) {
  setupCommoditiesSystem()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { setupCommoditiesSystem };
