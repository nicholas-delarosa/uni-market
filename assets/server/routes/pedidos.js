const express = require('express');
const router = express.Router();
const pool = require('../db');

const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'entregado', 'cancelado'];

// Cada emprendedor solo ve, de cada pedido, SUS propias líneas de producto
router.get('/', async (req, res) => {
  const { emprendimiento_id, usuario_id, estado } = req.query;

  if (!emprendimiento_id && !usuario_id) {
    return res.status(400).json({ error: 'emprendimiento_id o usuario_id es obligatorio' });
  }

  try {
    const params = [];
    let where = `WHERE 1=1`;

    if (emprendimiento_id) {
      params.push(emprendimiento_id);
      where += ` AND p.emprendimiento_id = $${params.length}`;
    }

    if (usuario_id) {
      params.push(usuario_id);
      where += ` AND t.usuario_id = $${params.length}`;
    }

    if (estado) {
      params.push(estado);
      where += ` AND t.estado = $${params.length}`;
    }

    const query = `
      SELECT
        t.id,
        u.nombre || ' ' || LEFT(u.apellido, 1) || '.' AS cliente,
        STRING_AGG(dt.cantidad || 'x ' || p.nombre, ', ' ORDER BY dt.id) AS productos,
        SUM(dt.subtotal) AS total,
        t.fecha,
        t.estado
      FROM transacciones t
      JOIN usuarios u ON u.id = t.usuario_id
      JOIN detalle_transacciones dt ON dt.transaccion_id = t.id
      JOIN productos p ON p.id = dt.producto_id
      ${where}
      GROUP BY t.id, u.nombre, u.apellido, t.fecha, t.estado
      ORDER BY t.fecha DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// GET /api/pedidos/resumen?emprendimiento_id=1
router.get('/resumen', async (req, res) => {
  const { emprendimiento_id } = req.query;

  if (!emprendimiento_id) {
    return res.status(400).json({ error: 'emprendimiento_id es obligatorio' });
  }

  try {
    // pedidos de hoy + pendientes por confirmar
    const hoy = await pool.query(
      `SELECT
         COUNT(DISTINCT t.id) FILTER (WHERE t.fecha::date = CURRENT_DATE)::int AS "pedidosHoy",
         COUNT(DISTINCT t.id) FILTER (WHERE t.estado = 'pendiente')::int AS pendientes
       FROM transacciones t
       JOIN detalle_transacciones dt ON dt.transaccion_id = t.id
       JOIN productos p ON p.id = dt.producto_id
       WHERE p.emprendimiento_id = $1`,
      [emprendimiento_id]
    );

    // ingresos del mes (no cuenta pedidos cancelados)
    const ingresos = await pool.query(
      `SELECT COALESCE(SUM(dt.subtotal), 0) AS total
       FROM transacciones t
       JOIN detalle_transacciones dt ON dt.transaccion_id = t.id
       JOIN productos p ON p.id = dt.producto_id
       WHERE p.emprendimiento_id = $1
         AND t.estado != 'cancelado'
         AND date_trunc('month', t.fecha) = date_trunc('month', CURRENT_DATE)`,
      [emprendimiento_id]
    );

    // producto estrella del mes (más unidades vendidas)
    const estrella = await pool.query(
      `SELECT p.nombre, SUM(dt.cantidad)::int AS vendidos
       FROM detalle_transacciones dt
       JOIN productos p ON p.id = dt.producto_id
       JOIN transacciones t ON t.id = dt.transaccion_id
       WHERE p.emprendimiento_id = $1
         AND t.estado != 'cancelado'
         AND date_trunc('month', t.fecha) = date_trunc('month', CURRENT_DATE)
       GROUP BY p.nombre
       ORDER BY vendidos DESC
       LIMIT 1`,
      [emprendimiento_id]
    );

    // 4 pedidos más recientes (misma forma que el listado completo)
    const recientes = await pool.query(
      `SELECT
         t.id,
         u.nombre || ' ' || LEFT(u.apellido, 1) || '.' AS cliente,
         STRING_AGG(dt.cantidad || 'x ' || p.nombre, ', ' ORDER BY dt.id) AS productos,
         SUM(dt.subtotal) AS total,
         t.fecha,
         t.estado
       FROM transacciones t
       JOIN usuarios u ON u.id = t.usuario_id
       JOIN detalle_transacciones dt ON dt.transaccion_id = t.id
       JOIN productos p ON p.id = dt.producto_id
       WHERE p.emprendimiento_id = $1
       GROUP BY t.id, u.nombre, u.apellido, t.fecha, t.estado
       ORDER BY t.fecha DESC
       LIMIT 4`,
      [emprendimiento_id]
    );

    res.json({
      pedidosHoy: hoy.rows[0].pedidosHoy,
      pendientes: hoy.rows[0].pendientes,
      ingresosMes: Number(ingresos.rows[0].total),
      productoEstrella: estrella.rows[0] || null,
      recientes: recientes.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el resumen de pedidos' });
  }
});

// POST /api/transacciones
// body: { usuario_id, monto_total, estado }
router.post('/transacciones', async (req, res) => {
  const { usuario_id, monto_total, estado = 'pendiente' } = req.body;

  if (!usuario_id || monto_total === undefined) {
    return res.status(400).json({ error: 'usuario_id y monto_total son obligatorios' });
  }

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO transacciones (usuario_id, monto_total, estado, fecha)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, usuario_id, monto_total, estado, fecha`,
      [usuario_id, monto_total, estado]
    );

    res.status(201).json({
      transaccion: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la transacción' });
  }
});

// POST /api/detalle-transacciones
// body: { transaccion_id, producto_id, cantidad, subtotal }
router.post('/detalle-transacciones', async (req, res) => {
  const { transaccion_id, producto_id, cantidad, subtotal } = req.body;

  if (!transaccion_id || !producto_id || !cantidad || subtotal === undefined) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO detalle_transacciones (transaccion_id, producto_id, cantidad, subtotal)
       VALUES ($1, $2, $3, $4)
       RETURNING id, transaccion_id, producto_id, cantidad, subtotal`,
      [transaccion_id, producto_id, cantidad, subtotal]
    );

    res.status(201).json({
      detalle: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el detalle de transacción' });
  }
});

// GET /api/pedidos/estadisticas?emprendimiento_id=1
router.get('/estadisticas', async (req, res) => {
  const { emprendimiento_id } = req.query;

  if (!emprendimiento_id) {
    return res.status(400).json({ error: 'emprendimiento_id es obligatorio' });
  }

  try {
    // ventas por día de ESTA semana (1=lunes ... 7=domingo)
    const ventasSemana = await pool.query(
      `SELECT EXTRACT(ISODOW FROM t.fecha)::int AS dow, COALESCE(SUM(dt.subtotal), 0) AS total
       FROM transacciones t
       JOIN detalle_transacciones dt ON dt.transaccion_id = t.id
       JOIN productos p ON p.id = dt.producto_id
       WHERE p.emprendimiento_id = $1
         AND t.estado != 'cancelado'
         AND t.fecha >= date_trunc('week', CURRENT_DATE)
         AND t.fecha < date_trunc('week', CURRENT_DATE) + INTERVAL '7 days'
       GROUP BY dow`,
      [emprendimiento_id]
    );

    // top 3 productos más vendidos del mes
    const topProductos = await pool.query(
      `SELECT p.nombre, SUM(dt.cantidad)::int AS vendidos
       FROM detalle_transacciones dt
       JOIN productos p ON p.id = dt.producto_id
       JOIN transacciones t ON t.id = dt.transaccion_id
       WHERE p.emprendimiento_id = $1
         AND t.estado != 'cancelado'
         AND date_trunc('month', t.fecha) = date_trunc('month', CURRENT_DATE)
       GROUP BY p.nombre
       ORDER BY vendidos DESC
       LIMIT 3`,
      [emprendimiento_id]
    );

    // resumen de pedidos del mes: completados = entregado, pendientes = pendiente + confirmado
    const resumenPedidos = await pool.query(
      `SELECT
         COUNT(DISTINCT t.id) FILTER (WHERE t.estado = 'entregado')::int AS completados,
         COUNT(DISTINCT t.id) FILTER (WHERE t.estado IN ('pendiente', 'confirmado'))::int AS pendientes,
         COUNT(DISTINCT t.id) FILTER (WHERE t.estado = 'cancelado')::int AS cancelados
       FROM transacciones t
       JOIN detalle_transacciones dt ON dt.transaccion_id = t.id
       JOIN productos p ON p.id = dt.producto_id
       WHERE p.emprendimiento_id = $1
         AND date_trunc('month', t.fecha) = date_trunc('month', CURRENT_DATE)`,
      [emprendimiento_id]
    );

    const totalMes = await pool.query(
      `SELECT COALESCE(SUM(dt.subtotal), 0) AS total
       FROM transacciones t
       JOIN detalle_transacciones dt ON dt.transaccion_id = t.id
       JOIN productos p ON p.id = dt.producto_id
       WHERE p.emprendimiento_id = $1
         AND t.estado != 'cancelado'
         AND date_trunc('month', t.fecha) = date_trunc('month', CURRENT_DATE)`,
      [emprendimiento_id]
    );

    // arma los 7 días completos (Lun-Dom), con 0 en los días sin ventas
    const porDia = {};
    ventasSemana.rows.forEach(r => { porDia[r.dow] = Number(r.total); });
    const dias = [1, 2, 3, 4, 5, 6, 7].map(dow => ({ dow, total: porDia[dow] || 0 }));

    res.json({
      ventasSemana: dias,
      productosTop: topProductos.rows,
      resumenPedidos: {
        completados: resumenPedidos.rows[0].completados,
        pendientes: resumenPedidos.rows[0].pendientes,
        cancelados: resumenPedidos.rows[0].cancelados,
        totalMes: Number(totalMes.rows[0].total),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las estadísticas' });
  }
});

// PATCH /api/pedidos/:id  body: { estado: 'confirmado' }
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: `Estado inválido. Debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}` });
  }

  try {
    const result = await pool.query(
      'UPDATE transacciones SET estado = $1 WHERE id = $2 RETURNING id',
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ mensaje: 'Estado actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
});

// POST /api/pedidos/checkout
// body: { usuario_id, monto_total, items: [{ producto_id, cantidad, subtotal }] }
router.post('/checkout', async (req, res) => {
  const { usuario_id, items } = req.body;
  // acepta "monto_total" o "total" -- distintas versiones del frontend
  // han usado uno u otro nombre para este campo
  const monto_total = req.body.monto_total ?? req.body.total;

  if (!usuario_id || monto_total === undefined || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'usuario_id, monto_total (o total) y items son obligatorios' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Crear transacción
    // OJO: la columna en la tabla se llama "total", no "monto_total"
    // (monto_total es solo el nombre que usa el body del request)
    const transRes = await client.query(
      `INSERT INTO transacciones (usuario_id, total, estado, fecha)
       VALUES ($1, $2, 'confirmado', NOW())
       RETURNING id`,
      [usuario_id, monto_total]
    );
    const transaccionId = transRes.rows[0].id;

    // Procesar cada item: verificar stock, insertar detalle y descontar inventario
    for (const it of items) {
      const { producto_id, cantidad, subtotal } = it;

      if (!producto_id || !cantidad) {
        throw new Error('Item inválido en items');
      }

      // Bloquear fila de inventario para este producto
      const stockRes = await client.query(
        'SELECT stock_actual FROM inventario WHERE producto_id = $1 FOR UPDATE',
        [producto_id]
      );

      const stockActual = stockRes.rows.length ? Number(stockRes.rows[0].stock_actual) : 0;
      if (stockActual < cantidad) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: `Stock insuficiente para producto ${producto_id}` });
      }

      // precio_unitario es obligatorio (NOT NULL) en detalle_transacciones.
      // Lo derivamos del subtotal/cantidad en vez de pedirlo aparte al frontend,
      // así no hay que tocar lo que ya manda el carrito.
      const precioUnitario = cantidad > 0 ? Number(subtotal) / Number(cantidad) : 0;

      // Insertar detalle
      await client.query(
        `INSERT INTO detalle_transacciones (transaccion_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [transaccionId, producto_id, cantidad, precioUnitario, subtotal]
      );

      // Actualizar inventario
      await client.query(
        `UPDATE inventario SET stock_actual = stock_actual - $1, actualizado_en = NOW() WHERE producto_id = $2`,
        [cantidad, producto_id]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ transaccion_id: transaccionId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error en checkout:', err);
    res.status(500).json({ error: 'Error procesando checkout' });
  } finally {
    client.release();
  }
});

module.exports = router;