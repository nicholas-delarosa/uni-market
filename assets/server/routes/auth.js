const express = require('express');
const router = express.Router();
const pool = require('../db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const VALID_REGISTER_ROLES = ['comprador', 'emprendedor'];
const ROLE_DB_MAP = {
  comprador: 'estudiante',
  emprendedor: 'vendedor',
};

const EMAIL_VERIFICATION_EXPIRY_MINUTES = 15;

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeDomain(value) {
  return String(value || '').trim().toLowerCase().replace(/^@/, '');
}

function getEmailDomain(email) {
  const normalized = normalizeEmail(email);
  return normalized.includes('@') ? normalized.split('@').pop() : '';
}

function isEntrepreneurRole(role) {
  return normalizeRoleForDb(role) === 'vendedor';
}

function hasEntrepreneurRole(roles = []) {
  return roles.some(role => isEntrepreneurRole(role));
}

function buildVerificationCode() {
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

function buildVerificationExpiryDate() {
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + EMAIL_VERIFICATION_EXPIRY_MINUTES);
  return expiryDate;
}

function getMailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

async function sendInstitutionalVerificationEmail({ correo, nombre, codigo, universidadNombre }) {
  const transporter = getMailTransporter();
  if (!transporter) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  await transporter.sendMail({
    from,
    to: correo,
    subject: 'Verifica tu correo institucional en Unimarket',
    text: [
      `Hola ${nombre || 'usuario'},`,
      '',
      `Tu codigo de verificacion para Unimarket es: ${codigo}`,
      '',
      `Universidad: ${universidadNombre || 'Tu universidad'}`,
      `Este codigo vence en ${EMAIL_VERIFICATION_EXPIRY_MINUTES} minutos.`,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
        <p>Hola ${nombre || 'usuario'},</p>
        <p>Tu codigo de verificacion para <strong>Unimarket</strong> es:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${codigo}</p>
        <p>Universidad: <strong>${universidadNombre || 'Tu universidad'}</strong></p>
        <p>Este codigo vence en ${EMAIL_VERIFICATION_EXPIRY_MINUTES} minutos.</p>
      </div>
    `,
  });
}

async function createAndSendInstitutionalVerification(client, { usuarioId, correo, nombre, universidadNombre }) {
  const codigo = buildVerificationCode();
  const expiraEn = buildVerificationExpiryDate();

  await client.query(
    `DELETE FROM verificaciones_correo
     WHERE usuario_id = $1
       AND verificado_en IS NULL`,
    [usuarioId]
  );

  await client.query(
    `INSERT INTO verificaciones_correo (usuario_id, correo, token, expira_en)
     VALUES ($1, $2, $3, $4)`,
    [usuarioId, normalizeEmail(correo), codigo, expiraEn]
  );

  await sendInstitutionalVerificationEmail({
    correo: normalizeEmail(correo),
    nombre,
    codigo,
    universidadNombre,
  });
}

async function getUserRoles(client, usuarioId) {
  const rolesResult = await client.query(
    `SELECT r.rol
     FROM usuario_roles ur
     JOIN roles r ON r.id = ur.rol_id
     WHERE ur.usuario_id = $1`,
    [usuarioId]
  );
  return rolesResult.rows.map(r => r.rol);
}

async function buildAuthUser(client, usuarioId) {
  const result = await client.query(
    `SELECT id, nombre, apellido, correo, celular AS telefono, universidad_id, activo,
            correo_institucional, correo_institucional_verificado
     FROM usuarios
     WHERE id = $1`,
    [usuarioId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const usuario = result.rows[0];
  const roles = await getUserRoles(client, usuarioId);
  return { ...usuario, roles };
}

async function getUniversityById(client, universidadId) {
  const result = await client.query(
    `SELECT id, nombre_universidad, dominio_correo
     FROM universidades
     WHERE id = $1`,
    [universidadId]
  );
  return result.rows[0] || null;
}

function getVerificationPendingMessage() {
  return 'Debes verificar tu correo institucional antes de usar el panel de emprendedor';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^\d{7,15}$/.test(String(value || ''));
}

function isStrongPassword(value) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(String(value || ''));
}

function normalizeRoleForDb(role) {
  const normalized = String(role || '').toLowerCase().trim();
  return ROLE_DB_MAP[normalized] || normalized;
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const correo = normalizeEmail(req.body?.correo);
  const { contrasena } = req.body;

  if (!correo || !contrasena) {
    return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
  }

  try {
    // 1. Buscar el usuario por correo
    const result = await pool.query(
      `SELECT id, nombre, apellido, correo, celular AS telefono, contrasena, universidad_id, activo,
              correo_institucional, correo_institucional_verificado
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
    const roles = await getUserRoles(pool, usuario.id);

    // 4. Responder sin la contraseña
    delete usuario.contrasena;

    const verificationRequired = hasEntrepreneurRole(roles) && !usuario.correo_institucional_verificado;

    res.json({
      usuario: { ...usuario, roles },
      verificationRequired,
      verificationMessage: verificationRequired ? getVerificationPendingMessage() : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const {
    nombre,
    apellido,
    telefono,
    universidad_id,
    rol,
    contrasena,
    correo: rawCorreo,
    correo_institucional: rawCorreoInstitucional,
  } = req.body;
  const correo = normalizeEmail(rawCorreo);
  const correoInstitucional = normalizeEmail(rawCorreoInstitucional);
  const entrepreneur = isEntrepreneurRole(rol);

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

  if (entrepreneur && !correoInstitucional) {
    return res.status(400).json({ error: 'El correo institucional es obligatorio para emprendedores' });
  }

  if (correoInstitucional && !isValidEmail(correoInstitucional)) {
    return res.status(400).json({ error: 'Ingresa un correo institucional válido' });
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

    const universidad = await getUniversityById(client, universidad_id);

    if (!universidad) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'La universidad seleccionada no existe' });
    }

    const dominioUniversidad = normalizeDomain(universidad.dominio_correo);
    if (entrepreneur) {
      if (!dominioUniversidad) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'La universidad seleccionada no tiene un dominio institucional configurado' });
      }

      if (getEmailDomain(correoInstitucional) !== dominioUniversidad) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'El correo institucional no pertenece al dominio de la universidad seleccionada' });
      }

      const institucionalExiste = await client.query(
        `SELECT id FROM usuarios WHERE correo_institucional = $1`,
        [correoInstitucional]
      );

      if (institucionalExiste.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ error: 'Ese correo institucional ya está registrado por otro usuario' });
      }
    }

    const dbRole = normalizeRoleForDb(rol);
    let roleResult = await client.query(
      `SELECT id, rol FROM roles WHERE LOWER(rol) = LOWER($1) LIMIT 1`,
      [dbRole]
    );

    if (roleResult.rows.length === 0 && dbRole !== String(rol).toLowerCase().trim()) {
      roleResult = await client.query(
        `SELECT id, rol FROM roles WHERE LOWER(rol) = LOWER($1) LIMIT 1`,
        [String(rol).toLowerCase().trim()]
      );
    }

    if (roleResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El rol seleccionado no está configurado en la base de datos' });
    }

    // 2. Crear el usuario
    const result = await client.query(
      `INSERT INTO usuarios (
         nombre,
         apellido,
         correo,
         contrasena,
         celular,
         universidad_id,
         correo_institucional,
         correo_institucional_verificado,
         activo
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
       RETURNING id, nombre, apellido, correo, celular AS telefono, universidad_id, activo,
                 correo_institucional, correo_institucional_verificado`,
      [
        nombre,
        apellido,
        correo,
        contrasena,
        telefono,
        universidad_id,
        entrepreneur ? correoInstitucional : null,
        entrepreneur ? false : false,
      ]
    );

    const usuario = result.rows[0];

    await client.query(
      `INSERT INTO usuario_roles (usuario_id, rol_id)
       VALUES ($1, $2)`,
      [usuario.id, roleResult.rows[0].id]
    );

    if (entrepreneur) {
      try {
        await createAndSendInstitutionalVerification(client, {
          usuarioId: usuario.id,
          correo: correoInstitucional,
          nombre,
          universidadNombre: universidad.nombre_universidad,
        });
      } catch (mailErr) {
        await client.query('ROLLBACK');
        console.error(mailErr);
        if (mailErr.message === 'SMTP_NOT_CONFIGURED') {
          return res.status(500).json({
            error: 'El servidor no tiene configurado el envío de correos para la verificación institucional',
          });
        }
        return res.status(500).json({ error: 'No se pudo enviar el código de verificación institucional' });
      }
    }

    await client.query('COMMIT');

    // 3. Responder igual que /login (mismo shape: { usuario: {...} })
    // para que el front pueda reusar la misma lógica de guardado en localStorage
    res.status(201).json({
      usuario: { ...usuario, roles: [roleResult.rows[0].rol] },
      verificationRequired: entrepreneur,
      verificationMessage: entrepreneur ? getVerificationPendingMessage() : null,
    });
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
      `SELECT id, nombre, apellido, correo, celular AS telefono, universidad_id, activo,
              correo_institucional, correo_institucional_verificado
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
    const roles = await getUserRoles(pool, usuario.id);

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
       RETURNING id, nombre, apellido, correo, celular AS telefono, universidad_id, activo,
                 correo_institucional, correo_institucional_verificado`,
      [universidad_id, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    // Traer los roles del usuario
    const roles = await getUserRoles(pool, usuario.id);

    res.json({
      usuario: { ...usuario, roles },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar universidad' });
  }
});

// POST /api/auth/verify-institutional-email
router.post('/verify-institutional-email', async (req, res) => {
  const usuarioId = Number(req.body?.usuario_id);
  const codigo = String(req.body?.codigo || '').trim();

  if (!usuarioId || !codigo) {
    return res.status(400).json({ error: 'usuario_id y codigo son obligatorios' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const usuario = await buildAuthUser(client, usuarioId);
    if (!usuario) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!usuario.correo_institucional) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Este usuario no tiene correo institucional pendiente por verificar' });
    }

    if (usuario.correo_institucional_verificado) {
      await client.query('COMMIT');
      return res.json({ usuario, alreadyVerified: true });
    }

    const verificationResult = await client.query(
      `SELECT id, expira_en
       FROM verificaciones_correo
       WHERE usuario_id = $1
         AND correo = $2
         AND token = $3
         AND verificado_en IS NULL
       ORDER BY creado_en DESC
       LIMIT 1`,
      [usuarioId, normalizeEmail(usuario.correo_institucional), codigo]
    );

    if (verificationResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El código de verificación no es válido' });
    }

    const verification = verificationResult.rows[0];
    if (new Date(verification.expira_en) < new Date()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'El código de verificación expiró. Solicita uno nuevo' });
    }

    await client.query(
      `UPDATE verificaciones_correo
       SET verificado_en = NOW()
       WHERE id = $1`,
      [verification.id]
    );

    await client.query(
      `UPDATE usuarios
       SET correo_institucional_verificado = true
       WHERE id = $1`,
      [usuarioId]
    );

    const verifiedUser = await buildAuthUser(client, usuarioId);
    await client.query('COMMIT');

    res.json({ usuario: verifiedUser, verified: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'No se pudo verificar el correo institucional' });
  } finally {
    client.release();
  }
});

// POST /api/auth/resend-institutional-code
router.post('/resend-institutional-code', async (req, res) => {
  const usuarioId = Number(req.body?.usuario_id);

  if (!usuarioId) {
    return res.status(400).json({ error: 'usuario_id es obligatorio' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const usuario = await buildAuthUser(client, usuarioId);
    if (!usuario) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (!usuario.correo_institucional) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Este usuario no tiene correo institucional configurado' });
    }

    if (usuario.correo_institucional_verificado) {
      await client.query('COMMIT');
      return res.json({ usuario, alreadyVerified: true });
    }

    const universidad = await getUniversityById(client, usuario.universidad_id);

    try {
      await createAndSendInstitutionalVerification(client, {
        usuarioId,
        correo: usuario.correo_institucional,
        nombre: usuario.nombre,
        universidadNombre: universidad?.nombre_universidad,
      });
    } catch (mailErr) {
      await client.query('ROLLBACK');
      console.error(mailErr);
      if (mailErr.message === 'SMTP_NOT_CONFIGURED') {
        return res.status(500).json({
          error: 'El servidor no tiene configurado el envío de correos para la verificación institucional',
        });
      }
      return res.status(500).json({ error: 'No se pudo reenviar el código de verificación institucional' });
    }

    await client.query('COMMIT');

    res.json({ resent: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'No se pudo reenviar el código institucional' });
  } finally {
    client.release();
  }
});

module.exports = router;