--
-- PostgreSQL database dump
--

\restrict m65iuFCrBagNm1ea3ghwLejH42rMwKvJcWHkigknzTccmQSDAYjth76sBXRnIgf

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-20 20:33:08

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "Unimarket";
--
-- TOC entry 5223 (class 1262 OID 24576)
-- Name: Unimarket; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "Unimarket" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Spain.1252';


ALTER DATABASE "Unimarket" OWNER TO postgres;

\unrestrict m65iuFCrBagNm1ea3ghwLejH42rMwKvJcWHkigknzTccmQSDAYjth76sBXRnIgf
\connect "Unimarket"
\restrict m65iuFCrBagNm1ea3ghwLejH42rMwKvJcWHkigknzTccmQSDAYjth76sBXRnIgf

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 234 (class 1259 OID 24704)
-- Name: categorias_emprendimiento; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias_emprendimiento (
    id integer NOT NULL,
    tipo_emprendimiento character varying(100) NOT NULL
);


ALTER TABLE public.categorias_emprendimiento OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 24703)
-- Name: categorias_emprendimiento_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_emprendimiento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_emprendimiento_id_seq OWNER TO postgres;

--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 233
-- Name: categorias_emprendimiento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_emprendimiento_id_seq OWNED BY public.categorias_emprendimiento.id;


--
-- TOC entry 238 (class 1259 OID 24744)
-- Name: categorias_producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias_producto (
    id integer NOT NULL,
    tipo_p character varying(100) NOT NULL
);


ALTER TABLE public.categorias_producto OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 24743)
-- Name: categorias_producto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_producto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_producto_id_seq OWNER TO postgres;

--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 237
-- Name: categorias_producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_producto_id_seq OWNED BY public.categorias_producto.id;


--
-- TOC entry 222 (class 1259 OID 24590)
-- Name: ciudades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ciudades (
    id integer NOT NULL,
    ciudad character varying(100) NOT NULL
);


ALTER TABLE public.ciudades OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24589)
-- Name: ciudades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ciudades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ciudades_id_seq OWNER TO postgres;

--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 221
-- Name: ciudades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ciudades_id_seq OWNED BY public.ciudades.id;


--
-- TOC entry 246 (class 1259 OID 24825)
-- Name: detalle_transacciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detalle_transacciones (
    id integer NOT NULL,
    transaccion_id integer NOT NULL,
    producto_id integer NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    CONSTRAINT detalle_transacciones_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT detalle_transacciones_precio_unitario_check CHECK ((precio_unitario >= (0)::numeric)),
    CONSTRAINT detalle_transacciones_subtotal_check CHECK ((subtotal >= (0)::numeric))
);


ALTER TABLE public.detalle_transacciones OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 24824)
-- Name: detalle_transacciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.detalle_transacciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_transacciones_id_seq OWNER TO postgres;

--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 245
-- Name: detalle_transacciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.detalle_transacciones_id_seq OWNED BY public.detalle_transacciones.id;


--
-- TOC entry 236 (class 1259 OID 24713)
-- Name: emprendimientos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emprendimientos (
    id integer NOT NULL,
    nombre_emprendimiento character varying(150) NOT NULL,
    descripcion text,
    logo_url character varying(255),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    usuario_id integer NOT NULL,
    universidad_id integer,
    categoria_emprendimiento_id integer,
    whatsapp_contacto character varying(30),
    hora_apertura time without time zone,
    hora_cierre time without time zone,
    abierto boolean DEFAULT true NOT NULL
);


ALTER TABLE public.emprendimientos OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 24712)
-- Name: emprendimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emprendimientos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emprendimientos_id_seq OWNER TO postgres;

--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 235
-- Name: emprendimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emprendimientos_id_seq OWNED BY public.emprendimientos.id;


--
-- TOC entry 248 (class 1259 OID 24851)
-- Name: favoritos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favoritos (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    producto_id integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.favoritos OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 24850)
-- Name: favoritos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favoritos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favoritos_id_seq OWNER TO postgres;

--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 247
-- Name: favoritos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favoritos_id_seq OWNED BY public.favoritos.id;


--
-- TOC entry 242 (class 1259 OID 24781)
-- Name: inventario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventario (
    id integer NOT NULL,
    producto_id integer NOT NULL,
    stock_actual integer DEFAULT 0 NOT NULL,
    stock_minimo integer DEFAULT 0 NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT inventario_stock_actual_check CHECK ((stock_actual >= 0))
);


ALTER TABLE public.inventario OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 24780)
-- Name: inventario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventario_id_seq OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 241
-- Name: inventario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventario_id_seq OWNED BY public.inventario.id;


--
-- TOC entry 240 (class 1259 OID 24753)
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion character varying(500),
    precio numeric(10,2) NOT NULL,
    imagen_url character varying(255),
    activo boolean DEFAULT true NOT NULL,
    fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    emprendimiento_id integer NOT NULL,
    categoria_producto_id integer,
    CONSTRAINT productos_precio_check CHECK ((precio >= (0)::numeric))
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 24752)
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 239
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- TOC entry 250 (class 1259 OID 24875)
-- Name: resenas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resenas (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    emprendimiento_id integer NOT NULL,
    puntuacion integer NOT NULL,
    comentario text,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT resenas_puntuacion_check CHECK (((puntuacion >= 1) AND (puntuacion <= 5)))
);


ALTER TABLE public.resenas OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 24874)
-- Name: resenas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resenas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resenas_id_seq OWNER TO postgres;

--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 249
-- Name: resenas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resenas_id_seq OWNED BY public.resenas.id;


--
-- TOC entry 226 (class 1259 OID 24619)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    rol character varying(50) NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24618)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 225
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 224 (class 1259 OID 24599)
-- Name: sedes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sedes (
    id integer NOT NULL,
    nombre_sede character varying(150) NOT NULL,
    universidad_id integer NOT NULL,
    ciudad_id integer
);


ALTER TABLE public.sedes OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24598)
-- Name: sedes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sedes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sedes_id_seq OWNER TO postgres;

--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 223
-- Name: sedes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sedes_id_seq OWNED BY public.sedes.id;


--
-- TOC entry 244 (class 1259 OID 24804)
-- Name: transacciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transacciones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    fecha timestamp without time zone DEFAULT now() NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    total numeric(10,2) NOT NULL,
    metodo_pago character varying(50),
    CONSTRAINT transacciones_estado_check CHECK (((estado)::text = ANY ((ARRAY['pendiente'::character varying, 'confirmado'::character varying, 'entregado'::character varying, 'cancelado'::character varying])::text[]))),
    CONSTRAINT transacciones_total_check CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.transacciones OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 24803)
-- Name: transacciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transacciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transacciones_id_seq OWNER TO postgres;

--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 243
-- Name: transacciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transacciones_id_seq OWNED BY public.transacciones.id;


--
-- TOC entry 220 (class 1259 OID 24578)
-- Name: universidades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.universidades (
    id integer NOT NULL,
    nombre_universidad character varying(150) NOT NULL,
    dominio_correo character varying(100) NOT NULL
);


ALTER TABLE public.universidades OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24577)
-- Name: universidades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.universidades_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.universidades_id_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 219
-- Name: universidades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.universidades_id_seq OWNED BY public.universidades.id;


--
-- TOC entry 230 (class 1259 OID 24659)
-- Name: usuario_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_roles (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    rol_id integer NOT NULL,
    asignado_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuario_roles OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 24658)
-- Name: usuario_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_roles_id_seq OWNER TO postgres;

--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuario_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_roles_id_seq OWNED BY public.usuario_roles.id;


--
-- TOC entry 228 (class 1259 OID 24630)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    correo character varying(150) NOT NULL,
    contrasena character varying(255) NOT NULL,
    celular character varying(20),
    activo boolean DEFAULT true NOT NULL,
    fecha_registro timestamp without time zone DEFAULT now() NOT NULL,
    universidad_id integer,
    correo_institucional character varying(150),
    correo_institucional_verificado boolean DEFAULT false NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24629)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 232 (class 1259 OID 24683)
-- Name: verificaciones_correo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verificaciones_correo (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    correo character varying(150) NOT NULL,
    token character varying(255) NOT NULL,
    expira_en timestamp without time zone NOT NULL,
    verificado_en timestamp without time zone,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.verificaciones_correo OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 24682)
-- Name: verificaciones_correo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verificaciones_correo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verificaciones_correo_id_seq OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 231
-- Name: verificaciones_correo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verificaciones_correo_id_seq OWNED BY public.verificaciones_correo.id;


--
-- TOC entry 4943 (class 2604 OID 24707)
-- Name: categorias_emprendimiento id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_emprendimiento ALTER COLUMN id SET DEFAULT nextval('public.categorias_emprendimiento_id_seq'::regclass);


--
-- TOC entry 4948 (class 2604 OID 24747)
-- Name: categorias_producto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_producto ALTER COLUMN id SET DEFAULT nextval('public.categorias_producto_id_seq'::regclass);


--
-- TOC entry 4932 (class 2604 OID 24593)
-- Name: ciudades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades ALTER COLUMN id SET DEFAULT nextval('public.ciudades_id_seq'::regclass);


--
-- TOC entry 4959 (class 2604 OID 24828)
-- Name: detalle_transacciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_transacciones ALTER COLUMN id SET DEFAULT nextval('public.detalle_transacciones_id_seq'::regclass);


--
-- TOC entry 4944 (class 2604 OID 24716)
-- Name: emprendimientos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprendimientos ALTER COLUMN id SET DEFAULT nextval('public.emprendimientos_id_seq'::regclass);


--
-- TOC entry 4960 (class 2604 OID 24854)
-- Name: favoritos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos ALTER COLUMN id SET DEFAULT nextval('public.favoritos_id_seq'::regclass);


--
-- TOC entry 4952 (class 2604 OID 24784)
-- Name: inventario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario ALTER COLUMN id SET DEFAULT nextval('public.inventario_id_seq'::regclass);


--
-- TOC entry 4949 (class 2604 OID 24756)
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- TOC entry 4962 (class 2604 OID 24878)
-- Name: resenas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas ALTER COLUMN id SET DEFAULT nextval('public.resenas_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 24622)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4933 (class 2604 OID 24602)
-- Name: sedes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sedes ALTER COLUMN id SET DEFAULT nextval('public.sedes_id_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 24807)
-- Name: transacciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones ALTER COLUMN id SET DEFAULT nextval('public.transacciones_id_seq'::regclass);


--
-- TOC entry 4931 (class 2604 OID 24581)
-- Name: universidades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universidades ALTER COLUMN id SET DEFAULT nextval('public.universidades_id_seq'::regclass);


--
-- TOC entry 4939 (class 2604 OID 24662)
-- Name: usuario_roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles ALTER COLUMN id SET DEFAULT nextval('public.usuario_roles_id_seq'::regclass);


--
-- TOC entry 4935 (class 2604 OID 24633)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 24686)
-- Name: verificaciones_correo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificaciones_correo ALTER COLUMN id SET DEFAULT nextval('public.verificaciones_correo_id_seq'::regclass);


--
-- TOC entry 5201 (class 0 OID 24704)
-- Dependencies: 234
-- Data for Name: categorias_emprendimiento; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias_emprendimiento VALUES (1, 'Comida');
INSERT INTO public.categorias_emprendimiento VALUES (2, 'Diseño');
INSERT INTO public.categorias_emprendimiento VALUES (3, 'Tecnología');
INSERT INTO public.categorias_emprendimiento VALUES (4, 'Moda');
INSERT INTO public.categorias_emprendimiento VALUES (5, 'Belleza');
INSERT INTO public.categorias_emprendimiento VALUES (6, 'Servicios');


--
-- TOC entry 5205 (class 0 OID 24744)
-- Dependencies: 238
-- Data for Name: categorias_producto; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categorias_producto VALUES (1, 'Comida');
INSERT INTO public.categorias_producto VALUES (2, 'Diseño');
INSERT INTO public.categorias_producto VALUES (3, 'Tecnología');
INSERT INTO public.categorias_producto VALUES (4, 'Moda');
INSERT INTO public.categorias_producto VALUES (5, 'Belleza');
INSERT INTO public.categorias_producto VALUES (6, 'Servicios');


--
-- TOC entry 5189 (class 0 OID 24590)
-- Dependencies: 222
-- Data for Name: ciudades; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5213 (class 0 OID 24825)
-- Dependencies: 246
-- Data for Name: detalle_transacciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.detalle_transacciones VALUES (1, 1, 1, 2, 14000.00, 28000.00);
INSERT INTO public.detalle_transacciones VALUES (2, 2, 2, 1, 8000.00, 8000.00);
INSERT INTO public.detalle_transacciones VALUES (3, 2, 1, 1, 14000.00, 14000.00);
INSERT INTO public.detalle_transacciones VALUES (4, 3, 2, 3, 8000.00, 24000.00);
INSERT INTO public.detalle_transacciones VALUES (5, 4, 1, 1, 14000.00, 14000.00);
INSERT INTO public.detalle_transacciones VALUES (6, 5, 7, 1, 20000.00, 20000.00);
INSERT INTO public.detalle_transacciones VALUES (7, 6, 6, 1, 28000.00, 28000.00);
INSERT INTO public.detalle_transacciones VALUES (8, 6, 5, 2, 35000.00, 70000.00);
INSERT INTO public.detalle_transacciones VALUES (9, 7, 5, 1, 35000.00, 35000.00);
INSERT INTO public.detalle_transacciones VALUES (10, 7, 7, 3, 20000.00, 60000.00);
INSERT INTO public.detalle_transacciones VALUES (11, 8, 7, 1, 20000.00, 20000.00);
INSERT INTO public.detalle_transacciones VALUES (12, 8, 6, 3, 28000.00, 84000.00);
INSERT INTO public.detalle_transacciones VALUES (13, 9, 8, 1, 39000.00, 39000.00);
INSERT INTO public.detalle_transacciones VALUES (14, 9, 4, 1, 22000.00, 22000.00);
INSERT INTO public.detalle_transacciones VALUES (15, 10, 3, 3, 65000.00, 195000.00);
INSERT INTO public.detalle_transacciones VALUES (16, 10, 8, 2, 39000.00, 78000.00);
INSERT INTO public.detalle_transacciones VALUES (17, 11, 4, 3, 22000.00, 66000.00);
INSERT INTO public.detalle_transacciones VALUES (18, 12, 8, 3, 39000.00, 117000.00);
INSERT INTO public.detalle_transacciones VALUES (19, 13, 10, 3, 32000.00, 96000.00);
INSERT INTO public.detalle_transacciones VALUES (20, 13, 9, 1, 15000.00, 15000.00);
INSERT INTO public.detalle_transacciones VALUES (21, 14, 10, 1, 32000.00, 32000.00);
INSERT INTO public.detalle_transacciones VALUES (22, 15, 9, 1, 15000.00, 15000.00);
INSERT INTO public.detalle_transacciones VALUES (23, 16, 11, 1, 48000.00, 48000.00);
INSERT INTO public.detalle_transacciones VALUES (24, 16, 12, 3, 60000.00, 180000.00);
INSERT INTO public.detalle_transacciones VALUES (25, 17, 11, 3, 48000.00, 144000.00);
INSERT INTO public.detalle_transacciones VALUES (26, 18, 13, 2, 24000.00, 48000.00);
INSERT INTO public.detalle_transacciones VALUES (27, 18, 14, 3, 18000.00, 54000.00);
INSERT INTO public.detalle_transacciones VALUES (28, 19, 13, 1, 24000.00, 24000.00);
INSERT INTO public.detalle_transacciones VALUES (29, 20, 15, 1, 45000.00, 45000.00);
INSERT INTO public.detalle_transacciones VALUES (30, 21, 16, 2, 52000.00, 104000.00);
INSERT INTO public.detalle_transacciones VALUES (31, 22, 15, 1, 45000.00, 45000.00);
INSERT INTO public.detalle_transacciones VALUES (32, 22, 16, 2, 52000.00, 104000.00);
INSERT INTO public.detalle_transacciones VALUES (33, 23, 15, 2, 45000.00, 90000.00);
INSERT INTO public.detalle_transacciones VALUES (34, 23, 16, 2, 52000.00, 104000.00);
INSERT INTO public.detalle_transacciones VALUES (35, 24, 22, 2, 43500.00, 87000.00);
INSERT INTO public.detalle_transacciones VALUES (36, 24, 21, 2, 27000.00, 54000.00);
INSERT INTO public.detalle_transacciones VALUES (37, 25, 22, 1, 43500.00, 43500.00);
INSERT INTO public.detalle_transacciones VALUES (38, 26, 28, 2, 18000.00, 36000.00);
INSERT INTO public.detalle_transacciones VALUES (39, 27, 26, 2, 14000.00, 28000.00);
INSERT INTO public.detalle_transacciones VALUES (40, 27, 25, 3, 5500.00, 16500.00);
INSERT INTO public.detalle_transacciones VALUES (41, 28, 30, 1, 39500.00, 39500.00);
INSERT INTO public.detalle_transacciones VALUES (42, 28, 33, 3, 38000.00, 114000.00);
INSERT INTO public.detalle_transacciones VALUES (43, 29, 37, 1, 25500.00, 25500.00);
INSERT INTO public.detalle_transacciones VALUES (44, 30, 41, 3, 22500.00, 67500.00);
INSERT INTO public.detalle_transacciones VALUES (45, 30, 38, 2, 34000.00, 68000.00);
INSERT INTO public.detalle_transacciones VALUES (46, 31, 45, 1, 59000.00, 59000.00);
INSERT INTO public.detalle_transacciones VALUES (47, 32, 44, 2, 38000.00, 76000.00);
INSERT INTO public.detalle_transacciones VALUES (48, 33, 46, 2, 23500.00, 47000.00);
INSERT INTO public.detalle_transacciones VALUES (49, 34, 51, 3, 33500.00, 100500.00);
INSERT INTO public.detalle_transacciones VALUES (50, 35, 50, 2, 88500.00, 177000.00);
INSERT INTO public.detalle_transacciones VALUES (51, 35, 52, 2, 49000.00, 98000.00);
INSERT INTO public.detalle_transacciones VALUES (52, 36, 55, 1, 69000.00, 69000.00);
INSERT INTO public.detalle_transacciones VALUES (53, 36, 57, 1, 19500.00, 19500.00);
INSERT INTO public.detalle_transacciones VALUES (54, 37, 56, 2, 5500.00, 11000.00);
INSERT INTO public.detalle_transacciones VALUES (55, 37, 55, 2, 69000.00, 138000.00);
INSERT INTO public.detalle_transacciones VALUES (56, 38, 62, 1, 70000.00, 70000.00);
INSERT INTO public.detalle_transacciones VALUES (57, 39, 64, 2, 18500.00, 37000.00);
INSERT INTO public.detalle_transacciones VALUES (58, 39, 65, 1, 41500.00, 41500.00);
INSERT INTO public.detalle_transacciones VALUES (59, 40, 66, 3, 17000.00, 51000.00);
INSERT INTO public.detalle_transacciones VALUES (60, 40, 67, 2, 29500.00, 59000.00);
INSERT INTO public.detalle_transacciones VALUES (61, 41, 68, 2, 32500.00, 65000.00);
INSERT INTO public.detalle_transacciones VALUES (62, 41, 69, 1, 34000.00, 34000.00);
INSERT INTO public.detalle_transacciones VALUES (63, 42, 76, 2, 120000.00, 240000.00);
INSERT INTO public.detalle_transacciones VALUES (64, 42, 78, 2, 39000.00, 78000.00);
INSERT INTO public.detalle_transacciones VALUES (65, 43, 82, 1, 31000.00, 31000.00);
INSERT INTO public.detalle_transacciones VALUES (66, 44, 87, 2, 5000.00, 10000.00);
INSERT INTO public.detalle_transacciones VALUES (67, 44, 84, 2, 19500.00, 39000.00);
INSERT INTO public.detalle_transacciones VALUES (68, 45, 86, 2, 4500.00, 9000.00);
INSERT INTO public.detalle_transacciones VALUES (69, 46, 87, 1, 5000.00, 5000.00);
INSERT INTO public.detalle_transacciones VALUES (70, 47, 90, 2, 140000.00, 280000.00);
INSERT INTO public.detalle_transacciones VALUES (71, 47, 92, 2, 27000.00, 54000.00);
INSERT INTO public.detalle_transacciones VALUES (72, 48, 93, 3, 87000.00, 261000.00);
INSERT INTO public.detalle_transacciones VALUES (73, 48, 94, 2, 38500.00, 77000.00);
INSERT INTO public.detalle_transacciones VALUES (74, 49, 93, 3, 87000.00, 261000.00);
INSERT INTO public.detalle_transacciones VALUES (75, 49, 96, 3, 44000.00, 132000.00);
INSERT INTO public.detalle_transacciones VALUES (76, 50, 93, 1, 87000.00, 87000.00);
INSERT INTO public.detalle_transacciones VALUES (77, 50, 95, 2, 10000.00, 20000.00);
INSERT INTO public.detalle_transacciones VALUES (78, 51, 98, 1, 23000.00, 23000.00);
INSERT INTO public.detalle_transacciones VALUES (79, 52, 101, 1, 18500.00, 18500.00);
INSERT INTO public.detalle_transacciones VALUES (80, 52, 98, 2, 23000.00, 46000.00);
INSERT INTO public.detalle_transacciones VALUES (81, 53, 104, 2, 28000.00, 56000.00);
INSERT INTO public.detalle_transacciones VALUES (82, 53, 105, 1, 6000.00, 6000.00);
INSERT INTO public.detalle_transacciones VALUES (83, 54, 103, 3, 59000.00, 177000.00);
INSERT INTO public.detalle_transacciones VALUES (84, 55, 110, 1, 26500.00, 26500.00);
INSERT INTO public.detalle_transacciones VALUES (85, 56, 109, 2, 19000.00, 38000.00);
INSERT INTO public.detalle_transacciones VALUES (86, 56, 110, 3, 26500.00, 79500.00);
INSERT INTO public.detalle_transacciones VALUES (87, 57, 109, 3, 19000.00, 57000.00);
INSERT INTO public.detalle_transacciones VALUES (88, 58, 112, 1, 64000.00, 64000.00);
INSERT INTO public.detalle_transacciones VALUES (89, 58, 114, 3, 30000.00, 90000.00);
INSERT INTO public.detalle_transacciones VALUES (90, 59, 115, 2, 10000.00, 20000.00);
INSERT INTO public.detalle_transacciones VALUES (91, 60, 116, 2, 43000.00, 86000.00);
INSERT INTO public.detalle_transacciones VALUES (92, 61, 118, 2, 56000.00, 112000.00);
INSERT INTO public.detalle_transacciones VALUES (93, 62, 120, 2, 67000.00, 134000.00);
INSERT INTO public.detalle_transacciones VALUES (94, 62, 122, 2, 19500.00, 39000.00);
INSERT INTO public.detalle_transacciones VALUES (95, 63, 121, 2, 28000.00, 56000.00);
INSERT INTO public.detalle_transacciones VALUES (96, 63, 123, 1, 17000.00, 17000.00);
INSERT INTO public.detalle_transacciones VALUES (97, 64, 119, 2, 42500.00, 85000.00);
INSERT INTO public.detalle_transacciones VALUES (98, 65, 125, 1, 6000.00, 6000.00);
INSERT INTO public.detalle_transacciones VALUES (99, 66, 124, 3, 7500.00, 22500.00);
INSERT INTO public.detalle_transacciones VALUES (100, 67, 126, 2, 8500.00, 17000.00);
INSERT INTO public.detalle_transacciones VALUES (101, 67, 125, 2, 6000.00, 12000.00);
INSERT INTO public.detalle_transacciones VALUES (102, 68, 134, 3, 62500.00, 187500.00);
INSERT INTO public.detalle_transacciones VALUES (103, 68, 131, 3, 6000.00, 18000.00);
INSERT INTO public.detalle_transacciones VALUES (104, 69, 133, 1, 21500.00, 21500.00);
INSERT INTO public.detalle_transacciones VALUES (105, 70, 137, 1, 19500.00, 19500.00);
INSERT INTO public.detalle_transacciones VALUES (106, 71, 136, 1, 37500.00, 37500.00);
INSERT INTO public.detalle_transacciones VALUES (107, 72, 138, 2, 42500.00, 85000.00);
INSERT INTO public.detalle_transacciones VALUES (108, 72, 137, 1, 19500.00, 19500.00);
INSERT INTO public.detalle_transacciones VALUES (109, 73, 142, 3, 32500.00, 97500.00);
INSERT INTO public.detalle_transacciones VALUES (110, 74, 143, 2, 54500.00, 109000.00);
INSERT INTO public.detalle_transacciones VALUES (111, 74, 142, 2, 32500.00, 65000.00);
INSERT INTO public.detalle_transacciones VALUES (112, 75, 146, 2, 45000.00, 90000.00);
INSERT INTO public.detalle_transacciones VALUES (113, 76, 146, 1, 45000.00, 45000.00);
INSERT INTO public.detalle_transacciones VALUES (114, 77, 149, 3, 78000.00, 234000.00);
INSERT INTO public.detalle_transacciones VALUES (115, 77, 146, 2, 45000.00, 90000.00);
INSERT INTO public.detalle_transacciones VALUES (116, 78, 152, 2, 17500.00, 35000.00);
INSERT INTO public.detalle_transacciones VALUES (117, 79, 153, 2, 24500.00, 49000.00);
INSERT INTO public.detalle_transacciones VALUES (118, 80, 151, 1, 23500.00, 23500.00);
INSERT INTO public.detalle_transacciones VALUES (119, 80, 153, 2, 24500.00, 49000.00);
INSERT INTO public.detalle_transacciones VALUES (120, 81, 157, 2, 22500.00, 45000.00);
INSERT INTO public.detalle_transacciones VALUES (121, 82, 156, 3, 18000.00, 54000.00);
INSERT INTO public.detalle_transacciones VALUES (122, 82, 155, 2, 24500.00, 49000.00);
INSERT INTO public.detalle_transacciones VALUES (123, 83, 158, 3, 31000.00, 93000.00);
INSERT INTO public.detalle_transacciones VALUES (124, 83, 155, 2, 24500.00, 49000.00);
INSERT INTO public.detalle_transacciones VALUES (125, 84, 163, 3, 77000.00, 231000.00);
INSERT INTO public.detalle_transacciones VALUES (126, 85, 165, 2, 26000.00, 52000.00);
INSERT INTO public.detalle_transacciones VALUES (127, 86, 167, 1, 62000.00, 62000.00);
INSERT INTO public.detalle_transacciones VALUES (128, 87, 167, 3, 62000.00, 186000.00);
INSERT INTO public.detalle_transacciones VALUES (129, 88, 167, 3, 62000.00, 186000.00);
INSERT INTO public.detalle_transacciones VALUES (130, 89, 171, 1, 63500.00, 63500.00);
INSERT INTO public.detalle_transacciones VALUES (131, 90, 173, 3, 24500.00, 73500.00);
INSERT INTO public.detalle_transacciones VALUES (132, 90, 171, 1, 63500.00, 63500.00);
INSERT INTO public.detalle_transacciones VALUES (133, 91, 173, 1, 24500.00, 24500.00);
INSERT INTO public.detalle_transacciones VALUES (134, 91, 170, 2, 23000.00, 46000.00);
INSERT INTO public.detalle_transacciones VALUES (135, 92, 175, 1, 19500.00, 19500.00);
INSERT INTO public.detalle_transacciones VALUES (136, 93, 179, 2, 85000.00, 170000.00);
INSERT INTO public.detalle_transacciones VALUES (137, 93, 175, 3, 19500.00, 58500.00);
INSERT INTO public.detalle_transacciones VALUES (138, 94, 176, 2, 14500.00, 29000.00);
INSERT INTO public.detalle_transacciones VALUES (139, 94, 178, 2, 50500.00, 101000.00);
INSERT INTO public.detalle_transacciones VALUES (140, 95, 180, 2, 8000.00, 16000.00);
INSERT INTO public.detalle_transacciones VALUES (141, 96, 180, 2, 8000.00, 16000.00);
INSERT INTO public.detalle_transacciones VALUES (142, 96, 184, 2, 6500.00, 13000.00);
INSERT INTO public.detalle_transacciones VALUES (143, 97, 183, 1, 12000.00, 12000.00);
INSERT INTO public.detalle_transacciones VALUES (144, 98, 188, 2, 67500.00, 135000.00);
INSERT INTO public.detalle_transacciones VALUES (145, 98, 185, 2, 49000.00, 98000.00);
INSERT INTO public.detalle_transacciones VALUES (146, 99, 189, 2, 42500.00, 85000.00);
INSERT INTO public.detalle_transacciones VALUES (147, 100, 189, 2, 42500.00, 85000.00);
INSERT INTO public.detalle_transacciones VALUES (148, 101, 191, 2, 56000.00, 112000.00);
INSERT INTO public.detalle_transacciones VALUES (149, 101, 190, 3, 49500.00, 148500.00);
INSERT INTO public.detalle_transacciones VALUES (150, 102, 193, 2, 25000.00, 50000.00);
INSERT INTO public.detalle_transacciones VALUES (151, 103, 190, 3, 49500.00, 148500.00);
INSERT INTO public.detalle_transacciones VALUES (152, 103, 192, 3, 21500.00, 64500.00);
INSERT INTO public.detalle_transacciones VALUES (153, 104, 195, 2, 14500.00, 29000.00);
INSERT INTO public.detalle_transacciones VALUES (154, 104, 196, 2, 52000.00, 104000.00);
INSERT INTO public.detalle_transacciones VALUES (155, 105, 199, 3, 23500.00, 70500.00);
INSERT INTO public.detalle_transacciones VALUES (156, 106, 203, 3, 17000.00, 51000.00);
INSERT INTO public.detalle_transacciones VALUES (157, 106, 204, 3, 137500.00, 412500.00);
INSERT INTO public.detalle_transacciones VALUES (158, 107, 206, 1, 43000.00, 43000.00);
INSERT INTO public.detalle_transacciones VALUES (159, 108, 205, 2, 17500.00, 35000.00);
INSERT INTO public.detalle_transacciones VALUES (160, 108, 203, 2, 17000.00, 34000.00);
INSERT INTO public.detalle_transacciones VALUES (161, 109, 209, 2, 61500.00, 123000.00);
INSERT INTO public.detalle_transacciones VALUES (162, 110, 208, 3, 15000.00, 45000.00);
INSERT INTO public.detalle_transacciones VALUES (163, 111, 208, 1, 15000.00, 15000.00);
INSERT INTO public.detalle_transacciones VALUES (164, 112, 215, 3, 18500.00, 55500.00);
INSERT INTO public.detalle_transacciones VALUES (165, 113, 219, 2, 7500.00, 15000.00);
INSERT INTO public.detalle_transacciones VALUES (166, 113, 218, 3, 24500.00, 73500.00);
INSERT INTO public.detalle_transacciones VALUES (167, 114, 220, 1, 27500.00, 27500.00);
INSERT INTO public.detalle_transacciones VALUES (168, 114, 218, 3, 24500.00, 73500.00);
INSERT INTO public.detalle_transacciones VALUES (169, 115, 220, 3, 27500.00, 82500.00);
INSERT INTO public.detalle_transacciones VALUES (170, 115, 217, 1, 28500.00, 28500.00);


--
-- TOC entry 5203 (class 0 OID 24713)
-- Dependencies: 236
-- Data for Name: emprendimientos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.emprendimientos VALUES (1, 'Postres Camila', NULL, 'https://picsum.photos/seed/postres-camila-logo/160/160', true, '2026-07-15 00:50:49.110431', 1, 1, 1, '+57 300 123 4567', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (2, 'TechFix Uninorte', NULL, 'https://picsum.photos/seed/techfix-logo/160/160', true, '2026-07-15 00:50:49.110431', 2, 1, 3, '+57 300 123 4567', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (3, 'Laura Design Studio', NULL, 'https://picsum.photos/seed/laura-design-logo/160/160', true, '2026-07-15 00:50:49.110431', 3, 1, 2, '+57 300 123 4567', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (4, 'Urban Style CUC', NULL, 'https://picsum.photos/seed/urban-style-logo/160/160', true, '2026-07-15 00:50:49.110431', 4, 2, 4, '+57 300 123 4567', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (5, 'GlowLab Beauty', NULL, 'https://picsum.photos/seed/glowlab-logo/160/160', true, '2026-07-15 00:50:49.110431', 5, 2, 5, '+57 300 123 4567', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (26, 'Tutorías Exitosas', 'Tutorías Exitosas ofrece productos y servicios de servicios para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/tutorias-exitosas106/160/160', true, '2026-07-20 18:34:29.758285', 57, 4, 6, '+57 309 473 3153', '10:00:00', '19:00:00', true);
INSERT INTO public.emprendimientos VALUES (7, 'Trazo Estudio', NULL, 'https://picsum.photos/seed/trazo-estudio-logo/160/160', true, '2026-07-15 00:50:49.110431', 7, 6, 2, '+57 300 123 4567', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (27, 'Creativa Design Co', 'Creativa Design Co ofrece productos y servicios de diseño para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/creativa-design-co111/160/160', true, '2026-07-20 18:34:29.758285', 58, 4, 2, '+57 361 243 1742', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (6, 'Sabores del Campus', NULL, 'https://picsum.photos/seed/sabores-campus-logo/160/160', true, '2026-07-15 00:50:49.110431', 6, 3, 1, '+57 300 123 4567', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (8, 'Prendas del Parche', 'Prendas del Parche ofrece productos y servicios de moda para toda la comunidad de Universidad del Norte.', 'https://picsum.photos/seed/prendas-del-parche1/160/160', true, '2026-07-20 18:34:29.758285', 39, 1, 4, '+57 306 845 6559', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (9, 'Batidos Fit', 'Batidos Fit ofrece productos y servicios de comida para toda la comunidad de Universidad del Norte.', 'https://picsum.photos/seed/batidos-fit6/160/160', true, '2026-07-20 18:34:29.758285', 40, 1, 1, '+57 300 698 8811', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (10, 'Impresiones Rápidas', 'Impresiones Rápidas ofrece productos y servicios de servicios para toda la comunidad de Universidad del Norte.', 'https://picsum.photos/seed/impresiones-rapidas13/160/160', true, '2026-07-20 18:34:29.758285', 41, 1, 6, '+57 308 406 2697', '06:30:00', '15:00:00', true);
INSERT INTO public.emprendimientos VALUES (11, 'Diseño Libre Co', 'Diseño Libre Co ofrece productos y servicios de diseño para toda la comunidad de Universidad del Norte.', 'https://picsum.photos/seed/diseno-libre-co18/160/160', true, '2026-07-20 18:34:29.758285', 42, 1, 2, '+57 398 251 8041', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (12, 'Punto Gráfico', 'Punto Gráfico ofrece productos y servicios de diseño para toda la comunidad de Universidad del Norte.', 'https://picsum.photos/seed/punto-grafico23/160/160', true, '2026-07-20 18:34:29.758285', 43, 1, 2, '+57 330 775 4164', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (13, 'Skin Care Lab', 'Skin Care Lab ofrece productos y servicios de belleza para toda la comunidad de Universidad del Norte.', 'https://picsum.photos/seed/skin-care-lab29/160/160', true, '2026-07-20 18:34:29.758285', 44, 1, 5, '+57 384 782 7691', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (14, 'Ropa Vintage Uni', 'Ropa Vintage Uni ofrece productos y servicios de moda para toda la comunidad de Universidad del Norte.', 'https://picsum.photos/seed/ropa-vintage-uni35/160/160', true, '2026-07-20 18:34:29.758285', 45, 1, 4, '+57 316 324 3881', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (15, 'Postres Doña Rosa', 'Postres Doña Rosa ofrece productos y servicios de comida para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/postres-dona-rosa42/160/160', true, '2026-07-20 18:34:29.758285', 46, 2, 1, '+57 309 489 8814', '06:30:00', '15:00:00', true);
INSERT INTO public.emprendimientos VALUES (16, 'Accesorios Chic', 'Accesorios Chic ofrece productos y servicios de moda para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/accesorios-chic47/160/160', true, '2026-07-20 18:34:29.758285', 47, 2, 4, '+57 380 458 4673', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (17, 'Digital Fix Uni', 'Digital Fix Uni ofrece productos y servicios de tecnología para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/digital-fix-uni54/160/160', true, '2026-07-20 18:34:29.758285', 48, 2, 3, '+57 318 763 6590', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (18, 'GlowUp Studio', 'GlowUp Studio ofrece productos y servicios de belleza para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/glowup-studio59/160/160', true, '2026-07-20 18:34:29.758285', 49, 2, 5, '+57 336 600 4937', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (19, 'Circuitos JD', 'Circuitos JD ofrece productos y servicios de tecnología para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/circuitos-jd66/160/160', true, '2026-07-20 18:34:29.758285', 50, 2, 3, '+57 324 146 1893', '06:30:00', '15:00:00', true);
INSERT INTO public.emprendimientos VALUES (20, 'Studio Beauty', 'Studio Beauty ofrece productos y servicios de belleza para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/studio-beauty73/160/160', true, '2026-07-20 18:34:29.758285', 51, 2, 5, '+57 333 370 2330', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (21, 'Snacks del Parche', 'Snacks del Parche ofrece productos y servicios de comida para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/snacks-del-parche78/160/160', true, '2026-07-20 18:34:29.758285', 52, 2, 1, '+57 399 395 8195', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (22, 'GeekHelp', 'GeekHelp ofrece productos y servicios de tecnología para toda la comunidad de Costa Universidad.', 'https://picsum.photos/seed/geekhelp83/160/160', true, '2026-07-20 18:34:29.758285', 53, 2, 3, '+57 380 773 9889', '10:00:00', '19:00:00', true);
INSERT INTO public.emprendimientos VALUES (23, 'Look Urbano', 'Look Urbano ofrece productos y servicios de moda para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/look-urbano89/160/160', true, '2026-07-20 18:34:29.758285', 54, 4, 4, '+57 398 864 3236', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (24, 'Fotografía Campus', 'Fotografía Campus ofrece productos y servicios de servicios para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/fotografia-campus94/160/160', true, '2026-07-20 18:34:29.758285', 55, 4, 6, '+57 359 809 7512', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (25, 'Clases Particulares JD', 'Clases Particulares JD ofrece productos y servicios de servicios para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/clases-particulares-jd101/160/160', true, '2026-07-20 18:34:29.758285', 56, 4, 6, '+57 374 793 9955', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (28, 'Reparaciones Rápidas Tech', 'Reparaciones Rápidas Tech ofrece productos y servicios de tecnología para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/reparaciones-rapidas-tech116/160/160', true, '2026-07-20 18:34:29.758285', 59, 4, 3, '+57 331 968 8450', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (29, 'TechRepair Campus', 'TechRepair Campus ofrece productos y servicios de tecnología para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/techrepair-campus121/160/160', true, '2026-07-20 18:34:29.758285', 60, 4, 3, '+57 390 844 9543', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (30, 'Pizza Rápida Uni', 'Pizza Rápida Uni ofrece productos y servicios de comida para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/pizza-rapida-uni127/160/160', true, '2026-07-20 18:34:29.758285', 61, 4, 1, '+57 398 675 6400', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (31, 'Foto & Video Campus', 'Foto & Video Campus ofrece productos y servicios de servicios para toda la comunidad de Simón Bolívar.', 'https://picsum.photos/seed/foto-video-campus134/160/160', true, '2026-07-20 18:34:29.758285', 62, 4, 6, '+57 302 261 1815', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (32, 'Trendy Wear', 'Trendy Wear ofrece productos y servicios de moda para toda la comunidad de Uniautónoma.', 'https://picsum.photos/seed/trendy-wear141/160/160', true, '2026-07-20 18:34:29.758285', 63, 3, 4, '+57 396 826 7843', '10:00:00', '19:00:00', true);
INSERT INTO public.emprendimientos VALUES (33, 'Closet Urbano', 'Closet Urbano ofrece productos y servicios de moda para toda la comunidad de Uniautónoma.', 'https://picsum.photos/seed/closet-urbano147/160/160', true, '2026-07-20 18:34:29.758285', 64, 3, 4, '+57 347 562 1616', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (34, 'ByteFix', 'ByteFix ofrece productos y servicios de tecnología para toda la comunidad de Uniautónoma.', 'https://picsum.photos/seed/bytefix152/160/160', true, '2026-07-20 18:34:29.758285', 65, 3, 3, '+57 318 794 7333', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (35, 'Trazo & Tinta', 'Trazo & Tinta ofrece productos y servicios de diseño para toda la comunidad de Universidad Libre.', 'https://picsum.photos/seed/trazo-tinta158/160/160', true, '2026-07-20 18:34:29.758285', 66, 5, 2, '+57 327 144 7731', '06:30:00', '15:00:00', true);
INSERT INTO public.emprendimientos VALUES (36, 'Pixel Studio', 'Pixel Studio ofrece productos y servicios de diseño para toda la comunidad de Universidad Libre.', 'https://picsum.photos/seed/pixel-studio164/160/160', true, '2026-07-20 18:34:29.758285', 67, 5, 2, '+57 352 240 1627', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (37, 'PC Doctor Uni', 'PC Doctor Uni ofrece productos y servicios de tecnología para toda la comunidad de Universidad Libre.', 'https://picsum.photos/seed/pc-doctor-uni170/160/160', true, '2026-07-20 18:34:29.758285', 68, 5, 3, '+57 352 145 6772', '06:30:00', '15:00:00', true);
INSERT INTO public.emprendimientos VALUES (38, 'Empanadas El Sazón', 'Empanadas El Sazón ofrece productos y servicios de comida para toda la comunidad de Univ. de Medellín.', 'https://picsum.photos/seed/empanadas-el-sazon177/160/160', true, '2026-07-20 18:34:29.758285', 69, 6, 1, '+57 384 428 2680', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (39, 'Soporte Total', 'Soporte Total ofrece productos y servicios de tecnología para toda la comunidad de Univ. de Medellín.', 'https://picsum.photos/seed/soporte-total182/160/160', true, '2026-07-20 18:34:29.758285', 70, 6, 3, '+57 331 126 4048', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (40, 'Asesorías Académicas', 'Asesorías Académicas ofrece productos y servicios de servicios para toda la comunidad de Univ. de Medellín.', 'https://picsum.photos/seed/asesorias-academicas188/160/160', true, '2026-07-20 18:34:29.758285', 71, 6, 6, '+57 389 286 3114', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (41, 'La Cocina de Mafe', 'La Cocina de Mafe ofrece productos y servicios de comida para toda la comunidad de EIA.', 'https://picsum.photos/seed/la-cocina-de-mafe194/160/160', true, '2026-07-20 18:34:29.758285', 72, 7, 1, '+57 373 448 3353', '10:00:00', '19:00:00', true);
INSERT INTO public.emprendimientos VALUES (42, 'ChipLab', 'ChipLab ofrece productos y servicios de tecnología para toda la comunidad de EIA.', 'https://picsum.photos/seed/chiplab200/160/160', true, '2026-07-20 18:34:29.758285', 73, 7, 3, '+57 391 231 2584', '06:30:00', '15:00:00', true);
INSERT INTO public.emprendimientos VALUES (43, 'Estudio Amarillo', 'Estudio Amarillo ofrece productos y servicios de diseño para toda la comunidad de EIA.', 'https://picsum.photos/seed/estudio-amarillo206/160/160', true, '2026-07-20 18:34:29.758285', 74, 7, 2, '+57 309 817 2800', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (44, 'Moda Consciente', 'Moda Consciente ofrece productos y servicios de moda para toda la comunidad de Bolivariana.', 'https://picsum.photos/seed/moda-consciente211/160/160', true, '2026-07-20 18:34:29.758285', 75, 8, 4, '+57 340 394 2294', '08:00:00', '18:00:00', true);
INSERT INTO public.emprendimientos VALUES (45, 'Servicio Express Uni', 'Servicio Express Uni ofrece productos y servicios de servicios para toda la comunidad de Bolivariana.', 'https://picsum.photos/seed/servicio-express-uni217/160/160', true, '2026-07-20 18:34:29.758285', 76, 8, 6, '+57 326 957 3880', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (46, 'GeekHelp 22', 'GeekHelp 22 ofrece productos y servicios de tecnología para toda la comunidad de Bolivariana.', 'https://picsum.photos/seed/geekhelp-22222/160/160', true, '2026-07-20 18:34:29.758285', 77, 8, 3, '+57 341 754 5833', '06:30:00', '15:00:00', true);
INSERT INTO public.emprendimientos VALUES (47, 'Waffles & Co', 'Waffles & Co ofrece productos y servicios de comida para toda la comunidad de U. de Antioquia.', 'https://picsum.photos/seed/waffles-co228/160/160', true, '2026-07-20 18:34:29.758285', 78, 9, 1, '+57 318 161 2130', '09:00:00', '20:00:00', true);
INSERT INTO public.emprendimientos VALUES (48, 'Belleza Natural Co', 'Belleza Natural Co ofrece productos y servicios de belleza para toda la comunidad de U. de Antioquia.', 'https://picsum.photos/seed/belleza-natural-co234/160/160', true, '2026-07-20 18:34:29.963916', 79, 9, 5, '+57 330 511 8191', '07:00:00', '16:00:00', true);
INSERT INTO public.emprendimientos VALUES (49, 'Clases Particulares JD 33', 'Clases Particulares JD 33 ofrece productos y servicios de servicios para toda la comunidad de U. de Antioquia.', 'https://picsum.photos/seed/clases-particulares-jd-33239/160/160', true, '2026-07-20 18:34:29.963916', 80, 9, 6, '+57 317 967 7079', '09:00:00', '20:00:00', true);


--
-- TOC entry 5215 (class 0 OID 24851)
-- Dependencies: 248
-- Data for Name: favoritos; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5209 (class 0 OID 24781)
-- Dependencies: 242
-- Data for Name: inventario; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.inventario VALUES (1, 1, 12, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (3, 3, 999, 0, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (4, 4, 50, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (5, 5, 10, 3, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (6, 6, 2, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (7, 7, 20, 0, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (8, 8, 0, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (9, 9, 18, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (10, 10, 4, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (11, 11, 15, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (12, 12, 8, 2, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (13, 13, 25, 10, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (14, 14, 30, 0, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (16, 16, 0, 5, '2026-07-15 19:43:39.094766');
INSERT INTO public.inventario VALUES (2, 2, 3, 5, '2026-07-16 01:25:59.261376');
INSERT INTO public.inventario VALUES (15, 15, 6, 3, '2026-07-19 05:22:37.903188');
INSERT INTO public.inventario VALUES (24, 20, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (25, 21, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (26, 22, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (27, 23, 4, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (28, 24, 24, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (29, 25, 19, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (30, 26, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (31, 27, 3, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (32, 28, 27, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (33, 29, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (34, 30, 12, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (35, 31, 3, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (36, 32, 8, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (37, 33, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (38, 34, 17, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (39, 35, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (40, 36, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (41, 37, 19, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (42, 38, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (43, 39, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (44, 40, 17, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (45, 41, 25, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (46, 42, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (47, 43, 18, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (48, 44, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (49, 45, 3, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (50, 46, 2, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (51, 47, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (52, 48, 25, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (53, 49, 4, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (54, 50, 4, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (55, 51, 30, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (56, 52, 2, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (57, 53, 3, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (58, 54, 2, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (59, 55, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (60, 56, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (61, 57, 25, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (62, 58, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (63, 59, 20, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (64, 60, 11, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (65, 61, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (66, 62, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (67, 63, 18, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (68, 64, 11, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (69, 65, 25, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (70, 66, 19, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (71, 67, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (72, 68, 21, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (73, 69, 19, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (74, 70, 17, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (75, 71, 3, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (76, 72, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (77, 73, 29, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (78, 74, 2, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (79, 75, 1, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (80, 76, 24, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (81, 77, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (82, 78, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (83, 79, 25, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (84, 80, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (85, 81, 3, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (86, 82, 8, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (87, 83, 26, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (88, 84, 4, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (89, 85, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (90, 86, 30, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (91, 87, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (92, 88, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (93, 89, 2, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (94, 90, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (95, 91, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (96, 92, 1, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (97, 93, 24, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (98, 94, 4, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (99, 95, 4, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (100, 96, 4, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (101, 97, 26, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (102, 98, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (103, 99, 30, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (104, 100, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (105, 101, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (106, 102, 1, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (107, 103, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (108, 104, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (109, 105, 3, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (110, 106, 6, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (111, 107, 22, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (112, 108, 2, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (113, 109, 3, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (114, 110, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (115, 111, 17, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (116, 112, 24, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (117, 113, 19, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (118, 114, 4, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (119, 115, 10, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (120, 116, 30, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (121, 117, 2, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (122, 118, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (123, 119, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (124, 120, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (125, 121, 18, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (126, 122, 20, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (127, 123, 9, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (128, 124, 10, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (129, 125, 2, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (130, 126, 3, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (131, 127, 19, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (132, 128, 25, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (133, 129, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (134, 130, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (135, 131, 22, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (136, 132, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (137, 133, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (138, 134, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (139, 135, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (140, 136, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (141, 137, 4, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (142, 138, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (143, 139, 3, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (144, 140, 22, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (145, 141, 20, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (146, 142, 20, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (147, 143, 16, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (148, 144, 2, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (149, 145, 15, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (150, 146, 10, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (151, 147, 15, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (152, 148, 10, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (153, 149, 26, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (154, 150, 17, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (155, 151, 4, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (156, 152, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (157, 153, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (158, 154, 17, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (159, 155, 10, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (160, 156, 4, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (161, 157, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (162, 158, 26, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (163, 159, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (164, 160, 4, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (165, 161, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (166, 162, 3, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (167, 163, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (168, 164, 2, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (169, 165, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (170, 166, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (171, 167, 3, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (172, 168, 8, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (173, 169, 17, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (174, 170, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (175, 171, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (176, 172, 8, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (177, 173, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (178, 174, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (179, 175, 17, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (180, 176, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (181, 177, 10, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (182, 178, 22, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (183, 179, 11, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (184, 180, 4, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (185, 181, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (186, 182, 18, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (187, 183, 2, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (188, 184, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (189, 185, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (190, 186, 21, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (191, 187, 25, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (192, 188, 3, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (193, 189, 25, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (194, 190, 29, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (195, 191, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (196, 192, 3, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (197, 193, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (198, 194, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (199, 195, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (200, 196, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (201, 197, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (202, 198, 9, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (203, 199, 24, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (204, 200, 3, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (205, 201, 10, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (206, 202, 0, 3, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (207, 203, 30, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (208, 204, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (209, 205, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (210, 206, 8, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (211, 207, 23, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (212, 208, 0, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (213, 209, 2, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (214, 210, 2, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (215, 211, 0, 0, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (216, 212, 1, 5, '2026-07-20 18:34:29.758285');
INSERT INTO public.inventario VALUES (217, 213, 24, 5, '2026-07-20 18:34:29.963916');
INSERT INTO public.inventario VALUES (218, 214, 3, 0, '2026-07-20 18:34:29.963916');
INSERT INTO public.inventario VALUES (219, 215, 2, 3, '2026-07-20 18:34:29.963916');
INSERT INTO public.inventario VALUES (220, 216, 23, 5, '2026-07-20 18:34:29.963916');
INSERT INTO public.inventario VALUES (221, 217, 12, 5, '2026-07-20 18:34:29.963916');
INSERT INTO public.inventario VALUES (222, 218, 0, 3, '2026-07-20 18:34:29.963916');
INSERT INTO public.inventario VALUES (223, 219, 0, 0, '2026-07-20 18:34:29.963916');
INSERT INTO public.inventario VALUES (224, 220, 1, 0, '2026-07-20 18:34:29.963916');


--
-- TOC entry 5207 (class 0 OID 24753)
-- Dependencies: 240
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.productos VALUES (1, 'Cheesecake individual', NULL, 14000.00, 'https://picsum.photos/seed/cheesecake/400/360', true, '2026-07-15 00:50:49.110431', 1, 1);
INSERT INTO public.productos VALUES (3, 'Diseño de logo para tu emprendimiento', NULL, 65000.00, 'https://picsum.photos/seed/logo-design/400/360', true, '2026-07-15 00:50:49.110431', 3, 2);
INSERT INTO public.productos VALUES (4, 'Plantilla de presentación editable', NULL, 22000.00, 'https://picsum.photos/seed/slides-template/400/360', true, '2026-07-15 00:50:49.110431', 3, 2);
INSERT INTO public.productos VALUES (5, 'Mantenimiento de PC a domicilio', NULL, 35000.00, 'https://picsum.photos/seed/pc-repair/400/360', true, '2026-07-15 00:50:49.110431', 2, 3);
INSERT INTO public.productos VALUES (6, 'Fundas para laptop personalizadas', NULL, 28000.00, 'https://picsum.photos/seed/laptop-case/400/360', true, '2026-07-15 00:50:49.110431', 2, 3);
INSERT INTO public.productos VALUES (7, 'Tutoría de cálculo (1 hora)', NULL, 20000.00, 'https://picsum.photos/seed/tutoring/400/360', true, '2026-07-15 00:50:49.110431', 2, 6);
INSERT INTO public.productos VALUES (8, 'Camiseta estampada Uninorte', NULL, 39000.00, 'https://picsum.photos/seed/tshirt-print/400/360', true, '2026-07-15 00:50:49.110431', 3, 4);
INSERT INTO public.productos VALUES (9, 'Aretes artesanales', NULL, 15000.00, 'https://picsum.photos/seed/earrings/400/360', true, '2026-07-15 00:50:49.110431', 4, 4);
INSERT INTO public.productos VALUES (10, 'Gorras bordadas a pedido', NULL, 32000.00, 'https://picsum.photos/seed/caps/400/360', true, '2026-07-15 00:50:49.110431', 4, 4);
INSERT INTO public.productos VALUES (11, 'Set de skincare facial', NULL, 48000.00, 'https://picsum.photos/seed/skincare/400/360', true, '2026-07-15 00:50:49.110431', 5, 5);
INSERT INTO public.productos VALUES (12, 'Peinados para eventos', NULL, 60000.00, 'https://picsum.photos/seed/hairstyle/400/360', true, '2026-07-15 00:50:49.110431', 5, 5);
INSERT INTO public.productos VALUES (13, 'Empanadas por docena', NULL, 24000.00, 'https://picsum.photos/seed/empanadas/400/360', true, '2026-07-15 00:50:49.110431', 6, 1);
INSERT INTO public.productos VALUES (14, 'Diseño de invitaciones digitales', NULL, 18000.00, 'https://picsum.photos/seed/invitations/400/360', true, '2026-07-15 00:50:49.110431', 6, 2);
INSERT INTO public.productos VALUES (15, 'Ilustración digital personalizada', NULL, 45000.00, 'https://picsum.photos/seed/illustration/400/360', true, '2026-07-15 00:50:49.110431', 7, 2);
INSERT INTO public.productos VALUES (16, 'Bolsos tejidos a mano', NULL, 52000.00, 'https://picsum.photos/seed/handbag/400/360', true, '2026-07-15 00:50:49.110431', 7, 4);
INSERT INTO public.productos VALUES (2, 'Brownie con nutella', NULL, 8000.00, 'https://picsum.photos/seed/brownie/400/360', true, '2026-07-15 00:50:49.110431', 1, 1);
INSERT INTO public.productos VALUES (54, 'Snack saludable', NULL, 7000.00, 'https://picsum.photos/seed/snack-saludable43/400/360', true, '2026-07-20 18:34:29.758285', 15, 1);
INSERT INTO public.productos VALUES (20, 'Aretes artesanales', NULL, 17000.00, 'https://picsum.photos/seed/aretes-artesanales2/400/360', true, '2026-07-20 18:34:29.758285', 8, 4);
INSERT INTO public.productos VALUES (21, 'Gorra bordada', NULL, 27000.00, 'https://picsum.photos/seed/gorra-bordada3/400/360', true, '2026-07-20 18:34:29.758285', 8, 4);
INSERT INTO public.productos VALUES (22, 'Cinturón de cuero', NULL, 43500.00, 'https://picsum.photos/seed/cinturon-de-cuero4/400/360', true, '2026-07-20 18:34:29.758285', 8, 4);
INSERT INTO public.productos VALUES (23, 'Sudadera personalizada', NULL, 66500.00, 'https://picsum.photos/seed/sudadera-personalizada5/400/360', true, '2026-07-20 18:34:29.758285', 8, 4);
INSERT INTO public.productos VALUES (24, 'Combo almuerzo', NULL, 14000.00, 'https://picsum.photos/seed/combo-almuerzo7/400/360', true, '2026-07-20 18:34:29.758285', 9, 1);
INSERT INTO public.productos VALUES (25, 'Jugo natural', NULL, 5500.00, 'https://picsum.photos/seed/jugo-natural8/400/360', true, '2026-07-20 18:34:29.758285', 9, 1);
INSERT INTO public.productos VALUES (26, 'Combo desayuno', NULL, 14000.00, 'https://picsum.photos/seed/combo-desayuno9/400/360', true, '2026-07-20 18:34:29.758285', 9, 1);
INSERT INTO public.productos VALUES (27, 'Torta personalizada', NULL, 50000.00, 'https://picsum.photos/seed/torta-personalizada10/400/360', true, '2026-07-20 18:34:29.758285', 9, 1);
INSERT INTO public.productos VALUES (28, 'Ensalada fresca', NULL, 18000.00, 'https://picsum.photos/seed/ensalada-fresca11/400/360', true, '2026-07-20 18:34:29.758285', 9, 1);
INSERT INTO public.productos VALUES (29, 'Postre del día', NULL, 8500.00, 'https://picsum.photos/seed/postre-del-dia12/400/360', true, '2026-07-20 18:34:29.758285', 9, 1);
INSERT INTO public.productos VALUES (30, 'Edición de video', NULL, 39500.00, 'https://picsum.photos/seed/edicion-de-video14/400/360', true, '2026-07-20 18:34:29.758285', 10, 6);
INSERT INTO public.productos VALUES (31, 'Tutoría de matemáticas', NULL, 19000.00, 'https://picsum.photos/seed/tutoria-de-matematicas15/400/360', true, '2026-07-20 18:34:29.758285', 10, 6);
INSERT INTO public.productos VALUES (32, 'Diseño de CV', NULL, 16500.00, 'https://picsum.photos/seed/diseno-de-cv16/400/360', true, '2026-07-20 18:34:29.758285', 10, 6);
INSERT INTO public.productos VALUES (33, 'Asesoría de tesis', NULL, 38000.00, 'https://picsum.photos/seed/asesoria-de-tesis17/400/360', true, '2026-07-20 18:34:29.758285', 10, 6);
INSERT INTO public.productos VALUES (34, 'Diseño de logo', NULL, 62500.00, 'https://picsum.photos/seed/diseno-de-logo19/400/360', true, '2026-07-20 18:34:29.758285', 11, 2);
INSERT INTO public.productos VALUES (35, 'Diseño de flyer', NULL, 21500.00, 'https://picsum.photos/seed/diseno-de-flyer20/400/360', true, '2026-07-20 18:34:29.758285', 11, 2);
INSERT INTO public.productos VALUES (36, 'Diseño de stickers', NULL, 19500.00, 'https://picsum.photos/seed/diseno-de-stickers21/400/360', true, '2026-07-20 18:34:29.758285', 11, 2);
INSERT INTO public.productos VALUES (37, 'Portada para redes', NULL, 25500.00, 'https://picsum.photos/seed/portada-para-redes22/400/360', true, '2026-07-20 18:34:29.758285', 11, 2);
INSERT INTO public.productos VALUES (38, 'Plantilla Canva personalizada', NULL, 34000.00, 'https://picsum.photos/seed/plantilla-canva-personalizada24/400/360', true, '2026-07-20 18:34:29.758285', 12, 2);
INSERT INTO public.productos VALUES (39, 'Diseño de flyer', NULL, 27500.00, 'https://picsum.photos/seed/diseno-de-flyer25/400/360', true, '2026-07-20 18:34:29.758285', 12, 2);
INSERT INTO public.productos VALUES (40, 'Diseño de logo', NULL, 83000.00, 'https://picsum.photos/seed/diseno-de-logo26/400/360', true, '2026-07-20 18:34:29.758285', 12, 2);
INSERT INTO public.productos VALUES (41, 'Diseño de stickers', NULL, 22500.00, 'https://picsum.photos/seed/diseno-de-stickers27/400/360', true, '2026-07-20 18:34:29.758285', 12, 2);
INSERT INTO public.productos VALUES (42, 'Edición de fotos', NULL, 10500.00, 'https://picsum.photos/seed/edicion-de-fotos28/400/360', true, '2026-07-20 18:34:29.758285', 12, 2);
INSERT INTO public.productos VALUES (43, 'Cejas y pestañas', NULL, 26000.00, 'https://picsum.photos/seed/cejas-y-pestanas30/400/360', true, '2026-07-20 18:34:29.758285', 13, 5);
INSERT INTO public.productos VALUES (44, 'Tratamiento capilar', NULL, 38000.00, 'https://picsum.photos/seed/tratamiento-capilar31/400/360', true, '2026-07-20 18:34:29.758285', 13, 5);
INSERT INTO public.productos VALUES (45, 'Peinado para evento', NULL, 59000.00, 'https://picsum.photos/seed/peinado-para-evento32/400/360', true, '2026-07-20 18:34:29.758285', 13, 5);
INSERT INTO public.productos VALUES (46, 'Depilación con cera', NULL, 23500.00, 'https://picsum.photos/seed/depilacion-con-cera33/400/360', true, '2026-07-20 18:34:29.758285', 13, 5);
INSERT INTO public.productos VALUES (47, 'Set de skincare', NULL, 49500.00, 'https://picsum.photos/seed/set-de-skincare34/400/360', true, '2026-07-20 18:34:29.758285', 13, 5);
INSERT INTO public.productos VALUES (48, 'Manillas artesanales', NULL, 8000.00, 'https://picsum.photos/seed/manillas-artesanales36/400/360', true, '2026-07-20 18:34:29.758285', 14, 4);
INSERT INTO public.productos VALUES (49, 'Camiseta estampada', NULL, 42500.00, 'https://picsum.photos/seed/camiseta-estampada37/400/360', true, '2026-07-20 18:34:29.758285', 14, 4);
INSERT INTO public.productos VALUES (50, 'Sudadera personalizada', NULL, 88500.00, 'https://picsum.photos/seed/sudadera-personalizada38/400/360', true, '2026-07-20 18:34:29.758285', 14, 4);
INSERT INTO public.productos VALUES (51, 'Gorra bordada', NULL, 33500.00, 'https://picsum.photos/seed/gorra-bordada39/400/360', true, '2026-07-20 18:34:29.758285', 14, 4);
INSERT INTO public.productos VALUES (52, 'Cinturón de cuero', NULL, 49000.00, 'https://picsum.photos/seed/cinturon-de-cuero40/400/360', true, '2026-07-20 18:34:29.758285', 14, 4);
INSERT INTO public.productos VALUES (53, 'Medias divertidas', NULL, 10500.00, 'https://picsum.photos/seed/medias-divertidas41/400/360', true, '2026-07-20 18:34:29.758285', 14, 4);
INSERT INTO public.productos VALUES (55, 'Torta personalizada', NULL, 69000.00, 'https://picsum.photos/seed/torta-personalizada44/400/360', true, '2026-07-20 18:34:29.758285', 15, 1);
INSERT INTO public.productos VALUES (56, 'Café artesanal', NULL, 5500.00, 'https://picsum.photos/seed/cafe-artesanal45/400/360', true, '2026-07-20 18:34:29.758285', 15, 1);
INSERT INTO public.productos VALUES (57, 'Ensalada fresca', NULL, 19500.00, 'https://picsum.photos/seed/ensalada-fresca46/400/360', true, '2026-07-20 18:34:29.758285', 15, 1);
INSERT INTO public.productos VALUES (58, 'Gorra bordada', NULL, 28000.00, 'https://picsum.photos/seed/gorra-bordada48/400/360', true, '2026-07-20 18:34:29.758285', 16, 4);
INSERT INTO public.productos VALUES (59, 'Cinturón de cuero', NULL, 30500.00, 'https://picsum.photos/seed/cinturon-de-cuero49/400/360', true, '2026-07-20 18:34:29.758285', 16, 4);
INSERT INTO public.productos VALUES (60, 'Medias divertidas', NULL, 12500.00, 'https://picsum.photos/seed/medias-divertidas50/400/360', true, '2026-07-20 18:34:29.758285', 16, 4);
INSERT INTO public.productos VALUES (61, 'Camiseta estampada', NULL, 32500.00, 'https://picsum.photos/seed/camiseta-estampada51/400/360', true, '2026-07-20 18:34:29.758285', 16, 4);
INSERT INTO public.productos VALUES (62, 'Sudadera personalizada', NULL, 70000.00, 'https://picsum.photos/seed/sudadera-personalizada52/400/360', true, '2026-07-20 18:34:29.758285', 16, 4);
INSERT INTO public.productos VALUES (63, 'Aretes artesanales', NULL, 12000.00, 'https://picsum.photos/seed/aretes-artesanales53/400/360', true, '2026-07-20 18:34:29.758285', 16, 4);
INSERT INTO public.productos VALUES (64, 'Funda para celular', NULL, 18500.00, 'https://picsum.photos/seed/funda-para-celular55/400/360', true, '2026-07-20 18:34:29.758285', 17, 3);
INSERT INTO public.productos VALUES (65, 'Soporte para laptop', NULL, 41500.00, 'https://picsum.photos/seed/soporte-para-laptop56/400/360', true, '2026-07-20 18:34:29.758285', 17, 3);
INSERT INTO public.productos VALUES (66, 'Cable USB-C', NULL, 17000.00, 'https://picsum.photos/seed/cable-usb-c57/400/360', true, '2026-07-20 18:34:29.758285', 17, 3);
INSERT INTO public.productos VALUES (67, 'Mantenimiento de PC', NULL, 29500.00, 'https://picsum.photos/seed/mantenimiento-de-pc58/400/360', true, '2026-07-20 18:34:29.758285', 17, 3);
INSERT INTO public.productos VALUES (68, 'Kit de belleza', NULL, 32500.00, 'https://picsum.photos/seed/kit-de-belleza60/400/360', true, '2026-07-20 18:34:29.758285', 18, 5);
INSERT INTO public.productos VALUES (69, 'Tratamiento capilar', NULL, 34000.00, 'https://picsum.photos/seed/tratamiento-capilar61/400/360', true, '2026-07-20 18:34:29.758285', 18, 5);
INSERT INTO public.productos VALUES (70, 'Cejas y pestañas', NULL, 27000.00, 'https://picsum.photos/seed/cejas-y-pestanas62/400/360', true, '2026-07-20 18:34:29.758285', 18, 5);
INSERT INTO public.productos VALUES (71, 'Maquillaje profesional', NULL, 70500.00, 'https://picsum.photos/seed/maquillaje-profesional63/400/360', true, '2026-07-20 18:34:29.758285', 18, 5);
INSERT INTO public.productos VALUES (72, 'Depilación con cera', NULL, 25500.00, 'https://picsum.photos/seed/depilacion-con-cera64/400/360', true, '2026-07-20 18:34:29.758285', 18, 5);
INSERT INTO public.productos VALUES (73, 'Manicure express', NULL, 19500.00, 'https://picsum.photos/seed/manicure-express65/400/360', true, '2026-07-20 18:34:29.758285', 18, 5);
INSERT INTO public.productos VALUES (74, 'Audífonos inalámbricos', NULL, 71500.00, 'https://picsum.photos/seed/audifonos-inalambricos67/400/360', true, '2026-07-20 18:34:29.758285', 19, 3);
INSERT INTO public.productos VALUES (75, 'Power bank', NULL, 58000.00, 'https://picsum.photos/seed/power-bank68/400/360', true, '2026-07-20 18:34:29.758285', 19, 3);
INSERT INTO public.productos VALUES (76, 'Cambio de pantalla celular', NULL, 120000.00, 'https://picsum.photos/seed/cambio-de-pantalla-celular69/400/360', true, '2026-07-20 18:34:29.758285', 19, 3);
INSERT INTO public.productos VALUES (77, 'Cable USB-C', NULL, 17500.00, 'https://picsum.photos/seed/cable-usb-c70/400/360', true, '2026-07-20 18:34:29.758285', 19, 3);
INSERT INTO public.productos VALUES (78, 'Mantenimiento de PC', NULL, 39000.00, 'https://picsum.photos/seed/mantenimiento-de-pc71/400/360', true, '2026-07-20 18:34:29.758285', 19, 3);
INSERT INTO public.productos VALUES (79, 'Soporte para laptop', NULL, 40500.00, 'https://picsum.photos/seed/soporte-para-laptop72/400/360', true, '2026-07-20 18:34:29.758285', 19, 3);
INSERT INTO public.productos VALUES (80, 'Maquillaje profesional', NULL, 55000.00, 'https://picsum.photos/seed/maquillaje-profesional74/400/360', true, '2026-07-20 18:34:29.758285', 20, 5);
INSERT INTO public.productos VALUES (81, 'Set de skincare', NULL, 30000.00, 'https://picsum.photos/seed/set-de-skincare75/400/360', true, '2026-07-20 18:34:29.758285', 20, 5);
INSERT INTO public.productos VALUES (82, 'Depilación con cera', NULL, 31000.00, 'https://picsum.photos/seed/depilacion-con-cera76/400/360', true, '2026-07-20 18:34:29.758285', 20, 5);
INSERT INTO public.productos VALUES (83, 'Manicure express', NULL, 22000.00, 'https://picsum.photos/seed/manicure-express77/400/360', true, '2026-07-20 18:34:29.758285', 20, 5);
INSERT INTO public.productos VALUES (84, 'Ensalada fresca', NULL, 19500.00, 'https://picsum.photos/seed/ensalada-fresca79/400/360', true, '2026-07-20 18:34:29.758285', 21, 1);
INSERT INTO public.productos VALUES (85, 'Torta personalizada', NULL, 63000.00, 'https://picsum.photos/seed/torta-personalizada80/400/360', true, '2026-07-20 18:34:29.758285', 21, 1);
INSERT INTO public.productos VALUES (86, 'Café artesanal', NULL, 4500.00, 'https://picsum.photos/seed/cafe-artesanal81/400/360', true, '2026-07-20 18:34:29.758285', 21, 1);
INSERT INTO public.productos VALUES (87, 'Jugo natural', NULL, 5000.00, 'https://picsum.photos/seed/jugo-natural82/400/360', true, '2026-07-20 18:34:29.758285', 21, 1);
INSERT INTO public.productos VALUES (88, 'Funda para celular', NULL, 21500.00, 'https://picsum.photos/seed/funda-para-celular84/400/360', true, '2026-07-20 18:34:29.758285', 22, 3);
INSERT INTO public.productos VALUES (89, 'Mantenimiento de PC', NULL, 40500.00, 'https://picsum.photos/seed/mantenimiento-de-pc85/400/360', true, '2026-07-20 18:34:29.758285', 22, 3);
INSERT INTO public.productos VALUES (90, 'Cambio de pantalla celular', NULL, 140000.00, 'https://picsum.photos/seed/cambio-de-pantalla-celular86/400/360', true, '2026-07-20 18:34:29.758285', 22, 3);
INSERT INTO public.productos VALUES (91, 'Audífonos inalámbricos', NULL, 63000.00, 'https://picsum.photos/seed/audifonos-inalambricos87/400/360', true, '2026-07-20 18:34:29.758285', 22, 3);
INSERT INTO public.productos VALUES (92, 'Instalación de software', NULL, 27000.00, 'https://picsum.photos/seed/instalacion-de-software88/400/360', true, '2026-07-20 18:34:29.758285', 22, 3);
INSERT INTO public.productos VALUES (93, 'Sudadera personalizada', NULL, 87000.00, 'https://picsum.photos/seed/sudadera-personalizada90/400/360', true, '2026-07-20 18:34:29.758285', 23, 4);
INSERT INTO public.productos VALUES (94, 'Cinturón de cuero', NULL, 38500.00, 'https://picsum.photos/seed/cinturon-de-cuero91/400/360', true, '2026-07-20 18:34:29.758285', 23, 4);
INSERT INTO public.productos VALUES (95, 'Aretes artesanales', NULL, 10000.00, 'https://picsum.photos/seed/aretes-artesanales92/400/360', true, '2026-07-20 18:34:29.758285', 23, 4);
INSERT INTO public.productos VALUES (96, 'Bolso tejido', NULL, 44000.00, 'https://picsum.photos/seed/bolso-tejido93/400/360', true, '2026-07-20 18:34:29.758285', 23, 4);
INSERT INTO public.productos VALUES (97, 'Sesión de fotos', NULL, 80000.00, 'https://picsum.photos/seed/sesion-de-fotos95/400/360', true, '2026-07-20 18:34:29.758285', 24, 6);
INSERT INTO public.productos VALUES (98, 'Diseño de CV', NULL, 23000.00, 'https://picsum.photos/seed/diseno-de-cv96/400/360', true, '2026-07-20 18:34:29.758285', 24, 6);
INSERT INTO public.productos VALUES (99, 'Impresión de documentos', NULL, 6500.00, 'https://picsum.photos/seed/impresion-de-documentos97/400/360', true, '2026-07-20 18:34:29.758285', 24, 6);
INSERT INTO public.productos VALUES (100, 'Edición de video', NULL, 64500.00, 'https://picsum.photos/seed/edicion-de-video98/400/360', true, '2026-07-20 18:34:29.758285', 24, 6);
INSERT INTO public.productos VALUES (101, 'Clases de inglés', NULL, 18500.00, 'https://picsum.photos/seed/clases-de-ingles99/400/360', true, '2026-07-20 18:34:29.758285', 24, 6);
INSERT INTO public.productos VALUES (102, 'Asesoría de tesis', NULL, 29000.00, 'https://picsum.photos/seed/asesoria-de-tesis100/400/360', true, '2026-07-20 18:34:29.758285', 24, 6);
INSERT INTO public.productos VALUES (103, 'Sesión de fotos', NULL, 59000.00, 'https://picsum.photos/seed/sesion-de-fotos102/400/360', true, '2026-07-20 18:34:29.758285', 25, 6);
INSERT INTO public.productos VALUES (104, 'Clases de inglés', NULL, 28000.00, 'https://picsum.photos/seed/clases-de-ingles103/400/360', true, '2026-07-20 18:34:29.758285', 25, 6);
INSERT INTO public.productos VALUES (105, 'Impresión de documentos', NULL, 6000.00, 'https://picsum.photos/seed/impresion-de-documentos104/400/360', true, '2026-07-20 18:34:29.758285', 25, 6);
INSERT INTO public.productos VALUES (106, 'Edición de video', NULL, 46000.00, 'https://picsum.photos/seed/edicion-de-video105/400/360', true, '2026-07-20 18:34:29.758285', 25, 6);
INSERT INTO public.productos VALUES (107, 'Edición de video', NULL, 41000.00, 'https://picsum.photos/seed/edicion-de-video107/400/360', true, '2026-07-20 18:34:29.758285', 26, 6);
INSERT INTO public.productos VALUES (108, 'Impresión de documentos', NULL, 4500.00, 'https://picsum.photos/seed/impresion-de-documentos108/400/360', true, '2026-07-20 18:34:29.758285', 26, 6);
INSERT INTO public.productos VALUES (109, 'Redacción de ensayos', NULL, 19000.00, 'https://picsum.photos/seed/redaccion-de-ensayos109/400/360', true, '2026-07-20 18:34:29.758285', 26, 6);
INSERT INTO public.productos VALUES (110, 'Clases de inglés', NULL, 26500.00, 'https://picsum.photos/seed/clases-de-ingles110/400/360', true, '2026-07-20 18:34:29.758285', 26, 6);
INSERT INTO public.productos VALUES (111, 'Edición de fotos', NULL, 17500.00, 'https://picsum.photos/seed/edicion-de-fotos112/400/360', true, '2026-07-20 18:34:29.758285', 27, 2);
INSERT INTO public.productos VALUES (112, 'Ilustración digital', NULL, 64000.00, 'https://picsum.photos/seed/ilustracion-digital113/400/360', true, '2026-07-20 18:34:29.758285', 27, 2);
INSERT INTO public.productos VALUES (113, 'Diseño de logo', NULL, 48500.00, 'https://picsum.photos/seed/diseno-de-logo114/400/360', true, '2026-07-20 18:34:29.758285', 27, 2);
INSERT INTO public.productos VALUES (114, 'Plantilla Canva personalizada', NULL, 30000.00, 'https://picsum.photos/seed/plantilla-canva-personalizada115/400/360', true, '2026-07-20 18:34:29.758285', 27, 2);
INSERT INTO public.productos VALUES (115, 'Cable USB-C', NULL, 10000.00, 'https://picsum.photos/seed/cable-usb-c117/400/360', true, '2026-07-20 18:34:29.758285', 28, 3);
INSERT INTO public.productos VALUES (116, 'Power bank', NULL, 43000.00, 'https://picsum.photos/seed/power-bank118/400/360', true, '2026-07-20 18:34:29.758285', 28, 3);
INSERT INTO public.productos VALUES (117, 'Funda para celular', NULL, 24500.00, 'https://picsum.photos/seed/funda-para-celular119/400/360', true, '2026-07-20 18:34:29.758285', 28, 3);
INSERT INTO public.productos VALUES (118, 'Audífonos inalámbricos', NULL, 56000.00, 'https://picsum.photos/seed/audifonos-inalambricos120/400/360', true, '2026-07-20 18:34:29.758285', 28, 3);
INSERT INTO public.productos VALUES (119, 'Soporte para laptop', NULL, 42500.00, 'https://picsum.photos/seed/soporte-para-laptop122/400/360', true, '2026-07-20 18:34:29.758285', 29, 3);
INSERT INTO public.productos VALUES (120, 'Power bank', NULL, 67000.00, 'https://picsum.photos/seed/power-bank123/400/360', true, '2026-07-20 18:34:29.758285', 29, 3);
INSERT INTO public.productos VALUES (121, 'Mantenimiento de PC', NULL, 28000.00, 'https://picsum.photos/seed/mantenimiento-de-pc124/400/360', true, '2026-07-20 18:34:29.758285', 29, 3);
INSERT INTO public.productos VALUES (122, 'Funda para celular', NULL, 19500.00, 'https://picsum.photos/seed/funda-para-celular125/400/360', true, '2026-07-20 18:34:29.758285', 29, 3);
INSERT INTO public.productos VALUES (123, 'Cable USB-C', NULL, 17000.00, 'https://picsum.photos/seed/cable-usb-c126/400/360', true, '2026-07-20 18:34:29.758285', 29, 3);
INSERT INTO public.productos VALUES (124, 'Postre del día', NULL, 7500.00, 'https://picsum.photos/seed/postre-del-dia128/400/360', true, '2026-07-20 18:34:29.758285', 30, 1);
INSERT INTO public.productos VALUES (125, 'Café artesanal', NULL, 6000.00, 'https://picsum.photos/seed/cafe-artesanal129/400/360', true, '2026-07-20 18:34:29.758285', 30, 1);
INSERT INTO public.productos VALUES (126, 'Snack saludable', NULL, 8500.00, 'https://picsum.photos/seed/snack-saludable130/400/360', true, '2026-07-20 18:34:29.758285', 30, 1);
INSERT INTO public.productos VALUES (127, 'Combo almuerzo', NULL, 17500.00, 'https://picsum.photos/seed/combo-almuerzo131/400/360', true, '2026-07-20 18:34:29.758285', 30, 1);
INSERT INTO public.productos VALUES (128, 'Ensalada fresca', NULL, 17500.00, 'https://picsum.photos/seed/ensalada-fresca132/400/360', true, '2026-07-20 18:34:29.758285', 30, 1);
INSERT INTO public.productos VALUES (129, 'Sandwich especial', NULL, 11500.00, 'https://picsum.photos/seed/sandwich-especial133/400/360', true, '2026-07-20 18:34:29.758285', 30, 1);
INSERT INTO public.productos VALUES (130, 'Sesión de fotos', NULL, 68000.00, 'https://picsum.photos/seed/sesion-de-fotos135/400/360', true, '2026-07-20 18:34:29.758285', 31, 6);
INSERT INTO public.productos VALUES (131, 'Impresión de documentos', NULL, 6000.00, 'https://picsum.photos/seed/impresion-de-documentos136/400/360', true, '2026-07-20 18:34:29.758285', 31, 6);
INSERT INTO public.productos VALUES (132, 'Clases de inglés', NULL, 22000.00, 'https://picsum.photos/seed/clases-de-ingles137/400/360', true, '2026-07-20 18:34:29.758285', 31, 6);
INSERT INTO public.productos VALUES (133, 'Redacción de ensayos', NULL, 21500.00, 'https://picsum.photos/seed/redaccion-de-ensayos138/400/360', true, '2026-07-20 18:34:29.758285', 31, 6);
INSERT INTO public.productos VALUES (134, 'Edición de video', NULL, 62500.00, 'https://picsum.photos/seed/edicion-de-video139/400/360', true, '2026-07-20 18:34:29.758285', 31, 6);
INSERT INTO public.productos VALUES (135, 'Diseño de CV', NULL, 13500.00, 'https://picsum.photos/seed/diseno-de-cv140/400/360', true, '2026-07-20 18:34:29.758285', 31, 6);
INSERT INTO public.productos VALUES (136, 'Gorra bordada', NULL, 37500.00, 'https://picsum.photos/seed/gorra-bordada142/400/360', true, '2026-07-20 18:34:29.758285', 32, 4);
INSERT INTO public.productos VALUES (137, 'Aretes artesanales', NULL, 19500.00, 'https://picsum.photos/seed/aretes-artesanales143/400/360', true, '2026-07-20 18:34:29.758285', 32, 4);
INSERT INTO public.productos VALUES (138, 'Camiseta estampada', NULL, 42500.00, 'https://picsum.photos/seed/camiseta-estampada144/400/360', true, '2026-07-20 18:34:29.758285', 32, 4);
INSERT INTO public.productos VALUES (139, 'Bolso tejido', NULL, 57000.00, 'https://picsum.photos/seed/bolso-tejido145/400/360', true, '2026-07-20 18:34:29.758285', 32, 4);
INSERT INTO public.productos VALUES (140, 'Manillas artesanales', NULL, 11500.00, 'https://picsum.photos/seed/manillas-artesanales146/400/360', true, '2026-07-20 18:34:29.758285', 32, 4);
INSERT INTO public.productos VALUES (141, 'Medias divertidas', NULL, 13000.00, 'https://picsum.photos/seed/medias-divertidas148/400/360', true, '2026-07-20 18:34:29.758285', 33, 4);
INSERT INTO public.productos VALUES (142, 'Cinturón de cuero', NULL, 32500.00, 'https://picsum.photos/seed/cinturon-de-cuero149/400/360', true, '2026-07-20 18:34:29.758285', 33, 4);
INSERT INTO public.productos VALUES (143, 'Bolso tejido', NULL, 54500.00, 'https://picsum.photos/seed/bolso-tejido150/400/360', true, '2026-07-20 18:34:29.758285', 33, 4);
INSERT INTO public.productos VALUES (144, 'Camiseta estampada', NULL, 44000.00, 'https://picsum.photos/seed/camiseta-estampada151/400/360', true, '2026-07-20 18:34:29.758285', 33, 4);
INSERT INTO public.productos VALUES (145, 'Audífonos inalámbricos', NULL, 56000.00, 'https://picsum.photos/seed/audifonos-inalambricos153/400/360', true, '2026-07-20 18:34:29.758285', 34, 3);
INSERT INTO public.productos VALUES (146, 'Power bank', NULL, 45000.00, 'https://picsum.photos/seed/power-bank154/400/360', true, '2026-07-20 18:34:29.758285', 34, 3);
INSERT INTO public.productos VALUES (147, 'Funda para celular', NULL, 21000.00, 'https://picsum.photos/seed/funda-para-celular155/400/360', true, '2026-07-20 18:34:29.758285', 34, 3);
INSERT INTO public.productos VALUES (148, 'Soporte para laptop', NULL, 51000.00, 'https://picsum.photos/seed/soporte-para-laptop156/400/360', true, '2026-07-20 18:34:29.758285', 34, 3);
INSERT INTO public.productos VALUES (149, 'Cambio de pantalla celular', NULL, 78000.00, 'https://picsum.photos/seed/cambio-de-pantalla-celular157/400/360', true, '2026-07-20 18:34:29.758285', 34, 3);
INSERT INTO public.productos VALUES (150, 'Ilustración digital', NULL, 44500.00, 'https://picsum.photos/seed/ilustracion-digital159/400/360', true, '2026-07-20 18:34:29.758285', 35, 2);
INSERT INTO public.productos VALUES (151, 'Portada para redes', NULL, 23500.00, 'https://picsum.photos/seed/portada-para-redes160/400/360', true, '2026-07-20 18:34:29.758285', 35, 2);
INSERT INTO public.productos VALUES (152, 'Edición de fotos', NULL, 17500.00, 'https://picsum.photos/seed/edicion-de-fotos161/400/360', true, '2026-07-20 18:34:29.758285', 35, 2);
INSERT INTO public.productos VALUES (153, 'Diseño de flyer', NULL, 24500.00, 'https://picsum.photos/seed/diseno-de-flyer162/400/360', true, '2026-07-20 18:34:29.758285', 35, 2);
INSERT INTO public.productos VALUES (154, 'Diseño de stickers', NULL, 27000.00, 'https://picsum.photos/seed/diseno-de-stickers163/400/360', true, '2026-07-20 18:34:29.758285', 35, 2);
INSERT INTO public.productos VALUES (155, 'Portada para redes', NULL, 24500.00, 'https://picsum.photos/seed/portada-para-redes165/400/360', true, '2026-07-20 18:34:29.758285', 36, 2);
INSERT INTO public.productos VALUES (156, 'Plantilla Canva personalizada', NULL, 18000.00, 'https://picsum.photos/seed/plantilla-canva-personalizada166/400/360', true, '2026-07-20 18:34:29.758285', 36, 2);
INSERT INTO public.productos VALUES (157, 'Tarjetas de presentación', NULL, 22500.00, 'https://picsum.photos/seed/tarjetas-de-presentacion167/400/360', true, '2026-07-20 18:34:29.758285', 36, 2);
INSERT INTO public.productos VALUES (158, 'Ilustración digital', NULL, 31000.00, 'https://picsum.photos/seed/ilustracion-digital168/400/360', true, '2026-07-20 18:34:29.758285', 36, 2);
INSERT INTO public.productos VALUES (159, 'Edición de fotos', NULL, 18000.00, 'https://picsum.photos/seed/edicion-de-fotos169/400/360', true, '2026-07-20 18:34:29.758285', 36, 2);
INSERT INTO public.productos VALUES (160, 'Power bank', NULL, 70500.00, 'https://picsum.photos/seed/power-bank171/400/360', true, '2026-07-20 18:34:29.758285', 37, 3);
INSERT INTO public.productos VALUES (161, 'Funda para celular', NULL, 22000.00, 'https://picsum.photos/seed/funda-para-celular172/400/360', true, '2026-07-20 18:34:29.758285', 37, 3);
INSERT INTO public.productos VALUES (162, 'Soporte para laptop', NULL, 35500.00, 'https://picsum.photos/seed/soporte-para-laptop173/400/360', true, '2026-07-20 18:34:29.758285', 37, 3);
INSERT INTO public.productos VALUES (163, 'Cambio de pantalla celular', NULL, 77000.00, 'https://picsum.photos/seed/cambio-de-pantalla-celular174/400/360', true, '2026-07-20 18:34:29.758285', 37, 3);
INSERT INTO public.productos VALUES (164, 'Cable USB-C', NULL, 11000.00, 'https://picsum.photos/seed/cable-usb-c175/400/360', true, '2026-07-20 18:34:29.758285', 37, 3);
INSERT INTO public.productos VALUES (165, 'Instalación de software', NULL, 26000.00, 'https://picsum.photos/seed/instalacion-de-software176/400/360', true, '2026-07-20 18:34:29.758285', 37, 3);
INSERT INTO public.productos VALUES (166, 'Snack saludable', NULL, 8500.00, 'https://picsum.photos/seed/snack-saludable178/400/360', true, '2026-07-20 18:34:29.758285', 38, 1);
INSERT INTO public.productos VALUES (167, 'Torta personalizada', NULL, 62000.00, 'https://picsum.photos/seed/torta-personalizada179/400/360', true, '2026-07-20 18:34:29.758285', 38, 1);
INSERT INTO public.productos VALUES (168, 'Combo almuerzo', NULL, 15500.00, 'https://picsum.photos/seed/combo-almuerzo180/400/360', true, '2026-07-20 18:34:29.758285', 38, 1);
INSERT INTO public.productos VALUES (169, 'Sandwich especial', NULL, 17000.00, 'https://picsum.photos/seed/sandwich-especial181/400/360', true, '2026-07-20 18:34:29.758285', 38, 1);
INSERT INTO public.productos VALUES (170, 'Funda para celular', NULL, 23000.00, 'https://picsum.photos/seed/funda-para-celular183/400/360', true, '2026-07-20 18:34:29.758285', 39, 3);
INSERT INTO public.productos VALUES (171, 'Audífonos inalámbricos', NULL, 63500.00, 'https://picsum.photos/seed/audifonos-inalambricos184/400/360', true, '2026-07-20 18:34:29.758285', 39, 3);
INSERT INTO public.productos VALUES (172, 'Mantenimiento de PC', NULL, 31500.00, 'https://picsum.photos/seed/mantenimiento-de-pc185/400/360', true, '2026-07-20 18:34:29.758285', 39, 3);
INSERT INTO public.productos VALUES (173, 'Instalación de software', NULL, 24500.00, 'https://picsum.photos/seed/instalacion-de-software186/400/360', true, '2026-07-20 18:34:29.758285', 39, 3);
INSERT INTO public.productos VALUES (174, 'Soporte para laptop', NULL, 39000.00, 'https://picsum.photos/seed/soporte-para-laptop187/400/360', true, '2026-07-20 18:34:29.758285', 39, 3);
INSERT INTO public.productos VALUES (175, 'Tutoría de matemáticas', NULL, 19500.00, 'https://picsum.photos/seed/tutoria-de-matematicas189/400/360', true, '2026-07-20 18:34:29.758285', 40, 6);
INSERT INTO public.productos VALUES (176, 'Diseño de CV', NULL, 14500.00, 'https://picsum.photos/seed/diseno-de-cv190/400/360', true, '2026-07-20 18:34:29.758285', 40, 6);
INSERT INTO public.productos VALUES (177, 'Asesoría de tesis', NULL, 35000.00, 'https://picsum.photos/seed/asesoria-de-tesis191/400/360', true, '2026-07-20 18:34:29.758285', 40, 6);
INSERT INTO public.productos VALUES (178, 'Edición de video', NULL, 50500.00, 'https://picsum.photos/seed/edicion-de-video192/400/360', true, '2026-07-20 18:34:29.758285', 40, 6);
INSERT INTO public.productos VALUES (179, 'Sesión de fotos', NULL, 85000.00, 'https://picsum.photos/seed/sesion-de-fotos193/400/360', true, '2026-07-20 18:34:29.758285', 40, 6);
INSERT INTO public.productos VALUES (180, 'Snack saludable', NULL, 8000.00, 'https://picsum.photos/seed/snack-saludable195/400/360', true, '2026-07-20 18:34:29.758285', 41, 1);
INSERT INTO public.productos VALUES (181, 'Wrap del día', NULL, 14000.00, 'https://picsum.photos/seed/wrap-del-dia196/400/360', true, '2026-07-20 18:34:29.758285', 41, 1);
INSERT INTO public.productos VALUES (182, 'Café artesanal', NULL, 4500.00, 'https://picsum.photos/seed/cafe-artesanal197/400/360', true, '2026-07-20 18:34:29.758285', 41, 1);
INSERT INTO public.productos VALUES (183, 'Postre del día', NULL, 12000.00, 'https://picsum.photos/seed/postre-del-dia198/400/360', true, '2026-07-20 18:34:29.758285', 41, 1);
INSERT INTO public.productos VALUES (184, 'Jugo natural', NULL, 6500.00, 'https://picsum.photos/seed/jugo-natural199/400/360', true, '2026-07-20 18:34:29.758285', 41, 1);
INSERT INTO public.productos VALUES (185, 'Power bank', NULL, 49000.00, 'https://picsum.photos/seed/power-bank201/400/360', true, '2026-07-20 18:34:29.758285', 42, 3);
INSERT INTO public.productos VALUES (186, 'Funda para celular', NULL, 15000.00, 'https://picsum.photos/seed/funda-para-celular202/400/360', true, '2026-07-20 18:34:29.758285', 42, 3);
INSERT INTO public.productos VALUES (187, 'Instalación de software', NULL, 24500.00, 'https://picsum.photos/seed/instalacion-de-software203/400/360', true, '2026-07-20 18:34:29.758285', 42, 3);
INSERT INTO public.productos VALUES (188, 'Audífonos inalámbricos', NULL, 67500.00, 'https://picsum.photos/seed/audifonos-inalambricos204/400/360', true, '2026-07-20 18:34:29.758285', 42, 3);
INSERT INTO public.productos VALUES (189, 'Soporte para laptop', NULL, 42500.00, 'https://picsum.photos/seed/soporte-para-laptop205/400/360', true, '2026-07-20 18:34:29.758285', 42, 3);
INSERT INTO public.productos VALUES (190, 'Diseño de logo', NULL, 49500.00, 'https://picsum.photos/seed/diseno-de-logo207/400/360', true, '2026-07-20 18:34:29.758285', 43, 2);
INSERT INTO public.productos VALUES (191, 'Ilustración digital', NULL, 56000.00, 'https://picsum.photos/seed/ilustracion-digital208/400/360', true, '2026-07-20 18:34:29.758285', 43, 2);
INSERT INTO public.productos VALUES (192, 'Diseño de flyer', NULL, 21500.00, 'https://picsum.photos/seed/diseno-de-flyer209/400/360', true, '2026-07-20 18:34:29.758285', 43, 2);
INSERT INTO public.productos VALUES (193, 'Diseño de stickers', NULL, 25000.00, 'https://picsum.photos/seed/diseno-de-stickers210/400/360', true, '2026-07-20 18:34:29.758285', 43, 2);
INSERT INTO public.productos VALUES (194, 'Manillas artesanales', NULL, 9000.00, 'https://picsum.photos/seed/manillas-artesanales212/400/360', true, '2026-07-20 18:34:29.758285', 44, 4);
INSERT INTO public.productos VALUES (195, 'Medias divertidas', NULL, 14500.00, 'https://picsum.photos/seed/medias-divertidas213/400/360', true, '2026-07-20 18:34:29.758285', 44, 4);
INSERT INTO public.productos VALUES (196, 'Bolso tejido', NULL, 52000.00, 'https://picsum.photos/seed/bolso-tejido214/400/360', true, '2026-07-20 18:34:29.758285', 44, 4);
INSERT INTO public.productos VALUES (197, 'Aretes artesanales', NULL, 14000.00, 'https://picsum.photos/seed/aretes-artesanales215/400/360', true, '2026-07-20 18:34:29.758285', 44, 4);
INSERT INTO public.productos VALUES (198, 'Gorra bordada', NULL, 39500.00, 'https://picsum.photos/seed/gorra-bordada216/400/360', true, '2026-07-20 18:34:29.758285', 44, 4);
INSERT INTO public.productos VALUES (199, 'Diseño de CV', NULL, 23500.00, 'https://picsum.photos/seed/diseno-de-cv218/400/360', true, '2026-07-20 18:34:29.758285', 45, 6);
INSERT INTO public.productos VALUES (200, 'Asesoría de tesis', NULL, 43500.00, 'https://picsum.photos/seed/asesoria-de-tesis219/400/360', true, '2026-07-20 18:34:29.758285', 45, 6);
INSERT INTO public.productos VALUES (201, 'Clases de inglés', NULL, 18500.00, 'https://picsum.photos/seed/clases-de-ingles220/400/360', true, '2026-07-20 18:34:29.758285', 45, 6);
INSERT INTO public.productos VALUES (202, 'Sesión de fotos', NULL, 40500.00, 'https://picsum.photos/seed/sesion-de-fotos221/400/360', true, '2026-07-20 18:34:29.758285', 45, 6);
INSERT INTO public.productos VALUES (203, 'Cable USB-C', NULL, 17000.00, 'https://picsum.photos/seed/cable-usb-c223/400/360', true, '2026-07-20 18:34:29.758285', 46, 3);
INSERT INTO public.productos VALUES (204, 'Cambio de pantalla celular', NULL, 137500.00, 'https://picsum.photos/seed/cambio-de-pantalla-celular224/400/360', true, '2026-07-20 18:34:29.758285', 46, 3);
INSERT INTO public.productos VALUES (205, 'Funda para celular', NULL, 17500.00, 'https://picsum.photos/seed/funda-para-celular225/400/360', true, '2026-07-20 18:34:29.758285', 46, 3);
INSERT INTO public.productos VALUES (206, 'Soporte para laptop', NULL, 43000.00, 'https://picsum.photos/seed/soporte-para-laptop226/400/360', true, '2026-07-20 18:34:29.758285', 46, 3);
INSERT INTO public.productos VALUES (207, 'Power bank', NULL, 75000.00, 'https://picsum.photos/seed/power-bank227/400/360', true, '2026-07-20 18:34:29.758285', 46, 3);
INSERT INTO public.productos VALUES (208, 'Combo desayuno', NULL, 15000.00, 'https://picsum.photos/seed/combo-desayuno229/400/360', true, '2026-07-20 18:34:29.758285', 47, 1);
INSERT INTO public.productos VALUES (209, 'Torta personalizada', NULL, 61500.00, 'https://picsum.photos/seed/torta-personalizada230/400/360', true, '2026-07-20 18:34:29.758285', 47, 1);
INSERT INTO public.productos VALUES (210, 'Café artesanal', NULL, 6500.00, 'https://picsum.photos/seed/cafe-artesanal231/400/360', true, '2026-07-20 18:34:29.758285', 47, 1);
INSERT INTO public.productos VALUES (211, 'Postre del día', NULL, 13000.00, 'https://picsum.photos/seed/postre-del-dia232/400/360', true, '2026-07-20 18:34:29.758285', 47, 1);
INSERT INTO public.productos VALUES (212, 'Ensalada fresca', NULL, 19000.00, 'https://picsum.photos/seed/ensalada-fresca233/400/360', true, '2026-07-20 18:34:29.758285', 47, 1);
INSERT INTO public.productos VALUES (213, 'Maquillaje profesional', NULL, 77000.00, 'https://picsum.photos/seed/maquillaje-profesional235/400/360', true, '2026-07-20 18:34:29.963916', 48, 5);
INSERT INTO public.productos VALUES (214, 'Cejas y pestañas', NULL, 29000.00, 'https://picsum.photos/seed/cejas-y-pestanas236/400/360', true, '2026-07-20 18:34:29.963916', 48, 5);
INSERT INTO public.productos VALUES (215, 'Manicure express', NULL, 18500.00, 'https://picsum.photos/seed/manicure-express237/400/360', true, '2026-07-20 18:34:29.963916', 48, 5);
INSERT INTO public.productos VALUES (216, 'Set de skincare', NULL, 56000.00, 'https://picsum.photos/seed/set-de-skincare238/400/360', true, '2026-07-20 18:34:29.963916', 48, 5);
INSERT INTO public.productos VALUES (217, 'Clases de inglés', NULL, 28500.00, 'https://picsum.photos/seed/clases-de-ingles240/400/360', true, '2026-07-20 18:34:29.963916', 49, 6);
INSERT INTO public.productos VALUES (218, 'Tutoría de matemáticas', NULL, 24500.00, 'https://picsum.photos/seed/tutoria-de-matematicas241/400/360', true, '2026-07-20 18:34:29.963916', 49, 6);
INSERT INTO public.productos VALUES (219, 'Impresión de documentos', NULL, 7500.00, 'https://picsum.photos/seed/impresion-de-documentos242/400/360', true, '2026-07-20 18:34:29.963916', 49, 6);
INSERT INTO public.productos VALUES (220, 'Asesoría de tesis', NULL, 27500.00, 'https://picsum.photos/seed/asesoria-de-tesis243/400/360', true, '2026-07-20 18:34:29.963916', 49, 6);


--
-- TOC entry 5217 (class 0 OID 24875)
-- Dependencies: 250
-- Data for Name: resenas; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5193 (class 0 OID 24619)
-- Dependencies: 226
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles VALUES (1, 'estudiante');
INSERT INTO public.roles VALUES (2, 'vendedor');
INSERT INTO public.roles VALUES (3, 'admin');


--
-- TOC entry 5191 (class 0 OID 24599)
-- Dependencies: 224
-- Data for Name: sedes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5211 (class 0 OID 24804)
-- Dependencies: 244
-- Data for Name: transacciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transacciones VALUES (1, 8, '2026-07-17 00:18:28.098124', 'pendiente', 28000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (2, 9, '2026-07-16 21:18:28.098124', 'confirmado', 22500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (3, 10, '2026-07-16 02:18:28.098124', 'entregado', 25500.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (4, 11, '2026-07-15 22:18:28.098124', 'pendiente', 14000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (5, 34, '2026-07-17 21:34:29.758285', 'confirmado', 20000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (6, 27, '2026-07-20 10:34:29.758285', 'entregado', 98000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (7, 25, '2026-07-16 22:34:29.758285', 'cancelado', 95000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (8, 28, '2026-07-19 08:34:29.758285', 'confirmado', 104000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (9, 30, '2026-07-18 14:34:29.758285', 'cancelado', 61000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (10, 29, '2026-07-19 22:34:29.758285', 'pendiente', 273000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (11, 32, '2026-07-17 13:34:29.758285', 'entregado', 66000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (12, 21, '2026-07-17 02:34:29.758285', 'pendiente', 117000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (13, 16, '2026-07-20 17:34:29.758285', 'entregado', 111000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (14, 29, '2026-07-17 12:34:29.758285', 'cancelado', 32000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (15, 24, '2026-07-19 00:34:29.758285', 'cancelado', 15000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (16, 24, '2026-07-17 17:34:29.758285', 'confirmado', 228000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (17, 28, '2026-07-17 05:34:29.758285', 'confirmado', 144000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (18, 21, '2026-07-18 14:34:29.758285', 'entregado', 102000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (19, 27, '2026-07-20 09:34:29.758285', 'confirmado', 24000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (24, 14, '2026-07-16 16:34:29.758285', 'confirmado', 141000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (25, 35, '2026-07-15 13:34:29.758285', 'cancelado', 43500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (26, 32, '2026-07-19 16:34:29.758285', 'cancelado', 36000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (27, 17, '2026-07-20 00:34:29.758285', 'entregado', 44500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (28, 33, '2026-07-19 00:34:29.758285', 'entregado', 153500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (29, 21, '2026-07-19 14:34:29.758285', 'confirmado', 25500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (30, 35, '2026-07-20 17:34:29.758285', 'entregado', 135500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (31, 34, '2026-07-17 04:34:29.758285', 'cancelado', 59000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (32, 38, '2026-07-19 04:34:29.758285', 'confirmado', 76000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (33, 32, '2026-07-15 21:34:29.758285', 'pendiente', 47000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (34, 30, '2026-07-19 06:34:29.758285', 'pendiente', 100500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (35, 17, '2026-07-20 01:34:29.758285', 'confirmado', 275000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (36, 31, '2026-07-20 11:34:29.758285', 'cancelado', 88500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (37, 21, '2026-07-17 06:34:29.758285', 'entregado', 149000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (38, 31, '2026-07-19 15:34:29.758285', 'confirmado', 70000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (39, 27, '2026-07-15 19:34:29.758285', 'confirmado', 78500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (40, 28, '2026-07-16 23:34:29.758285', 'confirmado', 110000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (41, 19, '2026-07-15 14:34:29.758285', 'confirmado', 99000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (42, 37, '2026-07-16 16:34:29.758285', 'cancelado', 318000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (43, 26, '2026-07-14 22:34:29.758285', 'pendiente', 31000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (44, 33, '2026-07-17 18:34:29.758285', 'entregado', 49000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (45, 26, '2026-07-17 07:34:29.758285', 'entregado', 9000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (46, 35, '2026-07-17 16:34:29.758285', 'entregado', 5000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (47, 16, '2026-07-19 11:34:29.758285', 'entregado', 334000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (48, 20, '2026-07-16 15:34:29.758285', 'cancelado', 338000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (49, 35, '2026-07-16 15:34:29.758285', 'entregado', 393000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (50, 23, '2026-07-16 01:34:29.758285', 'pendiente', 107000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (51, 17, '2026-07-15 02:34:29.758285', 'confirmado', 23000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (52, 15, '2026-07-16 16:34:29.758285', 'cancelado', 64500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (53, 13, '2026-07-20 05:34:29.758285', 'cancelado', 62000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (54, 33, '2026-07-14 03:34:29.758285', 'confirmado', 177000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (55, 34, '2026-07-14 19:34:29.758285', 'entregado', 26500.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (56, 21, '2026-07-19 10:34:29.758285', 'cancelado', 117500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (57, 24, '2026-07-18 06:34:29.758285', 'pendiente', 57000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (58, 35, '2026-07-18 10:34:29.758285', 'entregado', 154000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (59, 21, '2026-07-19 13:34:29.758285', 'confirmado', 20000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (60, 38, '2026-07-14 11:34:29.758285', 'confirmado', 86000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (22, 34, '2026-07-17 16:34:29.758285', 'pendiente', 149000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (20, 30, '2026-07-20 08:34:29.758285', 'pendiente', 45000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (23, 38, '2026-07-17 05:34:29.758285', 'cancelado', 194000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (21, 15, '2026-07-18 00:34:29.758285', 'confirmado', 104000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (61, 14, '2026-07-16 06:34:29.758285', 'confirmado', 112000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (62, 33, '2026-07-18 10:34:29.758285', 'cancelado', 173000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (63, 25, '2026-07-19 17:34:29.758285', 'entregado', 73000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (64, 34, '2026-07-20 00:34:29.758285', 'entregado', 85000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (65, 37, '2026-07-17 03:34:29.758285', 'entregado', 6000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (66, 31, '2026-07-20 00:34:29.758285', 'entregado', 22500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (67, 29, '2026-07-16 17:34:29.758285', 'confirmado', 29000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (68, 36, '2026-07-18 21:34:29.758285', 'entregado', 205500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (69, 34, '2026-07-19 23:34:29.758285', 'entregado', 21500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (70, 29, '2026-07-17 00:34:29.758285', 'confirmado', 19500.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (71, 17, '2026-07-18 15:34:29.758285', 'entregado', 37500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (72, 37, '2026-07-15 19:34:29.758285', 'entregado', 104500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (73, 35, '2026-07-15 08:34:29.758285', 'pendiente', 97500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (74, 27, '2026-07-15 03:34:29.758285', 'entregado', 174000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (75, 24, '2026-07-16 21:34:29.758285', 'pendiente', 90000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (76, 37, '2026-07-18 16:34:29.758285', 'entregado', 45000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (77, 22, '2026-07-15 08:34:29.758285', 'pendiente', 324000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (78, 29, '2026-07-17 17:34:29.758285', 'pendiente', 35000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (79, 29, '2026-07-16 02:34:29.758285', 'confirmado', 49000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (80, 13, '2026-07-20 04:34:29.758285', 'entregado', 72500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (81, 13, '2026-07-14 14:34:29.758285', 'cancelado', 45000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (82, 13, '2026-07-16 23:34:29.758285', 'cancelado', 103000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (83, 15, '2026-07-14 22:34:29.758285', 'cancelado', 142000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (84, 25, '2026-07-16 15:34:29.758285', 'entregado', 231000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (85, 28, '2026-07-15 05:34:29.758285', 'entregado', 52000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (86, 18, '2026-07-19 05:34:29.758285', 'pendiente', 62000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (87, 20, '2026-07-16 21:34:29.758285', 'entregado', 186000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (88, 27, '2026-07-16 18:34:29.758285', 'entregado', 186000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (89, 35, '2026-07-16 21:34:29.758285', 'confirmado', 63500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (90, 20, '2026-07-20 11:34:29.758285', 'entregado', 137000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (91, 15, '2026-07-16 12:34:29.758285', 'entregado', 70500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (92, 32, '2026-07-14 17:34:29.758285', 'entregado', 19500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (93, 33, '2026-07-17 22:34:29.758285', 'cancelado', 228500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (94, 30, '2026-07-13 21:34:29.758285', 'entregado', 130000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (95, 27, '2026-07-17 11:34:29.758285', 'entregado', 16000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (96, 29, '2026-07-18 04:34:29.758285', 'entregado', 29000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (97, 32, '2026-07-17 16:34:29.758285', 'entregado', 12000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (98, 23, '2026-07-15 07:34:29.758285', 'cancelado', 233000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (99, 34, '2026-07-16 07:34:29.758285', 'pendiente', 85000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (100, 21, '2026-07-14 14:34:29.758285', 'cancelado', 85000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (101, 23, '2026-07-16 23:34:29.758285', 'cancelado', 260500.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (102, 22, '2026-07-17 13:34:29.758285', 'confirmado', 50000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (103, 28, '2026-07-14 18:34:29.758285', 'entregado', 213000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (104, 30, '2026-07-16 09:34:29.758285', 'confirmado', 133000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (105, 36, '2026-07-13 20:34:29.758285', 'entregado', 70500.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (106, 30, '2026-07-18 23:34:29.758285', 'confirmado', 463500.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (107, 28, '2026-07-15 07:34:29.758285', 'pendiente', 43000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (108, 29, '2026-07-15 21:34:29.758285', 'entregado', 69000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (109, 30, '2026-07-15 01:34:29.758285', 'entregado', 123000.00, 'Nequi');
INSERT INTO public.transacciones VALUES (110, 24, '2026-07-17 19:34:29.758285', 'confirmado', 45000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (111, 26, '2026-07-20 13:34:29.758285', 'cancelado', 15000.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (112, 33, '2026-07-14 19:34:29.963916', 'entregado', 55500.00, 'Nequi');
INSERT INTO public.transacciones VALUES (113, 32, '2026-07-16 12:34:29.963916', 'confirmado', 88500.00, 'Daviplata');
INSERT INTO public.transacciones VALUES (114, 33, '2026-07-17 11:34:29.963916', 'entregado', 101000.00, 'Efectivo');
INSERT INTO public.transacciones VALUES (115, 28, '2026-07-18 13:34:29.963916', 'entregado', 111000.00, 'Efectivo');


--
-- TOC entry 5187 (class 0 OID 24578)
-- Dependencies: 220
-- Data for Name: universidades; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.universidades VALUES (1, 'Universidad del Norte', 'uninorte.edu.co');
INSERT INTO public.universidades VALUES (2, 'Costa Universidad', 'cuc.edu.co');
INSERT INTO public.universidades VALUES (3, 'Uniautónoma', 'uac.edu.co');
INSERT INTO public.universidades VALUES (4, 'Simón Bolívar', 'unisimonbolivar.edu.co');
INSERT INTO public.universidades VALUES (5, 'Universidad Libre', 'unilibre.edu.co');
INSERT INTO public.universidades VALUES (6, 'Univ. de Medellín', 'udem.edu.co');
INSERT INTO public.universidades VALUES (7, 'EIA', 'eia.edu.co');
INSERT INTO public.universidades VALUES (8, 'Bolivariana', 'upb.edu.co');
INSERT INTO public.universidades VALUES (9, 'U. de Antioquia', 'udea.edu.co');


--
-- TOC entry 5197 (class 0 OID 24659)
-- Dependencies: 230
-- Data for Name: usuario_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuario_roles VALUES (1, 1, 2, '2026-07-15 00:50:49.110431');
INSERT INTO public.usuario_roles VALUES (2, 2, 2, '2026-07-15 00:50:49.110431');
INSERT INTO public.usuario_roles VALUES (3, 3, 2, '2026-07-15 00:50:49.110431');
INSERT INTO public.usuario_roles VALUES (4, 4, 2, '2026-07-15 00:50:49.110431');
INSERT INTO public.usuario_roles VALUES (5, 5, 2, '2026-07-15 00:50:49.110431');
INSERT INTO public.usuario_roles VALUES (6, 6, 2, '2026-07-15 00:50:49.110431');
INSERT INTO public.usuario_roles VALUES (7, 7, 2, '2026-07-15 00:50:49.110431');
INSERT INTO public.usuario_roles VALUES (8, 13, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (9, 14, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (10, 15, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (11, 16, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (12, 17, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (13, 18, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (14, 19, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (15, 20, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (16, 21, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (17, 22, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (18, 23, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (19, 24, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (20, 25, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (21, 26, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (22, 27, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (23, 28, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (24, 29, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (25, 30, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (26, 31, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (27, 32, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (28, 33, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (29, 34, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (30, 35, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (31, 36, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (32, 37, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (33, 38, 1, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (34, 39, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (35, 40, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (36, 41, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (37, 42, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (38, 43, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (39, 44, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (40, 45, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (41, 46, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (42, 47, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (43, 48, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (44, 49, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (45, 50, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (46, 51, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (47, 52, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (48, 53, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (49, 54, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (50, 55, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (51, 56, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (52, 57, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (53, 58, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (54, 59, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (55, 60, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (56, 61, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (57, 62, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (58, 63, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (59, 64, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (60, 65, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (61, 66, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (62, 67, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (63, 68, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (64, 69, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (65, 70, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (66, 71, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (67, 72, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (68, 73, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (69, 74, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (70, 75, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (71, 76, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (72, 77, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (73, 78, 2, '2026-07-20 18:34:29.758285');
INSERT INTO public.usuario_roles VALUES (74, 79, 2, '2026-07-20 18:34:29.963916');
INSERT INTO public.usuario_roles VALUES (75, 80, 2, '2026-07-20 18:34:29.963916');


--
-- TOC entry 5195 (class 0 OID 24630)
-- Dependencies: 228
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.usuarios VALUES (2, 'Andrés', 'Pérez', 'andres.perez@gmail.com', 'temporal123', NULL, true, '2026-07-15 00:50:49.110431', 1, 'andres.perez@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (3, 'Laura', 'Martínez', 'laura.martinez@gmail.com', 'temporal123', NULL, true, '2026-07-15 00:50:49.110431', 1, 'laura.martinez@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (4, 'Julián', 'Torres', 'julian.torres@gmail.com', 'temporal123', NULL, true, '2026-07-15 00:50:49.110431', 2, 'julian.torres@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (5, 'Sofía', 'Ramírez', 'sofia.ramirez@gmail.com', 'temporal123', NULL, true, '2026-07-15 00:50:49.110431', 2, 'sofia.ramirez@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (6, 'Diego', 'Herrera', 'diego.herrera@gmail.com', 'temporal123', NULL, true, '2026-07-15 00:50:49.110431', 3, 'diego.herrera@uac.edu.co', true);
INSERT INTO public.usuarios VALUES (7, 'Mariana', 'Castro', 'mariana.castro@gmail.com', 'temporal123', NULL, true, '2026-07-15 00:50:49.110431', 6, 'mariana.castro@udem.edu.co', true);
INSERT INTO public.usuarios VALUES (8, 'Valentina', 'García', 'valentina.garcia@gmail.com', 'temporal123', NULL, true, '2026-07-17 02:18:28.098124', 1, NULL, false);
INSERT INTO public.usuarios VALUES (9, 'Andrés', 'Ramírez', 'andres.ramirez2@gmail.com', 'temporal123', NULL, true, '2026-07-17 02:18:28.098124', 1, NULL, false);
INSERT INTO public.usuarios VALUES (10, 'Camila', 'Prieto', 'camila.prieto@gmail.com', 'temporal123', NULL, true, '2026-07-17 02:18:28.098124', 1, NULL, false);
INSERT INTO public.usuarios VALUES (11, 'Julián', 'Morales', 'julian.morales@gmail.com', 'temporal123', NULL, true, '2026-07-17 02:18:28.098124', 1, NULL, false);
INSERT INTO public.usuarios VALUES (1, 'Camila', 'Ríos', 'camila.rios@gmail.com', 'temporal123', NULL, true, '2026-07-15 00:50:49.110431', 8, 'camila.rios@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (12, 'Manuel', 'Rueda', 'manuel_rueda@gmail.com', 'manuel123', NULL, true, '2026-07-19 05:15:15.720882', 8, NULL, false);
INSERT INTO public.usuarios VALUES (13, 'Isabella', 'Torres', 'isabella.torres100@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 5, NULL, false);
INSERT INTO public.usuarios VALUES (14, 'Valentina', 'Peña', 'valentina.peña101@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, NULL, false);
INSERT INTO public.usuarios VALUES (15, 'Felipe', 'Cuervo', 'felipe.cuervo102@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 9, NULL, false);
INSERT INTO public.usuarios VALUES (16, 'Daniela', 'Fajardo', 'daniela.fajardo103@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 7, NULL, false);
INSERT INTO public.usuarios VALUES (17, 'Santiago', 'Torres', 'santiago.torres104@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, NULL, false);
INSERT INTO public.usuarios VALUES (18, 'Antonella', 'Peña', 'antonella.peña105@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 9, NULL, false);
INSERT INTO public.usuarios VALUES (19, 'Ricardo', 'Torres', 'ricardo.torres106@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 9, NULL, false);
INSERT INTO public.usuarios VALUES (20, 'Mateo', 'Duarte', 'mateo.duarte107@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 9, NULL, false);
INSERT INTO public.usuarios VALUES (21, 'Miguel', 'Peña', 'miguel.peña108@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 8, NULL, false);
INSERT INTO public.usuarios VALUES (22, 'Melissa', 'Restrepo', 'melissa.restrepo109@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, NULL, false);
INSERT INTO public.usuarios VALUES (23, 'Sebastián', 'Duarte', 'sebastian.duarte110@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 7, NULL, false);
INSERT INTO public.usuarios VALUES (24, 'Salomé', 'Restrepo', 'salome.restrepo111@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, NULL, false);
INSERT INTO public.usuarios VALUES (25, 'Antonella', 'Lozano', 'antonella.lozano112@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, NULL, false);
INSERT INTO public.usuarios VALUES (26, 'Felipe', 'Gómez', 'felipe.gomez113@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 7, NULL, false);
INSERT INTO public.usuarios VALUES (27, 'Felipe', 'Cadena', 'felipe.cadena114@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, NULL, false);
INSERT INTO public.usuarios VALUES (28, 'Ricardo', 'Restrepo', 'ricardo.restrepo115@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, NULL, false);
INSERT INTO public.usuarios VALUES (29, 'María José', 'Osorio', 'maria.osorio116@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, NULL, false);
INSERT INTO public.usuarios VALUES (30, 'Diego', 'Gómez', 'diego.gomez117@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 9, NULL, false);
INSERT INTO public.usuarios VALUES (31, 'Juan Pablo', 'Reyes', 'juan.reyes118@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, NULL, false);
INSERT INTO public.usuarios VALUES (32, 'Fabián', 'Salcedo', 'fabian.salcedo119@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, NULL, false);
INSERT INTO public.usuarios VALUES (33, 'Santiago', 'Cuervo', 'santiago.cuervo120@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 3, NULL, false);
INSERT INTO public.usuarios VALUES (34, 'Juan Pablo', 'Gómez', 'juan.gomez121@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 3, NULL, false);
INSERT INTO public.usuarios VALUES (35, 'Felipe', 'Escobar', 'felipe.escobar122@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 5, NULL, false);
INSERT INTO public.usuarios VALUES (36, 'María José', 'Villalobos', 'maria.villalobos123@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, NULL, false);
INSERT INTO public.usuarios VALUES (37, 'Sebastián', 'Cadena', 'sebastian.cadena124@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, NULL, false);
INSERT INTO public.usuarios VALUES (38, 'Antonella', 'Cuervo', 'antonella.cuervo125@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 5, NULL, false);
INSERT INTO public.usuarios VALUES (39, 'Mariana', 'Cuervo', 'mariana.cuervo1@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, 'mariana.cuervo1@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (40, 'Óscar', 'Vargas', 'oscar.vargas6@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, 'oscar.vargas6@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (41, 'Ximena', 'Pardo', 'ximena.pardo13@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, 'ximena.pardo13@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (42, 'Santiago', 'Reyes', 'santiago.reyes18@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, 'santiago.reyes18@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (43, 'Esteban', 'Quintero', 'esteban.quintero23@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, 'esteban.quintero23@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (44, 'Isabella', 'Guerrero', 'isabella.guerrero29@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, 'isabella.guerrero29@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (45, 'Sara', 'Villalobos', 'sara.villalobos35@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 1, 'sara.villalobos35@uninorte.edu.co', true);
INSERT INTO public.usuarios VALUES (46, 'Miguel', 'Escobar', 'miguel.escobar42@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'miguel.escobar42@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (47, 'Daniela', 'Cano', 'daniela.cano47@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'daniela.cano47@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (48, 'Sofía', 'Cuervo', 'sofia.cuervo54@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'sofia.cuervo54@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (49, 'Paula', 'Salcedo', 'paula.salcedo59@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'paula.salcedo59@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (50, 'Gabriela', 'Torres', 'gabriela.torres66@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'gabriela.torres66@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (51, 'Mariana', 'Correa', 'mariana.correa73@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'mariana.correa73@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (52, 'Sebastián', 'Pardo', 'sebastian.pardo78@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'sebastian.pardo78@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (53, 'Alejandro', 'Rojas', 'alejandro.rojas83@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 2, 'alejandro.rojas83@cuc.edu.co', true);
INSERT INTO public.usuarios VALUES (54, 'Sara', 'Escobar', 'sara.escobar89@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'sara.escobar89@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (55, 'Andrés', 'Cano', 'andres.cano94@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'andres.cano94@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (56, 'David', 'Cuervo', 'david.cuervo101@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'david.cuervo101@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (57, 'Gabriela', 'Pardo', 'gabriela.pardo106@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'gabriela.pardo106@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (58, 'María José', 'Trujillo', 'maria.trujillo111@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'maria-jose.trujillo111@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (59, 'Mariana', 'Escobar', 'mariana.escobar116@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'mariana.escobar116@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (60, 'Tomás', 'Zapata', 'tomas.zapata121@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'tomas.zapata121@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (61, 'Nicolás', 'Osorio', 'nicolas.osorio127@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'nicolas.osorio127@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (62, 'Fabián', 'Correa', 'fabian.correa134@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 4, 'fabian.correa134@unisimonbolivar.edu.co', true);
INSERT INTO public.usuarios VALUES (63, 'Alejandro', 'Fajardo', 'alejandro.fajardo141@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 3, 'alejandro.fajardo141@uac.edu.co', true);
INSERT INTO public.usuarios VALUES (64, 'Esteban', 'Zapata', 'esteban.zapata147@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 3, 'esteban.zapata147@uac.edu.co', true);
INSERT INTO public.usuarios VALUES (65, 'Salomé', 'Gómez', 'salome.gomez152@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 3, 'salome.gomez152@uac.edu.co', true);
INSERT INTO public.usuarios VALUES (66, 'Luciana', 'Reyes', 'luciana.reyes158@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 5, 'luciana.reyes158@unilibre.edu.co', true);
INSERT INTO public.usuarios VALUES (67, 'Alejandro', 'Trujillo', 'alejandro.trujillo164@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 5, 'alejandro.trujillo164@unilibre.edu.co', true);
INSERT INTO public.usuarios VALUES (68, 'Felipe', 'Lozano', 'felipe.lozano170@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 5, 'felipe.lozano170@unilibre.edu.co', true);
INSERT INTO public.usuarios VALUES (69, 'Ricardo', 'Reyes', 'ricardo.reyes177@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, 'ricardo.reyes177@udem.edu.co', true);
INSERT INTO public.usuarios VALUES (70, 'Alejandro', 'Villalobos', 'alejandro.villalobos182@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, 'alejandro.villalobos182@udem.edu.co', true);
INSERT INTO public.usuarios VALUES (71, 'Paula', 'Cadena', 'paula.cadena188@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 6, 'paula.cadena188@udem.edu.co', true);
INSERT INTO public.usuarios VALUES (72, 'Tomás', 'Naranjo', 'tomas.naranjo194@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 7, 'tomas.naranjo194@eia.edu.co', true);
INSERT INTO public.usuarios VALUES (73, 'Laura', 'Restrepo', 'laura.restrepo200@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 7, 'laura.restrepo200@eia.edu.co', true);
INSERT INTO public.usuarios VALUES (74, 'Diego', 'Mendoza', 'diego.mendoza206@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 7, 'diego.mendoza206@eia.edu.co', true);
INSERT INTO public.usuarios VALUES (75, 'Esteban', 'Lozano', 'esteban.lozano211@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 8, 'esteban.lozano211@upb.edu.co', true);
INSERT INTO public.usuarios VALUES (76, 'Samuel', 'Osorio', 'samuel.osorio217@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 8, 'samuel.osorio217@upb.edu.co', true);
INSERT INTO public.usuarios VALUES (77, 'Camila', 'Cuervo', 'camila.cuervo222@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 8, 'camila.cuervo222@upb.edu.co', true);
INSERT INTO public.usuarios VALUES (78, 'Santiago', 'Naranjo', 'santiago.naranjo228@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.758285', 9, 'santiago.naranjo228@udea.edu.co', true);
INSERT INTO public.usuarios VALUES (79, 'Ricardo', 'Cuervo', 'ricardo.cuervo234@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.963916', 9, 'ricardo.cuervo234@udea.edu.co', true);
INSERT INTO public.usuarios VALUES (80, 'David', 'Salcedo', 'david.salcedo239@gmail.com', 'temporal123', NULL, true, '2026-07-20 18:34:29.963916', 9, 'david.salcedo239@udea.edu.co', true);


--
-- TOC entry 5199 (class 0 OID 24683)
-- Dependencies: 232
-- Data for Name: verificaciones_correo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 233
-- Name: categorias_emprendimiento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_emprendimiento_id_seq', 6, true);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 237
-- Name: categorias_producto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_producto_id_seq', 6, true);


--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 221
-- Name: ciudades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ciudades_id_seq', 1, false);


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 245
-- Name: detalle_transacciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.detalle_transacciones_id_seq', 170, true);


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 235
-- Name: emprendimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emprendimientos_id_seq', 49, true);


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 247
-- Name: favoritos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favoritos_id_seq', 1, false);


--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 241
-- Name: inventario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventario_id_seq', 224, true);


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 239
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 220, true);


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 249
-- Name: resenas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.resenas_id_seq', 1, false);


--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 225
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 223
-- Name: sedes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sedes_id_seq', 1, false);


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 243
-- Name: transacciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transacciones_id_seq', 115, true);


--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 219
-- Name: universidades_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.universidades_id_seq', 9, true);


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 229
-- Name: usuario_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuario_roles_id_seq', 75, true);


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 227
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 80, true);


--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 231
-- Name: verificaciones_correo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verificaciones_correo_id_seq', 1, false);


--
-- TOC entry 4999 (class 2606 OID 24711)
-- Name: categorias_emprendimiento categorias_emprendimiento_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_emprendimiento
    ADD CONSTRAINT categorias_emprendimiento_pkey PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 24751)
-- Name: categorias_producto categorias_producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias_producto
    ADD CONSTRAINT categorias_producto_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 24597)
-- Name: ciudades ciudades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ciudades
    ADD CONSTRAINT ciudades_pkey PRIMARY KEY (id);


--
-- TOC entry 5013 (class 2606 OID 24839)
-- Name: detalle_transacciones detalle_transacciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_transacciones
    ADD CONSTRAINT detalle_transacciones_pkey PRIMARY KEY (id);


--
-- TOC entry 5001 (class 2606 OID 24727)
-- Name: emprendimientos emprendimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprendimientos
    ADD CONSTRAINT emprendimientos_pkey PRIMARY KEY (id);


--
-- TOC entry 5015 (class 2606 OID 24861)
-- Name: favoritos favoritos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_pkey PRIMARY KEY (id);


--
-- TOC entry 5017 (class 2606 OID 24863)
-- Name: favoritos favoritos_usuario_id_producto_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_usuario_id_producto_id_key UNIQUE (usuario_id, producto_id);


--
-- TOC entry 5007 (class 2606 OID 24795)
-- Name: inventario inventario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_pkey PRIMARY KEY (id);


--
-- TOC entry 5009 (class 2606 OID 24797)
-- Name: inventario inventario_producto_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_producto_id_key UNIQUE (producto_id);


--
-- TOC entry 5005 (class 2606 OID 24769)
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- TOC entry 5019 (class 2606 OID 24889)
-- Name: resenas resenas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT resenas_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 24626)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 24628)
-- Name: roles roles_rol_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_rol_key UNIQUE (rol);


--
-- TOC entry 4979 (class 2606 OID 24607)
-- Name: sedes sedes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sedes
    ADD CONSTRAINT sedes_pkey PRIMARY KEY (id);


--
-- TOC entry 5011 (class 2606 OID 24818)
-- Name: transacciones transacciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 24588)
-- Name: universidades universidades_dominio_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universidades
    ADD CONSTRAINT universidades_dominio_correo_key UNIQUE (dominio_correo);


--
-- TOC entry 4975 (class 2606 OID 24586)
-- Name: universidades universidades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universidades
    ADD CONSTRAINT universidades_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 24669)
-- Name: usuario_roles usuario_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 24671)
-- Name: usuario_roles usuario_roles_usuario_id_rol_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_rol_id_key UNIQUE (usuario_id, rol_id);


--
-- TOC entry 4985 (class 2606 OID 24652)
-- Name: usuarios usuarios_correo_institucional_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_institucional_key UNIQUE (correo_institucional);


--
-- TOC entry 4987 (class 2606 OID 24650)
-- Name: usuarios usuarios_correo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_correo_key UNIQUE (correo);


--
-- TOC entry 4989 (class 2606 OID 24648)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 24695)
-- Name: verificaciones_correo verificaciones_correo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificaciones_correo
    ADD CONSTRAINT verificaciones_correo_pkey PRIMARY KEY (id);


--
-- TOC entry 4997 (class 2606 OID 24697)
-- Name: verificaciones_correo verificaciones_correo_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificaciones_correo
    ADD CONSTRAINT verificaciones_correo_token_key UNIQUE (token);


--
-- TOC entry 5033 (class 2606 OID 24845)
-- Name: detalle_transacciones detalle_transacciones_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_transacciones
    ADD CONSTRAINT detalle_transacciones_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE RESTRICT;


--
-- TOC entry 5034 (class 2606 OID 24840)
-- Name: detalle_transacciones detalle_transacciones_transaccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detalle_transacciones
    ADD CONSTRAINT detalle_transacciones_transaccion_id_fkey FOREIGN KEY (transaccion_id) REFERENCES public.transacciones(id) ON DELETE CASCADE;


--
-- TOC entry 5026 (class 2606 OID 24738)
-- Name: emprendimientos emprendimientos_categoria_emprendimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprendimientos
    ADD CONSTRAINT emprendimientos_categoria_emprendimiento_id_fkey FOREIGN KEY (categoria_emprendimiento_id) REFERENCES public.categorias_emprendimiento(id) ON DELETE SET NULL;


--
-- TOC entry 5027 (class 2606 OID 24733)
-- Name: emprendimientos emprendimientos_universidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprendimientos
    ADD CONSTRAINT emprendimientos_universidad_id_fkey FOREIGN KEY (universidad_id) REFERENCES public.universidades(id) ON DELETE SET NULL;


--
-- TOC entry 5028 (class 2606 OID 24728)
-- Name: emprendimientos emprendimientos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emprendimientos
    ADD CONSTRAINT emprendimientos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5035 (class 2606 OID 24869)
-- Name: favoritos favoritos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- TOC entry 5036 (class 2606 OID 24864)
-- Name: favoritos favoritos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favoritos
    ADD CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5031 (class 2606 OID 24798)
-- Name: inventario inventario_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventario
    ADD CONSTRAINT inventario_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- TOC entry 5029 (class 2606 OID 24775)
-- Name: productos productos_categoria_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_categoria_producto_id_fkey FOREIGN KEY (categoria_producto_id) REFERENCES public.categorias_producto(id) ON DELETE SET NULL;


--
-- TOC entry 5030 (class 2606 OID 24770)
-- Name: productos productos_emprendimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_emprendimiento_id_fkey FOREIGN KEY (emprendimiento_id) REFERENCES public.emprendimientos(id) ON DELETE CASCADE;


--
-- TOC entry 5037 (class 2606 OID 24895)
-- Name: resenas resenas_emprendimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT resenas_emprendimiento_id_fkey FOREIGN KEY (emprendimiento_id) REFERENCES public.emprendimientos(id) ON DELETE CASCADE;


--
-- TOC entry 5038 (class 2606 OID 24890)
-- Name: resenas resenas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resenas
    ADD CONSTRAINT resenas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 24613)
-- Name: sedes sedes_ciudad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sedes
    ADD CONSTRAINT sedes_ciudad_id_fkey FOREIGN KEY (ciudad_id) REFERENCES public.ciudades(id) ON DELETE SET NULL;


--
-- TOC entry 5021 (class 2606 OID 24608)
-- Name: sedes sedes_universidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sedes
    ADD CONSTRAINT sedes_universidad_id_fkey FOREIGN KEY (universidad_id) REFERENCES public.universidades(id) ON DELETE CASCADE;


--
-- TOC entry 5032 (class 2606 OID 24819)
-- Name: transacciones transacciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transacciones
    ADD CONSTRAINT transacciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- TOC entry 5023 (class 2606 OID 24677)
-- Name: usuario_roles usuario_roles_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_rol_id_fkey FOREIGN KEY (rol_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- TOC entry 5024 (class 2606 OID 24672)
-- Name: usuario_roles usuario_roles_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_roles
    ADD CONSTRAINT usuario_roles_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 5022 (class 2606 OID 24653)
-- Name: usuarios usuarios_universidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_universidad_id_fkey FOREIGN KEY (universidad_id) REFERENCES public.universidades(id) ON DELETE SET NULL;


--
-- TOC entry 5025 (class 2606 OID 24698)
-- Name: verificaciones_correo verificaciones_correo_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verificaciones_correo
    ADD CONSTRAINT verificaciones_correo_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-07-20 20:33:08

--
-- PostgreSQL database dump complete
--

\unrestrict m65iuFCrBagNm1ea3ghwLejH42rMwKvJcWHkigknzTccmQSDAYjth76sBXRnIgf

