import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, Building } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactTypes = [
    { id: 'general', name: 'Question Générale', icon: MessageSquare },
    { id: 'partnership', name: 'Partenariat', icon: Users },
    { id: 'press', name: 'Presse & Média', icon: Building },
    { id: 'technical', name: 'Support Technique', icon: Phone }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      details: 'info@amani-finance.com',
      description: 'Nous répondons sous 24h'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      details: '+223 20 22 45 67',
      description: 'Lun-Ven, 9h-18h GMT'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      details: 'Faladie, Bamako, Mali',
      description: 'Siège social'
    },
    {
      icon: Clock,
      title: 'Horaires',
      details: 'Lun-Ven: 9h-18h',
      description: 'Fuseau horaire GMT'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr Keita Mohamed',
      role: 'Expert Économiste',
      email: 'k.mohamed@amani-finance.com',
      speciality: 'Analyse économique et stratégie financière'
    },
    {
      name: 'Kani Sissoko',
      role: 'Directrice des Opérations',
      email: 'k.sissoko@amani-finance.com',
      speciality: 'Gestion opérationnelle et développement'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#373B3A] to-gray-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Contactez-Nous
            </h1>
            <p className="text-xl max-w-3xl mx-auto leading-relaxed">
              Notre équipe est à votre disposition pour répondre à vos questions, 
              discuter de partenariats ou vous accompagner dans vos projets économiques
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Nos Coordonnées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    <info.icon className="h-12 w-12 text-[#373B3A]" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-gray-700 font-medium mb-1">{info.details}</p>
                  <p className="text-sm text-gray-500">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Team */}
      <section className="py-16 bg-[#E5DDD5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-2xl text-[#373B3A]">Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-md">
                    <p className="text-green-700">
                      ✅ Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.
                    </p>
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-md">
                    <p className="text-red-700">
                      ❌ Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre.email@exemple.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Entreprise / Organisation
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Type de demande *
                    </label>
                    <select
                      id="type"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#373B3A] focus:border-transparent"
                    >
                      {contactTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Sujet *
                    </label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Résumé de votre demande"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande en détail..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#373B3A] focus:border-transparent resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#373B3A] hover:bg-gray-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Team Members */}
            <div>
              <h3 className="text-2xl font-bold text-[#373B3A] mb-8">Notre Équipe</h3>
              <div className="space-y-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-[#373B3A] rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {member.name}
                          </h4>
                          <p className="text-[#373B3A] font-medium mb-2">{member.role}</p>
                          <p className="text-sm text-gray-600 mb-3">{member.speciality}</p>
                          <a
                            href={`mailto:${member.email}`}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {member.email}
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Contact Actions */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-[#373B3A] mb-4">Contact Rapide</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="mailto:info@amani-finance.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Envoyer un email
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="tel:+22320224567">
                      <Phone className="h-4 w-4 mr-2" />
                      Appeler maintenant
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Notre Localisation
          </h2>
          <Card className="overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">Carte interactive</p>
                <p className="text-gray-500">Faladie, Bamako, Mali</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#373B3A]">
            Questions Fréquentes
          </h2>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Combien de temps faut-il pour obtenir une réponse ?
                </h3>
                <p className="text-gray-600">
                  Nous nous engageons à répondre à tous les messages dans un délai de 24 heures ouvrables. 
                  Pour les demandes urgentes, n'hésitez pas à nous appeler directement.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Comment puis-je devenir partenaire d'Amani ?
                </h3>
                <p className="text-gray-600">
                  Sélectionnez "Partenariat" dans le formulaire de contact et décrivez votre projet. 
                  Notre équipe évaluera votre proposition et vous contactera pour discuter des opportunités de collaboration.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Puis-je planifier une réunion en personne ?
                </h3>
                <p className="text-gray-600">
                  Absolument ! Contactez-nous via le formulaire ou par téléphone pour planifier un rendez-vous 
                  dans nos bureaux à Abidjan ou organiser une visioconférence.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
