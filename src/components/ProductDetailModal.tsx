import React, { useState } from 'react';
import { Product } from '../types';
import { X, Check, ShieldCheck, Wrench, Truck, Plus, Minus, FileText, PhoneCall, HelpCircle } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'vehicles' | 'workshop_tier'>('specs');
  const [downloadNotice, setDownloadNotice] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  const getTierPrice = (qty: number) => {
    if (qty >= 6) return product.priceWorkshop * 0.90; // extra 10%
    if (qty >= 3) return product.priceWorkshop * 0.95; // extra 5%
    return product.priceWorkshop;
  };

  const currentUnitPrice = getTierPrice(quantity);
  const totalPrice = currentUnitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 900);
  };

  const handleDownloadSheet = () => {
    setDownloadNotice(true);
    setTimeout(() => setDownloadNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
              Ficha Técnica Homologada
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 font-mono">OEM: {product.oemNumber}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal content body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Left Column: Image & Quick Badges */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-4/3 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-2">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-sm border border-slate-800 px-3 py-1 rounded text-xs font-mono text-slate-300">
                Fabricante: {product.brand}
              </div>
            </div>

            {/* Trust highlights for mechanical workshop */}
            <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2.5 text-slate-300">
                <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Despacho a taller en 120 minutos para Lima y zona metropolitana.</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{product.warrantyMonths} meses de garantía directa contra fallas de fabricación.</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Calce 100% asegurado según código de catálogo original.</span>
              </div>
            </div>

            {/* Download spec sheet / technical query */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadSheet}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{downloadNotice ? 'Generando PDF...' : 'Descargar Ficha PDF'}</span>
              </button>

              <a
                href="https://wa.me/51984551290?text=Hola,%20solicito%20asesoría%20técnica%20para%20el%20repuesto%20"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Asesor WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Title, Prices, Tabs & Purchase Module */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <span className="font-semibold text-amber-400 uppercase tracking-wider">{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">SKU: {product.sku}</span>
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {product.name}
              </h2>

              {/* Price comparison */}
              <div className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Precio Exclusivo Taller B2B:</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">
                        S/ {currentUnitPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 line-through tabular-nums">
                        S/ {product.priceRetail.toFixed(2)} público
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      Ahorro: S/ {(product.priceRetail - currentUnitPrice).toFixed(2)} / ud
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Stock: <strong className="text-white">{product.stock} disponibles</strong>
                    </span>
                  </div>
                </div>

                {/* Bulk tier badge */}
                {quantity >= 3 && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Descuento por volumen aplicado ({quantity >= 6 ? '10%' : '5%'} adicional)</span>
                  </div>
                )}
              </div>

              {/* Nav Tabs for specs, vehicles and tiers */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg mt-4 border border-slate-800">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'specs'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Especificaciones
                </button>
                <button
                  onClick={() => setActiveTab('vehicles')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'vehicles'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Compatibilidad ({product.compatibleVehicles.length})
                </button>
                <button
                  onClick={() => setActiveTab('workshop_tier')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'workshop_tier'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Escala de Precios
                </button>
              </div>

              {/* Tab 1: Specifications */}
              {activeTab === 'specs' && (
                <div className="mt-3 bg-slate-950/60 border border-slate-800/70 rounded-xl p-3 text-xs max-h-48 overflow-y-auto">
                  <dl className="divide-y divide-slate-800">
                    {Object.entries(product.specifications).map(([key, val]) => (
                      <div key={key} className="py-2 flex justify-between gap-4">
                        <dt className="text-slate-400 font-medium">{key}:</dt>
                        <dd className="text-slate-200 font-mono text-right">{val}</dd>
                      </div>
                    ))}
                    <div className="py-2 flex justify-between gap-4">
                      <dt className="text-slate-400 font-medium">Número OEM Original:</dt>
                      <dd className="text-amber-400 font-mono text-right font-semibold">{product.oemNumber}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {/* Tab 2: Vehicle Compatibility */}
              {activeTab === 'vehicles' && (
                <div className="mt-3 bg-slate-950/60 border border-slate-800/70 rounded-xl p-3 text-xs max-h-48 overflow-y-auto space-y-2">
                  {product.compatibleVehicles.map((v, i) => (
                    <div key={i} className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-white">{v.make} {v.model}</span>
                        <div className="text-[11px] text-slate-400">
                          {v.engine ? `Motor: ${v.engine}` : 'Todas las versiones'}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {v.years}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Workshop Tier Pricing */}
              {activeTab === 'workshop_tier' && (
                <div className="mt-3 bg-slate-950/60 border border-slate-800/70 rounded-xl p-3 text-xs space-y-2">
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-white">1 a 2 Unidades</span>
                      <p className="text-[11px] text-slate-400">Tarifa base para talleres registrados</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-slate-200 tabular-nums">
                      S/ {product.priceWorkshop.toFixed(2)} / ud
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-amber-400">3 a 5 Unidades (Volumen Taller)</span>
                      <p className="text-[11px] text-slate-400">5% de descuento por lote</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-amber-400 tabular-nums">
                      S/ {(product.priceWorkshop * 0.95).toFixed(2)} / ud
                    </span>
                  </div>

                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-emerald-400">6+ Unidades (Stock de Mantenimiento)</span>
                      <p className="text-[11px] text-slate-400">10% de descuento mayorista</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                      S/ {(product.priceWorkshop * 0.90).toFixed(2)} / ud
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Contiguous Purchase Module */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-xs text-slate-300 font-medium">Cantidad para taller:</span>
                <div className="flex items-center border border-slate-700 rounded-lg bg-slate-950 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-30"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-mono font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1 hover:bg-slate-800 rounded text-slate-300 disabled:opacity-30"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right flex-1">
                  <span className="text-xs text-slate-400">Total calculado:</span>
                  <div className="text-xl font-mono font-extrabold text-white tabular-nums">
                    S/ {totalPrice.toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-[0.99]'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>¡Agregado al Pedido del Taller!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Agregar al Pedido de Repuestos (S/ {totalPrice.toFixed(2)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
