import { X, DollarSign, Smartphone, Bitcoin } from 'lucide-react';
import { useState } from 'react';

interface RechargeModalProps {
  onClose: () => void;
  onConfirm: (metodo: string, valor: number) => void;
}

export default function RechargeModal({ onClose, onConfirm }: RechargeModalProps) {
  const [metodoSelecionado, setMetodoSelecionado] = useState<string>('pix');
  const [valorCustom, setValorCustom] = useState<string>('');
  const [valorSelecionado, setValorSelecionado] = useState<number | null>(null);

  const metodos = [
    {
      id: 'pix',
      nome: 'PIX',
      icon: DollarSign,
      descricao: 'Sem bônus',
      bgColor: 'bg-cyber-green',
      borderColor: 'border-cyber-green',
      textColor: 'text-cyber-black',
    },
    {
      id: 'picpay',
      nome: 'Picpay',
      icon: Smartphone,
      descricao: 'Sem bônus',
      bgColor: 'bg-cyber-green',
      borderColor: 'border-cyber-green',
      textColor: 'text-cyber-black',
    },
    {
      id: 'cripto',
      nome: 'Criptomoeda',
      icon: Bitcoin,
      descricao: 'Ganhe 20% de bônus',
      bgColor: 'bg-cyber-green',
      borderColor: 'border-cyber-green',
      textColor: 'text-cyber-black',
    },
  ];

  const valoresSugeridos = [20, 30, 50, 100];

  const handleProsseguir = () => {
    const valorFinal = valorSelecionado || parseFloat(valorCustom.replace(',', '.'));
    if (valorFinal && valorFinal > 0) {
      onConfirm(metodoSelecionado, valorFinal);
      onClose();
    }
  };

  const handleValorSugerido = (valor: number) => {
    setValorSelecionado(valor);
    setValorCustom('');
  };

  const formatarValor = (valor: string): string => {
    const apenasNumeros = valor.replace(/\D/g, '');

    if (apenasNumeros === '') return '';

    const numeroInteiro = parseInt(apenasNumeros, 10);
    const valorDecimal = (numeroInteiro / 100).toFixed(2);

    return valorDecimal.replace('.', ',');
  };

  const handleValorCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorFormatado = formatarValor(e.target.value);
    setValorCustom(valorFormatado);
    setValorSelecionado(null);
  };

  const metodoAtual = metodos.find(m => m.id === metodoSelecionado);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-cyber-gray-dark border-4 border-cyber-green max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b-2 border-cyber-green flex items-center justify-between">
          <h2 className="text-cyber-green text-2xl font-bold font-mono">RECARREGAR</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-cyber-gray-light transition-none"
          >
            <X size={24} className="text-cyber-green" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {metodos.map((metodo) => {
              const Icon = metodo.icon;
              const isSelected = metodoSelecionado === metodo.id;

              return (
                <button
                  key={metodo.id}
                  onClick={() => setMetodoSelecionado(metodo.id)}
                  className={`
                    p-6 border-4 transition-none text-left
                    ${isSelected
                      ? `${metodo.bgColor} ${metodo.borderColor} ${metodo.textColor}`
                      : 'bg-cyber-gray-medium border-cyber-gray-light text-white hover:border-cyber-green'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 border-2 flex items-center justify-center ${isSelected ? 'border-cyber-black bg-cyber-black' : 'border-current'}`}>
                      <Icon size={24} className={isSelected ? 'text-cyber-green' : 'text-current'} />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{metodo.nome}</div>
                      <div className={`text-sm ${isSelected ? 'opacity-80' : 'text-white'}`}>
                        {metodo.descricao}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm mb-3 uppercase tracking-wider">
              Selecione o valor
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {valoresSugeridos.map((valor) => (
                <button
                  key={valor}
                  onClick={() => handleValorSugerido(valor)}
                  className={`
                    py-3 px-6 border-2 font-bold font-mono text-lg transition-none
                    ${valorSelecionado === valor
                      ? `${metodoAtual?.bgColor} ${metodoAtual?.borderColor} ${metodoAtual?.textColor}`
                      : 'bg-cyber-gray-medium border-cyber-gray-light text-white hover:border-cyber-green'
                    }
                  `}
                >
                  R${valor}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Digite o valor"
              value={valorCustom}
              onChange={handleValorCustomChange}
              className={`
                w-full px-4 py-3 border-2 font-mono text-lg
                focus:outline-none transition-none
                ${valorCustom
                  ? `${metodoAtual?.bgColor} ${metodoAtual?.borderColor} ${metodoAtual?.textColor} placeholder-opacity-50`
                  : 'bg-cyber-gray-medium border-cyber-gray-light text-white placeholder-cyber-gray-light focus:border-cyber-green'
                }
              `}
            />
          </div>

          <button
            onClick={handleProsseguir}
            disabled={!valorSelecionado && !valorCustom}
            className={`
              w-full py-4 border-2 text-lg font-bold transition-none
              ${valorSelecionado || valorCustom
                ? `${metodoAtual?.bgColor} ${metodoAtual?.borderColor} ${metodoAtual?.textColor} hover:opacity-90`
                : 'bg-cyber-gray-medium border-cyber-gray-light text-cyber-gray-light cursor-not-allowed'
              }
            `}
          >
            Prosseguir
          </button>
        </div>
      </div>
    </div>
  );
}
