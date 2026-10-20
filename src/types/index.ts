export interface Product {
  id: string;
  name: string;
  category: 'frenos' | 'suspension' | 'motor' | 'electrico' | 'mantenimiento' | 'transmision';
  brand: string; // e.g., Brembo, Bosch, KYB, Denso, Castrol, Gates
  sku: string;
  oemNumber: string;
  priceRetail: number; // Precio público
  priceWorkshop: number; // Precio exclusivo taller mecánico (B2B)
  stock: number;
  minStockAlert: number;
  image: string;
  compatibleVehicles: {
    make: string;
    model: string;
    years: string;
    engine?: string;
  }[];
  specifications: Record<string, string>;
  warrantyMonths: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  workshopName: string;
  workshopTaxId: string; // RUC / NIT / CIF
  contactPhone: string;
  shippingAddress: string;
  deliveryMethod: 'express_taller' | 'sucursal' | 'estandar';
  paymentMethod: 'credito_taller' | 'transferencia' | 'tarjeta' | 'contra_entrega';
  items: {
    product: Product;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'pendiente' | 'preparando' | 'en_camino' | 'entregado' | 'facturado';
  trafficSource?: string; // e.g. "Google Search - Frenos Urgentes"
  utmCampaign?: string;
}

export interface WorkshopClient {
  id: string;
  name: string;
  taxId: string;
  ownerName: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  discountTier: number; // e.g., 20%
  creditLimit: number;
  creditUsed: number;
  totalOrders: number;
  status: 'activo' | 'verificacion_pendiente' | 'preferencial';
}

export interface TrafficCampaign {
  id: string;
  name: string;
  channel: 'google_search' | 'google_shopping' | 'meta_ads' | 'local_geo' | 'whatsapp_b2b';
  status: 'activa' | 'pausada' | 'optimizando' | 'completada';
  budgetDaily: number;
  spentTotal: number;
  impressions: number;
  clicks: number;
  conversions: number; // Purchases or workshop leads
  revenueGenerated: number;
  ctr: number; // %
  cpc: number; // Cost per click in USD
  roas: number; // Return on Ad Spend (e.g., 4.2x)
  targetAudience: string;
  targetKeywords?: string[];
  adHeadline: string;
  adDescription: string;
  landingUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  adPreviewImage?: string;
}

export interface TrafficSimulationEvent {
  id: string;
  timestamp: string;
  visitorType: 'Taller Mecánico' | 'Mecánico Independiente' | 'Flota Comercial';
  location: string;
  campaignSource: string;
  action: 'visita' | 'busqueda_vehiculo' | 'carrito' | 'pedido_completado';
  details: string;
  orderValue?: number;
}
