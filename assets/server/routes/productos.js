const express = require('express');
const router = express.Router();
const pool = require('../db');

// Busca la categoría por nombre; si no existe, la crea.
async function getOrCreateCategoriaId(tipo) {
  if (!tipo) return null;
  const existente = await pool.query(
    'SELECT id FROM categorias_producto WHERE tipo_p = $1',
    [tipo]
  );
  if (existente.rows.length) return existente.rows[0].id;

  const creada = await pool.query(
    'INSERT INTO categorias_producto (tipo_p) VALUES ($1) RETURNING id',
    [tipo]
  );
  return creada.rows[0].id;
}

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
        e.universidad_id AS "universityId",
        COALESCE(i.stock_actual, 0) AS stock,
        COALESCE(i.stock_minimo, 0) AS "stockMinimo"
      FROM productos p
      JOIN emprendimientos e ON e.id = p.emprendimiento_id
      LEFT JOIN categorias_producto cp ON cp.id = p.categoria_producto_id
      LEFT JOIN inventario i ON i.producto_id = p.id
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

// POST /api/productos
// body: { nombre, categoria, precio, stock, descripcion, imagenUrl, emprendimientoId }
router.post('/', async (req, res) => {
  const { nombre, categoria, precio, stock, descripcion, imagenUrl, emprendimientoId } = req.body;

  if (!nombre || !precio || !emprendimientoId) {
    return res.status(400).json({ error: 'Nombre, precio y emprendimiento son obligatorios' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const categoriaId = await getOrCreateCategoriaId(categoria);

    const productoResult = await client.query(
      `INSERT INTO productos (nombre, descripcion, precio, imagen_url, emprendimiento_id, categoria_producto_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [nombre, descripcion || null, precio, imagenUrl || null, emprendimientoId, categoriaId]
    );
    const nuevoId = productoResult.rows[0].id;

    // stock_minimo por defecto en 5: si baja de ahí, se marca "Bajo" en el panel
    await client.query(
      `INSERT INTO inventario (producto_id, stock_actual, stock_minimo) VALUES ($1, $2, 5)`,
      [nuevoId, stock || 0]
    );

    await client.query('COMMIT');
    res.status(201).json({ id: nuevoId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  } finally {
    client.release();
  }
});

// PUT /api/productos/:id
// body: { nombre, categoria, precio, stock, descripcion, imagenUrl }
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, categoria, precio, stock, descripcion, imagenUrl } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const categoriaId = await getOrCreateCategoriaId(categoria);

    const result = await client.query(
      `UPDATE productos
       SET nombre = $1, descripcion = $2, precio = $3, imagen_url = COALESCE($4, imagen_url), categoria_producto_id = $5
       WHERE id = $6
       RETURNING id`,
      [nombre, descripcion || null, precio, imagenUrl || null, categoriaId, id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // upsert de inventario: si ya existe la fila la actualiza, si no la crea
    await client.query(
      `INSERT INTO inventario (producto_id, stock_actual, stock_minimo)
       VALUES ($1, $2, 5)
       ON CONFLICT (producto_id)
       DO UPDATE SET stock_actual = EXCLUDED.stock_actual, actualizado_en = NOW()`,
      [id, stock || 0]
    );

    await client.query('COMMIT');
    res.json({ mensaje: 'Producto actualizado' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar el producto' });
  } finally {
    client.release();
  }
});

// DELETE /api/productos/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    // código 23503 = viola una foreign key: significa que este producto
    // ya tiene ventas registradas en detalle_transacciones
    if (err.code === '23503') {
      return res.status(409).json({
        error: 'Este producto ya tiene ventas registradas, no se puede eliminar. Puedes desactivarlo en su lugar.',
      });
    }
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = router;