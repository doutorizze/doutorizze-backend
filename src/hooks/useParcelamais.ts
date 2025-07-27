import { useState, useEffect, useCallback } from 'react';
import { 
  parcelamaisAPI, 
  ClinicaData, 
  DocumentosData, 
  TokenRequest,
  ClinicaResponse,
  BuscarClinicasResponse,
  // Novas interfaces V2
  SolicitacaoComplementaV2,
  SolicitacaoComplementaResponse,
  OfertasRequest,
  OfertasResponse,
  EnviarPropostaRequest,
  EnviarPropostaResponse,
  DocumentoLastroRequest,
  DocumentoLastroResponse,
  BuscarPropostaParams,
  BuscarPropostaResponse,
  // Novas interfaces Webhook e Cobranças
  CriarLinkPagamentoRequest,
  CriarLinkPagamentoResponse,
  BuscarCobrancaParams,
  BuscarCobrancaResponse,
  WebhookFinanciamento,
  WebhookCobranca
} from '../services/parcelamaisApi';
import { useStore } from '../store/useStore';

export interface UseParcelamaisReturn {
  // Estado
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  clinicas: any[];
  
  // Métodos de autenticação
  login: (credentials: TokenRequest) => Promise<boolean>;
  logout: () => void;
  
  // Métodos de clínica
  criarClinica: (data: ClinicaData) => Promise<ClinicaResponse | null>;
  editarClinica: (data: ClinicaData) => Promise<ClinicaResponse | null>;
  buscarClinicas: (params?: {
    id?: string;
    offset?: number;
    limite?: number;
    cnpj?: string;
  }) => Promise<BuscarClinicasResponse | null>;
  
  // Métodos de documentos
  enviarDocumentos: (data: DocumentosData) => Promise<ClinicaResponse | null>;
  
  // ===== NOVOS MÉTODOS V2 =====
  // Métodos de solicitação e propostas
  criarSolicitacaoCompleta: (data: SolicitacaoComplementaV2) => Promise<SolicitacaoComplementaResponse | null>;
  buscarOfertas: (data: OfertasRequest) => Promise<OfertasResponse | null>;
  enviarProposta: (data: EnviarPropostaRequest) => Promise<EnviarPropostaResponse | null>;
  enviarDocumentoLastro: (data: DocumentoLastroRequest) => Promise<DocumentoLastroResponse | null>;
  buscarPropostas: (params?: BuscarPropostaParams) => Promise<BuscarPropostaResponse | null>;
  
  // ===== NOVOS MÉTODOS WEBHOOK E COBRANÇAS =====
  // Métodos de pagamento e cobranças
  criarLinkPagamento: (data: CriarLinkPagamentoRequest) => Promise<CriarLinkPagamentoResponse | null>;
  buscarCobrancas: (params?: BuscarCobrancaParams) => Promise<BuscarCobrancaResponse | null>;
  processWebhookFinanciamento: (data: WebhookFinanciamento) => void;
  processWebhookCobranca: (data: WebhookCobranca) => void;
  
  // Utilitários
  clearError: () => void;
  refreshClinicas: () => Promise<void>;
  
  // Estado adicional para cobranças
  cobrancas: any[];
  refreshCobrancas: () => Promise<void>;
}

export const useParcelamais = (): UseParcelamaisReturn => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [clinicas, setClinicas] = useState<any[]>([]);
  const [cobrancas, setCobrancas] = useState<any[]>([]);
  
  const { setUser } = useStore();

  // Verifica autenticação ao inicializar
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = parcelamaisAPI.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        // Se autenticado, busca as clínicas automaticamente
        refreshClinicas();
      }
    };
    
    checkAuth();
  }, []);

  // Limpa erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleError = useCallback((err: any) => {
    console.error('Erro na API Parcelamais:', err);
    const message = err?.message || 'Erro desconhecido na API';
    setError(message);
    
    // Se erro de autenticação, faz logout
    if (message.includes('token') || message.includes('Unauthorized')) {
      logout();
    }
  }, []);

  const login = useCallback(async (credentials: TokenRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.gerarToken(credentials);
      
      if (response.status === 'success') {
        setIsAuthenticated(true);
        
        // Atualiza o usuário no store global
        setUser({
          id: response.response.user_id,
          email: credentials.email,
          name: 'Usuário Parcelamais',
          phone: '',
          type: 'clinic',
          isParcelamaisAuthenticated: true
        });
        
        // Busca clínicas após login
        await refreshClinicas();
        
        return true;
      } else {
        setError('Credenciais inválidas');
        return false;
      }
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, handleError]);

  const logout = useCallback(() => {
    parcelamaisAPI.logout();
    setIsAuthenticated(false);
    setClinicas([]);
    setError(null);
    setUser(null);
  }, [setUser]);

  const criarClinica = useCallback(async (data: ClinicaData): Promise<ClinicaResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.criarClinica(data);
      
      if (response.status === 'success') {
        // Atualiza a lista de clínicas
        await refreshClinicas();
      }
      
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const editarClinica = useCallback(async (data: ClinicaData): Promise<ClinicaResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.editarClinica(data);
      
      if (response.status === 'success') {
        // Atualiza a lista de clínicas
        await refreshClinicas();
      }
      
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const buscarClinicas = useCallback(async (params?: {
    id?: string;
    offset?: number;
    limite?: number;
    cnpj?: string;
  }): Promise<BuscarClinicasResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.buscarClinicas(
        params?.id,
        params?.offset || 0,
        params?.limite || 10,
        params?.cnpj
      );
      
      setClinicas(response?.clinicas || []);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const enviarDocumentos = useCallback(async (data: DocumentosData): Promise<ClinicaResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.enviarDocumentos(data);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const refreshClinicas = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      await buscarClinicas();
    } catch (err) {
      console.error('Erro ao atualizar clínicas:', err);
    }
  }, [isAuthenticated, buscarClinicas]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ===== NOVOS MÉTODOS V2 =====

  const criarSolicitacaoCompleta = useCallback(async (data: SolicitacaoComplementaV2): Promise<SolicitacaoComplementaResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.criarSolicitacaoCompleta(data);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const buscarOfertas = useCallback(async (data: OfertasRequest): Promise<OfertasResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.buscarOfertas(data);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const enviarProposta = useCallback(async (data: EnviarPropostaRequest): Promise<EnviarPropostaResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.enviarProposta(data);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const enviarDocumentoLastro = useCallback(async (data: DocumentoLastroRequest): Promise<DocumentoLastroResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.enviarDocumentoLastro(data);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const buscarPropostas = useCallback(async (params: BuscarPropostaParams = {}): Promise<BuscarPropostaResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.buscarPropostas(params);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  // ===== NOVOS MÉTODOS WEBHOOK E COBRANÇAS =====

  const criarLinkPagamento = useCallback(async (data: CriarLinkPagamentoRequest): Promise<CriarLinkPagamentoResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.criarLinkPagamento(data);
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const buscarCobrancas = useCallback(async (params: BuscarCobrancaParams = {}): Promise<BuscarCobrancaResponse | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await parcelamaisAPI.buscarCobrancas(params);
      
      setCobrancas(response?.cobrancas || []);
      
      return response;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  const processWebhookFinanciamento = useCallback((data: WebhookFinanciamento): void => {
    parcelamaisAPI.processWebhookFinanciamento(data);
    
    // Aqui você pode adicionar lógica adicional, como:
    // - Mostrar notificação toast
    // - Atualizar estado da aplicação
    // - Disparar eventos customizados
    console.log('Processando webhook de financiamento:', data);
  }, []);

  const processWebhookCobranca = useCallback((data: WebhookCobranca): void => {
    parcelamaisAPI.processWebhookCobranca(data);
    
    // Atualiza a lista de cobranças se necessário
    refreshCobrancas();
    
    // Aqui você pode adicionar lógica adicional, como:
    // - Mostrar notificação toast
    // - Atualizar estado da aplicação
    // - Disparar eventos customizados
    console.log('Processando webhook de cobrança:', data);
  }, []);

  const refreshCobrancas = useCallback(async (): Promise<void> => {
    if (!isAuthenticated) return;
    
    try {
      await buscarCobrancas();
    } catch (err) {
      console.error('Erro ao atualizar cobranças:', err);
    }
  }, [isAuthenticated, buscarCobrancas]);

  return {
    // Estado
    isAuthenticated,
    isLoading,
    error,
    clinicas,
    cobrancas,
    
    // Métodos de autenticação
    login,
    logout,
    
    // Métodos de clínica
    criarClinica,
    editarClinica,
    buscarClinicas,
    
    // Métodos de documentos
    enviarDocumentos,
    
    // ===== NOVOS MÉTODOS V2 =====
    // Métodos de solicitação e propostas
    criarSolicitacaoCompleta,
    buscarOfertas,
    enviarProposta,
    enviarDocumentoLastro,
    buscarPropostas,
    
    // ===== NOVOS MÉTODOS WEBHOOK E COBRANÇAS =====
    // Métodos de pagamento e cobranças
    criarLinkPagamento,
    buscarCobrancas,
    processWebhookFinanciamento,
    processWebhookCobranca,
    
    // Utilitários
    clearError,
    refreshClinicas,
    refreshCobrancas,
  };
};

export default useParcelamais;