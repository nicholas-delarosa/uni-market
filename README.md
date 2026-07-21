# UniMarket

Marketplace universitario que conecta a estudiantes emprendedores con la comunidad de sus instituciones educativas. Permite explorar productos, gestionar emprendimientos, controlar inventario y administrar pedidos, todo dentro de un mismo ecosistema por universidad.

> Proyecto Integrador — CodeUp Riwi: Beyond Limits

---

## Tabla de contenido

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [API — Endpoints principales](#api--endpoints-principales)
- [Flujo de trabajo con Git (GitFlow)](#flujo-de-trabajo-con-git-gitflow)
- [Equipo](#equipo)

---

## Tecnologías

| Componente | Tecnología |
|---|---|
| Backend | Node.js + Express 4.19 |
| Base de datos | PostgreSQL (driver `pg`) |
| Frontend | HTML5, CSS3/SCSS, JavaScript (sin frameworks) |
| Configuración | dotenv |
| CORS | cors 2.8 |
| Desarrollo | nodemon 3.1 |
| Control de versiones | Git + GitHub |
| Contenedores | Docker |
| Administrador BD | DBeaver |

## Estructura del proyecto

```
uni-market/
├── app.html               # Vista principal / marketplace
├── landing.html            # Página de aterrizaje
├── login.html               # Autenticación
├── emprendedor.html         # Panel del emprendedor
└── assets/
    ├── js/
    │   ├── app-js/          # Lógica del marketplace
    │   ├── business-js/     # Lógica del panel de emprendedor
    │   ├── landing-js/      # Lógica de la landing
    │   ├── login-js/        # Lógica de autenticación
    │   └── shared/          # Utilidades compartidas entre vistas
    ├── server/
    │   ├── index.js          # Punto de entrada del servidor Express
    │   ├── db.js              # Pool de conexión a PostgreSQL
    │   ├── package.json
    │   └── routes/
    │       ├── auth.js
    │       ├── universidades.js
    │       ├── emprendimientos.js
    │       ├── productos.js
    │       ├── inventario.js
    │       └── pedidos.js
    ├── src/                  # Imágenes e íconos SVG
    └── styles/               # CSS compilado y fuentes SCSS
```

## Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)
- [PostgreSQL](https://www.postgresql.org/) (local o vía Docker)
- [Git](https://git-scm.com/)
- Opcional: [DBeaver](https://dbeaver.io/) para administrar la base de datos

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/nicholas-delarosa/uni-market.git
cd uni-market
```

Instala las dependencias del backend:

```bash
cd assets/server
npm install
```

## Variables de entorno

Crea un archivo `.env` dentro de `assets/server` con las siguientes variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=unimarket
DB_USER=usuario
DB_PASSWORD=contraseña
PORT=3000
```

> ⚠️ El archivo `.env` no debe subirse al repositorio. Verifica que esté incluido en `.gitignore`.

## Ejecución

Desde `assets/server`:

```bash
# Modo desarrollo (recarga automática con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor queda disponible en `http://localhost:3000`. Todas las rutas del API están disponibles bajo el prefijo `/api`.

Para el frontend, abre `index.html` directamente en el navegador, o sírvelos con una extensión tipo *Live Server*.

## API — Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Inicio de sesión de usuarios |
| GET | `/api/universidades` | Lista de universidades registradas |
| GET | `/api/emprendimientos` | Lista de emprendimientos |
| PUT / PATCH | `/api/emprendimientos/:id` | Actualiza un emprendimiento |
| GET | `/api/productos` | Catálogo de productos (filtros `?universidad_id=` y `?emprendimiento_id=`) |
| POST | `/api/productos` | Crea un producto |
| PUT | `/api/productos/:id` | Actualiza un producto |
| DELETE | `/api/productos/:id` | Elimina/desactiva un producto |
| PATCH | `/api/inventario/:productoId` | Actualiza existencias de un producto |
| GET | `/api/pedidos` | Lista de pedidos |
| GET | `/api/pedidos/resumen` | Resumen agregado de pedidos |
| GET | `/api/pedidos/estadisticas` | Estadísticas de ventas |
| PATCH | `/api/pedidos/:id` | Actualiza el estado de un pedido |

## Flujo de trabajo con Git (GitFlow)

Este proyecto sigue una estrategia basada en **GitFlow**:

- `main` — versión estable y desplegable.
- `develop` — rama de integración de nuevas funcionalidades.
- `feature/nombre-funcionalidad` — una rama por funcionalidad, creada desde `develop`.
- Cada integrante trabaja en su propia rama (por ejemplo `diego_gonzalez`) y abre un **Pull Request** hacia `develop` para su revisión antes de fusionar.

Comandos básicos:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad
# ... trabajo ...
git add .
git commit -m "feat: descripción del cambio"
git push -u origin feature/nueva-funcionalidad
```

Luego se abre un Pull Request en GitHub hacia `develop` para su revisión y fusión.

## Equipo

| Rol | Integrante |
|---|---|
| Scrum Master / Líder del equipo | [Diego Gonzáles](https://github.com/Gonza204658) |
| Backend Developer | [Manuel Rueda](https://github.com/Maru-rc) y [Julio Ariza](https://github.com/juariz) |
| Frontend Developer | [Nicholas De la Rosa](https://github.com/nicholas-delarosa) |
| Product Owner | [Diego Rodriguez](https://github.com/Dieg0Rgu) |

---