(function () {
  const API_URL = 'http://localhost:3000/api';

  async function post(path, body) {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || 'No se pudo completar la operación');
    }

    return data;
  }

  function saveUser(usuario) {
    if (usuario) {
      localStorage.setItem('um_usuario', JSON.stringify(usuario));
    }
    return usuario;
  }

  async function resendInstitutionalCode(usuarioId) {
    return post('/auth/resend-institutional-code', { usuario_id: usuarioId });
  }

  async function verifyInstitutionalCode(usuarioId, codigo) {
    return post('/auth/verify-institutional-email', {
      usuario_id: usuarioId,
      codigo,
    });
  }

  async function tryResendCode(user) {
    try {
      await resendInstitutionalCode(user.id);
      return true;
    } catch (err) {
      alert(err.message || 'No se pudo reenviar el código de verificación.');
      return false;
    }
  }

  async function promptInstitutionalVerification(user, options = {}) {
    const {
      introMessage,
      successMessage = 'Tu correo institucional quedó verificado.',
      resendOnStart = false,
    } = options;

    if (!user || !user.id || !user.correo_institucional) {
      return user;
    }

    if (user.correo_institucional_verificado) {
      return user;
    }

    if (resendOnStart) {
      const resent = await tryResendCode(user);
      if (!resent) {
        return null;
      }
    }

    if (introMessage) {
      alert(introMessage);
    }

    while (true) {
      const codigo = window.prompt(
        `Ingresa el código enviado a ${user.correo_institucional}`,
        ''
      );

      if (codigo === null) {
        return null;
      }

      if (!codigo.trim()) {
        alert('Debes ingresar el código de verificación.');
        continue;
      }

      try {
        const data = await verifyInstitutionalCode(user.id, codigo.trim());
        saveUser(data.usuario);
        alert(successMessage);
        return data.usuario;
      } catch (err) {
        const message = err.message || 'No se pudo verificar el código';
        if (/expiró/i.test(message)) {
          const shouldResend = window.confirm(`${message}. ¿Quieres que enviemos un nuevo código?`);
          if (!shouldResend) {
            return null;
          }

          const resent = await tryResendCode(user);
          if (!resent) {
            return null;
          }
          alert(`Enviamos un nuevo código a ${user.correo_institucional}.`);
          continue;
        }

        const retry = window.confirm(`${message}. ¿Quieres intentarlo de nuevo?`);
        if (!retry) {
          return null;
        }
      }
    }
  }

  window.UmInstitutionalVerification = {
    promptInstitutionalVerification,
    resendInstitutionalCode,
  };
})();