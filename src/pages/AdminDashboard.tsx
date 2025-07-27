import { useState, useEffect } from 'react';
import { 
  Users, CreditCard, CheckCircle, XCircle, Clock, AlertTriangle,
  Search, Filter, Download, Eye, MessageSquare, Calendar,
  TrendingUp, DollarSign, FileText, Settings, Bell, Send,
  Globe, Edit, Database, Mail, Phone, User
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';
import useParcelamais from '@/hooks/useParcelamais';

export default function AdminDashboard() {
  const { user, loanRequests, updateLoanRequest, getLoanRequestsByStatus } = useStore();
  
  // Tratamento de erro para o hook useParcelamais
  let parcelamaisHook;
  try {
    parcelamaisHook = useParcelamais();
  } catch (error) {
    console.error('Erro ao inicializar useParcelamais:', error);
    parcelamaisHook = {
      criarSolicitacaoCompleta: async () => null,
      buscarPropostas: async () => null
    };
  }
  
  const { criarSolicitacaoCompleta, buscarPropostas } = parcelamaisHook;
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    priority: string;
    sentAt: Date;
    sentBy: string;
  }>>([]);
  const [showSiteSettings, setShowSiteSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [siteData, setSiteData] = useState({
    siteName: 'DOUTORIZZE',
    siteDescription: 'Plataforma de agendamento odontológico',
    contactEmail: 'contato@doutorizze.com',
    contactPhone: '(11) 99999-9999',
    address: 'São Paulo, SP'
  });
  const [notificationData, setNotificationData] = useState({
    type: 'all', // 'clinics', 'patients', 'all'
    title: '',
    message: '',
    priority: 'normal' // 'low', 'normal', 'high'
  });

  // Filtrar solicitações baseado no status
  const pendingRequests = getLoanRequestsByStatus('sent_to_admin');
  const processingRequests = getLoanRequestsByStatus('admin_processing');
  const approvedRequests = getLoanRequestsByStatus('admin_approved');
  const rejectedRequests = getLoanRequestsByStatus('admin_rejected');

  const handleSendNotification = async () => {
    if (!notificationData.title || !notificationData.message) return;
    
    setIsProcessing(true);
    
    try {
      // Simular envio da notificação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newNotification = {
        id: Date.now().toString(),
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        priority: notificationData.priority,
        sentAt: new Date(),
        sentBy: 'Admin'
      };
      
      // Adicionar à lista de notificações enviadas
      setNotifications(prev => [newNotification, ...prev]);
      
      // Simular envio baseado no tipo
      let recipientCount = 0;
      if (notificationData.type === 'all') {
        recipientCount = 200; // Assumindo total de usuários
      } else if (notificationData.type === 'clinics') {
        recipientCount = 50; // Assumindo 50 clínicas
      } else {
        recipientCount = 150; // Assumindo 150 pacientes
      }
      
      // Mostrar toast de sucesso
      alert(`✅ Notificação enviada com sucesso para ${recipientCount} ${notificationData.type === 'all' ? 'usuários' : notificationData.type === 'clinics' ? 'clínicas' : 'pacientes'}!`);
      
      // Limpar formulário e fechar modal
      setShowNotifications(false);
      setNotificationData({
        type: 'all',
        title: '',
        message: '',
        priority: 'normal'
      });
      
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      alert('❌ Erro ao enviar notificação. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Estatísticas do dashboard
  const stats = {
    totalRequests: loanRequests.length,
    pendingRequests: pendingRequests.length,
    approvedToday: (approvedRequests || []).filter(req => 
      new Date(req.finalDecisionDate || '').toDateString() === new Date().toDateString()
    ).length,
    totalAmount: loanRequests.reduce((sum, req) => sum + req.amount, 0)
  };

  const handleProcessRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setIsProcessing(true);
    
    try {
      const request = (loanRequests || []).find(req => req.id === requestId);
      if (!request) return;

      if (action === 'approve') {
        // Primeiro marca como processando
        updateLoanRequest(requestId, {
          status: 'admin_processing',
          adminProcessingDate: new Date().toISOString(),
          adminNotes
        });

        // Simula envio para Parcelamais
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Faz a solicitação completa no Parcelamais
        const parcelamaisData = {
          nome: 'Cliente Teste',
          cpf: '12345678901',
          dataNascimento: '1990-01-01',
          telefone: '11999999999',
          email: 'cliente@teste.com',
          endereco: {
            cep: '01234567',
            uf: 'SP',
            cidade: 'São Paulo',
            bairro: 'Centro',
            rua: 'Rua Teste',
            numeroEndereco: '123'
          },
          rendaMensal: 5000,
          valorSolicitado: request.amount,
          cenario: '1', // Para sandbox
          clinica: request.clinicId
        };

        try {
          const response = await criarSolicitacaoCompleta(parcelamaisData);
          
          updateLoanRequest(requestId, {
            status: 'parcelamais_approved',
            finalDecisionDate: new Date().toISOString(),
            parcelamaisProposalId: response.id || 'PROP_' + Date.now(),
            adminNotes
          });
        } catch (error) {
          // Se falhar no Parcelamais, marca como aprovado pelo admin mas com erro
          updateLoanRequest(requestId, {
            status: 'admin_approved',
            finalDecisionDate: new Date().toISOString(),
            adminNotes: adminNotes + ' (Erro na integração Parcelamais)'
          });
        }
      } else {
        updateLoanRequest(requestId, {
          status: 'admin_rejected',
          finalDecisionDate: new Date().toISOString(),
          rejectionReason: adminNotes || 'Rejeitado pelo administrador',
          adminNotes
        });
      }
      
      setSelectedRequest(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Erro ao processar solicitação:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent_to_admin': return 'bg-yellow-100 text-yellow-800';
      case 'admin_processing': return 'bg-blue-100 text-blue-800';
      case 'admin_approved': return 'bg-green-100 text-green-800';
      case 'admin_rejected': return 'bg-red-100 text-red-800';
      case 'parcelamais_approved': return 'bg-emerald-100 text-emerald-800';
      case 'parcelamais_rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent_to_admin': return 'Aguardando Análise';
      case 'admin_processing': return 'Em Processamento';
      case 'admin_approved': return 'Aprovado pelo Admin';
      case 'admin_rejected': return 'Rejeitado';
      case 'parcelamais_approved': return 'Aprovado Parcelamais';
      case 'parcelamais_rejected': return 'Rejeitado Parcelamais';
      default: return status;
    }
  };

  const getCurrentRequests = () => {
    switch (activeTab) {
      case 'pending': return pendingRequests;
      case 'processing': return processingRequests;
      case 'approved': return approvedRequests;
      case 'rejected': return rejectedRequests;
      default: return loanRequests;
    }
  };

  const filteredRequests = (getCurrentRequests() || []).filter(request =>
    searchTerm === '' || 
    request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.amount.toString().includes(searchTerm)
  );

  if (!user || user.type !== 'admin') {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acesso Negado</h2>
            <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Dashboard Administrativo
                </h1>
                <p className="text-gray-600">
                  Gerencie solicitações de empréstimo e integração com Parcelamais
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSiteSettings(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configurações do Site
                </button>
                <button
                  onClick={() => setShowNotifications(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Enviar Notificações
                </button>
              </div>
            </div>
          </div>



          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total de Solicitações</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Aprovadas Hoje</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvedToday}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    R$ {stats.totalAmount.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                  {[
                    { key: 'pending', label: 'Pendentes', count: pendingRequests.length },
                    { key: 'processing', label: 'Processando', count: processingRequests.length },
                    { key: 'approved', label: 'Aprovadas', count: approvedRequests.length },
                    { key: 'rejected', label: 'Rejeitadas', count: rejectedRequests.length }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar por ID ou valor..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Solicitação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clínica
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parcelas
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(filteredRequests || []).map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{request.id.slice(-8)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Agendamento #{request.appointmentId.slice(-6)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Clínica ID: {request.clinicId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          R$ {request.amount.toLocaleString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.installments}x
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusColor(request.status)
                        }`}>
                          {getStatusText(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Ver
                          </button>
                          {request.status === 'sent_to_admin' && (
                            <>
                              <button
                                onClick={() => handleProcessRequest(request.id, 'approve')}
                                disabled={isProcessing}
                                className="text-green-600 hover:text-green-900 flex items-center gap-1 disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Aprovar
                              </button>
                              <button
                                onClick={() => handleProcessRequest(request.id, 'reject')}
                                disabled={isProcessing}
                                className="text-red-600 hover:text-red-900 flex items-center gap-1 disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                                Rejeitar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma solicitação encontrada
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Tente ajustar os filtros de busca.' : 'Não há solicitações nesta categoria.'}
                </p>
              </div>
            )}
          </div>

          {/* Site Settings Modal */}
          {showSiteSettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Configurações do Site
                    </h3>
                    <button
                      onClick={() => setShowSiteSettings(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Site
                      </label>
                      <input
                        type="text"
                        value={siteData.siteName}
                        onChange={(e) => setSiteData({...siteData, siteName: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição do Site
                      </label>
                      <textarea
                        value={siteData.siteDescription}
                        onChange={(e) => setSiteData({...siteData, siteDescription: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail de Contato
                        </label>
                        <input
                          type="email"
                          value={siteData.contactEmail}
                          onChange={(e) => setSiteData({...siteData, contactEmail: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone de Contato
                        </label>
                        <input
                          type="tel"
                          value={siteData.contactPhone}
                          onChange={(e) => setSiteData({...siteData, contactPhone: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={siteData.address}
                        onChange={(e) => setSiteData({...siteData, address: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => {
                        // Aqui você salvaria as configurações
                        console.log('Salvando configurações:', siteData);
                        setShowSiteSettings(false);
                      }}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Database className="w-4 h-4" />
                      Salvar Configurações
                    </button>
                    <button
                      onClick={() => setShowSiteSettings(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Modal */}
          {showNotifications && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      Enviar Notificações
                    </h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destinatários
                      </label>
                      <select
                        value={notificationData.type}
                        onChange={(e) => setNotificationData({...notificationData, type: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">Todos os Usuários</option>
                        <option value="clinics">Apenas Clínicas</option>
                        <option value="patients">Apenas Pacientes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prioridade
                      </label>
                      <select
                        value={notificationData.priority}
                        onChange={(e) => setNotificationData({...notificationData, priority: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Baixa</option>
                        <option value="normal">Normal</option>
                        <option value="high">Alta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título da Notificação
                      </label>
                      <input
                        type="text"
                        value={notificationData.title}
                        onChange={(e) => setNotificationData({...notificationData, title: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Manutenção programada do sistema"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem
                      </label>
                      <textarea
                        value={notificationData.message}
                        onChange={(e) => setNotificationData({...notificationData, message: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Digite a mensagem da notificação..."
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Preview da Notificação</h4>
                      <div className="bg-white p-3 rounded border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Bell className="w-4 h-4 text-blue-600" />
                          <span className={`text-xs px-2 py-1 rounded ${
                            notificationData.priority === 'high' ? 'bg-red-100 text-red-800' :
                            notificationData.priority === 'normal' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {notificationData.priority === 'high' ? 'Alta Prioridade' :
                             notificationData.priority === 'normal' ? 'Prioridade Normal' :
                             'Baixa Prioridade'}
                          </span>
                        </div>
                        <h5 className="font-medium text-gray-900">
                          {notificationData.title || 'Título da notificação'}
                        </h5>
                        <p className="text-sm text-gray-600 mt-1">
                          {notificationData.message || 'Mensagem da notificação aparecerá aqui...'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Para: {notificationData.type === 'all' ? 'Todos os usuários' :
                                notificationData.type === 'clinics' ? 'Clínicas' : 'Pacientes'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={handleSendNotification}
                      disabled={!notificationData.title || !notificationData.message || isProcessing}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isProcessing ? 'Enviando...' : 'Enviar Notificação'}
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Request Detail Modal */}
          {selectedRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Detalhes da Solicitação #{selectedRequest.id.slice(-8)}
                    </h3>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Valor Solicitado</label>
                        <p className="text-lg font-semibold text-gray-900">
                          R$ {selectedRequest.amount.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Parcelas</label>
                        <p className="text-lg font-semibold text-gray-900">
                          {selectedRequest.installments}x
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status Atual</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        getStatusColor(selectedRequest.status)
                      }`}>
                        {getStatusText(selectedRequest.status)}
                      </span>
                    </div>

                    {selectedRequest.clinicNotes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Observações da Clínica</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedRequest.clinicNotes}
                        </p>
                      </div>
                    )}

                    {selectedRequest.status === 'sent_to_admin' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Observações do Administrador
                        </label>
                        <textarea
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Adicione observações sobre esta solicitação..."
                        />
                      </div>
                    )}

                    {selectedRequest.adminNotes && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Observações do Admin</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedRequest.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedRequest.status === 'sent_to_admin' && (
                    <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleProcessRequest(selectedRequest.id, 'approve')}
                        disabled={isProcessing}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Aprovar e Enviar para Parcelamais
                      </button>
                      <button
                        onClick={() => handleProcessRequest(selectedRequest.id, 'reject')}
                        disabled={isProcessing}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeitar Solicitação
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}