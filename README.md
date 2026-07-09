# Unimarket — Landing

Landing de Unimarket, el marketplace universitario. Esta página es solo de
presentación: el botón "Ir a home" y los CTA ("Iniciar Sesión", "Explorar
MarketPlace", etc.) están pensados para redirigir a la aplicación real
más adelante; por ahora los `href="#"` quedan como placeholder.

## Estructura del proyecto

```
unimarket/
├── index.html
├── README.md
└── assets/
    ├── js/
    │   └── script.js
    │    ├── landing-js
    │        └── landing.js      # toda la lógica: tema, menú, scroll, carrusel
    ├── pages/                     # reservado para futuras páginas internas
    └── styles/
        ├── css/
        │   └── style.css          # CSS compilado, es el que enlaza el HTML
        └── scss/
            ├── style.scss      # todo lo de landing-style compila aquí
            └── landing-style/
                ├── _main-landing.scss      # entrada principal, solo hace @use de los parciales
                ├── _variables.scss
                ├── _base.scss
                ├── _buttons.scss
                ├── _header.scss
                ├── _hero.scss
                ├── _logo-strip.scss
                ├── _why.scss
                ├── _services.scss
                ├── _universities.scss
                └── _footer.scss
```

Cada parcial corresponde a una sección de la página (o a un grupo de
componentes chicos, como los botones), en el mismo orden en que aparecen
en el `index.html`. `_variables.scss` es el único que no tiene una sección
propia: ahí viven los breakpoints y toda la paleta de colores.

## Cómo se generó el CSS

El HTML no carga el `.scss` directamente (el navegador no lo entiende),
carga `assets/styles/css/style.css`, que es el resultado de compilar los
parciales. Si vas a tocar algo del diseño, edita el `.scss` correspondiente
y vuelve a compilar.

**Instalación de Sass (una sola vez):**

```bash
npm install -g sass
```

**Compilar cada vez que cambies un parcial:**

```bash
sass assets/styles/scss/landing-style/style.scss assets/styles/css/style.css
```


## Modo claro / oscuro

El cambio de tema no duplica reglas de CSS: casi todos los colores están
declarados como *custom properties* (`--color-texto`, `--color-fondo`,
etc.) dentro de `:root` en `_variables.scss`. El bloque `[data-theme='dark']`
sobreescribe esas mismas variables con la paleta oscura, así que el resto
de los parciales solo usan `var(--color-lo-que-sea)` y no necesitan saber
en qué tema están.

El botón del sol/luna en el header (`#themeToggle`) hace lo siguiente,
todo en `assets/js/landing-js/landing.js`:

1. Alterna el atributo `data-theme="light" | "dark"` en el `<html>`.
2. Guarda la elección en `localStorage` para que se recuerde en la
   próxima visita.
3. Actualiza el `aria-pressed` y el `aria-label` del botón para lectores
   de pantalla.

Además, hay un pequeño script **inline** en el `<head>` del HTML (antes de
cargar cualquier CSS) que lee `localStorage` o, si no hay nada guardado,
la preferencia del sistema (`prefers-color-scheme`) y pone el atributo
`data-theme` de una vez. Esto evita el típico parpadeo de "la página
carga en claro y after un instante salta a oscuro".

## JavaScript — qué hace cada función

Todo vive en `assets/js/landing-js/landing.js`, sin librerías externas, dividido en
funciones pequeñas que se llaman una vez que el DOM está listo:

- **`initThemeToggle`** — la lógica del botón de tema descrita arriba.
- **`initMobileNav`** — abre y cierra el menú en móvil agregando la clase
  `.is-open` (antes esto se hacía metiendo estilos inline desde JS, ahora
  el aspecto vive completo en `_header.scss`).
- **`initHeaderShadow`** — le agrega una sombra sutil al header cuando el
  usuario ya bajó un poco la página, para que no quede pegado al
  contenido.
- **`initScrollReveal`** — usa `IntersectionObserver` para hacer aparecer
  con un fade + slide las secciones (`.reveal`) a medida que entran en
  pantalla. Si el navegador no soporta `IntersectionObserver`, se muestra
  todo de inmediato sin animación.
- **`initUniversitiesMarquee`** — el carrusel de logos de universidades:
  se auto-desplaza solo, se puede arrastrar con mouse o dedo, y se
  detiene un momento después de soltarlo antes de retomar el auto-scroll.

## Librerías externas

No se usó ninguna librería de JavaScript ni framework de CSS: todo el
comportamiento (tema, menú, scroll reveal, carrusel) es JavaScript nativo
del navegador (Vanilla JS).

Lo único externo que carga la página son las tipografías de Google Fonts
(`Space Grotesk` e `Inter`), que ya venían en el HTML original y se
enlazan directo por `<link>` en el `<head>` — no requieren instalación.

Para el flujo de trabajo con los estilos sí se usa **Sass** (el
compilador `dart-sass`) como herramienta de build, instalado con
`npm install -g sass` como se indicó arriba.

## Notas de accesibilidad y limpieza

- El botón de menú móvil y el de tema tienen `aria-label`/`aria-pressed`
  actualizados por JS.
- El enlace "Ir a home" ahora lleva `rel="noopener"` por abrir en una
  pestaña nueva (`target="_blank"`).
- Los estados de foco (`:focus-visible`) de botones y del toggle de tema
  quedaron visibles para navegación por teclado.
- Se respeta `prefers-reduced-motion`: si el usuario pidió menos
  animaciones en su sistema, el scroll reveal y el scroll suave se
  desactivan.