import React, { useState } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_CAMPAIGNS,
  INITIAL_WORKSHOPS,
  INITIAL_ORDERS,
  INITIAL_SIMULATION_EVENTS,
  HERO_IMAGE
} from './data/mockData';
import { Product, CartItem, Order, WorkshopClient, TrafficCampaign, TrafficSimulationEvent } from './types';
import { Navbar } from './components/Navbar';
import { VehicleSelector } from './components/VehicleSelector';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { WorkshopRegisterModal } from './components/WorkshopRegisterModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SalesManager } from './components/SalesManager';
import { TrafficCampaignManager } from './components/TrafficCampaignManager';
import { WorkshopPortal } from './components/WorkshopPortal';
import {
  Wrench,
  ShieldCheck,
  Truck,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  PhoneCall,
  Search,
  ShoppingCart,
  Lock,
  UserCheck,
  Check,
  X
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'ecommerce' | 'sales' | 'traffic' | 'workshop_portal'>('ecommerce');

  // Administrator Authentication State (Protected "Gestión de Ventas")
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('autorepuestos_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Core Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [campaigns, setCampaigns] = useState<TrafficCampaign[]>(INITIAL_CAMPAIGNS);
  const [workshops, setWorkshops] = useState<WorkshopClient[]>(INITIAL_WORKSHOPS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [simulationEvents, setSimulationEvents] = useState<TrafficSimulationEvent[]>(INITIAL_SIMULATION_EVENTS);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 2 },
    { product: INITIAL_PRODUCTS[1], quantity: 2 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartToast, setCartToast] = useState<{ show: boolean; name: string } | null>(null);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRegisterWorkshopOpen, setIsRegisterWorkshopOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Active Simulated Workshop (Default to first workshop)
  const [activeWorkshop, setActiveWorkshop] = useState<WorkshopClient>(INITIAL_WORKSHOPS[0]);

  // Catalog Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [vehicleFilters, setVehicleFilters] = useState<{ make: string; model: string; year: string; query: string }>({
    make: '',
    model: '',
    year: '',
    query: ''
  });

  // Active Campaign Test Simulation State (UTM banner)
  const [activeUtmSource, setActiveUtmSource] = useState<string | null>(null);

  // Intercept Navigation to enforce Administrator Authentication for "Gestión de Ventas"
  const handleTabChange = (tab: 'ecommerce' | 'sales' | 'traffic' | 'workshop_portal') => {
    if ((tab === 'sales' || tab === 'traffic') && !isAdminAuthenticated) {
      setIsAdminLoginOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('autorepuestos_admin_auth', 'true');
    setActiveTab('sales');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('autorepuestos_admin_auth');
    if (activeTab === 'sales') {
      setActiveTab('ecommerce');
    }
  };

  // Cart Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    // Show cart toast notification
    setCartToast({ show: true, name: product.name });
    setTimeout(() => {
      setCartToast(null);
    }, 3200);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Checkout Handler: Placed Order enters Sales Management pipeline
  const handleCheckout = (orderData: {
    workshopName: string;
    workshopTaxId: string;
    contactPhone: string;
    shippingAddress: string;
    deliveryMethod: 'express_taller' | 'sucursal' | 'estandar';
    paymentMethod: 'credito_taller' | 'transferencia' | 'tarjeta' | 'contra_entrega';
  }) => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.product.priceWorkshop * item.quantity, 0);
    const tax = subtotal * 0.18;
    const shipping = orderData.deliveryMethod === 'express_taller' ? (subtotal > 100 ? 0 : 8.0) : 0;
    const total = subtotal + tax + shipping;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ARP-2026-${1043 + orders.length}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      workshopName: orderData.workshopName,
      workshopTaxId: orderData.workshopTaxId,
      contactPhone: orderData.contactPhone,
      shippingAddress: orderData.shippingAddress,
      deliveryMethod: orderData.deliveryMethod,
      paymentMethod: orderData.paymentMethod,
      items: cartItems.map(item => ({
        product: item.product,
        quantity: item.quantity,
        unitPrice: item.product.priceWorkshop,
        subtotal: item.product.priceWorkshop * item.quantity
      })),
      subtotal,
      discount: cartItems.reduce((acc, i) => acc + (i.product.priceRetail - i.product.priceWorkshop) * i.quantity, 0),
      tax,
      total,
      status: 'pendiente',
      trafficSource: activeUtmSource || 'E-Commerce Directo Taller',
      utmCampaign: activeUtmSource ? 'campana_atribuida' : undefined
    };

    // Decrement stock in real time
    setProducts(prev =>
      prev.map(p => {
        const cartMatch = cartItems.find(c => c.product.id === p.id);
        if (cartMatch) {
          return { ...p, stock: Math.max(0, p.stock - cartMatch.quantity) };
        }
        return p;
      })
    );

    // Save order
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setIsCartOpen(false);
    setConfirmedOrder(newOrder);

    // Also register simulation event
    setSimulationEvents(prev => [
      {
        id: `sim-${Date.now()}`,
        timestamp: 'Justo ahora',
        visitorType: 'Taller Mecánico',
        location: orderData.workshopName,
        campaignSource: activeUtmSource || 'Directo E-Commerce',
        action: 'pedido_completado',
        details: `Confirmó pedido #${newOrder.orderNumber} por S/ ${total.toFixed(2)}`,
        orderValue: total
      },
      ...prev
    ]);
  };

  // Workshop Registration
  const handleRegisterWorkshop = (newWs: WorkshopClient) => {
    setWorkshops(prev => [newWs, ...prev]);
    setActiveWorkshop(newWs);
  };

  // Sales Management Operations
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleRestockProduct = (productId: string, amount: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: p.stock + amount } : p))
    );
  };

  const handleAddWorkshopCredit = (workshopId: string, amount: number) => {
    setWorkshops(prev =>
      prev.map(w => (w.id === workshopId ? { ...w, creditLimit: w.creditLimit + amount } : w))
    );
  };

  // Traffic Campaign Operations
  const handleToggleCampaignStatus = (campaignId: string) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? { ...c, status: c.status === 'activa' ? 'pausada' : 'activa' }
          : c
      )
    );
  };

  const handleUpdateCampaignBudget = (campaignId: string, newBudget: number) => {
    setCampaigns(prev =>
      prev.map(c => (c.id === campaignId ? { ...c, budgetDaily: newBudget } : c))
    );
  };

  const handleCreateCampaign = (newCamp: TrafficCampaign) => {
    setCampaigns(prev => [newCamp, ...prev]);
  };

  // Simulate a live burst of traffic from marketing campaigns
  const handleSimulateTrafficBurst = (campaignId: string) => {
    const targetCamp = campaigns.find(c => c.id === campaignId) || campaigns[0];
    const simulatedClicks = Math.floor(Math.random() * 8) + 12;
    const orderGenerated = Math.random() > 0.3; // 70% chance of an order
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomQty = Math.floor(Math.random() * 3) + 1;
    const addedRevenue = orderGenerated ? randomProduct.priceWorkshop * randomQty * 1.18 : 0;

    // Update campaign metrics
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === targetCamp.id) {
          const newClicks = c.clicks + simulatedClicks;
          const newSpent = c.spentTotal + simulatedClicks * c.cpc;
          const newConversions = orderGenerated ? c.conversions + 1 : c.conversions;
          const newRevenue = c.revenueGenerated + addedRevenue;
          const newRoas = newSpent > 0 ? newRevenue / newSpent : c.roas;

          return {
            ...c,
            clicks: newClicks,
            spentTotal: newSpent,
            conversions: newConversions,
            revenueGenerated: newRevenue,
            roas: newRoas
          };
        }
        return c;
      })
    );

    // If order was generated, add to Sales Management orders
    if (orderGenerated) {
      const simulatedWorkshop = workshops[Math.floor(Math.random() * workshops.length)];
      const sub = randomProduct.priceWorkshop * randomQty;
      const simOrder: Order = {
        id: `ord-sim-${Date.now()}`,
        orderNumber: `ARP-2026-${1043 + orders.length}`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        workshopName: simulatedWorkshop.name,
        workshopTaxId: simulatedWorkshop.taxId,
        contactPhone: simulatedWorkshop.phone,
        shippingAddress: simulatedWorkshop.address,
        deliveryMethod: 'express_taller',
        paymentMethod: 'credito_taller',
        items: [
          {
            product: randomProduct,
            quantity: randomQty,
            unitPrice: randomProduct.priceWorkshop,
            subtotal: sub
          }
        ],
        subtotal: sub,
        discount: (randomProduct.priceRetail - randomProduct.priceWorkshop) * randomQty,
        tax: sub * 0.18,
        total: addedRevenue,
        status: 'preparando',
        trafficSource: `${targetCamp.name}`,
        utmCampaign: targetCamp.utmCampaign
      };

      setOrders(prev => [simOrder, ...prev]);

      // Decrement stock
      setProducts(prev =>
        prev.map(p => (p.id === randomProduct.id ? { ...p, stock: Math.max(0, p.stock - randomQty) } : p))
      );
    }

    // Add activity event
    setSimulationEvents(prev => [
      {
        id: `sim-${Date.now()}`,
        timestamp: 'Hace unos instantes',
        visitorType: 'Taller Mecánico',
        location: 'Zona Metropolitana',
        campaignSource: targetCamp.name,
        action: orderGenerated ? 'pedido_completado' : 'carrito',
        details: orderGenerated
          ? `Adquirió ${randomQty}x ${randomProduct.name.split(' ')[0]} ${randomProduct.name.split(' ')[1] || ''} ($${addedRevenue.toFixed(2)})`
          : `Ingresó al catálogo buscando repuestos compatibles`,
        orderValue: orderGenerated ? addedRevenue : undefined
      },
      ...prev
    ]);
  };

  // Test landing page through UTM link
  const handleTestLanding = (utmUrl: string) => {
    try {
      const url = new URL(utmUrl);
      const utmCampaign = url.searchParams.get('utm_campaign') || 'desconocida';
      const utmSource = url.searchParams.get('utm_source') || 'anuncio';
      setActiveUtmSource(`${utmSource.toUpperCase()} - ${utmCampaign}`);
      setActiveTab('ecommerce');
    } catch {
      setActiveUtmSource('Campaña Digital');
      setActiveTab('ecommerce');
    }
  };

  // Filter products by vehicle and category
  const filteredProducts = products.filter(product => {
    // Category match
    if (selectedCategory !== 'todos' && product.category !== selectedCategory) {
      return false;
    }

    // Vehicle make match
    if (vehicleFilters.make) {
      const hasMake = product.compatibleVehicles.some(v =>
        v.make.toLowerCase() === vehicleFilters.make.toLowerCase()
      );
      if (!hasMake) return false;
    }

    // Vehicle model match
    if (vehicleFilters.model) {
      const hasModel = product.compatibleVehicles.some(v =>
        v.model.toLowerCase().includes(vehicleFilters.model.toLowerCase())
      );
      if (!hasModel) return false;
    }

    // Search query match (name, OEM, SKU, brand)
    if (vehicleFilters.query) {
      const q = vehicleFilters.query.toLowerCase();
      const match =
        product.name.toLowerCase().includes(q) ||
        product.oemNumber.toLowerCase().includes(q) ||
        product.sku.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const activeFilterCount =
    (vehicleFilters.make ? 1 : 0) +
    (vehicleFilters.model ? 1 : 0) +
    (vehicleFilters.year ? 1 : 0) +
    (vehicleFilters.query ? 1 : 0) +
    (selectedCategory !== 'todos' ? 1 : 0);

  const cartTotalWorkshop = cartItems.reduce(
    (acc, item) => acc + item.product.priceWorkshop * item.quantity,
    0
  );
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        cartCount={cartItemCount}
        cartTotal={cartTotalWorkshop}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenRegisterWorkshop={() => setIsRegisterWorkshopOpen(true)}
        activeWorkshopName={activeWorkshop.name}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onLogoutAdmin={handleLogoutAdmin}
      />

      {/* Cart Toast Notification */}
      {cartToast && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/50 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 text-xs max-w-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white truncate">¡Agregado al Pedido!</p>
              <p className="text-[11px] text-slate-400 truncate">{cartToast.name}</p>
            </div>
            <button
              onClick={() => {
                setCartToast(null);
                setIsCartOpen(true);
              }}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs shrink-0 transition-colors"
            >
              Ver Carrito
            </button>
          </div>
        </div>
      )}

      {/* Active Traffic UTM Attribution Notification Bar */}
      {activeUtmSource && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs flex items-center justify-between text-amber-300">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Simulando navegación con atribución de tráfico: <strong className="text-white font-mono">{activeUtmSource}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400">Cualquier compra se atribuirá a los KPIs de esta campaña</span>
            <button
              onClick={() => setActiveUtmSource(null)}
              className="ml-auto text-slate-400 hover:text-white underline text-[11px]"
            >
              Restablecer
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: E-COMMERCE & AUTOMOTIVE STOREFRONT */}
        {activeTab === 'ecommerce' && (
          <div className="space-y-10 pb-16">
            {/* Storefront Hero: 1 bold campaign focal point with split screen */}
            <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Left Column (7 cols): Headline, value prop, CTA */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                      <span>Plataforma Digital de Repuestos Automotrices</span>
                      <span aria-hidden="true">·</span>
                      <span>Enfoque B2B Talleres</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                      Abastecimiento Inmediato de Repuestos para <span className="text-amber-500">Talleres Mecánicos</span>
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                      Catálogo digital con más de 12,000 repuestos homologados por código OEM. Precios de mayorista con factura, crédito a 30 días y despacho directo a tu taller en 120 minutos.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById('catalogo-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="py-3 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95"
                      >
                        <span>Explorar Repuestos por Vehículo</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setIsCartOpen(true)}
                        className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-semibold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-colors shadow-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Ver Carrito de Pedido ({cartItemCount})</span>
                      </button>

                      <button
                        onClick={() => setIsRegisterWorkshopOpen(true)}
                        className="py-3 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold rounded-xl text-xs sm:text-sm transition-colors"
                      >
                        Registrar Taller (-20% B2B)
                      </button>
                    </div>

                    {/* Operational Proof Adjacency */}
                    <div className="pt-4 border-t border-slate-800 grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-mono font-bold text-base text-white block">2 Horas</span>
                        <span className="text-slate-400 text-[11px]">Despacho Express a Taller</span>
                      </div>
                      <div>
                        <span className="font-mono font-bold text-base text-amber-400 block">-25%</span>
                        <span className="text-slate-400 text-[11px]">Ahorro en Tarifa Mayorista</span>
                      </div>
                      <div>
                        <span className="font-mono font-bold text-base text-emerald-400 block">100% OEM</span>
                        <span className="text-slate-400 text-[11px]">Garantía de Calce y Fabricación</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column (5 cols): High-Impact Studio Visual */}
                  <div className="lg:col-span-5">
                    <div className="relative aspect-16/9 lg:aspect-4/3 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
                      <img
                        src={HERO_IMAGE}
                        alt="Almacén de repuestos automotrices AutoRepuestos Pro"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-5">
                        <div className="text-xs text-slate-200 font-mono">
                          Bodega Central de Despacho · Stock listo para envío
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Catalog Section with Vehicle Selector & Product Grid */}
            <section id="catalogo-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Specialized Vehicle Compatibility Filter */}
              <VehicleSelector
                onFilterChange={(filters) => setVehicleFilters(filters)}
                activeFilterCount={activeFilterCount}
                onClearFilters={() => {
                  setVehicleFilters({ make: '', model: '', year: '', query: '' });
                  setSelectedCategory('todos');
                }}
              />

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'todos', label: 'Todas las Categorías' },
                  { id: 'frenos', label: 'Discos y Pastillas de Freno' },
                  { id: 'suspension', label: 'Amortiguadores y Dirección' },
                  { id: 'motor', label: 'Kits Distribución y Motor' },
                  { id: 'mantenimiento', label: 'Fluidos y Filtración' },
                  { id: 'electrico', label: 'Bujías y Sistema Eléctrico' },
                  { id: 'transmision', label: 'Kits de Embrague' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Products Grid Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span>
                  Mostrando <strong className="text-white font-mono">{filteredProducts.length}</strong> repuestos certificados con precio exclusivo para taller
                </span>
                <span className="hidden sm:inline text-slate-500 font-mono">
                  Garantía de Fábrica: 12 a 24 Meses
                </span>
              </div>

              {/* Product Cards Grid: 3-4 columns */}
              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-8 space-y-3">
                  <Wrench className="w-12 h-12 text-slate-600 mx-auto" />
                  <h3 className="text-base font-bold text-white">No se encontraron repuestos compatibles</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Intenta limpiar los filtros de vehículo o búscalo directamente por su número de parte OEM.
                  </p>
                  <button
                    onClick={() => {
                      setVehicleFilters({ make: '', model: '', year: '', query: '' });
                      setSelectedCategory('todos');
                    }}
                    className="py-2 px-4 bg-amber-500 text-slate-950 font-semibold rounded-lg text-xs"
                  >
                    Ver Todo el Catálogo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p, qty) => handleAddToCart(p, qty)}
                      onViewDetails={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* B2B Workshop Trust Banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-xs uppercase font-mono tracking-wider text-amber-500 font-semibold">
                    ¿Tienes un taller mecánico o flota comercial?
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Únete al Programa Cuenta Taller B2B
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Más de 180 talleres mecánicos en Lima y alrededores confían en AutoRepuestos Pro para recibir sus piezas en menos de 120 minutos con línea de crédito a 30 días.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="py-3 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Ver Carrito de Pedido</span>
                  </button>
                  <button
                    onClick={() => setIsRegisterWorkshopOpen(true)}
                    className="py-3 px-5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-xl text-xs sm:text-sm transition-colors"
                  >
                    Registrar Taller Gratis
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: SALES MANAGEMENT SYSTEM (PROTECTED BY ADMIN AUTH) */}
        {activeTab === 'sales' && (
          !isAdminAuthenticated ? (
            <div className="max-w-lg mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                <Lock className="w-8 h-8" strokeWidth={2.2} />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-bold">
                Módulo Restringido
              </span>
              <h2 className="text-2xl font-bold text-white">
                Acceso Exclusivo para Administrador
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                El panel de control de ventas, facturación B2B, alertas de stock e historial de despachos está reservado únicamente para el administrador del sistema (<strong>j2022robles@gmail.com</strong>).
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm inline-flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Iniciar Sesión de Administrador</span>
                </button>
              </div>
            </div>
          ) : (
            <SalesManager
              orders={orders}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              products={products}
              onRestockProduct={handleRestockProduct}
              workshops={workshops}
              onAddWorkshopCredit={handleAddWorkshopCredit}
              onLogoutAdmin={handleLogoutAdmin}
              adminEmail="j2022robles@gmail.com"
            />
          )
        )}

        {/* VIEW 3: TRAFFIC CAMPAIGN MANAGER */}
        {activeTab === 'traffic' && (
          <TrafficCampaignManager
            campaigns={campaigns}
            onToggleStatus={handleToggleCampaignStatus}
            onUpdateBudget={handleUpdateCampaignBudget}
            onCreateCampaign={handleCreateCampaign}
            onSimulateTrafficBurst={handleSimulateTrafficBurst}
            simulationEvents={simulationEvents}
            onTestLanding={handleTestLanding}
          />
        )}

        {/* VIEW 4: DEDICATED WORKSHOP B2B PORTAL */}
        {activeTab === 'workshop_portal' && (
          <WorkshopPortal
            onOpenRegister={() => setIsRegisterWorkshopOpen(true)}
            onExploreCatalog={() => {
              setActiveTab('ecommerce');
              const el = document.getElementById('catalogo-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* FLOATING QUICK-CART BUTTON (Accessible across the entire site) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsCartOpen(true)}
          aria-label="Abrir Carrito de Compras"
          className="flex items-center gap-3 py-3 px-4.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-slate-900 group"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-slate-950" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2.5 -right-2.5 bg-slate-950 text-amber-400 text-[10px] font-mono font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-amber-400 shadow-sm">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-xs font-black uppercase tracking-wider hidden sm:inline">
            Carrito Taller
          </span>
          {cartTotalWorkshop > 0 && (
            <span className="bg-slate-950 text-amber-400 font-mono text-xs px-2 py-0.5 rounded-full font-bold tabular-nums">
              S/ {cartTotalWorkshop.toFixed(2)}
            </span>
          )}
        </button>
      </div>

      {/* Administrator Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
      />

      {/* Cart Drawer Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onViewInSalesManager={() => {
          handleTabChange('sales');
        }}
        isAdmin={isAdminAuthenticated}
      />

      {/* Workshop Registration Modal */}
      <WorkshopRegisterModal
        isOpen={isRegisterWorkshopOpen}
        onClose={() => setIsRegisterWorkshopOpen(false)}
        onRegister={handleRegisterWorkshop}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">AutoRepuestos Pro</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Comercio Electrónico y Gestión B2B para Talleres Mecánicos</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono">
            <span>Despacho Express 2 Horas</span>
            <span>·</span>
            <span>Garantía Homologada OEM</span>
            <span>·</span>
            <span>© 2026 AutoRepuestos Pro</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
