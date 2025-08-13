import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UnifiedContent } from '../types/database';
import {
  Share2,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  WhatsApp,
  Calendar,
  User,
  Eye,
  Heart,
  MessageCircle,
  Bookmark,
  ArrowLeft,
  ExternalLink,
  Clock,
  Tag,
  TrendingUp,
} from 'lucide-react';

interface ArticleReaderProps {
  article: UnifiedContent;
  relatedArticles?: UnifiedContent[];
  onLike?: () => void;
  onBookmark?: () => void;
  onShare?: (platform: string) => void;
}

export default function ArticleReader({ 
  article, 
  relatedArticles = [], 
  onLike, 
  onBookmark, 
  onShare 
}: ArticleReaderProps) {
  const [isLiked, setIsLiked] = useState(article.is_liked_by_user || false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // URL courante pour le partage
  const currentUrl = `${window.location.origin}/article/${article.slug}`;
  const encodedTitle = encodeURIComponent(article.title);
  const encodedSummary = encodeURIComponent(article.summary);

  // URLs de partage social
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodeURIComponent(currentUrl)}&via=AmaniFinance`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodeURIComponent(currentUrl)}`,
  };

  // Méta-données SEO dynamiques
  useEffect(() => {
    // Titre de la page
    document.title = article.meta_title || `${article.title} | Amani Finance`;
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]') || 
      document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', article.meta_description || article.summary);
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    // Open Graph pour réseaux sociaux
    const setOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
        document.createElement('meta');
      meta.setAttribute('property', property);
      meta.setAttribute('content', content);
      if (!document.querySelector(`meta[property="${property}"]`)) {
        document.head.appendChild(meta);
      }
    };

    setOGMeta('og:title', article.title);
    setOGMeta('og:description', article.summary);
    setOGMeta('og:url', currentUrl);
    setOGMeta('og:type', 'article');
    setOGMeta('og:site_name', 'Amani Finance');
    if (article.featured_image) {
      setOGMeta('og:image', article.featured_image);
      setOGMeta('og:image:alt', article.featured_image_alt || article.title);
    }

    // Twitter Card
    const setTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) || 
        document.createElement('meta');
      meta.setAttribute('name', name);
      meta.setAttribute('content', content);
      if (!document.querySelector(`meta[name="${name}"]`)) {
        document.head.appendChild(meta);
      }
    };

    setTwitterMeta('twitter:card', 'summary_large_image');
    setTwitterMeta('twitter:title', article.title);
    setTwitterMeta('twitter:description', article.summary);
    setTwitterMeta('twitter:site', '@AmaniFinance');
    if (article.featured_image) {
      setTwitterMeta('twitter:image', article.featured_image);
    }

    // JSON-LD pour le référencement structuré
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": article.title,
      "description": article.summary,
      "image": article.featured_image,
      "author": {
        "@type": "Person",
        "name": `${article.author.first_name} ${article.author.last_name}`,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Amani Finance",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`
        }
      },
      "datePublished": article.published_at,
      "dateModified": article.updated_at,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": currentUrl
      }
    };

    let scriptTag = document.querySelector('#article-jsonld') || 
      document.createElement('script');
    scriptTag.setAttribute('type', 'application/ld+json');
    scriptTag.setAttribute('id', 'article-jsonld');
    scriptTag.textContent = JSON.stringify(jsonLd);
    if (!document.querySelector('#article-jsonld')) {
      document.head.appendChild(scriptTag);
    }

    return () => {
      // Nettoyage lors du démontage du composant
      document.title = 'Amani Finance';
    };
  }, [article, currentUrl]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.();
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const handleShare = (platform: string) => {
    onShare?.(platform);
    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <article className="min-h-screen bg-gray-50">
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour à l'accueil</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Actions rapides */}
              <button
                onClick={handleLike}
                className={`p-2 rounded-full transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
                title="J'aime"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleBookmark}
                className={`p-2 rounded-full transition-colors ${
                  isBookmarked 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                }`}
                title="Sauvegarder"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  title="Partager"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                {/* Menu de partage */}
                {showShareMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                    <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                      Partager cet article
                    </div>
                    
                    <button
                      onClick={() => handleShare('facebook')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700">Facebook</span>
                    </button>

                    <button
                      onClick={() => handleShare('twitter')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-700">Twitter</span>
                    </button>

                    <button
                      onClick={() => handleShare('linkedin')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-blue-50 transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      <span className="text-gray-700">LinkedIn</span>
                    </button>

                    <button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-green-50 transition-colors"
                    >
                      <WhatsApp className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">WhatsApp</span>
                    </button>

                    <hr className="my-2" />

                    <button
                      onClick={handleCopyUrl}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                    >
                      <Copy className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700">
                        {copySuccess ? 'Lien copié !' : 'Copier le lien'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de l'article */}
        <header className="mb-8">
          {/* Catégorie */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {article.category_info.name}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 text-sm">{article.country}</span>
          </div>

          {/* Titre */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Résumé mis en avant */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
              {article.summary}
            </p>
          </div>

          {/* Métadonnées */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="text-sm">
                {article.author.first_name} {article.author.last_name}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{formatDate(article.published_at || article.created_at)}</span>
            </div>

            {article.read_time && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{article.read_time} min de lecture</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{article.views.toLocaleString()} vues</span>
            </div>
          </div>

          {/* Image mise en avant */}
          {article.featured_image && (
            <div className="mb-8">
              <img
                src={article.featured_image}
                alt={article.featured_image_alt || article.title}
                className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Étiquettes */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Corps de l'article */}
        <div className="prose prose-lg max-w-none">
          {article.content ? (
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
              <p className="text-amber-800 mb-4">
                <strong>📝 Contenu en cours de rédaction</strong>
              </p>
              <p className="text-amber-700">
                Le résumé ci-dessus contient l'essentiel de l'information. 
                Le contenu complet sera publié prochainement.
              </p>
            </div>
          )}
        </div>

        {/* Actions de fin d'article */}
        <div className="mt-12 py-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{article.likes + (isLiked ? 1 : 0)}</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{article.comment_count}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-sm">Partager :</span>
              <button
                onClick={() => handleShare('twitter')}
                className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Articles similaires */}
        {relatedArticles.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Articles similaires</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.slice(0, 3).map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/article/${relatedArticle.slug}`}
                  className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
                >
                  {relatedArticle.featured_image && (
                    <div className="aspect-w-16 aspect-h-9 rounded-t-2xl overflow-hidden">
                      <img
                        src={relatedArticle.featured_image}
                        alt={relatedArticle.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {relatedArticle.category_info.name}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {formatDate(relatedArticle.published_at || relatedArticle.created_at)}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {relatedArticle.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{relatedArticle.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{relatedArticle.read_time || 5} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir tous les articles
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}
      </div>

      {/* Fermeture du menu de partage en cliquant ailleurs */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </article>
  );
}

// Hook pour le cache du click-outside
function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
