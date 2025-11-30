-- Create Initial Schema for Meu Número Virtual Dashboard
-- This migration creates tables for users, services, favorites, and activations

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pin text UNIQUE NOT NULL,
  saldo numeric DEFAULT 0,
  idioma text DEFAULT 'pt-BR',
  pais_preferido text DEFAULT 'BR',
  operadora_preferida text DEFAULT 'aleatoria',
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  logo_url text,
  preco_opcao1 numeric NOT NULL,
  preco_opcao2 numeric NOT NULL,
  preco_opcao3 numeric NOT NULL,
  ativo boolean DEFAULT true,
  categoria text,
  created_at timestamptz DEFAULT now()
);

-- 3. User favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, service_id)
);

-- 4. Activations table
CREATE TABLE IF NOT EXISTS activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  numero text NOT NULL,
  status text DEFAULT 'aguardando',
  codigo_sms text,
  minutos_restantes integer DEFAULT 10,
  preco_pago numeric NOT NULL,
  opcao_escolhida integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT now() + interval '10 minutes',
  completed_at timestamptz
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_service_id ON user_favorites(service_id);
CREATE INDEX IF NOT EXISTS idx_activations_user_id ON activations(user_id);
CREATE INDEX IF NOT EXISTS idx_activations_status ON activations(status);
CREATE INDEX IF NOT EXISTS idx_activations_created_at ON activations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for services table (public read)
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO authenticated
  USING (ativo = true);

-- RLS Policies for user_favorites table
CREATE POLICY "Users can view own favorites"
  ON user_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON user_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON user_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for activations table
CREATE POLICY "Users can view own activations"
  ON activations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activations"
  ON activations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activations"
  ON activations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Insert sample services
INSERT INTO services (nome, logo_url, preco_opcao1, preco_opcao2, preco_opcao3, ativo, categoria) VALUES
  ('WhatsApp', 'https://img.icons8.com/color/48/whatsapp--v1.png', 2.90, 4.00, 5.00, true, 'messaging'),
  ('Instagram', 'https://img.icons8.com/color/48/instagram-new.png', 2.90, 4.00, 5.00, true, 'social'),
  ('Amazon', 'https://img.icons8.com/color/48/amazon.png', 3.50, 5.00, 7.00, true, 'ecommerce'),
  ('PayPal', 'https://img.icons8.com/color/48/paypal.png', 3.00, 4.50, 6.00, true, 'finance'),
  ('Microsoft', 'https://img.icons8.com/color/48/microsoft.png', 3.00, 4.50, 6.00, true, 'tech'),
  ('Telegram', 'https://img.icons8.com/color/48/telegram-app.png', 2.50, 3.50, 5.00, true, 'messaging'),
  ('Facebook', 'https://img.icons8.com/color/48/facebook.png', 2.90, 4.00, 5.00, true, 'social'),
  ('Google', 'https://img.icons8.com/color/48/google-logo.png', 3.00, 4.50, 6.00, true, 'tech')
ON CONFLICT DO NOTHING;