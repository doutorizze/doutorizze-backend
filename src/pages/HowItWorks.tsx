import { CheckCircle, Users, Calendar, CreditCard, Shield, Clock } from 'lucide-react';
import Layout from '@/components/Layout';

export default function HowItWorks() {
  const steps = [
    {
      icon: Users,
      title: 'Encontre a Clínica',
      description: 'Busque por serviços odontológicos, localização e avaliações. Veja perfis completos com informações detalhadas.',
      details: ['Filtros avançados de busca', 'Avaliações de outros pacientes', 'Informações sobre serviços e responsável técnico']
    },
    {
      icon: Calendar,
      title: 'Agende sua Consulta',
      description: 'Escolha o melhor horário disponível e confirme seu agendamento em poucos cliques.',
      details: ['Agenda em tempo real', 'Confirmação automática', 'Lembretes por SMS e email']
    },
    {
      icon: CreditCard,
      title: 'Escolha como Pagar',
      description: 'Pague à vista ou parcele sem cartão de crédito. Análise de crédito rápida e aprovação instantânea.',
      details: ['Parcelamento em até 24x', 'PIX parcelado', 'Boleto bancário', 'Sem cartão de crédito']
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Todas as clínicas são verificadas e possuem registro ativo no CRO (Conselho Regional de Odontologia).'
    },
    {
      icon: Clock,
      title: 'Economia de Tempo',
      description: 'Agende consultas 24h por dia, sem filas de telefone ou espera por retorno.'
    },
    {
      icon: CreditCard,
      title: 'Flexibilidade de Pagamento',
      description: 'Parcele procedimentos caros sem comprometer seu orçamento mensal.'
    }
  ];

  const forClinics = [
    'Aumente sua visibilidade online',
    'Gerencie sua agenda de forma inteligente',
    'Receba pagamentos garantidos',
    'Reduza faltas com lembretes automáticos',
    'Acesse relatórios financeiros detalhados',
    'Ofereça parcelamento aos seus pacientes'
  ];

  const forPatients = [
    'Encontre clínicas qualificadas',
    'Agende consultas odontológicas a qualquer hora',
    'Parcele tratamentos sem cartão',
    'Receba lembretes automáticos',
    'Avalie e seja avaliado',
    'Histórico completo de consultas'
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Como Funciona o DOUTORIZZE
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Conectamos pacientes e clínicas odontológicas de forma simples, segura e acessível
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                3 Passos Simples
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Agende sua consulta e cuide da sua saúde de forma prática e acessível
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Step Number */}
                    <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                      {index + 1}
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-xl p-8 h-full hover:shadow-lg transition-shadow">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                      <p className="text-gray-600 mb-6">{step.description}</p>
                      
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-500">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                        <div className="w-8 h-0.5 bg-blue-300"></div>
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-blue-300 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Por que Escolher o DOUTORIZZE?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Oferecemos a melhor experiência para pacientes e clínicas odontológicas
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* For Professionals and Patients */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* For Clinics */}
              <div className="bg-blue-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Para Clínicas Odontológicas
                </h3>
                <p className="text-gray-600 mb-8">
                  Expanda sua clínica e ofereça mais acessibilidade aos seus pacientes
                </p>
                <ul className="space-y-4">
                  {forClinics.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Cadastrar como Clínica
                </button>
              </div>

              {/* For Patients */}
              <div className="bg-green-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Para Pacientes
                </h3>
                <p className="text-gray-600 mb-8">
                  Cuide da sua saúde com praticidade e condições de pagamento flexíveis
                </p>
                <ul className="space-y-4">
                  {forPatients.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Encontrar Clínicas
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Começar?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se a milhares de pessoas que já transformaram sua experiência em saúde
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Encontrar Clínicas
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                Cadastrar como Clínica
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}