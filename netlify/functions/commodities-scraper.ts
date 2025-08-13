import { Handler } from '@netlify/functions';

interface Commodity {
  name: string;
  symbol: string;
  price: string;
  currency: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  lastUpdate: string;
  unit: string;
  description: string;
  source: string;
}

interface CommoditiesData {
  gold: Commodity;
  cotton: Commodity;
  oil_brent: Commodity;
  oil_wti: Commodity;
  silver: Commodity;
  platinum: Commodity;
  copper: Commodity;
  coffee: Commodity;
  cocoa: Commodity;
  timestamp: string;
  source: string;
}

// Cache pour éviter trop d'appels API
let commoditiesCache: { data: CommoditiesData; timestamp: number } | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes pour les commodités

// Fonction principale pour récupérer les prix des commodités
const getCommoditiesData = async (): Promise<CommoditiesData> => {
  // Vérifier le cache
  if (commoditiesCache && (Date.now() - commoditiesCache.timestamp) < CACHE_DURATION) {
    console.log('📦 Données commodités récupérées du cache');
    return commoditiesCache.data;
  }

  try {
    console.log('🔄 Récupération des prix des commodités...');
    
    const data = await fetchRealCommoditiesPrices();
    
    // Mettre en cache
    commoditiesCache = {
      data,
      timestamp: Date.now()
    };
    
    console.log('✅ Prix des commodités récupérés avec succès');
    return data;
    
  } catch (error) {
    console.error('❌ Erreur récupération commodités:', error);
    
    // Fallback vers données simulées réalistes
    const fallbackData = getRealisticCommoditiesData();
    
    commoditiesCache = {
      data: fallbackData,
      timestamp: Date.now()
    };
    
    return fallbackData;
  }
};

// Fonction pour récupérer les vrais prix (implémentation future avec APIs)
const fetchRealCommoditiesPrices = async (): Promise<CommoditiesData> => {
  const now = new Date();
  
  // En production, ici on utiliserait :
  // - Alpha Vantage API pour les métaux précieux
  // - Yahoo Finance API pour les commodités
  // - APIs spécialisées comme Quandl, FRED, etc.
  
  try {
    // Simulation de fluctuations réalistes basées sur l'heure et les tendances de marché
    const marketHour = now.getUTCHours();
    const isAsianMarketHours = marketHour >= 0 && marketHour <= 8;
    const isEuropeanMarketHours = marketHour >= 7 && marketHour <= 16;
    const isAmericanMarketHours = marketHour >= 13 && marketHour <= 21;
    
    // Facteur de volatilité basé sur les heures de marché
    let volatilityFactor = 0.5; // Base
    if (isAsianMarketHours) volatilityFactor = 0.8;
    if (isEuropeanMarketHours) volatilityFactor = 1.0;
    if (isAmericanMarketHours) volatilityFactor = 1.2;
    
    // Générateur de prix réaliste
    const generatePrice = (base: number, maxChange: number, unit: string, currency: string = 'USD') => {
      const randomChange = (Math.random() - 0.5) * 2 * maxChange * volatilityFactor;
      const newPrice = base + randomChange;
      const changePercent = (randomChange / base) * 100;
      
      return {
        price: newPrice.toFixed(unit === 'once troy' ? 2 : unit === 'USD/livre' ? 3 : 2),
        change: randomChange.toFixed(2),
        changePercent: `${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%`,
        isPositive: randomChange >= 0,
        currency,
        unit,
        lastUpdate: now.toISOString()
      };
    };
    
    // Prix de base réalistes (à jour fin 2024)
    const goldData = generatePrice(2025.50, 30, 'once troy');
    const silverData = generatePrice(24.85, 1.2, 'once troy');
    const platinumData = generatePrice(985.30, 40, 'once troy');
    const copperData = generatePrice(3.85, 0.2, 'USD/livre');
    const brentData = generatePrice(82.45, 4, 'USD/baril');
    const wtiData = generatePrice(78.90, 3.8, 'USD/baril');
    const cottonData = generatePrice(75.25, 3, 'cents/livre');
    const coffeeData = generatePrice(155.75, 8, 'cents/livre');
    const cocoaData = generatePrice(3250.80, 150, 'USD/tonne');
    
    return {
      gold: {
        name: "Or",
        symbol: "XAU/USD",
        ...goldData,
        description: "Métal précieux de référence, refuge en temps d'incertitude économique",
        source: "market-simulation"
      },
      silver: {
        name: "Argent",
        symbol: "XAG/USD",
        ...silverData,
        description: "Métal précieux industriel et d'investissement",
        source: "market-simulation"
      },
      platinum: {
        name: "Platine",
        symbol: "XPT/USD",
        ...platinumData,
        description: "Métal précieux rare utilisé dans l'automobile et la bijouterie",
        source: "market-simulation"
      },
      copper: {
        name: "Cuivre",
        symbol: "HG",
        ...copperData,
        description: "Métal industriel indicateur de la santé économique mondiale",
        source: "market-simulation"
      },
      oil_brent: {
        name: "Pétrole Brent",
        symbol: "BZ",
        ...brentData,
        description: "Référence mondiale pour le prix du pétrole",
        source: "market-simulation"
      },
      oil_wti: {
        name: "Pétrole WTI",
        symbol: "CL",
        ...wtiData,
        description: "Pétrole léger américain, référence pour les États-Unis",
        source: "market-simulation"
      },
      cotton: {
        name: "Coton",
        symbol: "CT",
        ...cottonData,
        description: "Fibre textile importante pour l'économie ouest-africaine",
        source: "market-simulation"
      },
      coffee: {
        name: "Café Arabica",
        symbol: "KC",
        ...coffeeData,
        description: "Café de qualité supérieure, important pour l'économie africaine",
        source: "market-simulation"
      },
      cocoa: {
        name: "Cacao",
        symbol: "CC",
        ...cocoaData,
        description: "Matière première majeure pour la Côte d'Ivoire et le Ghana",
        source: "market-simulation"
      },
      timestamp: now.toISOString(),
      source: `enhanced-simulation-${volatilityFactor.toFixed(1)}x`
    };
    
  } catch (error) {
    console.error('❌ Erreur dans fetchRealCommoditiesPrices:', error);
    throw error;
  }
};

// Données de fallback simplifiées
const getRealisticCommoditiesData = (): CommoditiesData => {
  const now = new Date();
  const variation = Math.sin(now.getTime() / (1000 * 60 * 60)) * 2;
  
  return {
    gold: {
      name: "Or",
      symbol: "XAU/USD",
      price: (2025.50 + variation * 10).toFixed(2),
      currency: "USD",
      change: (variation * 10).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 10) / 2025.50 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "once troy",
      description: "Métal précieux de référence",
      source: "fallback"
    },
    silver: {
      name: "Argent",
      symbol: "XAG/USD",
      price: (24.85 + variation * 0.5).toFixed(2),
      currency: "USD",
      change: (variation * 0.5).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 0.5) / 24.85 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "once troy",
      description: "Métal précieux industriel",
      source: "fallback"
    },
    platinum: {
      name: "Platine",
      symbol: "XPT/USD",
      price: (985.30 + variation * 20).toFixed(2),
      currency: "USD",
      change: (variation * 20).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 20) / 985.30 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "once troy",
      description: "Métal précieux rare",
      source: "fallback"
    },
    copper: {
      name: "Cuivre",
      symbol: "HG",
      price: (3.85 + variation * 0.1).toFixed(3),
      currency: "USD",
      change: (variation * 0.1).toFixed(3),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 0.1) / 3.85 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "USD/livre",
      description: "Métal industriel",
      source: "fallback"
    },
    oil_brent: {
      name: "Pétrole Brent",
      symbol: "BZ",
      price: (82.45 + variation * 2).toFixed(2),
      currency: "USD",
      change: (variation * 2).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 2) / 82.45 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "USD/baril",
      description: "Référence pétrolière",
      source: "fallback"
    },
    oil_wti: {
      name: "Pétrole WTI",
      symbol: "CL",
      price: (78.90 + variation * 1.8).toFixed(2),
      currency: "USD",
      change: (variation * 1.8).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 1.8) / 78.90 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "USD/baril",
      description: "Pétrole américain",
      source: "fallback"
    },
    cotton: {
      name: "Coton",
      symbol: "CT",
      price: (75.25 + variation * 1.5).toFixed(2),
      currency: "USD",
      change: (variation * 1.5).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 1.5) / 75.25 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "cents/livre",
      description: "Fibre textile",
      source: "fallback"
    },
    coffee: {
      name: "Café Arabica",
      symbol: "KC",
      price: (155.75 + variation * 5).toFixed(2),
      currency: "USD",
      change: (variation * 5).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 5) / 155.75 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "cents/livre",
      description: "Café de qualité",
      source: "fallback"
    },
    cocoa: {
      name: "Cacao",
      symbol: "CC",
      price: (3250.80 + variation * 100).toFixed(2),
      currency: "USD",
      change: (variation * 100).toFixed(2),
      changePercent: `${variation >= 0 ? '+' : ''}${((variation * 100) / 3250.80 * 100).toFixed(2)}%`,
      isPositive: variation >= 0,
      lastUpdate: now.toISOString(),
      unit: "USD/tonne",
      description: "Matière première africaine",
      source: "fallback"
    },
    timestamp: now.toISOString(),
    source: 'fallback-simple'
  };
};

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight' }),
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = await getCommoditiesData();
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'max-age=600', // Cache for 10 minutes
      },
      body: JSON.stringify({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        cached: commoditiesCache !== null
      }),
    };
  } catch (error) {
    console.error('Erreur dans la fonction commodités:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur'
      }),
    };
  }
};
