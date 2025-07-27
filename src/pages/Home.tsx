import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Calendar, CreditCard, Shield, Users, Clock, CheckCircle, ArrowRight, Zap, Heart, Award, UserPlus, Navigation, Loader, X, Grid3X3 } from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

export default function Home() {
  const { clinics, updateSearchFilters, loadClinics } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'loading'>('prompt');
  const [locationError, setLocationError] = useState<string>('');
  const [nearestClinics, setNearestClinics] = useState<any[]>([]);
  const [showTreatmentsModal, setShowTreatmentsModal] = useState(false);

  const treatments = [
    { name: 'Limpeza', popular: true },
    { name: 'Clareamento', popular: false },
    { name: 'Implante', popular: true },
    { name: 'Aparelho', popular: false },
    { name: 'Canal', popular: false },
    { name: 'Periodontia', popular: false },
    { name: 'Cirurgia Oral', popular: false },
    { name: 'Prótese Dentária', popular: true },
    { name: 'Odontopediatria', popular: false },
    { name: 'Ortodontia', popular: true },
    { name: 'Endodontia', popular: false },
    { name: 'Dentística', popular: false },
    { name: 'Radiologia Oral', popular: false },
    { name: 'Harmonização Facial', popular: true },
    { name: 'Bichectomia', popular: false },
    { name: 'Facetas de Porcelana', popular: true },
    { name: 'Extração', popular: false },
    { name: 'Prevenção', popular: false }
  ];

  const services = [
    {
      icon: '🦷',
      title: 'Limpeza Dental',
      description: 'Profilaxia completa com remoção de tártaro e polimento',
      price: '80',
      duration: '45 min',
      rating: '4.9',
      popular: true
    },
    {
      icon: '✨',
      title: 'Clareamento',
      description: 'Clareamento dental profissional com resultados imediatos',
      price: '350',
      duration: '60 min',
      rating: '4.8',
      popular: false
    },
    {
      icon: '🔧',
      title: 'Implantes',
      description: 'Implantes dentários com tecnologia de ponta',
      price: '1.800',
      duration: '90 min',
      rating: '4.9',
      popular: true
    },
    {
      icon: '📐',
      title: 'Aparelho Ortodôntico',
      description: 'Correção dentária com aparelhos tradicionais ou invisível',
      price: '250/mês',
      duration: '30 min',
      rating: '4.7',
      popular: false
    },
    {
      icon: '🩺',
      title: 'Tratamento de Canal',
      description: 'Endodontia com técnicas modernas e menos dor',
      price: '400',
      duration: '75 min',
      rating: '4.6',
      popular: false
    },
    {
      icon: '🚨',
      title: 'Urgência 24h',
      description: 'Atendimento de emergência disponível',
      price: '150',
      duration: 'Imediato',
      rating: '4.5',
      popular: false
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Encontre o Profissional',
      description: 'Busque por especialidade, localização ou tipo de tratamento. Compare preços, avaliações e disponibilidade.',
      features: ['Filtros avançados', 'Avaliações reais', 'Localização próxima']
    },
    {
      step: '2',
      title: 'Agende sua Consulta',
      description: 'Escolha o melhor horário disponível e confirme seu agendamento em tempo real.',
      features: ['Agenda em tempo real', 'Confirmação automática', 'Lembretes por WhatsApp']
    },
    {
      step: '3',
      title: 'Pague com Segurança',
      description: 'Faça o pagamento online ou presencial. Oferecemos parcelamento e opções de financiamento.',
      features: ['Cartão ou Pix', 'Parcelamento', 'Financiamento aprovado']
    },
    {
      step: '4',
      title: 'Avalie sua Experiência',
      description: 'Compartilhe sua experiência e ajude outros pacientes a encontrarem o melhor atendimento.',
      features: ['Sistema de avaliação', 'Feedback construtivo', 'Melhoria contínua']
    }
  ];

  const whyChoose = [
    'Profissionais verificados e qualificados',
    'Preços transparentes e competitivos',
    'Agendamento rápido e fácil',
    'Suporte 24/7 para dúvidas',
    'Garantia de qualidade nos serviços',
    'Programa de fidelidade com descontos'
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Paciente',
      content: 'Consegui parcelar minha cirurgia em 12x sem juros. O atendimento foi excelente e o processo muito simples.',
      rating: 5,
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=happy%20middle%20aged%20woman%20patient%20smiling%20portrait%20healthcare%20satisfaction&image_size=square'
    },
    {
      name: 'Dr. João Santos',
      role: 'Cardiologista',
      content: 'A plataforma aumentou minha agenda em 40%. Os pacientes chegam mais preparados e o sistema de pagamento é eficiente.',
      rating: 5,
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20cardiologist%20doctor%20white%20coat%20confident%20smile%20medical%20office&image_size=square'
    },
    {
      name: 'Ana Costa',
      role: 'Paciente',
      content: 'Encontrei o melhor dermatologista da região e ainda consegui parcelar o tratamento. Recomendo para todos!',
      rating: 5,
      avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=young%20woman%20patient%20happy%20satisfied%20healthcare%20treatment%20natural%20smile&image_size=square'
    }
  ];

  const stats = [
    { number: '10.000+', label: 'Pacientes Atendidos' },
    { number: '500+', label: 'Profissionais Cadastrados' },
    { number: '50+', label: 'Especialidades Médicas' },
    { number: '98%', label: 'Satisfação dos Usuários' }
  ];

  // Função para calcular distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Função para obter coordenadas de uma cidade (simulação)
  const getCityCoordinates = (cidade: string, estado: string) => {
    const coordinates: {[key: string]: {lat: number, lng: number}} = {
      'São Paulo-SP': { lat: -23.5505, lng: -46.6333 },
      'Rio de Janeiro-RJ': { lat: -22.9068, lng: -43.1729 },
      'Belo Horizonte-MG': { lat: -19.9167, lng: -43.9345 },
      'Brasília-DF': { lat: -15.7942, lng: -47.8822 },
      'Salvador-BA': { lat: -12.9714, lng: -38.5014 },
      'Fortaleza-CE': { lat: -3.7319, lng: -38.5267 },
      'Recife-PE': { lat: -8.0476, lng: -34.8770 },
      'Porto Alegre-RS': { lat: -30.0346, lng: -51.2177 },
      'Curitiba-PR': { lat: -25.4284, lng: -49.2733 },
      'Manaus-AM': { lat: -3.1190, lng: -60.0217 }
    };
    
    const key = `${cidade}-${estado}`;
    return coordinates[key] || { lat: -23.5505, lng: -46.6333 }; // Default para São Paulo
  };

  // Função para solicitar localização do usuário
  const requestLocation = () => {
    setLocationPermission('loading');
    setLocationError(''); // Limpar erros anteriores
    
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocalização não é suportada neste navegador';
      console.warn(errorMsg);
      setLocationError(errorMsg);
      setLocationPermission('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationPermission('granted');
        setLocationError(''); // Limpar qualquer erro anterior
        console.log('Localização obtida com sucesso:', { latitude, longitude });
      },
      (error) => {
        let errorMessage = 'Erro desconhecido ao obter localização';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada. Clique no ícone de localização na barra de endereços para permitir.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Informações de localização não disponíveis. Verifique se o GPS está ativado.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tempo limite excedido. Tente novamente.';
            break;
          default:
            errorMessage = `Erro de geolocalização: ${error.message}`;
            break;
        }
        
        console.warn(errorMessage, error);
        setLocationError(errorMessage);
        setLocationPermission('denied');
      },
      {
        enableHighAccuracy: false, // Mudado para false para melhor compatibilidade
        timeout: 15000, // Aumentado para 15 segundos
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  // Efeito para calcular clínicas próximas quando a localização do usuário muda
  useEffect(() => {
    if (userLocation && clinics.length > 0) {
      const clinicsWithDistance = clinics.map(clinic => {
        const clinicCoords = getCityCoordinates(clinic.cidade, clinic.estado);
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          clinicCoords.lat,
          clinicCoords.lng
        );
        
        return {
          ...clinic,
          distance: distance,
          distanceText: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`
        };
      });
      
      // Ordenar por distância e pegar as 3 mais próximas
      const nearest = clinicsWithDistance
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      
      setNearestClinics(nearest);
    }
  }, [userLocation, clinics]);

  // Verificar permissão de localização ao carregar a página
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
          setLocationPermission(result.state as any);
          if (result.state === 'granted') {
            requestLocation();
          }
        })
        .catch((error) => {
          console.warn('Erro ao verificar permissões de geolocalização:', error);
          // Se não conseguir verificar permissões, define como prompt
          setLocationPermission('prompt');
        });
    } else {
      // Se a API de permissões não estiver disponível, define como prompt
      setLocationPermission('prompt');
    }
  }, []);

  // Carregar clínicas do backend quando o componente é montado
  useEffect(() => {
    loadClinics();
  }, [loadClinics]);

  // Atualizar localização em tempo real (a cada 5 minutos)
  useEffect(() => {
    if (locationPermission === 'granted' && userLocation) {
      const interval = setInterval(() => {
        requestLocation();
      }, 300000); // 5 minutos

      return () => clearInterval(interval);
    }
  }, [locationPermission, userLocation]);

  const handleSearch = () => {
    updateSearchFilters({ servico: searchTerm, location });
    // Navigate to clinics page
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20dental%20clinic%20interior%20with%20clean%20white%20equipment%20professional%20lighting%20comfortable%20patient%20chair%20dental%20tools%20organized%20medical%20environment%20bright%20and%20welcoming%20atmosphere&image_size=landscape_16_9"
            alt="Clínica odontológica moderna"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Conectando sorrisos
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span className="text-blue-300">Seu sorriso</span>
              <br />
              <span className="text-white">perfeito</span>
              <br />
              <span className="text-white">está aqui</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mb-8">
              Conectamos você aos melhores dentistas da sua região. Agende consultas, 
              compare preços e transforme seu sorriso com segurança.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-white ml-1">4.9/5</span>
                </div>
                <span className="text-blue-100">avaliação média</span>
              </div>
              <div className="text-blue-100">
                <span className="font-bold text-blue-300">50k+</span> pacientes atendidos
              </div>
            </div>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Especialidade ou dentista"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cidade ou região"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Buscar
                  </button>
                </div>
                
                {/* Location Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-900">Localização atual</span>
                    </div>
                    {locationPermission === 'prompt' && (
                      <button
                        onClick={requestLocation}
                        className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        Permitir localização
                      </button>
                    )}
                    {locationPermission === 'loading' && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Obtendo localização...</span>
                      </div>
                    )}
                    {locationPermission === 'denied' && (
                      <div className="text-sm text-red-600">
                        <span>Localização negada</span>
                        {locationError && (
                          <div className="text-xs mt-1 text-red-500">
                            {locationError}
                          </div>
                        )}
                      </div>
                    )}
                    {locationPermission === 'granted' && userLocation && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600">✓ Localização ativa</span>
                        <button
                          onClick={requestLocation}
                          className="text-xs text-blue-600 hover:text-blue-700 underline"
                          title="Atualizar localização"
                        >
                          Atualizar
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {userLocation && nearestClinics.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-3">Clínicas mais próximas de você:</p>
                      <div className="space-y-2">
                        {nearestClinics.map((clinic) => (
                          <div key={clinic.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src={clinic.avatar}
                                alt={clinic.nomeFantasia}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900 text-sm">{clinic.nomeFantasia}</p>
                                <p className="text-xs text-gray-600">{clinic.cidade}, {clinic.estado}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-blue-600">{clinic.distanceText}</p>
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600 ml-1">{clinic.rating}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-3">Encontre o tratamento ideal</p>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Tratamentos populares:</span>
                      {treatments.slice(0, 3).map((treatment, index) => (
                        <span key={treatment.name}>
                          <button
                            onClick={() => setSearchTerm(treatment.name)}
                            className="text-blue-600 hover:text-blue-700 mx-1"
                          >
                            {treatment.name}
                          </button>
                          {index < 2 && ', '}
                        </span>
                      ))}
                      <span className="text-gray-400">...</span>
                    </div>
                    <button
                      onClick={() => setShowTreatmentsModal(true)}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center space-x-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                      <span>Ver todos</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tratamentos <span className="text-blue-600">populares</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encontre o tratamento perfeito para o seu sorriso com os melhores profissionais
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">R$ {service.price}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>⏱️ {service.duration}</span>
                  {service.popular && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Popular
                    </span>
                  )}
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Agendar consulta
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como <span className="text-blue-600">funciona</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transforme seu sorriso em 4 passos simples
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o <span className="text-blue-600">DOUTORIZZE</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A plataforma mais confiável para cuidar do seu sorriso
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {whyChoose.map((item, index) => (
               <div key={index} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
                 <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle className="w-8 h-8 text-blue-600" />
                 </div>
                 <p className="text-gray-600">{item}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Featured Clinics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {userLocation && nearestClinics.length > 0 ? (
                <>Clínicas <span className="text-blue-600">próximas a você</span></>
              ) : (
                <>Clínicas <span className="text-blue-600">em destaque</span></>
              )}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {userLocation && nearestClinics.length > 0 ? (
                'Encontre as melhores clínicas odontológicas perto da sua localização'
              ) : (
                'Conheça as clínicas mais bem avaliadas da nossa plataforma'
              )}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(userLocation && nearestClinics.length > 0 ? nearestClinics : clinics.slice(0, 3)).map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                  <img
                    src={clinic.avatar}
                    alt={clinic.nomeFantasia}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 text-sm font-medium text-blue-600">
                    ⭐ {clinic.rating}
                  </div>
                  {clinic.distanceText && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-medium">
                      📍 {clinic.distanceText}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{clinic.nomeFantasia}</h3>
                  <p className="text-blue-600 font-medium mb-2">
                    {clinic.servicos && clinic.servicos.length > 0 ? (
                      <>{clinic.servicos[0]}{clinic.servicos.length > 1 && ` +${clinic.servicos.length - 1}`}</>
                    ) : (
                      'Serviços disponíveis'
                    )}
                  </p>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">
                      {clinic.cidade}, {clinic.estado}
                      {clinic.distanceText && (
                        <span className="ml-2 text-green-600 font-medium">• {clinic.distanceText}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">({clinic.reviewCount || 0})</span> avaliações
                    </div>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">CRO:</span> {clinic.cro || 'N/A'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">
                        R$ {clinic.price}
                      </span>
                      <span className="text-sm text-gray-500 block">ou 12x sem juros</span>
                    </div>
                    <Link
                      to={`/clinic/${clinic.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Agendar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/professionals"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Ver Todas as Clínicas</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              O que nossos <span className="text-blue-600">pacientes dizem</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Histórias reais de transformação e cuidado
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transforme seu <span className="text-blue-200">sorriso</span> hoje
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Junte-se a mais de 50.000 pessoas que já encontraram o dentista ideal 
              e transformaram seus sorrisos conosco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/professionals"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 inline-flex items-center justify-center shadow-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Encontrar dentista
              </Link>
              <Link
                 to="/register"
                 className="border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center backdrop-blur-sm"
               >
                 <UserPlus className="w-5 h-5 mr-2" />
                 Cadastrar-se grátis
               </Link>
            </div>
            <div className="mt-8 text-blue-200 text-sm">
              ✨ Sem taxas ocultas • 🔒 100% seguro • ⚡ Aprovação instantânea
            </div>
          </div>
        </div>
      </section>

      {/* Treatments Modal */}
      {showTreatmentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Todos os Tratamentos</h2>
                <p className="text-gray-600 mt-1">Escolha o tratamento ideal para você</p>
              </div>
              <button
                onClick={() => setShowTreatmentsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {treatments.map((treatment, index) => {
                  const treatmentIcons = {
                    'Limpeza': '🦷',
                    'Clareamento': '✨',
                    'Implante': '🔧',
                    'Aparelho': '📐',
                    'Canal': '🩺',
                    'Periodontia': '🌿',
                    'Cirurgia Oral': '⚕️',
                    'Prótese Dentária': '🦷',
                    'Odontopediatria': '👶',
                    'Ortodontia': '📏',
                    'Endodontia': '🔬',
                    'Dentística': '💎',
                    'Radiologia Oral': '📸',
                    'Harmonização Facial': '💆‍♀️',
                    'Bichectomia': '✂️',
                    'Facetas de Porcelana': '🪞',
                    'Extração': '🦷',
                    'Prevenção': '🛡️'
                  };
                  
                  return (
                    <button
                      key={treatment.name}
                      onClick={() => {
                        setSearchTerm(treatment.name);
                        setShowTreatmentsModal(false);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg text-left ${
                        treatment.popular 
                          ? 'border-blue-200 bg-blue-50 hover:border-blue-300' 
                          : 'border-gray-200 bg-white hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {treatmentIcons[treatment.name as keyof typeof treatmentIcons] || '🦷'}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{treatment.name}</h3>
                          {treatment.popular && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-1">
                              Popular
                            </span>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Não encontrou o que procura?
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Entre em contato conosco e encontraremos o especialista ideal para você
                  </p>
                  <Link
                    to="/contact"
                    onClick={() => setShowTreatmentsModal(false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <span>Falar com especialista</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}