// Service pour récupérer les données BRVM
export interface BRVMIndex {
  name: string;
  value: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  lastUpdate: string;
}

export interface BRVMData {
  composite: BRVMIndex;
  fcfa_eur: BRVMIndex;
  inflation: BRVMIndex;
  taux_bceao: BRVMIndex;
}

// Fonction pour récupérer les données BRVM
export const fetchBRVMData = async (): Promise<BRVMData> => {
  try {
    // Essayer d'abord notre fonction Netlify
    const response = await fetch('/.netlify/functions/brvm-scraper');

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données BRVM');
    }

    const result = await response.json();
    if (result.success && result.data) {
      return result.data;
    } else {
      throw new Error(result.error || 'Données BRVM invalides');
    }
  } catch (error) {
    console.error('Erreur BRVM API:', error);
    
    // Données de fallback (mock data)
    return {
      composite: {
        name: "BRVM Composite",
        value: "185.42",
        change: "+4.28",
        changePercent: "+2.3%",
        isPositive: true,
        lastUpdate: new Date().toISOString()
      },
      fcfa_eur: {
        name: "FCFA/EUR",
        value: "655.957",
        change: "-0.65",
        changePercent: "-0.1%",
        isPositive: false,
        lastUpdate: new Date().toISOString()
      },
      inflation: {
        name: "Inflation UEMOA",
        value: "4.2%",
        change: "+0.5",
        changePercent: "+0.5%",
        isPositive: false,
        lastUpdate: new Date().toISOString()
      },
      taux_bceao: {
        name: "Taux BCEAO",
        value: "3.5%",
        change: "0",
        changePercent: "0%",
        isPositive: true,
        lastUpdate: new Date().toISOString()
      }
    };
  }
};

// Hook React pour utiliser les données BRVM
export const useBRVMData = () => {
  const [data, setData] = React.useState<BRVMData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const brvmData = await fetchBRVMData();
        setData(brvmData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Rafraîchir toutes les 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error };
};
