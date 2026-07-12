/* =========================================================================
   PANEL DEL EMPRENDEDOR — lógica de interfaz
   -------------------------------------------------------------------------
   Este archivo funciona de forma independiente con datos de ejemplo.
   Los puntos marcados con "// [DB]" son donde el equipo de base de datos
   debe reemplazar la lógica simulada por llamadas reales al backend
   (fetch a /api/...), sin tener que tocar el resto del código.
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

function switchView(view){
  document.querySelectorAll('.nav-item').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.getElementById('page-title').textContent = pageMeta[view].title;
  document.getElementById('page-subtitle').textContent = pageMeta[view].subtitle;
}
document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

/* ---------- estado abierto / cerrado de la tienda ---------- */
// [DB] al conectar backend: enviar PATCH /api/emprendimientos/:id { abierto: bool }
let tiendaAbierta = true;

function pintarEstadoTienda(){
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

function toggleTienda(){
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
function openProductModal(nombre, categoria, precio, stock){
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
function closeProductModal(){
  document.getElementById('product-modal').classList.remove('show');
}
function saveProduct(){
  const nombre = document.getElementById('pm-nombre').value.trim();
  if(!nombre){
    alert('El producto necesita un nombre.');
    return;
  }
  // [DB]: reemplazar este bloque por el guardado real en la base de datos.
  // Por ahora solo cerramos el modal para simular que se guardó.
  closeProductModal();
}

/* ---------- modal: confirmar eliminación ---------- */
// [DB] al confirmar: DELETE /api/productos/:id
function confirmDelete(nombre){
  document.getElementById('delete-product-name').textContent = nombre;
  document.getElementById('delete-modal').classList.add('show');
}
function closeDeleteModal(){
  document.getElementById('delete-modal').classList.remove('show');
}

/* cerrar modales haciendo click fuera de ellos */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.classList.remove('show'); });
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