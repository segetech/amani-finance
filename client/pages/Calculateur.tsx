import React from "react";
import { Calculator, TrendingUp, DollarSign, Percent, Calendar, ArrowRight, Info } from "lucide-react";

export default function Calculateur() {
  const [capital, setCapital] = React.useState<number>(1000000); // Capital initial en FCFA
  const [tauxAnnuel, setTauxAnnuel] = React.useState<number>(8); // Taux en %
  const [duree, setDuree] = React.useState<number>(5); // Durée en années
  const [versementMensuel, setVersementMensuel] = React.useState<number>(50000); // Versement mensuel
  const [typeCalcul, setTypeCalcul] = React.useState<'simple' | 'compose'>('compose');

  // Calculs
  const calculerRendement = () => {
    const capitalInitial = capital;
    const taux = tauxAnnuel / 100;
    const annees = duree;
    const versementAnnuel = versementMensuel * 12;

    if (typeCalcul === 'simple') {
      // Intérêts simples
      const interetsSimples = capitalInitial * taux * annees;
      const versements = versementAnnuel * annees;
      const total = capitalInitial + interetsSimples + versements + (versements * taux * annees / 2);
      return {
        capitalFinal: total,
        interetsGagnes: total - capitalInitial - versements,
        totalVerse: capitalInitial + versements
      };
    } else {
      // Intérêts composés
      const capitalFinal = capitalInitial * Math.pow(1 + taux, annees);
      
      // Calcul avec versements mensuels
      const tauxMensuel = taux / 12;
      const nbMois = annees * 12;
      let totalAvecVersements = capitalFinal;
      
      if (versementMensuel > 0) {
        const versementsFuturs = versementMensuel * (Math.pow(1 + tauxMensuel, nbMois) - 1) / tauxMensuel;
        totalAvecVersements = capitalFinal + versementsFuturs;
      }
      
      const totalVerse = capitalInitial + (versementMensuel * nbMois);
      
      return {
        capitalFinal: totalAvecVersements,
        interetsGagnes: totalAvecVersements - totalVerse,
        totalVerse: totalVerse
      };
    }
  };

  const resultats = calculerRendement();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Calculator className="w-16 h-16 mx-auto mb-6 text-green-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Calculateur d'Investissement
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Simulez vos investissements et découvrez le pouvoir des intérêts composés
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de calcul */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-600" />
              Paramètres d'investissement
            </h2>

            <div className="space-y-6">
              {/* Capital initial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capital initial (FCFA)
                </label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  step="10000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Montant que vous investissez aujourd'hui
                </p>
              </div>

              {/* Versement mensuel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Versement mensuel (FCFA)
                </label>
                <input
                  type="number"
                  value={versementMensuel}
                  onChange={(e) => setVersementMensuel(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  step="5000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Montant que vous ajoutez chaque mois
                </p>
              </div>

              {/* Taux de rendement */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taux de rendement annuel (%)
                </label>
                <input
                  type="number"
                  value={tauxAnnuel}
                  onChange={(e) => setTauxAnnuel(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Rendement annuel espéré (BRVM moyenne : 8-12%)
                </p>
              </div>

              {/* Durée */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durée d'investissement (années)
                </label>
                <input
                  type="number"
                  value={duree}
                  onChange={(e) => setDuree(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                  max="50"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Nombre d'années d'investissement
                </p>
              </div>

              {/* Type de calcul */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'intérêts
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setTypeCalcul('simple')}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      typeCalcul === 'simple'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Intérêts simples
                  </button>
                  <button
                    onClick={() => setTypeCalcul('compose')}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                      typeCalcul === 'compose'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Intérêts composés
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {/* Résumé */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6" />
                Résultats de votre investissement
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-green-400">
                  <span className="text-green-100">Total versé</span>
                  <span className="text-xl font-bold">{formatCurrency(resultats.totalVerse)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-green-400">
                  <span className="text-green-100">Intérêts gagnés</span>
                  <span className="text-xl font-bold text-yellow-300">{formatCurrency(resultats.interetsGagnes)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-green-100">Capital final</span>
                  <span className="text-3xl font-bold">{formatCurrency(resultats.capitalFinal)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-500 bg-opacity-20 rounded-lg">
                <p className="text-sm text-green-100">
                  <strong>Gain total :</strong> {formatCurrency(resultats.capitalFinal - capital)} 
                  ({((resultats.capitalFinal / resultats.totalVerse - 1) * 100).toFixed(1)}% de rendement)
                </p>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Conseils d'investissement
              </h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Intérêts composés</h4>
                  <p>Les intérêts composés sont la 8ème merveille du monde. Plus vous investissez tôt et longtemps, plus l'effet est puissant.</p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Risques</h4>
                  <p>Les rendements passés ne garantissent pas les performances futures. Diversifiez vos investissements.</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">🎯 BRVM</h4>
                  <p>La BRVM a enregistré des rendements moyens de 8-12% ces dernières années, mais avec de la volatilité.</p>
                </div>
              </div>
            </div>

            {/* Comparaison */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Comparaison des stratégies
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Livret d'épargne (2%)</span>
                  <span className="font-bold text-gray-600">
                    {formatCurrency(capital * Math.pow(1.02, duree))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Obligations (5%)</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(capital * Math.pow(1.05, duree))}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Votre simulation ({tauxAnnuel}%)</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(resultats.capitalFinal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section éducative */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Comprendre les intérêts composés
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Intérêts simples</h3>
              <p className="text-gray-600 mb-4">
                Les intérêts sont calculés uniquement sur le capital initial. 
                Formule : Capital × Taux × Durée
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Exemple : 1 000 000 FCFA à 8% pendant 5 ans = 
                  1 000 000 + (1 000 000 × 0.08 × 5) = 1 400 000 FCFA
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Intérêts composés</h3>
              <p className="text-gray-600 mb-4">
                Les intérêts sont reinvestis et génèrent eux-mêmes des intérêts. 
                Formule : Capital × (1 + Taux)^Durée
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Exemple : 1 000 000 FCFA à 8% pendant 5 ans = 
                  1 000 000 × (1.08)^5 = 1 469 328 FCFA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
