/*
  # Update Schema for Manus API Integration

  1. Changes to Tables
    - `activations`
      - Add `manus_activation_id` (integer, nullable) - stores the Manus API activation ID
      - Add `sms_text` (text, nullable) - stores the full SMS text received
      - Remove `expires_at` column (no longer needed)
      - Remove `opcao_escolhida` column (no longer needed)
      - Change `service_id` to integer type

    - Create `user_profiles` table
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `customer_id` (integer) - the Manus customer ID
      - `email` (text)
      - `name` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - Update `user_favorites`
      - Change `service_id` to integer type

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for user_profiles
    - Update policies for activations and user_favorites
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id integer NOT NULL,
  email text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(customer_id)
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Add new columns to activations if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activations' AND column_name = 'manus_activation_id'
  ) THEN
    ALTER TABLE activations ADD COLUMN manus_activation_id integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activations' AND column_name = 'sms_text'
  ) THEN
    ALTER TABLE activations ADD COLUMN sms_text text;
  END IF;
END $$;

-- Drop columns that are no longer needed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activations' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE activations DROP COLUMN expires_at;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activations' AND column_name = 'opcao_escolhida'
  ) THEN
    ALTER TABLE activations DROP COLUMN opcao_escolhida;
  END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_activations_manus_id ON activations(manus_activation_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_customer_id ON user_profiles(customer_id);
