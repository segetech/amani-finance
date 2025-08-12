import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, User, Calendar, Eye, Share2 } from "lucide-react";

interface ArticleReaderProps {
  title: string;
  author: string;
  publishedAt: string;
  readTime: number;
  views: number;
  excerpt: string;
  content: string;
  category: string;
  country?: string;
  coverImage?: string;
}

export default function ArticleReader({
  title,
  author,
  publishedAt,
  readTime,
  views,
  excerpt,
  content,
  category,
  country,
  coverImage,
}: ArticleReaderProps) {
  const [showFullContent, setShowFullContent] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        {coverImage && (
          <div className="mb-6">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-lg"
            />
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <span className="bg-amani-primary text-white px-3 py-1 rounded-full text-sm font-medium">
            {category}
          </span>
          {country && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
              {country}
            </span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-amani-primary mb-6 leading-tight">
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span className="font-medium">{author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(publishedAt).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readTime} min de lecture</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views.toLocaleString()} vues</span>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-amani-primary hover:text-amani-primary/80 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Partager</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg max-w-none">
        {/* Résumé - toujours affiché */}
        <div className="bg-amani-secondary/10 border-l-4 border-amani-primary p-6 rounded-r-lg mb-8">
          <h3 className="text-lg font-semibold text-amani-primary mb-3 flex items-center gap-2">
            📋 Résumé de l'article
          </h3>
          <p className="text-gray-700 leading-relaxed">{excerpt}</p>
        </div>

        {/* Toggle pour afficher le contenu complet */}
        <div className="mb-6">
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium"
          >
            {showFullContent ? (
              <>
                <ChevronUp className="w-5 h-5" />
                Masquer l'article complet
              </>
            ) : (
              <>
                <ChevronDown className="w-5 h-5" />
                Lire l'article complet
              </>
            )}
          </button>
        </div>

        {/* Contenu complet - affiché conditionnellement */}
        {showFullContent && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-xl font-semibold text-amani-primary mb-6">
              📖 Article complet
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-4">
              {content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to action si résumé seulement */}
      {!showFullContent && (
        <div className="mt-8 p-6 bg-gradient-to-r from-amani-primary/5 to-amani-secondary/5 border border-amani-primary/20 rounded-xl">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-amani-primary mb-2">
              Envie d'en savoir plus ?
            </h4>
            <p className="text-gray-600 mb-4">
              Cliquez sur "Lire l'article complet" pour accéder à l'analyse détaillée et aux insights approfondis.
            </p>
            <button
              onClick={() => setShowFullContent(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amani-primary text-white rounded-lg hover:bg-amani-primary/90 transition-colors font-medium"
            >
              <ChevronDown className="w-5 h-5" />
              Continuer la lecture
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
