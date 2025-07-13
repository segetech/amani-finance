export default function Industrie() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-amani-primary mb-8">
          Industrie
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <p className="text-lg text-gray-600 mb-6">
            Secteurs industriels clés du Sahel et du Tchad : mines, énergie,
            agriculture et manufacture.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amani-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amani-primary mb-3">
                Mines & Extraction
              </h3>
              <p className="text-gray-600">
                Or, uranium, pétrole et autres ressources minérales
              </p>
            </div>
            <div className="bg-amani-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amani-primary mb-3">
                Énergie
              </h3>
              <p className="text-gray-600">
                Projets énergétiques et transition vers les renouvelables
              </p>
            </div>
            <div className="bg-amani-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amani-primary mb-3">
                Agriculture
              </h3>
              <p className="text-gray-600">
                Sécurité alimentaire et développement agricole régional
              </p>
            </div>
            <div className="bg-amani-secondary/20 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-amani-primary mb-3">
                Manufacture
              </h3>
              <p className="text-gray-600">
                Industrie manufacturière et transformation locale
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
