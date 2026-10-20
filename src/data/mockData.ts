import { Product, WorkshopClient, TrafficCampaign, Order, TrafficSimulationEvent } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_automotive_parts_1792503333251.jpg';
export const PART_BRAKE_IMAGE = '/src/assets/images/part_brake_system_1792503333351.jpg';
export const PART_SUSPENSION_IMAGE = '/src/assets/images/part_suspension_strut_1792503334366.jpg';
export const PART_ENGINE_IMAGE = '/src/assets/images/part_engine_oil_filter_1792503334673.jpg';
export const CAMPAIGN_WORKSHOP_IMAGE = '/src/assets/images/campaign_ad_workshop_banner_1792503336118.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Discos de Freno Ventilados Perforados de Alto Rendimiento (Par)',
    category: 'frenos',
    brand: 'Brembo Sport',
    sku: 'BRM-09A82011',
    oemNumber: 'OEM-43512-0K090',
    priceRetail: 620.00,
    priceWorkshop: 460.00,
    stock: 28,
    minStockAlert: 8,
    image: PART_BRAKE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2016 - 2024', engine: '2.4 / 2.8 D-4D' },
      { make: 'Toyota', model: 'Fortuner', years: '2016 - 2024', engine: '2.7 / 2.8' },
      { make: 'Toyota', model: 'Land Cruiser Prado', years: '2010 - 2022', engine: '3.0 D4D' }
    ],
    specifications: {
      'Diámetro exterior': '319 mm',
      'Espesor nominal': '28.0 mm',
      'Espesor mínimo': '26.0 mm',
      'Tipo': 'Ventilado con ranurado disipador',
      'Cantidad de orificios': '6 birlos',
      'Material': 'Hierro fundido aleado con alto carbono'
    },
    warrantyMonths: 24,
    rating: 4.9,
    reviewsCount: 42,
    featured: true
  },
  {
    id: 'prod-2',
    name: 'Juego de Pastillas de Freno Cerámicas Ultra-Quiet con Láminas Antirruido',
    category: 'frenos',
    brand: 'Bosch Pro-Stop',
    sku: 'BSH-BP1414',
    oemNumber: 'OEM-04465-0K260',
    priceRetail: 215.00,
    priceWorkshop: 155.00,
    stock: 45,
    minStockAlert: 12,
    image: PART_BRAKE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2016 - 2024', engine: '2.4 / 2.8 D-4D' },
      { make: 'Nissan', model: 'Frontier / NP300', years: '2015 - 2023', engine: '2.5 dCi' },
      { make: 'Ford', model: 'Ranger', years: '2015 - 2023', engine: '2.2 / 3.2 TDCi' }
    ],
    specifications: {
      'Compuesto': 'Cerámica avanzada libre de asbesto',
      'Sensor de desgaste': 'Acústico integrado',
      'Coeficiente de fricción': 'GG (0.45 - 0.55)',
      'Homologación': 'ECE-R90 Certified'
    },
    warrantyMonths: 18,
    rating: 4.8,
    reviewsCount: 38,
    featured: true
  },
  {
    id: 'prod-3',
    name: 'Amortiguador a Gas Reforzado Delantero Bitubo (Unidad)',
    category: 'suspension',
    brand: 'KYB Excel-G',
    sku: 'KYB-341358',
    oemNumber: 'OEM-48510-09Q40',
    priceRetail: 350.00,
    priceWorkshop: 260.00,
    stock: 19,
    minStockAlert: 6,
    image: PART_SUSPENSION_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Corolla', years: '2014 - 2022', engine: '1.8 / 2.0 Dual VVT-i' },
      { make: 'Toyota', model: 'Yaris', years: '2016 - 2023', engine: '1.5 2NR-FE' },
      { make: 'Hyundai', model: 'Elantra', years: '2016 - 2021', engine: '2.0 Nu' }
    ],
    specifications: {
      'Construcción': 'Twin-tube Gas presurizado con nitrógeno',
      'Vástago': 'Cromado duro microfissurado 22mm',
      'Valvulería': 'Triple etapa autoajustable',
      'Posición': 'Eje delantero (izq / der compatible)'
    },
    warrantyMonths: 24,
    rating: 4.9,
    reviewsCount: 56,
    featured: true
  },
  {
    id: 'prod-4',
    name: 'Kit de Mantenimiento Motor: Aceite Sintético 5W-30 (5L) + Filtro Premium',
    category: 'mantenimiento',
    brand: 'Castrol EDGE & Mann-Filter',
    sku: 'KIT-LUB-5W30',
    oemNumber: 'OEM-04152-YZZA6',
    priceRetail: 270.00,
    priceWorkshop: 195.00,
    stock: 52,
    minStockAlert: 15,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'RAV4', years: '2016 - 2024', engine: '2.5 Dynamic Force' },
      { make: 'Honda', model: 'CR-V', years: '2017 - 2023', engine: '1.5 Turbo' },
      { make: 'Mazda', model: 'CX-5', years: '2015 - 2024', engine: '2.0 / 2.5 Skyactiv-G' }
    ],
    specifications: {
      'Viscosidad': 'SAE 5W-30 Full Synthetic Fluid Titanium',
      'Norma API': 'API SP / ILSAC GF-6A / ACEA C3',
      'Volumen de fluido': '5 Litros (Bidón sellado)',
      'Filtro': 'Elemento sintético filtrante con junta tórica HNBR'
    },
    warrantyMonths: 12,
    rating: 5.0,
    reviewsCount: 64,
    featured: true
  },
  {
    id: 'prod-5',
    name: 'Kit de Distribución Completo con Bomba de Agua y Tensor Hidráulico',
    category: 'motor',
    brand: 'Gates PowerGrip Plus',
    sku: 'GTS-KP15669XS',
    oemNumber: 'OEM-13568-19106',
    priceRetail: 795.00,
    priceWorkshop: 590.00,
    stock: 14,
    minStockAlert: 5,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Volkswagen', model: 'Gol / Saveiro', years: '2012 - 2022', engine: '1.6 8V EA111' },
      { make: 'Volkswagen', model: 'Vento', years: '2014 - 2021', engine: '1.6 MPI' },
      { make: 'Chevrolet', model: 'Onix / Prisma', years: '2013 - 2020', engine: '1.4 SPE/4' }
    ],
    specifications: {
      'Contenido': 'Correa sincrónica HNBR + Tensor dinámico + Polea guía + Bomba agua con junta metálica',
      'Dientes': '138 dientes de perfil curvo silencioso',
      'Vida útil recomendada': '80,000 km garantizados para taller'
    },
    warrantyMonths: 24,
    rating: 4.9,
    reviewsCount: 31,
    featured: false
  },
  {
    id: 'prod-6',
    name: 'Juego de 4 Bujías de Iridio Doble Punta Long-Life',
    category: 'electrico',
    brand: 'Denso Iridium TT',
    sku: 'DNS-IK20TT',
    oemNumber: 'OEM-90919-01210',
    priceRetail: 165.00,
    priceWorkshop: 115.00,
    stock: 75,
    minStockAlert: 20,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Nissan', model: 'Versa / Tiida', years: '2012 - 2022', engine: '1.6 HR16DE' },
      { make: 'Kia', model: 'Rio / Cerato', years: '2015 - 2022', engine: '1.4 / 1.6 Gamma' },
      { make: 'Hyundai', model: 'Accent', years: '2014 - 2022', engine: '1.4 / 1.6 Kappa' }
    ],
    specifications: {
      'Electrodo central': 'Iridio ultrafino 0.4 mm',
      'Electrodo de masa': 'Platino 0.7 mm',
      'Calibración': '1.1 mm (Precalibrada de fábrica)',
      'Durabilidad': 'Hasta 120,000 km'
    },
    warrantyMonths: 12,
    rating: 4.8,
    reviewsCount: 47,
    featured: false
  },
  {
    id: 'prod-7',
    name: 'Kit de Embrague Reforzado de 3 Piezas (Disco, Plato y Rodamiento de Empuje)',
    category: 'transmision',
    brand: 'Valeo Service',
    sku: 'VAL-826842',
    oemNumber: 'OEM-3000-951-098',
    priceRetail: 690.00,
    priceWorkshop: 515.00,
    stock: 11,
    minStockAlert: 4,
    image: PART_BRAKE_IMAGE,
    compatibleVehicles: [
      { make: 'Ford', model: 'Ranger', years: '2013 - 2022', engine: '2.2 Duratorq TDCi' },
      { make: 'Chevrolet', model: 'D-Max', years: '2014 - 2021', engine: '2.5 / 3.0 TD' },
      { make: 'Nissan', model: 'Navara', years: '2014 - 2020', engine: '2.5 YD25' }
    ],
    specifications: {
      'Diámetro': '260 mm',
      'Estrías': '23 dientes',
      'Tecnología': 'Disco con muelles amortiguadores reforzados para trabajo pesado',
      'Rodamiento': 'Cojinete hidráulico concéntrico incluido'
    },
    warrantyMonths: 18,
    rating: 4.7,
    reviewsCount: 22,
    featured: false
  },
  {
    id: 'prod-8',
    name: 'Terminal y Barra de Dirección Reforzada Heavy Duty (Par Delantero)',
    category: 'suspension',
    brand: 'Moog Problem Solver',
    sku: 'MOG-ES3488',
    oemNumber: 'OEM-45046-09261',
    priceRetail: 230.00,
    priceWorkshop: 165.00,
    stock: 33,
    minStockAlert: 10,
    image: PART_SUSPENSION_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2012 - 2023', engine: 'Todas versiones' },
      { make: 'Mitsubishi', model: 'L200', years: '2015 - 2024', engine: '2.4 DI-D' },
      { make: 'Isuzu', model: 'D-Max', years: '2016 - 2023', engine: '3.0 Ddi' }
    ],
    specifications: {
      'Material': 'Acero forjado con tratamiento térmico antidesgaste',
      'Engrasador': 'Grasera Zerk incorporada para servicio continuo en taller',
      'Rosca': 'M14 x 1.5'
    },
    warrantyMonths: 24,
    rating: 4.9,
    reviewsCount: 19,
    featured: false
  },
  {
    id: 'prod-9',
    name: 'Kit de Tambores y Balatas de Freno Traseras Heavy Duty (Juego Completo)',
    category: 'frenos',
    brand: 'Ferodo Premier',
    sku: 'FRD-FSB612',
    oemNumber: 'OEM-42431-0K120',
    priceRetail: 540.00,
    priceWorkshop: 395.00,
    stock: 22,
    minStockAlert: 6,
    image: PART_BRAKE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2015 - 2024', engine: '2.4 / 2.8 D-4D' },
      { make: 'Toyota', model: 'Fortuner', years: '2016 - 2023', engine: '2.7 / 2.8' },
      { make: 'Mitsubishi', model: 'L200', years: '2016 - 2024', engine: '2.4 DI-D' }
    ],
    specifications: {
      'Diámetro del tambor': '295 mm',
      'Ancho de pista de fricción': '55 mm',
      'Material balatas': 'Compuesto semimetálico de alta disipación térmica',
      'Incluye': 'Resortes de retorno y kit de seguros de anclaje para taller'
    },
    warrantyMonths: 18,
    rating: 4.8,
    reviewsCount: 29,
    featured: true
  },
  {
    id: 'prod-10',
    name: 'Caliper / Mordaza de Freno Hidráulica Delantera OEM (Lado Izquierdo / Derecho)',
    category: 'frenos',
    brand: 'Akebono Japan',
    sku: 'AKB-CA7721',
    oemNumber: 'OEM-47730-0K061',
    priceRetail: 660.00,
    priceWorkshop: 490.00,
    stock: 16,
    minStockAlert: 5,
    image: PART_BRAKE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2016 - 2024', engine: '2.8 D-4D 4x4' },
      { make: 'Toyota', model: 'Land Cruiser Prado', years: '2012 - 2022', engine: '3.0 / 4.0' },
      { make: 'Ford', model: 'Ranger', years: '2016 - 2023', engine: '3.2 Duratorq' }
    ],
    specifications: {
      'Pistones': '4 pistones de acero templado anticorrosión',
      'Diámetro de pistón': '45 mm',
      'Purgador': 'Válvula M10x1.0 de purga rápida con guardapolvo',
      'Recubrimiento': 'Tratamiento zinc-niquel contra óxido y calor extremo'
    },
    warrantyMonths: 24,
    rating: 4.9,
    reviewsCount: 17,
    featured: false
  },
  {
    id: 'prod-11',
    name: 'Juego de Trapecios Superiores de Suspensión con Rótula y Bujes Vulcanizados',
    category: 'suspension',
    brand: 'TRW Automotive',
    sku: 'TRW-JTC1290',
    oemNumber: 'OEM-48610-0K040',
    priceRetail: 580.00,
    priceWorkshop: 425.00,
    stock: 20,
    minStockAlert: 6,
    image: PART_SUSPENSION_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2015 - 2024', engine: 'Todos los motores' },
      { make: 'Toyota', model: 'Fortuner', years: '2016 - 2024', engine: '2.7 / 2.8' },
      { make: 'Nissan', model: 'Frontier / NP300', years: '2016 - 2023', engine: '2.5 dCi' }
    ],
    specifications: {
      'Tipo': 'Brazo oscilante triangular de acero forjado reforzado',
      'Bujes': 'Goma natural elastomérica de alta absorción de vibración',
      'Rótula': 'Sellada con grasa sintética para 100,000 km sin mantención'
    },
    warrantyMonths: 24,
    rating: 4.9,
    reviewsCount: 33,
    featured: true
  },
  {
    id: 'prod-12',
    name: 'Bieletas y Kit de Barras Estabilizadoras Delanteras Reforzadas (Par)',
    category: 'suspension',
    brand: 'Lemförder Germany',
    sku: 'LMF-3694001',
    oemNumber: 'OEM-48820-0K030',
    priceRetail: 180.00,
    priceWorkshop: 125.00,
    stock: 58,
    minStockAlert: 15,
    image: PART_SUSPENSION_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Corolla', years: '2014 - 2023', engine: '1.8 / 2.0 Dual VVT-i' },
      { make: 'Toyota', model: 'Yaris', years: '2016 - 2024', engine: '1.5 2NR-FE' },
      { make: 'Honda', model: 'Civic', years: '2016 - 2022', engine: '1.5T / 2.0' },
      { make: 'Hyundai', model: 'Elantra', years: '2015 - 2022', engine: '1.6 / 2.0' }
    ],
    specifications: {
      'Longitud': '285 mm',
      'Rosca de unión': 'M12 x 1.25',
      'Articulación': 'Rótula esferoidal con guardapolvos de cloropreno reforzado'
    },
    warrantyMonths: 18,
    rating: 4.8,
    reviewsCount: 45,
    featured: false
  },
  {
    id: 'prod-13',
    name: 'Bomba de Agua de Alto Caudal con Turbina de Bronce y Junta Sellante',
    category: 'motor',
    brand: 'Aisin Japan OEM',
    sku: 'AIS-WPT190',
    oemNumber: 'OEM-16100-09600',
    priceRetail: 420.00,
    priceWorkshop: 310.00,
    stock: 24,
    minStockAlert: 7,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2016 - 2024', engine: '1GD-FTV 2.8 / 2GD 2.4' },
      { make: 'Toyota', model: 'Fortuner', years: '2016 - 2024', engine: '2.4 / 2.8 Diesel' },
      { make: 'Toyota', model: 'Land Cruiser Prado', years: '2015 - 2023', engine: '2.8 D-4D' }
    ],
    specifications: {
      'Carcasa': 'Aluminio inyectado a presión con tolerancias micrométricas',
      'Rotor': 'Turbina de aleación de bronce de 7 palas hidrodinámicas',
      'Sello mecánico': 'Cerámica con carburo de silicio hermético'
    },
    warrantyMonths: 24,
    rating: 5.0,
    reviewsCount: 39,
    featured: true
  },
  {
    id: 'prod-14',
    name: 'Junta de Culata Multilámina de Acero Inoxidable MLS (Espesor OEM)',
    category: 'motor',
    brand: 'Victor Reinz',
    sku: 'VRZ-613768000',
    oemNumber: 'OEM-11115-0L030',
    priceRetail: 320.00,
    priceWorkshop: 230.00,
    stock: 26,
    minStockAlert: 8,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2015 - 2023', engine: '2.8 1GD / 2.4 2GD' },
      { make: 'Ford', model: 'Ranger', years: '2014 - 2022', engine: '2.2 / 3.2 TDCi' },
      { make: 'Volkswagen', model: 'Amarok', years: '2012 - 2022', engine: '2.0 BiTDI' }
    ],
    specifications: {
      'Capas': '3 láminas de acero elástico con cordón elastomérico Viton',
      'Resistencia térmica': 'Hasta 1,150 °C bajo presiones de sobrealimentación turbo',
      'Homologación': 'ISO/TS 16949 Automotive Supplier Grade'
    },
    warrantyMonths: 12,
    rating: 4.9,
    reviewsCount: 28,
    featured: false
  },
  {
    id: 'prod-15',
    name: 'Juego de 4 Bobinas de Encendido Directo High-Energy Individuales',
    category: 'electrico',
    brand: 'NGK Laser Spark',
    sku: 'NGK-U5014',
    oemNumber: 'OEM-90919-02258',
    priceRetail: 495.00,
    priceWorkshop: 365.00,
    stock: 32,
    minStockAlert: 9,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Corolla', years: '2014 - 2022', engine: '1.8 2ZR-FE' },
      { make: 'Toyota', model: 'RAV4', years: '2015 - 2021', engine: '2.0 / 2.5' },
      { make: 'Nissan', model: 'Versa / Tiida', years: '2013 - 2021', engine: '1.6 HR16DE' },
      { make: 'Honda', model: 'Civic', years: '2014 - 2021', engine: '1.8 / 2.0 i-VTEC' }
    ],
    specifications: {
      'Tensión secundaria': '35,000 Voltios de chispa sostenida',
      'Capuchón': 'Silicona reforzada con resistencia dieléctrica de alta temperatura',
      'Conector': '4 pines dorados con sello hermético IP67'
    },
    warrantyMonths: 18,
    rating: 4.8,
    reviewsCount: 36,
    featured: false
  },
  {
    id: 'prod-16',
    name: 'Batería Automotriz AGM Start-Stop 12V 70Ah 760A CCA (Libre de Mantención)',
    category: 'electrico',
    brand: 'Varta Silver Dynamic AGM',
    sku: 'VRT-A760AGM',
    oemNumber: 'OEM-28800-YZZJA',
    priceRetail: 740.00,
    priceWorkshop: 550.00,
    stock: 18,
    minStockAlert: 6,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Volkswagen', model: 'Gol / Saveiro', years: '2016 - 2023', engine: '1.6 MSI' },
      { make: 'Volkswagen', model: 'Vento', years: '2015 - 2022', engine: '1.6 TDI / TSI' },
      { make: 'Ford', model: 'Ranger', years: '2016 - 2023', engine: '2.2 / 3.2' },
      { make: 'Toyota', model: 'RAV4', years: '2016 - 2024', engine: '2.5 Híbrido / Nafta' }
    ],
    specifications: {
      'Tecnología': 'Absorbent Glass Mat (AGM) para ciclos 3x más exigentes',
      'Capacidad nominal': '70 Ah / Arranque en frío: 760 Amperios (EN)',
      'Medidas': '278 x 175 x 190 mm (Estándar Europeo DIN L3)'
    },
    warrantyMonths: 24,
    rating: 5.0,
    reviewsCount: 51,
    featured: true
  },
  {
    id: 'prod-17',
    name: 'Filtro de Combustible Diésel Common Rail de Doble Etapa con Sensor de Agua',
    category: 'mantenimiento',
    brand: 'Delphi Technologies',
    sku: 'DLP-HDF962',
    oemNumber: 'OEM-23390-0L050',
    priceRetail: 155.00,
    priceWorkshop: 110.00,
    stock: 65,
    minStockAlert: 20,
    image: PART_ENGINE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2015 - 2024', engine: '2.4 / 2.8 D-4D' },
      { make: 'Toyota', model: 'Fortuner', years: '2016 - 2024', engine: '2.8 Turbo Diesel' },
      { make: 'Chevrolet', model: 'D-Max', years: '2015 - 2023', engine: '2.5 / 3.0 TD' }
    ],
    specifications: {
      'Eficiencia de filtración': '99.8% de partículas $\\ge 2\\,\\mu\\text{m}$',
      'Separación de agua': 'Doble barrera coalescente hidrofóbica',
      'Protección': 'Protege inyectores piezoeléctricos Common Rail a 2,200 bar'
    },
    warrantyMonths: 12,
    rating: 4.9,
    reviewsCount: 48,
    featured: false
  },
  {
    id: 'prod-18',
    name: 'Volante de Inercia Bimasa (Dual-Mass Flywheel) para Transmisión Mecánica',
    category: 'transmision',
    brand: 'LuK RepSet DMF',
    sku: 'LUK-415054310',
    oemNumber: 'OEM-13450-0L011',
    priceRetail: 1560.00,
    priceWorkshop: 1180.00,
    stock: 8,
    minStockAlert: 3,
    image: PART_BRAKE_IMAGE,
    compatibleVehicles: [
      { make: 'Toyota', model: 'Hilux', years: '2015 - 2023', engine: '2.4 / 2.8 1GD-FTV' },
      { make: 'Ford', model: 'Ranger', years: '2014 - 2022', engine: '2.2 Duratorq 6 vel' },
      { make: 'Nissan', model: 'Frontier / NP300', years: '2015 - 2022', engine: '2.5 dCi' }
    ],
    specifications: {
      'Diseño': 'Bimasa con resorte de arco secundario amortiguador',
      'Orificios de cigüeñal': '8 pernos con espigas de centrado',
      'Equilibrado': 'Balanceado dinámico de fábrica a 6,000 RPM para evitar vibración en ralentí'
    },
    warrantyMonths: 24,
    rating: 5.0,
    reviewsCount: 15,
    featured: true
  }
];

export const INITIAL_CAMPAIGNS: TrafficCampaign[] = [
  {
    id: 'camp-1',
    name: 'Google Search: "Repuestos Urgentes para Talleres" (Despacho 2h)',
    channel: 'google_search',
    status: 'activa',
    budgetDaily: 130.00,
    spentTotal: 2780.00,
    impressions: 18450,
    clicks: 1420,
    conversions: 88,
    revenueGenerated: 32400.00,
    ctr: 7.69,
    cpc: 1.95,
    roas: 11.65,
    targetAudience: 'Mecánicos automotrices, dueños de talleres, jefes de patio en radio 30km',
    targetKeywords: [
      'repuestos urgentes taller lima',
      'pastillas de freno por mayor soles',
      'distribuidora repuestos mecanicos',
      'kit embrague toyota entrega inmediata'
    ],
    adHeadline: 'AutoRepuestos Pro | Despacho a tu Taller en 2 Horas',
    adDescription: 'Catálogo de repuestos originales y OEM para talleres mecánicos. Precios de mayorista con factura, crédito a 30 días y garantía directa.',
    landingUrl: 'https://autorepuestospro.com/catalogo?utm_source=google&utm_medium=cpc&utm_campaign=talleres_urgente',
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'talleres_urgente',
    adPreviewImage: CAMPAIGN_WORKSHOP_IMAGE
  },
  {
    id: 'camp-2',
    name: 'Meta Ads: "Programa Cuenta Taller B2B - Descuentos del 20%"',
    channel: 'meta_ads',
    status: 'activa',
    budgetDaily: 105.00,
    spentTotal: 1920.00,
    impressions: 42300,
    clicks: 1680,
    conversions: 64,
    revenueGenerated: 20580.00,
    ctr: 3.97,
    cpc: 1.14,
    roas: 10.72,
    targetAudience: 'Facebook e Instagram: Intereses en Taller Mecánico, Mecánica Automotriz, Repuestos, Automechanika',
    adHeadline: '¿Tienes un taller mecánico? Ahorra hasta 25% en repuestos con entrega express',
    adDescription: 'Únete a más de 180 talleres afiliados. Stock garantizado en frenos, suspensión y motor con asesor técnico asignado por WhatsApp.',
    landingUrl: 'https://autorepuestospro.com/portal-taller?utm_source=meta&utm_medium=paid_social&utm_campaign=registro_taller',
    utmSource: 'meta',
    utmMedium: 'paid_social',
    utmCampaign: 'registro_taller',
    adPreviewImage: CAMPAIGN_WORKSHOP_IMAGE
  },
  {
    id: 'camp-3',
    name: 'Google Shopping: Catálogo Freno & Suspensión OEM',
    channel: 'google_shopping',
    status: 'activa',
    budgetDaily: 95.00,
    spentTotal: 1540.00,
    impressions: 29800,
    clicks: 980,
    conversions: 52,
    revenueGenerated: 17700.00,
    ctr: 3.28,
    cpc: 1.57,
    roas: 11.49,
    targetAudience: 'Búsquedas de repuestos por número de parte OEM (Hilux, Corolla, Ranger, D-Max)',
    adHeadline: 'Discos Brembo & Amortiguadores KYB - Stock Inmediato para Talleres',
    adDescription: 'Encuentra el repuesto exacto por código de chasis o placa. Envío directo al taller mecánico.',
    landingUrl: 'https://autorepuestospro.com/catalogo?cat=frenos&utm_source=google&utm_medium=shopping&utm_campaign=shopping_frenos',
    utmSource: 'google',
    utmMedium: 'shopping',
    utmCampaign: 'shopping_frenos',
    adPreviewImage: PART_BRAKE_IMAGE
  },
  {
    id: 'camp-4',
    name: 'Geo-Targeting Local: Campaña Radio Taller 20km (Zona Industrial)',
    channel: 'local_geo',
    status: 'optimizando',
    budgetDaily: 68.00,
    spentTotal: 1070.00,
    impressions: 14600,
    clicks: 640,
    conversions: 37,
    revenueGenerated: 12340.00,
    ctr: 4.38,
    cpc: 1.67,
    roas: 11.53,
    targetAudience: 'Ubicaciones de concentración de talleres y servicios mecánicos en la ciudad',
    adHeadline: 'El Repuesto que necesitas en tu elevador hoy mismo',
    adDescription: 'Evita perder clientes por demoras de repuestos. AutoRepuestos Pro te entrega en menos de 120 minutos.',
    landingUrl: 'https://autorepuestospro.com/express?utm_source=local_geo&utm_medium=cpc&utm_campaign=zona_industrial',
    utmSource: 'local_geo',
    utmMedium: 'cpc',
    utmCampaign: 'zona_industrial',
    adPreviewImage: CAMPAIGN_WORKSHOP_IMAGE
  }
];

export const INITIAL_WORKSHOPS: WorkshopClient[] = [
  {
    id: 'ws-1',
    name: 'Taller Mecánico El Pistón de Oro',
    taxId: 'RUC 20549811234',
    ownerName: 'Ing. Carlos Mendoza',
    email: 'contacto@pistondeoro.com',
    phone: '+51 984 551 290',
    city: 'Sector Industrial Norte',
    address: 'Av. Los Mecánicos 420',
    discountTier: 22,
    creditLimit: 17000,
    creditUsed: 4700,
    totalOrders: 34,
    status: 'preferencial'
  },
  {
    id: 'ws-2',
    name: 'Frenos & Suspensión SpeedAuto',
    taxId: 'RUC 20601944882',
    ownerName: 'Roberto Alvarado',
    email: 'gerencia@speedautotaller.com',
    phone: '+51 972 114 839',
    city: 'Zona Sur Automotriz',
    address: 'Calle Las Bielas 108',
    discountTier: 20,
    creditLimit: 11500,
    creditUsed: 3150,
    totalOrders: 19,
    status: 'activo'
  },
  {
    id: 'ws-3',
    name: 'Centro Automotriz Multimarca Precision',
    taxId: 'RUC 20492813941',
    ownerName: 'David H. Vargas',
    email: 'compras@precisionmotors.pe',
    phone: '+51 993 482 101',
    city: 'Parque Industrial Este',
    address: 'Av. Las Industrias 780',
    discountTier: 25,
    creditLimit: 22500,
    creditUsed: 8650,
    totalOrders: 48,
    status: 'preferencial'
  },
  {
    id: 'ws-4',
    name: 'Mecánica Diésel y Camionetas ProServ',
    taxId: 'RUC 20619938210',
    ownerName: 'Manuel Quinteros',
    email: 'manuel@proservdiesel.com',
    phone: '+51 965 330 994',
    city: 'Eje Vial Oeste',
    address: 'Carretera Central Km 4.5',
    discountTier: 18,
    creditLimit: 9500,
    creditUsed: 0,
    totalOrders: 7,
    status: 'activo'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1042',
    orderNumber: 'ARP-2026-1042',
    date: '2026-10-20 09:15',
    workshopName: 'Taller Mecánico El Pistón de Oro',
    workshopTaxId: 'RUC 20549811234',
    contactPhone: '+51 984 551 290',
    shippingAddress: 'Av. Los Mecánicos 420, Taller Principal',
    deliveryMethod: 'express_taller',
    paymentMethod: 'credito_taller',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2,
        unitPrice: 460.00,
        subtotal: 920.00
      },
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 2,
        unitPrice: 155.00,
        subtotal: 310.00
      }
    ],
    subtotal: 1230.00,
    discount: 165.00,
    tax: 221.40,
    total: 1451.40,
    status: 'en_camino',
    trafficSource: 'Google Search: "Repuestos Urgentes para Talleres"',
    utmCampaign: 'talleres_urgente'
  },
  {
    id: 'ord-1041',
    orderNumber: 'ARP-2026-1041',
    date: '2026-10-20 08:30',
    workshopName: 'Frenos & Suspensión SpeedAuto',
    workshopTaxId: 'RUC 20601944882',
    contactPhone: '+51 972 114 839',
    shippingAddress: 'Calle Las Bielas 108',
    deliveryMethod: 'express_taller',
    paymentMethod: 'transferencia',
    items: [
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 4,
        unitPrice: 260.00,
        subtotal: 1040.00
      }
    ],
    subtotal: 1040.00,
    discount: 130.00,
    tax: 187.20,
    total: 1227.20,
    status: 'preparando',
    trafficSource: 'Meta Ads: "Programa Cuenta Taller B2B"',
    utmCampaign: 'registro_taller'
  },
  {
    id: 'ord-1040',
    orderNumber: 'ARP-2026-1040',
    date: '2026-10-19 16:45',
    workshopName: 'Centro Automotriz Multimarca Precision',
    workshopTaxId: 'RUC 20492813941',
    contactPhone: '+51 993 482 101',
    shippingAddress: 'Av. Las Industrias 780',
    deliveryMethod: 'express_taller',
    paymentMethod: 'credito_taller',
    items: [
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 3,
        unitPrice: 195.00,
        subtotal: 585.00
      },
      {
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        unitPrice: 590.00,
        subtotal: 590.00
      }
    ],
    subtotal: 1175.00,
    discount: 185.00,
    tax: 211.50,
    total: 1386.50,
    status: 'entregado',
    trafficSource: 'Google Shopping: Catálogo Freno & Suspensión OEM',
    utmCampaign: 'shopping_frenos'
  }
];

export const INITIAL_SIMULATION_EVENTS: TrafficSimulationEvent[] = [
  {
    id: 'sim-1',
    timestamp: 'Hace 2 min',
    visitorType: 'Taller Mecánico',
    location: 'Lima Norte / Sector Mecánico',
    campaignSource: 'Google Search: talleres_urgente',
    action: 'pedido_completado',
    details: 'Adquirió 2x Discos Brembo Hilux para elevador #3',
    orderValue: 920.00
  },
  {
    id: 'sim-2',
    timestamp: 'Hace 5 min',
    visitorType: 'Mecánico Independiente',
    location: 'Surco / Ate',
    campaignSource: 'Meta Ads: registro_taller',
    action: 'carrito',
    details: 'Agregó Kit Distribución Gates a carrito',
    orderValue: 590.00
  },
  {
    id: 'sim-3',
    timestamp: 'Hace 9 min',
    visitorType: 'Flota Comercial',
    location: 'Callao Puerto',
    campaignSource: 'Local Geo: zona_industrial',
    action: 'busqueda_vehiculo',
    details: 'Filtró por Toyota Hilux 2020 2.8 D-4D',
  },
  {
    id: 'sim-4',
    timestamp: 'Hace 14 min',
    visitorType: 'Taller Mecánico',
    location: 'San Juan de Lurigancho',
    campaignSource: 'Google Shopping: shopping_frenos',
    action: 'visita',
    details: 'Ingreso a ficha técnica Amortiguador KYB',
  }
];
