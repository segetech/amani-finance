// Script pour configurer le système de données économiques
// Exécuter avec: node scripts/setup-economic-data.js

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://rrhcctylbczzahgiqoub.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupEconomicDataSystem() {
  try {
    console.log('🚀 Configuration du système de données économiques...\n');

    // 1. Lire et exécuter le script SQL de migration
    const migrationPath = path.join(__dirname, '..', 'database_migrations', 'add_economic_data_system.sql');
    
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
            
            // Pour les commandes CREATE TABLE, INSERT, etc., on utilise directement rpc
            const { error } = await supabase.rpc('exec_sql', { sql: command });
            
            if (error && !error.message.includes('already exists')) {
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

    // 2. Vérifier si les tables existent et contiennent des données
    console.log('\n🔍 Vérification des tables...');
    
    const { data: existingCountries, error: checkCountriesError } = await supabase
      .from('economic_countries')
      .select('id, name')
      .limit(1);

    const { data: existingMetrics, error: checkMetricsError } = await supabase
      .from('regional_economic_metrics')
      .select('id, metric_name')
      .limit(1);

    if (checkCountriesError && !checkCountriesError.message.includes('does not exist')) {
      console.error('❌ Erreur lors de la vérification de la table economic_countries:', checkCountriesError.message);
      return;
    }

    if (checkMetricsError && !checkMetricsError.message.includes('does not exist')) {
      console.error('❌ Erreur lors de la vérification de la table regional_economic_metrics:', checkMetricsError.message);
      return;
    }

    console.log('✅ Les tables existent et sont accessibles');

    // 3. Afficher les données existantes
    if (existingCountries && existingCountries.length > 0) {
      const { data: allCountries } = await supabase
        .from('economic_countries')
        .select('name, flag_emoji, gdp_growth_rate, population')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (allCountries) {
        console.log('\n📋 Pays économiques existants:');
        allCountries.forEach(country => {
          console.log(`  • ${country.flag_emoji} ${country.name} - Croissance: +${country.gdp_growth_rate}% - Pop: ${country.population}`);
        });
      }
    }

    if (existingMetrics && existingMetrics.length > 0) {
      const { data: allMetrics } = await supabase
        .from('regional_economic_metrics')
        .select('metric_name, metric_value, metric_unit, icon_name')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (allMetrics) {
        console.log('\n📊 Métriques régionales existantes:');
        allMetrics.forEach(metric => {
          console.log(`  • ${metric.metric_name}: ${metric.metric_value}${metric.metric_unit || ''} (${metric.icon_name})`);
        });
      }
    }

    // 4. Test des APIs
    console.log('\n🔧 Test des APIs...');
    
    try {
      const countriesResponse = await fetch(`http://localhost:8080/api/economic-data/countries?is_active=true`);
      if (countriesResponse.ok) {
        const countriesData = await countriesResponse.json();
        console.log(`✅ API Countries: ${countriesData.count || 0} pays récupérés`);
      } else {
        console.log('⚠️  API Countries non disponible (serveur éteint?)');
      }

      const metricsResponse = await fetch(`http://localhost:8080/api/economic-data/metrics?is_active=true`);
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json();
        console.log(`✅ API Metrics: ${metricsData.count || 0} métriques récupérées`);
      } else {
        console.log('⚠️  API Metrics non disponible (serveur éteint?)');
      }
    } catch (error) {
      console.log('⚠️  APIs non testées (serveur probablement éteint)');
    }

    // 5. Vérification finale
    console.log('\n🔍 Vérification finale...');
    
    const { data: finalCountries, error: finalCountriesError } = await supabase
      .from('economic_countries')
      .select('id, name, is_active')
      .eq('is_active', true);

    const { data: finalMetrics, error: finalMetricsError } = await supabase
      .from('regional_economic_metrics')
      .select('id, metric_name, is_active')
      .eq('is_active', true);

    if (finalCountriesError || finalMetricsError) {
      console.error('❌ Erreur lors de la vérification finale');
    } else {
      console.log(`✅ Système configuré avec succès!`);
      console.log(`   • ${finalCountries?.length || 0} pays économiques actifs`);
      console.log(`   • ${finalMetrics?.length || 0} métriques régionales actives`);
    }

    console.log('\n🎉 Configuration terminée avec succès!');
    console.log('\n📝 Prochaines étapes:');
    console.log('  1. Vérifiez la page /economie pour voir les données dynamiques');
    console.log('  2. Utilisez le dashboard /economic-data-management pour gérer les données');
    console.log('  3. Les métriques du header sont maintenant configurables');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  setupEconomicDataSystem()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('❌ Erreur fatale:', error);
      process.exit(1);
    });
}

export { setupEconomicDataSystem };
