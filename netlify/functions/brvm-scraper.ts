import { Handler } from '@netlify/functions';

interface BRVMIndex {
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  lastUpdate: string;
}

interface BRVMData {
  composite: BRVMIndex;
  fcfa_eur: BRVMIndex;
  inflation: BRVMIndex;
  taux_bceao: BRVMIndex;
}

// Fonction pour scraper les données BRVM
const scrapeBRVMData = async (): Promise<BRVMData> => {
  try {
    // Note: En production, vous utiliseriez Puppeteer ou une API tierce
    // Pour l'instant, on simule avec des données réalistes qui changent
    
    const now = new Date();
    const baseVariation = Math.sin(now.getTime() / (1000 * 60 * 60)) * 2; // Variation basée sur l'heure
    
    return {
      composite: {
        name: "BRVM Composite",
        value: (185.42 + baseVariation).toFixed(2),
        change: (4.28 + baseVariation * 0.5).toFixed(2),
        changePercent: `${(2.3 + baseVariation * 0.3).toFixed(1)}%`,
        isPositive: baseVariation > -1,
        lastUpdate: now.toISOString()
      },
      fcfa_eur: {
        name: "FCFA/EUR",
        value: (655.957 - baseVariation * 0.1).toFixed(3),
        change: (-0.65 - baseVariation * 0.1).toFixed(2),
        changePercent: `${(-0.1 - baseVariation * 0.05).toFixed(1)}%`,
        isPositive: baseVariation < 0.5,
        lastUpdate: now.toISOString()
      },
      inflation: {
        name: "Inflation UEMOA",
        value: `${(4.2 + Math.abs(baseVariation) * 0.1).toFixed(1)}%`,
        change: (0.5 + baseVariation * 0.1).toFixed(1),
        changePercent: `${(0.5 + baseVariation * 0.1).toFixed(1)}%`,
        isPositive: false,
        lastUpdate: now.toISOString()
      },
      taux_bceao: {
        name: "Taux BCEAO",
        value: "3.5%",
        change: "0",
        changePercent: "0%",
        isPositive: true,
        lastUpdate: now.toISOString()
      }
    };
  } catch (error) {
    console.error('Erreur lors du scraping BRVM:', error);
    throw new Error('Impossible de récupérer les données BRVM');
  }
};

export const handler: Handler = async (event, context) => {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight' }),
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const data = await scrapeBRVMData();
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Cache-Control': 'max-age=300', // Cache for 5 minutes
      },
      body: JSON.stringify({
        success: true,
        data,
        timestamp: new Date().toISOString()
      }),
    };
  } catch (error) {
    console.error('Erreur dans la fonction BRVM:', error);
    
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
