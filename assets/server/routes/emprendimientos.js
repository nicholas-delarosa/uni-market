const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/emprendimientos?universidad_id=1
router.get('/', async (req, res) => {
  const { universidad_id } = req.query;

  try {
    const params = [];
    let where = `WHERE e.activo = true`;
    if (universidad_id) {
      params.push(universidad_id);
      where += ` AND e.universidad_id = $${params.length}`;
    }

    const query = `
      SELECT
        e.id,
        e.nombre_emprendimiento AS name,
        e.logo_url AS avatar,
        e.universidad_id AS "universityId",
        COUNT(DISTINCT p.id)::int AS products,
        COALESCE(ROUND(AVG(r.puntuacion)::numeric, 1), 0) AS rating,
        COALESCE(
          ARRAY_AGG(DISTINCT ce.tipo_emprendimiento) FILTER (WHERE ce.tipo_emprendimiento IS NOT NULL),
          '{}'
        ) AS categories
      FROM emprendimientos e
      LEFT JOIN productos p ON p.emprendimiento_id = e.id AND p.activo = true
      LEFT JOIN resenas r ON r.emprendimiento_id = e.id
      LEFT JOIN categorias_emprendimiento ce ON ce.id = e.categoria_emprendimiento_id
      ${where}
      GROUP BY e.id
      ORDER BY e.nombre_emprendimiento
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener emprendimientos' });
  }
});

module.exports = router;
