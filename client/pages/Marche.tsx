import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from '../components/Footer';
import { useStockIndices } from "../hooks/useStockIndices";
import { useArticles } from "../hooks/useArticles";
import { useCurrencies } from "../hooks/useCurrencies";
import CommoditiesSection from '../components/commodities/CommoditiesSection';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ReferenceLine,
  Brush,
  ComposedChart,
  Bar
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Globe,
  ArrowRight,
  Calendar,
  Eye,
  Filter,
  Download,
  Activity,
  Briefcase,
  PieChart,
  LineChart as LineChartIcon,
  RefreshCw,
  Clock,
  Target,
  Zap,
  X,
} from "lucide-react";

export default function Marche() {
  const [selectedMarket, setSelectedMarket] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showChart, setShowChart] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('1J');
  const [showAllIndices, setShowAllIndices] = useState(false);
  const [showAllCurrencies, setShowAllCurrencies] = useState(false);
  const [converterAmount, setConverterAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('XOF');
  
  // Récupérer les indices depuis la base de données
  const { indices, loading: loadingIndices, fetchIndices } = useStockIndices();
  
  // Récupérer les devises depuis la base de données
  const { currencies, getMajorCurrencies, convertCurrency: convertCurrencyFromDB } = useCurrencies();
  
  // Récupérer les articles liés au marché et à l'économie
  const { articles, loading: loadingArticles } = useArticles({ 
    status: 'published', 
    limit: 20, // Augmenté pour avoir plus d'articles à filtrer
    offset: 0
  });

  // Charger les données au montage du composant
  useEffect(() => {
    fetchIndices();
  }, [fetchIndices]);

  // Convertir les indices en format compatible avec l'affichage
  const marketData = indices?.filter(index => index.is_active).map(index => ({
    name: index.name,
    value: index.current_value?.toString() || "N/A",
    change: index.change_percent ? 
      `${index.change_percent > 0 ? "+" : ""}${index.change_percent}%` : 
      "0%",
    changeValue: index.change_amount ? 
      `${index.change_amount > 0 ? "+" : ""}${index.change_amount}` : 
      "0",
    isPositive: index.change_percent ? index.change_percent > 0 : false,
    volume: "N/A", // À implémenter plus tard
    category: index.market === "BRVM" ? "Indice" : 
              index.unit === "currency" ? "Devise" : 
              "Indice",
    high: index.previous_value ? 
      Math.max(index.current_value || 0, index.previous_value).toString() : 
      index.current_value?.toString() || "N/A",
    low: index.previous_value ? 
      Math.min(index.current_value || 0, index.previous_value).toString() : 
      index.current_value?.toString() || "N/A",
    marketCap: "N/A", // À implémenter plus tard
    symbol: index.symbol,
    currency: index.currency || "FCFA",
    unit: index.unit
  })) || [];

  // Données de fallback si aucun indice n'est disponible
  const fallbackData = [
    {
      name: "BRVM Composite",
      value: "185.42",
      change: "+2.3%",
      changeValue: "+4.16",
      isPositive: true,
      volume: "2.8M FCFA",
      category: "Indice",
      high: "187.12",
      low: "183.45",
      marketCap: "12.5T FCFA",
      symbol: "BRVM10",
      currency: "FCFA",
      unit: "points"
    }
  ];

  // Utiliser les vraies données ou les données de fallback
  const displayData = marketData.length > 0 ? marketData : fallbackData;

  // Filtrer et utiliser les vrais articles liés au marché et à l'économie
  const marketArticles = articles?.filter(article => {
    const title = article.title.toLowerCase();
    const content = article.content?.toLowerCase() || '';
    
    // Mots-clés liés au marché et à l'économie
    const marketKeywords = [
      'brvm', 'bourse', 'marché', 'économie', 'finance', 'banque', 'action', 
      'indice', 'devise', 'fcfa', 'dollar', 'euro', 'investissement', 'trading',
      'capitalisation', 'volume', 'cotation', 'entreprise', 'secteur', 'croissance',
      'inflation', 'taux', 'change', 'obligation', 'dividende', 'résultat'
    ];
    
    return marketKeywords.some(keyword => 
      title.includes(keyword) || content.includes(keyword)
    );
  }) || [];

  const recentNews = marketArticles.map(article => ({
    id: article.id,
    title: article.title,
    excerpt: article.content?.substring(0, 80) + "..." || "Extrait non disponible",
    category: "Marché", 
    publishedAt: article.created_at,
    readTime: `${Math.ceil((article.content?.length || 500) / 200)} min`,
    image: article.featured_image || "/placeholder.svg",
  })) || [
    {
      id: "1",
      title: "BRVM : Performance exceptionnelle du secteur bancaire",
      excerpt: "Les valeurs bancaires dominent les échanges avec une hausse moyenne de 3.5%",
      category: "Bourse",
      publishedAt: "2024-01-15",
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400",
    },
    {
      id: "2", 
      title: "Le FCFA se stabilise face au dollar américain",
      excerpt: "Analyse des facteurs de stabilisation de la monnaie commune",
      category: "Devises",
      publishedAt: "2024-01-14",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400",
    },
    {
      id: "3",
      title: "Orange CI : Résultats trimestriels en hausse",
      excerpt: "L'opérateur télécom affiche une croissance de 12% de son chiffre d'affaires",
      category: "Entreprises",
      publishedAt: "2024-01-13",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
    },
  ];

  const marketSummary = {
    gainers: displayData.filter(item => item.isPositive).length,
    losers: displayData.filter(item => !item.isPositive).length,
    unchanged: displayData.filter(item => item.change === "0%" || item.change === "0.00%").length,
    totalVolume: "125.8M FCFA", // À calculer dynamiquement plus tard
    marketCap: "45.2T FCFA", // À calculer dynamiquement plus tard
  };

  const categories = ["all", "Indice", "Action", "Devise", "Obligation"];
  const timeframes = [
    { value: "1d", label: "1J" },
    { value: "1w", label: "1S" },
    { value: "1m", label: "1M" },
    { value: "3m", label: "3M" },
    { value: "1y", label: "1A" },
  ];

  // Filtrer les données selon les critères sélectionnés
  const allFilteredData = selectedMarket === "all" 
    ? displayData 
    : displayData.filter(item => item.category === selectedMarket);

  // Limiter l'affichage à 5 éléments par défaut
  const filteredData = showAllIndices ? allFilteredData : allFilteredData.slice(0, 5);

  // Utiliser les vraies données de devises depuis la base de données
  const majorCurrencies = getMajorCurrencies();
  const allCurrencies = majorCurrencies.map(currency => ({
    code: currency.code,
    name: currency.name,
    flag: currency.flag_emoji || '🏳️',
    rate: currency.current_rate,
    previousRate: currency.previous_rate || currency.current_rate,
    change: currency.change_amount || 0,
    changePercent: currency.change_percent || 0,
    isPositive: (currency.change_percent || 0) >= 0,
    volume: currency.volume || 'N/A',
    high: currency.daily_high || currency.current_rate,
    low: currency.daily_low || currency.current_rate
  }));

  // Filtrer les devises (afficher 4 par défaut)
  const displayedCurrencies = showAllCurrencies ? allCurrencies : allCurrencies.slice(0, 4);

  // Fonction de conversion utilisant les vraies données
  const convertCurrency = (amount, from, to) => {
    return convertCurrencyFromDB(amount, from, to);
  };

  // Fonction pour actualiser les données
  const refreshData = () => {
    fetchIndices();
  };

  // Fonctions pour gérer les actions
  const handleShowChart = (item) => {
    setSelectedIndex(item);
    setShowChart(true);
  };

  const handleShowDetails = (item) => {
    setSelectedIndex(item);
    setShowDetails(true);
  };

  // Générer des données de graphique réalistes basées sur l'indice
  const generateChartData = (index, period = '1J') => {
    const currentValue = parseFloat(index.value) || 100;
    const changePercent = parseFloat(index.change.replace('%', '').replace('+', '')) || 0;
    
    let dataPoints, timeFormat, startHour;
    
    switch (period) {
      case '1J':
        dataPoints = 48; // Toutes les 15 minutes de 9h à 17h
        timeFormat = (i) => {
          const totalMinutes = 9 * 60 + i * 10; // Toutes les 10 minutes
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        };
        break;
      case '5J':
        dataPoints = 5;
        timeFormat = (i) => {
          const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
          return days[i] || `J${i + 1}`;
        };
        break;
      case '1M':
        dataPoints = 30;
        timeFormat = (i) => `${i + 1}`;
        break;
      case '3M':
        dataPoints = 90;
        timeFormat = (i) => `S${Math.floor(i / 7) + 1}`;
        break;
      case '1A':
        dataPoints = 12;
        timeFormat = (i) => {
          const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
          return months[i] || `M${i + 1}`;
        };
        break;
      default:
        dataPoints = 48;
        timeFormat = (i) => `${9 + Math.floor(i / 4)}:${(i % 4) * 15}`.padEnd(5, '0');
    }
    
    const data = [];
    const baseValue = currentValue - (currentValue * changePercent / 100);
    const volatility = period === '1J' ? 0.005 : period === '5J' ? 0.02 : 0.05; // Volatilité selon la période
    
    let previousValue = baseValue;
    
    for (let i = 0; i < dataPoints; i++) {
      const progress = i / (dataPoints - 1);
      
      // Tendance générale vers la valeur actuelle
      const trendValue = baseValue + (currentValue - baseValue) * progress;
      
      // Mouvement brownien pour plus de réalisme
      const randomWalk = (Math.random() - 0.5) * volatility * currentValue;
      const meanReversion = (trendValue - previousValue) * 0.3; // Retour vers la tendance
      
      const finalValue = Math.max(0, previousValue + randomWalk + meanReversion);
      previousValue = finalValue;
      
      // Calculer les volumes simulés (plus élevés en début et fin de journée pour 1J)
      let volume = 1000 + Math.random() * 2000;
      if (period === '1J') {
        const hourFactor = Math.sin((i / dataPoints) * Math.PI) + 0.5; // Plus de volume au milieu
        volume *= hourFactor;
      }
      
      data.push({
        time: timeFormat(i),
        value: parseFloat(finalValue.toFixed(2)),
        volume: Math.floor(volume),
        high: parseFloat((finalValue * (1 + Math.random() * 0.01)).toFixed(2)),
        low: parseFloat((finalValue * (1 - Math.random() * 0.01)).toFixed(2)),
        open: i === 0 ? baseValue : data[i - 1]?.value || finalValue,
        close: finalValue
      });
    }
    
    return data;
  };

  // Composant Tooltip personnalisé pour Recharts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black text-white p-3 rounded shadow-lg text-xs">
          <p className="font-semibold mb-1">{label}</p>
          <div className="space-y-1">
            <p><span className="text-gray-300">O:</span> {data.open?.toFixed(2)}</p>
            <p><span className="text-green-400">H:</span> {data.high?.toFixed(2)}</p>
            <p><span className="text-red-400">L:</span> {data.low?.toFixed(2)}</p>
            <p><span className="text-white">C:</span> {data.close?.toFixed(2)}</p>
            <p><span className="text-blue-400">Vol:</span> {data.volume?.toLocaleString()}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Composant graphique financier professionnel (version simplifiée pour éviter les erreurs Recharts)
  const FinancialChart = ({ data, selectedIndex }: any) => {
    if (!data || data.length === 0) {
      return (
        <div className="w-full bg-white rounded-lg p-8 text-center">
          <p className="text-gray-500">Aucune donnée disponible</p>
        </div>
      );
    }

    const isPositive = selectedIndex.isPositive;
    const mainColor = isPositive ? "#F59E0B" : "#EF4444";
    
    // Calculer les valeurs min/max pour le graphique SVG
    const values = data.map((d: any) => d.close || d.value || 0);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const range = maxValue - minValue;
    const padding = range * 0.1;
    
    const adjustedMax = maxValue + padding;
    const adjustedMin = minValue - padding;
    const adjustedRange = adjustedMax - adjustedMin;
    
    const width = 800;
    const height = 300;
    const volumeHeight = 60;
    
    // Créer les points du graphique
    const points = data.map((point: any, index: number) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point.close - adjustedMin) / adjustedRange) * height;
      return { x, y, ...point };
    });
    
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaData = `${pathData} L ${width} ${height} L 0 ${height} Z`;
    
    return (
      <div className="w-full bg-white rounded-lg border border-gray-200">
        {/* En-tête avec informations */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-bold text-gray-800">{selectedIndex.name}</h3>
              <div className="text-sm text-gray-600">
                VARIATION PÉRIODE: {selectedIndex.change}
              </div>
            </div>
            <div className="text-sm font-mono bg-white px-2 py-1 rounded border">
              {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
          
          {/* Statistiques OHLC */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">O:</span>
              <span className="font-mono font-semibold">{data[0]?.open?.toFixed(2) || data[0]?.close?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">H:</span>
              <span className="font-mono font-semibold text-green-600">
                {Math.max(...data.map((d: any) => d.high || d.close || 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">L:</span>
              <span className="font-mono font-semibold text-red-600">
                {Math.min(...data.map((d: any) => d.low || d.close || 0)).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-600">C:</span>
              <span className="font-mono font-semibold">{data[data.length - 1]?.close?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-mono font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {selectedIndex.change}
              </span>
            </div>
          </div>
        </div>

        {/* Graphique SVG personnalisé */}
        <div className="relative bg-white p-4">
          <div className="text-xs text-gray-500 font-semibold mb-2">📊 COURS</div>
          
          {/* Zone de prix */}
          <div className="mb-4">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="border border-gray-100 rounded">
              {/* Grille de fond */}
              <defs>
                <pattern id="grid" width="80" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 80 0 L 0 0 0 40" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                </pattern>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={mainColor} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={mainColor} stopOpacity="0.1" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Zone sous la courbe */}
              <path
                d={areaData}
                fill="url(#areaGradient)"
                stroke="none"
              />
              
              {/* Ligne de prix */}
              <path
                d={pathData}
                fill="none"
                stroke={mainColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Points interactifs */}
              {points.map((point, index) => (
                <circle
                  key={index}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill={mainColor}
                  className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <title>{`${point.time}: ${point.close?.toFixed(2) || point.value?.toFixed(2)}`}</title>
                </circle>
              ))}
              
              {/* Axes */}
              <line x1="0" y1={height} x2={width} y2={height} stroke="#e5e7eb" strokeWidth="1"/>
              <line x1={width} y1="0" x2={width} y2={height} stroke="#e5e7eb" strokeWidth="1"/>
              
              {/* Labels des prix */}
              <text x={width - 5} y="15" textAnchor="end" className="text-xs fill-gray-500">
                {adjustedMax.toFixed(1)}
              </text>
              <text x={width - 5} y={height - 5} textAnchor="end" className="text-xs fill-gray-500">
                {adjustedMin.toFixed(1)}
              </text>
            </svg>
          </div>
          
          {/* Séparateur */}
          <div className="h-px bg-gray-200 mb-4"></div>
          
          {/* Zone de volume */}
          <div className="text-xs text-gray-500 font-semibold mb-2">
            📈 VOLUME ({data.reduce((sum: number, d: any) => sum + (d.volume || 0), 0).toLocaleString()})
          </div>
          <div>
            <svg width="100%" height={volumeHeight} viewBox={`0 0 ${width} ${volumeHeight}`} className="border border-gray-100 rounded">
              {data.map((point: any, index: number) => {
                const x = (index / (data.length - 1)) * width;
                const maxVolume = Math.max(...data.map((d: any) => d.volume || 0));
                const barHeight = ((point.volume || 0) / maxVolume) * volumeHeight;
                const y = volumeHeight - barHeight;
                
                return (
                  <rect
                    key={index}
                    x={x - 2}
                    y={y}
                    width="4"
                    height={barHeight}
                    fill={mainColor}
                    opacity="0.7"
                  >
                    <title>{`${point.time}: ${(point.volume || 0).toLocaleString()}`}</title>
                  </rect>
                );
              })}
            </svg>
          </div>
          
          {/* Labels temporels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{data[0]?.time}</span>
            <span>Temps</span>
            <span>{data[data.length - 1]?.time}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amani-primary to-amani-primary/80 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              📈 Marchés Financiers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Suivez en temps réel les performances des marchés financiers ouest-africains
            </p>
            <div className="flex items-center justify-center gap-8 text-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>{marketSummary.gainers} En hausse</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-6 h-6" />
                <span>{marketSummary.losers} En baisse</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6" />
                <span>Volume: {marketSummary.totalVolume}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market News */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary flex items-center gap-3">
              <Zap className="w-8 h-8" />
              Actualités des marchés
            </h2>
            {loadingArticles && (
              <span className="text-blue-600 text-sm flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Chargement des actualités...
              </span>
            )}
          </div>
          
          {recentNews.length === 0 && !loadingArticles ? (
            <div className="text-center py-12">
              <div className="bg-blue-50 rounded-lg p-8 max-w-md mx-auto">
                <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Aucune actualité économique trouvée
                </h3>
                <p className="text-blue-700 mb-4">
                  Publiez des articles contenant des mots-clés liés au marché (BRVM, bourse, économie, finance, etc.) pour les voir apparaître ici.
                </p>
                <Link 
                  to="/dashboard/articles/new" 
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  <Zap className="w-4 h-4" />
                  Publier une actualité
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {recentNews.map((news) => (
              <article key={news.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <Link to={`/article/${news.id}`} className="block">
                  <div className="relative">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                        {news.category}
                      </span>
                    </div>
                  </div>
                </Link>
                
                <div className="p-6">
                  <Link to={`/article/${news.id}`}>
                    <h3 className="text-lg font-bold text-amani-primary mb-3 leading-tight hover:text-amani-primary/80 transition-colors cursor-pointer">
                      {news.title}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {news.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(news.publishedAt).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {news.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* Market Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary mb-4 lg:mb-0 flex items-center gap-3">
              <BarChart3 className="w-8 h-8" />
              Vue d'ensemble du marché
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "Tous les marchés" : category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                {timeframes.map((timeframe) => (
                  <button
                    key={timeframe.value}
                    onClick={() => setSelectedTimeframe(timeframe.value)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      selectedTimeframe === timeframe.value
                        ? "bg-amani-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={refreshData}
                disabled={loadingIndices}
                className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loadingIndices ? 'animate-spin' : ''}`} />
                {loadingIndices ? 'Actualisation...' : 'Actualiser'}
              </button>
            </div>
          </div>

          {/* Market Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">En hausse</p>
                  <p className="text-3xl font-bold text-green-600">{marketSummary.gainers}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">En baisse</p>
                  <p className="text-3xl font-bold text-red-600">{marketSummary.losers}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Volume total</p>
                  <p className="text-2xl font-bold text-amani-primary">{marketSummary.totalVolume}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Capitalisation</p>
                  <p className="text-2xl font-bold text-amani-primary">{marketSummary.marketCap}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PieChart className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Market Data Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-white/50">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-amani-primary">
                    Cotations en temps réel ({filteredData.length}{!showAllIndices && allFilteredData.length > 5 ? ` sur ${allFilteredData.length}` : ''})
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Dernière mise à jour: {new Date().toLocaleTimeString("fr-FR")}
                    {loadingIndices && (
                      <span className="ml-2 text-blue-600 text-sm">
                        <RefreshCw className="w-4 h-4 inline animate-spin mr-1" />
                        Actualisation en cours...
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instrument
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variation
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volume
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Haut/Bas
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-bold text-gray-900">{item.value}</div>
                        <div className="text-xs text-gray-500">
                          {item.unit === 'percent' ? '%' : 
                           item.unit === 'currency' ? item.currency : 
                           item.currency || 'FCFA'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`flex items-center justify-end gap-1 ${
                          item.isPositive ? "text-green-600" : "text-red-600"
                        }`}>
                          {item.isPositive ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span className="text-sm font-medium">{item.change}</span>
                        </div>
                        <div className={`text-xs ${
                          item.isPositive ? "text-green-600" : "text-red-600"
                        }`}>
                          {item.changeValue}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {item.volume}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-xs text-gray-900">H: {item.high}</div>
                        <div className="text-xs text-gray-500">B: {item.low}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleShowChart(item)}
                            className="text-amani-primary hover:text-amani-primary/80 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Voir le graphique"
                          >
                            <LineChartIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleShowDetails(item)}
                            className="text-gray-600 hover:text-gray-800 p-1 rounded hover:bg-gray-50 transition-colors"
                            title="Voir les détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Bouton Afficher plus */}
            {!showAllIndices && allFilteredData.length > 5 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowAllIndices(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-amani-primary hover:text-amani-primary/80 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                >
                  <ArrowRight className="w-4 h-4" />
                  Afficher plus ({allFilteredData.length - 5} autres cotations)
                </button>
              </div>
            )}
            
            {/* Bouton Afficher moins */}
            {showAllIndices && allFilteredData.length > 5 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => setShowAllIndices(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Afficher moins (masquer {allFilteredData.length - 5} cotations)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Forex Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary flex items-center gap-3">
              <DollarSign className="w-8 h-8" />
              Devises & Forex
            </h2>
            <div className="text-sm text-gray-600">
              Taux contre Franc CFA (XOF)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Currency Rates Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-white/50">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-amani-primary">
                    Devises Majeures ({displayedCurrencies.length}{!showAllCurrencies && allCurrencies.length > 4 ? ` sur ${allCurrencies.length}` : ''})
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Taux de change en temps réel • Mise à jour: {new Date().toLocaleTimeString("fr-FR")}
                  </p>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Devise
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Taux (FCFA)
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variation
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Volume
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Haut/Bas
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayedCurrencies.map((currency, index) => (
                        <tr key={currency.code} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{currency.flag}</span>
                              <div>
                                <div className="text-sm font-bold text-gray-900">{currency.code}/XOF</div>
                                <div className="text-sm text-gray-500">{currency.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-sm font-bold text-gray-900">
                              {currency.rate.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}
                            </div>
                            <div className="text-xs text-gray-500">FCFA</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className={`flex items-center justify-end gap-1 ${
                              currency.isPositive ? "text-green-600" : "text-red-600"
                            }`}>
                              {currency.isPositive ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span className="text-sm font-medium">
                                {currency.changePercent > 0 ? '+' : ''}{currency.changePercent.toFixed(2)}%
                              </span>
                            </div>
                            <div className={`text-xs ${currency.isPositive ? "text-green-600" : "text-red-600"}`}>
                              {currency.change > 0 ? '+' : ''}{currency.change.toFixed(3)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                            {currency.volume}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="text-xs text-green-600">H: {currency.high.toFixed(3)}</div>
                            <div className="text-xs text-red-600">B: {currency.low.toFixed(3)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Show More/Less Buttons for Currencies */}
                {!showAllCurrencies && allCurrencies.length > 4 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setShowAllCurrencies(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-amani-primary hover:text-amani-primary/80 hover:bg-blue-50 rounded-lg transition-colors font-medium"
                    >
                      <ArrowRight className="w-4 h-4" />
                      Afficher plus ({allCurrencies.length - 4} autres devises)
                    </button>
                  </div>
                )}
                
                {showAllCurrencies && allCurrencies.length > 4 && (
                  <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <button
                      onClick={() => setShowAllCurrencies(false)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                      <X className="w-4 h-4" />
                      Afficher moins (masquer {allCurrencies.length - 4} devises)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Currency Converter */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-white/50 sticky top-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Convertisseur</h3>
                </div>

                <div className="space-y-4">
                  {/* Amount Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant
                    </label>
                    <input
                      type="number"
                      value={converterAmount}
                      onChange={(e) => setConverterAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                      placeholder="1.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  {/* From Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      De
                    </label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="XOF">🇲🇱 Franc CFA (XOF)</option>
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag_emoji} {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        const temp = fromCurrency;
                        setFromCurrency(toCurrency);
                        setToCurrency(temp);
                      }}
                      className="p-2 text-gray-500 hover:text-amani-primary hover:bg-blue-50 rounded-full transition-colors"
                      title="Inverser les devises"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>

                  {/* To Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vers
                    </label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="XOF">🇲🇱 Franc CFA (XOF)</option>
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag_emoji} {currency.name} ({currency.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Result */}
                  <div className="bg-gradient-to-r from-amani-primary/10 to-blue-100 rounded-lg p-4 border-2 border-amani-primary/20">
                    <div className="text-sm text-gray-600 mb-1">Résultat</div>
                    <div className="text-2xl font-bold text-amani-primary">
                      {convertCurrency(converterAmount, fromCurrency, toCurrency).toLocaleString('fr-FR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6
                      })}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {toCurrency === 'XOF' ? 'Francs CFA' : currencies.find(c => c.code === toCurrency)?.name || toCurrency}
                    </div>
                  </div>

                  {/* Exchange Rate Info */}
                  <div className="text-xs text-gray-500 text-center pt-2 border-t">
                    1 {fromCurrency} = {convertCurrency(1, fromCurrency, toCurrency).toLocaleString('fr-FR', { maximumFractionDigits: 6 })} {toCurrency}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market News */}
      {/* Commodities Section */}
      <CommoditiesSection showTitle={true} maxItems={8} showFilters={true} />

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amani-primary/10 to-amani-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-amani-primary mb-6">
            Analyses approfondies des marchés
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Accédez à nos rapports d'analyse, prévisions et recommandations d'investissement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/insights"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium"
            >
              <Target className="w-5 h-5" />
              Voir les analyses
            </Link>
            <Link
              to="/newsletter"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amani-primary text-amani-primary rounded-lg hover:bg-amani-primary/5 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              S'abonner aux alertes
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modal Graphique */}
      {showChart && selectedIndex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowChart(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amani-primary">
                Graphique - {selectedIndex.name}
              </h2>
              <button 
                onClick={() => setShowChart(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Statistiques rapides */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Valeur actuelle</p>
                  <p className="text-xl font-bold text-amani-primary">{selectedIndex.value}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Variation</p>
                  <p className={`text-xl font-bold ${selectedIndex.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedIndex.change}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Plus haut</p>
                  <p className="text-xl font-bold text-green-600">{selectedIndex.high}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-1">Plus bas</p>
                  <p className="text-xl font-bold text-red-600">{selectedIndex.low}</p>
                </div>
              </div>

              {/* Graphique financier professionnel */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="mb-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Période: {chartPeriod} | Données: {generateChartData(selectedIndex, chartPeriod).length} points
                  </p>
                </div>
                <FinancialChart 
                  data={generateChartData(selectedIndex, chartPeriod)} 
                  selectedIndex={selectedIndex}
                />
              </div>

              {/* Contrôles de période */}
              <div className="flex items-center justify-center gap-2">
                {['1J', '5J', '1M', '3M', '1A'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setChartPeriod(period)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      period === chartPeriod 
                        ? 'bg-amani-primary text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Détails */}
      {showDetails && selectedIndex && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetails(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amani-primary">
                Détails - {selectedIndex.name}
              </h2>
              <button 
                onClick={() => setShowDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Informations générales</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nom:</span>
                      <span className="font-medium">{selectedIndex.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Catégorie:</span>
                      <span className="font-medium">{selectedIndex.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Symbole:</span>
                      <span className="font-medium">{selectedIndex.symbol || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Valeurs</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valeur actuelle:</span>
                      <span className="font-medium">{selectedIndex.value}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Variation:</span>
                      <span className={`font-medium ${selectedIndex.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedIndex.change}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume:</span>
                      <span className="font-medium">{selectedIndex.volume}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2">Plage du jour</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plus haut:</span>
                    <span className="font-medium text-green-600">{selectedIndex.high}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plus bas:</span>
                    <span className="font-medium text-red-600">{selectedIndex.low}</span>
                  </div>
                </div>
              </div>
              
              {selectedIndex.marketCap && selectedIndex.marketCap !== 'N/A' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Capitalisation</h3>
                  <p className="text-lg font-bold text-amani-primary">{selectedIndex.marketCap}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
