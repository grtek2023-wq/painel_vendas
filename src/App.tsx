import { useState, useEffect } from 'react';
import TopNavBar from './components/TopNavBar';
import LeftSidebar from './components/LeftSidebar';
import ActivationsTable from './components/ActivationsTable';
import HistoryTable from './components/HistoryTable';
import Toast from './components/Toast';
import RechargeModal from './components/RechargeModal';
import ProfilePage, { ProfileData } from './components/ProfilePage';
import AuthModal from './components/AuthModal';
import { supabase } from './lib/supabase';
import { manusApi } from './lib/manus-api';
import type { ManusService, ManusCountry } from './lib/manus-types';
import type { User } from '@supabase/supabase-js';

interface Service {
  id: number;
  name: string;
  smshubCode: string;
  category: string;
  active: boolean;
  price?: number;
  quantityAvailable?: number;
}

interface Activation {
  id: string;
  user_id: string;
  service_id: number;
  manus_activation_id: number | null;
  numero: string;
  status: string;
  codigo_sms: string | null;
  sms_text: string | null;
  minutos_restantes: number;
  preco_pago: number;
  created_at: string;
  completed_at: string | null;
}

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [saldo, setSaldo] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(1);
  const [selectedOperator, setSelectedOperator] = useState('todas');
  const [services, setServices] = useState<Service[]>([]);
  const [countries, setCountries] = useState<ManusCountry[]>([]);
  const [activations, setActivations] = useState<Activation[]>([]);
  const [historyActivations, setHistoryActivations] = useState<Activation[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userPin, setUserPin] = useState<number | null>(null);
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [pollingActivations, setPollingActivations] = useState<Set<number>>(new Set());

  const isAuthenticated = !!user;

  useEffect(() => {
    checkUser();
    loadServicesAndCountries();

    const interval = setInterval(() => {
      updateRemainingMinutes();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const checkUser = async () => {
    const customerIdStr = localStorage.getItem('customerId');
    const customerEmail = localStorage.getItem('customerEmail');
    const customerPinStr = localStorage.getItem('customerPin');

    console.log('🔍 [checkUser] CustomerId from localStorage:', customerIdStr);
    console.log('🔍 [checkUser] CustomerEmail from localStorage:', customerEmail);
    console.log('🔍 [checkUser] CustomerPin from localStorage:', customerPinStr);

    if (customerIdStr && customerEmail && customerPinStr) {
      const customerId = parseInt(customerIdStr, 10);
      const customerPin = parseInt(customerPinStr, 10);

      console.log('✅ [checkUser] Parsed CustomerId:', customerId);
      console.log('✅ [checkUser] Parsed CustomerPin:', customerPin);

      setUser({ id: customerId, email: customerEmail } as any);
      setCustomerId(customerId);
      setUserPin(customerPin);

      try {
        const customer = await manusApi.getCustomerById(customerId);
        if (customer) {
          setSaldo(customer.balance / 100);
          console.log('✅ [checkUser] Customer loaded, balance:', customer.balance / 100);
        }
      } catch (error) {
        console.error('❌ [checkUser] Error loading customer:', error);
      }

      await loadActivations();
      await startPollingForActiveActivations();
    }
  };

  useEffect(() => {
    if (userPin) {
      updateBalance();
    }
  }, [userPin]);


  const startPollingForActiveActivations = async () => {
    try {
      const { data, error } = await supabase
        .from('activations')
        .select('*')
        .eq('status', 'aguardando')
        .not('manus_activation_id', 'is', null);

      if (!error && data) {
        data.forEach(activation => {
          if (activation.manus_activation_id) {
            startPolling(activation.manus_activation_id);
          }
        });
      }
    } catch (error) {
      console.error('Error starting polling:', error);
    }
  };


  const loadServicesAndCountries = async () => {
    try {
      setLoading(true);
      const [manusServices, manusCountries] = await Promise.all([
        manusApi.getServices(),
        manusApi.getCountries(),
      ]);

      const activeServices = manusServices.map(s => ({
        id: s.id,
        name: s.name,
        smshubCode: s.code,
        category: s.category,
        active: true,
      }));

      setServices(activeServices);
      setCountries(manusCountries.map(c => ({ ...c, active: true })));

      if (manusCountries.length > 0) {
        setSelectedCountry(manusCountries[0].id);
      }
    } catch (error) {
      console.error('Error loading data from Manus API:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('activations')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'aguardando')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error loading activations:', error);
    } else if (data) {
      setActivations(data);
    }
  };

  const loadHistoryActivations = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('activations')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['cancelado', 'expirado', 'concluido'])
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error loading history:', error);
    } else if (data) {
      setHistoryActivations(data);
    }
  };

  const loadFavorites = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_favorites')
      .select('service_id')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading favorites:', error);
    } else if (data) {
      setFavorites(data.map(f => f.service_id));
    }
  };

  const updateRemainingMinutes = () => {
    setActivations(prev =>
      prev.map(activation => {
        if (activation.status === 'aguardando' && activation.minutos_restantes > 0) {
          const newMinutes = activation.minutos_restantes - 1;
          if (newMinutes === 0) {
            handleExpiration(activation.id);
            return { ...activation, minutos_restantes: 0, status: 'expirado' };
          }
          return { ...activation, minutos_restantes: newMinutes };
        }
        return activation;
      })
    );
  };

  const handleExpiration = async (activationId: string) => {
    const { error } = await supabase
      .from('activations')
      .update({ status: 'expirado', minutos_restantes: 0 })
      .eq('id', activationId);

    if (error) {
      console.error('Error updating expired activation:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
  };

  const handleToggleFavorite = async (serviceId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (favorites.includes(serviceId)) {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user!.id)
        .eq('service_id', serviceId);

      if (error) {
        showToast('Erro ao remover favorito', 'error');
        console.error('Error removing favorite:', error);
      } else {
        setFavorites(prev => prev.filter(id => id !== serviceId));
        showToast('Removido dos favoritos', 'info');
      }
    } else {
      const { error } = await supabase
        .from('user_favorites')
        .insert({ user_id: user!.id, service_id: serviceId });

      if (error) {
        showToast('Erro ao adicionar favorito', 'error');
        console.error('Error adding favorite:', error);
      } else {
        setFavorites(prev => [...prev, serviceId]);
        showToast('Adicionado aos favoritos', 'success');
      }
    }
  };

  const handlePurchase = async (serviceId: number, price: number) => {
    console.log('🛒 [handlePurchase] Starting purchase...');
    console.log('🛒 [handlePurchase] ServiceId:', serviceId);
    console.log('🛒 [handlePurchase] Price:', price);
    console.log('🛒 [handlePurchase] IsAuthenticated:', isAuthenticated);
    console.log('🛒 [handlePurchase] CustomerId:', customerId);
    console.log('🛒 [handlePurchase] CustomerId type:', typeof customerId);
    console.log('🛒 [handlePurchase] Saldo:', saldo);

    if (!isAuthenticated || !customerId) {
      console.error('❌ [handlePurchase] Not authenticated or no customerId');
      setShowAuthModal(true);
      return;
    }

    if (saldo < price) {
      console.error('❌ [handlePurchase] Insufficient balance');
      showToast('Saldo insuficiente. Faça uma recarga!', 'error');
      return;
    }

    try {
      setLoading(true);

      console.log('📡 [handlePurchase] Calling API with:', {
        countryId: selectedCountry,
        serviceId: serviceId,
        customerId: customerId,
      });

      const response = await manusApi.createActivation({
        countryId: selectedCountry,
        serviceId: serviceId,
        customerId: customerId,
      });

      console.log('✅ [handlePurchase] API Response:', response);

      const { error } = await supabase
        .from('activations')
        .insert({
          user_id: user!.id,
          service_id: serviceId,
          manus_activation_id: response.activationId,
          numero: response.phoneNumber,
          status: 'aguardando',
          minutos_restantes: 10,
          preco_pago: price,
        });

      if (error) {
        showToast('Erro ao salvar ativação', 'error');
        console.error('❌ [handlePurchase] Error saving activation to Supabase:', error);
      } else {
        console.log('✅ [handlePurchase] Activation saved successfully!');
        showToast('Número adquirido com sucesso!', 'success');
        loadActivations();
        updateBalance();

        startPolling(response.activationId);
      }
    } catch (error) {
      console.error('❌ [handlePurchase] Error creating activation:', error);
      if (error instanceof Error) {
        console.error('❌ [handlePurchase] Error message:', error.message);
        console.error('❌ [handlePurchase] Error stack:', error.stack);
      }
      showToast(error instanceof Error ? error.message : 'Erro ao criar ativação', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = async () => {
    if (!userPin) return;

    try {
      const customer = await manusApi.getCustomerByPin(userPin);
      setSaldo(customer.balance / 100);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const startPolling = (manusActivationId: number) => {
    setPollingActivations(prev => new Set(prev).add(manusActivationId));
  };

  const stopPolling = (manusActivationId: number) => {
    setPollingActivations(prev => {
      const next = new Set(prev);
      next.delete(manusActivationId);
      return next;
    });
  };

  useEffect(() => {
    if (pollingActivations.size === 0) return;

    const interval = setInterval(async () => {
      for (const manusActivationId of pollingActivations) {
        try {
          const status = await manusApi.getActivationStatus(manusActivationId);

          if (status.status === 'completed' && status.smsCode) {
            const { error } = await supabase
              .from('activations')
              .update({
                codigo_sms: status.smsCode,
                sms_text: status.smsText,
                status: 'concluido',
                completed_at: status.completedAt,
              })
              .eq('manus_activation_id', manusActivationId);

            if (!error) {
              showToast('Código SMS recebido!', 'success');
              loadActivations();
              stopPolling(manusActivationId);
            }
          } else if (status.status === 'cancelled') {
            const { error } = await supabase
              .from('activations')
              .update({ status: 'cancelado' })
              .eq('manus_activation_id', manusActivationId);

            if (!error) {
              loadActivations();
              stopPolling(manusActivationId);
            }
          }
        } catch (error) {
          console.error('Error polling activation status:', error);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pollingActivations]);

  const handleCopyNumber = (numero: string) => {
    navigator.clipboard.writeText(numero);
    showToast('Número copiado!', 'success');
  };

  const handleCancelActivation = async (activationId: string) => {
    const activation = activations.find(a => a.id === activationId);
    if (!activation || !activation.manus_activation_id) return;

    try {
      setLoading(true);

      const response = await manusApi.cancelActivation(activation.manus_activation_id);

      if (response.success) {
        const { error } = await supabase
          .from('activations')
          .update({ status: 'cancelado' })
          .eq('id', activationId);

        if (error) {
          showToast('Erro ao atualizar status', 'error');
        } else {
          showToast('Ativação cancelada. Saldo reembolsado.', 'info');
          loadActivations();
          updateBalance();
          stopPolling(activation.manus_activation_id);
        }
      }
    } catch (error) {
      console.error('Error canceling activation:', error);
      showToast(error instanceof Error ? error.message : 'Erro ao cancelar ativação', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = (metodo: string, valor: number) => {
    const bonus = metodo === 'cripto' ? valor * 0.2 : 0;
    const valorTotal = valor + bonus;
    setSaldo(prev => prev + valorTotal);

    if (bonus > 0) {
      showToast(`Recarga de R$ ${valor.toFixed(2)} + R$ ${bonus.toFixed(2)} de bônus realizada!`, 'success');
    } else {
      showToast(`Recarga de R$ ${valor.toFixed(2)} realizada com sucesso!`, 'success');
    }
  };

  const handleSaveProfile = (profileData: ProfileData) => {
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  const handleChangePassword = () => {
    showToast('Funcionalidade de alteração de senha em desenvolvimento', 'info');
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);

      const customer = await manusApi.getCustomerByEmail(email);

      if (!customer || !customer.active) {
        throw new Error('Cliente não encontrado ou inativo');
      }

      localStorage.setItem('customerId', String(customer.id));
      localStorage.setItem('customerEmail', customer.email);
      localStorage.setItem('customerName', customer.name);
      localStorage.setItem('customerPin', String(customer.pin));

      console.log('✅ [handleLogin] Saved to localStorage:', {
        customerId: customer.id,
        customerEmail: customer.email,
        customerPin: customer.pin,
      });

      setCustomerId(customer.id);
      setUserPin(customer.pin);
      setSaldo(customer.balance / 100);

      console.log('✅ [handleLogin] State updated:', {
        customerId: customer.id,
        saldo: customer.balance / 100,
      });

      setShowAuthModal(false);
      showToast('Login realizado com sucesso!', 'success');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);

      const customerName = name || email.split('@')[0];
      let customer;

      try {
        customer = await manusApi.createCustomer(email, customerName);
      } catch (error: any) {
        if (error.message.includes('409') || error.message.includes('already exists')) {
          const existingCustomer = await manusApi.getCustomerByEmail(email);

          if (existingCustomer) {
            localStorage.setItem('customerId', String(existingCustomer.id));
            localStorage.setItem('customerEmail', existingCustomer.email);
            localStorage.setItem('customerName', existingCustomer.name);
            localStorage.setItem('customerPin', String(existingCustomer.pin));

            console.log('✅ [handleRegister] Existing customer, saved to localStorage:', {
              customerId: existingCustomer.id,
              customerEmail: existingCustomer.email,
            });

            setCustomerId(existingCustomer.id);
            setUserPin(existingCustomer.pin);
            setSaldo(existingCustomer.balance / 100);

            setShowAuthModal(false);
            showToast('Bem-vindo de volta! Login realizado.', 'success');
            return;
          }
        }
        throw error;
      }

      localStorage.setItem('customerId', String(customer.id));
      localStorage.setItem('customerEmail', customer.email);
      localStorage.setItem('customerName', customer.name);
      localStorage.setItem('customerPin', String(customer.pin));

      console.log('✅ [handleRegister] New customer, saved to localStorage:', {
        customerId: customer.id,
        customerEmail: customer.email,
      });

      setCustomerId(customer.id);
      setUserPin(customer.pin);
      setSaldo(customer.balance / 100);

      setShowAuthModal(false);
      showToast('Conta criada com sucesso!', 'success');
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error?.message || 'Erro desconhecido ao criar conta';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      setUserPin(null);
      setCustomerId(null);
      setSaldo(0);
      setActivations([]);
      setHistoryActivations([]);
      setFavorites([]);

      setPollingActivations(new Set());

      manusApi.clearCache();

      localStorage.clear();
      sessionStorage.clear();

      setCurrentPage('dashboard');
      setShowAuthModal(true);

      showToast('Logout realizado com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      showToast('Erro ao fazer logout', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white font-sans">
      <TopNavBar
        userPin={userPin}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLoginClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
      />

      <div className="flex h-[calc(100vh-4rem)]">
        <LeftSidebar
          saldo={saldo}
          selectedCountry={selectedCountry}
          selectedOperator={selectedOperator}
          services={services}
          countries={countries}
          favorites={favorites}
          showFavoritesOnly={showFavoritesOnly}
          searchQuery={searchQuery}
          onRecarregar={() => setShowRechargeModal(true)}
          onCountryChange={setSelectedCountry}
          onOperatorChange={setSelectedOperator}
          onToggleFavorite={handleToggleFavorite}
          onPurchase={handlePurchase}
          onToggleFavoritesFilter={() => setShowFavoritesOnly(prev => !prev)}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {currentPage === 'dashboard' && (
            <ActivationsTable
              activations={activations}
              services={services}
              onCopyNumber={handleCopyNumber}
              onCancelActivation={handleCancelActivation}
            />
          )}

          {currentPage === 'historico' && (
            <HistoryTable
              activations={historyActivations}
              services={services}
              onCopyNumber={handleCopyNumber}
            />
          )}

          {currentPage === 'recarga' && (
            <div className="bg-cyber-gray-dark border-2 border-cyber-green p-8 text-center">
              <h2 className="text-cyber-green text-2xl font-bold mb-4">Recarga</h2>
              <p className="text-cyber-gray-light">Página de recarga em desenvolvimento</p>
            </div>
          )}

          {currentPage === 'faq' && (
            <div className="bg-cyber-gray-dark border-2 border-cyber-green p-8 text-center">
              <h2 className="text-cyber-green text-2xl font-bold mb-4">Perguntas Frequentes</h2>
              <p className="text-cyber-gray-light">Página de FAQ em desenvolvimento</p>
            </div>
          )}

          {currentPage === 'perfil' && isAuthenticated && userPin && (
            <ProfilePage
              userPin={userPin}
              onSave={handleSaveProfile}
              onChangePassword={handleChangePassword}
            />
          )}
        </main>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {showRechargeModal && (
        <RechargeModal
          onClose={() => setShowRechargeModal(false)}
          onConfirm={handleRecharge}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}

export default App;
