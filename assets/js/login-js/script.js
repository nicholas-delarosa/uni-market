/* ================= DARK MODE ================= */
const body = document.body;
const modeToggle = document.getElementById("modeToggle");

const savedMode = localStorage.getItem("mode");
if (savedMode === "dark") {
  body.classList.add("dark-mode");
}

modeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem("mode", body.classList.contains("dark-mode") ? "dark" : "light");
});

/* ================= CONFIG ================= */
const API_URL = 'http://localhost:3000/api';
const AUTH_REDIRECT_KEY = 'um_post_login_redirect';

function getPostAuthRedirect() {
  const redirect = localStorage.getItem(AUTH_REDIRECT_KEY) || 'app.html';
  localStorage.removeItem(AUTH_REDIRECT_KEY);
  return redirect;
}

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Error al llamar ${path}`);
  return res.json();
}

/* ================= ELEMENTOS ================= */
const signInForm = document.querySelector('.container-form.sign-in');
const signUpForm = document.querySelector('.container-form.sign-up');

const signInEmail = document.getElementById('signin-email');
const signInPassword = document.getElementById('signin-password');

const signUpName = document.getElementById('signup-name');
const signUpLastName = document.getElementById('signup-lastname');
const signUpEmail = document.getElementById('signup-email');
const signUpInstitutionalEmailField = document.getElementById('signup-institutional-email-field');
const signUpInstitutionalEmail = document.getElementById('signup-institutional-email');
const signUpUniversity = document.getElementById('signup-university');
const signUpPhone = document.getElementById('signup-phone');
const signUpPassword = document.getElementById('signup-password');
const signUpPasswordConfirm = document.getElementById('signup-password-confirm');
const signUpRoleInputs = signUpForm.querySelectorAll('input[name="role"]');
const signUpRoleGroup = signUpForm.querySelector('.role-select');

let universitiesCatalog = [];

const btnSwitchRegister = document.getElementById('registerAs');
const btnSwitchLogin = document.getElementById('loginAs');

function setAuthMode(mode) {
  const showRegister = mode === 'register';
  signInForm.classList.toggle('active', !showRegister);
  signUpForm.classList.toggle('active', showRegister);
}

/* ================= CAMBIO ENTRE FORMULARIOS ================= */
// si el usuario da click en "Crear cuenta"
btnSwitchRegister.addEventListener('click', () => {
  setAuthMode('register');
});

// si el usuario da click en "Iniciar sesión"
btnSwitchLogin.addEventListener('click', () => {
  setAuthMode('login');
});

const authParams = new URLSearchParams(window.location.search);
if (authParams.get('mode') === 'register') {
  setAuthMode('register');
}

/* ================= HELPERS DE ERROR Y VALIDACIÓN ================= */
// crea (o reutiliza) un <p> de error justo debajo del último campo del formulario
function getOrCreateErrorEl(form, anchorEl, className) {
  let el = form.querySelector(`.${className}`);
  if (!el) {
    el = document.createElement('p');
    el.className = className;
    el.style.color = '#e5484d';
    el.style.fontSize = '13px';
    el.style.margin = '-8px 0 4px';
    el.style.display = 'none';
    const container = anchorEl.closest('label, .role-select') || anchorEl;
    container.insertAdjacentElement('afterend', el);
  }
  return el;
}

function showError(el, message) {
  el.textContent = message;
  el.style.display = 'block';
}

function hideError(el) {
  el.style.display = 'none';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidPhone(value) {
  return /^\d{7,15}$/.test(value);
}

function isStrongPassword(value) {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value);
}

function getSelectedRole() {
  const checked = signUpForm.querySelector('input[name="role"]:checked');
  return checked ? checked.value : '';
}

function getSelectedUniversity() {
  return universitiesCatalog.find(u => String(u.id) === String(signUpUniversity.value)) || null;
}

function getUniversityEmailDomain() {
  return String(getSelectedUniversity()?.emailDomain || '').trim().toLowerCase().replace(/^@/, '');
}

function toggleInstitutionalField() {
  const entrepreneur = getSelectedRole() === 'emprendedor';
  signUpInstitutionalEmailField.style.display = entrepreneur ? '' : 'none';
  signUpInstitutionalEmail.required = entrepreneur;

  if (!entrepreneur) {
    signUpInstitutionalEmail.value = '';
  }
}

async function loadUniversities() {
  try {
    const universities = await apiGet('/universidades');
    universitiesCatalog = Array.isArray(universities) ? universities : [];
    signUpUniversity.innerHTML = [
      '<option value="" selected>Selecciona tu universidad</option>',
      ...universitiesCatalog.map(u => `<option value="${u.id}">${u.name}</option>`),
    ].join('');
  } catch (err) {
    console.error(err);
    signUpUniversity.innerHTML = '<option value="" selected>No se pudieron cargar las universidades</option>';
  }
}

// deshabilita el botón y cambia su texto mientras se espera respuesta del backend
function setLoading(form, isLoading, loadingText) {
  const btn = form.querySelector('button[type="submit"]');
  if (isLoading) {
    btn.dataset.originalText = btn.textContent;
    btn.textContent = loadingText;
    btn.disabled = true;
  } else {
    btn.textContent = btn.dataset.originalText || btn.textContent;
    btn.disabled = false;
  }
}

const signInError = getOrCreateErrorEl(signInForm, signInPassword, 'signin-error');
const signUpError = getOrCreateErrorEl(signUpForm, signUpRoleGroup, 'signup-error');

signUpPhone.addEventListener('input', () => {
  signUpPhone.value = signUpPhone.value.replace(/\D/g, '');
});

signUpRoleInputs.forEach(input => {
  input.addEventListener('change', toggleInstitutionalField);
});

loadUniversities();
toggleInstitutionalField();

/* ================= LOGIN ================= */
signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError(signInError);

  const correo = signInEmail.value.trim();
  const contrasena = signInPassword.value;

  if (!correo || !contrasena) {
    showError(signInError, 'Completa correo y contraseña');
    return;
  }
  if (!isValidEmail(correo)) {
    showError(signInError, 'Ingresa un correo válido');
    return;
  }

  setLoading(signInForm, true, 'Ingresando...');
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await res.json();

    if (!res.ok) {
      // el backend responde 401/403 con { error: "..." } cuando el correo o la contraseña no son válidos
      showError(signInError, data.error || 'No se pudo iniciar sesión');
      return;
    }

    // login correcto: guardamos el usuario para que el resto de la app sepa quién entró
    localStorage.setItem('um_usuario', JSON.stringify(data.usuario));

    if (data.verificationRequired) {
      alert(data.verificationMessage || 'Debes verificar tu correo institucional antes de usar el panel de emprendedor.');
    }

    window.location.href = getPostAuthRedirect();

  } catch (err) {
    console.error(err);
    showError(signInError, 'No se pudo conectar con el servidor. ¿Está corriendo el backend?');
  } finally {
    setLoading(signInForm, false);
  }
});

/* ================= REGISTRO ================= */
signUpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError(signUpError);

  const nombre = signUpName.value.trim();
  const apellido = signUpLastName.value.trim();
  const correo = signUpEmail.value.trim();
  const correo_institucional = signUpInstitutionalEmail.value.trim();
  const universidad_id = signUpUniversity.value;
  const telefono = signUpPhone.value.trim();
  const contrasena = signUpPassword.value;
  const confirmarContrasena = signUpPasswordConfirm.value;
  const rol = getSelectedRole();
  const universityDomain = getUniversityEmailDomain();

  if (!nombre || !apellido || !correo || !universidad_id || !telefono || !contrasena || !confirmarContrasena || !rol) {
    showError(signUpError, 'Completa todos los campos');
    return;
  }
  if (!isValidEmail(correo)) {
    showError(signUpError, 'Ingresa un correo válido');
    return;
  }
  if (rol === 'emprendedor' && !correo_institucional) {
    showError(signUpError, 'El correo institucional es obligatorio para emprendedores');
    return;
  }
  if (correo_institucional && !isValidEmail(correo_institucional)) {
    showError(signUpError, 'Ingresa un correo institucional válido');
    return;
  }
  if (rol === 'emprendedor' && (!universityDomain || correo_institucional.toLowerCase().split('@').pop() !== universityDomain)) {
    showError(signUpError, 'El correo institucional debe pertenecer al dominio de la universidad seleccionada');
    return;
  }
  if (!isValidPhone(telefono)) {
    showError(signUpError, 'Ingresa un teléfono válido de 7 a 15 dígitos');
    return;
  }
  if (!isStrongPassword(contrasena)) {
    showError(signUpError, 'La contraseña debe tener al menos 8 caracteres, incluyendo letras y números');
    return;
  }
  if (contrasena !== confirmarContrasena) {
    showError(signUpError, 'Las contraseñas no coinciden');
    return;
  }

  setLoading(signUpForm, true, 'Creando cuenta...');
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        apellido,
        telefono,
        universidad_id: Number(universidad_id),
        rol,
        correo,
        correo_institucional: rol === 'emprendedor' ? correo_institucional : null,
        contrasena,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // 409 = correo ya registrado, 400/500 = otros errores del backend
      showError(signUpError, data.error || 'No se pudo crear la cuenta');
      return;
    }

    // cuenta creada: entra directo a la app, igual que si hubiera hecho login
    localStorage.setItem('um_usuario', JSON.stringify(data.usuario));
    if (rol === 'emprendedor') {
      const verifiedUser = await window.UmInstitutionalVerification.promptInstitutionalVerification(data.usuario, {
        introMessage: `Enviamos un código de verificación a ${data.usuario.correo_institucional}. Debes validarlo antes de usar el panel de emprendedor.`,
      });

      if (verifiedUser) {
        localStorage.setItem('um_usuario', JSON.stringify(verifiedUser));
        localStorage.removeItem(AUTH_REDIRECT_KEY);
        window.location.href = 'emprendedor.html';
      } else {
        alert('Tu cuenta quedó creada, pero el panel de emprendedor seguirá bloqueado hasta verificar el correo institucional.');
        window.location.href = 'app.html';
      }
    } else {
      window.location.href = getPostAuthRedirect();
    }

  } catch (err) {
    console.error(err);
    showError(signUpError, 'No se pudo conectar con el servidor. ¿Está corriendo el backend?');
  } finally {
    setLoading(signUpForm, false);
  }
});