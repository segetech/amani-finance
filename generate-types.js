#!/usr/bin/env node

/**
 * Script pour générer les types TypeScript à partir du schéma Supabase
 * Usage: node generate-types.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_PROJECT_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_PROJECT_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variables d\'environnement manquantes:');
  console.error('   VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requis');
  process.exit(1);
}

// Extraire l'ID du projet depuis l'URL
const projectId = SUPABASE_PROJECT_URL.replace('https://', '').replace('.supabase.co', '');

console.log('🔄 Génération des types TypeScript depuis Supabase...');
console.log(`📋 Projet: ${projectId}`);

try {
  // Générer les types avec la CLI Supabase
  const command = `npx supabase gen types typescript --project-id ${projectId} --schema public`;
  
  console.log(`🚀 Commande: ${command}`);
  
  const output = execSync(command, { 
    encoding: 'utf8',
    env: {
      ...process.env,
      SUPABASE_ACCESS_TOKEN: SUPABASE_ANON_KEY
    }
  });

  // Sauvegarder les types générés
  const typesPath = path.join(__dirname, 'client', 'types', 'database.generated.ts');
  
  // Créer le dossier si nécessaire
  const typesDir = path.dirname(typesPath);
  if (!fs.existsSync(typesDir)) {
    fs.mkdirSync(typesDir, { recursive: true });
  }

  // Écrire les types
  fs.writeFileSync(typesPath, output);
  
  console.log('✅ Types générés avec succès!');
  console.log(`📁 Fichier: ${typesPath}`);
  
  // Afficher un aperçu
  const preview = output.substring(0, 500);
  console.log('\n📋 Aperçu des types générés:');
  console.log('─'.repeat(50));
  console.log(preview + (output.length > 500 ? '...' : ''));
  console.log('─'.repeat(50));
  
} catch (error) {
  console.error('❌ Erreur lors de la génération des types:');
  console.error(error.message);
  
  // Instructions alternatives
  console.log('\n💡 Solutions alternatives:');
  console.log('1. Installer la CLI Supabase: npm install -g supabase');
  console.log('2. Se connecter: supabase login');
  console.log(`3. Générer manuellement: supabase gen types typescript --project-id ${projectId}`);
  
  process.exit(1);
}
