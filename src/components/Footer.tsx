import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Como Funciona', href: '/how-it-works' },
      { name: 'Para Clínicas', href: '/for-clinics' },
      { name: 'Para Pacientes', href: '/for-patients' },
      { name: 'Preços', href: '/pricing' }
    ],
    support: [
      { name: 'Central de Ajuda', href: '/help' },
      { name: 'Contato', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Suporte Técnico', href: '/support' }
    ],
    legal: [
      { name: 'Termos de Uso', href: '/terms' },
      { name: 'Política de Privacidade', href: '/privacy' },
      { name: 'Política de Cookies', href: '/cookies' },
      { name: 'LGPD', href: '/lgpd' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-bold">DOUTORIZZE</span>
            </Link>
            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
              Democratizando o acesso à saúde de qualidade através de parcelamento flexível e agendamento inteligente.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>contato@doutorizze.com.br</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>(11) 4210-5414</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plataforma</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-lg font-semibold mb-2">Fique por dentro das novidades</h3>
              <p className="text-gray-300 text-sm">
                Receba dicas de saúde, novidades da plataforma e ofertas especiais.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors whitespace-nowrap">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} DOUTORIZZE. Todos os direitos reservados.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Siga-nos:</span>
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="py-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            A DOUTORIZZE não é uma instituição financeira e não realiza operações de crédito diretamente. 
            Atuamos como correspondente bancário nos termos da legislação vigente. 
            Todos os serviços seguem os protocolos de segurança exigidos pela LGPD.
          </p>
        </div>
      </div>
    </footer>
  );
}