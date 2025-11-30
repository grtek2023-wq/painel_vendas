import { Wallet, ArrowRight } from 'lucide-react';

interface BalanceCardProps {
  saldo: number;
  onRecarregar: () => void;
}

export default function BalanceCard({ saldo, onRecarregar }: BalanceCardProps) {
  return (
    <div className="bg-gradient-to-r from-cyber-green to-cyber-green-dark border-2 border-cyber-green p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <Wallet size={32} className="text-cyber-black flex-shrink-0" strokeWidth={2.5} />
            <span className="text-cyber-black text-sm font-medium uppercase tracking-wider">
              Saldo Total
            </span>
          </div>
          <div className="text-cyber-black text-5xl font-bold font-mono whitespace-nowrap">
            R${saldo.toFixed(2)}
          </div>
        </div>

        <button
          onClick={onRecarregar}
          className="flex items-center gap-2 px-4 py-2 bg-cyber-black border-2 border-cyber-black hover:border-cyber-green-dark transition-none whitespace-nowrap flex-shrink-0"
        >
          <span className="text-cyber-green text-sm font-medium">Recarregar</span>
          <ArrowRight size={16} className="text-cyber-green" />
        </button>
      </div>
    </div>
  );
}
