/* ================= DATA ================= */
  const universities = [
    { id:'unorte', name:'Universidad del Norte', logo:'assets/src/images/UniNorte.png' },
    { id:'cuc', name:'Costa Universidad', logo:'assets/src/images/Logo_cuc.png' },
    { id:'uniautonoma', name:'Uniautónoma', logo:'assets/src/images/Uniautonoma.png' },
    { id:'simonbolivar', name:'Simón Bolívar', logo:'assets/src/images/Simon Bolivar.png' },
    { id:'unilibre', name:'Universidad Libre', logo:'assets/src/images/UniLibre.png' },
    { id:'unimedellin', name:'Univ. de Medellín', logo:'assets/src/images/UdeMedallo.png' },
    { id:'eia', name:'EIA', logo:'assets/src/images/Logo_EIA.png' },
    { id:'bolivariana', name:'Bolivariana', logo:'assets/src/images/Bolivariana.jpg' },
    { id:'udea', name:'U. de Antioquia', logo:'assets/src/images/UDEA.jpg' },
  ];

  const sellers = [
    { id:'s1', name:'Postres Camila', universityId:'unorte', categories:['Comida'], products:6, rating:4.9, avatar:'https://picsum.photos/seed/postres-camila-logo/160/160' },
    { id:'s2', name:'TechFix Uninorte', universityId:'unorte', categories:['Tecnología','Servicios'], products:4, rating:4.7, avatar:'https://picsum.photos/seed/techfix-logo/160/160' },
    { id:'s3', name:'Laura Design Studio', universityId:'unorte', categories:['Diseño'], products:5, rating:5.0, avatar:'https://picsum.photos/seed/laura-design-logo/160/160' },
    { id:'s4', name:'Urban Style CUC', universityId:'cuc', categories:['Moda'], products:3, rating:4.6, avatar:'https://picsum.photos/seed/urban-style-logo/160/160' },
    { id:'s5', name:'GlowLab Beauty', universityId:'cuc', categories:['Belleza'], products:4, rating:4.8, avatar:'https://picsum.photos/seed/glowlab-logo/160/160' },
    { id:'s6', name:'Sabores del Campus', universityId:'uniautonoma', categories:['Comida','Servicios'], products:5, rating:4.5, avatar:'https://picsum.photos/seed/sabores-campus-logo/160/160' },
    { id:'s7', name:'Trazo Estudio', universityId:'unimedellin', categories:['Diseño','Moda'], products:6, rating:4.9, avatar:'https://picsum.photos/seed/trazo-estudio-logo/160/160' },
  ];

  const products = [
    { id:'p1', name:'Cheesecake individual', price:14000, category:'Comida', universityId:'unorte', sellerId:'s1', image:'https://picsum.photos/seed/cheesecake/400/360' },
    { id:'p2', name:'Brownie con nutella', price:8500, category:'Comida', universityId:'unorte', sellerId:'s1', image:'https://picsum.photos/seed/brownie/400/360' },
    { id:'p3', name:'Diseño de logo para tu emprendimiento', price:65000, category:'Diseño', universityId:'unorte', sellerId:'s3', image:'https://picsum.photos/seed/logo-design/400/360' },
    { id:'p4', name:'Plantilla de presentación editable', price:22000, category:'Diseño', universityId:'unorte', sellerId:'s3', image:'https://picsum.photos/seed/slides-template/400/360' },
    { id:'p5', name:'Mantenimiento de PC a domicilio', price:35000, category:'Tecnología', universityId:'unorte', sellerId:'s2', image:'https://picsum.photos/seed/pc-repair/400/360' },
    { id:'p6', name:'Fundas para laptop personalizadas', price:28000, category:'Tecnología', universityId:'unorte', sellerId:'s2', image:'https://picsum.photos/seed/laptop-case/400/360' },
    { id:'p7', name:'Tutoría de cálculo (1 hora)', price:20000, category:'Servicios', universityId:'unorte', sellerId:'s2', image:'https://picsum.photos/seed/tutoring/400/360' },
    { id:'p8', name:'Camiseta estampada Uninorte', price:39000, category:'Moda', universityId:'unorte', sellerId:'s3', image:'https://picsum.photos/seed/tshirt-print/400/360' },
    { id:'p9', name:'Aretes artesanales', price:15000, category:'Moda', universityId:'cuc', sellerId:'s4', image:'https://picsum.photos/seed/earrings/400/360' },
    { id:'p10', name:'Gorras bordadas a pedido', price:32000, category:'Moda', universityId:'cuc', sellerId:'s4', image:'https://picsum.photos/seed/caps/400/360' },
    { id:'p11', name:'Set de skincare facial', price:48000, category:'Belleza', universityId:'cuc', sellerId:'s5', image:'https://picsum.photos/seed/skincare/400/360' },
    { id:'p12', name:'Peinados para eventos', price:60000, category:'Belleza', universityId:'cuc', sellerId:'s5', image:'https://picsum.photos/seed/hairstyle/400/360' },
    { id:'p13', name:'Empanadas por docena', price:24000, category:'Comida', universityId:'uniautonoma', sellerId:'s6', image:'https://picsum.photos/seed/empanadas/400/360' },
    { id:'p14', name:'Diseño de invitaciones digitales', price:18000, category:'Diseño', universityId:'uniautonoma', sellerId:'s6', image:'https://picsum.photos/seed/invitations/400/360' },
    { id:'p15', name:'Ilustración digital personalizada', price:45000, category:'Diseño', universityId:'unimedellin', sellerId:'s7', image:'https://picsum.photos/seed/illustration/400/360' },
    { id:'p16', name:'Bolsos tejidos a mano', price:52000, category:'Moda', universityId:'unimedellin', sellerId:'s7', image:'https://picsum.photos/seed/handbag/400/360' },
  ];

  /* ================= STATE ================= */
  const state = {
    university: null,
    view: 'catalog',
    search: '',
    category: 'all',
    sellerFilter: null,
    sort: 'relevance',
    favorites: new Set(JSON.parse(localStorage.getItem('um_favorites') || '[]')),
  };

  const fmt = (n) => '$ ' + n.toLocaleString('es-CO');

  /* ================= UNIVERSITY SELECTOR ================= */
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

  function selectUniversity(id) {
    const uni = universities.find(u => u.id === id);
    if (!uni) return;
    state.university = uni;
    localStorage.setItem('um_university', id);
    uniSelectorScreen.style.display = 'none';
    appShell.style.display = 'flex';
    document.getElementById('sidebarUniImg').src = uni.logo;
    document.getElementById('sidebarUniImg').alt = uni.name;
    document.getElementById('sidebarUniName').textContent = uni.name;
    setView('catalog');
  }

  function openUniSelector() {
    appShell.style.display = 'none';
    uniSelectorScreen.style.display = 'flex';
    uniSearchInput.value = '';
    renderUniGrid();
  }

  /* ================= VIEW ROUTING ================= */
  const content = document.getElementById('content');
  const topbarTitle = document.getElementById('topbarTitle');
  const topbarSubtitle = document.getElementById('topbarSubtitle');
  const topbarSearchWrap = document.getElementById('topbarSearchWrap');
  const searchInput = document.getElementById('searchInput');

  function setView(view) {
    state.view = view;
    document.querySelectorAll('.side-link, .mobile-tabbar a').forEach(el => {
      el.classList.toggle('active', el.dataset.view === view);
    });
    render();
  }

  document.querySelectorAll('.side-link, .mobile-tabbar a, .topbar-user').forEach(el => {
    el.addEventListener('click', (e) => {
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
      renderProfile();
    }
  }

  /* ================= CATALOG ================= */
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

    if (state.sellerFilter) list = list.filter(p => p.sellerId === state.sellerFilter);
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
        const seller = sellers.find(s => s.id === state.sellerFilter);
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
      const isFav = state.favorites.has(p.id);
      return `
        <div class="product-card">
          <div class="product-photo">
            <img src="${p.image}" alt="${p.name}">
            <span class="product-cat">${p.category}</span>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-fav="${p.id}">
              <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
            </button>
          </div>
          <div class="product-body">
            <div class="product-name">${p.name}</div>
            <div class="product-seller"><button data-seller="${p.sellerId}">${seller ? seller.name : ''}</button></div>
            <div class="product-price">${fmt(p.price)}</div>
            <button class="btn product-cta">Ver producto</button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('[data-fav]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.fav;
        if (state.favorites.has(id)) state.favorites.delete(id);
        else state.favorites.add(id);
        localStorage.setItem('um_favorites', JSON.stringify([...state.favorites]));
        renderCatalogGrid();
      });
    });
    grid.querySelectorAll('[data-seller]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.sellerFilter = btn.dataset.seller;
        renderCatalogGrid();
      });
    });
  }

  /* ================= SELLERS ================= */
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

  /* ================= PROFILE ================= */
  function renderProfile() {
    const favIds = [...state.favorites];
    const favProducts = products.filter(p => favIds.includes(p.id));

    content.innerHTML = `
      <div class="profile-wrap">
        <div class="profile-card">
          <div class="avatar-lg">V</div>
          <div>
            <h3 class="profile-name">Valentina G.</h3>
            <div class="profile-sub">valentina.g@correo.edu.co · Estudiante</div>
            <span class="profile-uni-tag">
              <img src="${state.university.logo}" alt="" loading="lazy">
              ${state.university.name}
            </span>
          </div>
        </div>

        <div class="profile-stats">
          <div class="stat-box"><b>${favProducts.length}</b><span>Favoritos</span></div>
          <div class="stat-box"><b>0</b><span>Pedidos</span></div>
          <div class="stat-box"><b>0</b><span>Reseñas</span></div>
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
            <button class="btn btn-outline btn-sm">Editar perfil</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('profileSwitchUni').addEventListener('click', openUniSelector);
  }

  /* ================= INIT ================= */
  renderUniGrid();
  const savedUniId = localStorage.getItem('um_university');
  if (savedUniId && universities.some(u => u.id === savedUniId)) {
    selectUniversity(savedUniId);
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