import { ChevronDown } from 'lucide-react';

interface OperatorSelectorProps {
  selectedOperator: string;
  onOperatorChange: (operator: string) => void;
}

export default function OperatorSelector({ selectedOperator, onOperatorChange }: OperatorSelectorProps) {
  const operators = [
    { id: 'todas', label: 'Aleatória' },
    { id: 'oi', label: 'OI' },
    { id: 'surf', label: 'SURF' },
    { id: 'vivo', label: 'VIVO' },
    { id: 'claro', label: 'CLARO' },
  ];

  return (
    <div className="mb-6">
      <label className="block text-white text-sm mb-2">Selecionar Operadora</label>
      <div className="relative">
        <select
          value={selectedOperator}
          onChange={(e) => onOperatorChange(e.target.value)}
          className="w-full bg-cyber-gray-dark text-white border-2 border-cyber-gray-light px-4 py-3 appearance-none cursor-pointer font-mono focus:border-cyber-green focus:outline-none transition-none"
        >
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-green pointer-events-none" size={20} />
      </div>
    </div>
  );
}
