import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '.env') })

// Récupérer les variables d'environnement
const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Erreur: Les variables d\'environnement VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function createAdminUser() {
  const email = 'salika.famanta@aikio.co'
  const password = 'AmaniFinance2024!' // Mot de passe fort généré
  
  console.log('Création de l\'utilisateur admin...')
  
  try {
    // 1. Créer l'utilisateur
    const { data: authData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Salika Famanta'
      }
    })

    if (signUpError) throw signUpError

    const userId = authData.user.id
    console.log('✅ Utilisateur créé avec succès. ID:', userId)

    // 2. Ajouter à la table utilisateurs
    const { error: profileError } = await supabase
      .from('utilisateurs')
      .insert([{ 
        id: userId,
        email: email,
        nom: 'Famanta',
        prenom: 'Salika'
      }])

    if (profileError) {
      console.warn('⚠️ L\'utilisateur a été créé mais il y a eu un problème avec la table utilisateurs:', profileError.message)
      console.log('Vous pouvez ajouter manuellement l\'utilisateur à la table utilisateurs avec l\'ID:', userId)
      return
    }

    console.log('✅ Administrateur créé avec succès dans la table utilisateurs!')
    console.log('📧 Email:', email)
    console.log('🔑 Mot de passe:', password)
    console.log('🆔 ID utilisateur:', userId)
    console.log('\n⚠️ IMPORTANT: Changez ce mot de passe après votre première connexion! ⚠️')
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'administrateur:')
    console.error(error)
    
    if (error.message.includes('already registered')) {
      console.log('\nℹ️  Cet utilisateur existe déjà. Connectez-vous avec l\'email et le mot de passe.')
    }
  }
}

createAdminUser()
