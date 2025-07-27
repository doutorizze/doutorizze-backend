import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: 'patient'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        userType: 'patient'
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      info: '(11) 3000-0000',
      description: 'Segunda a sexta, 8h às 18h'
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'contato@doutorizze.com.br',
      description: 'Respondemos em até 24h'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      info: 'Av. Paulista, 1000 - São Paulo/SP',
      description: 'CEP: 01310-100'
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      info: 'Segunda a Sexta: 8h às 18h',
      description: 'Sábado: 8h às 12h'
    }
  ];

  const faqItems = [
    {
      question: 'Como funciona o parcelamento sem cartão?',
      answer: 'Realizamos uma análise de crédito rápida e oferecemos parcelamento via PIX ou boleto bancário em até 24x, sem necessidade de cartão de crédito.'
    },
    {
      question: 'Os profissionais são verificados?',
      answer: 'Sim, todos os profissionais passam por um processo rigoroso de verificação, incluindo validação do registro no conselho de classe e documentação.'
    },
    {
      question: 'Posso cancelar ou reagendar uma consulta?',
      answer: 'Sim, você pode cancelar ou reagendar consultas através da plataforma com até 24h de antecedência, sem custos adicionais.'
    },
    {
      question: 'Como recebo os lembretes das consultas?',
      answer: 'Enviamos lembretes automáticos por SMS, e-mail e WhatsApp 24h e 2h antes da consulta agendada.'
    }
  ];

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Mensagem Enviada!
            </h2>
            <p className="text-gray-600 mb-6">
              Obrigado pelo seu contato. Nossa equipe responderá em até 24 horas.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Enviar Nova Mensagem
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Estamos aqui para ajudar você. Fale conosco!
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-blue-600 font-medium mb-1">{item.info}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Contact Form and FAQ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Envie sua Mensagem
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-2">
                        Você é:
                      </label>
                      <select
                        id="userType"
                        name="userType"
                        value={formData.userType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="patient">Paciente</option>
        <option value="clinic">Clínica</option>
        <option value="other">Outro</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Assunto *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Sobre o que você gostaria de falar?"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Descreva sua dúvida ou sugestão..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Send className="w-5 h-5 mr-2" />
                        Enviar Mensagem
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {/* FAQ */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Perguntas Frequentes
                </h2>
                
                <div className="space-y-6">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {item.question}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Não encontrou sua resposta?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a 
                      href="tel:1130000000"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      Ligar Agora
                    </a>
                    <a 
                      href="mailto:contato@doutorizze.com.br"
                      className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors text-center"
                    >
                      Enviar E-mail
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}