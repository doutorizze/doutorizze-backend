import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Layout from '@/components/Layout';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'patient' as 'patient' | 'clinic' | 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user;
        
        // Salvar token e dados do usuário
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Atualizar estado global
        setUser(user);
        
        // Redirecionar baseado no tipo de usuário
        if (user.role === 'admin') {
          navigate('/admin');
        } else if (user.role === 'clinic') {
          navigate('/clinic-dashboard');
        } else {
          navigate('/patient-area');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      setError('Erro de conexão. Verifique se o servidor está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Entrar na sua conta</h2>
            <p className="text-gray-600">Acesse sua área pessoal no DOUTORIZZE</p>
          </div>

          {/* User Type Selection */}
          <div className="bg-gray-100 p-1 rounded-lg grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'patient' }))}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                formData.userType === 'patient'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Paciente
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, userType: 'clinic' }))}
              className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                formData.userType === 'clinic'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Clínica
            </button>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-mail
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
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
                  placeholder="Sua senha"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Entrando...
                </div>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                Cadastre-se gratuitamente
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciais de Acesso</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div>
                <strong>Clínica:</strong> clinica@exemplo.com / clinic123
              </div>
              <div>
                <strong>Paciente:</strong> paciente@exemplo.com / patient123
              </div>
              <div>
                <strong>Admin:</strong> admin@doutorizze.com / admin123
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}