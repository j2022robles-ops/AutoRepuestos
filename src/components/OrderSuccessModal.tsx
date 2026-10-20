import React, { useState } from 'react';
import { Order } from '../types';
import { CheckCircle2, Clock, Truck, Printer, ArrowRight, X, Building2, Store } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewInSalesManager: () => void;
  isAdmin?: boolean;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewInSalesManager,
  isAdmin = false
}) => {
  if (!order) return null;

  const [printNotif, setPrintNotif] = useState(false);

  const handlePrint = () => {
    setPrintNotif(true);
    setTimeout(() => {
      setPrintNotif(false);
      window.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Top Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Confirmation Header */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
            Transmisión de Pedido Exitosa
          </span>
          <h2 className="text-xl font-bold text-white mt-1">
            ¡Pedido Taller #{order.orderNumber} Generado!
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            El almacén central de AutoRepuestos Pro ya está empacando los componentes para despacho inmediato.
          </p>
        </div>

        {/* Dispatch status timeline */}
        <div className="my-5 p-4 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Tiempo Estimado</span>
              <strong className="text-white">Menos de 120 min</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Truck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Modalidad</span>
              <strong className="text-white">
                {order.deliveryMethod === 'express_taller' ? 'Ruta Express a Taller' : 'Retiro en Sucursal'}
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-slate-400 block text-[10px]">Destino Taller</span>
              <strong className="text-white truncate block max-w-[140px]">{order.workshopName}</strong>
            </div>
          </div>
        </div>

        {/* Invoice breakdown */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center text-slate-400 pb-2 border-b border-slate-800">
            <span>RUC / Factura: <strong className="text-slate-200 font-mono">{order.workshopTaxId}</strong></span>
            <span>Teléfono Taller: <strong className="text-slate-200 font-mono">{order.contactPhone}</strong></span>
          </div>

          <div className="max-h-40 overflow-y-auto divide-y divide-slate-800/60 pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200">{item.product.name}</span>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {item.quantity}x @ S/ {item.unitPrice.toFixed(2)} · OEM: {item.product.oemNumber}
                  </div>
                </div>
                <span className="font-mono font-bold text-slate-200 tabular-nums">
                  S/ {item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-bold text-white">Total Facturado (con IGV):</span>
            <span className="text-xl font-mono font-extrabold text-amber-400 tabular-nums">
              S/ {order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Modal actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={handlePrint}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>{printNotif ? 'Preparando...' : 'Imprimir Comprobante Oficial'}</span>
          </button>

          {isAdmin ? (
            <button
              onClick={() => {
                onClose();
                onViewInSalesManager();
              }}
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>Ver Pedido en Gestión de Ventas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Store className="w-4 h-4" />
              <span>Seguir Explorando Repuestos</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
