import React, { useState } from 'react';
import { CAMPAIGN_WORKSHOP_IMAGE } from '../data/mockData';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Wrench,
  Clock,
  ArrowRight,
  Calculator,
  HelpCircle,
  FileCheck,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';

interface WorkshopPortalProps {
  onOpenRegister: () => void;
  onExploreCatalog: () => void;
}

export const WorkshopPortal: React.FC<WorkshopPortalProps> = ({
  onOpenRegister,
  onExploreCatalog
}) => {
  const [monthlySpend, setMonthlySpend] = useState<number>(12000);

  // Calculate estimated workshop savings: ~22%
  const estimatedSavings = monthlySpend * 0.22;
  const recommendedCredit = Math.min(30000, Math.round(monthlySpend * 0.9));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Section: Value Proposition for Mechanical Workshops */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-lg">
            <span>Alianza Exclusiva para Talleres Mecánicos</span>
            <span aria-hidden="true">·</span>
            <span>Despacho en 2 Horas</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            El socio de repuestos que tu taller necesita para <span className="text-amber-500">no frenar tu producción</span>.
          </h1>

          <p className="text-base text-slate-300 leading-relaxed max-w-xl">
            Abastecemos a más de 180 talleres mecánicos con repuestos OEM y originales. Ahorra hasta 25%, accede a crédito a 30 días y recibe las piezas directo en tu elevador en menos de 120 minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={onOpenRegister}
              className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
            >
              <span>Abrir Cuenta Taller con Descuento B2B</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExploreCatalog}
              className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition-colors text-center"
            >
              Explorar Catálogo de Piezas
            </button>
          </div>

          {/* Adjacency Proof Signals */}
          <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-mono font-bold text-lg text-white block">120 Min</span>
              <span className="text-slate-400">Entrega en taller</span>
            </div>
            <div>
              <span className="font-mono font-bold text-lg text-amber-400 block">-22% Prom.</span>
              <span className="text-slate-400">Ahorro en margen</span>
            </div>
            <div>
              <span className="font-mono font-bold text-lg text-emerald-400 block">30 Días</span>
              <span className="text-slate-400">Línea de crédito B2B</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
          <img
            src={CAMPAIGN_WORKSHOP_IMAGE}
            alt="Mecánico en taller ordenando repuestos por tablet"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
            <div className="p-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl text-xs space-y-1 w-full">
              <span className="text-amber-400 font-bold block">Garantía de Calce 100%</span>
              <p className="text-slate-300">
                Verificamos número de chasis (VIN) antes del despacho para que no pierdas horas de trabajo en el elevador.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars Bento Grid */}
      <div className="space-y-6 pt-8 border-t border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
            Beneficios Operativos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Diseñado para la Dinámica Real del Taller Mecánico
          </h2>
          <p className="text-xs text-slate-400">
            Eliminamos las pérdidas de tiempo de enviar al ayudante a buscar repuestos en mostrador.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Despacho en 120 Minutos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rutas continuas de motorizados y furgones en toda la zona metropolitana con seguimiento GPS del pedido.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Crédito a 30 Días</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cobra a tu cliente y luego paga los repuestos. Líneas de crédito iniciales desde $3,000 USD sin trámites engorrosos.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Facturación Fiscal Automática</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Emitimos Factura Electrónica con RUC/NIT en cada pedido para que deduzcas el 100% de tus costos fiscales.
            </p>
          </div>

          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Garantía Directa de Taller</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cambio inmediato de pieza en caso de garantía sin peritajes demorados. Si no calza, se sustituye en 60 minutos.
            </p>
          </div>
        </div>
      </div>

      {/* Workshop Savings Calculator */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-mono font-semibold">
              <Calculator className="w-4 h-4" />
              <span>Calculadora de Rentabilidad para Taller</span>
            </div>

            <h3 className="text-2xl font-bold text-white">
              ¿Cuánto puede ahorrar tu taller mensualmente?
            </h3>

            <p className="text-xs text-slate-400">
              Ajusta el volumen aproximado de compra mensual de tu taller para estimar tu margen neto adicional:
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Compra mensual en repuestos:</span>
                <span className="font-mono font-bold text-amber-400 text-sm tabular-nums">
                  S/ {monthlySpend.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="40000"
                step="1000"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>S/ 3,000 (Taller Chico)</span>
                <span>S/ 18,000 (Mediano)</span>
                <span>S/ 40,000 (Gran Flota)</span>
              </div>
            </div>
          </div>

          {/* Results Box */}
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Ahorro Mensual Estimado:</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                  S/ {estimatedSavings.toFixed(0)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Línea de Crédito Sugerida:</span>
                <span className="text-xl font-bold text-white font-mono tabular-nums">
                  S/ {recommendedCredit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Equivale a un margen adicional del 22% por reparación.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Incluye asesor técnico dedicado para búsquedas de código OEM.</span>
              </div>
            </div>

            <button
              onClick={onOpenRegister}
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <span>Activar Descuento y Crédito para Mi Taller</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-white">Preguntas Frecuentes de Talleres Mecánicos</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-white">¿Cómo aseguran que el repuesto sea el compatible?</h4>
            <p className="text-slate-400 leading-relaxed">
              Al momento de registrar tu pedido, nuestro sistema cruza el número de pieza original (OEM) con la base de datos oficial del fabricante automotriz. Además, puedes indicarnos la placa o VIN y validamos antes de enviar.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-white">¿Qué pasa si mi cliente cancela el trabajo?</h4>
            <p className="text-slate-400 leading-relaxed">
              Los talleres afiliados cuentan con política de devolución flexible: recibimos la pieza en su empaque original dentro de los 15 días siguientes sin cobrar penalidades de reabastecimiento.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-white">¿Cuáles son los requisitos para la línea de crédito a 30 días?</h4>
            <p className="text-slate-400 leading-relaxed">
              Solo requerimos ficha RUC activa, dirección verificable del taller y realizar un primer pedido con método contra entrega o transferencia. A partir del segundo pedido se activa automáticamente tu crédito.
            </p>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
            <h4 className="font-bold text-white">¿Puedo cotizar repuestos por WhatsApp?</h4>
            <p className="text-slate-400 leading-relaxed">
              Sí. Cada taller afiliado tiene un asesor de repuestos asignado. Puedes enviar una foto de la pieza rota o del padrón del vehículo y te enviamos la cotización con botón de pago directo en menos de 10 minutos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
