import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, Calculator, FileText, CheckCircle, AlertCircle,
  DollarSign, Calendar, Clock, ArrowRight, Info
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

export default function LoanRequest() {
  const { user, appointments, addLoanRequest } = useStore();
  const navigate = useNavigate();
  const [selectedAppointment, setSelectedAppointment] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [installments, setInstallments] = useState<number>(12);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Filtrar agendamentos do usuário que podem ter empréstimo
  const userAppointments = appointments.filter(apt => 
    apt.patientId === user?.id && 
    apt.status === 'scheduled' &&
    !apt.installments // Não tem parcelamento ainda
  );

  const selectedApt = appointments.find(apt => apt.id === selectedAppointment);
  const maxLoanAmount = selectedApt ? selectedApt.price * 2 : 0; // Máximo 2x o valor da consulta
  const monthlyPayment = loanAmount > 0 ? loanAmount / installments : 0;
  const interestRate = 2.5; // 2.5% ao mês
  const totalWithInterest = loanAmount * (1 + (interestRate / 100) * installments);
  const monthlyPaymentWithInterest = totalWithInterest / installments;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedAppointment || loanAmount <= 0) return;

    setIsSubmitting(true);

    try {
      // Simular processamento
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newLoanRequest = {
        id: 'LOAN_' + Date.now(),
        patientId: user.id,
        clinicId: selectedApt?.clinicId || '',
        appointmentId: selectedAppointment,
        amount: loanAmount,
        installments,
        status: 'patient_requested' as const,
        requestDate: new Date().toISOString()
      };

      addLoanRequest(newLoanRequest);
      setShowSuccess(true);

      // Redirecionar após 3 segundos
      setTimeout(() => {
        navigate('/patient-area');
      }, 3000);
    } catch (error) {
      console.error('Erro ao solicitar empréstimo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.type !== 'patient') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h2>
            <p className="text-gray-600">Esta área é exclusiva para pacientes.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (showSuccess) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Solicitação Enviada!
            </h2>
            <p className="text-gray-600 mb-6">
              Sua solicitação de empréstimo foi enviada para a clínica. 
              Você receberá uma notificação quando ela for analisada.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos Passos:</h3>
              <ol className="text-sm text-blue-700 space-y-1 text-left">
                <li>1. A clínica analisará sua solicitação</li>
                <li>2. Se aprovada, será enviada para o admin master</li>
                <li>3. O admin fará a solicitação no Parcelamais</li>
                <li>4. Você receberá o resultado final</li>
              </ol>
            </div>
            <p className="text-sm text-gray-500">
              Redirecionando para sua área em alguns segundos...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Solicitar Empréstimo
            </h1>
            <p className="text-gray-600">
              Financie seu tratamento odontológico com condições especiais
            </p>
          </div>

          {/* Flow Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Como funciona o processo:</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  1
                </div>
                <p className="text-sm text-blue-700">Você solicita o empréstimo</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  2
                </div>
                <p className="text-sm text-blue-700">Clínica analisa e aprova</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  3
                </div>
                <p className="text-sm text-blue-700">Admin master processa</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  4
                </div>
                <p className="text-sm text-blue-700">Parcelamais aprova</p>
              </div>
            </div>
          </div>

          {userAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum agendamento disponível
              </h3>
              <p className="text-gray-600 mb-6">
                Você precisa ter um agendamento confirmado para solicitar um empréstimo.
              </p>
              <button
                onClick={() => navigate('/booking')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Agendar Consulta
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Dados da Solicitação
                  </h2>

                  {/* Appointment Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Selecione o agendamento *
                    </label>
                    <select
                      value={selectedAppointment}
                      onChange={(e) => {
                        setSelectedAppointment(e.target.value);
                        setLoanAmount(0); // Reset loan amount when changing appointment
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Escolha um agendamento</option>
                      {userAppointments.map(apt => (
                        <option key={apt.id} value={apt.id}>
                          {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time} - 
                          {apt.servico} - R$ {apt.price.toLocaleString('pt-BR')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedApt && (
                    <>
                      {/* Loan Amount */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor do empréstimo *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            min="100"
                            max={maxLoanAmount}
                            step="50"
                            value={loanAmount || ''}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                            required
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Valor máximo: R$ {maxLoanAmount.toLocaleString('pt-BR')} 
                          (2x o valor da consulta)
                        </p>
                      </div>

                      {/* Installments */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número de parcelas *
                        </label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        >
                          {[6, 12, 18, 24, 36].map(num => (
                            <option key={num} value={num}>{num}x</option>
                          ))}
                        </select>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || loanAmount <= 0}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Enviando solicitação...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            Solicitar Empréstimo
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </>
                  )}
                </form>
              </div>

              {/* Summary */}
              {selectedApt && loanAmount > 0 && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Resumo do Empréstimo
                    </h3>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor solicitado:</span>
                        <span className="font-semibold text-gray-900">
                          R$ {loanAmount.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Parcelas:</span>
                        <span className="font-semibold text-gray-900">
                          {installments}x
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Taxa de juros:</span>
                        <span className="font-semibold text-gray-900">
                          {interestRate}% a.m.
                        </span>
                      </div>

                      <hr className="border-gray-200" />

                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor total:</span>
                        <span className="font-semibold text-gray-900">
                          R$ {totalWithInterest.toLocaleString('pt-BR')}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600">Parcela mensal:</span>
                        <span className="font-bold text-blue-600 text-lg">
                          R$ {monthlyPaymentWithInterest.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm font-medium text-yellow-800">
                          Importante
                        </span>
                      </div>
                      <p className="text-xs text-yellow-700">
                        Esta é uma simulação. Os valores finais podem variar 
                        após análise de crédito do Parcelamais.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}