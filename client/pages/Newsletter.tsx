import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import {
  Mail,
  Send,
  Calendar,
  Download,
  Eye,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Globe,
  TrendingUp,
  FileText,
  Clock,
  Star,
  ArrowRight,
  Bell,
  Settings,
} from "lucide-react";

export default function Newsletter() {
  const { success, error } = useToast();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "economie",
    "marche",
  ]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      error("Email requis", "Veuillez saisir votre adresse email.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      error("Email invalide", "Veuillez saisir une adresse email valide.");
      return;
    }

    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    success(
      "Abonnement confirmé",
      `Vous êtes maintenant abonné à notre newsletter avec l'email ${email}`,
    );
    setEmail("");
    setIsSubscribing(false);
  };

  const handlePreferenceToggle = (preference: string) => {
    setSelectedPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference],
    );
  };

  const stats = [
    {
      label: "Abonnés actifs",
      value: "12,500",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Éditions publiées",
      value: "48",
      icon: FileText,
      color: "text-green-600",
    },
    {
      label: "Taux d'ouverture",
      value: "68%",
      icon: Eye,
      color: "text-purple-600",
    },
    {
      label: "Pays couverts",
      value: "8",
      icon: Globe,
      color: "text-amber-600",
    },
  ];

  const newsletters = [
    {
      id: 1,
      title: "Amani Weekly #48 - Perspectives 2024",
      date: "15 janvier 2024",
      subject:
        "Prévisions économiques pour le Sahel, nouveaux investissements miniers",
      highlights: [
        "Croissance du PIB malien projetée à 5.2%",
        "Nouveau gisement d'or au Burkina Faso",
        "BCEAO maintient son taux directeur",
      ],
      downloads: "2,340",
      openRate: "72%",
    },
    {
      id: 2,
      title: "Amani Weekly #47 - Bilan annuel",
      date: "8 janvier 2024",
      subject:
        "Rétrospective 2023 : marchés, investissements et perspectives régionales",
      highlights: [
        "BRVM : performance annuelle +8.5%",
        "Investissements FDI en hausse de 12%",
        "Inflation régionale stabilisée à 4.1%",
      ],
      downloads: "2,180",
      openRate: "69%",
    },
    {
      id: 3,
      title: "Amani Weekly #46 - Tech & Innovation",
      date: "25 décembre 2023",
      subject:
        "L'essor de la fintech au Sahel et les opportunités d'investissement",
      highlights: [
        "15 nouvelles startups fintech lancées",
        "Levée de fonds record : 45M USD",
        "Adoption mobile banking : +25%",
      ],
      downloads: "1,950",
      openRate: "71%",
    },
    {
      id: 4,
      title: "Amani Weekly #45 - Agriculture & Climat",
      date: "18 décembre 2023",
      subject:
        "Impact climatique sur l'agriculture sahélienne et stratégies d'adaptation",
      highlights: [
        "Récoltes céréalières : bilan mitigé",
        "Nouveaux projets d'irrigation",
        "Financement climat : 200M USD mobilisés",
      ],
      downloads: "2,100",
      openRate: "66%",
    },
  ];

  const preferences = [
    {
      id: "economie",
      label: "Économie générale",
      description: "Indicateurs macro, politiques économiques",
    },
    {
      id: "marche",
      label: "Marchés financiers",
      description: "BRVM, devises, matières premières",
    },
    {
      id: "industrie",
      label: "Industrie & mines",
      description: "Secteur minier, manufacturier, énergie",
    },
    {
      id: "agriculture",
      label: "Agriculture",
      description: "Secteur agricole, sécurité alimentaire",
    },
    {
      id: "tech",
      label: "Technologies",
      description: "Fintech, startups, innovation",
    },
    {
      id: "investissement",
      label: "Investissements",
      description: "FDI, capital-risque, opportunités",
    },
  ];

  const benefits = [
    {
      icon: BarChart3,
      title: "Analyses exclusives",
      description: "Accédez à des analyses approfondies réservées aux abonnés",
    },
    {
      icon: Clock,
      title: "Actualité prioritaire",
      description: "Recevez les informations importantes en avant-première",
    },
    {
      icon: TrendingUp,
      title: "Données en temps réel",
      description: "Tableaux de bord et indicateurs mis à jour quotidiennement",
    },
    {
      icon: Users,
      title: "Communauté d'experts",
      description: "Rejoignez notre réseau de professionnels de l'économie",
    },
  ];

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      {/* Hero Section */}
      <section className="bg-amani-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Newsletter Amani
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto mb-8">
              Chaque semaine, recevez le meilleur de l'actualité économique du
              Sahel et du Tchad directement dans votre boîte mail
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Gratuit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Tous les mercredis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Désabonnement facile</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-amani-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-amani-primary mb-4">
                Abonnez-vous gratuitement
              </h2>
              <p className="text-lg text-gray-600">
                Rejoignez plus de 12 500 professionnels qui nous font confiance
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Adresse email
                </label>
                <div className="flex gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.com"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amani-primary focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isSubscribing}
                    className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubscribing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Abonnement...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        S'abonner
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Préférences de contenu
                </label>
                <div className="grid md:grid-cols-2 gap-4">
                  {preferences.map((pref) => (
                    <div
                      key={pref.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPreferences.includes(pref.id)
                          ? "border-amani-primary bg-amani-secondary/20"
                          : "border-gray-200 hover:border-amani-primary/50"
                      }`}
                      onClick={() => handlePreferenceToggle(pref.id)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedPreferences.includes(pref.id)}
                          onChange={() => handlePreferenceToggle(pref.id)}
                          className="mt-1 h-4 w-4 text-amani-primary focus:ring-amani-primary border-gray-300 rounded"
                        />
                        <div>
                          <div className="font-medium text-amani-primary">
                            {pref.label}
                          </div>
                          <div className="text-sm text-gray-600">
                            {pref.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-amani-primary mb-4">
              Pourquoi s'abonner ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre newsletter vous donne accès à des contenus exclusifs et vous
              tient informé des développements économiques majeurs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-amani-secondary/20 rounded-full flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-amani-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-amani-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Archive */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-amani-primary">
              Éditions récentes
            </h2>
            <p className="text-gray-600">
              Découvrez nos dernières publications
            </p>
          </div>
          <div className="space-y-6">
            {newsletters.map((newsletter) => (
              <article
                key={newsletter.id}
                className="bg-white rounded-2xl shadow-lg p-8 border border-white/50 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="bg-amani-secondary/20 text-amani-primary px-3 py-1 rounded-full text-sm font-medium">
                        Newsletter
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {newsletter.date}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-amani-primary mb-3">
                      {newsletter.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{newsletter.subject}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">
                        Points saillants :
                      </h4>
                      <ul className="space-y-1">
                        {newsletter.highlights.map((highlight, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-start gap-2"
                          >
                            <Star className="w-3 h-3 text-amani-primary mt-1 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-amani-primary">
                          {newsletter.downloads}
                        </div>
                        <div className="text-xs text-gray-500">
                          Téléchargements
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {newsletter.openRate}
                        </div>
                        <div className="text-xs text-gray-500">
                          Taux d'ouverture
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors">
                        <Eye className="w-4 h-4" />
                        Lire
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-amani-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Restez informé de l'actualité économique
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Rejoignez notre communauté de professionnels et ne manquez aucune
            information importante sur l'économie sahélienne
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="#subscribe"
              className="inline-flex items-center gap-2 bg-white text-amani-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-4 h-4" />
              S'abonner maintenant
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              <Bell className="w-4 h-4" />
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
