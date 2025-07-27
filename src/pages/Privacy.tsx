import Layout from '@/components/Layout';

export default function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Política de Privacidade
            </h1>
            <p className="text-lg text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 mb-3">
                Seu Compromisso com a Privacidade
              </h2>
              <p className="text-green-800">
                No DOUTORIZZE, a proteção dos seus dados pessoais é nossa prioridade. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Informações que Coletamos</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1.1 Dados Pessoais Básicos</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Nome completo</li>
                    <li>E-mail</li>
                    <li>Telefone</li>
                    <li>CPF</li>
                    <li>Data de nascimento</li>
                    <li>Endereço</li>
                    <li>Gênero</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1.2 Dados de Saúde (quando aplicável)</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Histórico médico</li>
                    <li>Informações sobre consultas</li>
                    <li>Prescrições e tratamentos</li>
                    <li>Exames e resultados</li>
                    <li>Alergias e condições médicas</li>
                  </ul>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-red-800 text-sm">
                      <strong>Importante:</strong> Dados de saúde são considerados dados sensíveis e recebem proteção especial conforme a LGPD.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1.3 Dados Financeiros</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Informações de pagamento</li>
                    <li>Histórico de transações</li>
                    <li>Dados para análise de crédito</li>
                    <li>Informações bancárias (quando necessário)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">1.4 Dados de Uso da Plataforma</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Logs de acesso</li>
                    <li>Endereço IP</li>
                    <li>Informações do dispositivo</li>
                    <li>Cookies e tecnologias similares</li>
                    <li>Padrões de navegação</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Como Usamos suas Informações</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.1 Prestação de Serviços</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Facilitar agendamentos de consultas</li>
                    <li>Processar pagamentos e parcelamentos</li>
                    <li>Conectar pacientes e profissionais</li>
                    <li>Enviar lembretes e notificações</li>
                    <li>Fornecer suporte ao cliente</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.2 Melhoria dos Serviços</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Análise de uso da plataforma</li>
                    <li>Desenvolvimento de novas funcionalidades</li>
                    <li>Personalização da experiência do usuário</li>
                    <li>Pesquisas de satisfação</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.3 Segurança e Conformidade</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Prevenção de fraudes</li>
                    <li>Verificação de identidade</li>
                    <li>Cumprimento de obrigações legais</li>
                    <li>Proteção contra atividades maliciosas</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">2.4 Comunicação</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Envio de informações sobre consultas</li>
                    <li>Atualizações sobre a plataforma</li>
                    <li>Ofertas e promoções (com seu consentimento)</li>
                    <li>Comunicações de segurança</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Base Legal para o Tratamento</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Consentimento</h3>
                  <p className="text-blue-800 text-sm">
                    Para dados sensíveis de saúde e comunicações promocionais, baseamo-nos no seu consentimento explícito.
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Execução de Contrato</h3>
                  <p className="text-green-800 text-sm">
                    Para dados necessários à prestação dos serviços contratados, como agendamentos e pagamentos.
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-yellow-900 mb-2">Legítimo Interesse</h3>
                  <p className="text-yellow-800 text-sm">
                    Para melhoria dos serviços, segurança da plataforma e prevenção de fraudes.
                  </p>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Cumprimento Legal</h3>
                  <p className="text-purple-800 text-sm">
                    Para atender obrigações legais e regulamentares, como retenção de dados fiscais.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Compartilhamento de Dados</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Com Profissionais de Saúde</h3>
                  <p className="text-gray-600">
                    Compartilhamos dados necessários para a prestação dos serviços médicos, sempre com seu consentimento.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Com Parceiros de Pagamento</h3>
                  <p className="text-gray-600">
                    Dados financeiros são compartilhados com processadores de pagamento seguros para viabilizar transações.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.3 Com Autoridades</h3>
                  <p className="text-gray-600">
                    Quando exigido por lei ou para proteger nossos direitos legais.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Seus Direitos</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Acesso e Portabilidade</h3>
                  <p className="text-gray-600 text-sm">
                    Você pode solicitar uma cópia dos seus dados pessoais em formato estruturado.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Correção</h3>
                  <p className="text-gray-600 text-sm">
                    Você pode solicitar a correção de dados pessoais incompletos ou incorretos.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Exclusão</h3>
                  <p className="text-gray-600 text-sm">
                    Você pode solicitar a exclusão dos seus dados pessoais, sujeito a obrigações legais.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Revogação</h3>
                  <p className="text-gray-600 text-sm">
                    Você pode revogar seu consentimento a qualquer momento.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Segurança dos Dados</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-blue-800">
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
                </p>
                
                <ul className="list-disc list-inside text-blue-700 mt-4 space-y-1">
                  <li>Criptografia de dados em trânsito e em repouso</li>
                  <li>Controles de acesso rigorosos</li>
                  <li>Monitoramento contínuo de segurança</li>
                  <li>Treinamento regular da equipe</li>
                  <li>Auditorias de segurança periódicas</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Retenção de Dados</h2>
              
              <p className="text-gray-600 mb-4">
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política, exceto quando um período de retenção mais longo for exigido por lei.
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Dados de conta</span>
                  <span className="text-gray-600">Enquanto a conta estiver ativa</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Dados de saúde</span>
                  <span className="text-gray-600">20 anos (conforme CFM)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">Dados financeiros</span>
                  <span className="text-gray-600">5 anos (conforme legislação)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">Logs de acesso</span>
                  <span className="text-gray-600">6 meses</span>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contato</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 mb-4">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato conosco:
                </p>
                
                <div className="space-y-2 text-gray-600">
                  <p><strong>E-mail:</strong> privacidade@doutorizze.com.br</p>
                  <p><strong>Telefone:</strong> (11) 3000-0000</p>
                  <p><strong>Endereço:</strong> Rua da Saúde, 123 - São Paulo, SP</p>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    <strong>Encarregado de Dados (DPO):</strong> dpo@doutorizze.com.br
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Alterações nesta Política</h2>
              
              <p className="text-gray-600">
                Esta Política de Privacidade pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas por e-mail ou através de aviso em nossa plataforma. A versão mais atual estará sempre disponível em nosso site.
              </p>
            </section>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <p className="text-green-800">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
              <p className="text-green-700 text-sm mt-2">
                Esta política está em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}