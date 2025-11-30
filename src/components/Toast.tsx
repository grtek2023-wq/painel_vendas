import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-cyber-green',
      textColor: 'text-cyber-black',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-cyber-red',
      textColor: 'text-white',
    },
    info: {
      icon: AlertCircle,
      bgColor: 'bg-cyber-blue',
      textColor: 'text-cyber-black',
    },
  };

  const Icon = config[type].icon;

  return (
    <div className={`fixed bottom-6 right-6 ${config[type].bgColor} ${config[type].textColor} border-2 border-current p-4 flex items-center gap-3 min-w-80 shadow-lg z-50`}>
      <Icon size={20} />
      <span className="flex-1 font-medium">{message}</span>
      <button onClick={onClose} className="hover:opacity-70 transition-none">
        <X size={18} />
      </button>
    </div>
  );
}
