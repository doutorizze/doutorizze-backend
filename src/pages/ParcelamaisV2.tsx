import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  CreditCard, 
  FileText, 
  Search, 
  Send, 
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  Building
} from 'lucide-react';
import useParcelamais from '../hooks/useParcelamais';
import {
  SolicitacaoComplementaV2,
  OfertasRequest,
  EnviarPropostaRequest,
  DocumentoLastroRequest,
  BuscarPropostaParams
} from '../services/parcelamaisApi';

const ParcelamaisV2 = () => {
  // Tratamento de erro para o hook useParcelamais
  let parcelamaisHook;
  try {
    parcelamaisHook = useParcelamais();
  } catch (error) {
    console.error('Erro ao inicializar useParcelamais:', error);
    parcelamaisHook = {
      isAuthenticated: false,
      isLoading: false,
      error: 'Erro ao carregar integração Parcelamais V2',
      clinicas: [],
      login: async () => false,
      logout: () => {},
      criarSolicitacaoCompleta: async () => null,
      buscarOfertas: async () => null,
      enviarProposta: async () => null,
      enviarDocumentoLastro: async () => null,
      buscarPropostas: async () => null,
      clearError: () => {}
    };
  }
  
  const {
    isAuthenticated,
    isLoading,
    error,
    clinicas,
    criarSolicitacaoCompleta,
    buscarOfertas,
    enviarProposta,
    enviarDocumentoLastro,
    buscarPropostas
  } = parcelamaisHook;

  const [activeTab, setActiveTab] = useState('solicitacao');
  const [propostas, setPropostas] = useState<any[]>([]);
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [selectedProposta, setSelectedProposta] = useState<string>('');
  const [selectedClinica, setSelectedClinica] = useState<string>('');

  // Formulário de Solicitação Completa
  const [solicitacaoForm, setSolicitacaoForm] = useState<SolicitacaoComplementaV2>({
    nome: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    endereco: {
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      rua: '',
      numeroEndereco: ''
    },
    rendaMensal: 0,
    valorSolicitado: 0,
    cenario: '1', // Para sandbox
    clinica: ''
  });

  // Formulário de Ofertas
  const [ofertasForm, setOfertasForm] = useState<OfertasRequest>({
    id: '',
    valorSolicitado: 0,
    financeira: '',
    diaVencimentoParcelas: 10,
    entrada: 0
  });

  // Formulário de Proposta
  const [propostaForm, setPropostaForm] = useState<EnviarPropostaRequest>({
    id: '',
    prazo: 12,
    financeira: '',
    rg: '',
    estadoEmissaoRg: 'SP',
    estadoCivil: 'Solteiro',
    nomeMae: '',
    quantidadeMesesOcupacao: '12',
    sexo: 'Masculino',
    profissao: 'Autonomo',
    endereco: {
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      rua: '',
      numeroEndereco: ''
    },
    tipoResidencia: '1',
    situacaoProfissional: 1,
    patrimonio: '50000',
    quantidadeDependentes: 0,
    clienteAlfabetizado: true,
    melhorHorario: '09:00'
  });

  // Formulário de Documento Lastro
  const [documentoForm, setDocumentoForm] = useState<DocumentoLastroRequest>({
    id: '',
    arquivo: ''
  });

  // Buscar propostas ao carregar
  useEffect(() => {
    if (isAuthenticated) {
      handleBuscarPropostas();
    }
  }, [isAuthenticated]);

  const handleSolicitacaoCompleta = async () => {
    if (!selectedClinica) {
      toast.error('Selecione uma clínica');
      return;
    }

    const data = {
      ...solicitacaoForm,
      clinica: selectedClinica
    };

    const response = await criarSolicitacaoCompleta(data);
    if (response) {
      toast.success('Solicitação criada com sucesso!');
      console.log('Resposta:', response);
      handleBuscarPropostas(); // Atualiza a lista
    }
  };

  const handleBuscarOfertas = async () => {
    if (!ofertasForm.id || !ofertasForm.financeira) {
      toast.error('Preencha ID da proposta e financeira');
      return;
    }

    const response = await buscarOfertas(ofertasForm);
    if (response) {
      setOfertas(response.parcelas || []);
      toast.success('Ofertas carregadas com sucesso!');
    }
  };

  const handleEnviarProposta = async () => {
    if (!propostaForm.id || !propostaForm.financeira) {
      toast.error('Preencha ID da proposta e financeira');
      return;
    }

    const response = await enviarProposta(propostaForm);
    if (response) {
      toast.success('Proposta enviada com sucesso!');
      console.log('Resposta:', response);
    }
  };

  const handleEnviarDocumento = async () => {
    if (!documentoForm.id || !documentoForm.arquivo) {
      toast.error('Preencha ID da proposta e URL do arquivo');
      return;
    }

    const response = await enviarDocumentoLastro(documentoForm);
    if (response) {
      toast.success('Documento enviado com sucesso!');
      console.log('Resposta:', response);
    }
  };

  const handleBuscarPropostas = async () => {
    const params: BuscarPropostaParams = {
      limite: 20,
      offset: 0
    };

    const response = await buscarPropostas(params);
    if (response) {
      setPropostas(response.propostas || []);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pré-aprovado':
      case 'pre-aprovado':
        return 'text-yellow-600 bg-yellow-100';
      case 'contratado':
        return 'text-green-600 bg-green-100';
      case 'negado':
      case 'cancelado':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Autenticação Necessária
          </h2>
          <p className="text-gray-600">
            Faça login no Parcelamais para acessar as funcionalidades V2.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Parcelamais API V2
          </h1>
          <p className="text-gray-600">
            Funcionalidades avançadas de financiamento e propostas
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'solicitacao', label: 'Solicitação Completa', icon: CreditCard },
                { id: 'ofertas', label: 'Buscar Ofertas', icon: Search },
                { id: 'proposta', label: 'Enviar Proposta', icon: Send },
                { id: 'documento', label: 'Documento Lastro', icon: Upload },
                { id: 'propostas', label: 'Minhas Propostas', icon: FileText }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Solicitação Completa */}
          {activeTab === 'solicitacao' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Nova Solicitação de Financiamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dados Pessoais */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Dados Pessoais</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.nome}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome do cliente"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.cpf}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, cpf: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={solicitacaoForm.dataNascimento}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, dataNascimento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.telefone}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, telefone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="48912345678"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={solicitacaoForm.email}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="cliente@email.com"
                    />
                  </div>
                </div>

                {/* Dados Financeiros e Endereço */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Dados Financeiros</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renda Mensal (R$)
                    </label>
                    <input
                      type="number"
                      value={solicitacaoForm.rendaMensal}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, rendaMensal: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Solicitado (R$)
                    </label>
                    <input
                      type="number"
                      value={solicitacaoForm.valorSolicitado}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, valorSolicitado: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Clínica
                    </label>
                    <select
                      value={selectedClinica}
                      onChange={(e) => setSelectedClinica(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selecione uma clínica</option>
                      {(clinicas || []).map((clinica) => (
                        <option key={clinica.id} value={clinica.id}>
                          {clinica.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cenário (Sandbox)
                    </label>
                    <select
                      value={solicitacaoForm.cenario}
                      onChange={(e) => setSolicitacaoForm(prev => ({ ...prev, cenario: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 - Aprovação em uma financeira</option>
                      <option value="2">2 - Aprovação em duas financeiras</option>
                      <option value="3">3 - Negativa total</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Endereço */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Endereço</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.endereco.cep}
                      onChange={(e) => setSolicitacaoForm(prev => ({
                        ...prev,
                        endereco: { ...prev.endereco, cep: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="00000-000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      UF
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.endereco.uf}
                      onChange={(e) => setSolicitacaoForm(prev => ({
                        ...prev,
                        endereco: { ...prev.endereco, uf: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="SC"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.endereco.cidade}
                      onChange={(e) => setSolicitacaoForm(prev => ({
                        ...prev,
                        endereco: { ...prev.endereco, cidade: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Florianópolis"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.endereco.bairro}
                      onChange={(e) => setSolicitacaoForm(prev => ({
                        ...prev,
                        endereco: { ...prev.endereco, bairro: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Centro"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.endereco.rua}
                      onChange={(e) => setSolicitacaoForm(prev => ({
                        ...prev,
                        endereco: { ...prev.endereco, rua: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Rua das Flores"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={solicitacaoForm.endereco.numeroEndereco}
                      onChange={(e) => setSolicitacaoForm(prev => ({
                        ...prev,
                        endereco: { ...prev.endereco, numeroEndereco: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSolicitacaoCompleta}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  Criar Solicitação
                </button>
              </div>
            </div>
          )}

          {/* Buscar Ofertas */}
          {activeTab === 'ofertas' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Buscar Ofertas de Financiamento
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID da Proposta
                    </label>
                    <input
                      type="text"
                      value={ofertasForm.id}
                      onChange={(e) => setOfertasForm(prev => ({ ...prev, id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ID da proposta aprovada"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Solicitado (R$)
                    </label>
                    <input
                      type="number"
                      value={ofertasForm.valorSolicitado}
                      onChange={(e) => setOfertasForm(prev => ({ ...prev, valorSolicitado: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Financeira
                    </label>
                    <input
                      type="text"
                      value={ofertasForm.financeira}
                      onChange={(e) => setOfertasForm(prev => ({ ...prev, financeira: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nome da financeira"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dia de Vencimento
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={ofertasForm.diaVencimentoParcelas}
                      onChange={(e) => setOfertasForm(prev => ({ ...prev, diaVencimentoParcelas: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entrada (R$)
                    </label>
                    <input
                      type="number"
                      value={ofertasForm.entrada}
                      onChange={(e) => setOfertasForm(prev => ({ ...prev, entrada: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <button
                    onClick={handleBuscarOfertas}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Buscar Ofertas
                  </button>
                </div>

                {/* Resultados das Ofertas */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Ofertas Disponíveis</h4>
                  {ofertas.length > 0 ? (
                    <div className="space-y-3">
                      {(ofertas || []).map((oferta, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Prazo:</span> {oferta.prazo}x
                            </div>
                            <div>
                              <span className="font-medium">Parcela:</span> R$ {oferta.valorParcela?.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">CET Mensal:</span> {oferta.percentualCETMensal?.toFixed(2)}%
                            </div>
                            <div>
                              <span className="font-medium">CET Anual:</span> {oferta.percentualCETAnual?.toFixed(2)}%
                            </div>
                            <div className="col-span-2">
                              <span className="font-medium">Total:</span> R$ {oferta.valorTotalCredito?.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhuma oferta encontrada</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Minhas Propostas */}
          {activeTab === 'propostas' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Minhas Propostas
                </h3>
                <button
                  onClick={handleBuscarPropostas}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isLoading ? (
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Atualizar
                </button>
              </div>

              {propostas.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CPF
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
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
                      {(propostas || []).map((proposta) => (
                        <tr key={proposta.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {proposta.nome}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {proposta.cpf}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              R$ {proposta.valorSolicitado?.toFixed(2)}
                            </div>
                            {proposta.valorAprovado && (
                              <div className="text-xs text-green-600">
                                Aprovado: R$ {proposta.valorAprovado.toFixed(2)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              getStatusColor(proposta.status)
                            }`}>
                              {proposta.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(proposta.dataAnalise).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedProposta(proposta.id);
                                setOfertasForm(prev => ({ ...prev, id: proposta.id }));
                                setPropostaForm(prev => ({ ...prev, id: proposta.id }));
                                setDocumentoForm(prev => ({ ...prev, id: proposta.id }));
                              }}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Selecionar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhuma proposta encontrada
                  </h3>
                  <p className="text-gray-500">
                    Crie uma nova solicitação para começar.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Outras abas simplificadas para economizar espaço */}
          {activeTab === 'proposta' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Enviar Proposta para Contratação
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Proposta selecionada:</strong> {selectedProposta || 'Nenhuma proposta selecionada'}
                </p>
              </div>
              {/* Formulário simplificado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="RG"
                  value={propostaForm.rg}
                  onChange={(e) => setPropostaForm(prev => ({ ...prev, rg: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Nome da Mãe"
                  value={propostaForm.nomeMae}
                  onChange={(e) => setPropostaForm(prev => ({ ...prev, nomeMae: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleEnviarProposta}
                disabled={isLoading || !selectedProposta}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Proposta
              </button>
            </div>
          )}

          {activeTab === 'documento' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Enviar Documento Lastro (Nota Fiscal)
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  <strong>Proposta selecionada:</strong> {selectedProposta || 'Nenhuma proposta selecionada'}
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL do Arquivo PDF
                  </label>
                  <input
                    type="url"
                    value={documentoForm.arquivo}
                    onChange={(e) => setDocumentoForm(prev => ({ ...prev, arquivo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://exemplo.com/nota-fiscal.pdf"
                  />
                </div>
                <button
                  onClick={handleEnviarDocumento}
                  disabled={isLoading || !selectedProposta}
                  className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50 flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Enviar Documento
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelamaisV2;