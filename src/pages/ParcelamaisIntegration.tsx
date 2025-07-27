import { useState, useEffect } from 'react';
import { 
  Calculator, CreditCard, Building2, User, DollarSign, 
  Calendar, CheckCircle, AlertCircle, ArrowRight, Info,
  FileText, Clock, Percent
} from 'lucide-react';
import Layout from '@/components/Layout';
import useParcelamais from '@/hooks/useParcelamais';
import { toast } from 'sonner';

interface SimulationData {
  valor: number;
  parcelas: number;
  clinicaId: string;
  pacienteNome: string;
  pacienteEmail: string;
  pacienteTelefone: string;
  pacienteCpf: string;
  procedimento: string;
}

export default function ParcelamaisIntegration() {
  // Tratamento de erro para o hook useParcelamais
  let parcelamaisHook;
  try {
    parcelamaisHook = useParcelamais();
  } catch (error) {
    console.error('Erro ao inicializar useParcelamais:', error);
    parcelamaisHook = {
      isAuthenticated: false,
      isLoading: false,
      error: 'Erro ao carregar integração Parcelamais',
      clinicas: [],
      login: async () => false,
      buscarClinicas: async () => {},
      clearError: () => {}
    };
  }
  
  const {
    isAuthenticated,
    isLoading,
    error,
    clinicas,
    login,
    buscarClinicas,
    clearError
  } = parcelamaisHook;

  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);
  const [simulationData, setSimulationData] = useState<SimulationData>({
    valor: 0,
    parcelas: 1,
    clinicaId: '',
    pacienteNome: '',
    pacienteEmail: '',
    pacienteTelefone: '',
    pacienteCpf: '',
    procedimento: ''
  });

  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  });

  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [showSimulation, setShowSimulation] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginForm(false);
      buscarClinicas();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginData);
    if (success) {
      toast.success('Login realizado com sucesso!');
      setShowLoginForm(false);
    }
  };

  const calculateInstallment = () => {
    if (!simulationData.valor || !simulationData.parcelas) {
      toast.error('Preencha o valor e número de parcelas');
      return;
    }

    if (!simulationData.clinicaId) {
      toast.error('Selecione uma clínica');
      return;
    }

    // Simulação de cálculo de parcelamento
    const taxaJuros = 0.0299; // 2.99% ao mês
    const valorParcela = simulationData.valor / simulationData.parcelas;
    const valorComJuros = simulationData.valor * (1 + (taxaJuros * (simulationData.parcelas - 1)));
    const valorParcelaComJuros = valorComJuros / simulationData.parcelas;
    const totalJuros = valorComJuros - simulationData.valor;

    const selectedClinica = (clinicas || []).find(c => c.id === simulationData.clinicaId);

    setSimulationResult({
      valorOriginal: simulationData.valor,
      numeroParcelas: simulationData.parcelas,
      valorParcela: valorParcela,
      valorParcelaComJuros: valorParcelaComJuros,
      valorTotal: valorComJuros,
      totalJuros: totalJuros,
      taxaJuros: taxaJuros * 100,
      clinica: selectedClinica,
      paciente: {
        nome: simulationData.pacienteNome,
        email: simulationData.pacienteEmail,
        telefone: simulationData.pacienteTelefone,
        cpf: simulationData.pacienteCpf
      },
      procedimento: simulationData.procedimento
    });

    setShowSimulation(true);
    toast.success('Simulação calculada com sucesso!');
  };

  const handleCreateFinancing = () => {
    // Aqui seria integrado com a API real do Parcelamais para criar o financiamento
    toast.success('Solicitação de financiamento enviada! O paciente receberá as instruções por email.');
    
    // Reset form
    setSimulationData({
      valor: 0,
      parcelas: 1,
      clinicaId: '',
      pacienteNome: '',
      pacienteEmail: '',
      pacienteTelefone: '',
      pacienteCpf: '',
      procedimento: ''
    });
    setSimulationResult(null);
    setShowSimulation(false);
  };

  if (showLoginForm) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Calculator className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Simulador Parcelamais
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Faça login para acessar o simulador integrado
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    required
                    value={loginData.senha}
                    onChange={(e) => setLoginData(prev => ({ ...prev, senha: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sua senha"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Calculator className="w-8 h-8 mr-3 text-blue-600" />
                  Simulador de Parcelamento Integrado
                </h1>
                <p className="text-gray-600 mt-1">
                  Simule parcelamentos para seus pacientes com integração Parcelamais
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!showSimulation ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Formulário de Simulação */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Dados da Simulação
                </h2>

                <div className="space-y-6">
                  {/* Seleção de Clínica */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clínica *
                    </label>
                    <select
                      value={simulationData.clinicaId}
                      onChange={(e) => setSimulationData(prev => ({ ...prev, clinicaId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Selecione uma clínica</option>
                      {(clinicas || []).map((clinica) => (
                        <option key={clinica.id} value={clinica.id}>
                          {clinica.nome} - {clinica.cnpj}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dados do Procedimento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valor do Procedimento *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="number"
                          min="100"
                          step="0.01"
                          value={simulationData.valor || ''}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0,00"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Parcelas *
                      </label>
                      <select
                        value={simulationData.parcelas}
                        onChange={(e) => setSimulationData(prev => ({ ...prev, parcelas: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        {[...Array(24)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}x
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procedimento *
                    </label>
                    <input
                      type="text"
                      value={simulationData.procedimento}
                      onChange={(e) => setSimulationData(prev => ({ ...prev, procedimento: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ex: Implante dentário, Cirurgia plástica..."
                      required
                    />
                  </div>

                  {/* Dados do Paciente */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Dados do Paciente
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome Completo *
                        </label>
                        <input
                          type="text"
                          value={simulationData.pacienteNome}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, pacienteNome: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nome do paciente"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CPF *
                        </label>
                        <input
                          type="text"
                          value={simulationData.pacienteCpf}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, pacienteCpf: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="000.000.000-00"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={simulationData.pacienteEmail}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, pacienteEmail: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="email@exemplo.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={simulationData.pacienteTelefone}
                          onChange={(e) => setSimulationData(prev => ({ ...prev, pacienteTelefone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(11) 99999-9999"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={calculateInstallment}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    {isLoading ? 'Calculando...' : 'Simular Parcelamento'}
                  </button>
                </div>
              </div>

              {/* Informações */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Como Funciona
                  </h3>
                  <div className="space-y-3 text-blue-800">
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
                      <p className="text-sm">Selecione a clínica cadastrada no Parcelamais</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
                      <p className="text-sm">Informe o valor e número de parcelas desejado</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
                      <p className="text-sm">Preencha os dados do paciente</p>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-2 mt-0.5 text-blue-600" />
                      <p className="text-sm">Gere a simulação e envie para aprovação</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                    <Percent className="w-5 h-5 mr-2" />
                    Taxas e Condições
                  </h3>
                  <div className="space-y-2 text-green-800">
                    <p className="text-sm"><strong>Taxa de juros:</strong> 2,99% ao mês</p>
                    <p className="text-sm"><strong>Parcelas:</strong> De 1x até 24x</p>
                    <p className="text-sm"><strong>Valor mínimo:</strong> R$ 100,00</p>
                    <p className="text-sm"><strong>Aprovação:</strong> Em até 24 horas</p>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Importante
                  </h3>
                  <div className="space-y-2 text-yellow-800">
                    <p className="text-sm">• A aprovação está sujeita à análise de crédito</p>
                    <p className="text-sm">• O paciente receberá as instruções por email</p>
                    <p className="text-sm">• Documentos podem ser solicitados</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Resultado da Simulação */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Simulação Calculada!
                  </h2>
                  <p className="text-gray-600">
                    Confira os detalhes do parcelamento abaixo
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Resumo Financeiro */}
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                      <CreditCard className="w-6 h-6 mr-2" />
                      Resumo Financeiro
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Valor Original:</span>
                        <span className="font-semibold text-blue-900">
                          R$ {simulationResult?.valorOriginal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Número de Parcelas:</span>
                        <span className="font-semibold text-blue-900">{simulationResult?.numeroParcelas}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Taxa de Juros:</span>
                        <span className="font-semibold text-blue-900">{simulationResult?.taxaJuros.toFixed(2)}% a.m.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Total de Juros:</span>
                        <span className="font-semibold text-blue-900">
                          R$ {simulationResult?.totalJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <hr className="border-blue-200" />
                      <div className="flex justify-between text-lg">
                        <span className="text-blue-700 font-semibold">Valor da Parcela:</span>
                        <span className="font-bold text-blue-900">
                          R$ {simulationResult?.valorParcelaComJuros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span className="text-blue-700 font-semibold">Valor Total:</span>
                        <span className="font-bold text-blue-900">
                          R$ {simulationResult?.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dados do Paciente e Clínica */}
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
                        <User className="w-6 h-6 mr-2" />
                        Dados do Paciente
                      </h3>
                      <div className="space-y-2">
                        <p className="text-green-700"><strong>Nome:</strong> {simulationResult?.paciente.nome}</p>
                        <p className="text-green-700"><strong>CPF:</strong> {simulationResult?.paciente.cpf}</p>
                        <p className="text-green-700"><strong>Email:</strong> {simulationResult?.paciente.email}</p>
                        <p className="text-green-700"><strong>Telefone:</strong> {simulationResult?.paciente.telefone}</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
                        <Building2 className="w-6 h-6 mr-2" />
                        Clínica
                      </h3>
                      <div className="space-y-2">
                        <p className="text-purple-700"><strong>Nome:</strong> {simulationResult?.clinica.nome}</p>
                        <p className="text-purple-700"><strong>CNPJ:</strong> {simulationResult?.clinica.cnpj}</p>
                        <p className="text-purple-700"><strong>Procedimento:</strong> {simulationResult?.procedimento}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowSimulation(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Nova Simulação
                  </button>
                  <button
                    onClick={handleCreateFinancing}
                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center"
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Solicitar Financiamento
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}