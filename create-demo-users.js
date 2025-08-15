require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Récupérer les variables d'environnement
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Erreur: Les variables d'environnement VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Utilisateurs demo à créer
const demoUsers = [
  {
    email: "admin@amani.demo",
    password: "admin123",
    role: "admin",
    firstName: "Amadou",
    lastName: "Sanogo",
    organization: "Amani Platform",
    permissions: ["*"], // Admin a toutes les permissions
  },
  {
    email: "editeur@amani.demo",
    password: "editeur123",
    role: "editor",
    firstName: "Fatou",
    lastName: "Diallo",
    organization: "Journal du Mali",
    permissions: ["create_content", "edit_content", "publish_content"],
  },
  {
    email: "analyste@amani.demo",
    password: "analyste123",
    role: "analyst",
    firstName: "Ibrahim",
    lastName: "Touré",
    organization: "BCEAO",
    permissions: ["create_content", "view_analytics", "manage_indices"],
  },
  {
    email: "moderateur@amani.demo",
    password: "moderateur123",
    role: "moderator",
    firstName: "Aïcha",
    lastName: "Koné",
    organization: "Amani Platform",
    permissions: ["moderate_comments", "view_analytics"],
  },
  {
    email: "abonne@amani.demo",
    password: "abonne123",
    role: "subscriber",
    firstName: "Moussa",
    lastName: "Traoré",
    organization: "Banque Atlantique",
    permissions: ["view_premium_content"],
  },
];

async function createDemoUsers() {
  console.log("🚀 Création des utilisateurs demo...\n");

  for (const user of demoUsers) {
    try {
      console.log(`Création de ${user.email}...`);

      // 1. Créer l'utilisateur dans auth
      const { data: authData, error: signUpError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            role: user.role,
            first_name: user.firstName,
            last_name: user.lastName,
          },
        });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          console.log(`⚠️  ${user.email} existe déjà, ignoré.`);
          continue;
        }
        throw signUpError;
      }

      const userId = authData.user.id;
      console.log(`✅ Auth créé. ID: ${userId}`);

      // 2. Créer le profil dans la table profiles
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        organization: user.organization,
        permissions: user.permissions,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error(
          `❌ Erreur profil pour ${user.email}:`,
          profileError.message,
        );
        continue;
      }

      console.log(`✅ Profil créé pour ${user.email}`);
      console.log(`🔑 Mot de passe: ${user.password}\n`);
    } catch (error) {
      console.error(`❌ Erreur pour ${user.email}:`, error.message);
    }
  }

  console.log("🎉 Création des utilisateurs demo terminée!");
  console.log("\n📋 Récapitulatif des comptes:");
  console.log("========================");
  demoUsers.forEach((user) => {
    console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
  });
  console.log(
    "\n⚠️  IMPORTANT: Ces mots de passe sont temporaires, changez-les après la première connexion!",
  );
}

createDemoUsers();
