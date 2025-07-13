export default function Marche() {
  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-amani-primary mb-8">Marché</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-600 mb-6">
            Section dédiée aux informations sur les marchés financiers du Sahel
            et du Tchad.
          </p>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-amani-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amani-primary mb-3">
                BRVM
              </h3>
              <p className="text-gray-600">
                Suivez les performances de la Bourse Régionale des Valeurs
                Mobilières
              </p>
            </div>
            <div className="bg-amani-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amani-primary mb-3">
                Devises
              </h3>
              <p className="text-gray-600">
                Évolution des taux de change et analyses des monnaies régionales
              </p>
            </div>
            <div className="bg-amani-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amani-primary mb-3">
                Commodités
              </h3>
              <p className="text-gray-600">
                Prix des matières premières et impact sur l'économie régionale
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
