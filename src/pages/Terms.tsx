import Layout from '@/components/Layout';

export default function Terms() {
  return (
    <Layout>
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Termos de Uso
            </h1>
            <p className="text-lg text-gray-600">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">
                Bem-vindo ao DOUTORIZZE
              </h2>
              <p className="text-blue-800">
                Estes Termos de Uso regem o uso da plataforma DOUTORIZZE. Ao acessar ou usar nossos serviços, você concorda em cumprir estes termos.
              </p>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Definições</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.1 Plataforma</h3>
                  <p className="text-gray-600">
                    Refere-se ao website, aplicativo móvel e todos os serviços oferecidos pelo DOUTORIZZE, incluindo agendamento de consultas, sistema de parcelamento e funcionalidades relacionadas.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.2 Usuários</h3>
                  <p className="text-gray-600">
                    Incluem pacientes, profissionais de saúde e qualquer pessoa que acesse ou utilize a plataforma.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">1.3 Serviços</h3>
                  <p className="text-gray-600">
                    Compreendem todas as funcionalidades oferecidas pela plataforma, incluindo mas não limitado a agendamento, parcelamento, comunicação e gestão de consultas.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Aceitação dos Termos</h2>
              <p className="text-gray-600 mb-4">
                Ao criar uma conta ou usar qualquer parte da plataforma, você confirma que:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Leu, compreendeu e concorda com estes Termos de Uso</li>
                <li>Tem pelo menos 18 anos de idade ou possui autorização legal</li>
                <li>Fornecerá informações verdadeiras e atualizadas</li>
                <li>Usará a plataforma de forma legal e ética</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cadastro e Conta do Usuário</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Responsabilidades do Usuário</h3>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Manter a confidencialidade de suas credenciais de acesso</li>
                    <li>Notificar imediatamente sobre uso não autorizado da conta</li>
                    <li>Manter informações de perfil atualizadas e precisas</li>
                    <li>Não compartilhar conta com terceiros</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Verificação de Profissionais</h3>
                  <p className="text-gray-600">
                    Profissionais de saúde devem fornecer documentação válida, incluindo registro no conselho de classe, para verificação antes de oferecer serviços na plataforma.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Uso da Plataforma</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Uso Permitido</h3>
                  <p className="text-gray-600 mb-2">A plataforma pode ser usada para:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Agendar e gerenciar consultas médicas</li>
                    <li>Buscar profissionais de saúde qualificados</li>
                    <li>Utilizar serviços de parcelamento para procedimentos</li>
                    <li>Comunicar-se com profissionais através dos canais disponíveis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Uso Proibido</h3>
                  <p className="text-gray-600 mb-2">É expressamente proibido:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Usar a plataforma para atividades ilegais ou fraudulentas</li>
                    <li>Interferir no funcionamento da plataforma</li>
                    <li>Tentar acessar contas de outros usuários</li>
                    <li>Publicar conteúdo ofensivo, difamatório ou inadequado</li>
                    <li>Usar informações de outros usuários para fins não autorizados</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Serviços de Parcelamento</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Análise de Crédito</h3>
                  <p className="text-gray-600">
                    O parcelamento está sujeito à análise de crédito. A aprovação não é garantida e depende de critérios internos de avaliação.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Condições de Pagamento</h3>
                  <p className="text-gray-600">
                    As condições de parcelamento, incluindo número de parcelas, juros e formas de pagamento, serão apresentadas antes da confirmação da transação.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">5.3 Inadimplência</h3>
                  <p className="text-gray-600">
                    O não pagamento das parcelas pode resultar em cobrança, negativação nos órgãos de proteção ao crédito e suspensão dos serviços.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Privacidade e Proteção de Dados</h2>
              <p className="text-gray-600 mb-4">
                A coleta, uso e proteção de dados pessoais são regidos por nossa Política de Privacidade, que faz parte integrante destes Termos de Uso.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Importante:</strong> Dados de saúde são tratados com máxima segurança e confidencialidade, em conformidade com a LGPD e regulamentações do setor de saúde.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Responsabilidades e Limitações</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">7.1 Responsabilidade da Plataforma</h3>
                  <p className="text-gray-600">
                    O DOUTORIZZE atua como intermediário entre pacientes e profissionais. Não somos responsáveis pela qualidade dos serviços médicos prestados pelos profissionais cadastrados.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">7.2 Limitação de Responsabilidade</h3>
                  <p className="text-gray-600">
                    Nossa responsabilidade limita-se ao funcionamento da plataforma. Não nos responsabilizamos por danos indiretos, lucros cessantes ou consequências de decisões médicas.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cancelamentos e Reembolsos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">8.1 Cancelamento de Consultas</h3>
                  <p className="text-gray-600">
                    Consultas podem ser canceladas até 24 horas antes do horário agendado sem custos adicionais.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">8.2 Política de Reembolso</h3>
                  <p className="text-gray-600">
                    Reembolsos seguem as políticas específicas de cada profissional e estão sujeitos às condições estabelecidas no momento do agendamento.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modificações dos Termos</h2>
              <p className="text-gray-600 mb-4">
                Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação na plataforma.
              </p>
              <p className="text-gray-600">
                Usuários serão notificados sobre mudanças significativas por e-mail ou através de avisos na plataforma.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Suspensão e Encerramento</h2>
              <p className="text-gray-600 mb-4">
                Podemos suspender ou encerrar contas que violem estes Termos de Uso, sem aviso prévio, especialmente em casos de:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Uso fraudulento da plataforma</li>
                <li>Violação de direitos de outros usuários</li>
                <li>Atividades que comprometam a segurança da plataforma</li>
                <li>Inadimplência persistente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Lei Aplicável e Foro</h2>
              <p className="text-gray-600">
                Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida no foro da comarca de São Paulo/SP, com renúncia expressa a qualquer outro foro.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contato</h2>
              <p className="text-gray-600 mb-4">
                Para dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="text-gray-600 space-y-2">
                  <li><strong>E-mail:</strong> legal@doutorizze.com.br</li>
                  <li><strong>Telefone:</strong> (11) 3000-0000</li>
                  <li><strong>Endereço:</strong> Av. Paulista, 1000 - São Paulo/SP - CEP: 01310-100</li>
                </ul>
              </div>
            </section>

            {/* Footer */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <p className="text-blue-800 font-medium mb-2">
                  Ao continuar usando o DOUTORIZZE, você confirma que leu e aceita estes Termos de Uso.
                </p>
                <p className="text-blue-600 text-sm">
                  Versão 1.0 - Vigente a partir de {new Date().toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}