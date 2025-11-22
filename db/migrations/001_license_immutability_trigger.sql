-- Migration: Add immutable trigger to prevent license reuse
-- This trigger ensures once a license is redeemed, it can NEVER be reset
-- Created: 2025-11-22
-- Purpose: Enforce single-use guarantee at database level

-- Create the trigger function
CREATE OR REPLACE FUNCTION prevent_license_reuse()
RETURNS TRIGGER AS $$
BEGIN
  -- If the license was previously used (OLD.used = true), prevent it from being unmarked
  IF OLD.used = true AND NEW.used = false THEN
    RAISE EXCEPTION 'Cannot reset used flag on redeemed license key: %', OLD.license_key;
  END IF;
  
  -- If usedAt was previously set, prevent it from being cleared
  IF OLD.used_at IS NOT NULL AND NEW.used_at IS NULL THEN
    RAISE EXCEPTION 'Cannot clear usedAt timestamp on redeemed license key: %', OLD.license_key;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (idempotent)
DROP TRIGGER IF EXISTS enforce_license_single_use ON license_keys;

-- Create the trigger on the license_keys table
CREATE TRIGGER enforce_license_single_use
  BEFORE UPDATE ON license_keys
  FOR EACH ROW
  EXECUTE FUNCTION prevent_license_reuse();

-- Verify trigger was created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'enforce_license_single_use'
  ) THEN
    RAISE EXCEPTION 'Failed to create license immutability trigger';
  END IF;
END $$;
