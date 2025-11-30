import BalanceCard from './BalanceCard';
import CountrySelector from './CountrySelector';
import OperatorSelector from './OperatorSelector';
import ServiceList from './ServiceList';

interface Service {
  id: number;
  name: string;
  smshubCode: string;
  category: string;
  active: boolean;
  price?: number;
  quantityAvailable?: number;
}

interface Country {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

interface LeftSidebarProps {
  saldo: number;
  selectedCountry: number;
  selectedOperator: string;
  services: Service[];
  countries: Country[];
  favorites: number[];
  showFavoritesOnly: boolean;
  searchQuery: string;
  onRecarregar: () => void;
  onCountryChange: (countryId: number) => void;
  onOperatorChange: (operator: string) => void;
  onToggleFavorite: (serviceId: number) => void;
  onPurchase: (serviceId: number, price: number) => void;
  onToggleFavoritesFilter: () => void;
  onSearchChange: (query: string) => void;
}

export default function LeftSidebar({
  saldo,
  selectedCountry,
  selectedOperator,
  services,
  countries,
  favorites,
  showFavoritesOnly,
  searchQuery,
  onRecarregar,
  onCountryChange,
  onOperatorChange,
  onToggleFavorite,
  onPurchase,
  onToggleFavoritesFilter,
  onSearchChange,
}: LeftSidebarProps) {
  return (
    <div className="w-96 bg-cyber-gray-dark border-r-2 border-cyber-green p-6 overflow-y-auto">
      <div className="mb-6">
        <BalanceCard saldo={saldo} onRecarregar={onRecarregar} />
      </div>

      <CountrySelector
        selectedCountry={selectedCountry}
        countries={countries}
        onCountryChange={onCountryChange}
      />

      <OperatorSelector
        selectedOperator={selectedOperator}
        onOperatorChange={onOperatorChange}
      />

      <ServiceList
        services={services}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        onPurchase={onPurchase}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavoritesFilter={onToggleFavoritesFilter}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCountry={selectedCountry}
      />
    </div>
  );
}
