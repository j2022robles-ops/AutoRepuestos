import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, Truck, ShieldCheck, ArrowRight, Building2, CreditCard, Banknote, Clock } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: (orderData: {
    workshopName: string;
    workshopTaxId: string;
    contactPhone: string;
    shippingAddress: string;
    deliveryMethod: 'express_taller' | 'sucursal' | 'estandar';
    paymentMethod: 'credito_taller' | 'transferencia' | 'tarjeta' | 'contra_entrega';
  }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout
}) => {
  if (!isOpen) return null;

  const [workshopName, setWorkshopName] = useState('Taller Mecánico El Pistón de Oro');
  const [workshopTaxId, setWorkshopTaxId] = useState('RUC 20549811234');
  const [contactPhone, setContactPhone] = useState('+51 984 551 290');
  const [shippingAddress, setShippingAddress] = useState('Av. Los Mecánicos 420, Taller Principal');
  const [deliveryMethod, setDeliveryMethod] = useState<'express_taller' | 'sucursal' | 'estandar'>('express_taller');
  const [paymentMethod, setPaymentMethod] = useState<'credito_taller' | 'transferencia' | 'tarjeta' | 'contra_entrega'>('credito_taller');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.product.priceWorkshop * item.quantity, 0);
  const retailTotal = items.reduce((acc, item) => acc + item.product.priceRetail * item.quantity, 0);
  const workshopSavings = Math.max(0, retailTotal - subtotal);
  const shippingCost = deliveryMethod === 'express_taller' ? (subtotal > 350 ? 0 : 25.00) : 0;
  const tax = subtotal * 0.18; // 18% standard IGV / VAT en Perú
  const total = subtotal + tax + shippingCost;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onCheckout({
        workshopName,
        workshopTaxId,
        contactPhone,
        shippingAddress,
        deliveryMethod,
        paymentMethod
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Pedido de Repuestos para Taller
              </h2>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                {items.reduce((acc, i) => acc + i.quantity, 0)} piezas
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {items.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Truck className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-200">Tu pedido está vacío</p>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Selecciona repuestos por vehículo o código OEM para solicitar despacho urgente a tu taller mecánico en Lima y provincias.
                </p>
              </div>
            ) : (
              <>
                {/* Workshop Savings Callout */}
                {workshopSavings > 0 && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Tarifa B2B Taller aplicada: Estás ahorrando</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-300 text-sm tabular-nums">
                      S/ {workshopSavings.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Items List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[11px] font-mono text-amber-500 uppercase">
                            {item.product.brand} · OEM: {item.product.oemNumber}
                          </span>
                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            title="Eliminar repuesto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-700 rounded bg-slate-900">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, -1)}
                              className="px-2 py-0.5 text-slate-300 hover:bg-slate-800"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-mono text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, 1)}
                              className="px-2 py-0.5 text-slate-300 hover:bg-slate-800"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right font-mono">
                            <span className="text-xs font-bold text-white tabular-nums">
                              S/ {(item.product.priceWorkshop * item.quantity).toFixed(2)}
                            </span>
                            <span className="text-[10px] text-slate-400 block tabular-nums">
                              (S/ {item.product.priceWorkshop.toFixed(2)} c/u)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Workshop Invoice & Delivery Form */}
                <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4 pt-4 border-t border-slate-800 text-xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Datos de Facturación del Taller (B2B Sunat)</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Nombre Comercial Taller</label>
                      <input
                        type="text"
                        required
                        value={workshopName}
                        onChange={(e) => setWorkshopName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">RUC de Facturación</label>
                      <input
                        type="text"
                        required
                        value={workshopTaxId}
                        onChange={(e) => setWorkshopTaxId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Teléfono Móvil / WhatsApp Taller</label>
                      <input
                        type="text"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Dirección de Despacho (Taller)</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Delivery Selection */}
                  <div className="pt-2">
                    <label className="block text-slate-400 mb-1.5 font-medium">Método de Entrega</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('express_taller')}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          deliveryMethod === 'express_taller'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>Express a Taller (2h)</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {subtotal > 350 ? 'Gratis para taller' : 'S/ 25.00'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryMethod('sucursal')}
                        className={`p-2.5 rounded-lg border text-left transition-colors ${
                          deliveryMethod === 'sucursal'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold text-white">
                          <Building2 className="w-3.5 h-3.5 text-amber-500" />
                          <span>Retiro en Bodega</span>
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Listo en 20 minutos
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="pt-2">
                    <label className="block text-slate-400 mb-1.5 font-medium">Forma de Pago para Taller</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credito_taller')}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          paymentMethod === 'credito_taller'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold block text-white">Crédito Taller 30D</span>
                        <span className="text-[10px] text-amber-400">Línea pre-aprobada B2B</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('transferencia')}
                        className={`p-2 rounded-lg border text-left transition-colors ${
                          paymentMethod === 'transferencia'
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-semibold block text-white">Transferencia Inmediata</span>
                        <span className="text-[10px] text-slate-400">BCP / BBVA / Interbank</span>
                      </button>
                    </div>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Footer Summary & Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal repuestos (Neto):</span>
                  <span className="font-mono text-slate-200 tabular-nums">S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Despacho express a taller:</span>
                  <span className="font-mono text-slate-200 tabular-nums">
                    {shippingCost === 0 ? 'GRATIS' : `S/ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>IGV Factura (18%):</span>
                  <span className="font-mono text-slate-200 tabular-nums">S/ {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Facturado:</span>
                  <span className="font-mono text-amber-400 tabular-nums text-lg">S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Procesando Despacho...</span>
                ) : (
                  <>
                    <span>Confirmar Pedido Taller (S/ {total.toFixed(2)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
