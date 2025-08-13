import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Globe,
  Target,
  Lightbulb,
  ArrowRight,
  Clock,
  Shield,
  Calculator,
  Eye,
  Users,
  Building,
  Briefcase
} from "lucide-react";

export default function GuideDebutant() {
  const [currentSection, setCurrentSection] = React.useState(0);

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction à l\'investissement',
      icon: BookOpen,
      color: 'blue'
    },
    {
      id: 'basics',
      title: 'Les bases à connaître',
      icon: Lightbulb,
      color: 'yellow'
    },
    {
      id: 'brvm',
      title: 'Comprendre la BRVM',
      icon: BarChart3,
      color: 'green'
    },
    {
      id: 'commodities',
      title: 'Les matières premières',
      icon: Globe,
      color: 'orange'
    },
    {
      id: 'strategies',
      title: 'Stratégies d\'investissement',
      icon: Target,
      color: 'purple'
    },
    {
      id: 'risks',
      title: 'Gérer les risques',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'start',
      title: 'Comment commencer',
      icon: CheckCircle,
      color: 'emerald'
    }
  ];

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
      ></div>
    </div>
  );

  const SectionCard = ({ title, children, icon: Icon, tip }: { 
    title: string; 
    children: React.ReactNode; 
    icon: any; 
    tip?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-3 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {children}
      {tip && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
          <p className="text-blue-700 text-sm">
            <strong>💡 Astuce :</strong> {tip}
          </p>
        </div>
      )}
    </div>
  );

  const ExampleBox = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-4">
      <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-blue-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Guide de l'Investissement pour Débutants
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Apprenez les bases de l'investissement en Afrique de l'Ouest. 
              De la BRVM aux matières premières, tout ce qu'il faut savoir pour débuter.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barre de progression */}
        <ProgressBar />

        {/* Navigation des sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 mb-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = currentSection === index;
            const isCompleted = currentSection > index;
            
            return (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`p-3 rounded-lg text-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : isCompleted
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-xs font-medium">{section.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Section 1: Introduction */}
        {currentSection === 0 && (
          <SectionCard 
            title="Pourquoi investir ?" 
            icon={BookOpen}
            tip="L'investissement est le meilleur moyen de faire fructifier votre argent sur le long terme."
          >
            <div className="space-y-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                Investir, c'est utiliser votre argent pour acheter des actifs qui peuvent prendre de la valeur avec le temps. 
                Au lieu de laisser votre épargne dormir sur un compte bancaire, vous la faites travailler pour vous.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Avantages de l'investissement
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Croissance de votre patrimoine</li>
                    <li>• Protection contre l'inflation</li>
                    <li>• Revenus passifs (dividendes)</li>
                    <li>• Préparation de la retraite</li>
                    <li>• Réalisation de projets importants</li>
                  </ul>
                </div>

                <div className="bg-red-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Risques à considérer
                  </h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Possibilité de perdre de l'argent</li>
                    <li>• Volatilité des marchés</li>
                    <li>• Pas de garantie de rendement</li>
                    <li>• Besoin de patience et discipline</li>
                    <li>• Importance de se former</li>
                  </ul>
                </div>
              </div>

              <ExampleBox title="Exemple concret">
                <p className="text-gray-600">
                  Si vous placez 500 000 FCFA sur un livret d'épargne à 2% par an, 
                  vous aurez 551 000 FCFA après 5 ans. 
                  Mais si vous investissez la même somme en bourse avec un rendement de 8% par an, 
                  vous pourriez avoir 735 000 FCFA !
                </p>
              </ExampleBox>
            </div>
          </SectionCard>
        )}

        {/* Section 2: Les bases */}
        {currentSection === 1 && (
          <SectionCard 
            title="Vocabulaire et concepts de base" 
            icon={Lightbulb}
            tip="Maîtriser le vocabulaire est essentiel pour comprendre les discussions sur l'investissement."
          >
            <div className="space-y-6">
              <p className="text-gray-700 text-lg">
                Avant d'investir, il faut comprendre les termes essentiels utilisés dans le monde financier.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">📊 Instruments financiers</h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <h4 className="font-semibold text-blue-900">Action</h4>
                      <p className="text-blue-700 text-sm">
                        Part de propriété dans une entreprise. Si l'entreprise va bien, l'action peut prendre de la valeur.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                      <h4 className="font-semibold text-green-900">Obligation</h4>
                      <p className="text-green-700 text-sm">
                        Prêt que vous accordez à une entreprise ou un État. En échange, vous recevez des intérêts.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                      <h4 className="font-semibold text-purple-900">Indice</h4>
                      <p className="text-purple-700 text-sm">
                        Mesure la performance moyenne de plusieurs entreprises (ex: BRVM Composite).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">💰 Concepts clés</h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                      <h4 className="font-semibold text-yellow-900">Dividende</h4>
                      <p className="text-yellow-700 text-sm">
                        Part des bénéfices qu'une entreprise distribue à ses actionnaires.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-red-500 bg-red-50">
                      <h4 className="font-semibold text-red-900">Volatilité</h4>
                      <p className="text-red-700 text-sm">
                        Mesure des variations de prix. Plus c'est volatil, plus c'est risqué.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
                      <h4 className="font-semibold text-indigo-900">Diversification</h4>
                      <p className="text-indigo-700 text-sm">
                        Répartir ses investissements pour réduire les risques.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ExampleBox title="Règle d'or">
                <p className="text-gray-600">
                  <strong>Ne jamais investir tout son argent dans une seule action.</strong> 
                  C'est comme mettre tous ses œufs dans le même panier. Si l'entreprise fait faillite, 
                  vous perdez tout. Diversifiez toujours !
                </p>
              </ExampleBox>
            </div>
          </SectionCard>
        )}

        {/* Section 3: BRVM */}
        {currentSection === 2 && (
          <SectionCard 
            title="La Bourse Régionale des Valeurs Mobilières" 
            icon={BarChart3}
            tip="La BRVM est le cœur financier de l'Afrique de l'Ouest francophone."
          >
            <div className="space-y-6">
              <p className="text-gray-700 text-lg">
                La BRVM est la bourse commune aux 8 pays de l'UEMOA. C'est là que s'échangent 
                les actions des plus grandes entreprises ouest-africaines.
              </p>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🌍 Les 8 pays membres</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Bénin', 'Burkina Faso', 'Côte d\'Ivoire', 'Guinée-Bissau', 'Mali', 'Niger', 'Sénégal', 'Togo'].map(pays => (
                    <div key={pays} className="bg-white p-3 rounded-lg text-center font-medium text-gray-700">
                      {pays}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-600" />
                    Principales entreprises cotées
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Ecobank</span>
                      <span className="text-gray-600">Banque</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Sonatel</span>
                      <span className="text-gray-600">Télécoms</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">SGCI</span>
                      <span className="text-gray-600">Banque</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">Total Sénégal</span>
                      <span className="text-gray-600">Énergie</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    Comment fonctionne la bourse
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <p>Les entreprises vendent des parts (actions) au public</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <p>Les investisseurs achètent et vendent ces actions</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <p>Le prix varie selon l'offre et la demande</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <p>L'indice BRVM mesure la performance globale</p>
                    </div>
                  </div>
                </div>
              </div>

              <ExampleBox title="Performance historique">
                <p className="text-gray-600">
                  En 2024, la BRVM a enregistré une performance exceptionnelle de +28,89%. 
                  Cependant, les performances passées ne garantissent pas les résultats futurs. 
                  La bourse peut aussi baisser certaines années.
                </p>
              </ExampleBox>
            </div>
          </SectionCard>
        )}

        {/* Section 4: Matières premières */}
        {currentSection === 3 && (
          <SectionCard 
            title="Investir dans les matières premières" 
            icon={Globe}
            tip="Les matières premières africaines influencent directement l'économie locale."
          >
            <div className="space-y-6">
              <p className="text-gray-700 text-lg">
                L'Afrique de l'Ouest est riche en matières premières. Comprendre leurs prix 
                vous aide à mieux saisir l'économie régionale et les opportunités d'investissement.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
                    🥇 Métaux précieux
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-yellow-800">Or</h4>
                      <p className="text-yellow-700 text-sm">
                        Valeur refuge en temps de crise. Le Mali et le Burkina Faso sont de grands producteurs.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-yellow-800">Argent</h4>
                      <p className="text-yellow-700 text-sm">
                        Utilisé dans l'industrie et la bijouterie. Plus volatil que l'or.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-xl">
                  <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                    🌾 Agriculture
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-green-800">Cacao</h4>
                      <p className="text-green-700 text-sm">
                        La Côte d'Ivoire produit 40% du cacao mondial. Prix très important pour l'économie.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">Coton</h4>
                      <p className="text-green-700 text-sm">
                        Culture majeure au Mali, Burkina Faso et Bénin. Sensible aux conditions climatiques.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-blue-900 mb-4">🛢️ Énergie et industrie</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Pétrole</h4>
                    <p className="text-blue-700 text-sm">
                      Bien que l'Afrique de l'Ouest ne soit pas un grand producteur, 
                      les prix du pétrole affectent tous les coûts (transport, énergie).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800 mb-2">Cuivre</h4>
                    <p className="text-blue-700 text-sm">
                      Indicateur de la santé économique mondiale. 
                      Utilisé dans la construction et l'électronique.
                    </p>
                  </div>
                </div>
              </div>

              <ExampleBox title="Impact sur votre quotidien">
                <div className="space-y-2 text-gray-600">
                  <p>• <strong>Prix du cacao ↑</strong> → Plus de revenus pour les planteurs ivoiriens → Économie locale plus forte</p>
                  <p>• <strong>Prix du pétrole ↑</strong> → Transport plus cher → Inflation sur tous les produits</p>
                  <p>• <strong>Prix de l'or ↑</strong> → Opportunités d'investissement → Mais aussi inflation possible</p>
                </div>
              </ExampleBox>
            </div>
          </SectionCard>
        )}

        {/* Section 5: Stratégies */}
        {currentSection === 4 && (
          <SectionCard 
            title="Stratégies d'investissement pour débutants" 
            icon={Target}
            tip="Commencez toujours par une stratégie simple et éprouvée."
          >
            <div className="space-y-6">
              <p className="text-gray-700 text-lg">
                Il existe plusieurs approches pour investir. Voici les plus adaptées aux débutants.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Investissement à long terme
                  </h3>
                  <div className="space-y-3">
                    <p className="text-blue-700">
                      <strong>Principe :</strong> Acheter et garder pendant des années (5-10 ans minimum).
                    </p>
                    <div className="space-y-2">
                      <p className="text-blue-700 text-sm">✅ <strong>Avantages :</strong></p>
                      <ul className="text-blue-700 text-sm ml-4 space-y-1">
                        <li>• Moins de stress</li>
                        <li>• Profite de la croissance des entreprises</li>
                        <li>• Effet des intérêts composés</li>
                        <li>• Moins de frais de transaction</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Investissement progressif (DCA)
                  </h3>
                  <div className="space-y-3">
                    <p className="text-green-700">
                      <strong>Principe :</strong> Investir la même somme chaque mois, peu importe le prix.
                    </p>
                    <div className="space-y-2">
                      <p className="text-green-700 text-sm">✅ <strong>Avantages :</strong></p>
                      <ul className="text-green-700 text-sm ml-4 space-y-1">
                        <li>• Réduit l'impact de la volatilité</li>
                        <li>• Discipline d'épargne</li>
                        <li>• Accessible avec peu d'argent</li>
                        <li>• Évite les erreurs de timing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Portfolio équilibré pour débutant
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                    <h4 className="font-bold text-blue-900 text-center mb-2">40%</h4>
                    <p className="text-blue-700 text-center text-sm">Actions BRVM (grandes entreprises stables)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                    <h4 className="font-bold text-green-900 text-center mb-2">30%</h4>
                    <p className="text-green-700 text-center text-sm">Obligations d'État (sécurisé)</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                    <h4 className="font-bold text-yellow-900 text-center mb-2">30%</h4>
                    <p className="text-yellow-700 text-center text-sm">Épargne liquide (urgences)</p>
                  </div>
                </div>
              </div>

              <ExampleBox title="Plan d'action mensuel">
                <div className="space-y-2 text-gray-600">
                  <p><strong>Étape 1 :</strong> Économisez 20% de vos revenus</p>
                  <p><strong>Étape 2 :</strong> Gardez 6 mois de dépenses en épargne de précaution</p>
                  <p><strong>Étape 3 :</strong> Investissez le surplus selon votre profil de risque</p>
                  <p><strong>Étape 4 :</strong> Réévaluez votre portfolio tous les 6 mois</p>
                </div>
              </ExampleBox>
            </div>
          </SectionCard>
        )}

        {/* Section 6: Risques */}
        {currentSection === 5 && (
          <SectionCard 
            title="Comprendre et gérer les risques" 
            icon={Shield}
            tip="Le risque zéro n'existe pas, mais on peut l'atténuer intelligemment."
          >
            <div className="space-y-6">
              <p className="text-gray-700 text-lg">
                Investir comporte toujours des risques. L'objectif n'est pas de les éviter complètement, 
                mais de les comprendre et les gérer.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Types de risques
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-red-500 bg-red-50">
                      <h4 className="font-semibold text-red-900">Risque de marché</h4>
                      <p className="text-red-700 text-sm">
                        Les prix peuvent baisser. En 2008, de nombreuses bourses ont perdu 30-50%.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                      <h4 className="font-semibold text-orange-900">Risque de change</h4>
                      <p className="text-orange-700 text-sm">
                        Les fluctuations FCFA/USD peuvent affecter vos investissements internationaux.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50">
                      <h4 className="font-semibold text-yellow-900">Risque d'inflation</h4>
                      <p className="text-yellow-700 text-sm">
                        Si l'inflation est de 5% et votre placement rapporte 3%, vous perdez du pouvoir d'achat.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-purple-500 bg-purple-50">
                      <h4 className="font-semibold text-purple-900">Risque de liquidité</h4>
                      <p className="text-purple-700 text-sm">
                        Difficulté à vendre rapidement certains investissements sans perdre d'argent.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Comment se protéger
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-4 border-l-4 border-green-500 bg-green-50">
                      <h4 className="font-semibold text-green-900">Diversification</h4>
                      <p className="text-green-700 text-sm">
                        Ne pas mettre tous ses œufs dans le même panier. Variez les secteurs et pays.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                      <h4 className="font-semibold text-blue-900">Horizon long terme</h4>
                      <p className="text-blue-700 text-sm">
                        Plus vous investissez longtemps, plus vous lissez les variations du marché.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-indigo-500 bg-indigo-50">
                      <h4 className="font-semibold text-indigo-900">Éducation continue</h4>
                      <p className="text-indigo-700 text-sm">
                        Plus vous comprenez, meilleures sont vos décisions. Lisez, formez-vous.
                      </p>
                    </div>

                    <div className="p-4 border-l-4 border-teal-500 bg-teal-50">
                      <h4 className="font-semibold text-teal-900">Fonds d'urgence</h4>
                      <p className="text-teal-700 text-sm">
                        Gardez 6 mois de dépenses en épargne avant d'investir massivement.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🚨 Erreurs courantes à éviter</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-red-600">❌ <strong>Paniquer lors des baisses</strong></p>
                    <p className="text-red-600">❌ <strong>Investir l'argent du loyer</strong></p>
                    <p className="text-red-600">❌ <strong>Suivre les "tuyaux" d'amis</strong></p>
                    <p className="text-red-600">❌ <strong>Vouloir devenir riche rapidement</strong></p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-green-600">✅ <strong>Rester discipliné</strong></p>
                    <p className="text-green-600">✅ <strong>N'investir que l'épargne</strong></p>
                    <p className="text-green-600">✅ <strong>Faire ses propres recherches</strong></p>
                    <p className="text-green-600">✅ <strong>Penser à long terme</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Section 7: Comment commencer */}
        {currentSection === 6 && (
          <SectionCard 
            title="Vos premiers pas" 
            icon={CheckCircle}
            tip="Le plus important est de commencer, même avec un petit montant."
          >
            <div className="space-y-6">
              <p className="text-gray-700 text-lg">
                Vous avez maintenant les bases. Voici un plan d'action concret pour débuter vos investissements.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-gray-900 mb-4">🗺️ Feuille de route du débutant</h3>
                <div className="space-y-4">
                  {[
                    { etape: 1, titre: "Évaluez votre situation", description: "Calculez vos revenus, dépenses et capacité d'épargne" },
                    { etape: 2, titre: "Constituez votre épargne de précaution", description: "6 mois de dépenses sur un livret accessible" },
                    { etape: 3, titre: "Définissez vos objectifs", description: "Retraite, achat immobilier, éducation des enfants..." },
                    { etape: 4, titre: "Choisissez un courtier", description: "Recherchez les frais, services et réputation" },
                    { etape: 5, titre: "Commencez petit", description: "50 000 FCFA/mois sur des actions solides" },
                    { etape: 6, titre: "Apprenez en pratique", description: "Suivez vos investissements et continuez à vous former" }
                  ].map(item => (
                    <div key={item.etape} className="flex items-start gap-4 p-4 bg-white rounded-lg">
                      <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                        {item.etape}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{item.titre}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Où investir en Afrique de l'Ouest
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">BRVM</h4>
                      <p className="text-blue-700">Actions des grandes entreprises régionales</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Obligations UEMOA</h4>
                      <p className="text-green-700">Dettes d'État, plus sécurisées</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-900">Fonds d'investissement</h4>
                      <p className="text-yellow-700">Gérés par des professionnels</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Outils recommandés
                  </h3>
                  <div className="space-y-3">
                    <Link 
                      to="/calculateur" 
                      className="block p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <h4 className="font-semibold text-green-900">Calculateur Amani</h4>
                      <p className="text-green-700 text-sm">Simulez vos investissements</p>
                    </Link>
                    <Link 
                      to="/indices" 
                      className="block p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <h4 className="font-semibold text-blue-900">Indices en temps réel</h4>
                      <p className="text-blue-700 text-sm">Suivez les marchés</p>
                    </Link>
                    <Link 
                      to="/insights" 
                      className="block p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <h4 className="font-semibold text-purple-900">Analyses d'experts</h4>
                      <p className="text-purple-700 text-sm">Conseils professionnels</p>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-yellow-900 mb-4">⚠️ Avertissement important</h3>
                <p className="text-yellow-800">
                  Ce guide est à des fins éducatives uniquement. Tous les investissements comportent des risques. 
                  Les performances passées ne garantissent pas les résultats futurs. 
                  Consultez un conseiller financier qualifié avant de prendre des décisions d'investissement importantes.
                </p>
              </div>
            </div>
          </SectionCard>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Précédent
          </button>

          <span className="text-gray-600">
            {currentSection + 1} / {sections.length}
          </span>

          <button
            onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
            disabled={currentSection === sections.length - 1}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Suivant <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Fin du guide */}
        {currentSection === sections.length - 1 && (
          <div className="text-center mt-8 p-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Félicitations !</h3>
            <p className="text-gray-700 mb-6">
              Vous avez terminé le guide du débutant. Vous possédez maintenant les connaissances 
              de base pour commencer à investir de manière éclairée.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/calculateur"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Calculator className="w-5 h-5" />
                Utiliser le calculateur
              </Link>
              <Link
                to="/indices"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <BarChart3 className="w-5 h-5" />
                Voir les indices
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Lightbulb className="w-5 h-5" />
                Lire les analyses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
