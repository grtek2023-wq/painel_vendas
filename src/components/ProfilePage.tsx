import { User, Save, Key } from 'lucide-react';
import { useState } from 'react';

interface ProfilePageProps {
  userPin: number;
  onSave: (profileData: ProfileData) => void;
  onChangePassword: () => void;
}

export interface ProfileData {
  pin: number;
  nome: string;
  email: string;
  cpf_cnpj: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  rua: string;
  numero: string;
}

export default function ProfilePage({ userPin, onSave, onChangePassword }: ProfilePageProps) {
  const [formData, setFormData] = useState<ProfileData>({
    pin: userPin,
    nome: '',
    email: '',
    cpf_cnpj: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
  });

  const handleChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-cyber-gray-dark border-2 border-cyber-green h-full">
      <div className="p-6 border-b-2 border-cyber-green flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyber-green flex items-center justify-center">
            <User size={24} className="text-cyber-black" />
          </div>
          <span className="text-cyber-green text-lg font-bold uppercase tracking-wider">PERFIL</span>
          <span className="text-white text-sm">Gerencie suas informações pessoais</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
          <span className="text-cyber-green text-sm font-mono">ONLINE</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
              PIN de Cliente
            </label>
            <div className="relative">
              <input
                type="text"
                value={`#${formData.pin}`}
                disabled
                className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none opacity-70 cursor-not-allowed"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-2 h-2 bg-cyber-green"></div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
              CPF/CNPJ
            </label>
            <input
              type="text"
              value={formData.cpf_cnpj}
              onChange={(e) => handleChange('cpf_cnpj', e.target.value)}
              placeholder="000.000.000-00"
              className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
            />
          </div>
        </div>

        <div className="border-t-2 border-cyber-gray-light pt-6 mb-6">
          <h3 className="text-cyber-green text-sm font-bold uppercase mb-4 flex items-center gap-2">
            <div className="w-1 h-4 bg-cyber-green"></div>
            ENDEREÇO
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                CEP
              </label>
              <input
                type="text"
                value={formData.cep}
                onChange={(e) => handleChange('cep', e.target.value)}
                placeholder="00000-000"
                className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                Estado
              </label>
              <input
                type="text"
                value={formData.estado}
                onChange={(e) => handleChange('estado', e.target.value)}
                placeholder="UF"
                className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                Cidade
              </label>
              <input
                type="text"
                value={formData.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder="Digite a cidade"
                className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                Bairro
              </label>
              <input
                type="text"
                value={formData.bairro}
                onChange={(e) => handleChange('bairro', e.target.value)}
                placeholder="Digite o bairro"
                className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                Rua/Avenida
              </label>
              <input
                type="text"
                value={formData.rua}
                onChange={(e) => handleChange('rua', e.target.value)}
                placeholder="Digite a rua"
                className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-cyber-green text-xs font-bold mb-2 uppercase tracking-wider">
                Número
              </label>
              <input
                type="text"
                value={formData.numero}
                onChange={(e) => handleChange('numero', e.target.value)}
                placeholder="Nº"
                className="w-full px-4 py-3 bg-cyber-gray-medium border border-cyber-gray-light text-white font-mono focus:outline-none focus:border-cyber-green transition-none placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t-2 border-cyber-gray-light">
          <button
            type="button"
            onClick={onChangePassword}
            className="px-6 py-3 bg-cyber-gray-medium border border-cyber-green text-cyber-green font-bold text-sm uppercase tracking-wider hover:bg-cyber-green hover:text-cyber-black transition-none flex items-center gap-2"
          >
            <Key size={18} />
            Nova Senha
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-cyber-green border border-cyber-green text-cyber-black font-bold text-sm uppercase tracking-wider hover:bg-transparent hover:text-cyber-green transition-none flex items-center gap-2"
          >
            <Save size={18} />
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}
