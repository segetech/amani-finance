# Déploiement de la Edge Function pour création d'utilisateurs

## 📋 Prérequis

1. **Supabase CLI installé** :
   ```bash
   npm install -g supabase
   ```

2. **Connexion à votre projet** :
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_ID
   ```

## 🚀 Déploiement

1. **Déployer les fonctions** :
   ```bash
   supabase functions deploy create-user
   supabase functions deploy reset-user-password
   ```

2. **Vérifier le déploiement** :
   ```bash
   supabase functions list
   ```

## ⚙️ Configuration requise

### Variables d'environnement dans Supabase Dashboard

Allez dans **Settings > Edge Functions** et ajoutez :

- `SUPABASE_URL` : URL de votre projet
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service role (avec privilèges admin)

### Permissions RLS

Assurez-vous que votre utilisateur admin a les bonnes permissions dans la table `profiles` :

```sql
-- Vérifier les rôles de votre utilisateur
SELECT id, email, roles FROM profiles WHERE email = 'votre-email@example.com';

-- Ajouter le rôle admin si nécessaire
UPDATE profiles 
SET roles = array_append(roles, 'admin') 
WHERE email = 'votre-email@example.com' 
AND NOT ('admin' = ANY(roles));
```

## 🧪 Test de la fonction

Vous pouvez tester la fonction directement :

```bash
curl -X POST 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/create-user' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "roles": ["user"],
    "generate_password": true
  }'
```

## ✅ Fonctionnalités

### Création d'utilisateurs (`create-user`)
- ✅ **Création sécurisée** : Utilise la clé service role
- ✅ **Génération automatique** : Mots de passe sécurisés automatiques
- ✅ **Mots de passe personnalisés** : Option pour définir un mot de passe spécifique
- ✅ **Vérification des permissions** : Seuls les admins peuvent créer des utilisateurs
- ✅ **Gestion d'erreurs** : Rollback automatique en cas d'échec
- ✅ **Email confirmé** : Les utilisateurs peuvent se connecter immédiatement

### Réinitialisation de mots de passe (`reset-user-password`)
- ✅ **Réinitialisation sécurisée** : Génère un nouveau mot de passe aléatoirement
- ✅ **Vérification des permissions** : Seuls les admins peuvent réinitialiser
- ✅ **Confirmation immédiate** : L'utilisateur peut se connecter avec le nouveau mot de passe
- ✅ **Logging sécurisé** : Enregistre les actions de réinitialisation

## 🔒 Sécurité

- La fonction vérifie que l'utilisateur appelant a le rôle `admin`
- Utilise la clé service role uniquement côté serveur
- Génère des mots de passe sécurisés (12 caractères minimum)
- Rollback automatique si la création du profil échoue

## 📝 Notes

- Les utilisateurs créés recevront un email de confirmation automatiquement
- Le mot de passe généré est affiché une seule fois dans l'interface
- Les utilisateurs peuvent changer leur mot de passe après la première connexion
