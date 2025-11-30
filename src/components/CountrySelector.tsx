import { ChevronDown, Globe } from 'lucide-react';

interface Country {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

interface CountrySelectorProps {
  selectedCountry: number;
  countries: Country[];
  onCountryChange: (countryId: number) => void;
}

export default function CountrySelector({ selectedCountry, countries, onCountryChange }: CountrySelectorProps) {
  const activeCountries = countries.filter(c => c.active);

  return (
    <div className="mb-6">
      <label className="block text-white text-sm mb-2 flex items-center gap-2">
        <Globe size={16} className="text-cyber-green" />
        Selecione o País
      </label>
      <div className="relative">
        <select
          value={selectedCountry}
          onChange={(e) => onCountryChange(Number(e.target.value))}
          className="w-full bg-cyber-gray-dark text-white border-2 border-cyber-gray-light px-4 py-3 appearance-none cursor-pointer font-mono focus:border-cyber-green focus:outline-none transition-none"
        >
          {activeCountries.length === 0 ? (
            <option value="">Carregando países...</option>
          ) : (
            activeCountries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name} ({country.code.toUpperCase()})
              </option>
            ))
          )}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-green pointer-events-none" size={20} />
      </div>
    </div>
  );
}
