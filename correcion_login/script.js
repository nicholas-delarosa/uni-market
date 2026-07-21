// ==========================
// ELEMENTOS
// ==========================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");
const tabsSwitch = document.getElementById("tabsSwitch");

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");


// ==========================
// MOSTRAR LOGIN
// ==========================

function showLogin() {

    loginSection.classList.remove("hidden");
    loginSection.classList.add("active");

    registerSection.classList.add("hidden");
    registerSection.classList.remove("active");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    tabsSwitch.classList.remove("register-active");

}


// ==========================
// MOSTRAR REGISTRO
// ==========================

function showRegister() {

    registerSection.classList.remove("hidden");
    registerSection.classList.add("active");

    loginSection.classList.add("hidden");
    loginSection.classList.remove("active");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    tabsSwitch.classList.add("register-active");

}


// ==========================
// EVENTOS TABS
// ==========================

loginTab.addEventListener("click", showLogin);

registerTab.addEventListener("click", showRegister);


// ==========================
// LINKS DE CAMBIO (dentro de cada formulario)
// ==========================

goRegister.addEventListener("click", function (e) {

    e.preventDefault();

    showRegister();

});


goLogin.addEventListener("click", function (e) {

    e.preventDefault();

    showLogin();

});


// ==========================
// MOSTRAR / OCULTAR CONTRASEÑAS
// ==========================

const eyes = document.querySelectorAll(".toggle-password");

eyes.forEach((eye) => {

    eye.addEventListener("click", () => {

        const input = eye.previousElementSibling;

        if (input.type === "password") {

            input.type = "text";

            eye.classList.remove("fa-eye");
            eye.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            eye.classList.remove("fa-eye-slash");
            eye.classList.add("fa-eye");

        }

    });

});


// ==========================
// MODO CLARO / OSCURO
// ==========================

const btnMode = document.getElementById("btnMode");
const modeToggle = document.getElementById("modeToggle");

modeToggle.addEventListener("click", () => {

    const isDark = document.body.classList.toggle("dark-mode");

    btnMode.classList.toggle("dark-mode", isDark);
    btnMode.classList.toggle("light-mode", !isDark);

});


// ==========================
// REGISTRO: A DÓNDE REDIRIGE SEGÚN EL ROL
// ==========================
// "comprador"    -> app.html (catálogo)
// "emprendedor"  -> panel-emprendedor.html

const registerForm = registerSection;

registerForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const role = registerForm.querySelector('input[name="role"]:checked').value;
    const password = document.getElementById("signup-password").value;
    const passwordConfirm = document.getElementById("signup-password-confirm").value;

    if (password !== passwordConfirm) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    if (role === "comprador") {
        window.location.href = "app.html";
    } else if (role === "emprendedor") {
        window.location.href = "panel-emprendedor.html";
    }

});


// ==========================
// LOGIN: envío del formulario
// ==========================

loginSection.addEventListener("submit", function (e) {

    e.preventDefault();

    // Aquí iría la validación / llamada a la API de autenticación.
    window.location.href = "app.html";

});
