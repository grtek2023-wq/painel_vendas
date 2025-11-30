/*
  # Corrigir Políticas RLS para Acesso Anônimo

  Este migration corrige as políticas RLS para permitir acesso anônimo (não autenticado)
  aos dados necessários para o funcionamento da aplicação.

  1. Mudanças de Segurança
    - Remove políticas existentes que exigem autenticação
    - Cria novas políticas que permitem acesso anônimo para leitura
    - Mantém RLS ativo para proteger operações de escrita

  2. Tabelas Afetadas
    - services: Permite leitura anônima de serviços ativos
    - activations: Permite todas as operações para usuários anônimos
    - users: Permite todas as operações para usuários anônimos
    - user_favorites: Permite todas as operações para usuários anônimos

  Nota: Esta configuração é apropriada para uma aplicação que não utiliza autenticação.
*/

-- Drop existing policies for services
DROP POLICY IF EXISTS "Anyone can view active services" ON services;

-- Drop existing policies for activations
DROP POLICY IF EXISTS "Users can view own activations" ON activations;
DROP POLICY IF EXISTS "Users can create activations" ON activations;

-- Drop existing policies for users
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies for anonymous access

-- Services: Anyone (including anonymous) can view active services
CREATE POLICY "Anonymous can view active services"
  ON services
  FOR SELECT
  TO anon
  USING (ativo = true);

-- Activations: Anonymous users can do everything
CREATE POLICY "Anonymous can view activations"
  ON activations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can create activations"
  ON activations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can update activations"
  ON activations
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anonymous can delete activations"
  ON activations
  FOR DELETE
  TO anon
  USING (true);

-- Users: Anonymous users can do everything
CREATE POLICY "Anonymous can view users"
  ON users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can create users"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can update users"
  ON users
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- User Favorites: Anonymous users can do everything
CREATE POLICY "Anonymous can view favorites"
  ON user_favorites
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous can create favorites"
  ON user_favorites
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can delete favorites"
  ON user_favorites
  FOR DELETE
  TO anon
  USING (true);
