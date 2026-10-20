import React from 'react';
import { ShoppingCart, Wrench, BarChart3, Megaphone, Store, ShieldCheck, Lock, LogOut, UserCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'ecommerce' | 'sales' | 'traffic' | 'workshop_portal';
  setActiveTab: (tab: 'ecommerce' | 'sales' | 'traffic' | 'workshop_portal') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenRegisterWorkshop: () => void;
  activeWorkshopName?: string;
  isAdminAuthenticated: boolean;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenRegisterWorkshop,
  activeWorkshopName,
  isAdminAuthenticated,
  onOpenAdminLogin,
  onLogoutAdmin
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      {/* Promotional Top Ribbon */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <span>Envío express en 2 horas garantizado para talleres mecánicos en radio metropolitano</span>
          <span aria-hidden="true" className="opacity-60">·</span>
          <span>Descuento B2B de hasta 25% con factura electrónica</span>
        </div>
      </div>

      {/* Top Bar 3-Zone Contract: [Brand title, 1 line] - [Nav links, single line] - [Actions in top right corner] */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('ecommerce')}
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-md group-hover:bg-amber-400 transition-colors shrink-0">
            <Wrench className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group-hover:text-amber-400 transition-colors">
              AutoRepuestos <span className="text-amber-500">Pro</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
              B2B Talleres Mecánicos
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-sm font-medium">
          {/* Visible to everyone (clients & admin) */}
          <button
            onClick={() => setActiveTab('ecommerce')}
            className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'ecommerce'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Productos & Catálogo</span>
          </button>

          {/* Gestión de Ventas: ONLY visible for administrator after login */}
          {isAdminAuthenticated && (
            <button
              onClick={() => setActiveTab('sales')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'sales'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/80'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Gestión de Ventas</span>
              <span className="text-[9px] bg-emerald-500 text-slate-950 font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                Admin
              </span>
            </button>
          )}

          {/* Campañas de Tráfico: ONLY visible for administrator after login */}
          {isAdminAuthenticated && (
            <button
              onClick={() => setActiveTab('traffic')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'traffic'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>Campañas de Tráfico</span>
            </button>
          )}

          {/* Portal Taller B2B: Only visible for administrator after login */}
          {isAdminAuthenticated && (
            <button
              onClick={() => setActiveTab('workshop_portal')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'workshop_portal'
                  ? 'bg-slate-800 text-amber-400 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Portal Taller B2B</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Actions in Right Corner (Cart + Iniciar Sesión / Admin Status) */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Abrir Carrito de Compras"
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-amber-500 rounded-lg hover:bg-amber-400 transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline font-bold">Carrito</span>
            <span className="bg-slate-950 text-amber-400 text-xs px-1.5 py-0.5 rounded font-mono font-bold tabular-nums">
              {cartCount}
            </span>
            {cartTotal > 0 && (
              <span className="font-mono text-slate-950 font-extrabold hidden md:inline tabular-nums">
                S/ {cartTotal.toFixed(2)}
              </span>
            )}
          </button>

          {/* INICIAR SESIÓN / ADMINISTRADOR in the Right Corner */}
          {!isAdminAuthenticated ? (
            <button
              onClick={onOpenAdminLogin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
              title="Iniciar Sesión de Administrador"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Iniciar Sesión</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/90 border border-emerald-500/40 rounded-lg text-xs font-mono text-emerald-300">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="hidden lg:inline text-[11px] truncate max-w-[130px]" title="j2022robles@gmail.com">
                j2022robles
              </span>
              <button
                onClick={onLogoutAdmin}
                className="text-slate-400 hover:text-rose-400 text-[11px] p-0.5 ml-1 transition-colors flex items-center gap-1"
                title="Cerrar Sesión de Administrador"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
