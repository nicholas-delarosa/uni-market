const express = require('express');
const router = express.Router();
const pool = require('../db');

async function getOrCreateCategoriaEmprendimientoId(tipo) {
  if (!tipo) return null;
  const existente = await pool.query(
    'SELECT id FROM categorias_emprendimiento WHERE tipo_emprendimiento = $1',
    [tipo]
  );
  if (existente.rows.length) return existente.rows[0].id;

  const creada = await pool.query(
    'INSERT INTO categorias_emprendimiento (tipo_emprendimiento) VALUES ($1) RETURNING id',
    [tipo]
  );
  return creada.rows[0].id;
}

// GET /api/emprendimientos?universidad_id=1&usuario_id=2
router.get('/', async (req, res) => {
  const { universidad_id, usuario_id } = req.query;

  try {
    const params = [];
    let where = `WHERE e.activo = true`;
    if (universidad_id) {
      params.push(universidad_id);
      where += ` AND e.universidad_id = $${params.length}`;
    }
    if (usuario_id) {
      params.push(usuario_id);
      where += ` AND e.usuario_id = $${params.length}`;
    }

    const query = `
      SELECT
        e.id,
        e.nombre_emprendimiento AS name,
        e.logo_url AS avatar,
        e.descripcion,
        e.universidad_id AS "universityId",
        uni.nombre_universidad AS universidad,
        e.categoria_emprendimiento_id AS "categoriaId",
        ce.tipo_emprendimiento AS categoria,
        e.whatsapp_contacto AS whatsapp,
        e.hora_apertura AS "horaApertura",
        e.hora_cierre AS "horaCierre",
        e.abierto,
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
      LEFT JOIN universidades uni ON uni.id = e.universidad_id
      ${where}
      GROUP BY e.id, ce.tipo_emprendimiento, uni.nombre_universidad
      ORDER BY e.nombre_emprendimiento
    `;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener emprendimientos' });
  }
});

// POST /api/emprendimientos
// body: { usuario_id, nombre, categoria, descripcion, whatsapp, horaApertura, horaCierre }
router.post('/', async (req, res) => {
  const { usuario_id, nombre, categoria, descripcion, whatsapp, horaApertura, horaCierre } = req.body;

  if (!usuario_id || !nombre) {
    return res.status(400).json({ error: 'usuario_id y nombre son obligatorios' });
  }

  try {
    // el usuario tiene que existir y ya tener universidad asignada
    const usuarioResult = await pool.query(
      'SELECT universidad_id FROM usuarios WHERE id = $1',
      [usuario_id]
    );
    if (usuarioResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const universidadId = usuarioResult.rows[0].universidad_id;

    // evita que un usuario termine con 2 emprendimientos por error
    const existente = await pool.query(
      'SELECT id FROM emprendimientos WHERE usuario_id = $1 AND activo = true',
      [usuario_id]
    );
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Este usuario ya tiene un emprendimiento creado' });
    }

    const categoriaId = await getOrCreateCategoriaEmprendimientoId(categoria);

    const result = await pool.query(
      `INSERT INTO emprendimientos
         (nombre_emprendimiento, descripcion, usuario_id, universidad_id, categoria_emprendimiento_id,
          whatsapp_contacto, hora_apertura, hora_cierre, activo, abierto)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, true)
       RETURNING id`,
      [nombre, descripcion || null, usuario_id, universidadId, categoriaId,
       whatsapp || null, horaApertura || null, horaCierre || null]
    );

    res.status(201).json({ id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el emprendimiento' });
  }
});

// PUT /api/emprendimientos/:id
// body: { nombre, categoria, descripcion, whatsapp, horaApertura, horaCierre }
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, descripcion, whatsapp, horaApertura, horaCierre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: 'El nombre del emprendimiento es obligatorio' });
  }

  try {
    const categoriaId = await getOrCreateCategoriaEmprendimientoId(categoria);

    const result = await pool.query(
      `UPDATE emprendimientos
       SET nombre_emprendimiento = $1,
           categoria_emprendimiento_id = $2,
           descripcion = $3,
           whatsapp_contacto = $4,
           hora_apertura = $5,
           hora_cierre = $6
       WHERE id = $7
       RETURNING id`,
      [nombre, categoriaId, descripcion || null, whatsapp || null, horaApertura || null, horaCierre || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    res.json({ mensaje: 'Emprendimiento actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el emprendimiento' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { abierto } = req.body;

  if (typeof abierto !== 'boolean') {
    return res.status(400).json({ error: 'abierto debe ser true o false' });
  }

  try {
    const result = await pool.query(
      'UPDATE emprendimientos SET abierto = $1 WHERE id = $2 RETURNING id',
      [abierto, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Emprendimiento no encontrado' });
    }

    res.json({ mensaje: 'Estado de la tienda actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el estado de la tienda' });
  }
});

module.exports = router;