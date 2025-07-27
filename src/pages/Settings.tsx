import { useState } from 'react';
import { User, Bell, Shield, CreditCard, MapPin, Phone, Mail, Camera, Save, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/Layout';
import { useStore } from '@/store/useStore';

export default function Settings() {
  const { user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    ...(user?.type === 'clinic' ? {
      razaoSocial: user?.razaoSocial || '',
      cnpj: user?.cnpj || '',
      responsavel: user?.responsavelTecnico || '',
      especialidades: user?.especialidades || '',
      horarioFuncionamento: user?.horarioFuncionamento || ''
    } : {
      birthDate: user?.birthDate || '',
      gender: user?.gender || '',
      cpf: user?.cpf || ''
    })
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: true,
    appointmentReminders: true,
    promotionalEmails: false,
    weeklyReports: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showPhone: true,
    showEmail: false,
    allowReviews: true,
    dataSharing: false
  });

  const handleProfileSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update user in store
    if (user) {
      setUser({ ...user, ...profileData });
    }
    
    setIsSaving(false);
    setSavedMessage('Perfil atualizado com sucesso!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSavedMessage('Senha alterada com sucesso!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleNotificationSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSavedMessage('Preferências de notificação atualizadas!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'privacy', label: 'Privacidade', icon: Shield },
    { id: 'payment', label: 'Pagamento', icon: CreditCard }
  ];

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Acesso Restrito
            </h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar logado para acessar as configurações.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Fazer Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
          </div>

          {/* Success Message */}
          {savedMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-800 font-medium">{savedMessage}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
                    
                    {/* Profile Photo */}
                    <div className="flex items-center mb-8">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mr-6">
                        <User className="w-10 h-10 text-blue-600" />
                      </div>
                      <div>
                        <input
                          type="file"
                          id="photo-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 2 * 1024 * 1024) {
                                alert('Arquivo muito grande. Máximo 2MB.');
                                return;
                              }
                              // Aqui você implementaria o upload da foto
                              console.log('Foto selecionada:', file);
                              setSavedMessage('Foto atualizada com sucesso!');
                              setTimeout(() => setSavedMessage(''), 3000);
                            }
                          }}
                        />
                        <button 
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          {user?.type === 'clinic' ? 'Alterar Logo' : 'Alterar Foto'}
                        </button>
                        <p className="text-sm text-gray-500 mt-2">JPG, PNG ou GIF. Máximo 2MB.</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {user?.type === 'clinic' ? 'Nome da Clínica' : 'Nome Completo'}
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      {user?.type === 'clinic' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Razão Social
                          </label>
                          <input
                            type="text"
                            value={(profileData as any).razaoSocial || ''}
                            onChange={(e) => setProfileData({ ...profileData, razaoSocial: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {user?.type === 'clinic' ? 'CNPJ' : 'CPF'}
                        </label>
                        <input
                          type="text"
                          value={user?.type === 'clinic' ? ((profileData as any).cnpj || '') : ((profileData as any).cpf || '')}
                          onChange={(e) => setProfileData({ 
                            ...profileData, 
                            [user?.type === 'clinic' ? 'cnpj' : 'cpf']: e.target.value 
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={user?.type === 'clinic' ? '00.000.000/0000-00' : '000.000.000-00'}
                        />
                      </div>
                      
                      {user?.type === 'clinic' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Responsável
                          </label>
                          <input
                            type="text"
                            value={(profileData as any).responsavel || ''}
                            onChange={(e) => setProfileData({ ...profileData, responsavel: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nome do responsável pela clínica"
                          />
                        </div>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Data de Nascimento
                            </label>
                            <input
                              type="date"
                              value={(profileData as any).birthDate || ''}
                              onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Gênero
                            </label>
                            <select
                              value={(profileData as any).gender || ''}
                              onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Selecione</option>
                              <option value="masculino">Masculino</option>
                              <option value="feminino">Feminino</option>
                              <option value="outro">Outro</option>
                              <option value="nao-informar">Prefiro não informar</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {user?.type === 'clinic' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Especialidades
                          </label>
                          <input
                            type="text"
                            value={(profileData as any).especialidades || ''}
                            onChange={(e) => setProfileData({ ...profileData, especialidades: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Ortodontia, Implantodontia, Clínica Geral"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Horário de Funcionamento
                          </label>
                          <input
                            type="text"
                            value={(profileData as any).horarioFuncionamento || ''}
                            onChange={(e) => setProfileData({ ...profileData, horarioFuncionamento: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Seg-Sex 8h-18h, Sáb 8h-12h"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Rua, número, bairro, cidade - UF"
                      />
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleProfileSave}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isSaving ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferências de Notificação</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Canais de Comunicação</h3>
                        
                        <div className="space-y-4">
                          {[
                            { key: 'emailNotifications', label: 'Notificações por E-mail', icon: Mail },
                            { key: 'smsNotifications', label: 'Notificações por SMS', icon: Phone },
                            { key: 'whatsappNotifications', label: 'Notificações por WhatsApp', icon: Phone }
                          ].map((item) => {
                            const Icon = item.icon;
                            return (
                              <div key={item.key} className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Icon className="w-5 h-5 text-gray-400 mr-3" />
                                  <span className="text-gray-700">{item.label}</span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                    onChange={(e) => setNotificationSettings({
                                      ...notificationSettings,
                                      [item.key]: e.target.checked
                                    })}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Notificação</h3>
                        
                        <div className="space-y-4">
                          {[
                            { key: 'appointmentReminders', label: 'Lembretes de consultas' },
                            { key: 'promotionalEmails', label: 'E-mails promocionais' },
                            { key: 'weeklyReports', label: 'Relatórios semanais' }
                          ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                              <span className="text-gray-700">{item.label}</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                  onChange={(e) => setNotificationSettings({
                                    ...notificationSettings,
                                    [item.key]: e.target.checked
                                  })}
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={handleNotificationSave}
                        disabled={isSaving}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                      >
                        {isSaving ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        ) : (
                          <Save className="w-5 h-5 mr-2" />
                        )}
                        {isSaving ? 'Salvando...' : 'Salvar Preferências'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacidade e Segurança</h2>
                    
                    {/* Change Password */}
                    <div className="border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Alterar Senha</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Senha Atual
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nova Senha
                            </label>
                            <input
                              type="password"
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirmar Nova Senha
                            </label>
                            <input
                              type="password"
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isSaving ? 'Alterando...' : 'Alterar Senha'}
                        </button>
                      </div>
                    </div>
                    
                    {/* Privacy Settings */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Privacidade</h3>
                      
                      <div className="space-y-4">
                        {[
                          { key: 'showPhone', label: 'Mostrar telefone no perfil público' },
                          { key: 'showEmail', label: 'Mostrar e-mail no perfil público' },
                          { key: 'allowReviews', label: 'Permitir avaliações de outros usuários' },
                          { key: 'dataSharing', label: 'Compartilhar dados para melhorias do serviço' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <span className="text-gray-700">{item.label}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(privacySettings[item.key as keyof typeof privacySettings])}
                                onChange={(e) => setPrivacySettings({
                                  ...privacySettings,
                                  [item.key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Métodos de Pagamento</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cartões Salvos</h3>
                        <p className="text-gray-600 mb-4">Nenhum cartão salvo encontrado.</p>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                          Adicionar Cartão
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Histórico de Pagamentos</h3>
                        <p className="text-gray-600">Visualize todas as suas transações e faturas.</p>
                        <button className="mt-4 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors">
                          Ver Histórico
                        </button>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Parcelamentos Ativos</h3>
                        <p className="text-gray-600">Acompanhe seus parcelamentos em andamento.</p>
                        <button className="mt-4 border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors">
                          Ver Parcelamentos
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}