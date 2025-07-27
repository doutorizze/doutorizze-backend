import { useState, useEffect } from 'react';
import { 
  Building2, Plus, Edit, FileText, Upload, CheckCircle, 
  AlertCircle, XCircle, Eye, Download, Trash2, Search,
  MapPin, Phone, Mail, CreditCard, Building
} from 'lucide-react';
import Layout from '@/components/Layout';
import useParcelamais from '@/hooks/useParcelamais';
import { ClinicaData, DocumentosData } from '@/services/parcelamaisApi';
import { toast } from 'sonner';
import { useStore } from '@/store/useStore';

export default function ParcelamaisClinicas() {
  const {
    isAuthenticated,
    isLoading,
    error,
    clinicas,
    login,
    logout,
    criarClinica,
    editarClinica,
    buscarClinicas,
    enviarDocumentos,
    clearError
  } = useParcelamais();

  const [showLoginForm, setShowLoginForm] = useState(!isAuthenticated);
  const [showClinicaForm, setShowClinicaForm] = useState(false);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [editingClinica, setEditingClinica] = useState<any>(null);
  const [selectedClinica, setSelectedClinica] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Formulário de login
  const [loginData, setLoginData] = useState({
    email: '',
    senha: ''
  });

  // Formulário de clínica
  const [clinicaData, setClinicaData] = useState<ClinicaData>({
    nome: '',
    razaoSocial: '',
    cnpj: '',
    url: '',
    responsavel: {
      telefone: '',
      email: '',
      nome: ''
    },
    endereco: {
      cep: '',
      uf: '',
      cidade: '',
      bairro: '',
      rua: '',
      numeroEndereco: ''
    },
    contaBancaria: {
      contaCorrente: '',
      digitoContaCorrente: '',
      agencia: '',
      digitoAgencia: '',
      codigoBanco: ''
    }
  });

  // Formulário de documentos
  const [documentosData, setDocumentosData] = useState<DocumentosData>({
    id: '',
    cartaoCnpj: '',
    contratoSocial: '',
    identidadeRepresentante: '',
    documentoProfissionalFrente: '',
    documentoProfissionalVerso: '',
    documentoComFotoFrente: '',
    documentoComFotoVerso: '',
    fotoFachada: '',
    comprovanteConta: '',
    comprovanteEndereco: ''
  });

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

  const handleLogout = () => {
    logout();
    setShowLoginForm(true);
    toast.info('Logout realizado com sucesso!');
  };

  const handleCreateClinica = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await criarClinica(clinicaData);
    if (response?.status === 'success') {
      // Adicionar a nova clínica ao store
      const newClinic = {
        id: response.response?.id || Date.now().toString(),
        nomeFantasia: clinicaData.nome,
        razaoSocial: clinicaData.razaoSocial,
        cnpj: clinicaData.cnpj,
        cro: 'CRO/XX 00000', // Valor padrão
        responsavelTecnico: clinicaData.responsavel.nome,
        rating: 5.0,
        reviewCount: 0,
        price: 200,
        avatar: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=dental%20clinic%20logo%20modern%20professional%20blue&image_size=square',
        endereco: `${clinicaData.endereco.rua}, ${clinicaData.endereco.numeroEndereco} - ${clinicaData.endereco.bairro}`,
        cidade: clinicaData.endereco.cidade,
        estado: clinicaData.endereco.uf,
        cep: clinicaData.endereco.cep,
        servicos: ['Clínica Geral', 'Ortodontia'],
        description: 'Clínica odontológica moderna com atendimento de qualidade.',
        availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00']
      };
      
      // Atualizar o store com a nova clínica
      const currentClinics = useStore.getState().clinics;
      useStore.getState().setClinics([...currentClinics, newClinic]);
      
      toast.success('Clínica criada com sucesso!');
      setShowClinicaForm(false);
      resetClinicaForm();
    }
  };

  const handleEditClinica = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await editarClinica(clinicaData);
    if (response?.status === 'success') {
      // Atualizar a clínica no store
      const currentClinics = useStore.getState().clinics;
      const updatedClinics = currentClinics.map(clinic => {
        if (clinic.id === editingClinica?.id) {
          return {
            ...clinic,
            nomeFantasia: clinicaData.nome,
            razaoSocial: clinicaData.razaoSocial,
            cnpj: clinicaData.cnpj,
            responsavelTecnico: clinicaData.responsavel.nome,
            endereco: `${clinicaData.endereco.rua}, ${clinicaData.endereco.numeroEndereco} - ${clinicaData.endereco.bairro}`,
            cidade: clinicaData.endereco.cidade,
            estado: clinicaData.endereco.uf,
            cep: clinicaData.endereco.cep
          };
        }
        return clinic;
      });
      useStore.getState().setClinics(updatedClinics);
      
      toast.success('Clínica editada com sucesso!');
      setShowClinicaForm(false);
      setEditingClinica(null);
      resetClinicaForm();
    }
  };

  const handleSendDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await enviarDocumentos(documentosData);
    if (response?.status === 'success') {
      toast.success('Documentos enviados com sucesso!');
      setShowDocumentForm(false);
      resetDocumentForm();
    }
  };

  const resetClinicaForm = () => {
    setClinicaData({
      nome: '',
      razaoSocial: '',
      cnpj: '',
      url: '',
      responsavel: {
        telefone: '',
        email: '',
        nome: ''
      },
      endereco: {
        cep: '',
        uf: '',
        cidade: '',
        bairro: '',
        rua: '',
        numeroEndereco: ''
      },
      contaBancaria: {
        contaCorrente: '',
        digitoContaCorrente: '',
        agencia: '',
        digitoAgencia: '',
        codigoBanco: ''
      }
    });
  };

  const resetDocumentForm = () => {
    setDocumentosData({
      id: '',
      cartaoCnpj: '',
      contratoSocial: '',
      identidadeRepresentante: '',
      documentoProfissionalFrente: '',
      documentoProfissionalVerso: '',
      documentoComFotoFrente: '',
      documentoComFotoVerso: '',
      fotoFachada: '',
      comprovanteConta: '',
      comprovanteEndereco: ''
    });
  };

  const startEdit = (clinica: any) => {
    setEditingClinica(clinica);
    setClinicaData({
      nome: clinica.nome,
      razaoSocial: clinica.razaoSocial,
      cnpj: clinica.cnpj,
      url: clinica.url || '',
      responsavel: clinica.responsavel,
      endereco: clinica.endereco,
      contaBancaria: clinica.contaBancaria || {
        contaCorrente: '',
        digitoContaCorrente: '',
        agencia: '',
        digitoAgencia: '',
        codigoBanco: ''
      }
    });
    setShowClinicaForm(true);
  };

  const startDocumentUpload = (clinica: any) => {
    setSelectedClinica(clinica);
    setDocumentosData(prev => ({ ...prev, id: clinica.id }));
    setShowDocumentForm(true);
  };

  const filteredClinicas = (clinicas || []).filter(clinica =>
    clinica.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinica.cnpj.includes(searchTerm) ||
    clinica.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showLoginForm) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Building2 className="mx-auto h-12 w-12 text-blue-600" />
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Login Parcelamais
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Faça login para gerenciar suas clínicas
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
                  <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                  Gerenciar Clínicas - Parcelamais
                </h1>
                <p className="text-gray-600 mt-1">
                  Gerencie suas clínicas cadastradas no sistema Parcelamais
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowClinicaForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Clínica
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar clínicas por nome, CNPJ ou razão social..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Clínicas List */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando clínicas...</p>
            </div>
          ) : filteredClinicas.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma clínica encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando sua primeira clínica'}
              </p>
              {!searchTerm && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowClinicaForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Clínica
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(filteredClinicas || []).map((clinica) => (
                <div key={clinica.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {clinica.nome}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {clinica.razaoSocial}
                      </p>
                      <p className="text-sm font-mono text-gray-500">
                        CNPJ: {clinica.cnpj}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {clinica.endereco.cidade}, {clinica.endereco.uf}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {clinica.responsavel.telefone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {clinica.responsavel.email}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEdit(clinica)}
                      className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center text-sm"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => startDocumentUpload(clinica)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-100 flex items-center justify-center text-sm"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Docs
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Clínica Form */}
        {showClinicaForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingClinica ? 'Editar Clínica' : 'Nova Clínica'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowClinicaForm(false);
                      setEditingClinica(null);
                      resetClinicaForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={editingClinica ? handleEditClinica : handleCreateClinica} className="space-y-6">
                  {/* Dados Básicos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome da Clínica *
                      </label>
                      <input
                        type="text"
                        required
                        value={clinicaData.nome}
                        onChange={(e) => setClinicaData(prev => ({ ...prev, nome: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Razão Social *
                      </label>
                      <input
                        type="text"
                        required
                        value={clinicaData.razaoSocial}
                        onChange={(e) => setClinicaData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNPJ *
                      </label>
                      <input
                        type="text"
                        required
                        value={clinicaData.cnpj}
                        onChange={(e) => setClinicaData(prev => ({ ...prev, cnpj: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL Webhook
                      </label>
                      <input
                        type="url"
                        value={clinicaData.url}
                        onChange={(e) => setClinicaData(prev => ({ ...prev, url: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://seuwebhook.com/endpoint"
                      />
                    </div>
                  </div>

                  {/* Responsável */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Dados do Responsável</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.responsavel.nome}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            responsavel: { ...prev.responsavel, nome: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={clinicaData.responsavel.email}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            responsavel: { ...prev.responsavel, email: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={clinicaData.responsavel.telefone}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            responsavel: { ...prev.responsavel, telefone: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="48912345678"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Endereço */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CEP *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.endereco.cep}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, cep: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="00000-000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          UF *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={2}
                          value={clinicaData.endereco.uf}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, uf: e.target.value.toUpperCase() }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="SC"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cidade *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.endereco.cidade}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, cidade: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bairro *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.endereco.bairro}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, bairro: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rua *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.endereco.rua}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, rua: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Número *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.endereco.numeroEndereco}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            endereco: { ...prev.endereco, numeroEndereco: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Conta Bancária */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Conta Bancária</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Código do Banco *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.contaBancaria.codigoBanco}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            contaBancaria: { ...prev.contaBancaria, codigoBanco: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agência *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.contaBancaria.agencia}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            contaBancaria: { ...prev.contaBancaria, agencia: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dígito da Agência
                        </label>
                        <input
                          type="text"
                          value={clinicaData.contaBancaria.digitoAgencia}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            contaBancaria: { ...prev.contaBancaria, digitoAgencia: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Conta Corrente *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.contaBancaria.contaCorrente}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            contaBancaria: { ...prev.contaBancaria, contaCorrente: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="00000000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dígito da Conta *
                        </label>
                        <input
                          type="text"
                          required
                          value={clinicaData.contaBancaria.digitoContaCorrente}
                          onChange={(e) => setClinicaData(prev => ({
                            ...prev,
                            contaBancaria: { ...prev.contaBancaria, digitoContaCorrente: e.target.value }
                          }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowClinicaForm(false);
                        setEditingClinica(null);
                        resetClinicaForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Salvando...' : (editingClinica ? 'Atualizar' : 'Criar Clínica')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal Documentos */}
        {showDocumentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Enviar Documentos - {selectedClinica?.nome}
                  </h2>
                  <button
                    onClick={() => {
                      setShowDocumentForm(false);
                      setSelectedClinica(null);
                      resetDocumentForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSendDocuments} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cartão CNPJ
                      </label>
                      <input
                        type="url"
                        value={documentosData.cartaoCnpj}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, cartaoCnpj: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/cartao-cnpj.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contrato Social
                      </label>
                      <input
                        type="url"
                        value={documentosData.contratoSocial}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, contratoSocial: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/contrato-social.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Identidade do Representante
                      </label>
                      <input
                        type="url"
                        value={documentosData.identidadeRepresentante}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, identidadeRepresentante: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/identidade-representante.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento Profissional (Frente)
                      </label>
                      <input
                        type="url"
                        value={documentosData.documentoProfissionalFrente}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, documentoProfissionalFrente: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/doc-profissional-frente.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento Profissional (Verso)
                      </label>
                      <input
                        type="url"
                        value={documentosData.documentoProfissionalVerso}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, documentoProfissionalVerso: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/doc-profissional-verso.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento com Foto (Frente)
                      </label>
                      <input
                        type="url"
                        value={documentosData.documentoComFotoFrente}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, documentoComFotoFrente: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/doc-foto-frente.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Documento com Foto (Verso)
                      </label>
                      <input
                        type="url"
                        value={documentosData.documentoComFotoVerso}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, documentoComFotoVerso: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/doc-foto-verso.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Foto da Fachada
                      </label>
                      <input
                        type="url"
                        value={documentosData.fotoFachada}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, fotoFachada: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/foto-fachada.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comprovante de Conta
                      </label>
                      <input
                        type="url"
                        value={documentosData.comprovanteConta}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, comprovanteConta: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/comprovante-conta.pdf"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Comprovante de Endereço
                      </label>
                      <input
                        type="url"
                        value={documentosData.comprovanteEndereco}
                        onChange={(e) => setDocumentosData(prev => ({ ...prev, comprovanteEndereco: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://exemplo.com/comprovante-endereco.pdf"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Importante:</strong> Os documentos devem estar hospedados em URLs públicas e acessíveis. 
                      Formatos aceitos: PDF, JPG, PNG.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDocumentForm(false);
                        setSelectedClinica(null);
                        resetDocumentForm();
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Enviando...' : 'Enviar Documentos'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}