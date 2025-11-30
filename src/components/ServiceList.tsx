import { useState, useEffect } from 'react';
import { Star, Search, Package, AlertCircle } from 'lucide-react';
import { manusApi } from '../lib/manus-api';

interface Service {
  id: number;
  name: string;
  smshubCode: string;
  category: string;
  active: boolean;
  price?: number;
  quantityAvailable?: number;
}

interface ServiceListProps {
  services: Service[];
  favorites: number[];
  onToggleFavorite: (serviceId: number) => void;
  onPurchase: (serviceId: number, price: number) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCountry: number;
}

export default function ServiceList({
  services,
  favorites,
  onToggleFavorite,
  onPurchase,
  showFavoritesOnly,
  onToggleFavoritesFilter,
  searchQuery,
  onSearchChange,
  selectedCountry,
}: ServiceListProps) {
  const [servicePrices, setServicePrices] = useState<Map<number, { price: number; quantity: number }>>(new Map());
  const [loadingPrices, setLoadingPrices] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadPricesForServices();
  }, [services, selectedCountry]);

  const loadPricesForServices = async () => {
    const priceMap = new Map<number, { price: number; quantity: number }>();

    for (const service of services) {
      setLoadingPrices(prev => new Set(prev).add(service.id));
      try {
        const priceData = await manusApi.getPrice(selectedCountry, service.id);
        if (priceData) {
          priceMap.set(service.id, {
            price: priceData.price / 100,
            quantity: priceData.available,
          });
        }
      } catch (error) {
        console.error(`Error loading price for service ${service.id}:`, error);
      } finally {
        setLoadingPrices(prev => {
          const next = new Set(prev);
          next.delete(service.id);
          return next;
        });
      }
    }

    setServicePrices(priceMap);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFavorites = !showFavoritesOnly || favorites.includes(service.id);
    return matchesSearch && matchesFavorites;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="text-white text-sm">Selecione o serviço</label>

        <label className="flex items-center gap-2 cursor-pointer text-sm text-cyber-blue hover:text-white transition-none">
          <input
            type="checkbox"
            checked={showFavoritesOnly}
            onChange={onToggleFavoritesFilter}
            className="w-4 h-4 accent-cyber-green"
          />
          <span>Exibir favoritos</span>
        </label>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-green" size={18} />
        <input
          type="text"
          placeholder="Pesquisar serviços"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-cyber-gray-dark text-white border-2 border-cyber-gray-light pl-10 pr-4 py-2 focus:border-cyber-green focus:outline-none transition-none"
        />
      </div>

      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {filteredServices.map((service) => {
          const isFavorite = favorites.includes(service.id);
          const firstLetter = service.name.charAt(0).toUpperCase();
          const priceInfo = servicePrices.get(service.id);
          const isLoading = loadingPrices.has(service.id);
          const isOutOfStock = priceInfo && priceInfo.quantity === 0;
          const isLowStock = priceInfo && priceInfo.quantity > 0 && priceInfo.quantity < 10;

          return (
            <div key={service.id} className="border-2 border-cyber-gray-light bg-cyber-gray-dark">
              <div className="flex items-center gap-3 p-3">
                <button
                  onClick={() => onToggleFavorite(service.id)}
                  className="transition-none"
                >
                  <Star
                    size={20}
                    className={isFavorite ? 'text-cyber-green fill-cyber-green' : 'text-cyber-green'}
                  />
                </button>

                <div className="w-10 h-10 bg-cyber-green flex items-center justify-center flex-shrink-0">
                  <span className="text-cyber-black text-xl font-bold">{firstLetter}</span>
                </div>

                <div className="flex-1">
                  <div className="text-white">{service.name}</div>
                  {service.category && (
                    <div className="text-xs text-cyber-gray-light">{service.category}</div>
                  )}
                </div>

                {isLoading ? (
                  <div className="text-cyber-gray-light text-sm px-4">Carregando...</div>
                ) : isOutOfStock ? (
                  <div className="flex items-center gap-2 text-red-500 text-sm px-4">
                    <AlertCircle size={16} />
                    <span>Esgotado</span>
                  </div>
                ) : (
                  <>
                    {isLowStock && (
                      <div className="flex items-center gap-1 text-yellow-500 text-xs px-2">
                        <Package size={14} />
                        <span>{priceInfo.quantity}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-cyber-green font-mono font-bold">
                        R$ {priceInfo?.price.toFixed(2) || '-.--'}
                      </span>
                      <button
                        onClick={() => priceInfo && onPurchase(service.id, priceInfo.price)}
                        disabled={isOutOfStock || !priceInfo}
                        className="px-4 py-2 bg-cyber-green text-cyber-black text-sm font-medium hover:bg-cyber-green-dark transition-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Comprar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filteredServices.length === 0 && (
          <div className="text-center text-cyber-gray-light py-8">
            Nenhum serviço encontrado
          </div>
        )}
      </div>
    </div>
  );
}
