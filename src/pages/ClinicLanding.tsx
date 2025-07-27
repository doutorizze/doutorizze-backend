import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Zap,
  Target,
  Award,
  BarChart3,
  Heart,
  Smartphone,
  CreditCard,
  Globe
} from 'lucide-react';
import Layout from '../components/Layout';

const ClinicLanding = () => {
  const [selectedPlan, setSelectedPlan] = useState('premium');

  const benefits = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Mais Pacientes",
      description: "Aumente sua base de pacientes em até 300% com nossa plataforma de alta visibilidade"
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-600" />,
      title: "Agenda Otimizada",
      description: "Sistema inteligente de agendamento que reduz cancelamentos e otimiza sua agenda"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      title: "Crescimento Garantido",
      description: "Clínicas parceiras relatam crescimento médio de 250% no primeiro ano"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Pagamentos Seguros",
      description: "Sistema de pagamento integrado com proteção total para você e seus pacientes"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-600" />,
      title: "App Mobile",
      description: "Gerencie sua clínica de qualquer lugar com nosso app mobile completo"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Relatórios Detalhados",
      description: "Analytics avançados para otimizar seus resultados e tomar decisões estratégicas"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Carlos Silva",
      clinic: "Clínica Sorriso Perfeito",
      location: "São Paulo, SP",
      rating: 5,
      text: "Em 6 meses na plataforma, triplicamos nossa base de pacientes. O DOUTORIZZE revolucionou nossa clínica!",
      growth: "+320% pacientes"
    },
    {
      name: "Dra. Ana Costa",
      clinic: "Odonto Excellence",
      location: "Rio de Janeiro, RJ",
      rating: 5,
      text: "A qualidade dos pacientes que chegam através da plataforma é excepcional. Recomendo 100%!",
      growth: "+280% faturamento"
    },
    {
      name: "Dr. Roberto Lima",
      clinic: "Dental Care Plus",
      location: "Belo Horizonte, MG",
      rating: 5,
      text: "O sistema de agendamento é fantástico. Reduziu nossos cancelamentos em 70%!",
      growth: "+190% eficiência"
    }
  ];

  const plans = [
    {
      name: "Básico",
      price: "R$ 197",
      period: "/mês",
      description: "Ideal para clínicas iniciantes",
      features: [
        "Perfil na plataforma",
        "Até 50 agendamentos/mês",
        "Suporte por email",
        "Relatórios básicos",
        "App mobile"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "R$ 397",
      period: "/mês",
      description: "Mais popular entre clínicas",
      features: [
        "Tudo do plano Básico",
        "Agendamentos ilimitados",
        "Destaque na busca",
        "Suporte prioritário",
        "Relatórios avançados",
        "Integração com WhatsApp",
        "Marketing digital incluso"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 697",
      period: "/mês",
      description: "Para redes de clínicas",
      features: [
        "Tudo do plano Premium",
        "Múltiplas unidades",
        "API personalizada",
        "Gerente de conta dedicado",
        "Treinamento da equipe",
        "Campanhas exclusivas",
        "Análise de concorrência"
      ],
      popular: false
    }
  ];

  const stats = [
    { number: "50K+", label: "Pacientes Ativos" },
    { number: "1.2K+", label: "Clínicas Parceiras" },
    { number: "98%", label: "Satisfação" },
    { number: "24/7", label: "Suporte" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-600/30 backdrop-blur-sm text-blue-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Plataforma #1 para Clínicas
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-blue-300">Transforme</span>
                <br />
                <span className="text-white">sua clínica em</span>
                <br />
                <span className="text-blue-300">referência</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                Conecte-se com milhares de pacientes, otimize sua agenda e 
                multiplique seu faturamento com a plataforma odontológica mais completa do Brasil.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-300">{stat.number}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
                >
                  Cadastrar Minha Clínica
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <button className="border-2 border-blue-300 text-blue-300 hover:bg-blue-300 hover:text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
                  Ver Demonstração
                </button>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-center">Resultados Reais</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                    <span>Novos Pacientes/Mês</span>
                    <span className="text-green-400 font-bold">+320%</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                    <span>Faturamento Médio</span>
                    <span className="text-green-400 font-bold">+280%</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                    <span>Taxa de Ocupação</span>
                    <span className="text-green-400 font-bold">95%</span>
                  </div>
                  <div className="flex items-center justify-between bg-white/10 rounded-lg p-4">
                    <span>Cancelamentos</span>
                    <span className="text-green-400 font-bold">-70%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o DOUTORIZZE?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mais de 1.200 clínicas já transformaram seus resultados conosco. 
              Descubra os benefícios que farão sua clínica crescer.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que dizem nossos parceiros
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de sucesso de clínicas que cresceram conosco
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.clinic}</div>
                      <div className="text-sm text-gray-500">{testimonial.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-600 font-bold text-lg">{testimonial.growth}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planos que cabem no seu bolso
            </h2>
            <p className="text-xl text-gray-600">
              Escolha o plano ideal para o tamanho da sua clínica
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-xl p-8 shadow-lg border-2 ${
                plan.popular ? 'border-blue-500 transform scale-105' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}>
                  Escolher Plano
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Todos os planos incluem 30 dias de teste grátis • Sem taxa de setup • Cancele quando quiser
            </p>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
              Precisa de um plano personalizado? Fale conosco
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para transformar sua clínica?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a mais de 1.200 clínicas que já cresceram conosco. 
            Comece seu teste gratuito hoje mesmo!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
            >
              Começar Teste Grátis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <a
              href="tel:+5511999999999"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center"
            >
              <Phone className="w-5 h-5 mr-2" />
              (11) 99999-9999
            </a>
          </div>
          
          <div className="mt-8 text-blue-100">
            <p>✓ Sem compromisso ✓ Setup gratuito ✓ Suporte especializado</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre nossa plataforma
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Como funciona o período de teste gratuito?
              </h3>
              <p className="text-gray-700">
                Você tem 30 dias para testar todas as funcionalidades da plataforma sem nenhum custo. 
                Não cobramos taxa de setup e você pode cancelar a qualquer momento.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Quanto tempo leva para ver resultados?
              </h3>
              <p className="text-gray-700">
                A maioria das clínicas vê um aumento significativo de agendamentos já na primeira semana. 
                Em média, nossos parceiros relatam crescimento de 200-300% em 3 meses.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Vocês oferecem treinamento para minha equipe?
              </h3>
              <p className="text-gray-700">
                Sim! Oferecemos treinamento completo para sua equipe, materiais de apoio e suporte 
                contínuo para garantir que você aproveite ao máximo nossa plataforma.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Posso integrar com meu sistema atual?
              </h3>
              <p className="text-gray-700">
                Nossa plataforma oferece APIs e integrações com os principais sistemas de gestão 
                odontológica do mercado. Nossa equipe técnica te ajuda na integração.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ClinicLanding;