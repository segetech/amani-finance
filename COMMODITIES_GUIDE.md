# 🌾 Guide du Système de Matières Premières

Ce guide explique comment utiliser et gérer le système de matières premières (commodities) d'Amani Finance.

## 📋 Vue d'ensemble

Le système de matières premières permet de :
- ✅ Afficher les prix en temps réel des commodités importantes pour l'Afrique de l'Ouest
- ✅ Gérer les données via un dashboard administrateur
- ✅ Organiser par catégories (Agriculture, Métaux précieux, Énergie, etc.)
- ✅ Calculer automatiquement les variations de prix
- ✅ Intégrer facilement de nouvelles matières premières

## 🏗️ Architecture

### Base de données
- **Table principale** : `commodities`
- **Champs clés** : nom, symbole, prix actuel, variation, catégorie, marché
- **Calculs automatiques** : variations en montant et pourcentage
- **Gestion des permissions** : RLS (Row Level Security) activé

### Frontend
- **Page publique** : `/marche` - Section matières premières intégrée
- **Dashboard admin** : `/commodities-management` - Gestion complète
- **Hook React** : `useCommodities` - Interface avec la base de données
- **Composant** : `CommoditiesSection` - Affichage modulaire

### Backend
- **API REST** : `/api/commodities/*` - CRUD complet
- **Endpoints** : GET, POST, PUT, DELETE + catégories et mise à jour en lot
- **Validation** : Champs obligatoires et calculs automatiques

## 🚀 Installation et Configuration

### 1. Exécuter la migration de base de données

```bash
# Exécuter le script SQL de migration
psql -h your-db-host -U postgres -d your-db-name -f database_migrations/add_commodities_system.sql

# OU utiliser le script Node.js automatisé
node scripts/setup-commodities.js
```

### 2. Configurer les variables d'environnement

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Vérifier l'installation

1. Aller sur `/marche` - La section matières premières doit apparaître
2. Aller sur `/commodities-management` - Le dashboard admin doit fonctionner
3. Tester l'ajout/modification d'une matière première

## 📊 Utilisation

### Pour les utilisateurs (page publique)

**Page Marché (`/marche`)**
- Visualisation des prix en temps réel
- Filtrage par catégorie
- Graphiques de variation
- Informations détaillées sur chaque commodité

### Pour les administrateurs (dashboard)

**Dashboard (`/commodities-management`)**
- ➕ **Ajouter** : Nouvelles matières premières
- ✏️ **Modifier** : Prix, descriptions, catégories
- 🗑️ **Supprimer** : Matières premières obsolètes
- 🔄 **Actualiser** : Synchronisation avec la base de données
- 📊 **Filtrer** : Par catégorie pour une gestion ciblée

## 🎯 Matières Premières Importantes pour l'Afrique de l'Ouest

### 🌾 Agriculture
- **Cacao** - Côte d'Ivoire (1er producteur mondial)
- **Café** - Important pour plusieurs pays
- **Coton** - Mali, Burkina Faso
- **Riz** - Consommation de base
- **Maïs** - Sécurité alimentaire

### 🥇 Métaux Précieux
- **Or** - Mali, Ghana, Burkina Faso
- **Argent** - Valeur refuge

### ⛽ Énergie
- **Pétrole** - Impact sur tous les coûts
- **Gaz naturel** - Énergie domestique

### 🔩 Métaux Industriels
- **Cuivre** - Infrastructure
- **Aluminium** - Construction

## 🔧 API Reference

### Endpoints disponibles

```typescript
// Récupérer toutes les matières premières
GET /api/commodities
Query params: category, is_active, show_on_homepage, limit, offset

// Récupérer une matière première
GET /api/commodities/:id

// Créer une matière première
POST /api/commodities
Body: { name, symbol, current_price, unit, category, ... }

// Mettre à jour une matière première
PUT /api/commodities/:id
Body: { current_price, previous_price, ... }

// Supprimer une matière première
DELETE /api/commodities/:id

// Récupérer les catégories
GET /api/commodities/categories

// Mise à jour en lot
POST /api/commodities/bulk-update
Body: { updates: [{ id, current_price, ... }, ...] }
```

### Exemple d'utilisation du hook React

```typescript
import { useCommodities } from '../hooks/useCommodities';

function MyComponent() {
  const { 
    commodities, 
    loading, 
    error, 
    updateCommodity,
    createCommodity 
  } = useCommodities({ 
    category: 'Agriculture',
    show_on_homepage: true 
  });

  // Utiliser les données...
}
```

## 🔄 Mise à jour des Prix

### Manuelle (Dashboard)
1. Aller sur `/commodities-management`
2. Cliquer sur "Modifier" pour une matière première
3. Saisir le nouveau prix
4. Le système calcule automatiquement les variations

### Programmatique (API)
```javascript
// Mise à jour d'un prix
await fetch('/api/commodities/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    current_price: 1850.00,
    previous_price: 1820.00
    // change_amount et change_percent calculés automatiquement
  })
});
```

### En lot (pour intégrations externes)
```javascript
// Mise à jour de plusieurs prix d'un coup
await fetch('/api/commodities/bulk-update', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    updates: [
      { id: '123', current_price: 1850.00, previous_price: 1820.00 },
      { id: '456', current_price: 82.50, previous_price: 81.20 }
    ]
  })
});
```

## 🎨 Personnalisation

### Ajouter de nouvelles catégories
1. Modifier les options dans `CommoditiesManagement.tsx`
2. Ajouter les icônes correspondantes dans `iconMap`
3. Mettre à jour les couleurs dans `getCategoryColor()`

### Modifier l'affichage
- **Page marché** : Éditer `CommoditiesSection.tsx`
- **Dashboard** : Éditer `CommoditiesManagement.tsx`
- **Styles** : Utiliser les classes Tailwind CSS existantes

### Intégrer des sources de données externes
1. Créer un service de synchronisation
2. Utiliser l'endpoint `/api/commodities/bulk-update`
3. Programmer des tâches cron pour les mises à jour automatiques

## 🐛 Dépannage

### Problèmes courants

**❌ "Cannot find table commodities"**
- Exécuter la migration : `node scripts/setup-commodities.js`

**❌ "Permission denied"**
- Vérifier les politiques RLS dans Supabase
- S'assurer que l'utilisateur est authentifié

**❌ "Hook useCommodities not working"**
- Vérifier les variables d'environnement Supabase
- Contrôler la connexion réseau

**❌ "Prices not updating"**
- Vérifier les permissions d'écriture
- Contrôler les logs du serveur

### Logs utiles
```bash
# Logs du serveur
npm run dev

# Logs de la base de données (Supabase Dashboard)
# Aller dans Logs > API Logs

# Logs du navigateur
# F12 > Console > Filtrer par "commodities"
```

## 📈 Évolutions Futures

### Fonctionnalités prévues
- 🔄 **Synchronisation automatique** avec des APIs de prix
- 📊 **Graphiques historiques** des prix
- 🔔 **Alertes de prix** pour les utilisateurs
- 📱 **API mobile** pour une app dédiée
- 🌍 **Géolocalisation** des prix par région
- 📈 **Analyses prédictives** basées sur l'IA

### Intégrations possibles
- **Bloomberg API** - Prix professionnels
- **Yahoo Finance** - Données gratuites
- **Alpha Vantage** - API commodités
- **Quandl** - Données historiques
- **APIs locales** - Bourses africaines

## 🤝 Contribution

Pour contribuer au système de matières premières :

1. **Fork** le projet
2. **Créer** une branche feature
3. **Tester** les modifications
4. **Documenter** les changements
5. **Soumettre** une pull request

### Standards de code
- TypeScript strict
- Tests unitaires pour les nouvelles fonctionnalités
- Documentation des APIs
- Respect des conventions de nommage

---

## 📞 Support

Pour toute question ou problème :
- 📧 **Email** : support@amani-finance.com
- 💬 **Discord** : Serveur de développement
- 📖 **Documentation** : Wiki du projet
- 🐛 **Bugs** : Issues GitHub

---

*Dernière mise à jour : Octobre 2024*
