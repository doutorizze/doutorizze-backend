import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Phone, Mail, Star, Download,
  CreditCard, FileText, User, Settings, Bell, ChevronRight,
  CheckCircle, AlertCircle, XCircle, Plus, Filter, DollarSign
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

export default function PatientArea() {
  const { user, appointments } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('appointments');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for patient area
  const patientAppointments = [
    {
      id: '1',
      date: '2024-01-20',
      time: '14:00',
      doctor: 'Dr. Carlos Silva',
      specialty: 'Cardiologia',
      clinic: 'Clínica Coração Saudável',
      address: 'Rua das Flores, 123 - São Paulo',
      status: 'confirmed',
      price: 300,
      installments: 3,
      installmentValue: 100,
      type: 'Consulta de rotina',
      phone: '(11) 3333-4444'
    },
    {
      id: '2',
      date: '2024-01-15',
      time: '10:30',
      doctor: 'Dra. Ana Santos',
      specialty: 'Dermatologia',
      clinic: 'Clínica Pele & Beleza',
      address: 'Av. Paulista, 456 - São Paulo',
      status: 'completed',
      price: 250,
      installments: 2,
      installmentValue: 125,
      type: 'Consulta especializada',
      phone: '(11) 2222-3333',
      rating: 5,
      review: 'Excelente atendimento, muito profissional!'
    },
    {
      id: '3',
      date: '2024-01-25',
      time: '16:00',
      doctor: 'Dr. Pedro Costa',
      specialty: 'Ortopedia',
      clinic: 'Centro Ortopédico',
      address: 'Rua da Saúde, 789 - São Paulo',
      status: 'pending',
      price: 400,
      installments: 4,
      installmentValue: 100,
      type: 'Primeira consulta',
      phone: '(11) 4444-5555'
    }
  ];

  const paymentHistory = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Consulta - Dra. Ana Santos',
      amount: 125,
      installment: '1/2',
      status: 'paid',
      method: 'Cartão de Crédito'
    },
    {
      id: '2',
      date: '2024-01-20',
      description: 'Consulta - Dr. Carlos Silva',
      amount: 100,
      installment: '1/3',
      status: 'paid',
      method: 'PIX'
    },
    {
      id: '3',
      date: '2024-02-15',
      description: 'Consulta - Dra. Ana Santos',
      amount: 125,
      installment: '2/2',
      status: 'pending',
      method: 'Cartão de Crédito'
    }
  ];

  const documents = [
    {
      id: '1',
      name: 'Receita Médica - Dr. Carlos Silva',
      date: '2024-01-15',
      type: 'PDF',
      size: '245 KB'
    },
    {
      id: '2',
      name: 'Exame de Sangue - Resultados',
      date: '2024-01-10',
      type: 'PDF',
      size: '1.2 MB'
    },
    {
      id: '3',
      name: 'Atestado Médico',
      date: '2024-01-08',
      type: 'PDF',
      size: '180 KB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
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
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = filterStatus === 'all' 
    ? patientAppointments 
    : (patientAppointments || []).filter(apt => apt.status === filterStatus);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Minha Área
                </h1>
                <p className="text-gray-600 mt-1">
                  Gerencie suas consultas, pagamentos e documentos
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => navigate('/loan-request')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Solicitar Empréstimo</span>
                </button>
                
                <button 
                  onClick={() => navigate('/booking')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nova Consulta</span>
                </button>
                
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
          {/* Profile Summary */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.name || 'Paciente'}
                </h2>
                <p className="text-gray-600">{user?.email || 'paciente@email.com'}</p>
                <p className="text-gray-600">(11) 99999-9999</p>
              </div>
              
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Consultas</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">R$ 2.400</p>
                  <p className="text-sm text-gray-600">Economizado</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">4.9</p>
                  <p className="text-sm text-gray-600">Avaliação</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'appointments', label: 'Consultas', icon: Calendar },
                  { id: 'payments', label: 'Pagamentos', icon: CreditCard },
                  { id: 'documents', label: 'Documentos', icon: FileText }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-6">
              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Minhas Consultas</h3>
                    
                    <div className="flex items-center space-x-4">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="all">Todas</option>
                        <option value="confirmed">Confirmadas</option>
                        <option value="pending">Pendentes</option>
                        <option value="completed">Concluídas</option>
                        <option value="cancelled">Canceladas</option>
                      </select>
                      
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm">Filtros</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(filteredAppointments || []).map((appointment) => (
                      <div key={appointment.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {appointment.doctor}
                              </h4>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${
                                getStatusColor(appointment.status)
                              }`}>
                                {getStatusIcon(appointment.status)}
                                <span className="capitalize">{appointment.status}</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                                </span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>{appointment.clinic}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>{appointment.specialty} - {appointment.type}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <CreditCard className="w-4 h-4" />
                                <span>
                                  {appointment.installments}x de R$ {appointment.installmentValue}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm text-gray-500 mt-2">{appointment.address}</p>
                            
                            {appointment.status === 'completed' && appointment.rating && (
                              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-sm font-medium text-gray-700">Sua avaliação:</span>
                                  <div className="flex items-center">
                                    {[...Array(appointment.rating)].map((_, i) => (
                                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{appointment.review}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            {appointment.status === 'confirmed' && (
                              <>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Phone className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Mail className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Tab */}
              {activeTab === 'payments' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Histórico de Pagamentos</h3>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Total pago:</span> R$ 225
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Pendente:</span> R$ 125
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {(paymentHistory || []).map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{payment.description}</h4>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                getPaymentStatusColor(payment.status)
                              }`}>
                                {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Data:</span> {new Date(payment.date).toLocaleDateString('pt-BR')}
                              </div>
                              <div>
                                <span className="font-medium">Parcela:</span> {payment.installment}
                              </div>
                              <div>
                                <span className="font-medium">Método:</span> {payment.method}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right ml-4">
                            <p className="text-lg font-bold text-gray-900">
                              R$ {payment.amount}
                            </p>
                            {payment.status === 'pending' && (
                              <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Pagar Agora
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Meus Documentos</h3>
                    
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Solicitar documento
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(documents || []).map((document) => (
                      <div key={document.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-red-600" />
                          </div>
                          
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <h4 className="font-semibold text-gray-900 mb-2">{document.name}</h4>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Data: {new Date(document.date).toLocaleDateString('pt-BR')}</p>
                          <p>Tipo: {document.type}</p>
                          <p>Tamanho: {document.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}