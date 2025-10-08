# 🎯 Guide d'Utilisation des Indices BRVM

## ✅ Intégration Terminée !

Les indices BRVM sont maintenant **connectés entre le dashboard et la page d'accueil**.

## 🚀 Comment Utiliser

### 1. **Accéder au Dashboard**
- URL: `http://localhost:8082/dashboard/brvm-indices-management`
- Connectez-vous avec vos identifiants admin

### 2. **Créer des Indices**
1. Cliquez sur **"Nouveau groupe"** pour organiser vos indices
2. Cliquez sur **"Nouvel indice"** pour ajouter un indice
3. Remplissez les informations :
   - **Nom** : ex. "BRVM Composite"
   - **Code** : ex. "BRVM-C" 
   - **Unité** : "points", "percent", ou "currency"

### 3. **Saisir des Données**
#### Saisie Individuelle :
- Cliquez sur **"Ajouter un point"** sur un indice
- Saisissez la valeur de clôture
- Le système calcule automatiquement la variation %
- Définissez la date/heure ou utilisez "Maintenant"

#### Saisie Rapide (Multiple) :
- Cliquez sur **"Saisie rapide"** (bouton vert)
- Saisissez plusieurs indices en une fois
- Une seule date commune pour tous

### 4. **Voir les Résultats**
- **Page d'accueil** : `http://localhost:8082/`
- Les indices apparaissent dans la section **"Indices BRVM en temps réel"**
- Actualisation automatique des données

## 🎨 Fonctionnalités

### ✨ Dashboard
- ✅ Gestion complète des groupes d'indices
- ✅ Création et édition d'indices
- ✅ Saisie manuelle avec calculs automatiques
- ✅ Saisie en lot pour gagner du temps
- ✅ Historique des points de données

### 🏠 Page d'Accueil
- ✅ Affichage en temps réel des indices
- ✅ Indicateurs visuels (hausse/baisse)
- ✅ Dernière mise à jour affichée
- ✅ Bouton d'actualisation
- ✅ Message informatif si aucun indice configuré

## 🔧 Données de Test

Pour créer rapidement des indices de test, exécutez ce SQL dans Supabase :

```sql
-- Voir le fichier test-indices.sql pour le script complet
```

## 📊 Exemple d'Indices Typiques

1. **BRVM Composite** (BRVM-C) - points
2. **BRVM 10** (BRVM-10) - points  
3. **FCFA/EUR** (XOF/EUR) - currency
4. **Inflation UEMOA** (INF-UEMOA) - percent

## 🎯 Prochaines Étapes

1. **Créer vos premiers indices** via le dashboard
2. **Saisir des données** de test
3. **Vérifier l'affichage** sur la page d'accueil
4. **Utiliser la saisie rapide** pour l'efficacité

## 🆘 Dépannage

- **Aucun indice affiché** : Vérifiez que `is_active = true` dans la base
- **Erreurs de permissions** : Assurez-vous d'être connecté comme admin
- **Données non mises à jour** : Utilisez le bouton "Actualiser"

---

🎉 **Votre système d'indices BRVM est opérationnel !**
