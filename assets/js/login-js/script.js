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

/* ================= ELEMENTOS ================= */
const signInForm = document.querySelector('.container-form.sign-in');
const signUpForm = document.querySelector('.container-form.sign-up');

const signInEmail = document.getElementById('signin-email');
const signInPassword = document.getElementById('signin-password');

const signUpName = document.getElementById('signup-name');
const signUpEmail = document.getElementById('signup-email');
const signUpPassword = document.getElementById('signup-password');

const btnSwitchRegister = document.getElementById('registerAs');
const btnSwitchLogin = document.getElementById('loginAs');

/* ================= CAMBIO ENTRE FORMULARIOS ================= */
// si el usuario da click en "Crear cuenta"
btnSwitchRegister.addEventListener('click', () => {
  signInForm.classList.remove('active');
  signUpForm.classList.add('active');
});

// si el usuario da click en "Iniciar sesión"
btnSwitchLogin.addEventListener('click', () => {
  signUpForm.classList.remove('active');
  signInForm.classList.add('active');
});

/* ================= HELPERS DE ERROR Y VALIDACIÓN ================= */
// crea (o reutiliza) un <p> de error justo debajo del último campo del formulario
function getOrCreateErrorEl(form, afterInput, className) {
  let el = form.querySelector(`.${className}`);
  if (!el) {
    el = document.createElement('p');
    el.className = className;
    el.style.color = '#e5484d';
    el.style.fontSize = '13px';
    el.style.margin = '-8px 0 4px';
    el.style.display = 'none';
    afterInput.closest('label').insertAdjacentElement('afterend', el);
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
const signUpError = getOrCreateErrorEl(signUpForm, signUpPassword, 'signup-error');

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
    window.location.href = 'app.html';

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

  const nombreCompleto = signUpName.value.trim();
  const correo = signUpEmail.value.trim();
  const contrasena = signUpPassword.value;

  if (!nombreCompleto || !correo || !contrasena) {
    showError(signUpError, 'Completa todos los campos');
    return;
  }
  if (!isValidEmail(correo)) {
    showError(signUpError, 'Ingresa un correo válido');
    return;
  }
  if (contrasena.length < 6) {
    showError(signUpError, 'La contraseña debe tener al menos 6 caracteres');
    return;
  }

  // el backend guarda nombre y apellido por separado, pero el formulario
  // solo pide un campo de "nombre completo": lo partimos en dos.
  const partes = nombreCompleto.split(/\s+/);
  const nombre = partes[0];
  const apellido = partes.slice(1).join(' ');

  setLoading(signUpForm, true, 'Creando cuenta...');
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, correo, contrasena }),
    });

    const data = await res.json();

    if (!res.ok) {
      // 409 = correo ya registrado, 400/500 = otros errores del backend
      showError(signUpError, data.error || 'No se pudo crear la cuenta');
      return;
    }

    // cuenta creada: entra directo a la app, igual que si hubiera hecho login
    localStorage.setItem('um_usuario', JSON.stringify(data.usuario));
    window.location.href = 'app.html';

  } catch (err) {
    console.error(err);
    showError(signUpError, 'No se pudo conectar con el servidor. ¿Está corriendo el backend?');
  } finally {
    setLoading(signUpForm, false);
  }
});