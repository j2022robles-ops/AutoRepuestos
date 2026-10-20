import React, { useState, useMemo } from 'react';
import { Order, Product, WorkshopClient } from '../types';
import {
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Building2,
  DollarSign,
  Search,
  Filter,
  PlusCircle,
  RefreshCw,
  PhoneCall,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

interface SalesManagerProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  products: Product[];
  onRestockProduct: (productId: string, amount: number) => void;
  workshops: WorkshopClient[];
  onAddWorkshopCredit: (workshopId: string, amount: number) => void;
  onLogoutAdmin?: () => void;
  adminEmail?: string;
}

interface DailySalesData {
  dateKey: string;
  dayLabel: string;
  shortLabel: string;
  revenue: number;
  orderCount: number;
  unitsSold: number;
}

export const SalesManager: React.FC<SalesManagerProps> = ({
  orders,
  onUpdateOrderStatus,
  products,
  onRestockProduct,
  workshops,
  onAddWorkshopCredit,
  onLogoutAdmin,
  adminEmail = 'j2022robles@gmail.com'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'orders' | 'inventory' | 'workshops'>('dashboard');
  const [chartMetric, setChartMetric] = useState<'revenue' | 'orders' | 'units'>('revenue');
  const [orderFilter, setOrderFilter] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Financial aggregates
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalUnitsSold = orders.reduce((acc, o) => acc + o.items.reduce((sum, item) => sum + item.quantity, 0), 0);
  const avgTicket = orders.length > 0 ? totalRevenue / orders.length : 0;
  const pendingOrders = orders.filter(o => o.status === 'pendiente' || o.status === 'preparando').length;
  const inTransitOrders = orders.filter(o => o.status === 'en_camino').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);

  // Compute 8-day daily sales history including live orders in state
  const dailySalesData: DailySalesData[] = useMemo(() => {
    // Baseline history for preceding 7 days
    const baseline: Record<string, { label: string; short: string; rev: number; orders: number; units: number }> = {
      '2026-10-13': { label: '13 Oct (Lun)', short: '13 Oct', rev: 1840.0, orders: 7, units: 21 },
      '2026-10-14': { label: '14 Oct (Mar)', short: '14 Oct', rev: 2260.0, orders: 9, units: 28 },
      '2026-10-15': { label: '15 Oct (Mié)', short: '15 Oct', rev: 3120.0, orders: 12, units: 36 },
      '2026-10-16': { label: '16 Oct (Jue)', short: '16 Oct', rev: 2790.0, orders: 10, units: 31 },
      '2026-10-17': { label: '17 Oct (Vie)', short: '17 Oct', rev: 3850.0, orders: 15, units: 45 },
      '2026-10-18': { label: '18 Oct (Sáb)', short: '18 Oct', rev: 2410.0, orders: 9, units: 26 },
      '2026-10-19': { label: '19 Oct (Dom)', short: '19 Oct', rev: 1450.0, orders: 5, units: 14 },
      '2026-10-20': { label: '20 Oct (Hoy)', short: 'Hoy', rev: 1200.0, orders: 4, units: 12 }
    };

    // Aggregate dynamic orders currently in state
    orders.forEach(order => {
      const orderDateStr = order.date.split(' ')[0]; // '2026-10-20'
      if (baseline[orderDateStr]) {
        baseline[orderDateStr].rev += order.total;
        baseline[orderDateStr].orders += 1;
        baseline[orderDateStr].units += order.items.reduce((acc, item) => acc + item.quantity, 0);
      } else if (orderDateStr) {
        // If it's a date outside baseline, add to today
        baseline['2026-10-20'].rev += order.total;
        baseline['2026-10-20'].orders += 1;
        baseline['2026-10-20'].units += order.items.reduce((acc, item) => acc + item.quantity, 0);
      }
    });

    return Object.entries(baseline).map(([dateKey, val]) => ({
      dateKey,
      dayLabel: val.label,
      shortLabel: val.short,
      revenue: Math.round(val.rev * 100) / 100,
      orderCount: val.orders,
      unitsSold: val.units
    }));
  }, [orders]);

  // Daily Chart Stats calculations
  const totalPeriodRevenue = dailySalesData.reduce((acc, d) => acc + d.revenue, 0);
  const totalPeriodOrders = dailySalesData.reduce((acc, d) => acc + d.orderCount, 0);
  const totalPeriodUnits = dailySalesData.reduce((acc, d) => acc + d.unitsSold, 0);
  const avgDailyRevenue = totalPeriodRevenue / dailySalesData.length;
  const peakDay = [...dailySalesData].sort((a, b) => b.revenue - a.revenue)[0];
  const todayData = dailySalesData.find(d => d.dateKey === '2026-10-20') || dailySalesData[dailySalesData.length - 1];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = orderFilter === 'todos' || order.status === orderFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.workshopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.workshopTaxId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pendiente':
        return <span className="text-amber-400 font-mono text-xs">Pendiente de Aprobación</span>;
      case 'preparando':
        return <span className="text-sky-400 font-mono text-xs">Alistando en Bodega</span>;
      case 'en_camino':
        return <span className="text-purple-400 font-mono text-xs">En Ruta a Taller (Motorizado)</span>;
      case 'entregado':
        return <span className="text-emerald-400 font-mono text-xs">Entregado en Taller</span>;
      case 'facturado':
        return <span className="text-teal-400 font-mono text-xs">Facturado & Liquidado</span>;
      default:
        return <span className="text-slate-400 font-mono text-xs">{status}</span>;
    }
  };

  // Custom Recharts Tooltip Component
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DailySalesData = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 font-sans backdrop-blur-md">
          <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{data.dayLabel}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">B2B Talleres</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Facturación Diaria:</span>
              <span className="font-mono font-bold text-amber-400 tabular-nums text-sm">
                S/ {data.revenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Pedidos de Talleres:</span>
              <span className="font-mono font-semibold text-sky-400 tabular-nums">
                {data.orderCount} órdenes
              </span>
            </div>

            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Piezas Despachadas:</span>
              <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                {data.unitsSold} repuestos
              </span>
            </div>

            <div className="flex justify-between gap-6 pt-1 border-t border-slate-800/80 text-[11px]">
              <span className="text-slate-500">Ticket Promedio:</span>
              <span className="font-mono text-slate-300 tabular-nums">
                S/ {(data.revenue / data.orderCount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Administrator Authenticated Session Indicator Bar */}
      <div className="bg-slate-900 border border-emerald-500/30 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">Sesión de Administrador:</span>
              <strong className="text-emerald-400 font-mono font-bold">{adminEmail}</strong>
              <span className="text-[10px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-1.5 py-0.2 rounded font-mono">
                AUTORIZADO
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Control total de pedidos B2B, inventario, líneas de crédito y visualización de volumen de ventas.
            </p>
          </div>
        </div>

        {onLogoutAdmin && (
          <button
            onClick={onLogoutAdmin}
            className="self-start sm:self-auto text-xs font-semibold text-slate-300 hover:text-rose-400 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-900/50 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión Admin</span>
          </button>
        )}
      </div>

      {/* Module Title & Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Backoffice Operativo y Ventas B2B</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Gestión de Ventas y Despachos para Talleres
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dashboard visual de volumen diario, órdenes de repuestos en tiempo real, inventario crítico y líneas de crédito.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSubTab === 'dashboard'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard Visual</span>
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSubTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Pedidos ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSubTab === 'inventory'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Stock Crítico ({lowStockProducts.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('workshops')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeSubTab === 'workshops'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Talleres Afiliados ({workshops.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Facturación Total B2B</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            S/ {totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% vs semana previa</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Ticket Promedio por Taller</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            S/ {avgTicket.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalUnitsSold} piezas despachadas
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Despachos en Curso</span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            {inTransitOrders + pendingOrders}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            {pendingOrders} en preparación de almacén
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Talleres con Crédito Activo</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            {workshops.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Líneas a 30 días garantizadas
          </div>
        </div>
      </div>

      {/* SUBTAB: DASHBOARD VISUAL CON RECHARTS */}
      {activeSubTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Main Visual Chart Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Chart Header with Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Volumen de Ventas Diarias a Talleres Mecánicos
                  </h3>
                  <span className="text-[11px] text-amber-400 font-mono bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                    Recharts Live Data
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Histórico de los últimos 8 días con actualización en tiempo real de nuevos pedidos y cotizaciones.
                </p>
              </div>

              {/* Metric Toggle Buttons */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
                <button
                  onClick={() => setChartMetric('revenue')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    chartMetric === 'revenue'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Facturación (S/ Soles)
                </button>
                <button
                  onClick={() => setChartMetric('orders')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    chartMetric === 'orders'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pedidos (# Órdenes)
                </button>
                <button
                  onClick={() => setChartMetric('units')}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    chartMetric === 'units'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Repuestos (Unidades)
                </button>
              </div>
            </div>

            {/* Recharts Bar Chart Container */}
            <div className="w-full h-80 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailySalesData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (state && state.activeTooltipIndex !== undefined) {
                      const idx = typeof state.activeTooltipIndex === 'number' ? state.activeTooltipIndex : Number(state.activeTooltipIndex);
                      setHoveredBarIndex(Number.isFinite(idx) ? idx : null);
                    }
                  }}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <CartesianGrid
                    stroke="#1e293b"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="shortLabel"
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={{ stroke: '#334155' }}
                  />

                  <YAxis
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'var(--font-mono)' }}
                    axisLine={{ stroke: '#334155' }}
                    tickLine={{ stroke: '#334155' }}
                    tickFormatter={(val) => {
                      if (chartMetric === 'revenue') {
                        return `S/ ${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`;
                      }
                      return `${val}`;
                    }}
                  />

                  <Tooltip
                    content={<CustomBarTooltip />}
                    cursor={{ fill: 'rgba(245, 158, 11, 0.06)' }}
                  />

                  <Bar
                    dataKey={chartMetric === 'revenue' ? 'revenue' : chartMetric === 'orders' ? 'orderCount' : 'unitsSold'}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                  >
                    {dailySalesData.map((entry, index) => {
                      const isToday = entry.dateKey === '2026-10-20';
                      const isHovered = hoveredBarIndex === index;
                      const isPeak = entry.dateKey === peakDay.dateKey;

                      // Fill color strategy: Amber accent with high-intent highlight for today / peak
                      let barColor = '#f59e0b'; // default amber-500
                      if (chartMetric === 'orders') barColor = '#38bdf8'; // sky-400
                      if (chartMetric === 'units') barColor = '#34d399'; // emerald-400

                      if (isToday) {
                        barColor = '#fbbf24'; // amber-400 bright
                      }

                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={barColor}
                          opacity={hoveredBarIndex === null || isHovered ? 1 : 0.65}
                          className="transition-all duration-150 cursor-pointer"
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Chart KPI Callouts Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Total del Ciclo (8 Días)</span>
                <span className="font-mono font-bold text-white text-base block mt-0.5 tabular-nums">
                  S/ {totalPeriodRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-500">{totalPeriodOrders} pedidos · {totalPeriodUnits} piezas</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Promedio Diario</span>
                <span className="font-mono font-bold text-amber-400 text-base block mt-0.5 tabular-nums">
                  S/ {avgDailyRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-500">~{Math.round(totalPeriodOrders / 8)} órdenes por jornada</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Jornada Pico</span>
                <span className="font-mono font-bold text-emerald-400 text-base block mt-0.5 tabular-nums">
                  S/ {peakDay.revenue.toLocaleString('es-PE')}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{peakDay.dayLabel}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px]">Facturación de Hoy</span>
                <span className="font-mono font-bold text-white text-base block mt-0.5 tabular-nums">
                  S/ {todayData.revenue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-emerald-400">Actualizado con pedidos en vivo</span>
              </div>
            </div>
          </div>

          {/* Secondary Analytical Bento: Hourly Pattern & System Category Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peak Workshop Purchasing Hours */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Horarios de Mayor Demanda de Talleres</h4>
                  <p className="text-xs text-slate-400">Patrón de pedidos según inicio de trabajos mecánicos en elevador.</p>
                </div>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>08:00 - 11:30 (Diagnóstico Inicial & Desmontaje)</span>
                    <strong className="font-mono text-amber-400">46% del volumen</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '46%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>14:00 - 16:30 (Cierre de Turno de Tarde)</span>
                    <strong className="font-mono text-sky-400">32% del volumen</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-sky-400 h-full rounded-full" style={{ width: '32%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>17:00 - 19:00 (Reposición para siguiente día)</span>
                    <strong className="font-mono text-emerald-400">22% del volumen</strong>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '22%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Category Sales Breakdown */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Desglose de Ventas por Sistema Automotriz</h4>
                  <p className="text-xs text-slate-400">Participación por línea de repuestos en la facturación total.</p>
                </div>
                <Layers className="w-4 h-4 text-sky-400" />
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-medium text-slate-200">Frenos (Discos y Pastillas Cerámicas)</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400 tabular-nums">38% (S/ 7,160)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-sky-400" />
                    <span className="font-medium text-slate-200">Suspensión & Amortiguación (KYB / Moog)</span>
                  </div>
                  <span className="font-mono font-bold text-sky-400 tabular-nums">29% (S/ 5,460)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="font-medium text-slate-200">Motor & Distribución (Gates / Castrol)</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 tabular-nums">21% (S/ 3,950)</span>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                    <span className="font-medium text-slate-200">Embrague & Eléctrico (Valeo / Denso)</span>
                  </div>
                  <span className="font-mono font-bold text-purple-400 tabular-nums">12% (S/ 2,270)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: ORDERS MANAGEMENT */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          {/* Controls: Search and Filters */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Buscar por # Orden, Taller o RUC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-950 rounded-lg border border-slate-800">
              {['todos', 'pendiente', 'preparando', 'en_camino', 'entregado'].map((statusKey) => (
                <button
                  key={statusKey}
                  onClick={() => setOrderFilter(statusKey)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap capitalize transition-colors ${
                    orderFilter === statusKey
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {statusKey === 'todos' ? 'Todos los Estados' : statusKey.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Orden & Fecha</th>
                    <th className="py-3 px-4">Taller Mecánico</th>
                    <th className="py-3 px-4">Piezas Solicitadas</th>
                    <th className="py-3 px-4 text-right">Total Facturado</th>
                    <th className="py-3 px-4">Atribución Campaña</th>
                    <th className="py-3 px-4">Estado Logístico</th>
                    <th className="py-3 px-4 text-right">Acción Operativa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No se encontraron pedidos con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono">
                          <span className="font-bold text-white block">{order.orderNumber}</span>
                          <span className="text-[10px] text-slate-500">{order.date}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-white block">{order.workshopName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{order.workshopTaxId}</span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="max-w-xs">
                            <span className="text-slate-200">
                              {order.items.map(i => `${i.quantity}x ${i.product.name.split(' ')[0]} ${i.product.name.split(' ')[1] || ''}`).join(', ')}
                            </span>
                            <span className="text-[10px] text-slate-500 block">
                              {order.items.reduce((acc, i) => acc + i.quantity, 0)} unidades en total
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-amber-400 tabular-nums">
                          S/ {order.total.toFixed(2)}
                        </td>

                        <td className="py-3 px-4">
                          {order.trafficSource ? (
                            <span className="text-[11px] text-sky-400 block truncate max-w-[160px]" title={order.trafficSource}>
                              {order.trafficSource}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">Tráfico Directo</span>
                          )}
                          {order.utmCampaign && (
                            <span className="text-[10px] font-mono text-slate-500 block">
                              utm: {order.utmCampaign}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {getStatusBadge(order.status)}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {order.status === 'pendiente' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'preparando')}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded transition-colors"
                              >
                                Pasar a Bodega
                              </button>
                            )}

                            {order.status === 'preparando' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'en_camino')}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors flex items-center gap-1"
                              >
                                <Truck className="w-3 h-3" />
                                <span>Despachar (Ruta)</span>
                              </button>
                            )}

                            {order.status === 'en_camino' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'entregado')}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                <span>Confirmar Entrega</span>
                              </button>
                            )}

                            {order.status === 'entregado' && (
                              <button
                                onClick={() => onUpdateOrderStatus(order.id, 'facturado')}
                                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
                              >
                                Emitir Factura
                              </button>
                            )}

                            {order.status === 'facturado' && (
                              <span className="text-[11px] text-emerald-400 font-semibold">Completado</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: INVENTORY & STOCK ALERTS */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Monitoreo de Stock y Reposición Rápida</h3>
              <p className="text-xs text-slate-400">
                Evita roturas de stock para los repuestos de mayor demanda en los talleres mecánicos.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded">
              {lowStockProducts.length} productos bajo umbral de seguridad
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Repuesto & Marca</th>
                  <th className="py-3 px-4">Código OEM</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4 text-right">Precio Taller</th>
                  <th className="py-3 px-4">Nivel de Stock</th>
                  <th className="py-3 px-4 text-right">Acción de Reabastecimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {products.map((product) => {
                  const isLow = product.stock <= product.minStockAlert;
                  return (
                    <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded bg-slate-950 border border-slate-800 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-white block">{product.name}</span>
                          <span className="text-[10px] text-amber-500 uppercase font-mono">{product.brand}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-slate-400">{product.oemNumber}</td>

                      <td className="py-3 px-4 capitalize text-slate-400">{product.category}</td>

                      <td className="py-3 px-4 text-right font-mono text-white tabular-nums">
                        S/ {product.priceWorkshop.toFixed(2)}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-bold tabular-nums ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {product.stock} unidades
                          </span>
                          {isLow && (
                            <span className="text-[10px] text-rose-400 bg-rose-950/60 border border-rose-800/40 px-1.5 py-0.5 rounded">
                              Bajo Mínimo ({product.minStockAlert})
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onRestockProduct(product.id, 20)}
                          className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 ml-auto shadow-sm active:scale-95"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>Reabastecer Lote (+20)</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB: WORKSHOPS DIRECTORY & CREDIT LINES */}
      {activeSubTab === 'workshops' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Directorio de Talleres Mecánicos Afiliados</h3>
              <p className="text-xs text-slate-400">
                Líneas de crédito B2B activas, porcentaje de descuento asignado e historial de compras.
              </p>
            </div>
            <span className="text-xs text-slate-400">
              Total líneas otorgadas: <strong className="text-emerald-400 font-mono">S/ {workshops.reduce((acc, w) => acc + w.creditLimit, 0).toLocaleString()} Soles</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workshops.map((ws) => {
              const creditAvailable = ws.creditLimit - ws.creditUsed;
              const usagePercent = Math.round((ws.creditUsed / ws.creditLimit) * 100);

              return (
                <div key={ws.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-mono text-amber-500 uppercase">{ws.taxId}</span>
                      <h4 className="text-base font-bold text-white">{ws.name}</h4>
                      <p className="text-xs text-slate-400">Titular: {ws.ownerName} · {ws.phone}</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                      -{ws.discountTier}% Descuento Taller
                    </span>
                  </div>

                  {/* Credit Bar */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Línea de Crédito 30 Días:</span>
                      <span className="font-mono text-white">S/ {ws.creditLimit.toLocaleString()}</span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, usagePercent)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Usado: <strong className="text-amber-400 font-mono">S/ {ws.creditUsed.toLocaleString()}</strong></span>
                      <span>Disponible: <strong className="text-emerald-400 font-mono">S/ {creditAvailable.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">{ws.totalOrders} pedidos completados</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onAddWorkshopCredit(ws.id, 1000)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs transition-colors"
                      >
                        +S/ 1,000 Crédito
                      </button>
                      <a
                        href={`https://wa.me/${ws.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(ws.ownerName)},%20te%20escribimos%20de%20AutoRepuestos%20Pro.`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded text-xs flex items-center gap-1 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>Contactar</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
