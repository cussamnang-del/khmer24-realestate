// Mock property data for Khmer Realty
// Uses Unsplash photos (royalty-free) keyed by topic so cards have consistent imagery.

window.CATEGORIES = [
  { id: 'all',        label: 'All',         icon: 'grid'      },
  { id: 'apartment',  label: 'Apartments',  icon: 'building'  },
  { id: 'house',      label: 'Houses',      icon: 'home'      },
  { id: 'villa',      label: 'Villas',      icon: 'castle'    },
  { id: 'condo',      label: 'Condos',      icon: 'building2' },
  { id: 'land',       label: 'Land',        icon: 'mountain'  },
  { id: 'commercial', label: 'Commercial',  icon: 'briefcase' },
  { id: 'office',     label: 'Office',      icon: 'office'    },
  { id: 'shop',       label: 'Shop / Retail',icon: 'shop'     },
  { id: 'warehouse',  label: 'Warehouse',   icon: 'warehouse' },
  { id: 'hotel',      label: 'Hotel',       icon: 'hotel'     },
];

const IMG = {
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
  ],
  house: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80',
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
  ],
  villa: [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&q=80',
  ],
  condo: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    'https://images.unsplash.com/photo-1551361415-69c87624334f?w=800&q=80',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&q=80',
  ],
  land: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80',
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
  ],
  office: [
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
  ],
  shop: [
    'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80',
    'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80',
  ],
  warehouse: [
    'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80',
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80',
  ],
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
  ],
};

function imgs(type, n = 4) {
  const pool = IMG[type] || IMG.house;
  const arr = [];
  for (let i = 0; i < n; i++) arr.push(pool[i % pool.length]);
  return arr;
}

const LOCATIONS = [
  { city: 'Phnom Penh',    districts: ['BKK1', 'BKK2', 'BKK3', 'Toul Tom Poung', 'Daun Penh', 'Chamkarmon', 'Sen Sok', 'Russian Market', 'Riverside', 'Tonle Bassac'] },
  { city: 'Siem Reap',     districts: ['Old Market', 'Wat Bo', 'Sala Kamreuk', 'Slokram', 'Svay Dangkum'] },
  { city: 'Sihanoukville', districts: ['Otres', 'Independence Beach', 'Serendipity', 'Victory Hill'] },
  { city: 'Battambang',    districts: ['Svay Por', 'Rattanak'] },
  { city: 'Kampot',        districts: ['Riverside', 'Old Town'] },
  { city: 'Kep',           districts: ['Crab Market', 'Beach Road'] },
  { city: 'Kandal',        districts: ['Ta Khmau', 'Kien Svay'] },
];

const TITLES = {
  apartment: [
    'Modern 2BR Apartment with River View',
    'Stunning Penthouse near Russian Market',
    'Cozy Studio in BKK1 - Walk to Everything',
    'Spacious 3-Bedroom Apartment with Balcony',
    'Brand New Apartment - Fully Furnished',
    'Bright Loft Apartment in Heart of City',
    'Family Apartment near International School',
    'Luxury High-Floor Apartment with Pool',
  ],
  house: [
    'Beautiful Family House with Garden',
    'Renovated Khmer-style Wooden House',
    'Modern Townhouse in Quiet Borey',
    'Spacious 4BR House near AEON Mall',
    'Charming House with Private Terrace',
    'New Build House - Move-in Ready',
    'Two-Story Family Home in Borey Peng Huoth',
  ],
  villa: [
    'Luxury Pool Villa - 6 Bedrooms',
    'Modern Villa with Private Garden & Pool',
    'Exclusive Riverside Villa Estate',
    'Grand Villa in Gated Community',
    'Boutique Villa with Spa Facilities',
  ],
  condo: [
    'High-end Condo in The Bridge',
    'Sky Tree Condo - 1BR Premium Unit',
    'Time Square 306 Condo - Furnished',
    'Olympia City Condominium - Top Floor',
    'D Seven Condo - Stunning City View',
  ],
  land: [
    '500m² Land for Sale - Hard Title',
    'Large Plot Near Ring Road - 1200m²',
    'Beachfront Land in Otres - Rare Find',
    'Development Land in Sen Sok - Investment',
    'Agricultural Land - 5 Hectares',
  ],
  commercial: [
    'Commercial Building - 5 Floors',
    'Mixed-use Property in Toul Tom Poung',
    'Restaurant Space on Riverside',
    'Hotel Building for Sale - 30 Rooms',
  ],
  office: [
    'Premium Office Space - Diamond Tower',
    'Co-working Friendly Office in BKK1',
    'Serviced Office Suite - All-Inclusive',
  ],
  shop: [
    'Shophouse in Russian Market - High Foot Traffic',
    'Retail Space on Norodom Boulevard',
    'Corner Shop - Excellent Visibility',
  ],
  warehouse: [
    'Industrial Warehouse 800m² near Port',
    'Logistics Warehouse - Hun Sen Boulevard',
  ],
  hotel: [
    'Boutique Hotel for Sale - 24 Rooms',
    'Beachfront Hotel - Otres Beach',
  ],
};

const FEATURES_POOL = ['parking', 'pool', 'gym', 'furnished', 'balcony', 'security', 'elevator', 'aircon', 'wifi', 'pet-friendly'];
const AGENTS = [
  { name: 'Sophea Lim',      phone: '+855 12 345 678', avatar: 'SL' },
  { name: 'Dara Properties', phone: '+855 17 888 999', avatar: 'DP' },
  { name: 'Bopha Real Estate', phone: '+855 96 555 123', avatar: 'BR' },
  { name: 'Vichea Sok',      phone: '+855 89 222 111', avatar: 'VS' },
  { name: 'Cambodia Homes',  phone: '+855 10 777 888', avatar: 'CH' },
  { name: 'Sothearos Group', phone: '+855 92 333 444', avatar: 'SG' },
];

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function pickN(arr, n) {
  const c = [...arr]; const out = [];
  for (let i = 0; i < n && c.length; i++) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]);
  return out;
}

function priceRange(type, listingType) {
  // returns [min, max] in USD
  if (listingType === 'rent') {
    switch (type) {
      case 'apartment': return [350, 2500];
      case 'house':     return [600, 4000];
      case 'villa':     return [1500, 8000];
      case 'condo':     return [500, 3000];
      case 'land':      return [200, 1500];
      case 'commercial':return [1500, 12000];
      case 'office':    return [400, 5000];
      case 'shop':      return [600, 4500];
      case 'warehouse': return [800, 6000];
      case 'hotel':     return [3000, 20000];
      default:          return [400, 3000];
    }
  }
  // sale
  switch (type) {
    case 'apartment': return [55000, 280000];
    case 'house':     return [120000, 650000];
    case 'villa':     return [380000, 1500000];
    case 'condo':     return [85000, 350000];
    case 'land':      return [40000, 800000];
    case 'commercial':return [250000, 2200000];
    case 'office':    return [180000, 800000];
    case 'shop':      return [150000, 950000];
    case 'warehouse': return [200000, 1300000];
    case 'hotel':     return [800000, 4500000];
    default:          return [80000, 500000];
  }
}

function makeListing(i) {
  const types = ['apartment','house','villa','condo','land','commercial','office','shop','warehouse','hotel'];
  // weight: more apartments/houses
  const weighted = ['apartment','apartment','apartment','house','house','house','villa','condo','condo','land','commercial','office','shop','warehouse','hotel'];
  const type = pick(weighted);
  const listingType = Math.random() < 0.55 ? 'sale' : 'rent';
  const loc = pick(LOCATIONS);
  const district = pick(loc.districts);
  const [pmin, pmax] = priceRange(type, listingType);
  const price = rand(pmin, pmax);
  const beds = type === 'land' || type === 'warehouse' || type === 'shop' || type === 'office'
    ? 0
    : (type === 'villa' ? rand(3, 6) : type === 'condo' || type === 'apartment' ? rand(1, 4) : rand(2, 5));
  const baths = beds === 0 ? 0 : Math.max(1, beds - rand(0, 1));
  const area = type === 'land'
    ? rand(120, 2000)
    : type === 'villa'
      ? rand(220, 700)
      : type === 'warehouse'
        ? rand(300, 2500)
        : type === 'commercial' || type === 'hotel'
          ? rand(200, 1500)
          : rand(35, 280);
  const title = pick(TITLES[type] || TITLES.house);
  const featCount = type === 'land' ? rand(0, 2) : rand(2, 6);
  const features = pickN(FEATURES_POOL, featCount);
  const photoCount = rand(4, 18);
  const photos = imgs(type, Math.min(photoCount, 6));
  const featured = Math.random() < 0.18;
  const urgent = !featured && Math.random() < 0.08;
  const verified = Math.random() < 0.55;
  const daysAgo = rand(0, 30);
  const agent = pick(AGENTS);

  return {
    id: 'P' + String(10000 + i),
    type,
    listingType,
    title,
    city: loc.city,
    district,
    location: `${district}, ${loc.city}`,
    price,
    priceUnit: listingType === 'rent' ? '/month' : '',
    beds, baths, area,
    features,
    photos,
    photoCount,
    featured, urgent, verified,
    daysAgo,
    agent,
    description: `${title}. Located in ${district}, ${loc.city}. ${beds > 0 ? `Features ${beds} bedroom${beds > 1 ? 's' : ''} and ${baths} bathroom${baths > 1 ? 's' : ''}. ` : ''}Total ${area} m² of well-designed space. ${features.length ? 'Includes ' + features.join(', ') + '. ' : ''}Perfect for ${listingType === 'rent' ? 'renting' : 'long-term investment'} in one of Cambodia's most sought-after areas. Contact the agent for a viewing or more details.`,
  };
}

const listings = [];
for (let i = 0; i < 60; i++) listings.push(makeListing(i));

window.LISTINGS = listings;
