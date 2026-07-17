const express = require('express');
const router = express.Router();
const pool = require('../db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    // 1. Buscar el usuario por correo
    const result = await pool.query(
      `SELECT id, nombre, apellido, correo, contrasena, universidad_id, activo
       FROM usuarios
       WHERE correo = $1`,
      [correo]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    const usuario = result.rows[0];

    if (!usuario.activo) {
      return res.status(403).json({ error: 'Esta cuenta está desactivada' });
    }

    // 2. Comparar la contraseña directo
    if (contrasena !== usuario.contrasena) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
    }

    // 3. Traer los roles del usuario
    const rolesResult = await pool.query(
      `SELECT r.rol
       FROM usuario_roles ur
       JOIN roles r ON r.id = ur.rol_id
       WHERE ur.usuario_id = $1`,
      [usuario.id]
    );
    const roles = rolesResult.rows.map(r => r.rol);

    // 4. Responder sin la contraseña
    delete usuario.contrasena;

    res.json({
      usuario: { ...usuario, roles },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nombre, apellido, correo, contrasena } = req.body;

  if (!nombre || !correo || !contrasena) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' });
  }

  try {
    // 1. Verificar que el correo no esté ya registrado
    const existe = await pool.query(
      `SELECT id FROM usuarios WHERE correo = $1`,
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });
    }

    // 2. Crear el usuario
    // Nota: universidad_id queda en null porque el formulario de registro
    // todavía no pide universidad. Si la columna es NOT NULL en la BD,
    // esta consulta va a fallar y hay que agregar ese campo al formulario.
    const result = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, correo, contrasena, activo)
       VALUES ($1, $2, $3, $4, true)
       RETURNING id, nombre, apellido, correo, universidad_id, activo`,
      [nombre, apellido || '', correo, contrasena]
    );

    const usuario = result.rows[0];

    // 3. Responder igual que /login (mismo shape: { usuario: {...} })
    // para que el front pueda reusar la misma lógica de guardado en localStorage
    res.status(201).json({ usuario: { ...usuario, roles: [] } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
});

module.exports = router;