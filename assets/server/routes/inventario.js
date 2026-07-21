const express = require('express');
const router = express.Router();
const pool = require('../db');

// PATCH /api/inventario/:productoId
router.patch('/:productoId', async (req, res) => {
  const { productoId } = req.params;
  const { stock } = req.body;

  if (stock === undefined || stock < 0) {
    return res.status(400).json({ error: 'El stock debe ser un número mayor o igual a 0' });
  }

  try {
    // upsert: si el producto todavía no tenía fila en inventario, la crea
    const result = await pool.query(
      `INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
       VALUES ($1, $2, 5)
       ON CONFLICT (producto_id)
       DO UPDATE SET stock_actual = EXCLUDED.stock_actual, actualizado_en = NOW()
       RETURNING producto_id, stock_actual, stock_minimo`,
      [productoId, stock]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el inventario' });
  }
});

// PUT /api/inventario/:productoId  (compatibilidad con frontends que usan PUT)
router.put('/:productoId', async (req, res) => {
  const { productoId } = req.params;
  const { stock } = req.body;

  if (stock === undefined || stock < 0) {
    return res.status(400).json({ error: 'El stock debe ser un número mayor o igual a 0' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
       VALUES ($1, $2, 5)
       ON CONFLICT (producto_id)
       DO UPDATE SET stock_actual = EXCLUDED.stock_actual, actualizado_en = NOW()
       RETURNING producto_id, stock_actual, stock_minimo`,
      [productoId, stock]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el inventario' });
  }
});

module.exports = router;