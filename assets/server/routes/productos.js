const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/productos?universidad_id=1&emprendimiento_id=3
router.get('/', async (req, res) => {
  const { universidad_id, emprendimiento_id } = req.query;

  try {
    const params = [];
    let where = `WHERE p.activo = true`;

    if (universidad_id) {
      params.push(universidad_id);
      where += ` AND e.universidad_id = $${params.length}`;
    }
    if (emprendimiento_id) {
      params.push(emprendimiento_id);
      where += ` AND e.id = $${params.length}`;
    }

    const query = `
      SELECT
        p.id,
        p.nombre AS name,
        p.precio AS price,
        p.imagen_url AS image,
        cp.tipo_p AS category,
        e.id AS "sellerId",
        e.nombre_emprendimiento AS "sellerName",
        e.universidad_id AS "universityId"
      FROM productos p
      JOIN emprendimientos e ON e.id = p.emprendimiento_id
      LEFT JOIN categorias_producto cp ON cp.id = p.categoria_producto_id
      ${where}
      ORDER BY p.fecha_creacion DESC
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

module.exports = router;
