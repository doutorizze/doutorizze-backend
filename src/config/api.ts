// Configuração da API para diferentes ambientes

// Detecta automaticamente o ambiente baseado na URL
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// URLs da API para cada ambiente
const API_URLS = {
  development: 'http://localhost:3001',
  production: 'https://doutorizze-backend.onrender.com' // URL do backend no Render
};

// URL base da API
export const API_BASE_URL = isProduction ? API_URLS.production : API_URLS.development;

// Configurações específicas para cada ambiente
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
};

// Endpoints da API
export const API_ENDPOINTS = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  profile: '/api/auth/profile',
  
  // Clinics
  clinicsPublic: '/api/clinics/public',
  clinics: '/api/clinics',
  
  // Appointments
  appointments: '/api/appointments',
  
  // Loan Requests
  loanRequests: '/api/loan-requests',
  
  // Parcelamais
  parcelamais: '/api/parcelamais',
  
  // Webhooks
  webhooks: '/api/webhooks',
  
  // Health Check
  health: '/health'
};

// Função helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Função para verificar se a API está online
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(buildApiUrl(API_ENDPOINTS.health), {
      method: 'GET',
      headers: API_CONFIG.headers,
    });
    return response.ok;
  } catch (error) {
    console.error('API Health Check failed:', error);
    return false;
  }
};

// Log da configuração atual (apenas em desenvolvimento)
if (!isProduction) {
  console.log('🔧 API Configuration:', {
    environment: isProduction ? 'production' : 'development',
    baseURL: API_BASE_URL,
    isProduction
  });
}

export default {
  API_BASE_URL,
  API_CONFIG,
  API_ENDPOINTS,
  buildApiUrl,
  checkApiHealth,
  isProduction
};