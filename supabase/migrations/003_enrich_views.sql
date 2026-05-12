-- Add enriched tracking columns to profile_views
ALTER TABLE IF EXISTS profile_views
  ADD COLUMN IF NOT EXISTS device_type TEXT DEFAULT NULL,   -- 'mobile' | 'tablet' | 'desktop'
  ADD COLUMN IF NOT EXISTS browser      TEXT DEFAULT NULL,   -- 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Opera' | 'Other'
  ADD COLUMN IF NOT EXISTS os           TEXT DEFAULT NULL,   -- 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Other'
  ADD COLUMN IF NOT EXISTS country      TEXT DEFAULT NULL,   -- ISO 2-letter country code ('FR', 'US', etc.)
  ADD COLUMN IF NOT EXISTS city         TEXT DEFAULT NULL;   -- City name approximation
