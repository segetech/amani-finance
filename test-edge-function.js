// Script de test pour la Edge Function create-user
// Exécuter avec: node test-edge-function.js

const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Remplacez par votre URL
const ACCESS_TOKEN = 'your-access-token'; // Remplacez par votre token

async function testCreateUser() {
  try {
    console.log('🧪 Test de la Edge Function create-user...\n');

    const response = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        organization: 'Test Corp',
        roles: ['user'],
        generate_password: true
      })
    });

    console.log('📡 Status:', response.status);
    console.log('📡 Status Text:', response.statusText);

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Succès !');
      console.log('👤 Utilisateur créé:', {
        id: result.user.id,
        email: result.user.email,
        name: `${result.user.first_name} ${result.user.last_name}`,
        roles: result.user.roles
      });
      console.log('🔑 Mot de passe généré:', result.generated_password);
    } else {
      console.log('❌ Erreur:', result.error);
    }

  } catch (error) {
    console.error('💥 Erreur de connexion:', error.message);
  }
}

// Instructions d'utilisation
console.log(`
📋 Instructions pour tester la Edge Function:

1. Remplacez SUPABASE_URL par votre URL Supabase
2. Obtenez votre access token:
   - Connectez-vous à votre app
   - Ouvrez les DevTools (F12)
   - Dans la console, tapez: localStorage.getItem('supabase.auth.token')
   - Copiez la valeur du "access_token"
3. Remplacez ACCESS_TOKEN par votre token
4. Exécutez: node test-edge-function.js

⚠️  Assurez-vous d'avoir déployé la fonction avec:
   supabase functions deploy create-user
`);

// Décommentez la ligne suivante pour exécuter le test
// testCreateUser();
