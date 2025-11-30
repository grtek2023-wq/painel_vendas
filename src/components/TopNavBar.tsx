import { LayoutDashboard, Clock, CreditCard, HelpCircle, Globe, User, Copy, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';

interface TopNavBarProps {
  userPin: number | null;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLoginClick?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export default function TopNavBar({ userPin, currentPage, onNavigate, onLoginClick, onLogout, isAuthenticated = false }: TopNavBarProps) {
  const [copied, setCopied] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'historico', label: 'Histórico', icon: Clock },
    { id: 'recarga', label: 'Recarga', icon: CreditCard },
    { id: 'faq', label: 'Perguntas Frequentes', icon: HelpCircle },
  ];

  const handleCopyPin = () => {
    navigator.clipboard.writeText(userPin.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <nav className="bg-cyber-black border-b-2 border-cyber-green h-16 flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyber-green flex items-center justify-center">
            <span className="text-cyber-black font-bold text-xl">N</span>
          </div>
          <span className="text-cyber-green font-bold text-lg font-mono">
            Número Virtual
          </span>
        </div>

        <div className="flex items-center gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.external) {
                    window.open('https://t.me/meunumerovirtual', '_blank');
                  } else {
                    onNavigate(item.id);
                  }
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 border-2 transition-none
                  ${isActive
                    ? 'bg-cyber-green text-cyber-black border-cyber-green'
                    : 'bg-cyber-black text-cyber-green border-cyber-gray-dark hover:border-cyber-green'
                  }
                `}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated && userPin && (
          <div className="flex items-center gap-2 px-3 py-1 border-2 border-cyber-green bg-cyber-gray-dark">
            <span className="text-cyber-green text-sm font-mono">PIN:</span>
            <span className="text-white font-mono font-bold">#{userPin}</span>
            <button
              onClick={handleCopyPin}
              className="ml-1 p-1 hover:bg-cyber-green/20 transition-none"
              title="Copiar PIN"
            >
              <Copy size={16} className="text-cyber-green" />
            </button>
          </div>
        )}

        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="p-2 border-2 border-cyber-gray-dark hover:border-cyber-green bg-cyber-black transition-none"
          >
            <Globe size={20} className="text-cyber-green" />
          </button>

          {showLanguageDropdown && (
            <div className="absolute right-0 top-full mt-2 bg-cyber-gray-dark border-2 border-cyber-green min-w-[150px] z-50">
              <button className="w-full px-4 py-2 text-left text-white hover:bg-cyber-green hover:text-cyber-black transition-none flex items-center gap-2">
                <span className="text-lg">🇧🇷</span>
                <span className="text-sm">Português</span>
              </button>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`p-2 border-2 transition-none ${
                showProfileDropdown || currentPage === 'perfil'
                  ? 'border-cyber-green bg-cyber-green'
                  : 'border-cyber-gray-dark bg-cyber-black hover:border-cyber-green'
              }`}
            >
              <User size={20} className={showProfileDropdown || currentPage === 'perfil' ? 'text-cyber-black' : 'text-cyber-green'} />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 top-full mt-2 bg-cyber-gray-dark border-2 border-cyber-green min-w-[200px] z-50">
                <button
                  onClick={() => {
                    onNavigate('perfil');
                    setShowProfileDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-cyber-green hover:text-cyber-black transition-none flex items-center gap-3 border-b border-cyber-gray-light"
                >
                  <UserCircle size={18} />
                  <span className="text-sm font-medium uppercase tracking-wider">Conta</span>
                </button>
                <button
                  onClick={() => {
                    onLogout?.();
                    setShowProfileDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-white hover:bg-cyber-green hover:text-cyber-black transition-none flex items-center gap-3"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium uppercase tracking-wider">Sair</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 py-2 border-2 border-cyber-green bg-cyber-black text-cyber-green hover:bg-cyber-green hover:text-cyber-black transition-none font-bold text-sm uppercase tracking-wider"
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
}
