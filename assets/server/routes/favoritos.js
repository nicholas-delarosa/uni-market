const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/favoritos?usuario_id=1
router.get('/', async (req, res) => {
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id es obligatorio' });
  }

  try {
    const result = await pool.query(
      `SELECT 
        f.id,
        f.usuario_id,
        f.producto_id,
        p.nombre AS "nombreProducto",
        p.precio,
        p.imagen_url,
        cp.tipo_p AS categoria,
        e.nombre_emprendimiento AS emprendimiento
      FROM favoritos f
      JOIN productos p ON p.id = f.producto_id
      LEFT JOIN categorias_producto cp ON cp.id = p.categoria_producto_id
      LEFT JOIN emprendimientos e ON e.id = p.emprendimiento_id
      WHERE f.usuario_id = $1
      ORDER BY f.creado_en DESC`,
      [usuario_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// POST /api/favoritos
// body: { usuario_id, producto_id }
router.post('/', async (req, res) => {
  const { usuario_id, producto_id } = req.body;

  if (!usuario_id || !producto_id) {
    return res.status(400).json({ error: 'usuario_id y producto_id son obligatorios' });
  }

  try {
    // Verificar que el producto exista
    const productoCheck = await pool.query(
      'SELECT id FROM productos WHERE id = $1',
      [producto_id]
    );
    if (productoCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar si ya existe
    const existente = await pool.query(
      'SELECT id FROM favoritos WHERE usuario_id = $1 AND producto_id = $2',
      [usuario_id, producto_id]
    );

    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Este producto ya está en favoritos' });
    }

    // Agregar a favoritos
    const result = await pool.query(
      `INSERT INTO favoritos (usuario_id, producto_id, creado_en)
       VALUES ($1, $2, NOW())
       RETURNING id, usuario_id, producto_id`,
      [usuario_id, producto_id]
    );

    res.status(201).json({
      favorito: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al agregar a favoritos' });
  }
});

// DELETE /api/favoritos/:productoId?usuario_id=1
router.delete('/:productoId', async (req, res) => {
  const { productoId } = req.params;
  const { usuario_id } = req.query;

  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id es obligatorio' });
  }

  try {
    const result = await pool.query(
      `DELETE FROM favoritos 
       WHERE usuario_id = $1 AND producto_id = $2
       RETURNING id`,
      [usuario_id, productoId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favorito no encontrado' });
    }

    res.json({ mensaje: 'Favorito eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar favorito' });
  }
});

module.exports = router;
