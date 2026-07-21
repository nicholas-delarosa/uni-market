/* ================= API ================= */
  const API_URL = 'http://localhost:3000/api';

  async function apiGet(path) {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`Error al llamar ${path}`);
    return res.json();
  }

  async function apiPost(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Error en POST ${path}`);
    return res.json();
  }

  async function apiPut(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Error en PUT ${path}`);
    return res.json();
  }

  async function apiDelete(path) {
    const res = await fetch(`${API_URL}${path}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Error en DELETE ${path}`);
    return res.json();
  }

  const AUTH_REDIRECT_KEY = 'um_post_login_redirect';
  const AUTH_INTENT_KEY = 'um_auth_intent';
  const GUEST_UNIVERSITY_KEY = 'um_guest_university';
  const GUEST_FAVORITES_KEY = 'um_guest_favorites';

  /* ================= AUTENTICACIÓN ================= */
  let currentUser = null;

  function isEntrepreneurRole(roles = []) {
    return roles.some(r => ['vendedor', 'emprendedor'].includes(String(r).toLowerCase()));
  }

  function isAuthenticated() {
    return Boolean(currentUser && currentUser.id);
  }

  function saveAuthIntent(intent) {
    if (!intent) return;
    localStorage.setItem(AUTH_INTENT_KEY, JSON.stringify(intent));
  }

  function getAuthIntent() {
    const raw = localStorage.getItem(AUTH_INTENT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (err) {
      localStorage.removeItem(AUTH_INTENT_KEY);
      return null;
    }
  }

  function clearAuthIntent() {
    localStorage.removeItem(AUTH_INTENT_KEY);
  }

  function loadGuestFavorites() {
    try {
      const stored = JSON.parse(localStorage.getItem(GUEST_FAVORITES_KEY) || '[]');
      return Array.isArray(stored) ? stored.map(id => Number(id)).filter(Boolean) : [];
    } catch (err) {
      localStorage.removeItem(GUEST_FAVORITES_KEY);
      return [];
    }
  }

  function saveGuestFavorites() {
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(state.favorites));
  }

  function redirectToLogin(message, intent = null, options = {}) {
    if (message) alert(message);
    localStorage.setItem(AUTH_REDIRECT_KEY, 'app.html');
    saveAuthIntent(intent);
    const params = new URLSearchParams();
    if (options.mode === 'register') params.set('mode', 'register');
    window.location.href = `login.html${params.toString() ? `?${params.toString()}` : ''}`;
  }

  function requireAuth(message, intent = null, options = {}) {
    if (isAuthenticated()) return true;
    redirectToLogin(message || 'Debes iniciar sesión para continuar.', intent, options);
    return false;
  }

  async function validateAndLoadUser() {
    const savedUser = localStorage.getItem('um_usuario');
    if (!savedUser) {
      return null;
    }

    try {
      const user = JSON.parse(savedUser);

      // 2. Validar contra el backend
      const response = await fetch(`${API_URL}/auth/me/${user.id}`);
      if (!response.ok) {
        localStorage.removeItem('um_usuario');
        return null;
      }

      const data = await response.json();
      currentUser = data.usuario;
      localStorage.setItem('um_usuario', JSON.stringify(currentUser));
      return currentUser;
    } catch (err) {
      console.error('Error validando usuario:', err);
      localStorage.removeItem('um_usuario');
      return null;
    }
  }

  function logout() {
    localStorage.removeItem('um_usuario');
    clearAuthIntent();
    window.location.href = 'login.html';
  }

  // El logo de cada universidad NO vive en la base de datos:
  // son un conjunto fijo de imágenes que ya están en el repo,
  // así que se resuelven acá por nombre.
  const LOGO_FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64">
       <rect width="64" height="64" rx="10" fill="#e9e9f0"/>
     </svg>`
  );
  const LOGOS_UNIVERSIDAD = {
    'Universidad del Norte': '/assets/src/images/UniNorte.png',
    'Costa Universidad':     '/assets/src/images/Logo_cuc.png',
    'Uniautónoma':           '/assets/src/images/Uniautonoma.png',
    'Simón Bolívar':         '/assets/src/images/Simon Bolivar.png',
    'Universidad Libre':     '/assets/src/images/UniLibre.png',
    'Univ. de Medellín':     '/assets/src/images/UdeMedallo.png',
    'EIA':                   '/assets/src/images/Logo_EIA.png',
    'Bolivariana':           '/assets/src/images/Bolivariana.jpg',
    'U. de Antioquia':       '/assets/src/images/UDEA.jpg',
  };

  /* ================= DATA (se llenan desde la API) ================= */
  let universities = [];
  let sellers = [];
  let products = [];

  /* ================= STATE ================= */
  const state = {
    university: null,
    view: 'catalog',
    search: '',
    category: 'all',
    sellerFilter: null,
    sort: 'relevance',
    favorites: [], // Array de IDs de productos favoritos, se cargará desde BD
    guest: true,
  };

  const fmt = (n) => '$ ' + n.toLocaleString('es-CO');

  /* ================= Selector universidad ================= */
  const uniSelectorScreen = document.getElementById('uniSelectorScreen');
  const appShell = document.getElementById('appShell');
  const uniGrid = document.getElementById('uniGrid');
  const uniSearchInput = document.getElementById('uniSearchInput');
  const uniEmptyNote = document.getElementById('uniEmptyNote');

  function renderUniGrid(filter = '') {
    const list = universities.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()));
    uniGrid.innerHTML = list.map(u => `
      <button class="uni-card" data-uni="${u.id}">
        <img src="${u.logo}" alt="${u.name}" loading="lazy">
        <span>${u.name}</span>
      </button>
    `).join('');
    uniEmptyNote.style.display = list.length ? 'none' : 'block';
    uniGrid.querySelectorAll('.uni-card').forEach(card => {
      card.addEventListener('click', () => selectUniversity(card.dataset.uni));
    });
  }

  uniSearchInput.addEventListener('input', (e) => renderUniGrid(e.target.value));

  async function selectUniversity(id) {
    const uni = universities.find(u => u.id == id);
    if (!uni) return;

    try {
      if (isAuthenticated()) {
        const response = await apiPut(`/auth/universidad/${currentUser.id}`, {
          universidad_id: uni.id
        });
        currentUser = response.usuario;
        localStorage.setItem('um_usuario', JSON.stringify(currentUser));
      } else {
        localStorage.setItem(GUEST_UNIVERSITY_KEY, String(uni.id));
      }

      state.university = uni;
      localStorage.setItem('um_university', id);

      // trae los emprendimientos y productos de ESA universidad desde la API
      [sellers, products] = await Promise.all([
        apiGet(`/emprendimientos?universidad_id=${uni.id}`),
        apiGet(`/productos?universidad_id=${uni.id}`),
      ]);

      if (isAuthenticated()) {
        await loadFavoritos();
      } else {
        state.favorites = loadGuestFavorites();
      }

      uniSelectorScreen.style.display = 'none';
      appShell.style.display = 'flex';
      document.getElementById('sidebarUniImg').src = uni.logo;
      document.getElementById('sidebarUniImg').alt = uni.name;
      document.getElementById('sidebarUniName').textContent = uni.name;
      setView('catalog');
    } catch (err) {
      console.error('Error seleccionando universidad:', err);
      alert('Error al guardar la universidad. Intenta de nuevo.');
    }
  }

  function openUniSelector() {
    if (!isAuthenticated() && state.university && !confirm('Cambiar universidad reiniciará la vista actual.')) {
      return;
    }
    appShell.style.display = 'none';
    uniSelectorScreen.style.display = 'flex';
    uniSearchInput.value = '';
    renderUniGrid();
  }

  /* ================= ENRUTAMIENTO VSTA ================= */
  const content = document.getElementById('content');
  const topbarTitle = document.getElementById('topbarTitle');
  const topbarSubtitle = document.getElementById('topbarSubtitle');
  const topbarSearchWrap = document.getElementById('topbarSearchWrap');
  const searchInput = document.getElementById('searchInput');

  function setView(view) {
    // Special views: cart opens modal instead of changing main view
    if (view === 'cart') {
      document.querySelectorAll('.side-link, .mobile-tabbar a').forEach(el => {
        el.classList.toggle('active', el.dataset.view === view);
      });
      renderCartModal();
      return;
    }

    state.view = view;
    document.querySelectorAll('.side-link, .mobile-tabbar a').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });
    render();
  }

  document.querySelectorAll('.side-link, .mobile-tabbar a, .topbar-user').forEach(el => {
    el.addEventListener('click', (e) => {
      if (el.dataset.route) {
        e.preventDefault();
        window.location.href = el.dataset.route;
        return;
      }
      e.preventDefault();
      setView(el.dataset.view);
    });
  });
  document.getElementById('sidebarUniSwitch').addEventListener('click', openUniSelector);

  searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    renderCatalogGrid();
  });

  function render() {
    if (state.view === 'catalog') {
      topbarTitle.textContent = 'Catálogo';
      topbarSubtitle.textContent = `Productos y servicios en ${state.university.name}`;
      topbarSearchWrap.style.display = 'flex';
      renderCatalog();
    } else if (state.view === 'sellers') {
      topbarTitle.textContent = 'Emprendimientos';
      topbarSubtitle.textContent = `Emprendimientos activos en ${state.university.name}`;
      topbarSearchWrap.style.display = 'none';
      renderSellers();
    } else if (state.view === 'profile') {
      topbarTitle.textContent = 'Mi perfil';
      topbarSubtitle.textContent = '';
      topbarSearchWrap.style.display = 'none';
      if (isAuthenticated()) {
        renderProfile();
      } else {
        renderGuestProfile();
      }
    } else if (state.view === 'favorites') {
      topbarTitle.textContent = 'Favoritos';
      topbarSubtitle.textContent = '';
      topbarSearchWrap.style.display = 'none';
      renderFavorites();
    }
  }

  /* ================= CATALOGO ================= */
  function getUniProducts() {
    return products.filter(p => p.universityId === state.university.id);
  }

  function renderCatalog() {
    const uniProducts = getUniProducts();
    const categories = [...new Set(uniProducts.map(p => p.category))];

    content.innerHTML = `
      <div class="filters-row" id="filtersRow">
        <select id="categorySelect">
          <option value="all">Todas las categorías</option>
          ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
        </select>
        <select id="sortSelect">
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
        <span id="sellerChipWrap"></span>
        <span class="results-count" id="resultsCount"></span>
      </div>
      <div class="product-grid" id="productGrid"></div>
    `;

    document.getElementById('categorySelect').value = state.category;
    document.getElementById('sortSelect').value = state.sort;
    document.getElementById('categorySelect').addEventListener('change', (e) => {
      state.category = e.target.value; renderCatalogGrid();
    });
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      state.sort = e.target.value; renderCatalogGrid();
    });

    renderCatalogGrid();
  }

  function renderCatalogGrid() {
    if (state.view !== 'catalog') return;
    let list = getUniProducts();

    if (state.sellerFilter) list = list.filter(p => p.sellerId == state.sellerFilter);
    if (state.category !== 'all') list = list.filter(p => p.category === state.category);
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (state.sort === 'price-asc') list = [...list].sort((a,b) => a.price - b.price);
    if (state.sort === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);

    const grid = document.getElementById('productGrid');
    const resultsCount = document.getElementById('resultsCount');
    const sellerChipWrap = document.getElementById('sellerChipWrap');

    if (resultsCount) resultsCount.textContent = `${list.length} producto${list.length === 1 ? '' : 's'}`;

    if (sellerChipWrap) {
      if (state.sellerFilter) {
        const seller = sellers.find(s => s.id == state.sellerFilter);
        sellerChipWrap.innerHTML = `
          <span class="filter-chip">Emprendimiento: ${seller ? seller.name : ''}
            <button id="clearSellerFilter">✕</button>
          </span>`;
        document.getElementById('clearSellerFilter').addEventListener('click', () => {
          state.sellerFilter = null; renderCatalogGrid();
        });
      } else {
        sellerChipWrap.innerHTML = '';
      }
    }

    if (!grid) return;

    const oldEmpty = document.getElementById('catalogEmpty');
    if (oldEmpty) oldEmpty.remove();

    if (!list.length) {
      grid.style.display = 'none';
      grid.insertAdjacentHTML('afterend', `
        <div class="empty-state" id="catalogEmpty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <h3>Sin resultados por ahora</h3>
          <p>Todavía no hay productos que coincidan con tu búsqueda en esta universidad. Prueba con otro filtro o vuelve más tarde.</p>
        </div>
      `);
      return;
    }
    grid.style.display = 'grid';

    grid.innerHTML = list.map(p => {
      const seller = sellers.find(s => s.id === p.sellerId);
      const isFav = state.favorites.includes(p.id);
      return `
        <div class="product-card">
          <div class="product-photo" data-open-product="${p.id}">
            <img src="${p.image}" alt="${p.name}">
            <span class="product-cat">${p.category}</span>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-fav="${p.id}">
              <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
            </button>
          </div>
          <div class="product-body">
            <div class="product-name" data-open-product="${p.id}">${p.name}</div>
            <div class="product-seller"><button data-seller="${p.sellerId}">${seller ? seller.name : ''}</button></div>
            <div class="product-price">${fmt(p.price)}</div>
            <button class="btn product-cta" data-add-to-cart="${p.id}">Agregar al carrito</button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-fav]').forEach(btn => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        const id = parseInt(btn.dataset.fav);
        await toggleFavorito(id);
        renderCatalogGrid();
      });
    });
    grid.querySelectorAll('[data-open-product]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const productId = Number(trigger.dataset.openProduct);
        openProductDetail(productId);
      });
    });
    grid.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = parseInt(btn.dataset.addToCart);
        addToCart(productId, 1);
      });
    });
    grid.querySelectorAll('[data-seller]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.sellerFilter = btn.dataset.seller;
        renderCatalogGrid();
      });
    });
  }

  /* ================= EMPRENDEDORES ================= */
  function renderSellers() {
    const list = sellers.filter(s => s.universityId === state.university.id);

    if (!list.length) {
      content.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <h3>Todavía no hay emprendimientos aquí</h3>
          <p>Sé el primer emprendimiento en abrir tienda en ${state.university.name} y aparece frente a toda tu comunidad.</p>
        </div>`;
      return;
    }

    content.innerHTML = `<div class="seller-grid">${list.map(s => `
      <div class="seller-card">
        <div class="seller-top">
          <img class="seller-avatar" src="${s.avatar}" alt="${s.name}">
          <div>
            <div class="seller-name">${s.name}</div>
            <div class="seller-meta">${state.university.name}</div>
          </div>
        </div>
        <div class="seller-tags">${s.categories.map(c => `<span class="seller-tag">${c}</span>`).join('')}</div>
        <div class="seller-stats"><span><b>${s.products}</b> productos</span><span>★ <b>${s.rating}</b></span></div>
        <button class="btn btn-outline seller-cta" data-seller-view="${s.id}">Ver catálogo</button>
      </div>
    `).join('')}</div>`;

    content.querySelectorAll('[data-seller-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.sellerFilter = btn.dataset.sellerView;
        setView('catalog');
      });
    });
  }

  /* ================= FAVORITOS (vista) ================= */
  function renderFavorites() {
    const favIds = state.favorites.map(id => Number(id));
    const favProducts = products.filter(p => favIds.includes(p.id));

    content.innerHTML = `
      <div class="filters-row">
        <h3>Favoritos</h3>
      </div>
      <div class="product-grid" id="favoritesGrid"></div>
    `;

    const grid = document.getElementById('favoritesGrid');
    if (!favProducts.length) {
      grid.style.display = 'block';
      grid.innerHTML = `
        <div class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/></svg>
          <h3>No tienes favoritos todavía</h3>
          <p>Guarda productos tocando el corazón en el catálogo.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = favProducts.map(p => `
      <div class="product-card">
        <div class="product-photo" data-open-product="${p.id}">
          <img src="${p.image}" alt="${p.name}">
          <span class="product-cat">${p.category}</span>
          <button class="fav-btn active" data-fav="${p.id}">
            <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
          </button>
        </div>
        <div class="product-body">
          <div class="product-name" data-open-product="${p.id}">${p.name}</div>
          <div class="product-seller"><button data-seller="${p.sellerId}">${p.sellerName || ''}</button></div>
          <div class="product-price">${fmt(p.price)}</div>
          <button class="btn product-cta" data-add-to-cart="${p.id}">Agregar al carrito</button>
        </div>
      </div>
    `).join('');

    // Listeners
    grid.querySelectorAll('[data-fav]').forEach(btn => {
      btn.addEventListener('click', async (event) => {
        event.stopPropagation();
        const id = Number(btn.dataset.fav);
        await toggleFavorito(id);
        renderFavorites();
      });
    });

    grid.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = Number(btn.dataset.addToCart);
        addToCart(productId, 1);
      });
    });

    grid.querySelectorAll('[data-open-product]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const productId = Number(trigger.dataset.openProduct);
        openProductDetail(productId);
      });
    });
  }

  /* ================= PERFIL ================= */
  function renderProfile() {
    const favIds = [...state.favorites];
    const favProducts = products.filter(p => favIds.includes(p.id));

    // Calcular iniciales para el avatar
    const initials = (currentUser.nombre || 'U').charAt(0).toUpperCase() +
                     (currentUser.apellido || '').charAt(0).toUpperCase();
    
    const role = currentUser.roles && currentUser.roles.length > 0 
      ? currentUser.roles[0] 
      : 'Usuario';

    content.innerHTML = `
      <div class="profile-wrap">
        <div class="profile-card">
          <div class="avatar-lg">${initials}</div>
          <div>
            <h3 class="profile-name">${currentUser.nombre} ${currentUser.apellido}</h3>
            <div class="profile-sub">${currentUser.correo} · ${role}</div>
            <span class="profile-uni-tag">
              <img src="${state.university.logo}" alt="" loading="lazy">
              ${state.university.name}
            </span>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-box"><b>${favProducts.length}</b><span>Favoritos</span></div>
          <div class="stat-box"><b id="pedidosCount">0</b><span>Pedidos</span></div>
          <div class="stat-box"><b id="totalGastado">$0</b><span>Invertido</span></div>
        </div>

        <div class="profile-section">
          <h3>Historial de compras</h3>
          <div id="pedidosContainer">
            <p style="color: var(--color-text-muted); text-align: center; padding: 20px;">Cargando...</p>
          </div>
        </div>

        <div class="profile-section">
          <h3>Tus favoritos</h3>
          ${favProducts.length ? `
            <div class="profile-fav-list">
              ${favProducts.map(p => `
                <div class="profile-fav-item">
                  <img src="${p.image}" alt="${p.name}">
                  <span class="name">${p.name}</span>
                  <span class="price">${fmt(p.price)}</span>
                </div>
              `).join('')}
            </div>
          ` : `<p class="profile-fav-empty">Aún no has guardado productos. Toca el corazón en el catálogo para guardarlos aquí.</p>`}
        </div>

        <div class="profile-section">
          <h3>Cuenta</h3>
          <div class="profile-actions">
            <button class="btn btn-outline btn-sm" id="profileSwitchUni">Cambiar universidad</button>
            <button class="btn btn-outline btn-sm" id="profileLogout">Cerrar Sesión</button>
            <button class="btn btn-outline btn-sm">Editar perfil</button>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('profileSwitchUni').addEventListener('click', openUniSelector);
    document.getElementById('profileLogout').addEventListener('click', logout);
    
    // Cargar historial de pedidos
    loadUserPedidos();
  }

  function renderGuestProfile() {
    content.innerHTML = `
      <div class="profile-wrap">
        <div class="profile-card">
          <div class="avatar-lg">I</div>
          <div>
            <h3 class="profile-name">Modo invitado</h3>
            <div class="profile-sub">Puedes explorar el marketplace libremente y comprar cuando inicies sesión.</div>
          </div>
        </div>

        <div class="profile-section">
          <h3>Tu acceso actual</h3>
          <p class="profile-fav-empty">Puedes recorrer el catálogo, buscar productos, revisar emprendimientos, guardar favoritos temporales y preparar tu carrito.</p>
        </div>

        <div class="profile-section">
          <h3>Cuando quieras comprar</h3>
          <div class="profile-actions">
            <button class="btn btn-outline btn-sm" id="guestGoLogin">Iniciar sesión</button>
            <button class="btn btn-outline btn-sm" id="guestGoRegister">Crear cuenta</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('guestGoLogin').addEventListener('click', () => redirectToLogin('', { type: 'view', view: 'profile' }));
    document.getElementById('guestGoRegister').addEventListener('click', () => redirectToLogin('', { type: 'view', view: 'profile' }, { mode: 'register' }));
  }

  async function loadUserPedidos() {
    try {
      const pedidos = await apiGet(`/pedidos?usuario_id=${currentUser.id}`);
      
      const container = document.getElementById('pedidosContainer');
      const countEl = document.getElementById('pedidosCount');
      const totalEl = document.getElementById('totalGastado');
      
      if (pedidos.length === 0) {
        container.innerHTML = `
          <p style="color: var(--color-text-muted); text-align: center; padding: 20px;">
            Aún no tienes pedidos. ¡Comienza a comprar!
          </p>
        `;
        countEl.textContent = '0';
        totalEl.textContent = '$0';
      } else {
        // Calcular totales
        const totalGastado = pedidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0);
        countEl.textContent = pedidos.length;
        totalEl.textContent = fmt(totalGastado);
        
        // Renderizar pedidos
        container.innerHTML = `
          <div style="display: grid; gap: 12px;">
            ${pedidos.map(pedido => `
              <div style="
                padding: 16px;
                border: 1px solid var(--color-border);
                border-radius: 8px;
                background: var(--color-surface);
              ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <div>
                    <div style="font-weight: 600;">Pedido #${pedido.id}</div>
                    <div style="font-size: 12px; color: var(--color-text-muted);">
                      ${new Date(pedido.fecha).toLocaleDateString('es-CO')}
                    </div>
                  </div>
                  <span style="
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                    background: ${
                      pedido.estado === 'entregado' ? 'var(--color-green-soft)' :
                      pedido.estado === 'confirmado' ? 'var(--color-mint-soft)' :
                      pedido.estado === 'pendiente' ? 'var(--color-amber-soft)' :
                      'var(--color-red-soft)'
                    };
                    color: ${
                      pedido.estado === 'entregado' ? 'var(--color-green)' :
                      pedido.estado === 'confirmado' ? 'var(--color-mint)' :
                      pedido.estado === 'pendiente' ? 'var(--color-amber)' :
                      'var(--color-red)'
                    };
                  ">${pedido.estado}</span>
                </div>
                <div style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 8px;">
                  ${pedido.productos}
                </div>
                <div style="font-weight: 600; font-size: 16px;">
                  ${fmt(pedido.total)}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      }
    } catch (err) {
      console.error('Error cargando pedidos:', err);
      const container = document.getElementById('pedidosContainer');
      container.innerHTML = `
        <p style="color: var(--color-red); text-align: center; padding: 20px;">
          Error cargando el historial de compras
        </p>
      `;
    }
  }

  /* ================= INIT ================= */
  async function init() {
    const user = await validateAndLoadUser();
    state.guest = !user;

    universities = await apiGet('/universidades');
    universities = universities.map(u => ({
      ...u,
      logo: LOGOS_UNIVERSIDAD[u.name] || LOGO_FALLBACK,
    }));

    updateTopbar();
    updateCartBadge();

    if (currentUser && currentUser.universidad_id) {
      const userUni = universities.find(u => u.id === currentUser.universidad_id);
      if (userUni) {
        state.university = userUni;
        localStorage.setItem('um_university', userUni.id);
        
        // Cargar datos de la universidad
        [sellers, products] = await Promise.all([
          apiGet(`/emprendimientos?universidad_id=${userUni.id}`),
          apiGet(`/productos?universidad_id=${userUni.id}`),
        ]);

        await loadFavoritos();

        uniSelectorScreen.style.display = 'none';
        appShell.style.display = 'flex';
        document.getElementById('sidebarUniImg').src = userUni.logo;
        document.getElementById('sidebarUniImg').alt = userUni.name;
        document.getElementById('sidebarUniName').textContent = userUni.name;
        setView('catalog');
      } else {
        renderUniGrid();
      }
    } else {
      const guestUniversityId = localStorage.getItem(GUEST_UNIVERSITY_KEY);
      const defaultUni = universities.find(u => String(u.id) === String(guestUniversityId)) || universities[0] || null;

      if (defaultUni) {
        state.university = defaultUni;
        [sellers, products] = await Promise.all([
          apiGet(`/emprendimientos?universidad_id=${defaultUni.id}`),
          apiGet(`/productos?universidad_id=${defaultUni.id}`),
        ]);

        state.favorites = loadGuestFavorites();
        uniSelectorScreen.style.display = 'none';
        appShell.style.display = 'flex';
        document.getElementById('sidebarUniImg').src = defaultUni.logo;
        document.getElementById('sidebarUniImg').alt = defaultUni.name;
        document.getElementById('sidebarUniName').textContent = defaultUni.name;
        setView('catalog');
      } else {
        renderUniGrid();
      }
    }

    handlePostLoginIntent();
  }

  function updateTopbar() {
    const topbarUserName = document.querySelector('.topbar-user-name');
    const topbarUserRole = document.querySelector('.topbar-user-role');
    const avatarSm = document.querySelector('.avatar-sm');
    const sellerPanelLink = document.getElementById('sidebarSellerPanelLink');
    const logoutButton = document.getElementById('sidebarLogout');
    const logoutLabel = logoutButton ? logoutButton.childNodes[logoutButton.childNodes.length - 1] : null;

    if (!currentUser) {
      if (sellerPanelLink) sellerPanelLink.style.display = 'none';
      if (topbarUserName) topbarUserName.textContent = 'Invitado';
      if (topbarUserRole) topbarUserRole.textContent = 'Exploración pública';
      if (avatarSm) avatarSm.textContent = 'I';
      if (logoutButton) {
        logoutButton.onclick = () => redirectToLogin('Inicia sesión para acceder a funciones privadas.');
      }
      if (logoutLabel && logoutLabel.nodeType === Node.TEXT_NODE) {
        logoutLabel.textContent = ' Iniciar sesión';
      }
      return;
    }

    if (sellerPanelLink) {
      sellerPanelLink.style.display = isEntrepreneurRole(currentUser.roles || []) ? '' : 'none';
    }
    
    if (topbarUserName) {
      topbarUserName.textContent = `${currentUser.nombre} ${currentUser.apellido}`.trim();
    }
    
    if (topbarUserRole) {
      const role = currentUser.roles && currentUser.roles.length > 0 
        ? currentUser.roles[0] 
        : 'Usuario';
      topbarUserRole.textContent = role;
    }
    
    if (avatarSm) {
      const initials = (currentUser.nombre || 'U').charAt(0).toUpperCase() +
                       (currentUser.apellido || '').charAt(0).toUpperCase();
      avatarSm.textContent = initials;
    }

    if (logoutButton) {
      logoutButton.onclick = logout;
    }
    if (logoutLabel && logoutLabel.nodeType === Node.TEXT_NODE) {
      logoutLabel.textContent = ' Cerrar sesión';
    }
  }

  init();

  /* ================ CARRITO ============== */
  // Carrito es un array de { productId, cantidad, price, name, image, sellerId }
  let cart = JSON.parse(localStorage.getItem('um_cart') || '[]');

  function saveCart() {
    localStorage.setItem('um_cart', JSON.stringify(cart));
  }

  function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error('Producto no encontrado');
      return;
    }

    // Buscar si el producto ya está en el carrito
    const existing = cart.find(item => item.productId === productId);
    
    if (existing) {
      existing.cantidad += quantity;
    } else {
      cart.push({
        productId,
        cantidad: quantity,
        price: product.price,
        name: product.name,
        image: product.image,
        sellerId: product.sellerId,
        stock: product.stock,
      });
    }
    
    saveCart();
    updateCartBadge();
    showCartNotification();
  }

  function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    saveCart();
    updateCartBadge();
  }

  function updateCartQuantity(productId, cantidad) {
    const item = cart.find(i => i.productId === productId);
    if (item) {
      item.cantidad = Math.max(1, cantidad);
      saveCart();
      updateCartBadge();
    }
  }

  function clearCart() {
    cart = [];
    saveCart();
    updateCartBadge();
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.cantidad), 0);
  }

  function getCartItemsCount() {
    return cart.reduce((sum, item) => sum + item.cantidad, 0);
  }

  function updateCartBadge() {
    // Actualizar badge del carrito si existe en el topbar
    const badge = document.querySelector('.cart-badge');
    const count = getCartItemsCount();
    
    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
      } else {
        badge.style.display = 'none';
      }
    }
  }

  function showCartNotification() {
    // Mostrar notificación de producto agregado
    const count = getCartItemsCount();
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--color-mint);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      font-weight: 600;
    `;
    notification.textContent = `✓ Producto agregado (${count} en carrito)`;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 2500);
  }

  function renderCartModal() {
    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    let modal = document.getElementById('cartModal');

    function buildModal() {
      const modalHtml = `
      <div id="cartModal" style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
        display: flex;
        align-items: flex-end;
      ">
        <div style="
          background: var(--color-surface);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          border-radius: 16px 16px 0 0;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
          margin-left: auto;
          margin-right: auto;
        ">
          <div style="padding:20px;border-bottom:1px solid var(--color-border);display:flex;justify-content:space-between;align-items:center;">
            <h3 style="margin:0;">Carrito de compra</h3>
            <button id="closeCart" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--color-text-muted);">×</button>
          </div>
          <div style="flex:1;overflow-y:auto;padding:20px;" id="cartItems"></div>
          <div style="padding:20px;border-top:1px solid var(--color-border);display:flex;flex-direction:column;gap:12px;">
            <div style="display:flex;justify-content:space-between;font-size:14px;color:var(--color-text-muted);"><span>Subtotal:</span><span id="subtotal">$0</span></div>
            <div style="display:flex;justify-content:space-between;font-size:18px;font-weight:700;"><span>Total:</span><span id="totalCart">$0</span></div>
            <button id="checkoutBtn" class="btn btn-primary" style="width:100%;">Confirmar compra</button>
            <button id="clearCartBtn" class="btn btn-ghost" style="width:100%;color:var(--color-red);">Vaciar carrito</button>
          </div>
        </div>
      </div>`;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
      modal = document.getElementById('cartModal');

      // Delegated listener for item buttons
      const itemsContainer = modal.querySelector('#cartItems');
      itemsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        if (btn.classList.contains('item-qty-btn')) {
          const productId = Number(btn.dataset.product);
          const action = btn.dataset.action;
          const item = cart.find(i => i.productId === productId);
          if (!item) return;
          if (action === 'plus') updateCartQuantity(productId, item.cantidad + 1);
          if (action === 'minus') updateCartQuantity(productId, Math.max(1, item.cantidad - 1));
          updateCartModalContents();
        }
        if (btn.classList.contains('remove-item')) {
          const productId = Number(btn.dataset.product);
          removeFromCart(productId);
          updateCartModalContents();
        }
      });

      // Footer buttons
      modal.querySelector('#closeCart').addEventListener('click', () => modal.remove());
      modal.querySelector('#clearCartBtn').addEventListener('click', () => {
        if (confirm('¿Vaciar el carrito?')) {
          clearCart();
          modal.remove();
        }
      });
      modal.querySelector('#checkoutBtn').addEventListener('click', checkout);
    }

    function updateCartModalContents() {
      if (!modal) return;
      const itemsContainer = modal.querySelector('#cartItems');
      if (!itemsContainer) return;
      if (cart.length === 0) {
        modal.remove();
        updateCartBadge();
        return;
      }
      itemsContainer.innerHTML = cart.map(item => `
        <div style="padding:12px;border:1px solid var(--color-border);border-radius:8px;margin-bottom:12px;display:grid;grid-template-columns:80px 1fr 80px;gap:12px;align-items:center;">
          <img src="${item.image}" alt="${item.name}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;">
          <div>
            <div style="font-weight:600;margin-bottom:4px;">${item.name}</div>
            <div style="font-size:14px;color:var(--color-text-muted);margin-bottom:8px;">${fmt(item.price)} c/u</div>
            <div style="display:flex;gap:8px;align-items:center;">
              <button class="item-qty-btn" data-product="${item.productId}" data-action="minus" style="width:24px;height:24px;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;">−</button>
              <span style="width:20px;text-align:center;">${item.cantidad}</span>
              <button class="item-qty-btn" data-product="${item.productId}" data-action="plus" style="width:24px;height:24px;border:1px solid var(--color-border);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;">+</button>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:600;">${fmt(item.price * item.cantidad)}</div>
            <button class="remove-item" data-product="${item.productId}" style="background:none;border:none;color:var(--color-red);cursor:pointer;font-size:12px;text-decoration:underline;margin-top:8px;">Eliminar</button>
          </div>
        </div>
      `).join('');

      const total = getCartTotal();
      const subtotalEl = modal.querySelector('#subtotal');
      const totalEl = modal.querySelector('#totalCart');
      if (subtotalEl) subtotalEl.textContent = fmt(total);
      if (totalEl) totalEl.textContent = fmt(total);
      updateCartBadge();
    }

    if (!modal) buildModal();
    updateCartModalContents();
  }

  async function checkout() {
    if (!requireAuth('Debes iniciar sesión para completar la compra.', { type: 'checkout' })) return;

    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    // Validación rápida en cliente (mejor verificación la realiza el servidor)
    for (const item of cart) {
      const product = products.find(p => p.id === item.productId);
      if (!product || item.cantidad > product.stock) {
        alert(`${item.name} no tiene suficiente stock (disponible: ${product?.stock || 0})`);
        return;
      }
    }

    try {
      const total = getCartTotal();
      const items = cart.map(item => ({
        producto_id: item.productId,
        cantidad: item.cantidad,
        subtotal: item.price * item.cantidad,
      }));

      // Llamada atómica al servidor: crea transacción, detalle y actualiza inventario
      const res = await fetch(`${API_URL}/pedidos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: currentUser.id, total: total, items }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Error al procesar la compra');
        return;
      }

      clearCart();
      const modal = document.getElementById('cartModal'); if (modal) modal.remove();
      alert('¡Compra confirmada! Revisa tu historial de pedidos.');
      renderProfile();
    } catch (err) {
      console.error('Error en compra:', err);
      alert('Error al procesar la compra. Intenta de nuevo.');
    }
  }

  /* ================ FAVORITOS ============== */
  async function loadFavoritos() {
    try {
      if (!isAuthenticated()) {
        state.favorites = loadGuestFavorites();
        return;
      }

      const favoritos = await apiGet(`/favoritos?usuario_id=${currentUser.id}`);
      state.favorites = favoritos.map(f => Number(f.producto_id));
    } catch (err) {
      console.error('Error cargando favoritos:', err);
      state.favorites = [];
    }
  }

  async function toggleFavorito(productId) {
    if (!isAuthenticated()) {
      const normalizedId = Number(productId);
      if (state.favorites.includes(normalizedId)) {
        state.favorites = state.favorites.filter(id => id !== normalizedId);
      } else {
        state.favorites.push(normalizedId);
      }
      saveGuestFavorites();
      return;
    }

    try {
      if (state.favorites.includes(Number(productId))) {
        // Eliminar de favoritos
        await apiDelete(`/favoritos/${productId}?usuario_id=${currentUser.id}`);
        state.favorites = state.favorites.filter(id => id !== Number(productId));
      } else {
        // Agregar a favoritos
        await apiPost(`/favoritos`, {
          usuario_id: currentUser.id,
          producto_id: productId,
        });
        state.favorites.push(Number(productId));
      }
    } catch (err) {
      console.error('Error actualizando favorito:', err);
      alert('Error al actualizar favoritos');
    }
  }

  function openProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const seller = sellers.find(s => s.id === product.sellerId);
    const existingModal = document.getElementById('productDetailModal');
    if (existingModal) existingModal.remove();

    document.body.insertAdjacentHTML('beforeend', `
      <div id="productDetailModal" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:999;display:flex;align-items:center;justify-content:center;padding:20px;">
        <div style="width:min(560px,100%);background:var(--color-surface);border-radius:18px;overflow:hidden;box-shadow:var(--shadow-card);">
          <img src="${product.image}" alt="${product.name}" style="width:100%;height:260px;object-fit:cover;display:block;">
          <div style="padding:24px;display:grid;gap:12px;">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
              <div>
                <div style="font-size:12px;color:var(--color-text-muted);text-transform:uppercase;letter-spacing:.04em;">${product.category || 'Producto'}</div>
                <h3 style="margin:6px 0 0;font-size:24px;">${product.name}</h3>
              </div>
              <button id="closeProductDetail" style="background:none;border:none;font-size:24px;cursor:pointer;color:var(--color-text-muted);">×</button>
            </div>
            <div style="color:var(--color-text-muted);">${seller ? seller.name : 'Emprendimiento universitario'}</div>
            <div style="font-size:26px;font-weight:700;">${fmt(product.price)}</div>
            <div style="color:var(--color-text-muted);">Disponibles: ${product.stock ?? 0}</div>
            <div style="display:flex;gap:12px;">
              <button class="btn product-cta" id="detailAddToCart">Agregar al carrito</button>
              <button class="btn btn-outline" id="detailToggleFavorite">${state.favorites.includes(product.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}</button>
            </div>
          </div>
        </div>
      </div>
    `);

    const detailModal = document.getElementById('productDetailModal');
    detailModal.addEventListener('click', (event) => {
      if (event.target === detailModal) detailModal.remove();
    });
    document.getElementById('closeProductDetail').addEventListener('click', () => detailModal.remove());
    document.getElementById('detailAddToCart').addEventListener('click', () => {
      addToCart(product.id, 1);
      if (isAuthenticated()) detailModal.remove();
    });
    document.getElementById('detailToggleFavorite').addEventListener('click', async () => {
      await toggleFavorito(product.id);
      if (detailModal.isConnected) detailModal.remove();
      if (state.view === 'catalog') renderCatalogGrid();
      if (state.view === 'favorites') renderFavorites();
    });
  }

  function handlePostLoginIntent() {
    if (!isAuthenticated()) return;
    const intent = getAuthIntent();
    if (!intent) return;

    clearAuthIntent();

    if (intent.type === 'addToCart') {
      addToCart(Number(intent.productId), Number(intent.quantity) || 1);
      return;
    }

    if (intent.type === 'toggleFavorite') {
      toggleFavorito(Number(intent.productId));
      return;
    }

    if (intent.type === 'openCart' || intent.type === 'checkout') {
      renderCartModal();
      return;
    }

    if (intent.type === 'view' && intent.view) {
      setView(intent.view);
    }
  }

  /* ================ DARK MODE ============== */
  const body = document.body;
  const modeToggle = document.getElementById('modeToggle');

  function syncModeToggleState() {
    modeToggle.setAttribute('aria-pressed', body.classList.contains('dark-mode'));
  }

  const savedMode = localStorage.getItem('mode');
  if (savedMode === 'dark') {
    body.classList.add('dark-mode');
  }
  syncModeToggleState();

  modeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('mode', body.classList.contains('dark-mode') ? 'dark' : 'light');
    syncModeToggleState();
  });