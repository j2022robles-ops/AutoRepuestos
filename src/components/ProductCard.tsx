import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Check, ShieldCheck, Wrench, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity: number) => void;
  onViewDetails: (product: Product) => void;
  isWorkshopAffiliated?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  isWorkshopAffiliated = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const discountAmount = product.priceRetail - product.priceWorkshop;
  const discountPercent = Math.round((discountAmount / product.priceRetail) * 100);

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col h-full"
    >
      {/* Product Image Container (65-75% visual prominence) */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden flex items-center justify-center p-3">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500 p-4 text-center">
            <Wrench className="w-10 h-10 mb-2 text-amber-500/60" />
            <span className="text-xs font-semibold text-slate-300">{product.brand}</span>
            <span className="text-[11px] text-slate-400 font-mono mt-1">{product.sku}</span>
          </div>
        )}

        {/* Quick view button overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-950/80 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
          title="Ver Ficha Técnica"
          aria-label="Ver Ficha Técnica"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* OEM Badge & Warranty - Clean unboxed text with subtle separator */}
        <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
          <span>OEM: {product.oemNumber}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-amber-400">{product.warrantyMonths}m garantía</span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata: Category & Brand (Clean, unboxed typography per design constitution) */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-amber-500 uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              SKU: {product.sku}
            </span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
            {product.name}
          </h3>

          {/* Vehicle Compatibility Preview */}
          <div className="mt-2 text-[11px] text-slate-400">
            <span className="text-slate-500">Apto para: </span>
            <span className="text-slate-300">
              {product.compatibleVehicles.map(v => `${v.make} ${v.model}`).slice(0, 2).join(', ')}
              {product.compatibleVehicles.length > 2 && ` (+${product.compatibleVehicles.length - 2} más)`}
            </span>
          </div>
        </div>

        {/* Pricing & Stock Status */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold text-white font-mono tabular-nums">
                  S/ {product.priceWorkshop.toFixed(2)}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 border border-amber-800/40 px-1.5 py-0.2 rounded">
                  Precio Taller B2B
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <span className="line-through tabular-nums">S/ {product.priceRetail.toFixed(2)} público</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 font-medium">Ahorras -{discountPercent}%</span>
              </div>
            </div>

            <div className="text-right">
              <span className={`text-[11px] font-medium block ${
                product.stock <= product.minStockAlert ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {product.stock} en bodega
              </span>
              <span className="text-[10px] text-slate-400 block">Despacho 2h</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(product);
              }}
              className="py-1.5 px-2.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors text-center"
            >
              Ficha Técnica
            </button>

            <button
              onClick={handleQuickAdd}
              className={`py-1.5 px-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                addedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 active:scale-95'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Agregado!</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Al Pedido</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
