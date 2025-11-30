/*
  # Add PIN column to user_profiles

  1. Changes
    - Add `pin` column to store the Manus customer PIN
    - PIN is used to query customer data from Manus API

  2. Notes
    - PIN is returned by Manus API when creating a customer
    - customer_id remains for backward compatibility
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'pin'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN pin INTEGER;
  END IF;
END $$;
