import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";

export default function Article() {
  const { id } = useParams();

  // Mock article data - in a real app this would come from an API
  const article = {
    id,
    title: "Le Mali lance son plus grand projet d'infrastructure",
    content: `Un investissement de 2 milliards d'euros pour moderniser les réseaux de transport et d'énergie, promettant de transformer l'économie du pays d'ici 2027.

    Le gouvernement malien a officiellement lancé aujourd'hui son programme d'infrastructure le plus ambitieux jamais entrepris. Ce projet colossal, d'un montant de 2 milliards d'euros, vise à révolutionner les secteurs du transport et de l'énergie au Mali.

    ## Les grandes lignes du projet

    Le programme comprend plusieurs volets stratégiques :

    ### Transport et logistique
    - Construction de 1 200 km de nouvelles routes bitumées
    - Modernisation de 15 aéroports régionaux
    - Développement du transport ferroviaire entre Bamako et Gao

    ### Énergie et électrification
    - Installation de 500 MW de capacité solaire
    - Extension du réseau électrique national
    - Projets hydroélectriques sur le fleuve Niger

    ### Télécommunications
    - Déploiement de la fibre optique dans 200 communes
    - Amélioration de la couverture 4G/5G

    ## Impact économique attendu

    Selon les projections du ministère de l'Économie, ce programme devrait :
    - Créer 50 000 emplois directs
    - Augmenter le PIB de 3,2% d'ici 2027
    - Attirer 800 millions d'euros d'investissements privés

    ## Financement et partenariats

    Le financement de ce projet ambitieux provient de plusieurs sources :
    - 40% de fonds publics maliens
    - 35% de partenaires internationaux (BAD, Banque Mondiale)
    - 25% d'investissements privés

    Le projet s'inscrit dans le cadre du plan de développement économique 2024-2030 du Mali et bénéficie du soutien de l'Union Africaine.`,
    excerpt:
      "Un investissement de 2 milliards d'euros pour moderniser les réseaux de transport et d'énergie, promettant de transformer l'économie du pays d'ici 2027.",
    category: "Économie",
    date: "15 janvier 2024",
    author: "Amadou Diallo",
    image: "/placeholder.svg",
    tags: ["Mali", "Infrastructure", "Investissement", "Transport", "Énergie"],
  };

  return (
    <div className="min-h-screen bg-[#E5DDD2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-amani-primary hover:text-amani-primary/80 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        {/* Article header */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover"
          />

          <div className="p-6 md:p-8">
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-amani-secondary text-amani-primary px-3 py-1 rounded-full text-sm font-medium">
                {article.category}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                {article.date}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                {article.author}
              </span>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-amani-primary ml-auto">
                <Share2 className="w-4 h-4" />
                Partager
              </button>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-amani-primary mb-6">
              {article.title}
            </h1>

            {/* Summary */}
            <div className="bg-amani-secondary/30 p-4 rounded-lg mb-8">
              <h2 className="font-semibold text-amani-primary mb-2">
                Ce qu'il faut retenir
              </h2>
              <p className="text-gray-700">{article.excerpt}</p>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {article.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("##")) {
                  return (
                    <h2
                      key={index}
                      className="text-2xl font-bold text-amani-primary mt-8 mb-4"
                    >
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("###")) {
                  return (
                    <h3
                      key={index}
                      className="text-xl font-semibold text-amani-primary mt-6 mb-3"
                    >
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("-")) {
                  const items = paragraph
                    .split("\n")
                    .filter((item) => item.startsWith("-"));
                  return (
                    <ul
                      key={index}
                      className="list-disc list-inside space-y-2 mb-6"
                    >
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-700">
                          {item.replace("- ", "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            {/* Tags */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-amani-primary mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-amani-secondary/50 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>

        {/* Related articles section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-amani-primary mb-6">
            Articles liés
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/article/2"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-amani-primary mb-2">
                BRVM : hausse de 2.3% portée par les valeurs bancaires
              </h3>
              <p className="text-gray-600 text-sm">
                La Bourse Régionale des Valeurs Mobilières a clôturé en
                hausse...
              </p>
            </Link>
            <Link
              to="/article/3"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-amani-primary mb-2">
                Burkina Faso : nouveau gisement d'or découvert
              </h3>
              <p className="text-gray-600 text-sm">
                Une société minière canadienne annonce la découverte...
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
