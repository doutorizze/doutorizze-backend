import { useState, useMemo } from 'react';
import { Calculator, CreditCard, TrendingUp, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';

interface InstallmentOption {
  installments: number;
  monthlyValue: number;
  totalValue: number;
  interestRate: number;
  fees: number;
}

export default function InstallmentSimulator() {
  const [amount, setAmount] = useState<string>('500');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const numericAmount = parseFloat(amount) || 0;

  const installmentOptions: InstallmentOption[] = useMemo(() => {
    if (numericAmount <= 0) return [];

    return [
      {
        installments: 1,
        monthlyValue: numericAmount,
        totalValue: numericAmount,
        interestRate: 0,
        fees: 0
      },
      {
        installments: 3,
        monthlyValue: numericAmount / 3,
        totalValue: numericAmount,
        interestRate: 0,
        fees: 0
      },
      {
        installments: 6,
        monthlyValue: numericAmount / 6,
        totalValue: numericAmount,
        interestRate: 0,
        fees: 0
      },
      {
        installments: 12,
        monthlyValue: (numericAmount * 1.08) / 12,
        totalValue: numericAmount * 1.08,
        interestRate: 8,
        fees: 0
      },
      {
        installments: 18,
        monthlyValue: (numericAmount * 1.12) / 18,
        totalValue: numericAmount * 1.12,
        interestRate: 12,
        fees: 0
      },
      {
        installments: 24,
        monthlyValue: (numericAmount * 1.15) / 24,
        totalValue: numericAmount * 1.15,
        interestRate: 15,
        fees: 0
      }
    ];
  }, [numericAmount]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getRecommendation = (option: InstallmentOption) => {
    if (option.installments === 1) return 'Melhor preço';
    if (option.installments <= 6) return 'Sem juros';
    if (option.installments <= 12) return 'Juros baixos';
    return 'Parcelas menores';
  };

  const getRecommendationColor = (option: InstallmentOption) => {
    if (option.installments === 1) return 'bg-green-100 text-green-800';
    if (option.installments <= 6) return 'bg-blue-100 text-blue-800';
    if (option.installments <= 12) return 'bg-yellow-100 text-yellow-800';
    return 'bg-purple-100 text-purple-800';
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Simulador de Parcelamento
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Descubra as melhores condições para parcelar seus tratamentos de saúde. 
                Sem cartão de crédito, com aprovação na hora.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Calcule seu parcelamento
                </h2>
                
                {/* Amount Input */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Valor do tratamento
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
                      R$
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 text-2xl font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0,00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {[300, 500, 1000, 2000, 5000].map((value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value.toString())}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        R$ {value}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Installment Options */}
                {numericAmount > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Opções de parcelamento
                    </h3>
                    
                    <div className="space-y-4">
                      {installmentOptions.map((option, index) => (
                        <div
                          key={index}
                          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                            selectedOption === index
                              ? 'border-blue-600 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                          }`}
                          onClick={() => setSelectedOption(selectedOption === index ? null : index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="text-xl font-bold text-gray-900">
                                  {option.installments === 1 
                                    ? 'À vista' 
                                    : `${option.installments}x`
                                  }
                                </h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  getRecommendationColor(option)
                                }`}>
                                  {getRecommendation(option)}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">Valor da parcela</p>
                                  <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(option.monthlyValue)}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-gray-600">Total a pagar</p>
                                  <p className="text-lg font-semibold text-gray-900">
                                    {formatCurrency(option.totalValue)}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-sm text-gray-600">Taxa de juros</p>
                                  <p className={`text-lg font-semibold ${
                                    option.interestRate === 0 ? 'text-green-600' : 'text-orange-600'
                                  }`}>
                                    {option.interestRate === 0 ? 'Sem juros' : `${option.interestRate}% a.a.`}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="ml-4">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                selectedOption === index
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-gray-300'
                              }`}>
                                {selectedOption === index && (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Expanded Details */}
                          {selectedOption === index && (
                            <div className="mt-6 pt-6 border-t border-blue-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <h5 className="font-semibold text-gray-900 mb-3">Detalhes do parcelamento</h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Valor original:</span>
                                      <span className="font-medium">{formatCurrency(numericAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Juros aplicados:</span>
                                      <span className="font-medium">
                                        {formatCurrency(option.totalValue - numericAmount)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Taxa administrativa:</span>
                                      <span className="font-medium">{formatCurrency(option.fees)}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold pt-2 border-t">
                                      <span>Total final:</span>
                                      <span>{formatCurrency(option.totalValue)}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <h5 className="font-semibold text-gray-900 mb-3">Cronograma de pagamento</h5>
                                  <div className="text-sm text-gray-600">
                                    <p className="mb-2">
                                      {option.installments === 1 
                                        ? 'Pagamento único na confirmação do agendamento'
                                        : `${option.installments} parcelas mensais de ${formatCurrency(option.monthlyValue)}`
                                      }
                                    </p>
                                    <p>
                                      Primeira parcela: Imediatamente após aprovação
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-6">
                                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                  Solicitar este parcelamento
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Integration Link */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-3">
                  Versão Profissional
                </h3>
                <p className="text-purple-100 mb-4 text-sm">
                  Acesse o simulador integrado com suas clínicas Parcelamais para uma experiência completa.
                </p>
                <Link 
                  to="/parcelamais-integration"
                  className="inline-flex items-center bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Simulador Integrado
                </Link>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Vantagens do parcelamento DOUTORIZZE
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Sem cartão de crédito</p>
                      <p className="text-sm text-gray-600">Aprovação baseada em análise de crédito própria</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Aprovação em segundos</p>
                      <p className="text-sm text-gray-600">Resposta imediata para valores até R$ 5.000</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Parcelas flexíveis</p>
                      <p className="text-sm text-gray-600">Escolha entre 3x a 24x conforme sua necessidade</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How it works */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Como funciona
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Escolha o tratamento</p>
                      <p className="text-sm text-gray-600">Selecione o profissional e agende sua consulta</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Simule o parcelamento</p>
                      <p className="text-sm text-gray-600">Use nossa calculadora para ver as opções</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Análise de crédito</p>
                      <p className="text-sm text-gray-600">Aprovação automática em poucos segundos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pagamento aprovado</p>
                      <p className="text-sm text-gray-600">Consulta confirmada e parcelas organizadas</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Informações importantes</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Sujeito à análise de crédito</li>
                      <li>• Parcelas debitadas mensalmente</li>
                      <li>• Primeira parcela na confirmação</li>
                      <li>• Sem taxa de adesão ou anuidade</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}