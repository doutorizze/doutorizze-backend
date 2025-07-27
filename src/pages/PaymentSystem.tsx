import { useState } from 'react';
import { 
  CreditCard, DollarSign, TrendingUp, Users, Calendar,
  CheckCircle, XCircle, AlertCircle, Clock, Filter,
  Download, Search, ChevronRight, BarChart3, PieChart
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

export default function PaymentSystem() {
  const { user } = useStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for payment system
  const paymentStats = {
    totalRevenue: 45600,
    monthlyGrowth: 12.5,
    totalTransactions: 234,
    averageTicket: 195,
    pendingAmount: 8900,
    approvalRate: 94.2
  };

  const transactions = [
    {
      id: 'TXN001',
      date: '2024-01-20',
      patient: 'Maria Silva',
      doctor: 'Dr. Carlos Silva',
      service: 'Consulta Cardiologia',
      amount: 300,
      installments: 3,
      installmentValue: 100,
      status: 'approved',
      method: 'Cartão de Crédito',
      currentInstallment: 1,
      nextDueDate: '2024-02-20'
    },
    {
      id: 'TXN002',
      date: '2024-01-19',
      patient: 'João Santos',
      doctor: 'Dra. Ana Costa',
      service: 'Consulta Dermatologia',
      amount: 250,
      installments: 2,
      installmentValue: 125,
      status: 'pending',
      method: 'PIX',
      currentInstallment: 1,
      nextDueDate: '2024-02-19'
    },
    {
      id: 'TXN003',
      date: '2024-01-18',
      patient: 'Ana Oliveira',
      doctor: 'Dr. Pedro Lima',
      service: 'Consulta Ortopedia',
      amount: 400,
      installments: 4,
      installmentValue: 100,
      status: 'rejected',
      method: 'Cartão de Crédito',
      currentInstallment: 0,
      nextDueDate: null
    },
    {
      id: 'TXN004',
      date: '2024-01-17',
      patient: 'Carlos Mendes',
      doctor: 'Dra. Lucia Santos',
      service: 'Consulta Neurologia',
      amount: 350,
      installments: 1,
      installmentValue: 350,
      status: 'completed',
      method: 'Débito',
      currentInstallment: 1,
      nextDueDate: null
    }
  ];

  const installmentPlans = [
    {
      id: 'PLAN001',
      patient: 'Maria Silva',
      totalAmount: 1200,
      installments: 6,
      installmentValue: 200,
      paidInstallments: 2,
      remainingAmount: 800,
      nextDueDate: '2024-02-15',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: 'PLAN002',
      patient: 'João Santos',
      totalAmount: 800,
      installments: 4,
      installmentValue: 200,
      paidInstallments: 4,
      remainingAmount: 0,
      nextDueDate: null,
      status: 'completed',
      createdAt: '2023-12-01'
    },
    {
      id: 'PLAN003',
      patient: 'Ana Oliveira',
      totalAmount: 1500,
      installments: 10,
      installmentValue: 150,
      paidInstallments: 1,
      remainingAmount: 1350,
      nextDueDate: '2024-02-20',
      status: 'overdue',
      createdAt: '2024-01-05'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'completed':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Sistema de Pagamentos
                </h1>
                <p className="text-gray-600 mt-1">
                  Gerencie transações, parcelamentos e relatórios financeiros
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Exportar Relatório</span>
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
                  <p className="text-sm text-gray-600">Receita Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {paymentStats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    +{paymentStats.monthlyGrowth}% este mês
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transações</p>
                  <p className="text-3xl font-bold text-gray-900">{paymentStats.totalTransactions}</p>
                  <p className="text-sm text-blue-600 mt-1">Este mês</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Médio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    R$ {paymentStats.averageTicket}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">Por transação</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taxa de Aprovação</p>
                  <p className="text-3xl font-bold text-gray-900">{paymentStats.approvalRate}%</p>
                  <p className="text-sm text-green-600 mt-1">Últimos 30 dias</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
                  { id: 'transactions', label: 'Transações', icon: CreditCard },
                  { id: 'installments', label: 'Parcelamentos', icon: Calendar },
                  { id: 'analytics', label: 'Análises', icon: PieChart }
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
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
                      <div className="h-64 flex items-end justify-between space-x-2">
                        {[65, 78, 82, 95, 88, 92, 100].map((height, index) => (
                          <div key={index} className="flex-1 bg-blue-600 rounded-t" style={{ height: `${height}%` }}></div>
                        ))}
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-2">
                        <span>Jan</span>
                        <span>Fev</span>
                        <span>Mar</span>
                        <span>Abr</span>
                        <span>Mai</span>
                        <span>Jun</span>
                        <span>Jul</span>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pagamento</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Cartão de Crédito</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                            <span className="text-sm font-medium">65%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">PIX</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                            </div>
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Cartão de Débito</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '10%' }}></div>
                            </div>
                            <span className="text-sm font-medium">10%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              getStatusColor(transaction.status)
                            }`}>
                              {getStatusIcon(transaction.status)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{transaction.patient}</p>
                              <p className="text-sm text-gray-600">{transaction.service}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">R$ {transaction.amount}</p>
                            <p className="text-sm text-gray-600">{transaction.installments}x</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Transactions Tab */}
              {activeTab === 'transactions' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Todas as Transações</h3>
                    
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar transações..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="all">Todos os status</option>
                        <option value="approved">Aprovado</option>
                        <option value="pending">Pendente</option>
                        <option value="rejected">Rejeitado</option>
                        <option value="completed">Concluído</option>
                      </select>
                      
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                        <Filter className="w-4 h-4" />
                        <span className="text-sm">Filtros</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Paciente</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Serviço</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Valor</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Parcelas</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((transaction) => (
                          <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                              {transaction.id}
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{transaction.patient}</p>
                                <p className="text-sm text-gray-600">{transaction.doctor}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">{transaction.service}</td>
                            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                              R$ {transaction.amount}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {transaction.installments}x de R$ {transaction.installmentValue}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 w-fit ${
                                getStatusColor(transaction.status)
                              }`}>
                                {getStatusIcon(transaction.status)}
                                <span className="capitalize">{transaction.status}</span>
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">
                              {new Date(transaction.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-4 px-4">
                              <button className="text-blue-600 hover:text-blue-700">
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Installments Tab */}
              {activeTab === 'installments' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Planos de Parcelamento</h3>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Total em aberto:</span> R$ {paymentStats.pendingAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {installmentPlans.map((plan) => (
                      <div key={plan.id} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{plan.patient}</h4>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center space-x-1 ${
                                getStatusColor(plan.status)
                              }`}>
                                {getStatusIcon(plan.status)}
                                <span className="capitalize">{plan.status}</span>
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Valor Total:</span>
                                <p className="font-semibold text-gray-900">R$ {plan.totalAmount}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Parcelas:</span>
                                <p className="font-semibold text-gray-900">
                                  {plan.paidInstallments}/{plan.installments}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600">Valor da Parcela:</span>
                                <p className="font-semibold text-gray-900">R$ {plan.installmentValue}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Restante:</span>
                                <p className="font-semibold text-gray-900">R$ {plan.remainingAmount}</p>
                              </div>
                            </div>
                            
                            {plan.nextDueDate && (
                              <p className="text-sm text-gray-600 mt-2">
                                Próximo vencimento: {new Date(plan.nextDueDate).toLocaleDateString('pt-BR')}
                              </p>
                            )}
                          </div>
                          
                          <div className="ml-4">
                            <div className="text-center">
                              <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center mb-2">
                                <span className="text-lg font-bold text-gray-700">
                                  {Math.round((plan.paidInstallments / plan.installments) * 100)}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">Progresso</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(plan.paidInstallments / plan.installments) * 100}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Criado em: {new Date(plan.createdAt).toLocaleDateString('pt-BR')}
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            {plan.status === 'active' && (
                              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                Cobrar Próxima
                              </button>
                            )}
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                              Ver Detalhes
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performance Metrics */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Métricas de Performance</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Taxa de Aprovação</span>
                            <span className="font-medium">{paymentStats.approvalRate}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${paymentStats.approvalRate}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Crescimento Mensal</span>
                            <span className="font-medium">{paymentStats.monthlyGrowth}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${paymentStats.monthlyGrowth * 5}%` }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Satisfação do Cliente</span>
                            <span className="font-medium">92%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top Performing Doctors */}
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Médicos com Maior Receita</h3>
                      <div className="space-y-3">
                        {[
                          { name: 'Dr. Carlos Silva', revenue: 12500, growth: 15 },
                          { name: 'Dra. Ana Costa', revenue: 9800, growth: 8 },
                          { name: 'Dr. Pedro Lima', revenue: 8200, growth: 12 },
                          { name: 'Dra. Lucia Santos', revenue: 7600, growth: 5 }
                        ].map((doctor, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{doctor.name}</p>
                              <p className="text-sm text-green-600">+{doctor.growth}% este mês</p>
                            </div>
                            <p className="font-semibold text-gray-900">R$ {doctor.revenue.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
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