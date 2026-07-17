const express = require('express');
const router = express.Router();
const pool = require('../db');

const ESTADOS_VALIDOS = ['pendiente', 'confirmado', 'entregado', 'cancelado'];

// GET /api/pedidos?emprendimiento_id=1&estado=pendiente
router.get('/', async (req, res) => {
  const { emprendimiento_id, estado } = req.query;

  if (!emprendimiento_id) {
    return res.status(400).json({ error: 'emprendimiento_id es obligatorio' });
  }

  try {
    const params = [emprendimiento_id];
    let where = `WHERE p.emprendimiento_id = $1`;

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
// Todo lo que necesita el dashboard en una sola llamada.
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

module.exports = router;