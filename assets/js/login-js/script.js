const body = document.body;
const modeToggle = document.getElementById("modeToggle");

const savedMode = localStorage.getItem("mode");

if (savedMode === "dark"){
    body.classList.add("dark-mode");
}

modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("mode", "dark");
    } else {
        localStorage.setItem("mode", "light");
    }
});

/* ================= LOGIN ================= */
const API_URL = 'http://localhost:3000/api';

const signInForm = document.querySelector('.container-form.sign-in');
const signUpForm = document.querySelector('.container-form.sign-up');
const signInEmail = document.getElementById('signin-email');
const signInPassword = document.getElementById('signin-password');
const btnSwitchRegister = document.getElementById("registerAs");
const btnSwitchLogin = document.getElementById("loginAs");

// Acción para cambiar del login al crear cuenta
// si el usuario da click en "Crear Cuenta"
btnSwitchRegister.addEventListener("click", () => {
  signInForm.classList.remove("active");
  signUpForm.classList.add("active");
});

// Acción para cambiar de crear cuenta al login
// si el usuario da click en "Iniciar Sesión"
btnSwitchLogin.addEventListener("click", () => {
  signUpForm.classList.remove("active");
  signInForm.classList.add("active");
});


// mensaje de error simple, se inserta debajo de la contraseña la primera vez que hace falta
let errorMsg = document.querySelector('.signin-error');
if (!errorMsg) {
  errorMsg = document.createElement('p');
  errorMsg.className = 'signin-error';
  errorMsg.style.color = '#e5484d';
  errorMsg.style.fontSize = '13px';
  errorMsg.style.display = 'none';
  signInPassword.closest('label').insertAdjacentElement('afterend', errorMsg);
}

signInForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.style.display = 'none';

  const submitBtn = signInForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Ingresando...';
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        correo: signInEmail.value.trim(),
        contrasena: signInPassword.value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // el backend responde 401/403 con { error: "..." } cuando el correo o la contraseña no son válidos
      errorMsg.textContent = data.error || 'No se pudo iniciar sesión';
      errorMsg.style.display = 'block';
      return;
    }

    // login correcto: guardamos el usuario para que el resto de la app sepa quién entró
    localStorage.setItem('um_usuario', JSON.stringify(data.usuario));
    window.location.href = 'app.html';

  } catch (err) {
    console.error(err);
    errorMsg.textContent = 'No se pudo conectar con el servidor. ¿Está corriendo el backend?';
    errorMsg.style.display = 'block';
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});