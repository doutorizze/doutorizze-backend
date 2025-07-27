import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Calendar, CreditCard, Settings, BarChart3, Building2, UserPlus, LogIn, Home, Stethoscope, DollarSign, Receipt, Webhook } from 'lucide-react';
import { useStore } from '../store/useStore';

interface PageInfo {
  path: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  requiresAuth?: boolean;
}

const pages: PageInfo[] = [
  // Páginas Públicas
  {
    path: '/',
    title: 'Homepage',
    description: 'Página inicial do sistema DOUTORIZZE',
    icon: <Home className="w-5 h-5" />,
    category: 'Público'
  },
  {
    path: '/login',
    title: 'Login',
    description: 'Página de autenticação do sistema',
    icon: <LogIn className="w-5 h-5" />,
    category: 'Público'
  },
  {
    path: '/register',
    title: 'Cadastro',
    description: 'Cadastro de novas clínicas odontológicas',
    icon: <UserPlus className="w-5 h-5" />,
    category: 'Público'
  },
  
  // Gestão de Clínicas
  {
    path: '/clinics',
    title: 'Buscar Clínicas',
    description: 'Busca e filtros de clínicas odontológicas',
    icon: <Building2 className="w-5 h-5" />,
    category: 'Clínicas',
    requiresAuth: true
  },
  {
    path: '/clinic-profile',
    title: 'Perfil da Clínica',
    description: 'Visualização e edição do perfil da clínica',
    icon: <Stethoscope className="w-5 h-5" />,
    category: 'Clínicas',
    requiresAuth: true
  },
  {
    path: '/clinic-dashboard',
    title: 'Dashboard da Clínica',
    description: 'Painel administrativo da clínica com métricas',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'Clínicas',
    requiresAuth: true
  },
  
  // Agendamentos
  {
    path: '/booking',
    title: 'Agendamentos',
    description: 'Sistema de agendamento de consultas',
    icon: <Calendar className="w-5 h-5" />,
    category: 'Agendamentos',
    requiresAuth: true
  },
  
  // Parcelamais - V1
  {
    path: '/parcelamais',
    title: 'Parcelamais V1',
    description: 'Integração com APIs V1 do Parcelamais',
    icon: <CreditCard className="w-5 h-5" />,
    category: 'Parcelamais',
    requiresAuth: true
  },
  {
    path: '/parcelamais-config',
    title: 'Configuração Parcelamais',
    description: 'Configurações e credenciais do Parcelamais',
    icon: <Settings className="w-5 h-5" />,
    category: 'Parcelamais',
    requiresAuth: true
  },
  {
    path: '/parcelamais-clinicas',
    title: 'Gestão de Clínicas Parcelamais',
    description: 'Gerenciamento de clínicas no Parcelamais',
    icon: <Building2 className="w-5 h-5" />,
    category: 'Parcelamais',
    requiresAuth: true
  },
  
  // Parcelamais - V2
  {
    path: '/parcelamais-v2',
    title: 'Gestão de Propostas V2',
    description: 'Sistema avançado de propostas e financiamentos',
    icon: <FileText className="w-5 h-5" />,
    category: 'Parcelamais V2',
    requiresAuth: true
  },
  
  // Cobranças e Webhooks
  {
    path: '/cobrancas',
    title: 'Gestão de Cobranças',
    description: 'Sistema completo de cobranças e pagamentos',
    icon: <DollarSign className="w-5 h-5" />,
    category: 'Financeiro',
    requiresAuth: true
  },
  {
    path: '/webhooks',
    title: 'Webhooks',
    description: 'Monitoramento de webhooks em tempo real',
    icon: <Webhook className="w-5 h-5" />,
    category: 'Financeiro',
    requiresAuth: true
  },
  
  // Outras páginas
  {
    path: '/sitemap',
    title: 'Mapa do Site',
    description: 'Esta página - visualização de todas as páginas',
    icon: <FileText className="w-5 h-5" />,
    category: 'Sistema'
  }
];

const categories = Array.from(new Set(pages.map(page => page.category)));

export default function SiteMap() {
  const { user } = useStore();
  
  // Verificar se o usuário é administrador
  if (!user || user.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Acesso Restrito</h1>
            <p className="text-gray-600 mb-6">
              Esta página é exclusiva para administradores do sistema.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Filtrar páginas do Parcelamais apenas para administradores
  const filteredPages = pages.filter(page => {
    const isParcelamaisPage = page.category === 'Parcelamais' || page.category === 'Parcelamais V2' || page.category === 'Financeiro';
    if (isParcelamaisPage && user?.type !== 'admin') {
      return false;
    }
    return true;
  });
  
  const filteredCategories = Array.from(new Set(filteredPages.map(page => page.category)));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mapa do Site - DOUTORIZZE
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema completo para clínicas odontológicas com integração Parcelamais
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Páginas Públicas
            </span>
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Requer Autenticação
            </span>
          </div>
        </div>

        <div className="grid gap-8">
          {filteredCategories.map(category => {
            const categoryPages = filteredPages.filter(page => page.category === category);
            
            return (
              <div key={category} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {category.charAt(0)}
                    </span>
                  </div>
                  {category}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({categoryPages.length} página{categoryPages.length !== 1 ? 's' : ''})
                  </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryPages.map(page => (
                    <Link
                      key={page.path}
                      to={page.path}
                      className="group block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          page.requiresAuth 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        } group-hover:scale-110 transition-transform duration-200`}>
                          {page.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                            {page.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {page.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                              {page.path}
                            </code>
                            {page.requiresAuth && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Auth
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Informações do Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{filteredPages.length}</div>
              <div className="text-sm text-gray-600">Total de Páginas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {filteredPages.filter(p => !p.requiresAuth).length}
              </div>
              <div className="text-sm text-gray-600">Páginas Públicas</div>
            </div>
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600">
                {filteredPages.filter(p => p.requiresAuth).length}
              </div>
              <div className="text-sm text-gray-600">Páginas Protegidas</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Voltar ao Início
          </Link>
        </div>
      </div>
    </div>
  );
}