import React, { useState } from 'react';
import { WorkshopClient } from '../types';
import { X, CheckCircle2, ShieldCheck, Wrench, Building2, CreditCard, Sparkles } from 'lucide-react';

interface WorkshopRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (workshop: WorkshopClient) => void;
}

export const WorkshopRegisterModal: React.FC<WorkshopRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegister
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    taxId: '',
    ownerName: '',
    email: '',
    phone: '',
    city: 'Lima',
    address: '',
    bays: '3',
    specialty: 'Multimarca y Mantenimiento'
  });

  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newWorkshop: WorkshopClient = {
      id: `ws-${Date.now()}`,
      name: formData.name,
      taxId: formData.taxId,
      ownerName: formData.ownerName,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      discountTier: 20, // 20% discount granted
      creditLimit: 12000, // S/ 12,000 credit line in Soles
      creditUsed: 0,
      totalOrders: 0,
      status: 'activo'
    };

    setIsSuccess(true);
    setTimeout(() => {
      onRegister(newWorkshop);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">¡Taller Afiliado con Éxito!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Se ha habilitado tu <strong>Descuento Mayorista del 20%</strong> y tu línea de crédito comercial de <strong>S/ 12,000 Soles</strong>.
            </p>
          </div>
        ) : (
          <>
            <div className="pb-4 border-b border-slate-800">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Programa de Fidelización B2B</span>
              </span>
              <h2 className="text-lg font-bold text-white mt-1">
                Registra tu Taller Mecánico en AutoRepuestos Pro
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Accede a precios mayoristas con factura, línea de crédito a 30 días y despacho express en 2 horas.
              </p>
            </div>

            {/* Benefits Banner */}
            <div className="my-4 grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
              <div>
                <span className="text-amber-400 font-mono font-bold text-base block">-20% a -25%</span>
                <span className="text-[10px] text-slate-400">Descuento Taller</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-emerald-400 font-mono font-bold text-base block">S/ 12,000</span>
                <span className="text-[10px] text-slate-400">Línea de Crédito 30D</span>
              </div>
              <div>
                <span className="text-amber-400 font-mono font-bold text-base block">120 Min</span>
                <span className="text-[10px] text-slate-400">Despacho Express</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nombre Comercial del Taller *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Taller Mecánico AutoTech"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">RUC / NIT de Facturación *</label>
                  <input
                    type="text"
                    required
                    placeholder="RUC 20XXXXXXXXX"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dueño o Jefe de Patio *</label>
                  <input
                    type="text"
                    required
                    placeholder="Nombre y Apellidos"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Teléfono Móvil / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+51 9XX XXX XXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="taller@mecanica.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dirección del Taller para Despacho *</label>
                  <input
                    type="text"
                    required
                    placeholder="Av. Principal #123"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Número de Elevadores / Bahías</label>
                  <select
                    value={formData.bays}
                    onChange={(e) => setFormData({ ...formData, bays: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="1-2">1 a 2 elevadores</option>
                    <option value="3-5">3 a 5 elevadores (Mediano)</option>
                    <option value="6+">6 o más elevadores (Gran Taller)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Especialidad Principal</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Multimarca">Multimarca General</option>
                    <option value="Frenos y Suspensión">Frenos y Suspensión</option>
                    <option value="Motores y Diésel">Motores y Diésel</option>
                    <option value="Mantenimiento Flotas">Mantenimiento de Flotas</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Activar Cuenta Taller con Descuento B2B Inmediato</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
