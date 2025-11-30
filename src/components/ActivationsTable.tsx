import { Copy, X, ChevronDown, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface Activation {
  id: string;
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

interface Service {
  id: number;
  name: string;
  smshubCode?: string;
  category?: string;
}

interface ActivationsTableProps {
  activations: Activation[];
  services: Service[];
  onCopyNumber: (numero: string) => void;
  onCancelActivation: (activationId: string) => void;
  isHistory?: boolean;
}

export default function ActivationsTable({
  activations,
  services,
  onCopyNumber,
  onCancelActivation,
  isHistory = false,
}: ActivationsTableProps) {
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(new Set());

  const getServiceById = (serviceId: number) => {
    return services.find(s => s.id === serviceId);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'aguardando':
        return {
          label: 'Aguardando',
          bgColor: 'bg-cyber-orange',
          textColor: 'text-cyber-black',
        };
      case 'concluido':
        return {
          label: 'Concluído',
          bgColor: 'bg-cyber-green',
          textColor: 'text-cyber-black',
        };
      case 'cancelado':
        return {
          label: 'Cancelado',
          bgColor: 'bg-cyber-red',
          textColor: 'text-white',
        };
      case 'expirado':
        return {
          label: 'Expirado',
          bgColor: 'bg-cyber-gray-light',
          textColor: 'text-white',
        };
      default:
        return {
          label: status,
          bgColor: 'bg-cyber-gray-light',
          textColor: 'text-white',
        };
    }
  };

  const toggleCodeExpansion = (activationId: string) => {
    const newExpanded = new Set(expandedCodes);
    if (newExpanded.has(activationId)) {
      newExpanded.delete(activationId);
    } else {
      newExpanded.add(activationId);
    }
    setExpandedCodes(newExpanded);
  };

  return (
    <div className="bg-cyber-gray-dark border-2 border-cyber-green">
      <div className="p-4 border-b-2 border-cyber-green flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse"></div>
          <span className="text-cyber-green text-lg font-bold">
            {isHistory ? 'Histórico de Ativações' : 'Ativações em andamento'}
          </span>
        </div>
        <span className="text-white text-sm">
          Mostrando 1-10 de {activations.length} entradas
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-cyber-gray-light">
              <th className="text-left p-4 text-cyber-green text-sm font-medium uppercase">Serviço</th>
              <th className="text-left p-4 text-cyber-green text-sm font-medium uppercase">Número</th>
              <th className="text-left p-4 text-cyber-green text-sm font-medium uppercase">Status</th>
              <th className="text-left p-4 text-cyber-green text-sm font-medium uppercase">Código SMS</th>
              <th className="text-left p-4 text-cyber-green text-sm font-medium uppercase">Rest</th>
              <th className="text-left p-4 text-cyber-green text-sm font-medium uppercase">Status</th>
              <th className="text-left p-4 text-cyber-green text-sm font-medium uppercase">Ação</th>
            </tr>
          </thead>
          <tbody>
            {activations.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-white">
                  Nenhuma ativação em andamento
                </td>
              </tr>
            ) : (
              activations.map((activation) => {
                const service = getServiceById(activation.service_id);
                const statusConfig = getStatusConfig(activation.status);
                const isCodeExpanded = expandedCodes.has(activation.id);

                return (
                  <tr key={activation.id} className="border-b border-cyber-gray-light hover:bg-cyber-gray-medium transition-none">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">{service?.name || 'Serviço desconhecido'}</span>
                        {service?.category && (
                          <span className="text-xs text-cyber-gray-light">({service.category})</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-mono text-sm">{activation.numero}</span>
                        <button
                          onClick={() => onCopyNumber(activation.numero)}
                          className="p-1 hover:bg-cyber-gray-light transition-none"
                        >
                          <Copy size={14} className="text-cyber-green" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-cyber-green text-sm">
                        Envie o código SMS para o número recebido
                      </span>
                    </td>
                    <td className="p-4">
                      {activation.codigo_sms ? (
                        <button
                          onClick={() => toggleCodeExpansion(activation.id)}
                          className="flex items-center gap-1 text-cyber-blue text-sm font-mono hover:text-cyber-green transition-none"
                        >
                          <span>{isCodeExpanded ? activation.codigo_sms : activation.codigo_sms.substring(0, 3) + '...'}</span>
                          <ChevronDown size={14} className={isCodeExpanded ? 'rotate-180' : ''} />
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 text-cyber-orange">
                          <Loader2 size={14} className="animate-spin" />
                          <span className="text-sm">Aguardando</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-white font-mono text-sm">{activation.minutos_restantes} min</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="p-4">
                      {!isHistory && (
                        <button
                          onClick={() => onCancelActivation(activation.id)}
                          disabled={activation.status !== 'aguardando'}
                          className="flex items-center gap-1 px-3 py-1 bg-cyber-red border-2 border-cyber-red text-white text-sm font-medium hover:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-none"
                        >
                          <X size={14} />
                          <span>Cancelar</span>
                        </button>
                      )}
                      {isHistory && <span className="text-white text-sm">-</span>}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t-2 border-cyber-gray-light flex items-center justify-between">
        <span className="text-white text-sm">
          Mostrando 1-10 de {activations.length} entradas
        </span>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border-2 border-cyber-gray-light text-white hover:border-cyber-green hover:text-cyber-green transition-none">
            Anterior
          </button>
          <button className="px-3 py-1 bg-cyber-green text-cyber-black font-medium">1</button>
          <button className="px-3 py-1 border-2 border-cyber-gray-light text-white hover:border-cyber-green transition-none">2</button>
          <button className="px-3 py-1 border-2 border-cyber-gray-light text-white hover:border-cyber-green transition-none">3</button>
          <button className="px-3 py-1 border-2 border-cyber-gray-light text-white hover:border-cyber-green transition-none">4</button>
          <span className="text-white">...</span>
          <button className="px-3 py-1 border-2 border-cyber-gray-light text-white hover:border-cyber-green transition-none">16</button>
          <button className="px-3 py-1 border-2 border-cyber-gray-light text-white hover:border-cyber-green hover:text-cyber-green transition-none">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
