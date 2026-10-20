import React, { useState } from 'react';
import { TrafficCampaign, TrafficSimulationEvent } from '../types';
import {
  Megaphone,
  TrendingUp,
  MousePointerClick,
  DollarSign,
  Eye,
  PlusCircle,
  Play,
  Pause,
  Sliders,
  Copy,
  Check,
  ExternalLink,
  Target,
  Sparkles,
  Search,
  Globe,
  Share2,
  Users
} from 'lucide-react';

interface TrafficCampaignManagerProps {
  campaigns: TrafficCampaign[];
  onToggleStatus: (campaignId: string) => void;
  onUpdateBudget: (campaignId: string, newBudget: number) => void;
  onCreateCampaign: (newCampaign: TrafficCampaign) => void;
  onSimulateTrafficBurst: (campaignId: string) => void;
  simulationEvents: TrafficSimulationEvent[];
  onTestLanding: (utmUrl: string) => void;
}

export const TrafficCampaignManager: React.FC<TrafficCampaignManagerProps> = ({
  campaigns,
  onToggleStatus,
  onUpdateBudget,
  onCreateCampaign,
  onSimulateTrafficBurst,
  simulationEvents,
  onTestLanding
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'builder' | 'simulation'>('overview');
  const [selectedPreviewCampaign, setSelectedPreviewCampaign] = useState<TrafficCampaign>(campaigns[0] || null);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Campaign Form State
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    channel: 'google_search' as TrafficCampaign['channel'],
    budgetDaily: 30,
    targetAudience: 'Dueños de talleres mecánicos multimarca y mecánicos en zona metropolitana',
    keywords: 'repuestos para talleres, frenos por mayor, repuestos despacho rapido, amortiguadores toyota',
    adHeadline: 'AutoRepuestos Pro | Despacho Express a tu Taller',
    adDescription: 'Precios mayoristas B2B en repuestos originales. Factura inmediata, crédito comercial y entrega en 2 horas garantizada.',
    landingPath: '/catalogo',
    utmCampaign: 'campana_talleres_2026'
  });

  // Calculate high-level marketing aggregates
  const totalSpend = campaigns.reduce((acc, c) => acc + c.spentTotal, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenueGenerated, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const globalCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const globalCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const globalRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const costPerWorkshopAcquired = totalConversions > 0 ? totalSpend / totalConversions : 0;

  const handleCopyUtm = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateNewCampaign = (e: React.FormEvent) => {
    e.preventDefault();

    const utmSourceMap: Record<TrafficCampaign['channel'], string> = {
      google_search: 'google',
      google_shopping: 'google',
      meta_ads: 'meta',
      local_geo: 'local_geo',
      whatsapp_b2b: 'whatsapp'
    };

    const utmMediumMap: Record<TrafficCampaign['channel'], string> = {
      google_search: 'cpc',
      google_shopping: 'shopping',
      meta_ads: 'paid_social',
      local_geo: 'cpc',
      whatsapp_b2b: 'direct_msg'
    };

    const utmSource = utmSourceMap[newCampaignForm.channel];
    const utmMedium = utmMediumMap[newCampaignForm.channel];
    const utmCampaign = newCampaignForm.utmCampaign.trim().toLowerCase().replace(/\s+/g, '_') || 'campana_pro';

    const fullLandingUrl = `https://autorepuestospro.com${newCampaignForm.landingPath}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;

    const newCamp: TrafficCampaign = {
      id: `camp-${Date.now()}`,
      name: newCampaignForm.name || 'Nueva Campaña Taller B2B',
      channel: newCampaignForm.channel,
      status: 'activa',
      budgetDaily: Number(newCampaignForm.budgetDaily),
      spentTotal: 0,
      impressions: 120,
      clicks: 14,
      conversions: 2,
      revenueGenerated: 280.00,
      ctr: 11.6,
      cpc: 0.35,
      roas: 8.0,
      targetAudience: newCampaignForm.targetAudience,
      targetKeywords: newCampaignForm.keywords.split(',').map(k => k.trim()),
      adHeadline: newCampaignForm.adHeadline,
      adDescription: newCampaignForm.adDescription,
      landingUrl: fullLandingUrl,
      utmSource,
      utmMedium,
      utmCampaign,
      adPreviewImage: selectedPreviewCampaign?.adPreviewImage
    };

    onCreateCampaign(newCamp);
    setActiveTab('campaigns');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            <span>Gestor de Tráfico Digital E-Commerce</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Campañas de Tráfico y Captación de Talleres Mecánicos
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Estrategias multicanal en Google Ads, Meta Ads y Geo-Targeting para dirigir a dueños de talleres automotrices a comprar repuestos en línea.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Métricas & Embudo
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'campaigns'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Campañas Activas ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'builder'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Crear Campaña</span>
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
              activeTab === 'simulation'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulador de Tráfico</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Inversión Publicitaria Total</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            S/ {totalSpend.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            En 4 canales automotrices
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Ingresos Generados en Tienda</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums">
            S/ {totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            ROAS Promedio: <strong className="font-mono">{globalRoas.toFixed(2)}x</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Visitas al E-Commerce (Clics)</span>
            <MousePointerClick className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            {totalClicks.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            CTR Promedio: <strong className="text-white font-mono">{globalCtr.toFixed(2)}%</strong> · CPC: <strong className="font-mono text-white">S/ {globalCpc.toFixed(2)}</strong>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Talleres / Pedidos Convertidos</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white tabular-nums">
            {totalConversions}
          </div>
          <div className="text-[11px] text-purple-300 mt-1">
            CAC por Taller: <strong className="font-mono">S/ {costPerWorkshopAcquired.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* Tab 1: Overview & Traffic Funnel */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Conversion Funnel Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2">
              Embudo de Conversión de Tráfico Automotriz
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Recorrido de los talleres mecánicos desde la visualización del anuncio digital hasta la compra de repuestos.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Step 1: Impressions */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl relative">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Paso 1 · Alcance</span>
                <h4 className="text-xs font-semibold text-slate-300 mt-0.5">Impresiones Anuncios</h4>
                <div className="text-xl font-mono font-bold text-white mt-2 tabular-nums">
                  {totalImpressions.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Dueños de taller impactados</p>
              </div>

              {/* Step 2: Clicks */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl relative">
                <span className="text-[10px] font-mono text-amber-500 uppercase">Paso 2 · Interés</span>
                <h4 className="text-xs font-semibold text-slate-300 mt-0.5">Visitas a la Tienda</h4>
                <div className="text-xl font-mono font-bold text-amber-400 mt-2 tabular-nums">
                  {totalClicks.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  CTR: {globalCtr.toFixed(2)}% al catálogo
                </p>
              </div>

              {/* Step 3: Product Search & Cart */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl relative">
                <span className="text-[10px] font-mono text-sky-400 uppercase">Paso 3 · Búsqueda OEM</span>
                <h4 className="text-xs font-semibold text-slate-300 mt-0.5">Calce por Vehículo</h4>
                <div className="text-xl font-mono font-bold text-sky-400 mt-2 tabular-nums">
                  {Math.round(totalClicks * 0.42).toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Talleres filtrando por Hilux, Ranger...</p>
              </div>

              {/* Step 4: Orders & Revenue */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl relative">
                <span className="text-[10px] font-mono text-emerald-400 uppercase">Paso 4 · Conversión</span>
                <h4 className="text-xs font-semibold text-slate-300 mt-0.5">Pedidos Confirmados</h4>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-2 tabular-nums">
                  {totalConversions}
                </div>
                <p className="text-[11px] text-emerald-400 mt-1">
                  S/ {totalRevenue.toLocaleString()} facturados
                </p>
              </div>
            </div>
          </div>

          {/* Channel Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Rendimiento por Canal de Tráfico</span>
                <span className="text-xs text-amber-500 font-mono">B2B Strategy</span>
              </h3>

              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white truncate max-w-xs">{camp.name}</span>
                      <span className="text-amber-400 font-mono font-bold tabular-nums">
                        ROAS {camp.roas.toFixed(2)}x
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Gasto: S/ {camp.spentTotal.toFixed(2)}</span>
                      <span>Clics: {camp.clicks}</span>
                      <span>Ventas: S/ {camp.revenueGenerated.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick UTM Link Tester & Landing Links */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>Enlaces de Campaña con UTMs Listos para Probar</span>
                <Globe className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-400">
                Haz clic en cualquier enlace para simular la llegada de un taller mecánico a través de esa campaña:
              </p>

              <div className="space-y-2">
                {campaigns.map((camp) => (
                  <div key={camp.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-white truncate block">{camp.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono truncate block">
                        utm_source={camp.utmSource}&utm_campaign={camp.utmCampaign}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyUtm(camp.landingUrl)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                        title="Copiar enlace con UTM"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onTestLanding(camp.landingUrl)}
                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Probar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Active Campaigns Management */}
      {activeTab === 'campaigns' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {campaigns.map((camp) => {
              const isSelectedForPreview = selectedPreviewCampaign?.id === camp.id;

              return (
                <div
                  key={camp.id}
                  className={`bg-slate-900 border rounded-xl p-5 space-y-4 transition-all shadow-md ${
                    isSelectedForPreview ? 'border-amber-500/80 ring-1 ring-amber-500/30' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleStatus(camp.id)}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          camp.status === 'activa'
                            ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                        title="Pausar o Activar Campaña"
                      >
                        {camp.status === 'activa' ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Activa</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Pausada</span>
                          </>
                        )}
                      </button>

                      <div>
                        <h4 className="text-sm font-bold text-white">{camp.name}</h4>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                          <span className="uppercase text-amber-500">{camp.channel.replace('_', ' ')}</span>
                          <span aria-hidden="true">·</span>
                          <span>utm_campaign: {camp.utmCampaign}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPreviewCampaign(camp)}
                        className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>Ver Vista Previa</span>
                      </button>

                      <button
                        onClick={() => onSimulateTrafficBurst(camp.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Inyectar Tráfico</span>
                      </button>
                    </div>
                  </div>

                  {/* Campaign Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Presupuesto Diario</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-mono font-bold text-white text-sm tabular-nums">
                          S/ {camp.budgetDaily.toFixed(2)}
                        </span>
                        <div className="flex flex-col ml-auto">
                          <button
                            onClick={() => onUpdateBudget(camp.id, camp.budgetDaily + 10)}
                            className="text-[9px] text-slate-400 hover:text-amber-400"
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => onUpdateBudget(camp.id, Math.max(10, camp.budgetDaily - 10))}
                            className="text-[9px] text-slate-400 hover:text-amber-400"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Gasto Total</span>
                      <span className="font-mono font-bold text-white text-sm block mt-1 tabular-nums">
                        S/ {camp.spentTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Clics (Visitas)</span>
                      <span className="font-mono font-bold text-white text-sm block mt-1 tabular-nums">
                        {camp.clicks}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">CTR / CPC</span>
                      <span className="font-mono font-bold text-white text-sm block mt-1 tabular-nums">
                        {camp.ctr.toFixed(1)}% / S/ {camp.cpc.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Pedidos Taller</span>
                      <span className="font-mono font-bold text-purple-400 text-sm block mt-1 tabular-nums">
                        {camp.conversions}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">ROAS / Retorno</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm block mt-1 tabular-nums">
                        {camp.roas.toFixed(2)}x (S/ {camp.revenueGenerated.toFixed(0)})
                      </span>
                    </div>
                  </div>

                  {/* Ad Copy summary */}
                  <div className="text-xs p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-slate-300">
                    <span className="text-slate-400 font-medium">Titular Anuncio: </span>
                    <strong className="text-white">"{camp.adHeadline}"</strong>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{camp.adDescription}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ad Preview Drawer / Container */}
          {selectedPreviewCampaign && (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-white">
                    Simulador Visual de Anuncio en Vivo: {selectedPreviewCampaign.name}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  Canal: {selectedPreviewCampaign.channel.toUpperCase()}
                </span>
              </div>

              {/* Google Search Mockup */}
              {selectedPreviewCampaign.channel.includes('google') ? (
                <div className="p-4 bg-slate-950 border border-slate-700/80 rounded-xl font-sans text-xs space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-bold text-slate-200">Patrocinado</span>
                    <span>·</span>
                    <span className="text-slate-400">https://autorepuestospro.com &gt; catalogo-talleres</span>
                  </div>
                  <h4 className="text-base text-sky-400 hover:underline cursor-pointer font-medium">
                    {selectedPreviewCampaign.adHeadline}
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {selectedPreviewCampaign.adDescription}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-sky-400">
                    <span className="underline cursor-pointer">Catálogo Frenos OEM</span>
                    <span>·</span>
                    <span className="underline cursor-pointer">Despacho Express 2 Horas</span>
                    <span>·</span>
                    <span className="underline cursor-pointer">Registro Cuenta Taller</span>
                  </div>
                </div>
              ) : (
                /* Meta / Instagram Sponsored Feed Post Mockup */
                <div className="max-w-md mx-auto bg-slate-950 border border-slate-800 rounded-xl overflow-hidden text-xs">
                  <div className="p-3 flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                        AP
                      </div>
                      <div>
                        <span className="font-bold text-white block">autorepuestos.pro</span>
                        <span className="text-[10px] text-slate-400">Publicidad · Dirigido a Talleres</span>
                      </div>
                    </div>
                  </div>

                  {selectedPreviewCampaign.adPreviewImage && (
                    <img
                      src={selectedPreviewCampaign.adPreviewImage}
                      alt="Anuncio AutoRepuestos Pro"
                      className="w-full aspect-16/9 object-cover"
                    />
                  )}

                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AUTOREPUESTOSPRO.COM</span>
                      <strong className="text-white text-xs block">{selectedPreviewCampaign.adHeadline}</strong>
                    </div>
                    <button
                      onClick={() => onTestLanding(selectedPreviewCampaign.landingUrl)}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
                    >
                      Comprar Ahora
                    </button>
                  </div>

                  <div className="p-3 text-slate-300">
                    <strong className="text-white">autorepuestos.pro </strong>
                    {selectedPreviewCampaign.adDescription}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Campaign Builder with UTM Generator */}
      {activeTab === 'builder' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
              Estrategia Digital de Crecimiento
            </span>
            <h2 className="text-lg font-bold text-white mt-1">
              Crear Nueva Campaña de Tráfico para AutoRepuestos Pro
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configura canal, audiencia de mecánicos, copys de alto impacto y genera automáticamente los enlaces de rastreo UTM.
            </p>
          </div>

          <form onSubmit={handleCreateNewCampaign} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nombre de la Campaña *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Google Search: Frenos y Suspensión Toyota Hilux"
                  value={newCampaignForm.name}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Canal de Tráfico Digital *</label>
                <select
                  value={newCampaignForm.channel}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, channel: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="google_search">Google Search (Búsqueda de alta intención de repuestos)</option>
                  <option value="meta_ads">Meta Ads (Facebook e Instagram segmentado a dueños de taller)</option>
                  <option value="google_shopping">Google Shopping (Feed de repuestos con precio)</option>
                  <option value="local_geo">Geo-Targeting Local (Talleres en radio 25 km)</option>
                  <option value="whatsapp_b2b">WhatsApp & Boletín B2B (Mecánicos afiliados)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Público Objetivo / Segmentación</label>
                <input
                  type="text"
                  value={newCampaignForm.targetAudience}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, targetAudience: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Presupuesto Diario (S/ Soles)</label>
                <input
                  type="number"
                  min="20"
                  max="2000"
                  value={newCampaignForm.budgetDaily}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, budgetDaily: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Palabras Clave de Búsqueda (separadas por coma)</label>
              <input
                type="text"
                value={newCampaignForm.keywords}
                onChange={(e) => setNewCampaignForm({ ...newCampaignForm, keywords: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Titular del Anuncio</label>
                <input
                  type="text"
                  required
                  value={newCampaignForm.adHeadline}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, adHeadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Campaña UTM (utm_campaign)</label>
                <input
                  type="text"
                  required
                  value={newCampaignForm.utmCampaign}
                  onChange={(e) => setNewCampaignForm({ ...newCampaignForm, utmCampaign: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Descripción del Anuncio</label>
              <textarea
                rows={2}
                value={newCampaignForm.adDescription}
                onChange={(e) => setNewCampaignForm({ ...newCampaignForm, adDescription: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Generated URL Box */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[11px] text-amber-500 font-mono font-semibold">
                Enlace UTM Generado Automáticamente para Atribución:
              </span>
              <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800">
                https://autorepuestospro.com{newCampaignForm.landingPath}?utm_source={newCampaignForm.channel}&utm_medium=cpc&utm_campaign={newCampaignForm.utmCampaign}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publicar Campaña y Empezar a Captar Talleres</span>
            </button>
          </form>
        </div>
      )}

      {/* Tab 4: Live Traffic Simulation Feed */}
      {activeTab === 'simulation' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
                Laboratorio de Tráfico en Vivo
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                Simulador de Comportamiento de Talleres Mecánicos
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Haz clic en el botón para simular una ráfaga de mecánicos que ven anuncios en Google y Meta, ingresan al e-commerce, buscan piezas y colocan pedidos.
              </p>
            </div>

            <button
              onClick={() => onSimulateTrafficBurst(campaigns[0]?.id || 'camp-1')}
              className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simular Oleada de Clics y Compras</span>
            </button>
          </div>

          {/* Simulation Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Registro de Actividad de Tráfico Atribuido
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {simulationEvents.length} eventos registrados
              </span>
            </div>

            <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto">
              {simulationEvents.map((evt) => (
                <div key={evt.id} className="p-3.5 hover:bg-slate-800/30 transition-colors flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-mono text-[10px] shrink-0">
                      {evt.action === 'pedido_completado' ? '💰' : evt.action === 'carrito' ? '🛒' : '🔍'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{evt.visitorType}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-slate-400">{evt.location}</span>
                        <span aria-hidden="true" className="text-slate-600">·</span>
                        <span className="text-[10px] text-amber-500 font-mono">{evt.campaignSource}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{evt.details}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {evt.orderValue && (
                      <span className="text-xs font-mono font-bold text-emerald-400 block tabular-nums">
                        +S/ {evt.orderValue.toFixed(2)}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500 font-mono">{evt.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
