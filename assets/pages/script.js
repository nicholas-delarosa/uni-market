// ==========================
// ELEMENTOS
// ==========================

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");


// ==========================
// MOSTRAR LOGIN
// ==========================

function showLogin() {

    loginSection.classList.remove("hidden");
    registerSection.classList.add("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

}


// ==========================
// MOSTRAR REGISTRO
// ==========================

function showRegister() {

    registerSection.classList.remove("hidden");
    loginSection.classList.add("hidden");

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

}


// ==========================
// EVENTOS TABS
// ==========================

loginTab.addEventListener("click", showLogin);

registerTab.addEventListener("click", showRegister);


// ==========================
// LINKS
// ==========================

goRegister.addEventListener("click", function(e){

    e.preventDefault();

    showRegister();

});


goLogin.addEventListener("click", function(e){

    e.preventDefault();

    showLogin();

});


// ==========================
// MOSTRAR / OCULTAR CONTRASEÑAS
// ==========================

const eyes = document.querySelectorAll(".password i");

eyes.forEach((eye)=>{

    eye.addEventListener("click",()=>{

        const input = eye.previousElementSibling;

        if(input.type === "password"){

            input.type = "text";

            eye.classList.remove("fa-eye");

            eye.classList.add("fa-eye-slash");

        }else{

            input.type = "password";

            eye.classList.remove("fa-eye-slash");

            eye.classList.add("fa-eye");

        }

    });

});