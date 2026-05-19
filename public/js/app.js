// Khmer Realty front-end logic.
// All state is held in `state`. Re-rendering is triggered by `render()`.

const state = {
  search: '',
  searchCategoryType: 'all',
  category: 'all',           // category strip selection
  listingType: 'sale',       // sale | rent | all
  location: '',
  types: new Set(),          // checkbox / chip
  minPrice: 0,
  maxPrice: 0,
  beds: 'any',
  baths: 'any',
  minArea: 0,
  maxArea: 0,
  features: new Set(),
  sort: 'featured',
  view: 'grid',
  visibleCount: 12,
  favorites: new Set(JSON.parse(localStorage.getItem('khmer-realty:favs') || '[]')),
};

const CATEGORY_ICON = {
  grid:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  building:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M8 10h.01M8 14h.01M12 6h.01M12 10h.01M12 14h.01M16 6h.01M16 10h.01M16 14h.01"/></svg>',
  home:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  castle:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21V8l3-3 3 3v2h3V7l3-3 3 3v3h3v11"/><path d="M9 21v-5h6v5"/></svg>',
  building2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M9 7h6M9 11h6M9 15h6M9 19h6"/></svg>',
  mountain:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  office:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 22h20M5 22V4l9-2v20M14 22V8l5 1v13"/></svg>',
  shop:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18l-1 12H4z"/><path d="M16 9V5a4 4 0 0 0-8 0v4"/></svg>',
  warehouse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V8l9-5 9 5v14"/><path d="M7 22v-7h10v7"/></svg>',
  hotel:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 22V6l9-3 9 3v16"/><path d="M9 22V12h6v10"/></svg>',
};

// ---------- formatting helpers ----------
function fmtPrice(p) {
  if (p >= 1000000) return '$' + (p / 1000000).toFixed(p % 1000000 === 0 ? 0 : 2) + 'M';
  if (p >= 1000)    return '$' + (p / 1000).toFixed(p % 1000 === 0 ? 0 : 1) + 'K';
  return '$' + p.toLocaleString();
}
function fmtPriceFull(p) {
  return '$' + p.toLocaleString();
}
function relTime(days) {
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)   return days + ' days ago';
  if (days < 30)  return Math.floor(days / 7) + ' week' + (Math.floor(days / 7) > 1 ? 's' : '') + ' ago';
  return Math.floor(days / 30) + ' month' + (Math.floor(days / 30) > 1 ? 's' : '') + ' ago';
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- category nav ----------
function renderCategoryNav() {
  const ul = document.getElementById('categoryNav');
  ul.innerHTML = window.CATEGORIES.map(c => `
    <li>
      <button data-cat="${c.id}" class="cat-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${state.category === c.id ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'}">
        <span class="h-4 w-4 inline-block">${CATEGORY_ICON[c.icon] || CATEGORY_ICON.home}</span>
        ${c.label}
      </button>
    </li>
  `).join('');
  ul.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      state.visibleCount = 12;
      renderCategoryNav();
      renderTypeChips();
      render();
    });
  });
}

// ---------- property type chips ----------
function renderTypeChips() {
  const wrap = document.getElementById('filterType');
  const types = window.CATEGORIES.filter(c => c.id !== 'all');
  wrap.innerHTML = types.map(t => `
    <button data-type="${t.id}" class="chip type-chip ${state.types.has(t.id) ? 'chip-active' : ''}">${t.label}</button>
  `).join('');
  wrap.querySelectorAll('.type-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const v = btn.dataset.type;
      if (state.types.has(v)) state.types.delete(v); else state.types.add(v);
      renderTypeChips();
      render();
    });
  });
}

// ---------- filtering ----------
function matchesFilters(p) {
  if (state.listingType !== 'all' && p.listingType !== state.listingType) return false;

  // category strip overrides type chips when not "all"
  if (state.category !== 'all' && p.type !== state.category) return false;

  // type chips
  if (state.types.size && !state.types.has(p.type)) return false;

  // search
  if (state.search) {
    const q = state.search.toLowerCase();
    const haystack = (p.title + ' ' + p.location + ' ' + p.type + ' ' + p.district + ' ' + p.city).toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  // search category dropdown
  if (state.searchCategoryType !== 'all' && p.type !== state.searchCategoryType) return false;

  if (state.location && p.city !== state.location) return false;

  if (state.minPrice && p.price < state.minPrice) return false;
  if (state.maxPrice && p.price > state.maxPrice) return false;

  if (state.beds !== 'any' && p.beds < parseInt(state.beds)) return false;
  if (state.baths !== 'any' && p.baths < parseInt(state.baths)) return false;

  if (state.minArea && p.area < state.minArea) return false;
  if (state.maxArea && p.area > state.maxArea) return false;

  if (state.features.size) {
    for (const f of state.features) if (!p.features.includes(f)) return false;
  }

  return true;
}

function sortListings(arr) {
  const a = [...arr];
  switch (state.sort) {
    case 'newest':     a.sort((x, y) => x.daysAgo - y.daysAgo); break;
    case 'price-asc':  a.sort((x, y) => x.price - y.price); break;
    case 'price-desc': a.sort((x, y) => y.price - x.price); break;
    case 'area-desc':  a.sort((x, y) => y.area - x.area); break;
    case 'featured':
    default:
      a.sort((x, y) => (y.featured - x.featured) || (x.daysAgo - y.daysAgo));
  }
  return a;
}

// ---------- card rendering ----------
function badgesHtml(p) {
  const out = [];
  if (p.featured) out.push('<span class="badge bg-brand-500 text-white">Featured</span>');
  if (p.urgent)   out.push('<span class="badge bg-red-500 text-white">Urgent</span>');
  if (p.verified) out.push('<span class="badge bg-emerald-100 text-emerald-700">Verified</span>');
  out.push(`<span class="badge bg-ink-900/70 text-white">${p.listingType === 'rent' ? 'For Rent' : 'For Sale'}</span>`);
  return out.join('');
}

function specHtml(icon, label) {
  return `<span class="inline-flex items-center gap-1 text-xs text-ink-600">${icon}<span>${label}</span></span>`;
}

function cardHtml(p, opts = {}) {
  const isFav = state.favorites.has(p.id);
  const specs = [];
  if (p.beds > 0)  specs.push(specHtml('<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/></svg>', `${p.beds} bed${p.beds > 1 ? 's' : ''}`));
  if (p.baths > 0) specs.push(specHtml('<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 2-2h2"/><path d="M10 4l2 2"/></svg>', `${p.baths} bath${p.baths > 1 ? 's' : ''}`));
  specs.push(specHtml('<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM3 9h18M9 21V9"/></svg>', `${p.area} m²`));

  return `
    <article data-id="${p.id}" class="card overflow-hidden">
      <div class="relative aspect-[4/3] overflow-hidden bg-ink-100">
        <img src="${p.photos[0]}" alt="${escapeHtml(p.title)}" loading="lazy" class="img-zoom h-full w-full object-cover" />
        <div class="absolute top-2 left-2 flex flex-wrap gap-1">${badgesHtml(p)}</div>
        <button class="fav-btn absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 grid place-items-center hover:bg-white transition shadow-sm" data-id="${p.id}" title="Save">
          <svg class="h-4 w-4 ${isFav ? 'fill-red-500 stroke-red-500' : 'stroke-ink-700'}" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>
        </button>
        <div class="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/60 text-white text-[11px] px-1.5 py-0.5">
          <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
          ${p.photoCount}
        </div>
      </div>
      <div class="p-3">
        <div class="flex items-baseline justify-between gap-2">
          <div class="price text-lg leading-none">${fmtPrice(p.price)}<span class="text-xs text-ink-500 font-medium">${p.priceUnit}</span></div>
          <span class="text-[11px] text-ink-400">${relTime(p.daysAgo)}</span>
        </div>
        <h3 class="mt-1.5 font-semibold text-ink-900 line-clamp-1 group-hover:text-brand-600 transition">${escapeHtml(p.title)}</h3>
        <p class="text-xs text-ink-500 mt-0.5 flex items-center gap-1 line-clamp-1">
          <svg class="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 7-8 12-8 12s-8-5-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escapeHtml(p.location)}
        </p>
        <div class="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 border-t border-ink-100">
          ${specs.join('')}
        </div>
      </div>
    </article>
  `;
}

// ---------- main render ----------
function render() {
  const all = window.LISTINGS;
  const filtered = sortListings(all.filter(matchesFilters));
  document.getElementById('resultCount').textContent = filtered.length.toLocaleString();
  document.getElementById('statListings').textContent = all.length.toLocaleString();
  document.getElementById('liveCount').textContent = (1247 + filtered.length).toLocaleString();

  // Featured (top 3 from filtered)
  const featured = filtered.filter(p => p.featured).slice(0, 3);
  const featSection = document.getElementById('featuredSection');
  const featGrid = document.getElementById('featuredGrid');
  if (featured.length) {
    featSection.classList.remove('hidden');
    featGrid.innerHTML = featured.map(p => cardHtml(p)).join('');
  } else {
    featSection.classList.add('hidden');
    featGrid.innerHTML = '';
  }

  // Rest of listings (exclude featured already shown)
  const rest = filtered.filter(p => !featured.includes(p));
  const visible = rest.slice(0, state.visibleCount);
  const grid = document.getElementById('listingsGrid');
  grid.innerHTML = visible.map(p => cardHtml(p)).join('');

  // Empty state
  const empty = document.getElementById('emptyState');
  empty.classList.toggle('hidden', filtered.length !== 0);

  // Load more visibility
  document.getElementById('loadMoreBtn').classList.toggle('hidden', visible.length >= rest.length);

  // Card click handlers
  grid.querySelectorAll('article[data-id]').forEach(el => bindCard(el));
  featGrid.querySelectorAll('article[data-id]').forEach(el => bindCard(el));

  // List view styling
  applyView();

  // Active filter pills
  renderActivePills();
}

function bindCard(el) {
  el.addEventListener('click', (e) => {
    if (e.target.closest('.fav-btn')) return;
    openModal(el.dataset.id);
  });
  const fav = el.querySelector('.fav-btn');
  if (fav) {
    fav.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFav(fav.dataset.id);
    });
  }
}

function applyView() {
  const grid = document.getElementById('listingsGrid');
  if (state.view === 'list') {
    grid.classList.remove('sm:grid-cols-2', 'xl:grid-cols-3');
    grid.classList.add('grid-cols-1');
    // turn cards into wider list items
    grid.querySelectorAll('article').forEach(a => {
      a.classList.add('sm:flex');
      const img = a.querySelector(':scope > div:first-child');
      img.classList.add('sm:w-72', 'sm:shrink-0');
    });
  } else {
    grid.classList.add('sm:grid-cols-2', 'xl:grid-cols-3');
    grid.classList.remove('grid-cols-1');
  }
}

// ---------- favorites ----------
function toggleFav(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    showToast('Removed from favorites');
  } else {
    state.favorites.add(id);
    showToast('Saved to favorites');
  }
  localStorage.setItem('khmer-realty:favs', JSON.stringify([...state.favorites]));
  render();
}

// ---------- active pills ----------
function renderActivePills() {
  const wrap = document.getElementById('activeFilters');
  const pills = [];
  if (state.search) pills.push({ k: 'search', label: `"${state.search}"` });
  if (state.category !== 'all') pills.push({ k: 'category', label: window.CATEGORIES.find(c => c.id === state.category)?.label || state.category });
  if (state.listingType !== 'all') pills.push({ k: 'listingType', label: state.listingType === 'sale' ? 'For Sale' : 'For Rent' });
  if (state.location) pills.push({ k: 'location', label: state.location });
  state.types.forEach(t => pills.push({ k: 'type:' + t, label: window.CATEGORIES.find(c => c.id === t)?.label || t }));
  if (state.minPrice || state.maxPrice) pills.push({ k: 'price', label: `$${state.minPrice || 0} – $${state.maxPrice || '∞'}` });
  if (state.beds !== 'any') pills.push({ k: 'beds', label: state.beds + '+ beds' });
  if (state.baths !== 'any') pills.push({ k: 'baths', label: state.baths + '+ baths' });
  if (state.minArea || state.maxArea) pills.push({ k: 'area', label: `${state.minArea || 0}–${state.maxArea || '∞'} m²` });
  state.features.forEach(f => pills.push({ k: 'feature:' + f, label: f }));

  wrap.innerHTML = pills.map(p => `
    <button data-key="${p.k}" class="active-pill inline-flex items-center gap-1 rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs font-medium hover:bg-brand-100 transition">
      ${escapeHtml(p.label)}
      <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
  `).join('');
  wrap.querySelectorAll('.active-pill').forEach(btn => {
    btn.addEventListener('click', () => clearOne(btn.dataset.key));
  });
}

function clearOne(key) {
  if (key === 'search') { state.search = ''; document.getElementById('searchInput').value = ''; }
  else if (key === 'category') { state.category = 'all'; renderCategoryNav(); }
  else if (key === 'listingType') { state.listingType = 'all'; updateListingTabs(); }
  else if (key === 'location') { state.location = ''; document.getElementById('filterLocation').value = ''; }
  else if (key.startsWith('type:')) { state.types.delete(key.slice(5)); renderTypeChips(); }
  else if (key === 'price') { state.minPrice = 0; state.maxPrice = 0; document.getElementById('filterMinPrice').value = ''; document.getElementById('filterMaxPrice').value = ''; }
  else if (key === 'beds') { state.beds = 'any'; updateBedChips(); }
  else if (key === 'baths') { state.baths = 'any'; updateBathChips(); }
  else if (key === 'area') { state.minArea = 0; state.maxArea = 0; document.getElementById('filterMinArea').value = ''; document.getElementById('filterMaxArea').value = ''; }
  else if (key.startsWith('feature:')) {
    const f = key.slice(8); state.features.delete(f);
    document.querySelectorAll('.feature-cb').forEach(cb => { if (cb.value === f) cb.checked = false; });
  }
  render();
}

// ---------- chip group helpers ----------
function updateBedChips() {
  document.querySelectorAll('.bed-chip').forEach(b => {
    b.classList.toggle('chip-active', b.dataset.beds === state.beds);
  });
}
function updateBathChips() {
  document.querySelectorAll('.bath-chip').forEach(b => {
    b.classList.toggle('chip-active', b.dataset.baths === state.baths);
  });
}
function updateListingTabs() {
  document.querySelectorAll('.listing-type-tab').forEach(b => {
    const active = b.dataset.listingType === state.listingType;
    b.classList.toggle('bg-brand-500', active);
    b.classList.toggle('text-white', active);
    b.classList.toggle('text-ink-600', !active);
  });
}

// ---------- modal ----------
function openModal(id) {
  const p = window.LISTINGS.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('modal');
  document.getElementById('modalImage').style.backgroundImage = `url(${p.photos[0]})`;
  document.getElementById('modalTitle').textContent = p.title;
  document.getElementById('modalLocation').querySelector('span').textContent = p.location;
  document.getElementById('modalPrice').textContent = fmtPriceFull(p.price);
  document.getElementById('modalPriceUnit').textContent = p.priceUnit ? 'per month' : 'For sale';
  document.getElementById('modalBadges').innerHTML = badgesHtml(p);
  document.getElementById('modalDesc').textContent = p.description;
  document.getElementById('modalPhone').textContent = 'Call ' + p.agent.name;

  const specsEl = document.getElementById('modalSpecs');
  const items = [
    { label: 'Bedrooms', val: p.beds || '—', icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6M3 18h18M7 10V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3"/></svg>' },
    { label: 'Bathrooms', val: p.baths || '—', icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6a2 2 0 0 1 2-2h2"/></svg>' },
    { label: 'Area', val: p.area + ' m²', icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3h18v18H3zM3 9h18M9 21V9"/></svg>' },
    { label: 'Type', val: (window.CATEGORIES.find(c => c.id === p.type)?.label) || p.type, icon: '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>' },
  ];
  specsEl.innerHTML = items.map(s => `
    <div class="rounded-lg border border-ink-100 bg-ink-50 p-3 flex items-center gap-2">
      <span class="text-brand-600">${s.icon}</span>
      <div>
        <div class="text-xs text-ink-500">${s.label}</div>
        <div class="font-semibold text-ink-900">${s.val}</div>
      </div>
    </div>
  `).join('');

  const featEl = document.getElementById('modalFeatures');
  featEl.innerHTML = p.features.length
    ? p.features.map(f => `<span class="chip"><svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>${f}</span>`).join('')
    : '<span class="text-sm text-ink-500">No extra features listed.</span>';

  const thumbsEl = document.getElementById('modalThumbs');
  thumbsEl.innerHTML = p.photos.slice(0, 5).map((url, i) => `
    <button data-i="${i}" class="thumb-btn h-12 w-16 rounded-md overflow-hidden ring-2 ${i === 0 ? 'ring-white' : 'ring-transparent'} hover:ring-white transition">
      <img src="${url}" class="h-full w-full object-cover" />
    </button>
  `).join('');
  thumbsEl.querySelectorAll('.thumb-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('modalImage').style.backgroundImage = `url(${p.photos[btn.dataset.i]})`;
      thumbsEl.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('ring-white'));
      thumbsEl.querySelectorAll('.thumb-btn').forEach(b => b.classList.add('ring-transparent'));
      btn.classList.remove('ring-transparent');
      btn.classList.add('ring-white');
    });
  });

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = '';
}

// ---------- toast ----------
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2200);
}

// ---------- reset ----------
window.resetAllFilters = function () {
  state.search = ''; document.getElementById('searchInput').value = '';
  state.searchCategoryType = 'all'; document.getElementById('searchCategory').value = 'all';
  state.category = 'all';
  state.listingType = 'sale';
  state.location = ''; document.getElementById('filterLocation').value = '';
  state.types.clear();
  state.minPrice = 0; state.maxPrice = 0;
  document.getElementById('filterMinPrice').value = '';
  document.getElementById('filterMaxPrice').value = '';
  state.beds = 'any'; state.baths = 'any';
  state.minArea = 0; state.maxArea = 0;
  document.getElementById('filterMinArea').value = '';
  document.getElementById('filterMaxArea').value = '';
  state.features.clear();
  document.querySelectorAll('.feature-cb').forEach(cb => (cb.checked = false));
  state.sort = 'featured'; document.getElementById('sortBy').value = 'featured';
  state.visibleCount = 12;
  renderCategoryNav(); renderTypeChips(); updateBedChips(); updateBathChips(); updateListingTabs();
  render();
};

// ---------- bind events ----------
function bindEvents() {
  // search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    state.search = e.target.value.trim(); state.visibleCount = 12; render();
  });
  document.getElementById('searchBtn').addEventListener('click', () => {
    state.visibleCount = 12; render();
  });
  document.getElementById('searchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { state.visibleCount = 12; render(); }
  });
  document.getElementById('searchCategory').addEventListener('change', (e) => {
    state.searchCategoryType = e.target.value; state.visibleCount = 12; render();
  });

  // listing type tabs
  document.querySelectorAll('.listing-type-tab').forEach(b => {
    b.addEventListener('click', () => {
      state.listingType = b.dataset.listingType; state.visibleCount = 12;
      updateListingTabs(); render();
    });
  });

  // location
  document.getElementById('filterLocation').addEventListener('change', (e) => {
    state.location = e.target.value; state.visibleCount = 12; render();
  });

  // price
  document.getElementById('filterMinPrice').addEventListener('input', (e) => {
    state.minPrice = parseFloat(e.target.value) || 0; render();
  });
  document.getElementById('filterMaxPrice').addEventListener('input', (e) => {
    state.maxPrice = parseFloat(e.target.value) || 0; render();
  });
  document.querySelectorAll('.price-preset').forEach(b => {
    b.addEventListener('click', () => {
      const min = parseFloat(b.dataset.min) || 0;
      const max = parseFloat(b.dataset.max) || 0;
      state.minPrice = min; state.maxPrice = max;
      document.getElementById('filterMinPrice').value = min || '';
      document.getElementById('filterMaxPrice').value = max || '';
      document.querySelectorAll('.price-preset').forEach(x => x.classList.remove('chip-active'));
      b.classList.add('chip-active');
      render();
    });
  });

  // beds/baths
  document.querySelectorAll('.bed-chip').forEach(b => {
    b.addEventListener('click', () => {
      state.beds = b.dataset.beds; updateBedChips(); render();
    });
  });
  document.querySelectorAll('.bath-chip').forEach(b => {
    b.addEventListener('click', () => {
      state.baths = b.dataset.baths; updateBathChips(); render();
    });
  });

  // area
  document.getElementById('filterMinArea').addEventListener('input', (e) => {
    state.minArea = parseFloat(e.target.value) || 0; render();
  });
  document.getElementById('filterMaxArea').addEventListener('input', (e) => {
    state.maxArea = parseFloat(e.target.value) || 0; render();
  });

  // features
  document.querySelectorAll('.feature-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) state.features.add(cb.value); else state.features.delete(cb.value);
      render();
    });
  });

  // sort + view
  document.getElementById('sortBy').addEventListener('change', (e) => {
    state.sort = e.target.value; render();
  });
  document.getElementById('viewGrid').addEventListener('click', () => {
    state.view = 'grid';
    document.getElementById('viewGrid').classList.add('text-brand-600', 'bg-brand-50');
    document.getElementById('viewGrid').classList.remove('text-ink-500');
    document.getElementById('viewList').classList.remove('text-brand-600', 'bg-brand-50');
    document.getElementById('viewList').classList.add('text-ink-500');
    render();
  });
  document.getElementById('viewList').addEventListener('click', () => {
    state.view = 'list';
    document.getElementById('viewList').classList.add('text-brand-600', 'bg-brand-50');
    document.getElementById('viewList').classList.remove('text-ink-500');
    document.getElementById('viewGrid').classList.remove('text-brand-600', 'bg-brand-50');
    document.getElementById('viewGrid').classList.add('text-ink-500');
    render();
  });

  // load more
  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    state.visibleCount += 12; render();
  });

  // reset
  document.getElementById('resetFilters').addEventListener('click', window.resetAllFilters);

  // language toggle (UI only)
  document.getElementById('langLabel').parentElement.addEventListener('click', () => {
    const el = document.getElementById('langLabel');
    el.textContent = el.textContent === 'EN' ? 'ខ្មែរ' : 'EN';
    showToast('Language switched to ' + el.textContent);
  });

  // post ad
  document.getElementById('postAdBtn').addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Login required to post an ad');
  });

  // modal
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalBackdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

// ---------- init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryNav();
  renderTypeChips();
  updateBedChips();
  updateBathChips();
  updateListingTabs();
  bindEvents();
  render();
});
