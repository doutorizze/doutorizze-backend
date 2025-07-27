import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, FileText, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';

export default function Register() {
  const [userType, setUserType] = useState<'patient' | 'clinic'>('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cpf: '',
    // Clinic specific fields
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    cro: '',
    responsavelTecnico: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    servicos: [] as string[],
    description: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser } = useStore();
  const navigate = useNavigate();

  const servicosOdontologicos = [
    'Clínica Geral',
    'Ortodontia',
    'Endodontia',
    'Periodontia',
    'Implantodontia',
    'Cirurgia Oral',
    'Odontopediatria',
    'Prótese Dentária',
    'Estética Dental',
    'Radiologia Odontológica',
    'Patologia Oral',
    'Dentística Restauradora'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    // Validação específica para clínicas
    if (userType === 'clinic' && formData.servicos.length === 0) {
      setError('Selecione pelo menos um serviço oferecido pela clínica');
      setIsLoading(false);
      return;
    }

    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '(11) 99999-9999',
        type: userType as 'patient' | 'clinic',
        avatar: `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=${userType === 'clinic' ? 'modern%20dental%20clinic%20logo%20professional' : 'patient%20portrait'}%20friendly%20smile&image_size=square`,
        ...(userType === 'clinic' && {
          cnpj: formData.cnpj,
          razaoSocial: formData.razaoSocial,
          nomeFantasia: formData.nomeFantasia,
          cro: formData.cro,
          responsavelTecnico: formData.responsavelTecnico,
          endereco: formData.endereco,
          cidade: formData.cidade,
          estado: formData.estado,
          cep: formData.cep,
          servicos: formData.servicos
        })
      };
      
      setUser(newUser);
      
      // Redirecionar baseado no tipo de usuário
      if (userType === 'clinic') {
        navigate('/dashboard');
      } else {
        navigate('/patient-area');
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Criar sua conta</h2>
            <p className="text-gray-600">Junte-se ao DOUTORIZZE e transforme sua experiência em saúde</p>
          </div>

          {/* User Type Selection */}
          <div className="bg-gray-100 p-1 rounded-lg flex mb-8">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'patient'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sou Paciente
            </button>
            <button
              type="button"
              onClick={() => setUserType('clinic')}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'clinic'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sou Clínica Odontológica
            </button>
          </div>

          {/* Registration Form */}
          <form className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="cpf"
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData(prev => ({ ...prev, cpf: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            {/* Clinic Specific Fields */}
            {userType === 'clinic' && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Clínica Odontológica</h3>
                
                {/* Dados da Empresa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-2">
                      Razão Social *
                    </label>
                    <input
                      id="razaoSocial"
                      type="text"
                      required
                      value={formData.razaoSocial}
                      onChange={(e) => setFormData(prev => ({ ...prev, razaoSocial: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Clínica Odontológica Ltda"
                    />
                  </div>

                  <div>
                    <label htmlFor="nomeFantasia" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Fantasia *
                    </label>
                    <input
                      id="nomeFantasia"
                      type="text"
                      required
                      value={formData.nomeFantasia}
                      onChange={(e) => setFormData(prev => ({ ...prev, nomeFantasia: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Sorriso Perfeito"
                    />
                  </div>

                  <div>
                    <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
                      CNPJ *
                    </label>
                    <input
                      id="cnpj"
                      type="text"
                      required
                      value={formData.cnpj}
                      onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>

                  <div>
                    <label htmlFor="cro" className="block text-sm font-medium text-gray-700 mb-2">
                      CRO *
                    </label>
                    <input
                      id="cro"
                      type="text"
                      required
                      value={formData.cro}
                      onChange={(e) => setFormData(prev => ({ ...prev, cro: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="CRO/SP 12345"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="responsavelTecnico" className="block text-sm font-medium text-gray-700 mb-2">
                      Responsável Técnico *
                    </label>
                    <input
                      id="responsavelTecnico"
                      type="text"
                      required
                      value={formData.responsavelTecnico}
                      onChange={(e) => setFormData(prev => ({ ...prev, responsavelTecnico: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Dr. João Silva - CRO/SP 54321"
                    />
                  </div>
                </div>

                {/* Endereço */}
                <div className="border-t border-gray-100 pt-6 mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Endereço da Clínica</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          id="endereco"
                          type="text"
                          required
                          value={formData.endereco}
                          onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                          placeholder="Rua das Flores, 123 - Centro"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                        CEP *
                      </label>
                      <input
                        id="cep"
                        type="text"
                        required
                        value={formData.cep}
                        onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="00000-000"
                      />
                    </div>

                    <div>
                      <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade *
                      </label>
                      <input
                        id="cidade"
                        type="text"
                        required
                        value={formData.cidade}
                        onChange={(e) => setFormData(prev => ({ ...prev, cidade: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="São Paulo"
                      />
                    </div>

                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                        Estado *
                      </label>
                      <select
                        id="estado"
                        required
                        value={formData.estado}
                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="">Selecione o estado</option>
                        <option value="SP">São Paulo</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="PR">Paraná</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="BA">Bahia</option>
                        <option value="GO">Goiás</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="PE">Pernambuco</option>
                        <option value="CE">Ceará</option>
                        <option value="PA">Pará</option>
                        <option value="MA">Maranhão</option>
                        <option value="PB">Paraíba</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="PI">Piauí</option>
                        <option value="AL">Alagoas</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="MT">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="AC">Acre</option>
                        <option value="AM">Amazonas</option>
                        <option value="RR">Roraima</option>
                        <option value="AP">Amapá</option>
                        <option value="TO">Tocantins</option>
                        <option value="SE">Sergipe</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Serviços Oferecidos */}
                <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Serviços Oferecidos *</h4>
                  <p className="text-sm text-gray-600 mb-4">Selecione os tipos de serviços odontológicos que sua clínica oferece:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {servicosOdontologicos.map(servico => (
                      <label key={servico} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.servicos.includes(servico)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                servicos: [...prev.servicos, servico]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                servicos: prev.servicos.filter(s => s !== servico)
                              }));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{servico}</span>
                      </label>
                    ))}
                  </div>
                  {formData.servicos.length === 0 && (
                    <p className="text-red-500 text-sm mt-2">Selecione pelo menos um serviço</p>
                  )}
                </div>

                <div className="mt-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição da Clínica
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Descreva sua clínica, diferenciais e abordagem de atendimento..."
                  />
                </div>
              </div>
            )}

            {/* Password Fields */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar senha *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Confirme sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                Eu concordo com os{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-700">Termos de Uso</Link>
                {' '}e{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Política de Privacidade</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}