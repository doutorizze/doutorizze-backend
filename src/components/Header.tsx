import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Calendar, CreditCard, Settings, Building2, DollarSign, FileText } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useStore();
  const location = useLocation();

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Para Clínicas', href: '/para-clinicas' },
    { name: 'Clínicas', href: '/clinics' },
    { name: 'Como Funciona', href: '/how-it-works' },
    { name: 'Contato', href: '/contact' }
  ];

  // Navegação adicional para administradores
  const adminNavigation = user?.type === 'admin' ? [
    { name: 'Mapa do Site', href: '/sitemap' }
  ] : [];

  const userNavigation = user ? [
    { name: 'Minha Área', href: user.type === 'clinic' ? '/clinic-dashboard' : user.type === 'admin' ? '/admin-dashboard' : '/patient-area', icon: User },
    ...(user.type !== 'admin' ? [{ name: 'Agendamentos', href: '/booking', icon: Calendar }] : []),
    ...(user.type === 'admin' ? [
      { name: 'Parcelamais', href: '/parcelamais', icon: CreditCard },
      { name: 'Propostas V2', href: '/parcelamais-v2', icon: Building2 },
      { name: 'Cobranças', href: '/cobrancas', icon: DollarSign },
      { name: 'Mapa do Site', href: '/sitemap', icon: FileText }
    ] : []),
    { name: 'Configurações', href: '/settings', icon: Settings }
  ] : [];

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-2 rounded-lg flex items-center space-x-2">
              <span className="text-white font-light text-xl">&gt;</span>
              <span className="text-white font-light text-xl">doutorizze</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === item.href
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-1'
                    : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {userNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                    <hr className="my-2" />
                    <button 
                      onClick={() => {
                        setUser(null);
                        window.location.href = '/';
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-3 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {user ? (
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                {userNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                <button 
                  onClick={() => {
                    setUser(null);
                    window.location.href = '/';
                  }}
                  className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-gray-100 space-y-3">
                <Link
                  to="/login"
                  className="block text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}