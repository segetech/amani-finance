/**
 * Script pour initialiser les indices BRVM de base
 * Usage: node scripts/init-brvm-indices.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Données des indices BRVM de base
const indicesData = [
  {
    slug: 'brvm-composite',
    name: 'BRVM Composite',
    code: 'BRVM-C',
    metadata: {
      unit: 'points',
      source: 'BRVM',
      description: 'Indice composite de la Bourse Régionale des Valeurs Mobilières'
    },
    is_active: true
  },
  {
    slug: 'brvm-10',
    name: 'BRVM 10',
    code: 'BRVM-10',
    metadata: {
      unit: 'points',
      source: 'BRVM',
      description: 'Indice des 10 principales capitalisations de la BRVM'
    },
    is_active: true
  },
  {
    slug: 'fcfa-eur',
    name: 'FCFA/EUR',
    code: 'XOF/EUR',
    metadata: {
      unit: 'currency',
      source: 'BCE',
      description: 'Taux de change Franc CFA / Euro'
    },
    is_active: true
  },
  {
    slug: 'inflation-uemoa',
    name: 'Inflation UEMOA',
    code: 'INF-UEMOA',
    metadata: {
      unit: 'percent',
      source: 'BCEAO',
      description: 'Taux d\'inflation de l\'Union Économique et Monétaire Ouest Africaine'
    },
    is_active: true
  }
];

// Points de données initiales
const initialPoints = [
  // BRVM Composite
  { indice_slug: 'brvm-composite', close: 185.42, change_percent: '2.3', direction: 'up' },
  // BRVM 10
  { indice_slug: 'brvm-10', close: 165.78, change_percent: '1.8', direction: 'up' },
  // FCFA/EUR
  { indice_slug: 'fcfa-eur', close: 655.957, change_percent: '-0.1', direction: 'down' },
  // Inflation
  { indice_slug: 'inflation-uemoa', close: 4.2, change_percent: '0.5', direction: 'up' }
];

async function initBrvmIndices() {
  try {
    console.log('🚀 Initialisation des indices BRVM...');

    // 1. Créer ou récupérer un groupe par défaut
    console.log('📁 Création du groupe par défaut...');
    const { data: group, error: groupError } = await supabase
      .from('brvm_index_groups')
      .upsert([{
        slug: 'indices-principaux',
        name: 'Indices Principaux',
        description: 'Indices économiques et financiers principaux'
      }], { onConflict: 'slug' })
      .select()
      .single();

    if (groupError) {
      console.error('❌ Erreur création groupe:', groupError);
      return;
    }

    console.log('✅ Groupe créé:', group.name);

    // 2. Créer les indices
    console.log('📊 Création des indices...');
    const indicesWithGroup = indicesData.map(indice => ({
      ...indice,
      group_id: group.id
    }));

    const { data: createdIndices, error: indicesError } = await supabase
      .from('brvm_indices')
      .upsert(indicesWithGroup, { onConflict: 'slug' })
      .select();

    if (indicesError) {
      console.error('❌ Erreur création indices:', indicesError);
      return;
    }

    console.log(`✅ ${createdIndices.length} indices créés`);

    // 3. Créer les points initiaux
    console.log('📈 Ajout des points initiaux...');
    
    // Mapper les slugs aux IDs
    const indiceMap = new Map();
    createdIndices.forEach(indice => {
      indiceMap.set(indice.slug, indice.id);
    });

    const pointsWithIds = initialPoints.map(point => ({
      indice_id: indiceMap.get(point.indice_slug),
      close: point.close,
      change_percent: point.change_percent,
      direction: point.direction,
      created_at: new Date().toISOString()
    })).filter(point => point.indice_id); // Filtrer les IDs valides

    const { data: createdPoints, error: pointsError } = await supabase
      .from('brvm_index_points')
      .insert(pointsWithIds)
      .select();

    if (pointsError) {
      console.error('❌ Erreur création points:', pointsError);
      return;
    }

    console.log(`✅ ${createdPoints.length} points initiaux créés`);

    // 4. Résumé
    console.log('\n🎉 Initialisation terminée avec succès !');
    console.log('\n📋 Indices créés :');
    createdIndices.forEach(indice => {
      console.log(`  • ${indice.name} (${indice.code})`);
    });

    console.log('\n🔗 Accédez au dashboard pour gérer vos indices :');
    console.log('   http://localhost:8082/dashboard/brvm-indices-management');
    
    console.log('\n🏠 Consultez la page d\'accueil pour voir les indices :');
    console.log('   http://localhost:8082/');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

// Exécuter le script
initBrvmIndices();
