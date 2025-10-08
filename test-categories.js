// Script pour tester les catégories dans Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables Supabase manquantes dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCategories() {
  console.log('🔍 Test des catégories Supabase...\n');

  try {
    // Test 1: Vérifier la table content_categories
    console.log('1. Test de la table content_categories:');
    const { data: categories, error: catError } = await supabase
      .from('content_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (catError) {
      console.error('❌ Erreur content_categories:', catError);
    } else {
      console.log('✅ Catégories trouvées:', categories?.length || 0);
      categories?.forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug}) - Active: ${cat.is_active}`);
      });
    }

    // Test 2: Vérifier l'ancienne table categories (si elle existe)
    console.log('\n2. Test de l\'ancienne table categories:');
    const { data: oldCategories, error: oldCatError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);

    if (oldCatError) {
      console.log('ℹ️  Table categories non trouvée (normal si migration terminée)');
    } else {
      console.log('⚠️  Ancienne table categories encore présente:', oldCategories?.length || 0);
    }

    // Test 3: Créer une catégorie de test si aucune n'existe
    if (!categories || categories.length === 0) {
      console.log('\n3. Création de catégories de test...');
      
      const testCategories = [
        {
          name: 'Économie',
          slug: 'economie',
          description: 'Articles sur l\'économie malienne et régionale',
          color: '#3B82F6',
          icon: 'TrendingUp',
          sort_order: 1,
          is_active: true,
          content_types: ['article', 'podcast']
        },
        {
          name: 'Marchés Financiers',
          slug: 'marches-financiers',
          description: 'Analyses des marchés financiers',
          color: '#10B981',
          icon: 'BarChart3',
          sort_order: 2,
          is_active: true,
          content_types: ['article', 'indice']
        },
        {
          name: 'Technologie',
          slug: 'technologie',
          description: 'Innovation et technologie financière',
          color: '#8B5CF6',
          icon: 'Cpu',
          sort_order: 3,
          is_active: true,
          content_types: ['article', 'podcast']
        }
      ];

      for (const category of testCategories) {
        const { data, error } = await supabase
          .from('content_categories')
          .insert(category)
          .select()
          .single();

        if (error) {
          console.error(`❌ Erreur création ${category.name}:`, error);
        } else {
          console.log(`✅ Catégorie créée: ${data.name}`);
        }
      }
    }

    // Test 4: Vérifier les contenus existants
    console.log('\n4. Test des contenus existants:');
    const { data: contents, error: contentError } = await supabase
      .from('contents')
      .select('id, title, type, category_id, category')
      .limit(5);

    if (contentError) {
      console.error('❌ Erreur contents:', contentError);
    } else {
      console.log('✅ Contenus trouvés:', contents?.length || 0);
      contents?.forEach(content => {
        console.log(`   - ${content.title} (${content.type}) - Category ID: ${content.category_id}, Category: ${content.category}`);
      });
    }

  } catch (error) {
    console.error('💥 Erreur générale:', error);
  }
}

testCategories();
