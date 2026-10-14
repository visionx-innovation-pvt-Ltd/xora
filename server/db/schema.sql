BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE, password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), slug VARCHAR(160) NOT NULL UNIQUE,
  name VARCHAR(180) NOT NULL, description TEXT NOT NULL DEFAULT '',
  category VARCHAR(100) NOT NULL DEFAULT 'Fashion', image_url TEXT,
  price_minor INTEGER NOT NULL CHECK (price_minor >= 0), currency CHAR(3) NOT NULL DEFAULT 'SAR',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0), active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS products_active_category_idx ON products(active,category);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON products(created_at DESC);
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_number VARCHAR(40) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id),
  status VARCHAR(30) NOT NULL DEFAULT 'pending_payment' CHECK (status IN ('pending_payment','paid','processing','shipped','delivered','cancelled','payment_failed')),
  payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_provider VARCHAR(30), payment_reference VARCHAR(120), payment_url TEXT,
  subtotal_minor INTEGER NOT NULL CHECK (subtotal_minor >= 0), total_minor INTEGER NOT NULL CHECK (total_minor >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'SAR', shipping_address JSONB NOT NULL,
  paid_at TIMESTAMPTZ, stock_released_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS orders_payment_reference_idx ON orders(payment_reference);
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id), product_name VARCHAR(180) NOT NULL,
  unit_price_minor INTEGER NOT NULL CHECK (unit_price_minor >= 0),
  quantity INTEGER NOT NULL CHECK (quantity BETWEEN 1 AND 20), line_total_minor INTEGER NOT NULL CHECK (line_total_minor >= 0)
);
CREATE TABLE IF NOT EXISTS payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), provider_event_id VARCHAR(160) NOT NULL UNIQUE,
  order_id UUID REFERENCES orders(id), event_type VARCHAR(80) NOT NULL, received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMIT;
