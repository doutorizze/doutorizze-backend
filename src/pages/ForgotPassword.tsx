import { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Start countdown for resend
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    
    // Restart countdown
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Success Icon */}
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              {/* Success Message */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  E-mail Enviado!
                </h2>
                <p className="text-gray-600 mb-6">
                  Enviamos um link para redefinir sua senha para:
                </p>
                <p className="text-blue-600 font-medium mb-8">
                  {email}
                </p>
                
                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">Próximos passos:</h3>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Verifique sua caixa de entrada</li>
                    <li>2. Clique no link recebido</li>
                    <li>3. Crie uma nova senha</li>
                    <li>4. Faça login com a nova senha</li>
                  </ol>
                </div>
                
                {/* Resend Button */}
                <div className="space-y-4">
                  {countdown > 0 ? (
                    <div className="flex items-center justify-center text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        Reenviar em {countdown}s
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Reenviando...
                        </div>
                      ) : (
                        'Reenviar E-mail'
                      )}
                    </button>
                  )}
                  
                  <Link
                    to="/login"
                    className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Voltar ao Login
                  </Link>
                </div>
                
                {/* Help Text */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    Não recebeu o e-mail? Verifique sua pasta de spam ou{' '}
                    <a href="/contact" className="text-blue-600 hover:text-blue-700">
                      entre em contato conosco
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Back Button */}
            <Link
              to="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao login
            </Link>
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Esqueceu sua senha?
              </h2>
              <p className="text-gray-600">
                Não se preocupe! Digite seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                    placeholder="Digite seu e-mail"
                  />
                  <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </div>
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </form>
            
            {/* Additional Help */}
            <div className="mt-8 text-center">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Precisa de ajuda?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Se você não conseguir acessar seu e-mail ou continuar com problemas, nossa equipe pode ajudar.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href="/contact"
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Falar com Suporte
                  </a>
                  <a
                    href="tel:1130000000"
                    className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Ligar: (11) 3000-0000
                  </a>
                </div>
              </div>
            </div>
            
            {/* Security Note */}
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Por segurança, o link de recuperação expira em 1 hora.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}