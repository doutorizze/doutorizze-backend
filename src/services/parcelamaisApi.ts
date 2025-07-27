// Serviço de integração com a API do Parcelamais

const API_BASE_URL = 'https://parcelamais.com/api/1.1/wf';

// Tipos para as requisições e respostas da API
export interface TokenRequest {
  email: string;
  senha: string;
}

export interface TokenResponse {
  status: string;
  response: {
    token: string;
    user_id: string;
    expires: number;
  };
}

export interface ClinicaData {
  nome: string;
  razaoSocial: string;
  cnpj: string;
  url: string;
  responsavel: {
    telefone: string;
    email: string;
    nome: string;
  };
  endereco: {
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    rua: string;
    numeroEndereco: string;
  };
  contaBancaria: {
    contaCorrente: string;
    digitoContaCorrente: string;
    agencia: string;
    digitoAgencia: string;
    codigoBanco: string;
  };
}

export interface ClinicaResponse {
  status: string;
  response: {
    mensagem: string;
    erro: boolean;
    id: string;
    linkConclusao?: string;
  };
}

export interface DocumentosData {
  id: string;
  cartaoCnpj?: string;
  contratoSocial?: string;
  identidadeRepresentante?: string;
  documentoProfissionalFrente?: string;
  documentoProfissionalVerso?: string;
  documentoComFotoFrente?: string;
  documentoComFotoVerso?: string;
  fotoFachada?: string;
  comprovanteConta?: string;
  comprovanteEndereco?: string;
}

export interface BuscarClinicasResponse {
  totalRegistros: number;
  offset: number;
  limite: number;
  clinicas: Array<{
    nome: string;
    id: string;
    razaoSocial: string;
    cnpj: string;
    responsavel: {
      telefone: string;
      email: string;
      nome: string;
    };
    endereco: {
      cep: string;
      uf: string;
      cidade: string;
      bairro: string;
      rua: string;
      numeroEndereco: string;
    };
  }>;
}

// Novas interfaces para APIs V2
export interface SolicitacaoComplementaV2 {
  nome: string;
  cpf: string;
  dataNascimento: string; // YYYY-MM-DD
  telefone: string;
  email: string;
  endereco: {
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    rua: string;
    numeroEndereco: string;
  };
  rendaMensal: number;
  valorSolicitado: number;
  cenario?: string; // Para sandbox: "1", "2", "3"
  clinica: string;
}

export interface SolicitacaoComplementaResponse {
  id: string;
  valorMaximo: number;
  menorTaxaJuros: number;
  dataAnalise: string;
  status: string;
  clinica: string;
  link: string;
  ofertas: Array<{
    financeira: string;
    valorAprovado: number;
    menorTaxa: number;
    entradas: number[];
  }>;
}

export interface OfertasRequest {
  id: string;
  valorSolicitado: number;
  financeira: string;
  diaVencimentoParcelas: number;
  entrada: number;
}

export interface OfertasResponse {
  id: string;
  financeira: string;
  dataPrimeiraParcela: string;
  parcelas: Array<{
    valorSolicitado: number;
    prazo: number;
    valorParcela: number;
    valorTAC: number;
    valorSeguro: number;
    vlrIOF: number;
    percentualCETMensal: number;
    percentualCETAnual: number;
    percentualJurosMensal: number;
    percentualJurosAnual: number;
    valorTotalCredito: number;
    entrada: number;
    dataLimiteEntrada: string;
  }>;
}

export interface EnviarPropostaRequest {
  id: string;
  prazo: number;
  financeira: string;
  rg: string;
  estadoEmissaoRg: string;
  estadoCivil: string;
  nomeMae: string;
  quantidadeMesesOcupacao: string;
  sexo: string;
  profissao: string;
  endereco: {
    cep: string;
    uf: string;
    cidade: string;
    bairro: string;
    rua: string;
    numeroEndereco: string;
  };
  tipoResidencia: string;
  situacaoProfissional: number;
  patrimonio: string;
  quantidadeDependentes: number;
  clienteAlfabetizado: boolean;
  melhorHorario: string;
}

export interface EnviarPropostaResponse {
  status: string;
  response: {
    mensagem: string;
    erro: boolean;
    id: string;
  };
}

export interface DocumentoLastroRequest {
  id: string;
  arquivo: string; // URL do arquivo PDF
}

export interface DocumentoLastroResponse {
  status: string;
  response: {
    mensagem: string;
    erro: boolean;
    id: string;
  };
}

export interface BuscarPropostaParams {
  id?: string;
  cpf?: string;
  offset?: number;
  limite?: number;
  dataInicio?: string; // yyyy-mm-dd
  dataFinal?: string; // yyyy-mm-dd
  status?: 'pre-aprovado' | 'verificacao-identidade' | 'contratado' | 'emprestado' | 'assinatura-contrato' | 'cancelado' | 'negado';
  clinica?: string;
}

export interface BuscarPropostaResponse {
  totalRegistros: number;
  offset: number;
  limite: number;
  propostas: Array<{
    id: string;
    nome: string;
    cpf: string;
    status: string;
    valorSolicitado: number;
    valorAprovado?: number;
    dataAnalise: string;
    clinica: string;
    financeira?: string;
  }>;
}

// Interfaces para Webhook e Cobranças
export interface WebhookFinanciamento {
  id: string;
  valorMaximo: number;
  numeroParcelasMaximo: number;
  menorTaxaJuros: number;
  dataAnalise: string;
  numeroParcelas: number;
  taxaJurosMensal: number;
  valorParcela: number;
  cetMensal: number;
  valorContrato: number;
  valorEmprestado: number;
  dataContratacao: string;
  dataPagamento: string;
  dataPrimeiraParcela: string;
  status: string;
  subStatus: string;
  clinica: string;
  link: string;
  produto: string;
  ofertas: Array<{
    financeira: string;
    valorAprovado: number;
    menorTaxa: number;
  }>;
  evento: string;
  etapa: string;
}

export interface CriarLinkPagamentoRequest {
  valorTotal: number;
  numeroMaximoParcelas: number;
  clinica: string;
  pagamentoTaxa: 'cliente' | 'vendedor';
  cpf: string;
  nome: string;
}

export interface CriarLinkPagamentoResponse {
  status: string;
  response: {
    mensagem: string;
    id: string;
    link: string;
  };
}

export interface BuscarCobrancaParams {
  id?: string;
  cpf?: string;
  clinica?: string;
  dataInicio?: string; // yyyy-mm-dd
  dataFinal?: string; // yyyy-mm-dd
  status?: 'a-receber' | 'pago' | 'atrasado' | 'cancelado' | 'expirado' | 'sem-cobrancas' | 'cancelamento-andamento' | 'confirmado' | 'estornado' | 'pago-aguardando-baixa' | 'acordo';
  tipo?: 'boleto' | 'pix' | 'recorrencia-cartao' | 'parcelamento-cartao' | 'boleto-financiamento' | 'maquina-cartao';
  offset?: number;
  limite?: number;
}

export interface BuscarCobrancaResponse {
  totalRegistros: number;
  offset: number;
  limite: number;
  cobrancas: Array<{
    nome: string;
    cpf: string;
    id: string;
    status: string;
    valor: number;
    dataVencimento: string;
    clinica: string;
    linkBoleto: string;
    linkCarne: string;
    linkPagamento: string;
    tipo: string;
    dataCriacao: string;
    dataPagamento?: string;
  }>;
}

export interface WebhookCobranca {
  id: string;
  valorTotal: number;
  status: string;
  nome: string;
  numeroParcelas: number;
  linkPagamento: string;
  uuidLinkPagamento: string;
  cpf: string;
  dataVencimento: string;
  clinica: string;
  linkBoleto: string;
  linkBoletos: string;
  tipo: string;
  dataCriacao: string;
  dataPagamento?: string;
  proposta: string;
}

// Classe para gerenciar o token
class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;
  private expiresAt: number = 0;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(token: string, expiresIn: number): void {
    this.token = token;
    this.expiresAt = Date.now() + (expiresIn * 1000);
    
    // Verificação de segurança para localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('parcelamais_token', token);
        localStorage.setItem('parcelamais_expires', this.expiresAt.toString());
      }
    } catch (error) {
      console.warn('Erro ao salvar token no localStorage:', error);
    }
  }

  getToken(): string | null {
    // Verifica se o token está no localStorage
    if (!this.token) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          this.token = localStorage.getItem('parcelamais_token');
          const expiresStr = localStorage.getItem('parcelamais_expires');
          if (expiresStr) {
            this.expiresAt = parseInt(expiresStr);
          }
        }
      } catch (error) {
        console.warn('Erro ao acessar localStorage:', error);
        return null;
      }
    }

    // Verifica se o token ainda é válido
    if (this.token && Date.now() < this.expiresAt) {
      return this.token;
    }

    // Token expirado, limpa os dados
    this.clearToken();
    return null;
  }

  clearToken(): void {
    this.token = null;
    this.expiresAt = 0;
    
    // Verificação de segurança para localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('parcelamais_token');
        localStorage.removeItem('parcelamais_expires');
      }
    } catch (error) {
      console.warn('Erro ao limpar token do localStorage:', error);
    }
  }

  isTokenValid(): boolean {
    return this.getToken() !== null;
  }
}

// Classe principal da API
export class ParcelamaisAPI {
  private tokenManager = TokenManager.getInstance();

  // Método para fazer requisições HTTP
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Método para fazer requisições autenticadas
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.tokenManager.getToken();
    if (!token) {
      throw new Error('Token de acesso não encontrado. Faça login novamente.');
    }

    return this.makeRequest<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // 1. Gerar token de acesso
  async gerarToken(credentials: TokenRequest): Promise<TokenResponse> {
    try {
      const response = await this.makeRequest<TokenResponse>('/token', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.status === 'success') {
        this.tokenManager.setToken(
          response.response.token,
          response.response.expires
        );
      }

      return response;
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      throw error;
    }
  }

  // 2. Criar clínica
  async criarClinica(clinicaData: ClinicaData): Promise<ClinicaResponse> {
    try {
      return await this.makeAuthenticatedRequest<ClinicaResponse>('/criar-clinica', {
        method: 'POST',
        body: JSON.stringify(clinicaData),
      });
    } catch (error) {
      console.error('Erro ao criar clínica:', error);
      throw error;
    }
  }

  // 3. Editar clínica
  async editarClinica(clinicaData: ClinicaData): Promise<ClinicaResponse> {
    try {
      return await this.makeAuthenticatedRequest<ClinicaResponse>('/editar-clinica', {
        method: 'POST',
        body: JSON.stringify(clinicaData),
      });
    } catch (error) {
      console.error('Erro ao editar clínica:', error);
      throw error;
    }
  }

  // 4. Enviar documentos
  async enviarDocumentos(documentosData: DocumentosData): Promise<ClinicaResponse> {
    try {
      return await this.makeAuthenticatedRequest<ClinicaResponse>('/enviar-documentos', {
        method: 'POST',
        body: JSON.stringify(documentosData),
      });
    } catch (error) {
      console.error('Erro ao enviar documentos:', error);
      throw error;
    }
  }

  // 5. Buscar clínicas
  async buscarClinicas(
    id?: string,
    offset: number = 0,
    limite: number = 10,
    cnpj?: string
  ): Promise<BuscarClinicasResponse> {
    try {
      const params = new URLSearchParams();
      if (id) params.append('id', id);
      if (cnpj) params.append('cnpj', cnpj);
      params.append('offset', offset.toString());
      params.append('limite', limite.toString());

      const queryString = params.toString();
      const endpoint = `/clinica${queryString ? `?${queryString}` : ''}`;

      return await this.makeAuthenticatedRequest<BuscarClinicasResponse>(endpoint, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Erro ao buscar clínicas:', error);
      throw error;
    }
  }

  // Método para verificar se está autenticado
  isAuthenticated(): boolean {
    return this.tokenManager.isTokenValid();
  }

  // Método para fazer logout
  logout(): void {
    this.tokenManager.clearToken();
  }

  // Método para obter informações do token atual
  getTokenInfo(): { hasToken: boolean; expiresAt?: number } {
    const token = this.tokenManager.getToken();
    return {
      hasToken: !!token,
      expiresAt: token ? this.tokenManager['expiresAt'] : undefined,
    };
  }

  // ===== NOVAS APIs V2 =====

  // 6. Solicitação completa V2
  async criarSolicitacaoCompleta(data: SolicitacaoComplementaV2): Promise<SolicitacaoComplementaResponse> {
    try {
      return await this.makeAuthenticatedRequest<SolicitacaoComplementaResponse>('/criar-completo-v2', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao criar solicitação completa:', error);
      throw error;
    }
  }

  // 7. Buscar ofertas
  async buscarOfertas(data: OfertasRequest): Promise<OfertasResponse> {
    try {
      return await this.makeAuthenticatedRequest<OfertasResponse>('/ofertas', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao buscar ofertas:', error);
      throw error;
    }
  }

  // 8. Enviar proposta
  async enviarProposta(data: EnviarPropostaRequest): Promise<EnviarPropostaResponse> {
    try {
      return await this.makeAuthenticatedRequest<EnviarPropostaResponse>('/enviar-proposta', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao enviar proposta:', error);
      throw error;
    }
  }

  // 9. Enviar documento lastro
  async enviarDocumentoLastro(data: DocumentoLastroRequest): Promise<DocumentoLastroResponse> {
    try {
      return await this.makeAuthenticatedRequest<DocumentoLastroResponse>('/documento-lastro', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao enviar documento lastro:', error);
      throw error;
    }
  }

  // 10. Buscar propostas
  async buscarPropostas(params: BuscarPropostaParams = {}): Promise<BuscarPropostaResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.id) searchParams.append('id', params.id);
      if (params.cpf) searchParams.append('cpf', params.cpf);
      if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());
      if (params.limite !== undefined) searchParams.append('limite', params.limite.toString());
      if (params.dataInicio) searchParams.append('dataInicio', params.dataInicio);
      if (params.dataFinal) searchParams.append('dataFinal', params.dataFinal);
      if (params.status) searchParams.append('status', params.status);
      if (params.clinica) searchParams.append('clinica', params.clinica);

      const queryString = searchParams.toString();
      const endpoint = `/proposta${queryString ? `?${queryString}` : ''}`;

      return await this.makeAuthenticatedRequest<BuscarPropostaResponse>(endpoint, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Erro ao buscar propostas:', error);
      throw error;
    }
  }

  // ===== NOVAS APIs WEBHOOK E COBRANÇAS =====

  // 11. Criar link de pagamento
  async criarLinkPagamento(data: CriarLinkPagamentoRequest): Promise<CriarLinkPagamentoResponse> {
    try {
      return await this.makeAuthenticatedRequest<CriarLinkPagamentoResponse>('/criar-link-pagamento', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Erro ao criar link de pagamento:', error);
      throw error;
    }
  }

  // 12. Buscar cobranças
  async buscarCobrancas(params: BuscarCobrancaParams = {}): Promise<BuscarCobrancaResponse> {
    try {
      const searchParams = new URLSearchParams();
      
      if (params.id) searchParams.append('id', params.id);
      if (params.cpf) searchParams.append('cpf', params.cpf);
      if (params.clinica) searchParams.append('clinica', params.clinica);
      if (params.dataInicio) searchParams.append('dataInicio', params.dataInicio);
      if (params.dataFinal) searchParams.append('dataFinal', params.dataFinal);
      if (params.status) searchParams.append('status', params.status);
      if (params.tipo) searchParams.append('tipo', params.tipo);
      if (params.offset !== undefined) searchParams.append('offset', params.offset.toString());
      if (params.limite !== undefined) searchParams.append('limite', params.limite.toString());

      const queryString = searchParams.toString();
      const endpoint = `/cobranca${queryString ? `?${queryString}` : ''}`;

      return await this.makeAuthenticatedRequest<BuscarCobrancaResponse>(endpoint, {
        method: 'GET',
      });
    } catch (error) {
      console.error('Erro ao buscar cobranças:', error);
      throw error;
    }
  }

  // 13. Método para processar webhook de financiamento (simulação)
  processWebhookFinanciamento(data: WebhookFinanciamento): void {
    console.log('Webhook de financiamento recebido:', data);
    // Aqui você pode adicionar lógica para processar o webhook
    // Por exemplo, atualizar o estado da aplicação, mostrar notificações, etc.
  }

  // 14. Método para processar webhook de cobrança (simulação)
  processWebhookCobranca(data: WebhookCobranca): void {
    console.log('Webhook de cobrança recebido:', data);
    // Aqui você pode adicionar lógica para processar o webhook
    // Por exemplo, atualizar o estado da aplicação, mostrar notificações, etc.
  }
}

// Instância singleton da API
export const parcelamaisAPI = new ParcelamaisAPI();

// Hook personalizado para usar a API no React
export const useParcelamaisAPI = () => {
  return {
    api: parcelamaisAPI,
    isAuthenticated: parcelamaisAPI.isAuthenticated(),
    login: async (email: string, senha: string) => {
      return await parcelamaisAPI.gerarToken({ email, senha });
    },
    logout: () => {
      parcelamaisAPI.logout();
    },
  };
};

export default parcelamaisAPI;