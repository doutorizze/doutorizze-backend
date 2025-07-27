import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Calendar, Clock, User, Phone, Mail, CreditCard, 
  CheckCircle, ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

interface BookingForm {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientCpf: string;
  symptoms: string;
  paymentMethod: 'credit' | 'installment' | 'pix';
  installments: number;
}

export default function Booking() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { clinics = [], addAppointment, loadClinics } = useStore();
  
  // Carregar clínicas do backend quando o componente é montado
  useEffect(() => {
    loadClinics();
  }, [loadClinics]);
  
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get('date') ? new Date(searchParams.get('date')!) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState(searchParams.get('time') || '');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  
  const [form, setForm] = useState<BookingForm>({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    patientCpf: '',
    symptoms: '',
    paymentMethod: 'credit',
    installments: 1
  });

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

  const clinicPrice = typeof clinic.price === 'string' ? parseFloat(clinic.price) : clinic.price;
  
  const installmentOptions = [
    { value: 1, label: 'À vista', price: clinicPrice },
    { value: 3, label: '3x sem juros', price: clinicPrice / 3 },
    { value: 6, label: '6x sem juros', price: clinicPrice / 6 },
    { value: 12, label: '12x com juros', price: (clinicPrice * 1.1) / 12 },
    { value: 18, label: '18x com juros', price: (clinicPrice * 1.15) / 18 },
    { value: 24, label: '24x com juros', price: (clinicPrice * 1.2) / 24 }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const prevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    if (newDate >= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const handleInputChange = (field: keyof BookingForm, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const appointment = {
      id: Date.now().toString(),
      patientId: 'patient-1',
      clinicId: clinic.id,
      servico: clinic.servicos[0],
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: 'scheduled' as const,
      price: clinicPrice,
      installments: form.paymentMethod === 'installment' ? {
        total: form.installments,
        paid: 0,
        amount: clinicPrice / form.installments
      } : undefined
    };
    
    addAppointment(appointment);
    setIsSubmitting(false);
    setBookingSuccess(true);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return selectedDate && selectedTime;
      case 2:
        return form.patientName && form.patientEmail && form.patientPhone && form.patientCpf;
      case 3:
        return form.paymentMethod;
      default:
        return false;
    }
  };

  if (bookingSuccess) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Agendamento Confirmado!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Sua consulta na {clinic.nomeFantasia} foi agendada com sucesso.
          </p>
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div>
                <p className="text-sm text-gray-600">Data e Horário</p>
                <p className="font-semibold">{formatDate(selectedDate)} às {selectedTime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Clínica</p>
                <p className="font-semibold">{clinic.nomeFantasia}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serviço</p>
                <p className="font-semibold">{clinic.servicos[0]}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor</p>
                <p className="font-semibold">
                  {form.installments === 1 
                    ? `R$ ${clinicPrice}` 
                    : `${form.installments}x de R$ ${(clinicPrice / form.installments).toFixed(2)}`
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ver Meus Agendamentos
            </Link>
            <Link
              to="/professionals"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Agendar Outra Consulta
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to={`/clinic/${clinic.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Voltar ao perfil
            </Link>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Agendar Consulta
            </h1>
            <p className="text-gray-600">
              {clinic.nomeFantasia} • {clinic.servicos[0]}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {step === 1 && 'Data e Horário'}
                    {step === 2 && 'Dados Pessoais'}
                    {step === 3 && 'Pagamento'}
                  </span>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 ml-4 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Step 1: Date and Time */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Escolha a data e horário
                </h2>
                
                {/* Date Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data da Consulta</h3>
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={prevDay} 
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      disabled={selectedDate <= new Date()}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <p className="text-xl font-semibold text-gray-900">
                        {formatDate(selectedDate)}
                      </p>
                    </div>
                    <button onClick={nextDay} className="p-2 hover:bg-gray-100 rounded-lg">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Horário Disponível</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {(availableTimes || []).map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
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

                {selectedDate && selectedTime && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">
                        Consulta agendada para {formatDate(selectedDate)} às {selectedTime}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Dados pessoais
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      value={form.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      value={form.patientCpf}
                      onChange={(e) => handleInputChange('patientCpf', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="000.000.000-00"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={form.patientEmail}
                      onChange={(e) => handleInputChange('patientEmail', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="seu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={form.patientPhone}
                      onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descreva seus sintomas ou motivo da consulta odontológica
                  </label>
                  <textarea
                    value={form.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva brevemente o que você está sentindo ou o motivo da consulta odontológica..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Forma de pagamento
                </h2>
                
                <div className="space-y-4 mb-8">
                  {/* Credit Card */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      form.paymentMethod === 'credit' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'credit')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={form.paymentMethod === 'credit'}
                        onChange={() => handleInputChange('paymentMethod', 'credit')}
                        className="text-blue-600"
                      />
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Cartão de Crédito</p>
                        <p className="text-sm text-gray-600">Pagamento tradicional no cartão</p>
                      </div>
                    </div>
                  </div>

                  {/* Installment */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      form.paymentMethod === 'installment' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'installment')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={form.paymentMethod === 'installment'}
                        onChange={() => handleInputChange('paymentMethod', 'installment')}
                        className="text-blue-600"
                      />
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Parcelamento DOUTORIZZE</p>
                        <p className="text-sm text-gray-600">Parcele em até 24x sem cartão de crédito</p>
                      </div>
                    </div>
                  </div>

                  {/* PIX */}
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      form.paymentMethod === 'pix' 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('paymentMethod', 'pix')}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        checked={form.paymentMethod === 'pix'}
                        onChange={() => handleInputChange('paymentMethod', 'pix')}
                        className="text-blue-600"
                      />
                      <CheckCircle className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-semibold text-gray-900">PIX</p>
                        <p className="text-sm text-gray-600">Pagamento instantâneo com desconto</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Installment Options */}
                {form.paymentMethod === 'installment' && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Escolha o parcelamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(installmentOptions || []).map((option) => (
                        <div
                          key={option.value}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            form.installments === option.value
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleInputChange('installments', option.value)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-900">
                                {option.label}
                              </p>
                              <p className="text-sm text-gray-600">
                                R$ {(typeof option.price === 'string' ? parseFloat(option.price) : option.price).toFixed(2)}
                              </p>
                            </div>
                            <input
                              type="radio"
                              checked={form.installments === option.value}
                              onChange={() => handleInputChange('installments', option.value)}
                              className="text-blue-600"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Agendamento</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clínica:</span>
                      <span className="font-semibold">{clinic.nomeFantasia}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data e horário:</span>
                      <span className="font-semibold">{formatDate(selectedDate)} às {selectedTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor:</span>
                      <span className="font-semibold">
                        {form.paymentMethod === 'installment' && form.installments > 1
                          ? `${form.installments}x de R$ ${(clinicPrice / form.installments).toFixed(2)}`
                          : `R$ ${clinicPrice}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                disabled={currentStep === 1}
              >
                Voltar
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isStepValid(currentStep)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isStepValid(currentStep)}
                >
                  Continuar
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${
                    isStepValid(currentStep) && !isSubmitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirmando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Confirmar Agendamento</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}