/* =========================================================================
   PANEL DEL EMPRENDEDOR — lógica de interfaz
   -------------------------------------------------------------------------
   Este archivo funciona de forma independiente con datos de ejemplo.
   Los puntos marcados con "// [DB]" son donde el equipo de base de datos
   debe reemplazar la lógica simulada por llamadas reales al backend
   (fetch a /api/...), sin tener que tocar el resto del código.

   Nota sobre el cambio hecho acá: el HTML ya no usa onclick="..." en los
   botones. Este archivo se carga como <script type="module">, y los
   módulos no exponen sus funciones a window, así que cualquier onclick
   que llamara a una función declarada aquí (switchView, openProductModal,
   etc.) fallaba en silencio con un "is not defined". Ahora todo se
   conecta por atributos data-* y delegación de eventos.
   ========================================================================= */

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
// [DB] al guardar: POST /api/productos (nuevo) o PUT /api/productos/:id (edición)
function openProductModal(nombre, categoria, precio, stock) {
  const editing = nombre !== undefined;
  document.getElementById('product-modal-title').textContent = editing ? 'Editar producto' : 'Agregar producto';
  document.getElementById('pm-nombre').value = editing ? nombre : '';
  document.getElementById('pm-categoria').value = editing ? categoria : 'Comida';
  document.getElementById('pm-precio').value = editing ? precio : '';
  document.getElementById('pm-stock').value = editing ? stock : '';
  document.getElementById('pm-desc').value = '';
  document.getElementById('pm-img').value = '';
  document.getElementById('product-modal').classList.add('show');
}

function saveProduct() {
  const nombre = document.getElementById('pm-nombre').value.trim();
  if (!nombre) {
    alert('El producto necesita un nombre.');
    return;
  }
  // [DB]: reemplazar este bloque por el guardado real en la base de datos.
  // Por ahora solo cerramos el modal para simular que se guardó.
  document.getElementById('product-modal').classList.remove('show');
}

/* ---------- modal: confirmar eliminación ---------- */
// [DB] al confirmar: DELETE /api/productos/:id
let productoAEliminar = null;

function confirmDelete(nombre) {
  productoAEliminar = nombre;
  document.getElementById('delete-product-name').textContent = nombre;
  document.getElementById('delete-modal').classList.add('show');
}

function deleteProductConfirmed() {
  // [DB]: reemplazar por fetch(`/api/productos/${id}`, { method:'DELETE' })
  // y quitar la tarjeta/fila correspondiente del DOM cuando el backend confirme.
  document.getElementById('delete-modal').classList.remove('show');
  productoAEliminar = null;
}

/* ---------- botones que abren/cierran los modales ---------- */
document.querySelectorAll('[data-open-product-modal]').forEach(btn => {
  btn.addEventListener('click', () => openProductModal());
});

document.querySelectorAll('[data-edit-product]').forEach(btn => {
  btn.addEventListener('click', () => {
    const { name, categoria, precio, stock } = btn.dataset;
    openProductModal(name, categoria, Number(precio), Number(stock));
  });
});

document.querySelectorAll('[data-delete-product]').forEach(btn => {
  btn.addEventListener('click', () => confirmDelete(btn.dataset.deleteProduct));
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