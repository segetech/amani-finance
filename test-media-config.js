// Script de test pour vérifier la configuration des médias
import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Vérification de la configuration des médias...\n');

// Test UploadThing
console.log('📸 UploadThing Configuration:');
const uploadthingToken = process.env.UPLOADTHING_TOKEN;
if (uploadthingToken) {
  try {
    const decoded = JSON.parse(Buffer.from(uploadthingToken, 'base64').toString());
    console.log('✅ Token UploadThing valide');
    console.log('   App ID:', decoded.appId);
    console.log('   Régions:', decoded.regions);
  } catch (error) {
    console.log('❌ Token UploadThing invalide:', error.message);
  }
} else {
  console.log('❌ UPLOADTHING_TOKEN manquant');
}

// Test Mux
console.log('\n🎥 Mux Configuration:');
const muxTokenId = process.env.MUX_TOKEN_ID;
const muxTokenSecret = process.env.MUX_TOKEN_SECRET;

if (muxTokenId) {
  console.log('✅ MUX_TOKEN_ID configuré:', muxTokenId);
} else {
  console.log('❌ MUX_TOKEN_ID manquant');
}

if (muxTokenSecret && muxTokenSecret !== 'YOUR_MUX_TOKEN_SECRET') {
  console.log('✅ MUX_TOKEN_SECRET configuré');
} else {
  console.log('❌ MUX_TOKEN_SECRET manquant ou non configuré');
}

// Test des URLs
console.log('\n🌐 URLs de test:');
console.log('UploadThing API:', 'https://api.uploadthing.com');
console.log('Mux API:', 'https://api.mux.com');

console.log('\n📋 Prochaines étapes:');
if (!muxTokenSecret || muxTokenSecret === 'YOUR_MUX_TOKEN_SECRET') {
  console.log('1. Ajoutez votre MUX_TOKEN_SECRET dans le fichier .env');
}
console.log('2. Testez l\'upload d\'images avec UploadThing');
console.log('3. Testez l\'upload de vidéos avec Mux');
console.log('4. Intégrez les composants dans vos formulaires');

console.log('\n🚀 Configuration terminée !');
