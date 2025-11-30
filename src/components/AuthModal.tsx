import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name?: string) => Promise<void>;
}

export default function AuthModal({ onClose, onLogin, onRegister }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        if (mode === 'register' && !name.trim()) {
          setError('Por favor, informe seu nome');
          return;
        }
        await onRegister(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-gray-dark border-2 border-cyber-green w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 hover:bg-cyber-green/20 transition-none"
        >
          <X size={24} className="text-cyber-green" />
        </button>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-cyber-green flex items-center justify-center">
              <User size={24} className="text-cyber-black" />
            </div>
            <h2 className="text-cyber-green text-2xl font-bold uppercase tracking-wider">
              {mode === 'login' ? 'Login' : 'Criar Conta'}
            </h2>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 border-2 font-bold text-sm uppercase tracking-wider transition-none ${
                mode === 'login'
                  ? 'bg-cyber-green text-cyber-black border-cyber-green'
                  : 'bg-cyber-gray-medium text-cyber-green border-cyber-gray-light hover:border-cyber-green'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 border-2 font-bold text-sm uppercase tracking-wider transition-none ${
                mode === 'register'
                  ? 'bg-cyber-green text-cyber-black border-cyber-green'
                  : 'bg-cyber-gray-medium text-cyber-green border-cyber-gray-light hover:border-cyber-green'
              }`}
            >
              Registrar
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                  Nome
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full px-4 py-3 pl-10 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
                    required
                  />
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-green" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 pl-10 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
                  required
                />
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-green" />
              </div>
            </div>

            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full px-4 py-3 pl-10 pr-10 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
                  required
                  minLength={6}
                />
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-green" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-cyber-green/20 transition-none"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-cyber-green" />
                  ) : (
                    <Eye size={18} className="text-cyber-green" />
                  )}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-cyber-gray-light text-xs mt-1">Mínimo de 6 caracteres</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyber-green border-2 border-cyber-green text-cyber-black font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-cyber-green transition-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <button className="text-cyber-green text-sm hover:underline">
                Esqueceu sua senha?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
