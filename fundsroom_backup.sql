--
-- PostgreSQL database dump
--

\restrict nIPwegifY2nsCyptVJiFGxuSHvcIhXevbryZ5cnQ2sSKKFBvOVaKBlzcYqPTw3y

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

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
-- Name: challan_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challan_items (
    id integer NOT NULL,
    challan_id integer NOT NULL,
    product_id integer NOT NULL,
    product_name character varying(150) NOT NULL,
    sku character varying(100) NOT NULL,
    unit_price numeric(12,2) NOT NULL,
    quantity integer NOT NULL,
    CONSTRAINT challan_items_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.challan_items OWNER TO postgres;

--
-- Name: challan_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.challan_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.challan_items_id_seq OWNER TO postgres;

--
-- Name: challan_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.challan_items_id_seq OWNED BY public.challan_items.id;


--
-- Name: challans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.challans (
    id integer NOT NULL,
    challan_number character varying(50) NOT NULL,
    customer_id integer NOT NULL,
    total_quantity integer DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'Draft'::character varying NOT NULL,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT challans_status_check CHECK (((status)::text = ANY ((ARRAY['Draft'::character varying, 'Confirmed'::character varying, 'Cancelled'::character varying])::text[])))
);


ALTER TABLE public.challans OWNER TO postgres;

--
-- Name: challans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.challans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.challans_id_seq OWNER TO postgres;

--
-- Name: challans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.challans_id_seq OWNED BY public.challans.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    customer_name character varying(150) NOT NULL,
    mobile character varying(20) NOT NULL,
    email character varying(150),
    business_name character varying(150),
    gst_number character varying(30),
    customer_type character varying(20) NOT NULL,
    address text,
    status character varying(20) DEFAULT 'Lead'::character varying NOT NULL,
    follow_up_date date,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT customers_customer_type_check CHECK (((customer_type)::text = ANY ((ARRAY['Retail'::character varying, 'Wholesale'::character varying, 'Distributor'::character varying])::text[]))),
    CONSTRAINT customers_status_check CHECK (((status)::text = ANY ((ARRAY['Lead'::character varying, 'Active'::character varying, 'Inactive'::character varying])::text[])))
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: follow_ups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follow_ups (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    note text NOT NULL,
    follow_up_date date,
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.follow_ups OWNER TO postgres;

--
-- Name: follow_ups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.follow_ups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.follow_ups_id_seq OWNER TO postgres;

--
-- Name: follow_ups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.follow_ups_id_seq OWNED BY public.follow_ups.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    product_name character varying(150) NOT NULL,
    sku character varying(100) NOT NULL,
    category character varying(100),
    unit_price numeric(12,2) NOT NULL,
    current_stock integer DEFAULT 0 NOT NULL,
    minimum_stock_quantity integer DEFAULT 0 NOT NULL,
    warehouse_location character varying(150),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_current_stock_check CHECK ((current_stock >= 0)),
    CONSTRAINT products_minimum_stock_quantity_check CHECK ((minimum_stock_quantity >= 0)),
    CONSTRAINT products_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    movement_type character varying(10) NOT NULL,
    reason character varying(255),
    created_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT stock_movements_movement_type_check CHECK (((movement_type)::text = ANY ((ARRAY['IN'::character varying, 'OUT'::character varying])::text[]))),
    CONSTRAINT stock_movements_quantity_check CHECK ((quantity > 0))
);


ALTER TABLE public.stock_movements OWNER TO postgres;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_movements_id_seq OWNER TO postgres;

--
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'SALES'::character varying, 'WAREHOUSE'::character varying, 'ACCOUNTS'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: challan_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challan_items ALTER COLUMN id SET DEFAULT nextval('public.challan_items_id_seq'::regclass);


--
-- Name: challans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challans ALTER COLUMN id SET DEFAULT nextval('public.challans_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: follow_ups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_ups ALTER COLUMN id SET DEFAULT nextval('public.follow_ups_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: challan_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challan_items (id, challan_id, product_id, product_name, sku, unit_price, quantity) FROM stdin;
1	1	1	Laptop	LAP001	50000.00	3
2	2	1	Laptop	LAP001	50000.00	3
\.


--
-- Data for Name: challans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.challans (id, challan_number, customer_id, total_quantity, status, created_by, created_at) FROM stdin;
1	CH-0001	1	3	Draft	1	2026-09-01 21:04:49.137524
2	CH-0002	1	3	Confirmed	1	2026-09-01 21:05:10.375742
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, customer_name, mobile, email, business_name, gst_number, customer_type, address, status, follow_up_date, notes, created_at, updated_at) FROM stdin;
1	Rahul Sharma	9876543210	rahul@example.com	Rahul Traders	22AAAAA0000A1Z5	Wholesale	Bhubaneswar, Odisha	Active	2026-09-10	First follow-up	2026-09-01 20:52:11.447913	2026-09-01 20:52:11.447913
\.


--
-- Data for Name: follow_ups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.follow_ups (id, customer_id, note, follow_up_date, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_name, sku, category, unit_price, current_stock, minimum_stock_quantity, warehouse_location, created_at, updated_at) FROM stdin;
1	Laptop	LAP001	Electronics	50000.00	7	3	Main Warehouse	2026-09-01 20:56:16.084746	2026-09-01 21:05:10.375742
\.


--
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_movements (id, product_id, quantity, movement_type, reason, created_by, created_at) FROM stdin;
1	1	10	IN	Opening stock	\N	2026-09-01 21:00:44.533523
2	1	3	OUT	Sales Challan CH-0002	1	2026-09-01 21:05:10.375742
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at) FROM stdin;
1	Admin	admin@fundsroom.com	$2b$10$IwHpbOQKFhy..vSTVNzCCOOVMvbHL6YRKYxBUKxqRG7AQojD4wQxK	ADMIN	2026-09-01 20:43:49.48502
\.


--
-- Name: challan_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.challan_items_id_seq', 2, true);


--
-- Name: challans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.challans_id_seq', 2, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, true);


--
-- Name: follow_ups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.follow_ups_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: challan_items challan_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challan_items
    ADD CONSTRAINT challan_items_pkey PRIMARY KEY (id);


--
-- Name: challans challans_challan_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT challans_challan_number_key UNIQUE (challan_number);


--
-- Name: challans challans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT challans_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: follow_ups follow_ups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_ups
    ADD CONSTRAINT follow_ups_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: challan_items challan_items_challan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challan_items
    ADD CONSTRAINT challan_items_challan_id_fkey FOREIGN KEY (challan_id) REFERENCES public.challans(id) ON DELETE CASCADE;


--
-- Name: challan_items challan_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challan_items
    ADD CONSTRAINT challan_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: challans challans_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT challans_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: challans challans_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.challans
    ADD CONSTRAINT challans_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: follow_ups follow_ups_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_ups
    ADD CONSTRAINT follow_ups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: follow_ups follow_ups_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follow_ups
    ADD CONSTRAINT follow_ups_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: stock_movements stock_movements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: stock_movements stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- PostgreSQL database dump complete
--

\unrestrict nIPwegifY2nsCyptVJiFGxuSHvcIhXevbryZ5cnQ2sSKKFBvOVaKBlzcYqPTw3y

