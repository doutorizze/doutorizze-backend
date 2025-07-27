import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, MapPin, Calendar, Clock, CreditCard, Shield, 
  Award, GraduationCap, Users, CheckCircle, Phone, Mail,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

export default function ClinicProfile() {
  const { id } = useParams();
  const { clinics } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);

  const clinic = clinics.find(c => c.id === id);

  if (!clinic) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Clínica não encontrada</h1>
          <Link to="/professionals" className="text-blue-600 hover:text-blue-700">
            Voltar para busca
          </Link>
        </div>
      </Layout>
    );
  }

  const availableTimes = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const reviews = [
    {
      id: 1,
      patientName: 'Maria S.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Excelente profissional! Muito atencioso e explicou tudo detalhadamente. Recomendo!'
    },
    {
      id: 2,
      patientName: 'João P.',
      rating: 5,
      date: '2024-01-10',
      comment: 'Consulta muito esclarecedora. Dr. muito competente e pontual.'
    },
    {
      id: 3,
      patientName: 'Ana L.',
      rating: 4,
      date: '2024-01-08',
      comment: 'Bom atendimento, ambiente agradável. Voltarei com certeza.'
    }
  ];

  const clinicPrice = typeof clinic.price === 'string' ? parseFloat(clinic.price) : clinic.price;
  
  const installmentOptions = [
    { installments: 1, value: clinicPrice, total: clinicPrice },
    { installments: 3, value: (clinicPrice / 3), total: clinicPrice },
    { installments: 6, value: (clinicPrice / 6), total: clinicPrice },
    { installments: 12, value: (clinicPrice / 12), total: clinicPrice * 1.1 },
    { installments: 18, value: (clinicPrice / 18), total: clinicPrice * 1.15 },
    { installments: 24, value: (clinicPrice / 24), total: clinicPrice * 1.2 }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const prevWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link 
              to="/professionals" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Voltar para busca
            </Link>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              <div className="flex items-center space-x-6 mb-6 lg:mb-0">
                <img
                  src={clinic.avatar}
                  alt={clinic.nomeFantasia}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {clinic.nomeFantasia}
                  </h1>
                  <p className="text-xl text-blue-600 font-semibold mb-2">
                    {clinic.servicos.join(', ')}
                  </p>
                  <p className="text-gray-600 mb-3">
                    {clinic.cro} • {clinic.endereco}, {clinic.cidade} - {clinic.estado}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">{clinic.rating}</span>
                      <span className="text-gray-500">({clinic.reviewCount} avaliações)</span>
                    </div>
                    <span className="text-gray-500">Dr. {clinic.responsavelTecnico}</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:ml-auto">
                <div className="bg-blue-50 rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    R$ {clinic.price}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Consulta odontológica
                  </div>
                  <button
                    onClick={() => setShowInstallmentModal(true)}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Ver opções de parcelamento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre a Clínica</h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {clinic.description}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Responsável Técnico</p>
                      <p className="text-sm text-gray-600">Dr. {clinic.responsavelTecnico}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Registro CRO</p>
                      <p className="text-sm text-gray-600">{clinic.cro}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Pacientes Atendidos</p>
                      <p className="text-sm text-gray-600">Mais de 2.000 pacientes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Certificações</p>
                      <p className="text-sm text-gray-600">Membro do Conselho Regional de Odontologia</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Serviços Oferecidos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {clinic.servicos.map((servico, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700">{servico}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações dos Pacientes</h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-blue-600">
                              {review.patientName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.patientName}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Booking */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{clinic.endereco}, {clinic.cidade} - {clinic.estado}, {clinic.cep}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">(11) 99999-9999</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">contato@{clinic.nomeFantasia.toLowerCase().replace(/\s+/g, '')}.com</span>
                  </div>
                </div>
              </div>

              {/* Booking Widget */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Agendar Consulta</h3>
                
                {/* Date Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={prevWeek} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="font-medium text-gray-900">
                      {formatDate(selectedDate)}
                    </h4>
                    <button onClick={nextWeek} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Horários Disponíveis</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <Link
                  to={`/booking/${clinic.id}?date=${selectedDate.toISOString()}&time=${selectedTime}`}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-center block transition-colors ${
                    selectedTime
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedTime ? 'Confirmar Agendamento' : 'Selecione um horário'}
                </Link>
                
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Parcele em até 24x sem cartão</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installment Modal */}
      {showInstallmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Opções de Parcelamento</h3>
            <div className="space-y-3 mb-6">
              {installmentOptions.map((option) => (
                <div key={option.installments} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
                  <div>
                    <span className="font-semibold">
                      {option.installments}x de R$ {(typeof option.value === 'string' ? parseFloat(option.value) : option.value).toFixed(2)}
                    </span>
                    {option.installments === 1 && (
                      <span className="text-green-600 text-sm ml-2">À vista</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: R$ {(typeof option.total === 'string' ? parseFloat(option.total) : option.total).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowInstallmentModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
              <Link
                to={`/booking/${clinic.id}`}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                onClick={() => setShowInstallmentModal(false)}
              >
                Agendar Agora
              </Link>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}