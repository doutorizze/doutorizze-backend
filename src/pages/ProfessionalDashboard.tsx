import { useState } from 'react';
import { 
  Calendar, Users, DollarSign, Clock, Star, TrendingUp,
  Bell, Settings, ChevronRight, Phone, Mail, MapPin,
  CheckCircle, XCircle, AlertCircle, BarChart3, Building2, Calculator,
  CreditCard, FileText, Eye, ThumbsUp, ThumbsDown
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';

export default function ClinicDashboard() {
  const { appointments, user, loanRequests, updateLoanRequest } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Filtrar solicitações de empréstimo da clínica
  const clinicLoanRequests = (loanRequests || []).filter(request => 
    request.clinicId === user?.id
  );
  
  const pendingLoanRequests = (clinicLoanRequests || []).filter(request => 
    request.status === 'patient_requested'
  );
  
  const handleLoanAction = (requestId: string, action: 'approve' | 'reject', notes?: string) => {
    const newStatus = action === 'approve' ? 'clinic_approved' : 'clinic_rejected';
    updateLoanRequest(requestId, {
      status: newStatus,
      clinicApprovalDate: new Date().toISOString(),
      clinicNotes: notes
    });
  };

  // Mock data for clinic dashboard - Enhanced based on Lovable site
  const stats = {
    totalPatients: 156,
    monthlyRevenue: 12500,
    appointmentsToday: 8,
    appointmentsCompleted: 1, // Consultas concluídas hoje
    dailyRevenue: 230, // Faturamento do dia
    averageRating: 4.8,
    weeklyGrowth: 12,
    monthlyGrowth: 8
  };

  // Enhanced appointments data based on Lovable site
  const todayAppointments = [
    {
      id: '1',
      time: '14:00',
      patientName: 'João Pedro Silva',
      type: 'Limpeza Dental',
      status: 'confirmed',
      paymentStatus: 'Pago',
      value: 150,
      date: '19/01/2024',
      phone: '(11) 99999-9999',
      isFirstTime: false
    },
    {
      id: '2',
      time: '10:30',
      patientName: 'Maria Santos',
      type: 'Clareamento Dental',
      status: 'pending',
      paymentStatus: 'Pendente',
      value: 350,
      date: '24/01/2024',
      phone: '(11) 88888-8888',
      isFirstTime: false
    },
    {
      id: '3',
      time: '16:00',
      patientName: 'Carlos Oliveira',
      type: 'Consulta de Avaliação',
      status: 'completed',
      paymentStatus: 'Pago',
      value: 80,
      date: '17/01/2024',
      phone: '(11) 77777-7777',
      isFirstTime: false
    }
  ];

  const recentPatients = [
    {
      id: '1',
      name: 'Maria Silva',
      lastVisit: '2024-01-15',
      totalVisits: 3,
      status: 'active',
      phone: '(11) 99999-9999'
    },
    {
      id: '2',
      name: 'João Santos',
      lastVisit: '2024-01-10',
      totalVisits: 5,
      status: 'active',
      phone: '(11) 88888-8888'
    },
    {
      id: '3',
      name: 'Ana Costa',
      lastVisit: '2024-01-08',
      totalVisits: 1,
      status: 'new',
      phone: '(11) 77777-7777'
    }
  ];

  const notifications = [
    {
      id: '1',
      type: 'appointment',
      message: 'Nova consulta agendada para hoje às 16:00',
      time: '10 min atrás',
      read: false
    },
    {
      id: '2',
      type: 'payment',
      message: 'Pagamento de R$ 300 foi aprovado',
      time: '1 hora atrás',
      read: false
    },
    {
      id: '3',
      type: 'review',
      message: 'Você recebeu uma nova avaliação (5 estrelas)',
      time: '2 horas atrás',
      read: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Olá, {user?.nomeFantasia || 'Clínica'}
                </h1>
                <p className="text-gray-600 mt-1">
                  Aqui está um resumo da agenda e atividades da clínica
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
                  <Settings className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoje</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.appointmentsToday}</p>
                  <p className="text-sm text-green-600 mt-1">+2 que ontem</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Concluídas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.appointmentsCompleted}</p>
                  <p className="text-sm text-green-600 mt-1">Hoje</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Faturamento</p>
                  <p className="text-3xl font-bold text-gray-900">R$ {stats.dailyRevenue}</p>
                  <p className="text-sm text-green-600 mt-1">Hoje</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avaliação</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Schedule */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Agenda de Hoje</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Ver agenda completa
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(todayAppointments || []).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{appointment.time}</p>
                          <p className="text-xs text-gray-500">{appointment.date}</p>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                            {appointment.isFirstTime && (
                              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Novo paciente
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-sm text-gray-500">{appointment.phone}</p>
                          <p className="text-sm font-semibold text-green-600">R$ {appointment.value}</p>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${
                            getStatusColor(appointment.status)
                          }`}>
                            {getStatusIcon(appointment.status)}
                            <span className="capitalize">{appointment.status}</span>
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            appointment.paymentStatus === 'Pago' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.paymentStatus}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Mail className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Patients */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Pacientes Recentes</h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Ver todos
                  </button>
                </div>
                
                <div className="space-y-4">
                  {(recentPatients || []).map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-600">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                            {patient.status === 'new' && (
                              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Novo
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Última visita: {new Date(patient.lastVisit).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-500">
                            {patient.totalVisits} consulta{patient.totalVisits !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Phone className="w-4 h-4" />
                        </button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loan Requests */}
              {pendingLoanRequests.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      Solicitações de Empréstimo
                    </h2>
                    <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {pendingLoanRequests.length} pendente{pendingLoanRequests.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    {(pendingLoanRequests || []).map((request) => {
                      const appointment = (appointments || []).find(apt => apt.id === request.appointmentId);
                      const patient = appointment ? `Paciente ${appointment.patientId}` : 'Paciente não encontrado';
                      
                      return (
                        <div key={request.id} className="border border-orange-200 rounded-xl p-4 bg-orange-50">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900">{patient}</h3>
                              <p className="text-sm text-gray-600">
                                Valor: R$ {request.amount.toLocaleString('pt-BR')}
                              </p>
                              <p className="text-sm text-gray-600">
                                Parcelas: {request.installments}x
                              </p>
                              <p className="text-sm text-gray-500">
                                Solicitado em: {new Date(request.requestDate).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleLoanAction(request.id, 'approve')}
                                className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                                title="Aprovar"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleLoanAction(request.id, 'reject', 'Rejeitado pela clínica')}
                                className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                                title="Rejeitar"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                              <button className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {appointment && (
                            <div className="bg-white rounded-lg p-3 mt-3">
                              <p className="text-sm text-gray-600">
                                <strong>Consulta:</strong> {appointment.servico} - {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Fluxo:</strong> Após sua aprovação, a solicitação será enviada para o admin master processar no Parcelamais.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Bloquear Horário
                  </button>

                  <button className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Ver Relatórios
                  </button>
                  <button className="w-full bg-gray-100 text-gray-700 p-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Configurar Agenda
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notificações</h3>
                
                <div className="space-y-4">
                  {(notifications || []).map((notification) => (
                    <div key={notification.id} className={`p-3 rounded-lg border ${
                      notification.read ? 'border-gray-200 bg-gray-50' : 'border-blue-200 bg-blue-50'
                    }`}>
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-700' : 'text-blue-900 font-medium'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Ver todas as notificações
                </button>
              </div>

              {/* Performance Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
                  <BarChart3 className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Atendimentos este mês</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Taxa de retorno</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Satisfação</span>
                      <span className="font-medium">96%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}