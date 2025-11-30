/*
  # Corrigir Tabela user_favorites para Suportar user_id de String
  
  1. Mudanças
    - Remove a constraint de foreign key de user_id na tabela user_favorites
    - Permite que user_id seja uma string simples sem referência para a tabela users
    
  2. Motivo
    - A aplicação usa 'demo-user-123' como user_id, que não é um UUID válido
    - Não há sistema de autenticação, então não precisamos da foreign key
*/

-- Remove a foreign key constraint da coluna user_id
ALTER TABLE user_favorites 
DROP CONSTRAINT IF EXISTS user_favorites_user_id_fkey;

-- Remove a foreign key constraint da tabela activations também
ALTER TABLE activations
DROP CONSTRAINT IF EXISTS activations_user_id_fkey;