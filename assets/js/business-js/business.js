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
  renderTodo();
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

function renderInventarioTabla() {
  const tbody = document.querySelector('#view-inventario tbody');
  if (!tbody) return;

  if (!misProductos.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-hint">Todavía no tienes productos para mostrar aquí.</td></tr>`;
    return;
  }

  tbody.innerHTML = misProductos.map(p => {
    const info = stockInfo(p.stock, p.stockMinimo);
    return `
      <tr>
        <td><div class="cell-prod"><div class="cell-thumb" style="background-image:url('${p.image}'); background-size:cover; background-position:center;"></div>${p.name}</div></td>
        <td>${p.category || ''}</td>
        <td>
          <div class="qty-control" data-product-id="${p.id}">
            <button class="qty-btn" data-qty="-1"><svg class="icon"><use href="#ic-minus"/></svg></button>
            <span class="qty-val">${p.stock}</span>
            <button class="qty-btn" data-qty="1"><svg class="icon"><use href="#ic-plus"/></svg></button>
          </div>
        </td>
        <td><span class="pill ${info.pill}">${info.label}</span></td>
        <td><a href="#" class="cell-link" data-edit-product data-id="${p.id}" data-name="${p.name}" data-categoria="${p.category || ''}" data-precio="${p.price}" data-stock="${p.stock}">Editar producto</a></td>
      </tr>
    `;
  }).join('');
}

function renderBajoInventarioDashboard() {
  const bajos = misProductos.filter(p => p.stock <= p.stockMinimo);

  const statNum = document.querySelector('[data-view="inventario"].stat-card .stat-num');
  if (statNum) statNum.textContent = `${bajos.length} producto${bajos.length === 1 ? '' : 's'}`;

  const panel = document.querySelectorAll('.panel')[1]; // panel "Bajo inventario" del dashboard
  if (!panel) return;

  // limpia las filas de ejemplo y pinta las reales
  panel.querySelectorAll('.stock-row').forEach(row => row.remove());

  if (!bajos.length) {
    panel.insertAdjacentHTML('beforeend', `<p class="empty-hint">Todo tu inventario está en buen nivel 🎉</p>`);
    return;
  }

  bajos.slice(0, 4).forEach(p => {
    const info = stockInfo(p.stock, p.stockMinimo);
    panel.insertAdjacentHTML('beforeend', `
      <div class="stock-row">
        <div class="stock-thumb" style="background-image:url('${p.image}'); background-size:cover; background-position:center;"></div>
        <div class="stock-info"><div class="stock-name">${p.name}</div><div class="stock-qty">${info.texto}</div></div>
        <span class="pill ${info.pill}">${info.label}</span>
      </div>
    `);
  });
}

function renderTodo() {
  renderProductos();
  renderInventarioTabla();
  renderBajoInventarioDashboard();
}

/* ---------- pedidos ---------- */
const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};
const ESTADO_PILL = {
  pendiente: 'pill-amber',
  confirmado: 'pill-violet',
  entregado: 'pill-green',
  cancelado: 'pill-red',
};

function formatFechaPedido(fechaIso) {
  const fecha = new Date(fechaIso);
  const hoy = new Date();
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1);

  const esMismoDia = (a, b) => a.toDateString() === b.toDateString();
  const hora = fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (esMismoDia(fecha, hoy)) return `Hoy, ${hora}`;
  if (esMismoDia(fecha, ayer)) return `Ayer, ${hora}`;
  return `${fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })}, ${hora}`;
}

let misPedidos = [];
let filtroEstadoPedido = null; // null = "Todos"

async function cargarPedidos() {
  if (!miEmprendimiento) return;
  const filtro = filtroEstadoPedido ? `&estado=${filtroEstadoPedido}` : '';
  misPedidos = await apiGet(`/pedidos?emprendimiento_id=${miEmprendimiento.id}${filtro}`);
  renderPedidosTabla();
}

function renderPedidosTabla() {
  const tbody = document.querySelector('#view-pedidos tbody');
  if (!tbody) return;

  if (!misPedidos.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-hint">No hay pedidos que coincidan con este filtro.</td></tr>`;
    return;
  }

  tbody.innerHTML = misPedidos.map(pedido => `
    <tr>
      <td class="cell-num">#${pedido.id}</td>
      <td>${pedido.cliente}</td>
      <td>${pedido.productos}</td>
      <td class="cell-strong">${formatPrecio(pedido.total)}</td>
      <td class="cell-muted">${formatFechaPedido(pedido.fecha)}</td>
      <td>
        <select class="status-select" data-pedido-id="${pedido.id}">
          ${Object.entries(ESTADO_LABELS).map(([valor, texto]) =>
            `<option value="${valor}" ${valor === pedido.estado ? 'selected' : ''}>${texto}</option>`
          ).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

async function cargarResumenDashboard() {
  if (!miEmprendimiento) return;
  const resumen = await apiGet(`/pedidos/resumen?emprendimiento_id=${miEmprendimiento.id}`);
  const statCards = document.querySelectorAll('.stat-card');

  // "Pedidos de hoy"
  if (statCards[0]) {
    statCards[0].querySelector('.stat-num').textContent = resumen.pedidosHoy;
    statCards[0].querySelector('.stat-sub').textContent =
      `${resumen.pendientes} pendiente${resumen.pendientes === 1 ? '' : 's'} por confirmar`;
  }

  // "Ingresos del mes"
  if (statCards[1]) {
    statCards[1].querySelector('.stat-num').textContent = formatPrecio(resumen.ingresosMes);
    const sub = statCards[1].querySelector('.stat-sub');
    if (sub) sub.style.display = 'none';
  }

  // "Producto estrella"
  if (statCards[2]) {
    if (resumen.productoEstrella) {
      statCards[2].querySelector('.stat-num-sm').textContent = resumen.productoEstrella.nombre;
      statCards[2].querySelector('.stat-sub').textContent = `${resumen.productoEstrella.vendidos} vendidos este mes`;
    } else {
      statCards[2].querySelector('.stat-num-sm').textContent = 'Sin ventas';
      statCards[2].querySelector('.stat-sub').textContent = 'todavía este mes';
    }
  }

  // panel "Pedidos recientes"
  const panelPedidos = document.querySelectorAll('.panel')[0];
  if (panelPedidos) {
    panelPedidos.querySelectorAll('.order-row').forEach(row => row.remove());
    if (!resumen.recientes.length) {
      panelPedidos.insertAdjacentHTML('beforeend', `<p class="empty-hint">Todavía no tienes pedidos.</p>`);
    } else {
      resumen.recientes.forEach(p => {
        panelPedidos.insertAdjacentHTML('beforeend', `
          <div class="order-row">
            <span class="order-id">#${p.id}</span>
            <div class="order-info"><div class="order-client">${p.cliente}</div><div class="order-items">${p.productos}</div></div>
            <span class="pill ${ESTADO_PILL[p.estado]}">${ESTADO_LABELS[p.estado]}</span>
            <span class="order-total">${formatPrecio(p.total)}</span>
          </div>
        `);
      });
    }
  }
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

    const chipNameEl = document.querySelector('.user-chip-name');
    if (chipNameEl) chipNameEl.textContent = `${usuarioGuardado.nombre} ${usuarioGuardado.apellido.charAt(0)}.`;
    const chipAvatarEl = document.querySelector('.user-chip .avatar');
    if (chipAvatarEl) chipAvatarEl.textContent = (usuarioGuardado.nombre[0] + usuarioGuardado.apellido[0]).toUpperCase();

    pageMeta.dashboard.title = `Hola, ${usuarioGuardado.nombre} 👋`;
    pageMeta.dashboard.subtitle = `Esto es lo que pasa hoy en ${miEmprendimiento.name}.`;
    document.getElementById('page-title').textContent = pageMeta.dashboard.title;
    document.getElementById('page-subtitle').textContent = pageMeta.dashboard.subtitle;

    // 3. traer y pintar los productos reales
    misProductos = await apiGet(`/productos?emprendimiento_id=${miEmprendimiento.id}`);
    renderTodo();

    // 4. pedidos: tabla completa + resumen del dashboard
    await Promise.all([cargarPedidos(), cargarResumenDashboard()]);
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
// "ver todos/ver todo" y el botón de acciones rápidas.
document.addEventListener('click', (e) => {
  const trigger = e.target.closest('[data-view]');
  if (!trigger) return;
  e.preventDefault();
  switchView(trigger.dataset.view);
});

/* ---------- estado abierto / cerrado de la tienda ---------- */
//enviar PATCH /api/emprendimientos/:id { abierto: bool }
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
  //aquí va la llamada real para persistir el cambio.
  // ejemplo : fetch(`/api/emprendimientos/${id}`, { method:'PATCH', body: JSON.stringify({ abierto: tiendaAbierta }) })
}
document.getElementById('status-switch').addEventListener('click', toggleTienda);
document.getElementById('status-switch-2').addEventListener('click', toggleTienda);
pintarEstadoTienda();

/* -------- agregar / editar producto ---------- */
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

//los botones de editar/eliminar
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

// Cualquier botón con data-modal-close cierra el
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

/* ---------- filtros de pedidos ---------- */
const FILTRO_TAB_ESTADO = {
  'Todos': null,
  'Pendientes': 'pendiente',
  'Confirmados': 'confirmado',
  'Entregados': 'entregado',
};

document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    filtroEstadoPedido = FILTRO_TAB_ESTADO[tab.textContent.trim()] ?? null;
    cargarPedidos();
  });
});

/* ---------- cambiar el estado de un pedido ---------- */
// delegado: las filas de la tabla de pedidos se regeneran dinámicamente
document.addEventListener('change', async (e) => {
  const select = e.target.closest('.status-select');
  if (!select) return;

  const pedidoId = select.dataset.pedidoId;
  const nuevoEstado = select.value;
  const estadoAnterior = misPedidos.find(p => p.id == pedidoId)?.estado;

  try {
    await apiSend('PATCH', `/pedidos/${pedidoId}`, { estado: nuevoEstado });
    const pedidoLocal = misPedidos.find(p => p.id == pedidoId);
    if (pedidoLocal) pedidoLocal.estado = nuevoEstado;
    await cargarResumenDashboard(); // los números del dashboard pueden cambiar (ej. pendientes)
  } catch (err) {
    console.error(err);
    select.value = estadoAnterior; // revierte el select si falló
    alert(err.message || 'No se pudo actualizar el estado del pedido');
  }
});

/* ---------- +/- de inventario ---------- */
document.addEventListener('click', async (e) => {
  const qtyBtn = e.target.closest('.qty-btn');
  if (!qtyBtn) return;

  const control = qtyBtn.closest('.qty-control');
  const valSpan = control.querySelector('.qty-val');
  const productId = control.dataset.productId;
  const delta = Number(qtyBtn.dataset.qty);

  const nuevoStock = Math.max(0, parseInt(valSpan.textContent) + delta);
  valSpan.textContent = nuevoStock; // respuesta visual inmediata

  try {
    await apiSend('PATCH', `/inventario/${productId}`, { stock: nuevoStock });
    // sincroniza el resto de las vistas (grilla de productos, panel del dashboard)
    // sin volver a pedir todo a la API, ya que solo cambió este producto
    const producto = misProductos.find(p => p.id == productId);
    if (producto) producto.stock = nuevoStock;
    renderTodo();
  } catch (err) {
    console.error(err);
    valSpan.textContent = parseInt(valSpan.textContent) - delta; // revierte si falló
    alert(err.message || 'No se pudo actualizar el inventario');
  }
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