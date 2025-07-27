import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, CheckCircle, AlertTriangle, DollarSign, CreditCard } from 'lucide-react';
import type { WebhookFinanciamento, WebhookCobranca } from '../services/parcelamaisApi';

interface WebhookNotificationsProps {
  onWebhookReceived?: (type: 'financiamento' | 'cobranca', data: any) => void;
}

const WebhookNotifications: React.FC<WebhookNotificationsProps> = ({ onWebhookReceived }) => {
  const [isListening, setIsListening] = useState(false);

  // Simulação de recebimento de webhooks
  useEffect(() => {
    if (!isListening) return;

    // Simula webhooks chegando a cada 30 segundos (apenas para demonstração)
    const interval = setInterval(() => {
      // Simula recebimento aleatório de webhooks
      const shouldReceiveWebhook = Math.random() > 0.7; // 30% de chance
      
      if (shouldReceiveWebhook) {
        const isFinanciamento = Math.random() > 0.5;
        
        if (isFinanciamento) {
          simulateFinanciamentoWebhook();
        } else {
          simulateCobrancaWebhook();
        }
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [isListening]);

  const simulateFinanciamentoWebhook = () => {
    const mockData: WebhookFinanciamento = {
      id: `fin_${Date.now()}`,
      valorMaximo: 15000,
      numeroParcelasMaximo: 24,
      menorTaxaJuros: 2.5,
      dataAnalise: new Date().toISOString().split('T')[0],
      numeroParcelas: 12,
      taxaJurosMensal: 2.8,
      valorParcela: 1350.50,
      cetMensal: 3.2,
      valorContrato: 16206,
      valorEmprestado: 15000,
      dataContratacao: new Date().toISOString().split('T')[0],
      dataPagamento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dataPrimeiraParcela: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pré-Aprovado',
      subStatus: 'APROVADO',
      clinica: 'clinic_123',
      link: 'https://parcelamais.com/ofertas/abc123',
      produto: 'FINANCIAMENTO',
      ofertas: [
        {
          financeira: 'Financeira Premium',
          valorAprovado: 15000,
          menorTaxa: 2.5
        }
      ],
      evento: 'STATUS',
      etapa: 'ANALISE'
    };

    // Mostra notificação toast
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-medium">Financiamento Aprovado!</p>
          <p className="text-sm text-gray-600">
            Valor: R$ {mockData.valorEmprestado.toLocaleString('pt-BR')}
          </p>
        </div>
      </div>,
      {
        duration: 5000,
        action: {
          label: 'Ver Detalhes',
          onClick: () => {
            console.log('Abrindo detalhes do financiamento:', mockData);
            window.open(mockData.link, '_blank');
          }
        }
      }
    );

    // Chama callback se fornecido
    onWebhookReceived?.('financiamento', mockData);
  };

  const simulateCobrancaWebhook = () => {
    const statuses = ['Pago', 'A receber', 'Atrasado', 'Cancelado'];
    const tipos = ['Boleto', 'PIX', 'Cartão de Crédito'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomTipo = tipos[Math.floor(Math.random() * tipos.length)];

    const mockData: WebhookCobranca = {
      id: `cob_${Date.now()}`,
      valorTotal: 850.00,
      status: randomStatus,
      nome: 'João Silva',
      numeroParcelas: 3,
      linkPagamento: 'https://link.parcelamais.com/pagamento-abc123',
      uuidLinkPagamento: `uuid_${Date.now()}`,
      cpf: '12345678901',
      dataVencimento: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clinica: 'clinic_123',
      linkBoleto: 'https://parcelamais.com/boleto.pdf',
      linkBoletos: 'https://parcelamais.com/boletos?cpf=12345678901',
      tipo: randomTipo,
      dataCriacao: new Date().toISOString().split('T')[0],
      dataPagamento: randomStatus === 'Pago' ? new Date().toISOString().split('T')[0] : undefined,
      proposta: 'prop_123'
    };

    // Escolhe ícone e cor baseado no status
    const getStatusConfig = (status: string) => {
      switch (status.toLowerCase()) {
        case 'pago':
          return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' };
        case 'atrasado':
          return { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' };
        default:
          return { icon: DollarSign, color: 'text-blue-600', bgColor: 'bg-blue-50' };
      }
    };

    const statusConfig = getStatusConfig(randomStatus);
    const StatusIcon = statusConfig.icon;

    // Mostra notificação toast
    toast(
      <div className="flex items-center gap-3">
        <div className={`flex-shrink-0 p-2 rounded-full ${statusConfig.bgColor}`}>
          <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
        </div>
        <div>
          <p className="font-medium">Cobrança Atualizada</p>
          <p className="text-sm text-gray-600">
            {mockData.nome} - {randomStatus}
          </p>
          <p className="text-sm text-gray-600">
            R$ {mockData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>,
      {
        duration: 5000,
        action: {
          label: 'Ver Cobrança',
          onClick: () => {
            console.log('Abrindo detalhes da cobrança:', mockData);
            window.open('/parcelamais-cobrancas', '_blank');
          }
        }
      }
    );

    // Chama callback se fornecido
    onWebhookReceived?.('cobranca', mockData);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      toast.info(
        <div className="flex items-center gap-3">
          <Bell className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium">Notificações Ativadas</p>
            <p className="text-sm text-gray-600">
              Você receberá notificações de webhooks em tempo real
            </p>
          </div>
        </div>,
        { duration: 3000 }
      );
    } else {
      toast.info('Notificações de webhook desativadas', { duration: 2000 });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={toggleListening}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all duration-200
          ${isListening 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }
        `}
        title={isListening ? 'Desativar notificações de webhook' : 'Ativar notificações de webhook'}
      >
        <Bell className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
        <span className="text-sm font-medium">
          {isListening ? 'Webhooks Ativos' : 'Ativar Webhooks'}
        </span>
        {isListening && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        )}
      </button>
    </div>
  );
};

export default WebhookNotifications;