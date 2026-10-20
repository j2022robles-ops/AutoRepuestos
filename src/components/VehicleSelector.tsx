import React, { useState } from 'react';
import { Search, Car, RotateCcw, CheckCircle2 } from 'lucide-react';

interface VehicleSelectorProps {
  onFilterChange: (filters: { make: string; model: string; year: string; query: string }) => void;
  activeFilterCount: number;
  onClearFilters: () => void;
}

const POPULAR_MAKES = ['Toyota', 'Nissan', 'Ford', 'Volkswagen', 'Chevrolet', 'Hyundai', 'Honda', 'Mazda'];

const MODELS_BY_MAKE: Record<string, string[]> = {
  Toyota: ['Hilux', 'Corolla', 'RAV4', 'Fortuner', 'Yaris', 'Land Cruiser Prado'],
  Nissan: ['Frontier / NP300', 'Versa / Tiida', 'Navara', 'Sentra', 'Kicks'],
  Ford: ['Ranger', 'F-150', 'Explorer', 'EcoSport'],
  Volkswagen: ['Gol / Saveiro', 'Vento', 'Amarok', 'Tiguan'],
  Chevrolet: ['Onix / Prisma', 'D-Max', 'Tracker', 'Sail'],
  Hyundai: ['Elantra', 'Accent', 'Tucson', 'Santa Fe'],
  Honda: ['CR-V', 'Civic', 'HR-V'],
  Mazda: ['CX-5', 'Mazda 3', 'BT-50']
};

const YEARS = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012'];

export const VehicleSelector: React.FC<VehicleSelectorProps> = ({
  onFilterChange,
  activeFilterCount,
  onClearFilters
}) => {
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleMakeChange = (make: string) => {
    setSelectedMake(make);
    setSelectedModel('');
    onFilterChange({ make, model: '', year: selectedYear, query: searchQuery });
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    onFilterChange({ make: selectedMake, model, year: selectedYear, query: searchQuery });
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    onFilterChange({ make: selectedMake, model: selectedModel, year, query: searchQuery });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onFilterChange({ make: selectedMake, model: selectedModel, year: selectedYear, query });
  };

  const handleReset = () => {
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSearchQuery('');
    onClearFilters();
  };

  const availableModels = selectedMake ? MODELS_BY_MAKE[selectedMake] || [] : [];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white tracking-tight">
              Buscador Especializado para Taller por Vehículo o Código OEM
            </h2>
            <p className="text-xs text-slate-400">
              Garantiza 100% de compatibilidad antes de desmontar la pieza en tu elevador.
            </p>
          </div>
        </div>

        {/* Search input for quick SKU or OEM */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={handleQueryChange}
            placeholder="Buscar por OEM, SKU o repuesto..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Selectors grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
        {/* Make selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Marca del Vehículo
          </label>
          <select
            value={selectedMake}
            onChange={(e) => handleMakeChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">Todas las marcas</option>
            {POPULAR_MAKES.map((make) => (
              <option key={make} value={make}>{make}</option>
            ))}
          </select>
        </div>

        {/* Model selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Modelo
          </label>
          <select
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            disabled={!selectedMake}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">{selectedMake ? 'Seleccionar modelo' : 'Primero elige marca'}</option>
            {availableModels.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {/* Year selector */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Año de Fabricación
          </label>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
          >
            <option value="">Todos los años</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium py-2 px-3 rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar Filtros ({activeFilterCount})</span>
            </button>
          )}

          {activeFilterCount === 0 && (
            <div className="w-full text-xs text-slate-400 py-2 px-3 bg-slate-950/60 border border-slate-800 rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Garantía de calce directo</span>
            </div>
          )}
        </div>
      </div>

      {/* Applied filter banner if active */}
      {(selectedMake || selectedModel || selectedYear || searchQuery) && (
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">Filtrando por:</span>
            {selectedMake && <span>{selectedMake}</span>}
            {selectedModel && <span>/ {selectedModel}</span>}
            {selectedYear && <span>/ {selectedYear}</span>}
            {searchQuery && <span>/ "{searchQuery}"</span>}
          </div>
          <span className="text-slate-400">Stock listo para despacho inmediato</span>
        </div>
      )}
    </div>
  );
};
