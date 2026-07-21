const express = require('express');
const router = express.Router();
const pool = require('../db');

const VALID_REGISTER_ROLES = ['comprador', 'emprendedor'];

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^\d{7,15}$/.test(String(value || ''));
}

function isStrongPassword(value) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value || ''));
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    // 1. Buscar el usuario por correo
    const result = await pool.query(
      `SELECT id, nombre, apellido, correo, telefono, contrasena, universidad_id, activo
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
  const { nombre, apellido, telefono, universidad_id, rol, correo, contrasena } = req.body;

  if (!nombre || !apellido || !telefono || !universidad_id || !rol || !correo || !contrasena) {
    return res.status(400).json({ error: 'Todos los campos del registro son obligatorios' });
  }

  if (!isValidEmail(correo)) {
    return res.status(400).json({ error: 'Ingresa un correo válido' });
  }

  if (!isValidPhone(telefono)) {
    return res.status(400).json({ error: 'Ingresa un teléfono válido de 7 a 15 dígitos' });
  }

  if (!isStrongPassword(contrasena)) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números' });
  }

  if (!VALID_REGISTER_ROLES.includes(String(rol).toLowerCase())) {
    return res.status(400).json({ error: 'Rol inválido' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verificar que el correo no esté ya registrado
    const existe = await client.query(
      `SELECT id FROM usuarios WHERE correo = $1`,
      [correo]
    );

    if (existe.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });
    }

    const universidad = await client.query(
      `SELECT id FROM universidades WHERE id = $1`,
      [universidad_id]
    );

    if (universidad.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'La universidad seleccionada no existe' });
    }

    const roleResult = await client.query(
      `SELECT id, rol FROM roles WHERE LOWER(rol) = LOWER($1) LIMIT 1`,
      [rol]
    );

    if (roleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El rol seleccionado no está configurado en la base de datos' });
    }

    // 2. Crear el usuario
    const result = await client.query(
      `INSERT INTO usuarios (nombre, apellido, correo, contrasena, telefono, universidad_id, activo)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, nombre, apellido, correo, telefono, universidad_id, activo`,
      [nombre, apellido, correo, contrasena, telefono, universidad_id]
    );

    const usuario = result.rows[0];

    await client.query(
      `INSERT INTO usuario_roles (usuario_id, rol_id)
       VALUES ($1, $2)`,
      [usuario.id, roleResult.rows[0].id]
    );

    await client.query('COMMIT');

    // 3. Responder igual que /login (mismo shape: { usuario: {...} })
    // para que el front pueda reusar la misma lógica de guardado en localStorage
    res.status(201).json({ usuario: { ...usuario, roles: [roleResult.rows[0].rol] } });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  } finally {
    client.release();
  }
});

// GET /api/auth/me/:usuarioId
// Valida que el usuario exista y retorna sus datos actuales
router.get('/me/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  if (!usuarioId) {
    return res.status(400).json({ error: 'Usuario ID es obligatorio' });
  }

  try {
    const result = await pool.query(
      `SELECT id, nombre, apellido, correo, telefono, universidad_id, activo
       FROM usuarios
       WHERE id = $1`,
      [usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    if (!usuario.activo) {
      return res.status(403).json({ error: 'Esta cuenta está desactivada' });
    }

    // Traer los roles del usuario
    const rolesResult = await pool.query(
      `SELECT r.rol
       FROM usuario_roles ur
       JOIN roles r ON r.id = ur.rol_id
       WHERE ur.usuario_id = $1`,
      [usuario.id]
    );
    const roles = rolesResult.rows.map(r => r.rol);

    res.json({
      usuario: { ...usuario, roles },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// PUT /api/auth/universidad/:usuarioId
// Actualiza la universidad del usuario
router.put('/universidad/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  const { universidad_id } = req.body;

  if (!usuarioId || !universidad_id) {
    return res.status(400).json({ error: 'Usuario ID y universidad_id son obligatorios' });
  }

  try {
    // Verificar que la universidad exista
    const uniCheck = await pool.query(
      'SELECT id FROM universidades WHERE id = $1',
      [universidad_id]
    );
    if (uniCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Universidad no encontrada' });
    }

    // Actualizar la universidad del usuario
    const result = await pool.query(
      `UPDATE usuarios 
       SET universidad_id = $1 
       WHERE id = $2
       RETURNING id, nombre, apellido, correo, telefono, universidad_id, activo`,
      [universidad_id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    // Traer los roles del usuario
    const rolesResult = await pool.query(
      `SELECT r.rol
       FROM usuario_roles ur
       JOIN roles r ON r.id = ur.rol_id
       WHERE ur.usuario_id = $1`,
      [usuario.id]
    );
    const roles = rolesResult.rows.map(r => r.rol);

    res.json({
      usuario: { ...usuario, roles },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar universidad' });
  }
});

module.exports = router;