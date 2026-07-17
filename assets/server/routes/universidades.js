const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/universidades
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre_universidad AS name
       FROM universidades
       ORDER BY nombre_universidad`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener universidades' });
  }
});

module.exports = router;
