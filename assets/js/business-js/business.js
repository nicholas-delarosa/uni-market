const API_URL = 'http://localhost:3000/api';

// esta vista es solo para emprendedores logueados: si no hay usuario
// guardado por el login, no tiene sentido mostrarla
const usuarioGuardado = JSON.parse(localStorage.getItem('um_usuario') || 'null');
if (!usuarioGuardado) {
  window.location.href = 'login.html';
}

let miEmprendimiento = null;
let misProductos = [];

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Error al llamar ${path}`);
  return res.json();
}

async function apiSend(method, path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Error al llamar ${path}`);
  return data;
}

async function recargarProductos() {
  if (!miEmprendimiento) return;
  misProductos = await apiGet(`/productos?emprendimiento_id=${miEmprendimiento.id}`);
  renderProductos();
}

function formatPrecio(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}

function stockInfo(stock, stockMinimo) {
  if (stock === 0) return { label: 'Agotado', pill: 'pill-red', texto: 'Sin existencias' };
  if (stock <= stockMinimo) return { label: 'Bajo', pill: 'pill-amber', texto: `${stock} unidades disponibles` };
  return { label: 'En stock', pill: 'pill-green', texto: `${stock} unidades disponibles` };
}

function renderProductos() {
  const grid = document.querySelector('#view-productos .prod-grid');
  if (!grid) return;

  if (!misProductos.length) {
    grid.innerHTML = `<p class="empty-hint">Todavía no has agregado productos. Usa "Agregar producto" para crear el primero.</p>`;
    return;
  }

  grid.innerHTML = misProductos.map(p => {
    const info = stockInfo(p.stock, p.stockMinimo);
    const agotado = info.label === 'Agotado';
    return `
      <div class="card prod-card">
        <div class="prod-media" style="background-image:url('${p.image}'); background-size:cover; background-position:center;${agotado ? ' opacity:.55;' : ''}">
          <span class="prod-badge">${p.category || ''}</span>
          <span class="prod-stockflag pill ${info.pill}">${info.label}</span>
        </div>
        <div class="prod-body">
          <div class="prod-name">${p.name}</div>
          <div class="prod-price">${formatPrecio(p.price)}</div>
          <div class="prod-stock">${info.texto}</div>
          <div class="prod-actions">
            <button class="btn btn-outline btn-sm" data-edit-product data-id="${p.id}" data-name="${p.name}" data-categoria="${p.category || ''}" data-precio="${p.price}" data-stock="${p.stock}"><svg class="icon"><use href="#ic-pencil"/></svg>Editar</button>
            <button class="btn btn-danger-ghost btn-sm" data-delete-product="${p.name}" data-id="${p.id}"><svg class="icon"><use href="#ic-trash"/></svg></button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function cargarMiTienda() {
  try {
    // 1. encontrar el emprendimiento del usuario logueado
    const emprendimientos = await apiGet(`/emprendimientos?usuario_id=${usuarioGuardado.id}`);
    miEmprendimiento = emprendimientos[0];

    if (!miEmprendimiento) {
      console.warn('Este usuario todavía no tiene un emprendimiento creado.');
      return;
    }

    // 2. reflejar el nombre real en el sidebar y el saludo del dashboard
    const storeNameEl = document.querySelector('.store-name');
    if (storeNameEl) storeNameEl.textContent = miEmprendimiento.name;

    pageMeta.dashboard.title = `Hola, ${usuarioGuardado.nombre} 👋`;
    pageMeta.dashboard.subtitle = `Esto es lo que pasa hoy en ${miEmprendimiento.name}.`;
    document.getElementById('page-title').textContent = pageMeta.dashboard.title;
    document.getElementById('page-subtitle').textContent = pageMeta.dashboard.subtitle;

    // 3. traer y pintar los productos reales
    misProductos = await apiGet(`/productos?emprendimiento_id=${miEmprendimiento.id}`);
    renderProductos();
  } catch (err) {
    console.error(err);
  }
}

if (usuarioGuardado) {
  cargarMiTienda();
}

/* ---------- navegación entre secciones ---------- */
const pageMeta = {
  dashboard:      { title: 'Hola, Camila 👋', subtitle: 'Esto es lo que pasa hoy en Postres Camila.' },
  emprendimiento: { title: 'Mi tienda', subtitle: 'Edita la información pública de tu emprendimiento.' },
  productos:      { title: 'Productos', subtitle: 'Administra lo que ofreces en tu tienda.' },
  inventario:     { title: 'Inventario', subtitle: 'Controla las existencias de cada producto.' },
  pedidos:        { title: 'Pedidos', subtitle: 'Revisa y actualiza el estado de tus pedidos.' },
  estadisticas:   { title: 'Estadísticas', subtitle: 'El desempeño de tu tienda de un vistazo.' },
};

function switchView(view) {
  if (!pageMeta[view]) return;
  document.querySelectorAll('.nav-item, .mobile-tabbar a').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.getElementById('page-title').textContent = pageMeta[view].title;
  document.getElementById('page-subtitle').textContent = pageMeta[view].subtitle;
}

// Un solo listener delegado para cualquier elemento con data-view: los
// botones del menú lateral, la tarjeta de "bajo inventario", los links
// "ver todos/ver todo" y el botón de acciones rápidas. Antes cada uno
// tenía su propio onclick repitiendo lo mismo.
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-view]');
  if (!trigger) return;
  e.preventDefault();
  switchView(trigger.dataset.view);
});

/* ---------- estado abierto / cerrado de la tienda ---------- */
// [DB] al conectar backend: enviar PATCH /api/emprendimientos/:id { abierto: bool }
let tiendaAbierta = true;

function pintarEstadoTienda() {
  const sw1 = document.getElementById('status-switch');
  const sw2 = document.getElementById('status-switch-2');
  const lbl1 = document.getElementById('status-label');
  const lbl2 = document.getElementById('status-label-2');
  const banner = document.getElementById('closed-banner');
  const desc = document.getElementById('store-status-desc');

  [sw1, sw2].forEach(sw => { sw.classList.toggle('off', !tiendaAbierta); sw.setAttribute('aria-pressed', tiendaAbierta); });

  lbl1.textContent = tiendaAbierta ? 'Tienda abierta' : 'Tienda cerrada';
  lbl1.classList.toggle('open', tiendaAbierta);
  lbl1.classList.toggle('closed', !tiendaAbierta);

  lbl2.textContent = tiendaAbierta ? 'Abierta' : 'Cerrada';
  lbl2.classList.toggle('open', tiendaAbierta);
  lbl2.classList.toggle('closed', !tiendaAbierta);

  banner.classList.toggle('show', !tiendaAbierta);
  desc.textContent = tiendaAbierta
    ? 'Tu tienda está abierta y puede recibir pedidos nuevos.'
    : 'Tu tienda está cerrada. No se aceptarán pedidos nuevos hasta que la abras.';
}

function toggleTienda() {
  tiendaAbierta = !tiendaAbierta;
  pintarEstadoTienda();
  // [DB]: aquí va la llamada real para persistir el cambio, ej.
  // fetch(`/api/emprendimientos/${id}`, { method:'PATCH', body: JSON.stringify({ abierto: tiendaAbierta }) })
}
document.getElementById('status-switch').addEventListener('click', toggleTienda);
document.getElementById('status-switch-2').addEventListener('click', toggleTienda);
pintarEstadoTienda();

/* ---------- modal: agregar / editar producto ---------- */
let productoEnEdicionId = null;

function openProductModal(id, nombre, categoria, precio, stock) {
  const editing = id !== undefined;
  productoEnEdicionId = editing ? id : null;

  document.getElementById('product-modal-title').textContent = editing ? 'Editar producto' : 'Agregar producto';
  document.getElementById('pm-nombre').value = editing ? nombre : '';
  document.getElementById('pm-categoria').value = editing ? categoria : 'Comida';
  document.getElementById('pm-precio').value = editing ? precio : '';
  document.getElementById('pm-stock').value = editing ? stock : '';
  document.getElementById('pm-desc').value = '';
  document.getElementById('pm-img').value = '';
  document.getElementById('product-modal').classList.add('show');
}

async function saveProduct() {
  const nombre = document.getElementById('pm-nombre').value.trim();
  if (!nombre) {
    alert('El producto necesita un nombre.');
    return;
  }

  const payload = {
    nombre,
    categoria: document.getElementById('pm-categoria').value,
    precio: Number(document.getElementById('pm-precio').value) || 0,
    stock: Number(document.getElementById('pm-stock').value) || 0,
    descripcion: document.getElementById('pm-desc').value.trim(),
    imagenUrl: document.getElementById('pm-img').value.trim() || null,
  };

  const saveBtn = document.querySelector('[data-save-product]');
  const originalText = saveBtn.textContent;
  saveBtn.textContent = 'Guardando...';
  saveBtn.disabled = true;

  try {
    if (productoEnEdicionId) {
      await apiSend('PUT', `/productos/${productoEnEdicionId}`, payload);
    } else {
      await apiSend('POST', '/productos', { ...payload, emprendimientoId: miEmprendimiento.id });
    }
    document.getElementById('product-modal').classList.remove('show');
    await recargarProductos();
  } catch (err) {
    console.error(err);
    alert(err.message || 'No se pudo guardar el producto');
  } finally {
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }
}

/* ---------- modal: confirmar eliminación ---------- */
let productoAEliminar = null;

function confirmDelete(id, nombre) {
  productoAEliminar = id;
  document.getElementById('delete-product-name').textContent = nombre;
  document.getElementById('delete-modal').classList.add('show');
}

async function deleteProductConfirmed() {
  if (!productoAEliminar) return;

  try {
    await apiSend('DELETE', `/productos/${productoAEliminar}`);
    document.getElementById('delete-modal').classList.remove('show');
    await recargarProductos();
  } catch (err) {
    console.error(err);
    alert(err.message || 'No se pudo eliminar el producto');
  } finally {
    productoAEliminar = null;
  }
}

/* ---------- botones que abren/cierran los modales ---------- */
document.querySelectorAll('[data-open-product-modal]').forEach(btn => {
  btn.addEventListener('click', () => openProductModal());
});

// delegado (no querySelectorAll suelto): los botones de editar/eliminar
// de cada producto se regeneran dinámicamente en renderProductos(),
// así que hay que escuchar sobre el documento, no sobre elementos puntuales
document.addEventListener('click', (e) => {
  const editBtn = e.target.closest('[data-edit-product]');
  if (editBtn) {
    const { id, name, categoria, precio, stock } = editBtn.dataset;
    openProductModal(id, name, categoria, Number(precio), Number(stock));
    return;
  }

  const delBtn = e.target.closest('[data-delete-product]');
  if (delBtn) {
    confirmDelete(delBtn.dataset.id, delBtn.dataset.deleteProduct);
  }
});

const saveProductBtn = document.querySelector('[data-save-product]');
if (saveProductBtn) saveProductBtn.addEventListener('click', saveProduct);

const confirmDeleteBtn = document.querySelector('[data-confirm-delete]');
if (confirmDeleteBtn) confirmDeleteBtn.addEventListener('click', deleteProductConfirmed);

// Cierre genérico: cualquier botón con data-modal-close cierra el
// modal-overlay más cercano, sin importar cuál de los dos modales sea.
document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal-overlay')?.classList.remove('show');
  });
});

/* cerrar modales haciendo click fuera de ellos */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });
});

/* ---------- filtros de pedidos (tabs) ---------- */
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    // [DB]: al conectar backend, volver a pedir /api/pedidos?estado=... según el tab activo
  });
});

/* ---------- +/- de inventario ---------- */
// [DB] al hacer clic: PATCH /api/inventario/:id { cantidad }
document.querySelectorAll('.qty-control').forEach(control => {
  const [minusBtn, valSpan, plusBtn] = control.children;
  minusBtn.addEventListener('click', () => {
    const val = Math.max(0, parseInt(valSpan.textContent) - 1);
    valSpan.textContent = val;
  });
  plusBtn.addEventListener('click', () => {
    valSpan.textContent = parseInt(valSpan.textContent) + 1;
  });
});

/* ---------- modo oscuro ---------- */
// Mismo patrón que ya usa el catálogo (app.js): clase .dark-mode en el
// body, guardada en localStorage bajo la clave "mode".
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