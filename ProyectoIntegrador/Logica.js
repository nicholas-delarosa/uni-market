// Usamos DOMContentLoaded para asegurarnos de que el HTML cargue completamente
// antes de que nuestro JavaScript intente buscar los botones.
document.addEventListener('DOMContentLoaded', function() {

    // -----------------------------------------------------------
    // 1. Logo "Unimarket": Regresar siempre al inicio (landing page)
    // -----------------------------------------------------------
    const logoUnimarket = document.getElementById('logo-unimarket');
    if (logoUnimarket) {
        logoUnimarket.addEventListener('click', function(evento) {
            evento.preventDefault(); 
            // Cambia 'index.html' por el nombre real de su página principal si es diferente
            window.location.href = 'index.html'; 
        });
    }

    // -----------------------------------------------------------
    // 2. FAQ: Scroll interno a la sección de preguntas frecuentes
    // -----------------------------------------------------------
    const enlaceFaq = document.getElementById('enlace-faq');
    if (enlaceFaq) {
        enlaceFaq.addEventListener('click', function(evento) {
            evento.preventDefault();
            const seccionFaq = document.getElementById('seccion-faq'); // El id de la sección FAQ en el HTML
            if (seccionFaq) {
                // Esto hace que la pantalla baje suavemente hasta la sección
                seccionFaq.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // -----------------------------------------------------------
    // 3. Explorar Marketplace y Explorar productos: Redirigir al catálogo
    // -----------------------------------------------------------
    const btnExplorarMarketplace = document.getElementById('btn-explorar-marketplace');
    const btnExplorarProductos = document.getElementById('btn-explorar-productos');

    // Creamos una función reutilizable ya que ambos botones hacen lo mismo
    function irAlCatalogo(evento) {
        evento.preventDefault();
        // Redirige al catálogo general sin pedir login
        window.location.href = 'catalogo.html'; 
    }

    if (btnExplorarMarketplace) btnExplorarMarketplace.addEventListener('click', irAlCatalogo);
    if (btnExplorarProductos) btnExplorarProductos.addEventListener('click', irAlCatalogo);

    // -----------------------------------------------------------
    // 4. Quiero emprender: Llevar al flujo de registro de emprendedor
    // -----------------------------------------------------------
    const btnQuieroEmprender = document.getElementById('btn-quiero-emprender');
    if (btnQuieroEmprender) {
        btnQuieroEmprender.addEventListener('click', function(evento) {
            evento.preventDefault();
            window.location.href = 'registro-emprendedor.html'; 
        });
    }

    // -----------------------------------------------------------
    // 5. Iniciar sesión: Abrir modal y detectar el rol
    // -----------------------------------------------------------
    const btnIniciarSesion = document.getElementById('btn-iniciar-sesion');
    const modalLogin = document.getElementById('modal-login'); // El contenedor del modal
    const btnCerrarModal = document.getElementById('btn-cerrar-modal'); // La "X" para cerrar
    const formularioLogin = document.getElementById('formulario-login');

    // Lógica para abrir el modal
    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener('click', function(evento) {
            evento.preventDefault();
            // Asumimos que el modal está oculto por CSS (display: none)
            modalLogin.style.display = 'flex'; 
        });
    }

    // Lógica para cerrar el modal (para que no se quede pegado)
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', function() {
            modalLogin.style.display = 'none';
        });
    }

    // Lógica de detección de rol cuando le den a "Ingresar" en el formulario
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', function(evento) {
            evento.preventDefault(); // Evita que la página recargue al enviar el form

            // Suponemos que en el HTML hay un <select> o input con id="rol-usuario"
            const rolSeleccionado = document.getElementById('rol-usuario').value;

            // Validación simple para redirigir dependiendo del rol
            if (rolSeleccionado === 'comprador') {
                window.location.href = 'catalogo.html'; // Lo mandamos a ver productos
            } else if (rolSeleccionado === 'emprendedor') {
                window.location.href = 'panel-privado.html'; // Lo mandamos a su panel de ventas
            } else {
                alert('Por favor, selecciona un rol válido (comprador o emprendedor).');
            }
        });
    }
});