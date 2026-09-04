CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(50) NOT NULL UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  email varchar(120) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE cicoms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  code varchar(30) NOT NULL UNIQUE,
  region varchar(80), municipality varchar(80), address varchar(250),
  responsible varchar(120), phone varchar(30), email varchar(120),
  status varchar(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE categories (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name varchar(80) NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now());

CREATE TABLE materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code varchar(30) NOT NULL UNIQUE, name varchar(120) NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL, unit varchar(30) NOT NULL,
  current_stock numeric(12,2) NOT NULL CHECK (current_stock >= 0), minimum_stock numeric(12,2) NOT NULL CHECK (minimum_stock >= 0),
  status varchar(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED')),
  description text, notes text, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE solicitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), number varchar(30) NOT NULL UNIQUE,
  cicom_id uuid NOT NULL REFERENCES cicoms(id) ON DELETE RESTRICT, requester varchar(120) NOT NULL,
  priority varchar(20) NOT NULL DEFAULT 'NORMAL' CHECK (priority IN ('LOW', 'NORMAL', 'HIGH', 'URGENT')),
  status varchar(30) NOT NULL DEFAULT 'REQUESTED', notes text,
  created_by_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE solicitation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), solicitation_id uuid NOT NULL REFERENCES solicitations(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES materials(id) ON DELETE RESTRICT, requested_amount numeric(12,2) NOT NULL CHECK (requested_amount > 0),
  UNIQUE (solicitation_id, material_id)
);

CREATE TABLE deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sequence bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  number varchar(30) NOT NULL UNIQUE, solicitation_id uuid NOT NULL REFERENCES solicitations(id) ON DELETE RESTRICT,
  cicom_id uuid NOT NULL REFERENCES cicoms(id) ON DELETE RESTRICT, attendant_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status varchar(30) NOT NULL, notes text, delivered_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE delivery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), delivery_id uuid NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  solicitation_item_id uuid NOT NULL REFERENCES solicitation_items(id) ON DELETE RESTRICT,
  material_id uuid NOT NULL REFERENCES materials(id) ON DELETE RESTRICT, delivered_amount numeric(12,2) NOT NULL CHECK (delivered_amount > 0),
  UNIQUE (delivery_id, solicitation_item_id)
);

CREATE TABLE pending_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), solicitation_item_id uuid NOT NULL UNIQUE REFERENCES solicitation_items(id) ON DELETE CASCADE,
  pending_amount numeric(12,2) NOT NULL CHECK (pending_amount >= 0), resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action varchar(80) NOT NULL, entity_type varchar(80) NOT NULL, entity_id uuid NOT NULL,
  old_value jsonb, new_value jsonb, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type varchar(40) NOT NULL, title varchar(150) NOT NULL, message text NOT NULL, read_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX cicoms_search_idx ON cicoms (name, code, status);
CREATE INDEX deliveries_cicom_date_idx ON deliveries (cicom_id, delivered_at DESC);
CREATE INDEX solicitations_cicom_status_idx ON solicitations (cicom_id, status);
CREATE INDEX audit_logs_entity_idx ON audit_logs (entity_type, entity_id, created_at DESC);
