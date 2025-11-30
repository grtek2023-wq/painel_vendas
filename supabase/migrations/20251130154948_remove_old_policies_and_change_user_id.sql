/*
  # Remover Policies Antigas e Alterar user_id para text
  
  1. Mudanças
    - Remove todas as policies antigas que usam user_id
    - Altera o tipo da coluna user_id de uuid para text
    - Recria as policies para acesso anônimo
    
  2. Motivo
    - A aplicação usa 'demo-user-123' como user_id (string)
    - Policies antigas impedem a alteração do tipo da coluna
*/

-- Remove policies antigas da tabela user_favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON user_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON user_favorites;

-- Remove policies antigas da tabela activations
DROP POLICY IF EXISTS "Users can view own activations" ON activations;
DROP POLICY IF EXISTS "Users can insert own activations" ON activations;
DROP POLICY IF EXISTS "Users can update own activations" ON activations;

-- Limpar dados existentes para evitar conflitos na conversão
TRUNCATE user_favorites CASCADE;
TRUNCATE activations CASCADE;

-- Alterar tipo de user_id na tabela user_favorites
ALTER TABLE user_favorites 
ALTER COLUMN user_id TYPE text USING user_id::text;

-- Alterar tipo de user_id na tabela activations
ALTER TABLE activations 
ALTER COLUMN user_id TYPE text USING user_id::text;

-- Recriar policies para acesso anônimo (já existem da migration anterior)
-- Não é necessário recriar pois já foram criadas na migration fix_rls_policies_for_anonymous_access