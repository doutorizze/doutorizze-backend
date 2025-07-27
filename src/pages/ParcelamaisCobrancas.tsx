import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import useParcelamais from '../hooks/useParcelamais';
import { toast } from 'sonner';
import {
  CreditCard,
  Search,
  Plus,
  ExternalLink,
  Download,
  Filter,
  RefreshCw,
  DollarSign,
  Calendar,
  User,
  FileText,
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import type {
  CriarLinkPagamentoRequest,
  BuscarCobrancaParams,
  WebhookFinanciamento,
  WebhookCobranca
} from '../services/parcelamaisApi';
import WebhookNotifications from '../components/WebhookNotifications';

const ParcelamaisCobrancas: React.FC = () => {
  // Tratamento de erro para o hook useParcelamais
  let parcelamaisHook;
  try {
    parcelamaisHook = useParcelamais();
  } catch (error) {
    console.error('Erro ao inicializar useParcelamais:', error);
    parcelamaisHook = {
      isAuthenticated: false,
      isLoading: false,
      error: 'Erro ao carregar integração Parcelamais Cobranças',
      clinicas: [],
      cobrancas: [],
      criarLinkPagamento: async () => null,
      buscarCobrancas: async () => null,
      processWebhookFinanciamento: () => {},
      processWebhookCobranca: () => {},
      refreshCobrancas: async () => {},
      clearError: () => {}
    };
  }
  
  const {
    isAuthenticated,
    isLoading,
    error,
    clinicas,
    cobrancas,
    criarLinkPagamento,
    buscarCobrancas,
    processWebhookFinanciamento,
    processWebhookCobranca,
    refreshCobrancas,
    clearError
  } = parcelamaisHook;

  // Estados para criar link de pagamento
  const [linkPagamentoForm, setLinkPagamentoForm] = useState<CriarLinkPagamentoRequest>({
    valorTotal: 0,
    numeroMaximoParcelas: 12,
    clinica: '',
    pagamentoTaxa: 'cliente',
    cpf: '',
    nome: ''
  });

  // Estados para buscar cobranças
  const [filtrosCobranca, setFiltrosCobranca] = useState<BuscarCobrancaParams>({
    offset: 0,
    limite: 10
  });

  // Estados para simulação de webhooks
  const [webhookSimulacao, setWebhookSimulacao] = useState({
    tipo: 'financiamento' as 'financiamento' | 'cobranca',
    dados: ''
  });

  // Estados gerais
  const [activeTab, setActiveTab] = useState('criar-link');
  const [linkCriado, setLinkCriado] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshCobrancas();
    }
  }, [isAuthenticated, refreshCobrancas]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleCriarLinkPagamento = async () => {
    if (!linkPagamentoForm.valorTotal || !linkPagamentoForm.cpf || !linkPagamentoForm.nome || !linkPagamentoForm.clinica) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const response = await criarLinkPagamento(linkPagamentoForm);
      
      if (response && response.status === 'success') {
        toast.success('Link de pagamento criado com sucesso!');
        setLinkCriado(response.response.link);
        
        // Limpa o formulário
        setLinkPagamentoForm({
          valorTotal: 0,
          numeroMaximoParcelas: 12,
          clinica: '',
          pagamentoTaxa: 'cliente',
          cpf: '',
          nome: ''
        });
      }
    } catch (err) {
      toast.error('Erro ao criar link de pagamento');
    }
  };

  const handleBuscarCobrancas = async () => {
    try {
      await buscarCobrancas(filtrosCobranca);
      toast.success('Cobranças atualizadas com sucesso!');
    } catch (err) {
      toast.error('Erro ao buscar cobranças');
    }
  };

  const handleSimularWebhook = () => {
    try {
      const dados = JSON.parse(webhookSimulacao.dados);
      
      if (webhookSimulacao.tipo === 'financiamento') {
        processWebhookFinanciamento(dados as WebhookFinanciamento);
        toast.success('Webhook de financiamento processado!');
      } else {
        processWebhookCobranca(dados as WebhookCobranca);
        toast.success('Webhook de cobrança processado!');
      }
      
      setWebhookSimulacao({ ...webhookSimulacao, dados: '' });
    } catch (err) {
      toast.error('JSON inválido para simulação de webhook');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', icon: React.ReactNode }> = {
      'pago': { variant: 'default', icon: <CheckCircle className="w-3 h-3" /> },
      'a-receber': { variant: 'secondary', icon: <Clock className="w-3 h-3" /> },
      'atrasado': { variant: 'destructive', icon: <AlertTriangle className="w-3 h-3" /> },
      'cancelado': { variant: 'outline', icon: <XCircle className="w-3 h-3" /> },
      'expirado': { variant: 'destructive', icon: <XCircle className="w-3 h-3" /> }
    };

    const config = statusMap[status.toLowerCase()] || { variant: 'outline' as const, icon: null };
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {status}
      </Badge>
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <CreditCard className="w-6 h-6 text-blue-600" />
              Acesso Restrito
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Você precisa estar autenticado no Parcelamais para acessar a gestão de cobranças.
            </p>
            <Button onClick={() => window.location.href = '/parcelamais'} className="w-full">
              Ir para Configuração
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleWebhookReceived = (type: 'financiamento' | 'cobranca', data: any) => {
    if (type === 'financiamento') {
      processWebhookFinanciamento(data);
    } else {
      processWebhookCobranca(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestão de Cobranças - Parcelamais
          </h1>
          <p className="text-gray-600">
            Crie links de pagamento, gerencie cobranças e monitore webhooks
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="criar-link" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Criar Link
            </TabsTrigger>
            <TabsTrigger value="cobrancas" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Cobranças
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="relatorios" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          {/* Criar Link de Pagamento */}
          <TabsContent value="criar-link">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Criar Link de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome do Cliente *</Label>
                      <Input
                        id="nome"
                        value={linkPagamentoForm.nome}
                        onChange={(e) => setLinkPagamentoForm({ ...linkPagamentoForm, nome: e.target.value })}
                        placeholder="Nome completo do cliente"
                      />
                    </div>

                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={linkPagamentoForm.cpf}
                        onChange={(e) => setLinkPagamentoForm({ ...linkPagamentoForm, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="valorTotal">Valor Total *</Label>
                      <Input
                        id="valorTotal"
                        type="number"
                        step="0.01"
                        value={linkPagamentoForm.valorTotal}
                        onChange={(e) => setLinkPagamentoForm({ ...linkPagamentoForm, valorTotal: parseFloat(e.target.value) || 0 })}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="clinica">Clínica *</Label>
                      <Select
                        value={linkPagamentoForm.clinica}
                        onValueChange={(value) => setLinkPagamentoForm({ ...linkPagamentoForm, clinica: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma clínica" />
                        </SelectTrigger>
                        <SelectContent>
                          {(clinicas || []).map((clinica) => (
                            <SelectItem key={clinica.id} value={clinica.id}>
                              {clinica.nomeFantasia || clinica.razaoSocial}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="numeroMaximoParcelas">Número Máximo de Parcelas</Label>
                      <Input
                        id="numeroMaximoParcelas"
                        type="number"
                        value={linkPagamentoForm.numeroMaximoParcelas}
                        onChange={(e) => setLinkPagamentoForm({ ...linkPagamentoForm, numeroMaximoParcelas: parseInt(e.target.value) || 12 })}
                        placeholder="12"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pagamentoTaxa">Pagamento da Taxa</Label>
                      <Select
                        value={linkPagamentoForm.pagamentoTaxa}
                        onValueChange={(value: 'cliente' | 'vendedor') => setLinkPagamentoForm({ ...linkPagamentoForm, pagamentoTaxa: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cliente">Cliente</SelectItem>
                          <SelectItem value="vendedor">Vendedor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleCriarLinkPagamento}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Criar Link de Pagamento
                  </Button>
                </div>

                {linkCriado && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-green-800">Link criado com sucesso!</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input value={linkCriado} readOnly className="flex-1" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(linkCriado);
                            toast.success('Link copiado para a área de transferência!');
                          }}
                        >
                          Copiar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(linkCriado, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Buscar Cobranças */}
          <TabsContent value="cobrancas">
            <div className="space-y-6">
              {/* Filtros */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filtros de Busca
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor="filtro-cpf">CPF</Label>
                      <Input
                        id="filtro-cpf"
                        value={filtrosCobranca.cpf || ''}
                        onChange={(e) => setFiltrosCobranca({ ...filtrosCobranca, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="filtro-status">Status</Label>
                      <Select
                        value={filtrosCobranca.status || ''}
                        onValueChange={(value) => setFiltrosCobranca({ ...filtrosCobranca, status: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          <SelectItem value="a-receber">A Receber</SelectItem>
                          <SelectItem value="pago">Pago</SelectItem>
                          <SelectItem value="atrasado">Atrasado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                          <SelectItem value="expirado">Expirado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="filtro-tipo">Tipo</Label>
                      <Select
                        value={filtrosCobranca.tipo || ''}
                        onValueChange={(value) => setFiltrosCobranca({ ...filtrosCobranca, tipo: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos</SelectItem>
                          <SelectItem value="boleto">Boleto</SelectItem>
                          <SelectItem value="pix">PIX</SelectItem>
                          <SelectItem value="recorrencia-cartao">Recorrência Cartão</SelectItem>
                          <SelectItem value="parcelamento-cartao">Parcelamento Cartão</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="filtro-data-inicio">Data Início</Label>
                      <Input
                        id="filtro-data-inicio"
                        type="date"
                        value={filtrosCobranca.dataInicio || ''}
                        onChange={(e) => setFiltrosCobranca({ ...filtrosCobranca, dataInicio: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="filtro-data-final">Data Final</Label>
                      <Input
                        id="filtro-data-final"
                        type="date"
                        value={filtrosCobranca.dataFinal || ''}
                        onChange={(e) => setFiltrosCobranca({ ...filtrosCobranca, dataFinal: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <Button
                      onClick={handleBuscarCobrancas}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      Buscar Cobranças
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setFiltrosCobranca({ offset: 0, limite: 10 })}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Cobranças */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Cobranças ({cobrancas.length})
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshCobrancas}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cobrancas.length === 0 ? (
                    <div className="text-center py-8">
                      <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Nenhuma cobrança encontrada</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(cobrancas || []).map((cobranca) => (
                        <Card key={cobranca.id} className="border-l-4 border-l-blue-500">
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <User className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{cobranca.nome}</span>
                                </div>
                                <p className="text-sm text-gray-600">CPF: {cobranca.cpf}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <DollarSign className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{formatCurrency(cobranca.valor)}</span>
                                </div>
                                <p className="text-sm text-gray-600">Tipo: {cobranca.tipo}</p>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <Calendar className="w-4 h-4 text-gray-500" />
                                  <span className="font-medium">{formatDate(cobranca.dataVencimento)}</span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  Criado: {formatDate(cobranca.dataCriacao)}
                                </p>
                              </div>

                              <div className="flex flex-col gap-2">
                                {getStatusBadge(cobranca.status)}
                                <div className="flex gap-2">
                                  {cobranca.linkBoleto && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(cobranca.linkBoleto, '_blank')}
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                  )}
                                  {cobranca.linkPagamento && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => window.open(cobranca.linkPagamento, '_blank')}
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Simulação de Webhooks */}
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Simulação de Webhooks
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="webhook-tipo">Tipo de Webhook</Label>
                    <Select
                      value={webhookSimulacao.tipo}
                      onValueChange={(value: 'financiamento' | 'cobranca') => setWebhookSimulacao({ ...webhookSimulacao, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financiamento">Webhook de Financiamento</SelectItem>
                        <SelectItem value="cobranca">Webhook de Cobrança</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="webhook-dados">Dados JSON do Webhook</Label>
                  <textarea
                    id="webhook-dados"
                    className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
                    value={webhookSimulacao.dados}
                    onChange={(e) => setWebhookSimulacao({ ...webhookSimulacao, dados: e.target.value })}
                    placeholder={`Cole aqui o JSON do webhook para simulação...\n\nExemplo para financiamento:\n{\n  "id": "123",\n  "status": "Pré-Aprovado",\n  "valorMaximo": 10000,\n  ...\n}`}
                  />
                </div>

                <Button
                  onClick={handleSimularWebhook}
                  disabled={!webhookSimulacao.dados.trim()}
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Simular Webhook
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Relatórios */}
          <TabsContent value="relatorios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Relatórios e Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-800">Total Pago</p>
                          <p className="text-2xl font-bold text-green-900">
                            {formatCurrency(
                              cobrancas
                                .filter(c => c && c.status && c.status.toLowerCase() === 'pago')
                                .reduce((sum, c) => sum + c.valor, 0)
                            )}
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-800">A Receber</p>
                          <p className="text-2xl font-bold text-yellow-900">
                            {formatCurrency(
                              cobrancas
                                .filter(c => c && c.status && c.status.toLowerCase() === 'a-receber')
                                .reduce((sum, c) => sum + c.valor, 0)
                            )}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-800">Em Atraso</p>
                          <p className="text-2xl font-bold text-red-900">
                            {formatCurrency(
                              cobrancas
                                .filter(c => c && c.status && c.status.toLowerCase() === 'atrasado')
                                .reduce((sum, c) => sum + c.valor, 0)
                            )}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const csvContent = [
                        ['Nome', 'CPF', 'Valor', 'Status', 'Tipo', 'Data Vencimento', 'Data Criação'].join(','),
                        ...(cobrancas || []).map(c => [
                          c.nome,
                          c.cpf,
                          c.valor,
                          c.status,
                          c.tipo,
                          c.dataVencimento,
                          c.dataCriacao
                        ].join(','))
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `cobrancas_${new Date().toISOString().split('T')[0]}.csv`;
                      a.click();
                      window.URL.revokeObjectURL(url);
                      
                      toast.success('Relatório exportado com sucesso!');
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar CSV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Componente de notificações de webhook */}
      <WebhookNotifications onWebhookReceived={handleWebhookReceived} />
    </div>
  );
};

export default ParcelamaisCobrancas;