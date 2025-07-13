export default function Economie() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-amani-primary mb-8">Économie</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-600 mb-6">
            Analyses économiques approfondies des pays du Sahel et du Tchad.
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-amani-primary pl-4">
              <h3 className="font-semibold text-amani-primary">
                PIB et Croissance
              </h3>
              <p className="text-gray-600">
                Indicateurs macroéconomiques régionaux
              </p>
            </div>
            <div className="border-l-4 border-amani-primary pl-4">
              <h3 className="font-semibold text-amani-primary">
                Politiques Monétaires
              </h3>
              <p className="text-gray-600">
                Décisions de la BCEAO et impact régional
              </p>
            </div>
            <div className="border-l-4 border-amani-primary pl-4">
              <h3 className="font-semibold text-amani-primary">
                Commerce International
              </h3>
              <p className="text-gray-600">
                Flux commerciaux et partenariats économiques
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
